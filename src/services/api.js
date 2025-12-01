import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 30000, // 30 segundos en lugar de 10
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
});

// Interceptor para SIEMPRE agregar el token actualizado
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  // Si no es un endpoint público, agregar token
  if (!config.noAuth) {
    if (token) {
      // Asegurar que Authorization se configure en el objeto correcto
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('[API] Token agregado a la petición:', config.method, config.url);
    } else {
      console.warn('[API] No hay token disponible para:', config.method, config.url);
    }
  } else {
    // Endpoint público - remover Authorization si existe
    delete config.headers?.Authorization;
    delete api.defaults.headers.common?.Authorization;
  }
  
  // Agregar timestamp para evitar cache en GET
  if (config.method === 'get') {
    config.params = { ...config.params, _t: Date.now() };
  }
  
  return config;
}, error => {
  console.error('[API] Error en interceptor:', error);
  return Promise.reject(error);
});

export function handleApiError(error) {
  if (!error) return { status: 0, message: 'Unknown error' };
  if (error.response) {
    const msg = error.response.data?.message || error.response.data?.error || error.response.statusText;
    return { status: error.response.status, message: msg };
  }
  return { status: 0, message: error.message };
}

export default api;
