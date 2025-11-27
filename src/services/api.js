import axios from 'axios';

// URL base de la API del backend
// Usar variable de entorno si está disponible, sino usar localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para añadir el token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Añadir el token al header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.status, error.response?.data);
    
    // Si el token es inválido o expiró (401), cerrar sesión
    if (error.response?.status === 401) {
      console.warn('[Auth] Token inválido o expirado. Cerrando sesión...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Redirigir al login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Si no tiene permisos (403)
    if (error.response?.status === 403) {
      console.warn('[Auth] Acceso denegado. Permisos insuficientes.');
      alert('No tienes permisos para realizar esta acción.');
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
