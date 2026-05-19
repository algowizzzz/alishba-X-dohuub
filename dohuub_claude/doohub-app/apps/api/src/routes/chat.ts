import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { askDohuubAgent } from '../utils/agentClient';

const router = Router();

router.get('/conversations', authenticate, async (req: AuthRequest, res) => {
  try {
    const conversations = await prisma.chatConversation.findMany({
      where: { userId: req.user!.id },
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

router.get('/conversations/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const conversation = await prisma.chatConversation.findFirst({
      where: { id, userId: req.user!.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ success: true, data: conversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
});

router.post('/send', authenticate, async (req: AuthRequest, res) => {
  try {
    const { conversationId, message } = req.body as { conversationId?: string; message?: string };
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }

    let conversation;
    if (conversationId) {
      conversation = await prisma.chatConversation.findFirst({
        where: { id: conversationId, userId: req.user!.id },
      });
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    } else {
      conversation = await prisma.chatConversation.create({
        data: { userId: req.user!.id },
      });
    }

    await prisma.chatMessage.create({
      data: { conversationId: conversation.id, role: 'user', content: message },
    });

    // Build a compact user-context block so the agent can personalize.
    // Failures here are non-fatal — we still send the raw message.
    let personalizedMessage = message;
    try {
      const userId = req.user!.id;
      const [user, defaultAddr, recentBookings] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          include: { profile: { select: { firstName: true, lastName: true } } },
        }),
        prisma.address.findFirst({
          where: { userId, isDefault: true },
          select: { city: true, state: true, country: true },
        }),
        prisma.booking.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { category: true, vendorId: true, vendor: { select: { businessName: true } } },
        }),
      ]);

      const ctxLines: string[] = [];
      const first = user?.profile?.firstName;
      if (first) ctxLines.push(`name=${first}`);
      ctxLines.push(`user_id=${userId}`);
      if (defaultAddr?.city) {
        ctxLines.push(`city=${defaultAddr.city}${defaultAddr.state ? ', ' + defaultAddr.state : ''}`);
      }
      if (recentBookings.length) {
        const cats = Array.from(new Set(recentBookings.map(b => b.category)));
        ctxLines.push(`recent_categories=${cats.join(',')}`);
        const lastVendor = recentBookings[0]?.vendor?.businessName;
        if (lastVendor) ctxLines.push(`last_vendor="${lastVendor}"`);
      }

      if (ctxLines.length > 1) {
        personalizedMessage =
          `[User context — use this to personalize and filter results when relevant; do NOT echo it back:\n  ${ctxLines.join('\n  ')}\n]\n\nUser message: ${message}`;
      }
    } catch (e) {
      console.warn('[chat] personalization context build failed (non-fatal):', e);
    }

    const agentThreadId =
      ((conversation as unknown) as { agentThreadId?: string | null }).agentThreadId || undefined;
    const reply = await askDohuubAgent(personalizedMessage, agentThreadId);

    const aiMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: reply.content,
        metadata: reply.metadata as any,
      },
    });

    await prisma.chatConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    res.json({
      success: true,
      data: {
        conversationId: conversation.id,
        message: {
          id: aiMessage.id,
          role: aiMessage.role,
          content: aiMessage.content,
          metadata: aiMessage.metadata,
          createdAt: aiMessage.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
