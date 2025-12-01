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

// Cargar token guardado (si existe) al iniciar
const token = localStorage.getItem('token');
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Ensure each request uses the latest token from localStorage
api.interceptors.request.use(config => {
  const t = localStorage.getItem('token');
  if (t) config.headers.Authorization = `Bearer ${t}`;
  
  // Agregar timestamp para evitar cache SOLO en GET requests
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _t: Date.now()
    };
  }
  return config;
}, error => Promise.reject(error));

export function handleApiError(error) {
  if (!error) return { status: 0, message: 'Unknown error' };
  if (error.response) {
    const msg = error.response.data?.message || error.response.data?.error || error.response.statusText;
    return { status: error.response.status, message: msg };
  }
  return { status: 0, message: error.message };
}

export default api;
