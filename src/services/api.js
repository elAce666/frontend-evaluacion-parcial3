import axios from 'axios';

// URL base de la API del backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para añadir el token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      ['token', 'rol', 'usuario'].forEach(k => localStorage.removeItem(k));
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Funciones auxiliares para manejo de errores
export const handleApiError = (error) => {
  if (error.response) {
    // El servidor respondió con un código de estado fuera del rango 2xx
    return {
      message: error.response.data?.message || 'Error en el servidor',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // La petición se hizo pero no se recibió respuesta
    return {
      message: 'No se pudo conectar con el servidor. Verifica tu conexión.',
      status: 0,
    };
  } else {
    // Algo sucedió al configurar la petición
    return {
      message: error.message || 'Error desconocido',
      status: -1,
    };
  }
};

// Función para verificar si hay conexión con el backend
export const checkBackendConnection = async () => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('[Backend] No se pudo conectar con el backend:', error);
    return false;
  }
};

export default api;
