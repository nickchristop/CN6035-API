import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

function reservationIdFor(item) {
  return item?.reservation_id ?? item?.id;
}

function statusFor(item) {
  return valueFor(item, ['status', 'reservation_status'], 'Confirmed');
}

function isActiveReservation(item) {
  const status = statusFor(item).toLowerCase();

  if (status.includes('cancel')) return false;
  if (status.includes('complete')) return false;

  return ['active', 'confirmed', 'pending', 'booked'].some(activeStatus => status.includes(activeStatus));
}

export default function ReservationsScreen({ navigation }) {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingReservationId, setCancelingReservationId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function loadReservations({ showSpinner = true } = {}) {
    if (!token) {
      setError('You must be logged in to view reservations.');
      setLoading(false);
      return;
    }

    setError('');
    if (showSpinner) {
      setLoading(true);
    }
    try {
      const response = await api.get('/reservations/user');
      setReservations(asList(response.data));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Unable to load reservations.');
    } finally {
      setLoading(false);
    }
  }

  async function cancelReservation(reservationId) {
    setError('');
    setSuccess('');
    setCancelingReservationId(reservationId);
    try {
      await api.delete(`/reservations/${reservationId}`);
      await loadReservations({ showSpinner: false });
      setSuccess('Reservation cancelled successfully.');
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Unable to cancel reservation.');
    } finally {
      setCancelingReservationId(null);
    }
  }

  function confirmCancelReservation(item) {
    const reservationId = reservationIdFor(item);

    if (!reservationId) {
      setError('Reservation id is missing.');
      return;
    }

    Alert.alert(
      'Cancel reservation?',
      'This will cancel your reservation and restore the seats.',
      [
        { text: 'Keep Reservation', style: 'cancel' },
        {
          text: 'Cancel Reservation',
          style: 'destructive',
          onPress: () => cancelReservation(reservationId),
        },
      ],
    );
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
      {success ? <Text style={styles.success}>{success}</Text> : null}
      <FlatList
        data={reservations}
        keyExtractor={(item, index) => String(reservationIdFor(item) ?? index)}
        ListEmptyComponent={!error ? <Text style={styles.empty}>You have no reservations yet.</Text> : null}
        renderItem={({ item }) => {
          const reservationId = reservationIdFor(item);
          const isCanceling = cancelingReservationId === reservationId;

          return (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{valueFor(item, ['show_title', 'title', 'show_name'], 'Untitled show')}</Text>
              <Text style={styles.cardText}>Theatre: {valueFor(item, ['theatre_name', 'theatre', 'venue'])}</Text>
              <Text style={styles.cardText}>Date: {valueFor(item, ['show_date', 'date'])}</Text>
              <Text style={styles.cardText}>Time: {valueFor(item, ['show_time', 'time', 'start_time'])}</Text>
              <Text style={styles.cardText}>Seats: {valueFor(item, ['seats_reserved', 'seats', 'quantity'])}</Text>
              <Text style={styles.status}>Status: {statusFor(item)}</Text>
              {isActiveReservation(item) ? (
                <View style={styles.cancelAction}>
                  {isCanceling ? (
                    <>
                      <ActivityIndicator />
                      <Text style={styles.cancelingText}>Cancelling...</Text>
                    </>
                  ) : (
                    <Button
                      title="Cancel Reservation"
                      color="#cc0000"
                      onPress={() => confirmCancelReservation(item)}
                      disabled={cancelingReservationId !== null}
                    />
                  )}
                </View>
              ) : null}
            </View>
          );
        }}
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
  success: { color: '#087f23', marginBottom: 12 },
  empty: { color: '#555', textAlign: 'center', marginTop: 24 },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 14, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  cardText: { color: '#444', marginTop: 2 },
  status: { color: '#222', fontWeight: '600', marginTop: 8 },
  cancelAction: { marginTop: 12 },
  cancelingText: { color: '#555', marginTop: 6 },
});
