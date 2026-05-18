import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import AppInput from '../components/AppInput';
import ScreenContainer from '../components/ScreenContainer';
import { FeedbackMessage } from '../components/StateView';
import { ScreenHeader } from '../components/TextBits';
import { colors, spacing } from '../theme';
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
    <ScreenContainer scroll centered contentStyle={styles.content}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>TB</Text>
        </View>
        <View>
          <Text style={styles.brandName}>Theatre Booking</Text>
          <Text style={styles.brandTagline}>Reserve the best seats</Text>
        </View>
      </View>
      <ScreenHeader
        eyebrow="Curtain call"
        title="Welcome back"
        subtitle="Sign in to browse shows, reserve seats, and manage your bookings."
      />
      <AppCard accent="top">
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
          placeholder="Your password"
          autoComplete="password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <FeedbackMessage message={error} />
        <AppButton title="Login" onPress={handleLogin} loading={loading} />
      </AppCard>
      <Pressable style={styles.linkWrapper} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  brandMark: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.accent,
    borderRadius: 18,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  brandMarkText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
  },
  brandName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  brandTagline: {
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  content: {
    justifyContent: 'center',
  },
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
