import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppInput from '../components/AppInput';
import ScreenContainer from '../components/ScreenContainer';
import { FeedbackMessage } from '../components/StateView';
import { MetaRow, ScreenHeader } from '../components/TextBits';
import { MetadataChip, TicketDivider } from '../components/VisualCards';
import { colors, spacing } from '../theme';
import { displayValue, formatDate, formatPrice, formatTime } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

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
    <ScreenContainer scroll compact>
      <ScreenHeader
        eyebrow="Reserve seats"
        title="Create Reservation"
        subtitle="Confirm your showtime and choose how many seats to reserve."
        compact
      />

      <AppCard compact accent="top" style={styles.ticketSummary}>
        <MetaRow label="Show" value={displayValue(showtime, ['title', 'show_title', 'show_name'], displayValue(show, ['title', 'name', 'show_name']))} />
        <TicketDivider />
        <View style={styles.chipRow}>
          <MetadataChip label="Date" value={formatDate(displayValue(showtime, ['show_date', 'date']))} tone="accent" />
          <MetadataChip label="Time" value={formatTime(displayValue(showtime, ['show_time', 'time', 'start_time']))} />
          <MetadataChip label="Hall" value={displayValue(showtime, ['hall', 'hall_name', 'screen', 'screen_name'])} />
          <MetadataChip label="Price" value={formatPrice(displayValue(showtime, ['price', 'ticket_price']))} />
          <MetadataChip label="Available" value={availableSeats === null ? null : String(availableSeats)} />
        </View>
      </AppCard>

      <AppCard compact accent="left" style={styles.section}>
        <AppInput
          label="Seats reserved"
          value={seatsReserved}
          onChangeText={setSeatsReserved}
          keyboardType="number-pad"
          placeholder="Seats reserved"
          compact
        />
        <FeedbackMessage message={error} />
        <FeedbackMessage type="success" message={success} />
        <AppButton title="Create Reservation" onPress={handleCreateReservation} loading={loading} style={styles.submitButton} />
      </AppCard>

      <View style={styles.actions}>
        <AppButton title="Back to Show" onPress={() => navigation.goBack()} variant="secondary" compact />
        <AppButton title="Home" onPress={() => navigation.navigate('Home')} variant="ghost" compact />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.md,
  },
  ticketSummary: {
    marginBottom: spacing.lg,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  submitButton: {
    borderColor: colors.accent,
  },
  actions: {
    gap: spacing.sm,
  },
});
