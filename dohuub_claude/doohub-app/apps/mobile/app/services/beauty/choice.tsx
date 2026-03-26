import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../src/constants/theme';

export default function BeautyChoiceScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Beauty Services and Products</Text>
          <Text style={styles.headerSubtitle}>Choose your preference</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => router.push('/services/beauty' as any)}>
          <Image source={require('../../../assets/beauty-services-icon.png')} style={styles.cardImg} resizeMode="contain" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Beauty Services</Text>
            <Text style={styles.cardDesc}>Book professional beauty services at your doorstep</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => router.push('/services/beauty/products' as any)}>
          <Image source={require('../../../assets/beauty-products.png')} style={styles.cardImg} resizeMode="contain" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Beauty Products</Text>
            <Text style={styles.cardDesc}>Shop cosmetics, skincare and beauty essentials</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
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
  content: { padding: 24, gap: 24 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 32, alignItems: 'center', gap: 16,
    borderWidth: 1, borderColor: 'rgba(236,72,153,0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  cardImg: { width: 80, height: 80 },
  cardText: { alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text.primary },
  cardDesc: { fontSize: fontSize.sm, color: colors.text.secondary, textAlign: 'center', lineHeight: 20 },
});
