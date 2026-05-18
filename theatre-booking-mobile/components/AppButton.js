import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function AppButton({ title, onPress, variant = 'primary', disabled = false, loading = false, compact = false, style }) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        styles[variant],
        pressed && !isDisabled && styles[`${variant}Pressed`],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <View style={styles.loadingContent}>
          <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? colors.accent : colors.white} />
          <Text style={[styles.text, styles.loadingText, (variant === 'secondary' || variant === 'ghost') && styles.secondaryText]}>
            {title}
          </Text>
        </View>
      ) : (
        <Text style={[styles.text, (variant === 'secondary' || variant === 'ghost') && styles.secondaryText]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
  },
  compact: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  primaryPressed: {
    backgroundColor: colors.primaryPressed,
    borderColor: colors.primaryPressed,
  },
  secondary: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.borderSoft,
  },
  secondaryPressed: {
    backgroundColor: colors.surface,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.borderSoft,
  },
  ghostPressed: {
    backgroundColor: colors.surface,
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  dangerPressed: {
    backgroundColor: colors.dangerPressed,
    borderColor: colors.dangerPressed,
  },
  disabled: {
    opacity: 0.55,
  },
  text: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  loadingText: {
    opacity: 0.9,
  },
  secondaryText: {
    color: colors.accentSoft,
  },
});
