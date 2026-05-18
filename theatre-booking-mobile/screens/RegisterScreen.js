import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppInput from '../components/AppInput';
import ScreenContainer from '../components/ScreenContainer';
import { FeedbackMessage } from '../components/StateView';
import { ScreenHeader } from '../components/TextBits';
import { colors, spacing } from '../theme';
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
    <ScreenContainer scroll centered>
      <ScreenHeader
        eyebrow="Join the audience"
        title="Create your account"
        subtitle="Register once, then reserve seats and track every booking from your phone."
      />
      <AppCard>
        <AppInput
          label="Name"
          placeholder="Full name"
          autoComplete="name"
          value={name}
          onChangeText={setName}
        />
        <AppInput
          label="Email"
          placeholder="you@example.com"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <AppInput
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <FeedbackMessage message={error} />
        <AppButton title="Register" onPress={handleRegister} loading={loading} />
      </AppCard>
      <Pressable style={styles.linkWrapper} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  linkWrapper: {
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  link: {
    color: colors.accentSoft,
    fontWeight: '700',
    textAlign: 'center',
  },
});
