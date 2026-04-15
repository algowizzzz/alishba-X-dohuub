import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getServiceImage } from '../../../src/constants/serviceImages';
import { getCleaningListings } from '../../../src/lib/queries';
import { Card, Rating, PoweredByDoHuubBadge } from '../../../src/components/ui';
import { colors, spacing, fontSize, borderRadius } from '../../../src/constants/theme';

const CLEANING_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'DEEP_CLEANING', label: 'Deep Cleaning' },
  { id: 'LAUNDRY', label: 'Laundry' },
  { id: 'OFFICE_CLEANING', label: 'Office' },
];

export default function CleaningServicesScreen() {
  const [listings, setListings] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [selectedType]);

  const fetchListings = async () => {
    try {
      const data = await getCleaningListings();
      // Filter by type if selected
      const filtered = selectedType === 'all' ? data : data.filter((item: any) => item.cleaningType === selectedType);
      // Map to include vendor info at top level for rendering
      setListings(filtered.map((item: any) => ({ ...item, vendor: item.Vendor })));
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  const handleListingPress = (listing: any) => {
    // Detail page expects vendor ID
    router.push({
      pathname: '/services/cleaning/[id]',
      params: { id: listing.vendorId },
    } as any);
  };

  const renderListingCard = ({ item, index }: { item: any; index: number }) => (
    <Card style={styles.listingCard} onPress={() => handleListingPress(item)}>
      <View style={styles.cardRow}>
        {/* Left: Service Image */}
        <Image
          source={{ uri: getServiceImage('cleaning', index, item.images?.[0] ?? item.image) }}
          style={styles.cardImage}
        />

        {/* Right: Info */}
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.listingTitle} numberOfLines={1}>{item.vendor?.businessName || item.title}</Text>
            {item.vendor?.isMichelle && <PoweredByDoHuubBadge />}
          </View>

          <View style={styles.ratingRow}>
            <Rating
              rating={item.vendor?.rating || 0}
              reviewCount={item.vendor?.reviewCount || 0}
              size="sm"
            />
          </View>

          <Text style={styles.tagline} numberOfLines={1}>{item.title}</Text>

          <Text style={styles.startingPrice}>From ${item.basePrice}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Cleaning Services</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {CLEANING_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.filterTab,
              selectedType === type.id && styles.filterTabActive,
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedType === type.id && styles.filterTabTextActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Listings */}
      <FlatList
        data={listings}
        renderItem={renderListingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="sparkles-outline" size={48} color={colors.text.muted} />
            <Text style={styles.emptyText}>No cleaning services available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
  },
  placeholder: {
    width: 32,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: colors.text.inverse,
  },
  listContent: {
    padding: spacing.lg,
  },
  listingCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(46, 122, 217, 0.08)',
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  listingTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    flexShrink: 1,
  },
  ratingRow: {
    marginBottom: 4,
  },
  tagline: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  startingPrice: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.text.muted,
    marginTop: spacing.md,
  },
});

