import api, { handleApiError } from './api';

/**
 * Servicio de Usuarios
 * Gestiona operaciones de usuarios (solo ADMIN)
 */

// DATOS MOCK PARA DESARROLLO
const USE_MOCK_DATA = false;

let MOCK_USERS = [
  { id: 1, username: 'admin', name: 'Administrador', email: 'admin@sistema.com', role: 'ADMIN' },
  { id: 2, username: 'vendedor', name: 'Vendedor', email: 'vendedor@sistema.com', role: 'VENDEDOR' },
  { id: 3, username: 'cliente', name: 'Cliente', email: 'cliente@sistema.com', role: 'CLIENTE' },
  { id: 4, username: 'juan.perez', name: 'Juan Pérez', email: 'juan@email.com', role: 'CLIENTE' },
  { id: 5, username: 'maria.lopez', name: 'María López', email: 'maria@email.com', role: 'VENDEDOR' },
];

// Obtener todos los usuarios (solo ADMIN)
export const listUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

// Alias para compatibilidad
export const getAllUsers = async () => {
  try {
    const data = await listUsers();
    return { success: true, data };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message, data: [] };
  }
};

// Obtener usuario por username (solo ADMIN)
export const getUser = async (username) => {
  const { data } = await api.get(`/users/${username}`);
  return data;
};

// Alias para compatibilidad con ID
export const getUserById = async (id) => {
  try {
    const data = await getUser(id);
    return { success: true, data };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message, data: null };
  }
};

// Crear nuevo usuario (solo ADMIN)
export const createUser = async (u) => {
  const { data } = await api.post('/users', u);
  return data;
};

// Actualizar usuario (solo ADMIN)
export const updateUser = async (id, userData) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_USERS.findIndex(u => u.id === id);
        if (index !== -1) {
          MOCK_USERS[index] = {
            ...MOCK_USERS[index],
            ...userData,
          };
          console.log('[Users] Usuario actualizado (MOCK):', MOCK_USERS[index]);
          resolve({
            success: true,
            data: MOCK_USERS[index],
            message: 'Usuario actualizado exitosamente',
          });
        } else {
          resolve({
            success: false,
            message: 'Usuario no encontrado',
          });
        }
      }, 300);
    });
  }
  
  try {
    const response = await api.put(`/users/${id}`, userData);
    
    console.log(`[Users] Usuario ${id} actualizado exitosamente`);
    
    return {
      success: true,
      data: response.data,
      message: 'Usuario actualizado exitosamente',
    };
  } catch (error) {
    console.error(`[Users] Error al actualizar usuario ${id}:`, error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
    };
  }
};

// Eliminar usuario (solo ADMIN)
export const deleteUser = async (id) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_USERS.findIndex(u => u.id === id);
        if (index !== -1) {
          MOCK_USERS.splice(index, 1);
          console.log('[Users] Usuario eliminado (MOCK)');
          resolve({
            success: true,
            message: 'Usuario eliminado exitosamente',
          });
        } else {
          resolve({
            success: false,
            message: 'Usuario no encontrado',
          });
        }
      }, 300);
    });
  }
  
  try {
    await api.delete(`/users/${id}`);
    
    console.log(`[Users] Usuario ${id} eliminado exitosamente`);
    
    return {
      success: true,
      message: 'Usuario eliminado exitosamente',
    };
  } catch (error) {
    console.error(`[Users] Error al eliminar usuario ${id}:`, error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
    };
  }
};

// Cambiar rol de usuario (solo ADMIN)
export const changeUserRole = async (id, newRole) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(u => u.id === id);
        if (user) {
          user.role = newRole;
          console.log('[Users] Rol cambiado (MOCK)');
          resolve({
            success: true,
            data: user,
            message: 'Rol actualizado exitosamente',
          });
        } else {
          resolve({
            success: false,
            message: 'Usuario no encontrado',
          });
        }
      }, 300);
    });
  }
  
  try {
    const response = await api.patch(`/users/${id}/role`, { role: newRole });
    
    console.log(`[Users] Rol de usuario ${id} cambiado a ${newRole}`);
    
    return {
      success: true,
      data: response.data,
      message: 'Rol actualizado exitosamente',
    };
  } catch (error) {
    console.error(`[Users] Error al cambiar rol de usuario ${id}:`, error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
    };
  }
};

// Obtener perfil del usuario actual
export const getMyProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('[Users] Error al obtener perfil:', error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
      data: null,
    };
  }
};

// Actualizar perfil del usuario actual
export const updateMyProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    
    console.log('[Users] Perfil actualizado exitosamente');
    
    // Actualizar localStorage con los nuevos datos
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const updatedUser = { ...currentUser, ...response.data };
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    
    return {
      success: true,
      data: response.data,
      message: 'Perfil actualizado exitosamente',
    };
  } catch (error) {
    console.error('[Users] Error al actualizar perfil:', error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
    };
  }
};

// Alias para compatibilidad con Reports
export const getAll = async () => {
  return getAllUsers();
};

export default {
  getAll,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  getMyProfile,
  updateMyProfile,
};
