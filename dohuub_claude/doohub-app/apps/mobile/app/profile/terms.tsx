import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SECTIONS = [
  {
    title: '1. Introduction',
    body: 'By accessing and using the DoHuub application, you accept and agree to be bound by the terms and provision of this agreement. These terms apply to all visitors, users, and others who access or use the service.',
  },
  {
    title: '2. User Responsibilities',
    body: 'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security.',
  },
  {
    title: '3. Service Usage',
    body: 'DoHuub provides a platform connecting users with service providers across various categories including cleaning, handyman services, groceries, beauty, rental properties, and caregiving services. All bookings made through the platform are subject to availability and confirmation by the service provider.',
  },
  {
    title: '4. Payment Terms',
    body: 'All payments are processed securely through our payment partners. By making a payment, you authorize us to charge your selected payment method. Cancellation policies vary by service provider. Please review the specific cancellation terms before confirming your booking.',
  },
  {
    title: '5. Privacy and Data',
    body: 'Your use of DoHuub is also governed by our Privacy Policy. Please review our Privacy Policy for information on how we collect, use, and protect your data. We implement appropriate technical and organizational measures to protect your personal information.',
  },
  {
    title: '6. Limitation of Liability',
    body: 'DoHuub facilitates the connection but is not directly responsible for the service quality provided by third-party vendors. In no event shall DoHuub be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.',
  },
  {
    title: '7. Termination',
    body: 'We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.',
  },
  {
    title: '8. Contact Information',
    body: 'If you have any questions about these Terms of Service, please contact us:',
  },
];

export default function TermsScreen() {
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
      {/* Glassmorphic Header */}
      <View style={[styles.header, { paddingTop: 12 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms of Service</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last Updated: December 1, 2025</Text>

        {SECTIONS.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
            {/* Contact card for last section */}
            {index === SECTIONS.length - 1 && (
              <View style={styles.contactCard}>
                <Text style={styles.contactText}>Email: legal@dohuub.com</Text>
                <Text style={styles.contactText}>Phone: 1-800-DOHUUB1</Text>
                <Text style={styles.contactText}>
                  Address: 123 Service Lane, Suite 100, San Francisco, CA 94105
                </Text>
              </View>
            )}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  },
  lastUpdated: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  contactCard: {
    marginTop: 12,
    backgroundColor: '#E8F1FC',
    borderRadius: 16,
    padding: 16,
  },
  contactText: {
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 4,
  },
});
