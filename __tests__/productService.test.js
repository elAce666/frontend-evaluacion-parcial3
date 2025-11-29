import '../__tests__/api.mock';
import { listProducts, getProduct, createProduct, updateProduct, searchProducts, listCategories, listBrands, getProductsByFilters } from '../src/services/productService';
import api from '../src/services/api';

describe('ProductService (perfumes)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listProducts mapea campos desde backend', async () => {
    const backend = [{ id: 1, nombre: 'Eau', marca: 'Chanel', categoria: 'Mujer', precio: 100, stock: 5, descripcion: 'Notas' }];
    api.get.mockResolvedValue({ data: backend });

    const result = await listProducts();
    expect(api.get).toHaveBeenCalledWith('/products');
    expect(result[0]).toEqual({ id: 1, name: 'Eau', brand: 'Chanel', category: 'Mujer', price: 100, stock: 5, description: 'Notas' });
  });

  test('getProduct retorna mapeado', async () => {
    const backend = { id: 2, nombre: 'Citrus', marca: 'Dior', categoria: 'Hombre', precio: 120, stock: 3, descripcion: 'Fresco' };
    api.get.mockResolvedValue({ data: backend });

    const result = await getProduct(2);
    expect(api.get).toHaveBeenCalledWith('/products/2');
    expect(result.name).toBe('Citrus');
  });

  test('createProduct envía payload mapeado (nested) y retorna mapeado', async () => {
    const ui = { name: 'Floral', brand: 'Armani', category: 'Mujer', price: 150, stock: 10, description: 'Suave' };
    const backendResponse = { id: 3, nombre: 'Floral', marca: { nombre: 'Armani' }, categoria: { nombre: 'Mujer' }, precio: 150, stock: 10, descripcion: 'Suave' };
    api.post.mockResolvedValue({ data: backendResponse });

    const result = await createProduct(ui);
    expect(api.post).toHaveBeenCalledWith('/products', { nombre: 'Floral', marca: { nombre: 'Armani' }, categoria: { nombre: 'Mujer' }, precio: 150, stock: 10, descripcion: 'Suave' });
    expect(result).toEqual({ id: 3, name: 'Floral', brand: 'Armani', category: 'Mujer', price: 150, stock: 10, description: 'Suave' });
  });

  test('updateProduct envía payload mapeado (nested) y retorna mapeado', async () => {
    const ui = { name: 'Woody', brand: 'Tom Ford', category: 'Unisex', price: 200, stock: 4, description: 'Madera' };
    const backendResponse = { id: 5, nombre: 'Woody', marca: { nombre: 'Tom Ford' }, categoria: { nombre: 'Unisex' }, precio: 200, stock: 4, descripcion: 'Madera' };
    api.put.mockResolvedValue({ data: backendResponse });

    const result = await updateProduct(5, ui);
    expect(api.put).toHaveBeenCalledWith('/products/5', { nombre: 'Woody', marca: { nombre: 'Tom Ford' }, categoria: { nombre: 'Unisex' }, precio: 200, stock: 4, descripcion: 'Madera' });
    expect(result).toEqual({ id: 5, name: 'Woody', brand: 'Tom Ford', category: 'Unisex', price: 200, stock: 4, description: 'Madera' });
  });

  test('searchProducts usa q y mapea', async () => {
    const backend = [{ id: 6, nombre: 'Ocean', marca: 'BVLGARI', categoria: 'Hombre', precio: 110, stock: 8, descripcion: 'Mar' }];
    api.get.mockResolvedValue({ data: backend });

    const result = await searchProducts('Ocean');
    expect(api.get).toHaveBeenCalledWith('/products', { params: { q: 'Ocean' } });
    expect(result[0].name).toBe('Ocean');
  });

  test('listCategories y listBrands', async () => {
    api.get.mockResolvedValueOnce({ data: ['Mujer', 'Hombre'] });
    const cats = await listCategories();
    expect(api.get).toHaveBeenCalledWith('/categorias');
    expect(cats).toEqual(['Mujer', 'Hombre']);

    api.get.mockResolvedValueOnce({ data: ['Chanel', 'Dior'] });
    const brands = await listBrands();
    expect(api.get).toHaveBeenCalledWith('/marcas');
    expect(brands).toEqual(['Chanel', 'Dior']);
  });

  test('getProductsByFilters usa query params', async () => {
    const backend = [{ id: 7, nombre: 'Amber', marca: 'YSL', categoria: 'Unisex', precio: 130, stock: 6, descripcion: 'Ámbar' }];
    api.get.mockResolvedValue({ data: backend });

    const result = await getProductsByFilters({ categoriaId: 1, marcaId: 2 });
    expect(api.get).toHaveBeenCalledWith('/products', { params: { categoriaId: 1, marcaId: 2 } });
    expect(result[0].category).toBe('Unisex');
  });
});