import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native';
import {
  loadNotificationPrefs,
  saveNotificationPrefs,
  DEFAULT_SETTINGS,
  type NotificationSettings,
} from '../../src/lib/notificationPrefs';

interface NotificationSetting {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

const SETTING_DEFS: { key: keyof NotificationSettings; label: string; description: string }[] = [
  { key: 'pushNotifications', label: 'Push Notifications', description: 'Enable all notifications' },
  { key: 'bookingUpdates', label: 'Booking Updates', description: 'Status changes and reminders' },
  { key: 'promotions', label: 'Promotional Offers', description: 'Discounts and special deals' },
  { key: 'aiAssistant', label: 'AI Assistant Messages', description: 'Responses and suggestions' },
  { key: 'payments', label: 'Payment Confirmations', description: 'Receipts and transaction alerts' },
];

export default function NotificationsScreen() {
  const router = useRouter();
  // SafeAreaView handles insets

  const [prefs, setPrefs] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadNotificationPrefs().then(setPrefs);
  }, []);

  const settings: NotificationSetting[] = SETTING_DEFS.map((d) => ({
    ...d,
    enabled: prefs[d.key],
  }));

  const toggleSetting = (key: string) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key as keyof NotificationSettings] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveNotificationPrefs(prefs);
      Alert.alert('Saved', 'Your notification preferences have been updated.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Glassmorphic Header */}
      <View style={[styles.header, { paddingTop: 12 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {settings.map((item) => (
          <View key={item.key} style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{item.label}</Text>
              <Text style={styles.settingDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleSetting(item.key)}
              activeOpacity={0.8}
              style={[
                styles.toggle,
                { backgroundColor: item.enabled ? '#2E7AD9' : '#E8F1FC' },
              ]}
            >
              <View
                style={[
                  styles.toggleCircle,
                  {
                    transform: [{ translateX: item.enabled ? 20 : 2 }],
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Save Settings Button */}
      <View style={[styles.footer, { paddingBottom: 16 }]}>
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          activeOpacity={0.85}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Saving…' : 'Save Settings'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
  },
  header: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 15,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  content: {
    padding: 20,
    gap: 4,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 4,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#64748B',
  },
  toggle: {
    width: 48,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  toggleCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
  },
  saveButton: {
    backgroundColor: '#2E7AD9',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#2E7AD9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
