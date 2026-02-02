// src/hooks/useUserRole.js
import { useState, useEffect, useCallback } from 'react'
import { helpFetch } from '../api/helpFetch'

const api = helpFetch()

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null)
  const [userId, setUserId] = useState(null)
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mapeo de Id_rol a nombres legibles (usando TUS nombres)
  const roleMap = {
    1: 'admin',           // "Administrador"
    2: 'docente',         // "Docente"
    3: 'estudiante',      // "Estudiante"
    4: 'representante'    // "Representante"
  }

  // Función para obtener datos del usuario desde el backend
  const fetchUserFromBackend = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      console.log('🔍 useUserRole - Obteniendo datos del usuario desde backend...')
      
      const response = await api.get('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('✅ useUserRole - Respuesta del backend:', response)

      if (!response.ok || !response.user) {
        throw new Error('Respuesta inválida del servidor')
      }

      // Convertir Id_rol a nombre de rol
      const roleId = response.user.Id_rol
      const roleName = roleMap[roleId] || 'estudiante'
      const tipoRol = response.user.tipo_rol || 'Estudiante'
      
      console.log(`🔄 useUserRole - Mapeo: Id_rol ${roleId} → ${roleName} (tipo_rol: ${tipoRol})`)
      
      // Preparar datos completos del usuario
      const completeUserData = {
        ...response.user,
        rol: roleName,                    // Nombre del rol estandarizado (inglés)
        tipo_rol: tipoRol,                // Nombre original en español
        Id_rol: roleId,                   // ID numérico original
        esAdmin: roleName === 'admin',
        esDocente: roleName === 'docente',
        esEstudiante: roleName === 'estudiante',
        esRepresentante: roleName === 'representante'
      }

      console.log('👤 useUserRole - Datos procesados:', {
        id: completeUserData.id,
        rol: completeUserData.rol,
        tipo_rol: completeUserData.tipo_rol,
        Id_rol: completeUserData.Id_rol
      })

      // Guardar en localStorage como cache
      localStorage.setItem('user', JSON.stringify(completeUserData))

      return completeUserData
    } catch (err) {
      console.error('❌ useUserRole - Error obteniendo datos desde backend:', err)
      throw err
    }
  }, [])

  // Función para obtener datos del usuario (localStorage o backend)
  const getUserData = useCallback(async (forceRefresh = false) => {
    try {
      // Si no forceRefresh, intentar obtener de localStorage primero
      if (!forceRefresh) {
        const cachedUser = localStorage.getItem('user')
        if (cachedUser) {
          try {
            const parsedUser = JSON.parse(cachedUser)
            console.log('📦 useUserRole - Usando datos cacheados de localStorage')
            return parsedUser
          } catch (e) {
            console.warn('⚠️ useUserRole - Error al parsear cache, obteniendo de backend')
          }
        }
      }

      // Obtener desde backend
      console.log('🔄 useUserRole - Obteniendo datos frescos del backend')
      return await fetchUserFromBackend()
    } catch (err) {
      console.error('❌ useUserRole - Error en getUserData:', err)
      throw err
    }
  }, [fetchUserFromBackend])

  // Función para refrescar datos del usuario
  const refreshUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const freshUserData = await getUserData(true)
      
      setUserData(freshUserData)
      setUserRole(freshUserData.rol)
      setUserId(freshUserData.id)
      
      return freshUserData
    } catch (err) {
      setError(err.message || 'Error al refrescar datos')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getUserData])

  // Efecto inicial para cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Obtener datos del usuario
        const userData = await getUserData()
        
        if (userData) {
          setUserData(userData)
          setUserRole(userData.rol)
          setUserId(userData.id)
          
          console.log('✅ useUserRole - Datos cargados exitosamente:', {
            id: userData.id,
            rol: userData.rol,
            tipo_rol: userData.tipo_rol
          })
        }
      } catch (err) {
        console.error('❌ useUserRole - Error cargando datos iniciales:', err)
        setError(err.message || 'Error al cargar datos del usuario')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [getUserData])


// Verificar si tiene un rol específico
const hasRole = useCallback((role) => {
  if (!userRole) return false
  
  // NUEVA JERARQUÍA: Estudiante no tiene acceso
  const rolesHierarchy = {
    'admin': ['admin', 'docente', 'representante'], // Admin ve todo excepto estudiante
    'docente': ['docente'], // Docente solo ve su contenido
    'estudiante': [], // ESTUDIANTE NO TIENE ACCESO
    'representante': ['representante'] // Representante solo ve su contenido
  }
  
  return rolesHierarchy[userRole]?.includes(role) || false
}, [userRole])



  // Verificar si tiene al menos uno de varios roles
  const hasAnyRole = useCallback((roles = []) => {
    if (!userRole) return false
    return roles.includes(userRole)
  }, [userRole])

  return {
    // Datos del usuario
    userRole,
    userId,
    userData,
    
    // Estados
    isLoading,
    error,
    
    // Funciones
    getUserData,
    refreshUserData,
    hasRole,
    hasAnyRole,
    
    // Atajos comunes
    isAdmin: userRole === 'admin',
    isDocente: userRole === 'docente',
    isEstudiante: userRole === 'estudiante',
    isRepresentante: userRole === 'representante',
    
    // Verificación de permisos jerárquicos
    canManageUsers: hasAnyRole(['admin']),
    canManageContent: hasAnyRole(['admin', 'docente']),
    canViewSensitiveData: hasAnyRole(['admin'])
  }
}

export default useUserRole