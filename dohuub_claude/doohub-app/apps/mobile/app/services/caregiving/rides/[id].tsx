import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../src/constants/theme';

const PURPLE = '#A855F7';

const RIDE_PHOTOS: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=300&fit=crop',
  '2': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&h=300&fit=crop',
  '3': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&h=300&fit=crop',
  '4': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=300&h=300&fit=crop',
};

const REVIEWS = [
  { name: 'Margaret T.', date: '1 week ago',  rating: 5, comment: 'Excellent service! The driver was very patient and helpful with my appointments.', photos: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&h=200&fit=crop'] },
  { name: 'Robert K.',   date: '2 weeks ago', rating: 5, comment: 'Very reliable and professional. Highly recommend for medical appointments.', photos: ['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=200&h=200&fit=crop'] },
  { name: 'Linda P.',    date: '3 weeks ago', rating: 4, comment: 'Good service overall. Could improve on punctuality.' },
];

export default function RideProviderDetailScreen() {
  const params = useLocalSearchParams<{
    id: string; name: string; rating: string; reviews: string; hourlyRate: string;
    vehicleTypes: string; wheelchairAccessible: string; isPoweredByDoHuub: string;
    description: string; coverageArea: string; specialFeatures: string;
  }>();

  const isPowered = params.isPoweredByDoHuub === 'true';
  const isWheelchair = params.wheelchairAccessible === 'true';
  const vehicleTypes = params.vehicleTypes ? params.vehicleTypes.split(',') : [];
  const specialFeatures = params.specialFeatures ? params.specialFeatures.split('||') : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Provider Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.providerHeader}>
          <Image
            source={{ uri: RIDE_PHOTOS[params.id] || RIDE_PHOTOS['1'] }}
            style={styles.avatarBox}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.providerName}>{params.name}</Text>
            {isPowered && <View style={styles.dohuubBadge}><Text style={styles.dohuubBadgeTxt}>Powered by DoHuub</Text></View>}
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FACC15" />
              <Text style={styles.ratingVal}>{params.rating}</Text>
              <Text style={styles.ratingCnt}>({params.reviews} reviews)</Text>
            </View>
          </View>
        </View>

        {isPowered && (
          <View style={styles.pointsBanner}>
            <View style={styles.pointsIcon}><Ionicons name="gift-outline" size={20} color="#FFF" /></View>
            <View>
              <Text style={styles.pointsTitle}>Earn ~{params.hourlyRate}+ points per ride</Text>
              <Text style={styles.pointsSub}>1 point per $1 spent • Points added after ride completion</Text>
            </View>
          </View>
        )}

        <View style={styles.pricingCard}>
          <Text style={styles.pricingLabel}>Hourly Rate</Text>
          <Text style={styles.pricingValue}>${params.hourlyRate}/hour</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.descTxt}>{params.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Available Vehicle Types</Text>
          {vehicleTypes.map(v => (
            <View key={v} style={styles.itemRow}>
              <Ionicons name="car-outline" size={18} color={PURPLE} />
              <Text style={styles.itemTxt}>{v}</Text>
            </View>
          ))}
        </View>

        {isWheelchair && (
          <View style={styles.card}>
            <View style={styles.itemRow}>
              <Ionicons name="accessibility-outline" size={22} color={PURPLE} />
              <View>
                <Text style={styles.itemBold}>Wheelchair Accessible</Text>
                <Text style={styles.itemSub}>Vehicles equipped for wheelchair access</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Special Features</Text>
          {specialFeatures.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureTxt}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Coverage Area</Text>
          <View style={styles.itemRow}>
            <Ionicons name="location-outline" size={18} color={PURPLE} />
            <Text style={styles.itemTxt}>{params.coverageArea}</Text>
          </View>
        </View>

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
        <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push({ pathname: '/services/caregiving/rides/[id]/book', params: { ...params } } as any)}>
          <Text style={styles.ctaBtnTxt}>Book Ride Service</Text>
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
  providerHeader: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  avatarBox: { width: 80, height: 80, borderRadius: 16, overflow: 'hidden', flexShrink: 0 },
  providerName: { fontSize: 20, fontWeight: '700', color: colors.text.primary, marginBottom: 4 },
  dohuubBadge: { alignSelf: 'flex-start', backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, marginBottom: 6 },
  dohuubBadgeTxt: { fontSize: 11, color: '#FFF', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingVal: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  ratingCnt: { fontSize: fontSize.sm, color: colors.text.secondary },
  pointsBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
  pointsIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center' },
  pointsTitle: { fontSize: fontSize.sm, fontWeight: '600', color: '#B45309' },
  pointsSub: { fontSize: fontSize.xs, color: '#D97706' },
  pricingCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, backgroundColor: 'rgba(168,85,247,0.1)', borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)' },
  pricingLabel: { fontSize: fontSize.sm, color: colors.text.secondary },
  pricingValue: { fontSize: 22, fontWeight: '700', color: PURPLE },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', gap: 8 },
  sectionTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text.primary, marginBottom: 2 },
  descTxt: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 20 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  itemTxt: { fontSize: fontSize.sm, color: colors.text.primary },
  itemBold: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  itemSub: { fontSize: fontSize.xs, color: colors.text.secondary },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: PURPLE, marginTop: 6, flexShrink: 0 },
  featureTxt: { fontSize: fontSize.sm, color: colors.text.secondary, flex: 1 },
  reviewCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  reviewDate: { fontSize: fontSize.xs, color: colors.text.secondary },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: 6 },
  reviewComment: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 18 },
  footer: { padding: 16, backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(168,85,247,0.15)' },
  ctaBtn: { backgroundColor: PURPLE, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  ctaBtnTxt: { color: '#FFF', fontSize: fontSize.sm, fontWeight: '700' },
});
