import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../src/constants/theme';
import { ServiceSearchBar } from '../../../src/components/ui/ServiceSearchBar';

const TEAL = '#14B8A6';

const IMAGES = [
  require('../../../assets/rental-1.png'),
  require('../../../assets/rental-2.png'),
  require('../../../assets/rental-3.png'),
  require('../../../assets/rental-4.png'),
];

const PROPERTIES = [
  { id: '1', name: 'Luxury Downtown Apartment', location: 'Manhattan, New York, NY',   pricePerNight: 150, pricePerWeek: 950,  pricePerMonth: 3500, rating: 4.9, reviews: 234, bedrooms: 2, bathrooms: 1, maxGuests: 4, sqft: 1200, propertyType: 'Apartment', amenities: ['WiFi','Parking','Pool','AC','Kitchen','TV'],                          description: 'Stunning city views from this modern apartment. Perfect for families or couples seeking a luxurious stay.', houseRules: ['No smoking inside','No parties or events','Check-in after 3 PM'],           isPoweredByDoHuub: true,  image: 0 },
  { id: '2', name: 'Cozy Studio Near Central Park', location: 'Upper West Side, New York, NY', pricePerNight: 140, pricePerWeek: 880,  pricePerMonth: 3200, rating: 4.8, reviews: 189, bedrooms: 1, bathrooms: 1, maxGuests: 2, sqft: 600,  propertyType: 'Studio',    amenities: ['WiFi','AC','Kitchen','TV'],                                         description: 'Cozy studio steps from Central Park. Walking distance to top restaurants and attractions.',               houseRules: ['No smoking','Quiet hours after 10 PM','No pets'],                        isPoweredByDoHuub: true,  image: 1 },
  { id: '3', name: 'Modern Loft in Brooklyn',       location: 'Brooklyn, New York, NY',  pricePerNight: 120, pricePerWeek: 750,  pricePerMonth: 2800, rating: 4.7, reviews: 97,  bedrooms: 2, bathrooms: 1, maxGuests: 4, sqft: 1000, propertyType: 'Loft',      amenities: ['WiFi','Parking','AC','Kitchen','Washer','TV'],                               description: 'Stylish loft in the heart of Brooklyn with exposed brick and modern amenities.',              houseRules: ['No smoking inside','No parties','Pets allowed with prior approval'],   isPoweredByDoHuub: false, image: 2 },
  { id: '4', name: 'Spacious Family Home',          location: 'Queens, New York, NY',    pricePerNight: 200, pricePerWeek: 1250, pricePerMonth: 4500, rating: 4.6, reviews: 143, bedrooms: 3, bathrooms: 2, maxGuests: 6, sqft: 1800, propertyType: 'House',     amenities: ['WiFi','Parking','AC','Kitchen','Washer','TV'],                               description: 'Spacious family home with backyard. Perfect for larger groups.',               houseRules: ['No smoking inside','Check-out by 11 AM','No events'],                  isPoweredByDoHuub: false, image: 3 },
  { id: '5', name: 'Midtown Executive Suite',       location: 'Midtown, New York, NY',   pricePerNight: 180, pricePerWeek: 1100, pricePerMonth: 4000, rating: 4.5, reviews: 256, bedrooms: 1, bathrooms: 1, maxGuests: 2, sqft: 750,  propertyType: 'Apartment', amenities: ['WiFi','AC','Kitchen','TV','Parking'],                                        description: 'Modern executive suite in Midtown Manhattan. Ideal for business travellers.',                      houseRules: ['No smoking','No parties','No pets'],                                   isPoweredByDoHuub: false, image: 0 },
];

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
  const [search, setSearch] = useState('');

  const filtered = PROPERTIES.filter(p => {
    const q = search.trim().toLowerCase();
    if (q && !p.name.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q) && !p.propertyType.toLowerCase().includes(q)) {
      return false;
    }
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

  const goToDetail = (item: typeof PROPERTIES[0]) => {
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

      <ServiceSearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search properties..."
      />

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={<Text style={styles.countText}>{filtered.length} properties available</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => goToDetail(item)}>
            <View style={styles.imgBox}>
              <Image source={IMAGES[item.image]} style={styles.img} resizeMode="cover" />
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
