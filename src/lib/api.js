// frontend/src/lib/api.js
import axios from "axios";

// Behaviour:
// - If VITE_API_URL is set at build time, use it (trim trailing slash)
// - In development (DEV) default to http://localhost:8002
// - In production (PROD) default to '' (same origin)
//   BUT since your backend is on Render, you MUST set VITE_API_URL on Vercel.
const rawBase =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:8002" : "");

export const API_BASE = String(rawBase).replace(/\/+$/, "");

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
