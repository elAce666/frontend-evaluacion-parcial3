import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import { createOrder } from '../services/orderService';

const CreateOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [medioPago, setMedioPago] = useState('efectivo');
  const [cuotas, setCuotas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await productService.getAll();
        console.log('CreateOrder - Respuesta de productos:', res);
        if (res.success && res.data) {
          setProducts(res.data);
        } else {
          console.error('No se obtuvieron productos:', res);
          setError(res.message || 'No se pudieron cargar productos');
          setProducts([]);
        }
      } catch (e) {
        console.error('Error al cargar productos:', e);
        setError('No se pudieron cargar productos');
        setProducts([]);
      }
    };
    loadProducts();
  }, []);

  const addItem = (productId) => {
    const p = products.find(pr => pr.id === productId);
    if (!p) return;
    setItems(prev => [...prev, { productId: p.id, productName: p.name, precio_unitario: Number(p.price || 0), cantidad: 1 }]);
  };

  const updateItem = (index, field, value) => {
    setItems(prev => prev.map((it, i) => i === index ? { ...it, [field]: value } : it));
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, it) => acc + (Number(it.precio_unitario) * Number(it.cantidad)), 0);
  const IVA_PORCENTAJE = 0.19;
  const iva = subtotal * IVA_PORCENTAJE;
  const total = subtotal + iva;

  const handleSubmit = async () => {
    if (items.length === 0) {
      setError('Agrega al menos un producto');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        vendedor: user?.id ? { id: user.id } : undefined,
        medioPago,
        cuotas: medioPago === 'credito' ? cuotas : 1,
        detalle: items.map(it => ({ productId: it.productId, cantidad: Number(it.cantidad), precio_unitario: Number(it.precio_unitario) })),
        subtotal,
        iva,
        montoTotal: total,
        estado: 'PENDIENTE',
      };
      await createOrder(payload);
      navigate('/orders');
    } catch (e) {
      setError('No se pudo crear la orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>➕ Nueva Orden</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: 16 }}>
        <label>Medio de pago: </label>
        <select value={medioPago} onChange={(e) => setMedioPago(e.target.value)}>
          <option value="efectivo">Efectivo</option>
          <option value="debito">Débito</option>
          <option value="credito">Crédito</option>
        </select>
      </div>

      {medioPago === 'credito' && (
        <div style={{ marginBottom: 16 }}>
          <label>Cuotas: </label>
          <select value={cuotas} onChange={(e) => setCuotas(Number(e.target.value))}>
            {[1,3,6,12,24].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label>Agregar producto: </label>
        <select onChange={(e) => addItem(Number(e.target.value))} defaultValue="">
          <option value="" disabled>Selecciona...</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name} - ${Number(p.price || 0).toFixed(2)}</option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Sin productos</td></tr>
            ) : items.map((it, i) => (
              <tr key={i}>
                <td>{it.productName}</td>
                <td>
                  <input type="number" min="1" value={it.cantidad} onChange={(e) => updateItem(i, 'cantidad', Number(e.target.value))} />
                </td>
                <td>
                  <input type="number" min="0" step="0.01" value={it.precio_unitario} onChange={(e) => updateItem(i, 'precio_unitario', Number(e.target.value))} />
                </td>
                <td>${(Number(it.cantidad) * Number(it.precio_unitario)).toFixed(2)}</td>
                <td><button className="btn-secondary" onClick={() => removeItem(i)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, background: '#f4f4f8', padding: 12, borderRadius: 8 }}>
        <p>Subtotal: <strong>${subtotal.toFixed(2)}</strong></p>
        <p>IVA (19%): <strong>${iva.toFixed(2)}</strong></p>
        <p>Total: <strong>${total.toFixed(2)}</strong></p>
        {medioPago === 'credito' && cuotas > 1 && (
          <p>Cuota aprox ({cuotas}): <strong>${(total / cuotas).toFixed(2)}</strong></p>
        )}
      </div>

      <div className="page-actions">
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>Guardar Orden</button>
        <button className="btn-secondary" onClick={() => navigate('/orders')}>Cancelar</button>
      </div>
    </div>
  );
};

export default CreateOrder;
