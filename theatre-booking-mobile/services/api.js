import axios from 'axios';

// Base URL — update this for your environment:
//   Android emulator:           http://10.0.2.2:3000
//   Physical device / Expo Go:  http://YOUR_LOCAL_IP:3000
const BASE_URL = 'http://10.0.2.2:3000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
