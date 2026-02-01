import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Alert,
  Button,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Email,
  Launch,
} from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { API_BASE as API_URL } from '../api/http.js';
import axios from 'axios';
import logo from '../assets/AfricaESG.AI.png';

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  
  const { login } = useUser();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid activation link. Please check your email or contact support.');
      return;
    }

    activateAccount();
  }, [token]);

  const activateAccount = async () => {
    try {
      // Call the activation API endpoint
      const response = await axios.post(`${API_URL}/api/auth/activate`, {
        token: token
      });

      if (response.data.success) {
        setUserInfo(response.data.user);
        setStatus('success');
        setMessage('Your account has been successfully activated! You can now log in and start using AfricaESG.AI.');
        
        // Optionally auto-login the user
        if (response.data.auto_login_token) {
          await login(response.data.auto_login_token);
          navigate('/dashboard');
        }
      } else {
        setStatus('error');
        setMessage(response.data.message || 'Activation failed. Please try again or contact support.');
      }
      
    } catch (error) {
      console.error('Activation error:', error);
      setStatus('error');
      
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.response?.status === 400) {
        setMessage('Invalid or expired activation token. Please request a new activation email.');
      } else if (error.response?.status === 404) {
        setMessage('Activation endpoint not found. Please contact support.');
      } else {
        setMessage('Activation failed. The link may have expired or is invalid. Please try again or contact support.');
      }
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #10B981 100%)',
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
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          {/* Logo */}
          <Box sx={{ mb: 4 }}>
            <Box
              component="img"
              src={logo}
              alt="AfricaESG.AI"
              sx={{
                width: 80,
                height: 80,
                objectFit: 'contain',
                mx: 'auto',
                mb: 2,
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Account Activation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AfricaESG.AI Dashboard
            </Typography>
          </Box>

          {/* Status Content */}
          <Box sx={{ mb: 4 }}>
            {status === 'loading' && (
              <Box>
                <CircularProgress size={60} sx={{ mb: 3, color: 'primary.main' }} />
                <Typography variant="h6" gutterBottom>
                  Activating Your Account...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we activate your account.
                </Typography>
              </Box>
            )}

            {status === 'success' && (
              <Box>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'success.light',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ color: 'success.main', fontWeight: 600 }}>
                  🎉 Activation Successful!
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {message}
                </Typography>
                
                {userInfo && (
                  <Box sx={{ 
                    bgcolor: 'grey.50', 
                    p: 2, 
                    borderRadius: 2, 
                    mb: 3,
                    textAlign: 'left'
                  }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Account Details:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Name:</strong> {userInfo.full_name}<br />
                      <strong>Email:</strong> {userInfo.email}<br />
                      <strong>Username:</strong> {userInfo.username}
                    </Typography>
                  </Box>
                )}
                
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleLogin}
                  startIcon={<Launch />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    background: 'linear-gradient(135deg, #0F172A 0%, #10B981 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1E293B 0%, #059669 100%)',
                    },
                  }}
                >
                  Go to Login
                </Button>
              </Box>
            )}

            {status === 'error' && (
              <Box>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'error.light',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <Error sx={{ fontSize: 48, color: 'error.main' }} />
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ color: 'error.main', fontWeight: 600 }}>
                  Activation Failed
                </Typography>
                <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                  {message}
                </Alert>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleLogin}
                  >
                    Go to Login
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* Help Information */}
          <Box sx={{ 
            bgcolor: 'info.50', 
            p: 3, 
            borderRadius: 2, 
            textAlign: 'left'
          }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 1, fontSize: 20 }} />
              Need Help?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              If you're having trouble activating your account, please contact our support team:
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Email:</strong> support@africaesg.ai<br />
              <strong>Subject:</strong> Account Activation Issue
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ActivateAccount;
