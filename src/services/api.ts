import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Get API URL from environment variables
// Format: EXPO_PUBLIC_API_URL (will be accessed as Constants.expoConfig?.extra?.apiUrl)
// Or fallback to env.local settings
const API_URL = __DEV__
  ? "http://172.23.207.24:4000"
  : "https://soul-link-api.onrender.com";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("soul-link-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
