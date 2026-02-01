import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import { useUser } from '../contexts/UserContext'

const AdminRoute = () => {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" />
}

export default AdminRoute
