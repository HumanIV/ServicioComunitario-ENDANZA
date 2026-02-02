// src/components/ProtectedRoute.js - VERSIÓN MEJORADA
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { CSpinner, CAlert } from '@coreui/react'

const ProtectedRoute = ({ 
  children, 
  allowedRoles = []
}) => {
  const location = useLocation()

  // Estado de carga
  const [isLoading, setIsLoading] = React.useState(true)
  const [userRole, setUserRole] = React.useState('')

  React.useEffect(() => {
    // Simular carga de datos del usuario
    const loadUserData = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        setUserRole(user.rol || '')
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <CSpinner color="primary" variant="grow" />
      </div>
    )
  }

  // Verificar autenticación
  const isAuthenticated = !!localStorage.getItem('accessToken')
  
  if (!isAuthenticated) {
    localStorage.setItem('redirectAfterLogin', location.pathname)
    return <Navigate to="/login" replace />
  }

  // Verificar permisos si se especifican roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <div className="container py-5">
        <CAlert color="danger">
          <h4>Acceso Denegado</h4>
          <p>No tienes permisos para acceder a esta sección.</p>
          <p><strong>Ruta:</strong> {location.pathname}</p>
          <p><strong>Tu rol:</strong> {userRole || 'No definido'}</p>
          <p><strong>Roles requeridos:</strong> {allowedRoles.join(', ')}</p>
          <div className="mt-3">
            <button 
              className="btn btn-primary"
              onClick={() => window.history.back()}
            >
              Volver
            </button>
          </div>
        </CAlert>
      </div>
    )
  }

  return children
}

export default ProtectedRoute