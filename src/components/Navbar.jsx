import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMenuItems, getRoleDisplayName } from '../utils/roleValidator';

/**
 * Navbar - Barra de navegación principal
 * Muestra opciones según el rol del usuario
 */
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Si no está autenticado, no mostrar navbar
  if (!isAuthenticated) {
    return null;
  }
  
  // Obtener elementos del menú según el rol
  const menuItems = getMenuItems(user?.role);
  
  // Manejar logout
  const handleLogout = async () => {
    const confirmed = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
    
    if (confirmed) {
      await logout();
      navigate('/login');
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo y título */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🏢</span>
            <span className="brand-text">Sistema de Gestión</span>
          </Link>
        </div>
        
        {/* Menú de navegación */}
        <ul className="navbar-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="navbar-item">
              <Link to={item.path} className="navbar-link">
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Usuario y logout */}
        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{user?.name || user?.username}</span>
            <span className="user-role">{getRoleDisplayName(user?.role)}</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="btn-logout"
            title="Cerrar sesión"
          >
            <span>🚪</span>
            <span className="logout-text">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
