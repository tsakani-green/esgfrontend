// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://esgbackend-l4fc.onrender.com';

// If you don’t have websockets on Render yet, keep localhost for dev.
// When you deploy WS later, set VITE_WS_URL in Vercel to the wss:// Render URL.
export const WS_URL =
  import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
