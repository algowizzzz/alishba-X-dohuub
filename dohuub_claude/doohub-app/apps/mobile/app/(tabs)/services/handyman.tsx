import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing, borderRadius } from '../../../src/constants/theme';

const YELLOW = '#EAB308';

const VENDORS = [
  { id: '1', name: 'DoHuub Official',     tagline: 'Trusted, verified handyman services across all categories.',          rating: 4.9, reviews: 1247, isPowered: true,  image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop' },
  { id: '2', name: 'The Handyman Hub',    tagline: 'One-stop solution for all home repair needs with 15+ years experience.', rating: 4.9, reviews: 401,  isPowered: false, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop' },
  { id: '3', name: 'Home Repair Masters', tagline: 'Specializes in general repairs, painting, and furniture assembly.',     rating: 4.8, reviews: 256,  isPowered: false, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop' },
  { id: '4', name: 'Quick Fix Services',  tagline: 'Fast and efficient solutions for appliance repairs and installations.',  rating: 4.7, reviews: 189,  isPowered: false, image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&h=200&fit=crop' },
];

export default function HandymanServicesScreen() {
  const goToDetail = (item: typeof VENDORS[0]) => {
    router.push({ pathname: '/services/handyman/[id]', params: { id: item.id } } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Handyman Services</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={VENDORS}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => goToDetail(item)} activeOpacity={0.8}>
            <Image source={{ uri: item.image }} style={styles.iconBox} resizeMode="cover" />
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{item.name}</Text>
                {item.isPowered && (
                  <View style={styles.poweredBadge}>
                    <Text style={styles.poweredTxt}>Powered by DoHuub</Text>
                  </View>
                )}
              </View>
              <Text style={styles.tagline} numberOfLines={2}>{item.tagline}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingVal}>{item.rating}</Text>
                <Text style={styles.ratingCnt}>({item.reviews})</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.08)',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 3,
  },
  backBtn: { padding: spacing.xs, width: 36 },
  headerTitle: { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, textAlign: 'center' },
  list: { padding: spacing.lg, gap: 12, paddingBottom: 32 },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: '#FFF', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  iconBox: {
    width: 72, height: 72, borderRadius: 12,
    overflow: 'hidden', flexShrink: 0,
  },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  name: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  poweredBadge: { backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 },
  poweredTxt: { fontSize: 10, color: '#FFF', fontWeight: '600' },
  tagline: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 18, marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingVal: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  ratingCnt: { fontSize: fontSize.sm, color: colors.text.secondary },
});
