import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button, Input } from '../../src/components/ui';

/**
 * Edit Profile screen matching wireframe:
 * - Profile photo with edit option
 * - Name field
 * - Email field (read-only)
 * - Phone field
 * - Save button
 */
export default function EditProfileScreen() {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.profile?.firstName || '');
  const [lastName, setLastName] = useState(user?.profile?.lastName || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');

  const handlePhotoPress = () => {
    Alert.alert('Coming Soon', 'Photo upload will be available soon!');
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return;
    }

    try {
      await updateProfile({ firstName, lastName, phone });
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Edit Profile" showBack />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Photo */}
          <TouchableOpacity style={styles.photoContainer} onPress={handlePhotoPress}>
            <View style={styles.photoCircle}>
              <Ionicons name="person" size={48} color={colors.text.muted} />
            </View>
            <View style={styles.photoEditBadge}>
              <Ionicons name="camera" size={16} color={colors.text.inverse} />
            </View>
          </TouchableOpacity>

          {/* Form Fields */}
          <View style={styles.form}>
            <Input
              label="First Name"
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />

            <Input
              label="Last Name"
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />

            <Input
              label="Email"
              value={user?.email || ''}
              editable={false}
              containerStyle={styles.disabledInput}
            />

            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </ScrollView>

        <View style={styles.ctaContainer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={isLoading}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  photoContainer: {
    alignSelf: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  photoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    borderWidth: borderWidth.default,
    borderColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    gap: spacing.xs,
  },
  disabledInput: {
    opacity: 0.6,
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
  },
});

