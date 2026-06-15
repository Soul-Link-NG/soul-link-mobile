import axios from "axios";
import * as SecureStore from "expo-secure-store";

// const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";
// const API_URL = "https://soul-link-api.onrender.com";

const API_URL = __DEV__
  ? "http://172.29.118.139:4000"
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
