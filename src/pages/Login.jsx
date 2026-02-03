import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Close, Email } from "@mui/icons-material";
import { useUser } from "../contexts/UserContext";
import axios from "axios";
import { API_BASE } from "../lib/api";
import logo from "../assets/AfricaESG.AI.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendActivationLink, setResendActivationLink] = useState("");

  const { login } = useUser();
  const navigate = useNavigate();

  const handleResendActivation = async () => {
    setResendMessage("");
    setResendActivationLink("");
    setResendLoading(true);

    try {
      const emailOrUsername = username || "";
      const res = await axios.post(
        `${API_BASE}/api/auth/resend-activation`,
        { email: emailOrUsername },
        { timeout: 15000 }
      );
      setResendMessage(res.data?.message || "Activation email sent. Check your inbox.");
      setResendActivationLink(res.data?.activation_link || "");
    } catch (err) {
      console.error("Resend activation error:", err);
      setResendMessage(err.response?.data?.detail || "Failed to send activation email");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(username, password);

      if (result?.success) {
        navigate(result.role === "admin" ? "/admin" : "/dashboard");
      } else {
        setError(result?.error || "Failed to login");
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetLoading(true);

    try {
      await axios.post(
        `${API_BASE}/api/auth/forgot-password`,
        { email: resetEmail },
        { timeout: 30000 }
      );
      setResetSuccess(true);
      setResetEmail("");
    } catch (err) {
      console.error("Password reset error:", err);
      setResetError(err.response?.data?.detail || "Failed to send reset email. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setResetEmail("");
    setResetError("");
    setResetSuccess(false);
    setResetLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              component="img"
              src={logo}
              alt="AfricaESG.AI"
              sx={{ width: 64, height: 64, objectFit: "contain", mx: "auto", mb: 2 }}
            />
            <Typography component="h1" variant="h4" gutterBottom>
              GreenBDG
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Live ESG dashboards + AI reporting
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Box sx={{ mb: 2 }}>
                <Alert severity="error">{error}</Alert>

                {error.toLowerCase().includes("not activated") && (
                  <Box sx={{ mt: 1, display: "flex", gap: 1, alignItems: "center", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Button size="small" onClick={handleResendActivation} disabled={resendLoading}>
                        {resendLoading ? "Sending..." : "Resend activation email"}
                      </Button>
                      {resendMessage && (
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {resendMessage}
                        </Typography>
                      )}
                    </Box>

                    {resendActivationLink && (
                      <Box sx={{ mt: 1, wordBreak: "break-all", textAlign: "center" }}>
                        <Link href={resendActivationLink} target="_blank" rel="noopener">
                          Open activation link
                        </Link>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}

            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Box textAlign="center" sx={{ mb: 2 }}>
              <Link component="button" variant="body2" onClick={() => setForgotPasswordOpen(true)} sx={{ cursor: "pointer" }}>
                Forgot your password?
              </Link>
            </Box>

            <Box textAlign="center">
              <Link component={RouterLink} to="/signup" variant="body2">
                Don't have an account? Sign up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Dialog open={forgotPasswordOpen} onClose={handleForgotPasswordClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Email sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h6">Reset Your Password</Typography>
            </Box>
            <IconButton onClick={handleForgotPasswordClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 0 }}>
          {!resetSuccess ? (
            <Box component="form" onSubmit={handleForgotPassword}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>

              {resetError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {resetError}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                margin="normal"
                required
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <DialogActions sx={{ px: 0, pb: 0 }}>
                <Button onClick={handleForgotPasswordClose}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={resetLoading || !resetEmail}>
                  {resetLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </DialogActions>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h6" gutterBottom>
                Check Your Email
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                We've sent a password reset link to your email address.
              </Typography>
              <DialogActions sx={{ justifyContent: "center", px: 0, pb: 0 }}>
                <Button onClick={handleForgotPasswordClose} variant="contained">
                  Got it
                </Button>
              </DialogActions>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Login;
