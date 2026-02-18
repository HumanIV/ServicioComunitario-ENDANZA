// src/components/ProtectedRoute.js
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { CSpinner, CAlert } from '@coreui/react'

// Mapa de rutas permitidas por rol
const routePermissions = {
  // Rutas de admin
  '/dashboard': ['admin'],
  '/students': ['admin'],
  '/students/*': ['admin'],
  '/inscripcion': ['representante'],
  '/aulas': ['admin'],
  '/notas': ['admin', 'docente'],
  '/boletin': ['admin'],
  '/horario': ['admin'],

  // Rutas de docente
  '/docente/*': ['docente'],

  // Rutas de representante
  '/inicio': ['representante'],
  '/inicio-boletines': ['representante'],
  '/inicio-horarios': ['representante'],
  '/perfilRepresentanteEstudiante/*': ['representante'], // 👈 AGREGADA
  '/boletin-estudiante/*': ['representante'],
  '/horario-estudiante/*': ['representante'],

  // Rutas compartidas
  '/profile': ['representante', 'admin', 'docente'],
  '/perfil': ['admin', 'docente', 'representante'],
}

const ProtectedRoute = ({
  children,
  allowedRoles = []
}) => {
  const location = useLocation()

  // Estado de carga
  const [isLoading, setIsLoading] = React.useState(true)
  const [userRole, setUserRole] = React.useState('')

  React.useEffect(() => {
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

  // Determinar los roles permitidos para esta ruta
  let allowedRolesForRoute = allowedRoles

  // Si no se especificaron roles, usar el mapa de rutas
  if (allowedRolesForRoute.length === 0) {
    const path = location.pathname

    // Buscar coincidencia exacta primero
    allowedRolesForRoute = routePermissions[path] || []

    // Si no hay coincidencia exacta, buscar por patrón
    if (allowedRolesForRoute.length === 0) {
      // Rutas de admin con parámetros
      if (path.startsWith('/students/')) {
        allowedRolesForRoute = routePermissions['/students/*'] || []
      }
      // Rutas de representante con parámetros
      else if (path.startsWith('/perfilRepresentanteEstudiante/')) {
        allowedRolesForRoute = routePermissions['/perfilRepresentanteEstudiante/*'] || []
      }
      else if (path.startsWith('/boletin-estudiante/')) {
        allowedRolesForRoute = routePermissions['/boletin-estudiante/*'] || []
      }
      else if (path.startsWith('/horario-estudiante/')) {
        allowedRolesForRoute = routePermissions['/horario-estudiante/*'] || []
      }
      else if (path.startsWith('/docente/')) {
        allowedRolesForRoute = routePermissions['/docente/*'] || []
      }
    }
  }

  // Verificar permisos
  if (allowedRolesForRoute.length > 0 && !allowedRolesForRoute.includes(userRole)) {
    return (
      <div className="container py-5">
        <CAlert color="danger">
          <h4>Acceso Denegado</h4>
          <p>No tienes permisos para acceder a esta sección.</p>
          <p><strong>Ruta:</strong> {location.pathname}</p>
          <p><strong>Tu rol:</strong> {userRole || 'No definido'}</p>
          <p><strong>Roles requeridos:</strong> {allowedRolesForRoute.join(', ')}</p>
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