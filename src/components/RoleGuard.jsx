import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasAnyRole as checkRole, getDefaultRoute } from '../utils/roleValidator';

/**
 * RoleGuard - Componente para proteger rutas según roles específicos
 * 
 * Props:
 * - allowedRoles: Array de roles permitidos (ej: ['ADMIN', 'VENDEDOR'])
 * - redirectTo: Ruta a la que redirigir si no tiene permiso (opcional)
 * - showUnauthorized: Mostrar mensaje de no autorizado en vez de redirigir (opcional)
 */
const RoleGuard = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = null,
  showUnauthorized = false 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Mientras se verifica la autenticación, mostrar loading
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verificando permisos...</p>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log('[RoleGuard] Usuario no autenticado');
    return <Navigate to="/login" replace />;
  }
  
  // Verificar si el usuario tiene uno de los roles permitidos
  const hasPermission = checkRole(user?.role, allowedRoles);
  
  if (!hasPermission) {
    console.log(
      `[RoleGuard] Acceso denegado. Rol actual: ${user?.role}, Roles permitidos: ${allowedRoles.join(', ')}`
    );
    
    // Si se especifica showUnauthorized, mostrar mensaje
    if (showUnauthorized) {
      return (
        <div className="unauthorized-container">
          <div className="unauthorized-card">
            <h2>🚫 Acceso Denegado</h2>
            <p>No tienes permisos para acceder a este recurso.</p>
            <p className="role-info">
              Tu rol actual: <strong>{user?.role}</strong>
            </p>
            <button 
              onClick={() => window.history.back()}
              className="btn-back"
            >
              Volver
            </button>
          </div>
        </div>
      );
    }
    
    // Redirigir a la ruta especificada o a la ruta por defecto según el rol
    const redirectRoute = redirectTo || getDefaultRoute(user?.role);
    console.error(
      `[RoleGuard] Redirigiendo a ${redirectRoute}. Rol no autorizado: ${user?.role}`
    );
    return <Navigate to={redirectRoute} replace />;
  }
  
  // Si tiene permiso, mostrar el contenido
  return children;
};

export default RoleGuard;
