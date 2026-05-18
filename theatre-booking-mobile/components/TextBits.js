import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

export function ScreenHeader({ eyebrow, title, subtitle, compact = false }) {
  return (
    <View style={[styles.header, compact && styles.headerCompact]}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function MetaRow({ label, value }) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

export function Pill({ children, tone = 'default', style }) {
  return (
    <View style={[
      styles.pill,
      tone === 'accent' && styles.pillAccent,
      tone === 'danger' && styles.pillDanger,
      tone === 'success' && styles.pillSuccess,
      tone === 'muted' && styles.pillMuted,
      style,
    ]}>
      <Text style={[
        styles.pillText,
        tone === 'accent' && styles.pillAccentText,
        tone === 'danger' && styles.pillDangerText,
        tone === 'success' && styles.pillSuccessText,
        tone === 'muted' && styles.pillMutedText,
      ]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerCompact: {
    marginBottom: spacing.md,
    paddingTop: 0,
  },
  eyebrow: {
    alignSelf: 'flex-start',
    backgroundColor: '#3b2a19',
    borderColor: colors.accent,
    borderRadius: 999,
    borderWidth: 1,
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.title,
    fontSize: 28,
    lineHeight: 33,
  },
  titleCompact: {
    fontSize: 24,
    lineHeight: 30,
  },
  subtitle: {
    ...typography.subtitle,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  metaRow: {
    marginTop: spacing.xs,
  },
  metaLabel: {
    ...typography.label,
  },
  metaValue: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.borderSoft,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  pillAccent: {
    backgroundColor: '#3b2a19',
    borderColor: colors.accent,
  },
  pillDanger: {
    backgroundColor: '#3a1f24',
    borderColor: colors.danger,
  },
  pillSuccess: {
    backgroundColor: '#1a3324',
    borderColor: colors.success,
  },
  pillMuted: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
  },
  pillText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  pillAccentText: {
    color: colors.accentSoft,
  },
  pillDangerText: {
    color: '#ffd8d8',
  },
  pillSuccessText: {
    color: '#d9f5e3',
  },
  pillMutedText: {
    color: colors.textSubtle,
  },
});
