import axios from 'axios'

import { API_BASE as API_URL } from '../api/http.js'

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('access_token') || 
         localStorage.getItem('token') || 
         localStorage.getItem('authToken') ||
         null
}

// Build auth headers
const buildAuthHeaders = () => {
  const token = getAuthToken()
  // Only include Authorization header if token exists
  // This allows requests to work when auth is disabled
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Upload service for PDF files
export const uploadService = {
  // Bulk upload PDF invoices
  async uploadInvoices(formData, onProgress = null) {
    try {
      const response = await axios.post(`${API_URL}/api/invoices/invoice-bulk-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...buildAuthHeaders(),
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            onProgress(percentCompleted)
          }
        },
        timeout: 300000, // 5 minutes timeout for large files
      })

      return response.data
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error(
        error.response?.data?.detail || 
        error.response?.data?.error || 
        error.message || 
        'Upload failed'
      )
    }
  },

  // Get uploaded invoices from database
  async getInvoices(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/api/invoices`, {
        headers: {
          'Content-Type': 'application/json',
          ...buildAuthHeaders(),
        },
        params: {
          limit: params.limit || 100,
          skip: params.skip || 0,
          months: params.months || 12,
          ...params,
        },
      })

      return response.data
    } catch (error) {
      console.error('Get invoices error:', error)
      throw new Error(
        error.response?.data?.detail || 
        error.response?.data?.error || 
        error.message || 
        'Failed to fetch invoices'
      )
    }
  },

  // Get MongoDB statistics
  async getStats() {
    try {
      const response = await axios.get(`${API_URL}/api/invoices/mongodb-stats`, {
        headers: buildAuthHeaders(),
      })

      return response.data
    } catch (error) {
      console.error('Get stats error:', error)
      throw new Error(
        error.response?.data?.detail || 
        error.response?.data?.error || 
        error.message || 
        'Failed to fetch statistics'
      )
    }
  },

  // Get ESG metrics
  async getESGMetrics(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/api/invoices/esg/metrics`, {
        headers: buildAuthHeaders(),
        params: {
          months: params.months || 12,
          ...params,
        },
      })

      return response.data
    } catch (error) {
      console.error('Get ESG metrics error:', error)
      throw new Error(
        error.response?.data?.detail || 
        error.response?.data?.error || 
        error.message || 
        'Failed to fetch ESG metrics'
      )
    }
  },

  // Save invoices to MongoDB
  async saveToMongoDB(invoices) {
    try {
      const response = await axios.post(`${API_URL}/api/invoices/save-to-mongodb`, {
        invoices,
        timestamp: new Date().toISOString(),
      }, {
        headers: {
          'Content-Type': 'application/json',
          ...buildAuthHeaders(),
        },
      })

      return response.data
    } catch (error) {
      console.error('Save to MongoDB error:', error)
      throw new Error(
        error.response?.data?.detail || 
        error.response?.data?.error || 
        error.message || 
        'Failed to save to database'
      )
    }
  },

  // Load invoices from MongoDB
  async loadFromMongoDB(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/api/invoices/load-from-mongodb`, {
        headers: buildAuthHeaders(),
        params: {
          limit: params.limit || 100,
          skip: params.skip || 0,
          months: params.months || 12,
          ...params,
        },
      })

      return response.data
    } catch (error) {
      console.error('Load from MongoDB error:', error)
      throw new Error(
        error.response?.data?.detail || 
        error.response?.data?.error || 
        error.message || 
        'Failed to load from database'
      )
    }
  },
}

export default uploadService
