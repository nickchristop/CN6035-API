import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.statusText}>Loading theatres...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theatres</Text>
      <View style={styles.filters}>
        <TextInput
          style={styles.input}
          placeholder="Search theatre or location"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={searchTheatres}
        />
        <View style={styles.filterActions}>
          <Button title="Search" onPress={searchTheatres} />
          <Button title="Clear" onPress={clearSearch} />
        </View>
      </View>
      {error ? (
        <View style={styles.messageBlock}>
          <Text style={styles.error}>{error}</Text>
          <Button title="Try again" onPress={loadTheatres} />
        </View>
      ) : null}
      <FlatList
        data={theatres}
        keyExtractor={(item, index) => String(item.theatre_id ?? item.id ?? index)}
        ListEmptyComponent={<Text style={styles.empty}>No theatres found.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{valueFor(item, ['name', 'theatre_name'], 'Untitled theatre')}</Text>
            <Text style={styles.itemText}>Location: {valueFor(item, ['location', 'address', 'city'])}</Text>
            <Text style={styles.itemText}>Capacity: {valueFor(item, ['capacity', 'total_seats'])}</Text>
          </View>
        )}
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
  filterActions: { gap: 8 },
  item: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 14, marginBottom: 12 },
  itemTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  itemText: { color: '#444', marginTop: 2 },
});
