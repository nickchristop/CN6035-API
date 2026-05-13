import axios from 'axios';
import { Platform } from 'react-native';

// Base URL - update the physical device value for your network:
//   Android emulator:           http://10.0.2.2:3000
//   iOS simulator / web:        http://localhost:3000
//   Physical device / Expo Go:  http://YOUR_LOCAL_IP:3000
const DEFAULT_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  web: 'http://localhost:3000',
  default: 'http://localhost:3000',
});

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
