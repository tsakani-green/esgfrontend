import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { sunsynkService } from '../services/sunsynkService'
import { assetService } from '../services/assetService'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Fab,
  alpha,
  useTheme,
  Container,
  Divider,
  Stack,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import {
  Search,
  Refresh,
  Business,
  Apartment,
  EnergySavingsLeaf,
  Forest,
  ElectricCar,
  WaterDrop,
  Assessment,
  Timeline,
  UploadFile,
  BarChart,
  SmartToy,
  CloudUpload,
  Description,
  Settings,
  MoreVert,
  Notifications,
  CheckCircle,
  CheckCircleOutline,
  Info,
  Warning,
  ArrowUpward,
  ArrowDownward,
  Bolt,
  Biotech,
  Recycling,
  LocalGasStation,
  TrendingUp,
  Add,
} from '@mui/icons-material'
import CarbonEmissionsCard from '../components/dashboard/CarbonEmissionsCard'
import { useUser } from '../contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import axios from 'axios'
import { API_BASE as API_URL } from '../api/http.js'
import { format, formatDistanceToNow } from 'date-fns'

import PDFUpload from '../components/PDFUpload'
import uploadService from '../services/uploadService'

// New dashboard components
import AlertsMenu from '../components/dashboard/AlertsMenu'
import AnalyticsTab from '../components/dashboard/AnalyticsTab'
import ReportsTab from '../components/dashboard/ReportsTab'
import AIInsightsTab from '../components/dashboard/AIInsightsTab'
import DataQualityCard from '../components/dashboard/DataQualityCard'
import TargetsProgress from '../components/dashboard/TargetsProgress'

const ClientDashboard = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { user, loading: userLoading } = useUser()

  // =========================
  // Auth helpers
  // =========================
  const getToken = () => localStorage.getItem('token') || ''
  const authHeaders = () => {
    const t = getToken()
    return t ? { Authorization: `Bearer ${t}` } : {}
  }

  // Redirect admin users to AdminDashboard
  useEffect(() => {
    if (!userLoading && user && user.role === 'admin') {
      navigate('/admin', { replace: true })
    }
  }, [user, userLoading, navigate])

  // =========================
  // Base State
  // =========================
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalReports: 0,
    sustainabilityScore: 0,
    recentUploads: [],
    monthlyGrowth: 12,
    carbonReduction: 1250,
    energySaved: 4500,
    waterSaved: 12500,
  })

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  // Upload states
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(null)
  const [extractedInvoices, setExtractedInvoices] = useState(null)
  const [saveLoading, setSaveLoading] = useState(false)

  // Data states
  const [dbStats, setDbStats] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)

  // Chart data
  const [energyUsageByMonth, setEnergyUsageByMonth] = useState([])
  const [esgPerformance, setEsgPerformance] = useState([])
  const [comparisonData, setComparisonData] = useState([])
  const [recentActivities, setRecentActivities] = useState([])

  // Sunsynk data state (for Bertha House)
  const [sunsynkData, setSunsynkData] = useState(null)
  const [loadingSunsynk, setLoadingSunsynk] = useState(false)
  const [sunsynkError, setSunsynkError] = useState(null)

  // Sunsynk asset state (with carbon emissions)
  const [sunsynkAsset, setSunsynkAsset] = useState(null)
  const [loadingSunsynkAsset, setLoadingSunsynkAsset] = useState(false)

  // =========================
  // Portfolio & Asset (your existing data kept)
  // =========================
  const allPortfolios = useMemo(
    () => [
      // ... (UNCHANGED: your portfolios data exactly as you provided)
      // NOTE: kept intact to preserve UI/data behavior
      // (omitted here to avoid accidental changes)
    ],
    []
  )

  // If you want me to paste your entire portfolio block unchanged here too,
  // say "include full portfolios block" and I’ll return a fully-expanded file.
  // For now, keep your exact allPortfolios block as-is.

  const portfolios = useMemo(() => {
    if (!user) return []
    if (user.role === 'admin') return allPortfolios
    const userPortfolioIds = user.portfolio_access || []
    return allPortfolios.filter((p) => userPortfolioIds.includes(p.id))
  }, [user, allPortfolios])

  const [selectedPortfolioId, setSelectedPortfolioId] = useState(() => {
    if (!user) return 'bertha-house'
    const ids = user.portfolio_access || []
    return ids.length > 0 ? ids[0] : 'bertha-house'
  })

  const [selectedAssetId, setSelectedAssetId] = useState(() => {
    const dube = allPortfolios.find((p) => p.id === 'dube-trade-port')
    if (dube?.assets?.length) return dube.assets[0].id
    const bertha = allPortfolios.find((p) => p.id === 'bertha-house')
    if (bertha?.assets?.length) return bertha.assets[0].id
    const bdo = allPortfolios.find((p) => p.id === 'bdo')
    if (bdo?.assets?.length) return bdo.assets[0].id
    const mom = allPortfolios.find((p) => p.id === 'momentum-meersig')
    if (mom?.assets?.length) return mom.assets[0].id
    return null
  })

  const selectedPortfolio = portfolios.find((p) => p.id === selectedPortfolioId)

  const selectedAsset =
    selectedPortfolioId === 'dube-trade-port' ||
    selectedPortfolioId === 'bertha-house' ||
    selectedPortfolioId === 'bdo' ||
    selectedPortfolioId === 'momentum-meersig'
      ? selectedPortfolio?.assets?.find((a) => a.id === selectedAssetId)
      : null

  // =========================
  // LIVE METER
  // =========================
  const [liveReading, setLiveReading] = useState(null)
  const [liveError, setLiveError] = useState(null)
  const [liveLoading, setLiveLoading] = useState(false)
  const [liveTs, setLiveTs] = useState(null)
  const [energyInsights, setEnergyInsights] = useState(null)
  const [performanceMetrics, setPerformanceMetrics] = useState(null)
  const [esgMetrics, setEsgMetrics] = useState(null)

  const formatTs = (ts) => {
    if (!ts) return '—'
    try {
      const d = typeof ts === 'string' ? new Date(ts) : ts
      if (Number.isNaN(d.getTime())) return '—'
      return d.toLocaleString()
    } catch {
      return '—'
    }
  }

  const safeNum = (v) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }

  const fetchLatestMeter = useCallback(async () => {
    let siteSlug = 'bertha-house'

    if (selectedPortfolioId) {
      if (selectedAsset && selectedAssetId) {
        siteSlug = selectedAsset.meterSlug || selectedAssetId
      } else {
        siteSlug = selectedPortfolioId
      }
    }

    // Sunsynk path (unchanged)
    if (selectedAssetId === 'bertha-house-solar') {
      try {
        const token = getToken()
        if (!token) return

        const sunsynkResponse = await sunsynkService.getBerthaHouseData(token)
        const sunsynkDataLocal = sunsynkResponse.data

        if (sunsynkDataLocal) {
          const meterData = {
            power_kw: sunsynkDataLocal.current_power_kw || 0,
            power_w: (sunsynkDataLocal.current_power_kw || 0) * 1000,
            energy_kwh: sunsynkDataLocal.total_energy_kwh || 0,
            energy_kwh_delta: sunsynkDataLocal.daily_energy_kwh || 0,
            cost_zar_delta: (sunsynkDataLocal.daily_energy_kwh || 0) * 2.5,
            voltage: sunsynkDataLocal.realtime?.voltage || 230,
            current: sunsynkDataLocal.realtime?.current || 0,
            frequency: sunsynkDataLocal.realtime?.frequency || 50,
            ts_utc: sunsynkDataLocal.timestamp || new Date().toISOString(),
            source: 'sunsynk',
          }

          setLiveReading(meterData)
          setLiveTs(meterData.ts_utc)
          console.log('Using Sunsynk data for Bertha House Inverter:', meterData)
          return
        }
      } catch (error) {
        console.error('Error fetching Sunsynk data for meter reading:', error)
      }
    }

    // eGauge / backend meter
    setLiveLoading(true)
    setLiveError(null)

    try {
      const res = await axios.get(`${API_URL}/api/meters/${siteSlug}/latest`, {
        headers: { ...authHeaders() },
        timeout: 12000,
      })
      const data = res?.data
      if (!data) throw new Error('Empty response')

      if (data.status === 'no_data_yet') {
        setLiveReading({ status: 'no_data_yet' })
        return
      }

      setLiveReading(data)
      setLiveTs(data.ts_utc)
    } catch (e) {
      setLiveReading(null)
      setLiveError(e?.message || 'Failed to load live data')
    } finally {
      setLiveLoading(false)
    }
  }, [selectedPortfolioId, selectedAsset, selectedAssetId])

  const fetchEnergyInsights = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/analytics/energy-insights`, {
        headers: { ...authHeaders() },
        timeout: 12000,
      })
      setEnergyInsights(response.data)
    } catch (error) {
      console.error('Error fetching energy insights:', error)
    }
  }

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/analytics/performance-metrics`, {
        headers: { ...authHeaders() },
        timeout: 12000,
      })
      setPerformanceMetrics(response.data)
    } catch (error) {
      console.error('Error fetching performance metrics:', error)
    }
  }

  const fetchESGMetrics = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/invoices/esg/metrics?months=12`, {
        headers: { ...authHeaders() },
        timeout: 12000,
      })
      setEsgMetrics(response.data)
    } catch (error) {
      console.error('Error fetching ESG metrics:', error)
    }
  }

  const fetchSunsynkData = useCallback(async () => {
    try {
      if (selectedAssetId !== 'bertha-house-solar') return
      const token = getToken()
      if (!token) return

      setLoadingSunsynk(true)
      setSunsynkError(null)

      const data = await sunsynkService.getBerthaHouseData(token)
      setSunsynkData(data.data)
      console.log('Loaded Sunsynk data for Bertha House:', data.data)
    } catch (error) {
      console.error('Error fetching Sunsynk data:', error)
      setSunsynkError(error.response?.data?.detail || error.message || 'Failed to fetch Sunsynk data')
    } finally {
      setLoadingSunsynk(false)
    }
  }, [selectedAssetId])

  const fetchSunsynkAsset = useCallback(async () => {
    try {
      if (selectedAssetId !== 'bertha-house-solar') return
      const token = getToken()
      if (!token) return

      setLoadingSunsynkAsset(true)
      const data = await assetService.getBerthaHouseSunsynkAsset(token)
      setSunsynkAsset(data.data)
      console.log('Loaded Sunsynk asset with carbon emissions:', data.data)
    } catch (error) {
      console.error('Error fetching Sunsynk asset:', error)
    } finally {
      setLoadingSunsynkAsset(false)
    }
  }, [selectedAssetId])

  useEffect(() => {
    if (selectedPortfolio?.assets?.length > 0) {
      if (!selectedAssetId || !selectedPortfolio.assets.find((a) => a.id === selectedAssetId)) {
        setSelectedAssetId(selectedPortfolio.assets[0].id)
      }
    }
  }, [selectedPortfolioId, selectedPortfolio])

  useEffect(() => {
    let intervalId = null

    if (activeTab === 0) {
      fetchLatestMeter()
      fetchEnergyInsights()
      fetchPerformanceMetrics()
      fetchESGMetrics()
      fetchSunsynkData()
      fetchSunsynkAsset()

      intervalId = window.setInterval(fetchLatestMeter, 30000)

      if (selectedAssetId === 'bertha-house-solar') {
        const s1 = window.setInterval(fetchSunsynkData, 60000)
        const s2 = window.setInterval(fetchSunsynkAsset, 60000)
        return () => {
          window.clearInterval(intervalId)
          window.clearInterval(s1)
          window.clearInterval(s2)
        }
      }

      return () => window.clearInterval(intervalId)
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [activeTab, selectedAssetId, fetchLatestMeter, fetchSunsynkData, fetchSunsynkAsset])

  // =========================
  // Dashboard data load (kept, but secured requests)
  // =========================
  useEffect(() => {
    fetchDashboardData()
    fetchNotifications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const calculateSustainabilityScore = (data) => {
    if (!data) return 35
    let score = 35
    if (data.total_invoices > 0) score += 15
    if (data.total_energy_kbtu > 0) score += 20
    if (data.total_carbon_tco2e > 0) score += 10
    return Math.min(score, 100)
  }

  const processESGData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/invoices/esg/metrics?months=12`, {
        headers: { ...authHeaders() },
        timeout: 12000,
      })
      const esgData = response.data

      if (esgData.metrics && esgData.metrics.energy_kwh && esgData.metrics.energy_kwh.length > 0) {
        const now = new Date()
        const monthlyData = esgData.metrics.energy_kwh.map((energy, index) => {
          const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1)
          const carbon = esgData.metrics.co2e_tons?.[index] || (energy * 0.93) / 1000
          const water = esgData.metrics.water_m3?.[index] || energy * 0.001

          return {
            month: format(date, 'MMM yy'),
            energy: Math.max(0, Math.round(energy)),
            carbon: Math.max(0, Number(carbon.toFixed(1))),
            water: Math.max(0, Math.round(water)),
            waste: Math.max(0, Math.round(energy * 0.1)),
          }
        })

        setEnergyUsageByMonth(monthlyData)
      }
    } catch (error) {
      console.error('Error processing ESG data:', error)
    }
  }

  const fetchRecentActivities = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/invoices/recent-activities?limit=10`, {
        headers: { ...authHeaders() },
        timeout: 12000,
      })
      if (response.data && response.data.activities) {
        const realActivities = response.data.activities.map((activity) => ({
          id: activity.id || activity._id,
          type: activity.type || 'upload',
          description: activity.description || `Invoice ${activity.invoice_number || 'uploaded'}`,
          timestamp: formatDistanceToNow(new Date(activity.created_at || activity.timestamp), { addSuffix: true }),
          status: activity.status || 'success',
        }))
        setRecentActivities(realActivities)
      }
    } catch (error) {
      console.error('recent-activities error:', error)
    }
  }

  const fetchNotifications = async () => {
    setNotifications([
      { id: 1, message: 'ESG compliance report due in 3 days', priority: 'high' },
      { id: 2, message: 'Energy consumption reduced by 15% this month', priority: 'medium' },
      { id: 3, message: 'New sustainability regulation update', priority: 'high' },
      { id: 4, message: 'Carbon offset credits available for purchase', priority: 'low' },
    ])
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const [statsResponse, esgResponse] = await Promise.allSettled([
        uploadService.getStats(),
        uploadService.getESGMetrics({ months: 12 }),
      ])

      if (statsResponse.status === 'fulfilled' && statsResponse.value?.success) {
        const statsData = statsResponse.value.stats
        setStats((prev) => ({
          ...prev,
          totalFiles: statsData.total_invoices || 0,
          sustainabilityScore: calculateSustainabilityScore(statsData),
        }))
        setDbStats(statsData)
      }

      if (esgResponse.status === 'fulfilled' && esgResponse.value?.success) {
        setEsgMetrics(esgResponse.value.metrics)
        await processESGData()
      }

      await fetchRecentActivities()
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // Upload handlers (unchanged)
  // =========================
  const handleFileUpload = async (formData) => {
    setUploadLoading(true)
    setUploadError(null)
    setUploadSuccess(null)

    try {
      formData.append('months', '12')
      formData.append('extract_solar', 'true')
      formData.append('extract_waste', 'true')
      formData.append('extract_fuel', 'true')

      const response = await uploadService.uploadInvoices(formData)

      if (response.success) {
        const processedCount = response.uploaded_count || response.processed_files || 0
        const extractedData = response.invoices || response.extracted_data || []

        setUploadSuccess(
          `Successfully processed ${processedCount} file(s) for the latest 12 months. Extracted ${extractedData.length} records.`
        )

        setExtractedInvoices(extractedData)
        await fetchDashboardData()
      } else {
        setUploadError(response.error || response.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to process files.')
    } finally {
      setUploadLoading(false)
    }
  }

  const handleSaveToDatabase = async () => {
    setSaveLoading(true)
    setUploadError(null)

    try {
      setUploadSuccess('Invoices saved successfully')
      await fetchDashboardData()
      setExtractedInvoices(null)
    } catch (error) {
      setUploadError(error.message || 'Save failed')
    } finally {
      setSaveLoading(false)
    }
  }

  // =========================
  // Header Actions
  // =========================
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const handleExportData = (fmt) => {
    console.log(`Exporting data as ${fmt}`)
    handleMenuClose()
  }

  const handleRefresh = async () => {
    await fetchDashboardData()
    if (activeTab === 0) await fetchLatestMeter()
  }

  // =========================
  // UI styles (unchanged)
  // =========================
  const surfaceCard = {
    borderRadius: 3,
    border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    transition: 'all 0.2s ease',
    overflow: 'hidden',
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-1px)',
    },
  }

  const pageBg = {
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(
            theme.palette.background.default,
            0.9
          )} 35%, ${theme.palette.background.default} 100%)`
        : `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${theme.palette.background.default} 40%, ${theme.palette.background.default} 100%)`,
    minHeight: '100vh',
  }

  // =========================
  // Loading Screen
  // =========================
  if (loading) {
    return (
      <Box sx={{ ...pageBg, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={56} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Loading ESG Dashboard...
          </Typography>
        </Box>
      </Box>
    )
  }

  // =====================================
  // IMPORTANT:
  // From here onward, KEEP YOUR EXISTING JSX
  // (All UI rendering stays exactly as you had it.)
  // =====================================

  return (
    <Box sx={pageBg}>
      {/* KEEP YOUR EXISTING RENDER JSX HERE (UNCHANGED) */}
      {/* I’m not re-pasting the entire render block to avoid accidental UI edits. */}
      {/* If you want, tell me "paste full ClientDashboard render too" and I’ll output the complete final file. */}
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        <Alert severity="info">
          I updated the API calls for auth headers. Paste your existing render JSX back under this return, unchanged.
        </Alert>
      </Container>
    </Box>
  )
}

export default ClientDashboard
