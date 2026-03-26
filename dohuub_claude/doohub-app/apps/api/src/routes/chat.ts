import { Router } from 'express';
import { prisma } from '@doohub/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// AI Chat System Prompt
const SYSTEM_PROMPT = `You are DoHuub's AI assistant, a helpful digital concierge for a multi-service lifestyle marketplace. 

DoHuub offers six service categories:
1. Cleaning Services - Deep cleaning, laundry, office cleaning
2. Handyman Services - Plumbing, electrical, repairs, installations
3. Groceries & Food - Fresh produce, meals, grocery delivery
4. Beauty Services - Makeup, hair, nails, wellness
5. Rental Properties - Short and long-term property rentals
6. Caregiving Services - Ride assistance, companionship support

Your role is to:
- Help users find and book services
- Answer questions about available services
- Provide service recommendations based on user needs
- Guide users through the booking process
- Be friendly, helpful, and concise

When recommending services, always mention that DoHuub Official (Powered by DoHuub) services are premium, platform-verified options.`;

// Get conversations
router.get('/conversations', authenticate, async (req: AuthRequest, res) => {
  try {
    const conversations = await prisma.chatConversation.findMany({
      where: { userId: req.user!.id },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// Get conversation messages
router.get('/conversations/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const conversation = await prisma.chatConversation.findFirst({
      where: { id, userId: req.user!.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
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

// Send message
router.post('/send', authenticate, async (req: AuthRequest, res) => {
  try {
    const { conversationId, message } = req.body;

    let conversation;

    // Create or get conversation
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

    // Save user message
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
      },
    });

    // Generate AI response
    const aiResponse = await generateAIResponse(message);

    // Save AI message
    const aiMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse.content,
        metadata: aiResponse.metadata,
      },
    });

    // Update conversation timestamp
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

// AI Response Generator (simplified - would use OpenAI in production)
async function generateAIResponse(userMessage: string) {
  const msg = userMessage.toLowerCase();

  // Cleaning services
  if (msg.includes('clean') || msg.includes('cleaning') || msg.includes('laundry')) {
    const listings = await prisma.cleaningListing.findMany({
      where: { status: 'ACTIVE' },
      include: { vendor: true },
      orderBy: [{ vendor: { isMichelle: 'desc' } }, { vendor: { rating: 'desc' } }],
      take: 3,
    });

    return {
      content: "I found some great cleaning services for you! Here are the top-rated options:",
      metadata: {
        type: 'service-cards',
        category: 'CLEANING',
        services: listings.map(l => ({
          id: l.id,
          name: l.title,
          vendor: l.vendor.businessName,
          rating: l.vendor.rating,
          reviews: l.vendor.reviewCount,
          price: `$${l.basePrice}`,
          isMichelle: l.vendor.isMichelle,
        })),
      },
    };
  }

  // Handyman services
  if (msg.includes('handyman') || msg.includes('repair') || msg.includes('fix') || msg.includes('plumb') || msg.includes('electric')) {
    const listings = await prisma.handymanListing.findMany({
      where: { status: 'ACTIVE' },
      include: { vendor: true },
      orderBy: [{ vendor: { isMichelle: 'desc' } }, { vendor: { rating: 'desc' } }],
      take: 3,
    });

    return {
      content: "Here are the best handyman services available:",
      metadata: {
        type: 'service-cards',
        category: 'HANDYMAN',
        services: listings.map(l => ({
          id: l.id,
          name: l.title,
          vendor: l.vendor.businessName,
          rating: l.vendor.rating,
          reviews: l.vendor.reviewCount,
          price: `$${l.basePrice}/hr`,
          isMichelle: l.vendor.isMichelle,
        })),
      },
    };
  }

  // Beauty services
  if (msg.includes('beauty') || msg.includes('hair') || msg.includes('nail') || msg.includes('makeup') || msg.includes('salon')) {
    const listings = await prisma.beautyListing.findMany({
      where: { status: 'ACTIVE' },
      include: { vendor: true },
      orderBy: [{ vendor: { isMichelle: 'desc' } }, { vendor: { rating: 'desc' } }],
      take: 3,
    });

    return {
      content: "Here are popular beauty services near you:",
      metadata: {
        type: 'service-cards',
        category: 'BEAUTY',
        services: listings.map(l => ({
          id: l.id,
          name: l.title,
          vendor: l.vendor.businessName,
          rating: l.vendor.rating,
          reviews: l.vendor.reviewCount,
          price: `$${l.basePrice}`,
          isMichelle: l.vendor.isMichelle,
        })),
      },
    };
  }

  // Groceries/Food
  if (msg.includes('food') || msg.includes('grocer') || msg.includes('eat') || msg.includes('hungry')) {
    return {
      content: "I can help you with food and grocery delivery! What are you looking for?",
      metadata: {
        type: 'category-chips',
        categories: ['Fresh Produce', 'Dairy & Eggs', 'Bakery', 'Snacks', 'Beverages', 'Ready-to-Eat'],
      },
    };
  }

  // Rentals
  if (msg.includes('rent') || msg.includes('apartment') || msg.includes('house') || msg.includes('stay') || msg.includes('property')) {
    return {
      content: "I can help you find rental properties! What type of accommodation are you looking for?",
      metadata: {
        type: 'category-chips',
        categories: ['Apartments', 'Houses', 'Condos', 'Studios', 'Short-term', 'Long-term'],
      },
    };
  }

  // Caregiving
  if (msg.includes('ride') || msg.includes('transport') || msg.includes('caregiv') || msg.includes('companion') || msg.includes('senior') || msg.includes('elderly')) {
    const listings = await prisma.caregivingListing.findMany({
      where: { status: 'ACTIVE' },
      include: { vendor: true },
      orderBy: [{ vendor: { isMichelle: 'desc' } }, { vendor: { rating: 'desc' } }],
      take: 3,
    });

    return {
      content: "Here are our caregiving and transportation services:",
      metadata: {
        type: 'service-cards',
        category: 'CAREGIVING',
        services: listings.map(l => ({
          id: l.id,
          name: l.title,
          vendor: l.vendor.businessName,
          rating: l.vendor.rating,
          reviews: l.vendor.reviewCount,
          price: `$${l.basePrice}`,
          isMichelle: l.vendor.isMichelle,
        })),
      },
    };
  }

  // Greeting
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('help')) {
    return {
      content: "Hello! I'm your DoHuub assistant. I can help you find and book services. What can I assist you with today?",
      metadata: {
        type: 'category-chips',
        categories: ['Cleaning Services', 'Handyman Services', 'Groceries & Food', 'Beauty Services', 'Rentals', 'Caregiving'],
      },
    };
  }

  // Default response
  return {
    content: "I can help you with various services. Here are our main categories:",
    metadata: {
      type: 'category-chips',
      categories: ['Cleaning Services', 'Handyman Services', 'Groceries & Food', 'Beauty Services', 'Rentals', 'Caregiving'],
    },
  };
}

export default router;

