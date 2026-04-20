import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Circle, Path, Line } from 'react-native-svg';
// Boss wireframe colors - hardcoded
const colors = {
  background: '#F0F7FF',
  primary: '#2E7AD9',
  text: { primary: '#1E293B', secondary: '#64748B', muted: '#94A3B8', inverse: '#FFFFFF' },
  surface: '#FFFFFF',
  secondary: '#E8F1FC',
  border: { light: 'rgba(46, 122, 217, 0.1)' },
};
const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
const fontSize = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24 };
const borderRadius = { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 };

function BotIcon({ size = 48, color = '#2E7AD9' }: { size?: number; color?: string }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      {/* Antenna */}
      <Line x1="12" y1="2" x2="12" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="12" cy="2" r="1" fill={color} />
      {/* Head */}
      <Rect x="3" y="5" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5" />
      {/* Eyes */}
      <Rect x="7" y="9" width="3" height="3" rx="0.5" fill={color} />
      <Rect x="14" y="9" width="3" height="3" rx="0.5" fill={color} />
      {/* Mouth */}
      <Line x1="9" y1="14" x2="15" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Body/neck */}
      <Line x1="8" y1="18" x2="8" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="16" y1="18" x2="16" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="8" y1="22" x2="16" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    type?: 'text' | 'service-cards' | 'category-chips';
    services?: ServiceCard[];
    categories?: string[];
  };
}

interface ServiceCard {
  id: number;
  name: string;
  vendor: string;
  rating: number;
  reviews: number;
  price: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CATEGORY_ROUTES: Record<string, string> = {
  'Cleaning Services': '/(tabs)/services/cleaning',
  'Handyman Services': '/(tabs)/services/handyman',
  'Beauty Services': '/(tabs)/services/beauty',
  'Beauty Services and Products': '/(tabs)/services/beauty',
  'Groceries & Food': '/(tabs)/services/groceries',
  'Rentals': '/(tabs)/services/rentals',
  'Caregiving': '/(tabs)/services/caregiving',
  'Fresh Produce': '/(tabs)/services/groceries',
  'Dairy & Eggs': '/(tabs)/services/groceries',
  'Bakery': '/(tabs)/services/groceries',
  'Snacks': '/(tabs)/services/groceries',
  'Beverages': '/(tabs)/services/groceries',
  'Ready-to-Eat': '/(tabs)/services/groceries',
  'Ride Assistance': '/(tabs)/services/caregiving',
  'Companionship Support': '/(tabs)/services/caregiving',
  'Medical Transport': '/(tabs)/services/caregiving',
  'Airport Transfer': '/(tabs)/services/caregiving',
  'Apartments': '/(tabs)/services/rentals',
  'Houses': '/(tabs)/services/rentals',
  'Condos': '/(tabs)/services/rentals',
  'Studios': '/(tabs)/services/rentals',
  'Shared Rooms': '/(tabs)/services/rentals',
};

function processMessage(text: string): Message {
  const lower = text.toLowerCase();

  if (lower.includes('clean')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "I found 3 highly-rated cleaning services available in your area:",
      metadata: {
        type: 'service-cards',
        services: [
          { id: 1, name: 'Deep House Cleaning', vendor: 'DoHuub Official Store', rating: 4.9, reviews: 234, price: '$150', icon: 'home' },
          { id: 2, name: 'Office Cleaning', vendor: 'Sparkle Clean Co.', rating: 4.8, reviews: 189, price: '$200', icon: 'business' },
          { id: 3, name: 'Apartment Cleaning', vendor: 'Fresh Start Cleaning', rating: 4.7, reviews: 156, price: '$120', icon: 'water' },
        ],
      },
    };
  }
  if (lower.includes('handyman') || lower.includes('repair') || lower.includes('plumb') || lower.includes('electric') || lower.includes('fix')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Here are the best handyman services I found for you:",
      metadata: {
        type: 'service-cards',
        services: [
          { id: 1, name: 'Plumbing Repair', vendor: 'DoHuub Official', rating: 4.9, reviews: 210, price: '$85/hr', icon: 'build' },
          { id: 2, name: 'Electrical Work', vendor: 'Home Repair Masters', rating: 4.8, reviews: 175, price: '$95/hr', icon: 'flash' },
          { id: 3, name: 'Furniture Assembly', vendor: 'Expert Handyman Services', rating: 4.7, reviews: 142, price: '$65', icon: 'construct' },
        ],
      },
    };
  }
  if (lower.includes('beauty') || lower.includes('hair') || lower.includes('nail') || lower.includes('makeup') || lower.includes('salon')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Here are popular beauty services near you:",
      metadata: {
        type: 'service-cards',
        services: [
          { id: 1, name: 'Hair Styling & Cut', vendor: 'DoHuub Official', rating: 4.9, reviews: 320, price: '$45-80', icon: 'cut' },
          { id: 2, name: 'Manicure & Pedicure', vendor: 'Glamour Studio', rating: 4.8, reviews: 256, price: '$35-60', icon: 'color-palette' },
          { id: 3, name: 'Makeup Services', vendor: 'Beauty on Demand', rating: 4.7, reviews: 198, price: '$60-120', icon: 'sparkles' },
        ],
      },
    };
  }
  if (lower.includes('grocer') || lower.includes('food') || lower.includes('produce') || lower.includes('order')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "I can help you with food delivery and groceries. What would you like to order?",
      metadata: { type: 'category-chips', categories: ['Fresh Produce', 'Dairy & Eggs', 'Bakery', 'Snacks', 'Beverages', 'Ready-to-Eat'] },
    };
  }
  if (lower.includes('rent') || lower.includes('apartment') || lower.includes('house') || lower.includes('property')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "I can help you find rental properties. What type of property are you looking for?",
      metadata: { type: 'category-chips', categories: ['Apartments', 'Houses', 'Condos', 'Studios', 'Shared Rooms'] },
    };
  }
  if (lower.includes('care') || lower.includes('companion') || lower.includes('ride') || lower.includes('elder') || lower.includes('senior') || lower.includes('transport')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "I can help you with transportation and caregiving services. Which service do you need?",
      metadata: { type: 'category-chips', categories: ['Ride Assistance', 'Companionship Support', 'Medical Transport', 'Airport Transfer'] },
    };
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Hello! I'm here to help you with all DoHuub services. What can I assist you with today?",
      metadata: { type: 'category-chips', categories: ['Cleaning Services', 'Handyman Services', 'Groceries & Food', 'Beauty Services', 'Rentals', 'Caregiving'] },
    };
  }
  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: "I can help you with various services. Here are our main categories:",
    metadata: { type: 'category-chips', categories: ['Cleaning Services', 'Handyman Services', 'Groceries & Food', 'Beauty Services', 'Rentals', 'Caregiving'] },
  };
}

const SUGGESTED_PROMPTS = [
  'Find cleaning service',
  'Book handyman',
  'Order groceries',
  'Beauty services near me',
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your DoHuub assistant. How can I help you today?",
      metadata: { type: 'text' },
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const aiMessage = processMessage(text);
    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your DoHuub assistant. How can I help you today?",
        metadata: { type: 'text' },
      },
    ]);
  };

  const handleCategoryPress = (category: string) => {
    const route = CATEGORY_ROUTES[category];
    if (route) {
      router.push(route as any);
    }
  };

  const handleServicePress = (service: ServiceCard) => {
    const name = service.name.toLowerCase();
    if (name.includes('clean') || name.includes('apartment')) {
      router.push('/(tabs)/services/cleaning' as any);
    } else if (name.includes('plumb') || name.includes('electric') || name.includes('furniture')) {
      router.push('/(tabs)/services/handyman' as any);
    } else if (name.includes('hair') || name.includes('nail') || name.includes('makeup')) {
      router.push('/(tabs)/services/beauty' as any);
    } else {
      router.push('/(tabs)' as any);
    }
  };

  const renderWelcome = () => (
    <View style={styles.welcomeContainer}>
      <View style={styles.welcomeAvatar}>
        <BotIcon size={48} color={colors.primary} />
      </View>
      <Text style={styles.welcomeText}>How can I help you today?</Text>
      <View style={styles.suggestedPrompts}>
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <TouchableOpacity
            key={index}
            style={styles.promptChip}
            onPress={() => sendMessage(prompt)}
          >
            <Text style={styles.promptText}>{prompt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <View
        style={[
          styles.messageBubble,
          item.role === 'user' ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        {item.role === 'assistant' && (
          <View style={styles.botAvatar}>
            <BotIcon size={20} color={colors.primary} />
          </View>
        )}
        <View
          style={[
            styles.bubbleContent,
            item.role === 'user' ? styles.userBubbleContent : styles.assistantBubbleContent,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              item.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
            ]}
          >
            {item.content}
          </Text>
        </View>
        {item.role === 'user' && (
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.userAvatar}
          />
        )}
      </View>

      {/* Service Cards */}
      {item.metadata?.type === 'service-cards' && item.metadata.services && (
        <View style={styles.serviceCards}>
          {item.metadata.services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => handleServicePress(service)}
            >
              <View style={styles.serviceCardContent}>
                <View style={styles.serviceIcon}>
                  <Ionicons name={service.icon} size={24} color={colors.text.primary} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceVendor}>{service.vendor}</Text>
                  <View style={styles.serviceFooter}>
                    <Text style={styles.serviceRating}>★ {service.rating}</Text>
                    <Text style={styles.serviceReviews}>({service.reviews} reviews)</Text>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => handleServicePress(item.metadata!.services![0])}
          >
            <Text style={styles.viewAllText}>View All Services</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Category Chips */}
      {item.metadata?.type === 'category-chips' && item.metadata.categories && (
        <View style={styles.categoryChips}>
          {item.metadata.categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryChip}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={styles.categoryChipText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.botAvatar}>
        <BotIcon size={20} color={colors.primary} />
      </View>
      <View style={styles.typingBubble}>
        <View style={styles.typingDots}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.typingDot} />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant</Text>
        <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
          <Text style={styles.newChatText}>New Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome or Messages */}
      {messages.length === 1 ? (
        renderWelcome()
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages.slice(1)}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListFooterComponent={isTyping ? renderTypingIndicator : null}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything..."
          placeholderTextColor={colors.text.muted}
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={styles.micButton}>
          <Ionicons name="mic" size={24} color={colors.text.muted} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={input.trim() ? '#FFFFFF' : colors.text.muted}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  newChatButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.2)',
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
  },
  newChatText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '500',
  },
  // Welcome area
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  welcomeAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  welcomeText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  suggestedPrompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  promptChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.1)',
  },
  promptText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },
  // Messages
  messagesList: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  messageContainer: {
    marginBottom: spacing.md,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  assistantBubble: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border.light,
  },
  bubbleContent: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: 16,
  },
  userBubbleContent: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  assistantBubbleContent: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.08)',
  },
  messageText: {
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: colors.text.primary,
  },
  // Service cards
  serviceCards: {
    marginLeft: 52,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  serviceCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  serviceCardContent: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  serviceVendor: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  serviceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  serviceRating: {
    fontSize: fontSize.sm,
    color: '#F59E0B',
  },
  serviceReviews: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  servicePrice: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 'auto',
  },
  viewAllButton: {
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
  },
  // Category chips
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 52,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderRadius: borderRadius.full,
  },
  categoryChipText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: '500',
  },
  // Typing
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typingBubble: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderBottomLeftRadius: 2,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#F0F7FF',
    marginBottom: 80,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.2)',
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CA6FA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.39,
    shadowRadius: 7,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
    shadowOpacity: 0,
    elevation: 0,
  },
});
