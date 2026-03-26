import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Switch, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../../src/constants/theme';

const PINK = '#EC4899';

const ADDRESSES = [
  { id: '1', label: 'Home', address: '123 Main St, Miami, FL 33101' },
  { id: '2', label: 'Work', address: '456 Business Ave, Miami, FL 33102' },
];
const CARDS = [
  { id: '1', type: 'Visa', last4: '4242' },
  { id: '2', type: 'Mastercard', last4: '5555' },
];
const DURATIONS = ['1', '2', '4', '6', '8', '12'];
const SUPPORT_OPTIONS = [
  'Conversation & Social Interaction', 'Light Activities & Games',
  'Meal Preparation Assistance', 'Medication Reminders',
  'Light Housekeeping', 'Errands & Shopping',
  'Accompaniment to Appointments', 'Personal Care Assistance', 'Other',
];

type Step = 'booking' | 'confirm' | 'tracking';

export default function CompanionBookScreen() {
  const params = useLocalSearchParams<{ id: string; name: string; hourlyRate: string; yearsExperience: string; isPoweredByDoHuub: string; [key: string]: string }>();
  const isPowered = params.isPoweredByDoHuub === 'true';
  const hourlyRate = parseFloat(params.hourlyRate || '35');

  const [step, setStep] = useState<Step>('booking');
  const [serviceAddr, setServiceAddr] = useState(ADDRESSES[0].id);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('2');
  const [supportTypes, setSupportTypes] = useState<string[]>([]);
  const [requests, setRequests] = useState('');
  const [selectedCard, setSelectedCard] = useState(CARDS[0].id);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [showCardSheet, setShowCardSheet] = useState(false);
  const [showDurationSheet, setShowDurationSheet] = useState(false);
  const refNum = `CG${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const toggle = (s: string) => setSupportTypes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const total = hourlyRate * parseInt(duration);
  const discount = redeemPoints ? Math.min(total * 0.1, 50) : 0;
  const finalTotal = total - discount;
  const selectedCardObj = CARDS.find(c => c.id === selectedCard);
  const selectedAddress = ADDRESSES.find(a => a.id === serviceAddr);
  const isValid = serviceAddr && date && time && supportTypes.length > 0 && selectedCard;

  if (step === 'tracking') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Status</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.statusCard}>
            <Text style={styles.sectionTitle}>Status</Text>
            {['Accepted', 'In Progress', 'Completed'].map((s, i) => (
              <View key={s} style={styles.statusRow}>
                <View style={styles.statusLeft}>
                  <View style={[styles.statusDot, i <= 1 && styles.statusDotActive]}>
                    {i < 1 ? <Ionicons name="checkmark" size={14} color="#FFF" /> : <View style={[styles.innerDot, i === 1 && { backgroundColor: '#FFF' }]} />}
                  </View>
                  {i < 2 && <View style={[styles.statusLine, i < 1 && styles.statusLineActive]} />}
                </View>
                <View style={styles.statusInfo}>
                  <Text style={[styles.statusLabel, i <= 1 && { color: colors.text.primary }]}>{s}</Text>
                  <Text style={styles.statusDesc}>{i === 0 ? 'Your booking has been confirmed' : i === 1 ? 'Companion is providing care' : 'Service completed successfully'}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Your Companion</Text>
            <View style={styles.companionRow}>
              <View style={styles.miniAvatar}><Ionicons name="person" size={20} color="#FFF" /></View>
              <View>
                <Text style={styles.companionName}>{params.name}</Text>
                <Text style={styles.companionSub}>{params.yearsExperience} years experience</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="call-outline" size={18} color="#FFF" />
              <Text style={styles.contactBtnTxt}>Contact Companion</Text>
            </TouchableOpacity>
          </View>
          {step === 'tracking' && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Check-in Notes</Text>
              <View style={styles.noteRow}>
                <Text style={styles.noteTime}>10:30 AM</Text>
                <Text style={styles.noteText}>Arrived on time. Beginning activities as planned.</Text>
              </View>
            </View>
          )}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Date</Text><Text style={styles.infoValue}>{date}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Time</Text><Text style={styles.infoValue}>{time}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Duration</Text><Text style={styles.infoValue}>{duration} hours</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Location</Text><Text style={styles.infoValue}>{selectedAddress?.label}</Text></View>
          </View>
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${finalTotal.toFixed(0)}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.successHeader}>
            <View style={styles.successCircle}><Ionicons name="checkmark" size={40} color="#FFF" /></View>
            <Text style={styles.successTitle}>Booking Confirmed!</Text>
            <Text style={styles.successSub}>Your companionship service has been booked successfully</Text>
          </View>
          <View style={styles.refCard}>
            <Text style={styles.refLabel}>Reference Number</Text>
            <Text style={styles.refNum}>{refNum}</Text>
          </View>
          {isPowered && (
            <View style={styles.pointsCard}>
              <View style={styles.pointsRow}>
                <Ionicons name="gift" size={28} color="#FFF" />
                <Text style={styles.pointsEarned}>+{Math.floor(finalTotal)} Points!</Text>
              </View>
              <Text style={styles.pointsNote}>Added to your rewards wallet after service completion</Text>
            </View>
          )}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Your Companion</Text>
            <View style={styles.companionRow}>
              <View style={styles.miniAvatar}><Ionicons name="person" size={20} color="#FFF" /></View>
              <View>
                <Text style={styles.companionName}>{params.name}</Text>
                <Text style={styles.companionSub}>{params.yearsExperience} years experience</Text>
              </View>
            </View>
            <View style={styles.phoneRow}><Ionicons name="call-outline" size={16} color={PINK} /><Text style={styles.phoneTxt}>(555) 987-6543</Text></View>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Date</Text><Text style={styles.infoValue}>{date}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Time</Text><Text style={styles.infoValue}>{time}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Duration</Text><Text style={styles.infoValue}>{duration} hours</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Location</Text><Text style={styles.infoValue}>{selectedAddress?.label}</Text></View>
            {supportTypes.map((s, i) => <Text key={i} style={styles.supportItem}>• {s}</Text>)}
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Method</Text><Text style={styles.infoValue}>{selectedCardObj?.type} •••• {selectedCardObj?.last4}</Text></View>
            {discount > 0 && <View style={styles.infoRow}><Text style={[styles.infoLabel, { color: '#16A34A' }]}>Points Discount</Text><Text style={[styles.infoValue, { color: '#16A34A' }]}>-${discount.toFixed(2)}</Text></View>}
            <View style={[styles.infoRow, styles.dividerTop]}><Text style={[styles.infoLabel, { fontWeight: '700', color: colors.text.primary }]}>Total Paid</Text><Text style={[styles.infoValue, { color: PINK, fontWeight: '700', fontSize: 18 }]}>${finalTotal.toFixed(2)}</Text></View>
          </View>
          <View style={styles.confirmBtns}>
            <TouchableOpacity style={styles.ctaBtn} onPress={() => setStep('tracking')}>
              <Text style={styles.ctaBtnTxt}>View Booking Status</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineBtn} onPress={() => router.push('/(tabs)/')}>
              <Text style={styles.outlineBtnTxt}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Companion</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Companion Summary */}
        <View style={styles.card}>
          <View style={styles.companionRow}>
            <View style={styles.miniAvatar}><Ionicons name="person" size={20} color="#FFF" /></View>
            <View>
              <Text style={styles.infoLabel}>Booking with</Text>
              <Text style={styles.companionName}>{params.name}</Text>
            </View>
          </View>
        </View>

        {/* Service Location */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Service Location *</Text>
          {ADDRESSES.map(a => (
            <TouchableOpacity key={a.id} style={[styles.optionBtn, serviceAddr === a.id && styles.optionBtnActive]} onPress={() => setServiceAddr(a.id)}>
              <View style={styles.addrRow}>
                <Ionicons name="location-outline" size={16} color={serviceAddr === a.id ? PINK : colors.text.secondary} />
                <View>
                  <Text style={[styles.optionTxt, serviceAddr === a.id && styles.optionTxtActive]}>{a.label}</Text>
                  <Text style={[styles.optionSub, serviceAddr === a.id && { color: PINK }]}>{a.address}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date & Time */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <View style={styles.row2}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Date *</Text>
              <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor={colors.text.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Time *</Text>
              <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="HH:MM" placeholderTextColor={colors.text.secondary} />
            </View>
          </View>
        </View>

        {/* Duration */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <TouchableOpacity style={styles.selectBtn} onPress={() => setShowDurationSheet(true)}>
            <Text style={styles.selectBtnTxt}>{duration === '12' ? 'Full Day (12 hours)' : `${duration} hour${parseInt(duration) > 1 ? 's' : ''}`}</Text>
            <Ionicons name="chevron-down" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Support Types */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Type of Support Needed *</Text>
          <Text style={styles.selectAllHint}>Select all that apply</Text>
          {SUPPORT_OPTIONS.map(o => (
            <TouchableOpacity key={o} style={[styles.checkOption, supportTypes.includes(o) && styles.checkOptionActive]} onPress={() => toggle(o)}>
              <View style={[styles.checkbox, supportTypes.includes(o) && styles.checkboxActive]}>
                {supportTypes.includes(o) && <Ionicons name="checkmark" size={14} color="#FFF" />}
              </View>
              <Text style={[styles.checkTxt, supportTypes.includes(o) && styles.checkTxtActive]}>{o}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Special Requests */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Special Requests / Medical Conditions</Text>
          <TextInput style={styles.textarea} value={requests} onChangeText={setRequests} placeholder="Medical conditions, allergies, dietary restrictions..." placeholderTextColor={colors.text.secondary} multiline numberOfLines={4} textAlignVertical="top" />
        </View>

        {/* Payment */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Method *</Text>
          <TouchableOpacity style={styles.selectBtn} onPress={() => setShowCardSheet(true)}>
            <View style={styles.cardRow}>
              <Ionicons name="card-outline" size={18} color={PINK} />
              <Text style={styles.selectBtnTxt}>{selectedCardObj?.type} •••• {selectedCardObj?.last4}</Text>
            </View>
            <Ionicons name="chevron-down" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Points Redemption */}
        {isPowered && (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.sectionTitle}>Redeem Points</Text>
                <Text style={styles.subTxt}>Save up to 10% with your points</Text>
              </View>
              <Switch value={redeemPoints} onValueChange={setRedeemPoints} trackColor={{ true: PINK, false: '#E5E7EB' }} thumbColor="#FFF" />
            </View>
          </View>
        )}

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Hourly Rate</Text><Text style={styles.infoValue}>${hourlyRate}/hour</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Duration</Text><Text style={styles.infoValue}>{duration} hours</Text></View>
          {discount > 0 && <View style={styles.infoRow}><Text style={[styles.infoLabel, { color: '#16A34A' }]}>Points Discount</Text><Text style={[styles.infoValue, { color: '#16A34A' }]}>-${discount.toFixed(2)}</Text></View>}
          <View style={[styles.infoRow, styles.dividerTop]}><Text style={[styles.infoLabel, { fontWeight: '700', color: colors.text.primary }]}>Total</Text><Text style={[styles.infoValue, { color: PINK, fontWeight: '700', fontSize: 20 }]}>${finalTotal.toFixed(2)}</Text></View>
        </View>

        {isPowered && (
          <View style={styles.pointsBanner}>
            <Ionicons name="gift-outline" size={18} color="#F59E0B" />
            <Text style={styles.pointsLabel}>Points you'll earn</Text>
            <Text style={styles.pointsAmt}>+{Math.floor(finalTotal)} pts</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.ctaBtn, !isValid && styles.ctaBtnDisabled]} onPress={() => isValid && setStep('confirm')} disabled={!isValid}>
          <Text style={styles.ctaBtnTxt}>Confirm & Pay ${finalTotal.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>

      {/* Duration Sheet */}
      <Modal visible={showDurationSheet} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Duration</Text>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setShowDurationSheet(false)}>
                <Ionicons name="close" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            {DURATIONS.map(d => (
              <TouchableOpacity key={d} style={[styles.sheetItem, duration === d && styles.sheetItemActive]} onPress={() => { setDuration(d); setShowDurationSheet(false); }}>
                <Text style={[styles.sheetItemTxt, duration === d && styles.sheetItemTxtActive]}>{d === '12' ? 'Full Day (12 hours)' : `${d} hour${parseInt(d) > 1 ? 's' : ''}`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Card Sheet */}
      <Modal visible={showCardSheet} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Payment</Text>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setShowCardSheet(false)}>
                <Ionicons name="close" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            {CARDS.map(c => (
              <TouchableOpacity key={c.id} style={[styles.sheetItem, selectedCard === c.id && styles.sheetItemActive]} onPress={() => { setSelectedCard(c.id); setShowCardSheet(false); }}>
                <Ionicons name="card-outline" size={18} color={selectedCard === c.id ? PINK : colors.text.secondary} />
                <Text style={[styles.sheetItemTxt, selectedCard === c.id && styles.sheetItemTxtActive]}>{c.type} •••• {c.last4}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'rgba(255,255,255,0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.08)', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 3 },
  headerTitle: { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  iconBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  scroll: { padding: 20, gap: 14, paddingBottom: 100 },
  card: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', gap: 8 },
  sectionTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text.primary, marginBottom: 4 },
  subTxt: { fontSize: fontSize.xs, color: colors.text.secondary },
  inputLabel: { fontSize: fontSize.xs, color: colors.text.secondary, marginBottom: 4 },
  input: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', backgroundColor: '#F9F9F9', fontSize: fontSize.sm, color: colors.text.primary },
  textarea: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', backgroundColor: '#F9F9F9', fontSize: fontSize.sm, color: colors.text.primary, minHeight: 100 },
  row2: { flexDirection: 'row', gap: 12 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionBtn: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#F5F5F5', marginBottom: 6 },
  optionBtnActive: { backgroundColor: 'rgba(236,72,153,0.1)', borderColor: PINK, borderWidth: 2 },
  optionTxt: { fontSize: fontSize.sm, color: colors.text.primary, fontWeight: '500' },
  optionTxtActive: { color: PINK, fontWeight: '600' },
  optionSub: { fontSize: fontSize.xs, color: colors.text.secondary, marginTop: 2 },
  addrRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  selectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', backgroundColor: '#F9F9F9' },
  selectBtnTxt: { fontSize: fontSize.sm, color: colors.text.primary, flex: 1 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  selectAllHint: { fontSize: fontSize.xs, color: colors.text.secondary, marginBottom: 4 },
  checkOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#F9F9F9', marginBottom: 6 },
  checkOptionActive: { backgroundColor: 'rgba(236,72,153,0.1)', borderColor: PINK, borderWidth: 2 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: PINK, borderColor: PINK },
  checkTxt: { fontSize: fontSize.sm, color: colors.text.primary, flex: 1 },
  checkTxtActive: { color: PINK, fontWeight: '500' },
  priceSummary: { padding: 16, borderRadius: 12, backgroundColor: 'rgba(236,72,153,0.08)', borderWidth: 1, borderColor: 'rgba(236,72,153,0.25)', gap: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  infoLabel: { fontSize: fontSize.sm, color: colors.text.secondary },
  infoValue: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  dividerTop: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)', marginTop: 4, paddingTop: 10 },
  pointsBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
  pointsLabel: { fontSize: fontSize.sm, fontWeight: '600', color: '#B45309', flex: 1 },
  pointsAmt: { fontSize: fontSize.md, fontWeight: '700', color: '#F59E0B' },
  footer: { padding: 16, backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(236,72,153,0.15)' },
  ctaBtn: { backgroundColor: PINK, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  ctaBtnDisabled: { opacity: 0.4 },
  ctaBtnTxt: { color: '#FFF', fontSize: fontSize.sm, fontWeight: '700' },
  outlineBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  outlineBtnTxt: { color: colors.text.primary, fontSize: fontSize.sm, fontWeight: '600' },
  confirmBtns: { gap: 12 },
  successHeader: { alignItems: 'center', paddingVertical: 32 },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: PINK, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '700', color: colors.text.primary, marginBottom: 6 },
  successSub: { fontSize: fontSize.sm, color: colors.text.secondary, textAlign: 'center' },
  refCard: { padding: 16, borderRadius: 12, backgroundColor: 'rgba(236,72,153,0.1)', borderWidth: 1, borderColor: 'rgba(236,72,153,0.3)', alignItems: 'center' },
  refLabel: { fontSize: fontSize.xs, color: colors.text.secondary, marginBottom: 4 },
  refNum: { fontSize: 24, fontWeight: '700', color: PINK, letterSpacing: 2 },
  pointsCard: { padding: 20, borderRadius: 14, backgroundColor: '#F59E0B', alignItems: 'center', gap: 6 },
  pointsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pointsEarned: { fontSize: 22, fontWeight: '700', color: '#FFF' },
  pointsNote: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  companionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  miniAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: PINK, alignItems: 'center', justifyContent: 'center' },
  companionName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  companionSub: { fontSize: fontSize.xs, color: colors.text.secondary },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 10, backgroundColor: 'rgba(236,72,153,0.1)', marginTop: 4 },
  phoneTxt: { fontSize: fontSize.sm, color: colors.text.primary },
  supportItem: { fontSize: fontSize.sm, color: colors.text.secondary, marginLeft: 8 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: PINK, borderRadius: 12, paddingVertical: 12 },
  contactBtnTxt: { color: '#FFF', fontSize: fontSize.sm, fontWeight: '600' },
  statusCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  statusRow: { flexDirection: 'row', gap: 12 },
  statusLeft: { alignItems: 'center', width: 40 },
  statusDot: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  statusDotActive: { backgroundColor: PINK },
  innerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#9CA3AF' },
  statusLine: { width: 2, height: 40, backgroundColor: '#E5E7EB' },
  statusLineActive: { backgroundColor: PINK },
  statusInfo: { flex: 1, paddingTop: 8, paddingBottom: 16 },
  statusLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.secondary, marginBottom: 2 },
  statusDesc: { fontSize: fontSize.xs, color: colors.text.secondary },
  noteRow: { padding: 10, borderRadius: 10, backgroundColor: 'rgba(236,72,153,0.05)', borderWidth: 1, borderColor: 'rgba(236,72,153,0.2)', gap: 4 },
  noteTime: { fontSize: fontSize.xs, fontWeight: '600', color: colors.text.primary },
  noteText: { fontSize: fontSize.xs, color: colors.text.secondary },
  totalCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, backgroundColor: 'rgba(236,72,153,0.1)', borderWidth: 1, borderColor: 'rgba(236,72,153,0.3)' },
  totalLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  totalValue: { fontSize: 20, fontWeight: '700', color: PINK },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 32 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  sheetTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  sheetItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, marginHorizontal: 16, marginVertical: 3, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  sheetItemActive: { backgroundColor: 'rgba(236,72,153,0.1)', borderColor: PINK },
  sheetItemTxt: { fontSize: fontSize.sm, color: colors.text.primary },
  sheetItemTxtActive: { color: PINK, fontWeight: '600' },
});
