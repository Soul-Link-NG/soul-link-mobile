import axios from 'axios';

// For local development with Android Emulator, use 10.0.2.2 instead of localhost
// For iOS, localhost works fine.
// Better to use an environment variable or a constant that can be changed.
const API_URL = 'http://192.168.1.204:4000'; // Current local machine IP

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};
