import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  Divider,
  Menu,
  Checkbox,
  Alert,
  Snackbar,
  Tooltip,
  Badge,
} from '@mui/material'
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Storage as StorageIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  FileCopy as FileCopyIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'

const AdminClients = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Acme Corp',
      role: 'admin',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-01-20',
      filesCount: 23,
      reportsCount: 5,
      esgScore: 85,
      subscription: 'Enterprise',
      storageUsed: 2.3,
      storageLimit: 10,
      monthlyGrowth: 12,
      industry: 'Manufacturing',
      address: '123 Business Ave, New York, NY',
      website: 'www.acme.com',
      lastLogin: '2024-01-20 14:30',
      loginCount: 145,
      documentsUploaded: 23,
      reportsGenerated: 5,
      dataPoints: 1250,
      complianceScore: 92,
      riskLevel: 'Low',
      notifications: 3,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 234-5678',
      company: 'Tech Industries',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-10',
      lastActive: '2024-01-19',
      filesCount: 45,
      reportsCount: 8,
      esgScore: 78,
      subscription: 'Professional',
      storageUsed: 4.7,
      storageLimit: 5,
      monthlyGrowth: 8,
      industry: 'Technology',
      address: '456 Tech Blvd, San Francisco, CA',
      website: 'www.techindustries.com',
      lastLogin: '2024-01-19 09:15',
      loginCount: 89,
      documentsUploaded: 45,
      reportsGenerated: 8,
      dataPoints: 2100,
      complianceScore: 88,
      riskLevel: 'Medium',
      notifications: 7,
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1 (555) 345-6789',
      company: 'Global Solutions',
      role: 'user',
      status: 'suspended',
      joinDate: '2024-01-05',
      lastActive: '2024-01-18',
      filesCount: 12,
      reportsCount: 2,
      esgScore: 65,
      subscription: 'Basic',
      storageUsed: 0.8,
      storageLimit: 2,
      monthlyGrowth: -3,
      industry: 'Consulting',
      address: '789 Consulting Dr, Chicago, IL',
      website: 'www.globalsolutions.com',
      lastLogin: '2024-01-18 16:45',
      loginCount: 34,
      documentsUploaded: 12,
      reportsGenerated: 2,
      dataPoints: 450,
      complianceScore: 72,
      riskLevel: 'High',
      notifications: 1,
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false)
  const [detailsTab, setDetailsTab] = useState(0)
  const [selectedClients, setSelectedClients] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRole, setFilterRole] = useState('all')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'user',
    status: 'active',
    subscription: 'Basic',
    industry: '',
    address: '',
    website: '',
  })

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus
    const matchesRole = filterRole === 'all' || client.role === filterRole
    
    return matchesSearch && matchesStatus && matchesRole
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'suspended':
        return 'error'
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error'
      case 'user':
        return 'primary'
      default:
        return 'default'
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low':
        return 'success'
      case 'Medium':
        return 'warning'
      case 'High':
        return 'error'
      default:
        return 'default'
    }
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      role: client.role,
      status: client.status,
      subscription: client.subscription,
      industry: client.industry,
      address: client.address,
      website: client.website,
    })
    setOpenDialog(true)
  }

  const handleViewDetails = (client) => {
    setSelectedClient(client)
    setClientDetailsOpen(true)
    setDetailsTab(0)
  }

  const handleSelectClient = (clientId) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }

  const handleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([])
    } else {
      setSelectedClients(filteredClients.map(client => client.id))
    }
  }

  const handleBulkAction = (action) => {
    const count = selectedClients.length
    
    switch (action) {
      case 'suspend':
        setClients(clients.map(client => 
          selectedClients.includes(client.id) 
            ? { ...client, status: 'suspended' }
            : client
        ))
        setSnackbar({ open: true, message: `${count} users suspended`, severity: 'success' })
        break
      case 'activate':
        setClients(clients.map(client => 
          selectedClients.includes(client.id) 
            ? { ...client, status: 'active' }
            : client
        ))
        setSnackbar({ open: true, message: `${count} users activated`, severity: 'success' })
        break
      case 'delete':
        setClients(clients.filter(client => !selectedClients.includes(client.id)))
        setSnackbar({ open: true, message: `${count} users deleted`, severity: 'success' })
        break
      case 'export':
        setSnackbar({ open: true, message: `Exporting ${count} users...`, severity: 'info' })
        break
    }
    
    setSelectedClients([])
    setAnchorEl(null)
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleAdd = () => {
    setEditingClient(null)
    setFormData({
      name: '',
      email: '',
      company: '',
      status: 'active',
    })
    setOpenDialog(true)
  }

  const handleSave = () => {
    if (editingClient) {
      setClients(clients.map(client =>
        client.id === editingClient.id
          ? { ...client, ...formData }
          : client
      ))
      setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' })
    } else {
      const newClient = {
        id: Date.now(),
        ...formData,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        filesCount: 0,
        reportsCount: 0,
        esgScore: 0,
        storageUsed: 0,
        storageLimit: 2,
        monthlyGrowth: 0,
        lastLogin: new Date().toISOString().replace('T', ' ').slice(0, 16),
        loginCount: 0,
        documentsUploaded: 0,
        reportsGenerated: 0,
        dataPoints: 0,
        complianceScore: 0,
        riskLevel: 'Medium',
        notifications: 0,
      }
      setClients([...clients, newClient])
      setSnackbar({ open: true, message: 'User created successfully', severity: 'success' })
    }
    setOpenDialog(false)
  }

  const handleDelete = (clientId) => {
    setClients(clients.filter(client => client.id !== clientId))
  }

  const handleToggleStatus = (client) => {
    const newStatus = client.status === 'active' ? 'suspended' : 'active'
    setClients(clients.map(c =>
      c.id === client.id ? { ...c, status: newStatus } : c
    ))
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage all users, view their data, and monitor platform activity
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              Add User
            </Button>
          </Box>
        </Box>
        
        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {clients.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Users
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {clients.filter(c => c.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Users
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <CheckCircleIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {clients.reduce((sum, c) => sum + c.filesCount, 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Files
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <StorageIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {Math.round(clients.reduce((sum, c) => sum + c.esgScore, 0) / clients.length)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg ESG Score
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <AssessmentIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search users by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {selectedClients.length > 0 && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<MoreVertIcon />}
                    onClick={handleMenuClick}
                  >
                    Bulk Actions ({selectedClients.length})
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleBulkAction('activate')}>
                      <CheckCircleIcon sx={{ mr: 1 }} /> Activate
                    </MenuItem>
                    <MenuItem onClick={() => handleBulkAction('suspend')}>
                      <BlockIcon sx={{ mr: 1 }} /> Suspend
                    </MenuItem>
                    <MenuItem onClick={() => handleBulkAction('export')}>
                      <DownloadIcon sx={{ mr: 1 }} /> Export
                    </MenuItem>
                    <MenuItem onClick={() => handleBulkAction('delete')} sx={{ color: 'error.main' }}>
                      <DeleteIcon sx={{ mr: 1 }} /> Delete
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedClients.length > 0 && selectedClients.length < filteredClients.length}
                    checked={selectedClients.length === filteredClients.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>User</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>ESG Score</TableCell>
                <TableCell>Storage</TableCell>
                <TableCell>Last Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedClients.includes(client.id)}
                      onChange={() => handleSelectClient(client.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {client.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {client.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {client.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <MailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{client.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="caption">{client.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {client.company}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {client.industry}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={client.role}
                      color={getRoleColor(client.role)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={client.status}
                      color={getStatusColor(client.status)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={600} sx={{ mr: 1 }}>
                        {client.esgScore}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={client.esgScore}
                        sx={{
                          width: 40,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 2,
                            backgroundColor: client.esgScore >= 80 ? 'success.main' :
                                             client.esgScore >= 60 ? 'warning.main' : 'error.main',
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {client.storageUsed}GB / {client.storageLimit}GB
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(client.storageUsed / client.storageLimit) * 100}
                        sx={{
                          width: '100%',
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {new Date(client.lastActive).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {client.loginCount} logins
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        onClick={() => handleViewDetails(client)}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit User">
                      <IconButton
                        onClick={() => handleEdit(client)}
                        color="info"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={client.status === 'active' ? 'Suspend' : 'Activate'}>
                      <IconButton
                        onClick={() => handleToggleStatus(client)}
                        color={client.status === 'active' ? 'error' : 'success'}
                        size="small"
                      >
                        {client.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDelete(client.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* User Details Dialog */}
      <Dialog 
        open={clientDetailsOpen} 
        onClose={() => setClientDetailsOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedClient && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: 'primary.main' }}>
                    {selectedClient.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      {selectedClient.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedClient.email} • {selectedClient.company}
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  label={selectedClient.status}
                  color={getStatusColor(selectedClient.status)}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </DialogTitle>

            <DialogContent>
              <Tabs value={detailsTab} onChange={(e, v) => setDetailsTab(v)} sx={{ mb: 3 }}>
                <Tab label="Overview" />
                <Tab label="Activity" />
                <Tab label="Documents" />
                <Tab label="Security" />
              </Tabs>

              {detailsTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Contact Information</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">Email</Typography>
                            <Typography variant="body2">{selectedClient.email}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">Phone</Typography>
                            <Typography variant="body2">{selectedClient.phone}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BusinessIcon sx={{ mr: 2, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">Company</Typography>
                            <Typography variant="body2">{selectedClient.company}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Account Details</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Role</Typography>
                          <Chip label={selectedClient.role} color={getRoleColor(selectedClient.role)} size="small" />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Subscription</Typography>
                          <Typography variant="body2">{selectedClient.subscription}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Member Since</Typography>
                          <Typography variant="body2">{new Date(selectedClient.joinDate).toLocaleDateString()}</Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {detailsTab === 1 && (
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Activity Summary</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700}>{selectedClient.loginCount}</Typography>
                        <Typography variant="caption" color="text.secondary">Total Logins</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700}>{selectedClient.documentsUploaded}</Typography>
                        <Typography variant="caption" color="text.secondary">Documents</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700}>{selectedClient.reportsGenerated}</Typography>
                        <Typography variant="caption" color="text.secondary">Reports</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700}>{selectedClient.dataPoints}</Typography>
                        <Typography variant="caption" color="text.secondary">Data Points</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              )}

              {detailsTab === 2 && (
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Document Management</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2">Storage Usage</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedClient.storageUsed}GB / {selectedClient.storageLimit}GB
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(selectedClient.storageUsed / selectedClient.storageLimit) * 100}
                    sx={{ mb: 3 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Last login: {new Date(selectedClient.lastLogin).toLocaleString()}
                  </Typography>
                </Card>
              )}

              {detailsTab === 3 && (
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Security Information</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Compliance Score</Typography>
                      <Chip label={selectedClient.complianceScore} color="success" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Risk Level</Typography>
                      <Chip label={selectedClient.riskLevel} color={getRiskColor(selectedClient.riskLevel)} size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Pending Notifications</Typography>
                      <Badge badgeContent={selectedClient.notifications} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </Box>
                  </Box>
                </Card>
              )}
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setClientDetailsOpen(false)}>Close</Button>
              <Button variant="contained" startIcon={<EditIcon />} onClick={() => handleEdit(selectedClient)}>
                Edit User
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingClient ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  label="Role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Subscription</InputLabel>
                <Select
                  value={formData.subscription}
                  onChange={(e) => setFormData({ ...formData, subscription: e.target.value })}
                  label="Subscription"
                >
                  <MenuItem value="Basic">Basic</MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                  <MenuItem value="Enterprise">Enterprise</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingClient ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default AdminClients
