import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Container,
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
} from "@mui/material";
import {
  Description,
  Assessment,
  TrendingUp,
  Speed,
  CheckCircle,
  Info,
  Download,
  Refresh,
  SmartToy,
  Timeline,
  BarChart,
  PieChart,
  Visibility,
  Close,
  PlayCircle,
  HourglassEmpty,
  ErrorOutline,
  AutoGraph,
  Analytics,
  Share,
  MoreVert,
  FileCopy,
  PictureAsPdf,
  InsertDriveFile,
  DataUsage,
  Nature,
  People,
  Public,
  Spa,
  Bolt,
  WaterDrop,
  Recycling,
  Forest,
  ElectricCar,
  TrendingFlat,
  History,
  Schedule,
  Storage,
  CloudDownload,
  CloudUpload,
  OpenInNew,
  ContentCopy,
  Delete,
  Archive,
  Launch,
  GetApp,
  Cloud,
  Memory,
  Apps,
  Widgets,
  Dashboard,
  TableChart,
  GridView,
  ViewModule,
  ViewWeek,
  ViewAgenda,
  ViewList,
  ViewCarousel,
  ViewQuilt,
} from "@mui/icons-material";
import axios from "axios";
import { API_BASE as API_URL } from '../../api/http.js';

// Enhanced template data with more details
const FALLBACK_TEMPLATES = {
  comprehensive: {
    id: "comprehensive",
    name: "Comprehensive ESG Report",
    description: "Full ESG analysis with all metrics and AI recommendations",
    icon: <Assessment color="primary" />,
    color: "primary",
    estimatedTime: "45-60 seconds",
    sections: [
      "Executive Summary",
      "Energy Analysis",
      "Carbon Footprint",
      "Water Usage",
      "Waste Management",
      "Social Impact",
      "Governance Compliance",
      "AI Recommendations",
    ],
    metrics: ["All ESG metrics", "Historical trends", "Predictions", "Benchmarks"],
    complexity: "High",
    size: "Large (15-20 pages)",
  },
  energy_focus: {
    id: "energy_focus",
    name: "Energy Performance Report",
    description: "Detailed energy consumption and efficiency analysis",
    icon: <Bolt color="warning" />,
    color: "warning",
    estimatedTime: "30-45 seconds",
    sections: ["Energy Trends", "Efficiency Analysis", "Cost Analysis", "Renewable Energy", "Recommendations"],
    metrics: ["Energy consumption", "Efficiency scores", "Cost savings", "Renewable %"],
    complexity: "Medium",
    size: "Medium (8-12 pages)",
  },
  carbon_focus: {
    id: "carbon_focus",
    name: "Carbon Footprint Report",
    description: "Carbon emissions analysis and reduction strategies",
    icon: <Nature color="success" />,
    color: "success",
    estimatedTime: "30-45 seconds",
    sections: ["Carbon Analysis", "Scope 1-3 Emissions", "Reduction Strategies", "Compliance", "Offset Analysis"],
    metrics: ["CO2 emissions", "Carbon intensity", "Reduction targets", "Offset credits"],
    complexity: "Medium",
    size: "Medium (10-14 pages)",
  },
  water_waste: {
    id: "water_waste",
    name: "Water & Waste Report",
    description: "Water consumption and waste management analysis",
    icon: <WaterDrop color="info" />,
    color: "info",
    estimatedTime: "25-40 seconds",
    sections: ["Water Usage", "Conservation", "Waste Management", "Recycling", "Circular Economy"],
    metrics: ["Water consumption", "Recycling rate", "Waste diversion", "Conservation"],
    complexity: "Medium",
    size: "Medium (8-10 pages)",
  },
  social_impact: {
    id: "social_impact",
    name: "Social Impact Report",
    description: "Social responsibility and community impact analysis",
    icon: <People color="secondary" />,
    color: "secondary",
    estimatedTime: "35-50 seconds",
    sections: ["Employee Engagement", "Community Programs", "Diversity & Inclusion", "Supply Chain Ethics", "Social ROI"],
    metrics: ["Employee satisfaction", "Community investment", "Diversity metrics", "Ethical sourcing"],
    complexity: "Medium",
    size: "Medium (10-12 pages)",
  },
  monthly_summary: {
    id: "monthly_summary",
    name: "Monthly ESG Summary",
    description: "Quick monthly overview of key ESG metrics",
    icon: <Timeline color="primary" />,
    color: "primary",
    estimatedTime: "15-30 seconds",
    sections: ["Key Metrics", "Monthly Highlights", "Performance Trends", "Action Items"],
    metrics: ["Top 10 metrics", "Trend analysis", "Monthly changes", "Quick wins"],
    complexity: "Low",
    size: "Small (4-6 pages)",
  },
  quick: {
    id: "quick",
    name: "Quick ESG Snapshot",
    description: "Fast, lightweight summary (energy, carbon, efficiency)",
    icon: <Speed color="success" />,
    color: "success",
    estimatedTime: "10-20 seconds",
    sections: ["Snapshot", "Highlights", "Next Actions"],
    metrics: ["Energy", "Carbon", "Efficiency", "Key alerts"],
    complexity: "Low",
    size: "Small (2-3 pages)",
  },
  executive: {
    id: "executive",
    name: "Executive Briefing",
    description: "High-level summary for leadership",
    icon: <TrendingUp color="error" />,
    color: "error",
    estimatedTime: "20-35 seconds",
    sections: ["Executive Summary", "Key Insights", "Strategic Recommendations", "Financial Impact"],
    metrics: ["Business impact", "ROI analysis", "Strategic metrics", "Risk assessment"],
    complexity: "Medium",
    size: "Small (4-6 pages)",
  },
};

// Enhanced StepIconComponent
function StepIconRenderer(props) {
  const { active, completed, icon } = props;
  const step = Number(icon);

  const icons = [
    <SmartToy key="ai" />,
    <DataUsage key="data" />,
    <Analytics key="analytics" />,
    <AutoGraph key="graph" />,
    <CheckCircle key="check" />,
  ];

  const baseSx = {
    width: 32,
    height: 32,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    border: "2px solid",
    borderColor: completed ? "success.main" : active ? "primary.main" : "divider",
    color: completed ? "success.main" : active ? "primary.main" : "text.secondary",
    bgcolor: completed ? "success.50" : active ? "primary.50" : "background.paper",
    transition: "all 0.3s ease",
  };

  return (
    <Box sx={baseSx}>
      {icons[step - 1] || <Info fontSize="small" />}
    </Box>
  );
}

// Recent reports component
function RecentReports({ reports, onSelectReport }) {
  if (!reports || reports.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
        <Description sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          No reports generated yet
        </Typography>
      </Paper>
    );
  }

  return (
    <List>
      {reports.slice(0, 5).map((report) => (
        <ListItem
          key={report.id}
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            mb: 1,
            '&:hover': { bgcolor: 'action.hover' },
          }}
          secondaryAction={
            <IconButton edge="end" onClick={() => onSelectReport(report)}>
              <Visibility />
            </IconButton>
          }
        >
          <ListItemIcon>
            {report.format === 'pdf' ? <PictureAsPdf color="error" /> : <InsertDriveFile color="primary" />}
          </ListItemIcon>
          <ListItemText
            primary={report.name || `Report ${report.id}`}
            secondary={
              <Box>
                <Typography variant="caption" display="block">
                  {report.template} • {new Date(report.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {report.size || '2.5 MB'} • {report.status || 'completed'}
                </Typography>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}

export default function ReportGenerator({ surfaceCard }) {
  const [selectedTemplate, setSelectedTemplate] = useState("comprehensive");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [reportStatus, setReportStatus] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [templates, setTemplates] = useState(FALLBACK_TEMPLATES);
  const [error, setError] = useState(null);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);
  const [showReportError, setShowReportError] = useState(false);
  const [generationHistory, setGenerationHistory] = useState([]);

  const pollingRef = useRef(null);

  const selectedTemplateMeta = useMemo(() => {
    return templates?.[selectedTemplate] || FALLBACK_TEMPLATES[selectedTemplate] || null;
  }, [templates, selectedTemplate]);

  useEffect(() => {
    fetchReportTemplates();
    fetchRecentReports();

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, []);

  const fetchReportTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const response = await axios.get(`${API_URL}/api/reports/report-templates`);
      if (response?.data?.templates && typeof response.data.templates === "object") {
        setTemplates((prev) => ({ ...FALLBACK_TEMPLATES, ...prev, ...response.data.templates }));
      } else {
        setTemplates(FALLBACK_TEMPLATES);
      }
    } catch (err) {
      console.error("Error fetching templates:", err);
      setTemplates(FALLBACK_TEMPLATES);
      setError("Failed to fetch templates from server — using fallback templates.");
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchRecentReports = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reports/recent`);
      if (response?.data?.reports) {
        setRecentReports(response.data.reports);
      }
    } catch (err) {
      console.error("Error fetching recent reports:", err);
      // Use mock recent reports for demo
      setRecentReports([
        {
          id: 1,
          name: "Q4 2023 ESG Report",
          template: "comprehensive",
          format: "pdf",
          size: "3.2 MB",
          status: "completed",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 2,
          name: "January Energy Analysis",
          template: "energy_focus",
          format: "pdf",
          size: "1.8 MB",
          status: "completed",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
    }
  };

  const normalizeReportId = (obj) => obj?.report_id || obj?.id || null;

  const startStatusPolling = (reportId) => {
    if (!reportId) return;

    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    pollingRef.current = setInterval(async () => {
      try {
        const response = await axios.get(`${API_URL}/api/reports/report-status/${reportId}`);
        const status = response.data;

        setReportStatus(status);

        if (status?.status === "completed" || status?.status === "failed") {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setIsGenerating(false);
          
          // Add to generation history
          if (status.status === "completed") {
            setGenerationHistory(prev => [{
              id: reportId,
              template: selectedTemplate,
              timestamp: new Date().toISOString(),
              status: "completed",
              duration: Math.floor(Math.random() * 45) + 15, // Mock duration
            }, ...prev]);
            
            // Refresh recent reports
            fetchRecentReports();
          }
        }
      } catch (err) {
        console.error("Error checking status:", err);
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
        setIsGenerating(false);
        setError("Error checking report status.");
      }
    }, 2000);
  };

  const generateReport = async (template = selectedTemplate, format = "pdf") => {
    try {
      setIsGenerating(true);
      setError(null);
      setReportStatus(null);

      const response = await axios.post(`${API_URL}/api/reports/generate-esg-report`, {
        report_type: template,
        format,
        include_charts: true,
        include_ai_analysis: true,
      });

      const payload = response?.data || {};
      const reportId = normalizeReportId(payload);

      if (!reportId) {
        throw new Error(payload?.detail || "No report_id returned from server.");
      }

      setCurrentReport({
        ...payload,
        report_id: payload.report_id || reportId,
        id: payload.id || reportId,
        template,
        format,
        name: `${templates[template]?.name || template} - ${new Date().toLocaleDateString()}`,
      });

      setReportStatus({
        status: payload.status || "started",
        message: payload.message || "Report generation started.",
        report_id: reportId,
        progress: payload.progress ?? 0,
      });

      if (payload.status === "completed") {
        setIsGenerating(false);
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } else {
        startStatusPolling(reportId);
      }
    } catch (err) {
      console.error("Error generating report:", err);
      const msg = err?.response?.data?.detail || err?.message || "Failed to generate report";
      setError(msg);
      setReportStatus({ status: "failed", message: msg, progress: 0 });
      setIsGenerating(false);
      
      // Add failed attempt to history
      setGenerationHistory(prev => [{
        id: Date.now(),
        template: template,
        timestamp: new Date().toISOString(),
        status: "failed",
        error: msg,
      }, ...prev]);
    }
  };

  const generateQuickReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setReportStatus(null);

      const response = await axios.post(`${API_URL}/api/reports/quick-report`, {
        metrics: ["energy", "carbon", "efficiency", "water", "waste"],
        format: "pdf",
      });

      const payload = response?.data || {};
      const reportId = normalizeReportId(payload) || payload?.report_id;

      if (!reportId) {
        throw new Error(payload?.detail || "No report_id returned from server.");
      }

      setSelectedTemplate("quick");
      setCurrentReport({
        ...payload,
        report_id: payload.report_id || reportId,
        id: payload.id || reportId,
        template: "quick",
        format: "pdf",
        name: `Quick ESG Snapshot - ${new Date().toLocaleDateString()}`,
      });

      setReportStatus({
        status: payload.status || "started",
        message: payload.message || "Quick report generation started.",
        report_id: reportId,
        progress: payload.progress ?? 0,
      });

      if (payload.status === "completed") {
        setIsGenerating(false);
      } else {
        startStatusPolling(reportId);
      }
    } catch (err) {
      console.error("Error generating quick report:", err);
      const msg = err?.response?.data?.detail || err?.message || "Failed to generate quick report";
      setError(msg);
      setReportStatus({ status: "failed", message: msg, progress: 0 });
      setIsGenerating(false);
    }
  };

  const downloadReport = async (format = "pdf") => {
    const reportId = normalizeReportId(currentReport);
    if (!reportId) return;

    try {
      const response = await axios.get(`${API_URL}/api/reports/download/${reportId}?format=${format}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const fileTemplate = currentReport?.template || selectedTemplate || "report";
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute("download", `bertha_house_esg_report_${fileTemplate}_${date}.${format}`);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading report:", err);
      setError("Failed to download report. The file may not be ready yet.");
    }
  };

  const shareReport = async () => {
    const reportId = normalizeReportId(currentReport);
    if (!reportId) return;

    try {
      const response = await axios.post(`${API_URL}/api/reports/share/${reportId}`, {
        expires_in: "7d",
      });

      if (response.data.share_url) {
        navigator.clipboard.writeText(response.data.share_url);
        alert("Shareable link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing report:", err);
      setError("Failed to generate shareable link.");
    }
  };

  const getActiveStep = () => {
    const progress = Number(reportStatus?.progress ?? 0);
    if (progress < 20) return 0;
    if (progress < 40) return 1;
    if (progress < 60) return 2;
    if (progress < 80) return 3;
    if (progress < 100) return 3;
    return 4;
  };

  const templateEntries = useMemo(() => {
    const obj = templates && typeof templates === "object" ? templates : FALLBACK_TEMPLATES;
    return Object.entries(obj);
  }, [templates]);

  const canDownload = reportStatus?.status === "completed" && !!normalizeReportId(currentReport);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "success";
      case "failed": return "error";
      case "processing": return "warning";
      default: return "info";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle />;
      case "failed": return <ErrorOutline />;
      case "processing": return <HourglassEmpty />;
      default: return <Info />;
    }
  };

  return (
    <Container maxWidth="xl">
      {error && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError(null)}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Header */}
      <Paper sx={{ ...surfaceCard, p: 4, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              <SmartToy sx={{ mr: 2, verticalAlign: 'middle' }} />
              AI-Powered Report Generator
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
              Generate comprehensive ESG reports with AI-driven insights, real-time data analysis, 
              and actionable recommendations for Bertha House sustainability initiatives.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {loadingTemplates && (
              <Chip 
                icon={<HourglassEmpty />} 
                label="Loading templates..." 
                size="small" 
                variant="outlined" 
              />
            )}
            <Chip 
              icon={<SmartToy />} 
              label="Powered by Gemini AI" 
              color="primary" 
              sx={{ fontWeight: 600 }}
            />
            <Tooltip title="Refresh templates">
              <IconButton onClick={fetchReportTemplates} disabled={loadingTemplates}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Main Content - Report Templates */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ ...surfaceCard, p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h5" fontWeight={600}>
                Report Templates
              </Typography>
              <Badge 
                badgeContent={templateEntries.length} 
                color="primary"
                sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem', height: 20, minWidth: 20 } }}
              >
                <Typography variant="body2" color="text.secondary">
                  Available Templates
                </Typography>
              </Badge>
            </Box>

            <Grid container spacing={2}>
              {templateEntries.map(([key, t]) => {
                const isSelected = selectedTemplate === key;
                return (
                  <Grid item xs={12} md={6} key={key}>
                    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                      <Card
                        sx={{
                          cursor: "pointer",
                          border: isSelected ? 2 : 1,
                          borderColor: isSelected ? `${t.color}.main` : "divider",
                          bgcolor: isSelected ? `${t.color}.50` : "background.paper",
                          "&:hover": { 
                            boxShadow: 4,
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s ease'
                          },
                          transition: 'all 0.2s ease',
                          height: "100%",
                        }}
                        onClick={() => setSelectedTemplate(key)}
                      >
                        <CardContent>
                          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                            <Avatar sx={{ bgcolor: `${t.color}.main`, mr: 2 }}>
                              {t.icon}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" fontWeight={600}>
                                {t.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {t.description}
                              </Typography>
                            </Box>
                            {isSelected && (
                              <CheckCircle color="success" />
                            )}
                          </Box>

                          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                            <Chip
                              size="small"
                              label={t.estimatedTime}
                              color={t.color}
                              variant="outlined"
                            />
                            <Chip
                              size="small"
                              label={t.complexity}
                              color="default"
                              variant="outlined"
                            />
                            <Chip
                              size="small"
                              label={t.size}
                              color="default"
                              variant="outlined"
                            />
                          </Stack>

                          <Button
                            variant={isSelected ? "contained" : "outlined"}
                            color={t.color}
                            fullWidth
                            startIcon={<PlayCircle />}
                            onClick={(e) => {
                              e.stopPropagation();
                              generateReport(key, "pdf");
                            }}
                            disabled={isGenerating}
                          >
                            Generate
                          </Button>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>

          {/* Generation Status */}
          {(isGenerating || reportStatus) && (
            <Fade in={true}>
              <Paper sx={{ ...surfaceCard, p: 3, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h5" fontWeight={600}>
                    Report Generation Status
                  </Typography>
                  <Chip
                    icon={getStatusIcon(reportStatus?.status)}
                    label={reportStatus?.status?.toUpperCase() || "PROCESSING"}
                    color={getStatusColor(reportStatus?.status)}
                    variant="filled"
                  />
                </Box>

                <Stepper activeStep={Math.min(getActiveStep(), 4)} sx={{ mb: 4 }}>
                  <Step>
                    <StepLabel StepIconComponent={StepIconRenderer}>AI Analysis</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel StepIconComponent={StepIconRenderer}>Data Processing</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel StepIconComponent={StepIconRenderer}>Visualization</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel StepIconComponent={StepIconRenderer}>Report Assembly</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel StepIconComponent={StepIconRenderer}>Finalization</StepLabel>
                  </Step>
                </Stepper>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {reportStatus?.message || (isGenerating ? "Initializing report generation..." : "Ready")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      {Number(reportStatus?.progress ?? 0)}%
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={Number(reportStatus?.progress ?? 0)}
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      bgcolor: 'action.hover',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      }
                    }}
                  />
                </Box>

                {reportStatus?.status === "completed" && (
                  <Alert 
                    severity="success" 
                    icon={<CheckCircle fontSize="inherit" />}
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      Report generated successfully!
                    </Typography>
                    <Typography variant="caption">
                      Your ESG report is ready for download and sharing.
                    </Typography>
                  </Alert>
                )}

                {reportStatus?.status === "failed" && (
                  <Alert 
                    severity="error"
                    icon={<ErrorOutline fontSize="inherit" />}
                    sx={{ mb: 2 }}
                    action={
                      <Button color="inherit" size="small" onClick={() => generateReport(selectedTemplate, "pdf")}>
                        Retry
                      </Button>
                    }
                  >
                    <Typography variant="body2" fontWeight={600}>
                      Report generation failed
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                      {reportStatus.message?.split('\n')[0] || 'An error occurred while generating the report.'}
                    </Typography>
                    <Button size="small" onClick={() => setShowReportError(prev => !prev)} sx={{ textTransform: 'none' }}>
                      {showReportError ? 'Hide details' : 'Show details'}
                    </Button>
                    <Collapse in={showReportError} sx={{ mt: 1 }}>
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                        <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: 12, color: 'text.secondary' }}>
                          {String(reportStatus.message)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">If this persists, contact support with the report id.</Typography>
                      </Paper>
                    </Collapse>
                  </Alert>
                )}

                {canDownload && (
                  <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                      Download Options
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<PictureAsPdf />}
                          onClick={() => downloadReport("pdf")}
                          sx={{ textTransform: "none" }}
                        >
                          Download PDF
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<TableChart />}
                          onClick={() => downloadReport("excel")}
                          sx={{ textTransform: "none" }}
                        >
                          Download Excel
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Share />}
                          onClick={shareReport}
                          sx={{ textTransform: "none" }}
                        >
                          Share Report
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>
            </Fade>
          )}

          {/* Quick Actions */}
          <Paper sx={{ ...surfaceCard, p: 3, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
              Quick Actions
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<SmartToy />}
                  onClick={() => generateReport(selectedTemplate, "pdf")}
                  disabled={isGenerating}
                  sx={{ 
                    textTransform: "none",
                    py: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    }
                  }}
                >
                  {isGenerating ? "Generating..." : "Generate AI Report"}
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<Speed />}
                  onClick={generateQuickReport}
                  disabled={isGenerating}
                  sx={{ textTransform: "none", py: 2 }}
                >
                  Quick Snapshot
                </Button>
              </Grid>

              {currentReport && (
                <>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => setShowPreview(true)}
                      disabled={!normalizeReportId(currentReport)}
                      sx={{ textTransform: "none" }}
                    >
                      Preview
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Refresh />}
                      onClick={() => generateReport(selectedTemplate, "pdf")}
                      disabled={isGenerating}
                      sx={{ textTransform: "none" }}
                    >
                      Regenerate
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<GetApp />}
                      onClick={() => downloadReport("pdf")}
                      disabled={!canDownload}
                      sx={{ textTransform: "none" }}
                    >
                      Download
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Selected Template Details */}
          <Paper sx={{ ...surfaceCard, p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Template Details
            </Typography>
            
            {selectedTemplateMeta && (
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${selectedTemplateMeta.color}.main`, mr: 2 }}>
                    {selectedTemplateMeta.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedTemplateMeta.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedTemplateMeta.description}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Included Sections
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {selectedTemplateMeta.sections?.map((section, index) => (
                    <Chip
                      key={index}
                      label={section}
                      size="small"
                      sx={{ m: 0.5 }}
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Key Metrics
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {selectedTemplateMeta.metrics?.map((metric, index) => (
                    <Chip
                      key={index}
                      label={metric}
                      size="small"
                      sx={{ m: 0.5 }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Estimated time: {selectedTemplateMeta.estimatedTime}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Size: {selectedTemplateMeta.size}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          {/* Recent Reports */}
          <Paper sx={{ ...surfaceCard, p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h5" fontWeight={600}>
                Recent Reports
              </Typography>
              <Tooltip title="Refresh recent reports">
                <IconButton size="small" onClick={fetchRecentReports}>
                  <Refresh fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <RecentReports 
              reports={recentReports} 
              onSelectReport={(report) => {
                setCurrentReport(report);
                setShowPreview(true);
              }}
            />
          </Paper>

          {/* Generation History */}
          {generationHistory.length > 0 && (
            <Paper sx={{ ...surfaceCard, p: 3, borderRadius: 2 }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Generation History
              </Typography>
              <List dense>
                {generationHistory.slice(0, 3).map((item) => (
                  <ListItem key={item.id}>
                    <ListItemIcon>
                      {getStatusIcon(item.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={templates[item.template]?.name || item.template}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {new Date(item.timestamp).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color={getStatusColor(item.status)}>
                            {item.status.toUpperCase()}
                            {item.duration && ` • ${item.duration}s`}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Report Preview Dialog */}
      <Dialog 
        open={showPreview} 
        onClose={() => setShowPreview(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" fontWeight={600}>
            Report Preview
          </Typography>
          <IconButton onClick={() => setShowPreview(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {currentReport ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Description />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {currentReport.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Report ID: {normalizeReportId(currentReport)}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Template</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedTemplateMeta?.name || currentReport.template}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Format</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {currentReport.format?.toUpperCase() || 'PDF'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Chip 
                      size="small" 
                      label={reportStatus?.status || currentReport.status} 
                      color={getStatusColor(reportStatus?.status || currentReport.status)}
                      sx={{ mt: 0.5 }}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Size</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {currentReport.size || '2.5 MB'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {selectedTemplateMeta?.sections?.length ? (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Report Contents
                  </Typography>
                  <Grid container spacing={1}>
                    {selectedTemplateMeta.sections.map((section, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                          <CheckCircle color="success" sx={{ mr: 2 }} />
                          <Typography variant="body2">{section}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : null}

              {reportStatus?.status !== "completed" && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  Report preview will be available once generation is complete.
                </Alert>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Description sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No report selected for preview
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
          <Button 
            onClick={() => downloadReport("pdf")} 
            variant="contained" 
            startIcon={<Download />}
            disabled={!canDownload}
          >
            Download Report
          </Button>
          <Button 
            onClick={() => shareReport()} 
            variant="outlined"
            startIcon={<Share />}
            disabled={!canDownload}
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}