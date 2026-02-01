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
  TrendingUp,
  TrendingDown,
  Assessment,
  Nature,
  People,
  Business,
  EmojiEvents,
  Warning,
  CheckCircle,
  Refresh,
  Download,
  Share,
  Timeline,
  PieChart,
  BarChart,
  Lightbulb,
  Public,
  HealthAndSafety,
  VolunteerActivism,
  School,
  Security,
  Gavel,
  Balance,
  AccountBalance,
  Groups,
  WorkspacePremium,
  Speed,
  Insights,
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const ESGReport = () => {
  const theme = useTheme()
  const [tabValue, setTabValue] = useState(0)
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading ESG data
    setTimeout(() => {
      setReportData({
        overallScore: 78,
        environmentalScore: 82,
        socialScore: 75,
        governanceScore: 77,
        trendData: [
          { month: 'Jan', environmental: 75, social: 70, governance: 72, overall: 72 },
          { month: 'Feb', environmental: 77, social: 72, governance: 74, overall: 74 },
          { month: 'Mar', environmental: 79, social: 73, governance: 75, overall: 76 },
          { month: 'Apr', environmental: 80, social: 74, governance: 76, overall: 77 },
          { month: 'May', environmental: 81, social: 74, governance: 77, overall: 77 },
          { month: 'Jun', environmental: 82, social: 75, governance: 77, overall: 78 },
        ],
        categoryBreakdown: [
          { name: 'Climate Action', value: 25, color: '#10B981' },
          { name: 'Resource Management', value: 20, color: '#059669' },
          { name: 'Employee Welfare', value: 18, color: '#3B82F6' },
          { name: 'Community Impact', value: 15, color: '#8B5CF6' },
          { name: 'Ethical Governance', value: 12, color: '#F59E0B' },
          { name: 'Financial Responsibility', value: 10, color: '#EF4444' },
        ],
        keyMetrics: [
          { metric: 'Carbon Emissions', value: '2.4 tons', change: -12, status: 'improving' },
          { metric: 'Water Usage', value: '1.2M L', change: -8, status: 'improving' },
          { metric: 'Employee Satisfaction', value: '87%', change: 5, status: 'improving' },
          { metric: 'Board Diversity', value: '42%', change: 15, status: 'improving' },
          { metric: 'Community Investment', value: '$2.5M', change: 22, status: 'improving' },
          { metric: 'Safety Incidents', value: '3', change: -40, status: 'improving' },
        ],
        initiatives: [
          {
            title: 'Carbon Neutral Operations',
            description: 'Achieved carbon neutrality through renewable energy and offset programs',
            impact: 'High',
            status: 'completed',
            progress: 100,
          },
          {
            title: 'Diversity & Inclusion Program',
            description: 'Enhanced workplace diversity with targeted hiring and inclusion initiatives',
            impact: 'High',
            status: 'in-progress',
            progress: 75,
          },
          {
            title: 'Sustainable Supply Chain',
            description: 'Implementing sustainable sourcing practices across all suppliers',
            impact: 'Medium',
            status: 'in-progress',
            progress: 60,
          },
          {
            title: 'Community Education Initiative',
            description: 'Educational programs supporting local community development',
            impact: 'Medium',
            status: 'completed',
            progress: 100,
          },
        ],
        recommendations: [
          {
            category: 'Environmental',
            priority: 'High',
            title: 'Enhance Water Conservation',
            description: 'Implement advanced water recycling systems to reduce consumption by 20%',
            timeline: '6-12 months',
            impact: 'Reduce operational costs and environmental footprint',
          },
          {
            category: 'Social',
            priority: 'Medium',
            title: 'Expand Employee Training',
            description: 'Develop comprehensive ESG training programs for all staff levels',
            timeline: '3-6 months',
            impact: 'Improve engagement and ESG awareness',
          },
          {
            category: 'Governance',
            priority: 'High',
            title: 'Strengthen Board Oversight',
            description: 'Establish dedicated ESG committee with quarterly reporting mechanisms',
            timeline: '3 months',
            impact: 'Enhance accountability and strategic alignment',
          },
        ],
      })
      setLoading(false)
    }, 1500)
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'improving':
        return <TrendingUp sx={{ fontSize: 16, color: '#10B981' }} />
      case 'declining':
        return <TrendingDown sx={{ fontSize: 16, color: '#EF4444' }} />
      default:
        return <TrendingUp sx={{ fontSize: 16, color: '#6B7280' }} />
    }
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ width: '100%', mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            ESG Performance Report
          </Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          ESG Performance Report
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Comprehensive Environmental, Social & Governance Analysis
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
          <Button variant="outlined" startIcon={<Download />}>
            Download PDF
          </Button>
          <Button variant="outlined" startIcon={<Share />}>
            Share Report
          </Button>
          <IconButton color="primary">
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Key Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'success.main', width: 56, height: 56 }}>
                <Assessment sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="h2" sx={{ fontWeight: 700, color: 'success.main' }}>
                {reportData.overallScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overall ESG Score
              </Typography>
              <LinearProgress
                variant="determinate"
                value={reportData.overallScore}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'info.main', width: 56, height: 56 }}>
                <Nature sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {reportData.environmentalScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Environmental
              </Typography>
              <LinearProgress
                variant="determinate"
                value={reportData.environmentalScore}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
                color="info"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
                <People sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {reportData.socialScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Social
              </Typography>
              <LinearProgress
                variant="determinate"
                value={reportData.socialScore}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
                color="primary"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'warning.main', width: 56, height: 56 }}>
                <Business sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {reportData.governanceScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Governance
              </Typography>
              <LinearProgress
                variant="determinate"
                value={reportData.governanceScore}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
                color="warning"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Performance Trends" icon={<Timeline />} />
          <Tab label="Key Metrics" icon={<BarChart />} />
          <Tab label="Category Breakdown" icon={<PieChart />} />
          <Tab label="Initiatives" icon={<Lightbulb />} />
          <Tab label="Recommendations" icon={<Insights />} />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  ESG Performance Trends (6 Months)
                </Typography>
                <Box sx={{ height: 400, width: '100%', minHeight: 400 }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={400}>
                    <LineChart data={reportData.trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="environmental"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: '#10B981', r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="social"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="governance"
                        stroke="#F59E0B"
                        strokeWidth={3}
                        dot={{ fill: '#F59E0B', r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="overall"
                        stroke="#8B5CF6"
                        strokeWidth={4}
                        dot={{ fill: '#8B5CF6', r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Key Performance Metrics
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell align="right">Current Value</TableCell>
                        <TableCell align="right">Change</TableCell>
                        <TableCell align="right">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.keyMetrics.map((metric, index) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getStatusIcon(metric.status)}
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {metric.metric}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {metric.value}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
                              color={metric.change > 0 ? 'success' : 'warning'}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={metric.status}
                              color={metric.status === 'improving' ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}

          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  ESG Category Distribution
                </Typography>
                <Box sx={{ height: 300, width: '100%', minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                    <RechartsPieChart>
                      <Pie
                        data={reportData.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Category Breakdown
                </Typography>
                <List>
                  {reportData.categoryBreakdown.map((category, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: category.color }}>
                          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'white' }} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={category.name}
                        secondary={`${category.value}% of total score`}
                      />
                      <Typography variant="h6" sx={{ color: category.color }}>
                        {category.value}%
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}

          {tabValue === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  ESG Initiatives & Projects
                </Typography>
                {reportData.initiatives.map((initiative, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {initiative.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {initiative.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Chip
                              label={initiative.impact}
                              color={initiative.impact === 'High' ? 'error' : 'warning'}
                              size="small"
                            />
                            <Chip
                              label={initiative.status}
                              color={initiative.status === 'completed' ? 'success' : 'info'}
                              size="small"
                            />
                          </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: initiative.status === 'completed' ? 'success.main' : 'info.main' }}>
                          {initiative.status === 'completed' ? <CheckCircle /> : <Speed />}
                        </Avatar>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={initiative.progress}
                        sx={{ height: 8, borderRadius: 4 }}
                        color={initiative.status === 'completed' ? 'success' : 'info'}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {initiative.progress}% Complete
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </Grid>
          )}

          {tabValue === 4 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Strategic Recommendations
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Based on current ESG performance, here are prioritized recommendations to enhance your sustainability impact.
                  </Typography>
                </Alert>
                {reportData.recommendations.map((rec, index) => (
                  <Card key={index} sx={{ mb: 2, border: `1px solid ${alpha(rec.priority === 'High' ? theme.palette.error.main : theme.palette.warning.main, 0.3)}` }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip
                              label={rec.priority}
                              color={rec.priority === 'High' ? 'error' : 'warning'}
                              size="small"
                            />
                            <Chip
                              label={rec.category}
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                          <Typography variant="h6" gutterBottom>
                            {rec.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {rec.description}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Expected Impact: {rec.impact}
                          </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: rec.priority === 'High' ? 'error.main' : 'warning.main' }}>
                          <Lightbulb />
                        </Avatar>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Timeline: {rec.timeline}
                        </Typography>
                        <Button variant="outlined" size="small">
                          Learn More
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>

      {/* Summary */}
      <Alert
        severity="success"
        sx={{ mb: 4 }}
        icon={<EmojiEvents />}
      >
        <Typography variant="h6" gutterBottom>
          Excellent ESG Performance
        </Typography>
        <Typography variant="body2">
          Your organization has achieved a strong ESG score of {reportData.overallScore}/100, demonstrating commitment to sustainability across all three pillars. Continue focusing on the identified recommendations to further enhance your impact.
        </Typography>
      </Alert>
    </Container>
  )
}

export default ESGReport
