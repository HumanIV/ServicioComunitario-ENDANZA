import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken')
      const user = localStorage.getItem('user')
      
      if (!token || !user) {
        return false
      }

      try {
        const userData = JSON.parse(user)
        // Verificar que el usuario tenga datos básicos
        return !!(userData && userData.id)
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        return false
      }
    }
    
    setIsAuthenticated(checkAuth())
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <CSpinner color="primary" variant="grow" />
      </div>
    )
  }

  if (!isAuthenticated) {
    // Guardar la ruta actual para redirigir después del login
    const currentPath = window.location.pathname + window.location.search
    if (currentPath !== '/login') {
      localStorage.setItem('redirectAfterLogin', currentPath)
    }
    
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute