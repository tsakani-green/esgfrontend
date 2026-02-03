// API Configuration
// Use VITE_API_URL when provided (set in Vercel/Render). Fallbacks:
// - During local development (Vite DEV) default to http://localhost:8002
// - In production default to '' (relative paths) to avoid hard-coded failing hostnames
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8002' : '');

// WebSocket URL - override with VITE_WS_URL in production; default to localhost in DEV
export const WS_URL =
  import.meta.env.VITE_WS_URL ?? (import.meta.env.DEV ? 'ws://localhost:8000' : '');
