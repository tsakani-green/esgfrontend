import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE as API_URL, makeClient } from "../lib/api.js";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

function safeDetail(detail) {
  if (!detail) return "";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => d?.msg || d?.message || JSON.stringify(d))
      .join(", ");
  }
  if (typeof detail === "object") return JSON.stringify(detail);
  return String(detail);
}

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

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [allClients, setAllClients] = useState([]);

  const client = useMemo(() => makeClient(() => token), [token]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      // Safety timeout to prevent “stuck loading”
      const timeout = setTimeout(() => {
        if (mounted) setLoading(false);
      }, 5000);

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
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await client.get("/api/auth/me", { timeout: 7000 });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);

      // If we get a 401 error, clear the token and user
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        console.log("Invalid token, cleared authentication");
      } else {
        // fallback to stored user if any
        const stored = localStorage.getItem("user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            return parsed;
          } catch {
            // ignore
          }
        }
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllClients = async () => {
    if (!token) return [];
    try {
      // ✅ FIX: admin router is mounted at /api/admin (not /api/auth/admin)
      const response = await client.get("/api/admin/users", { timeout: 7000 });
      const users = response.data?.users || response.data || [];
      setAllClients(users);
      return users;
    } catch (error) {
      console.error("Error fetching clients:", error);
      if (error.response?.status === 403) {
        setAllClients([]);
        return [];
      }
      setAllClients([]);
      return [];
    }
  };

  const login = async (username, password) => {
    try {
      // ✅ FIX: send application/x-www-form-urlencoded
      const body = new URLSearchParams();
      body.append("username", username);
      body.append("password", password);
      // Optional fields used by OAuth2PasswordRequestForm (safe to include)
      body.append("grant_type", "");
      body.append("scope", "");
      body.append("client_id", "");
      body.append("client_secret", "");

      const response = await axios.post(`${API_URL}/api/auth/login`, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10000,
      });

      const { access_token, user_id, role, token_type } = response.data;

      localStorage.setItem("token", access_token);
      setToken(access_token);

      const basicUserInfo = {
        id: user_id,
        username,
        role,
        token_type: token_type || "bearer",
        portfolio_access: getPortfolioAccessByUsername(username),
      };

      setUser(basicUserInfo);
      localStorage.setItem("user", JSON.stringify(basicUserInfo));

      return { success: true, role };
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed";

      if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
        errorMessage = `Cannot connect to backend at ${API_URL}. Check if the server is running and VITE_API_URL is set correctly.`;
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid username or password";
      } else if (error.response?.status === 422) {
        // ✅ helpful message + avoid React crash
        errorMessage =
          safeDetail(error.response?.data?.detail) ||
          "Login request format invalid (422). Ensure Content-Type is application/x-www-form-urlencoded and body has username/password.";
      } else if (error.response?.data?.detail) {
        errorMessage = safeDetail(error.response.data.detail);
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const getPortfolioAccessByUsername = (username) => {
    switch (username) {
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
        timeout: 15000,
      });

      const { access_token, user_id, role, message, activation_link } = response.data;

      localStorage.setItem("token", access_token);
      setToken(access_token);

      const basicUserInfo = {
        id: user_id,
        username: userData.username,
        full_name: userData.full_name,
        role: role,
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
        error: safeDetail(error.response?.data?.detail) || "Signup failed",
      };
    }
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
