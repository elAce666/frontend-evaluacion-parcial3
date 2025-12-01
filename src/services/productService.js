import api, { handleApiError } from './api';

/**
 * Servicio de Productos (Tienda de Perfumes)
 * UI: { name, brand, category, price, stock, description }
 * BE: { nombre, marca:{nombre}, categoria:{nombre}, precio, stock, descripcion }
 */

// Helpers de mapeo UI <-> Backend
const mapFromBackend = (p) => ({
  id: p.id,
  name: p.nombre,
  brand: p.marca?.nombre ?? p.marca ?? null,
  category: p.categoria?.nombre ?? p.categoria ?? null,
  price: p.precio,
  priceFormatted: new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(p.precio),
  stock: p.stock,
  description: p.descripcion,
  image: p.imagen,
});

const mapToBackend = (p) => ({
  nombre: p.name,
  precio: p.price,
  stock: p.stock,
  descripcion: p.description,
  imagen: p.image,
  marca: typeof p.brand === 'object' ? p.brand : { id: p.brand },
  categoria: typeof p.category === 'object' ? p.category : { id: p.category },
});

// Obtener todos los productos
export const listProducts = async () => {
  try {
    const { data } = await api.get('/perfumes');
    return Array.isArray(data) ? data.map(mapFromBackend) : [];
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
  const { data } = await api.get(`/perfumes/${id}`);
  return mapFromBackend(data);
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
  try {
    const payload = mapToBackend(p);
    const { data } = await api.post('/perfumes', payload);
    return { 
      success: true, 
      message: 'Producto creado exitosamente', 
      data: mapFromBackend(data) 
    };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { 
      success: false, 
      message: errorInfo.message, 
      data: null 
    };
  }
};

// Actualizar producto existente (solo ADMIN)
export const updateProduct = async (id, p) => {
  try {
    const payload = mapToBackend(p);
    const { data } = await api.put(`/perfumes/${id}`, payload);
    return { 
      success: true, 
      message: 'Producto actualizado exitosamente', 
      data: mapFromBackend(data) 
    };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { 
      success: false, 
      message: errorInfo.message, 
      data: null 
    };
  }
};

// Eliminar producto (solo ADMIN)
export const deleteProduct = async (id) => {
  try {
    console.log('Token antes de DELETE:', localStorage.getItem('token'));
    console.log('Eliminando desde URL:', `/perfumes/${id}`);
    
    const response = await api.delete(`/perfumes/${id}`);
    
    console.log('Respuesta DELETE:', response);
    
    return { 
      success: true, 
      message: 'Producto eliminado exitosamente'
    };
  } catch (error) {
    console.error('Error en DELETE:', error);
    console.error('Status:', error.response?.status);
    console.error('Headers enviados:', error.config?.headers);
    
    const errorInfo = handleApiError(error);
    return { 
      success: false, 
      message: errorInfo.message || `Error ${error.response?.status}: ${error.response?.statusText}`
    };
  }
};

// Buscar productos por nombre
export const searchProducts = async (query) => {
  try {
    const { data } = await api.get('/perfumes', { params: { q: query } });
    return Array.isArray(data) ? data.map(mapFromBackend) : [];
  } catch (error) {
    console.error('[Products] Error al buscar productos:', error);
    const errorInfo = handleApiError(error);
    return { success: false, message: errorInfo.message, data: [] };
  }
};

// Obtener productos por categoría
export const getProductsByCategory = async (category) => {
  // Reemplazado por filtros generales
  const { data } = await api.get('/perfumes', { params: { categoriaId: category } });
  return Array.isArray(data) ? data.map(mapFromBackend) : [];
};

// Listar categorías (catálogo)
export const listCategories = async () => {
  const { data } = await api.get('/categorias');
  return data;
};

// Listar marcas (catálogo)
export const listBrands = async () => {
  const { data } = await api.get('/marcas');
  return data;
};

// Obtener productos por filtros opcionales
export const getProductsByFilters = async ({ categoriaId, marcaId }) => {
  const { data } = await api.get('/perfumes', { params: { categoriaId, marcaId } });
  return Array.isArray(data) ? data.map(mapFromBackend) : [];
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  listCategories,
  listBrands,
  getProductsByFilters,
};
