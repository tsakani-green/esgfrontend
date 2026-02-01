import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Button,
  Alert,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fade,
  CircularProgress
} from '@mui/material'
import {
  Lightbulb,
  TrendingUp,
  Nature,
  WaterDrop,
  AttachMoney,
  Schedule,
  PriorityHigh,
  CheckCircle,
  Info,
  Refresh,
  Star,
  Timeline,
  Assessment
} from '@mui/icons-material'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts'
import { aiAnalyticsService } from '../../services/aiAnalytics'

const AIRecommendationsPanel = ({ clientId }) => {
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState(null)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedRecommendation, setSelectedRecommendation] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    loadRecommendations()
  }, [clientId])

  const loadRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await aiAnalyticsService.generateSustainabilityRecommendations(clientId)
      setRecommendations(data)
    } catch (err) {
      setError('Failed to load AI recommendations. Please check backend configuration.')
      console.error('Recommendations Load Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadRecommendations()
    setRefreshing(false)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Energy': return <Nature />
      case 'Emissions': return <TrendingUp />
      case 'Water': return <WaterDrop />
      case 'Waste': return <Assessment />
      default: return <Lightbulb />
    }
  }

  const getESGImpactData = () => {
    if (!recommendations?.recommendations) return []
    
    const totalImpact = recommendations.recommendations.reduce((acc, rec) => ({
      environmental: acc.environmental + rec.esgImpact.environmental,
      social: acc.social + rec.esgImpact.social,
      governance: acc.governance + rec.esgImpact.governance
    }), { environmental: 0, social: 0, governance: 0 })

    return [
      { name: 'Environmental', value: totalImpact.environmental, color: '#4caf50' },
      { name: 'Social', value: totalImpact.social, color: '#2196f3' },
      { name: 'Governance', value: totalImpact.governance, color: '#ff9800' }
    ]
  }

  const getROIData = () => {
    if (!recommendations?.recommendations) return []
    
    return recommendations.recommendations.map(rec => ({
      name: rec.title.split(' ').slice(0, 2).join(' '),
      roi: rec.roi,
      savings: parseInt(rec.estimatedSavings.replace(/[^0-9]/g, ''))
    }))
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2 }}>Loading AI Recommendations...</Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600} display="flex" alignItems="center">
          <Lightbulb sx={{ mr: 1, color: 'warning.main' }} />
          AI Sustainability Recommendations
        </Typography>
        <Tooltip title="Refresh Recommendations">
          <IconButton onClick={handleRefresh} disabled={refreshing}>
            <Refresh sx={{ 
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AttachMoney sx={{ mr: 1, fontSize: 30 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {recommendations?.totalPotentialSavings || '$85,000'}
                  </Typography>
                  <Typography variant="body2">
                    Annual Savings Potential
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Star sx={{ mr: 1, fontSize: 30 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {recommendations?.recommendations?.length || 9}
                  </Typography>
                  <Typography variant="body2">
                    AI-Generated Recommendations
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ mr: 1, fontSize: 30 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {Math.round(recommendations?.recommendations?.reduce((acc, rec) => acc + rec.roi, 0) / (recommendations?.recommendations?.length || 1)) || 183}%
                  </Typography>
                  <Typography variant="body2">
                    Average ROI
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Recommendations List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Prioritized Recommendations
              </Typography>
              
              <List>
                {recommendations?.recommendations?.map((rec, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => {
                        setSelectedRecommendation(rec)
                        setDetailsOpen(true)
                      }}
                    >
                      <ListItemIcon>
                        {getCategoryIcon(rec.category)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1" fontWeight={600}>
                              {rec.title}
                            </Typography>
                            <Chip
                              icon={<PriorityHigh />}
                              label={rec.priority}
                              color={getPriorityColor(rec.priority)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {rec.description}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2} mt={1}>
                              <Typography variant="caption" color="success.main">
                                💰 {rec.estimatedSavings}/year
                              </Typography>
                              <Typography variant="caption" color="info.main">
                                ⏱️ {rec.implementationTime}
                              </Typography>
                              <Typography variant="caption" color="warning.main">
                                📈 {rec.roi}% ROI
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Analytics Charts */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {/* ESG Impact Distribution */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    ESG Impact Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={getESGImpactData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {getESGImpactData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
                    {getESGImpactData().map((item, index) => (
                      <Chip
                        key={index}
                        label={`${item.name}: ${item.value}`}
                        size="small"
                        sx={{ backgroundColor: item.color, color: 'white' }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* ROI Comparison */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    ROI & Savings Comparison
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={getROIData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <RechartsTooltip />
                      <Bar dataKey="roi" fill="#8884d8" />
                      <Bar dataKey="savings" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Implementation Roadmap */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Implementation Roadmap
          </Typography>
          <Grid container spacing={2}>
            {recommendations?.implementationRoadmap?.map((phase, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ bgcolor: index === 0 ? 'success.light' : index === 1 ? 'warning.light' : 'info.light' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {phase.phase}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Duration: {phase.duration}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(index + 1) * 33}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption">
                      {phase.items} initiatives planned
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Recommendation Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            {selectedRecommendation && getCategoryIcon(selectedRecommendation.category)}
            <Typography variant="h6" sx={{ ml: 1 }}>
              {selectedRecommendation?.title}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedRecommendation && (
            <Box>
              <Typography variant="body1" paragraph>
                {selectedRecommendation.description}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Financial Impact
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {selectedRecommendation.estimatedSavings}/year
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ROI: {selectedRecommendation.roi}%
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Implementation
                  </Typography>
                  <Typography variant="body2">
                    Time: {selectedRecommendation.implementationTime}
                  </Typography>
                  <Typography variant="body2">
                    Priority: {selectedRecommendation.priority}
                  </Typography>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  ESG Impact Breakdown
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="success.main">
                        {selectedRecommendation.esgImpact.environmental}
                      </Typography>
                      <Typography variant="caption">Environmental</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="info.main">
                        {selectedRecommendation.esgImpact.social}
                      </Typography>
                      <Typography variant="caption">Social</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="warning.main">
                        {selectedRecommendation.esgImpact.governance}
                      </Typography>
                      <Typography variant="caption">Governance</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>
            Close
          </Button>
          <Button variant="contained" color="primary">
            Implement Recommendation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AIRecommendationsPanel
