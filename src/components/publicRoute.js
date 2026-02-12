// src/components/PublicRoute.js
import React from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken')
  
  // Si ya está autenticado, redirigir según su rol
  if (isAuthenticated) {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userRole = user.rol || 'estudiante'
    
    switch(userRole) {
      case 'admin':
        return <Navigate to="/dashboard" replace />
      case 'docente':
        return <Navigate to="/docente/inicio" replace />
      case 'representante':
        return <Navigate to="/inicio" replace />
      
      default:
        return <Navigate to="/inicio" replace />

    }
  }
  
  return children
}

export default PublicRoute