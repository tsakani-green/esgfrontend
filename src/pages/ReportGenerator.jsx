import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton as MuiIconButton,
  useTheme,
} from '@mui/material'
import {
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
  DateRange as DateRangeIcon,
  Nature,
  WaterDrop,
  ElectricCar,
  Recycling,
  Forest,
  TrendingUp,
  BarChart,
  PieChart,
  Timeline,
  Download,
  Share,
  Email,
  Print,
  Refresh,
  SmartToy,
  Speed,
  Analytics,
  AutoGraph,
  Public,
  Groups,
  Business,
  School,
  Work,
  Close,
} from '@mui/icons-material'
import LiveAIAgent from '../components/LiveAIAgent'

const ReportGenerator = () => {
  const theme = useTheme()
  const [reportType, setReportType] = useState('')
  const [dateRange, setDateRange] = useState('')
  const [reportName, setReportName] = useState('')
  const [description, setDescription] = useState('')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeRawData, setIncludeRawData] = useState(false)
  const [includeRecommendations, setIncludeRecommendations] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReports, setGeneratedReports] = useState([])
  const [showAIAgent, setShowAIAgent] = useState(false)

  const sustainabilityReportTypes = [
    {
      id: 'esg-summary',
      name: 'ESG Summary Report',
      description: 'Comprehensive environmental, social, and governance overview',
      icon: <AssessmentIcon />,
      color: 'primary',
      metrics: ['Carbon Footprint', 'Energy Usage', 'Water Consumption', 'Waste Management']
    },
    {
      id: 'carbon-footprint',
      name: 'Carbon Footprint Analysis',
      description: 'Detailed carbon emissions analysis and reduction tracking',
      icon: <Nature />,
      color: 'success',
      metrics: ['Total CO2 Emissions', 'Scope 1-3 Emissions', 'Carbon Intensity', 'Reduction Trends']
    },
    {
      id: 'energy-consumption',
      name: 'Energy Consumption Report',
      description: 'Energy usage patterns, efficiency metrics, and optimization opportunities',
      icon: <ElectricCar />,
      color: 'warning',
      metrics: ['Total Energy Usage', 'Renewable Energy %', 'Energy Efficiency', 'Cost Analysis']
    },
    {
      id: 'water-usage',
      name: 'Water Usage Analysis',
      description: 'Water consumption patterns and conservation initiatives',
      icon: <WaterDrop />,
      color: 'info',
      metrics: ['Total Water Usage', 'Water Intensity', 'Recycling Rate', 'Conservation Impact']
    },
    {
      id: 'waste-management',
      name: 'Waste Management Report',
      description: 'Waste reduction, recycling metrics, and circular economy initiatives',
      icon: <Recycling />,
      color: 'secondary',
      metrics: ['Total Waste Generated', 'Recycling Rate', 'Landfill Diversion', 'Circular Economy']
    },
    {
      id: 'sustainability-score',
      name: 'Sustainability Score Card',
      description: 'Overall sustainability performance scoring and benchmarking',
      icon: <TrendingUp />,
      color: 'success',
      metrics: ['ESG Score', 'Industry Ranking', 'Goal Achievement', 'Improvement Rate']
    }
  ]

  const dateRanges = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'lastquarter', label: 'Last Quarter' },
    { value: 'lastyear', label: 'Last Year' },
    { value: 'yeartodate', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const handleGenerate = async () => {
    if (!reportType || !dateRange || !reportName) {
      return
    }

    setIsGenerating(true)
    
    // Simulate report generation
    setTimeout(() => {
      const newReport = {
        id: Date.now(),
        name: reportName,
        type: sustainabilityReportTypes.find(rt => rt.id === reportType)?.name || 'Custom Report',
        dateRange: dateRanges.find(dr => dr.value === dateRange)?.label || dateRange,
        generatedAt: new Date(),
        status: 'completed',
        size: '2.4 MB',
        format: 'PDF',
        downloadUrl: '#'
      }
      
      setGeneratedReports(prev => [newReport, ...prev])
      setIsGenerating(false)
      
      // Reset form
      setReportType('')
      setDateRange('')
      setReportName('')
      setDescription('')
    }, 3000)
  }

  const handleAIGenerate = (reportData) => {
    const newReport = {
      id: Date.now(),
      name: reportData.title || 'AI Generated Report',
      type: reportData.type || 'AI Generated',
      dateRange: 'Custom (AI Selected)',
      generatedAt: new Date(),
      status: 'completed',
      size: '3.1 MB',
      format: reportData.format || 'PDF',
      downloadUrl: '#',
      aiGenerated: true
    }
    
    setGeneratedReports(prev => [newReport, ...prev])
  }

  const handleDownload = (report) => {
    // Simulate download
    alert(`Downloading ${report.name}...`)
  }

  const handleShare = (report) => {
    // Simulate share
    alert(`Sharing ${report.name}...`)
  }

  const handleEmail = (report) => {
    // Simulate email
    alert(`Emailing ${report.name}...`)
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Sustainability Report Generator
        </Typography>
        <Button
          variant="contained"
          startIcon={<SmartToy />}
          onClick={() => setShowAIAgent(true)}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            }
          }}
        >
          AI Assistant
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Report Generation Form */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Create New Report
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    label="Report Type"
                  >
                    {sustainabilityReportTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ color: `${type.color}.main` }}>
                            {type.icon}
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {type.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    label="Date Range"
                  >
                    {dateRanges.map((range) => (
                      <MenuItem key={range.value} value={range.value}>
                        {range.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Report Name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter a descriptive name for your report"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description (Optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any additional notes or context for this report"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Report Options
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={includeCharts}
                          onChange={(e) => setIncludeCharts(e.target.checked)}
                        />
                      }
                      label="Include Charts and Graphs"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={includeRawData}
                          onChange={(e) => setIncludeRawData(e.target.checked)}
                        />
                      }
                      label="Include Raw Data Tables"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={includeRecommendations}
                          onChange={(e) => setIncludeRecommendations(e.target.checked)}
                        />
                      }
                      label="Include Recommendations"
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button variant="outlined" size="large">
                    Save as Draft
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleGenerate}
                    disabled={isGenerating || !reportType || !dateRange || !reportName}
                    startIcon={isGenerating ? <CircularProgress size={20} /> : <AssessmentIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                      }
                    }}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Report'}
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {isGenerating && (
              <Box sx={{ mt: 3 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Your sustainability report is being generated. This may take a few moments...
                </Alert>
                <LinearProgress />
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Quick Stats */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Reports Generated
                  </Typography>
                  <Chip label={generatedReports.length} size="small" color="primary" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    This Month
                  </Typography>
                  <Chip label="12" size="small" color="success" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    AI Generated
                  </Typography>
                  <Chip label="8" size="small" color="secondary" />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Popular Report Types */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Popular Reports
              </Typography>
              <List dense>
                {sustainabilityReportTypes.slice(0, 4).map((type) => (
                  <ListItem key={type.id} button sx={{ borderRadius: 1, mb: 1 }}>
                    <ListItemIcon sx={{ color: `${type.color}.main` }}>
                      {type.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={type.name}
                      secondary={type.metrics.length + ' metrics'}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Generated Reports */}
        {generatedReports.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Recently Generated Reports
              </Typography>
              
              <List>
                {generatedReports.map((report) => (
                  <ListItem 
                    key={report.id} 
                    sx={{ 
                      borderRadius: 1, 
                      mb: 1,
                      bgcolor: 'background.default',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <DescriptionIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight="600">
                            {report.name}
                          </Typography>
                          {report.aiGenerated && (
                            <Chip 
                              icon={<SmartToy />} 
                              label="AI" 
                              size="small" 
                              color="secondary" 
                              sx={{ height: 20 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {report.type} • {report.dateRange}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {report.format} • {report.size} • Generated {new Date(report.generatedAt).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" onClick={() => handleDownload(report)}>
                        <Download />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleShare(report)}>
                        <Share />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEmail(report)}>
                        <Email />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* AI Agent Dialog */}
      <Dialog
        open={showAIAgent}
        onClose={() => setShowAIAgent(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh',
            width: '95vw',
            maxWidth: '95vw',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'white',
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SmartToy />
            <Typography variant="h6" fontWeight="bold">
              ESG AI Assistant
            </Typography>
          </Box>
          <MuiIconButton onClick={() => setShowAIAgent(false)} sx={{ color: 'white' }}>
            <Close />
          </MuiIconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: '100%' }}>
          <LiveAIAgent onReportGenerated={handleAIGenerate} />
        </DialogContent>
      </Dialog>
    </Container>
  )
}

export default ReportGenerator