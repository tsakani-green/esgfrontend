import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { API_BASE as API_URL } from '../api/http.js'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      // Since we don't have a verify endpoint, we'll get user info from token
      // or create a user info endpoint in backend
      const tokenData = parseJwt(token)
      setUser({
        id: localStorage.getItem('user_id'),
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email'),
        role: localStorage.getItem('role'),
        ...tokenData
      })
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setLoading(false)
    }
  }

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch (e) {
      return null
    }
  }

  const login = async (username, password) => {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)
    
    const response = await axios.post(`${API_URL}/api/auth/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    const { access_token, role, user_id } = response.data
    
    localStorage.setItem('token', access_token)
    localStorage.setItem('role', role)
    localStorage.setItem('user_id', user_id)
    localStorage.setItem('username', username)
    
    setToken(access_token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    
    await fetchUser()
    
    return { role, user_id }
  }

  const signup = async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/signup`, userData)
    const { access_token, role, user_id } = response.data
    
    localStorage.setItem('token', access_token)
    localStorage.setItem('role', role)
    localStorage.setItem('user_id', user_id)
    localStorage.setItem('username', userData.username)
    localStorage.setItem('email', userData.email)
    
    setToken(access_token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    
    await fetchUser()
    
    return { role, user_id }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user_id')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}