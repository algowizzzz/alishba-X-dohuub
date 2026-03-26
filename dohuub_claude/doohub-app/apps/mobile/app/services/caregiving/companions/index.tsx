import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Modal, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../src/constants/theme';

const PINK = '#EC4899';

const COMPANIONS = [
  { id: '1', name: 'Maria Garcia',     rating: 4.9, reviews: 187, hourlyRate: 35, yearsExperience: 8,  specialties: ['Dementia Care', 'Mobility Assistance', 'Medication Management'], isPoweredByDoHuub: true,  bio: 'Certified caregiver with extensive experience in senior care and companionship', certifications: ['Certified Nursing Assistant', 'CPR & First Aid', 'Dementia Care Specialist'], languages: ['English', 'Spanish'], image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop' },
  { id: '2', name: 'Patricia Johnson', rating: 4.8, reviews: 156, hourlyRate: 32, yearsExperience: 6,  specialties: ['Personal Care', 'Meal Preparation', 'Light Housekeeping'],            isPoweredByDoHuub: true,  bio: 'Compassionate caregiver dedicated to improving quality of life for seniors', certifications: ['Certified Home Health Aide', 'CPR & First Aid'], languages: ['English'], image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop' },
  { id: '3', name: 'Susan Williams',   rating: 4.7, reviews: 134, hourlyRate: 30, yearsExperience: 5,  specialties: ['Companionship', 'Activities & Games', 'Transportation'],              isPoweredByDoHuub: false, bio: 'Friendly and patient companion specializing in social engagement', certifications: ['CPR & First Aid', 'Senior Companion Certification'], languages: ['English'], image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop' },
  { id: '4', name: 'Jennifer Martinez',rating: 4.9, reviews: 201, hourlyRate: 38, yearsExperience: 10, specialties: ["Alzheimer's Care", 'End-of-Life Care', 'Physical Therapy Support'],  isPoweredByDoHuub: false, bio: 'Experienced caregiver with special training in memory care and rehabilitation', certifications: ['Licensed Practical Nurse', "Alzheimer's Care Specialist", 'CPR & First Aid'], languages: ['English', 'Spanish', 'French'], image: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=200&h=200&fit=crop' },
];

const ALL_SPECIALTIES = [...new Set(COMPANIONS.flatMap(c => c.specialties))];

export default function CompanionsListScreen() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [minExperience, setMinExperience] = useState('');

  const toggleSpecialty = (s: string) =>
    setSelectedSpecialties(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const filtered = COMPANIONS.filter(c => {
    if (selectedSpecialties.length > 0 && !selectedSpecialties.some(s => c.specialties.includes(s))) return false;
    if (minExperience && c.yearsExperience < parseInt(minExperience)) return false;
    return true;
  }).sort((a, b) => (a.isPoweredByDoHuub === b.isPoweredByDoHuub ? 0 : a.isPoweredByDoHuub ? -1 : 1));

  const activeCount = selectedSpecialties.length + (minExperience ? 1 : 0);

  const goToDetail = (item: typeof COMPANIONS[0]) => {
    router.push({ pathname: '/services/caregiving/companions/[id]', params: {
      id: item.id, name: item.name, rating: item.rating, reviews: item.reviews,
      hourlyRate: item.hourlyRate, yearsExperience: item.yearsExperience,
      specialties: item.specialties.join('||'), isPoweredByDoHuub: String(item.isPoweredByDoHuub),
      bio: item.bio, certifications: item.certifications.join('||'),
      languages: item.languages.join(','),
    } } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Companions</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShowFilters(true)}>
          <Ionicons name="options-outline" size={20} color={colors.text.primary} />
          {activeCount > 0 && <View style={styles.filterDot}><Text style={styles.filterDotTxt}>{activeCount}</Text></View>}
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => goToDetail(item)} activeOpacity={0.8}>
            <View style={styles.cardRow}>
              <Image source={{ uri: item.image }} style={styles.companionImg} resizeMode="cover" />
              <View style={styles.cardInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.companionName}>{item.name}</Text>
                  {item.isPoweredByDoHuub && (
                    <View style={styles.dohuubBadge}><Text style={styles.dohuubBadgeTxt}>Powered by DoHuub</Text></View>
                  )}
                </View>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#FACC15" />
                  <Text style={styles.ratingVal}>{item.rating}</Text>
                  <Text style={styles.ratingCnt}>({item.reviews} reviews)</Text>
                </View>
                <Text style={styles.expTxt}>{item.yearsExperience} years experience</Text>
                <Text style={styles.priceText}>${item.hourlyRate}/hour</Text>
                <View style={styles.chipsRow}>
                  {item.specialties.slice(0, 2).map(s => (
                    <View key={s} style={styles.chip}><Text style={styles.chipTxt}>{s}</Text></View>
                  ))}
                  {item.specialties.length > 2 && (
                    <View style={styles.chipMore}><Text style={styles.chipMoreTxt}>+{item.specialties.length - 2}</Text></View>
                  )}
                </View>
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
            <ScrollView contentContainerStyle={styles.sheetContent}>
              <Text style={styles.filterLabel}>Specialties</Text>
              {ALL_SPECIALTIES.map(s => (
                <TouchableOpacity key={s} style={[styles.filterOption, selectedSpecialties.includes(s) && styles.filterOptionActive]} onPress={() => toggleSpecialty(s)}>
                  <Text style={[styles.filterOptionTxt, selectedSpecialties.includes(s) && styles.filterOptionTxtActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
              <Text style={[styles.filterLabel, { marginTop: 16 }]}>Experience Level</Text>
              {['3', '5', '8', '10'].map(y => (
                <TouchableOpacity key={y} style={[styles.filterOption, minExperience === y && styles.filterOptionActive]} onPress={() => setMinExperience(minExperience === y ? '' : y)}>
                  <Text style={[styles.filterOptionTxt, minExperience === y && styles.filterOptionTxtActive]}>{y}+ years experience</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.sheetBtns}>
                <TouchableOpacity style={styles.clearBtn} onPress={() => { setSelectedSpecialties([]); setMinExperience(''); }}>
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
  filterDot: { position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: 8, backgroundColor: PINK, alignItems: 'center', justifyContent: 'center' },
  filterDotTxt: { fontSize: 9, fontWeight: '700', color: '#FFF' },
  list: { padding: 20, gap: 14, paddingBottom: 32 },
  card: { backgroundColor: '#FFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  companionImg: { width: 64, height: 64, borderRadius: 32, overflow: 'hidden', flexShrink: 0 },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6, marginBottom: 4 },
  companionName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, flex: 1 },
  dohuubBadge: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, flexShrink: 0 },
  dohuubBadgeTxt: { fontSize: 10, color: '#FFF', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  ratingVal: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  ratingCnt: { fontSize: fontSize.sm, color: colors.text.secondary },
  expTxt: { fontSize: fontSize.xs, color: colors.text.secondary, marginBottom: 4 },
  priceText: { fontSize: fontSize.sm, fontWeight: '700', color: PINK, marginBottom: 6 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, backgroundColor: 'rgba(236,72,153,0.1)' },
  chipTxt: { fontSize: 11, color: '#DB2777' },
  chipMore: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, backgroundColor: '#F0F0F0' },
  chipMoreTxt: { fontSize: 11, color: colors.text.secondary },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '80%' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  sheetTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  sheetContent: { padding: 20, paddingBottom: 40 },
  filterLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 10 },
  filterOption: { padding: 12, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#F5F5F5', marginBottom: 8 },
  filterOptionActive: { backgroundColor: 'rgba(236,72,153,0.1)', borderColor: PINK },
  filterOptionTxt: { fontSize: fontSize.sm, color: colors.text.primary },
  filterOptionTxtActive: { color: PINK, fontWeight: '600' },
  sheetBtns: { flexDirection: 'row', gap: 12, marginTop: 24 },
  clearBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', alignItems: 'center' },
  clearBtnTxt: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  applyBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: PINK, alignItems: 'center' },
  applyBtnTxt: { fontSize: fontSize.sm, fontWeight: '700', color: '#FFF' },
});
