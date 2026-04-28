import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import api from '../../src/services/api';

export default function LeaveReviewScreen() {
  const { bookingId, serviceName, scheduledDate, scheduledTime } = useLocalSearchParams<{
    bookingId: string;
    serviceName?: string;
    scheduledDate?: string;
    scheduledTime?: string;
  }>();

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = rating > 0 && reviewText.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || !bookingId) return;
    setIsSubmitting(true);
    try {
      const response = await api.post<{ success: boolean; data: any; error?: string }>(
        '/api/v1/reviews',
        { bookingId, rating, comment: reviewText }
      );
      if (!response.success) throw new Error(response.error || 'Submit failed');
      router.back();
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || 'Failed to submit review. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayDate = scheduledDate
    ? `${scheduledDate} at ${scheduledTime || 'TBD'}`
    : '2024-12-05 at 10:00 AM';

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Rate Your Experience" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Info Card */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceIcon}>
            <Ionicons name="sparkles" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{serviceName || 'Deep House Cleaning'}</Text>
            <Text style={styles.serviceDate}>{displayDate}</Text>
          </View>
        </View>

        {/* Star Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Rate Your Experience <Text style={styles.required}>*</Text></Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starBtn}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={star <= rating ? '#F59E0B' : colors.border.default}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Review Text */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Write Your Review <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience with this service..."
            placeholderTextColor={colors.text.muted}
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{reviewText.length} characters</Text>
        </View>

        {/* Add Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Add Photos (Optional)</Text>
          <TouchableOpacity
            style={styles.addPhotoBtn}
            onPress={() => Alert.alert('Coming Soon', 'Photo upload will be available soon')}
          >
            <Ionicons name="image-outline" size={28} color={colors.text.secondary} />
            <Text style={styles.addPhotoText}>Add</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          <Text style={[styles.submitBtnText, !canSubmit && styles.submitBtnTextDisabled]}>
            Submit Review
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.laterBtn} onPress={() => router.back()}>
          <Text style={styles.laterBtnText}>Review Later</Text>
        </TouchableOpacity>
      </View>
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },

  // Service Card
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46,122,217,0.08)',
  },
  serviceIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  serviceDate: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },

  // Sections
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  required: {
    color: colors.status.error,
  },

  // Stars
  starsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    justifyContent: 'center',
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46,122,217,0.08)',
  },
  starBtn: {
    padding: 4,
  },

  // Review Input
  reviewInput: {
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text.primary,
    backgroundColor: colors.surface,
    minHeight: 140,
  },
  charCount: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },

  // Add Photo
  addPhotoBtn: {
    width: 72,
    height: 72,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },

  // CTA
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46,122,217,0.1)',
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: 'rgba(46,122,217,0.15)',
  },
  submitBtnText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  submitBtnTextDisabled: {
    color: 'rgba(46,122,217,0.4)',
  },
  laterBtn: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    backgroundColor: colors.surface,
  },
  laterBtnText: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
  },
});
