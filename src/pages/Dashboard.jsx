import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPermissions } from '../utils/roleValidator';
import { getAllProducts } from '../services/productService';
import { getAllOrders } from '../services/orderService';
import { getAllUsers } from '../services/userService';

/**
 * Dashboard - Página principal según el rol del usuario
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const permissions = getPermissions(user?.role);
  
  // Cargar estadísticas al montar
  useEffect(() => {
    loadStatistics();
  }, []);
  
  const loadStatistics = async () => {
    setIsLoading(true);
    
    try {
      // Cargar productos si tiene permiso
      if (permissions.viewProducts) {
        const productsResult = await getAllProducts();
        if (productsResult.success) {
          setStats(prev => ({ ...prev, products: productsResult.data.length }));
        }
      }
      
      // Cargar órdenes si tiene permiso
      if (permissions.viewOrders) {
        const ordersResult = await getAllOrders();
        if (ordersResult.success) {
          setStats(prev => ({ ...prev, orders: ordersResult.data.length }));
        }
      }
      
      // Cargar usuarios si tiene permiso
      if (permissions.viewUsers) {
        const usersResult = await getAllUsers();
        if (usersResult.success) {
          setStats(prev => ({ ...prev, users: usersResult.data.length }));
        }
      }
    } catch (error) {
      console.error('[Dashboard] Error al cargar estadísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p>Bienvenido, <strong>{user?.name || user?.username}</strong></p>
      </div>
      
      <div className="stats-grid">
        {permissions.viewProducts && (
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>Productos</h3>
              <p className="stat-value">{stats.products}</p>
              <span className="stat-label">Total de productos</span>
            </div>
          </div>
        )}
        
        {permissions.viewOrders && (
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>Órdenes</h3>
              <p className="stat-value">{stats.orders}</p>
              <span className="stat-label">Total de órdenes</span>
            </div>
          </div>
        )}
        
        {permissions.viewUsers && (
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Usuarios</h3>
              <p className="stat-value">{stats.users}</p>
              <span className="stat-label">Total de usuarios</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="dashboard-info">
        <h2>Información de Acceso</h2>
        <div className="access-info">
          <p><strong>Rol:</strong> {user?.role}</p>
          <p><strong>Permisos:</strong></p>
          <ul className="permissions-list">
            {permissions.viewProducts && <li>✅ Ver productos</li>}
            {permissions.createProduct && <li>✅ Crear productos</li>}
            {permissions.editProduct && <li>✅ Editar productos</li>}
            {permissions.deleteProduct && <li>✅ Eliminar productos</li>}
            {permissions.viewOrders && <li>✅ Ver órdenes</li>}
            {permissions.createOrder && <li>✅ Crear órdenes</li>}
            {permissions.editOrder && <li>✅ Editar órdenes</li>}
            {permissions.viewUsers && <li>✅ Gestionar usuarios</li>}
            {permissions.viewStore && <li>✅ Acceder a tienda</li>}
            {permissions.viewReports && <li>✅ Ver reportes</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
