import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppInput from '../components/AppInput';
import ScreenContainer from '../components/ScreenContainer';
import { EmptyState, ErrorState, LoadingState } from '../components/StateView';
import { MetaRow, ScreenHeader } from '../components/TextBits';
import { colors, radius, spacing } from '../theme';
import api from '../services/api';

function asList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.shows)) return data.shows;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function valueFor(item, keys, fallback = 'Not provided') {
  const value = keys.map(key => item?.[key]).find(itemValue => itemValue !== undefined && itemValue !== null && itemValue !== '');
  return value === undefined ? fallback : String(value);
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
    <ScreenContainer>
      <ScreenHeader
        eyebrow="Now playing"
        title="Shows"
        subtitle="Search titles, filter by theatre, and tap a show to reserve seats."
      />

      <AppCard style={styles.filterCard}>
        <AppInput
          label="Show title"
          placeholder="Search show title"
          value={titleQuery}
          onChangeText={setTitleQuery}
          returnKeyType="search"
          onSubmitEditing={searchShows}
        />
        <View style={styles.filterActions}>
          <AppButton title="Search" onPress={searchShows} />
          <AppButton title="Clear" onPress={clearFilters} variant="secondary" />
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
                    {valueFor(theatre, ['name', 'theatre_name'], 'Theatre')}
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
              <AppCard style={styles.item}>
                <Text style={styles.itemTitle}>{valueFor(item, ['title', 'name', 'show_name'], 'Untitled show')}</Text>
                <MetaRow label="Theatre" value={valueFor(item, ['theatre_name', 'theatre', 'venue'])} />
                <View style={styles.metaGrid}>
                  <MetaRow label="Date" value={valueFor(item, ['show_date', 'date'])} />
                  <MetaRow label="Time" value={valueFor(item, ['show_time', 'time', 'start_time'])} />
                </View>
                {showId ? <Text style={styles.linkText}>View details and showtimes</Text> : null}
              </AppCard>
            </Pressable>
          );
        }}
      />

      <AppButton title="Back to Home" onPress={() => navigation.navigate('Home')} variant="ghost" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filterCard: {
    marginBottom: spacing.lg,
  },
  filterActions: {
    gap: spacing.sm,
    marginBottom: spacing.md,
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
    paddingVertical: spacing.sm,
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
  },
  cardPressed: {
    opacity: 0.86,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  metaGrid: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  linkText: {
    color: colors.accentSoft,
    fontWeight: '800',
    marginTop: spacing.md,
  },
});
