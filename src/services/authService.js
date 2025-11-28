import api, { handleApiError } from './api';

/**
 * Servicio de Autenticación
 * Gestiona login, logout y verificación de sesión
 */

// DATOS MOCK PARA DESARROLLO
const MOCK_USERS = {
  admin: { 
    username: 'admin', 
    password: 'admin123', 
    id: 1,
    name: 'Administrador',
    email: 'admin@sistema.com',
    role: 'ADMIN' 
  },
  vendedor: { 
    username: 'vendedor', 
    password: 'vendedor123',
    id: 2,
    name: 'Vendedor',
    email: 'vendedor@sistema.com',
    role: 'VENDEDOR' 
  },
  cliente: { 
    username: 'cliente', 
    password: 'cliente123',
    id: 3,
    name: 'Cliente',
    email: 'cliente@sistema.com',
    role: 'CLIENTE' 
  },
};

const USE_MOCK_DATA = false; // Usar backend real

// Iniciar sesión
export const login = async (credentials) => {
  // Si usamos datos mock
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = MOCK_USERS[credentials.username];
        if (user && user.password === credentials.password) {
          const token = 'mock-jwt-token-' + Date.now();
          const userData = {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            rol: user.role, // Cambiado a 'rol' para coincidir con backend
          };
          localStorage.setItem('authToken', token);
          localStorage.setItem('userData', JSON.stringify(userData));
          resolve({
            success: true,
            data: { token, usuario: userData, rol: user.role },
          });
        } else {
          resolve({
            success: false,
            message: 'Credenciales inválidas',
          });
        }
      }, 500);
    });
  }
  // Código para backend real
  try {
    const { data } = await api.post('/auth/login', credentials);
    if (data.error) throw new Error(data.error);
    
    const { token, usuario, rol } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);
    localStorage.setItem('usuario', usuario);
    
    return {
      success: true,
      data: { token, usuario, rol },
    };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return {
      success: false,
      message: errorInfo.message || error.message,
      status: errorInfo.status,
    };
  }
};

// Cerrar sesión
export const logout = () => {
  ['token', 'rol', 'usuario'].forEach(k => localStorage.removeItem(k));
  return { success: true };
};

// Obtener usuario actual desde localStorage
export const getCurrentUser = () => {
  const usuario = localStorage.getItem('usuario');
  const rol = localStorage.getItem('rol');
  return usuario ? { usuario, rol } : null;
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Obtener token actual
export const getToken = () => {
  return localStorage.getItem('token');
};

// Verificar si el usuario tiene un rol específico
export const hasRole = (role) => {
  const user = getCurrentUser();
  
  if (!user || !user.role) {
    return false;
  }
  
  return user.role.toUpperCase() === role.toUpperCase();
};

// Verificar si el usuario tiene alguno de los roles especificados
export const hasAnyRole = (roles) => {
  const user = getCurrentUser();
  
  if (!user || !user.role) {
    return false;
  }
  
  const userRole = user.role.toUpperCase();
  return roles.some(role => role.toUpperCase() === userRole);
};

// Obtener rol del usuario actual
export const getUserRole = () => {
  return localStorage.getItem('rol');
};

// Verificar validez del token con el backend
export const validateToken = async () => {
  try {
    const response = await api.get('/auth/validate');
    return response.status === 200;
  } catch (error) {
    console.error('[Auth] Token inválido:', error);
    return false;
  }
};

// Registrar nuevo usuario (solo para admin)
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    console.log('[Auth] Registro exitoso');
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('[Auth] Error en registro:', error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
      status: errorInfo.status,
    };
  }
};

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getToken,
  hasRole,
  hasAnyRole,
  getUserRole,
  validateToken,
  register,
};
