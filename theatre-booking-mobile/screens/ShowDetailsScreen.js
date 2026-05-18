import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.statusText}>Loading show details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{valueFor(show, ['title', 'name', 'show_name'], 'Show details')}</Text>
      {error ? (
        <View style={styles.messageBlock}>
          <Text style={styles.error}>{error}</Text>
          <Button title="Try again" onPress={loadShowDetails} />
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.label}>Theatre</Text>
            <Text style={styles.value}>{valueFor(show, ['theatre_name', 'theatre', 'venue'])}</Text>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{valueFor(show, ['show_date', 'date'])}</Text>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>{valueFor(show, ['show_time', 'time', 'start_time'])}</Text>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{valueFor(show, ['description', 'summary'])}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Showtimes</Text>
            {showtimes.length ? (
              showtimes.map((showtime, index) => (
                <Pressable
                  key={String(showtimeIdFor(showtime) ?? index)}
                  style={({ pressed }) => [styles.showtimeItem, pressed && styles.showtimePressed]}
                  onPress={() => navigation.navigate('CreateReservation', { show, showtime })}
                >
                  <Text style={styles.value}>{valueFor(showtime, ['show_time', 'time', 'start_time'])}</Text>
                  <Text style={styles.smallText}>{valueFor(showtime, ['show_date', 'date'], '')}</Text>
                  <Text style={styles.smallText}>Hall: {valueFor(showtime, ['hall', 'hall_name', 'screen', 'screen_name'])}</Text>
                  <Text style={styles.smallText}>Price: {valueFor(showtime, ['price', 'ticket_price'])}</Text>
                  <Text style={styles.reserveText}>Reserve seats</Text>
                </Pressable>
              ))
            ) : (
              <Text style={styles.empty}>No related showtimes available.</Text>
            )}
          </View>
        </>
      )}
      <View style={styles.actions}>
        <Button title="Back to Shows" onPress={() => navigation.navigate('Shows')} />
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 56 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 16 },
  statusText: { marginTop: 12, color: '#555' },
  messageBlock: { marginBottom: 16 },
  error: { color: '#cc0000', marginBottom: 8 },
  section: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 14, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  label: { color: '#555', fontWeight: '600', marginTop: 10 },
  value: { color: '#222', marginTop: 3 },
  smallText: { color: '#555', marginTop: 2 },
  empty: { color: '#555' },
  showtimeItem: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  showtimePressed: { backgroundColor: '#f1f6ff' },
  reserveText: { color: '#007AFF', fontWeight: '600', marginTop: 8 },
  actions: { gap: 10 },
});
