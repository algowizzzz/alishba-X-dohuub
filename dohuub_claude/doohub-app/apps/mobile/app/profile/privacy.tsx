import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors, spacing, fontSize } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';

/**
 * Privacy Policy screen
 */
export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Privacy Policy" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: January 2026</Text>

        <Text style={styles.heading}>Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information you provide directly to us, including your name, email address, phone number, and addresses. We also collect information about your usage of our services.
        </Text>

        <Text style={styles.heading}>How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to provide, maintain, and improve our services, process transactions, send notifications, and communicate with you.
        </Text>

        <Text style={styles.heading}>Information Sharing</Text>
        <Text style={styles.paragraph}>
          We share your information with service providers to fulfill your bookings. We do not sell your personal information to third parties.
        </Text>

        <Text style={styles.heading}>Location Information</Text>
        <Text style={styles.paragraph}>
          We collect and process location information to provide location-based services and show you relevant service providers in your area.
        </Text>

        <Text style={styles.heading}>Data Security</Text>
        <Text style={styles.paragraph}>
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.
        </Text>

        <Text style={styles.heading}>Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to access, update, or delete your personal information. You can manage your data through the app settings or by contacting our support team.
        </Text>

        <Text style={styles.heading}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions about this Privacy Policy, please contact us at privacy@dohuub.com
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

