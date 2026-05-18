import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AppButton from './AppButton';
import { colors, spacing, typography } from '../theme';

export function LoadingState({ title = 'Loading...' }) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator color={colors.accent} />
      <Text style={styles.message}>{title}</Text>
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.error}>{message}</Text>
      {onRetry ? <AppButton title="Try again" variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}

export function EmptyState({ message }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.empty}>{message}</Text>
    </View>
  );
}

export function FeedbackMessage({ type = 'error', message }) {
  if (!message) return null;

  return (
    <View style={[styles.feedback, type === 'success' ? styles.successBox : styles.errorBox]}>
      <Text style={type === 'success' ? styles.successText : styles.errorText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  message: {
    ...typography.subtitle,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: spacing.md,
    padding: spacing.lg,
  },
  empty: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  error: {
    color: colors.accentSoft,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  feedback: {
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  errorBox: {
    backgroundColor: '#331a1d',
    borderColor: colors.danger,
  },
  successBox: {
    backgroundColor: '#183021',
    borderColor: colors.success,
  },
  errorText: {
    color: '#ffd8d8',
    fontWeight: '600',
  },
  successText: {
    color: '#d9f5e3',
    fontWeight: '600',
  },
});
