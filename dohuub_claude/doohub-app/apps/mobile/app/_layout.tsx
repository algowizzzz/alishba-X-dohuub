import 'web-streams-polyfill';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../src/store/authStore';
import { supabase } from '../src/lib/supabase';
import { MobileBackgroundServices } from '../src/components/MobileBackgroundServices';
import { initSentry, Sentry } from '../src/lib/sentry';

initSentry();

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

const ONBOARDING_KEY = '@dohuub_has_seen_onboarding';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function RootLayout() {
  const { fetchUser, setOnboardingComplete } = useAuthStore();

  // Listen to Supabase auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        useAuthStore.getState().setSession(session);
      } else {
        useAuthStore.getState().clearSession();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        // Restore onboarding status from AsyncStorage
        const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (hasSeenOnboarding === 'true') {
          setOnboardingComplete();
        }

        // Check Supabase session
        await fetchUser();
      } catch (e) {
        // User not authenticated or API unreachable
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <MobileBackgroundServices />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="location-permission" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </QueryClientProvider>
  );
}

// Wrap with Sentry so unhandled errors and navigation get instrumented.
// If no DSN is configured, this is effectively a no-op wrapper.
export default Sentry.wrap(RootLayout);

