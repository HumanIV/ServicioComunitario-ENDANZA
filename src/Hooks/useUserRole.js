// src/Hooks/useUserRole.js - VERSIÓN QUE FUNCIONABA
import { useState, useEffect, useCallback } from 'react'
import { userAPI } from '../api/user.api.js'

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null)
  const [userId, setUserId] = useState(null)
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const roleMap = {
    1: 'admin',
    2: 'docente',
    3: 'estudiante',
    4: 'representante'
  }

  const fetchUserFromBackend = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return null

      console.log('🔍 useUserRole - Obteniendo datos del usuario desde backend...')

      const response = await userAPI.getProfile()

      if (response._ok === false) {
        if (response._status === 401) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('user')
          localStorage.removeItem('refreshToken')
          return null
        }
        throw new Error(`Error del servidor: ${response._status}`)
      }

      if (!response.user) throw new Error('Respuesta inválida del servidor')

      const roleId = response.user.Id_rol
      const roleName = roleMap[roleId] || 'estudiante'

      console.log(`🔄 useUserRole - Usuario ID: ${roleId} → Rol: ${roleName}`)

      const completeUserData = {
        ...response.user,
        rol: roleName,
        Id_rol: roleId,
        esAdmin: roleName === 'admin',
        esDocente: roleName === 'docente',
        esEstudiante: roleName === 'estudiante',
        esRepresentante: roleName === 'representante'
      }

      localStorage.setItem('user', JSON.stringify(completeUserData))

      return completeUserData

    } catch (err) {
      console.error('❌ useUserRole - Error:', err)
      return null
    }
  }, [])

  const getUserData = useCallback(async (forceRefresh = false) => {
    try {
      if (localStorage.getItem('accessToken')) {
        console.log('🔄 useUserRole - Forzando obtención de datos frescos')
        return await fetchUserFromBackend()
      }

      const cachedUser = localStorage.getItem('user')
      if (cachedUser) {
        const parsedUser = JSON.parse(cachedUser)
        console.log('📦 useUserRole - Usando datos cacheados')
        return parsedUser
      }

      return null
    } catch (err) {
      console.error('❌ useUserRole - Error en getUserData:', err)
      throw err
    }
  }, [fetchUserFromBackend])

  useEffect(() => {
    let isMounted = true

    const loadUserData = async () => {
      try {
        if (isMounted) setIsLoading(true)

        const userData = await getUserData(true)

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
        console.error('❌ Error:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    if (localStorage.getItem('accessToken')) {
      loadUserData()
    } else {
      setIsLoading(false)
    }

    return () => { isMounted = false }
  }, [getUserData])

  return {
    userRole,
    userId,
    userData,
    isLoading,
    error,
    isAdmin: userRole === 'admin',
    isDocente: userRole === 'docente',
    isEstudiante: userRole === 'estudiante',
    isRepresentante: userRole === 'representante',
    isAuthenticated: !!userRole && !!userId,
    roleId: userData?.Id_rol || null,
    roleName: userData?.tipo_rol || null
  }
}

export default useUserRole