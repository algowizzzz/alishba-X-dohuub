import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { colors } from '../../src/constants/theme';

/**
 * Deep-link landing page for Stripe / WiPay return URL:
 *   dohuub://checkout/return?session=cs_... or ?cancelled=1
 *
 * Expo Router maps this to app/checkout/return.tsx.
 * We immediately hand off to the processing screen (or back if cancelled).
 */
export default function CheckoutReturnScreen() {
  const params = useLocalSearchParams<{
    session?: string;
    session_id?: string;
    cancelled?: string;
    bookingId?: string;
    serviceName?: string;
    amount?: string;
    date?: string;
    time?: string;
  }>();

  useEffect(() => {
    const sessionId = params.session || params.session_id || '';
    const cancelled = params.cancelled === '1' || params.cancelled === 'true';

    if (cancelled) {
      router.replace({
        pathname: '/checkout/processing',
        params: {
          bookingId: params.bookingId || '',
          sessionId,
          browserResult: 'cancel',
          serviceName: params.serviceName || '',
          amount: params.amount || '',
          date: params.date || '',
          time: params.time || '',
        },
      });
      return;
    }

    router.replace({
      pathname: '/checkout/processing',
      params: {
        bookingId: params.bookingId || '',
        sessionId,
        browserResult: 'success',
        serviceName: params.serviceName || '',
        amount: params.amount || '',
        date: params.date || '',
        time: params.time || '',
      },
    });
  }, [params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
