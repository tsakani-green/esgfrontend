// frontend/src/api/auth.js
import axios from "axios";
import { API_BASE as API_URL } from "./http.js";

/**
 * Login using FastAPI-friendly application/x-www-form-urlencoded
 * Returns: { success, access_token, token_type, user }
 */
export async function login(username, password) {
  const form = new URLSearchParams();
  form.append("username", (username || "").trim());
  form.append("password", password || "");

  const res = await axios.post(`${API_URL}/api/auth/login`, form, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    timeout: 12000,
  });

  // store token in the same key your dashboards read
  if (res.data?.access_token) {
    localStorage.setItem("token", res.data.access_token);
  }

  return res.data;
}

/**
 * Logout helper
 */
export function logout() {
  localStorage.removeItem("token");
}

/**
 * Get token helper
 */
export function getToken() {
  return localStorage.getItem("token") || "";
}
