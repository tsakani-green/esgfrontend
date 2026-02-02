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
import { API_BASE as API_URL } from "../lib/api.js";
import logo from "../assets/AfricaESG.AI.png";

function safeDetail(detail) {
  if (!detail) return "";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d?.msg || d?.message || JSON.stringify(d)).join(", ");
  }
  if (typeof detail === "object") return JSON.stringify(detail);
  return String(detail);
}

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

  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(username, password);

      if (result?.success) {
        if (result.role === "admin") navigate("/admin");
        else navigate("/dashboard");
      } else {
        setError(String(result?.error || "Failed to login"));
      }
    } catch (err) {
      // extra safety: never render objects/arrays
      const msg =
        safeDetail(err?.response?.data?.detail) ||
        err?.message ||
        "Failed to login";
      setError(String(msg));
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
        `${API_URL}/api/auth/forgot-password`,
        { email: resetEmail },
        { timeout: 15000 }
      );

      setResetSuccess(true);
      setResetEmail("");
    } catch (err) {
      console.error("Password reset error:", err);
      const msg =
        safeDetail(err?.response?.data?.detail) ||
        err?.message ||
        "Failed to send reset email. Please try again.";
      setResetError(String(msg));
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
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              component="img"
              src={logo}
              alt="GreenBDG"
              sx={{
                width: 64,
                height: 64,
                objectFit: "contain",
                mx: "auto",
                mb: 2,
              }}
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
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Box textAlign="center" sx={{ mb: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => setForgotPasswordOpen(true)}
                sx={{ cursor: "pointer" }}
              >
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

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={handleForgotPasswordClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
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
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    backgroundColor: "success.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Email sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  Check Your Email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We've sent a password reset link to your email address. Please check your inbox and
                  follow the instructions to reset your password.
                </Typography>
              </Box>

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
