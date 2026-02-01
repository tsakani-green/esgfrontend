import React from 'react'
import { Box, Typography, Button } from '@mui/material'

const InvoiceMUI = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Invoice Creation (MUI Test)
      </Typography>
      <Typography variant="body1" paragraph>
        This tests if Material-UI components are working properly.
      </Typography>
      <Button variant="contained" color="primary">
        MUI Test Button
      </Button>
    </Box>
  )
}

export default InvoiceMUI
