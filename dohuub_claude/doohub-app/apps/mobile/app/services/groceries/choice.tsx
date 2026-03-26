import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../src/constants/theme';

export default function FoodGroceryChoiceScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Groceries & Food</Text>
          <Text style={styles.headerSubtitle}>Choose your category</Text>
        </View>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/services/groceries' as any)}
        >
          <Image source={require('../../../assets/food.png')} style={styles.cardImg} resizeMode="contain" />
          <Text style={styles.cardTitle}>Food</Text>
          <Text style={styles.cardDesc}>Order from restaurants and get food delivered to your door</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/services/groceries' as any)}
        >
          <Image source={require('../../../assets/grocery.png')} style={styles.cardImg} resizeMode="contain" />
          <Text style={styles.cardTitle}>Grocery</Text>
          <Text style={styles.cardDesc}>Shop fresh groceries and household essentials</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.08)',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 3,
  },
  backBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  headerSubtitle: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 1 },
  content: { flex: 1, padding: 20, gap: 16 },
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardImg: { width: 98, height: 98 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: colors.text.primary },
  cardDesc: { fontSize: fontSize.sm, color: colors.text.secondary, textAlign: 'center', lineHeight: 20 },
});
