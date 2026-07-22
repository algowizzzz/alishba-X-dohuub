import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Svg, { Rect, Circle, Line } from 'react-native-svg';

function BotIcon({ size = 64, color = '#2E7AD9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="2" x2="12" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="12" cy="2" r="1.2" fill={color} />
      <Rect x="3" y="5" width="18" height="13" rx="3" stroke={color} strokeWidth="1.5" />
      <Rect x="7" y="9" width="3.2" height="3.2" rx="0.8" fill={color} />
      <Rect x="13.8" y="9" width="3.2" height="3.2" rx="0.8" fill={color} />
      <Line x1="9" y1="14.5" x2="15" y2="14.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <Line x1="8" y1="18" x2="8" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="16" y1="18" x2="16" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="8" y1="22" x2="16" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export default function ChatHubScreen() {
  const breathe = useSharedValue(1);
  const floatY = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    floatY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [breathe, floatY]);

  const avatarAnim = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }, { translateY: floatY.value }],
  }));

  const startNewChat = () => {
    router.push('/chat/conversation');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.top}>
          <Text style={styles.brand}>DoHuub</Text>
          <Text style={styles.screenTitle}>AI Assistant</Text>
        </Animated.View>

        <View style={styles.center}>
          <Animated.View style={[styles.avatarWrap, avatarAnim]}>
            <LinearGradient
              colors={['#2E7AD9', '#1E6BC9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarRing}
            >
              <View style={styles.avatarInner}>
                <BotIcon size={56} color="#2E7AD9" />
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.delay(150).duration(550)}
            style={styles.headline}
          >
            Your lifestyle{'\n'}concierge
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(280).duration(550)}
            style={styles.support}
          >
            Book cleaning, beauty, rides, groceries and more — in one conversation.
          </Animated.Text>

          <Animated.View
            entering={FadeInUp.delay(400).duration(600)}
            style={styles.pills}
          >
            <View style={styles.pill}>
              <Ionicons name="sparkles" size={13} color="#2E7AD9" />
              <Text style={styles.pillText}>Smart help</Text>
            </View>
            <View style={styles.pill}>
              <Ionicons name="time-outline" size={13} color="#2E7AD9" />
              <Text style={styles.pillText}>24/7</Text>
            </View>
            <View style={styles.pill}>
              <Ionicons name="shield-checkmark-outline" size={13} color="#2E7AD9" />
              <Text style={styles.pillText}>Private</Text>
            </View>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(480).duration(650)} style={styles.bottom}>
          <TouchableOpacity onPress={startNewChat} activeOpacity={0.9}>
            <LinearGradient
              colors={['#2E7AD9', '#1E6BC9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cta}
            >
              <Ionicons name="chatbubble-ellipses" size={22} color="#FFFFFF" />
              <Text style={styles.ctaText}>Start a new chat</Text>
              <View style={styles.ctaArrow}>
                <Ionicons name="arrow-forward" size={18} color="#2E7AD9" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.footer}>Tap to open a fresh conversation</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 8 : 4,
    paddingBottom: 100,
    justifyContent: 'space-between',
  },
  top: {
    paddingTop: 4,
  },
  brand: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7AD9',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },
  center: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  avatarWrap: {
    marginBottom: 24,
  },
  avatarRing: {
    width: 118,
    height: 118,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E7AD9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  avatarInner: {
    width: 104,
    height: 104,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.8,
    marginBottom: 12,
  },
  support: {
    fontSize: 15,
    lineHeight: 22,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 20,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.14)',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E6BC9',
  },
  bottom: {
    gap: 12,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 18,
    shadowColor: '#2E7AD9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ctaArrow: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
