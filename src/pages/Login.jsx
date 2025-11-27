import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Login - Página de inicio de sesión
 */
const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error al escribir
    if (error) {
      setError('');
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos
    if (!credentials.username || !credentials.password) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await login(credentials);
      
      if (result.success) {
        console.log('[Login] Redirigiendo a:', result.redirectTo);
        navigate(result.redirectTo, { replace: true });
      } else {
        setError(result.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('[Login] Error:', err);
      setError('Error inesperado. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏢 Sistema de Gestión</h1>
          <p>Evaluación Parcial N° 3</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Ingresa tu usuario"
              disabled={isLoading}
              autoComplete="username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              disabled={isLoading}
              autoComplete="current-password"
              required
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="login-info">
          <h3>Usuarios de Prueba:</h3>
          <ul>
            <li><strong>Admin:</strong> admin / admin123</li>
            <li><strong>Vendedor:</strong> vendedor / vendedor123</li>
            <li><strong>Cliente:</strong> cliente / cliente123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
