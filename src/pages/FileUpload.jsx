import React, { useState, useCallback } from 'react'
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
} from '@mui/material'
import {
  CloudUpload,
  InsertDriveFile,
  CheckCircle,
  Error,
  Delete,
  UploadFile,
} from '@mui/icons-material'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

import { API_BASE as API_URL } from '../api/http.js'

const FileUpload = () => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        progress: 0,
      }))
      setFiles(prev => [...prev, ...newFiles])
    },
  })

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const uploadFiles = async () => {
    if (files.length === 0) {
      setError('Please select files to upload')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    const uploadedFiles = []

    try {
      if (files.length === 1) {
        // Single file upload
        const fileObj = files[0]
        
        setFiles(prev =>
          prev.map(f =>
            f.id === fileObj.id
              ? { ...f, status: 'uploading', progress: 0 }
              : f
          )
        )

        const formData = new FormData()
        formData.append('file', fileObj.file)

        const response = await axios.post(`${API_URL}/api/files/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            setFiles(prev =>
              prev.map(f =>
                f.id === fileObj.id
                  ? { ...f, progress: percentCompleted }
                  : f
              )
            )
          },
        })

        setFiles(prev =>
          prev.map(f =>
            f.id === fileObj.id
              ? { ...f, status: 'completed', progress: 100, data: response.data }
              : f
          )
        )

        uploadedFiles.push(response.data)
      } else {
        // Bulk upload
        const formData = new FormData()
        files.forEach(fileObj => {
          if (fileObj.status !== 'completed') {
            formData.append('files', fileObj.file)
          }
        })

        // Update all files to uploading status
        setFiles(prev =>
          prev.map(f =>
            f.status !== 'completed'
              ? { ...f, status: 'uploading', progress: 50 }
              : f
          )
        )

        const response = await axios.post(`${API_URL}/api/files/bulk-upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        // Update files based on bulk upload results
        setFiles(prev =>
          prev.map(f => ({
            ...f,
            status: f.status === 'completed' ? 'completed' : 'completed',
            progress: 100,
            data: response.data
          }))
        )

        uploadedFiles.push(response.data)
      }
    } catch (err) {
      setFiles(prev =>
        prev.map(f =>
          f.status === 'uploading'
            ? { ...f, status: 'error', error: err.response?.data?.detail || 'Upload failed' }
            : f
        )
      )
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
      if (uploadedFiles.length > 0) {
        const totalInvoices = uploadedFiles.reduce((sum, result) => 
          sum + (result.invoices_saved || result.total_invoices_saved || 0), 0
        )
        setSuccess(`Successfully uploaded ${uploadedFiles.length} file(s) and processed ${totalInvoices} invoice(s)`)
      }
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Upload ESG Data
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Upload your CSV, Excel, JSON, or PDF files for ESG analysis
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Paper
        {...getRootProps()}
        sx={{
          p: 6,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          backgroundColor: isDragActive ? 'primary.light' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.3s',
          mb: 4,
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          or click to browse files
        </Typography>
        <Chip
          label="CSV, XLSX, JSON, PDF, TXT"
          color="primary"
          variant="outlined"
        />
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Maximum file size: 50MB
        </Typography>
      </Paper>

      {files.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Selected Files ({files.length})
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setFiles([])}
              disabled={uploading}
            >
              Clear All
            </Button>
          </Box>

          <List>
            {files.map((fileObj) => (
              <ListItem
                key={fileObj.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: 'background.default',
                }}
              >
                <ListItemIcon>
                  <InsertDriveFile color="action" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      {fileObj.file.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" display="block">
                        Size: {formatFileSize(fileObj.file.size)}
                      </Typography>
                      {fileObj.status === 'uploading' && (
                        <LinearProgress
                          variant="determinate"
                          value={fileObj.progress}
                          sx={{ mt: 1 }}
                        />
                      )}
                      {fileObj.error && (
                        <Typography variant="caption" color="error">
                          {fileObj.error}
                        </Typography>
                      )}
                      {fileObj.data && fileObj.data.invoices_saved > 0 && (
                        <Typography variant="caption" color="success.main" display="block" sx={{ mt: 1 }}>
                          {fileObj.data.invoices_saved} invoices processed with ESG analysis
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {fileObj.status === 'completed' && (
                    <CheckCircle color="success" />
                  )}
                  {fileObj.status === 'error' && <Error color="error" />}
                  <Chip
                    label={fileObj.status}
                    size="small"
                    color={
                      fileObj.status === 'completed'
                        ? 'success'
                        : fileObj.status === 'error'
                        ? 'error'
                        : 'default'
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeFile(fileObj.id)}
                    disabled={uploading && fileObj.status === 'uploading'}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>

          <Button
            variant="contained"
            size="large"
            startIcon={<UploadFile />}
            onClick={uploadFiles}
            disabled={uploading || files.length === 0}
            fullWidth
            sx={{ mt: 2 }}
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} File(s)`}
          </Button>
        </Paper>
      )}

      {/* Supported Formats */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Supported Formats
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Chip label="CSV" color="primary" sx={{ mb: 1 }} />
              <Typography variant="caption">Comma separated values</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Chip label="Excel" color="primary" sx={{ mb: 1 }} />
              <Typography variant="caption">XLS, XLSX formats</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Chip label="JSON" color="primary" sx={{ mb: 1 }} />
              <Typography variant="caption">Structured data</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Chip label="PDF" color="primary" sx={{ mb: 1 }} />
              <Typography variant="caption">Documents & reports</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Chip label="TXT" color="primary" sx={{ mb: 1 }} />
              <Typography variant="caption">Plain text files</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default FileUpload