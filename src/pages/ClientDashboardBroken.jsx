import React, { useState, useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material'
import {
  CloudUpload,
  Description,
  Assessment,
  TrendingUp,
  Folder,
  BarChart,
  SmartToy,
  Visibility,
  Refresh,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const ClientDashboard = () => {
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalReports: 0,
    esgScore: 0,
    recentUploads: [],
    invoices: [],
    totalInvoices: 0,
    categoryData: [
      { name: 'Environmental', value: 0, color: '#4CAF50' },
      { name: 'Social', value: 0, color: '#2196F3' },
      { name: 'Governance', value: 0, color: '#9C27B0' },
    ]
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Fetch user's invoices from the database
      const invoicesResponse = await axios.get(`${API_URL}/api/files/my-invoices`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const invoices = invoicesResponse.data.invoices || []
      
      // Calculate stats from actual invoice data
      const totalInvoices = invoices.length
      const averageESGScore = invoices.length > 0 
        ? Math.round(invoices.reduce((sum, inv) => sum + (inv.esg_total_score || 0), 0) / invoices.length)
        : 0
      
      // Calculate ESG category distribution
      const categoryCount = { environmental: 0, social: 0, governance: 0 }
      invoices.forEach(inv => {
        if (inv.esg_insights && inv.esg_insights.insights) {
          // This is a simplified categorization - in real implementation, you'd categorize based on items
          const description = inv.items && inv.items[0] ? inv.items[0].description || '' : ''
          if (description.toLowerCase().includes('energy') || description.toLowerCase().includes('solar')) {
            categoryCount.environmental++
          } else if (description.toLowerCase().includes('training') || description.toLowerCase().includes('community')) {
            categoryCount.social++
          } else {
            categoryCount.governance++
          }
        }
      })
      
      setStats({
        totalFiles: totalInvoices, // Using invoices as files for now
        totalReports: 5, // Placeholder
        esgScore: averageESGScore,
        recentUploads: invoices.slice(0, 5),
        invoices: invoices,
        totalInvoices: totalInvoices,
        categoryData: [
          { name: 'Environmental', value: categoryCount.environmental, color: '#4CAF50' },
          { name: 'Social', value: categoryCount.social, color: '#2196F3' },
          { name: 'Governance', value: categoryCount.governance, color: '#9C27B0' },
        ]
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Set default data on error
      setStats({
        totalFiles: 0,
        totalReports: 0,
        esgScore: 0,
        recentUploads: [],
        invoices: [],
        totalInvoices: 0,
        categoryData: [
          { name: 'Environmental', value: 0, color: '#4CAF50' },
          { name: 'Social', value: 0, color: '#2196F3' },
          { name: 'Governance', value: 0, color: '#9C27B0' },
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateAverageESGScore = (reports) => {
    if (!reports.length) return 0
    const scores = reports
      .map(r => r.esg_score)
      .filter(score => score !== undefined)
    return scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0
  }

  // Sample data for charts
  const esgTrendData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 68 },
    { month: 'Mar', score: 72 },
    { month: 'Apr', score: 75 },
    { month: 'May', score: 78 },
    { month: 'Jun', score: 82 },
  ]

  const categoryData = [
    { name: 'Environmental', value: 35, color: '#4CAF50' },
    { name: 'Social', value: 30, color: '#2196F3' },
    { name: 'Governance', value: 25, color: '#9C27B0' },
    { name: 'Improvement', value: 10, color: '#FF9800' },
  ]

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-4px)' } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.light`, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {value}
        </Typography>
        {title === 'ESG Score' && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LinearProgress
              variant="determinate"
              value={value}
              sx={{ flexGrow: 1, mr: 2, height: 8, borderRadius: 4 }}
            />
            <Chip
              label={`${value}/100`}
              color={value >= 80 ? 'success' : value >= 60 ? 'warning' : 'error'}
              size="small"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome back! Here's your ESG performance overview.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Files"
            value={stats.totalFiles}
            icon={<Folder />}
            color="primary"
            onClick={() => navigate('/files')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reports"
            value={stats.totalReports}
            icon={<Description />}
            color="secondary"
            onClick={() => navigate('/reports')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="ESG Score"
            value={stats.esgScore}
            icon={<Assessment />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Trend"
            value="+8%"
            icon={<TrendingUp />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              ESG Score Trend
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={esgTrendData}>
    </Box>
  )
}

return (
  <Box>
    <Typography variant="h4" fontWeight="bold" gutterBottom>
      Dashboard Overview
    </Typography>
    <Typography variant="body1" color="text.secondary" paragraph>
      Welcome back! Here's your ESG performance overview.
    </Typography>

    {/* Stats Cards */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Files"
          value={stats.totalFiles}
          icon={<Folder />}
          color="primary"
          onClick={() => navigate('/files')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Reports"
          value={stats.totalReports}
          icon={<Description />}
          color="secondary"
          onClick={() => navigate('/reports')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="ESG Score"
          value={stats.esgScore}
          icon={<Assessment />}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Trend"
          value="+8%"
          icon={<TrendingUp />}
          color="info"
        />
      </Grid>
    </Grid>

    {/* Charts Section */}
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            ESG Score Trend
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={esgTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2E7D32"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            ESG Categories
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={stats.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>

    {/* Recent Invoices Table */}
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Recent Invoices ({stats.totalInvoices})
        </Typography>
        <IconButton onClick={fetchDashboardData} color="primary">
          <Refresh />
        </IconButton>
      </Box>
      
      {stats.invoices.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">ESG Score</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.invoices.slice(0, 10).map((invoice, index) => (
                <TableRow key={invoice.id || index}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {invoice.invoice_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {invoice.vendor_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(invoice.invoice_date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      ${invoice.total_amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={invoice.esg_total_score ? invoice.esg_total_score.toFixed(1) : 'N/A'}
                      color={invoice.esg_total_score >= 7 ? 'success' : invoice.esg_total_score >= 5 ? 'warning' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {invoice.items && invoice.items[0] && (
                      <Chip
                        label={invoice.items[0].esg_category || 'Unknown'}
                        variant="outlined"
                        size="small"
                        color={
                          invoice.items[0].esg_category === 'environmental' ? 'success' :
                          invoice.items[0].esg_category === 'social' ? 'info' : 'secondary'
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No invoices found. Upload some files to see your invoice data here.
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => navigate('/upload')}
            sx={{ mt: 2 }}
          >
            Upload Your First Invoice
          </Button>
        </Box>
      )}
    </Paper>

    {/* Quick Actions */}
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => navigate('/upload')}
            size="large"
          >
            Upload New File
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Description />}
            onClick={() => navigate('/generate-report')}
            size="large"
          >
            Generate Report
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<SmartToy />}
            onClick={() => navigate('/live-ai')}
            size="large"
          >
            Live AI Agent
          </Button>
        </Grid>
      </Grid>
    </Paper>
  </Box>
)

export default ClientDashboard