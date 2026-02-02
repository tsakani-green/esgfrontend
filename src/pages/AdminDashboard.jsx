import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Fab,
  Tooltip,
} from '@mui/material'
import {
  People as PeopleIcon,
  Business,
  Assessment,
  Refresh,
  Visibility,
  Edit,
  Delete,
  Add as AddIcon,
  AdminPanelSettings,
  ManageAccounts,
  EnergySavingsLeaf,
  Logout,
  ArrowUpward,
  ArrowDownward,
  Storage as StorageIcon,
  Timeline,
  CloudUpload,
  AccessTime,
  Group,
  SmartToy,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { API_BASE as API_URL } from '../api/http.js'
import AIInsightsTab from '../components/dashboard/AIInsightsTab'
import LiveAIAgent from '../components/LiveAIAgent'
import AITemplatesManager from '../components/admin/AITemplatesManager'
import CarbonEmissionsCard from '../components/dashboard/CarbonEmissionsCard'

const AdminDashboard = () => {
  const theme = useTheme()
  const navigate = useNavigate()

  // =========================
  // State Management
  // =========================
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [clients, setClients] = useState([])
  const [portfolios, setPortfolios] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalFiles: 0,
    totalReports: 0,
    totalPortfolios: 0,
    totalAssets: 0,
    solarAssets: 0,
    totalEmissions: 0,
  })

  // AI / Gemini insights
  const [geminiInsights, setGeminiInsights] = useState(null)
  const [aiDialogOpen, setAiDialogOpen] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiInstruction, setAiInstruction] = useState(
    'Generate a carbon reduction report for the top-emitting portfolio'
  )
  const [aiAssistantResult, setAiAssistantResult] = useState(null)

  // Dialog states
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [newClientData, setNewClientData] = useState({
    full_name: '',
    username: '',
    email: '',
    status: 'active',
  })
  const [isEditingClient, setIsEditingClient] = useState(false)

  const [newPortfolioOpen, setNewPortfolioOpen] = useState(false)
  const [newPortfolioData, setNewPortfolioData] = useState({
    id: '',
    name: '',
    clientId: '',
    description: '',
    status: 'active',
  })
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false)

  // =========================
  // Auth token helpers
  // =========================
  const getToken = () => {
    const token = localStorage.getItem('token')
    console.log('Token from localStorage:', token ? 'Exists' : 'Missing')
    return token || ''
  }

  const authHeaders = () => {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // =========================
  // AI
  // =========================
  const fetchGeminiInsights = async () => {
    setAiLoading(true)
    try {
      const res = await axios.get(`${API_URL}/api/gemini/esg-insights`, {
        headers: { ...authHeaders() },
        timeout: 10000,
      })
      setGeminiInsights(res.data)
    } catch (err) {
      console.warn('Failed to load Gemini insights (admin):', err?.message || err)
      setGeminiInsights(null)
    } finally {
      setAiLoading(false)
    }
  }

  const runAssistant = async () => {
    try {
      setAiAssistantResult(null)
      const token = getToken()

      const res = await axios.post(
        `${API_URL}/api/ai/assistant`,
        { instruction: aiInstruction, clientId: 'all' },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          timeout: 20000,
        }
      )
      setAiAssistantResult(res.data)
    } catch (err) {
      console.error('AI assistant error', err)
      setAiAssistantResult({ error: err.response?.data?.detail || err.message })
    }
  }

  // =========================
  // Fetch real data from backend
  // =========================
  const fetchData = async () => {
    setLoading(true)
    setError('')

    try {
      const token = getToken()
      if (!token) {
        setError('No authentication token found')
        setTimeout(() => navigate('/login'), 1000)
        return
      }

      console.log('Fetching data from:', `${API_URL}/api/admin/clients`)

      const clientsRes = await axios.get(`${API_URL}/api/admin/clients`, {
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
        },
        timeout: 12000,
      })

      console.log('Clients API Response:', clientsRes.data)

      // Handle different response structures
      let clientsData = []
      if (clientsRes.data && Array.isArray(clientsRes.data)) {
        clientsData = clientsRes.data
      } else if (clientsRes.data && clientsRes.data.clients && Array.isArray(clientsRes.data.clients)) {
        clientsData = clientsRes.data.clients
      } else {
        clientsData = []
      }

      console.log('Processed clients data:', clientsData.length, 'clients')
      setClients(clientsData)

      // pick a selected client if none
      if (!selectedClient && clientsData.length > 0) {
        setSelectedClient(clientsData[0])
      }

      // Extract and flatten all portfolios from all clients
      const allPortfolios = []
      let totalAssets = 0
      let solarAssets = 0
      let totalEmissions = 0

      clientsData.forEach((client) => {
        if (client.portfolios && Array.isArray(client.portfolios)) {
          client.portfolios.forEach((portfolio) => {
            const enrichedPortfolio = {
              ...portfolio,
              clientName: client.full_name || client.username,
              clientId: client.username,
              clientEmail: client.email,
            }
            allPortfolios.push(enrichedPortfolio)

            if (portfolio.assets && Array.isArray(portfolio.assets)) {
              totalAssets += portfolio.assets.length
              solarAssets += portfolio.assets.filter((asset) => asset.hasSolar === true).length
              totalEmissions += portfolio.assets.reduce(
                (sum, asset) => sum + (asset.emissions_tco2e || 0),
                0
              )
            }
          })
        }
      })

      console.log('Processed portfolios:', allPortfolios.length, 'portfolios')
      setPortfolios(allPortfolios)

      const activeUsers = clientsData.filter((c) => c.status === 'active').length

      setStats({
        totalUsers: clientsData.length,
        activeUsers,
        totalFiles: clientsData.reduce((sum, c) => sum + (c.files || 0), 0),
        totalReports: clientsData.reduce((sum, c) => sum + (c.reports || 0), 0),
        totalPortfolios: allPortfolios.length,
        totalAssets,
        solarAssets,
        totalEmissions: parseFloat(totalEmissions.toFixed(1)),
      })
    } catch (err) {
      console.error('AdminDashboard fetch error:', err)
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
      })

      if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.')
        localStorage.clear()
        navigate('/login')
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.')
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Backend might be unavailable.')
      } else if (err.message === 'Network Error') {
        setError(
          `CORS or network error. Please ensure:\n1. Backend is running at ${API_URL}\n2. CORS is enabled on backend\n3. Check browser console for details`
        )

        // Demo data fallback
        const demoClients = [
          {
            username: 'admin',
            full_name: 'Admin User',
            email: 'admin@africaesg.ai',
            status: 'active',
            portfolios: [],
            files: 45,
            reports: 12,
          },
          {
            username: 'dube-user',
            full_name: 'Dube Trade Port Manager',
            email: 'dube@africaesg.ai',
            status: 'active',
            portfolios: [],
            files: 67,
            reports: 18,
          },
          {
            username: 'bertha-user',
            full_name: 'Bertha House Manager',
            email: 'bertha@africaesg.ai',
            status: 'active',
            portfolios: [],
            files: 34,
            reports: 8,
          },
        ]

        const demoPortfolios = [
          {
            id: 'dube-trade-port',
            name: 'Dube Trade Port',
            clientId: 'dube-user',
            clientName: 'Dube Trade Port Manager',
            assets: [
              { id: '1', name: '29 Degrees South', hasSolar: false, emissions_tco2e: 2254.67 },
              { id: '2', name: 'Dube Cargo Terminal', hasSolar: true, emissions_tco2e: 518.95 },
            ],
          },
          {
            id: 'bertha-house',
            name: 'Bertha House',
            clientId: 'bertha-user',
            clientName: 'Bertha House Manager',
            assets: [{ id: '3', name: 'Main Building', hasSolar: true, emissions_tco2e: 121.1 }],
          },
        ]

        setClients(demoClients)
        setPortfolios(demoPortfolios)
        setSelectedClient(demoClients[0])

        setStats({
          totalUsers: 3,
          activeUsers: 3,
          totalFiles: 146,
          totalReports: 38,
          totalPortfolios: 2,
          totalAssets: 3,
          solarAssets: 2,
          totalEmissions: 2894.72,
        })
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to load data')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  // =========================
  // Client CRUD
  // =========================
  const openCreateClient = () => {
    setIsEditingClient(false)
    setNewClientData({ full_name: '', username: '', email: '', status: 'active' })
    setNewClientOpen(true)
  }

  const openEditClient = (client) => {
    setIsEditingClient(true)
    setNewClientData({
      full_name: client.full_name || '',
      username: client.username || '',
      email: client.email || '',
      status: client.status || 'active',
    })
    setNewClientOpen(true)
  }

  const handleCreateOrUpdateClient = async () => {
    try {
      const token = getToken()
      if (!token) {
        alert('Authentication required')
        return
      }

      // If your backend supports PUT/PATCH for updates, switch here.
      // For now, keep existing POST create behavior.
      const response = await axios.post(`${API_URL}/api/admin/clients`, newClientData, {
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
        },
        timeout: 12000,
      })

      if (response.data.success) {
        setNewClientOpen(false)
        setIsEditingClient(false)
        setNewClientData({ full_name: '', username: '', email: '', status: 'active' })
        fetchData()
        alert(isEditingClient ? 'Client updated successfully' : 'Client created successfully')
      } else {
        alert('Failed: ' + (response.data.message || 'Unknown error'))
      }
    } catch (err) {
      console.error('Create/update client error:', err)
      alert(err.response?.data?.detail || err.message || 'Failed to create/update client')
    }
  }

  const handleDeleteClient = async (username) => {
    if (!window.confirm(`Are you sure you want to delete client ${username}? This action cannot be undone.`)) {
      return
    }

    try {
      const token = getToken()
      if (!token) {
        alert('Authentication required')
        return
      }

      const response = await axios.delete(`${API_URL}/api/admin/clients/${username}`, {
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
        },
        timeout: 12000,
      })

      if (response.data.success) {
        fetchData()
        alert('Client deleted successfully')
      } else {
        alert('Failed to delete client: ' + (response.data.message || 'Unknown error'))
      }
    } catch (err) {
      console.error('Delete client error:', err)
      if (err.response?.status === 404) {
        alert('Client not found. It may have already been deleted.')
      } else {
        alert(err.response?.data?.detail || err.message || 'Failed to delete client')
      }
    }
  }

  // =========================
  // Portfolio CRUD
  // =========================
  const openCreatePortfolio = () => {
    setIsEditingPortfolio(false)
    setNewPortfolioData({ id: '', name: '', clientId: '', description: '', status: 'active' })
    setNewPortfolioOpen(true)
  }

  const openEditPortfolio = (portfolio) => {
    setIsEditingPortfolio(true)
    setNewPortfolioData({
      id: portfolio.id || portfolio._id || '',
      name: portfolio.name || '',
      clientId: portfolio.clientId || '',
      description: portfolio.description || '',
      status: portfolio.status || 'active',
    })
    setNewPortfolioOpen(true)
  }

  const handleCreateOrUpdatePortfolio = async () => {
    try {
      const token = getToken()
      if (!token) {
        alert('Authentication required')
        return
      }

      // If your backend supports PUT/PATCH for updates, switch here using newPortfolioData.id.
      const response = await axios.post(`${API_URL}/api/admin/portfolios`, newPortfolioData, {
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
        },
        timeout: 12000,
      })

      if (response.data.success) {
        setNewPortfolioOpen(false)
        setIsEditingPortfolio(false)
        setNewPortfolioData({ id: '', name: '', clientId: '', description: '', status: 'active' })
        fetchData()
        alert(isEditingPortfolio ? 'Portfolio updated successfully' : 'Portfolio created successfully')
      } else {
        alert('Failed: ' + (response.data.message || 'Unknown error'))
      }
    } catch (err) {
      console.error('Create/update portfolio error:', err)
      alert(err.response?.data?.detail || err.message || 'Failed to create/update portfolio')
    }
  }

  const handleDeletePortfolio = async (portfolioId) => {
    if (!window.confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
      return
    }

    try {
      const token = getToken()
      if (!token) {
        alert('Authentication required')
        return
      }

      const res = await axios.delete(`${API_URL}/api/admin/portfolios/${portfolioId}`, {
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
        },
        timeout: 12000,
      })

      if (res.data?.success) {
        fetchData()
        alert('Portfolio deleted successfully')
      } else {
        alert('Failed to delete portfolio: ' + (res.data?.message || 'Unknown error'))
      }
    } catch (err) {
      console.error('Delete portfolio error:', err)
      alert(err.response?.data?.detail || err.message || 'Failed to delete portfolio')
    }
  }

  // =========================
  // Stat Card Component
  // =========================
  const StatCard = ({ title, value, icon, color = 'primary', trend, subtitle }) => {
    const palette = theme.palette[color] || theme.palette.primary

    return (
      <Card
        sx={{
          height: '100%',
          borderRadius: 3,
          border: `1px solid ${alpha(palette.main, 0.12)}`,
          background: `linear-gradient(135deg, ${alpha(palette.main, 0.08)} 0%, ${alpha(
            palette.main,
            0.02
          )} 100%)`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${palette.main} 0%, ${palette.light} 100%)`,
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Avatar sx={{ bgcolor: alpha(palette.main, 0.15), color: palette.main, width: 40, height: 40 }}>
              {icon}
            </Avatar>

            {trend && (
              <Chip
                icon={trend >= 0 ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                label={`${Math.abs(trend)}%`}
                color={trend >= 0 ? 'success' : 'error'}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, textTransform: 'uppercase' }}>
            {title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    )
  }

  // =========================
  // Loading state
  // =========================
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
          Loading Admin Dashboard...
        </Typography>
        {error && (
          <Alert severity="warning" sx={{ mt: 2, maxWidth: 400 }}>
            {error}
          </Alert>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Paper
        sx={{
          width: 280,
          borderRadius: 0,
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${theme.palette.background.paper} 100%)`,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <AdminPanelSettings />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={900}>
                Admin Panel
              </Typography>
              <Typography variant="caption" color="text.secondary">
                AfricaESG.AI
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2, color: 'text.secondary' }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
            <Button
              fullWidth
              variant={activeTab === 'overview' ? 'contained' : 'outlined'}
              startIcon={<Assessment />}
              onClick={() => setActiveTab('overview')}
              sx={{ py: 1.2, borderRadius: 2, justifyContent: 'flex-start', textTransform: 'none', fontWeight: 700 }}
            >
              Overview
            </Button>

            <Button
              fullWidth
              variant={activeTab === 'clients' ? 'contained' : 'outlined'}
              startIcon={<PeopleIcon />}
              onClick={() => setActiveTab('clients')}
              sx={{ py: 1.2, borderRadius: 2, justifyContent: 'flex-start', textTransform: 'none', fontWeight: 700 }}
            >
              Clients ({clients.length})
            </Button>

            <Button
              fullWidth
              variant={activeTab === 'portfolios' ? 'contained' : 'outlined'}
              startIcon={<Business />}
              onClick={() => setActiveTab('portfolios')}
              sx={{ py: 1.2, borderRadius: 2, justifyContent: 'flex-start', textTransform: 'none', fontWeight: 700 }}
            >
              Portfolios ({portfolios.length})
            </Button>

            <Button
              fullWidth
              variant={activeTab === 'ai' ? 'contained' : 'outlined'}
              startIcon={<SmartToy />}
              onClick={() => setActiveTab('ai')}
              sx={{ py: 1.2, borderRadius: 2, justifyContent: 'flex-start', textTransform: 'none', fontWeight: 700 }}
            >
              AI
            </Button>
          </Box>

          <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2, color: 'text.secondary' }}>
            QUICK STATS
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
              <Typography variant="h5" fontWeight={900}>
                {stats.totalUsers}
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
              <Typography variant="body2" color="text.secondary">
                Active Now
              </Typography>
              <Typography variant="h5" fontWeight={900} color="success.main">
                {stats.activeUsers}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchData}
              disabled={loading}
              sx={{ py: 1.2, borderRadius: 2, justifyContent: 'flex-start', textTransform: 'none', fontWeight: 700 }}
            >
              Refresh Data
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ py: 1.2, borderRadius: 2, justifyContent: 'flex-start', textTransform: 'none', fontWeight: 700 }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
          {/* Header */}
          <Paper
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(
                theme.palette.secondary.main,
                0.04
              )} 100%)`,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h3" fontWeight={950} sx={{ letterSpacing: -1 }}>
                  Admin Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {API_URL} • Real-time monitoring
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Chip
                  icon={<AccessTime />}
                  label={`Updated: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  variant="outlined"
                />
                <Button variant="outlined" startIcon={<Refresh />} onClick={fetchData} disabled={loading} sx={{ borderRadius: 2 }}>
                  {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </Box>
            </Box>

            {error && (
              <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError('')}>
                <Typography variant="body2">
                  <strong>Note:</strong> {error.split('\n')[0]}
                  {error.includes('CORS') && (
                    <>
                      <br />
                      <br />
                      Using demo data for development.
                    </>
                  )}
                </Typography>
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip icon={<Group />} label={`${stats.activeUsers} Active Users`} color="primary" size="small" />
              <Chip icon={<Business />} label={`${stats.totalPortfolios} Portfolios`} color="success" size="small" />
              <Chip icon={<EnergySavingsLeaf />} label={`${stats.solarAssets} Solar Assets`} color="warning" size="small" />
              <Chip icon={<StorageIcon />} label={`${stats.totalFiles} Files`} color="info" size="small" />
            </Box>
          </Paper>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard title="Total Users" value={stats.totalUsers} icon={<PeopleIcon />} color="primary" trend={12} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StatCard title="Active Users" value={stats.activeUsers} icon={<PeopleIcon />} color="success" trend={5} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StatCard title="Total Portfolios" value={stats.totalPortfolios} icon={<Business />} color="info" trend={15} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StatCard title="Total Assets" value={stats.totalAssets} icon={<Assessment />} color="warning" trend={8} />
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard title="Solar Assets" value={stats.solarAssets} icon={<EnergySavingsLeaf />} color="success" trend={25} subtitle="renewable" />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StatCard title="Total Files" value={stats.totalFiles} icon={<StorageIcon />} color="secondary" trend={12} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StatCard title="Total Reports" value={stats.totalReports} icon={<Assessment />} color="info" trend={8} />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StatCard title="Total Emissions" value={stats.totalEmissions} icon={<CloudUpload />} color="error" trend={-5} subtitle="tCO₂e" />
                </Grid>
              </Grid>

              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Timeline sx={{ mr: 2, color: theme.palette.primary.main }} />
                    <Box>
                      <Typography variant="h6" fontWeight={900}>
                        Recent Activity
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Latest system activities
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {clients.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No activity data available
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Portfolios</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {clients.slice(0, 5).map((client) => (
                          <TableRow key={client.username} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: client.status === 'active' ? 'primary.main' : 'grey.500' }}>
                                  {client.full_name?.[0]?.toUpperCase() || client.username?.[0]?.toUpperCase() || 'U'}
                                </Avatar>
                                <Typography variant="body2" fontWeight={600}>
                                  {client.full_name || client.username}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{client.email || 'No email'}</TableCell>
                            <TableCell>
                              <Chip label={client.status || 'unknown'} size="small" color={client.status === 'active' ? 'success' : 'default'} />
                            </TableCell>
                            <TableCell>
                              <Chip label={client.portfolios?.length || 0} size="small" variant="outlined" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </>
          )}

          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ManageAccounts sx={{ mr: 2, color: theme.palette.primary.main, fontSize: 28 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={900}>
                      Manage Clients ({clients.length})
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      View and manage all registered clients
                    </Typography>
                  </Box>
                </Box>

                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateClient} sx={{ borderRadius: 2 }}>
                  Add Client
                </Button>
              </Box>

              {clients.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <PeopleIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No clients found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Add your first client to get started
                  </Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateClient}>
                    Add First Client
                  </Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Client</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Portfolios</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clients.map((client) => (
                        <TableRow key={client.username} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={700}>
                                {client.full_name || client.username}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                @{client.username}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>
                            <Chip label={client.portfolios?.length || 0} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Chip label={client.status || 'active'} size="small" color={client.status === 'active' ? 'success' : 'default'} />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    alert(
                                      `Client: ${client.full_name || client.username}\nEmail: ${client.email}\nStatus: ${client.status}`
                                    )
                                  }
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Edit">
                                <IconButton size="small" onClick={() => openEditClient(client)}>
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={() => handleDeleteClient(client.username)}>
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          )}

          {/* Portfolios Tab */}
          {activeTab === 'portfolios' && (
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Business sx={{ mr: 2, color: theme.palette.primary.main, fontSize: 28 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={900}>
                      Client Portfolios ({portfolios.length})
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Manage all client portfolios and assets
                    </Typography>
                  </Box>
                </Box>

                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreatePortfolio} sx={{ borderRadius: 2 }}>
                  Create Portfolio
                </Button>
              </Box>

              {portfolios.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Business sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No portfolios yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Create your first portfolio to get started
                  </Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={openCreatePortfolio}>
                    Create Portfolio
                  </Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Portfolio Name</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>Assets</TableCell>
                        <TableCell>Solar Assets</TableCell>
                        <TableCell>Emissions (tCO₂e)</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {portfolios.map((portfolio) => (
                        <TableRow key={portfolio.id || portfolio._id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={700}>
                              {portfolio.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{portfolio.clientName || portfolio.clientId || 'Unknown'}</TableCell>
                          <TableCell>
                            <Chip label={portfolio.assets?.length || 0} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={portfolio.assets?.filter((a) => a.hasSolar).length || 0}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {portfolio.assets?.reduce((sum, a) => sum + (a.emissions_tco2e || 0), 0)?.toFixed(1) || '0.0'}
                          </TableCell>
                          <TableCell>
                            <Chip label={portfolio.status || 'active'} size="small" color={portfolio.status === 'active' ? 'success' : 'default'} />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    alert(
                                      `Portfolio: ${portfolio.name}\nClient: ${portfolio.clientName}\nAssets: ${portfolio.assets?.length || 0}`
                                    )
                                  }
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Edit">
                                <IconButton size="small" onClick={() => openEditPortfolio(portfolio)}>
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={() => handleDeletePortfolio(portfolio.id || portfolio._id)}>
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          )}

          {/* AI Tab */}
          {activeTab === 'ai' && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <AIInsightsTab
                    surfaceCard={{}}
                    energyUsageByMonth={[]}
                    liveReading={null}
                    liveError={false}
                    onGenerateReport={(r) => console.log('AI report generated', r)}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6">AI Assistant (admin)</Typography>
                      <Button size="small" startIcon={<SmartToy />} onClick={() => setAiDialogOpen(true)}>
                        Open Agent
                      </Button>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Quick instruction
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField size="small" fullWidth value={aiInstruction} onChange={(e) => setAiInstruction(e.target.value)} />
                      <Button variant="contained" size="small" onClick={runAssistant} startIcon={<SmartToy />}>
                        Run
                      </Button>
                    </Box>

                    {aiAssistantResult && (
                      <Box sx={{ mt: 1, maxHeight: 220, overflow: 'auto', bgcolor: 'background.paper', p: 1, borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Assistant result
                        </Typography>
                        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{JSON.stringify(aiAssistantResult, null, 2)}</pre>
                      </Box>
                    )}

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="subtitle2">Gemini insights</Typography>
                    {aiLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} /> <Typography variant="body2">Loading…</Typography>
                      </Box>
                    ) : geminiInsights ? (
                      <Box>
                        <Typography variant="h5">{geminiInsights.overall_score}/10</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {geminiInsights.key_insights?.[0]}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Button size="small" onClick={() => fetchGeminiInsights()}>
                            Refresh
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No AI data — configure GEMINI_API_KEY
                      </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mt: 2 }}>
                      <AITemplatesManager portfolioId={selectedClient?.username || 'bertha-house'} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              <Dialog fullWidth maxWidth="lg" open={aiDialogOpen} onClose={() => setAiDialogOpen(false)}>
                <DialogContent sx={{ height: { xs: '80vh', md: '70vh' }, p: 0 }}>
                  <LiveAIAgent onClose={() => setAiDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </Box>
          )}
        </Container>
      </Box>

      {/* Floating Action Button */}
      <Tooltip title="Quick Actions">
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            boxShadow: theme.shadows[8],
            '&:hover': { boxShadow: theme.shadows[12] },
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Create / Edit Client Dialog */}
      <Dialog open={newClientOpen} onClose={() => setNewClientOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ManageAccounts />
            <Typography variant="h6" fontWeight={700}>
              {isEditingClient ? 'Edit Client' : 'Create New Client'}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={newClientData.full_name}
              onChange={(e) => setNewClientData({ ...newClientData, full_name: e.target.value })}
              placeholder="Enter client's full name"
            />

            <TextField
              fullWidth
              label="Username"
              value={newClientData.username}
              onChange={(e) => setNewClientData({ ...newClientData, username: e.target.value })}
              placeholder="Enter unique username"
              disabled={isEditingClient}
              helperText={isEditingClient ? 'Username cannot be changed' : ''}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newClientData.email}
              onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
              placeholder="Enter client's email"
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newClientData.status}
                label="Status"
                onChange={(e) => setNewClientData({ ...newClientData, status: e.target.value })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setNewClientOpen(false)
              setIsEditingClient(false)
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateOrUpdateClient}
            disabled={!newClientData.full_name || !newClientData.username || !newClientData.email}
          >
            {isEditingClient ? 'Update Client' : 'Create Client'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create / Edit Portfolio Dialog */}
      <Dialog open={newPortfolioOpen} onClose={() => setNewPortfolioOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Business />
            <Typography variant="h6" fontWeight={700}>
              {isEditingPortfolio ? 'Edit Portfolio' : 'Create New Portfolio'}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Portfolio Name"
              value={newPortfolioData.name}
              onChange={(e) => setNewPortfolioData({ ...newPortfolioData, name: e.target.value })}
              placeholder="Enter portfolio name"
            />

            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>
              <Select
                value={newPortfolioData.clientId}
                label="Client"
                onChange={(e) => setNewPortfolioData({ ...newPortfolioData, clientId: e.target.value })}
              >
                <MenuItem value="">Select a client</MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client.username} value={client.username}>
                    {client.full_name || client.username} ({client.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Description"
              value={newPortfolioData.description}
              onChange={(e) => setNewPortfolioData({ ...newPortfolioData, description: e.target.value })}
              placeholder="Enter portfolio description"
              multiline
              rows={3}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newPortfolioData.status}
                label="Status"
                onChange={(e) => setNewPortfolioData({ ...newPortfolioData, status: e.target.value })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setNewPortfolioOpen(false)
              setIsEditingPortfolio(false)
            }}
          >
            Cancel
          </Button>

          <Button variant="contained" onClick={handleCreateOrUpdatePortfolio} disabled={!newPortfolioData.name || !newPortfolioData.clientId}>
            {isEditingPortfolio ? 'Update Portfolio' : 'Create Portfolio'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminDashboard
