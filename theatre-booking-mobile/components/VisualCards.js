import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppCard from './AppCard';
import { colors, radius, spacing } from '../theme';

export function DashboardCard({ icon = 'venue', eyebrow, title, body, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <AppCard compact accent="left" style={styles.dashboardCard}>
        <MarkerIcon type={icon} />
        <View style={styles.dashboardText}>
          <Text style={styles.dashboardEyebrow}>{eyebrow}</Text>
          <Text style={styles.dashboardTitle}>{title}</Text>
          <Text style={styles.dashboardBody}>{body}</Text>
        </View>
        <Chevron />
      </AppCard>
    </Pressable>
  );
}

function Chevron() {
  return (
    <View style={styles.chevronWrap}>
      <View style={styles.chevron} />
    </View>
  );
}

function MarkerIcon({ type }) {
  if (type === 'shows') {
    return (
      <View style={styles.marker}>
        <View style={styles.spotlightBeam} />
        <View style={styles.spotlightLamp} />
      </View>
    );
  }

  if (type === 'tickets') {
    return (
      <View style={styles.marker}>
        <View style={styles.ticketShape}>
          <View style={styles.ticketStubLine} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.marker}>
      <View style={styles.theatreRoof} />
      <View style={styles.theatreBase}>
        <View style={styles.theatreColumn} />
        <View style={styles.theatreColumn} />
        <View style={styles.theatreColumn} />
      </View>
    </View>
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
  theatreRoof: {
    borderBottomColor: colors.accent,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderLeftWidth: 14,
    borderRightColor: 'transparent',
    borderRightWidth: 14,
    height: 0,
    marginBottom: 4,
    width: 0,
  },
  theatreBase: {
    alignItems: 'center',
    borderBottomColor: colors.accentSoft,
    borderBottomWidth: 3,
    flexDirection: 'row',
    gap: 4,
    height: 18,
    justifyContent: 'center',
    width: 28,
  },
  theatreColumn: {
    backgroundColor: colors.accent,
    borderRadius: 2,
    height: 15,
    width: 4,
  },
  spotlightBeam: {
    backgroundColor: '#3b2a19',
    borderColor: colors.accent,
    borderRadius: 8,
    borderWidth: 1,
    height: 26,
    transform: [{ rotate: '-18deg' }],
    width: 18,
  },
  spotlightLamp: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    height: 9,
    position: 'absolute',
    right: 9,
    top: 9,
    width: 9,
  },
  ticketShape: {
    borderColor: colors.accent,
    borderRadius: 6,
    borderStyle: 'dashed',
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 30,
  },
  ticketStubLine: {
    borderColor: colors.accentSoft,
    borderStyle: 'dashed',
    borderTopWidth: 1,
    marginHorizontal: 6,
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
  chevronWrap: {
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  chevron: {
    borderBottomColor: colors.accentSoft,
    borderBottomWidth: 2,
    borderRightColor: colors.accentSoft,
    borderRightWidth: 2,
    height: 8,
    marginRight: 3,
    transform: [{ rotate: '-45deg' }],
    width: 8,
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
