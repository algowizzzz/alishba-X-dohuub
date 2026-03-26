import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../src/constants/theme';

const TEAL = '#14B8A6';

const HOST_REVIEWS = [
  { id: '1', name: 'John D.',   rating: 5, comment: 'Excellent host! Very responsive and helpful throughout the stay.' },
  { id: '2', name: 'Sarah M.',  rating: 5, comment: 'Sarah was amazing! Went above and beyond to make us feel welcome.' },
  { id: '3', name: 'Emily R.',  rating: 4, comment: 'Good communication and the property was exactly as described.' },
];

export default function HostProfileScreen() {
  const params = useLocalSearchParams<{ id: string; name: string; isPoweredByDoHuub: string }>();
  const isPowered = params.isPoweredByDoHuub === 'true';
  const hostName = isPowered ? 'DoHuub' : 'Sarah Johnson';
  const hostTitle = isPowered ? 'Professional Property Manager' : 'Superhost';
  const hostDesc = isPowered
    ? 'DoHuub is a professional property management company with years of experience in luxury short-term rentals. All properties are carefully maintained and managed to ensure the highest standards.'
    : 'Sarah is an experienced Superhost with 5+ years of hosting. She takes pride in providing exceptional experiences for every guest and is always available to help.';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Host Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Host Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarBox}>
            <Ionicons name={isPowered ? 'business' : 'person'} size={40} color="#FFF" />
          </View>
          <Text style={styles.hostName}>{isPowered ? 'Hosted by DoHuub' : `Hosted by ${hostName}`}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark-outline" size={14} color={TEAL} />
              <Text style={styles.badgeTxt}>{hostTitle}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{isPowered ? '100+' : '47'}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{isPowered ? '50+' : '3'}</Text>
              <Text style={styles.statLabel}>Properties</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.descTxt}>{hostDesc}</Text>
        </View>

        {/* Verification Badges */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Verified Information</Text>
          {['Identity verified', 'Email address', 'Phone number'].map(v => (
            <View key={v} style={styles.verifyRow}>
              <Ionicons name="checkmark-circle" size={18} color={TEAL} />
              <Text style={styles.verifyTxt}>{v}</Text>
            </View>
          ))}
        </View>

        {/* Reviews */}
        <Text style={styles.sectionTitle}>Reviews</Text>
        {HOST_REVIEWS.map(r => (
          <View key={r.id} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Text style={styles.reviewName}>{r.name}</Text>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={13} color={s <= r.rating ? '#FACC15' : '#E5E7EB'} />)}
              </View>
            </View>
            <Text style={styles.reviewComment}>{r.comment}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.contactBtn}>
          <Ionicons name="chatbubble-outline" size={18} color="#FFF" />
          <Text style={styles.contactBtnText}>Contact Host</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.08)',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 3,
  },
  headerTitle: { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  iconBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  profileHeader: { alignItems: 'center', padding: 24, backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(20,184,166,0.15)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  avatarBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  hostName: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary, marginBottom: 8 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99, backgroundColor: 'rgba(20,184,166,0.1)', borderWidth: 1, borderColor: 'rgba(20,184,166,0.25)' },
  badgeTxt: { fontSize: fontSize.xs, fontWeight: '600', color: TEAL },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '700', color: colors.text.primary },
  statLabel: { fontSize: fontSize.xs, color: colors.text.secondary },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(0,0,0,0.1)' },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  sectionTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text.primary, marginBottom: 10 },
  descTxt: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 20 },
  verifyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  verifyTxt: { fontSize: fontSize.sm, color: colors.text.primary },
  reviewCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(20,184,166,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  reviewName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  starsRow: { flexDirection: 'row', gap: 2 },
  reviewComment: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 18 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: TEAL, borderRadius: 14, paddingVertical: 16 },
  contactBtnText: { fontSize: fontSize.sm, fontWeight: '700', color: '#FFF' },
});
