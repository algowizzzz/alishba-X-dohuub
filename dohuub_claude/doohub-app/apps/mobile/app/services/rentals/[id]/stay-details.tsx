import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../src/constants/theme';

const TEAL = '#14B8A6';

export default function PropertyStayDetailsScreen() {
  const params = useLocalSearchParams<{
    id: string; name: string; location: string; pricePerNight: string; maxGuests: string;
    checkIn: string; checkOut: string; duration: string; isPoweredByDoHuub: string;
    [key: string]: string;
  }>();

  const [adults,   setAdults]   = useState(1);
  const [children, setChildren] = useState(0);
  const [requests, setRequests] = useState('');

  const maxGuests = parseInt(params.maxGuests || '4');
  const totalGuests = adults + children;
  const pricePerNight = parseFloat(params.pricePerNight || '0');

  const fmtDate = (s: string) => {
    try { return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return s; }
  };

  const nights = (() => {
    try {
      const diff = new Date(params.checkOut).getTime() - new Date(params.checkIn).getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    } catch { return 1; }
  })();

  const nightlyRate = pricePerNight * nights;
  const cleaningFee = 50;
  const serviceFee = Math.round(nightlyRate * 0.1);
  const total = nightlyRate + cleaningFee + serviceFee;

  const doContinue = () => {
    router.push({ pathname: '/services/rentals/[id]/book', params: {
      ...params, guests: totalGuests, specialRequests: requests, totalPrice: total,
    } } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stay Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Property Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryImgBox}>
            <Ionicons name="home" size={28} color="rgba(255,255,255,0.8)" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryName}>{params.name}</Text>
            <Text style={styles.summaryLocation}>{params.location}</Text>
            <View style={styles.durationRow}>
              <Ionicons name="calendar-outline" size={14} color={TEAL} />
              <Text style={styles.durationTxt}>{params.duration}</Text>
            </View>
          </View>
        </View>

        {/* Your Dates */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Dates</Text>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Check-in</Text><Text style={styles.infoValue}>{fmtDate(params.checkIn)}</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Check-out</Text><Text style={styles.infoValue}>{fmtDate(params.checkOut)}</Text></View>
          <View style={[styles.infoRow, styles.dividerTop]}>
            <Text style={[styles.infoLabel, { fontWeight: '600', color: colors.text.primary }]}>Duration</Text>
            <Text style={[styles.infoValue, { color: TEAL, fontWeight: '700' }]}>{params.duration}</Text>
          </View>
        </View>

        {/* Guests */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Number of Guests</Text>
          {[
            { label: 'Adults', sub: 'Age 13+', count: adults, setCount: setAdults, min: 1 },
            { label: 'Children', sub: 'Age 2-12', count: children, setCount: setChildren, min: 0 },
          ].map(g => (
            <View key={g.label} style={styles.guestRow}>
              <View>
                <Text style={styles.guestLabel}>{g.label}</Text>
                <Text style={styles.guestSub}>{g.sub}</Text>
              </View>
              <View style={styles.counter}>
                <TouchableOpacity
                  style={[styles.counterBtn, g.count <= g.min && styles.counterBtnDisabled]}
                  onPress={() => g.setCount(Math.max(g.min, g.count - 1))}
                  disabled={g.count <= g.min}
                >
                  <Ionicons name="remove" size={16} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.counterNum}>{g.count}</Text>
                <TouchableOpacity
                  style={[styles.counterBtnActive, totalGuests >= maxGuests && styles.counterBtnDisabled]}
                  onPress={() => g.setCount(g.count + 1)}
                  disabled={totalGuests >= maxGuests}
                >
                  <Ionicons name="add" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <Text style={styles.maxGuestsTxt}>Maximum {maxGuests} guests allowed</Text>
        </View>

        {/* Special Requests */}
        <View>
          <Text style={styles.cardTitle}>Special Requests <Text style={{ color: colors.text.secondary, fontWeight: '400' }}>(Optional)</Text></Text>
          <TextInput
            style={styles.textarea}
            value={requests}
            onChangeText={setRequests}
            placeholder="Any special requests or requirements?"
            placeholderTextColor={colors.text.secondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Price Breakdown */}
        <View style={styles.priceCard}>
          <Text style={styles.cardTitle}>Price Breakdown</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>${pricePerNight} × {nights} {nights === 1 ? 'night' : 'nights'}</Text>
            <Text style={styles.infoValue}>${nightlyRate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cleaning fee</Text>
            <Text style={styles.infoValue}>${cleaningFee}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service fee</Text>
            <Text style={styles.infoValue}>${serviceFee}</Text>
          </View>
          <View style={[styles.infoRow, styles.dividerTop]}>
            <Text style={[styles.infoLabel, { fontWeight: '700', color: colors.text.primary }]}>Total</Text>
            <Text style={[styles.infoValue, { color: TEAL, fontWeight: '700', fontSize: 20 }]}>${total}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaBtn} onPress={doContinue}>
          <Text style={styles.ctaBtnText}>Continue to Booking</Text>
        </TouchableOpacity>
      </View>
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
  scroll: { padding: 20, gap: 16, paddingBottom: 32 },
  summaryCard: {
    flexDirection: 'row', gap: 12, padding: 14, borderRadius: 12,
    backgroundColor: 'rgba(20,184,166,0.08)', borderWidth: 1, borderColor: 'rgba(20,184,166,0.25)',
  },
  summaryImgBox: { width: 72, height: 72, borderRadius: 10, backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  summaryName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 3 },
  summaryLocation: { fontSize: fontSize.xs, color: colors.text.secondary, marginBottom: 6 },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  durationTxt: { fontSize: fontSize.xs, fontWeight: '600', color: TEAL },
  card: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  cardTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text.primary, marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  infoLabel: { fontSize: fontSize.sm, color: colors.text.secondary },
  infoValue: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  dividerTop: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)', marginTop: 4, paddingTop: 10 },
  guestRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  guestLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  guestSub: { fontSize: fontSize.xs, color: colors.text.secondary },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  counterBtnActive: { width: 38, height: 38, borderRadius: 19, backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center' },
  counterBtnDisabled: { opacity: 0.3 },
  counterNum: { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary, minWidth: 24, textAlign: 'center' },
  maxGuestsTxt: { fontSize: fontSize.xs, color: colors.text.secondary, marginTop: 4 },
  textarea: {
    marginTop: 8, padding: 14, borderRadius: 12, backgroundColor: '#FFF',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', fontSize: fontSize.sm,
    color: colors.text.primary, minHeight: 100,
  },
  priceCard: {
    padding: 16, borderRadius: 12,
    backgroundColor: 'rgba(20,184,166,0.08)', borderWidth: 1, borderColor: 'rgba(20,184,166,0.25)',
  },
  footer: { padding: 16, backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(20,184,166,0.15)' },
  ctaBtn: { backgroundColor: TEAL, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  ctaBtnText: { color: '#FFF', fontSize: fontSize.sm, fontWeight: '700' },
});
