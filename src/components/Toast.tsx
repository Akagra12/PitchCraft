import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Spacing, FontSize, Radius } from '../theme/theme';
import { useApp } from '../context/AppContext';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'info', visible, onHide, duration = 2500 }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-30)).current;
  const { colors } = useApp();
  const useNativeDriver = Platform.OS !== 'web';

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver }),
        Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver }),
      ]).start();

      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver }),
          Animated.timing(translateY, { toValue: -30, duration: 200, useNativeDriver }),
        ]).start(() => onHide());
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [visible, duration, onHide, opacity, translateY, useNativeDriver]);

  if (!visible) return null;

  const bgColor =
    type === 'success' ? colors.success :
    type === 'error' ? colors.error :
    colors.accent;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bgColor, opacity, transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: Spacing.lg,
    right: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    zIndex: 1000,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: '600',
    textAlign: 'center',
  },
});
