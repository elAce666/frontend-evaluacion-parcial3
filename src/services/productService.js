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
  stock: p.stock,
  description: p.descripcion,
});

const mapToBackend = (p) => ({
  nombre: p.name,
  precio: p.price,
  stock: p.stock,
  descripcion: p.description,
  marca: typeof p.brand === 'string' ? { nombre: p.brand } : p.brand,
  categoria: typeof p.category === 'string' ? { nombre: p.category } : p.category,
});

// Obtener todos los productos
export const listProducts = async () => {
  try {
    const { data } = await api.get('/products');
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
  const payload = mapToBackend(p);
  const { data } = await api.post('/products', payload);
  return mapFromBackend(data);
};

// Actualizar producto existente (solo ADMIN)
export const updateProduct = async (id, p) => {
  const payload = mapToBackend(p);
  const { data } = await api.put(`/products/${id}`, payload);
  return mapFromBackend(data);
};

// Eliminar producto (solo ADMIN)
export const deleteProduct = async (id) => api.delete(`/products/${id}`);

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
