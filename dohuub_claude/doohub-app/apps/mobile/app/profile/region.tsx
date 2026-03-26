import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button } from '../../src/components/ui';
import { getRegions } from '../../src/lib/queries';

interface Region {
  id: string;
  name: string;
  code: string;
  flag: string;
  available: boolean;
  isActive?: boolean;
}

// Fallback regions used when Supabase fetch fails
const FALLBACK_REGIONS: Region[] = [
  { id: '1', name: 'United States', code: 'US', flag: '\u{1F1FA}\u{1F1F8}', available: true },
  { id: '2', name: 'Canada', code: 'CA', flag: '\u{1F1E8}\u{1F1E6}', available: true },
  { id: '3', name: 'United Kingdom', code: 'UK', flag: '\u{1F1EC}\u{1F1E7}', available: false },
  { id: '4', name: 'Australia', code: 'AU', flag: '\u{1F1E6}\u{1F1FA}', available: false },
  { id: '5', name: 'Germany', code: 'DE', flag: '\u{1F1E9}\u{1F1EA}', available: false },
  { id: '6', name: 'France', code: 'FR', flag: '\u{1F1EB}\u{1F1F7}', available: false },
];

/**
 * Region Selection screen matching wireframe:
 * - List of available regions
 * - Current region indicator
 * - Coming soon badge for unavailable regions
 */
export default function RegionScreen() {
  const [regions, setRegions] = useState<Region[]>(FALLBACK_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState<string>('1'); // Default to US
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    setIsLoading(true);
    try {
      const data = await getRegions();
      if (data && data.length > 0) {
        const mapped: Region[] = data.map((r: any) => ({
          id: r.id,
          name: r.name,
          code: r.code || '',
          flag: r.flag || '',
          available: r.isActive !== false,
        }));
        setRegions(mapped);
        // Select the first available region by default
        const firstAvailable = mapped.find((r) => r.available);
        if (firstAvailable) setSelectedRegion(firstAvailable.id);
      }
    } catch (error) {
      // Fall back to hardcoded regions
      console.error('Failed to load regions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRegion = (region: Region) => {
    if (!region.available) {
      Alert.alert(
        'Coming Soon',
        `DoHuub is not yet available in ${region.name}. We'll notify you when we launch there!`
      );
      return;
    }
    setSelectedRegion(region.id);
  };

  const handleSave = () => {
    const region = regions.find((r) => r.id === selectedRegion);
    Alert.alert('Region Updated', `Your region has been set to ${region?.name}.`);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Change Region" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Select your region to see services available in your area. Some features may vary by
          region.
        </Text>

        {isLoading ? (
          <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
        <View style={styles.regionList}>
          {regions.map((region) => (
            <TouchableOpacity
              key={region.id}
              style={[
                styles.regionCard,
                selectedRegion === region.id && styles.regionCardSelected,
                !region.available && styles.regionCardDisabled,
              ]}
              onPress={() => handleSelectRegion(region)}
              disabled={!region.available}
            >
              <Text style={styles.flag}>{region.flag}</Text>
              <View style={styles.regionInfo}>
                <Text
                  style={[
                    styles.regionName,
                    !region.available && styles.regionNameDisabled,
                  ]}
                >
                  {region.name}
                </Text>
                {!region.available && (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                  </View>
                )}
              </View>
              {region.available && (
                <View
                  style={[
                    styles.radioOuter,
                    selectedRegion === region.id && styles.radioOuterSelected,
                  ]}
                >
                  {selectedRegion === region.id && <View style={styles.radioInner} />}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        )}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.text.secondary} />
          <Text style={styles.infoText}>
            Changing your region may affect available services, pricing, and payment methods.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Save Changes" onPress={handleSave} fullWidth />
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  regionList: {
    gap: spacing.sm,
  },
  regionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  regionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
  },
  regionCardDisabled: {
    opacity: 0.6,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
  },
  flag: {
    fontSize: 32,
  },
  regionInfo: {
    flex: 1,
  },
  regionName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
  },
  regionNameDisabled: {
    color: colors.text.secondary,
  },
  comingSoonBadge: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
    borderRadius: borderRadius.full,
  },
  comingSoonText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.text.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: colors.background,
  },
});

