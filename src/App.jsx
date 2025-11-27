import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import OrderList from './pages/OrderList';
import UserManagement from './pages/UserManagement';
import Store from './pages/Store';
import { ROLES } from './utils/constants';
import './styles/App.css';

/**
 * Componente principal de la aplicación
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          
          <main className="main-content">
            <Routes>
              {/* Ruta pública */}
              <Route path="/login" element={<Login />} />
              
              {/* Ruta raíz - redirigir al dashboard o login */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                } 
              />
              
              {/* Dashboard - Accesible por ADMIN y VENDEDOR */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ADMINISTRADOR, ROLES.VENDEDOR]}>
                      <Dashboard />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              
              {/* Productos - Accesible por ADMIN y VENDEDOR */}
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ADMINISTRADOR, ROLES.VENDEDOR]}>
                      <ProductList />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              
              {/* Órdenes - Accesible por ADMIN y VENDEDOR */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ADMINISTRADOR, ROLES.VENDEDOR]}>
                      <OrderList />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              
              {/* Usuarios - Solo ADMIN */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ADMINISTRADOR]}>
                      <UserManagement />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
              
              {/* Tienda - Accesible por todos los roles autenticados */}
              <Route
                path="/store"
                element={
                  <ProtectedRoute>
                    <Store />
                  </ProtectedRoute>
                }
              />
              
              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <footer className="app-footer">
            <p>© 2025 Sistema de Gestión - Evaluación Parcial N° 3</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Componente para página no encontrada
const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <a href="/">Volver al inicio</a>
    </div>
  );
};

export default App;
