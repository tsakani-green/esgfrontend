// frontend/src/lib/api.js
import axios from "axios";

// If VITE_API_URL is set at build time, use it (trim trailing slash)
// In DEV default to localhost:8002
// In PROD default to '' (same-origin) so app can call /api/*
const rawBase =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:8002" : "");

const API_BASE = String(rawBase).replace(/\/+$/, "");

export function makeClient(getToken) {
  const client = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
  });

  client.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return client;
}

export { API_BASE };
