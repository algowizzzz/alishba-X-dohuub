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
    title: 'Introduction',
    body: 'This Privacy Policy describes how DoHuub collects, uses, and shares information about you when you use our mobile application and related services. By using DoHuub, you agree to the collection and use of information in accordance with this policy.',
  },
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide directly to us, including your name, email address, phone number, and addresses. We also collect information about your usage of our services, device information, and location data when you grant permission.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send notifications, and communicate with you. We may also use your information to personalize your experience and provide relevant recommendations.',
  },
  {
    title: '3. Information Sharing',
    body: 'We share your information with service providers to fulfill your bookings. We do not sell your personal information to third parties. We may share aggregated, non-personally identifiable information with partners for analytics purposes.',
  },
  {
    title: '4. Data Security',
    body: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.',
  },
  {
    title: '5. Your Rights',
    body: 'You have the right to access, update, or delete your personal information. You can manage your data through the app settings or by contacting our support team. You may also opt out of promotional communications at any time.',
  },
  {
    title: '6. Cookies and Tracking',
    body: 'We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.',
  },
  {
    title: '7. Data Retention',
    body: 'We retain your personal information for as long as your account is active or as needed to provide you services. We will retain and use your information as necessary to comply with our legal obligations and resolve disputes.',
  },
  {
    title: '8. Changes to This Policy',
    body: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.',
  },
  {
    title: '9. Contact Us',
    body: 'If you have any questions about this Privacy Policy, please contact us:',
  },
];

export default function PrivacyScreen() {
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
          <Text style={styles.headerTitle}>Privacy Policy</Text>
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
                <Text style={styles.contactText}>Email: privacy@dohuub.com</Text>
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
