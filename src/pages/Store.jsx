import { useState, useEffect } from 'react';
import { getAllProducts } from '../services/productService';
import { createOrder } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

/**
 * Store - Tienda para clientes
 * Solo accesible por rol CLIENTE
 */
const Store = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  
  // Cargar productos al montar
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    setIsLoading(true);
    
    const result = await getAllProducts();
    
    if (result.success) {
      // Solo mostrar productos con stock disponible
      setProducts(result.data.filter(p => p.stock > 0));
    }
    
    setIsLoading(false);
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
  
  // Calcular total
  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Procesar compra
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    const confirmed = window.confirm(
      `¿Confirmar compra por $${getTotal().toFixed(2)}?`
    );
    
    if (confirmed) {
      const orderData = {
        customerId: user.id,
        customerName: user.name || user.username,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: getTotal(),
      };
      
      const result = await createOrder(orderData);
      
      if (result.success) {
        alert('¡Compra realizada exitosamente! 🎉');
        setCart([]);
        setShowCart(false);
        loadProducts(); // Recargar para actualizar stock
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
      
      <div className="products-grid">
        {products.length === 0 ? (
          <p>No hay productos disponibles</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">📦</div>
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-info">
                <span className="product-price">${product.price}</span>
                <span className="product-stock">Stock: {product.stock}</span>
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
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>${item.price} c/u</p>
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
                      ${(item.price * item.quantity).toFixed(2)}
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
                <div className="cart-total">
                  <strong>Total:</strong>
                  <strong>${getTotal().toFixed(2)}</strong>
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
