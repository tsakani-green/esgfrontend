import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Grid,
  Alert,
  Button,
  Tooltip,
  IconButton,
  Fade,
  CircularProgress
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Timeline,
  Assessment,
  Warning,
  Lightbulb,
  Refresh,
  AutoGraph,
  Analytics
} from '@mui/icons-material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { aiAnalyticsService } from '../../services/aiAnalytics'

const AIPredictionsPanel = ({ clientId, portfolioId }) => {
  const [loading, setLoading] = useState(true)
  const [predictions, setPredictions] = useState(null)
  const [risks, setRisks] = useState(null)
  const [carbonForecast, setCarbonForecast] = useState(null)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadAIData()
  }, [clientId, portfolioId])

  const loadAIData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [esgPred, riskAssess, carbonPred] = await Promise.all([
        aiAnalyticsService.predictESGScores(clientId),
        aiAnalyticsService.assessESGRisks(portfolioId),
        aiAnalyticsService.forecastCarbonEmissions(clientId)
      ])

      setPredictions(esgPred)
      setRisks(riskAssess)
      setCarbonForecast(carbonPred)
    } catch (err) {
      setError('Failed to load AI predictions. Please check backend configuration.')
      console.error('AI Data Load Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAIData()
    setRefreshing(false)
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2 }}>Loading AI Predictions...</Typography>
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
          <AutoGraph sx={{ mr: 1, color: 'primary.main' }} />
          AI-Powered Predictions
        </Typography>
        <Tooltip title="Refresh AI Predictions">
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

      <Grid container spacing={2}>
        {/* ESG Score Predictions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  ESG Score Prediction
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current Score: <strong>{predictions?.currentScore || 75}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Predicted (6mo): <strong>{predictions?.predictedScores?.[5]?.score || 81}</strong>
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <Chip
                    icon={predictions?.trend === 'improving' ? <TrendingUp /> : <TrendingDown />}
                    label={predictions?.trend || 'improving'}
                    color={predictions?.trend === 'improving' ? 'success' : 'error'}
                    size="small"
                  />
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    Confidence: {Math.round((predictions?.confidence || 0.8) * 100)}%
                  </Typography>
                </Box>
              </Box>

              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={predictions?.predictedScores || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis domain={[70, 85]} tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4caf50" 
                    strokeWidth={2}
                    dot={{ fill: '#4caf50', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Assessment */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Assessment sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Risk Assessment
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Overall Risk Score: <strong>{risks?.overallRiskScore || 45}/100</strong>
                </Typography>
                
                {risks?.riskCategories && Object.entries(risks.riskCategories).map(([category, data]) => (
                  <Box key={category} mb={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" textTransform="capitalize">
                        {category}
                      </Typography>
                      <Chip
                        label={data.level}
                        color={data.level === 'low' ? 'success' : data.level === 'medium' ? 'warning' : 'error'}
                        size="small"
                        sx={{ fontSize: '0.6rem', height: 18 }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={data.score}
                      color={data.level === 'low' ? 'success' : data.level === 'medium' ? 'warning' : 'error'}
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                  </Box>
                ))}
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>Top Risks:</Typography>
                {risks?.topRisks?.slice(0, 2).map((risk, index) => (
                  <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
                    <Typography variant="caption" fontWeight={600}>
                      {risk.type}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Impact: {risk.impact} | Probability: {Math.round(risk.probability * 100)}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Carbon Footprint Forecast */}
        <Grid item xs={12}>
          <Card sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Timeline sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Carbon Footprint Forecast
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Current Emissions
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="info.main">
                      {carbonForecast?.currentEmissions || 1250.5} tCO₂e
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Reduction Potential: {carbonForecast?.reductionPotential || 15}%
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={carbonForecast?.forecastData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <RechartsTooltip />
                      <Area
                        type="monotone"
                        dataKey="predicted"
                        stroke="#2196f3"
                        fill="#2196f3"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>Optimization Opportunities:</Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {carbonForecast?.optimizationOpportunities?.slice(0, 3).map((opportunity, index) => (
                    <Chip
                      key={index}
                      icon={<Lightbulb />}
                      label={opportunity}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AIPredictionsPanel
