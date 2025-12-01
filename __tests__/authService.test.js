import '../__tests__/api.mock';
import { login, logout, getCurrentUser, isAuthenticated, getToken, getUserRole, validateToken, register } from '../src/services/authService';
import api from '../src/services/api';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    api.defaults = { headers: { common: {} } };
    api.post = jest.fn();
    api.get = jest.fn();
  });

  test('login guarda token, rol y usuario', async () => {
    api.post.mockResolvedValue({ data: { token: 'jwt-123', id: 1, usuario: 'admin', rol: 'ADMIN' } });
    const result = await login({ username: 'admin', password: 'admin123' });
    expect(api.post).toHaveBeenCalledWith('/auth/login', { username: 'admin', password: 'admin123' }, { noAuth: true });
    expect(result.success).toBe(true);
    expect(localStorage.getItem('token')).toBe('jwt-123');
    expect(localStorage.getItem('rol')).toBe('ADMIN');
    expect(localStorage.getItem('usuario')).toBe('admin');
  });

  test('logout elimina credenciales', () => {
    api.defaults = { headers: { common: {} } };
    localStorage.setItem('token', 't');
    localStorage.setItem('userData', JSON.stringify({ username: 'admin', role: 'ADMIN' }));
    logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userData')).toBeNull();
  });

  test('getCurrentUser retorna usuario y rol', () => {
    localStorage.setItem('userData', JSON.stringify({ username: 'cliente', role: 'CLIENTE' }));
    const u = getCurrentUser();
    expect(u).not.toBeNull();
    expect(u.username).toBe('cliente');
    expect(u.role).toBe('CLIENTE');
  });

  test('isAuthenticated depende de token', () => {
    expect(isAuthenticated()).toBe(false);
    localStorage.setItem('token', 'x');
    expect(isAuthenticated()).toBe(true);
  });

  test('getToken y getUserRole', () => {
    localStorage.setItem('token', 'abc');
    localStorage.setItem('userData', JSON.stringify({ username: 'vendedor', role: 'VENDEDOR' }));
    expect(getToken()).toBe('abc');
    const role = getUserRole();
    expect(role).toBe('VENDEDOR');
  });

  test('validateToken true cuando status 200', async () => {
    api.post.mockResolvedValue({ data: { valid: true, usuario: 'admin', rol: 'ADMIN' } });
    const result = await validateToken('test-token');
    expect(api.post).toHaveBeenCalledWith('/auth/validate-token', { token: 'test-token' });
    expect(result.valid).toBe(true);
  });

  test('register retorna datos', async () => {
    api.post.mockResolvedValue({ data: { id: 10, username: 'nuevo' } });
    const result = await register({ username: 'nuevo', password: '123' });
    expect(api.post).toHaveBeenCalledWith('/auth/register', { username: 'nuevo', password: '123' });
    expect(result.success).toBe(true);
    expect(result.data.id).toBe(10);
  });
});