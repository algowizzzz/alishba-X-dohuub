import React, { useState } from 'react';
import { Image, View, StyleSheet, ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ServiceImageProps {
  uri?: string | null;
  fallbackUri?: string;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  icon?: keyof typeof Ionicons.glyphMap;
}

/**
 * Remote service/vendor image with graceful fallback when the URL fails.
 */
export function ServiceImage({
  uri,
  fallbackUri,
  style,
  containerStyle,
  resizeMode = 'cover',
  icon = 'image-outline',
}: ServiceImageProps) {
  const [failed, setFailed] = useState(false);
  const primary = uri && /^https?:\/\//i.test(uri) ? uri : null;
  const source = !failed && primary ? primary : fallbackUri;

  if (!source) {
    return (
      <View style={[styles.fallback, style, containerStyle]}>
        <Ionicons name={icon} size={28} color="#94A3B8" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: source }}
      style={style}
      resizeMode={resizeMode}
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#E8F1FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
