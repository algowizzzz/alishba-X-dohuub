import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { ScreenHeader } from '../../../src/components/composite';

const PURPLE_DOT = 'rgb(168, 85, 247)';
const PINK_DOT = 'rgb(236, 72, 153)';

/**
 * Caregiving Choice Screen matching wireframe:
 * - Header: "Caregiving Services"
 * - Subtitle: "Choose the type of caregiving service you need"
 * - Two options with feature bullet points:
 *   - "Ride Assistance" - with purple dot features
 *   - "Companionship Support" - with pink dot features
 */
export default function CaregivingChoiceScreen() {
  const handleRidesPress = () => {
    router.push('/services/caregiving/rides');
  };

  const handleCompanionsPress = () => {
    router.push('/services/caregiving/companions');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Caregiving Services" showBack />

      <View style={styles.content}>
        <Text style={styles.subtitle}>Choose the type of caregiving service you need</Text>

        {/* Ride Assistance Card */}
        <TouchableOpacity style={styles.choiceCard} onPress={handleRidesPress} activeOpacity={0.8}>
          <View style={styles.cardRow}>
            <View style={styles.iconContainer}>
              <Image source={require('../../../assets/ride-assistance.png')} style={styles.iconImg} resizeMode="contain" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Ride Assistance</Text>
              <Text style={styles.cardDescription}>
                Professional transportation services with pickup and multiple stops (pharmacy, grocery, appointments)
              </Text>
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <View style={[styles.featureDot, { backgroundColor: PURPLE_DOT }]} />
                  <Text style={styles.featureText}>Hourly rate booking</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={[styles.featureDot, { backgroundColor: PURPLE_DOT }]} />
                  <Text style={styles.featureText}>Multiple stops available</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={[styles.featureDot, { backgroundColor: PURPLE_DOT }]} />
                  <Text style={styles.featureText}>Round-trip option</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Companionship Support Card */}
        <TouchableOpacity style={styles.choiceCard} onPress={handleCompanionsPress} activeOpacity={0.8}>
          <View style={styles.cardRow}>
            <View style={styles.iconContainer}>
              <Image source={require('../../../assets/companionship.png')} style={styles.iconImg} resizeMode="contain" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Companionship Support</Text>
              <Text style={styles.cardDescription}>
                Professional caregivers providing conversation, activities, meal assistance, and daily living support
              </Text>
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <View style={[styles.featureDot, { backgroundColor: PINK_DOT }]} />
                  <Text style={styles.featureText}>Flexible duration</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={[styles.featureDot, { backgroundColor: PINK_DOT }]} />
                  <Text style={styles.featureText}>Personalized care plans</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={[styles.featureDot, { backgroundColor: PINK_DOT }]} />
                  <Text style={styles.featureText}>Certified caregivers</Text>
                </View>
              </View>
            </View>
          </View>
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
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  choiceCard: {
    padding: spacing.lg,
    borderWidth: borderWidth.thin,
    borderColor: colors.border.default,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.category.caregivingLight,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconImg: {
    width: 52,
    height: 52,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  featureList: {
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  featureText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
});
