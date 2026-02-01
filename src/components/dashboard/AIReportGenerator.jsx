import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import {
  Assessment,
  Description,
  Download,
  Refresh,
  Preview,
  Share,
  Print,
  Email,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Info,
  Warning,
  Speed,
  Timeline,
  AutoGraph,
  Lightbulb,
  Gavel,
  People,
  Nature,
  AccountBalance
} from '@mui/icons-material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { aiAnalyticsService } from '../../services/aiAnalytics'

const AIReportGenerator = ({ clientId }) => {
  const [generating, setGenerating] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const [reportType, setReportType] = useState('comprehensive')
  const [timeRange, setTimeRange] = useState('12months')
  const [previewOpen, setPreviewOpen] = useState(false)

  const handleGenerateReport = async () => {
    try {
      setGenerating(true)
      setError(null)
      
      const generatedReport = await aiAnalyticsService.generateAIReport(clientId, reportType, timeRange)
      setReport(generatedReport)
    } catch (err) {
      setError('Failed to generate AI report. Please try again.')
      console.error('Report Generation Error:', err)
    } finally {
      setGenerating(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50'
    if (score >= 60) return '#ff9800'
    return '#f44336'
  }

  const getTrendIcon = (trend) => {
    return trend === 'improving' ? <TrendingUp color="success" /> : <TrendingDown color="error" />
  }

  const getESGPieData = () => {
    if (!report?.detailedAnalysis) return []
    
    return [
      { name: 'Environmental', value: report.detailedAnalysis.environmental.score, color: '#4caf50' },
      { name: 'Social', value: report.detailedAnalysis.social.score, color: '#2196f3' },
      { name: 'Governance', value: report.detailedAnalysis.governance.score, color: '#ff9800' }
    ]
  }

  const getPredictionData = () => {
    if (!report?.predictions) return []
    
    const currentScore = report.executiveSummary.overallESGScore
    const nextQuarter = report.predictions.nextQuarterScore
    const nextYear = report.predictions.nextYearScore
    
    return [
      { period: 'Current', score: currentScore },
      { period: 'Next Quarter', score: nextQuarter },
      { period: 'Next Year', score: nextYear }
    ]
  }

  const getRadarData = () => {
    if (!report?.detailedAnalysis) return []
    
    return [
      { subject: 'Environmental', score: report.detailedAnalysis.environmental.score, fullMark: 100 },
      { subject: 'Social', score: report.detailedAnalysis.social.score, fullMark: 100 },
      { subject: 'Governance', score: report.detailedAnalysis.governance.score, fullMark: 100 },
      { subject: 'Risk Management', score: 75, fullMark: 100 },
      { subject: 'Performance', score: 82, fullMark: 100 },
      { subject: 'Compliance', score: 88, fullMark: 100 }
    ]
  }

  const downloadReport = () => {
    // Simulate download
    const reportData = JSON.stringify(report, null, 2)
    const blob = new Blob([reportData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ESG-Report-${report?.reportId || Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareReport = () => {
    // Simulate share functionality
    if (navigator.share) {
      navigator.share({
        title: 'ESG AI Report',
        text: 'Check out this AI-generated ESG report',
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Typography variant="h6" fontWeight={600} display="flex" alignItems="center" mb={2}>
        <Assessment sx={{ mr: 1, color: 'primary.main' }} />
        AI Report Generator
      </Typography>

      {/* Configuration */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="comprehensive">Comprehensive ESG Report</MenuItem>
                  <MenuItem value="environmental">Environmental Focus</MenuItem>
                  <MenuItem value="social">Social Impact Report</MenuItem>
                  <MenuItem value="governance">Governance Analysis</MenuItem>
                  <MenuItem value="risk">Risk Assessment Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Time Range"
                >
                  <MenuItem value="3months">Last 3 Months</MenuItem>
                  <MenuItem value="6months">Last 6 Months</MenuItem>
                  <MenuItem value="12months">Last 12 Months</MenuItem>
                  <MenuItem value="24months">Last 24 Months</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleGenerateReport}
                disabled={generating}
                startIcon={generating ? <CircularProgress size={20} /> : <Description />}
              >
                {generating ? 'Generating...' : 'Generate AI Report'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {generating && (
        <Card>
          <CardContent>
            <Box textAlign="center">
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                AI is Generating Your Report
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Our AI is analyzing your ESG data, generating insights, and creating a comprehensive report...
              </Typography>
              <LinearProgress sx={{ maxWidth: 400, mx: 'auto' }} />
            </Box>
          </CardContent>
        </Card>
      )}

      {report && (
        <Box>
          {/* Report Header */}
          <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    AI-Generated ESG Report
                  </Typography>
                  <Typography variant="body1">
                    Report ID: {report.reportId}
                  </Typography>
                  <Typography variant="body2">
                    Generated: {new Date(report.generatedAt).toLocaleString()}
                  </Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <Tooltip title="Preview Report">
                    <IconButton color="inherit" onClick={() => setPreviewOpen(true)}>
                      <Preview />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download Report">
                    <IconButton color="inherit" onClick={downloadReport}>
                      <Download />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share Report">
                    <IconButton color="inherit" onClick={shareReport}>
                      <Share />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Print Report">
                    <IconButton color="inherit">
                      <Print />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Email Report">
                    <IconButton color="inherit">
                      <Email />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Executive Summary */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                <Speed sx={{ mr: 1 }} />
                Executive Summary
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center">
                    <Typography
                      variant="h3"
                      sx={{ color: getScoreColor(report.executiveSummary.overallESGScore) }}
                    >
                      {report.executiveSummary.overallESGScore}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overall ESG Score
                    </Typography>
                    <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                      {getTrendIcon(report.executiveSummary.trend)}
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {report.executiveSummary.trend}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={9}>
                  <Typography variant="subtitle2" gutterBottom>
                    Key Achievements
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    {report.executiveSummary.keyAchievements.map((achievement, index) => (
                      <Chip
                        key={index}
                        icon={<CheckCircle />}
                        label={achievement}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Areas for Improvement
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {report.executiveSummary.areasForImprovement.map((area, index) => (
                      <Chip
                        key={index}
                        icon={<Warning />}
                        label={area}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Detailed Analysis Charts */}
          <Grid container spacing={2} mb={2}>
            {/* ESG Scores Pie Chart */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    ESG Score Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={getESGPieData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {getESGPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
                    {getESGPieData().map((item, index) => (
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

            {/* Predictions Chart */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Score Predictions
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={getPredictionData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                      <YAxis domain={[60, 90]} tick={{ fontSize: 10 }} />
                      <RechartsTooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#8884d8"
                        strokeWidth={3}
                        dot={{ fill: '#8884d8', r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <Typography variant="caption" display="block" textAlign="center">
                    Confidence: {Math.round(report.predictions.confidence * 100)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Radar Chart */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Radar
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={getRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar
                        name="Score"
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
          </Grid>

          {/* Detailed Analysis */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detailed Analysis
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(report.detailedAnalysis).map(([category, data]) => (
                  <Grid item xs={12} md={4} key={category}>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        {category === 'environmental' && <Nature sx={{ mr: 1, color: 'success.main' }} />}
                        {category === 'social' && <People sx={{ mr: 1, color: 'info.main' }} />}
                        {category === 'governance' && <AccountBalance sx={{ mr: 1, color: 'warning.main' }} />}
                        <Typography variant="subtitle1" textTransform="capitalize">
                          {category}
                        </Typography>
                      </Box>
                      
                      <Typography variant="h5" sx={{ color: getScoreColor(data.score) }}>
                        {data.score}/100
                      </Typography>
                      
                      <Box mt={1}>
                        <Typography variant="subtitle2" gutterBottom>
                          Strengths
                        </Typography>
                        {data.strengths.slice(0, 2).map((strength, index) => (
                          <Typography key={index} variant="caption" display="block">
                            • {strength}
                          </Typography>
                        ))}
                      </Box>
                      
                      <Box mt={1}>
                        <Typography variant="subtitle2" gutterBottom>
                          Weaknesses
                        </Typography>
                        {data.weaknesses.slice(0, 2).map((weakness, index) => (
                          <Typography key={index} variant="caption" display="block">
                            • {weakness}
                          </Typography>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Action Plan */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                <Lightbulb sx={{ mr: 1 }} />
                AI-Generated Action Plan
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, bgcolor: 'success.light' }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Immediate Actions
                    </Typography>
                    <List dense>
                      {report.actionPlan.immediate.map((action, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText primary={action} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, bgcolor: 'warning.light' }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Short-term Goals
                    </Typography>
                    <List dense>
                      {report.actionPlan.shortTerm.map((action, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Timeline color="warning" />
                          </ListItemIcon>
                          <ListItemText primary={action} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, bgcolor: 'info.light' }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Long-term Vision
                    </Typography>
                    <List dense>
                      {report.actionPlan.longTerm.map((action, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <AutoGraph color="info" />
                          </ListItemIcon>
                          <ListItemText primary={action} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={downloadReport}
            >
              Download Full Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleGenerateReport}
            >
              Regenerate Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={shareReport}
            >
              Share Report
            </Button>
          </Box>
        </Box>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Report Preview - {report?.reportId}
        </DialogTitle>
        <DialogContent>
          {report && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Executive Summary
              </Typography>
              <Typography variant="body1" paragraph>
                Overall ESG Score: {report.executiveSummary.overallESGScore}
              </Typography>
              <Typography variant="body1" paragraph>
                Trend: {report.executiveSummary.trend}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Key Achievements
              </Typography>
              <List>
                {report.executiveSummary.keyAchievements.map((achievement, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={achievement} />
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Areas for Improvement
              </Typography>
              <List>
                {report.executiveSummary.areasForImprovement.map((area, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={area} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={downloadReport}
            startIcon={<Download />}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AIReportGenerator
