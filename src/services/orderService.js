import api, { handleApiError } from './api';

/**
 * Servicio de Órdenes
 * Gestiona todas las operaciones relacionadas con órdenes/boletas
 */

// DATOS MOCK PARA DESARROLLO
const USE_MOCK_DATA = false;

let MOCK_ORDERS = [
  { 
    id: 1, 
    customerId: 3, 
    customerName: 'Cliente', 
    total: 979.98, 
    status: 'DELIVERED',
    createdAt: '2025-11-20T10:30:00',
    items: [
      { productId: 1, productName: 'Laptop HP', quantity: 1, price: 899.99 },
      { productId: 2, productName: 'Mouse Logitech', quantity: 1, price: 79.99 }
    ]
  },
  { 
    id: 2, 
    customerId: 3, 
    customerName: 'Cliente', 
    total: 349.99, 
    status: 'PROCESSING',
    createdAt: '2025-11-22T14:15:00',
    items: [
      { productId: 4, productName: 'Monitor Samsung 27"', quantity: 1, price: 349.99 }
    ]
  },
  { 
    id: 3, 
    customerId: 3, 
    customerName: 'Ana García', 
    total: 289.98, 
    status: 'CONFIRMED',
    createdAt: '2025-11-24T09:00:00',
    items: [
      { productId: 6, productName: 'Audífonos Sony', quantity: 1, price: 199.99 },
      { productId: 5, productName: 'Webcam Logitech', quantity: 1, price: 89.99 }
    ]
  },
];

// Obtener todas las órdenes
export const listOrders = async () => {
  const { data } = await api.get('/orders');
  return data;
};

// Alias para compatibilidad
export const getAllOrders = async () => {
  try {
    const data = await listOrders();
    
    // Transform backend DTO fields to frontend format
    const transformedData = data.map(order => ({
      id: order.id,
      customerId: order.clienteId,
      customerName: order.clienteNombre,
      vendorId: order.vendedorId,
      vendorName: order.vendedorNombre,
      total: order.montoTotal,
      date: order.fecha,
      createdAt: order.fechaCreacion,
      status: order.estado,
      observations: order.observaciones
    }));
    
    return { success: true, data: transformedData };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message, data: [] };
  }
};

// Obtener orden por ID
export const getOrder = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

// Alias para compatibilidad
export const getOrderById = async (id) => {
  try {
    const data = await getOrder(id);
    return { success: true, data };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message, data: null };
  }
};

// Crear nueva orden (ADMIN, VENDEDOR, CLIENTE)
export const createOrder = async (o) => {
  // Acepta contratos flexibles desde UI y normaliza para BE
  const medioPago = o.medioPago || o.paymentMethod || 'efectivo';
  const cuotas = o.cuotas ?? (medioPago === 'credito' ? 1 : 1);
  const subtotal = o.subtotal ?? o.montoSubtotal ?? 0;
  const iva = o.iva ?? o.tax ?? 0;
  const total = o.total ?? o.montoTotal ?? o.monto_total ?? (subtotal + iva);

  const detalle = (o.items || o.detalle || []).map(it => ({
    productId: it.productId ?? it.id,
    cantidad: Number(it.quantity ?? it.cantidad ?? 1),
    precio_unitario: Number(it.price ?? it.precio_unitario ?? 0),
  }));

  const payload = {
    // Contrato DTO OrderRequest en backend
    clienteId: o.customerId ?? o.clienteId ?? o?.cliente?.id,
    vendedorId: o.vendedorId ?? o?.vendedor?.id,
    montoTotal: Number(total),
    estado: (o.estado || o.status || 'PENDIENTE').toUpperCase(),
    // Extra (no requerido por DTO, backend los ignora si no mapea):
    medioPago,
    cuotas,
    detalle,
    subtotal,
    iva,
  };

  try {
    console.log('[createOrder] Enviando payload:', payload);
    console.log('[createOrder] Token en localStorage:', localStorage.getItem('token'));
    const { data } = await api.post('/orders', payload);
    return { success: true, data };
  } catch (error) {
    console.error('[createOrder] Error:', error.response?.status, error.response?.data);
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message };
  }
};

// Actualizar orden (solo ADMIN)
export const updateOrder = async (id, o) => {
  const { data } = await api.put(`/orders/${id}`, o);
  return data;
};

// Alias para compatibilidad con estado
export const updateOrderStatus = async (id, status) => {
  try {
    const data = await updateOrder(id, { status });
    return { success: true, data, message: 'Estado actualizado exitosamente' };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message };
  }
};

// Eliminar orden (solo ADMIN)
export const deleteOrder = async (id) => api.delete(`/orders/${id}`);

// Cancelar orden (alias)
export const cancelOrder = async (id) => {
  try {
    await deleteOrder(id);
    return { success: true, message: 'Orden cancelada exitosamente' };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message };
  }
};

// Obtener órdenes del usuario actual
export const getMyOrders = async () => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[Orders] Obteniendo mis órdenes (MOCK)');
        resolve({
          success: true,
          data: MOCK_ORDERS,
        });
      }, 300);
    });
  }
  
  try {
    const response = await api.get('/orders/my-orders');
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('[Orders] Error al obtener mis órdenes:', error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
      data: [],
    };
  }
};

// Obtener detalle de orden (items)
export const getOrderDetails = async (id) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = MOCK_ORDERS.find(o => o.id === id);
        if (order && order.items) {
          console.log('[Orders] Detalles obtenidos (MOCK)');
          resolve({
            success: true,
            data: order.items,
          });
        } else {
          resolve({
            success: false,
            message: 'Orden no encontrada',
            data: [],
          });
        }
      }, 300);
    });
  }
  
  try {
    const response = await api.get(`/orders/${id}/details`);
    
    // Transform backend DTO fields to frontend format
    const transformedData = response.data.map(item => ({
      productId: item.perfumeId,
      productName: item.perfumeNombre,
      quantity: item.cantidad,
      price: item.precioUnitario,
      subtotal: item.subtotal
    }));
    
    return {
      success: true,
      data: transformedData,
    };
  } catch (error) {
    console.error(`[Orders] Error al obtener detalle de orden ${id}:`, error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
      data: [],
    };
  }
};

// Obtener estadísticas de órdenes (solo ADMIN)
export const getOrderStatistics = async () => {
  try {
    const response = await api.get('/orders/statistics');
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('[Orders] Error al obtener estadísticas:', error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
      data: null,
    };
  }
};

// Alias getAll para compatibilidad con Reports
export const getAll = async () => {
  try {
    const data = await listOrders();
    return { success: true, data };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message, data: [] };
  }
};

export default {
  getAllOrders,
  getAll,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getMyOrders,
  getOrderDetails,
  getOrderStatistics,
};
