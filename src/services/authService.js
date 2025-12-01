import api from './api';

// NOTE: normalize auth data across the app
// localStorage keys used:
// - token: JWT token string
// - userData: JSON string with user info { username, role, name?, email? }

const USE_MOCK_DATA = false;

export const login = async (credentials) => {
  if (USE_MOCK_DATA) {
    // keep behavior similar to real API for tests
    const token = 'mock-jwt-token-' + Date.now();
    const userObj = { username: credentials.username, role: credentials.username.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'CLIENTE' };
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userObj));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return { success: true, data: { user: userObj, token } };
  }

  try {
    console.log('[authService] Login request with credentials:', { username: credentials.username });
    const { data } = await api.post('/auth/login', credentials);
    console.log('[authService] Login response data:', data);
    
    if (data.error) {
      console.error('[authService] Login error:', data.error);
      return { success: false, message: data.error };
    }

    const { token, usuario, rol } = data;
    console.log('[authService] Login success. Token:', token.substring(0, 20) + '...', 'Usuario:', usuario, 'Rol:', rol);

    const userObj = { username: usuario, role: rol };

    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userObj));
    // compatibility keys used elsewhere
    localStorage.setItem('rol', rol);
    localStorage.setItem('usuario', usuario);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { success: true, data: { user: userObj, token } };
  } catch (error) {
    console.error('[authService] Login catch error:', error);
    console.error('[authService] Error response:', error.response?.data);
    const errorMessage = error.response?.data?.error || error.message || 'Error desconocido';
    return { success: false, message: errorMessage };
  }
};

export const logout = () => {
  ['token', 'userData'].forEach(k => localStorage.removeItem(k));
  delete api.defaults.headers.common['Authorization'];
  return { success: true };
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('userData');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const hasRole = (role) => {
  const user = getCurrentUser();
  if (!user || !user.role) return false;
  return user.role.toUpperCase() === role.toUpperCase();
};

export const hasAnyRole = (roles) => {
  const user = getCurrentUser();
  if (!user || !user.role) return false;
  const userRole = user.role.toUpperCase();
  return roles.some(role => role.toUpperCase() === userRole);
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

export async function validateToken(token) {
  // if token parameter omitted, try localStorage
  const t = token || getToken();
  if (!t) return { valid: false };
  try {
    const { data } = await api.post('/auth/validate-token', { token: t });
    if (data && data.valid) {
      // normalize and store user data
      const userObj = { username: data.usuario, role: data.rol };
      localStorage.setItem('userData', JSON.stringify(userObj));
      // compatibility
      localStorage.setItem('rol', data.rol);
      localStorage.setItem('usuario', data.usuario);
      return { valid: true, usuario: data.usuario, rol: data.rol };
    }
    return { valid: false, error: data?.error };
  } catch (e) {
    return { valid: false, error: e.message };
  }
}

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return { success: true, data: response.data };
};

export default { login, logout, getCurrentUser, isAuthenticated, getToken, hasRole, hasAnyRole, getUserRole, validateToken, register };
