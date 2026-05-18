import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppInput from '../components/AppInput';
import ScreenContainer from '../components/ScreenContainer';
import { EmptyState, FeedbackMessage, LoadingState } from '../components/StateView';
import { Pill, ScreenHeader } from '../components/TextBits';
import { MetadataChip, TicketDivider } from '../components/VisualCards';
import { colors, spacing } from '../theme';
import { displayValue, formatDate, formatTime } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function asList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.reservations)) return data.reservations;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function reservationIdFor(item) {
  return item?.reservation_id ?? item?.id;
}

function statusFor(item) {
  return displayValue(item, ['status', 'reservation_status'], 'Confirmed');
}

function isActiveReservation(item) {
  const status = statusFor(item).toLowerCase();

  if (status.includes('cancel')) return false;
  if (status.includes('complete')) return false;

  return ['active', 'confirmed', 'pending', 'booked'].some(activeStatus => status.includes(activeStatus));
}

function statusTone(item) {
  const status = statusFor(item).toLowerCase();

  if (status.includes('cancel')) return 'danger';
  if (isActiveReservation(item)) return 'success';

  return 'muted';
}

export default function ReservationsScreen({ navigation }) {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingReservationId, setCancelingReservationId] = useState(null);
  const [editingReservationId, setEditingReservationId] = useState(null);
  const [editSeatsReserved, setEditSeatsReserved] = useState('');
  const [updatingReservationId, setUpdatingReservationId] = useState(null);
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
    setEditingReservationId(null);
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

  function startEditingReservation(item) {
    const reservationId = reservationIdFor(item);

    if (!reservationId) {
      setError('Reservation id is missing.');
      return;
    }

    setError('');
    setSuccess('');
    setEditingReservationId(reservationId);
    setEditSeatsReserved(displayValue(item, ['seats_reserved', 'seats', 'quantity'], ''));
  }

  function validateEditSeats() {
    const trimmedSeats = editSeatsReserved.trim();

    if (!trimmedSeats) {
      return 'Seats reserved is required.';
    }

    if (!/^\d+$/.test(trimmedSeats)) {
      return 'Seats reserved must be a whole number.';
    }

    if (Number(trimmedSeats) <= 0) {
      return 'Seats reserved must be greater than 0.';
    }

    return '';
  }

  async function updateReservation(reservationId) {
    const validationError = validateEditSeats();

    if (validationError) {
      setError(validationError);
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('');
    setUpdatingReservationId(reservationId);
    try {
      await api.put(`/reservations/${reservationId}`, {
        seats_reserved: Number(editSeatsReserved.trim()),
      });
      await loadReservations({ showSpinner: false });
      setEditingReservationId(null);
      setEditSeatsReserved('');
      setSuccess('Reservation updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Unable to update reservation.');
    } finally {
      setUpdatingReservationId(null);
    }
  }

  function cancelEditingReservation() {
    setEditingReservationId(null);
    setEditSeatsReserved('');
    setError('');
  }

  useEffect(() => {
    loadReservations();
  }, [token]);

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState title="Loading reservations..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer compact>
      <ScreenHeader
        eyebrow="Your tickets"
        title="My Reservations"
        subtitle="Review bookings, edit seat counts, or cancel active reservations."
        compact
      />

      <FeedbackMessage message={error} />
      <FeedbackMessage type="success" message={success} />

      <FlatList
        data={reservations}
        keyExtractor={(item, index) => String(reservationIdFor(item) ?? index)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!error ? <EmptyState message="You have no reservations yet." /> : null}
        renderItem={({ item }) => {
          const reservationId = reservationIdFor(item);
          const isCanceling = cancelingReservationId === reservationId;
          const isEditing = editingReservationId === reservationId;
          const isUpdating = updatingReservationId === reservationId;
          const hasBusyAction = cancelingReservationId !== null || updatingReservationId !== null;
          const active = isActiveReservation(item);

          return (
            <AppCard compact muted={!active} accent={active ? 'top' : null} style={[styles.card, active ? styles.activeCard : styles.inactiveCard]}>
              <View style={styles.ticketHeader}>
                <View style={styles.ticketTitleBlock}>
                  <Text style={styles.ticketLabel}>Booking</Text>
                  <Text style={styles.cardTitle}>{displayValue(item, ['show_title', 'title', 'show_name'], 'Untitled show')}</Text>
                </View>
                <Pill tone={statusTone(item)}>{statusFor(item)}</Pill>
              </View>
              <Text style={styles.theatreText}>{displayValue(item, ['theatre_name', 'theatre', 'venue'], 'Theatre TBC')}</Text>
              <View style={styles.ticketChips}>
                <MetadataChip label="Date" value={formatDate(displayValue(item, ['show_date', 'date']))} tone="accent" />
                <MetadataChip label="Time" value={formatTime(displayValue(item, ['show_time', 'time', 'start_time']))} />
                <MetadataChip label="Seats" value={displayValue(item, ['seats_reserved', 'seats', 'quantity'])} />
              </View>
              {active ? (
                <>
                  <TicketDivider />
                  <View style={styles.cardActions}>
                    {isEditing ? (
                      <>
                        <AppInput
                          label="Seats reserved"
                          value={editSeatsReserved}
                          onChangeText={setEditSeatsReserved}
                          keyboardType="number-pad"
                          placeholder="Seats reserved"
                          editable={!isUpdating}
                          compact
                        />
                        {isUpdating ? (
                          <AppButton title="Updating..." loading disabled />
                        ) : (
                          <View style={styles.editActions}>
                            <AppButton
                            title="Save"
                            onPress={() => updateReservation(reservationId)}
                            disabled={hasBusyAction}
                            compact
                            style={styles.actionButton}
                          />
                          <AppButton
                            title="Cancel Edit"
                            onPress={cancelEditingReservation}
                            disabled={hasBusyAction}
                            variant="secondary"
                            compact
                            style={styles.actionButton}
                          />
                          </View>
                        )}
                      </>
                    ) : (
                      <View style={styles.actionRow}>
                        <AppButton
                          title="Edit Seats"
                          onPress={() => startEditingReservation(item)}
                          disabled={hasBusyAction}
                          variant="secondary"
                          compact
                          style={styles.actionButton}
                        />
                        {isCanceling ? (
                          <AppButton title="Cancelling..." loading disabled variant="danger" compact />
                        ) : (
                          <AppButton
                            title="Cancel Reservation"
                            onPress={() => confirmCancelReservation(item)}
                            disabled={hasBusyAction}
                            variant="danger"
                            compact
                            style={styles.actionButton}
                          />
                        )}
                      </View>
                    )}
                  </View>
                </>
              ) : null}
            </AppCard>
          );
        }}
      />

      <View style={styles.footerActions}>
        <AppButton title="Refresh" onPress={() => loadReservations()} variant="secondary" compact />
        <AppButton title="Back to Home" onPress={() => navigation.navigate('Home')} variant="ghost" compact />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.md,
  },
  activeCard: {
    borderColor: '#61454f',
  },
  inactiveCard: {
    borderStyle: 'dashed',
  },
  ticketHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  ticketTitleBlock: {
    flex: 1,
  },
  ticketLabel: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 26,
  },
  theatreText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  ticketChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  cardActions: {
    gap: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  footerActions: {
    gap: spacing.sm,
  },
});
