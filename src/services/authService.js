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

const USE_MOCK_DATA = true; // Cambiar a false cuando el backend esté disponible

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
            role: user.role,
          };
          
          // Guardar token y datos del usuario en localStorage
          localStorage.setItem('authToken', token);
          localStorage.setItem('userData', JSON.stringify(userData));
          
          console.log('[Auth] Login exitoso (MOCK):', userData);
          
          resolve({
            success: true,
            data: { token, user: userData },
          });
        } else {
          resolve({
            success: false,
            message: 'Credenciales inválidas',
          });
        }
      }, 500); // Simular delay de red
    });
  }
  
  // Código original para backend real
  try {
    const response = await api.post('/auth/login', credentials);
    
    const { token, user } = response.data;
    
    // Guardar token y datos del usuario en localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    
    console.log('[Auth] Login exitoso:', user);
    
    return {
      success: true,
      data: { token, user },
    };
  } catch (error) {
    console.error('[Auth] Error en login:', error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
      status: errorInfo.status,
    };
  }
};

// Cerrar sesión
export const logout = async () => {
  try {
    // Llamar al endpoint de logout (opcional, depende del backend)
    await api.post('/auth/logout');
    
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    console.log('[Auth] Logout exitoso');
    
    return { success: true };
  } catch (error) {
    console.error('[Auth] Error en logout:', error);
    
    // Aunque falle el logout en el backend, limpiar localStorage localmente
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    return { success: true };
  }
};

// Obtener usuario actual desde localStorage
export const getCurrentUser = () => {
  const userDataString = localStorage.getItem('userData');
  
  if (!userDataString) {
    return null;
  }
  
  try {
    const userData = JSON.parse(userDataString);
    return userData;
  } catch (error) {
    console.error('[Auth] Error al parsear datos del usuario:', error);
    localStorage.removeItem('userData');
    return null;
  }
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const user = getCurrentUser();
  
  return !!(token && user);
};

// Obtener token actual
export const getToken = () => {
  return localStorage.getItem('authToken');
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
  const user = getCurrentUser();
  return user?.role || null;
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
