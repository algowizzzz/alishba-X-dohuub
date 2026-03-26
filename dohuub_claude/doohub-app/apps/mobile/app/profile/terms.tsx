import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors, spacing, fontSize, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';

/**
 * Terms of Service screen
 */
export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Terms of Service" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: January 2026</Text>

        <Text style={styles.heading}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing and using the DoHuub application, you accept and agree to be bound by the terms and provision of this agreement.
        </Text>

        <Text style={styles.heading}>2. Description of Service</Text>
        <Text style={styles.paragraph}>
          DoHuub provides a platform connecting users with service providers across various categories including cleaning, handyman services, groceries, beauty, rental properties, and caregiving services.
        </Text>

        <Text style={styles.heading}>3. User Accounts</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
        </Text>

        <Text style={styles.heading}>4. Service Bookings</Text>
        <Text style={styles.paragraph}>
          All bookings made through the platform are subject to availability and confirmation by the service provider. DoHuub facilitates the connection but is not directly responsible for the service quality provided by third-party vendors.
        </Text>

        <Text style={styles.heading}>5. Payments</Text>
        <Text style={styles.paragraph}>
          All payments are processed securely through our payment partners. By making a payment, you authorize us to charge your selected payment method.
        </Text>

        <Text style={styles.heading}>6. Cancellation Policy</Text>
        <Text style={styles.paragraph}>
          Cancellation policies vary by service provider. Please review the specific cancellation terms before confirming your booking.
        </Text>

        <Text style={styles.heading}>7. Privacy</Text>
        <Text style={styles.paragraph}>
          Your use of DoHuub is also governed by our Privacy Policy. Please review our Privacy Policy for information on how we collect, use, and protect your data.
        </Text>

        <Text style={styles.heading}>8. Contact</Text>
        <Text style={styles.paragraph}>
          If you have any questions about these Terms, please contact us at support@dohuub.com
        </Text>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  lastUpdated: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  heading: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  paragraph: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 24,
  },
});

