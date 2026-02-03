// frontend/src/lib/api.js
import axios from "axios";

/**
 * Strategy:
 * - DEV (local): use "/api" so Vite proxy forwards to your backend
 * - PROD (Vercel): use VITE_API_URL (e.g. https://esgbackend-l4fc.onrender.com)
 */
const rawBase = import.meta.env.DEV
  ? "" // <-- important: same-origin, so "/api" hits Vite proxy locally
  : (import.meta.env.VITE_API_URL || "");

const API_BASE = String(rawBase).replace(/\/+$/, ""); // trim trailing slash

export function makeClient(getToken) {
  const client = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
    // If you're not using cookie auth, keep this false:
    withCredentials: false,
  });

  client.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return client;
}

export { API_BASE };
