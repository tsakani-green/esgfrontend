import { API_BASE } from "./http.js";

export function wsUrl(token) {
  const base = API_BASE.replace("http://", "ws://").replace("https://", "wss://");
  return `${base}/ws/live?token=${encodeURIComponent(token)}`;
}
