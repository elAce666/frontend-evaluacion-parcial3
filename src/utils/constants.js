/**
 * Constantes de la Aplicación
 */

// Roles de Usuario
export const ROLES = {
  ADMIN: 'ADMIN',
  ADMINISTRADOR: 'ADMINISTRADOR',
  VENDEDOR: 'VENDEDOR',
  CLIENTE: 'CLIENTE',
};

// Estados de Orden
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

// Traducciones de estados
export const ORDER_STATUS_LABELS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  PROCESSING: 'En Proceso',
  SHIPPED: 'Enviada',
  DELIVERED: 'Entregada',
  CANCELLED: 'Cancelada',
};

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  USERS: '/users',
  STORE: '/store',
  PROFILE: '/profile',
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No tienes autorización para acceder a este recurso',
  FORBIDDEN: 'No tienes permisos para realizar esta acción',
  NOT_FOUND: 'Recurso no encontrado',
  SERVER_ERROR: 'Error en el servidor. Intenta nuevamente más tarde',
  NETWORK_ERROR: 'Error de conexión. Verifica tu red e intenta nuevamente',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente',
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

export default {
  ROLES,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ROUTES,
  ERROR_MESSAGES,
  PAGINATION,
};
