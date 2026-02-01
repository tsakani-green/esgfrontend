import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Business,
  LockOutlined,
} from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const theme = useTheme();
  const { login, loading } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        // Redirect to admin dashboard if user is admin, otherwise to client dashboard
        const redirectUrl = result.role === 'admin' ? '/admin' : '/dashboard';
        navigate(redirectUrl);
      }, 1500);
    } else {
      setError(result.error);
    }
  };

  const demoUsers = [
    {
      username: 'admin',
      password: 'admin123',
      description: 'Admin - Can see all portfolios',
      portfolios: 'Dube Trade Port + Bertha House + BDO + Momentum Meersig',
    },
    {
      username: 'dube-user',
      password: 'dube123',
      description: 'Dube Trade Port Manager',
      portfolios: 'Dube Trade Port only',
    },
    {
      username: 'bertha-user',
      password: 'bertha123',
      description: 'Bertha House Manager',
      portfolios: 'Bertha House only',
    },
    {
      username: 'bdo-user',
      password: 'bdo123',
      description: 'BDO Manager',
      portfolios: 'BDO only',
    },
    {
      username: 'momentum-user',
      password: 'momentum123',
      description: 'Momentum Meersig Manager',
      portfolios: 'Momentum Meersig only',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.1)} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                mx: 'auto',
                mb: 2,
              }}
            >
              <Business sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              AfricaESG Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              User-specific portfolio access control
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              autoComplete="username"
              autoFocus
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              autoComplete="current-password"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontWeight: 700,
                textTransform: 'none',
              }}
              startIcon={loading ? <CircularProgress size={20} /> : <LockOutlined />}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>

          {/* Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Demo Users */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Demo Users
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Try these different user accounts to see portfolio-specific access:
            </Typography>
            
            {demoUsers.map((user, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  mb: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                }}
              >
                <Typography variant="subtitle2" fontWeight={700}>
                  {user.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Username: <strong>{user.username}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Password: <strong>{user.password}</strong>
                </Typography>
                <Typography variant="body2" color="primary">
                  Access: {user.portfolios}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Instructions */}
          <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>🔐 How it works:</strong> Each user can only see their assigned portfolio(s). 
              Admin users see all portfolios, while client users see only their specific portfolio.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
