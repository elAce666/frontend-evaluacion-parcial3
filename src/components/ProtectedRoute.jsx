import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Componente para proteger rutas que requieren autenticación
 * 
 * Si el usuario no está autenticado, redirige al login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Mientras se verifica la autenticación, mostrar loading
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verificando sesión...</p>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Usuario no autenticado, redirigiendo al login');
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado, mostrar el contenido
  return children;
};

export default ProtectedRoute;
