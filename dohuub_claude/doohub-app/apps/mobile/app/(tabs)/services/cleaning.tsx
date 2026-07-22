import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCleaningListings } from '../../../src/lib/queries';
import { ServiceSearchBar } from '../../../src/components/ui/ServiceSearchBar';

// Boss vendor logos
const cleaningLogos = [
  require('../../../assets/cleaning/logos/logo1.png'),
  require('../../../assets/cleaning/logos/logo2.png'),
  require('../../../assets/cleaning/logos/logo3.png'),
];

// Fallback vendors matching boss wireframe exactly
const FALLBACK_VENDORS = [
  {
    id: '1',
    name: 'DoHuub Official Store',
    rating: 4.9,
    reviewCount: 342,
    tagline: 'Professional cleaning services for homes and offices',
    isPoweredByDoHuub: true,
    startingPrice: 75,
  },
  {
    id: '2',
    name: 'Sparkle & Shine',
    rating: 4.8,
    reviewCount: 256,
    tagline: 'Eco-friendly cleaning solutions',
    isPoweredByDoHuub: false,
    startingPrice: 85,
  },
  {
    id: '3',
    name: 'Clean Pro Services',
    rating: 4.7,
    reviewCount: 189,
    tagline: 'Residential and commercial cleaning experts',
    isPoweredByDoHuub: false,
    startingPrice: 70,
  },
  {
    id: '4',
    name: 'Perfect Touch Cleaners',
    rating: 4.6,
    reviewCount: 145,
    tagline: 'Deep cleaning specialists',
    isPoweredByDoHuub: false,
    startingPrice: 90,
  },
  {
    id: '5',
    name: 'Elite Cleaning Squad',
    rating: 4.5,
    reviewCount: 98,
    tagline: 'Premium cleaning services',
    isPoweredByDoHuub: false,
    startingPrice: 100,
  },
];

/**
 * Cleaning Services — exact match to boss wireframe (VendorsListScreen.tsx):
 * - Glassmorphic header with back button + title
 * - Vendor cards with real logo images, left blue border
 * - "Powered by DoHuub" gradient badge
 * - Star rating + review count
 * - Tagline text
 * - Light blue background (#F0F7FF)
 */
export default function CleaningServicesScreen() {
  const [vendors, setVendors] = useState<any[]>(FALLBACK_VENDORS);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const data = await getCleaningListings();
      if (data && data.length > 0) {
        // Map DB data to vendor format — listings include Vendor/business when present
        const mapped = data.map((item: any, index: number) => ({
          id: item.id || item.vendorId || String(index),
          name: item.Vendor?.businessName || item.title || FALLBACK_VENDORS[index % FALLBACK_VENDORS.length].name,
          rating: item.Vendor?.rating ?? 0,
          reviewCount: item.Vendor?.reviewCount ?? 0,
          tagline: item.title || item.description || FALLBACK_VENDORS[index % FALLBACK_VENDORS.length].tagline,
          isPoweredByDoHuub: item.Vendor?.isMichelle || false,
          startingPrice: item.basePrice ?? FALLBACK_VENDORS[index % FALLBACK_VENDORS.length].startingPrice,
          vendorId: item.vendorId,
          logo: item.Vendor?.logo || null,
        }));
        setVendors(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch cleaning vendors:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVendors();
    setRefreshing(false);
  };

  const handleVendorPress = (vendor: any) => {
    router.push({
      pathname: '/services/cleaning/[id]',
      params: { id: vendor.vendorId || vendor.id },
    } as any);
  };

  const filteredVendors = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vendors;
    return vendors.filter(
      (v) =>
        v.name?.toLowerCase().includes(q) ||
        v.tagline?.toLowerCase().includes(q)
    );
  }, [vendors, search]);

  return (
    <View style={styles.container}>
      {/* Header — glassmorphic with rounded bottom, matching boss */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cleaning Services</Text>
        </View>
      </View>

      <ServiceSearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search cleaning services..."
      />

      {/* Vendor Cards List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredVendors.length === 0 ? (
          <View style={styles.emptySearch}>
            <Ionicons name="search-outline" size={36} color="#94A3B8" />
            <Text style={styles.emptySearchTitle}>No matches</Text>
            <Text style={styles.emptySearchText}>Try a different business or service name</Text>
          </View>
        ) : (
          filteredVendors.map((vendor, index) => (
            <TouchableOpacity
              key={vendor.id}
              style={styles.vendorCard}
              onPress={() => handleVendorPress(vendor)}
              activeOpacity={0.7}
            >
              <View style={styles.cardRow}>
                {vendor.logo ? (
                  <Image
                    source={{ uri: vendor.logo }}
                    style={styles.vendorLogo}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={cleaningLogos[index % cleaningLogos.length]}
                    style={styles.vendorLogo}
                    resizeMode="cover"
                  />
                )}

                <View style={styles.vendorInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.vendorName} numberOfLines={1}>{vendor.name}</Text>
                    {vendor.isPoweredByDoHuub && (
                      <View style={styles.dohuubBadge}>
                        <Text style={styles.dohuubBadgeText}>Powered by DoHuub</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.ratingRow}>
                    <View style={styles.ratingInner}>
                      <Ionicons name="star" size={14} color="#FACC15" />
                      <Text style={styles.ratingText}>
                        {Number(vendor.rating || 0).toFixed(1)}
                      </Text>
                    </View>
                    <Text style={styles.reviewCount}>({vendor.reviewCount || 0})</Text>
                  </View>

                  <Text style={styles.tagline} numberOfLines={1}>{vendor.tagline}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 24,
    gap: 16,
  },
  vendorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.15)',
    borderLeftWidth: 3,
    borderLeftColor: '#2E7AD9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 16,
  },
  vendorLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  vendorInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flexShrink: 1,
  },
  dohuubBadge: {
    backgroundColor: '#2E7AD9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexShrink: 0,
  },
  dohuubBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  ratingInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  reviewCount: {
    fontSize: 14,
    color: '#64748B',
  },
  tagline: {
    fontSize: 14,
    color: '#64748B',
  },
  emptySearch: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptySearchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 8,
  },
  emptySearchText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});
