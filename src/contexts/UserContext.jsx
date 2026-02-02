import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE as API_URL, makeClient } from "../lib/api.js";

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
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

  // shared axios client with auth header
  const client = useMemo(() => makeClient(() => token), [token]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }

      // prevent infinite spinner
      const timeout = setTimeout(() => {
        if (!cancelled) setLoading(false);
      }, 8000);

      try {
        const profile = await fetchUserProfile();
        if (profile?.role === "admin") {
          await fetchAllClients();
        }
      } finally {
        clearTimeout(timeout);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchAllClients = async () => {
    if (!token) return [];
    try {
      const response = await client.get("/api/auth/admin/users", { timeout: 15000 });
      const users = response.data?.users || [];
      setAllClients(users);
      return users;
    } catch (error) {
      console.error("Error fetching clients:", error);
      setAllClients([]);
      return [];
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await client.get("/api/auth/me", { timeout: 15000 });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);

      // invalid/expired token
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setAllClients([]);
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper: determine portfolio access based on username (your existing logic)
  const getPortfolioAccessByUsername = (uname) => {
    switch (uname) {
      case "admin":
        return ["dube-trade-port", "bertha-house"];
      case "dube-user":
        return ["dube-trade-port"];
      case "bertha-user":
        return ["bertha-house"];
      default:
        return [];
    }
  };

  const login = async (username, password) => {
    try {
      // ✅ FastAPI OAuth2PasswordRequestForm expects x-www-form-urlencoded
      const body = new URLSearchParams();
      body.set("username", username);
      body.set("password", password);

      const response = await axios.post(`${API_URL}/api/auth/login`, body.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 20000,
      });

      const { access_token, user_id, role } = response.data || {};

      if (!access_token) {
        return { success: false, error: "Login failed: no access token returned." };
      }

      localStorage.setItem("token", access_token);
      setToken(access_token);

      // basic user (quick UI), then /me loads the full profile
      const basicUserInfo = {
        id: user_id,
        username,
        role: role || "client",
        portfolio_access: getPortfolioAccessByUsername(username),
      };

      setUser(basicUserInfo);
      localStorage.setItem("user", JSON.stringify(basicUserInfo));

      // try to refresh full profile (non-blocking)
      fetchUserProfile().catch(() => {});

      return { success: true, role: role || "client" };
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed";

      if (
        error.code === "ECONNABORTED" ||
        error.message?.toLowerCase().includes("timeout")
      ) {
        errorMessage = `Backend timeout. If you're on Render free tier, it may be sleeping. Also check backend deploy health. API: ${API_URL}`;
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = `Cannot connect to backend at ${API_URL}. Check VITE_API_URL and backend status.`;
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid username or password";
      } else if (error.response?.status === 422) {
        errorMessage =
          "Login request format invalid (422). Ensure Content-Type is application/x-www-form-urlencoded and body has username/password.";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
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
      const signupData = {
        ...userData,
        role: "client",
        portfolio_access: [],
      };

      const response = await axios.post(`${API_URL}/api/auth/signup`, signupData, {
        timeout: 20000,
      });

      const { access_token, user_id, role, message, activation_link } = response.data || {};

      if (access_token) {
        localStorage.setItem("token", access_token);
        setToken(access_token);
      }

      const basicUserInfo = {
        id: user_id,
        username: userData.username,
        full_name: userData.full_name,
        role: role || "client",
        portfolio_access: [],
      };

      setUser(basicUserInfo);
      localStorage.setItem("user", JSON.stringify(basicUserInfo));
      setLoading(false);

      return {
        success: true,
        message:
          message ||
          `Welcome ${userData.full_name}! Your account has been created. Please check your email for activation link.`,
        activation_link: activation_link || null,
      };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || "Signup failed",
      };
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
    loading,
    token,
    allClients,
    login,
    logout,
    signup,
    getAllClients,
    fetchAllClients,
    isAuthenticated: !!token,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
