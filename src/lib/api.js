// frontend/src/lib/api.js
import axios from "axios";

// Behaviour:
// - If VITE_API_URL is set at build time, use it (trim trailing slash)
// - In development default to localhost:8002
// - In production default to Render backend if env not provided (recommended: set VITE_API_URL in Vercel)
const rawBase =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:8002" : "https://esgbackend-l4fc.onrender.com");

export const API_BASE = String(rawBase).replace(/\/+$/, ""); // trim trailing slash

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
