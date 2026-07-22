import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import {
  View,
  StyleSheet,
  Platform,
  Pressable,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width: SCREEN_W } = Dimensions.get('window');
const H_MARGIN = 16;
const BAR_INNER_W = SCREEN_W - H_MARGIN * 2;

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: {
  name: string;
  label: string;
  active: IconName;
  inactive: IconName;
}[] = [
  { name: 'index', label: 'Home', active: 'home', inactive: 'home-outline' },
  { name: 'bookings', label: 'Bookings', active: 'calendar', inactive: 'calendar-outline' },
  { name: 'chat', label: 'AI', active: 'sparkles', inactive: 'sparkles-outline' },
  { name: 'profile', label: 'Profile', active: 'person', inactive: 'person-outline' },
];

function ModernTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const focusedRoute = state.routes[state.index];
  if (focusedRoute?.name === 'services') {
    return null;
  }

  const visibleRoutes = state.routes.filter((r) => TABS.some((t) => t.name === r.name));
  const tabCount = visibleRoutes.length || 4;
  const tabW = BAR_INNER_W / tabCount;
  const activeIndex = Math.max(
    0,
    visibleRoutes.findIndex((r) => r.key === focusedRoute?.key)
  );

  const indicatorX = useSharedValue(activeIndex * tabW);

  useEffect(() => {
    indicatorX.value = withSpring(activeIndex * tabW, {
      damping: 18,
      stiffness: 190,
      mass: 0.65,
    });
  }, [activeIndex, tabW, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const bottom = Platform.OS === 'ios' ? Math.max(insets.bottom, 10) : 12;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom }]}>
      <View style={styles.barShadow}>
        <LinearGradient
          colors={['#2E7AD9', '#1E6BC9', '#1A5BB5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bar}
        >
          {/* Soft inner sheen */}
          <LinearGradient
            colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          <Animated.View style={[styles.indicator, { width: tabW - 10 }, indicatorStyle]}>
            <View style={styles.indicatorFill} />
          </Animated.View>

          {visibleRoutes.map((route, index) => {
            const meta = TABS.find((t) => t.name === route.name)!;
            const focused = activeIndex === index;
            const { options } = descriptors[route.key];

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({ type: 'tabLongPress', target: route.key });
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? meta.label}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabBtn}
              >
                <TabItem
                  focused={focused}
                  label={meta.label}
                  activeIcon={meta.active}
                  inactiveIcon={meta.inactive}
                  isAi={meta.name === 'chat'}
                />
              </Pressable>
            );
          })}
        </LinearGradient>
      </View>
    </View>
  );
}

function TabItem({
  focused,
  label,
  activeIcon,
  inactiveIcon,
  isAi,
}: {
  focused: boolean;
  label: string;
  activeIcon: IconName;
  inactiveIcon: IconName;
  isAi?: boolean;
}) {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, { damping: 16, stiffness: 210 });
  }, [focused, progress]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.9 + progress.value * 0.12 }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ['rgba(255,255,255,0.72)', '#FFFFFF']),
    opacity: 0.8 + progress.value * 0.2,
  }));

  if (isAi) {
    return (
      <View style={styles.tabInner}>
        <Animated.View style={iconStyle}>
          {focused ? (
            <View style={styles.aiOrbActive}>
              <Ionicons name={activeIcon} size={17} color="#2E7AD9" />
            </View>
          ) : (
            <View style={styles.aiOrbIdle}>
              <Ionicons name={inactiveIcon} size={17} color="rgba(255,255,255,0.85)" />
            </View>
          )}
        </Animated.View>
        <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
      </View>
    );
  }

  return (
    <View style={styles.tabInner}>
      <Animated.View style={iconStyle}>
        <Ionicons
          name={focused ? activeIcon : inactiveIcon}
          size={22}
          color={focused ? '#FFFFFF' : 'rgba(255,255,255,0.7)'}
        />
      </Animated.View>
      <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <ModernTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings' }} />
      <Tabs.Screen name="chat" options={{ title: 'AI Chat' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen
        name="services"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: H_MARGIN,
    right: H_MARGIN,
  },
  barShadow: {
    borderRadius: 28,
    shadowColor: '#1E6BC9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 16,
  },
  bar: {
    height: 68,
    borderRadius: 28,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  indicator: {
    position: 'absolute',
    left: 5,
    top: 7,
    bottom: 7,
    borderRadius: 22,
  },
  indicatorFill: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
  },
  tabBtn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.15,
  },
  aiOrbActive: {
    width: 34,
    height: 34,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  aiOrbIdle: {
    width: 34,
    height: 34,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
