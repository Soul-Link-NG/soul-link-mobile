import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// For Android emulator, localhost is 10.0.2.2
// For iOS simulator, localhost is 127.0.0.1
// For physical devices, use your computer's IP address
const API_URL = 'http://192.168.1.204:4000'; // Current local machine IP

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('soul-link-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

