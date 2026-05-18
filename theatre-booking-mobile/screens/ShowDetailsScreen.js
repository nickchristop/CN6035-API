import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import ScreenContainer from '../components/ScreenContainer';
import { ErrorState, LoadingState } from '../components/StateView';
import { MetaRow, ScreenHeader, SectionTitle } from '../components/TextBits';
import { MetadataChip } from '../components/VisualCards';
import { colors, spacing } from '../theme';
import { displayValue, formatDate, formatDuration, formatPrice, formatTime } from '../utils/formatters';
import api from '../services/api';

function firstShow(data) {
  if (Array.isArray(data)) return data[0] ?? null;
  return data?.show ?? data?.data ?? data ?? null;
}

function showtimesFor(data, show) {
  const candidates = [
    data?.showtimes,
    data?.times,
    data?.schedules,
    data?.screenings,
    show?.showtimes,
    show?.times,
    show?.schedules,
    show?.screenings,
  ];

  return candidates.find(Array.isArray) ?? [];
}

function showtimeIdFor(showtime) {
  return showtime?.showtime_id ?? showtime?.id;
}

export default function ShowDetailsScreen({ route, navigation }) {
  const { showId } = route.params ?? {};
  const [show, setShow] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadShowDetails() {
    if (!showId) {
      setError('No show selected.');
      setLoading(false);
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await api.get(`/shows/${showId}`);
      const nextShow = firstShow(response.data);
      const nextShowtimes = showtimesFor(response.data, nextShow);
      setShow(nextShow);
      setShowtimes(nextShowtimes.length ? nextShowtimes : (showtimeIdFor(nextShow) ? [nextShow] : []));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Unable to load show details.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShowDetails();
  }, [showId]);

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState title="Loading show details..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll compact>
      <ScreenHeader
        eyebrow="Show details"
        title={displayValue(show, ['title', 'name', 'show_name'], 'Show details')}
        subtitle="Review the performance details and choose a showtime."
        compact
      />

      {error ? (
        <ErrorState message={error} onRetry={loadShowDetails} />
      ) : (
        <>
          <AppCard compact accent="top" style={styles.heroCard}>
            <Text style={styles.heroTitle}>{displayValue(show, ['title', 'name', 'show_name'], 'Show details')}</Text>
            <Text style={styles.heroVenue}>{displayValue(show, ['theatre_name', 'theatre', 'venue'], 'Theatre TBC')}</Text>
            <View style={styles.chipRow}>
              <MetadataChip label="Date" value={formatDate(displayValue(show, ['show_date', 'date']))} tone="accent" />
              <MetadataChip label="Time" value={formatTime(displayValue(show, ['show_time', 'time', 'start_time']))} />
              <MetadataChip label="Age" value={displayValue(show, ['age_rating', 'rating'])} />
              <MetadataChip label="Duration" value={formatDuration(displayValue(show, ['duration', 'runtime']))} />
            </View>
            <MetaRow label="Description" value={displayValue(show, ['description', 'summary'])} />
          </AppCard>

          <AppCard compact style={styles.section}>
            <SectionTitle>Showtimes</SectionTitle>
            {showtimes.length ? (
              showtimes.map((showtime, index) => (
                <Pressable
                  key={String(showtimeIdFor(showtime) ?? index)}
                  style={({ pressed }) => [styles.showtimeCard, pressed && styles.showtimePressed]}
                  onPress={() => navigation.navigate('CreateReservation', { show, showtime })}
                >
                  <View style={styles.showtimeHeader}>
                    <View>
                      <Text style={styles.showtimeLabel}>Performance</Text>
                      <Text style={styles.showtimeTime}>{formatTime(displayValue(showtime, ['show_time', 'time', 'start_time'])) ?? 'Time TBC'}</Text>
                    </View>
                    <Text style={styles.reserveText}>Reserve</Text>
                  </View>
                  <View style={styles.showtimeMeta}>
                    <MetadataChip label="Date" value={formatDate(displayValue(showtime, ['show_date', 'date']))} tone="accent" />
                    <MetadataChip label="Hall" value={displayValue(showtime, ['hall', 'hall_name', 'screen', 'screen_name'])} />
                    <MetadataChip label="Price" value={formatPrice(displayValue(showtime, ['price', 'ticket_price']))} />
                    <MetadataChip label="Seats" value={displayValue(showtime, ['available_seats', 'seats_available', 'remaining_seats'])} />
                  </View>
                </Pressable>
              ))
            ) : (
              <Text style={styles.empty}>No related showtimes available.</Text>
            )}
          </AppCard>
        </>
      )}

      <View style={styles.actions}>
        <AppButton title="Back to Shows" onPress={() => navigation.navigate('Shows')} variant="secondary" compact />
        <AppButton title="Home" onPress={() => navigation.navigate('Home')} variant="ghost" compact />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    marginBottom: spacing.lg,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 31,
  },
  heroVenue: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.md,
  },
  showtimeCard: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.borderSoft,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  showtimePressed: {
    backgroundColor: colors.surfaceRaised,
  },
  showtimeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  showtimeTime: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  showtimeLabel: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  reserveText: {
    color: colors.accentSoft,
    fontWeight: '800',
  },
  showtimeMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  empty: {
    color: colors.textMuted,
  },
  actions: {
    gap: spacing.sm,
  },
});
