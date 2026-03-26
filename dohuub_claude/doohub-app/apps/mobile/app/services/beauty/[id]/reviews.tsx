import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../src/constants/theme';

const MOCK_REVIEWS = [
  { id: '1',  userName: 'Sarah M.',    rating: 5, comment: 'Absolutely amazing service! Very professional and the results were stunning. Highly recommend!', date: '2 days ago' },
  { id: '2',  userName: 'Emily J.',    rating: 5, comment: "Best beauty service I've ever had. The attention to detail was incredible.", date: '1 week ago' },
  { id: '3',  userName: 'Jessica B.',  rating: 4, comment: 'Great service overall. Very satisfied with the results.', date: '2 weeks ago' },
  { id: '4',  userName: 'Amanda R.',   rating: 5, comment: 'So happy with my results! The beautician was very skilled and professional.', date: '3 weeks ago' },
  { id: '5',  userName: 'Laura K.',    rating: 4, comment: 'Good service, arrived on time and did a great job.', date: '1 month ago' },
  { id: '6',  userName: 'Michelle T.', rating: 5, comment: 'Exceeded my expectations. Will definitely book again!', date: '1 month ago' },
  { id: '7',  userName: 'Natalie P.',  rating: 3, comment: 'Service was okay, but took longer than expected.', date: '2 months ago' },
  { id: '8',  userName: 'Sophia W.',   rating: 5, comment: 'Absolutely loved the results. Very professional team.', date: '2 months ago' },
  { id: '9',  userName: 'Caroline H.', rating: 4, comment: 'Really happy with the outcome. Would recommend.', date: '3 months ago' },
  { id: '10', userName: 'Olivia G.',   rating: 5, comment: 'Perfect experience from start to finish!', date: '3 months ago' },
];

const FILTER_TABS = ['All', '5★', '4★', '3★', '2★', '1★'];

export default function BeautyReviewsScreen() {
  const params = useLocalSearchParams<{ id: string; name: string }>();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredReviews = activeFilter === 'All'
    ? MOCK_REVIEWS
    : MOCK_REVIEWS.filter(r => r.rating === parseInt(activeFilter));

  const avgRating = (MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Reviews</Text>
          <Text style={styles.headerSubtitle}>{params.name || 'Beauty Services'}</Text>
        </View>
      </View>

      <FlatList
        data={filteredReviews}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Rating Summary */}
            <View style={styles.ratingSummary}>
              <Text style={styles.ratingBig}>{avgRating}</Text>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={20} color="#FACC15" />)}
              </View>
              <Text style={styles.ratingCount}>{MOCK_REVIEWS.length} reviews</Text>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterRow}>
              {FILTER_TABS.map(tab => (
                <TouchableOpacity key={tab} style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]} onPress={() => setActiveFilter(tab)}>
                  <Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Text style={styles.reviewName}>{item.userName}</Text>
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
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.08)',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 3,
  },
  backBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  headerSubtitle: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  list: { padding: 20, gap: 12 },
  ratingSummary: { alignItems: 'center', padding: 24, backgroundColor: '#FFF', borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(46,122,217,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  ratingBig: { fontSize: 48, fontWeight: '700', color: colors.text.primary },
  starsRow: { flexDirection: 'row', gap: 3, marginVertical: 6 },
  ratingCount: { fontSize: fontSize.sm, color: colors.text.secondary },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  filterTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  filterTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterTabText: { fontSize: 13, color: colors.text.secondary, fontWeight: '500' },
  filterTabTextActive: { color: '#FFF' },
  reviewCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(46,122,217,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  reviewDate: { fontSize: fontSize.xs, color: colors.text.secondary },
  reviewComment: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 19, marginTop: 6 },
});
