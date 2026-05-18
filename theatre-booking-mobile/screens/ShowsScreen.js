import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppInput from '../components/AppInput';
import ScreenContainer from '../components/ScreenContainer';
import { EmptyState, ErrorState, LoadingState } from '../components/StateView';
import { MetaRow, ScreenHeader } from '../components/TextBits';
import { MetadataChip } from '../components/VisualCards';
import { colors, radius, spacing } from '../theme';
import { displayValue, formatDate, formatDuration, formatTime } from '../utils/formatters';
import api from '../services/api';

function asList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.shows)) return data.shows;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function showIdFor(show) {
  return show?.show_id ?? show?.id;
}

function theatreIdFor(theatre) {
  return theatre?.theatre_id ?? theatre?.id;
}

export default function ShowsScreen({ navigation }) {
  const [shows, setShows] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [titleQuery, setTitleQuery] = useState('');
  const [selectedTheatreId, setSelectedTheatreId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadShows({ title = titleQuery, theatreId = selectedTheatreId } = {}) {
    setError('');
    setLoading(true);
    try {
      const params = {};
      const trimmedTitle = title.trim();

      if (trimmedTitle) {
        params.title = trimmedTitle;
      }

      if (theatreId) {
        params.theatre_id = theatreId;
      }

      const response = await api.get('/shows', { params });
      setShows(asList(response.data));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Unable to load shows.');
    } finally {
      setLoading(false);
    }
  }

  async function loadTheatres() {
    try {
      const response = await api.get('/theatres');
      setTheatres(asList(response.data));
    } catch {
      setTheatres([]);
    }
  }

  function searchShows() {
    loadShows();
  }

  function selectTheatre(theatreId) {
    setSelectedTheatreId(theatreId);
    loadShows({ theatreId });
  }

  function clearFilters() {
    setTitleQuery('');
    setSelectedTheatreId(null);
    loadShows({ title: '', theatreId: null });
  }

  useEffect(() => {
    loadShows();
    loadTheatres();
  }, []);

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState title="Loading shows..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer compact>
      <ScreenHeader
        eyebrow="Now playing"
        title="Shows"
        subtitle="Search titles, filter by theatre, and tap a show to reserve seats."
        compact
      />

      <AppCard compact accent="top" style={styles.filterCard}>
        <AppInput
          label="Show title"
          placeholder="Search show title"
          value={titleQuery}
          onChangeText={setTitleQuery}
          returnKeyType="search"
          onSubmitEditing={searchShows}
          compact
        />
        <View style={styles.filterActions}>
          <AppButton title="Search" onPress={searchShows} compact />
          <AppButton title="Clear" onPress={clearFilters} variant="secondary" compact />
        </View>
        {theatres.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.theatreFilters}>
            <Pressable
              style={[styles.filterChip, selectedTheatreId === null && styles.filterChipActive]}
              onPress={() => selectTheatre(null)}
            >
              <Text style={selectedTheatreId === null ? styles.filterChipTextActive : styles.filterChipText}>All</Text>
            </Pressable>
            {theatres.map((theatre, index) => {
              const theatreId = theatreIdFor(theatre);
              const isSelected = selectedTheatreId === theatreId;

              return (
                <Pressable
                  key={String(theatreId ?? index)}
                  style={[styles.filterChip, isSelected && styles.filterChipActive]}
                  onPress={() => selectTheatre(theatreId)}
                >
                  <Text style={isSelected ? styles.filterChipTextActive : styles.filterChipText}>
                    {displayValue(theatre, ['name', 'theatre_name'], 'Theatre')}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : null}
      </AppCard>

      {error ? <ErrorState message={error} onRetry={loadShows} /> : null}

      <FlatList
        data={shows}
        keyExtractor={(item, index) => String(showIdFor(item) ?? index)}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!error ? <EmptyState message="No shows found." /> : null}
        renderItem={({ item }) => {
          const showId = showIdFor(item);

          return (
            <Pressable
              disabled={!showId}
              onPress={() => navigation.navigate('ShowDetails', { showId })}
              style={({ pressed }) => [pressed && styles.cardPressed]}
            >
              <AppCard compact accent="left" style={styles.item}>
                <Text style={styles.itemTitle}>{displayValue(item, ['title', 'name', 'show_name'], 'Untitled show')}</Text>
                <Text style={styles.theatreName}>{displayValue(item, ['theatre_name', 'theatre', 'venue'], 'Theatre TBC')}</Text>
                <View style={styles.chipRow}>
                  <MetadataChip label="Date" value={formatDate(displayValue(item, ['show_date', 'date']))} tone="accent" />
                  <MetadataChip label="Time" value={formatTime(displayValue(item, ['show_time', 'time', 'start_time']))} />
                  <MetadataChip label="Age" value={displayValue(item, ['age_rating', 'rating'])} />
                  <MetadataChip label="Duration" value={formatDuration(displayValue(item, ['duration', 'runtime']))} />
                </View>
                <MetaRow label="About" value={displayValue(item, ['description', 'summary'])} />
                {showId ? <Text style={styles.linkText}>View details and showtimes</Text> : null}
              </AppCard>
            </Pressable>
          );
        }}
      />

      <AppButton title="Back to Home" onPress={() => navigation.navigate('Home')} variant="ghost" compact />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.background,
  },
  filterCard: {
    marginBottom: spacing.lg,
  },
  filterActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  theatreFilters: {
    marginTop: spacing.xs,
  },
  filterChip: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.accent,
  },
  filterChipText: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  item: {
    marginBottom: spacing.md,
    minHeight: 142,
  },
  cardPressed: {
    opacity: 0.86,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  theatreName: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  metaGrid: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  linkText: {
    color: colors.accentSoft,
    fontWeight: '800',
    marginTop: spacing.md,
  },
});
