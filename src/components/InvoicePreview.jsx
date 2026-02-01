import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Collapse,
  IconButton,
  Alert,
  Grid,
  Card,
  CardContent,
  List,
  useTheme,
  alpha,
} from '@mui/material'
import {
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Error,
  Science,
  ElectricalServices,
  WaterDrop,
  Delete,
  LocalShipping,
  WbSunny,
  Co2,
} from '@mui/icons-material'

const InvoicePreview = ({ invoices, onSave, loading, error }) => {
  const theme = useTheme()
  const [expandedRows, setExpandedRows] = useState(new Set())

  const toggleRowExpansion = (index) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedRows(newExpanded)
  }

  const formatNumber = (num, decimals = 2) => {
    if (num === null || num === undefined || isNaN(num)) return '—'
    return Number(num).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  const getMetricIcon = (metric) => {
    const icons = {
      energy: <ElectricalServices />,
      water: <WaterDrop />,
      waste: <Delete />,
      fuel: <LocalShipping />,
      solar: <WbSunny />,
      carbon: <Co2 />,
    }
    return icons[metric] || <Science />
  }

  const getMetricColor = (metric) => {
    const colors = {
      energy: 'success',
      water: 'info',
      waste: 'warning',
      fuel: 'secondary',
      solar: 'warning',
      carbon: 'error',
    }
    return colors[metric] || 'default'
  }

  if (!invoices || invoices.length === 0) {
    return (
      <Alert severity="info">
        No invoice data to preview. Upload PDF files to extract sustainability data.
      </Alert>
    )
  }

  const successfulInvoices = invoices.filter(inv => inv.success)
  const failedInvoices = invoices.filter(inv => !inv.success)

  return (
    <Box>
      {/* Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircle color="success" />
                <Box>
                  <Typography variant="h6">{successfulInvoices.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Successfully Processed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Error color="error" />
                <Box>
                  <Typography variant="h6">{failedInvoices.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Failed to Process
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Science color="primary" />
                <Box>
                  <Typography variant="h6">
                    {formatNumber(
                      successfulInvoices.reduce((sum, inv) => sum + (inv.sixMonthEnergyKwh || 0), 0)
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Energy (kWh)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Successful Invoices */}
      {successfulInvoices.length > 0 && (
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Successfully Processed Invoices ({successfulInvoices.length})
            </Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Company Name</TableCell>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Invoice Date</TableCell>
                  <TableCell>Energy (kWh)</TableCell>
                  <TableCell>Water (m³)</TableCell>
                  <TableCell>Carbon (tCO₂e)</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {successfulInvoices.map((invoice, index) => (
                  <React.Fragment key={index}>
                    <TableRow
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => toggleRowExpansion(index)}
                        >
                          {expandedRows.has(index) ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {invoice.company_name || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {invoice.tax_invoice_number || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {invoice.invoice_date || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatNumber(invoice.sixMonthEnergyKwh)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatNumber(invoice.water_m3)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatNumber(invoice.estimated_carbon_tonnes)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<CheckCircle />}
                          label="Success"
                          color="success"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Row Details */}
                    <TableRow>
                      <TableCell colSpan={8} sx={{ p: 0, border: 'none' }}>
                        <Collapse in={expandedRows.has(index)} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 3, backgroundColor: alpha(theme.palette.background.paper, 0.5) }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                              Detailed Metrics
                            </Typography>
                            
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  {getMetricIcon('energy')}
                                  <Typography variant="body2" color="text.secondary">
                                    6-Month Energy:
                                  </Typography>
                                </Box>
                                <Typography variant="h6" sx={{ ml: 3 }}>
                                  {formatNumber(invoice.sixMonthEnergyKwh)} kWh
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  {getMetricIcon('water')}
                                  <Typography variant="body2" color="text.secondary">
                                    Water Usage:
                                  </Typography>
                                </Box>
                                <Typography variant="h6" sx={{ ml: 3 }}>
                                  {formatNumber(invoice.water_m3)} m³
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  {getMetricIcon('carbon')}
                                  <Typography variant="body2" color="text.secondary">
                                    Carbon Emissions:
                                  </Typography>
                                </Box>
                                <Typography variant="h6" sx={{ ml: 3 }}>
                                  {formatNumber(invoice.estimated_carbon_tonnes)} tCO₂e
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Total Charges:
                                  </Typography>
                                </Box>
                                <Typography variant="h6">
                                  {formatNumber(invoice.total_current_charges)}
                                </Typography>
                              </Grid>
                            </Grid>

                            {/* Monthly History */}
                            {invoice.sixMonthHistory && invoice.sixMonthHistory.length > 0 && (
                              <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                  Monthly History
                                </Typography>
                                <TableContainer>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Month</TableCell>
                                        <TableCell>Energy (kWh)</TableCell>
                                        <TableCell>Water (m³)</TableCell>
                                        <TableCell>Carbon (tCO₂e)</TableCell>
                                        <TableCell>Charges</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {invoice.sixMonthHistory.map((month, monthIndex) => (
                                        <TableRow key={monthIndex}>
                                          <TableCell>{month.month_label || '—'}</TableCell>
                                          <TableCell>{formatNumber(month.energy_kwh)}</TableCell>
                                          <TableCell>{formatNumber(month.water_m3)}</TableCell>
                                          <TableCell>{formatNumber(month.carbon_tco2e)}</TableCell>
                                          <TableCell>{formatNumber(month.total_current_charges)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Box>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Failed Invoices */}
      {failedInvoices.length > 0 && (
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
              Failed to Process ({failedInvoices.length})
            </Typography>
          </Box>
          
          <List>
            {failedInvoices.map((invoice, index) => (
              <Box key={index} sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Error color="error" />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {invoice.filename}
                  </Typography>
                </Box>
                <Typography variant="body2" color="error" sx={{ ml: 4 }}>
                  {invoice.error}
                </Typography>
              </Box>
            ))}
          </List>
        </Paper>
      )}

      {/* Action Buttons */}
      {successfulInvoices.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSave(successfulInvoices)}
            disabled={loading}
            startIcon={<CheckCircle />}
          >
            {loading ? 'Saving...' : `Save ${successfulInvoices.length} Invoice${successfulInvoices.length > 1 ? 's' : ''} to Database`}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default InvoicePreview
