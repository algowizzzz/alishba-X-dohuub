import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../src/constants/theme';
import { useAuthStore } from '../../../../src/store/authStore';

const TIME_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

const getNextSevenDays = () => {
  const days = [];
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({ display: `${weekdays[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`, value: d.toISOString().split('T')[0] });
  }
  return days;
};

export default function BeautyBookingScreen() {
  const params = useLocalSearchParams<{ id: string; serviceName: string; servicePrice: string; duration: string; providerName: string; isPoweredByDoHuub: string }>();
  const isPoweredByDoHuub = params.isPoweredByDoHuub === 'true';
  const priceValue = parseFloat((params.servicePrice || '$0').replace('$', ''));

  const { addresses } = useAuthStore();
  const defaultAddress = addresses?.[0] ?? null;

  const [step, setStep] = useState<'booking' | 'confirm'>('booking');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [refNumber] = useState(`BS${Date.now().toString().slice(-8)}`);

  const availableDates = getNextSevenDays();
  const isFormValid = selectedDate && selectedTime;
  const pointsToEarn = Math.floor(priceValue);

  // ── CONFIRMATION ──────────────────────────────────────────────────────────
  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <View style={styles.successHeader}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark-circle" size={64} color="#FFF" />
            </View>
            <Text style={styles.successTitle}>Order Confirmed</Text>
            <Text style={styles.successSub}>Your beauty service has been successfully booked</Text>
          </View>

          <View style={{ padding: 24 }}>
            <View style={[styles.card, { alignItems: 'center', marginBottom: 20 }]}>
              <Text style={styles.orderNumLabel}>Order Number</Text>
              <Text style={styles.orderNum}>{refNumber}</Text>
            </View>

            {isPoweredByDoHuub && (
              <View style={styles.pointsEarnedCard}>
                <View style={styles.pointsEarnedRow}>
                  <Ionicons name="gift" size={28} color="#FFF" />
                  <Text style={styles.pointsEarnedNum}>+{pointsToEarn} Points!</Text>
                </View>
                <Text style={styles.pointsEarnedSub}>Added to your rewards wallet after service completion</Text>
                <TouchableOpacity onPress={() => router.push('/rewards' as any)} style={styles.viewRewardsBtn}>
                  <Text style={styles.viewRewardsBtnText}>View My Rewards</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.sectionTitle}>Booking Details</Text>
            <View style={[styles.card, { marginBottom: 16 }]}>
              <View style={styles.confirmServiceRow}>
                <Ionicons name="cut" size={40} color="#EC4899" />
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.confirmServiceName}>{params.serviceName}</Text>
                  <Text style={styles.confirmProvider}>{params.providerName}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Ionicons name="calendar" size={18} color={colors.primary} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailVal}>{availableDates.find(d => d.value === selectedDate)?.display || selectedDate}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="time" size={18} color={colors.primary} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.detailLabel}>Time</Text>
                  <Text style={styles.detailVal}>{selectedTime}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location" size={18} color={colors.primary} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.detailLabel}>Service Address</Text>
                  <Text style={styles.detailVal}>{defaultAddress?.label ?? 'Home'}</Text>
                  <Text style={styles.detailSub}>{defaultAddress?.street ?? '123 Main Street'}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.card, { marginBottom: 20 }]}>
              <View style={styles.detailRow}>
                <Ionicons name="card" size={18} color={colors.primary} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.detailLabel}>Payment Method</Text>
                  <Text style={styles.detailVal}>Card •••• 9012</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.priceRow}>
                <Text style={styles.priceLbl}>Price</Text>
                <Text style={styles.priceAmt}>{params.servicePrice}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>What's Next?</Text>
            {['Your order has been automatically accepted', 'Track your order status in real-time', 'Rate and review your experience after completion'].map((text, i) => (
              <View key={i} style={styles.nextItem}>
                <View style={styles.nextCircle}><Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}>{i + 1}</Text></View>
                <Text style={styles.nextText}>{text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(tabs)/bookings' as any)}>
            <Text style={styles.primaryBtnText}>Track Order Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn} onPress={() => router.push('/(tabs)/home' as any)}>
            <Text style={styles.outlineBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── BOOKING FORM ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Book Service</Text>
          <Text style={styles.headerSubtitle}>{params.providerName}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Service Summary */}
        <View style={[styles.card, { marginBottom: 20 }]}>
          <Text style={styles.serviceCardName}>{params.serviceName}</Text>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 4 }}>
            <Text style={styles.serviceCardMeta}>{params.duration}</Text>
            <Text style={[styles.serviceCardMeta, { color: colors.primary, fontWeight: '600' }]}>{params.servicePrice}</Text>
          </View>
        </View>

        {/* Select Date */}
        <Text style={styles.fieldLabel}>Select Date</Text>
        <TouchableOpacity style={styles.dropdownBtn} onPress={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}>
          <Ionicons name="calendar" size={20} color={colors.primary} />
          <Text style={[styles.dropdownText, !selectedDate && { color: colors.text.secondary }]}>
            {selectedDate ? availableDates.find(d => d.value === selectedDate)?.display : 'Choose a date'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
        {showDatePicker && (
          <View style={styles.dropdown}>
            {availableDates.map(date => (
              <TouchableOpacity key={date.value} style={[styles.dropdownItem, selectedDate === date.value && styles.dropdownItemSelected]} onPress={() => { setSelectedDate(date.value); setShowDatePicker(false); }}>
                <Text style={[styles.dropdownItemText, selectedDate === date.value && { color: colors.primary, fontWeight: '600' }]}>{date.display}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Select Time */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Select Time</Text>
        <TouchableOpacity style={styles.dropdownBtn} onPress={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}>
          <Ionicons name="time" size={20} color={colors.primary} />
          <Text style={[styles.dropdownText, !selectedTime && { color: colors.text.secondary }]}>{selectedTime || 'Choose a time'}</Text>
          <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
        {showTimePicker && (
          <View style={[styles.dropdown, { padding: 12 }]}>
            <View style={styles.timeGrid}>
              {TIME_SLOTS.map(time => (
                <TouchableOpacity key={time} style={[styles.timeSlot, selectedTime === time && styles.timeSlotActive]} onPress={() => { setSelectedTime(time); setShowTimePicker(false); }}>
                  <Text style={[styles.timeSlotText, selectedTime === time && { color: '#FFF' }]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Service Address */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Service Address</Text>
        <View style={styles.staticField}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.staticFieldTitle}>{defaultAddress?.label ?? 'Home'}</Text>
            <Text style={styles.staticFieldSub}>{defaultAddress?.street ?? 'Add an address in your profile'}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Payment Method</Text>
        <View style={styles.staticField}>
          <Ionicons name="card" size={20} color={colors.primary} />
          <Text style={[styles.staticFieldTitle, { marginLeft: 12 }]}>Card •••• 9012</Text>
        </View>

        {/* Price Summary */}
        <View style={[styles.card, { marginTop: 20 }]}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLbl}>Service Price</Text>
            <Text style={styles.priceAmt}>{params.servicePrice}</Text>
          </View>
          <Text style={[styles.staticFieldSub, { marginTop: 8 }]}>Final price will be confirmed by the service provider</Text>
        </View>

        {/* Points Banner */}
        {isPoweredByDoHuub && (
          <View style={styles.pointsBanner}>
            <View style={styles.pointsIconWrap}><Ionicons name="gift" size={20} color="#F59E0B" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pointsTitle}>Points you'll earn</Text>
              <Text style={styles.pointsSub}>1 point per $1 spent • Added after service completion</Text>
            </View>
            <Text style={styles.pointsAmt}>+{pointsToEarn} pts</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.primaryBtn, !isFormValid && styles.disabledBtn]} onPress={() => isFormValid && setStep('confirm')} disabled={!isFormValid}>
          <Text style={styles.primaryBtnText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
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
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(46,122,217,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  serviceCardName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  serviceCardMeta: { fontSize: fontSize.sm, color: colors.text.secondary },
  fieldLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 8 },
  dropdownBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(46,122,217,0.15)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  dropdownText: { flex: 1, fontSize: fontSize.sm, color: colors.text.primary },
  dropdown: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(46,122,217,0.15)', marginTop: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  dropdownItem: { paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  dropdownItemSelected: { backgroundColor: 'rgba(46,122,217,0.05)' },
  dropdownItemText: { fontSize: fontSize.sm, color: colors.text.primary },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeSlot: { width: '47%', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(46,122,217,0.15)', alignItems: 'center' },
  timeSlotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeSlotText: { fontSize: fontSize.sm, color: colors.text.primary, fontWeight: '500' },
  staticField: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(46,122,217,0.15)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  staticFieldTitle: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  staticFieldSub: { fontSize: fontSize.xs, color: colors.text.secondary, marginTop: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priceLbl: { fontSize: fontSize.sm, color: colors.text.primary },
  priceAmt: { fontSize: fontSize.sm, color: colors.text.primary },
  pointsBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)', borderRadius: 12, padding: 14, marginTop: 16 },
  pointsIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(245,158,11,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  pointsTitle: { fontSize: 13, fontWeight: '600', color: 'rgb(180,83,9)' },
  pointsSub: { fontSize: 11, color: 'rgb(217,119,6)', marginTop: 2 },
  pointsAmt: { fontSize: 15, fontWeight: '700', color: '#F59E0B' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, gap: 10, backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderTopColor: 'rgba(46,122,217,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 6 },
  primaryBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontSize: fontSize.md, fontWeight: '600' },
  outlineBtn: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(46,122,217,0.2)', backgroundColor: '#FFF' },
  outlineBtnText: { color: colors.text.primary, fontSize: fontSize.md, fontWeight: '500' },
  disabledBtn: { backgroundColor: '#E5E7EB' },
  // Confirmation
  successHeader: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 24 },
  successCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  successTitle: { fontSize: 20, fontWeight: '700', color: colors.text.primary, marginBottom: 8 },
  successSub: { fontSize: fontSize.sm, color: colors.text.secondary, textAlign: 'center' },
  orderNumLabel: { fontSize: fontSize.sm, color: colors.text.secondary, marginBottom: 4 },
  orderNum: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  pointsEarnedCard: { borderRadius: 12, padding: 20, marginBottom: 20, alignItems: 'center', backgroundColor: '#F59E0B', shadowColor: '#F59E0B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  pointsEarnedRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  pointsEarnedNum: { fontSize: 24, fontWeight: '700', color: '#FFF' },
  pointsEarnedSub: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: 12 },
  viewRewardsBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  viewRewardsBtnText: { color: '#FFF', fontSize: fontSize.sm, fontWeight: '600' },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, marginBottom: 12 },
  confirmServiceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  confirmServiceName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, marginBottom: 2 },
  confirmProvider: { fontSize: fontSize.sm, color: colors.text.secondary },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.07)', marginVertical: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  detailLabel: { fontSize: fontSize.xs, color: colors.text.secondary, marginBottom: 2 },
  detailVal: { fontSize: fontSize.sm, fontWeight: '500', color: colors.text.primary },
  detailSub: { fontSize: fontSize.xs, color: colors.text.secondary },
  nextItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  nextCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  nextText: { flex: 1, fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 20 },
});
