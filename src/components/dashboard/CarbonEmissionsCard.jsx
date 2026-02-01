import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Forest,
  Co2,
  TrendingUp,
  Info,
} from '@mui/icons-material';
import axios from 'axios';

import { API_BASE as API_URL } from '../../api/http.js';

export default function CarbonEmissionsCard({ surfaceCard }) {
  const theme = useTheme();
  const [carbonData, setCarbonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCarbonData();
    const interval = setInterval(fetchCarbonData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchCarbonData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/meters/bertha-house/latest`);
      setCarbonData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch carbon data');
      console.error('Carbon data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num, decimals = 3) => {
    return num ? num.toFixed(decimals) : '0.000';
  };

  if (loading) {
    return (
      <Card sx={{ ...surfaceCard, height: '100%' }}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading carbon emissions...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ ...surfaceCard, height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Alert severity="warning">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  const carbonTco2e = carbonData?.carbon_emissions_tco2e || 0;
  const carbonKg = carbonData?.carbon_emissions_kg_co2e || 0;
  const carbonRate = carbonData?.carbon_emission_rate_tco2e_per_hour || 0;
  const powerKw = carbonData?.power_kw || 0;
  const health = carbonData?._status?.health || 'unknown';

  return (
    <Card sx={{ ...surfaceCard, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                bgcolor: alpha(theme.palette.success.main, 0.12),
                color: theme.palette.success.main,
                borderRadius: 2,
              }}
            >
              <Co2 />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.1 }}>
                Live Carbon Emissions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bertha House • Formula: kWh × 0.93 ÷ 1000
              </Typography>
            </Box>
          </Box>
          <Chip
            size="small"
            label={health}
            color={health === 'healthy' ? 'success' : health === 'degraded' ? 'warning' : 'error'}
            variant="outlined"
            sx={{ fontWeight: 800 }}
          />
        </Box>

        {/* Main Carbon Display */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h3" fontWeight={900} color="success.main" sx={{ mb: 1 }}>
            {formatNumber(carbonTco2e, 6)}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 0.5 }}>
            tCO₂e (current hour)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatNumber(carbonKg, 3)} kg CO₂e
          </Typography>
        </Box>

        {/* Emission Rate */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={700}>
              Emission Rate
            </Typography>
            <Typography variant="body2" fontWeight={800} color="success.main">
              {formatNumber(carbonRate, 6)} tCO₂e/hour
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min((carbonRate * 1000), 100)} // Scale for visualization
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.success.main, 0.1),
              '& .MuiLinearProgress-bar': {
                bgcolor: theme.palette.success.main,
              },
            }}
          />
        </Box>

        {/* Current Power */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight={700}>
              Current Power
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={800}>
            {formatNumber(powerKw, 3)} kW
          </Typography>
        </Box>

        {/* Formula Info */}
        <Alert
          severity="info"
          icon={<Info fontSize="small" />}
          sx={{ mt: 2 }}
        >
          <Typography variant="caption">
            <strong>Carbon Formula:</strong> tCO₂e = kWh × 0.93 ÷ 1000
            <br />
            <strong>Current Calculation:</strong> {formatNumber(powerKw, 3)} × 0.93 ÷ 1000 = {formatNumber(carbonRate, 6)} tCO₂e/hour
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
}
