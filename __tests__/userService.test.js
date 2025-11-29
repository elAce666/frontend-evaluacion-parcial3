import '../__tests__/api.mock';
import { listUsers, getUser, createUser, updateUser, deleteUser, changeUserRole, getMyProfile, updateMyProfile } from '../src/services/userService';
import api from '../src/services/api';

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('listUsers', async () => {
    api.get.mockResolvedValue({ data: [{ username: 'admin' }] });
    const result = await listUsers();
    expect(api.get).toHaveBeenCalledWith('/users');
    expect(result[0].username).toBe('admin');
  });

  test('getUser by username', async () => {
    api.get.mockResolvedValue({ data: { username: 'cliente' } });
    const result = await getUser('cliente');
    expect(api.get).toHaveBeenCalledWith('/users/cliente');
    expect(result.username).toBe('cliente');
  });

  test('createUser', async () => {
    api.post.mockResolvedValue({ data: { id: 1 } });
    const result = await createUser({ username: 'new' });
    expect(api.post).toHaveBeenCalledWith('/users', { username: 'new' });
    expect(result.id).toBe(1);
  });

  test('updateUser', async () => {
    api.put.mockResolvedValue({ data: { id: 2, email: 'a@b.com' } });
    const result = await updateUser(2, { email: 'a@b.com' });
    expect(api.put).toHaveBeenCalledWith('/users/2', { email: 'a@b.com' });
    expect(result.success).toBe(true);
  });

  test('deleteUser', async () => {
    api.delete.mockResolvedValue({});
    const result = await deleteUser(3);
    expect(api.delete).toHaveBeenCalledWith('/users/3');
    expect(result.success).toBe(true);
  });

  test('changeUserRole', async () => {
    api.patch.mockResolvedValue({ data: { id: 4, role: 'VENDEDOR' } });
    const result = await changeUserRole(4, 'VENDEDOR');
    expect(api.patch).toHaveBeenCalledWith('/users/4/role', { role: 'VENDEDOR' });
    expect(result.success).toBe(true);
  });

  test('getMyProfile', async () => {
    api.get.mockResolvedValue({ data: { username: 'me' } });
    const result = await getMyProfile();
    expect(api.get).toHaveBeenCalledWith('/users/profile');
    expect(result.data.username).toBe('me');
  });

  test('updateMyProfile updates localStorage', async () => {
    localStorage.setItem('userData', JSON.stringify({ username: 'me', email: 'old@example.com' }));
    api.put.mockResolvedValue({ data: { email: 'new@example.com' } });
    const result = await updateMyProfile({ email: 'new@example.com' });
    expect(api.put).toHaveBeenCalledWith('/users/profile', { email: 'new@example.com' });
    expect(result.success).toBe(true);
    const updated = JSON.parse(localStorage.getItem('userData'));
    expect(updated.email).toBe('new@example.com');
  });
});