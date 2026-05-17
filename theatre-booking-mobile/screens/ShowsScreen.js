import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
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

export default function ShowsScreen({ navigation }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadShows() {
    setError('');
    setLoading(true);
    try {
      const response = await api.get('/shows');
      setShows(asList(response.data));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Unable to load shows.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShows();
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
  item: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 14, marginBottom: 12 },
  itemPressed: { backgroundColor: '#f1f6ff' },
  itemTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  itemText: { color: '#444', marginTop: 2 },
  linkText: { color: '#007AFF', marginTop: 10, fontWeight: '600' },
});
