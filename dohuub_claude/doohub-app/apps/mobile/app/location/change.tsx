import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';

const RECENT_LOCATIONS = [
  { city: 'New York', country: 'USA', distance: 'Current' },
  { city: 'Los Angeles', country: 'USA', distance: '2,789 km' },
  { city: 'Miami', country: 'USA', distance: '1,759 km' },
  { city: 'London', country: 'UK', distance: '5,585 km' },
  { city: 'Toronto', country: 'Canada', distance: '550 km' },
  { city: 'Sydney', country: 'Australia', distance: '16,014 km' },
];

/**
 * Location Change screen matching wireframe:
 * - Header: "Select Location" with search input
 * - "Use Current Location" button with gradient icon
 * - Recent locations list with city, country, distance badges
 */
export default function LocationChangeScreen() {
  const [search, setSearch] = useState('');

  const filteredLocations = RECENT_LOCATIONS.filter(
    (loc) =>
      loc.city.toLowerCase().includes(search.toLowerCase()) ||
      loc.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (city: string, country: string) => {
    // Navigate back with selected location
    router.back();
  };

  const handleUseCurrentLocation = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Location</Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.text.muted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search city or region"
            placeholderTextColor={colors.text.muted}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Use Current Location */}
        <TouchableOpacity style={styles.currentLocationButton} onPress={handleUseCurrentLocation}>
          <View style={styles.currentLocationIcon}>
            <Ionicons name="navigate" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.currentLocationText}>Use Current Location</Text>
        </TouchableOpacity>

        {/* Recent Locations */}
        <Text style={styles.sectionLabel}>Recent Locations</Text>
        <View style={styles.locationsList}>
          {filteredLocations.map((loc) => (
            <TouchableOpacity
              key={`${loc.city}-${loc.country}`}
              style={styles.locationCard}
              onPress={() => handleSelect(loc.city, loc.country)}
              activeOpacity={0.7}
            >
              <View style={styles.locationIconCircle}>
                <Ionicons name="location" size={20} color={colors.primary} />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationCity}>{loc.city}</Text>
                <Text style={styles.locationCountry}>{loc.country}</Text>
              </View>
              <Text
                style={[
                  styles.locationDistance,
                  loc.distance === 'Current' && styles.locationDistanceCurrent,
                ]}
              >
                {loc.distance}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border.default,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  searchIcon: {
    paddingLeft: spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(46, 122, 217, 0.08)',
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  currentLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CA6FA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  currentLocationText: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
  },
  sectionLabel: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  locationsList: {
    gap: spacing.sm,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  locationIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationCity: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
  },
  locationCountry: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  locationDistance: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
  },
  locationDistanceCurrent: {
    color: 'rgb(34, 197, 94)',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
});
