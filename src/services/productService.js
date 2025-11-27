import api, { handleApiError } from './api';

/**
 * Servicio de Productos
 * Gestiona todas las operaciones CRUD de productos
 */

// DATOS MOCK PARA DESARROLLO
const USE_MOCK_DATA = true;

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
export const getAllProducts = async () => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[Products] Obteniendo productos (MOCK)');
        resolve({
          success: true,
          data: MOCK_PRODUCTS,
        });
      }, 300);
    });
  }
  
  try {
    const response = await api.get('/products');
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('[Products] Error al obtener productos:', error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
      data: [],
    };
  }
};

// Obtener producto por ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error(`[Products] Error al obtener producto ${id}:`, error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
      data: null,
    };
  }
};

// Crear nuevo producto (solo ADMIN)
export const createProduct = async (productData) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct = {
          id: MOCK_PRODUCTS.length + 1,
          ...productData,
          price: parseFloat(productData.price),
          stock: parseInt(productData.stock),
        };
        MOCK_PRODUCTS.push(newProduct);
        console.log('[Products] Producto creado (MOCK):', newProduct);
        resolve({
          success: true,
          data: newProduct,
          message: 'Producto creado exitosamente',
        });
      }, 300);
    });
  }
  
  try {
    const response = await api.post('/products', productData);
    
    console.log('[Products] Producto creado exitosamente');
    
    return {
      success: true,
      data: response.data,
      message: 'Producto creado exitosamente',
    };
  } catch (error) {
    console.error('[Products] Error al crear producto:', error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
    };
  }
};

// Actualizar producto existente (solo ADMIN)
export const updateProduct = async (id, productData) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
        if (index !== -1) {
          MOCK_PRODUCTS[index] = {
            ...MOCK_PRODUCTS[index],
            ...productData,
            price: parseFloat(productData.price),
            stock: parseInt(productData.stock),
          };
          console.log('[Products] Producto actualizado (MOCK):', MOCK_PRODUCTS[index]);
          resolve({
            success: true,
            data: MOCK_PRODUCTS[index],
            message: 'Producto actualizado exitosamente',
          });
        } else {
          resolve({
            success: false,
            message: 'Producto no encontrado',
          });
        }
      }, 300);
    });
  }
  
  try {
    const response = await api.put(`/products/${id}`, productData);
    
    console.log(`[Products] Producto ${id} actualizado exitosamente`);
    
    return {
      success: true,
      data: response.data,
      message: 'Producto actualizado exitosamente',
    };
  } catch (error) {
    console.error(`[Products] Error al actualizar producto ${id}:`, error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
    };
  }
};

// Eliminar producto (solo ADMIN)
export const deleteProduct = async (id) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
        if (index !== -1) {
          MOCK_PRODUCTS.splice(index, 1);
          console.log('[Products] Producto eliminado (MOCK)');
          resolve({
            success: true,
            message: 'Producto eliminado exitosamente',
          });
        } else {
          resolve({
            success: false,
            message: 'Producto no encontrado',
          });
        }
      }, 300);
    });
  }
  
  try {
    await api.delete(`/products/${id}`);
    
    console.log(`[Products] Producto ${id} eliminado exitosamente`);
    
    return {
      success: true,
      message: 'Producto eliminado exitosamente',
    };
  } catch (error) {
    console.error(`[Products] Error al eliminar producto ${id}:`, error);
    const errorInfo = handleApiError(error);
    
    return {
      success: false,
      message: errorInfo.message,
    };
  }
};

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
