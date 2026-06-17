import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, Alert, ActivityIndicator, Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { getHandymanListings, getVendorById } from '../../../../src/lib/queries';
import { useAuthStore } from '../../../../src/store/authStore';
import { pickAndUploadImage } from '../../../../src/services/uploadImage';

const MAX_PROBLEM_PHOTOS = 3;

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

export default function HandymanBookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addresses } = useAuthStore();

  const [listing, setListing] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [problemPhotos, setProblemPhotos] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePickProblemPhoto = async () => {
    if (problemPhotos.length >= MAX_PROBLEM_PHOTOS || uploadingPhoto) return;
    setUploadingPhoto(true);
    try {
      const url = await pickAndUploadImage({ type: 'review' });
      if (url) setProblemPhotos((p) => [...p, url]);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const defaultAddress = addresses?.find((a: any) => a.isDefault) || addresses?.[0];

  useEffect(() => {
    (async () => {
      try {
        const [v, listings] = await Promise.all([getVendorById(id), getHandymanListings(id)]);
        setVendor(v);
        setListing(listings[0] || null);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate().toString(),
      full: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) { Alert.alert('Missing Info', 'Please select a date and time'); return; }
    // Append uploaded problem photos to notes so the vendor sees them on the
    // booking detail — no schema change needed.
    const notesWithPhotos = problemPhotos.length > 0
      ? `${notes}\n\nProblem photos:\n${problemPhotos.join('\n')}`
      : notes;
    router.push({
      pathname: '/checkout/payment',
      params: {
        serviceName: listing?.title || 'Handyman Service',
        amount: (listing?.hourlyRate || listing?.basePrice || 0).toString(),
        date: selectedDate, time: selectedTime, notes: notesWithPhotos,
        vendorId: id, category: 'HANDYMAN', listingId: listing?.id || '', serviceFee: '10',
      },
    });
  };

  if (loading) return (
    <SafeAreaView style={styles.container}>
      <Header /><View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Service Card */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceLogoCircle}>
            <Image
              source={vendor?.logo ? { uri: vendor.logo } : require('../../../../assets/cat-handyman.png')}
              style={styles.serviceLogoImg}
              resizeMode="contain"
            />
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{listing?.title || 'Handyman Service'}</Text>
            <Text style={styles.vendorName}>{vendor?.businessName || 'Service Provider'}</Text>
            <Text style={styles.servicePrice}>${(listing?.hourlyRate || listing?.basePrice || 0) * selectedDuration}</Text>
          </View>
        </View>

        {/* Select Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity style={styles.pickerRow} onPress={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}>
            <View style={styles.pickerLeft}>
              <View style={styles.pickerIconBox}><Ionicons name="calendar-outline" size={18} color={colors.primary} /></View>
              <Text style={[styles.pickerText, selectedDate && styles.pickerTextSelected]}>
                {selectedDate ? dates.find(d => d.full === selectedDate)?.label || selectedDate : 'Choose a date'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          </TouchableOpacity>
          {showDatePicker && (
            <View style={styles.dateDropdown}>
              {dates.map((d) => (
                <TouchableOpacity key={d.full} style={[styles.dateDropdownItem, selectedDate === d.full && styles.dateDropdownItemActive]}
                  onPress={() => { setSelectedDate(d.full); setShowDatePicker(false); }}>
                  <Text style={[styles.dateDropdownText, selectedDate === d.full && styles.dateDropdownTextActive]}>
                    {d.day}, {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Select Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <TouchableOpacity style={styles.pickerRow} onPress={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}>
            <View style={styles.pickerLeft}>
              <View style={styles.pickerIconBox}><Ionicons name="time-outline" size={18} color={colors.primary} /></View>
              <Text style={[styles.pickerText, selectedTime && styles.pickerTextSelected]}>{selectedTime || 'Choose a time'}</Text>
            </View>
            <Ionicons name={showTimePicker ? 'chevron-up' : 'chevron-down'} size={18} color={colors.text.muted} />
          </TouchableOpacity>
          {showTimePicker && (
            <View style={styles.timeDropdown}>
              <View style={styles.timeGrid}>
                {TIME_SLOTS.map((time) => (
                  <TouchableOpacity key={time} style={[styles.timeChip, selectedTime === time && styles.timeChipActive]}
                    onPress={() => { setSelectedTime(time); setShowTimePicker(false); }}>
                    <Text style={[styles.timeChipText, selectedTime === time && styles.timeChipTextActive]}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Select Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Duration</Text>
          <TouchableOpacity style={styles.pickerRow} onPress={() => { setShowDurationPicker(!showDurationPicker); setShowDatePicker(false); setShowTimePicker(false); }}>
            <View style={styles.pickerLeft}>
              <View style={styles.pickerIconBox}><Ionicons name="hourglass-outline" size={18} color="#2E7AD9" /></View>
              <Text style={styles.pickerTextSelected}>{selectedDuration} hour(s)</Text>
            </View>
            <Ionicons name={showDurationPicker ? 'chevron-up' : 'chevron-down'} size={18} color="#64748B" />
          </TouchableOpacity>
          {showDurationPicker && (
            <View style={styles.timeDropdown}>
              <View style={styles.timeGrid}>
                {[1, 2, 3, 4, 5].map((dur) => (
                  <TouchableOpacity key={dur} style={[styles.timeChip, selectedDuration === dur && styles.timeChipActive]}
                    onPress={() => { setSelectedDuration(dur); setShowDurationPicker(false); }}>
                    <Text style={[styles.timeChipText, selectedDuration === dur && styles.timeChipTextActive]}>{dur} hour(s)</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Service Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Address</Text>
          <TouchableOpacity style={styles.pickerRow} onPress={() => router.push('/profile/addresses')}>
            <View style={styles.pickerLeft}>
              <View style={styles.pickerIconBox}><Ionicons name="location-outline" size={18} color={colors.primary} /></View>
              {defaultAddress ? (
                <View style={{ flex: 1 }}>
                  <Text style={styles.addressLabel}>{defaultAddress.label || defaultAddress.type}</Text>
                  <Text style={styles.addressSub} numberOfLines={1}>{defaultAddress.street}, {defaultAddress.city}</Text>
                </View>
              ) : <Text style={styles.pickerText}>Add an address</Text>}
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity style={styles.pickerRow} onPress={() => router.push('/profile/payment-methods' as any)}>
            <View style={styles.pickerLeft}>
              <View style={styles.pickerIconBox}><Ionicons name="card-outline" size={18} color={colors.primary} /></View>
              <Text style={styles.pickerTextSelected}>•••• 9012</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          </TouchableOpacity>
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Describe the issue or any specific requirements..."
            placeholderTextColor="#94A3B8"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Problem Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Problem Photos (Optional){problemPhotos.length > 0 ? ` · ${problemPhotos.length}/${MAX_PROBLEM_PHOTOS}` : ''}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {problemPhotos.map((url) => (
              <View key={url} style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                <Image source={{ uri: url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                <TouchableOpacity
                  onPress={() => setProblemPhotos((p) => p.filter((u) => u !== url))}
                  style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Ionicons name="close" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
            {problemPhotos.length < MAX_PROBLEM_PHOTOS && (
              <TouchableOpacity
                style={{ width: 72, height: 72, borderRadius: 8, borderWidth: 1, borderColor: colors.border.default, alignItems: 'center', justifyContent: 'center', opacity: uploadingPhoto ? 0.6 : 1 }}
                onPress={handlePickProblemPhoto}
                disabled={uploadingPhoto}
              >
                <Ionicons name={uploadingPhoto ? 'cloud-upload-outline' : 'image-outline'} size={26} color={colors.text.secondary} />
                <Text style={{ fontSize: 10, color: colors.text.secondary, marginTop: 2 }}>
                  {uploadingPhoto ? 'Uploading' : 'Add'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceSummaryLabel}>Service Price</Text>
            <Text style={styles.priceSummaryValue}>
              ${(listing?.hourlyRate || listing?.basePrice || 0) * selectedDuration}
            </Text>
          </View>
          <Text style={styles.priceNote}>
            {selectedDuration} hour(s) × ${listing?.hourlyRate || listing?.basePrice || 0}/hour
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.ctaContainer}>
        <TouchableOpacity style={[styles.confirmBtn, (!selectedDate || !selectedTime) && styles.confirmBtnDisabled]}
          onPress={handleConfirm} disabled={!selectedDate || !selectedTime}>
          <Text style={[styles.confirmBtnText, (!selectedDate || !selectedTime) && styles.confirmBtnTextDisabled]}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        <TouchableOpacity onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)/services/handyman');
        }} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F7FF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 16, paddingBottom: 24, paddingHorizontal: 24,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 30, elevation: 4,
    borderBottomWidth: 1, borderBottomColor: 'rgba(46, 122, 217, 0.08)',
  },
  headerInner: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1E293B' },
  scrollContent: { padding: 24 },
  serviceCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  serviceLogoCircle: {
    width: 64, height: 64, borderRadius: 12,
    backgroundColor: '#E3F0FF', justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  serviceLogoImg: { width: 64, height: 64, borderRadius: 12 },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 15, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  vendorName: { fontSize: 13, color: '#64748B', marginBottom: 4 },
  servicePrice: { fontSize: 15, fontWeight: '600', color: '#2E7AD9' },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '500', color: '#1E293B', marginBottom: 8 },
  pickerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.15)', padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  pickerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  pickerIconBox: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#E8F1FC', justifyContent: 'center', alignItems: 'center',
  },
  pickerText: { fontSize: 15, color: '#64748B' },
  pickerTextSelected: { fontSize: 15, color: '#1E293B', fontWeight: '500' },
  addressLabel: { fontSize: 15, fontWeight: '500', color: '#1E293B' },
  addressSub: { fontSize: 13, color: '#64748B', marginTop: 1 },
  dateDropdown: {
    marginTop: 4, backgroundColor: '#FFFFFF', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(46, 122, 217, 0.15)', overflow: 'hidden',
  },
  dateDropdownItem: { paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(46, 122, 217, 0.06)' },
  dateDropdownItemActive: { backgroundColor: 'rgba(46, 122, 217, 0.06)' },
  dateDropdownText: { fontSize: 15, color: '#1E293B' },
  dateDropdownTextActive: { color: '#2E7AD9', fontWeight: '600' },
  timeDropdown: {
    marginTop: 4, backgroundColor: '#FFFFFF', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(46, 122, 217, 0.15)', padding: 16,
  },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: {
    width: '47%', paddingVertical: 14, alignItems: 'center',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(46, 122, 217, 0.15)',
    backgroundColor: '#F0F7FF',
  },
  timeChipActive: { backgroundColor: '#2E7AD9', borderColor: '#2E7AD9' },
  timeChipText: { fontSize: 14, color: '#1E293B' },
  timeChipTextActive: { color: '#FFFFFF', fontWeight: '500' },
  notesInput: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(46, 122, 217, 0.15)',
    borderRadius: 12, padding: 16, fontSize: 15, color: '#1E293B', minHeight: 90,
  },
  priceSummary: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  priceSummaryLabel: { fontSize: 14, color: '#64748B' },
  priceSummaryValue: { fontSize: 15, fontWeight: '500', color: '#1E293B' },
  priceNote: { fontSize: 12, color: '#64748B', marginTop: 4 },
  ctaContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 24, paddingBottom: 28,
    backgroundColor: '#F0F7FF',
    borderTopWidth: 1, borderTopColor: 'rgba(46, 122, 217, 0.1)',
  },
  confirmBtn: { backgroundColor: '#2E7AD9', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  confirmBtnDisabled: { backgroundColor: '#E8F1FC' },
  confirmBtnText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  confirmBtnTextDisabled: { color: '#94A3B8' },
});
