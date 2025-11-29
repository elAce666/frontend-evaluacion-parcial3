import '../__tests__/api.mock';
import { login, logout, getCurrentUser, isAuthenticated, getToken, getUserRole, validateToken, register } from '../src/services/authService';
import api from '../src/services/api';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('login guarda token, rol y usuario', async () => {
    api.post.mockResolvedValue({ data: { token: 'jwt-123', usuario: 'admin', rol: 'ADMIN' } });
    const result = await login({ username: 'admin', password: 'admin123' });
    expect(api.post).toHaveBeenCalledWith('/auth/login', { username: 'admin', password: 'admin123' });
    expect(result.success).toBe(true);
    expect(localStorage.getItem('token')).toBe('jwt-123');
    expect(localStorage.getItem('rol')).toBe('ADMIN');
    expect(localStorage.getItem('usuario')).toBe('admin');
  });

  test('logout elimina credenciales', () => {
    localStorage.setItem('token', 't');
    localStorage.setItem('rol', 'ADMIN');
    localStorage.setItem('usuario', 'admin');
    logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('rol')).toBeNull();
    expect(localStorage.getItem('usuario')).toBeNull();
  });

  test('getCurrentUser retorna usuario y rol', () => {
    localStorage.setItem('usuario', 'cliente');
    localStorage.setItem('rol', 'CLIENTE');
    const u = getCurrentUser();
    expect(u.usuario).toBe('cliente');
    expect(u.rol).toBe('CLIENTE');
  });

  test('isAuthenticated depende de token', () => {
    expect(isAuthenticated()).toBe(false);
    localStorage.setItem('token', 'x');
    expect(isAuthenticated()).toBe(true);
  });

  test('getToken y getUserRole', () => {
    localStorage.setItem('token', 'abc');
    localStorage.setItem('rol', 'VENDEDOR');
    expect(getToken()).toBe('abc');
    expect(getUserRole()).toBe('VENDEDOR');
  });

  test('validateToken true cuando status 200', async () => {
    api.get.mockResolvedValue({ status: 200 });
    const valid = await validateToken();
    expect(api.get).toHaveBeenCalledWith('/auth/validate');
    expect(valid).toBe(true);
  });

  test('register retorna datos', async () => {
    api.post.mockResolvedValue({ data: { id: 10, username: 'nuevo' } });
    const result = await register({ username: 'nuevo', password: '123' });
    expect(api.post).toHaveBeenCalledWith('/auth/register', { username: 'nuevo', password: '123' });
    expect(result.success).toBe(true);
    expect(result.data.id).toBe(10);
  });
});