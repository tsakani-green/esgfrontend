import React, { useState, useCallback, useRef } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material'
import {
  CloudUpload,
  Description,
  Delete,
  CheckCircle,
  Error,
  InsertDriveFile,
} from '@mui/icons-material'

const PDFUpload = ({ onUpload, loading, disabled = false }) => {
  const theme = useTheme()
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const fileInputRef = useRef(null)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled || loading) return

    const droppedFiles = [...e.dataTransfer.files]
    const accepted = droppedFiles.filter(file => file.type === 'application/pdf' || file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv'))
    
    if (accepted.length > 0) {
      setFiles(prev => [...prev, ...accepted])
    }
  }, [disabled, loading])

  const handleFileInput = (e) => {
    if (disabled || loading) return
    
    const selectedFiles = [...e.target.files]
    const accepted = selectedFiles.filter(file => file.type === 'application/pdf' || file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv'))
    
    if (accepted.length > 0) {
      setFiles(prev => [...prev, ...accepted])
    }
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[index]
      return newProgress
    })
  }

  const handleUpload = async () => {
    if (files.length === 0 || !onUpload) return

    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append('files', file)
    })

    try {
      await onUpload(formData)
      setFiles([])
      setUploadProgress({})
    } catch (error) {
      console.error('Upload failed:', error)
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
      {/* Drop Zone */}
      <Paper
        sx={{
          p: 4,
          border: `2px dashed ${dragActive ? theme.palette.primary.main : alpha(theme.palette.divider, 0.5)}`,
          backgroundColor: dragActive ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.background.paper, 0.5),
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'center',
          '&:hover': {
            borderColor: disabled || loading ? alpha(theme.palette.divider, 0.5) : theme.palette.primary.main,
            backgroundColor: disabled || loading ? alpha(theme.palette.background.paper, 0.5) : alpha(theme.palette.primary.main, 0.02),
          },
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && !loading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.csv,text/csv"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        <CloudUpload
          sx={{
            fontSize: 48,
            color: dragActive ? theme.palette.primary.main : theme.palette.text.secondary,
            mb: 2,
          }}
        />
        
        <Typography variant="h6" gutterBottom>
          {dragActive ? 'Drop PDF files here' : 'Upload PDF Invoices'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Drag and drop PDF files here, or click to select files
        </Typography>
        
        <Chip 
          label="PDF or CSV" 
          size="small" 
          variant="outlined" 
          color="primary"
        />
      </Paper>

      {/* Files List */}
      {files.length > 0 && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Selected Files ({files.length})
          </Typography>
          
          <List dense>
            {files.map((file, index) => (
              <ListItem key={index} sx={{ pl: 0 }}>
                <ListItemIcon>
                  <Description color="primary" />
                </ListItemIcon>
                
                <ListItemText
                  primary={file.name}
                  secondary={formatFileSize(file.size)}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: 500,
                    noWrap: true,
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                  }}
                />
                
                {uploadProgress[index] !== undefined && (
                  <Box sx={{ flex: 1, mx: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress[index]}
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                  </Box>
                )}
                
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => removeFile(index)}
                    disabled={loading}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setFiles([])
                setUploadProgress({})
              }}
              disabled={loading}
            >
              Clear All
            </Button>
            
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={handleUpload}
              disabled={loading || files.length === 0}
            >
              {loading ? 'Processing...' : `Upload ${files.length} File${files.length > 1 ? 's' : ''}`}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Upload Status */}
      {loading && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Processing PDF files and extracting sustainability data...
        </Alert>
      )}
    </Box>
  )
}

export default PDFUpload
