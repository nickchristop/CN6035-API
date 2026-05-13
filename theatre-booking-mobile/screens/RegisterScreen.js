import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      setError('Name, email and password are required.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: trimmedName,
        email: trimmedEmail,
        password,
      });
      navigation.navigate('Login');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        autoComplete="name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        autoComplete="new-password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {loading ? (
        <ActivityIndicator style={styles.spinner} />
      ) : (
        <Button title="Register" onPress={handleRegister} />
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 },
  spinner: { marginVertical: 8 },
  error: { color: '#cc0000', textAlign: 'center', marginTop: 8 },
  link: { marginTop: 16, textAlign: 'center', color: '#007AFF' },
});
