// src/services/authService.js - VERSIÓN CORREGIDA
import { userAPI } from '../api/user.api.js'

export const authService = {
  async login(email, password) {
    try {
      console.log('🔐 [1] Iniciando login para:', email)
      
      // Limpiar tokens anteriores
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      
      const data = await userAPI.login({ email, password })
      console.log('📥 [2] Respuesta de API:', data)

      if (data.accessToken && data.user) {
        console.log('✅ [3] Token válido detectado, guardando...')
        
        // ✅ MAPEO CORRECTO DE ROLES USANDO Id_rol
        const roleMap = {
          1: 'admin',
          2: 'docente',
          3: 'estudiante',
          4: 'representante'
        }
        
        // ✅ Obtener el rol del Id_rol (ESTO ES LO QUE FALTA)
        const roleId = data.user.Id_rol
        const roleName = roleMap[roleId] || 'estudiante'
        
        console.log(`🔄 Mapeando rol: Id_rol ${roleId} → ${roleName}`)
        
        // ✅ Crear objeto de usuario con el rol CORRECTO
        const userWithRole = {
          ...data.user,
          rol: roleName,  // ← ESTO ES CRÍTICO
          esAdmin: roleName === 'admin',
          esDocente: roleName === 'docente',
          esEstudiante: roleName === 'estudiante',
          esRepresentante: roleName === 'representante'
        }
        
        // Guardar en localStorage
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('user', JSON.stringify(userWithRole))
        
        return { 
          success: true, 
          token: data.accessToken,
          refreshToken: data.refreshToken,
          user: userWithRole,  // ← DEVOLVER EL USUARIO CON EL ROL CORRECTO
          message: data.message 
        }
      }
      
      console.warn('⚠️ [4] No hay token válido en respuesta')
      throw new Error(data.msg || data.message || 'Error en la autenticación')
      
    } catch (error) {
      console.error('❌ [5] Error:', error)
      
      return { 
        success: false, 
        message: error.data?.msg || error.data?.message || error.message || 'Error de conexión',
        status: error.status
      }
    }
  },

  async getProfile() {
    try {
      const data = await userAPI.getProfile()
      return { 
        success: true, 
        user: data.user 
      }
    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error)
      return { 
        success: false, 
        message: error.message 
      }
    }
  },

  async logout() {
    try {
      await userAPI.logout()
    } catch (error) {
      console.error('❌ Error en logout:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
    return { success: true }
  },

  debugAuthState() {
    return {
      hasAccessToken: !!localStorage.getItem('accessToken'),
      accessTokenValue: localStorage.getItem('accessToken')?.substring(0, 20) + '...',
      hasRefreshToken: !!localStorage.getItem('refreshToken'),
      hasUser: !!localStorage.getItem('user'),
      userValue: localStorage.getItem('user'),
      isAuthenticated: !!localStorage.getItem('accessToken')
    }
  }
}

export default authService