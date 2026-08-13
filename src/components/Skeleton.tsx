import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { colors, radius } from '@/theme';

interface Props {
  width?: number | `${number}%`;
  height?: number;
  style?: ViewStyle;
  round?: boolean;
}

export function Skeleton({ width = '100%', height = 16, style, round }: Props) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: round ? 999 : radius.sm, backgroundColor: colors.cardHi, opacity },
        style,
      ]}
    />
  );
}

export function ProviderSkeleton() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <Animated.View key={i} style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
          <Skeleton width={104} height={116} />
          <Animated.View style={{ flex: 1, gap: 10, paddingTop: 6 }}>
            <Skeleton width="70%" height={16} />
            <Skeleton width="50%" height={12} />
            <Skeleton width="40%" height={12} />
          </Animated.View>
        </Animated.View>
      ))}
    </>
  );
}
