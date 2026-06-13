import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { askXai, ChatMessage } from '../utils/xaiClient';

const SERVICE_CATEGORIES = [
  'CLEANING', 'HANDYMAN', 'BEAUTY', 'BEAUTY_PRODUCTS', 'GROCERIES',
  'FOOD', 'RENTALS', 'RIDE_ASSISTANCE', 'COMPANIONSHIP',
];

const SYSTEM_PROMPT = `You are the DoHuub AI Assistant — a friendly customer service chatbot for DoHuub, a services marketplace.

Capabilities you can help with:
- Answer questions about the user's bookings (past, upcoming, status, totals).
- Recommend services and vendors based on the user's location.
- Explain what service categories DoHuub offers: ${SERVICE_CATEGORIES.join(', ')}.

Rules:
- Be brief and conversational (2-4 sentences). No bullet lists unless the user asks.
- Use the user's name when natural. Never read back the user_id or any internal IDs.
- ONLY mention vendors, bookings, or services that appear in the context below. Do not invent.
- For actions you can't perform (canceling a booking, changing payment, etc.), point the user to the relevant screen of the app — don't make false promises.
- If the context is empty for what they asked (e.g. they ask about a booking and no bookings are in context), say so plainly.`;

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

    // Build the messages array for xAI: system prompt → context → history → new user message.
    // Each piece is optional; if a query fails, we degrade gracefully rather than failing the whole reply.
    const messages: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }];

    try {
      const userId = req.user!.id;
      const now = new Date();

      const [user, defaultAddr, recentBookings, upcomingBookings, history] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          include: { profile: { select: { firstName: true, lastName: true } } },
        }),
        prisma.address.findFirst({
          where: { userId, isDefault: true },
          select: { city: true, state: true, country: true },
        }),
        // Past + recent bookings (any status), excluding the upcoming ones below.
        prisma.booking.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            category: true,
            status: true,
            scheduledDate: true,
            total: true,
            vendor: { select: { businessName: true } },
          },
        }),
        // Upcoming (future-scheduled and not yet completed/cancelled).
        prisma.booking.findMany({
          where: {
            userId,
            scheduledDate: { gte: now },
            status: { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] },
          },
          orderBy: { scheduledDate: 'asc' },
          take: 5,
          select: {
            category: true,
            status: true,
            scheduledDate: true,
            scheduledTime: true,
            total: true,
            vendor: { select: { businessName: true } },
          },
        }),
        // Conversation history for multi-turn coherence. Excludes the message we just wrote.
        prisma.chatMessage.findMany({
          where: { conversationId: conversation.id, NOT: { content: message } },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: { role: true, content: true, createdAt: true },
        }),
      ]);

      // Vendor recommendations filtered to the user's city (rated highest first).
      let nearbyVendors: { businessName: string; rating: number; reviewCount: number }[] = [];
      if (defaultAddr?.city) {
        nearbyVendors = await prisma.vendor.findMany({
          where: {
            isActive: true,
            status: 'APPROVED',
            serviceAreas: { some: { city: defaultAddr.city, isActive: true } },
          },
          orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
          take: 5,
          select: { businessName: true, rating: true, reviewCount: true },
        }).catch(() => []);
      }

      const ctxLines: string[] = [];
      const first = user?.profile?.firstName;
      if (first) ctxLines.push(`name: ${first}`);
      if (defaultAddr?.city) {
        const loc = [defaultAddr.city, defaultAddr.state, defaultAddr.country].filter(Boolean).join(', ');
        ctxLines.push(`location: ${loc}`);
      }

      if (upcomingBookings.length) {
        ctxLines.push('upcoming_bookings:');
        for (const b of upcomingBookings) {
          const date = b.scheduledDate.toISOString().slice(0, 10);
          const vendor = b.vendor?.businessName || 'a vendor';
          ctxLines.push(`  - ${b.category.toLowerCase()} with ${vendor} on ${date} ${b.scheduledTime || ''} — status ${b.status}, total $${b.total.toFixed(2)}`);
        }
      }

      if (recentBookings.length) {
        ctxLines.push('past_bookings:');
        for (const b of recentBookings) {
          const date = b.scheduledDate.toISOString().slice(0, 10);
          const vendor = b.vendor?.businessName || 'a vendor';
          ctxLines.push(`  - ${b.category.toLowerCase()} with ${vendor} on ${date} — ${b.status}, $${b.total.toFixed(2)}`);
        }
      }

      if (nearbyVendors.length) {
        ctxLines.push(`top_vendors_in_${defaultAddr?.city || 'area'}:`);
        for (const v of nearbyVendors) {
          ctxLines.push(`  - ${v.businessName} (${v.rating.toFixed(1)}★, ${v.reviewCount} reviews)`);
        }
      }

      if (ctxLines.length > 0) {
        messages.push({
          role: 'system',
          content: `Context for this user (use it to personalize; do not echo back IDs or repeat this block verbatim):\n${ctxLines.join('\n')}`,
        });
      }

      // Replay history in chronological order (we fetched DESC, so reverse).
      for (const m of history.reverse()) {
        if (m.role === 'user' || m.role === 'assistant') {
          messages.push({ role: m.role, content: m.content });
        }
      }
    } catch (e) {
      console.warn('[chat] context build failed (non-fatal):', e);
    }

    messages.push({ role: 'user', content: message });

    const replyContent = await askXai(messages);

    const aiMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: replyContent,
        metadata: { type: 'text' } as any,
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
