import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, Radius } from '../theme/theme';
import { useApp } from '../context/AppContext';

/**
 * Circular badge showing the mock AI score with color coding.
 */
interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const { colors } = useApp();

  const dimensions = size === 'sm' ? 40 : size === 'md' ? 56 : 72;
  const fontSize = size === 'sm' ? FontSize.sm : size === 'md' ? FontSize.lg : FontSize.xl;
  const labelSize = size === 'sm' ? 8 : size === 'md' ? FontSize.xs : FontSize.sm;

  // Color by score tier
  const ringColor =
    score >= 80 ? colors.success :
    score >= 60 ? colors.accent :
    score >= 40 ? colors.warning :
    colors.error;

  return (
    <View style={[styles.container, { width: dimensions, height: dimensions, borderColor: ringColor }]}>
      <Text style={[styles.score, { color: ringColor, fontSize }]}>{score}</Text>
      {size !== 'sm' && (
        <Text style={[styles.label, { color: colors.textTertiary, fontSize: labelSize }]}>AI</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.full,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontWeight: '700',
    lineHeight: 22,
  },
  label: {
    fontWeight: '600',
    marginTop: -2,
  },
});
