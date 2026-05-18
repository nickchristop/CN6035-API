import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theatre Booking</Text>
      <Text style={styles.subtitle}>Welcome! Browse shows and manage your reservations.</Text>
      <View style={styles.actions}>
        <Button title="Browse Theatres" onPress={() => navigation.navigate('Theatres')} />
        <Button title="Browse Shows" onPress={() => navigation.navigate('Shows')} />
        <Button title="My Reservations" onPress={() => navigation.navigate('Reservations')} />
      </View>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 24, textAlign: 'center' },
  actions: { width: '100%', gap: 10, marginBottom: 24 },
});
