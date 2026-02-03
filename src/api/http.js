// frontend/src/lib/api.js
import axios from "axios";

// Behaviour:
// - If VITE_API_URL is set at build time, use it (trim trailing slash)
// - In development (DEV) default to http://localhost:8003  (match your backend)
// - In production (PROD) default to '' (same origin) — only works if frontend+backend share a domain.
//   If your backend is hosted separately (Render/Railway/etc.), set VITE_API_URL on Vercel.
const rawBase =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:8003" : "");

const API_BASE = String(rawBase).replace(/\/+$/, ""); // trim trailing slash

export function makeClient(getToken) {
  const client = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
    withCredentials: true, // safe; helps if you ever use cookies
  });

  client.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return client;
}

export { API_BASE };
