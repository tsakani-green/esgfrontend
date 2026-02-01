import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Fab,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Alert,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import {
  SmartToy,
  Send,
  Mic,
  MicOff,
  AttachFile,
  Close,
  ExpandMore,
  Description,
  Assessment,
  TrendingUp,
  AutoGraph,
  Speed,
  Analytics,
  BarChart,
  PieChart,
  Timeline,
  Download,
  Share,
  Refresh,
  Settings,
  Lightbulb,
  QuestionAnswer,
  Summarize,
  DataObject,
  FilterList,
  CalendarToday,
  Business,
  Nature,
  WaterDrop,
  ElectricCar,
  Recycling,
  Forest,
  Public,
  School,
  Work,
  Groups,
  Campaign,
  Email,
  Print,
  CloudUpload,
  CloudDownload,
} from '@mui/icons-material'
import { format } from 'date-fns'

const AIAgent = ({ onReportGenerated }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState('')
  const [reportSettings, setReportSettings] = useState({
    dateRange: 'last30days',
    includeCharts: true,
    includeRecommendations: true,
    format: 'pdf',
    language: 'en',
  })
  const [anchorEl, setAnchorEl] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const reportTypes = [
    {
      id: 'esg-summary',
      name: 'ESG Summary Report',
      description: 'Comprehensive ESG performance overview',
      icon: <Assessment />,
      color: 'primary',
      prompts: [
        'Generate a comprehensive ESG summary report',
        'Create an ESG performance analysis',
        'Show me our sustainability metrics'
      ]
    },
    {
      id: 'carbon-footprint',
      name: 'Carbon Footprint Analysis',
      description: 'Detailed carbon emissions analysis',
      icon: <Nature />,
      color: 'success',
      prompts: [
        'Analyze our carbon footprint',
        'Generate carbon emissions report',
        'Show carbon reduction trends'
      ]
    },
    {
      id: 'energy-consumption',
      name: 'Energy Consumption Report',
      description: 'Energy usage patterns and optimization',
      icon: <ElectricCar />,
      color: 'warning',
      prompts: [
        'Generate energy consumption report',
        'Analyze energy usage patterns',
        'Show energy efficiency metrics'
      ]
    },
    {
      id: 'water-usage',
      name: 'Water Usage Analysis',
      description: 'Water consumption and conservation',
      icon: <WaterDrop />,
      color: 'info',
      prompts: [
        'Create water usage analysis',
        'Show water conservation metrics',
        'Generate water sustainability report'
      ]
    },
    {
      id: 'waste-management',
      name: 'Waste Management Report',
      description: 'Waste reduction and recycling metrics',
      icon: <Recycling />,
      color: 'secondary',
      prompts: [
        'Generate waste management report',
        'Analyze recycling metrics',
        'Show waste reduction trends'
      ]
    },
    {
      id: 'sustainability-score',
      name: 'Sustainability Score Card',
      description: 'Overall sustainability performance score',
      icon: <TrendingUp />,
      color: 'success',
      prompts: [
        'Calculate sustainability score',
        'Generate sustainability scorecard',
        'Show ESG rating analysis'
      ]
    }
  ]

  const quickActions = [
    { icon: <Description />, label: 'Monthly Report', action: 'monthly' },
    { icon: <BarChart />, label: 'Data Analysis', action: 'analysis' },
    { icon: <Summarize />, label: 'Executive Summary', action: 'summary' },
    { icon: <Lightbulb />, label: 'Recommendations', action: 'recommendations' },
  ]

  const aiSuggestions = [
    "Generate a comprehensive ESG report for Q4 2024",
    "Analyze our carbon footprint trends over the past year",
    "Create an executive summary for board presentation",
    "Show sustainability recommendations based on current data",
    "Generate a comparative analysis with industry benchmarks",
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: generateAIResponse(input),
        sender: 'ai',
        timestamp: new Date(),
        reportData: generateMockReportData(input),
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const generateAIResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('esg') || lowerInput.includes('summary')) {
      return "I'll generate a comprehensive ESG summary report for you. This will include environmental metrics, social impact data, and governance indicators. The report will be ready in a few moments."
    }
    if (lowerInput.includes('carbon') || lowerInput.includes('emission')) {
      return "I'm analyzing your carbon footprint data. The report will include total emissions, reduction trends, and benchmarking against industry standards."
    }
    if (lowerInput.includes('energy')) {
      return "Generating your energy consumption report. This will include usage patterns, efficiency metrics, and cost analysis."
    }
    if (lowerInput.includes('water')) {
      return "Creating your water usage analysis. The report will cover consumption patterns, conservation efforts, and sustainability metrics."
    }
    if (lowerInput.includes('waste') || lowerInput.includes('recycling')) {
      return "Preparing your waste management report. This will include recycling rates, waste reduction initiatives, and environmental impact."
    }
    
    return "I'm analyzing your request and will generate a customized report based on your sustainability data. Please specify the type of report you'd like or choose from the available options."
  }

  const generateMockReportData = (userInput) => {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('esg') || lowerInput.includes('summary')) {
      return {
        type: 'esg-summary',
        title: 'ESG Summary Report',
        date: format(new Date(), 'MMM dd, yyyy'),
        metrics: {
          overallScore: 82,
          environmental: 78,
          social: 85,
          governance: 83,
        },
        charts: ['performance-trend', 'category-breakdown', 'benchmark-comparison'],
        recommendations: [
          'Increase renewable energy usage by 15%',
          'Implement water conservation measures',
          'Enhance employee sustainability training',
        ]
      }
    }
    
    return {
      type: 'general',
      title: 'Sustainability Report',
      date: format(new Date(), 'MMM dd, yyyy'),
      metrics: { score: 75 },
      charts: ['overview'],
      recommendations: ['Continue current sustainability initiatives']
    }
  }

  const handleQuickAction = (action) => {
    const prompts = {
      monthly: "Generate a monthly sustainability report with all key metrics",
      analysis: "Perform a detailed analysis of our sustainability data",
      summary: "Create an executive summary for stakeholders",
      recommendations: "Provide actionable sustainability recommendations"
    }
    
    setInput(prompts[action])
  }

  const handleReportTypeSelect = (type) => {
    setSelectedReportType(type)
    const reportType = reportTypes.find(rt => rt.id === type)
    if (reportType && reportType.prompts.length > 0) {
      setInput(reportType.prompts[0])
    }
    setAnchorEl(null)
  }

  const handleGenerateReport = (reportData) => {
    if (onReportGenerated) {
      onReportGenerated(reportData)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = (event) => {
    const files = event.target.files
    if (files.length > 0) {
      // Handle file upload logic
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Implement voice recording logic
  }

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="ai-agent"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Badge badgeContent={messages.length} color="error">
          <SmartToy />
        </Badge>
      </Fab>

      {/* AI Agent Dialog */}
      {isOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Card
            sx={{
              width: '100%',
              maxWidth: 900,
              height: '80vh',
              maxHeight: 700,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                  <SmartToy />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    AI Report Assistant
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Generate intelligent sustainability reports
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>

            {/* Report Type Selector */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  startIcon={<Assessment />}
                >
                  {selectedReportType ? 
                    reportTypes.find(rt => rt.id === selectedReportType)?.name : 
                    'Select Report Type'
                  }
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  {reportTypes.map((type) => (
                    <MenuItem
                      key={type.id}
                      onClick={() => handleReportTypeSelect(type.id)}
                      selected={selectedReportType === type.id}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: `${type.color}.main`, width: 24, height: 24 }}>
                          {type.icon}
                        </Avatar>
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
                </Menu>
              </Box>

              {/* Quick Actions */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {quickActions.map((action) => (
                  <Chip
                    key={action.action}
                    icon={action.icon}
                    label={action.label}
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuickAction(action.action)}
                    clickable
                  />
                ))}
              </Box>
            </Box>

            {/* Messages Area */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {messages.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: 'primary.light' }}>
                    <SmartToy sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    Welcome to AI Report Assistant
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    I can help you generate comprehensive sustainability reports. 
                    Try one of these suggestions or describe what you need:
                  </Typography>
                  
                  {/* AI Suggestions */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 600, mx: 'auto' }}>
                    {aiSuggestions.map((suggestion, index) => (
                      <Paper
                        key={index}
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'primary.50' },
                          border: 1,
                          borderColor: 'divider',
                        }}
                        onClick={() => setInput(suggestion)}
                      >
                        <Typography variant="body2">{suggestion}</Typography>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              )}

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
                      maxWidth: '70%',
                      display: 'flex',
                      gap: 1,
                      alignItems: 'flex-start',
                    }}
                  >
                    {message.sender === 'ai' && (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                        <SmartToy />
                      </Avatar>
                    )}
                    <Box>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                          color: message.sender === 'user' ? 'white' : 'text.primary',
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body2">{message.text}</Typography>
                      </Paper>
                      
                      {/* Report Data Display */}
                      {message.reportData && (
                        <Accordion sx={{ mt: 1 }}>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="subtitle2" fontWeight="600">
                              📊 {message.reportData.title}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              {/* Report Metrics */}
                              {message.reportData.metrics && (
                                <Box>
                                  <Typography variant="body2" fontWeight="600" gutterBottom>
                                    Key Metrics:
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {Object.entries(message.reportData.metrics).map(([key, value]) => (
                                      <Chip
                                        key={key}
                                        label={`${key}: ${value}`}
                                        size="small"
                                        variant="outlined"
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              )}

                              {/* Recommendations */}
                              {message.reportData.recommendations && (
                                <Box>
                                  <Typography variant="body2" fontWeight="600" gutterBottom>
                                    Recommendations:
                                  </Typography>
                                  <List dense>
                                    {message.reportData.recommendations.map((rec, index) => (
                                      <ListItem key={index}>
                                        <ListItemText primary={`• ${rec}`} />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Box>
                              )}

                              {/* Action Buttons */}
                              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  startIcon={<Download />}
                                  onClick={() => handleGenerateReport(message.reportData)}
                                >
                                  Download Report
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<Share />}
                                >
                                  Share
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<Email />}
                                >
                                  Email
                                </Button>
                              </Box>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      )}
                      
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {format(message.timestamp, 'HH:mm')}
                      </Typography>
                    </Box>
                    {message.sender === 'user' && (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.light' }}>
                        {message.text.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                  </Box>
                </Box>
              ))}

              {isTyping && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                    <SmartToy />
                  </Avatar>
                  <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      <CircularProgress size={16} />
                      <Typography variant="body2">AI is thinking...</Typography>
                    </Box>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              {/* Report Settings */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="body2" fontWeight="600">
                    ⚙️ Report Settings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Date Range</InputLabel>
                      <Select
                        value={reportSettings.dateRange}
                        label="Date Range"
                        onChange={(e) => setReportSettings(prev => ({ ...prev, dateRange: e.target.value }))}
                      >
                        <MenuItem value="last7days">Last 7 days</MenuItem>
                        <MenuItem value="last30days">Last 30 days</MenuItem>
                        <MenuItem value="last90days">Last 90 days</MenuItem>
                        <MenuItem value="lastyear">Last year</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <InputLabel>Format</InputLabel>
                      <Select
                        value={reportSettings.format}
                        label="Format"
                        onChange={(e) => setReportSettings(prev => ({ ...prev, format: e.target.value }))}
                      >
                        <MenuItem value="pdf">PDF</MenuItem>
                        <MenuItem value="excel">Excel</MenuItem>
                        <MenuItem value="powerpoint">PowerPoint</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={reportSettings.includeCharts}
                          onChange={(e) => setReportSettings(prev => ({ ...prev, includeCharts: e.target.checked }))}
                          size="small"
                        />
                      }
                      label="Include Charts"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={reportSettings.includeRecommendations}
                          onChange={(e) => setReportSettings(prev => ({ ...prev, includeRecommendations: e.target.checked }))}
                          size="small"
                        />
                      }
                      label="Recommendations"
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Message Input */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  multiple
                />
                <IconButton onClick={() => fileInputRef.current?.click()}>
                  <AttachFile />
                </IconButton>
                
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Ask me to generate any sustainability report..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  size="small"
                />
                
                <IconButton
                  onClick={toggleRecording}
                  color={isRecording ? 'error' : 'default'}
                >
                  {isRecording ? <MicOff /> : <Mic />}
                </IconButton>
                
                <Button
                  variant="contained"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  startIcon={<Send />}
                >
                  Generate
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>
      )}
    </>
  )
}

export default AIAgent
