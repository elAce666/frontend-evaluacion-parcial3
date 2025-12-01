import { ROLES } from './constants';

/**
 * Validador de Roles
 * Funciones para verificar permisos según roles
 */

// Normalizar nombre de rol
const normalizeRole = (role) => {
  if (!role) return null;
  return role.toString().toUpperCase();
};

// Verificar si es Administrador
export const isAdmin = (userRole) => {
  const normalized = normalizeRole(userRole);
  return normalized === ROLES.ADMIN || normalized === ROLES.ADMINISTRADOR;
};

// Verificar si es Vendedor
export const isVendedor = (userRole) => {
  const normalized = normalizeRole(userRole);
  return normalized === ROLES.VENDEDOR;
};

// Verificar si es Cliente
export const isCliente = (userRole) => {
  const normalized = normalizeRole(userRole);
  return normalized === ROLES.CLIENTE;
};

// Verificar si tiene uno de los roles especificados (según guía del backend)
export const hasRole = (roles) => {
  const current = localStorage.getItem('rol');
  return !!current && roles.includes(current);
};

// Verificar si tiene uno de los roles especificados (función alternativa)
export const hasAnyRole = (userRole, allowedRoles) => {
  const normalized = normalizeRole(userRole);
  
  if (!normalized || !Array.isArray(allowedRoles)) {
    return false;
  }
  
  return allowedRoles.some(role => normalizeRole(role) === normalized);
};

// Obtener permisos según el rol
export const getPermissions = (userRole) => {
  const normalized = normalizeRole(userRole);
  
  const permissions = {
    // Dashboard
    viewDashboard: false,
    
    // Productos
    viewProducts: false,
    createProduct: false,
    editProduct: false,
    deleteProduct: false,
    
    // Órdenes
    viewOrders: false,
    createOrder: false,
    editOrder: false,
    cancelOrder: false,
    viewOrderDetails: false,
    
    // Usuarios
    viewUsers: false,
    createUser: false,
    editUser: false,
    deleteUser: false,
    changeUserRole: false,
    
    // Tienda
    viewStore: false,
    makePurchase: false,
    
    // Reportes
    viewReports: false,
  };
  
  // Permisos según rol
  switch (normalized) {
    case ROLES.ADMIN:
    case ROLES.ADMINISTRADOR:
      // Administrador puede ver todo pero NO crear órdenes (solo VENDEDOR y CLIENTE)
      return {
        viewDashboard: true,
        viewProducts: true,
        createProduct: true,
        editProduct: true,
        deleteProduct: true,
        viewOrders: true,
        createOrder: false,  // ADMIN NO crea órdenes
        editOrder: true,
        cancelOrder: true,
        viewOrderDetails: true,
        viewUsers: true,
        createUser: true,
        editUser: true,
        deleteUser: true,
        changeUserRole: true,
        viewStore: false,
        makePurchase: false,
        viewReports: true,
      };
      
    case ROLES.VENDEDOR:
      // VENDEDOR puede crear órdenes (ventas)
      return {
        ...permissions,
        viewDashboard: true,
        viewProducts: true,
        viewOrders: true,
        viewOrderDetails: true,
        createOrder: true,
      };
      
    case ROLES.CLIENTE:
      // Cliente solo puede acceder a la tienda
      return {
        ...permissions,
        viewStore: true,
        makePurchase: true,
        createOrder: true,
      };
      
    default:
      return permissions;
  }
};

// Verificar si puede acceder a una ruta específica
export const canAccessRoute = (userRole, routePath) => {
  const normalized = normalizeRole(userRole);
  const permissions = getPermissions(normalized);
  
  // Mapeo de rutas a permisos
  const routePermissions = {
    '/dashboard': permissions.viewDashboard,
    '/products': permissions.viewProducts,
    '/orders': permissions.viewOrders,
    '/users': permissions.viewUsers,
    '/store': permissions.viewStore,
    '/reports': permissions.viewReports,
  };
  
  // Buscar la ruta base
  for (const [route, hasPermission] of Object.entries(routePermissions)) {
    if (routePath.startsWith(route)) {
      return hasPermission;
    }
  }
  
  // Por defecto, denegar acceso
  return false;
};

// Obtener ruta de redirección por defecto según rol
export const getDefaultRoute = (userRole) => {
  const normalized = normalizeRole(userRole);
  
  switch (normalized) {
    case ROLES.ADMIN:
    case ROLES.ADMINISTRADOR:
      return '/dashboard';
      
    case ROLES.VENDEDOR:
      return '/dashboard';
      
    case ROLES.CLIENTE:
      return '/store';
      
    default:
      return '/login';
  }
};

// Obtener nombre descriptivo del rol
export const getRoleDisplayName = (userRole) => {
  const normalized = normalizeRole(userRole);
  
  switch (normalized) {
    case ROLES.ADMIN:
    case ROLES.ADMINISTRADOR:
      return 'Administrador';
      
    case ROLES.VENDEDOR:
      return 'Vendedor';
      
    case ROLES.CLIENTE:
      return 'Cliente';
      
    default:
      return 'Usuario';
  }
};

// Obtener opciones de menú según el rol
export const getMenuItems = (userRole) => {
  const normalized = normalizeRole(userRole);
  const permissions = getPermissions(normalized);
  
  const menuItems = [];
  
  if (permissions.viewDashboard) {
    menuItems.push({ label: 'Dashboard', path: '/dashboard', icon: '📊' });
  }
  
  if (permissions.viewProducts) {
    menuItems.push({ label: 'Productos', path: '/products', icon: '📦' });
  }
  
  if (permissions.viewOrders) {
    menuItems.push({ label: 'Órdenes', path: '/orders', icon: '📋' });
  }
  
  if (permissions.viewUsers) {
    menuItems.push({ label: 'Usuarios', path: '/users', icon: '👥' });
  }
  
  if (permissions.viewStore) {
    menuItems.push({ label: 'Tienda', path: '/store', icon: '🛒' });
  }
  
  if (permissions.viewReports) {
    menuItems.push({ label: 'Reportes', path: '/reports', icon: '📈' });
  }
  
  return menuItems;
};

export default {
  isAdmin,
  isVendedor,
  isCliente,
  hasAnyRole,
  getPermissions,
  canAccessRoute,
  getDefaultRoute,
  getRoleDisplayName,
  getMenuItems,
};
