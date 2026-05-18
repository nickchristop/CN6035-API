import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { colors } from './theme';

export default function App() {
  return (
    <View style={styles.root}>
      <SafeAreaProvider style={styles.root}>
        <AuthProvider>
          <AppNavigator />
          <StatusBar style="light" backgroundColor={colors.background} />
        </AuthProvider>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
