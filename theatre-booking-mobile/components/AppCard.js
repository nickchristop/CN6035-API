import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, shadows, spacing } from '../theme';

export default function AppCard({ children, compact = false, muted = false, style }) {
  return <View style={[styles.card, compact && styles.compact, muted && styles.muted, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadows.card,
  },
  compact: {
    padding: spacing.md,
  },
  muted: {
    opacity: 0.68,
  },
});
