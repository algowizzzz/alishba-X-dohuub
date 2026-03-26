import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, SafeAreaView } from 'react-native';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

/**
 * Notification Settings screen matching wireframe:
 * - Toggle switches for different notification types
 */
export default function NotificationsScreen() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'booking',
      label: 'Booking Updates',
      description: 'Receive updates about your bookings',
      enabled: true,
    },
    {
      id: 'promotions',
      label: 'Promotions & Offers',
      description: 'Get notified about special deals and discounts',
      enabled: true,
    },
    {
      id: 'reminders',
      label: 'Service Reminders',
      description: 'Reminders before your scheduled services',
      enabled: true,
    },
    {
      id: 'reviews',
      label: 'Review Requests',
      description: 'Receive requests to review completed services',
      enabled: true,
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      description: 'Weekly updates and tips',
      enabled: false,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(
      settings.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Notifications" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>

        <View style={styles.settingsCard}>
          {settings.map((setting, index) => (
            <View
              key={setting.id}
              style={[
                styles.settingRow,
                index < settings.length - 1 && styles.settingRowBorder,
              ]}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{setting.label}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: colors.border.default, true: colors.text.secondary }}
                thumbColor={setting.enabled ? colors.primary : colors.secondary}
              />
            </View>
          ))}
        </View>

        <Text style={styles.note}>
          You can always change these settings later. Some notifications may be required for service updates.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  settingsCard: {
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  settingRowBorder: {
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  note: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.lg,
    lineHeight: 20,
  },
});

