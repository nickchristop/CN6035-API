import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppInput from '../components/AppInput';
import ScreenContainer from '../components/ScreenContainer';
import { FeedbackMessage } from '../components/StateView';
import { MetaRow, ScreenHeader } from '../components/TextBits';
import { spacing } from '../theme';
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
    <ScreenContainer scroll>
      <ScreenHeader
        eyebrow="Reserve seats"
        title="Create Reservation"
        subtitle="Confirm your showtime and choose how many seats to reserve."
      />

      <AppCard style={styles.section}>
        <MetaRow label="Show" value={valueFor(showtime, ['title', 'show_title', 'show_name'], valueFor(show, ['title', 'name', 'show_name']))} />
        <MetaRow label="Date" value={valueFor(showtime, ['show_date', 'date'])} />
        <MetaRow label="Time" value={valueFor(showtime, ['show_time', 'time', 'start_time'])} />
        <MetaRow label="Hall" value={valueFor(showtime, ['hall', 'hall_name', 'screen', 'screen_name'])} />
        <MetaRow label="Price" value={valueFor(showtime, ['price', 'ticket_price'])} />
        <MetaRow label="Available seats" value={availableSeats === null ? 'Not provided' : String(availableSeats)} />
      </AppCard>

      <AppCard style={styles.section}>
        <AppInput
          label="Seats reserved"
          value={seatsReserved}
          onChangeText={setSeatsReserved}
          keyboardType="number-pad"
          placeholder="Seats reserved"
        />
        <FeedbackMessage message={error} />
        <FeedbackMessage type="success" message={success} />
        <AppButton title="Create Reservation" onPress={handleCreateReservation} loading={loading} />
      </AppCard>

      <View style={styles.actions}>
        <AppButton title="Back to Show" onPress={() => navigation.goBack()} variant="secondary" />
        <AppButton title="Home" onPress={() => navigation.navigate('Home')} variant="ghost" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
  },
});
