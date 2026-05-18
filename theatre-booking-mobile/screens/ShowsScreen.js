import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.statusText}>Loading shows...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shows</Text>
      <View style={styles.filters}>
        <TextInput
          style={styles.input}
          placeholder="Search show title"
          value={titleQuery}
          onChangeText={setTitleQuery}
          returnKeyType="search"
          onSubmitEditing={searchShows}
        />
        <View style={styles.filterActions}>
          <Button title="Search" onPress={searchShows} />
          <Button title="Clear" onPress={clearFilters} />
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
      </View>
      {error ? (
        <View style={styles.messageBlock}>
          <Text style={styles.error}>{error}</Text>
          <Button title="Try again" onPress={loadShows} />
        </View>
      ) : null}
      <FlatList
        data={shows}
        keyExtractor={(item, index) => String(showIdFor(item) ?? index)}
        ListEmptyComponent={<Text style={styles.empty}>No shows found.</Text>}
        renderItem={({ item }) => {
          const showId = showIdFor(item);

          return (
            <Pressable
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
              disabled={!showId}
              onPress={() => navigation.navigate('ShowDetails', { showId })}
            >
              <Text style={styles.itemTitle}>{valueFor(item, ['title', 'name', 'show_name'], 'Untitled show')}</Text>
              <Text style={styles.itemText}>Theatre: {valueFor(item, ['theatre_name', 'theatre', 'venue'])}</Text>
              <Text style={styles.itemText}>Date: {valueFor(item, ['show_date', 'date'])}</Text>
              <Text style={styles.itemText}>Time: {valueFor(item, ['show_time', 'time', 'start_time'])}</Text>
              {showId ? <Text style={styles.linkText}>View details</Text> : null}
            </Pressable>
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
  empty: { color: '#555', textAlign: 'center', marginTop: 24 },
  filters: { marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 },
  filterActions: { gap: 8, marginBottom: 10 },
  theatreFilters: { marginTop: 2 },
  filterChip: { borderWidth: 1, borderColor: '#bbb', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12, marginRight: 8 },
  filterChipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  filterChipText: { color: '#222' },
  filterChipTextActive: { color: '#fff', fontWeight: '600' },
  item: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 14, marginBottom: 12 },
  itemPressed: { backgroundColor: '#f1f6ff' },
  itemTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  itemText: { color: '#444', marginTop: 2 },
  linkText: { color: '#007AFF', marginTop: 10, fontWeight: '600' },
});
