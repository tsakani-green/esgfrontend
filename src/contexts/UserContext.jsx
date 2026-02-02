import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE as API_URL } from "../lib/api.js"; // use the central API base

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [allClients, setAllClients] = useState([]);

  // ---- helpers ----
  const persistAuth = (accessToken, userObj) => {
    if (accessToken) localStorage.setItem("token", accessToken);
    else localStorage.removeItem("token");

    if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
    else localStorage.removeItem("user");
  };

  const clearAuth = () => {
    persistAuth(null, null);
    setToken(null);
    setUser(null);
    setAllClients([]);
  };

  // Helper function to determine portfolio access based on username
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

  const fetchUserProfile = async (activeToken = token) => {
    if (!activeToken) return null;

    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${activeToken}` },
        timeout: 15000,
      });

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);

      if (error.response?.status === 401) {
        console.log("Invalid token, cleared authentication");
        clearAuth();
        return null;
      }

      // fallback: keep whatever is in localStorage if valid
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

      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllClients = async (activeToken = token) => {
    if (!activeToken) return [];

    try {
      const response = await axios.get(`${API_URL}/api/auth/admin/users`, {
        headers: { Authorization: `Bearer ${activeToken}` },
        timeout: 15000,
      });

      const users = response.data?.users || [];
      setAllClients(users);
      return users;
    } catch (error) {
      console.error("Error fetching clients:", error);
      setAllClients([]);
      return [];
    }
  };

  // boot: if token exists, fetch profile; if admin, fetch admin list
  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      // safety timeout: stop infinite loading in UI
      const t = setTimeout(() => {
        if (isMounted) setLoading(false);
      }, 12000);

      try {
        const profile = await fetchUserProfile(token);
        if (profile?.role === "admin") {
          await fetchAllClients(token);
        }
      } finally {
        clearTimeout(t);
        if (isMounted) setLoading(false);
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (username, password) => {
    try {
      // ✅ FastAPI login typically expects: application/x-www-form-urlencoded
      const body = new URLSearchParams();
      body.append("username", username);
      body.append("password", password);

      const response = await axios.post(`${API_URL}/api/auth/login`, body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 20000,
      });

      const { access_token, user_id, role } = response.data;

      const basicUserInfo = {
        id: user_id,
        username,
        role,
        portfolio_access: getPortfolioAccessByUsername(username),
      };

      setToken(access_token);
      setUser(basicUserInfo);
      persistAuth(access_token, basicUserInfo);

      // fetch full profile in background (best effort)
      try {
        const profile = await fetchUserProfile(access_token);
        if (profile?.role === "admin") {
          await fetchAllClients(access_token);
        }
      } catch {
        // ignore; basic auth still works
      }

      return { success: true, role };
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed";

      if (error.code === "ECONNABORTED") {
        errorMessage = "Login timed out. Backend may be sleeping/spinning up (Render free tier) or down.";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = `Cannot connect to backend at ${API_URL}. Check Render status / URL / CORS.`;
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid username or password";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
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

      const { access_token, user_id, role, message, activation_link } = response.data;

      const basicUserInfo = {
        id: user_id,
        username: userData.username,
        full_name: userData.full_name,
        role,
        portfolio_access: [],
      };

      setToken(access_token);
      setUser(basicUserInfo);
      persistAuth(access_token, basicUserInfo);

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
        error: error.response?.data?.detail || "Signup failed",
      };
    }
  };

  // visible clients to current user
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
    clearAuth();
  };

  const value = useMemo(
    () => ({
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
    }),
    [user, loading, token, allClients]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
