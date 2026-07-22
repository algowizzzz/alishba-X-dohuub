import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  Image,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { pickAndUploadAvatar } from '../../src/services/uploadImage';

export default function EditProfileScreen() {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [fullName, setFullName] = useState(
    [user?.profile?.firstName, user?.profile?.lastName].filter(Boolean).join(' ') || ''
  );
  const [phone, setPhone] = useState(user?.phone || '');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.profile?.avatar || null);
  const [uploading, setUploading] = useState(false);

  const handlePhotoPress = async () => {
    if (uploading) return;
    setUploading(true);
    try {
      const url = await pickAndUploadAvatar();
      if (url) setAvatarUrl(url);
    } finally {
      setUploading(false);
    }
  };

  const handlePhoneChange = (text: string) => {
    // Digits only (optional leading + for country code)
    const cleaned = text.replace(/[^\d+]/g, '');
    const normalized = cleaned.startsWith('+')
      ? `+${cleaned.slice(1).replace(/\+/g, '')}`
      : cleaned.replace(/\+/g, '');
    setPhone(normalized);
  };

  const handleSave = async () => {
    Keyboard.dismiss();
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    if (!firstName) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phone.trim() && phoneDigits.length < 7) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      await updateProfile({
        firstName,
        lastName,
        phone: phone.trim(),
        avatar: avatarUrl || undefined,
      });
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Image
                  source={
                    avatarUrl
                      ? { uri: avatarUrl }
                      : require('../../assets/placeholder-image.jpeg')
                  }
                  style={styles.avatarImage}
                />
                {uploading && (
                  <View style={styles.avatarOverlay}>
                    <ActivityIndicator color="#FFFFFF" />
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handlePhotoPress}
                disabled={uploading}
              >
                <LinearGradient
                  colors={['#2E7AD9', '#1E6AC9']}
                  style={styles.cameraGradient}
                >
                  <Ionicons name="camera" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'name' && styles.inputFocused,
                ]}
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your full name"
                placeholderTextColor="#94A3B8"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'phone' && styles.inputFocused,
                ]}
                value={phone}
                onChangeText={handlePhoneChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                placeholder="(555) 123-4567"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                maxLength={16}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={user?.email || ''}
                editable={false}
              />
              <Text style={styles.emailHint}>Email cannot be changed</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Pinned to screen bottom — not inside KeyboardAvoidingView */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
    zIndex: 50,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2E7AD9',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  cameraGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E7AD9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  form: {
    gap: 20,
  },
  fieldContainer: {},
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.15)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  inputFocused: {
    borderColor: '#2E7AD9',
    shadowColor: '#2E7AD9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },
  emailHint: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748B',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    // borderTopWidth: 1,
    // borderTopColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#2E7AD9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E7AD9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
