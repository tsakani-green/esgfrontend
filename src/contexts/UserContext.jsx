// frontend/src/contexts/UserContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_BASE as API_URL } from '../lib/api.js';

const UserContext = createContext(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [allClients, setAllClients] = useState([]);

  // ---- helpers
  const persistAuth = (nextToken, nextUser) => {
    if (nextToken) localStorage.setItem('token', nextToken);
    else localStorage.removeItem('token');

    if (nextUser) localStorage.setItem('user', JSON.stringify(nextUser));
    else localStorage.removeItem('user');
  };

  // If your backend doesn't return portfolio_access yet, keep this as a fallback.
  const getPortfolioAccessByUsernameFallback = (username) => {
    switch (username) {
      case 'admin':
        return ['dube-trade-port', 'bertha-house', 'bdo', 'momentum-meersig'];
      case 'dube-user':
        return ['dube-trade-port'];
      case 'bertha-user':
        return ['bertha-house'];
      default:
        return [];
    }
  };

  const fetchUserProfile = async (authToken = token) => {
    if (!authToken) return null;

    try {
      const res = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
        timeout: 10000,
      });

      // Expecting { id, username, full_name, email, role, portfolio_access, ... }
      const profile = res.data;

      // Ensure portfolio_access exists (fallback if missing)
      const normalized = {
        ...profile,
        portfolio_access:
          Array.isArray(profile?.portfolio_access)
            ? profile.portfolio_access
            : getPortfolioAccessByUsernameFallback(profile?.username),
      };

      setUser(normalized);
      persistAuth(authToken, normalized);
      return normalized;
    } catch (err) {
      console.error('Error fetching user profile:', err);

      if (err.response?.status === 401) {
        // Invalid/expired token
        logout();
      }

      return null;
    }
  };

  const fetchAllClients = async (authToken = token) => {
    if (!authToken) return [];
    try {
      // NOTE: Keep your endpoint as-is if it's correct in your backend.
      // If your backend admin endpoint is actually /api/admin/clients, change it here.
      const res = await axios.get(`${API_URL}/api/auth/admin/users`, {
        headers: { Authorization: `Bearer ${authToken}` },
        timeout: 10000,
      });
      const users = res.data?.users || [];
      setAllClients(users);
      return users;
    } catch (err) {
      console.error('Error fetching clients:', err);
      setAllClients([]);
      return [];
    }
  };

  // ---- initial bootstrap
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!token) {
          if (!cancelled) setLoading(false);
          return;
        }

        const profile = await fetchUserProfile(token);
        if (profile?.role === 'admin') {
          await fetchAllClients(token);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    const timeout = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 5000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ---- auth actions
  const login = async (username, password) => {
    try {
      // ✅ IMPORTANT: FastAPI OAuth2PasswordRequestForm expects x-www-form-urlencoded
      const body = new URLSearchParams();
      body.append('username', username);
      body.append('password', password);

      const res = await axios.post(`${API_URL}/api/auth/login`, body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000,
      });

      // Your backend returns: { success, access_token, token_type, user: {...} }
      const accessToken = res.data?.access_token;
      const userObj = res.data?.user;

      if (!accessToken) {
        return { success: false, error: 'Login succeeded but no access_token returned.' };
      }

      setToken(accessToken);

      // Prefer user from response if present; then enrich with /me
      const basicUser = userObj
        ? {
            ...userObj,
            portfolio_access: Array.isArray(userObj?.portfolio_access)
              ? userObj.portfolio_access
              : getPortfolioAccessByUsernameFallback(userObj?.username || username),
          }
        : {
            id: res.data?.user_id || '',
            username,
            role: res.data?.role || 'client',
            portfolio_access: getPortfolioAccessByUsernameFallback(username),
          };

      setUser(basicUser);
      persistAuth(accessToken, basicUser);

      // Fetch full profile (role/portfolio_access/email/full_name)
      const profile = await fetchUserProfile(accessToken);

      // If admin, load admin-only data
      if (profile?.role === 'admin') {
        await fetchAllClients(accessToken);
      } else {
        setAllClients([]);
      }

      return { success: true, role: profile?.role || basicUser?.role || 'client' };
    } catch (err) {
      console.error('Login error:', err);

      let errorMessage = 'Login failed';
      if (err.response?.status === 401) errorMessage = 'Invalid username or password';
      else if (err.response?.status === 403) errorMessage = err.response?.data?.detail || 'Access denied';
      else if (err.response?.status === 422) {
        errorMessage =
          'Login request format invalid (422). Ensure Content-Type is application/x-www-form-urlencoded and body has username/password.';
      } else if (err.message) errorMessage = err.message;

      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    try {
      // Your backend /signup currently returns:
      // { success, message, activation_link? } and does NOT auto-login (in the code you pasted).
      const res = await axios.post(`${API_URL}/api/auth/signup`, userData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      });

      return {
        success: true,
        message: res.data?.message || 'Account created. Please check your email to activate your account.',
        activation_link: res.data?.activation_link || null,
      };
    } catch (err) {
      console.error('Signup error:', err);
      return {
        success: false,
        error: err.response?.data?.detail || err.message || 'Signup failed',
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAllClients([]);
    persistAuth(null, null);
  };

  // ---- derived helpers
  const getAllClients = () => {
    if (!user) return [];
    if (user.role === 'admin') return allClients || [];
    return [
      {
        username: user.username,
        full_name: user.full_name || user.username,
        email: user.email || '',
        role: user.role || 'client',
        portfolio_access: user.portfolio_access || [],
        status: user.status || 'active',
      },
    ];
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
      fetchUserProfile,
      isAuthenticated: !!token,
    }),
    [user, loading, token, allClients]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
