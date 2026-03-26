import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';
import api from '../../src/services/api';
import { ENDPOINTS } from '../../src/constants/api';

const OTP_LENGTH = 6;

export default function VerifyOTPScreen() {
  const { email, isRegistration } = useLocalSearchParams<{
    email: string;
    isRegistration: string;
  }>();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(59);
  const [error, setError] = useState('');
  const inputRefs = useRef<TextInput[]>([]);
  const { verifyOtp, isLoading } = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimer = () => {
    const seconds = timer.toString().padStart(2, '0');
    return `0:${seconds}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit) && newOtp.join('').length === OTP_LENGTH) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');

    if (code.length !== OTP_LENGTH) {
      setError('Invalid code. Please try again');
      return;
    }

    try {
      await verifyOtp(email!, code, isRegistration === 'true');

      if (isRegistration === 'true') {
        router.replace('/(auth)/profile-setup');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      if (__DEV__ || process.env.NODE_ENV === 'development') {
        console.log('DEV MODE: Backend unavailable, skipping OTP verification');
        if (isRegistration === 'true') {
          router.replace('/(auth)/profile-setup');
        } else {
          router.replace('/(tabs)');
        }
        return;
      }

      console.error('OTP verification error:', error);
      setError('Invalid code. Please try again');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post(ENDPOINTS.AUTH.RESEND_OTP, { email });
      setTimer(59);
      setError('');
      Alert.alert('Success', 'A new verification code has been sent');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code');
    }
  };

  const isOtpComplete = otp.every((d) => d);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Shield Icon */}
        <View style={styles.shieldContainer}>
          <View style={styles.shieldCircle}>
            <Ionicons name="shield-checkmark-outline" size={40} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref!)}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
                error && styles.otpInputError,
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value.slice(-1), index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Error Message */}
        {error && <Text style={styles.error}>{error}</Text>}

        {/* Timer / Resend */}
        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend code in {formatTimer()}</Text>
          ) : (
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.verifyButton, (!isOtpComplete || isLoading) && styles.verifyButtonDisabled]}
          onPress={() => handleVerify()}
          disabled={!isOtpComplete || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={[styles.verifyButtonText, (!isOtpComplete || isLoading) && styles.verifyButtonTextDisabled]}>
              Verify
            </Text>
          )}
        </TouchableOpacity>

        {/* DEV ONLY: Skip OTP button */}
        {__DEV__ && (
          <TouchableOpacity
            style={styles.devSkipButton}
            onPress={() => handleVerify('000000')}
          >
            <Text style={styles.devSkipText}>DEV: Skip OTP</Text>
          </TouchableOpacity>
        )}
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 48,
  },
  shieldContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  shieldCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    lineHeight: 24,
    textAlign: 'center',
  },
  email: {
    fontWeight: '600',
    color: colors.primary,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    textAlign: 'center',
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  otpInputFilled: {
    borderColor: colors.primary,
  },
  otpInputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  error: {
    fontSize: fontSize.md,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  timerText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  resendLink: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  verifyButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CA6FA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonDisabled: {
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  verifyButtonTextDisabled: {
    color: colors.text.muted,
  },
  devSkipButton: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: 'rgba(46, 122, 217, 0.08)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.2)',
    alignSelf: 'center',
  },
  devSkipText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '600',
    textAlign: 'center',
  },
});
