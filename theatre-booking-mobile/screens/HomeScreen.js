import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import ScreenContainer from '../components/ScreenContainer';
import { ScreenHeader } from '../components/TextBits';
import { DashboardCard } from '../components/VisualCards';
import { colors, spacing } from '../theme';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { logout, user } = useAuth();

  return (
    <ScreenContainer scroll>
      <AppCard compact accent="top" style={styles.hero}>
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
        <DashboardCard
          marker="V"
          eyebrow="Venues"
          title="Browse Theatres"
          body="Compare venues and capacities."
          onPress={() => navigation.navigate('Theatres')}
        />
        <DashboardCard
          marker="S"
          eyebrow="Now playing"
          title="Browse Shows"
          body="Find performances and showtimes."
          onPress={() => navigation.navigate('Shows')}
        />
        <DashboardCard
          marker="T"
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
});
