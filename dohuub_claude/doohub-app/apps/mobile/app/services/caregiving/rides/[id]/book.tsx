import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Switch, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../../src/constants/theme';
import { useAuthStore } from '../../../../../src/store/authStore';
import { getPaymentMethods } from '../../../../../src/lib/queries';

const PURPLE = '#A855F7';

interface AddressRow { id: string; label: string; address: string; }
interface CardRow { id: string; type: string; last4: string; }

const DURATIONS = ['1', '2', '3', '4', '6', '8', '12'];

type Step = 'booking' | 'confirm' | 'tracking';
interface Stop { id: string; address: string; purpose: string; }

export default function RideBookScreen() {
  const params = useLocalSearchParams<{ id: string; name: string; hourlyRate: string; vehicleTypes: string; isPoweredByDoHuub: string; [key: string]: string }>();
  const isPowered = params.isPoweredByDoHuub === 'true';
  const hourlyRate = parseFloat(params.hourlyRate || '40');
  const vehicleTypes = params.vehicleTypes ? params.vehicleTypes.split(',') : ['Standard'];

  const { user, addresses: rawAddresses } = useAuthStore();
  const addresses: AddressRow[] = useMemo(
    () =>
      (rawAddresses || []).map((a) => ({
        id: a.id,
        label: a.label || a.type,
        address: `${a.street}${a.apartment ? ' ' + a.apartment : ''}, ${a.city}, ${a.state} ${a.zipCode}`,
      })),
    [rawAddresses]
  );

  const [cards, setCards] = useState<CardRow[]>([]);
  useEffect(() => {
    if (!user?.id) return;
    getPaymentMethods(user.id)
      .then((rows) =>
        setCards(
          (rows || []).map((r: any) => ({
            id: r.id,
            type: r.brand || r.type || 'Card',
            last4: r.last4 || r.lastFour || '••••',
          }))
        )
      )
      .catch((e) => console.warn('Failed to load payment methods:', e));
  }, [user?.id]);

  const [step, setStep] = useState<Step>('booking');
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [vehicleType, setVehicleType] = useState(vehicleTypes[0]);
  const [pickupAddr, setPickupAddr] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('2');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [stops, setStops] = useState<Stop[]>([]);
  const [requests, setRequests] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [showStopModal, setShowStopModal] = useState(false);
  const [newStopAddr, setNewStopAddr] = useState('');
  const [newStopPurpose, setNewStopPurpose] = useState('Pharmacy');
  const [showCardSheet, setShowCardSheet] = useState(false);
  const [showDurationSheet, setShowDurationSheet] = useState(false);
  const refNum = `CG${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Auto-select first available address/card once they load.
  useEffect(() => {
    if (!pickupAddr && addresses.length > 0) setPickupAddr(addresses[0].id);
  }, [addresses, pickupAddr]);
  useEffect(() => {
    if (!selectedCard && cards.length > 0) setSelectedCard(cards[0].id);
  }, [cards, selectedCard]);

  const total = hourlyRate * parseInt(duration);
  const selectedAddress = addresses.find((a) => a.id === pickupAddr);
  const selectedCardObj = cards.find((c) => c.id === selectedCard);
  const isValid = passengerName && passengerPhone && date && time && selectedCard && pickupAddr;

  const addStop = () => {
    if (newStopAddr.trim()) {
      setStops(p => [...p, { id: Date.now().toString(), address: newStopAddr, purpose: newStopPurpose }]);
      setNewStopAddr(''); setShowStopModal(false);
    }
  };

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
                  <Text style={styles.statusDesc}>{i === 0 ? 'Your booking has been confirmed' : i === 1 ? 'Transportation service in progress' : 'Ride completed successfully'}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ride Provider</Text>
            <View style={styles.providerRow}>
              <View style={styles.miniAvatar}><Ionicons name="car" size={20} color="#FFF" /></View>
              <View>
                <Text style={styles.providerName}>{params.name}</Text>
                <Text style={styles.providerSub}>Transportation Service</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="call-outline" size={18} color="#FFF" />
              <Text style={styles.contactBtnTxt}>Contact Provider</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Date</Text><Text style={styles.infoValue}>{date}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Time</Text><Text style={styles.infoValue}>{time}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Duration</Text><Text style={styles.infoValue}>{duration} hours</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Pickup</Text><Text style={styles.infoValue}>{selectedAddress?.label}</Text></View>
          </View>
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${total}</Text>
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
            <Text style={styles.successSub}>Your ride service has been booked successfully</Text>
          </View>
          <View style={styles.refCard}>
            <Text style={styles.refLabel}>Reference Number</Text>
            <Text style={styles.refNum}>{refNum}</Text>
          </View>
          {isPowered && (
            <View style={styles.pointsCard}>
              <View style={styles.pointsRow}>
                <Ionicons name="gift" size={28} color="#FFF" />
                <Text style={styles.pointsEarned}>+{total} Points!</Text>
              </View>
              <Text style={styles.pointsNote}>Added to your rewards wallet after service completion</Text>
            </View>
          )}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ride Provider</Text>
            <Text style={styles.boldTxt}>{params.name}</Text>
            <Text style={styles.subTxt}>Provider will contact you shortly to confirm driver assignment</Text>
            <View style={styles.phoneRow}><Ionicons name="call-outline" size={16} color={PURPLE} /><Text style={styles.phoneTxt}>(555) 123-4567</Text></View>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Date</Text><Text style={styles.infoValue}>{date}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Time</Text><Text style={styles.infoValue}>{time}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Duration</Text><Text style={styles.infoValue}>{duration} hours</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Pickup</Text><Text style={styles.infoValue}>{selectedAddress?.label}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Vehicle</Text><Text style={styles.infoValue}>{vehicleType}</Text></View>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Method</Text><Text style={styles.infoValue}>{selectedCardObj?.type} •••• {selectedCardObj?.last4}</Text></View>
            <View style={[styles.infoRow, styles.dividerTop]}><Text style={[styles.infoLabel, { fontWeight: '700', color: colors.text.primary }]}>Total Paid</Text><Text style={[styles.infoValue, { color: PURPLE, fontWeight: '700', fontSize: 18 }]}>${total}</Text></View>
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
        <Text style={styles.headerTitle}>Book Ride Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Provider */}
        <View style={styles.card}>
          <Text style={styles.infoLabel}>Booking with</Text>
          <Text style={styles.boldTxt}>{params.name}</Text>
        </View>

        {/* Passenger */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Passenger Details</Text>
          <Text style={styles.inputLabel}>Full Name *</Text>
          <TextInput style={styles.input} value={passengerName} onChangeText={setPassengerName} placeholder="Enter passenger name" placeholderTextColor={colors.text.secondary} />
          <Text style={[styles.inputLabel, { marginTop: 10 }]}>Phone Number *</Text>
          <TextInput style={styles.input} value={passengerPhone} onChangeText={setPassengerPhone} placeholder="(555) 123-4567" placeholderTextColor={colors.text.secondary} keyboardType="phone-pad" />
        </View>

        {/* Vehicle Type */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vehicle Type</Text>
          {vehicleTypes.map(v => (
            <TouchableOpacity key={v} style={[styles.optionBtn, vehicleType === v && styles.optionBtnActive]} onPress={() => setVehicleType(v)}>
              <Text style={[styles.optionTxt, vehicleType === v && styles.optionTxtActive]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pickup Address */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pickup Address *</Text>
          {addresses.length === 0 ? (
            <Text style={styles.emptyTxt}>No saved addresses. Add one from your profile.</Text>
          ) : (
            addresses.map((a) => (
              <TouchableOpacity key={a.id} style={[styles.optionBtn, pickupAddr === a.id && styles.optionBtnActive]} onPress={() => setPickupAddr(a.id)}>
                <Text style={[styles.optionTxt, pickupAddr === a.id && styles.optionTxtActive]}>{a.label}</Text>
                <Text style={[styles.optionSub, pickupAddr === a.id && { color: PURPLE }]}>{a.address}</Text>
              </TouchableOpacity>
            ))
          )}
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

        {/* Stops */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Stops (Optional)</Text>
            <TouchableOpacity onPress={() => setShowStopModal(true)} style={styles.addBtn}>
              <Ionicons name="add" size={16} color={PURPLE} />
              <Text style={styles.addBtnTxt}>Add Stop</Text>
            </TouchableOpacity>
          </View>
          {stops.length === 0
            ? <Text style={styles.emptyTxt}>No stops added yet</Text>
            : stops.map((s, i) => (
                <View key={s.id} style={styles.stopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stopLabel}>Stop {i + 1} • <Text style={{ color: PURPLE }}>{s.purpose}</Text></Text>
                    <Text style={styles.stopAddr}>{s.address}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setStops(p => p.filter(x => x.id !== s.id))}>
                    <Ionicons name="close" size={18} color={colors.text.secondary} />
                  </TouchableOpacity>
                </View>
              ))
          }
        </View>

        {/* Round Trip */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.sectionTitle}>Round Trip</Text>
              <Text style={styles.subTxt}>Return to pickup location</Text>
            </View>
            <Switch value={isRoundTrip} onValueChange={setIsRoundTrip} trackColor={{ true: PURPLE, false: '#E5E7EB' }} thumbColor="#FFF" />
          </View>
        </View>

        {/* Special Requests */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Special Requests (Optional)</Text>
          <TextInput style={styles.textarea} value={requests} onChangeText={setRequests} placeholder="Medical equipment, walker, oxygen tank..." placeholderTextColor={colors.text.secondary} multiline numberOfLines={3} textAlignVertical="top" />
        </View>

        {/* Payment */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Method *</Text>
          {cards.length === 0 ? (
            <Text style={styles.emptyTxt}>No saved cards. Add one from your profile.</Text>
          ) : (
            <TouchableOpacity style={styles.selectBtn} onPress={() => setShowCardSheet(true)}>
              <View style={styles.cardRow}>
                <Ionicons name="card-outline" size={18} color={PURPLE} />
                <Text style={styles.selectBtnTxt}>{selectedCardObj?.type} •••• {selectedCardObj?.last4}</Text>
              </View>
              <Ionicons name="chevron-down" size={18} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Hourly Rate</Text><Text style={styles.infoValue}>${hourlyRate}/hour</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Duration</Text><Text style={styles.infoValue}>{duration} hours</Text></View>
          <View style={[styles.infoRow, styles.dividerTop]}><Text style={[styles.infoLabel, { fontWeight: '700', color: colors.text.primary }]}>Total</Text><Text style={[styles.infoValue, { color: PURPLE, fontWeight: '700', fontSize: 20 }]}>${total}</Text></View>
        </View>

        {isPowered && (
          <View style={styles.pointsBanner}>
            <Ionicons name="gift-outline" size={18} color="#F59E0B" />
            <Text style={styles.pointsLabel}>Points you'll earn</Text>
            <Text style={styles.pointsAmt}>+{total} pts</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.ctaBtn, !isValid && styles.ctaBtnDisabled]} onPress={() => isValid && setStep('confirm')} disabled={!isValid}>
          <Text style={styles.ctaBtnTxt}>Confirm & Pay ${total}</Text>
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
            {cards.map((c) => (
              <TouchableOpacity key={c.id} style={[styles.sheetItem, selectedCard === c.id && styles.sheetItemActive]} onPress={() => { setSelectedCard(c.id); setShowCardSheet(false); }}>
                <Ionicons name="card-outline" size={18} color={selectedCard === c.id ? PURPLE : colors.text.secondary} />
                <Text style={[styles.sheetItemTxt, selectedCard === c.id && styles.sheetItemTxtActive]}>{c.type} •••• {c.last4}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Stop Modal */}
      <Modal visible={showStopModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add Stop</Text>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setShowStopModal(false)}>
                <Ionicons name="close" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={{ padding: 20, gap: 12 }}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput style={styles.input} value={newStopAddr} onChangeText={setNewStopAddr} placeholder="Enter stop address" placeholderTextColor={colors.text.secondary} />
              <Text style={styles.inputLabel}>Purpose</Text>
              {['Pharmacy', 'Grocery Store', "Doctor's Office", 'Bank', 'Other'].map(p => (
                <TouchableOpacity key={p} style={[styles.optionBtn, newStopPurpose === p && styles.optionBtnActive]} onPress={() => setNewStopPurpose(p)}>
                  <Text style={[styles.optionTxt, newStopPurpose === p && styles.optionTxtActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={[styles.ctaBtn, !newStopAddr.trim() && styles.ctaBtnDisabled]} onPress={addStop} disabled={!newStopAddr.trim()}>
                <Text style={styles.ctaBtnTxt}>Add Stop</Text>
              </TouchableOpacity>
            </View>
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
  boldTxt: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  subTxt: { fontSize: fontSize.xs, color: colors.text.secondary },
  inputLabel: { fontSize: fontSize.xs, color: colors.text.secondary, marginBottom: 4 },
  input: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', backgroundColor: '#F9F9F9', fontSize: fontSize.sm, color: colors.text.primary },
  textarea: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', backgroundColor: '#F9F9F9', fontSize: fontSize.sm, color: colors.text.primary, minHeight: 80 },
  row2: { flexDirection: 'row', gap: 12 },
  optionBtn: { padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#F5F5F5', marginBottom: 6 },
  optionBtnActive: { backgroundColor: 'rgba(168,85,247,0.1)', borderColor: PURPLE, borderWidth: 2 },
  optionTxt: { fontSize: fontSize.sm, color: colors.text.primary, fontWeight: '500' },
  optionTxtActive: { color: PURPLE, fontWeight: '600' },
  optionSub: { fontSize: fontSize.xs, color: colors.text.secondary, marginTop: 2 },
  selectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', backgroundColor: '#F9F9F9' },
  selectBtnTxt: { fontSize: fontSize.sm, color: colors.text.primary, flex: 1 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addBtnTxt: { fontSize: fontSize.sm, color: PURPLE, fontWeight: '500' },
  emptyTxt: { fontSize: fontSize.sm, color: colors.text.secondary, textAlign: 'center', paddingVertical: 8 },
  stopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, borderRadius: 10, backgroundColor: '#F5F5F5' },
  stopLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  stopAddr: { fontSize: fontSize.xs, color: colors.text.secondary, marginTop: 2 },
  priceSummary: { padding: 16, borderRadius: 12, backgroundColor: 'rgba(168,85,247,0.08)', borderWidth: 1, borderColor: 'rgba(168,85,247,0.25)', gap: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  infoLabel: { fontSize: fontSize.sm, color: colors.text.secondary },
  infoValue: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  dividerTop: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)', marginTop: 4, paddingTop: 10 },
  pointsBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
  pointsLabel: { fontSize: fontSize.sm, fontWeight: '600', color: '#B45309', flex: 1 },
  pointsAmt: { fontSize: fontSize.md, fontWeight: '700', color: '#F59E0B' },
  footer: { padding: 16, backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(168,85,247,0.15)' },
  ctaBtn: { backgroundColor: PURPLE, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  ctaBtnDisabled: { opacity: 0.4 },
  ctaBtnTxt: { color: '#FFF', fontSize: fontSize.sm, fontWeight: '700' },
  outlineBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  outlineBtnTxt: { color: colors.text.primary, fontSize: fontSize.sm, fontWeight: '600' },
  confirmBtns: { gap: 12 },
  successHeader: { alignItems: 'center', paddingVertical: 32 },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: PURPLE, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '700', color: colors.text.primary, marginBottom: 6 },
  successSub: { fontSize: fontSize.sm, color: colors.text.secondary, textAlign: 'center' },
  refCard: { padding: 16, borderRadius: 12, backgroundColor: 'rgba(168,85,247,0.1)', borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)', alignItems: 'center' },
  refLabel: { fontSize: fontSize.xs, color: colors.text.secondary, marginBottom: 4 },
  refNum: { fontSize: 24, fontWeight: '700', color: PURPLE, letterSpacing: 2 },
  pointsCard: { padding: 20, borderRadius: 14, backgroundColor: '#F59E0B', alignItems: 'center', gap: 6 },
  pointsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pointsEarned: { fontSize: 22, fontWeight: '700', color: '#FFF' },
  pointsNote: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 10, backgroundColor: 'rgba(168,85,247,0.1)', marginTop: 4 },
  phoneTxt: { fontSize: fontSize.sm, color: colors.text.primary },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 32 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.08)' },
  sheetTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  sheetItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, marginHorizontal: 16, marginVertical: 3, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  sheetItemActive: { backgroundColor: 'rgba(168,85,247,0.1)', borderColor: PURPLE },
  sheetItemTxt: { fontSize: fontSize.sm, color: colors.text.primary },
  sheetItemTxtActive: { color: PURPLE, fontWeight: '600' },
  statusCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', gap: 0 },
  statusRow: { flexDirection: 'row', gap: 12, marginBottom: 0 },
  statusLeft: { alignItems: 'center', width: 40 },
  statusDot: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  statusDotActive: { backgroundColor: PURPLE },
  innerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#9CA3AF' },
  statusLine: { width: 2, height: 40, backgroundColor: '#E5E7EB' },
  statusLineActive: { backgroundColor: PURPLE },
  statusInfo: { flex: 1, paddingTop: 8, paddingBottom: 16 },
  statusLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.secondary, marginBottom: 2 },
  statusDesc: { fontSize: fontSize.xs, color: colors.text.secondary },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  miniAvatar: { width: 48, height: 48, borderRadius: 12, backgroundColor: PURPLE, alignItems: 'center', justifyContent: 'center' },
  providerName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  providerSub: { fontSize: fontSize.xs, color: colors.text.secondary },
  contactBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: PURPLE, borderRadius: 12, paddingVertical: 12 },
  contactBtnTxt: { color: '#FFF', fontSize: fontSize.sm, fontWeight: '600' },
  totalCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, backgroundColor: 'rgba(168,85,247,0.1)', borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)' },
  totalLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  totalValue: { fontSize: 20, fontWeight: '700', color: PURPLE },
});
