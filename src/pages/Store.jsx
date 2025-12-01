import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import { createOrder } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

/**
 * Store - Tienda para clientes
 * Solo accesible por rol CLIENTE
 */
const Store = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [medioPago, setMedioPago] = useState('efectivo');
  const [cuotas, setCuotas] = useState(1);
  
  // Cargar productos al montar
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await getAllProducts();
      if (result.success) {
        const list = Array.isArray(result.data) ? result.data : [];
        setProducts(list.filter(p => (p.stock ?? 0) > 0));
      } else {
        setError(result.message || 'No se pudieron cargar los productos');
        setProducts([]);
      }
    } catch (e) {
      setError('Error de conexión al cargar productos');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Agregar al carrito
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Si ya está, aumentar cantidad
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        alert('No hay más stock disponible');
      }
    } else {
      // Si no está, agregarlo
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  
  // Remover del carrito
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };
  
  // Actualizar cantidad
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (newQuantity > product.stock) {
      alert('Cantidad mayor al stock disponible');
      return;
    }
    
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };
  
  // Calcular subtotal, IVA (19%) y total
  const getSubtotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const IVA_PORCENTAJE = 0.19;
  const getIva = () => getSubtotal() * IVA_PORCENTAJE;
  const getTotal = () => getSubtotal() + getIva();

  // Formatear precio en CLP
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  // Procesar compra
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    const confirmed = window.confirm(
      `¿Confirmar compra por ${formatPrice(getTotal())} (${medioPago}${medioPago === 'credito' && cuotas > 1 ? `, ${cuotas} cuotas` : ''})?`
    );
    
    if (confirmed) {
      const orderData = {
        customerId: user.id,
        customerName: user.name || user.username,
        cliente: { id: user.id },
        medioPago,
        cuotas: medioPago === 'credito' ? cuotas : 1,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: getSubtotal(),
        iva: getIva(),
        total: getTotal(),
      };
      
      const result = await createOrder(orderData);
      
      if (result.success) {
        alert('¡Compra realizada exitosamente! 🎉');
        setCart([]);
        setShowCart(false);
        loadProducts(); // Recargar para actualizar stock
        navigate('/orders'); // Ver órdenes recientes
      } else {
        alert(`Error: ${result.message}`);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando tienda...</p>
      </div>
    );
  }
  
  return (
    <div className="store-container">
      <div className="store-header">
        <h1>🛒 Tienda</h1>
        <button 
          onClick={() => setShowCart(!showCart)}
          className="btn-cart"
        >
          🛒 Carrito ({cart.length})
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 8 }}>{error}</div>
          <div>
            <button className="btn-secondary" onClick={loadProducts}>Reintentar</button>
          </div>
        </div>
      )}
      
      <div className="products-grid">
        {products.length === 0 ? (
          <p>No hay productos disponibles</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="image-placeholder">📦</div>
                )}
              </div>
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-info">
                <div className="product-price-section">
                  <span className="product-price">{product.priceFormatted || `$${product.price}`}</span>
                </div>
                <div className="product-stock-section">
                  <span className="product-stock">Stock: {product.stock}</span>
                </div>
              </div>
              <button 
                onClick={() => addToCart(product)}
                className="btn-add-cart"
              >
                Agregar al Carrito
              </button>
            </div>
          ))
        )}
      </div>
      
      {/* Panel del carrito */}
      {showCart && (
        <div className="cart-panel">
          <div className="cart-header">
            <h2>Carrito de Compras</h2>
            <button onClick={() => setShowCart(false)} className="btn-close">
              ✕
            </button>
          </div>
          
          {cart.length === 0 ? (
            <p className="cart-empty">El carrito está vacío</p>
          ) : (
            <>
              {/* Selección de medio de pago */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ marginRight: 8 }}>Medio de pago:</label>
                <select value={medioPago} onChange={(e) => setMedioPago(e.target.value)}>
                  <option value="efectivo">Efectivo</option>
                  <option value="debito">Débito</option>
                  <option value="credito">Crédito</option>
                </select>
              </div>

              {/* Selección de cuotas si es crédito */}
              {medioPago === 'credito' && (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ marginRight: 8 }}>Cuotas:</label>
                  <select value={cuotas} onChange={(e) => setCuotas(Number(e.target.value))}>
                    {[1,3,6,12,24].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>{item.priceFormatted || `$${item.price}`} c/u</p>
                    </div>
                    <div className="item-quantity">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="btn-qty"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="btn-qty"
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="btn-remove"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-total" style={{ display: 'grid', gap: 4 }}>
                  <div>
                    <strong>Subtotal:</strong> <strong>{formatPrice(getSubtotal())}</strong>
                  </div>
                  <div>
                    <strong>IVA (19%):</strong> <strong>{formatPrice(getIva())}</strong>
                  </div>
                  <div>
                    <strong>Total:</strong> <strong>{formatPrice(getTotal())}</strong>
                  </div>
                  {medioPago === 'credito' && cuotas > 1 && (
                    <div>
                      <strong>Cuota aprox ({cuotas}):</strong> <strong>{formatPrice(getTotal() / cuotas)}</strong>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleCheckout}
                  className="btn-checkout"
                >
                  Finalizar Compra
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Store;
