// api/user.api.js - API específica para usuarios
import { helpFetch } from './helpFetch.js'

// Instancia del servicio base
const fetch = helpFetch()

export const userAPI = {
  // ============ AUTENTICACIÓN ============
  login: (credentials) => 
    fetch.post('/api/users/login', credentials),
  
  register: (userData) => 
    fetch.post('/api/users/register', userData),
  
  logout: () => 
    fetch.post('/api/users/logout', {}),
  
  refreshToken: (refreshToken) => 
    fetch.post('/api/users/refresh-token', { refreshToken }),
  
  // ============ PERFIL ============
  getProfile: () => 
    fetch.get('/api/users/profile'),
  
  updateProfile: (profileData) => 
    fetch.put('/api/users/profile', profileData),
  
  updateProfileWithSecurity: (data) => 
    fetch.put('/api/users/profile/security', data),
  
  // ============ CONTRASEÑAS ============
  changePassword: (passwords) => 
    fetch.put('/api/users/change-password', passwords),
  
  changePasswordWithSecurity: (data) => 
    fetch.put('/api/users/change-password/security', data),
  
  forgotPassword: (email) => 
    fetch.post('/api/users/forgot-password', { email }),
  
  resetPassword: (token, newPassword) => 
    fetch.post('/api/users/reset-password', { token, newPassword }),
  
  recoverPasswordWithSecurity: (data) => 
    fetch.post('/api/users/recover-password-security', data),
  
  getSecurityQuestion: (username) => 
    fetch.get(`/api/users/security-question/${username}`),
  
  // ============ ADMINISTRACIÓN ============
  listUsers: () => 
    fetch.get('/api/users/list'),
  
  searchUsers: (searchTerm) => 
    fetch.get(`/api/users/search?search=${encodeURIComponent(searchTerm)}`),
  
  // ✅ NUEVO: Crear usuario (admin)
  createUser: (userData) => 
    fetch.post('/api/users/create', userData),
  
  // ✅ NUEVO: Actualizar usuario (admin)
  updateUser: (userId, userData) => 
    fetch.put(`/api/users/${userId}`, userData),
  
  // ✅ NUEVO: Cambiar rol específicamente
  changeUserRole: (userId, role) => 
    fetch.put(`/api/users/${userId}/role`, { role }),
  
  // ✅ NUEVO: Método unificado para cambiar estado
  changeUserStatus: (userId, status) => {
    const action = status === 'active' ? 'activate' : 'deactivate';
    return fetch.put(`/api/users/${action}/${userId}`, {});
  },
  
  // Métodos específicos de estado
  activateUser: (userId) => 
    fetch.put(`/api/users/activate/${userId}`, {}),
  
  deactivateUser: (userId) => 
    fetch.put(`/api/users/deactivate/${userId}`, {}),
  
  // Eliminar usuario
  deleteUser: (userId) => 
    fetch.delet('/api/users', userId),
  
  // Migrar passwords
  migratePasswords: () => 
    fetch.post('/api/users/migrate-passwords', {})
}