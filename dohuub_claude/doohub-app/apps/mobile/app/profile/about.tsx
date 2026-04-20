import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PRIMARY = '#2E7AD9';
const BACKGROUND = '#F0F7FF';
const CARD = '#FFFFFF';
const FOREGROUND = '#1A1A2E';
const MUTED = '#6B7280';
const SECONDARY_BG = '#E8F0FE';

const services = [
  {
    icon: 'sparkles-outline' as const,
    title: 'Cleaning Services',
    description: 'Professional home and office cleaning',
    color: '#2E7AD9',
  },
  {
    icon: 'construct-outline' as const,
    title: 'Handyman Services',
    description: 'Expert repairs and maintenance',
    color: '#EAB308',
  },
  {
    icon: 'cart-outline' as const,
    title: 'Groceries & Food',
    description: 'Fresh groceries and meals delivered',
    color: '#F59E0B',
  },
  {
    icon: 'cut-outline' as const,
    title: 'Beauty on Demand',
    description: 'Salon services at your location',
    color: '#EC4899',
  },
  {
    icon: 'home-outline' as const,
    title: 'Rental Properties',
    description: 'Find your perfect home',
    color: '#10B981',
  },
  {
    icon: 'heart-outline' as const,
    title: 'Caregiving Services',
    description: 'Ride assistance and companionship',
    color: '#8B5CF6',
  },
];

const whyChoose = [
  'Verified and trusted service providers',
  'Secure and seamless payment processing',
  'Real-time order tracking and updates',
  '24/7 AI-powered customer support',
  'Flexible scheduling and instant booking',
  'Transparent pricing with no hidden fees',
];

export default function AboutScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND} />

      {/* Glassmorphic Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={FOREGROUND} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About DoHuub</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Our Mission */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            DoHuub is your all-in-one lifestyle super-app, designed to simplify your daily life by connecting you with trusted service providers. From cleaning and handyman services to beauty treatments and caregiving support, we bring infinite services right to your fingertips.
          </Text>
        </View>

        {/* What We Offer */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>What We Offer</Text>
          {services.map((service, index) => (
            <View key={index} style={styles.serviceCard}>
              <View style={[styles.serviceIconCircle, { backgroundColor: service.color + '18' }]}>
                <Ionicons name={service.icon} size={22} color={service.color} />
              </View>
              <View style={styles.serviceTextContainer}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Why Choose DoHuub */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Why Choose DoHuub?</Text>
          {whyChoose.map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Contact Us */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactItemsContainer}>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL('mailto:support@dohuub.com').catch(() => {})}
            >
              <View style={styles.contactIconCircle}>
                <Ionicons name="mail-outline" size={20} color={PRIMARY} />
              </View>
              <Text style={styles.contactText}>support@dohuub.com</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL('tel:18003648821').catch(() => {})}
            >
              <View style={styles.contactIconCircle}>
                <Ionicons name="call-outline" size={20} color={PRIMARY} />
              </View>
              <View>
                <Text style={styles.contactText}>1-800-DOHUUB1</Text>
                <Text style={styles.contactSubText}>(1-800-364-8821)</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL('https://www.dohuub.com').catch(() => {})}
            >
              <View style={styles.contactIconCircle}>
                <Ionicons name="globe-outline" size={20} color={PRIMARY} />
              </View>
              <Text style={styles.contactText}>www.dohuub.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Follow Us */}
        <View style={styles.followSection}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL('https://instagram.com/dohuub').catch(() => {})}
            >
              <Ionicons name="logo-instagram" size={22} color={PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL('https://tiktok.com/@dohuub').catch(() => {})}
            >
              <Ionicons name="logo-tiktok" size={22} color={PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Credits */}
        <View style={styles.credits}>
          <Text style={styles.creditsText}>Made with love for our community</Text>
          <Text style={[styles.creditsText, { opacity: 0.7 }]}>
            {'\u00A9'} {new Date().getFullYear()} DoHuub, Inc. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: FOREGROUND,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 20,
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: FOREGROUND,
    marginBottom: 12,
    textAlign: 'center',
  },
  missionText: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 22,
    textAlign: 'center',
  },
  serviceCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: FOREGROUND,
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 13,
    color: MUTED,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY,
    marginRight: 12,
  },
  bulletText: {
    fontSize: 14,
    color: MUTED,
  },
  contactItemsContainer: {
    gap: 16,
  },
  contactItem: {
    alignItems: 'center',
    gap: 8,
  },
  contactIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SECONDARY_BG,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  contactText: {
    fontSize: 14,
    color: FOREGROUND,
    textAlign: 'center',
  },
  contactSubText: {
    fontSize: 12,
    color: MUTED,
    textAlign: 'center',
  },
  followSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: SECONDARY_BG,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  credits: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  creditsText: {
    fontSize: 13,
    color: MUTED,
    marginBottom: 4,
    textAlign: 'center',
  },
});
