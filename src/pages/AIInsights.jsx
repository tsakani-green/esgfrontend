import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Alert,
  Skeleton,
  Stack,
  Paper,
} from "@mui/material";
import { Refresh, AutoAwesome, WarningAmber, TipsAndUpdates } from "@mui/icons-material";
import axios from "axios";
import { API_BASE } from "../lib/api";
import { useUser } from "../contexts/UserContext";

const SectionCard = ({ title, icon, subtitle, children, actions }) => {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1 }}>
          {icon}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          {actions ? <Box>{actions}</Box> : null}
        </Box>

        <Divider sx={{ my: 2 }} />

        {children}
      </CardContent>
    </Card>
  );
};

const Pill = ({ label, tone = "default" }) => {
  const color =
    tone === "good"
      ? "success"
      : tone === "warn"
      ? "warning"
      : tone === "bad"
      ? "error"
      : "default";

  return <Chip label={label} color={color} size="small" variant={tone === "default" ? "outlined" : "filled"} />;
};

const AIInsights = () => {
  const { token, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [insights, setInsights] = useState(null);

  const headers = useMemo(() => {
    const h = {};
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  // Choose the “current portfolio” if your app stores it.
  // If you don’t have this yet, it will simply request general insights.
  const portfolioId = useMemo(() => {
    // common patterns: localStorage, user.profile setting, etc.
    // You can replace this later with your real selected portfolio state.
    return localStorage.getItem("selected_portfolio") || "";
  }, []);

  const loadInsights = async ({ isRefresh = false } = {}) => {
    setError("");
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // ✅ Backend endpoint suggestion:
      // - /api/ai/insights (general)
      // - /api/ai/insights?portfolio_id=bertha-house (optional)
      //
      // If your backend endpoint differs, just change this URL.
      const url = `${API_BASE}/api/ai/insights`;
      const res = await axios.get(url, {
        headers,
        timeout: 20000,
        params: portfolioId ? { portfolio_id: portfolioId } : undefined,
      });

      setInsights(res.data || null);
    } catch (e) {
      // If endpoint isn’t ready yet, show a graceful UI instead of crashing.
      const status = e?.response?.status;
      if (status === 404) {
        setInsights(null);
        setError(
          "AI Insights endpoint not found on the backend yet. The page is ready — once the API is added, insights will appear here."
        );
      } else if (status === 401) {
        setError("You are not authenticated. Please log in again.");
      } else {
        setError(e?.response?.data?.detail || e?.message || "Failed to load AI insights.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ If backend not ready, display a professional “template” view
  const fallback = useMemo(() => {
    const company = user?.company || "your portfolio";
    return {
      meta: {
        generated_at: new Date().toISOString(),
        portfolio_id: portfolioId || null,
        confidence: "medium",
      },
      summary: {
        headline: "Operational and ESG insights are ready to review.",
        status: "monitor",
        highlights: [
          `Energy performance trends detected for ${company}.`,
          "Data quality checks recommended before month-end reporting.",
          "Priority actions identified to reduce emissions and improve reliability.",
        ],
      },
      risks: [
        {
          title: "Data completeness risk",
          severity: "warning",
          detail:
            "Some meters may have missing intervals. Validate ingestion schedule and ensure poller health status is stable.",
        },
        {
          title: "Peak demand exposure",
          severity: "warning",
          detail:
            "Potential peak demand spikes detected. Consider load shifting or demand response thresholds.",
        },
      ],
      opportunities: [
        {
          title: "Load optimization",
          impact: "high",
          detail:
            "Improve consumption patterns through scheduling of high-load equipment during off-peak windows.",
        },
        {
          title: "Reporting efficiency",
          impact: "medium",
          detail:
            "Automate monthly ESG narratives using the AI report generator to reduce admin time and improve consistency.",
        },
      ],
      recommendations: [
        "Confirm meter connectivity and health status from the /health endpoint.",
        "Review any sudden changes in kWh trends over the last 7–14 days.",
        "Set a monthly AI report cadence (and validate narrative against source data).",
      ],
    };
  }, [user, portfolioId]);

  const view = insights || fallback;

  const metaLine = useMemo(() => {
    const dt = view?.meta?.generated_at ? new Date(view.meta.generated_at) : null;
    const timeText = dt ? dt.toLocaleString() : "Unknown";
    const confidence = view?.meta?.confidence || "unknown";
    return { timeText, confidence };
  }, [view]);

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          AI Insights
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Actionable ESG signals, operational risks, and recommendations generated from your latest data.
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap" }}>
          <Pill label={`Generated: ${metaLine.timeText}`} />
          <Pill
            label={`Confidence: ${metaLine.confidence}`}
            tone={metaLine.confidence === "high" ? "good" : metaLine.confidence === "low" ? "warn" : "default"}
          />
          {portfolioId ? <Pill label={`Portfolio: ${portfolioId}`} /> : <Pill label="Portfolio: All" />}
        </Stack>
      </Box>

      {error ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SectionCard
            title="Executive Summary"
            icon={<AutoAwesome color="primary" />}
            subtitle="High-level view of current performance and priority actions."
            actions={
              <Button
                startIcon={<Refresh />}
                variant="outlined"
                onClick={() => loadInsights({ isRefresh: true })}
                disabled={refreshing}
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            }
          >
            {loading ? (
              <Box>
                <Skeleton height={28} width="70%" />
                <Skeleton height={18} width="90%" />
                <Skeleton height={18} width="85%" />
              </Box>
            ) : (
              <Box>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>{view?.summary?.headline || "Summary available."}</Typography>

                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Stack spacing={1}>
                    {(view?.summary?.highlights || []).slice(0, 6).map((h, idx) => (
                      <Typography key={idx} variant="body2">
                        • {h}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              </Box>
            )}
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard
            title="Key Risks"
            icon={<WarningAmber color="warning" />}
            subtitle="Issues that could impact ESG reporting quality, uptime, or compliance."
          >
            {loading ? (
              <Box>
                <Skeleton height={22} width="60%" />
                <Skeleton height={16} width="95%" />
                <Skeleton height={16} width="90%" />
              </Box>
            ) : (
              <Stack spacing={1.25}>
                {(view?.risks || []).length ? (
                  view.risks.slice(0, 6).map((r, idx) => (
                    <Paper key={idx} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 700, flex: 1 }}>{r.title}</Typography>
                        <Pill
                          label={(r.severity || "info").toUpperCase()}
                          tone={r.severity === "high" ? "bad" : r.severity === "warning" ? "warn" : "default"}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {r.detail}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Alert severity="success">No major risks detected right now.</Alert>
                )}
              </Stack>
            )}
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard
            title="Opportunities"
            icon={<TipsAndUpdates color="success" />}
            subtitle="Efficiency and ESG improvements with measurable impact."
          >
            {loading ? (
              <Box>
                <Skeleton height={22} width="60%" />
                <Skeleton height={16} width="95%" />
                <Skeleton height={16} width="90%" />
              </Box>
            ) : (
              <Stack spacing={1.25}>
                {(view?.opportunities || []).length ? (
                  view.opportunities.slice(0, 6).map((o, idx) => (
                    <Paper key={idx} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 700, flex: 1 }}>{o.title}</Typography>
                        <Pill
                          label={`IMPACT: ${(o.impact || "medium").toUpperCase()}`}
                          tone={o.impact === "high" ? "good" : o.impact === "low" ? "warn" : "default"}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {o.detail}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Alert severity="info">No opportunities were returned from the AI yet.</Alert>
                )}
              </Stack>
            )}
          </SectionCard>
        </Grid>

        <Grid item xs={12}>
          <SectionCard title="Recommended Actions" icon={<AutoAwesome color="primary" />} subtitle="What to do next.">
            {loading ? (
              <Box>
                <Skeleton height={18} width="90%" />
                <Skeleton height={18} width="80%" />
                <Skeleton height={18} width="85%" />
              </Box>
            ) : (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack spacing={1}>
                  {(view?.recommendations || []).length ? (
                    view.recommendations.slice(0, 10).map((rec, idx) => (
                      <Typography key={idx} variant="body2">
                        {idx + 1}. {rec}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No recommendations available yet.
                    </Typography>
                  )}
                </Stack>
              </Paper>
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIInsights;
