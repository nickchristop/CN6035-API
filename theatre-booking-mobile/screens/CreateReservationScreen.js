import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function valueFor(item, keys, fallback = 'Not provided') {
  const value = keys
    .map(key => item?.[key])
    .find(itemValue => itemValue !== undefined && itemValue !== null && itemValue !== '');
  return value === undefined ? fallback : String(value);
}

function numberFor(item, keys) {
  const value = keys
    .map(key => item?.[key])
    .find(itemValue => itemValue !== undefined && itemValue !== null && itemValue !== '');
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function showtimeIdFor(showtime) {
  return showtime?.showtime_id ?? showtime?.id;
}

export default function CreateReservationScreen({ route, navigation }) {
  const { token } = useAuth();
  const { show = null, showtime = null } = route.params ?? {};
  const [seatsReserved, setSeatsReserved] = useState('1');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const showtimeId = showtimeIdFor(showtime);
  const availableSeats = numberFor(showtime, ['available_seats', 'seats_available', 'remaining_seats']);

  function validateSeats() {
    const trimmedSeats = seatsReserved.trim();

    if (!trimmedSeats) {
      return 'Seats reserved is required.';
    }

    if (!/^\d+$/.test(trimmedSeats)) {
      return 'Seats reserved must be a whole number.';
    }

    const seatsNumber = Number(trimmedSeats);

    if (seatsNumber <= 0) {
      return 'Seats reserved must be greater than 0.';
    }

    if (availableSeats !== null && seatsNumber > availableSeats) {
      return `Seats reserved cannot be greater than ${availableSeats}.`;
    }

    return '';
  }

  async function handleCreateReservation() {
    const validationError = validateSeats();

    if (validationError) {
      setError(validationError);
      setSuccess('');
      return;
    }

    if (!showtimeId) {
      setError('A valid showtime is required.');
      setSuccess('');
      return;
    }

    if (!token) {
      setError('You must be logged in to create a reservation.');
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/reservations', {
        showtime_id: showtimeId,
        seats_reserved: Number(seatsReserved.trim()),
      });
      setSuccess('Reservation created successfully.');
      setTimeout(() => navigation.navigate('Home'), 700);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Unable to create reservation.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Reservation</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Show</Text>
        <Text style={styles.value}>{valueFor(showtime, ['title', 'show_title', 'show_name'], valueFor(show, ['title', 'name', 'show_name']))}</Text>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{valueFor(showtime, ['show_date', 'date'])}</Text>
        <Text style={styles.label}>Time</Text>
        <Text style={styles.value}>{valueFor(showtime, ['show_time', 'time', 'start_time'])}</Text>
        <Text style={styles.label}>Hall</Text>
        <Text style={styles.value}>{valueFor(showtime, ['hall', 'hall_name', 'screen', 'screen_name'])}</Text>
        <Text style={styles.label}>Price</Text>
        <Text style={styles.value}>{valueFor(showtime, ['price', 'ticket_price'])}</Text>
        <Text style={styles.label}>Available seats</Text>
        <Text style={styles.value}>{availableSeats === null ? 'Not provided' : String(availableSeats)}</Text>
      </View>

      <Text style={styles.inputLabel}>Seats reserved</Text>
      <TextInput
        style={styles.input}
        value={seatsReserved}
        onChangeText={setSeatsReserved}
        keyboardType="number-pad"
        placeholder="Seats reserved"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      {loading ? (
        <ActivityIndicator style={styles.spinner} />
      ) : (
        <Button title="Create Reservation" onPress={handleCreateReservation} />
      )}

      <View style={styles.actions}>
        <Button title="Back to Show" onPress={() => navigation.goBack()} />
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 56 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 16 },
  section: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 14, marginBottom: 16 },
  label: { color: '#555', fontWeight: '600', marginTop: 10 },
  value: { color: '#222', marginTop: 3 },
  inputLabel: { color: '#555', fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 },
  error: { color: '#cc0000', marginBottom: 8 },
  success: { color: '#087f23', marginBottom: 8 },
  spinner: { marginVertical: 8 },
  actions: { gap: 10, marginTop: 20 },
});
