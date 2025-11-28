import api, { handleApiError } from './api';

/**
 * Servicio de Productos
 * Gestiona todas las operaciones CRUD de productos
 */

// DATOS MOCK PARA DESARROLLO
const USE_MOCK_DATA = false;

let MOCK_PRODUCTS = [
  { id: 1, name: 'Laptop HP', description: 'Laptop HP Core i7, 16GB RAM', price: 899.99, stock: 15, category: 'Electrónica' },
  { id: 2, name: 'Mouse Logitech', description: 'Mouse inalámbrico Logitech MX Master', price: 79.99, stock: 50, category: 'Accesorios' },
  { id: 3, name: 'Teclado Mecánico', description: 'Teclado mecánico RGB retroiluminado', price: 129.99, stock: 30, category: 'Accesorios' },
  { id: 4, name: 'Monitor Samsung 27"', description: 'Monitor 4K 27 pulgadas', price: 349.99, stock: 20, category: 'Electrónica' },
  { id: 5, name: 'Webcam Logitech', description: 'Webcam HD 1080p con micrófono', price: 89.99, stock: 25, category: 'Accesorios' },
  { id: 6, name: 'Audífonos Sony', description: 'Audífonos con cancelación de ruido', price: 199.99, stock: 40, category: 'Audio' },
  { id: 7, name: 'Tablet Samsung', description: 'Tablet 10.5" 128GB', price: 449.99, stock: 12, category: 'Electrónica' },
  { id: 8, name: 'Disco SSD 1TB', description: 'Disco de estado sólido NVMe', price: 119.99, stock: 35, category: 'Almacenamiento' },
];

// Obtener todos los productos
export const listProducts = async () => {
  try {
    const { data } = await api.get('/products');
    return data;
  } catch (error) {
    console.error('[Products] Error al obtener productos:', error);
    throw error;
  }
};

// Alias para compatibilidad
export const getAllProducts = async () => {
  try {
    const data = await listProducts();
    return { success: true, data };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message, data: [] };
  }
};

// Obtener producto por ID
export const getProduct = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

// Alias para compatibilidad
export const getProductById = async (id) => {
  try {
    const data = await getProduct(id);
    return { success: true, data };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message, data: null };
  }
};

// Crear nuevo producto (solo ADMIN)
export const createProduct = async (p) => {
  const { data } = await api.post('/products', p);
  return data;
};

// Actualizar producto existente (solo ADMIN)
export const updateProduct = async (id, p) => {
  const { data } = await api.put(`/products/${id}`, p);
  return data;
};

// Eliminar producto (solo ADMIN)
export const deleteProduct = async (id) => api.delete(`/products/${id}`);

// Buscar productos por nombre
export const searchProducts = async (query) => {
  try {
    const response = await api.get('/products/search', {
      params: { q: query },
    });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('[Products] Error al buscar productos:', error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
      data: [],
    };
  }
};

// Obtener productos por categoría
export const getProductsByCategory = async (category) => {
  try {
    const response = await api.get(`/products/category/${category}`);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`[Products] Error al obtener productos de categoría ${category}:`, error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
      data: [],
    };
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
};
