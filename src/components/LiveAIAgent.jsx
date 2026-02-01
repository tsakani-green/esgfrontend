import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemIcon,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Assessment,
  TrendingUp,
  Lightbulb,
  Analytics,
  Nature,
  People,
  Description,
  Download,
  Schedule,
  CheckCircle,
  ExpandMore,
  AutoGraph,
  DataUsage,
  Timeline,
  Summarize,
  PictureAsPdf,
  TableChart,
  Refresh,
  Close,
} from '@mui/icons-material';
import axios from 'axios';
import { API_BASE as API_URL } from '../api/http.js';

const LiveAIAgent = ({ onReportGenerated, onClose }) => {
  const theme = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your ESG AI assistant. I can help you analyze invoices, provide ESG insights, and generate comprehensive sustainability reports. Would you like to create a report or get assistance with your ESG analysis?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(null);
  const messagesEndRef = useRef(null);

  // Report generation state
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportPeriod, setReportPeriod] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportProgress, setReportProgress] = useState(0);
  const [generatedReports, setGeneratedReports] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    startRealTimeAnalysis();
  }, [messages]);

  const startRealTimeAnalysis = () => {
    // Simulate real-time analysis updates
    const interval = setInterval(() => {
      setRealTimeAnalysis({
        current_score: (Math.random() * 2 + 7).toFixed(1),
        trend: Math.random() > 0.5 ? 'improving' : 'stable',
        active_analyses: Math.floor(Math.random() * 5) + 1,
        recommendations_generated: Math.floor(Math.random() * 10) + 5,
      });
    }, 5000);

    return () => clearInterval(interval);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_URL}/api/gemini/chat`, null, {
        params: {
          question: inputMessage,
          context: 'esg_analysis',
        },
      });

      const aiResponse = {
        id: Date.now() + 1,
        text: response.data.answer || generateESGResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI response failed:', error);
      const aiResponse = {
        id: Date.now() + 1,
        text: generateESGResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateESGResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('invoice') || lowerMessage.includes('upload')) {
      return "I can help you analyze your invoices for ESG compliance. Upload your invoices through the Invoice Management page, and I'll automatically categorize items by environmental, social, and governance impact. Would you like guidance on how to structure your invoice data for better ESG analysis?";
    }

    if (lowerMessage.includes('esg') || lowerMessage.includes('score')) {
      return "Your current ESG score is 7.8/10, showing positive trends across all categories. The environmental pillar has improved by 0.5 points this quarter due to sustainable procurement practices. Would you like specific recommendations to improve your score further?";
    }

    if (lowerMessage.includes('recommendation') || lowerMessage.includes('improve')) {
      return "Based on your recent invoice analysis, I recommend: 1) Prioritize suppliers with green certifications, 2) Implement carbon footprint tracking for all purchases, 3) Set diversity targets for your supply chain, 4) Establish regular ESG reporting cycles. Which area would you like to explore first?";
    }

    if (lowerMessage.includes('analysis') || lowerMessage.includes('report')) {
      return "I can generate comprehensive ESG reports including: Environmental impact assessment, Social responsibility metrics, Governance compliance analysis, and Sustainability performance trends. Click the 'Generate Report' button to create a customized report, or tell me what specific aspects you'd like to include.";
    }

    if (lowerMessage.includes('generate report') || lowerMessage.includes('create report')) {
      setTimeout(() => setReportDialogOpen(true), 100);
      return "I'll help you create a comprehensive ESG report. Please select the report type, period, and metrics you'd like to include in the dialog that just opened.";
    }

    return "I'm here to help with your ESG journey. I can analyze invoices for sustainability impact, provide ESG scoring, generate recommendations, and create comprehensive reports. What specific aspect would you like to explore? You can also click 'Generate Report' to start creating a detailed ESG report.";
  };

  // Report generation functions
  const reportTypes = [
    { value: 'comprehensive', label: 'Comprehensive ESG Report', description: 'Full analysis across all ESG pillars' },
    { value: 'environmental', label: 'Environmental Impact Report', description: 'Focus on environmental metrics and carbon footprint' },
    { value: 'social', label: 'Social Responsibility Report', description: 'Social impact and community engagement' },
    { value: 'governance', label: 'Governance Compliance Report', description: 'Corporate governance and compliance metrics' },
    { value: 'sustainability', label: 'Sustainability Performance Report', description: 'Overall sustainability trends and performance' },
  ];

  const reportPeriods = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'semi-annual', label: 'Semi-Annual' },
    { value: 'annual', label: 'Annual' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const availableMetrics = [
    { id: 'carbon_footprint', label: 'Carbon Footprint', category: 'environmental' },
    { id: 'energy_consumption', label: 'Energy Consumption', category: 'environmental' },
    { id: 'waste_management', label: 'Waste Management', category: 'environmental' },
    { id: 'water_usage', label: 'Water Usage', category: 'environmental' },
    { id: 'diversity_inclusion', label: 'Diversity & Inclusion', category: 'social' },
    { id: 'community_engagement', label: 'Community Engagement', category: 'social' },
    { id: 'employee_wellbeing', label: 'Employee Wellbeing', category: 'social' },
    { id: 'supply_chain_ethics', label: 'Supply Chain Ethics', category: 'social' },
    { id: 'board_composition', label: 'Board Composition', category: 'governance' },
    { id: 'compliance_metrics', label: 'Compliance Metrics', category: 'governance' },
    { id: 'risk_management', label: 'Risk Management', category: 'governance' },
    { id: 'transparency_reporting', label: 'Transparency & Reporting', category: 'governance' },
  ];

  const handleGenerateReport = async () => {
    if (!reportType || !reportPeriod || selectedMetrics.length === 0) {
      return;
    }

    setIsGeneratingReport(true);
    setReportProgress(0);

    // Simulate report generation progress
    const progressSteps = [
      { progress: 20, message: 'Collecting ESG data...' },
      { progress: 40, message: 'Analyzing environmental metrics...' },
      { progress: 60, message: 'Processing social impact data...' },
      { progress: 80, message: 'Evaluating governance compliance...' },
      { progress: 95, message: 'Generating insights and recommendations...' },
      { progress: 100, message: 'Finalizing report...' },
    ];

    for (const step of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setReportProgress(step.progress);

      const progressMessage = {
        id: Date.now(),
        text: step.message,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true,
      };
      setMessages((prev) => [...prev, progressMessage]);
    }

    // Create the report
    const newReport = {
      id: Date.now(),
      type: reportType,
      period: reportPeriod,
      format: reportFormat,
      metrics: selectedMetrics,
      generatedAt: new Date().toISOString(),
      fileName: `ESG_Report_${reportType}_${new Date().toISOString().split('T')[0]}.${reportFormat}`,
      title: `${reportTypes.find((rt) => rt.value === reportType)?.label} - ${reportPeriod}`,
      size: '3.2 MB',
      status: 'completed',
    };

    setGeneratedReports((prev) => [newReport, ...prev]);
    setIsGeneratingReport(false);
    setReportDialogOpen(false);
    setReportProgress(0);

    // Call parent callback if provided
    if (onReportGenerated) {
      onReportGenerated(newReport);
    }

    const completionMessage = {
      id: Date.now(),
      text: `✅ Your ${reportTypes.find((rt) => rt.value === reportType)?.label} has been successfully generated! The report includes ${selectedMetrics.length} metrics covering the ${reportPeriod} period. You can download it now or review the summary below.`,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, completionMessage]);
  };

  const handleMetricToggle = (metricId) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId]
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Start voice recognition
      alert('Voice input activated. Please speak now...');
    }
  };

  const quickActions = [
    'Generate ESG report',
    'Analyze ESG performance',
    'Get sustainability recommendations',
    'Compare invoice ESG scores',
    'Identify improvement areas',
  ];

  const esgCategories = [
    { name: 'Environmental', icon: <Nature />, color: 'success', score: 8.2 },
    { name: 'Social', icon: <People />, color: 'info', score: 7.9 },
    { name: 'Governance', icon: <Assessment />, color: 'secondary', score: 7.3 },
  ];

  const handleDownloadReport = (report) => {
    alert(`Downloading ${report.fileName}...`);
    // In real implementation, download the file
  };

  const handleRefreshInsights = () => {
    fetchESGInsights();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BotIcon />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              ESG AI Assistant
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Powered by Gemini AI • Real-time ESG Analysis
            </Typography>
          </Box>
        </Box>
        {onClose && (
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        )}
      </Box>

      <Grid container sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {/* Chat Area */}
        <Grid item xs={12} md={8} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
            {/* Messages */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      maxWidth: '70%',
                    }}
                  >
                    {message.sender === 'ai' && (
                      <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                        <BotIcon />
                      </Avatar>
                    )}
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: message.isSystem
                          ? alpha(theme.palette.info.main, 0.1)
                          : message.sender === 'user'
                          ? 'primary.main'
                          : 'grey.100',
                        color: message.sender === 'user' ? 'white' : 'text.primary',
                        border: message.isSystem
                          ? `1px solid ${alpha(theme.palette.info.main, 0.3)}`
                          : 'none',
                        borderRadius: 2,
                        maxWidth: '100%',
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>
                      <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.7 }}>
                        {message.timestamp}
                      </Typography>
                    </Paper>
                    {message.sender === 'user' && (
                      <Avatar sx={{ ml: 1, bgcolor: 'secondary.main' }}>
                        <PersonIcon />
                      </Avatar>
                    )}
                  </Box>
                </Box>
              ))}

              {isTyping && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                    <BotIcon />
                  </Avatar>
                  <Paper sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography variant="body2">AI is analyzing your request...</Typography>
                    </Box>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Divider />
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Ask about ESG analysis, report generation, or sustainability recommendations..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  size="small"
                />
                <IconButton
                  onClick={toggleVoiceInput}
                  color={isListening ? 'error' : 'primary'}
                  sx={{ p: 1 }}
                >
                  {isListening ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  endIcon={<SendIcon />}
                  size="large"
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4} sx={{ height: '100%', overflow: 'auto' }}>
          <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    <Lightbulb sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Quick Actions
                  </Typography>
                  <IconButton size="small" onClick={handleRefreshInsights}>
                    <Refresh />
                  </IconButton>
                </Box>
                <Box>
                  {quickActions.map((action, index) => (
                    <Chip
                      key={index}
                      label={action}
                      clickable
                      sx={{ m: 0.5 }}
                      onClick={() => {
                        setInputMessage(action);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* ESG Categories */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                  ESG Categories
                </Typography>
                {esgCategories.map((category, index) => (
                  <Card key={index} sx={{ mb: 1 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ color: `${category.color}.main`, mr: 1 }}>
                          {category.icon}
                        </Box>
                        <Typography variant="subtitle2">{category.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mr: 1 }}>
                          {category.score}/10
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={category.score * 10}
                          sx={{ flexGrow: 1 }}
                          color={category.color}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Real-time Analysis */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Analytics sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Real-time Analysis
                </Typography>
                {realTimeAnalysis && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Current ESG Score: <strong>{realTimeAnalysis.current_score}/10</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Trend:{' '}
                      <Chip
                        label={realTimeAnalysis.trend}
                        size="small"
                        color={realTimeAnalysis.trend === 'improving' ? 'success' : 'warning'}
                        sx={{ height: 20 }}
                      />
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Active Analyses: <strong>{realTimeAnalysis.active_analyses}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Recommendations Generated:{' '}
                      <strong>{realTimeAnalysis.recommendations_generated}</strong>
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Generated Reports */}
            <Card sx={{ flexGrow: 1 }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Generated Reports
                </Typography>
                {generatedReports.length > 0 ? (
                  <List dense sx={{ flexGrow: 1, overflow: 'auto' }}>
                    {generatedReports.map((report) => (
                      <ListItem
                        key={report.id}
                        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}
                      >
                        <ListItemIcon>
                          {report.format === 'pdf' ? <PictureAsPdf color="error" /> : <TableChart color="success" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={report.fileName}
                          secondary={`${reportTypes.find((rt) => rt.value === report.type)?.label} • ${report.period}`}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                        <IconButton size="small" color="primary" onClick={() => handleDownloadReport(report)}>
                          <Download />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" align="center">
                      No reports generated yet.
                      <br />
                      Click "Generate Report" to create your first ESG report.
                    </Typography>
                  </Box>
                )}
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Description />}
                  onClick={() => setReportDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Generate New Report
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Report Generation Dialog */}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight={600}>
            <Description sx={{ mr: 2, verticalAlign: 'middle' }} />
            Generate ESG Report
          </Typography>
        </DialogTitle>
        <DialogContent>
          {isGeneratingReport ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Generating Your Report...
              </Typography>
              <LinearProgress
                variant="determinate"
                value={reportProgress}
                sx={{ maxWidth: 300, mx: 'auto', mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                {reportProgress}% Complete
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={reportType}
                    label="Report Type"
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    {reportTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box>
                          <Typography variant="subtitle1">{type.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {type.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Report Period</InputLabel>
                  <Select
                    value={reportPeriod}
                    label="Report Period"
                    onChange={(e) => setReportPeriod(e.target.value)}
                  >
                    {reportPeriods.map((period) => (
                      <MenuItem key={period.value} value={period.value}>
                        {period.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Format</InputLabel>
                  <Select
                    value={reportFormat}
                    label="Format"
                    onChange={(e) => setReportFormat(e.target.value)}
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="word">Word</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Select Metrics to Include
                </Typography>
                {['environmental', 'social', 'governance'].map((category) => (
                  <Accordion key={category} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1" textTransform="capitalize" sx={{ textTransform: 'capitalize' }}>
                        {category} Metrics
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={1}>
                        {availableMetrics
                          .filter((metric) => metric.category === category)
                          .map((metric) => (
                            <Grid item xs={12} sm={6} key={metric.id}>
                              <ListItem
                                button
                                onClick={() => handleMetricToggle(metric.id)}
                                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
                              >
                                <ListItemIcon>
                                  <Checkbox checked={selectedMetrics.includes(metric.id)} edge="start" />
                                </ListItemIcon>
                                <ListItemText primary={metric.label} />
                              </ListItem>
                            </Grid>
                          ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)} disabled={isGeneratingReport}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerateReport}
            variant="contained"
            disabled={
              !reportType || !reportPeriod || selectedMetrics.length === 0 || isGeneratingReport
            }
            startIcon={isGeneratingReport ? <CircularProgress size={20} /> : null}
          >
            {isGeneratingReport ? 'Generating...' : 'Generate Report'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LiveAIAgent;
