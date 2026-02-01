import React, { useMemo } from 'react';
import { Paper, Box, Typography, Divider, Stack, Chip, LinearProgress } from '@mui/material';
import { CheckCircleOutline, Warning } from '@mui/icons-material';

export default function DataQualityCard({ surfaceCard, dbStats }) {
  const quality = useMemo(() => {
    const invoices = Number(dbStats?.total_invoices || 0);
    const energy = Number(dbStats?.total_energy_kbtu || 0);
    const carbon = Number(dbStats?.total_carbon_tco2e || 0);

    const coverage = Math.min(100, 30 + Math.round(invoices * 3));
    const confidence = Math.min(100, 40 + (energy > 0 ? 30 : 0) + (carbon > 0 ? 20 : 0));
    const gaps = Math.max(0, 100 - coverage);

    return { coverage, confidence, gaps };
  }, [dbStats]);

  const status = quality.coverage >= 70 ? 'Good' : quality.coverage >= 50 ? 'Medium' : 'Low';
  const statusColor = status === 'Good' ? 'success' : status === 'Medium' ? 'warning' : 'error';

  return (
    <Paper sx={{ ...surfaceCard, p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Data Quality</Typography>
        <Chip
          size="small"
          color={statusColor}
          icon={status === 'Good' ? <CheckCircleOutline fontSize="small" /> : <Warning fontSize="small" />}
          label={`Status: ${status}`}
          variant="outlined"
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Quick view of coverage, gaps and confidence for client reporting.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2}>
        <MetricRow 
          label="Coverage" 
          value={`${quality.coverage}%`} 
          progress={quality.coverage}
        />
        <MetricRow 
          label="Confidence" 
          value={`${quality.confidence}%`} 
          progress={quality.confidence}
        />
        <MetricRow 
          label="Estimated gaps" 
          value={`${quality.gaps}%`} 
          progress={100 - quality.gaps}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">Invoices processed</Typography>
          <Typography variant="body1" fontWeight={600}>
            {Number(dbStats?.total_invoices || 0)}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function MetricRow({ label, value, progress }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="body2" fontWeight={600}>{value}</Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 6, 
          borderRadius: 1,
        }} 
      />
    </Box>
  );
}
