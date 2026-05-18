import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppInput from '../components/AppInput';
import ScreenContainer from '../components/ScreenContainer';
import { EmptyState, ErrorState, LoadingState } from '../components/StateView';
import { MetaRow, ScreenHeader, Pill } from '../components/TextBits';
import { MetadataChip } from '../components/VisualCards';
import { colors, spacing } from '../theme';
import { displayValue } from '../utils/formatters';
import api from '../services/api';

function asList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.theatres)) return data.theatres;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function TheatresScreen({ navigation }) {
  const [allTheatres, setAllTheatres] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTheatres() {
    setError('');
    setLoading(true);
    try {
      const response = await api.get('/theatres');
      const nextTheatres = asList(response.data);
      setAllTheatres(nextTheatres);
      setTheatres(filterTheatres(nextTheatres, searchQuery));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Unable to load theatres.');
    } finally {
      setLoading(false);
    }
  }

  function filterTheatres(theatreList, query) {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      return theatreList;
    }

    return theatreList.filter(theatre => {
      const name = displayValue(theatre, ['name', 'theatre_name'], '').toLowerCase();
      const location = displayValue(theatre, ['location', 'address', 'city'], '').toLowerCase();

      return name.includes(trimmedQuery) || location.includes(trimmedQuery);
    });
  }

  function searchTheatres() {
    setTheatres(filterTheatres(allTheatres, searchQuery));
  }

  function clearSearch() {
    setSearchQuery('');
    setTheatres(allTheatres);
  }

  useEffect(() => {
    loadTheatres();
  }, []);

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState title="Loading theatres..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer compact>
      <ScreenHeader
        eyebrow="Venues"
        title="Theatres"
        subtitle="Explore venues by name, location, and capacity."
        compact
      />

      <AppCard compact accent="top" style={styles.filterCard}>
        <AppInput
          label="Search"
          placeholder="Search theatre or location"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={searchTheatres}
          compact
        />
        <View style={styles.filterActions}>
          <AppButton title="Search" onPress={searchTheatres} compact />
          <AppButton title="Clear" onPress={clearSearch} variant="secondary" compact />
        </View>
      </AppCard>

      {error ? <ErrorState message={error} onRetry={loadTheatres} /> : null}

      <FlatList
        data={theatres}
        keyExtractor={(item, index) => String(item.theatre_id ?? item.id ?? index)}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!error ? <EmptyState message="No theatres found." /> : null}
        renderItem={({ item }) => (
          <AppCard compact accent="left" style={styles.item}>
            <View style={styles.cardHeader}>
              <Text style={styles.itemTitle}>{displayValue(item, ['name', 'theatre_name'], 'Untitled theatre')}</Text>
              <Pill tone="accent">Venue</Pill>
            </View>
            <View style={styles.chipRow}>
              <MetadataChip label="Location" value={displayValue(item, ['location', 'address', 'city'])} tone="accent" />
              <MetadataChip label="Capacity" value={displayValue(item, ['capacity', 'total_seats'])} />
            </View>
            <View style={styles.metaGrid}>
              <MetaRow label="Description" value={displayValue(item, ['description', 'details'])} />
            </View>
          </AppCard>
        )}
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
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  item: {
    marginBottom: spacing.md,
    minHeight: 118,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
  },
  metaGrid: {
    gap: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
});
