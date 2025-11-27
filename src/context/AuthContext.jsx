import { createContext, useContext, useState, useEffect } from 'react';
import { 
  login as loginService, 
  logout as logoutService,
  getCurrentUser,
  isAuthenticated as checkAuth,
  getUserRole,
} from '../services/authService';
import { getDefaultRoute } from '../utils/roleValidator';

/**
 * Context de Autenticación
 * Proporciona estado de autenticación global y funciones relacionadas
 */

const AuthContext = createContext(null);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Inicializar estado de autenticación al montar el componente
  useEffect(() => {
    const initAuth = () => {
      try {
        const authenticated = checkAuth();
        
        if (authenticated) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
          
          console.log('[AuthContext] Usuario autenticado:', currentUser);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          
          console.log('[AuthContext] No hay usuario autenticado');
        }
      } catch (error) {
        console.error('[AuthContext] Error al inicializar autenticación:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Función de login
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await loginService(credentials);
      
      if (result.success) {
        const { user: userData } = result.data;
        
        setUser(userData);
        setIsAuthenticated(true);
        
        console.log('[AuthContext] Login exitoso:', userData);
        
        return {
          success: true,
          redirectTo: getDefaultRoute(userData.role),
        };
      } else {
        setError(result.message);
        
        return {
          success: false,
          message: result.message,
        };
      }
    } catch (error) {
      console.error('[AuthContext] Error en login:', error);
      
      const errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Función de logout
  const logout = async () => {
    try {
      setIsLoading(true);
      
      await logoutService();
      
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      
      console.log('[AuthContext] Logout exitoso');
      
      return { success: true };
    } catch (error) {
      console.error('[AuthContext] Error en logout:', error);
      
      // Aunque haya error, limpiar el estado local
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Actualizar usuario en el contexto
  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
    
    // También actualizar en localStorage
    const currentUser = getCurrentUser();
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    
    console.log('[AuthContext] Usuario actualizado:', updatedUser);
  };
  
  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!user || !user.role) {
      return false;
    }
    
    return user.role.toUpperCase() === role.toUpperCase();
  };
  
  // Verificar si el usuario tiene alguno de los roles especificados
  const hasAnyRole = (roles) => {
    if (!user || !user.role) {
      return false;
    }
    
    const userRole = user.role.toUpperCase();
    return roles.some(role => role.toUpperCase() === userRole);
  };
  
  // Obtener rol del usuario
  const getRole = () => {
    return user?.role || null;
  };
  
  // Valor del contexto
  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
    getRole,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
