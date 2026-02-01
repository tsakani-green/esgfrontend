import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
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
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  DateRange as DateRangeIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
} from '@mui/icons-material'

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: 1,
            p: 1,
            color: 'white',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const ClientReports = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      name: 'Q1 Financial Analysis',
      type: 'Financial',
      generatedDate: '2024-01-20',
      status: 'completed',
      size: '2.4 MB',
      format: 'PDF',
    },
    {
      id: 2,
      name: 'Sales Performance Report',
      type: 'Sales',
      generatedDate: '2024-01-18',
      status: 'completed',
      size: '1.8 MB',
      format: 'Excel',
    },
    {
      id: 3,
      name: 'Customer Insights Dashboard',
      type: 'Analytics',
      generatedDate: '2024-01-15',
      status: 'processing',
      size: '-',
      format: 'Interactive',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [stats, setStats] = useState({
    totalReports: 0,
    completedReports: 0,
    processingReports: 0,
  })

  useEffect(() => {
    setStats({
      totalReports: reports.length,
      completedReports: reports.filter(r => r.status === 'completed').length,
      processingReports: reports.filter(r => r.status === 'processing').length,
    })
  }, [reports])

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || report.type === filterType
    return matchesSearch && matchesType
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'processing':
        return 'warning'
      case 'failed':
        return 'error'
      default:
        return 'default'
    }
  }

  const handleDownload = (reportId) => {
    console.log('Downloading report:', reportId)
  }

  const handleView = (reportId) => {
    console.log('Viewing report:', reportId)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          My Reports
        </Typography>
        <Button
          variant="contained"
          startIcon={<AssessmentIcon />}
          href="/generate-report"
        >
          Generate New Report
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Reports"
            value={stats.totalReports}
            icon={<AssessmentIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Completed"
            value={stats.completedReports}
            icon={<TrendingUpIcon />}
            color="#388e3c"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Processing"
            value={stats.processingReports}
            icon={<PieChartIcon />}
            color="#f57c00"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Filter by Type"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="Financial">Financial</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="Analytics">Analytics</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DateRangeIcon />}
            >
              Date Range
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Reports Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Report Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Generated Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Format</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.generatedDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={report.status}
                      color={getStatusColor(report.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{report.size}</TableCell>
                  <TableCell>{report.format}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleView(report.id)}
                      color="primary"
                      size="small"
                      disabled={report.status !== 'completed'}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDownload(report.id)}
                      color="success"
                      size="small"
                      disabled={report.status !== 'completed'}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {filteredReports.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <Typography variant="h6" color="textSecondary">
            {searchTerm || filterType ? 'No reports found matching your criteria.' : 'No reports generated yet.'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AssessmentIcon />}
            sx={{ mt: 2 }}
            href="/generate-report"
          >
            Generate Your First Report
          </Button>
        </Paper>
      )}
    </Container>
  )
}

export default ClientReports
