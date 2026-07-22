import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ViewToken,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ImageCarouselProps {
  images: string[];
  height?: number;
  fallbackUri?: string;
  /** Soft inset card look with rounded corners (default true). */
  rounded?: boolean;
  /** Horizontal inset when rounded. */
  inset?: number;
  borderRadius?: number;
}

function CarouselImage({
  uri,
  height,
  width,
  fallbackUri,
  borderRadius,
}: {
  uri: string;
  height: number;
  width: number;
  fallbackUri?: string;
  borderRadius: number;
}) {
  const [failed, setFailed] = useState(false);
  const sourceUri = failed && fallbackUri ? fallbackUri : uri;

  if (failed && !fallbackUri) {
    return (
      <View style={[styles.placeholder, { height, width, borderRadius }]}>
        <Ionicons name="image-outline" size={40} color={colors.text.muted} />
        <Text style={styles.placeholderText}>Photo unavailable</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: sourceUri }}
      style={{ height, width, borderRadius }}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

export function ImageCarousel({
  images,
  height = 240,
  fallbackUri,
  rounded = true,
  inset = 16,
  borderRadius = 20,
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const side = rounded ? inset : 0;
  const radius = rounded ? borderRadius : 0;
  const slideWidth = SCREEN_WIDTH - side * 2;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  if (!images || images.length === 0) {
    return (
      <View style={[styles.outer, rounded && { paddingHorizontal: side, paddingTop: 8, paddingBottom: 4 }]}>
        <View style={[styles.placeholder, { height, borderRadius: radius, width: '100%' }]}>
          {fallbackUri ? (
            <Image
              source={{ uri: fallbackUri }}
              style={{ height, width: '100%', borderRadius: radius }}
              resizeMode="cover"
            />
          ) : (
            <>
              <Ionicons name="image-outline" size={40} color={colors.text.muted} />
              <Text style={styles.placeholderText}>No photos yet</Text>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.outer, rounded && { paddingHorizontal: side, paddingTop: 8, paddingBottom: 4 }]}>
      <View
        style={[
          styles.wrap,
          {
            height,
            borderRadius: radius,
            width: slideWidth,
          },
        ]}
      >
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, i) => `${item}-${i}`}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          decelerationRate="fast"
          bounces={false}
          style={{ borderRadius: radius }}
          renderItem={({ item }) => (
            <CarouselImage
              uri={item}
              height={height}
              width={slideWidth}
              fallbackUri={fallbackUri}
              borderRadius={radius}
            />
          )}
        />

        {images.length > 1 && (
          <View style={styles.counterBadge}>
            <Ionicons name="images-outline" size={12} color="#fff" />
            <Text style={styles.counterText}>
              {activeIndex + 1}/{images.length}
            </Text>
          </View>
        )}

        {images.length > 1 && (
          <View style={styles.dotsContainer}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  wrap: {
    backgroundColor: '#E8F1FC',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  placeholder: {
    backgroundColor: '#E8F1FC',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  placeholderText: {
    fontSize: 13,
    color: colors.text.muted,
    fontWeight: '500',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    gap: 6,
  },
  dot: {
    height: 7,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 18,
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    width: 7,
  },
  counterBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
