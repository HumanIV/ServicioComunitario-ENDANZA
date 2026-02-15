// src/hooks/useRouteGuard.js
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useUserRole from './useUserRole'

// Configuración de permisos por ruta
const routePermissions = {
  '/dashboard': ['admin'],
  '/students': ['admin'],
  '/students/:id': ['admin'],
  '/inscripcion': ['admin'],
  '/aulas': ['admin'],
  '/notas': ['admin'],
  '/boletin': ['admin'],
  '/horario': ['admin'],
  '/docente/inicio': ['docente'],
  '/docente/horario': ['docente'],
  '/inicio': ['representante'],
  '/profile': ['representante', 'admin', 'docente'],
  '/boletin-estudiante': ['representante'],
  '/horario-estudiante': ['representante'],
  '/perfil': ['admin', 'docente', 'representante'],
}

const useRouteGuard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userRole, isLoading } = useUserRole()

  useEffect(() => {
    if (isLoading) {
      console.log('⏳ RouteGuard: Esperando carga del rol...')
      return
    }

    const token = localStorage.getItem('accessToken')
    if (!token) {
      console.warn('🚫 RouteGuard: No hay token, redirigiendo a login')
      navigate('/login', { replace: true })
      return
    }

    if (!userRole) {
      console.warn('⚠️ RouteGuard: userRole es null pero hay token.')
      return
    }
    
    const path = location.pathname
    console.log(`🔍 RouteGuard - Verificando acceso a: ${path}`)
    console.log(`👤 Rol del usuario: ${userRole}`)
    
    // Buscar coincidencia exacta
    let allowedRoles = routePermissions[path]
    
    // Si no hay coincidencia exacta, buscar rutas con parámetros
    if (!allowedRoles) {
      if (path.startsWith('/students/') && path.split('/').length === 3) {
        allowedRoles = routePermissions['/students/:id']
        console.log(`🎯 Ruta dinámica detectada: /students/:id → ${path}`)
      }
    }
    
    // Si la ruta no tiene restricciones, permitir acceso
    if (!allowedRoles) {
      console.log(`✅ Ruta sin restricciones: ${path}`)
      return
    }
    
    // Verificar si el usuario tiene permiso
    if (!allowedRoles.includes(userRole)) {
      console.warn(`🚨 Acceso denegado a ${path} para rol ${userRole}`)
      
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
    } else {
      console.log(`✅ Acceso permitido a ${path} para rol ${userRole}`)
    }
  }, [location.pathname, userRole, isLoading, navigate])
}

export default useRouteGuard