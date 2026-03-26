import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../src/constants/theme';

const TEAL = '#14B8A6';

type Step = 'booking' | 'confirm';

const MOCK_ADDRESSES = [
  { id: '1', label: 'Home', street: '123 Main Street', city: 'Dubai', state: 'Dubai', zipCode: '00000', isDefault: true },
];
const MOCK_CARDS = [
  { id: '1', cardNumber: '4242424242429012', cardholderName: 'John Doe', isDefault: true },
];

export default function PropertyBookingScreen() {
  const params = useLocalSearchParams<{
    id: string; name: string; location: string; pricePerNight: string; isPoweredByDoHuub: string;
    checkIn: string; checkOut: string; duration: string; guests: string; specialRequests: string; totalPrice: string;
    [key: string]: string;
  }>();

  const [step, setStep] = useState<Step>('booking');
  const [selectedAddress] = useState(MOCK_ADDRESSES[0]);
  const [selectedCard, setSelectedCard] = useState(MOCK_CARDS[0]);
  const [showCardSheet, setShowCardSheet] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState(false);

  const isPowered = params.isPoweredByDoHuub === 'true';
  const totalPrice = parseFloat(params.totalPrice || '0');
  const pointsDiscount = redeemPoints ? Math.min(50, totalPrice * 0.1) : 0;
  const finalPrice = totalPrice - pointsDiscount;
  const pointsEarned = isPowered ? Math.floor(finalPrice) : 0;
  const refNum = `RP${Date.now().toString().slice(-8)}`;

  const fmtDate = (s: string) => {
    try { return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return s; }
  };

  // ─── CONFIRMATION SCREEN ──────────────────────────────────────────────────
  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.confirmScroll} showsVerticalScrollIndicator={false}>
          {/* Success */}
          <View style={styles.successCircle}>
            <Ionicons name="checkmark-circle" size={64} color="#FFF" />
          </View>
          <Text style={styles.successTitle}>Order Confirmed</Text>
          <Text style={styles.successSub}>Your rental property has been successfully booked</Text>

          {/* Order Number */}
          <View style={styles.orderNumCard}>
            <Text style={styles.orderNumLabel}>Order Number</Text>
            <Text style={styles.orderNum}>{refNum}</Text>
          </View>

          {/* Points Earned */}
          {isPowered && (
            <View style={styles.pointsEarnedCard}>
              <View style={styles.pointsEarnedTop}>
                <Ionicons name="gift" size={28} color="#FFF" />
                <Text style={styles.pointsEarnedAmt}>+{pointsEarned} Points!</Text>
              </View>
              <Text style={styles.pointsEarnedSub}>Added to your rewards wallet after stay completion</Text>
              <TouchableOpacity style={styles.viewRewardsBtn} onPress={() => router.push('/rewards' as any)}>
                <Text style={styles.viewRewardsBtnText}>View My Rewards</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Booking Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            <View style={styles.propRow}>
              <View style={styles.propImgBox}><Ionicons name="home" size={22} color="rgba(255,255,255,0.8)" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.propName}>{params.name}</Text>
                <Text style={styles.propLoc}>{params.location}</Text>
                {isPowered && <View style={styles.dohuubBadge}><Text style={styles.dohuubBadgeText}>Powered by DoHuub</Text></View>}
              </View>
            </View>
            <View style={[styles.divider, { marginTop: 12 }]}>
              <View style={styles.detailInfoRow}>
                <Ionicons name="calendar-outline" size={16} color={TEAL} />
                <View>
                  <Text style={styles.detailInfoLabel}>Check-in / Check-out</Text>
                  <Text style={styles.detailInfoValue}>{fmtDate(params.checkIn)} - {fmtDate(params.checkOut)}</Text>
                  <Text style={styles.detailInfoSub}>{params.duration}</Text>
                </View>
              </View>
              <View style={styles.detailInfoRow}>
                <Ionicons name="people-outline" size={16} color={TEAL} />
                <View>
                  <Text style={styles.detailInfoLabel}>Guests</Text>
                  <Text style={styles.detailInfoValue}>{params.guests} {parseInt(params.guests) === 1 ? 'guest' : 'guests'}</Text>
                </View>
              </View>
              {!!params.specialRequests && (
                <View style={styles.detailInfoRow}>
                  <Ionicons name="chatbubble-outline" size={16} color={TEAL} />
                  <View>
                    <Text style={styles.detailInfoLabel}>Special Requests</Text>
                    <Text style={styles.detailInfoValue}>{params.specialRequests}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Payment */}
          <View style={styles.payCard}>
            <View style={styles.detailInfoRow}>
              <Ionicons name="card-outline" size={16} color={TEAL} />
              <View>
                <Text style={styles.detailInfoLabel}>Payment Method</Text>
                <Text style={styles.detailInfoValue}>•••• {selectedCard.cardNumber.slice(-4)}</Text>
              </View>
            </View>
            <View style={[styles.divider, { marginTop: 10 }]}>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text></View>
              {redeemPoints && <View style={styles.summaryRow}><Text style={[styles.summaryLabel, { color: '#22C55E' }]}>Points Redeemed</Text><Text style={[styles.summaryValue, { color: '#22C55E' }]}>-${pointsDiscount.toFixed(2)}</Text></View>}
              <View style={[styles.summaryRow, styles.divider]}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>${finalPrice.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* What's Next */}
          <View style={styles.whatsNextCard}>
            <Text style={styles.sectionTitle}>What's Next?</Text>
            {[
              "Your order has been automatically accepted",
              "Track your order status in real-time",
              "Rate and review your experience after completion",
            ].map((s, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
                <Text style={styles.stepTxt}>{s}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/(tabs)/bookings' as any)}>
            <Text style={styles.ctaBtnText}>Track Order Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(tabs)' as any)}>
            <Text style={styles.secondaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── BOOKING SCREEN ───────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Property Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.propRow}>
            <View style={styles.propImgBox}><Ionicons name="home" size={22} color="rgba(255,255,255,0.8)" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.propName}>{params.name}</Text>
              <Text style={styles.propLoc}>{params.location}</Text>
              {isPowered && <View style={styles.dohuubBadge}><Text style={styles.dohuubBadgeText}>Powered by DoHuub</Text></View>}
            </View>
          </View>
          <View style={[styles.divider, { marginTop: 10 }]}>
            <View style={styles.summaryInfoRow}>
              <Ionicons name="calendar-outline" size={14} color={TEAL} />
              <Text style={styles.summaryInfoTxt}>{fmtDate(params.checkIn)} — {fmtDate(params.checkOut)}</Text>
            </View>
            <View style={styles.summaryInfoRow}>
              <Ionicons name="people-outline" size={14} color={TEAL} />
              <Text style={styles.summaryInfoTxt}>{params.guests} guests • {params.duration}</Text>
            </View>
          </View>
        </View>

        {/* Special Requests */}
        {!!params.specialRequests && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Special Requests</Text>
            <Text style={styles.detailInfoLabel}>{params.specialRequests}</Text>
          </View>
        )}

        {/* Billing Address */}
        <View>
          <Text style={styles.sectionTitle}>Billing Address</Text>
          <View style={styles.card}>
            <Text style={[styles.propName, { marginBottom: 3 }]}>{selectedAddress.label}</Text>
            <Text style={styles.propLoc}>{selectedAddress.street}, {selectedAddress.city} {selectedAddress.zipCode}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity style={styles.paymentRow} onPress={() => setShowCardSheet(true)}>
            <View style={styles.cardIconBox}><Ionicons name="card" size={20} color="#FFF" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.propName}>•••• {selectedCard.cardNumber.slice(-4)}</Text>
              <Text style={styles.propLoc}>{selectedCard.cardholderName}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Points Redemption */}
        {isPowered && (
          <View style={styles.redeemCard}>
            <View style={styles.redeemLeft}>
              <Ionicons name="gift-outline" size={18} color="#D97706" />
              <View>
                <Text style={styles.redeemTitle}>Redeem Points</Text>
                <Text style={styles.redeemSub}>500 pts available · Save up to $50</Text>
              </View>
            </View>
            <Switch value={redeemPoints} onValueChange={setRedeemPoints} trackColor={{ false: '#E5E7EB', true: '#FDE68A' }} thumbColor={redeemPoints ? '#D97706' : '#FFF'} />
          </View>
        )}

        {/* Price Summary */}
        <View style={styles.priceCard}>
          <Text style={styles.sectionTitle}>Total Amount</Text>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text></View>
          {redeemPoints && <View style={styles.summaryRow}><Text style={[styles.summaryLabel, { color: '#22C55E' }]}>Points Discount</Text><Text style={[styles.summaryValue, { color: '#22C55E' }]}>-${pointsDiscount.toFixed(2)}</Text></View>}
          <View style={[styles.summaryRow, styles.divider]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={[styles.totalValue, { fontSize: 22 }]}>${finalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {/* Points You'll Earn */}
        {isPowered && (
          <View style={styles.pointsPreviewCard}>
            <View style={styles.pointsPreviewRow}>
              <Ionicons name="gift-outline" size={18} color="#F59E0B" />
              <Text style={styles.pointsPreviewLabel}>Points you'll earn</Text>
            </View>
            <Text style={styles.pointsPreviewAmt}>+{Math.floor(finalPrice)} pts</Text>
            <Text style={styles.pointsPreviewSub}>1 point per $1 spent • Added after stay</Text>
          </View>
        )}

        {/* Terms */}
        <TouchableOpacity style={styles.termsRow} onPress={() => setAcceptedTerms(!acceptedTerms)}>
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms && <Ionicons name="checkmark" size={14} color="#FFF" />}
          </View>
          <Text style={styles.termsTxt}>I agree to the Terms & Conditions and House Rules</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaBtn, (!selectedAddress || !selectedCard || !acceptedTerms) && styles.ctaBtnDisabled]}
          onPress={() => setStep('confirm')}
          disabled={!selectedAddress || !selectedCard || !acceptedTerms}
        >
          <Text style={styles.ctaBtnText}>Confirm & Pay ${finalPrice.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>

      {/* Card Selection Sheet */}
      <Modal visible={showCardSheet} animationType="slide" transparent>
        <View style={styles.sheetOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Payment Card</Text>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setShowCardSheet(false)}>
                <Ionicons name="chevron-down" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={{ padding: 20, gap: 12 }}>
              {MOCK_CARDS.map(c => (
                <TouchableOpacity key={c.id} style={[styles.cardOption, selectedCard.id === c.id && styles.cardOptionSelected]} onPress={() => { setSelectedCard(c); setShowCardSheet(false); }}>
                  <Text style={styles.propName}>•••• {c.cardNumber.slice(-4)}</Text>
                  <Text style={styles.propLoc}>{c.cardholderName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
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
  confirmScroll: { padding: 20, gap: 16, paddingBottom: 32, alignItems: 'center' },
  summaryCard: { padding: 14, borderRadius: 12, backgroundColor: 'rgba(20,184,166,0.08)', borderWidth: 1, borderColor: 'rgba(20,184,166,0.25)' },
  propRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  propImgBox: { width: 64, height: 64, borderRadius: 10, backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  propName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 3 },
  propLoc: { fontSize: fontSize.xs, color: colors.text.secondary },
  dohuubBadge: { marginTop: 5, alignSelf: 'flex-start', backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  dohuubBadgeText: { fontSize: 10, color: '#FFF', fontWeight: '600' },
  divider: { borderTopWidth: 1, borderTopColor: 'rgba(20,184,166,0.25)', paddingTop: 10 },
  summaryInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  summaryInfoTxt: { fontSize: fontSize.xs, color: colors.text.secondary },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  sectionTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text.primary, marginBottom: 8 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  cardIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center' },
  redeemCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, backgroundColor: '#FFFBEB', borderRadius: 12, borderWidth: 1, borderColor: '#FDE68A' },
  redeemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  redeemTitle: { fontSize: fontSize.sm, fontWeight: '600', color: '#92400E' },
  redeemSub: { fontSize: fontSize.xs, color: '#B45309' },
  priceCard: { padding: 16, borderRadius: 12, backgroundColor: 'rgba(20,184,166,0.08)', borderWidth: 1, borderColor: 'rgba(20,184,166,0.25)' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  summaryLabel: { fontSize: fontSize.sm, color: colors.text.secondary },
  summaryValue: { fontSize: fontSize.sm, fontWeight: '500', color: colors.text.primary },
  totalLabel: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text.primary },
  totalValue: { fontSize: fontSize.md, fontWeight: '700', color: TEAL },
  pointsPreviewCard: { padding: 14, borderRadius: 12, backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
  pointsPreviewRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  pointsPreviewLabel: { fontSize: fontSize.sm, fontWeight: '600', color: '#B45309' },
  pointsPreviewAmt: { fontSize: 18, fontWeight: '700', color: '#F59E0B' },
  pointsPreviewSub: { fontSize: fontSize.xs, color: '#D97706', marginTop: 2 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  checkboxChecked: { backgroundColor: TEAL, borderColor: TEAL },
  termsTxt: { fontSize: fontSize.sm, color: colors.text.secondary, flex: 1, lineHeight: 20 },
  footer: { padding: 16, backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(20,184,166,0.15)', gap: 10 },
  ctaBtn: { backgroundColor: TEAL, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  ctaBtnDisabled: { opacity: 0.4 },
  ctaBtnText: { color: '#FFF', fontSize: fontSize.sm, fontWeight: '700' },
  secondaryBtn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)' },
  secondaryBtnText: { color: colors.text.primary, fontSize: fontSize.sm, fontWeight: '600' },
  // Sheet
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  sheetTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  cardOption: { padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', backgroundColor: '#FFF' },
  cardOptionSelected: { borderColor: TEAL, borderWidth: 2, backgroundColor: 'rgba(20,184,166,0.06)' },
  // Confirm screen
  successCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  successTitle: { fontSize: 22, fontWeight: '700', color: colors.text.primary },
  successSub: { fontSize: fontSize.sm, color: colors.text.secondary, textAlign: 'center', marginBottom: 8 },
  orderNumCard: { width: '100%', padding: 14, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', alignItems: 'center' },
  orderNumLabel: { fontSize: fontSize.xs, color: colors.text.secondary, marginBottom: 4 },
  orderNum: { fontSize: fontSize.md, fontWeight: '600', color: TEAL },
  pointsEarnedCard: { width: '100%', padding: 20, borderRadius: 14, backgroundColor: '#F59E0B', alignItems: 'center' },
  pointsEarnedTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  pointsEarnedAmt: { fontSize: 24, fontWeight: '700', color: '#FFF' },
  pointsEarnedSub: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.85)', marginBottom: 12 },
  viewRewardsBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.2)' },
  viewRewardsBtnText: { fontSize: fontSize.sm, fontWeight: '600', color: '#FFF' },
  detailsCard: { width: '100%', backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  detailInfoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  detailInfoLabel: { fontSize: fontSize.xs, color: colors.text.secondary, marginBottom: 2 },
  detailInfoValue: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  detailInfoSub: { fontSize: fontSize.xs, color: TEAL },
  payCard: { width: '100%', backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  whatsNextCard: { width: '100%', backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  stepNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: TEAL, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNumText: { fontSize: 12, fontWeight: '700', color: '#FFF' },
  stepTxt: { fontSize: fontSize.sm, color: colors.text.secondary, flex: 1, lineHeight: 20 },
});
