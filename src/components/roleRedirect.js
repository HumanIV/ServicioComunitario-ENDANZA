// src/components/RoleRedirect.js
import React from 'react'
import { Navigate } from 'react-router-dom'

const RoleRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userRole = user.rol || ''

  switch(userRole) {
    case 'admin':
      return <Navigate to="/dashboard" replace />
    case 'docente':
      return <Navigate to="/docente/inicio" replace />
    case 'representante':
      return <Navigate to="/inicio" replace />
    default:
      return <Navigate to="/login" replace />
  }
}

export default RoleRedirect