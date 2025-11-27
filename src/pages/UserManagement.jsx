import { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser, changeUserRole } from '../services/userService';
import { ROLES } from '../utils/constants';

/**
 * UserManagement - Gestión de usuarios (solo ADMIN)
 */
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: ROLES.CLIENTE,
  });
  
  // Cargar usuarios al montar
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = async () => {
    setIsLoading(true);
    setError('');
    
    const result = await getAllUsers();
    
    if (result.success) {
      setUsers(result.data);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };
  
  // Abrir modal para crear/editar
  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username || '',
        password: '', // No mostrar password
        name: user.name || '',
        email: user.email || '',
        role: user.role || ROLES.CLIENTE,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        password: '',
        name: '',
        email: '',
        role: ROLES.CLIENTE,
      });
    }
    setShowModal(true);
  };
  
  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      role: ROLES.CLIENTE,
    });
  };
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Guardar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = editingUser
      ? await updateUser(editingUser.id, formData)
      : await createUser(formData);
    
    if (result.success) {
      alert(result.message);
      closeModal();
      loadUsers();
    } else {
      alert(result.message);
    }
  };
  
  // Eliminar usuario
  const handleDelete = async (id, username) => {
    const confirmed = window.confirm(`¿Estás seguro de eliminar el usuario "${username}"?`);
    
    if (confirmed) {
      const result = await deleteUser(id);
      
      if (result.success) {
        alert(result.message);
        loadUsers();
      } else {
        alert(result.message);
      }
    }
  };
  
  // Cambiar rol
  const handleRoleChange = async (userId, currentRole) => {
    const newRole = prompt(
      `Cambiar rol del usuario.\nRol actual: ${currentRole}\n\nIngresa el nuevo rol (ADMIN, VENDEDOR, CLIENTE):`,
      currentRole
    );
    
    if (newRole && newRole.toUpperCase() !== currentRole.toUpperCase()) {
      const result = await changeUserRole(userId, newRole.toUpperCase());
      
      if (result.success) {
        alert(result.message);
        loadUsers();
      } else {
        alert(result.message);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👥 Gestión de Usuarios</h1>
        <button onClick={() => openModal()} className="btn-primary">
          + Nuevo Usuario
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => openModal(user)}
                      className="btn-edit"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleRoleChange(user.id, user.role)}
                      className="btn-role"
                      title="Cambiar rol"
                    >
                      🔄
                    </button>
                    <button
                      onClick={() => handleDelete(user.id, user.username)}
                      className="btn-delete"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal para crear/editar usuario */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Usuario *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={!!editingUser}
                />
              </div>
              
              {!editingUser && (
                <div className="form-group">
                  <label>Contraseña *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editingUser}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Rol *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value={ROLES.ADMIN}>Administrador</option>
                  <option value={ROLES.VENDEDOR}>Vendedor</option>
                  <option value={ROLES.CLIENTE}>Cliente</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
