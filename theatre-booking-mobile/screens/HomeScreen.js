import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
      <AppCard style={styles.hero}>
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
      />

      <View style={styles.actions}>
        <AppButton title="Browse Theatres" onPress={() => navigation.navigate('Theatres')} />
        <AppButton title="Browse Shows" onPress={() => navigation.navigate('Shows')} variant="secondary" />
        <AppButton title="My Reservations" onPress={() => navigation.navigate('Reservations')} variant="secondary" />
      </View>

      <AppButton title="Logout" onPress={logout} variant="ghost" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surfaceRaised,
    marginBottom: spacing.xl,
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
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 38,
    marginBottom: spacing.md,
  },
  heroCopy: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 23,
  },
  actions: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
});
