import { userAPI } from '../api/user.api';

// ============================================
// LISTAR USUARIOS
// ============================================
export const listUsers = async () => {
  try {
    console.log('📋 Listando usuarios...');
    const response = await userAPI.listUsers();
    
    if (response.ok && response.users) {
      console.log(`✅ ${response.users.length} usuarios encontrados`);
      return response.users; // Ya viene mapeado del backend
    }
    
    return [];
  } catch (error) {
    console.error('❌ Error en listUsers:', error);
    throw error;
  }
};

// ============================================
// CREAR USUARIO (Admin)
// ============================================
export const createUser = async (userData) => {
  try {
    console.log('👤 Creando usuario:', { 
      email: userData.email, 
      role: userData.role,
      dni: userData.dni 
    });

    // Validaciones básicas
    if (!userData.password && !userData._skipPasswordCheck) {
      throw new Error('La contraseña es obligatoria para crear un usuario');
    }

    // Limpiar el DNI (asegurar formato V-)
    let dni = userData.dni;
    if (!dni.startsWith('V-')) {
      dni = 'V-' + dni.replace(/[^0-9]/g, '');
    }

    // Preparar payload
    const payload = {
      dni: dni,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role,
      status: userData.status || 'active',
      password: userData.password,
      // Campos opcionales
      fecha_nacimiento: userData.fecha_nacimiento || null,
      genero: userData.genero || null,
      Id_direccion: userData.Id_direccion || null
    };

    const response = await userAPI.createUser(payload);
    
    if (!response.ok) {
      throw new Error(response.msg || 'Error al crear usuario');
    }
    
    console.log(`✅ Usuario ${userData.role} creado exitosamente:`, response.user);
    return response.user;
    
  } catch (error) {
    console.error('❌ Error en createUser:', error);
    throw error;
  }
};

// ============================================
// ACTUALIZAR USUARIO (Admin)
// ============================================
export const updateUser = async (userId, userData) => {
  try {
    console.log(`📝 Actualizando usuario ${userId}:`, {
      email: userData.email,
      role: userData.role
    });

    // Limpiar el DNI (asegurar formato V-)
    let dni = userData.dni;
    if (dni && !dni.startsWith('V-')) {
      dni = 'V-' + dni.replace(/[^0-9]/g, '');
    }

    // Preparar payload
    const payload = {
      dni: dni,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role,
      status: userData.status,
      ...(userData.password && { password: userData.password }) // Solo si se proporciona nueva contraseña
    };

    const response = await userAPI.updateUser(userId, payload);
    
    if (!response.ok) {
      throw new Error(response.msg || 'Error al actualizar usuario');
    }
    
    console.log(`✅ Usuario ${userId} actualizado exitosamente`);
    return response.user;
    
  } catch (error) {
    console.error('❌ Error en updateUser:', error);
    throw error;
  }
};

// ============================================
// ELIMINAR USUARIO (Admin)
// ============================================
export const deleteUser = async (userId) => {
  try {
    console.log(`🗑️ Eliminando usuario ${userId}`);
    
    const response = await userAPI.deleteUser(userId);
    
    if (!response.ok) {
      throw new Error(response.msg || 'Error al eliminar usuario');
    }
    
    console.log(`✅ Usuario ${userId} eliminado exitosamente`);
    return response;
    
  } catch (error) {
    console.error('❌ Error en deleteUser:', error);
    throw error;
  }
};

// ============================================
// CAMBIAR ESTADO DEL USUARIO (Activar/Desactivar/Suspender)
// ============================================
export const changeUserStatus = async (userId, status) => {
  try {
    console.log(`🔄 Cambiando estado de usuario ${userId} a: ${status}`);
    
    let response;
    
    if (status === 'active') {
      response = await userAPI.activateUser(userId);
    } else if (status === 'inactive') {
      response = await userAPI.deactivateUser(userId);
    } else if (status === 'suspended') {
      // Para suspendido, usamos deactivate (ajusta según tu backend)
      response = await userAPI.deactivateUser(userId);
    }
    
    if (!response.ok) {
      throw new Error(response.msg || 'Error al cambiar estado');
    }
    
    console.log(`✅ Estado de usuario ${userId} cambiado a: ${status}`);
    return response;
    
  } catch (error) {
    console.error('❌ Error en changeUserStatus:', error);
    throw error;
  }
};

// ============================================
// CAMBIAR ROL DEL USUARIO
// ============================================
export const changeUserRole = async (userId, role) => {
  try {
    console.log(`🔄 Cambiando rol de usuario ${userId} a: ${role}`);
    
    // Validar rol permitido
    const allowedRoles = ['admin', 'docente', 'superadmin'];
    if (!allowedRoles.includes(role)) {
      throw new Error(`Rol no permitido: ${role}`);
    }
    
    const response = await userAPI.changeUserRole(userId, role);
    
    if (!response.ok) {
      throw new Error(response.msg || 'Error al cambiar rol');
    }
    
    console.log(`✅ Rol de usuario ${userId} cambiado a: ${role}`);
    return response;
    
  } catch (error) {
    console.error('❌ Error en changeUserRole:', error);
    throw error;
  }
};

// ============================================
// BUSCAR USUARIOS
// ============================================
export const searchUsers = async (searchTerm) => {
  try {
    console.log(`🔍 Buscando usuarios con: "${searchTerm}"`);
    
    const response = await userAPI.searchUsers(searchTerm);
    
    if (response.ok && response.users) {
      return response.users;
    }
    
    return [];
  } catch (error) {
    console.error('❌ Error en searchUsers:', error);
    throw error;
  }
};

// ============================================
// OBTENER USUARIO POR ID
// ============================================
export const getUserById = async (userId) => {
  try {
    console.log(`🔍 Obteniendo usuario ${userId}`);
    
    // Como no tenemos un endpoint específico, listamos y filtramos
    const users = await listUsers();
    const user = users.find(u => u.id === parseInt(userId));
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user;
    
  } catch (error) {
    console.error('❌ Error en getUserById:', error);
    throw error;
  }
};

// ============================================
// VALIDAR CÉDULA (Helper)
// ============================================
export const validateVenezuelanId = (dni) => {
  if (!dni) return false;
  
  // Formato V-12345678
  const pattern = /^V-\d{6,8}$/;
  return pattern.test(dni);
};

// ============================================
// FORMATEAR CÉDULA (Helper)
// ============================================
export const formatVenezuelanId = (dni) => {
  if (!dni) return 'V-';
  
  // Si ya tiene formato V-, devolverlo
  if (dni.startsWith('V-')) {
    return dni;
  }
  
  // Limpiar y formatear
  const numbers = dni.replace(/[^0-9]/g, '');
  return numbers ? `V-${numbers}` : 'V-';
};