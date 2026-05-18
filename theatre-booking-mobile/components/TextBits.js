import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

export function ScreenHeader({ eyebrow, title, subtitle }) {
  return (
    <View style={styles.header}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function MetaRow({ label, value }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

export function Pill({ children, tone = 'default', style }) {
  return (
    <View style={[styles.pill, tone === 'accent' && styles.pillAccent, tone === 'danger' && styles.pillDanger, style]}>
      <Text style={[styles.pillText, tone === 'accent' && styles.pillAccentText, tone === 'danger' && styles.pillDangerText]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.title,
    fontSize: 30,
    lineHeight: 36,
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
    marginTop: spacing.sm,
  },
  metaLabel: {
    ...typography.label,
  },
  metaValue: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
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
});
