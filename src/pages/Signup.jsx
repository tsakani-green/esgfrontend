// frontend/src/pages/Signup.jsx
import React, { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
  Divider,
  Avatar,
  IconButton,
  InputAdornment,
  Grid,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Business,
  TrendingUp,
  Assessment,
  Nature,
  Launch,
} from '@mui/icons-material'
import { useUser } from '../contexts/UserContext'
import logo from '../assets/AfricaESG.AI.png'

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    company: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activationLink, setActivationLink] = useState('')
  const [loading, setLoading] = useState(false)

  const { signup } = useUser()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setActivationLink('')

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.full_name) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      // IMPORTANT: only send backend-expected fields (avoid 400 from extra fields like confirmPassword)
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        full_name: formData.full_name.trim(),
        company: (formData.company || '').trim(),
      }

      const result = await signup(payload)

      if (result?.success) {
        if (result.activation_link) {
          // Dev fallback: show activation link if backend couldn't send email
          setActivationLink(result.activation_link)
          setSuccess('🎉 Account created — activation link available (development fallback)')
          return
        }

        setSuccess('🎉 Account created! Please check your email for the activation link.')

        // Redirect to login (NOT dashboard) because user must activate first
        setTimeout(() => {
          navigate('/login')
        }, 5000)
      } else {
        setError(result?.error || 'Failed to create account')
      }
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #10B981 100%)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(15, 23, 42, 0.2) 0%, transparent 50%)',
        },
      }}
    >
      {/* Floating Elements */}
      <Box sx={{ position: 'absolute', top: '10%', left: '10%', opacity: 0.1 }}>
        <TrendingUp sx={{ fontSize: 80, color: 'white' }} />
      </Box>
      <Box sx={{ position: 'absolute', top: '60%', right: '15%', opacity: 0.1 }}>
        <Nature sx={{ fontSize: 100, color: 'white' }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '20%', left: '20%', opacity: 0.1 }}>
        <Assessment sx={{ fontSize: 90, color: 'white' }} />
      </Box>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
          }}
        >
          {/* Logo/Brand Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              component="img"
              src={logo}
              alt="AfricaESG.AI"
              sx={{
                width: 64,
                height: 64,
                objectFit: 'contain',
                mx: 'auto',
                mb: 2,
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              Join AfricaESG.AI
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              Create your ESG dashboard account
            </Typography>
          </Box>

          {/* Signup Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {success}

                {activationLink ? (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Activation link (click to open):
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Link href={activationLink} target="_blank" rel="noopener" sx={{ wordBreak: 'break-all' }}>
                        {activationLink}
                      </Link>

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigator.clipboard?.writeText(activationLink)}
                      >
                        Copy link
                      </Button>

                      <Button size="small" variant="contained" startIcon={<Launch />} onClick={() => window.open(activationLink, '_blank')}>
                        Open
                      </Button>
                    </Box>

                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      This link expires in 24 hours.
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Redirecting to login in 5 seconds...
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem' }}>
                      📧 Check your inbox for the activation email
                    </Typography>
                  </>
                )}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Company (Optional)"
              name="company"
              value={formData.company}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              helperText="Must be at least 6 characters"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((s) => !s)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 2,
                background: 'linear-gradient(135deg, #0F172A 0%, #10B981 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1E293B 0%, #059669 100%)',
                },
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" variant="body2">
                  Sign in
                </Link>
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> New accounts start with limited access. An administrator will assign portfolio access.
              </Typography>
            </Alert>

            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Benefits
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.light' }}>
                  <Assessment sx={{ fontSize: 18, color: 'success.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ESG Performance Tracking
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Monitor your environmental, social, and governance metrics
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'info.light' }}>
                  <TrendingUp sx={{ fontSize: 18, color: 'info.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    AI-Powered Insights
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Get intelligent recommendations for improvement
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'warning.light' }}>
                  <Nature sx={{ fontSize: 18, color: 'warning.main' }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Live Dashboard
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Real-time monitoring and reporting capabilities
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            ©GreenBDG Africa Pty Ltd. All rights reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Signup
