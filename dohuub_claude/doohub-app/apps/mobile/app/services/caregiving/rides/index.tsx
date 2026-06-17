import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Modal, ScrollView, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../src/constants/theme';
import { getRideListings } from '../../../../src/lib/queries';

const PURPLE = '#A855F7';

interface RideProvider {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  vehicleTypes: string[];
  wheelchairAccessible: boolean;
  isPoweredByDoHuub: boolean;
  description: string;
  coverageArea: string;
  specialFeatures: string[];
  image?: string;
}

const VEHICLE_TYPES = ['Standard', 'Wheelchair Accessible', 'Pet-Friendly'];

export default function RideProvidersScreen() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [providers, setProviders] = useState<RideProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const rows = await getRideListings();
        const mapped: RideProvider[] = (rows || []).map((r: any) => {
          const vendor = Array.isArray(r.Vendor) ? r.Vendor[0] : r.Vendor;
          const vehicleTypes = Array.isArray(r.vehicleTypes) ? r.vehicleTypes : [];
          return {
            id: r.id,
            name: r.title || vendor?.businessName || 'Ride Provider',
            rating: Number(vendor?.rating) || 0,
            reviews: Number(vendor?.reviewCount) || 0,
            hourlyRate: Number(r.hourlyRate) || 0,
            vehicleTypes,
            wheelchairAccessible: vehicleTypes.some((v: string) => /wheel/i.test(v)),
            isPoweredByDoHuub: Boolean(vendor?.isMichelle),
            description: r.description || '',
            coverageArea: r.coverageArea || '',
            specialFeatures: Array.isArray(r.specialFeatures) ? r.specialFeatures : [],
            image: r.image || (Array.isArray(r.images) ? r.images[0] : undefined),
          };
        });
        setProviders(mapped);
      } catch (e) {
        console.warn('Failed to load ride providers:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleVehicle = (v: string) =>
    setSelectedVehicles(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const filtered = providers.filter(p => {
    if (selectedVehicles.length > 0 && !selectedVehicles.some(v => p.vehicleTypes.includes(v))) return false;
    if (accessibleOnly && !p.wheelchairAccessible) return false;
    return true;
  }).sort((a, b) => (a.isPoweredByDoHuub === b.isPoweredByDoHuub ? 0 : a.isPoweredByDoHuub ? -1 : 1));

  const activeCount = selectedVehicles.length + (accessibleOnly ? 1 : 0);

  const goToDetail = (item: RideProvider) => {
    router.push({ pathname: '/services/caregiving/rides/[id]', params: {
      id: item.id, name: item.name, rating: item.rating, reviews: item.reviews,
      hourlyRate: item.hourlyRate, vehicleTypes: item.vehicleTypes.join(','),
      wheelchairAccessible: String(item.wheelchairAccessible), isPoweredByDoHuub: String(item.isPoweredByDoHuub),
      description: item.description, coverageArea: item.coverageArea,
      specialFeatures: item.specialFeatures.join('||'),
    } } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride Providers</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShowFilters(true)}>
          <Ionicons name="options-outline" size={20} color={colors.text.primary} />
          {activeCount > 0 && <View style={styles.filterDot}><Text style={styles.filterDotTxt}>{activeCount}</Text></View>}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={PURPLE} />
        </View>
      ) : (
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={{ color: colors.text.secondary, textAlign: 'center', marginTop: 40 }}>No ride providers found.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => goToDetail(item)} activeOpacity={0.8}>
            <View style={styles.cardRow}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.providerImg} resizeMode="cover" />
              ) : (
                <View style={[styles.providerImg, { backgroundColor: 'rgba(168,85,247,0.15)', alignItems: 'center', justifyContent: 'center' }]}>
                  <Ionicons name="car" size={28} color={PURPLE} />
                </View>
              )}
              <View style={styles.cardInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.providerName}>{item.name}</Text>
                  {item.isPoweredByDoHuub && (
                    <View style={styles.dohuubBadge}><Text style={styles.dohuubBadgeTxt}>Powered by DoHuub</Text></View>
                  )}
                </View>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#FACC15" />
                  <Text style={styles.ratingVal}>{item.rating}</Text>
                  <Text style={styles.ratingCnt}>({item.reviews} reviews)</Text>
                </View>
                <Text style={styles.priceText}>${item.hourlyRate}/hour</Text>
                <View style={styles.chipsRow}>
                  {item.vehicleTypes.map(v => (
                    <View key={v} style={styles.chip}><Text style={styles.chipTxt}>{v}</Text></View>
                  ))}
                </View>
                {item.wheelchairAccessible && (
                  <View style={styles.accessRow}>
                    <Text style={styles.accessTxt}>♿ Wheelchair Accessible</Text>
                  </View>
                )}
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
            <ScrollView contentContainerStyle={styles.sheetContent}>
              <Text style={styles.filterLabel}>Vehicle Type</Text>
              {VEHICLE_TYPES.map(v => (
                <TouchableOpacity key={v} style={[styles.filterOption, selectedVehicles.includes(v) && styles.filterOptionActive]} onPress={() => toggleVehicle(v)}>
                  <Text style={[styles.filterOptionTxt, selectedVehicles.includes(v) && styles.filterOptionTxtActive]}>{v}</Text>
                </TouchableOpacity>
              ))}
              <Text style={[styles.filterLabel, { marginTop: 16 }]}>Accessibility</Text>
              <TouchableOpacity style={[styles.filterOption, accessibleOnly && styles.filterOptionActive]} onPress={() => setAccessibleOnly(!accessibleOnly)}>
                <Text style={[styles.filterOptionTxt, accessibleOnly && styles.filterOptionTxtActive]}>Wheelchair Accessible Only</Text>
              </TouchableOpacity>
              <View style={styles.sheetBtns}>
                <TouchableOpacity style={styles.clearBtn} onPress={() => { setSelectedVehicles([]); setAccessibleOnly(false); }}>
                  <Text style={styles.clearBtnTxt}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilters(false)}>
                  <Text style={styles.applyBtnTxt}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'rgba(255,255,255,0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.08)', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 3 },
  headerTitle: { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  iconBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  filterDot: { position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: 8, backgroundColor: PURPLE, alignItems: 'center', justifyContent: 'center' },
  filterDotTxt: { fontSize: 9, fontWeight: '700', color: '#FFF' },
  list: { padding: 20, gap: 14, paddingBottom: 32 },
  card: { backgroundColor: '#FFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  providerImg: { width: 72, height: 72, borderRadius: 12, overflow: 'hidden', flexShrink: 0 },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6, marginBottom: 4 },
  providerName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, flex: 1 },
  dohuubBadge: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, flexShrink: 0 },
  dohuubBadgeTxt: { fontSize: 10, color: '#FFF', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  ratingVal: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  ratingCnt: { fontSize: fontSize.sm, color: colors.text.secondary },
  priceText: { fontSize: fontSize.sm, fontWeight: '700', color: PURPLE, marginBottom: 6 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 },
  chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, backgroundColor: 'rgba(168,85,247,0.1)' },
  chipTxt: { fontSize: 11, color: '#7C3AED' },
  accessRow: { marginTop: 2 },
  accessTxt: { fontSize: fontSize.xs, color: colors.text.secondary },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '80%' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  sheetTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  sheetContent: { padding: 20, paddingBottom: 40 },
  filterLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 10 },
  filterOption: { padding: 12, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#F5F5F5', marginBottom: 8 },
  filterOptionActive: { backgroundColor: 'rgba(168,85,247,0.1)', borderColor: PURPLE },
  filterOptionTxt: { fontSize: fontSize.sm, color: colors.text.primary },
  filterOptionTxtActive: { color: PURPLE, fontWeight: '600' },
  sheetBtns: { flexDirection: 'row', gap: 12, marginTop: 24 },
  clearBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', alignItems: 'center' },
  clearBtnTxt: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  applyBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: PURPLE, alignItems: 'center' },
  applyBtnTxt: { fontSize: fontSize.sm, fontWeight: '700', color: '#FFF' },
});
