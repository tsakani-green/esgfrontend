// frontend/src/contexts/UserContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE } from "../lib/api";

const UserContext = createContext(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [allClients, setAllClients] = useState([]);

  const authHeaders = useMemo(() => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        if (!token) {
          if (!cancelled) setLoading(false);
          return;
        }

        const profile = await fetchUserProfile({ silent401: true });
        if (profile?.role === "admin") {
          await fetchAllClients();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    const t = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 5000);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchUserProfile = async ({ silent401 = false } = {}) => {
    if (!token) return null;

    try {
      const res = await axios.get(`${API_BASE}/api/auth/me`, {
        headers: authHeaders,
        timeout: 10000,
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setAllClients([]);
        if (!silent401) console.warn("Not authenticated (401). Cleared token.");
        return null;
      }

      console.error("Error fetching /me:", err);
      return null;
    }
  };

  const fetchAllClients = async () => {
    if (!token) return [];

    try {
      // ✅ matches backend/app/api/admin.py
      const res = await axios.get(`${API_BASE}/api/admin/clients`, {
        headers: authHeaders,
        timeout: 15000,
      });

      const users = res.data?.users || [];
      setAllClients(users);
      return users;
    } catch (err) {
      if (err.response?.status === 403) {
        setAllClients([]);
        return [];
      }
      console.error("Error fetching admin clients:", err);
      setAllClients([]);
      return [];
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);

      // ✅ FastAPI OAuth2PasswordRequestForm expects x-www-form-urlencoded
      const body = new URLSearchParams();
      body.append("username", username);
      body.append("password", password);

      const res = await axios.post(`${API_BASE}/api/auth/login`, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 15000,
      });

      const data = res.data || {};
      if (!data.access_token) {
        return {
          success: false,
          error: `Unexpected login response (missing access_token). Keys: ${Object.keys(data).join(", ")}`,
        };
      }

      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);

      // Minimal user until /me loads
      const basicUser = {
        id: data.user_id,
        username,
        role: data.role,
      };

      setUser(basicUser);
      localStorage.setItem("user", JSON.stringify(basicUser));

      // Pull full profile now (real data from DB)
      const profile = await fetchUserProfile({ silent401: false });

      // If admin, load clients
      if (profile?.role === "admin") {
        await fetchAllClients();
      }

      return { success: true, role: data.role };
    } catch (err) {
      console.error("Login error:", err);

      let msg = "Login failed";
      if (err.code === "ERR_NETWORK") {
        msg = `Cannot reach backend at ${API_BASE}. Check local backend or set VITE_API_URL for Vercel.`;
      } else if (err.response?.status === 401) {
        msg = "Invalid username or password";
      } else if (err.response?.data?.detail) {
        msg = err.response.data.detail;
      } else if (err.message) {
        msg = err.message;
      }

      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setAllClients([]);
  };

  const signup = async (userData) => {
    try {
      setLoading(true);

      const payload = {
        ...userData,
        role: "client",
        portfolio_access: [],
      };

      const res = await axios.post(`${API_BASE}/api/auth/signup`, payload, {
        timeout: 15000,
      });

      const data = res.data || {};
      if (!data.access_token) {
        return { success: false, error: "Signup failed (no access_token returned)" };
      }

      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);

      const basicUser = {
        id: data.user_id,
        username: userData.username,
        full_name: userData.full_name,
        role: data.role,
        portfolio_access: [],
      };

      setUser(basicUser);
      localStorage.setItem("user", JSON.stringify(basicUser));

      await fetchUserProfile({ silent401: false });

      return { success: true, role: data.role };
    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, error: err.response?.data?.detail || "Signup failed" };
    } finally {
      setLoading(false);
    }
  };

  const getAllClients = () => {
    if (!user) return [];
    if (user.role === "admin") return allClients || [];
    return [
      {
        username: user.username,
        full_name: user.full_name || user.username,
        email: user.email || "",
        role: user.role || "client",
        portfolio_access: user.portfolio_access || [],
        status: user.status || "active",
      },
    ];
  };

  const value = {
    user,
    token,
    loading,
    allClients,
    login,
    logout,
    signup,
    fetchUserProfile,
    fetchAllClients,
    getAllClients,
    isAuthenticated: !!token,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
