import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function asList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.reservations)) return data.reservations;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function valueFor(item, keys, fallback = 'Not provided') {
  const value = keys
    .map(key => item?.[key])
    .find(itemValue => itemValue !== undefined && itemValue !== null && itemValue !== '');
  return value === undefined ? fallback : String(value);
}

export default function ReservationsScreen({ navigation }) {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadReservations() {
    if (!token) {
      setError('You must be logged in to view reservations.');
      setLoading(false);
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await api.get('/reservations/user');
      setReservations(asList(response.data));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Unable to load reservations.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReservations();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.statusText}>Loading reservations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reservations</Text>
      {error ? (
        <View style={styles.messageBlock}>
          <Text style={styles.error}>{error}</Text>
          <Button title="Try again" onPress={loadReservations} />
        </View>
      ) : null}
      <FlatList
        data={reservations}
        keyExtractor={(item, index) => String(item.reservation_id ?? item.id ?? index)}
        ListEmptyComponent={!error ? <Text style={styles.empty}>You have no reservations yet.</Text> : null}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{valueFor(item, ['show_title', 'title', 'show_name'], 'Untitled show')}</Text>
            <Text style={styles.cardText}>Theatre: {valueFor(item, ['theatre_name', 'theatre', 'venue'])}</Text>
            <Text style={styles.cardText}>Date: {valueFor(item, ['show_date', 'date'])}</Text>
            <Text style={styles.cardText}>Time: {valueFor(item, ['show_time', 'time', 'start_time'])}</Text>
            <Text style={styles.cardText}>Seats: {valueFor(item, ['seats_reserved', 'seats', 'quantity'])}</Text>
            <Text style={styles.status}>Status: {valueFor(item, ['status', 'reservation_status'], 'Confirmed')}</Text>
          </View>
        )}
      />
      <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 56 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 16 },
  statusText: { marginTop: 12, color: '#555' },
  messageBlock: { marginBottom: 16 },
  error: { color: '#cc0000', marginBottom: 8 },
  empty: { color: '#555', textAlign: 'center', marginTop: 24 },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 14, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  cardText: { color: '#444', marginTop: 2 },
  status: { color: '#222', fontWeight: '600', marginTop: 8 },
});
