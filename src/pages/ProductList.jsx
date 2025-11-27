import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, deleteProduct, createProduct, updateProduct } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { getPermissions } from '../utils/roleValidator';

/**
 * ProductList - Lista de productos
 * ADMIN: Puede ver, crear, editar y eliminar
 * VENDEDOR: Solo puede ver (modo lectura)
 */
const ProductList = () => {
  const { user } = useAuth();
  const permissions = getPermissions(user?.role);
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  
  // Cargar productos al montar
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    setIsLoading(true);
    setError('');
    
    const result = await getAllProducts();
    
    if (result.success) {
      setProducts(result.data);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };
  
  // Abrir modal para crear/editar
  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
      });
    }
    setShowModal(true);
  };
  
  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
    });
  };
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Guardar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = editingProduct
      ? await updateProduct(editingProduct.id, formData)
      : await createProduct(formData);
    
    if (result.success) {
      alert(result.message);
      closeModal();
      loadProducts();
    } else {
      alert(result.message);
    }
  };
  
  // Eliminar producto
  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`¿Estás seguro de eliminar el producto "${name}"?`);
    
    if (confirmed) {
      const result = await deleteProduct(id);
      
      if (result.success) {
        alert(result.message);
        loadProducts();
      } else {
        alert(result.message);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Productos</h1>
        {permissions.createProduct && (
          <button onClick={() => openModal()} className="btn-primary">
            + Nuevo Producto
          </button>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {permissions.viewProducts ? (
        <>
          {!permissions.createProduct && (
            <div className="info-message">
              ℹ️ Estás viendo los productos en modo <strong>solo lectura</strong>
            </div>
          )}
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Categoría</th>
                  {permissions.editProduct && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                      No hay productos registrados
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.category}</td>
                      {permissions.editProduct && (
                        <td>
                          <button
                            onClick={() => openModal(product)}
                            className="btn-edit"
                          >
                            ✏️
                          </button>
                          {permissions.deleteProduct && (
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="btn-delete"
                            >
                              🗑️
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="unauthorized-message">
          No tienes permisos para ver productos
        </div>
      )}
      
      {/* Modal para crear/editar producto */}
      {showModal && permissions.createProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Precio</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Categoría</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Actualizar' : 'Crear'}
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

export default ProductList;
