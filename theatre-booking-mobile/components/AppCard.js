import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, shadows, spacing } from '../theme';

export default function AppCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
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
});
