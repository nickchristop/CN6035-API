import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

const SEATS_PER_ROW = 6;
const MAX_VISUAL_SEATS = 48;

function rowName(index) {
  return String.fromCharCode(65 + index);
}

function buildSeatMap(totalSeats, availableSeats) {
  const sourceSeatCount = totalSeats ?? availableSeats ?? 0;

  if (!sourceSeatCount) {
    return [];
  }

  const visualSeatCount = Math.min(sourceSeatCount, MAX_VISUAL_SEATS);
  let unavailableCount = 0;

  if (availableSeats !== null && availableSeats !== undefined) {
    const reservedCount = totalSeats ? Math.max(totalSeats - availableSeats, 0) : 0;
    unavailableCount = availableSeats >= visualSeatCount
      ? Math.min(reservedCount, visualSeatCount)
      : visualSeatCount - Math.max(availableSeats, 0);
  }

  return Array.from({ length: visualSeatCount }, (_, index) => {
    const rowIndex = Math.floor(index / SEATS_PER_ROW);
    const seatNumber = (index % SEATS_PER_ROW) + 1;

    return {
      id: `${rowName(rowIndex)}${seatNumber}`,
      unavailable: index < unavailableCount,
    };
  });
}

export default function SeatSelector({ totalSeats, availableSeats, selectedSeats, onChange }) {
  const seats = buildSeatMap(totalSeats, availableSeats);

  if (!seats.length) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.stage}>
          <View style={styles.stageLine} />
          <Text style={styles.stageText}>STAGE</Text>
        </View>
        <Text style={styles.noSeatsText}>No selectable seats are available for this showtime.</Text>
      </View>
    );
  }

  const selectedSet = new Set(selectedSeats);
  const rows = [];

  for (let index = 0; index < seats.length; index += SEATS_PER_ROW) {
    rows.push(seats.slice(index, index + SEATS_PER_ROW));
  }

  function toggleSeat(seat) {
    if (seat.unavailable) return;

    if (selectedSet.has(seat.id)) {
      onChange(selectedSeats.filter(selectedSeat => selectedSeat !== seat.id));
      return;
    }

    if (availableSeats !== null && availableSeats !== undefined && selectedSeats.length >= availableSeats) {
      return;
    }

    onChange([...selectedSeats, seat.id]);
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.stage}>
        <View style={styles.stageLine} />
        <Text style={styles.stageText}>STAGE</Text>
      </View>

      <View style={styles.seatMap}>
        {rows.map((row, rowIndex) => (
          <View key={rowName(rowIndex)} style={styles.row}>
            <Text style={styles.rowLabel}>{rowName(rowIndex)}</Text>
            <View style={styles.rowSeats}>
              {row.map(seat => {
                const selected = selectedSet.has(seat.id);

                return (
                  <Pressable
                    key={seat.id}
                    disabled={seat.unavailable}
                    onPress={() => toggleSeat(seat)}
                    style={[
                      styles.seat,
                      seat.unavailable && styles.seatUnavailable,
                      selected && styles.seatSelected,
                    ]}
                  >
                    <Text style={[
                      styles.seatText,
                      seat.unavailable && styles.seatTextUnavailable,
                      selected && styles.seatTextSelected,
                    ]}>
                      {seat.id}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <LegendItem style={styles.legendAvailable} label="Available" />
        <LegendItem style={styles.legendSelected} label="Selected" />
        <LegendItem style={styles.legendReserved} label="Reserved" />
      </View>

      <View style={styles.selectedSummary}>
        <Text style={styles.selectedLabel}>Selected seats</Text>
        <Text style={styles.selectedCount}>{selectedSeats.length}</Text>
      </View>
    </View>
  );
}

function LegendItem({ style, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, style]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  stage: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#21181d',
    borderColor: colors.accent,
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    width: '74%',
  },
  stageLine: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    height: 3,
    opacity: 0.75,
    width: '64%',
  },
  stageText: {
    color: colors.accentSoft,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  seatMap: {
    alignSelf: 'center',
    gap: spacing.sm,
    maxWidth: '100%',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowLabel: {
    color: colors.textSubtle,
    fontSize: 12,
    fontWeight: '800',
    width: 16,
  },
  rowSeats: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  seat: {
    alignItems: 'center',
    backgroundColor: '#3b2a19',
    borderColor: colors.accent,
    borderRadius: 7,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 30,
  },
  seatSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.accentSoft,
  },
  seatUnavailable: {
    backgroundColor: '#2a2528',
    borderColor: colors.borderSoft,
    opacity: 0.72,
  },
  seatText: {
    color: colors.accentSoft,
    fontSize: 10,
    fontWeight: '800',
  },
  seatTextSelected: {
    color: colors.white,
  },
  seatTextUnavailable: {
    color: colors.textSubtle,
  },
  legend: {
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    padding: spacing.sm,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  legendSwatch: {
    borderRadius: 4,
    borderWidth: 1,
    height: 14,
    width: 14,
  },
  legendAvailable: {
    backgroundColor: '#3b2a19',
    borderColor: colors.accent,
  },
  legendSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.accentSoft,
  },
  legendReserved: {
    backgroundColor: '#2a2528',
    borderColor: colors.borderSoft,
  },
  legendText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  selectedSummary: {
    alignItems: 'center',
    backgroundColor: '#3b2a19',
    borderColor: colors.accent,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectedLabel: {
    color: colors.accentSoft,
    fontSize: 13,
    fontWeight: '800',
  },
  selectedCount: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  noSeatsText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
