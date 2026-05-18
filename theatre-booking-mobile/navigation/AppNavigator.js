import React from 'react';
import { Platform } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import { LoadingState } from '../components/StateView';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import TheatresScreen from '../screens/TheatresScreen';
import ShowsScreen from '../screens/ShowsScreen';
import ShowDetailsScreen from '../screens/ShowDetailsScreen';
import CreateReservationScreen from '../screens/CreateReservationScreen';
import ReservationsScreen from '../screens/ReservationsScreen';

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};

const stackScreenOptions = {
  headerShown: false,
  presentation: 'card',
  animation: Platform.select({
    android: 'ios_from_right',
    ios: 'simple_push',
    default: 'default',
  }),
  animationDuration: 260,
  animationMatchesGesture: true,
  gestureEnabled: true,
  contentStyle: {
    backgroundColor: colors.background,
  },
  statusBarStyle: 'light',
  statusBarBackgroundColor: colors.background,
  statusBarAnimation: 'fade',
  navigationBarColor: colors.background,
};

export default function AppNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingState title="Preparing your theatre booking app..." />
      </ScreenContainer>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={stackScreenOptions}>
        {token ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Theatres" component={TheatresScreen} />
            <Stack.Screen name="Shows" component={ShowsScreen} />
            <Stack.Screen name="ShowDetails" component={ShowDetailsScreen} />
            <Stack.Screen name="CreateReservation" component={CreateReservationScreen} />
            <Stack.Screen name="Reservations" component={ReservationsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
