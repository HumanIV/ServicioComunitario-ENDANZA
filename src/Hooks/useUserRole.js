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

  // Mapeo de Id_rol a nombres legibles
  const roleMap = {
    1: 'admin',           // "Administrador"
    2: 'docente',         // "Docente"
    3: 'estudiante',      // "Estudiante"
    4: 'representante'    // "Representante"
  }

  // Función para validar datos del usuario
  const validateUserData = useCallback((userData) => {
    const requiredFields = ['id', 'Id_rol']
    
    for (const field of requiredFields) {
      if (!userData[field]) {
        console.warn(`⚠️ Campo requerido faltante: ${field}`)
        return false
      }
    }
    
    // Validar que Id_rol sea válido
    if (!roleMap[userData.Id_rol]) {
      console.warn(`⚠️ Id_rol inválido: ${userData.Id_rol}`)
      return false
    }
    
    return true
  }, [])

  // Función para obtener datos del usuario desde el backend
  const fetchUserFromBackend = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setError('No hay token de autenticación')
        setIsLoading(false)
        return null
      }

      console.log('🔍 useUserRole - Obteniendo datos del usuario desde backend...')
      
      const response = await api.get('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('✅ useUserRole - Respuesta del backend:', response)

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('accessToken')
          localStorage.removeItem('user')
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.')
          return null
        }
        throw new Error(`Error del servidor: ${response.status}`)
      }

      if (!response.user) {
        throw new Error('Respuesta inválida del servidor: datos de usuario no encontrados')
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

      // Validar datos antes de retornar
      if (!validateUserData(completeUserData)) {
        throw new Error('Datos de usuario inválidos')
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
      
      // Manejo específico de errores de red
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('Error de conexión. Verifica tu conexión a internet.')
      } else {
        setError(err.message || 'Error al obtener datos del usuario')
      }
      
      return null
    }
  }, [validateUserData])

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
            
            // Validar datos cacheados
            if (validateUserData(parsedUser)) {
              return parsedUser
            } else {
              console.warn('⚠️ useUserRole - Datos cacheados inválidos, obteniendo de backend')
            }
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
  }, [fetchUserFromBackend, validateUserData])

  // Función para refrescar datos del usuario
  const refreshUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const freshUserData = await getUserData(true)
      
      if (freshUserData) {
        setUserData(freshUserData)
        setUserRole(freshUserData.rol)
        setUserId(freshUserData.id)
      }
      
      return freshUserData
    } catch (err) {
      setError(err.message || 'Error al refrescar datos')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getUserData])

  // Función para limpiar datos del usuario (logout)
  const clearUserData = useCallback(() => {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    setUserRole(null)
    setUserId(null)
    setUserData(null)
    setError(null)
  }, [])

  // Verificar si tiene un rol específico
  const hasRole = useCallback((role) => {
    if (!userRole) return false
    
    // JERARQUÍA CORREGIDA: Cada rol solo puede acceder a su propio contenido
    const rolesHierarchy = {
      'admin': ['admin'],
      'docente': ['docente'],
      'estudiante': [],
      'representante': ['representante']
    }
    
    return rolesHierarchy[userRole]?.includes(role) || false
  }, [userRole])

  // Verificar si tiene al menos uno de varios roles
  const hasAnyRole = useCallback((roles = []) => {
    if (!userRole) return false
    return roles.includes(userRole)
  }, [userRole])

  // Efecto inicial para cargar datos del usuario
  useEffect(() => {
    let isMounted = true

    const loadUserData = async () => {
      try {
        if (isMounted) {
          setIsLoading(true)
          setError(null)
        }
        
        // Obtener datos del usuario
        const userData = await getUserData()
        
        if (isMounted && userData) {
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
        if (isMounted) {
          console.error('❌ useUserRole - Error cargando datos iniciales:', err)
          setError(err.message || 'Error al cargar datos del usuario')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadUserData()

    return () => {
      isMounted = false
    }
  }, [getUserData])

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
    clearUserData,
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
    canViewSensitiveData: hasAnyRole(['admin']),
    
    // Nuevas utilidades
    isAuthenticated: !!userRole && !!userId,
    roleId: userData?.Id_rol || null,
    roleName: userData?.tipo_rol || null
  }
}

export default useUserRole