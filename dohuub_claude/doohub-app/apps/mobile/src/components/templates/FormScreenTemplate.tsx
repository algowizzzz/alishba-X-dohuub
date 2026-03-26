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
import { ScreenHeader } from '../composite/ScreenHeader';
import { Button } from '../ui/Button';

interface FormScreenTemplateProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  children: React.ReactNode;
  submitTitle?: string;
  onSubmit?: () => void;
  submitLoading?: boolean;
  submitDisabled?: boolean;
}

/**
 * Form screen template matching wireframe layout:
 * - Header with back button and title
 * - Scrollable form content
 * - Sticky submit button at bottom
 */
export function FormScreenTemplate({
  title,
  showBack = true,
  onBack,
  children,
  submitTitle = 'Submit',
  onSubmit,
  submitLoading,
  submitDisabled,
}: FormScreenTemplateProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={title} showBack={showBack} onBack={onBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        {onSubmit && (
          <View style={styles.submitContainer}>
            <Button
              title={submitTitle}
              onPress={onSubmit}
              loading={submitLoading}
              disabled={submitDisabled}
              fullWidth
            />
          </View>
        )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  submitContainer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: colors.background,
  },
});

