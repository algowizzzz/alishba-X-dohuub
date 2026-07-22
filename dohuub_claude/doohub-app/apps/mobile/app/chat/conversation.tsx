import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Circle, Line } from 'react-native-svg';
import api from '../../src/services/api';

const colors = {
  background: '#FFFFFF',
  primary: '#2E7AD9',
  text: { primary: '#1E293B', secondary: '#64748B', muted: '#94A3B8' },
  surface: '#FFFFFF',
  secondary: '#F1F5F9',
};

function BotIcon({ size = 48, color = '#2E7AD9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="2" x2="12" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="12" cy="2" r="1" fill={color} />
      <Rect x="3" y="5" width="18" height="13" rx="2" stroke={color} strokeWidth="1.5" />
      <Rect x="7" y="9" width="3" height="3" rx="0.5" fill={color} />
      <Rect x="14" y="9" width="3" height="3" rx="0.5" fill={color} />
      <Line x1="9" y1="14" x2="15" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
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
      id: `${Date.now()}-a`,
      role: 'assistant',
      content: 'I found 3 highly-rated cleaning services available in your area:',
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
  if (
    lower.includes('handyman') ||
    lower.includes('repair') ||
    lower.includes('plumb') ||
    lower.includes('electric') ||
    lower.includes('fix')
  ) {
    return {
      id: `${Date.now()}-a`,
      role: 'assistant',
      content: 'Here are top handyman options nearby:',
      metadata: {
        type: 'service-cards',
        services: [
          { id: 1, name: 'Plumbing Fix', vendor: 'FixIt Pros', rating: 4.8, reviews: 120, price: '$80', icon: 'water' },
          { id: 2, name: 'Electrical Repair', vendor: 'Bright Sparks', rating: 4.7, reviews: 98, price: '$95', icon: 'flash' },
        ],
      },
    };
  }

  return {
    id: `${Date.now()}-a`,
    role: 'assistant',
    content: 'I can help you with various services. Here are our main categories:',
    metadata: {
      type: 'category-chips',
      categories: [
        'Cleaning Services',
        'Handyman Services',
        'Groceries & Food',
        'Beauty Services',
        'Rentals',
        'Caregiving',
      ],
    },
  };
}

const SUGGESTED_PROMPTS = [
  'Find cleaning service',
  'Book handyman',
  'Order groceries',
  'Beauty services near me',
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: "Hi! I'm your DoHuub assistant. How can I help you today?",
    metadata: { type: 'text' },
  },
];

export default function ChatConversationScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList<Message>>(null);
  const inputRef = useRef<TextInput>(null);

  const scrollToBottom = useCallback((animated = true) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated });
      }, 50);
    });
  }, []);

  // WhatsApp-style: only lift the input bar by keyboard height (iOS).
  // Android uses window resize — do not add extra padding.
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (e) => {
      if (Platform.OS === 'ios') {
        setKeyboardHeight(e.endCoordinates.height);
      }
      scrollToBottom(true);
    });
    const onHide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, [scrollToBottom]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isTyping, scrollToBottom]);

  const bottomPad =
    keyboardHeight > 0
      ? keyboardHeight
      : Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 4);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    scrollToBottom(true);

    try {
      const resp = await api.post<{
        success: boolean;
        data: {
          conversationId: string;
          message: {
            id: string;
            role: 'assistant';
            content: string;
            metadata?: Message['metadata'];
            createdAt: string;
          };
        };
      }>('/chat/send', { message: trimmed, conversationId }, { timeout: 120_000 });

      if (resp?.data?.conversationId) setConversationId(resp.data.conversationId);

      const m = resp?.data?.message;
      setMessages((prev) => [
        ...prev,
        {
          id: m?.id ?? `a-${Date.now()}`,
          role: 'assistant',
          content: m?.content ?? "I'm having trouble responding right now. Please try again.",
          metadata: (m?.metadata as Message['metadata']) ?? { type: 'text' },
        },
      ]);
    } catch (err) {
      console.warn('[chat] API failed, falling back to local:', err);
      setMessages((prev) => [...prev, processMessage(trimmed)]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCategoryPress = (category: string) => {
    const route = CATEGORY_ROUTES[category];
    if (route) router.push(route as any);
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

  const showSuggestions = messages.length <= 1 && !isTyping;

  const renderSuggestions = () => (
    <View style={styles.suggestionsWrap}>
      {SUGGESTED_PROMPTS.map((prompt) => (
        <TouchableOpacity
          key={prompt}
          style={styles.promptChip}
          onPress={() => sendMessage(prompt)}
          activeOpacity={0.8}
        >
          <Text style={styles.promptText}>{prompt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';

    return (
      <View style={styles.messageBlock}>
        <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowBot]}>
          {!isUser && (
            <View style={styles.botAvatar}>
              <BotIcon size={18} color={colors.primary} />
            </View>
          )}
          <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
            <Text style={[styles.messageText, isUser && styles.messageTextUser]}>
              {item.content}
            </Text>
          </View>
        </View>

        {item.metadata?.type === 'service-cards' && item.metadata.services && (
          <View style={styles.serviceCards}>
            {item.metadata.services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => handleServicePress(service)}
                activeOpacity={0.85}
              >
                <View style={styles.serviceIcon}>
                  <Ionicons name={service.icon} size={22} color={colors.primary} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceVendor}>{service.vendor}</Text>
                  <View style={styles.serviceFooter}>
                    <Text style={styles.serviceRating}>★ {service.rating}</Text>
                    <Text style={styles.serviceReviews}>({service.reviews})</Text>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {item.metadata?.type === 'category-chips' && item.metadata.categories && (
          <View style={styles.categoryChips}>
            {item.metadata.categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryChip}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryChipText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderTyping = () => (
    <View style={[styles.messageRow, styles.messageRowBot, { marginBottom: 8 }]}>
      <View style={styles.botAvatar}>
        <BotIcon size={18} color={colors.primary} />
      </View>
      <View style={styles.typingBubble}>
        <View style={styles.typingDots}>
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Fixed header — never moves with keyboard */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerBot}>
              <BotIcon size={14} color="#2E7AD9" />
            </View>
            <Text style={styles.title}>DoHuub AI</Text>
          </View>
          <Text style={styles.subtitle}>Ask me anything</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Messages scroll area */}
      <View style={styles.listWrap}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          ListHeaderComponent={
            showSuggestions ? (
              <View style={styles.welcomeHeader}>
                <View style={styles.welcomeAvatar}>
                  <BotIcon size={40} color={colors.primary} />
                </View>
                <Text style={styles.welcomeTitle}>How can I help?</Text>
                {renderSuggestions()}
              </View>
            ) : null
          }
          ListFooterComponent={isTyping ? renderTyping : null}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onContentSizeChange={() => scrollToBottom(false)}
        />
      </View>

      {/* Input stays at bottom; only this strip lifts with keyboard (like WhatsApp) */}
      <View style={[styles.inputSafe, { paddingBottom: bottomPad }]}>
        <Pressable style={styles.inputBar} onPress={() => inputRef.current?.focus()}>
          <TextInput
            ref={inputRef}
            style={[styles.input, inputFocused && styles.inputFocused]}
            value={input}
            onChangeText={setInput}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.text.muted}
            multiline
            maxLength={500}
            onFocus={() => {
              setInputFocused(true);
              scrollToBottom(true);
            }}
            onBlur={() => setInputFocused(false)}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || isTyping) && styles.sendButtonDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            activeOpacity={0.85}
          >
            <Ionicons
              name="send"
              size={18}
              color={input.trim() && !isTyping ? '#FFFFFF' : '#94A3B8'}
            />
          </TouchableOpacity>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(15, 23, 42, 0.08)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerBot: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 1,
  },

  listWrap: {
    flex: 1,
    minHeight: 0,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    flexGrow: 1,
  },
  welcomeHeader: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  welcomeAvatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 14,
  },
  suggestionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  promptChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.1)',
  },
  promptText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },

  messageBlock: {
    marginBottom: 14,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowBot: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  bubble: {
    maxWidth: '78%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
  },
  bubbleBot: {
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },

  serviceCards: {
    marginLeft: 40,
    marginTop: 8,
    gap: 8,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  serviceIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
    minWidth: 0,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  serviceVendor: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  serviceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  serviceRating: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  serviceReviews: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  servicePrice: {
    marginLeft: 'auto',
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 40,
    marginTop: 8,
    gap: 8,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.1)',
    borderRadius: 999,
  },
  categoryChipText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },

  typingBubble: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 5,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    opacity: 0.55,
  },

  inputSafe: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15, 23, 42, 0.08)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    maxHeight: 110,
    minHeight: 44,
    paddingVertical: Platform.OS === 'ios' ? 11 : 8,
    paddingHorizontal: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(15, 23, 42, 0.1)',
    fontSize: 15,
    color: colors.text.primary,
  },
  inputFocused: {
    borderColor: '#2E7AD9',
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
});
