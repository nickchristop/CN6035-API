import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, shadows, spacing } from '../theme';

export default function AppCard({ children, compact = false, muted = false, accent = null, style }) {
  return (
    <View style={[
      styles.card,
      accent === 'top' && styles.topAccentCard,
      compact && styles.compact,
      muted && styles.muted,
      style,
    ]}>
      {accent === 'left' ? <View style={styles.leftAccent} /> : null}
      {accent === 'top' ? <View style={styles.topAccent} /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    padding: spacing.lg,
    ...shadows.card,
  },
  topAccentCard: {
    paddingTop: spacing.lg + spacing.xs,
  },
  compact: {
    padding: spacing.md,
  },
  muted: {
    opacity: 0.68,
  },
  leftAccent: {
    backgroundColor: colors.accent,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
  },
  topAccent: {
    backgroundColor: colors.accent,
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
