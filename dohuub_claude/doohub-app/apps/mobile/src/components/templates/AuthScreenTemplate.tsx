import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { colors, spacing } from '../../constants/theme';
import { AuthHeader } from '../composite/AuthHeader';

interface AuthScreenTemplateProps {
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
  footer?: React.ReactNode;
}

/**
 * Auth screen template matching wireframe layout:
 * - Optional header with back button and step indicator
 * - Centered content area
 * - Optional footer (terms, links)
 */
export function AuthScreenTemplate({
  children,
  showBack = true,
  onBack,
  currentStep,
  totalSteps,
  footer,
}: AuthScreenTemplateProps) {
  return (
    <SafeAreaView style={styles.container}>
      {(showBack || (currentStep && totalSteps)) && (
        <AuthHeader
          showBack={showBack}
          onBack={onBack}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>{children}</View>
        </ScrollView>

        {footer && <View style={styles.footer}>{footer}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});

