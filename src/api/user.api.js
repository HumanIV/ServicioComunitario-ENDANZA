// api/user.api.js - CORREGIDO
import { helpFetch } from './helpFetch.js'

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
  
  createUser: (userData) => 
    fetch.post('/api/users/create', userData),
  
  updateUser: (userId, userData) => 
    fetch.put(`/api/users/${userId}`, userData),
  
  changeUserRole: (userId, role) => 
    fetch.put(`/api/users/${userId}/role`, { role }),
  
  changeUserStatus: (userId, status) => {
    const action = status === 'active' ? 'activate' : 'deactivate';
    return fetch.put(`/api/users/${action}/${userId}`, {});
  },
  
  activateUser: (userId) => 
    fetch.put(`/api/users/activate/${userId}`, {}),
  
  deactivateUser: (userId) => 
    fetch.put(`/api/users/deactivate/${userId}`, {}),
  
  // ✅ CORREGIDO: Ahora usa el método correcto y URL correcta
  deleteUser: (userId) => 
    fetch.del(`/api/users/${userId}`),  // ← CAMBIADO A 'del' Y URL CORRECTA
  
  migratePasswords: () => 
    fetch.post('/api/users/migrate-passwords', {})
}