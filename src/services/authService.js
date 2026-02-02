import { helpFetch } from '../api/helpFetch'

const api = helpFetch()

export const authService = {
  async login(email, password) {
    try {
      console.log('🔐 [1] Iniciando login para:', email)
      
      // DEBUG: ¿Hay token viejo?
      const oldToken = localStorage.getItem('token')
      console.log('🔍 Token anterior en localStorage:', oldToken ? 'SÍ' : 'NO')
      
      // DEBUG: Limpia ANTES de intentar
      if (oldToken) {
        console.log('🧹 Limpiando token anterior...')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      
      const data = await api.post('/auth/login', { email, password })
      console.log('📥 [2] Respuesta de API:', data)
      
      // DEBUG EXTRA
      console.log('🔍 data tiene token?:', !!data.token)
      console.log('🔍 data.token valor:', data.token)
      console.log('🔍 data.token tipo:', typeof data.token)
      console.log('🔍 data.usuario?:', !!data.usuario)
      
      if (data.token && data.usuario) {
        console.log('✅ [3] Token válido detectado, guardando...')
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.usuario))
        
        // VERIFICAR que se guardó
        const savedToken = localStorage.getItem('token')
        console.log('💾 Token guardado en localStorage:', savedToken ? 'SÍ' : 'NO')
        
        return { 
          success: true, 
          token: data.token, 
          user: data.usuario, 
          message: data.message 
        }
      }
      
      console.warn('⚠️ [4] No hay token válido en respuesta')
      throw new Error(data.message || 'Error en la autenticación')
      
    } catch (error) {
      console.error('❌ [5] CATCH - Error completo:', error)
      console.error('❌ error.status:', error.status)
      console.error('❌ error.data:', error.data)
      console.error('❌ error.message:', error.message)
      
      return { 
        success: false, 
        message: error.data?.message || error.message || 'Error de conexión',
        status: error.status
      }
    }
  },

  // ... resto igual pero AGREGAR:
  
  // NUEVO: Método para verificar estado actual
  debugAuthState() {
    return {
      hasToken: !!localStorage.getItem('token'),
      tokenValue: localStorage.getItem('token'),
      hasUser: !!localStorage.getItem('user'),
      userValue: localStorage.getItem('user'),
      isAuthenticated: this.isAuthenticated()
    }
  }
}

export default authService