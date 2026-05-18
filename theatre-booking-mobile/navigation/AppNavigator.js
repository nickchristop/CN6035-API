import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import { LoadingState } from '../components/StateView';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import TheatresScreen from '../screens/TheatresScreen';
import ShowsScreen from '../screens/ShowsScreen';
import ShowDetailsScreen from '../screens/ShowDetailsScreen';
import CreateReservationScreen from '../screens/CreateReservationScreen';
import ReservationsScreen from '../screens/ReservationsScreen';

const Stack = createNativeStackNavigator();

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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
