import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../src/constants/theme';

const TEAL = '#14B8A6';
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Sample unavailable dates
const UNAVAILABLE = [
  new Date(2025, 2, 15), new Date(2025, 2, 16), new Date(2025, 2, 17),
  new Date(2025, 2, 18), new Date(2025, 2, 19), new Date(2025, 2, 20),
  new Date(2025, 3, 1),  new Date(2025, 3, 2),  new Date(2025, 3, 3),
];

export default function PropertyCalendarScreen() {
  const params = useLocalSearchParams();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkIn,  setCheckIn]  = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [pickingOut, setPickingOut] = useState(false);

  const isSameDay = (a: Date | null, b: Date) => a ? a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear() : false;
  const isUnavailable = (d: Date) => UNAVAILABLE.some(u => isSameDay(u, d));
  const isPast = (d: Date) => { const t = new Date(); t.setHours(0,0,0,0); return d < t; };
  const inRange = (d: Date) => checkIn && checkOut ? d > checkIn && d < checkOut : false;

  const handleDay = (date: Date) => {
    if (isUnavailable(date) || isPast(date)) return;
    if (!pickingOut) {
      setCheckIn(date); setCheckOut(null); setPickingOut(true);
    } else {
      if (date <= checkIn!) { setCheckIn(date); setCheckOut(null); }
      else { setCheckOut(date); setPickingOut(false); }
    }
  };

  const fmt = (d: Date | null) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select date';

  const calcDuration = (): string => {
    if (!checkIn || !checkOut) return '';
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 1) return '1 night';
    if (days < 7) return `${days} nights`;
    if (days < 30) {
      const w = Math.floor(days / 7), d = days % 7;
      return d === 0 ? `${w} week${w > 1 ? 's' : ''}` : `${w} week${w > 1 ? 's' : ''} ${d} day${d > 1 ? 's' : ''}`;
    }
    const m = Math.floor(days / 30), r = days % 30;
    return r === 0 ? `${m} month${m > 1 ? 's' : ''}` : `${m} month${m > 1 ? 's' : ''} ${r} day${r > 1 ? 's' : ''}`;
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear(), month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date(); today.setHours(0,0,0,0);
    const cells = [];

    for (let i = 0; i < firstDay; i++) cells.push(<View key={`e${i}`} style={styles.dayCell} />);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isIn  = isSameDay(checkIn, date);
      const isOut = isSameDay(checkOut, date);
      const inR   = inRange(date);
      const unav  = isUnavailable(date);
      const past  = isPast(date);
      const isToday = isSameDay(today, date);
      const disabled = unav || past;

      cells.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            (isIn || isOut) && styles.dayCellSelected,
            inR && styles.dayCellRange,
            disabled && styles.dayCellDisabled,
            isToday && !isIn && !isOut && !disabled && styles.dayCellToday,
          ]}
          onPress={() => handleDay(date)}
          disabled={disabled}
        >
          <Text style={[styles.dayTxt, (isIn || isOut) && styles.dayTxtSelected, disabled && styles.dayTxtDisabled]}>{day}</Text>
        </TouchableOpacity>
      );
    }
    return cells;
  };

  const duration = calcDuration();
  const canContinue = !!(checkIn && checkOut);

  const doContinue = () => {
    if (!canContinue) return;
    const ci = checkIn!.toISOString().split('T')[0];
    const co = checkOut!.toISOString().split('T')[0];
    router.push({ pathname: '/services/rentals/[id]/stay-details', params: { ...params, checkIn: ci, checkOut: co, duration } } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Dates</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Date Cards */}
        <View style={styles.dateCards}>
          <View style={styles.dateCard}>
            <Text style={styles.dateCardLabel}>Check-in</Text>
            <Text style={styles.dateCardValue}>{fmt(checkIn)}</Text>
          </View>
          <View style={styles.dateCard}>
            <Text style={styles.dateCardLabel}>Check-out</Text>
            <Text style={styles.dateCardValue}>{fmt(checkOut)}</Text>
          </View>
        </View>

        {/* Duration Banner */}
        {duration ? (
          <View style={styles.durationBanner}>
            <Text style={styles.durationLabel}>Duration</Text>
            <Text style={styles.durationValue}>{duration}</Text>
          </View>
        ) : null}

        {/* Calendar */}
        <View style={styles.calCard}>
          <View style={styles.monthNav}>
            <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
              <Ionicons name="chevron-back" size={20} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
            <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
              <Ionicons name="chevron-forward" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.weekRow}>
            {WEEKDAYS.map(d => <Text key={d} style={styles.weekDay}>{d}</Text>)}
          </View>
          <View style={styles.calGrid}>
            {renderCalendar()}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Legend</Text>
          {[
            { color: TEAL, label: 'Selected dates' },
            { color: 'rgba(20,184,166,0.2)', label: 'Date range' },
            { color: '#E5E7EB', label: 'Unavailable dates' },
          ].map(l => (
            <View key={l.label} style={styles.legendRow}>
              <View style={[styles.legendSwatch, { backgroundColor: l.color }]} />
              <Text style={styles.legendTxt}>{l.label}</Text>
            </View>
          ))}
          <View style={styles.legendRow}>
            <View style={[styles.legendSwatch, { borderWidth: 2, borderColor: TEAL, backgroundColor: 'transparent' }]} />
            <Text style={styles.legendTxt}>Today</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTxt}>
            {!checkIn && 'Select your check-in date to begin'}
            {checkIn && !checkOut && 'Now select your check-out date'}
            {checkIn && checkOut && 'Dates selected! Tap Continue to proceed'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.ctaBtn, !canContinue && styles.ctaBtnDisabled]} onPress={doContinue} disabled={!canContinue}>
          <Text style={styles.ctaBtnText}>Continue</Text>
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
  dateCards: { flexDirection: 'row', gap: 12 },
  dateCard: { flex: 1, padding: 14, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  dateCardLabel: { fontSize: fontSize.xs, color: colors.text.secondary, marginBottom: 4 },
  dateCardValue: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  durationBanner: { padding: 16, borderRadius: 12, backgroundColor: TEAL },
  durationLabel: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  durationValue: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  calCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  navBtn: { padding: 8, borderRadius: 8, backgroundColor: '#F0F0F0' },
  monthTitle: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  weekRow: { flexDirection: 'row', marginBottom: 6 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '500', color: colors.text.secondary },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  dayCellSelected: { backgroundColor: TEAL },
  dayCellRange: { backgroundColor: 'rgba(20,184,166,0.2)' },
  dayCellDisabled: { backgroundColor: '#F3F4F6', opacity: 0.5 },
  dayCellToday: { borderWidth: 2, borderColor: TEAL },
  dayTxt: { fontSize: 13, fontWeight: '500', color: colors.text.primary },
  dayTxtSelected: { color: '#FFF' },
  dayTxtDisabled: { color: colors.text.secondary },
  legendCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', gap: 8 },
  legendTitle: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 4 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  legendSwatch: { width: 22, height: 22, borderRadius: 4 },
  legendTxt: { fontSize: fontSize.sm, color: colors.text.secondary },
  infoCard: { backgroundColor: 'rgba(20,184,166,0.08)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(20,184,166,0.25)' },
  infoTxt: { fontSize: fontSize.sm, color: '#0D9488' },
  footer: { padding: 16, backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(20,184,166,0.15)' },
  ctaBtn: { backgroundColor: TEAL, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  ctaBtnDisabled: { opacity: 0.4 },
  ctaBtnText: { color: '#FFF', fontSize: fontSize.sm, fontWeight: '700' },
});
