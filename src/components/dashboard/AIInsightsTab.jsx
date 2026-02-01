import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Backdrop,
  alpha,
  useTheme,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Tooltip,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import axios from 'axios';

import { API_BASE as API_URL } from '../../api/http.js';

export default function AIInsightsTab({ surfaceCard, energyUsageByMonth = [], liveReading, liveError, onGenerateReport, selectedPortfolioId, onAiSummaryGenerated }) {
  const [esgReport, setEsgReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // --- AI summary & templates (client quick-actions) ---
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiModel, setAiModel] = useState(null);
  const [aiProbeLoading, setAiProbeLoading] = useState(false);
  const [aiProbeResult, setAiProbeResult] = useState(null);

  useEffect(() => {
    // load per-portfolio templates when the tab mounts or portfolio changes
    const clientId = selectedPortfolioId || 'bertha-house';
    let mounted = true;
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/ai/templates/${clientId}/public`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (!mounted) return;
        setTemplates(res.data.templates || []);
        // prefer a sensible default
        const firstKey = (res.data.templates || [])[0]?.key;
        if (firstKey) setSelectedTemplateKey(firstKey);
      } catch (err) {
        console.warn('AI templates load failed:', err?.message || err);
      }
    };

    // fetch AI status (enables/disables AI UI)
    const fetchAiStatus = async () => {
      try {
        const s = await axios.get(`${API_URL}/api/ai/status`, { timeout: 3000 });
        if (mounted && s?.data) {
          setAiEnabled(Boolean(s.data.enabled));
          setAiModel(s.data.model || null);
        }
      } catch (err) {
        setAiEnabled(false);
      }
    };

    fetchTemplates();
    fetchAiStatus();
    return () => { mounted = false };
  }, [selectedPortfolioId]);

  const generateAiSummary = async (opts = {}) => {
    setAiBusy(true);
    setAiError(null);
    setAiSummary(null);
    try {
      const payload = opts.templateKey
        ? { template_key: opts.templateKey, clientId: selectedPortfolioId || 'bertha-house' }
        : { instruction: opts.instruction || 'Create a short 3-line executive summary focusing on carbon, cost-saving opportunities and 3 practical actions.', mode: 'summary', clientId: selectedPortfolioId || 'bertha-house' };

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const resp = await axios.post(`${API_URL}/api/ai/assistant-public`, payload, { headers, timeout: 20000 });

      const summary = resp.data?.result?.answer || resp.data?.result?.summary || resp.data?.summary || resp.data?.text || (typeof resp.data === 'string' ? resp.data : null);
      setAiSummary(summary || 'No summary returned');
      if (onAiSummaryGenerated) onAiSummaryGenerated(summary || '');
      return summary;
    } catch (err) {
      console.error('generateAiSummary failed', err);
      setAiError(err.response?.data?.detail || err.message || 'AI summary failed');
      throw err;
    } finally {
      setAiBusy(false);
    }
  };

  const fetchESGReport = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_URL}/api/analytics/esg-report`);
      setEsgReport(response.data);
    } catch (err) {
      console.error('Error fetching ESG report:', err);
      setError(err.response?.data?.detail || 'Failed to load ESG report');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchESGReport();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchESGReport();
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const response = await axios.post(`${API_URL}/api/gemini/generate-report`, {
        clientId: "bertha-house",
        reportType: "comprehensive",
        companyData: {
          name: "Bertha House",
          industry: "Commercial Real Estate",
          location: "Cape Town, South Africa",
          size: "Medium",
          employees: 150
        }
      });
      
      if (onGenerateReport) {
        onGenerateReport(response.data);
      }
      
      // Update the report data
      setEsgReport(prev => ({
        ...prev,
        report: response.data
      }));
      
      alert("AI report generated successfully!");
    } catch (err) {
      console.error('Error generating report:', err);
      alert(`Failed to generate report: ${err.message || 'Unknown error'}. Please check backend configuration.`);
      setError(err.message || 'Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const powerKw = liveReading?.power_kw || 0;
  const currentUsageStatus = powerKw > 3.0 ? "high" : powerKw > 1.5 ? "moderate" : "low";
  
  const usageColors = {
    high: "error",
    moderate: "warning", 
    low: "success"
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, flexDirection: 'column', gap: 2 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading AI insights...
        </Typography>
      </Box>
    );
  }

  const renderScoreIndicator = (score, max = 10) => {
    const percentage = (score / max) * 100;
    let color = "error";
    if (percentage >= 70) color = "success";
    else if (percentage >= 50) color = "warning";
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={percentage} 
          sx={{ width: 80, height: 8, borderRadius: 4 }}
          color={color}
        />
        <Typography variant="body2" fontWeight={600}>
          {score.toFixed(1)}/{max}
        </Typography>
      </Box>
    );
  };

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <Paper sx={{ ...surfaceCard, p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ color: 'white', mb: 0.5 }}>
                <SmartToy sx={{ mr: 1, verticalAlign: 'middle' }} />
                Bertha House AI Insights
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Gemini-powered real-time ESG analysis and intelligent recommendations
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                size="small"
                icon={<SmartToy fontSize="small" />}
                label={aiEnabled ? `Gemini AI • ${aiModel || 'live'}` : 'AI (mock) — configure GEMINI_API_KEY'}
                sx={{ color: 'white', borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)' }}
                color={aiEnabled ? 'success' : 'default'}
              />

              <Tooltip title={aiEnabled ? 'Refresh insights' : 'AI not configured — enable GEMINI_API_KEY on the backend'}>
                <span>
                  <IconButton
                    size="small"
                    onClick={handleRefresh}
                    disabled={refreshing || !aiEnabled}
                    sx={{ color: 'white' }}
                  >
                    <Refresh />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title={aiEnabled ? 'Run a quick AI connectivity test' : 'AI not configured'}>
                <span>
                  <IconButton
                    size="small"
                    onClick={async () => {
                      setAiProbeLoading(true)
                      setAiProbeResult(null)
                      try {
                        const res = await axios.get(`${API_URL}/api/ai/status?probe=1`, { timeout: 5000 })
                        setAiProbeResult(res.data)
                      } catch (err) {
                        setAiProbeResult({ probe_ok: false, probe_error: err.message || String(err) })
                      } finally {
                        setAiProbeLoading(false)
                      }
                    }}
                    disabled={!aiEnabled || aiProbeLoading}
                    sx={{ color: 'white' }}
                  >
                    {aiProbeLoading ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />}
                  </IconButton>
                </span>
              </Tooltip>

              {aiProbeResult && (
                <Box sx={{ mt: 2 }}>
                  {aiProbeResult.probe_ok ? (
                    <Alert severity="success">Live AI reachable — model: {aiProbeResult.model || 'unknown'}</Alert>
                  ) : (
                    <Alert severity="warning">AI probe failed: {aiProbeResult.probe_error || 'no details'}</Alert>
                  )}
                </Box>
              )}
            </Box>
          </Box>

          {liveError && (
            <Alert severity="warning" sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              Live meter data not available. AI insights based on historical trends.
            </Alert>
          )}
        </Paper>
      </Grid>

      {/* Live Summary Dashboard */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ ...surfaceCard, p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>Live Energy Dashboard</Typography>
            <Chip 
              icon={<Bolt fontSize="small" />} 
              label="Real-time" 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          
          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Current Power Consumption
              </Typography>
              <Typography variant="h4" fontWeight={700} color={usageColors[currentUsageStatus]}>
                {powerKw ? `${Number(powerKw).toFixed(2)} kW` : "—"}
              </Typography>
              <Chip 
                icon={currentUsageStatus === "high" ? <Warning /> : <CheckCircle />}
                label={currentUsageStatus === "high" ? "High Usage" : 
                       currentUsageStatus === "moderate" ? "Moderate Usage" : "Optimal Usage"}
                color={usageColors[currentUsageStatus]}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                AI Monitoring Status
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip 
                  icon={<SmartToy fontSize="small" />} 
                  label="ESG Analysis" 
                  color="success" 
                  size="small" 
                  variant="outlined"
                />
                <Chip 
                  icon={<TrendingUp fontSize="small" />} 
                  label="Trend Tracking" 
                  color="info" 
                  size="small" 
                  variant="outlined"
                />
                <Chip 
                  icon={<Lightbulb fontSize="small" />} 
                  label="Recommendations" 
                  color="warning" 
                  size="small" 
                  variant="outlined"
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Last Updated
              </Typography>
              <Typography variant="body2">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>

      {/* ESG Executive Summary */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ ...surfaceCard, p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>ESG Performance Summary</Typography>
            {esgReport?.report?.executiveSummary?.overallESGScore && (
              <Chip 
                label={`Score: ${esgReport.report.executiveSummary.overallESGScore}/10`}
                color={esgReport.report.executiveSummary.overallESGScore >= 8 ? "success" : 
                       esgReport.report.executiveSummary.overallESGScore >= 6 ? "warning" : "error"}
                size="medium"
              />
            )}
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            AI-generated ESG performance overview for Bertha House
          </Typography>

          {/* Quick AI summary (template-aware) */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mt: 1, mb: 2 }}>
            <Box sx={{ minWidth: 220 }}>
              <Select
                fullWidth
                size="small"
                value={selectedTemplateKey || ''}
                onChange={(e) => setSelectedTemplateKey(e.target.value)}
                displayEmpty
                renderValue={(v) => v ? (templates.find(t => t.key === v)?.name || v) : 'Use default prompt'}
                sx={{ bgcolor: 'background.paper' }}
              >
                <MenuItem value="">Use default prompt</MenuItem>
                {templates.map((t) => (
                  <MenuItem key={t.key} value={t.key}>{t.name}</MenuItem>
                ))}
              </Select>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={aiBusy ? <CircularProgress size={16} /> : <SmartToy />}
              onClick={async () => {
                try {
                  await generateAiSummary({ templateKey: selectedTemplateKey });
                } catch (err) {
                  // error state handled inside generateAiSummary
                }
              }}
              disabled={aiBusy}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              {aiBusy ? 'Generating…' : 'Generate AI Summary'}
            </Button>

            {aiSummary && (
              <Button
                variant="outlined"
                startIcon={<Description />}
                onClick={async () => {
                  // simple client-side PDF export for the summary
                  try {
                    const { default: html2canvas } = await import('html2canvas');
                    const { jsPDF } = await import('jspdf');
                    const node = document.createElement('div');
                    node.style.width = '800px';
                    node.style.padding = '20px';
                    node.style.fontFamily = 'Inter, Roboto, Helvetica, Arial, sans-serif';
                    node.style.background = '#ffffff';
                    node.innerHTML = `<h2>AI Executive Summary — ${selectedPortfolioId || 'Portfolio'}</h2><div>${aiSummary.replace(/\n/g, '<br/>')}</div>`;
                    document.body.appendChild(node);
                    const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff' });
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const imgProps = pdf.getImageProperties(imgData);
                    const imgWidth = pageWidth - 80;
                    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                    pdf.addImage(imgData, 'PNG', 40, 40, imgWidth, imgHeight);
                    pdf.save(`${(selectedPortfolioId || 'portfolio')}-ai-summary.pdf`);
                    node.remove();
                  } catch (e) {
                    console.error('Export failed', e);
                    alert('PDF export failed');
                  }
                }}
                sx={{ textTransform: 'none' }}
              >
                Export PDF
              </Button>
            )}

            {aiError && <Typography color="error" variant="caption">{aiError}</Typography>}
          </Box>

          <Divider sx={{ my: 2 }} />

          {esgReport?.report ? (
            <Box>
              <Typography variant="body2" sx={{ mb: 3, fontStyle: 'italic', lineHeight: 1.6 }}>
                {typeof esgReport.report.executiveSummary?.executiveSummary === 'string' 
                  ? esgReport.report.executiveSummary.executiveSummary
                  : esgReport.report.executiveSummary?.executiveSummary?.toString() || 
                    esgReport.report.executiveSummary?.toString() || 
                    'ESG report data available'
                }
              </Typography>

              {/* Quick AI summary (generated) */}
              {aiSummary && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>AI — Executive Summary (quick)</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{aiSummary}</Typography>
                </Box>
              )}
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'primary.main' }}>
                    Key Achievements:
                  </Typography>
                  <Stack spacing={1}>
                    {esgReport.report.executiveSummary?.keyAchievements?.map((achievement, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <CheckCircle fontSize="small" color="success" sx={{ mt: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {achievement}
                        </Typography>
                      </Box>
                    )) || (
                      <Typography variant="body2" color="text.secondary">
                        No achievements data available
                      </Typography>
                    )}
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'warning.main' }}>
                    Areas for Improvement:
                  </Typography>
                  <Stack spacing={1}>
                    {esgReport.report.executiveSummary?.areasForImprovement?.map((area, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <Warning fontSize="small" color="warning" sx={{ mt: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {area}
                        </Typography>
                      </Box>
                    )) || (
                      <Typography variant="body2" color="text.secondary">
                        No improvement areas identified
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <SmartToy sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No ESG report data available. Generate a report to see insights.
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* ESG Pillar Performance */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ ...surfaceCard, p: 3, height: '100%' }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Environmental Performance</Typography>
          <Divider sx={{ my: 2 }} />
          
          {esgReport?.report?.detailedAnalysis?.environmental ? (
            <Stack spacing={2.5}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Overall Score:</Typography>
                  {renderScoreIndicator(esgReport.report.detailedAnalysis.environmental.score)}
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(esgReport.report.detailedAnalysis.environmental.score / 10) * 100}
                  color="success"
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Key Metrics:</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Carbon Intensity</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {esgReport.report.detailedAnalysis.environmental.metrics?.carbonIntensity || '—'}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Energy Eff.</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {esgReport.report.detailedAnalysis.environmental.metrics?.energyEfficiency || '—'}
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Trend:</Typography>
                <Chip 
                  icon={<TrendingUp />} 
                  label="Improving" 
                  size="small" 
                  color="success" 
                  variant="outlined"
                />
              </Box>
            </Stack>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Nature sx={{ fontSize: 40, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                Environmental data loading...
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Social & Governance Performance */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ ...surfaceCard, p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <People color="info" />
            <Typography variant="h6" fontWeight={600}>Social & Governance</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          
          {esgReport?.report ? (
            <Stack spacing={2.5}>
              {/* Social Metrics */}
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Social Performance:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip 
                    size="small"
                    label={esgReport.report.social_impact?.employee_engagement || 
                           esgReport.report.detailedAnalysis?.social?.score ? 
                           `${esgReport.report.detailedAnalysis.social.score}/10` : 'Good'}
                    color="success"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Employee Engagement
                  </Typography>
                </Box>
              </Box>
              
              {/* Governance Metrics */}
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Governance:</Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip 
                      size="small"
                      label={esgReport.report.governance_compliance?.reporting_status || 'Compliant'}
                      color={esgReport.report.governance_compliance?.reporting_status === 'Compliant' ? "success" : "warning"}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Reporting Status
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip 
                      size="small"
                      label={esgReport.report.governance_compliance?.audit_readiness || 'Ready'}
                      color={esgReport.report.governance_compliance?.audit_readiness === 'Ready' ? "success" : "warning"}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Audit Readiness
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              
              {/* Compliance Status */}
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Compliance:</Typography>
                <Chip 
                  icon={<Assessment fontSize="small" />}
                  label="GRI & SASB Aligned"
                  size="small"
                  color="info"
                  variant="outlined"
                />
              </Box>
            </Stack>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <People sx={{ fontSize: 40, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                Social & Governance data loading...
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Strategic Recommendations */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ ...surfaceCard, p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Lightbulb color="warning" />
            <Typography variant="h6" fontWeight={600}>AI Recommendations</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            Smart suggestions based on real-time analysis
          </Typography>

          <Divider sx={{ my: 2 }} />

          {esgReport?.report ? (
            <Box>
              <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: 'primary.main' }}>
                {esgReport.report.forward_looking || 
                 "Based on current performance and trends, focus on these strategic areas:"}
              </Typography>
              
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Priority Actions:
              </Typography>
              <Stack spacing={1.5}>
                {(esgReport.report.recommendations || []).slice(0, 3).map((rec, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      bgcolor: i === 0 ? 'error.main' : i === 1 ? 'warning.main' : 'info.main',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                        {i + 1}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {rec}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              
              {esgReport.report.predictions && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="caption" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
                    Next Quarter Prediction:
                  </Typography>
                  <Typography variant="body2">
                    Score: <strong>{esgReport.report.predictions.nextQuarterScore}/10</strong> 
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      (Confidence: {(esgReport.report.predictions.confidence * 100).toFixed(0)}%)
                    </Typography>
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Lightbulb sx={{ fontSize: 40, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                Generating recommendations...
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Report Generation & Actions */}
      <Grid item xs={12}>
        <Paper sx={{ ...surfaceCard, p: 3, background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Generate Comprehensive ESG Report
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create a detailed, AI-powered ESG report with actionable insights, 
                  performance metrics, and strategic recommendations for Bertha House.
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip label="PDF Export" size="small" variant="outlined" />
                  <Chip label="Excel Data" size="small" variant="outlined" />
                  <Chip label="Executive Summary" size="small" variant="outlined" />
                  <Chip label="Full Analysis" size="small" variant="outlined" />
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  disabled={!esgReport}
                >
                  Export Data
                </Button>
                <Tooltip title={aiEnabled ? 'Generate AI report' : 'AI not configured — enable GEMINI_API_KEY on the backend'}>
                  <span>
                    <Button
                      variant="contained"
                      startIcon={generatingReport ? <CircularProgress size={20} /> : <SmartToy />}
                      onClick={async () => { if (!aiEnabled) return alert('AI not configured on backend. See README for setup.'); await handleGenerateReport(); }}
                      disabled={generatingReport || !aiEnabled}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        }
                      }}
                    >
                      {generatingReport ? 'Generating...' : aiEnabled ? 'Generate AI Report' : 'AI Disabled'}
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Error State */}
      {error && (
        <Grid item xs={12}>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={fetchESGReport}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Grid>
      )}
    </Grid>
  );
}