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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Backdrop,
  alpha,
  useTheme,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Tooltip,
  Badge,
} from '@mui/material'
import {
  Assessment,
  Download,
  FilterList,
  Refresh,
  Timeline,
  Security,
  Storage,
  People,
  Business,
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  Info,
  DateRange,
  FileDownload,
  Summarize,
  Analytics,
  AdminPanelSettings,
  Settings,
  ReportProblem,
  Speed,
  Memory,
  DataUsage,
  CloudUpload,
  GetApp,
  Visibility,
  Edit,
  Delete,
  Search,
  Clear,
  CalendarToday,
  Schedule,
  Sync,
  SystemUpdate,
  BugReport,
  HealthAndSafety,
} from '@mui/icons-material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { API_BASE as API_URL } from '../api/http.js'

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const SystemReports = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState({
    systemHealth: {},
    userActivity: [],
    portfolioStats: [],
    securityLogs: [],
    performanceMetrics: {},
    errorLogs: [],
  })
  const [filters, setFilters] = useState({
    dateRange: '7d',
    reportType: 'all',
    severity: 'all',
    status: 'all',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)

  useEffect(() => {
    fetchReportData()
  }, [filters, tabValue])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      // Fetch different data based on active tab
      let endpoint = '/api/admin/reports'
      if (tabValue === 0) endpoint += '/system-health'
      else if (tabValue === 1) endpoint += '/user-activity'
      else if (tabValue === 2) endpoint += '/portfolio-analytics'
      else if (tabValue === 3) endpoint += '/security'
      else if (tabValue === 4) endpoint += '/performance'

      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      })

      // Update the appropriate section of report data
      const dataKey = ['systemHealth', 'userActivity', 'portfolioStats', 'securityLogs', 'performanceMetrics'][tabValue]
      setReportData(prev => ({
        ...prev,
        [dataKey]: response.data || {}
      }))
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = async (format = 'pdf') => {
    try {
      const token = localStorage.getItem('token')
      const reportType = ['system-health', 'user-activity', 'portfolio-analytics', 'security', 'performance'][tabValue]
      
      const response = await axios.get(`${API_URL}/api/admin/reports/export`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          type: reportType,
          format,
          ...filters,
        },
        responseType: 'blob'
      })

      // Download the file
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${reportType}-report.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error exporting report:', error)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error'
      case 'high': return 'warning'
      case 'medium': return 'info'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'success'
      case 'warning': return 'warning'
      case 'error': return 'error'
      case 'offline': return 'default'
      default: return 'info'
    }
  }

  // Mock data for demonstration
  const mockSystemHealth = {
    overall: 'healthy',
    uptime: '99.9%',
    responseTime: '245ms',
    errorRate: '0.1%',
    services: [
      { name: 'API Server', status: 'healthy', uptime: '99.9%', responseTime: '120ms' },
      { name: 'Database', status: 'healthy', uptime: '99.8%', responseTime: '45ms' },
      { name: 'File Storage', status: 'warning', uptime: '98.5%', responseTime: '320ms' },
      { name: 'Email Service', status: 'healthy', uptime: '99.7%', responseTime: '180ms' },
    ],
    resources: {
      cpu: '45%',
      memory: '67%',
      disk: '78%',
      network: '23%',
    }
  }

  const mockUserActivity = [
    { id: 1, user: 'admin', action: 'login', timestamp: '2024-01-29 09:30:00', ip: '192.168.1.100', status: 'success' },
    { id: 2, user: 'dube-user', action: 'portfolio_view', timestamp: '2024-01-29 09:25:00', ip: '192.168.1.101', status: 'success' },
    { id: 3, user: 'bertha-user', action: 'report_download', timestamp: '2024-01-29 09:20:00', ip: '192.168.1.102', status: 'success' },
    { id: 4, user: 'bdo-user', action: 'login_failed', timestamp: '2024-01-29 09:15:00', ip: '192.168.1.103', status: 'failed' },
    { id: 5, user: 'momentum-user', action: 'data_export', timestamp: '2024-01-29 09:10:00', ip: '192.168.1.104', status: 'success' },
  ]

  const mockPortfolioStats = [
    { name: 'Dube Trade Port', assets: 3, value: 2254.67, change: '+5.2%', status: 'active' },
    { name: 'Bertha House', assets: 2, value: 445.50, change: '+2.1%', status: 'active' },
    { name: 'BDO', assets: 1, value: 282.50, change: '+1.8%', status: 'active' },
    { name: 'Momentum Meersig', assets: 1, value: 408.90, change: '+3.4%', status: 'active' },
  ]

  const mockSecurityLogs = [
    { id: 1, type: 'login_attempt', user: 'unknown@malicious.com', ip: '192.168.1.999', severity: 'high', timestamp: '2024-01-29 09:30:00', status: 'blocked' },
    { id: 2, type: 'permission_denied', user: 'dube-user', ip: '192.168.1.101', severity: 'medium', timestamp: '2024-01-29 09:25:00', status: 'logged' },
    { id: 3, type: 'data_access', user: 'admin', ip: '192.168.1.100', severity: 'low', timestamp: '2024-01-29 09:20:00', status: 'allowed' },
    { id: 4, type: 'suspicious_activity', user: 'unknown', ip: '192.168.1.888', severity: 'critical', timestamp: '2024-01-29 09:15:00', status: 'investigating' },
  ]

  const mockPerformanceMetrics = {
    apiResponseTime: { avg: '245ms', min: '120ms', max: '450ms', trend: 'improving' },
    databaseQueries: { avg: '45ms', min: '12ms', max: '120ms', trend: 'stable' },
    fileUploads: { avg: '2.3s', min: '0.8s', max: '5.2s', trend: 'degrading' },
    reportGeneration: { avg: '1.2s', min: '0.5s', max: '3.1s', trend: 'stable' },
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <Assessment sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={900} sx={{ mb: 0.5 }}>
              System Management Reports
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive system analytics and monitoring reports
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchReportData}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => handleExportReport('pdf')}
            sx={{ borderRadius: 2 }}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Date Range</InputLabel>
              <Select
                value={filters.dateRange}
                label="Date Range"
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              >
                <MenuItem value="1d">Last 24 Hours</MenuItem>
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="30d">Last 30 Days</MenuItem>
                <MenuItem value="90d">Last 90 Days</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Type</InputLabel>
              <Select
                value={filters.reportType}
                label="Report Type"
                onChange={(e) => setFilters(prev => ({ ...prev, reportType: e.target.value }))}
              >
                <MenuItem value="all">All Reports</MenuItem>
                <MenuItem value="summary">Summary</MenuItem>
                <MenuItem value="detailed">Detailed</MenuItem>
                <MenuItem value="audit">Audit</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: searchTerm && (
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <Clear />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilters({ dateRange: '7d', reportType: 'all', severity: 'all', status: 'all' })}
              sx={{ height: 40 }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab icon={<HealthAndSafety />} label="System Health" />
            <Tab icon={<People />} label="User Activity" />
            <Tab icon={<Business />} label="Portfolio Analytics" />
            <Tab icon={<Security />} label="Security" />
            <Tab icon={<Speed />} label="Performance" />
          </Tabs>
        </Box>

        {/* System Health Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    System Overview
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={800} color="success.main">
                          {mockSystemHealth.uptime}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          System Uptime
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={800} color="info.main">
                          {mockSystemHealth.responseTime}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg Response
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Resource Usage
                  </Typography>
                  {Object.entries(mockSystemHealth.resources).map(([resource, value]) => (
                    <Box key={resource} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" textTransform="capitalize">
                          {resource.replace('_', ' ')}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {value}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={parseInt(value)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.grey[500], 0.2),
                        }}
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Service Status
                  </Typography>
                  <List>
                    {mockSystemHealth.services.map((service, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Chip
                            icon={service.status === 'healthy' ? <CheckCircle /> : <Warning />}
                            label={service.status}
                            color={getStatusColor(service.status)}
                            size="small"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={service.name}
                          secondary={`Uptime: ${service.uptime} • Response: ${service.responseTime}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* User Activity Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Recent User Activity
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockUserActivity.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {activity.user}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {activity.action.replace('_', ' ')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {activity.timestamp}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {activity.ip}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={activity.status}
                            color={activity.status === 'success' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Portfolio Analytics Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {mockPortfolioStats.map((portfolio, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                      {portfolio.name}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Assets: {portfolio.assets}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Value: {portfolio.value} tCO₂e
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Chip
                        label={portfolio.change}
                        color={portfolio.change.startsWith('+') ? 'success' : 'error'}
                        size="small"
                      />
                      <Chip
                        label={portfolio.status}
                        color="success"
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Security Logs
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockSecurityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Typography variant="body2">
                            {log.type.replace('_', ' ')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {log.user}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {log.ip}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.severity}
                            color={getSeverityColor(log.severity)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {log.timestamp}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.status}
                            color={log.status === 'allowed' ? 'success' : log.status === 'blocked' ? 'error' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Performance Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            {Object.entries(mockPerformanceMetrics).map(([metric, data]) => (
              <Grid item xs={12} sm={6} md={3} key={metric}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                      {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Typography>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h4" fontWeight={800} color="primary.main">
                        {data.avg}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Min: {data.min}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Max: {data.max}
                      </Typography>
                    </Box>
                    <Chip
                      label={data.trend}
                      color={data.trend === 'improving' ? 'success' : data.trend === 'degrading' ? 'error' : 'info'}
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Loading Backdrop */}
      <Backdrop open={loading} sx={{ zIndex: 9999 }}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Container>
  )
}

export default SystemReports
