import React from 'react'
import { Box, Typography, Button } from '@mui/material'

const InvoiceCreationTest = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Invoice (Test Version)
      </Typography>
      <Typography variant="body1">
        This is a test version to check if the page loads correctly.
      </Typography>
      <Button variant="contained" sx={{ mt: 2 }}>
        Test Button
      </Button>
    </Box>
  )
}

export default InvoiceCreationTest
