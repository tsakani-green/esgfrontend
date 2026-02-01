import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Grid, Paper, Box, Typography, Divider, Chip, Alert, CircularProgress, Button } from '@mui/material';
import { Timeline, Assessment, Refresh, SmartToy } from '@mui/icons-material';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

import { API_BASE as API_URL } from '../../api/http.js';
const COLORS = ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00acc1'];

export default function AnalyticsTab({ surfaceCard, energyUsageByMonth = [], esgPerformance = [], searchQuery = '' }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [carbonData, setCarbonData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [anomaliesData, setAnomaliesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchAnalytics = async () => {
    try {
      setError(null);
      
      // Fetch all analytics data in parallel
      const [energyRes, carbonRes, performanceRes, anomaliesRes] = await Promise.all([
        axios.get(`${API_URL}/api/analytics/energy-insights`),
        axios.get(`${API_URL}/api/analytics/carbon-analysis`),
        axios.get(`${API_URL}/api/analytics/performance-metrics`),
        axios.get(`${API_URL}/api/analytics/anomaly-detection`)
      ]);

      setAnalyticsData(energyRes.data);
      setCarbonData(carbonRes.data);
      setPerformanceData(performanceRes.data);
      setAnomaliesData(anomaliesRes.data);
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.detail || 'Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }
  return (
    <Grid container spacing={2.5}>
      {/* Auto-refresh indicator */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              size="small" 
              icon={<SmartToy fontSize="small" />} 
              label="Auto-refresh every 30s" 
              variant="outlined" 
              color="primary"
            />
            <Button 
              size="small" 
              startIcon={<Refresh />} 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Box>
        </Box>
      </Grid>

      {/* AI Insights Summary */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ ...surfaceCard, p: 3, height: '100%' }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Energy Insights
          </Typography>
          {analyticsData?.insights && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {analyticsData.insights.summary}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Key Trends:</Typography>
              {analyticsData.insights.trends?.map((trend, i) => (
                <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • {trend}
                </Typography>
              ))}
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Performance Metrics */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ ...surfaceCard, p: 3, height: '100%' }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Live Performance
          </Typography>
          {performanceData?.metrics && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Current Power:</Typography>
                <Typography variant="h5" fontWeight={600}>
                  {performanceData.metrics.current_performance.power_kw} kW
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Efficiency Score:</Typography>
                <Typography variant="h6" fontWeight={600}>
                  {performanceData.metrics.current_performance.efficiency_score}%
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Status:</Typography>
              <Chip 
                size="small" 
                label={performanceData.metrics.current_performance.performance_level}
                color={performanceData.metrics.current_performance.performance_level === 'optimal' ? 'success' : 'warning'}
              />
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Carbon Analysis */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ ...surfaceCard, p: 3, height: '100%' }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Carbon Footprint
          </Typography>
          {carbonData?.analysis && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Total Emissions:</Typography>
                <Typography variant="h6" fontWeight={600}>
                  {carbonData.analysis.total_carbon_tco2e} tCO₂e
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Carbon Intensity:</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {carbonData.analysis.carbon_intensity}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Compliance:</Typography>
              <Chip 
                size="small" 
                label={carbonData.analysis.compliance_status}
                color={carbonData.analysis.compliance_status === 'on_track' ? 'success' : 'warning'}
              />
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Energy Consumption Chart */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ ...surfaceCard, p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment />
              <Typography variant="subtitle1" fontWeight={600}>Energy Consumption Trends</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Latest 12 months
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={energyUsageByMonth}
                margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="month" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 11 }}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value.toLocaleString()} kWh`, 
                    'Energy Consumption'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#1976d2" 
                  fill="#1976d2" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                {energyUsageByMonth.some(d => d.carbon > 0) && (
                  <Area 
                    type="monotone" 
                    dataKey="carbon" 
                    stroke="#f44336" 
                    fill="#f44336" 
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                )}
                {energyUsageByMonth.some(d => d.water > 0) && (
                  <Area 
                    type="monotone" 
                    dataKey="water" 
                    stroke="#00acc1" 
                    fill="#00acc1" 
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Chip size="small" label="Energy" sx={{ bgcolor: '#1976d2', color: 'white' }} />
            {energyUsageByMonth.some(d => d.carbon > 0) && (
              <Chip size="small" label="Carbon" sx={{ bgcolor: '#f44336', color: 'white' }} />
            )}
            {energyUsageByMonth.some(d => d.water > 0) && (
              <Chip size="small" label="Water" sx={{ bgcolor: '#00acc1', color: 'white' }} />
            )}
          </Box>
        </Paper>
      </Grid>

      {/* Anomalies & Recommendations */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ ...surfaceCard, p: 3, height: '100%' }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Anomalies & Recommendations
          </Typography>
          
          {anomaliesData?.anomalies && anomaliesData.anomalies.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Detected Anomalies ({anomaliesData.anomalies.length}):
              </Typography>
              {anomaliesData.anomalies.slice(0, 3).map((anomaly, i) => (
                <Alert key={i} severity={anomaly.severity === 'high' ? 'error' : 'warning'} sx={{ mb: 1 }}>
                  <Typography variant="caption">
                    {anomaly.type === 'spike' ? '⬆️' : '⬇️'} {anomaly.power_kw} kW at {new Date(anomaly.timestamp).toLocaleTimeString()}
                  </Typography>
                </Alert>
              ))}
            </Box>
          )}

          {analyticsData?.insights?.recommendations && (
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                AI Recommendations:
              </Typography>
              {analyticsData.insights.recommendations.slice(0, 3).map((rec, i) => (
                <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • {rec}
                </Typography>
              ))}
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Cost & Savings Opportunities */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ ...surfaceCard, p: 3, height: '100%' }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Cost & Savings Analysis
          </Typography>
          {analyticsData?.insights && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Monthly Cost Savings Potential:</Typography>
                <Typography variant="h6" fontWeight={600} color="success.main">
                  {analyticsData.insights.cost_savings_potential}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Carbon Reduction Potential:</Typography>
                <Typography variant="h6" fontWeight={600} color="info.main">
                  {analyticsData.insights.carbon_reduction_potential}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Opportunities:</Typography>
              {analyticsData.insights.opportunities?.map((opp, i) => (
                <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • {opp}
                </Typography>
              ))}
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Efficiency Metrics */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ ...surfaceCard, p: 3, height: '100%' }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Efficiency Metrics
          </Typography>
          {analyticsData?.insights && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">Overall Efficiency Score:</Typography>
                <Typography variant="h4" fontWeight={600}>
                  {analyticsData.insights.efficiency_score}%
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Risk Factors:</Typography>
              {analyticsData.insights.risks?.map((risk, i) => (
                <Alert key={i} severity="warning" sx={{ mb: 1 }}>
                  <Typography variant="caption">{risk}</Typography>
                </Alert>
              ))}
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
