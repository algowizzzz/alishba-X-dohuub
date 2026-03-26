import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { colors, spacing } from '../../constants/theme';
import { ScreenHeader } from '../composite/ScreenHeader';
import { Button } from '../ui/Button';

interface DetailScreenTemplateProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  children: React.ReactNode;
  ctaTitle?: string;
  ctaOnPress?: () => void;
  ctaLoading?: boolean;
  ctaDisabled?: boolean;
  rightIcon?: 'ellipsis-vertical' | 'share-outline' | 'heart-outline';
  onRightAction?: () => void;
}

/**
 * Detail screen template matching wireframe layout:
 * - Header with back button and optional menu
 * - Scrollable content area
 * - Sticky CTA button at bottom
 */
export function DetailScreenTemplate({
  title,
  showBack = true,
  onBack,
  children,
  ctaTitle,
  ctaOnPress,
  ctaLoading,
  ctaDisabled,
  rightIcon,
  onRightAction,
}: DetailScreenTemplateProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={title}
        showBack={showBack}
        onBack={onBack}
        rightIcon={rightIcon}
        onRightAction={onRightAction}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {ctaTitle && ctaOnPress && (
        <View style={styles.ctaContainer}>
          <Button
            title={ctaTitle}
            onPress={ctaOnPress}
            loading={ctaLoading}
            disabled={ctaDisabled}
            fullWidth
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: colors.background,
  },
});

