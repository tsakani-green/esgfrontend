import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
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
  Search as SearchIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/material'

const FileManagement = () => {
  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'financial_report_q1.pdf',
      size: '2.4 MB',
      type: 'PDF',
      uploadDate: '2024-01-15',
      status: 'processed',
    },
    {
      id: 2,
      name: 'sales_data.xlsx',
      size: '1.8 MB',
      type: 'Excel',
      uploadDate: '2024-01-14',
      status: 'processing',
    },
    {
      id: 3,
      name: 'customer_analysis.csv',
      size: '856 KB',
      type: 'CSV',
      uploadDate: '2024-01-13',
      status: 'processed',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed':
        return 'success'
      case 'processing':
        return 'warning'
      case 'error':
        return 'error'
      default:
        return 'default'
    }
  }

  const handleDownload = (fileId) => {
    console.log('Downloading file:', fileId)
  }

  const handleDelete = (fileId) => {
    setFiles(files.filter(file => file.id !== fileId))
  }

  const handleView = (fileId) => {
    console.log('Viewing file:', fileId)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          File Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          href="/upload"
        >
          Upload New File
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search files..."
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
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id} hover>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.uploadDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={file.status}
                      color={getStatusColor(file.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleView(file.id)}
                      color="primary"
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDownload(file.id)}
                      color="success"
                      size="small"
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(file.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {filteredFiles.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            {searchTerm ? 'No files found matching your search.' : 'No files uploaded yet.'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2 }}
            href="/upload"
          >
            Upload Your First File
          </Button>
        </Paper>
      )}
    </Container>
  )
}

export default FileManagement
