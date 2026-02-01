import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Tabs,
  Tab,
  LinearProgress,
  alpha,
  useTheme,
  Container,
  Stack,
  Badge,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  Person,
  Email,
  Business,
  Phone,
  LocationOn,
  Edit,
  Save,
  Cancel,
  AccountCircle,
  Settings as SettingsIcon, // Renamed to avoid conflict
  Security,
  Notifications,
  VerifiedUser,
  CalendarToday,
  Language,
  CloudUpload,
  UploadFile,
  Download,
  Share,
  QrCode,
  Palette,
  DarkMode,
  LightMode,
  NotificationsActive,
  PrivacyTip,
  Help,
  Star,
  StarBorder,
  CreditCard,
  History,
  Devices,
  Security as SecurityIcon,
  Backup,
  Delete,
  ArrowForward,
  CheckCircle,
  Warning,
  Info,
  Cake,
  Badge as BadgeIcon,
  MilitaryTech,
  Work,
  School,
  LinkedIn,
  Twitter,
  Language as LanguageIcon,
  Public,
  AccessTime,
  Computer,
  Smartphone,
  Tablet,
  Visibility,
  MoreVert,
  FilterList,
  Search,
  Refresh,
  ZoomIn,
  Lock,
  LockOpen,
  Logout,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Analytics,
  Description,
  UploadFile as UploadFileIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

const ProfilePage = () => { // Changed component name
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activityFilter, setActivityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    fullName: user?.full_name || '',
    company: user?.company || '',
    phone: user?.phone || '',
    location: user?.location || '',
    jobTitle: user?.job_title || 'Sustainability Manager',
    department: user?.department || 'ESG & Compliance',
    bio: user?.bio || 'Passionate about creating sustainable solutions and driving environmental impact through data-driven decisions.',
    linkedin: user?.linkedin || '',
    twitter: user?.twitter || '',
    website: user?.website || '',
  });

  // Mock activity data
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'upload',
      action: 'Uploaded sustainability report',
      details: 'Quarterly ESG Report Q1 2024',
      timestamp: '2024-05-15T14:30:00Z',
      status: 'success',
      userAgent: 'Chrome on Windows',
      ipAddress: '192.168.1.100',
    },
    {
      id: 2,
      type: 'analysis',
      action: 'Completed carbon footprint analysis',
      details: 'Scope 1, 2 & 3 emissions',
      timestamp: '2024-05-14T10:15:00Z',
      status: 'success',
      userAgent: 'Safari on iPhone',
      ipAddress: '192.168.1.101',
    },
    {
      id: 3,
      type: 'report',
      action: 'Generated monthly ESG report',
      details: 'May 2024 Performance Report',
      timestamp: '2024-05-13T16:45:00Z',
      status: 'success',
      userAgent: 'Chrome on Windows',
      ipAddress: '192.168.1.100',
    },
    {
      id: 4,
      type: 'security',
      action: 'Changed password',
      details: 'Password updated successfully',
      timestamp: '2024-05-12T09:20:00Z',
      status: 'success',
      userAgent: 'Chrome on Windows',
      ipAddress: '192.168.1.100',
    },
    {
      id: 5,
      type: 'login',
      action: 'Logged in from new device',
      details: 'iPhone 14 Pro, San Francisco',
      timestamp: '2024-05-11T18:30:00Z',
      status: 'warning',
      userAgent: 'Safari on iPhone',
      ipAddress: '73.158.42.129',
    },
    {
      id: 6,
      type: 'export',
      action: 'Exported sustainability data',
      details: 'CSV format, 1250 records',
      timestamp: '2024-05-10T11:10:00Z',
      status: 'success',
      userAgent: 'Chrome on Windows',
      ipAddress: '192.168.1.100',
    },
    {
      id: 7,
      type: 'share',
      action: 'Shared dashboard with team',
      details: 'ESG Dashboard shared with 5 members',
      timestamp: '2024-05-09T15:45:00Z',
      status: 'success',
      userAgent: 'Chrome on Mac',
      ipAddress: '192.168.1.102',
    },
    {
      id: 8,
      type: 'failed_login',
      action: 'Failed login attempt',
      details: 'Incorrect password entered',
      timestamp: '2024-05-08T03:15:00Z',
      status: 'error',
      userAgent: 'Firefox on Windows',
      ipAddress: '89.216.34.78',
    },
  ]);

  const [connectedDevices, setConnectedDevices] = useState([
    {
      id: 1,
      device: 'Windows Desktop',
      browser: 'Chrome 123',
      location: 'New York, USA',
      lastActive: '2024-05-15T14:30:00Z',
      isCurrent: true,
      type: 'desktop',
    },
    {
      id: 2,
      device: 'iPhone 14 Pro',
      browser: 'Safari 17',
      location: 'San Francisco, USA',
      lastActive: '2024-05-14T10:15:00Z',
      isCurrent: false,
      type: 'mobile',
    },
    {
      id: 3,
      device: 'MacBook Pro',
      browser: 'Chrome 122',
      location: 'London, UK',
      lastActive: '2024-05-10T09:45:00Z',
      isCurrent: false,
      type: 'laptop',
    },
  ]);

  const [accountStats, setAccountStats] = useState({
    totalUploads: 156,
    totalReports: 42,
    totalLogins: 289,
    avgSessionTime: '45 min',
    lastBackup: '2024-05-14T22:00:00Z',
  });

  useEffect(() => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      fullName: user?.full_name || '',
      company: user?.company || '',
      phone: user?.phone || '',
      location: user?.location || '',
      jobTitle: user?.job_title || 'Sustainability Manager',
      department: user?.department || 'ESG & Compliance',
      bio: user?.bio || 'Passionate about creating sustainable solutions and driving environmental impact through data-driven decisions.',
      linkedin: user?.linkedin || '',
      twitter: user?.twitter || '',
      website: user?.website || '',
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccess('');
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSuccess('');
    setError('');
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Profile updated successfully!');
      
      const newActivity = {
        id: activities.length + 1,
        type: 'profile',
        action: 'Updated profile information',
        details: 'Personal and professional details updated',
        timestamp: new Date().toISOString(),
        status: 'success',
        userAgent: navigator.userAgent,
        ipAddress: '192.168.1.100',
      };
      setActivities(prev => [newActivity, ...prev]);
      
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleUpload = async () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          const newActivity = {
            id: activities.length + 1,
            type: 'backup',
            action: 'Created data backup',
            details: 'Complete system backup initiated',
            timestamp: new Date().toISOString(),
            status: 'success',
            userAgent: navigator.userAgent,
            ipAddress: '192.168.1.100',
          };
          setActivities(prev => [newActivity, ...prev]);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleExportData = () => {
    const newActivity = {
      id: activities.length + 1,
      type: 'export',
      action: 'Exported user data',
      details: 'Complete profile and activity data exported',
      timestamp: new Date().toISOString(),
      status: 'success',
      userAgent: navigator.userAgent,
      ipAddress: '192.168.1.100',
    };
    setActivities(prev => [newActivity, ...prev]);
    
    setSuccess('Data export initiated. You will receive an email shortly.');
  };

  const handleChangePassword = () => {
    const newActivity = {
      id: activities.length + 1,
      type: 'security',
      action: 'Password change requested',
      details: 'Password reset link sent to email',
      timestamp: new Date().toISOString(),
      status: 'success',
      userAgent: navigator.userAgent,
      ipAddress: '192.168.1.100',
    };
    setActivities(prev => [newActivity, ...prev]);
    
    setSuccess('Password reset link sent to your email.');
  };

  const handleLogoutDevice = (deviceId) => {
    setConnectedDevices(prev => prev.filter(device => device.id !== deviceId));
    
    const newActivity = {
      id: activities.length + 1,
      type: 'security',
      action: 'Logged out device',
      details: 'Remote device logout initiated',
      timestamp: new Date().toISOString(),
      status: 'success',
      userAgent: navigator.userAgent,
      ipAddress: '192.168.1.100',
    };
    setActivities(prev => [newActivity, ...prev]);
    
    setSuccess('Device logged out successfully.');
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      logout();
    } catch (err) {
      setError('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleRefreshActivities = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Activities refreshed successfully.');
    }, 1000);
  };

  const filteredActivities = activities.filter(activity => {
    if (activityFilter !== 'all' && activity.type !== activityFilter) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        activity.action.toLowerCase().includes(query) ||
        activity.details.toLowerCase().includes(query) ||
        activity.userAgent.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case 'upload': return <UploadFileIcon />;
      case 'analysis': return <Analytics />;
      case 'report': return <Description />;
      case 'security': return <Security />;
      case 'login': return <LockOpen />;
      case 'export': return <Download />;
      case 'share': return <Share />;
      case 'failed_login': return <Lock />;
      case 'backup': return <Backup />;
      case 'profile': return <Edit />;
      default: return <History />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'desktop': return <Computer />;
      case 'laptop': return <Computer />;
      case 'mobile': return <Smartphone />;
      case 'tablet': return <Tablet />;
      default: return <Devices />;
    }
  };

  const surfaceCard = {
    borderRadius: 3,
    border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
    background: theme.palette.background.paper,
    boxShadow: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: theme.shadows[1],
      borderColor: alpha(theme.palette.primary.main, 0.2),
    },
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      {/* Header Section */}
      <Paper sx={{ ...surfaceCard, p: { xs: 2.5, md: 3 }, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton 
                  size="small" 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    width: 24, 
                    height: 24,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  }}
                  onClick={handleEdit}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              }
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  border: `4px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>
            
            <Box>
              <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: -0.5, mb: 0.5 }}>
                {formData.fullName || user?.username}
              </Typography>
              <Typography variant="h6" color="primary" fontWeight={600} sx={{ mb: 0.5 }}>
                {formData.jobTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Business fontSize="small" /> {formData.company} • {formData.department}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip icon={<VerifiedUser />} label="Verified" size="small" color="success" variant="outlined" />
                <Chip icon={<Star />} label="Premium" size="small" color="warning" variant="outlined" />
                <Chip icon={<CalendarToday />} label={`Member since ${user?.created_at ? format(parseISO(user.created_at), 'MMM yyyy') : '2023'}`} size="small" variant="outlined" />
              </Stack>
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Share profile">
              <IconButton sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
                <Share />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export data">
              <IconButton 
                sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}
                onClick={handleExportData}
              >
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton 
                sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}
                onClick={() => setActiveTab(2)}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 2 }}>
          {formData.bio}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {formData.linkedin && (
            <Button 
              startIcon={<LinkedIn />} 
              variant="outlined" 
              size="small"
              href={formData.linkedin}
              target="_blank"
            >
              LinkedIn
            </Button>
          )}
          {formData.twitter && (
            <Button 
              startIcon={<Twitter />} 
              variant="outlined" 
              size="small"
              href={`https://twitter.com/${formData.twitter}`}
              target="_blank"
            >
              Twitter
            </Button>
          )}
          {formData.website && (
            <Button 
              startIcon={<LanguageIcon />} 
              variant="outlined" 
              size="small"
              href={formData.website}
              target="_blank"
            >
              Website
            </Button>
          )}
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ ...surfaceCard, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 'auto',
              px: 3,
              py: 2,
            },
          }}
        >
          <Tab icon={<Person />} label="Profile" />
          <Tab icon={<History />} label="Activity" />
          <Tab icon={<SettingsIcon />} label="Settings" />
          <Tab icon={<Security />} label="Security" />
        </Tabs>
      </Paper>

      {/* Success/Error Messages */}
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }} 
          onClose={() => setSuccess('')}
          action={
            <Button color="inherit" size="small">
              View
            </Button>
          }
        >
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Profile Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Left Column - Profile Information */}
          <Grid item xs={12} lg={8}>
            {/* Personal Information */}
            <Card sx={{ ...surfaceCard, mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person /> Personal Information
                  </Typography>
                  {!isEditing && (
                    <Button 
                      startIcon={<Edit />} 
                      variant="outlined" 
                      onClick={handleEdit}
                      size="small"
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>

                <Grid container spacing={3}>
                  {[
                    { label: 'Full Name', name: 'fullName', icon: <Person />, xs: 12, md: 6 },
                    { label: 'Email Address', name: 'email', icon: <Email />, xs: 12, md: 6 },
                    { label: 'Phone Number', name: 'phone', icon: <Phone />, xs: 12, md: 6 },
                    { label: 'Location', name: 'location', icon: <LocationOn />, xs: 12, md: 6 },
                    { label: 'Job Title', name: 'jobTitle', icon: <Work />, xs: 12, md: 6 },
                    { label: 'Department', name: 'department', icon: <School />, xs: 12, md: 6 },
                  ].map((field) => (
                    <Grid item xs={field.xs} md={field.md} key={field.name}>
                      <TextField
                        fullWidth
                        label={field.label}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <Box sx={{ mr: 1, color: 'text.secondary' }}>
                              {field.icon}
                            </Box>
                          ),
                        }}
                      />
                    </Grid>
                  ))}
                  
                  {/* Bio Textarea */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                </Grid>

                {isEditing && (
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      disabled={loading}
                      size="small"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                      onClick={handleSave}
                      disabled={loading}
                      size="small"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Social & Professional Links */}
            <Card sx={{ ...surfaceCard }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Public /> Social & Professional Links
                </Typography>
                <Grid container spacing={3}>
                  {[
                    { label: 'LinkedIn Profile', name: 'linkedin', icon: <LinkedIn />, placeholder: 'https://linkedin.com/in/username' },
                    { label: 'Twitter Handle', name: 'twitter', icon: <Twitter />, placeholder: '@username' },
                    { label: 'Website', name: 'website', icon: <LanguageIcon />, placeholder: 'https://example.com' },
                  ].map((field) => (
                    <Grid item xs={12} key={field.name}>
                      <TextField
                        fullWidth
                        label={field.label}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant="outlined"
                        size="small"
                        placeholder={field.placeholder}
                        InputProps={{
                          startAdornment: (
                            <Box sx={{ mr: 1, color: 'text.secondary' }}>
                              {field.icon}
                            </Box>
                          ),
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Stats and Quick Actions */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              {/* Account Statistics */}
              <Grid item xs={12} md={6} lg={12}>
                <Card sx={{ ...surfaceCard }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <Analytics /> Account Statistics
                    </Typography>
                    <Stack spacing={2}>
                      {[
                        { label: 'Total Uploads', value: accountStats.totalUploads, icon: <UploadFileIcon /> },
                        { label: 'Reports Generated', value: accountStats.totalReports, icon: <Description /> },
                        { label: 'Total Logins', value: accountStats.totalLogins, icon: <LockOpen /> },
                        { label: 'Avg Session Time', value: accountStats.avgSessionTime, icon: <AccessTime /> },
                      ].map((stat, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                              {stat.icon}
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>
                              {stat.label}
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight={700}>
                            {stat.value}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Quick Actions */}
              <Grid item xs={12} md={6} lg={12}>
                <Card sx={{ ...surfaceCard }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <ArrowForward /> Quick Actions
                    </Typography>
                <Stack spacing={1.5}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Security />}
                    onClick={handleChangePassword}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Change Password
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Notifications />}
                    onClick={() => setActiveTab(2)}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Notification Settings
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleExportData}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Export Data
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => setActiveTab(1)}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    View Activity Log
                  </Button>
                </Stack>
              </CardContent>
            </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Activity Tab */}
      {activeTab === 1 && (
        <Card sx={{ ...surfaceCard }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <History /> Activity Log
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track all account activities and security events
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  sx={{ width: 200 }}
                />
                
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Activities</MenuItem>
                    <MenuItem value="upload">Uploads</MenuItem>
                    <MenuItem value="security">Security</MenuItem>
                    <MenuItem value="login">Logins</MenuItem>
                    <MenuItem value="export">Exports</MenuItem>
                    <MenuItem value="report">Reports</MenuItem>
                  </Select>
                </FormControl>
                
                <IconButton onClick={handleRefreshActivities}>
                  <Refresh />
                </IconButton>
              </Box>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Activity</strong></TableCell>
                      <TableCell><strong>Details</strong></TableCell>
                      <TableCell><strong>Device & Location</strong></TableCell>
                      <TableCell><strong>Time</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell align="right"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredActivities.map((activity) => (
                      <TableRow key={activity.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                              {getActivityIcon(activity.type)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {activity.action}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {activity.details}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {activity.userAgent.split(' ')[0]}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            IP: {activity.ipAddress}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {format(parseISO(activity.timestamp), 'MMM d, yyyy')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(parseISO(activity.timestamp), 'h:mm a')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            size="small"
                            color={getStatusColor(activity.status)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View details">
                            <IconButton size="small">
                              <ZoomIn fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {filteredActivities.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No activities found matching your criteria
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ ...surfaceCard, mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Palette /> Appearance
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={darkMode}
                        onChange={handleThemeToggle}
                        icon={<LightMode />}
                        checkedIcon={<DarkMode />}
                      />
                    }
                    label="Dark Mode"
                  />
                  <FormControl fullWidth size="small">
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={language}
                      label="Language"
                      onChange={handleLanguageChange}
                      startAdornment={<Language sx={{ mr: 1, color: 'text.secondary' }} />}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Español</MenuItem>
                      <MenuItem value="fr">Français</MenuItem>
                      <MenuItem value="de">Deutsch</MenuItem>
                      <MenuItem value="zh">中文</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ ...surfaceCard }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationsActive /> Notifications
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications}
                        onChange={handleNotificationToggle}
                      />
                    }
                    label="Enable All Notifications"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email />
                        Email Notifications
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Notifications />
                        Push Notifications
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Analytics />
                        Weekly Reports
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ArrowForward />
                        Monthly Summaries
                      </Box>
                    }
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ ...surfaceCard, mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CloudUpload /> Data Management
                </Typography>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    onClick={handleUpload}
                    disabled={uploadProgress > 0 && uploadProgress < 100}
                  >
                    Backup Data
                  </Button>
                  {uploadProgress > 0 && (
                    <Box>
                      <LinearProgress variant="determinate" value={uploadProgress} sx={{ mb: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        Uploading... {uploadProgress}%
                      </Typography>
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Last backup: {format(parseISO(accountStats.lastBackup), 'MMM d, yyyy h:mm a')}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Button fullWidth variant="outlined" startIcon={<Download />} onClick={handleExportData}>
                    Export All Data
                  </Button>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<Delete />} 
                    color="error"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete Account
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Security Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ ...surfaceCard, mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon /> Password & Security
                </Typography>
                <Stack spacing={3}>
                  <Button fullWidth variant="contained" startIcon={<Security />} onClick={handleChangePassword}>
                    Change Password
                  </Button>
                  <Button fullWidth variant="outlined" startIcon={<PrivacyTip />}>
                    Set Up Two-Factor Authentication
                  </Button>
                  <Button fullWidth variant="outlined" startIcon={<Help />}>
                    Update Security Questions
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>


        </Grid>
      )}

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All your data will be permanently deleted.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Please confirm that you want to delete your account. This will:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
              <ListItemText primary="Permanently delete all your data" />
            </ListItem>
            <ListItem>
              <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
              <ListItemText primary="Remove all uploaded files and reports" />
            </ListItem>
            <ListItem>
              <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
              <ListItemText primary="Cancel your subscription" />
            </ListItem>
          </List>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Warning: This action is irreversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAccount} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Delete />}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;