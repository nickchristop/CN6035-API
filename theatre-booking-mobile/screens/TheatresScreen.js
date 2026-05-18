import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppInput from '../components/AppInput';
import ScreenContainer from '../components/ScreenContainer';
import { EmptyState, ErrorState, LoadingState } from '../components/StateView';
import { MetaRow, ScreenHeader, Pill } from '../components/TextBits';
import { colors, spacing } from '../theme';
import api from '../services/api';

function asList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.theatres)) return data.theatres;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function valueFor(item, keys, fallback = 'Not provided') {
  const value = keys.map(key => item?.[key]).find(itemValue => itemValue !== undefined && itemValue !== null && itemValue !== '');
  return value === undefined ? fallback : String(value);
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
      const name = valueFor(theatre, ['name', 'theatre_name'], '').toLowerCase();
      const location = valueFor(theatre, ['location', 'address', 'city'], '').toLowerCase();

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
    <ScreenContainer>
      <ScreenHeader
        eyebrow="Venues"
        title="Theatres"
        subtitle="Explore venues by name, location, and capacity."
      />

      <AppCard style={styles.filterCard}>
        <AppInput
          label="Search"
          placeholder="Search theatre or location"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={searchTheatres}
        />
        <View style={styles.filterActions}>
          <AppButton title="Search" onPress={searchTheatres} />
          <AppButton title="Clear" onPress={clearSearch} variant="secondary" />
        </View>
      </AppCard>

      {error ? <ErrorState message={error} onRetry={loadTheatres} /> : null}

      <FlatList
        data={theatres}
        keyExtractor={(item, index) => String(item.theatre_id ?? item.id ?? index)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!error ? <EmptyState message="No theatres found." /> : null}
        renderItem={({ item }) => (
          <AppCard style={styles.item}>
            <View style={styles.cardHeader}>
              <Text style={styles.itemTitle}>{valueFor(item, ['name', 'theatre_name'], 'Untitled theatre')}</Text>
              <Pill tone="accent">Venue</Pill>
            </View>
            <MetaRow label="Location" value={valueFor(item, ['location', 'address', 'city'])} />
            <MetaRow label="Capacity" value={valueFor(item, ['capacity', 'total_seats'])} />
          </AppCard>
        )}
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
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  item: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
});
