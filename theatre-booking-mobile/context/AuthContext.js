import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken } from '../services/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      SecureStore.getItemAsync(TOKEN_KEY),
      SecureStore.getItemAsync(USER_KEY),
    ])
      .then(([storedToken, storedUser]) => {
        if (storedToken) {
          setToken(storedToken);
          setAuthToken(storedToken);
        }

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            SecureStore.deleteItemAsync(USER_KEY);
          }
        }
      })
      .catch(() => {
        setToken(null);
        setUser(null);
        setAuthToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(newToken, newUser = null) {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    if (newUser) {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(newUser));
    } else {
      await SecureStore.deleteItemAsync(USER_KEY);
    }

    setToken(newToken);
    setUser(newUser);
    setAuthToken(newToken);
  }

  async function logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setToken(null);
    setUser(null);
    setAuthToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
