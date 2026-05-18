import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import ScreenContainer from '../components/ScreenContainer';
import { ErrorState, LoadingState } from '../components/StateView';
import { MetaRow, ScreenHeader, SectionTitle } from '../components/TextBits';
import { colors, spacing } from '../theme';
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

function valueFor(item, keys, fallback = 'Not provided') {
  const value = keys.map(key => item?.[key]).find(itemValue => itemValue !== undefined && itemValue !== null && itemValue !== '');
  return value === undefined ? fallback : String(value);
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
    <ScreenContainer scroll>
      <ScreenHeader
        eyebrow="Show details"
        title={valueFor(show, ['title', 'name', 'show_name'], 'Show details')}
        subtitle="Review the performance details and choose a showtime."
      />

      {error ? (
        <ErrorState message={error} onRetry={loadShowDetails} />
      ) : (
        <>
          <AppCard style={styles.section}>
            <MetaRow label="Theatre" value={valueFor(show, ['theatre_name', 'theatre', 'venue'])} />
            <MetaRow label="Date" value={valueFor(show, ['show_date', 'date'])} />
            <MetaRow label="Time" value={valueFor(show, ['show_time', 'time', 'start_time'])} />
            <MetaRow label="Description" value={valueFor(show, ['description', 'summary'])} />
          </AppCard>

          <AppCard style={styles.section}>
            <SectionTitle>Showtimes</SectionTitle>
            {showtimes.length ? (
              showtimes.map((showtime, index) => (
                <Pressable
                  key={String(showtimeIdFor(showtime) ?? index)}
                  style={({ pressed }) => [styles.showtimeItem, pressed && styles.showtimePressed]}
                  onPress={() => navigation.navigate('CreateReservation', { show, showtime })}
                >
                  <View style={styles.showtimeHeader}>
                    <Text style={styles.showtimeTime}>{valueFor(showtime, ['show_time', 'time', 'start_time'])}</Text>
                    <Text style={styles.reserveText}>Reserve seats</Text>
                  </View>
                  <Text style={styles.smallText}>{valueFor(showtime, ['show_date', 'date'], '')}</Text>
                  <Text style={styles.smallText}>Hall: {valueFor(showtime, ['hall', 'hall_name', 'screen', 'screen_name'])}</Text>
                  <Text style={styles.smallText}>Price: {valueFor(showtime, ['price', 'ticket_price'])}</Text>
                </Pressable>
              ))
            ) : (
              <Text style={styles.empty}>No related showtimes available.</Text>
            )}
          </AppCard>
        </>
      )}

      <View style={styles.actions}>
        <AppButton title="Back to Shows" onPress={() => navigation.navigate('Shows')} variant="secondary" />
        <AppButton title="Home" onPress={() => navigation.navigate('Home')} variant="ghost" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  showtimeItem: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingVertical: spacing.md,
  },
  showtimePressed: {
    backgroundColor: colors.surfaceRaised,
  },
  showtimeHeader: {
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  showtimeTime: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  smallText: {
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  reserveText: {
    color: colors.accentSoft,
    fontWeight: '800',
  },
  empty: {
    color: colors.textMuted,
  },
  actions: {
    gap: spacing.sm,
  },
});
