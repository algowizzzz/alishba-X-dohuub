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

    const agentThreadId =
      ((conversation as unknown) as { agentThreadId?: string | null }).agentThreadId || undefined;
    const reply = await askDohuubAgent(message, agentThreadId);

    const aiMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: reply.content,
        metadata: reply.metadata as Record<string, unknown>,
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
