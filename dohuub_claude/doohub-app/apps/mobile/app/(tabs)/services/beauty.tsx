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
import { getBeautyListings } from '../../../src/lib/queries';
import { Card, Rating, PoweredByDoHuubBadge } from '../../../src/components/ui';
import { colors, spacing, fontSize, borderRadius } from '../../../src/constants/theme';

const BEAUTY_PHOTOS = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200&h=200&fit=crop',
];

const BEAUTY_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'MAKEUP', label: 'Makeup' },
  { id: 'HAIR', label: 'Hair' },
  { id: 'NAILS', label: 'Nails' },
  { id: 'WELLNESS', label: 'Wellness' },
];

export default function BeautyServicesScreen() {
  const [listings, setListings] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [selectedType]);

  const fetchListings = async () => {
    try {
      const data = await getBeautyListings();
      // Filter by type if selected
      const filtered = selectedType === 'all' ? data : data.filter((item: any) => item.beautyType === selectedType);
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
    router.push({
      pathname: '/services/beauty/[id]',
      params: { id: listing.vendorId },
    } as any);
  };

  const renderListingCard = ({ item, index }: { item: any; index: number }) => (
    <Card style={styles.listingCard} onPress={() => handleListingPress(item)}>
      <View style={styles.cardRow}>
        {/* Left: Service Image */}
        <Image
          source={{ uri: BEAUTY_PHOTOS[index % BEAUTY_PHOTOS.length] }}
          style={styles.cardImage}
          resizeMode="cover"
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Beauty Services</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.filterTabs}>
        {BEAUTY_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[styles.filterTab, selectedType === type.id && styles.filterTabActive]}
            onPress={() => setSelectedType(type.id)}
          >
            <Text style={[styles.filterTabText, selectedType === type.id && styles.filterTabTextActive]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={listings}
        renderItem={renderListingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cut-outline" size={48} color={colors.text.muted} />
            <Text style={styles.emptyText}>No beauty services available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  backButton: { padding: spacing.xs },
  title: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text.primary },
  placeholder: { width: 32 },
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
  filterTabActive: { backgroundColor: colors.primary },
  filterTabText: { fontSize: fontSize.sm, color: colors.text.secondary, fontWeight: '500' },
  filterTabTextActive: { color: colors.text.inverse },
  listContent: { padding: spacing.lg },
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
  listingTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, flexShrink: 1 },
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
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl * 2 },
  emptyText: { fontSize: fontSize.md, color: colors.text.muted, marginTop: spacing.md },
});

