import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppCard from './AppCard';
import { colors, radius, spacing } from '../theme';

export function DashboardCard({ marker, eyebrow, title, body, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <AppCard compact accent="left" style={styles.dashboardCard}>
        <View style={styles.marker}>
          <Text style={styles.markerText}>{marker}</Text>
        </View>
        <View style={styles.dashboardText}>
          <Text style={styles.dashboardEyebrow}>{eyebrow}</Text>
          <Text style={styles.dashboardTitle}>{title}</Text>
          <Text style={styles.dashboardBody}>{body}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </AppCard>
    </Pressable>
  );
}

export function MetadataChip({ label, value, tone = 'default' }) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return (
    <View style={[styles.chip, tone === 'accent' && styles.chipAccent, tone === 'muted' && styles.chipMuted]}>
      {label ? <Text style={styles.chipLabel}>{label}</Text> : null}
      <Text style={[styles.chipValue, tone === 'accent' && styles.chipValueAccent]}>{value}</Text>
    </View>
  );
}

export function TicketDivider() {
  return (
    <View style={styles.ticketDivider}>
      <View style={styles.notchLeft} />
      <View style={styles.dashedLine} />
      <View style={styles.notchRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.88,
  },
  dashboardCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 94,
  },
  marker: {
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  markerText: {
    color: colors.accent,
    fontSize: 19,
    fontWeight: '900',
  },
  dashboardText: {
    flex: 1,
  },
  dashboardEyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  dashboardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  dashboardBody: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  arrow: {
    color: colors.accentSoft,
    fontSize: 32,
    fontWeight: '300',
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipAccent: {
    backgroundColor: '#3b2a19',
    borderColor: colors.accent,
  },
  chipMuted: {
    opacity: 0.75,
  },
  chipLabel: {
    color: colors.textSubtle,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 1,
    textTransform: 'uppercase',
  },
  chipValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  chipValueAccent: {
    color: colors.accentSoft,
  },
  ticketDivider: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: spacing.md,
  },
  dashedLine: {
    borderColor: colors.borderSoft,
    borderStyle: 'dashed',
    borderTopWidth: 1,
    flex: 1,
  },
  notchLeft: {
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    height: 18,
    marginLeft: -spacing.xl,
    marginRight: spacing.sm,
    width: 18,
  },
  notchRight: {
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    height: 18,
    marginLeft: spacing.sm,
    marginRight: -spacing.xl,
    width: 18,
  },
});
