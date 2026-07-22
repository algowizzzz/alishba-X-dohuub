import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../src/constants/theme';
import { getRentalListings } from '../../../src/lib/queries';

const TEAL = '#14B8A6';

const FALLBACK_IMAGES = [
  require('../../../assets/rental-1.png'),
  require('../../../assets/rental-2.png'),
  require('../../../assets/rental-3.png'),
  require('../../../assets/rental-4.png'),
];

interface Property {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  pricePerWeek: number;
  pricePerMonth: number;
  rating: number;
  reviews: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sqft: number;
  propertyType: string;
  amenities: string[];
  description: string;
  houseRules: string[];
  isPoweredByDoHuub: boolean;
  remoteImage?: string;
  image: number;
}

const PROPERTY_TYPES = ['All','Apartment','House','Studio','Villa'];
const BEDROOM_OPTS   = ['Any','1','2','3','4+'];
const BATHROOM_OPTS  = ['Any','1','2','3+'];
const PRICE_RANGES   = ['Any','Under $100','$100-$200','$200-$300','Over $300'];

export default function RentalPropertiesListScreen() {
  const [showFilters, setShowFilters] = useState(false);
  const [propType,   setPropType]   = useState('All');
  const [bedrooms,   setBedrooms]   = useState('Any');
  const [bathrooms,  setBathrooms]  = useState('Any');
  const [priceRange, setPriceRange] = useState('Any');

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const rows = await getRentalListings();
        const mapped: Property[] = (rows || []).map((r: any, idx: number) => {
          const vendor = Array.isArray(r.Vendor) ? r.Vendor[0] : r.Vendor;
          return {
            id: r.id,
            name: r.title,
            location: [r.city, r.state].filter(Boolean).join(', '),
            pricePerNight: Number(r.pricePerNight) || 0,
            pricePerWeek: Number(r.pricePerWeek) || 0,
            pricePerMonth: Number(r.pricePerMonth) || 0,
            rating: Number(vendor?.rating) || 0,
            reviews: Number(vendor?.reviewCount) || 0,
            bedrooms: Number(r.bedrooms) || 0,
            bathrooms: Number(r.bathrooms) || 0,
            maxGuests: Number(r.maxGuests) || 0,
            sqft: 0,
            propertyType: r.propertyType || 'Apartment',
            amenities: Array.isArray(r.amenities) ? r.amenities : [],
            description: r.description || '',
            houseRules: [],
            isPoweredByDoHuub: Boolean(vendor?.isMichelle),
            remoteImage: Array.isArray(r.images) && r.images.length > 0 ? r.images[0] : undefined,
            image: idx % FALLBACK_IMAGES.length,
          };
        });
        setProperties(mapped);
      } catch (e) {
        console.warn('Failed to load rentals:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = properties.filter(p => {
    if (propType !== 'All' && p.propertyType !== propType) return false;
    if (bedrooms !== 'Any') {
      if (bedrooms === '4+' && p.bedrooms < 4) return false;
      if (bedrooms !== '4+' && p.bedrooms !== parseInt(bedrooms)) return false;
    }
    if (bathrooms !== 'Any') {
      if (bathrooms === '3+' && p.bathrooms < 3) return false;
      if (bathrooms !== '3+' && p.bathrooms !== parseInt(bathrooms)) return false;
    }
    if (priceRange !== 'Any') {
      const n = p.pricePerNight;
      if (priceRange === 'Under $100' && n >= 100) return false;
      if (priceRange === '$100-$200' && (n < 100 || n > 200)) return false;
      if (priceRange === '$200-$300' && (n < 200 || n > 300)) return false;
      if (priceRange === 'Over $300' && n <= 300) return false;
    }
    return true;
  }).sort((a, b) => (a.isPoweredByDoHuub === b.isPoweredByDoHuub ? 0 : a.isPoweredByDoHuub ? -1 : 1));

  const activeCount = [propType !== 'All', bedrooms !== 'Any', bathrooms !== 'Any', priceRange !== 'Any'].filter(Boolean).length;
  const clearFilters = () => { setPropType('All'); setBedrooms('Any'); setBathrooms('Any'); setPriceRange('Any'); };

  const Chips = ({ options, value, onSelect }: { options: string[]; value: string; onSelect: (v: string) => void }) => (
    <View style={styles.chipRow}>
      {options.map(o => (
        <TouchableOpacity key={o} style={[styles.chip, value === o && styles.chipActive]} onPress={() => onSelect(o)}>
          <Text style={[styles.chipText, value === o && styles.chipActiveText]}>{o}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const goToDetail = (item: Property) => {
    router.push({ pathname: '/services/rentals/[id]', params: {
      id: item.id, name: item.name, location: item.location,
      pricePerNight: item.pricePerNight, pricePerWeek: item.pricePerWeek, pricePerMonth: item.pricePerMonth,
      rating: item.rating, reviews: item.reviews, bedrooms: item.bedrooms, bathrooms: item.bathrooms,
      maxGuests: item.maxGuests, sqft: item.sqft, propertyType: item.propertyType,
      amenities: item.amenities.join(','), description: item.description,
      houseRules: item.houseRules.join('||'), isPoweredByDoHuub: String(item.isPoweredByDoHuub),
      imageIndex: item.image,
    } } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rental Properties</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShowFilters(true)}>
          <Ionicons name="options-outline" size={20} color={colors.text.primary} />
          {activeCount > 0 && <View style={styles.filterDot}><Text style={styles.filterDotText}>{activeCount}</Text></View>}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={TEAL} />
        </View>
      ) : (
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.countText}>{filtered.length} properties available</Text>}
        ListEmptyComponent={<Text style={[styles.countText, { textAlign: 'center', marginTop: 40 }]}>No rentals match your filters.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => goToDetail(item)}>
            <View style={styles.imgBox}>
              <Image source={item.remoteImage ? { uri: item.remoteImage } : FALLBACK_IMAGES[item.image]} style={styles.img} resizeMode="cover" />
              {item.isPoweredByDoHuub && (
                <View style={styles.dohuubBadge}><Text style={styles.dohuubBadgeText}>Powered by DoHuub</Text></View>
              )}
            </View>
            <View style={styles.cardBody}>
              <View style={styles.row}>
                <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={13} color="#FACC15" />
                  <Text style={styles.ratingVal}>{item.rating}</Text>
                  <Text style={styles.ratingCnt}>({item.reviews})</Text>
                </View>
              </View>
              <Text style={styles.locationTxt}>{item.location}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="bed-outline" size={13} color={colors.text.secondary} />
                <Text style={styles.metaTxt}>{item.bedrooms} bed</Text>
                <Ionicons name="water-outline" size={13} color={colors.text.secondary} />
                <Text style={styles.metaTxt}>{item.bathrooms} bath</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaTxt}>{item.propertyType}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceAmt}>${item.pricePerNight}</Text>
                <Text style={styles.priceLbl}> / night</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      )}

      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filters</Text>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.filterSectionLabel}>Property Type</Text>
              <Chips options={PROPERTY_TYPES} value={propType}   onSelect={setPropType} />
              <Text style={styles.filterSectionLabel}>Bedrooms</Text>
              <Chips options={BEDROOM_OPTS}   value={bedrooms}   onSelect={setBedrooms} />
              <Text style={styles.filterSectionLabel}>Bathrooms</Text>
              <Chips options={BATHROOM_OPTS}  value={bathrooms}  onSelect={setBathrooms} />
              <Text style={styles.filterSectionLabel}>Price per Night</Text>
              <Chips options={PRICE_RANGES}   value={priceRange} onSelect={setPriceRange} />
              {activeCount > 0 && (
                <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
                  <Text style={styles.clearBtnTxt}>Clear All Filters</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilters(false)}>
                <Text style={styles.applyBtnTxt}>Show {filtered.length} Properties</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.08)',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 3,
  },
  headerTitle: { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  iconBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  filterDot: { position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: 9, backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center' },
  filterDotText: { fontSize: 9, fontWeight: '700', color: '#FFF' },
  list: { padding: 20, gap: 16, paddingBottom: 32 },
  countText: { fontSize: fontSize.sm, color: colors.text.secondary, marginBottom: 4 },
  card: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(20,184,166,0.15)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  imgBox: { height: 200, backgroundColor: TEAL, overflow: 'hidden' },
  img: { width: '100%', height: '100%' },
  dohuubBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99 },
  dohuubBadgeText: { fontSize: 11, color: '#FFF', fontWeight: '600' },
  cardBody: { padding: 14 },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 },
  cardName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, flex: 1, marginRight: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingVal: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  ratingCnt: { fontSize: fontSize.sm, color: colors.text.secondary },
  locationTxt: { fontSize: fontSize.sm, color: colors.text.secondary, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 },
  metaTxt: { fontSize: fontSize.sm, color: colors.text.secondary },
  metaDot: { color: colors.text.secondary },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  priceAmt: { fontSize: 20, fontWeight: '700', color: TEAL },
  priceLbl: { fontSize: fontSize.sm, color: colors.text.secondary },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '82%' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  sheetTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  sheetContent: { padding: 20, paddingBottom: 40 },
  filterSectionLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginTop: 16, marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99, backgroundColor: '#F0F0F0' },
  chipActive: { backgroundColor: TEAL },
  chipText: { fontSize: fontSize.sm, color: colors.text.primary, fontWeight: '500' },
  chipActiveText: { color: '#FFF' },
  clearBtn: { marginTop: 20, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)', alignItems: 'center' },
  clearBtnTxt: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  applyBtn: { marginTop: 12, padding: 16, borderRadius: 14, backgroundColor: TEAL, alignItems: 'center' },
  applyBtnTxt: { fontSize: fontSize.sm, fontWeight: '700', color: '#FFF' },
});
