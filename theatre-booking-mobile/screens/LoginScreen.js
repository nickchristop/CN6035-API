import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Email and password are required.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: trimmedEmail,
        password,
      });
      await login(response.data.token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
        autoComplete="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {loading ? (
        <ActivityIndicator style={styles.spinner} />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
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
