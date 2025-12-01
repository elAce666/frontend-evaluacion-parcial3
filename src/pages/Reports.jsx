import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import orderService from '../services/orderService';
import userService from '../services/userService';

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    totals: {
      subtotal: 0,
      iva: 0,
      totalConIva: 0,
    },
    porMedioPago: {
      efectivo: { subtotal: 0, iva: 0, total: 0 },
      debito: { subtotal: 0, iva: 0, total: 0 },
      credito: { subtotal: 0, iva: 0, total: 0 },
    }
  });

  useEffect(() => {
    let isMounted = true;
    let timerId;

    const normalizeLength = (res) => Array.isArray(res) ? res.length : (res?.data?.length || 0);

    const calcFromOrders = (orders) => {
      const IVA_PORCENTAJE = 0.19; // IVA 19%

      const safeOrders = Array.isArray(orders) ? orders : (orders?.data || []);

      const sumMonetary = (acc, amount) => acc + (Number(amount) || 0);

      // Calcular totales desde montoTotal de cada orden
      let totalVentas = 0;
      
      safeOrders.forEach(o => {
        const montoTotal = Number(o?.total || o?.montoTotal || 0);
        totalVentas += montoTotal;
      });

      // Calcular subtotal e IVA desde el total
      // total = subtotal + iva, donde iva = subtotal * 0.19
      // total = subtotal * 1.19
      // subtotal = total / 1.19
      const subtotal = totalVentas / 1.19;
      const iva = subtotal * IVA_PORCENTAJE;
      const totalConIva = totalVentas;

      // Distribuir por método de pago (por ahora todo a efectivo ya que no se guarda)
      // En el futuro, cuando se agregue medioPago a la entidad Venta, se puede categorizar
      const efectivo = { 
        subtotal: subtotal, 
        iva: iva, 
        total: totalConIva 
      };
      const debito = { subtotal: 0, iva: 0, total: 0 };
      const credito = { subtotal: 0, iva: 0, total: 0 };

      return {
        totals: { subtotal, iva, totalConIva },
        porMedioPago: { efectivo, debito, credito }
      };
    };

    const load = async () => {
      try {
        setError(null);
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          productService.getAll(),
          orderService.getAll(),
          userService.getAll(),
        ]);
        if (!isMounted) return;
        const totalsCalc = calcFromOrders(ordersRes);
        setStats(prev => ({
          ...prev,
          products: normalizeLength(productsRes),
          orders: normalizeLength(ordersRes),
          users: normalizeLength(usersRes),
          totals: totalsCalc.totals,
          porMedioPago: totalsCalc.porMedioPago,
        }));
      } catch (e) {
        if (!isMounted) return;
        setError('No se pudieron cargar los datos de reportes.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    // carga inicial
    load();
    // polling cada 5 segundos para reflejar ventas en tiempo (casi) real
    timerId = setInterval(load, 5000);

    return () => {
      isMounted = false;
      if (timerId) clearInterval(timerId);
    };
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Reportes</h1>
      </div>
      <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
        Resumen general del sistema para el administrador. Se actualiza cada 5 segundos.
      </p>
      {loading && <div className="loading-container"><div className="spinner"></div><p>Cargando...</p></div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && (
        <>
          <div className="reports-grid">
            <div className="report-card">
              <h3>Productos</h3>
              <p className="report-value">{stats.products}</p>
            </div>
            <div className="report-card">
              <h3>Órdenes</h3>
              <p className="report-value">{stats.orders}</p>
            </div>
            <div className="report-card">
              <h3>Usuarios</h3>
              <p className="report-value">{stats.users}</p>
            </div>
          </div>

          <div className="report-card report-highlight">
            <h3>💰 Ventas Totales</h3>
            <div className="report-details">
              <p>Subtotal: <strong>${stats.totals.subtotal.toFixed(2)}</strong></p>
              <p>IVA (19%): <strong>${stats.totals.iva.toFixed(2)}</strong></p>
              <p className="report-total">Total con IVA: <strong>${stats.totals.totalConIva.toFixed(2)}</strong></p>
            </div>
          </div>

          <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>Ventas por Medio de Pago</h3>
          <div className="reports-grid">
            <div className="report-card">
              <h3>💵 Efectivo</h3>
              <div className="report-details">
                <p>Subtotal: <strong>${stats.porMedioPago.efectivo.subtotal.toFixed(2)}</strong></p>
                <p>IVA: <strong>${stats.porMedioPago.efectivo.iva.toFixed(2)}</strong></p>
                <p className="report-total">Total: <strong>${stats.porMedioPago.efectivo.total.toFixed(2)}</strong></p>
              </div>
            </div>
            <div className="report-card">
              <h3>💳 Débito</h3>
              <div className="report-details">
                <p>Subtotal: <strong>${stats.porMedioPago.debito.subtotal.toFixed(2)}</strong></p>
                <p>IVA: <strong>${stats.porMedioPago.debito.iva.toFixed(2)}</strong></p>
                <p className="report-total">Total: <strong>${stats.porMedioPago.debito.total.toFixed(2)}</strong></p>
              </div>
            </div>
            <div className="report-card">
              <h3>💎 Crédito</h3>
              <div className="report-details">
                <p>Subtotal: <strong>${stats.porMedioPago.credito.subtotal.toFixed(2)}</strong></p>
                <p>IVA: <strong>${stats.porMedioPago.credito.iva.toFixed(2)}</strong></p>
                <p className="report-total">Total: <strong>${stats.porMedioPago.credito.total.toFixed(2)}</strong></p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
