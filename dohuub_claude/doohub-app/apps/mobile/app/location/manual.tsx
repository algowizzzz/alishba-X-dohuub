import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button, EmptyState } from '../../src/components/ui';
import { useAuthStore } from '../../src/store/authStore';
import { getAddressesByUser } from '../../src/lib/queries';

// Autocomplete suggestions (static fallback until geocoding API is wired)
const STATIC_SUGGESTIONS = [
  { id: '1', address: '123 Main Street, New York, NY 10001' },
  { id: '2', address: '456 Broadway, New York, NY 10012' },
  { id: '3', address: '789 Park Avenue, New York, NY 10021' },
];

/**
 * Manual Location Screen matching wireframe:
 * - Search input for address
 * - Recent addresses list
 * - "Use current location" button
 * - Address autocomplete results
 * - Confirm button
 */
interface SavedAddress {
  id: string;
  type: string;
  label: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export default function ManualLocationScreen() {
  const { setSelectedAddress } = useAuthStore();
  const user = useAuthStore((s) => s.user);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState(STATIC_SUGGESTIONS);

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await getAddressesByUser(user.id);
      const mapped: SavedAddress[] = (data || []).map((addr: any) => ({
        id: addr.id,
        type: addr.type || 'OTHER',
        label: addr.label || addr.type || 'Address',
        street: addr.street || '',
        apartment: addr.apartment || undefined,
        city: addr.city || '',
        state: addr.state || '',
        zipCode: addr.zipCode || '',
        country: addr.country || '',
        latitude: addr.latitude || undefined,
        longitude: addr.longitude || undefined,
        isDefault: !!addr.isDefault,
      }));
      setSavedAddresses(mapped);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setShowSuggestions(true);
      // TODO: Call geocoding API for real suggestions
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: typeof STATIC_SUGGESTIONS[0]) => {
    setSearchQuery(suggestion.address);
    setShowSuggestions(false);
    // TODO: Parse address and save
  };

  const handleSelectRecentAddress = (addressId: string) => {
    setSelectedAddress(addressId);
    router.back();
  };

  const handleUseCurrentLocation = () => {
    // TODO: Get current location and reverse geocode
    router.push('/location-permission');
  };

  const handleAddNewAddress = () => {
    router.push('/profile/add-address');
  };

  const renderRecentAddress = ({ item }: { item: SavedAddress }) => (
    <TouchableOpacity
      style={styles.addressCard}
      onPress={() => handleSelectRecentAddress(item.id)}
    >
      <View style={styles.addressIcon}>
        <Ionicons
          name={item.type === 'HOME' ? 'home-outline' : item.type === 'WORK' ? 'briefcase-outline' : 'location-outline'}
          size={20}
          color={colors.text.secondary}
        />
      </View>
      <View style={styles.addressInfo}>
        <Text style={styles.addressLabel}>{item.label}</Text>
        <Text style={styles.addressText} numberOfLines={1}>
          {item.street}, {item.city}, {item.state}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
    </TouchableOpacity>
  );

  const renderSuggestion = ({ item }: { item: typeof STATIC_SUGGESTIONS[0] }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item)}
    >
      <Ionicons name="location-outline" size={20} color={colors.text.secondary} />
      <Text style={styles.suggestionText}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Set Location" showBack />

      <View style={styles.content}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for an address..."
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color={colors.text.muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Autocomplete Suggestions */}
        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              renderItem={renderSuggestion}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        )}

        {/* Use Current Location */}
        <TouchableOpacity style={styles.currentLocationButton} onPress={handleUseCurrentLocation}>
          <View style={styles.currentLocationIcon}>
            <Ionicons name="navigate" size={20} color={colors.primary} />
          </View>
          <Text style={styles.currentLocationText}>Use current location</Text>
        </TouchableOpacity>

        {/* Recent/Saved Addresses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            <TouchableOpacity onPress={handleAddNewAddress}>
              <Ionicons name="add" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {isLoadingAddresses ? (
            <View style={styles.emptyAddresses}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : savedAddresses.length > 0 ? (
            <FlatList
              data={savedAddresses}
              keyExtractor={(item) => item.id}
              renderItem={renderRecentAddress}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyAddresses}>
              <Text style={styles.emptyText}>No saved addresses yet</Text>
              <Button
                title="Add Address"
                variant="outline"
                onPress={handleAddNewAddress}
                style={styles.addButton}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
  },
  suggestionsContainer: {
    borderWidth: borderWidth.default,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    marginBottom: spacing.md,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  suggestionText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  separator: {
    height: borderWidth.thin,
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  currentLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationText: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
  },
  section: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  addressText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  emptyAddresses: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  addButton: {
    minWidth: 150,
  },
});

