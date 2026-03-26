import React, { useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { colors, spacing, borderRadius, borderWidth, fontSize } from '../../constants/theme';

interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
  error?: boolean;
  autoFocus?: boolean;
}

/**
 * OTP Input component matching wireframes
 * - 6 individual digit boxes
 * - 2px border with rounded corners
 * - Auto-focus next on input
 * - Auto-focus previous on backspace
 */
export function OTPInput({
  length = 6,
  value,
  onChange,
  error = false,
  autoFocus = true,
}: OTPInputProps) {
  const inputRefs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    // Only allow digits
    if (!/^\d*$/.test(text)) return;

    const newValue = [...value];
    newValue[index] = text.slice(-1); // Take only last character
    onChange(newValue);

    // Auto-focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current is empty
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Select text on focus for easier editing
    inputRefs.current[index]?.setSelection(0, 1);
  };

  return (
    <View style={styles.container}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            style={[
              styles.input,
              value[index] && styles.inputFilled,
              error && styles.inputError,
            ]}
            value={value[index] || ''}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            autoFocus={autoFocus && index === 0}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  input: {
    width: 48,
    height: 56,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    textAlign: 'center',
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
    backgroundColor: colors.background,
  },
  inputFilled: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.status.error,
  },
});

