import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../src/constants/theme';

const PINK = '#EC4899';

const COMPANION_PHOTOS: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop',
  '2': 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop',
  '3': 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&h=300&fit=crop',
  '4': 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=300&h=300&fit=crop',
};

const REVIEWS = [
  { name: 'Emily R.', date: '1 week ago',  rating: 5, comment: 'Wonderful! Very caring and attentive to my mother\'s needs. Highly recommend.', photos: ['https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop'] },
  { name: 'David L.', date: '2 weeks ago', rating: 5, comment: 'Professional and compassionate. My father really enjoys the time spent together.', photos: ['https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop'] },
  { name: 'Carol B.', date: '3 weeks ago', rating: 4, comment: 'Very good service. Could improve on communication timing.' },
];

export default function CompanionDetailScreen() {
  const params = useLocalSearchParams<{
    id: string; name: string; rating: string; reviews: string; hourlyRate: string;
    yearsExperience: string; specialties: string; isPoweredByDoHuub: string;
    bio: string; certifications: string; languages: string;
  }>();

  const isPowered = params.isPoweredByDoHuub === 'true';
  const specialties = params.specialties ? params.specialties.split('||') : [];
  const certifications = params.certifications ? params.certifications.split('||') : [];
  const languages = params.languages ? params.languages.split(',') : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Companion Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <View style={styles.profileRow}>
          <Image
            source={{ uri: COMPANION_PHOTOS[params.id] || COMPANION_PHOTOS['1'] }}
            style={styles.avatarBox}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{params.name}</Text>
            {isPowered && <View style={styles.dohuubBadge}><Text style={styles.dohuubBadgeTxt}>Powered by DoHuub</Text></View>}
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FACC15" />
              <Text style={styles.ratingVal}>{params.rating}</Text>
              <Text style={styles.ratingCnt}>({params.reviews} reviews)</Text>
            </View>
            <Text style={styles.expTxt}>{params.yearsExperience} years of experience</Text>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.pricingCard}>
          <Text style={styles.pricingLabel}>Hourly Rate</Text>
          <Text style={styles.pricingValue}>${params.hourlyRate}/hour</Text>
        </View>

        {/* Points Banner */}
        {isPowered && (
          <View style={styles.pointsBanner}>
            <View style={styles.pointsIcon}><Ionicons name="gift-outline" size={20} color="#FFF" /></View>
            <View>
              <Text style={styles.pointsTitle}>Earn {params.hourlyRate} points per hour booked</Text>
              <Text style={styles.pointsSub}>1 point per $1 spent • Points added after service completion</Text>
            </View>
          </View>
        )}

        {/* About */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioTxt}>{params.bio}</Text>
        </View>

        {/* Certifications */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Certifications & Training</Text>
          {certifications.map((c, i) => (
            <View key={i} style={styles.certRow}>
              <Ionicons name="ribbon-outline" size={18} color={PINK} />
              <Text style={styles.certTxt}>{c}</Text>
            </View>
          ))}
        </View>

        {/* Specialties */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.chipsWrap}>
            {specialties.map(s => (
              <View key={s} style={styles.chip}><Text style={styles.chipTxt}>{s}</Text></View>
            ))}
          </View>
        </View>

        {/* Languages */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.langRow}>
            <Ionicons name="globe-outline" size={18} color={PINK} />
            <Text style={styles.langTxt}>{languages.join(', ')}</Text>
          </View>
        </View>

        {/* Reviews */}
        <Text style={styles.sectionTitle}>Reviews</Text>
        {REVIEWS.map((r, i) => (
          <View key={i} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Text style={styles.reviewName}>{r.name}</Text>
              <Text style={styles.reviewDate}>{r.date}</Text>
            </View>
            <View style={styles.starsRow}>
              {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={13} color={s <= r.rating ? '#FACC15' : '#E5E7EB'} />)}
            </View>
            <Text style={styles.reviewComment}>{r.comment}</Text>
            {(r as any).photos && (r as any).photos.length > 0 && (
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                {(r as any).photos.map((photo: string, i: number) => (
                  <Image key={i} source={{ uri: photo }} style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden' }} resizeMode="cover" />
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push({ pathname: '/services/caregiving/companions/[id]/book', params: { ...params } } as any)}>
          <Text style={styles.ctaBtnTxt}>Book Companion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'rgba(255,255,255,0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.08)', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 3 },
  headerTitle: { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  iconBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  scroll: { padding: 20, gap: 14, paddingBottom: 100 },
  profileRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  avatarBox: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', flexShrink: 0 },
  name: { fontSize: 20, fontWeight: '700', color: colors.text.primary, marginBottom: 4 },
  dohuubBadge: { alignSelf: 'flex-start', backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, marginBottom: 6 },
  dohuubBadgeTxt: { fontSize: 11, color: '#FFF', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  ratingVal: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  ratingCnt: { fontSize: fontSize.sm, color: colors.text.secondary },
  expTxt: { fontSize: fontSize.xs, color: colors.text.secondary },
  pricingCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, backgroundColor: 'rgba(236,72,153,0.1)', borderWidth: 1, borderColor: 'rgba(236,72,153,0.3)' },
  pricingLabel: { fontSize: fontSize.sm, color: colors.text.secondary },
  pricingValue: { fontSize: 22, fontWeight: '700', color: PINK },
  pointsBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
  pointsIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center' },
  pointsTitle: { fontSize: fontSize.sm, fontWeight: '600', color: '#B45309' },
  pointsSub: { fontSize: fontSize.xs, color: '#D97706' },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', gap: 8 },
  sectionTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text.primary, marginBottom: 2 },
  bioTxt: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 20 },
  certRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  certTxt: { fontSize: fontSize.sm, color: colors.text.primary },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, backgroundColor: 'rgba(236,72,153,0.1)' },
  chipTxt: { fontSize: fontSize.sm, color: '#DB2777' },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  langTxt: { fontSize: fontSize.sm, color: colors.text.primary },
  reviewCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  reviewDate: { fontSize: fontSize.xs, color: colors.text.secondary },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: 6 },
  reviewComment: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 18 },
  footer: { padding: 16, backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(236,72,153,0.15)' },
  ctaBtn: { backgroundColor: PINK, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  ctaBtnTxt: { color: '#FFF', fontSize: fontSize.sm, fontWeight: '700' },
});
