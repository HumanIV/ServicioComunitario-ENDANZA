// services/userService.js
import { userAPI } from '../api/user.api';

// ============================================
// AUTENTICACIÓN
// ============================================

export const login = async (email, password) => {
    try {
        const response = await userAPI.login({ email, password });
        if (response?.ok) {
            if (response.accessToken) {
                localStorage.setItem('accessToken', response.accessToken);
            }
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }
            return response;
        }
        throw new Error(response?.msg || 'Error al iniciar sesión');
    } catch (error) {
        console.error('❌ Error en login:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await userAPI.logout();
    } catch (error) {
        console.error('❌ Error en logout:', error);
    } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await userAPI.getProfile();
        if (response?.ok) {
            return response.user;
        }
        return null;
    } catch (error) {
        console.error('❌ Error en getCurrentUser:', error);
        return null;
    }
};

// ============================================
// PERFIL
// ============================================

export const updateProfile = async (profileData) => {
    try {
        const response = await userAPI.updateProfile(profileData);
        if (response?.ok) {
            return response.user;
        }
        throw new Error(response?.msg || 'Error al actualizar perfil');
    } catch (error) {
        console.error('❌ Error en updateProfile:', error);
        throw error;
    }
};

export const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await userAPI.changePassword({ currentPassword, newPassword });
        if (response?.ok) {
            return true;
        }
        throw new Error(response?.msg || 'Error al cambiar contraseña');
    } catch (error) {
        console.error('❌ Error en changePassword:', error);
        throw error;
    }
};

// ============================================
// ADMINISTRACIÓN DE USUARIOS - ✅ NOMBRES CORRECTOS
// ============================================

// ✅ ESTE ES EL QUE USA Users.js - ¡NO CAMBIAR!
export const listUsers = async () => {
    try {
        const response = await userAPI.listUsers();
        if (response?.ok && Array.isArray(response.users)) {
            return response.users;
        }
        console.warn('⚠️ listUsers no retornó un array:', response);
        return [];
    } catch (error) {
        console.error('❌ Error en listUsers:', error);
        return [];
    }
};

// ✅ Alias para compatibilidad (por si alguien usa getAllUsers)
export const getAllUsers = listUsers;

export const createUser = async (userData) => {
    try {
        const response = await userAPI.createUser(userData);
        if (response?.ok) {
            return response.user;
        }
        throw new Error(response?.msg || 'Error al crear usuario');
    } catch (error) {
        console.error('❌ Error en createUser:', error);
        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await userAPI.updateUser(userId, userData);
        if (response?.ok) {
            return response.user;
        }
        throw new Error(response?.msg || 'Error al actualizar usuario');
    } catch (error) {
        console.error('❌ Error en updateUser:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await userAPI.deleteUser(userId);
        if (response?.ok) {
            return response;
        }
        throw new Error(response?.msg || 'Error al eliminar usuario');
    } catch (error) {
        console.error('❌ Error en deleteUser:', error);
        throw error;
    }
};

export const changeUserRole = async (userId, role) => {
    try {
        const response = await userAPI.changeUserRole(userId, role);
        if (response?.ok) {
            return response.user;
        }
        throw new Error(response?.msg || 'Error al cambiar rol');
    } catch (error) {
        console.error('❌ Error en changeUserRole:', error);
        throw error;
    }
};

export const changeUserStatus = async (userId, status) => {
    try {
        const response = await userAPI.changeUserStatus(userId, status);
        if (response?.ok) {
            return response.user;
        }
        throw new Error(response?.msg || 'Error al cambiar estado');
    } catch (error) {
        console.error('❌ Error en changeUserStatus:', error);
        throw error;
    }
};

export const searchUsers = async (searchTerm) => {
    try {
        const response = await userAPI.searchUsers(searchTerm);
        if (response?.ok) {
            return response.users || [];
        }
        return [];
    } catch (error) {
        console.error('❌ Error en searchUsers:', error);
        return [];
    }
};