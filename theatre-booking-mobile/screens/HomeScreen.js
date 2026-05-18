import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import ScreenContainer from '../components/ScreenContainer';
import { ScreenHeader } from '../components/TextBits';
import { colors, spacing } from '../theme';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { logout, user } = useAuth();

  return (
    <ScreenContainer scroll>
      <AppCard compact style={styles.hero}>
        <Text style={styles.heroEyebrow}>Theatre Booking</Text>
        <Text style={styles.heroTitle}>Find your next night out</Text>
        <Text style={styles.heroCopy}>
          Browse theatres, compare shows, reserve seats, and keep your bookings organized.
        </Text>
      </AppCard>

      <ScreenHeader
        eyebrow="Dashboard"
        title={user?.name ? `Hello, ${user.name}` : 'Welcome'}
        subtitle="Choose a section to continue."
        compact
      />

      <View style={styles.actions}>
        <DashboardAction
          eyebrow="Venues"
          title="Browse Theatres"
          body="Compare venues and capacities."
          onPress={() => navigation.navigate('Theatres')}
        />
        <DashboardAction
          eyebrow="Now playing"
          title="Browse Shows"
          body="Find performances and showtimes."
          onPress={() => navigation.navigate('Shows')}
        />
        <DashboardAction
          eyebrow="Your tickets"
          title="My Reservations"
          body="Edit seats or cancel bookings."
          onPress={() => navigation.navigate('Reservations')}
        />
      </View>

      <AppButton title="Logout" onPress={logout} variant="ghost" compact />
    </ScreenContainer>
  );
}

function DashboardAction({ eyebrow, title, body, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.actionPressed]}>
      <AppCard compact style={styles.actionCard}>
        <View style={styles.actionText}>
          <Text style={styles.actionEyebrow}>{eyebrow}</Text>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionBody}>{body}</Text>
        </View>
        <Text style={styles.actionArrow}>›</Text>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surfaceRaised,
    marginBottom: spacing.lg,
  },
  heroEyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.text,
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 34,
    marginBottom: spacing.sm,
  },
  heroCopy: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 23,
  },
  actions: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actionCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  actionPressed: {
    opacity: 0.86,
  },
  actionText: {
    flex: 1,
  },
  actionEyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  actionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  actionBody: {
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  actionArrow: {
    color: colors.accentSoft,
    fontSize: 30,
    fontWeight: '300',
  },
});
