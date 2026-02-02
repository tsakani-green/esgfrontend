import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../lib/api";

const UserContext = createContext();

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

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [allClients, setAllClients] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        if (!token) {
          if (!cancelled) setLoading(false);
          return;
        }

        // Fetch profile
        const profile = await fetchUserProfile();
        if (!cancelled && profile?.role === "admin") {
          await fetchAllClients();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    // safety timeout
    const t = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 8000);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      });

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      }

      return null;
    }
  };

  const fetchAllClients = async () => {
    if (!token) return [];

    try {
      // IMPORTANT: admin router is mounted at /api/admin (see main.py)
      const response = await axios.get(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      });

      const users = response.data?.users || response.data || [];
      setAllClients(users);
      return users;
    } catch (error) {
      console.error("Error fetching clients:", error);
      setAllClients([]);
      return [];
    }
  };

  const login = async (username, password) => {
    try {
      // Send x-www-form-urlencoded (matches FastAPI OAuth style)
      const body = new URLSearchParams();
      body.append("username", username);
      body.append("password", password);

      const response = await axios.post(`${API_BASE}/api/auth/login`, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 30000,
      });

      const accessToken = response.data?.access_token;
      const userObj = response.data?.user;

      if (!accessToken || !userObj) {
        return { success: false, error: "Unexpected login response from server." };
      }

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userObj));
      setToken(accessToken);
      setUser(userObj);

      return { success: true, role: userObj.role };
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed";
      if (error.response?.status === 401) errorMessage = "Invalid username or password";
      else if (error.response?.status === 403) errorMessage = "Please activate your account via the email link.";
      else if (error.response?.data?.detail) errorMessage = error.response.data.detail;
      else if (error.code === "ECONNABORTED") errorMessage = "Login request timed out (backend may be sleeping). Try again.";
      else if (error.message) errorMessage = error.message;

      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    try {
      // IMPORTANT: signup does NOT auto-login now (email activation first)
      const signupData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name,
        company: userData.company || "",
      };

      const response = await axios.post(`${API_BASE}/api/auth/signup`, signupData, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      });

      if (response.data?.success) {
        return {
          success: true,
          message:
            response.data?.message ||
            "Account created. Please check your email to activate your account.",
        };
      }

      return { success: false, error: response.data?.detail || "Signup failed" };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Signup failed",
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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setAllClients([]);
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
