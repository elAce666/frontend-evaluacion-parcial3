import api, { handleApiError } from './api';

/**
 * Servicio de Productos (Tienda de Perfumes)
 * UI: { name, brand, category, price, stock, description }
 * BE: { nombre, marca:{nombre}, categoria:{nombre}, precio, stock, descripcion }
 */

// Helpers de mapeo UI <-> Backend
const mapFromBackend = (p) => {
  console.log('[mapFromBackend] Producto recibido:', p);
  
  const name = p.nombre ?? p.name ?? '';
  const price = p.precio ?? p.price ?? 0;
  const description = p.descripcion ?? p.description ?? '';
  const image = p.imagen ?? p.image ?? null;
  const brand = p.marca?.nombre ?? p.marca ?? p.brand ?? null;
  const category = p.categoria?.nombre ?? p.categoria ?? p.category ?? null;

  const mapped = {
    id: p.id,
    name,
    brand,
    category,
    price,
    priceFormatted: new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price),
    stock: p.stock ?? 0,
    description,
    image,
  };
  
  console.log('[mapFromBackend] Producto mapeado:', mapped);
  return mapped;
};

const mapToBackend = (p) => ({
  // soporta ambos contratos: español e inglés
  nombre: p.name,
  name: p.name,
  precio: p.price,
  price: p.price,
  stock: p.stock,
  descripcion: p.description,
  description: p.description,
  imagen: p.image,
  image: p.image,
  marca: typeof p.brand === 'object' ? p.brand : (p.brand ? { id: p.brand } : undefined),
  categoria: typeof p.category === 'object' ? p.category : (p.category ? { id: p.category } : undefined),
});

// Obtener todos los productos
export const listProducts = async () => {
  try {
    // Intentar primero con /perfumes que es el endpoint principal del backend
    const { data } = await api.get('/perfumes');
    console.log('[Products] Datos recibidos del backend:', data);
    return Array.isArray(data) ? data.map(mapFromBackend) : [];
  } catch (error) {
    console.error('[Products] Error al obtener productos:', error);
    // Intentar con /products como alternativa
    try {
      const { data } = await api.get('/products');
      console.log('[Products] Datos recibidos del backend (products):', data);
      return Array.isArray(data) ? data.map(mapFromBackend) : [];
    } catch (error2) {
      console.error('[Products] Error al obtener productos (products):', error2);
      console.warn('[Products] No se pudieron obtener productos de ninguna ruta conocida');
      return [];
    }
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

// Alias común usado en páginas (compatibilidad)
export const getAll = async () => {
  return getAllProducts();
};

// Obtener producto por ID
export const getProduct = async (id) => {
  const { data } = await api.get(`/products/${id}`);
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
    const { data } = await api.post('/products', payload);
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
    const { data } = await api.put(`/products/${id}`, payload);
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
    console.log('Eliminando desde URL:', `/products/${id}`);
    
    const response = await api.delete(`/products/${id}`);
    
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
    const { data } = await api.get('/products', { params: { q: query } });
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
  const { data } = await api.get('/products', { params: { categoriaId: category } });
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
  const { data } = await api.get('/products', { params: { categoriaId, marcaId } });
  return Array.isArray(data) ? data.map(mapFromBackend) : [];
};

export default {
  getAll,
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
