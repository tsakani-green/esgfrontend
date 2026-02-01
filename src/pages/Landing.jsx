import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Alert,
  Fade,
  Slide,
} from '@mui/material';
import {
  Person,
  Email,
  Business,
  TrendingUp,
  Assessment,
  Nature,
  Launch,
  Dashboard,
  Settings,
  Logout,
  CheckCircle,
  Pending,
  Warning,
} from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import logo from '../assets/AfricaESG.AI.png';

const Landing = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';
    
    return greeting;
  };

  const getAccountStatus = () => {
    if (!user) return { status: 'unknown', color: 'grey', icon: <Person /> };
    
    if (!user.portfolio_access || user.portfolio_access.length === 0) {
      return { 
        status: 'pending', 
        color: 'warning', 
        icon: <Pending />,
        message: 'Portfolio access pending'
      };
    }
    
    return { 
      status: 'active', 
      color: 'success', 
      icon: <CheckCircle />,
      message: 'Full access granted'
    };
  };

  const accountStatus = getAccountStatus();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #10B981 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          opacity: 0.1,
        }}
      >
        <TrendingUp sx={{ fontSize: 100, color: 'white' }} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          opacity: 0.1,
        }}
      >
        <Nature sx={{ fontSize: 120, color: 'white' }} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          opacity: 0.1,
        }}
      >
        <Assessment sx={{ fontSize: 110, color: 'white' }} />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Header */}
        <Fade in={showContent} timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: 4,
              mb: 4,
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box
                  component="img"
                  src={logo}
                  alt="AfricaESG.AI"
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: 'contain',
                  }}
                />
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {getWelcomeMessage()}, {user?.full_name || user?.username || 'User'}! 👋
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Welcome to your AfricaESG.AI Dashboard
                  </Typography>
                </Box>
              </Box>
              
              <Button
                variant="outlined"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{ borderRadius: 2 }}
              >
                Logout
              </Button>
            </Box>

            {/* Account Status */}
            <Alert 
              severity={accountStatus.color} 
              sx={{ mb: 3 }}
              icon={accountStatus.icon}
            >
              <Typography variant="subtitle2">
                Account Status: {accountStatus.message || 'Active'}
              </Typography>
            </Alert>

            {/* User Info Cards */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Slide in={showContent} direction="up" timeout={1000}>
                  <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                        <Person sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        Personal Information
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Username:</strong> {user?.username || 'N/A'}<br />
                        <strong>Full Name:</strong> {user?.full_name || 'N/A'}<br />
                        <strong>Role:</strong> {user?.role || 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>

              <Grid item xs={12} md={4}>
                <Slide in={showContent} direction="up" timeout={1200}>
                  <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'info.main' }}>
                        <Business sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        Portfolio Access
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.portfolio_access && user.portfolio_access.length > 0 ? (
                          <>
                            <strong>Accessible Portfolios:</strong><br />
                            {user.portfolio_access.map((portfolio, index) => (
                              <span key={index}>
                                {index > 0 && ', '}
                                {portfolio}
                              </span>
                            ))}
                          </>
                        ) : (
                          <>
                            <Warning sx={{ fontSize: 20, color: 'warning.main', mb: 1 }} />
                            <br />
                            No portfolio access assigned yet.<br />
                            Please contact your administrator.
                          </>
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>

              <Grid item xs={12} md={4}>
                <Slide in={showContent} direction="up" timeout={1400}>
                  <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'success.main' }}>
                        <TrendingUp sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        Quick Actions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Available Features:</strong><br />
                        • ESG Dashboard<br />
                        • Carbon Emissions Tracking<br />
                        • AI-Powered Insights<br />
                        • Real-time Monitoring
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Action Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Slide in={showContent} direction="left" timeout={1600}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ width: 60, height: 60, mr: 3, bgcolor: 'primary.main' }}>
                      <Dashboard sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        Go to Dashboard
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Access your ESG dashboard and monitor real-time data
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<Launch />}
                    onClick={() => navigate('/dashboard')}
                    sx={{ py: 1.5 }}
                  >
                    Open Dashboard
                  </Button>
                </CardContent>
              </Card>
            </Slide>
          </Grid>

          <Grid item xs={12} md={6}>
            <Slide in={showContent} direction="right" timeout={1800}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ width: 60, height: 60, mr: 3, bgcolor: 'secondary.main' }}>
                      <Settings sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        Profile Settings
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manage your account settings and preferences
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={<Person />}
                    onClick={() => navigate('/profile')}
                    sx={{ py: 1.5 }}
                  >
                    Manage Profile
                  </Button>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        </Grid>

        {/* Progress Bar Animation */}
        <Box sx={{ mt: 4 }}>
          <Fade in={showContent} timeout={2000}>
            <Box>
              <Typography variant="body2" color="white" sx={{ mb: 1, textAlign: 'center' }}>
                Loading your personalized experience...
              </Typography>
              <LinearProgress 
                sx={{ 
                  height: 4, 
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                  }
                }} 
              />
            </Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
