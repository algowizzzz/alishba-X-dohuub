import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../src/constants/theme';

const TEAL = '#14B8A6';

const REVIEWS = [
  { id: '1',  name: 'John D.',      rating: 5, comment: 'Excellent property! Very clean and professional. The views were breathtaking.', date: '2 days ago' },
  { id: '2',  name: 'Sarah M.',     rating: 5, comment: 'Highly recommend! The location was perfect and the host was super responsive.', date: '1 week ago' },
  { id: '3',  name: 'Michael R.',   rating: 4, comment: 'Good stay overall. Would use again for our next trip to Dubai.', date: '2 weeks ago' },
  { id: '4',  name: 'Emma L.',      rating: 5, comment: 'Amazing experience from start to finish. Everything was spotless.', date: '3 weeks ago' },
  { id: '5',  name: 'David K.',     rating: 4, comment: 'Great value for the price. Very comfortable and well-equipped.', date: '1 month ago' },
  { id: '6',  name: 'Olivia P.',    rating: 5, comment: 'Absolutely loved it! Will definitely book again next time.', date: '1 month ago' },
  { id: '7',  name: 'James T.',     rating: 3, comment: 'Decent stay but check-in took longer than expected.', date: '2 months ago' },
  { id: '8',  name: 'Sophie W.',    rating: 5, comment: 'Stunning apartment with incredible views. Highly recommend.', date: '2 months ago' },
  { id: '9',  name: 'Lucas B.',     rating: 4, comment: 'Very nice property. The pool was a great bonus.', date: '3 months ago' },
  { id: '10', name: 'Isabella C.',  rating: 5, comment: 'Perfect in every way. Best rental we have ever stayed in.', date: '3 months ago' },
];

const FILTERS = ['All', '5★', '4★', '3★', '2★', '1★'];

export default function PropertyReviewsScreen() {
  const params = useLocalSearchParams<{ id: string; name: string }>();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? REVIEWS
    : REVIEWS.filter(r => r.rating === parseInt(activeFilter));

  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Reviews</Text>
          <Text style={styles.headerSub}>{params.name || 'Rental Property'}</Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.ratingSummary}>
              <Text style={styles.ratingBig}>{avgRating}</Text>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={22} color="#FACC15" />)}
              </View>
              <Text style={styles.ratingCount}>{REVIEWS.length} reviews</Text>
            </View>
            <View style={styles.filterRow}>
              {FILTERS.map(f => (
                <TouchableOpacity key={f} style={[styles.filterTab, activeFilter === f && styles.filterTabActive]} onPress={() => setActiveFilter(f)}>
                  <Text style={[styles.filterTabText, activeFilter === f && styles.filterTabTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Text style={styles.reviewName}>{item.name}</Text>
              <Text style={styles.reviewDate}>{item.date}</Text>
            </View>
            <View style={styles.starsRow}>
              {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={14} color={s <= item.rating ? '#FACC15' : '#E5E7EB'} />)}
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
          </View>
        )}
      />
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
  iconBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  headerSub: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  list: { padding: 20, gap: 12 },
  ratingSummary: { alignItems: 'center', padding: 24, backgroundColor: '#FFF', borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(20,184,166,0.15)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  ratingBig: { fontSize: 52, fontWeight: '700', color: colors.text.primary },
  starsRow: { flexDirection: 'row', gap: 3, marginVertical: 6 },
  ratingCount: { fontSize: fontSize.sm, color: colors.text.secondary },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  filterTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  filterTabActive: { backgroundColor: TEAL, borderColor: TEAL },
  filterTabText: { fontSize: 13, color: colors.text.secondary, fontWeight: '500' },
  filterTabTextActive: { color: '#FFF' },
  reviewCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(20,184,166,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  reviewDate: { fontSize: fontSize.xs, color: colors.text.secondary },
  reviewComment: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 19, marginTop: 6 },
});
