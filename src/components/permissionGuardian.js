// src/components/PermissionGuard.js
import React from 'react'
import { useNavigate } from 'react-router-dom'
import useUserRole from '../Hooks/useUserRole'
import { CAlert, CButton } from '@coreui/react'

const PermissionGuard = ({ 
  children, 
  requiredRole,
  requiredAnyOf = [],
  showForbidden = true,
  redirectTo = '/unauthorized'
}) => {
  const { userRole, isLoading, hasRole, hasAnyRole } = useUserRole()
  const navigate = useNavigate()
  
  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando permisos...</span>
        </div>
      </div>
    )
  }
  
  let hasPermission = false
  
  if (requiredRole) {
    hasPermission = hasRole(requiredRole)
  } else if (requiredAnyOf.length > 0) {
    hasPermission = hasAnyRole(requiredAnyOf)
  }
  
  if (!hasPermission) {
    if (showForbidden) {
      return (
        <div className="container py-5">
          <CAlert color="danger">
            <h4>Acceso Denegado</h4>
            <p>No tienes permisos para acceder a esta sección.</p>
            <p><strong>Tu rol:</strong> {userRole}</p>
            <p><strong>Rol requerido:</strong> {requiredRole || requiredAnyOf.join(' o ')}</p>
            <div className="mt-3">
              <CButton color="primary" onClick={() => navigate('/dashboard')}>
                Volver al Dashboard
              </CButton>
            </div>
          </CAlert>
        </div>
      )
    } else {
      // Redirigir silenciosamente
      navigate(redirectTo)
      return null
    }
  }
  
  return children
}

export default PermissionGuard