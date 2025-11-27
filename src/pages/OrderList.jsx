import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, getOrderDetails } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { getPermissions } from '../utils/roleValidator';
import { ORDER_STATUS_LABELS } from '../utils/constants';

/**
 * OrderList - Lista de órdenes
 * ADMIN: Puede ver, editar y gestionar órdenes
 * VENDEDOR: Solo puede ver (modo lectura)
 */
const OrderList = () => {
  const { user } = useAuth();
  const permissions = getPermissions(user?.role);
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  
  // Cargar órdenes al montar
  useEffect(() => {
    loadOrders();
  }, []);
  
  const loadOrders = async () => {
    setIsLoading(true);
    setError('');
    
    const result = await getAllOrders();
    
    if (result.success) {
      setOrders(result.data);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };
  
  // Ver detalles de una orden
  const viewDetails = async (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
    
    const result = await getOrderDetails(order.id);
    
    if (result.success) {
      setOrderDetails(result.data);
    } else {
      alert(result.message);
    }
  };
  
  // Cerrar modal de detalles
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedOrder(null);
    setOrderDetails([]);
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando órdenes...</p>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📋 Órdenes</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {permissions.viewOrders ? (
        <>
          {!permissions.editOrder && (
            <div className="info-message">
              ℹ️ Estás viendo las órdenes en modo <strong>solo lectura</strong>
            </div>
          )}
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Orden</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      No hay órdenes registradas
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customerName || order.customerId}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>${order.total?.toFixed(2) || '0.00'}</td>
                      <td>
                        <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                          {ORDER_STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => viewDetails(order)}
                          className="btn-view"
                          title="Ver detalles"
                        >
                          👁️ Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="unauthorized-message">
          No tienes permisos para ver órdenes
        </div>
      )}
      
      {/* Modal de detalles de orden */}
      {showDetails && selectedOrder && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h2>Detalle de Orden #{selectedOrder.id}</h2>
            
            <div className="order-info">
              <div className="info-row">
                <span className="info-label">Cliente:</span>
                <span className="info-value">{selectedOrder.customerName || selectedOrder.customerId}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Fecha:</span>
                <span className="info-value">{formatDate(selectedOrder.createdAt)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Estado:</span>
                <span className={`status-badge status-${selectedOrder.status?.toLowerCase()}`}>
                  {ORDER_STATUS_LABELS[selectedOrder.status] || selectedOrder.status}
                </span>
              </div>
            </div>
            
            <h3>Productos</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>
                        Cargando detalles...
                      </td>
                    </tr>
                  ) : (
                    orderDetails.map((item, index) => (
                      <tr key={index}>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price?.toFixed(2)}</td>
                        <td>${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      Total:
                    </td>
                    <td style={{ fontWeight: 'bold' }}>
                      ${selectedOrder.total?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="modal-actions">
              <button onClick={closeDetails} className="btn-secondary">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
