import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';

const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '1';

/**
 * About screen matching wireframe:
 * - App logo and name
 * - Version info
 * - Links to website, social media
 * - Legal links
 * - Copyright
 */
export default function AboutScreen() {
  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      // Handle error silently
    });
  };

  const links = [
    {
      id: 'website',
      icon: 'globe-outline' as const,
      label: 'Visit our Website',
      url: 'https://dohuub.com',
    },
    {
      id: 'twitter',
      icon: 'logo-twitter' as const,
      label: 'Follow us on Twitter',
      url: 'https://twitter.com/dohuub',
    },
    {
      id: 'instagram',
      icon: 'logo-instagram' as const,
      label: 'Follow us on Instagram',
      url: 'https://instagram.com/dohuub',
    },
    {
      id: 'facebook',
      icon: 'logo-facebook' as const,
      label: 'Like us on Facebook',
      url: 'https://facebook.com/dohuub',
    },
  ];

  const legalLinks = [
    {
      id: 'terms',
      label: 'Terms of Service',
      url: 'https://dohuub.com/terms',
    },
    {
      id: 'privacy',
      label: 'Privacy Policy',
      url: 'https://dohuub.com/privacy',
    },
    {
      id: 'licenses',
      label: 'Open Source Licenses',
      url: 'https://dohuub.com/licenses',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="About" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info */}
        <View style={styles.appInfo}>
          <View style={styles.logoContainer}>
            <Ionicons name="cube" size={64} color={colors.primary} />
          </View>
          <Text style={styles.appName}>DoHuub</Text>
          <Text style={styles.tagline}>Infinite Services</Text>
          <Text style={styles.version}>
            Version {APP_VERSION} ({BUILD_NUMBER})
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.description}>
            DoHuub is your one-stop marketplace for all home and personal services. 
            From cleaning to caregiving, we connect you with trusted professionals 
            in your neighborhood.
          </Text>
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          {links.map((link) => (
            <TouchableOpacity
              key={link.id}
              style={styles.linkItem}
              onPress={() => handleOpenLink(link.url)}
            >
              <Ionicons name={link.icon} size={24} color={colors.text.secondary} />
              <Text style={styles.linkText}>{link.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Legal Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          {legalLinks.map((link) => (
            <TouchableOpacity
              key={link.id}
              style={styles.linkItem}
              onPress={() => handleOpenLink(link.url)}
            >
              <Ionicons name="document-text-outline" size={24} color={colors.text.secondary} />
              <Text style={styles.linkText}>{link.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => handleOpenLink('mailto:support@dohuub.com')}
          >
            <Ionicons name="mail-outline" size={24} color={colors.text.secondary} />
            <Text style={styles.linkText}>support@dohuub.com</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <View style={styles.copyright}>
          <Text style={styles.copyrightText}>
            © {new Date().getFullYear()} DoHuub Inc.
          </Text>
          <Text style={styles.copyrightText}>
            All rights reserved.
          </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text.primary,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  version: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    lineHeight: 24,
    textAlign: 'center',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.secondary,
    gap: spacing.md,
  },
  linkText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  copyright: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  copyrightText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
});

