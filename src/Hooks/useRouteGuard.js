// src/hooks/useRouteGuard.js
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useUserRole from './useUserRole'

// Configuración de permisos por ruta
const routePermissions = {
  '/dashboard': ['admin'],
  '/students': ['admin'],
  '/inscripcion': ['admin'],
  '/aulas': ['admin'],
  '/notas': ['admin'],
  '/boletin': ['admin'],
  '/horario': ['admin'],
  '/docente/inicio': ['docente'],
  '/docente/horario': ['docente'],
  '/inicio': ['representante'],
  '/profile': ['representante','admin','docente'],
  '/boletin-estudiante': ['representante'],
  '/horario-estudiante': ['representante'],
  '/perfil': ['admin', 'docente', 'representante']
}

const useRouteGuard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userRole, isLoading } = useUserRole()

  useEffect(() => {
    if (isLoading) return
    
    const path = location.pathname
    const allowedRoles = routePermissions[path] || []
    
    // Si la ruta tiene restricciones y el usuario no tiene permiso
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      console.warn(`🚨 Intento de acceso no autorizado a ${path} por rol ${userRole}`)
      
      // Redirigir según el rol
      switch(userRole) {
        case 'admin':
          navigate('/dashboard', { replace: true })
          break
        case 'docente':
          navigate('/docente/inicio', { replace: true })
          break
        case 'representante':
          navigate('/inicio', { replace: true })
          break
        default:
          navigate('/login', { replace: true })
      }
    }
  }, [location.pathname, userRole, isLoading, navigate])
}

export default useRouteGuard