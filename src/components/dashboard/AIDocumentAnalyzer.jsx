import React, { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
  LinearProgress,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Paper,
  CircularProgress
} from '@mui/material'
import {
  CloudUpload,
  Description,
  Analytics,
  CheckCircle,
  Warning,
  Info,
  Assessment,
  TrendingUp,
  TrendingDown,
  Refresh,
  Download,
  Visibility,
  InsertDriveFile,
  Gavel,
  People,
  Nature,
  AccountBalance
} from '@mui/icons-material'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { aiAnalyticsService } from '../../services/aiAnalytics'

const AIDocumentAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setAnalysis(null)
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    try {
      setAnalyzing(true)
      setError(null)
      
      const result = await aiAnalyticsService.analyzeESGDocument(selectedFile)
      setAnalysis(result)
    } catch (err) {
      setError('Failed to analyze document. Please try again.')
      console.error('Document Analysis Error:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  const getESGScoreColor = (score) => {
    if (score >= 80) return '#4caf50'
    if (score >= 60) return '#ff9800'
    return '#f44336'
  }

  const getComplianceColor = (status) => {
    switch (status) {
      case 'compliant': return '#4caf50'
      case 'partial': return '#ff9800'
      case 'non-compliant': return '#f44336'
      default: return '#9e9e9e'
    }
  }

  const getESGRadarData = () => {
    if (!analysis?.esgMetrics) return []
    
    return [
      { subject: 'Environmental', score: analysis.esgMetrics.environmental.score, fullMark: 100 },
      { subject: 'Social', score: analysis.esgMetrics.social.score, fullMark: 100 },
      { subject: 'Governance', score: analysis.esgMetrics.governance.score, fullMark: 100 },
      { subject: 'Disclosure', score: 75, fullMark: 100 },
      { subject: 'Performance', score: 82, fullMark: 100 },
      { subject: 'Risk Management', score: 68, fullMark: 100 }
    ]
  }

  const getSentimentData = () => {
    if (!analysis?.esgMetrics) return []
    
    return Object.entries(analysis.esgMetrics).map(([key, value]) => ({
      category: key.charAt(0).toUpperCase() + key.slice(1),
      mentions: value.mentions,
      sentiment: value.sentiment === 'positive' ? 1 : value.sentiment === 'negative' ? -1 : 0
    }))
  }

  return (
    <Box>
      {/* Header */}
      <Typography variant="h6" fontWeight={600} display="flex" alignItems="center" mb={2}>
        <Analytics sx={{ mr: 1, color: 'primary.main' }} />
        AI Document Analysis
      </Typography>

      {/* File Upload Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              border: 2,
              borderColor: 'divider',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              bgcolor: 'grey.50',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'grey.100' }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            
            {selectedFile ? (
              <Box>
                <InsertDriveFile sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  {selectedFile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAnalyze()
                  }}
                  disabled={analyzing}
                  sx={{ mt: 2 }}
                >
                  {analyzing ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Document'
                  )}
                </Button>
              </Box>
            ) : (
              <Box>
                <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Upload ESG Document
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PDF, DOC, DOCX, or TXT files
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }}>
                  Choose File
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {analyzing && (
        <Card>
          <CardContent>
            <Box textAlign="center">
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                AI Analysis in Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI is analyzing your document for ESG metrics, compliance, and insights...
              </Typography>
              <LinearProgress sx={{ mt: 2 }} />
            </Box>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <Box>
          {/* Analysis Summary */}
          <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analysis Summary
              </Typography>
              <Typography variant="body1">
                {analysis.summary}
              </Typography>
              <Box display="flex" gap={1} mt={2}>
                <Chip
                  icon={<CheckCircle />}
                  label={`${Object.values(analysis.esgMetrics).reduce((acc, metric) => acc + metric.mentions, 0)} ESG Mentions`}
                  color="default"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                />
                <Chip
                  icon={<Gavel />}
                  label={`Compliance: ${analysis.complianceStatus.overall}`}
                  color="default"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Paper sx={{ mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="ESG Metrics" icon={<Assessment />} />
              <Tab label="Compliance" icon={<Gavel />} />
              <Tab label="Insights" icon={<Info />} />
              <Tab label="Extracted Data" icon={<Description />} />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Grid container spacing={2}>
              {/* ESG Scores */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      ESG Performance Scores
                    </Typography>
                    {Object.entries(analysis.esgMetrics).map(([category, metrics]) => (
                      <Box key={category} mb={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle2" textTransform="capitalize">
                            {category}
                          </Typography>
                          <Typography variant="h6" sx={{ color: getESGScoreColor(metrics.score) }}>
                            {metrics.score}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={metrics.score}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: getESGScoreColor(metrics.score)
                            }
                          }}
                        />
                        <Box display="flex" justifyContent="space-between" mt={1}>
                          <Typography variant="caption">
                            {metrics.mentions} mentions
                          </Typography>
                          <Chip
                            icon={metrics.sentiment === 'positive' ? <TrendingUp /> : metrics.sentiment === 'negative' ? <TrendingDown /> : <Info />}
                            label={metrics.sentiment}
                            size="small"
                            color={metrics.sentiment === 'positive' ? 'success' : metrics.sentiment === 'negative' ? 'error' : 'default'}
                          />
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              {/* Radar Chart */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      ESG Performance Radar
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={getESGRadarData()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Radar
                          name="ESG Score"
                          dataKey="score"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Sentiment Analysis */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sentiment Analysis
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={getSentimentData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <RechartsTooltip />
                        <Bar dataKey="mentions" fill="#8884d8" />
                        <Bar dataKey="sentiment" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Compliance Status
                    </Typography>
                    <Box textAlign="center" mb={2}>
                      <Typography
                        variant="h3"
                        sx={{
                          color: getComplianceColor(analysis.complianceStatus.overall),
                          fontWeight: 700
                        }}
                      >
                        {analysis.complianceStatus.overall.toUpperCase()}
                      </Typography>
                    </Box>
                    
                    <List>
                      {analysis.complianceStatus.gaps.map((gap, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Warning color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary={gap}
                            secondary="Compliance Gap"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recommendations
                    </Typography>
                    <List>
                      {analysis.complianceStatus.recommendations.map((rec, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary={rec}
                            secondary="Improvement needed"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {activeTab === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Key AI Insights
                </Typography>
                <List>
                  {analysis.keyInsights.map((insight, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Info color="info" />
                      </ListItemIcon>
                      <ListItemText primary={insight} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {activeTab === 3 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Emissions Data
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="h5" color="error.main">
                            {analysis.extractedData.emissions.scope1}
                          </Typography>
                          <Typography variant="caption">Scope 1</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="h5" color="warning.main">
                            {analysis.extractedData.emissions.scope2}
                          </Typography>
                          <Typography variant="caption">Scope 2</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="h5" color="info.main">
                            {analysis.extractedData.emissions.scope3}
                          </Typography>
                          <Typography variant="caption">Scope 3</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Energy Data
                    </Typography>
                    <Box mb={2}>
                      <Typography variant="body2" gutterBottom>
                        Renewable Energy: {analysis.extractedData.energy.renewable}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={analysis.extractedData.energy.renewable}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        Total Energy: {analysis.extractedData.energy.total} MWh
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Water Usage
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box textAlign="center">
                          <Typography variant="h5" color="primary.main">
                            {analysis.extractedData.water.consumption.toLocaleString()}
                          </Typography>
                          <Typography variant="caption">Total Consumption (m³)</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box textAlign="center">
                          <Typography variant="h5" color="success.main">
                            {analysis.extractedData.water.recycled.toLocaleString()}
                          </Typography>
                          <Typography variant="caption">Recycled (m³)</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Action Buttons */}
          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => {
                // Download analysis report
                console.log('Downloading analysis report...')
              }}
            >
              Download Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => {
                setSelectedFile(null)
                setAnalysis(null)
                setActiveTab(0)
              }}
            >
              Analyze Another Document
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default AIDocumentAnalyzer
