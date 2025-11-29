// Mock de la instancia Axios usada por los servicios
import api from '../src/services/api';

jest.mock('../src/services/api', () => {
  const handlers = { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn(), patch: jest.fn() };
  return {
    __esModule: true,
    default: handlers,
    handleApiError: (error) => ({ message: error?.message || 'Error' }),
    get: handlers.get,
    post: handlers.post,
    put: handlers.put,
    delete: handlers.delete,
    patch: handlers.patch,
  };
});

export default api;

// Test mínimo para evitar fallo de suite vacía
describe('api mock helper', () => {
  test('carga correctamente', () => {
    expect(typeof api.get).toBe('function');
  });
});