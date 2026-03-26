import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../src/constants/theme';

const MOCK_REVIEWS = [
  { name: 'Sarah M.', date: '2 days ago', rating: 5, comment: 'Great selection of fresh produce! Everything was well-packaged and delivery was fast.', ordered: 'Fruits & Vegetables', photos: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop'] },
  { name: 'David R.', date: '5 days ago', rating: 5, comment: 'My go-to grocery store for online orders. Always fresh and prices are great.', ordered: 'Dairy & Bakery', photos: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop'] },
  { name: 'Priya K.', date: '1 week ago', rating: 4, comment: 'Good variety but one item was substituted. Still happy with the service overall.', ordered: 'Mixed groceries' },
];

export default function GroceryProfileScreen() {
  const params = useLocalSearchParams<{ id: string; name: string; type: string; rating: string; reviewCount: string; isPoweredByDoHuub: string }>();
  const vendorName = params.name || 'Grocery Store';
  const vendorType = params.type || 'Supermarket';
  const isPoweredByDoHuub = params.isPoweredByDoHuub === 'true';
  const rating = parseFloat(params.rating || '4.7');
  const reviewCount = parseInt(params.reviewCount || '100', 10);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Store Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Store Header */}
        <View style={styles.storeHeader}>
          <View style={styles.storeIcon}>
            <Ionicons name="storefront" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.storeName}>{vendorName}</Text>
          {isPoweredByDoHuub && (
            <View style={styles.dohuubBadge}>
              <Text style={styles.dohuubBadgeText}>Powered by DoHuub</Text>
            </View>
          )}
          <Text style={styles.storeType}>{vendorType}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color="#FACC15" />
            <Text style={styles.ratingText}>{rating}</Text>
            <Text style={styles.reviewCountText}>({reviewCount} reviews)</Text>
          </View>
          <Text style={styles.deliveryInfo}>30-50 min • Free delivery over $35</Text>
        </View>

        <View style={styles.body}>
          {/* About */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About</Text>
            <Text style={styles.cardBody}>
              {vendorName} offers a wide selection of fresh produce, dairy, bakery items, and household essentials. We source our products locally whenever possible to ensure freshness and support the community.
            </Text>
          </View>

          {/* Store Info */}
          <Text style={styles.sectionTitle}>Store Information</Text>
          <View style={styles.infoCard}>
            <Ionicons name="location" size={20} color="#10B981" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.infoLabel}>456 Market Street</Text>
              <Text style={styles.infoSub}>New York, NY 10002</Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="time" size={20} color="#10B981" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.infoLabel}>Delivery Hours</Text>
              <Text style={styles.infoSub}>8:00 AM - 10:00 PM Daily</Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="cube" size={20} color="#10B981" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.infoLabel}>Minimum Order</Text>
              <Text style={styles.infoSub}>$15.00 • Free delivery over $35</Text>
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews & Ratings</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/services/grocery/reviews', params: { id: params.id, name: vendorName, rating: String(rating), reviewCount: String(reviewCount) } } as any)}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ratingCard}>
            <View style={styles.ratingLeft}>
              <Text style={styles.ratingBig}>{rating}</Text>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={14} color="#FACC15" />)}
              </View>
              <Text style={styles.reviewCount}>{reviewCount} reviews</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              {[5,4,3,2,1].map(star => (
                <View key={star} style={styles.barRow}>
                  <Text style={styles.barLabel}>{star}</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${star === 5 ? 75 : star === 4 ? 18 : 7}%` as any }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {MOCK_REVIEWS.map((review, i) => (
            <View key={i} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewAvatar}>
                  <Ionicons name="person" size={18} color={colors.text.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.reviewNameRow}>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <View style={styles.starsRow}>
                    {[1,2,3,4,5].map(s => (
                      <Ionicons key={s} name="star" size={12} color={s <= review.rating ? '#FACC15' : '#E5E7EB'} />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              {(review as any).photos && (review as any).photos.length > 0 && (
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 8, marginBottom: 4 }}>
                  {(review as any).photos.map((photo: string, i: number) => (
                    <Image key={i} source={{ uri: photo }} style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden' }} resizeMode="cover" />
                  ))}
                </View>
              )}
              <Text style={styles.reviewOrdered}>Ordered: {review.ordered}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => router.push({ pathname: '/services/grocery/[id]', params: { id: params.id, name: vendorName, isPoweredByDoHuub: String(isPoweredByDoHuub) } } as any)}
        >
          <Text style={styles.shopBtnText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16,185,129,0.1)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  storeHeader: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 24 },
  storeIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  storeName: { fontSize: 20, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  dohuubBadge: { backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, marginBottom: 6 },
  dohuubBadgeText: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },
  storeType: { fontSize: 14, color: '#6B7280', marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  ratingText: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  reviewCountText: { fontSize: 13, color: '#6B7280' },
  deliveryInfo: { fontSize: 13, color: '#6B7280' },
  body: { paddingHorizontal: 20, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 8 },
  cardBody: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A2E', marginTop: 4 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  infoLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  infoSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  viewAllLink: { fontSize: 13, color: '#10B981', fontWeight: '600' },
  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ratingLeft: { alignItems: 'center' },
  ratingBig: { fontSize: 36, fontWeight: '700', color: '#1A1A2E' },
  starsRow: { flexDirection: 'row', gap: 2, marginVertical: 4 },
  reviewCount: { fontSize: 11, color: '#6B7280' },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barLabel: { fontSize: 12, color: '#6B7280', width: 10 },
  barBg: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, backgroundColor: '#10B981' },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewNameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  reviewName: { fontSize: 13, fontWeight: '600', color: '#1A1A2E' },
  reviewDate: { fontSize: 11, color: '#6B7280' },
  reviewComment: { fontSize: 13, color: '#6B7280', lineHeight: 19, marginBottom: 6 },
  reviewOrdered: { fontSize: 11, color: '#9CA3AF' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(16,185,129,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 6,
  },
  shopBtn: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  shopBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
