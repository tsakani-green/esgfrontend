import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE as API_URL } from '../api/http.js';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [allClients, setAllClients] = useState([]);

  useEffect(() => {
    if (token) {
      // Fetch profile first; only load admin-only data when user is confirmed admin
      (async () => {
        const profile = await fetchUserProfile();
        if (profile?.role === 'admin') {
          await fetchAllClients();
        }
      })()
    } else {
      setLoading(false);
    }

    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeout);
  }, [token]);

  const fetchAllClients = async () => {
    // Only attempt to fetch when we have a token and user is admin
    if (!token) return [];
    try {
      const response = await axios.get(`${API_URL}/api/auth/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 7000,
      });
      setAllClients(response.data.users || []);
      return response.data.users || [];
    } catch (error) {
      // If the user is not authorized, clear any admin clients and surface the error
      console.error('Error fetching clients:', error);
      if (error.response?.status === 403) {
        setAllClients([]);
        return [];
      }

      // Network or other server error - do not expose mock data in production
      setAllClients([]);
      return [];
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 7000,
      });
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If we get a 401 error, clear the token and user
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        console.log('Invalid token, cleared authentication');
      } else {
        // Network/other error — fall back to minimal info from localStorage (if any)
        const stored = localStorage.getItem('user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            return parsed;
          } catch (e) {
            // ignore
          }
        }
        console.log('Using basic user info from login (fallback)');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${API_URL}/api/auth/login`, formData, {
        timeout: 10000,
      });
      
      const { access_token, user_id, role } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Set basic user info from login response
      // We'll fetch full profile later
      const basicUserInfo = {
        id: user_id,
        username: username,
        role: role,
        // We'll determine portfolio access based on username for now
        portfolio_access: getPortfolioAccessByUsername(username)
      };
      
      setUser(basicUserInfo);
      setLoading(false);
      
      // Store user info in localStorage for Login component access
      localStorage.setItem('user', JSON.stringify(basicUserInfo));
      
      return { success: true, role: role };
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide more helpful error messages for different types of failures
      let errorMessage = 'Login failed';
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = `Cannot connect to backend at ${API_URL}. Check if the server is running and VITE_API_URL is set correctly.`;
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  // Helper function to determine portfolio access based on username
  const getPortfolioAccessByUsername = (username) => {
    switch (username) {
      case 'admin':
        // Admin has access to all portfolios
        return ['dube-trade-port', 'bertha-house'];
      case 'dube-user':
        return ['dube-trade-port'];
      case 'bertha-user':
        return ['bertha-house'];
      default:
        return [];
    }
  };

  // Helper function to get clients visible to the current user
  // - admin: returns full admin list
  // - client: returns only the current user's record (so UI can still map over an array)
  const getAllClients = () => {
    if (!user) return [];
    if (user.role === 'admin') return allClients || [];
    // ensure we return a consistent shape for client users
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const signup = async (userData) => {
    try {
      // Add default role and portfolio access for new users
      const signupData = {
        ...userData,
        role: 'client', // Default role for new users
        portfolio_access: [] // Empty by default, admin will assign later
      };

      const response = await axios.post(`${API_URL}/api/auth/signup`, signupData);
      
      const { access_token, user_id, role, message, activation_link } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Set basic user info from signup response
      const basicUserInfo = {
        id: user_id,
        username: userData.username,
        full_name: userData.full_name,
        role: role,
        portfolio_access: [] // New users start with no portfolio access
      };
      
      setUser(basicUserInfo);
      setLoading(false);
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(basicUserInfo));
      
      return { 
        success: true, 
        message: message || `Welcome ${userData.full_name}! Your account has been created. Please check your email for activation link.`,
        activation_link: activation_link || null
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Signup failed' 
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

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
