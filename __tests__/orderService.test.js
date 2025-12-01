import '../__tests__/api.mock';
import { listOrders, getOrder, createOrder, updateOrderStatus, cancelOrder, getMyOrders, getOrderDetails, getOrderStatistics } from '../src/services/orderService';
import api from '../src/services/api';

describe('OrderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listOrders', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1, total: 100 }] });
    const result = await listOrders();
    expect(api.get).toHaveBeenCalledWith('/orders');
    expect(result[0].id).toBe(1);
  });

  test('getOrder', async () => {
    api.get.mockResolvedValue({ data: { id: 2 } });
    const result = await getOrder(2);
    expect(api.get).toHaveBeenCalledWith('/orders/2');
    expect(result.id).toBe(2);
  });

  test('createOrder', async () => {
    api.post.mockResolvedValue({ data: { id: 3 } });
    const result = await createOrder({ items: [], total: 100 });
    expect(api.post).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.data.id).toBe(3);
  });

  test('updateOrderStatus', async () => {
    api.put.mockResolvedValue({ data: { id: 4, status: 'CONFIRMED' } });
    const result = await updateOrderStatus(4, 'CONFIRMED');
    expect(api.put).toHaveBeenCalledWith('/orders/4', { status: 'CONFIRMED' });
    expect(result.success).toBe(true);
  });

  test('cancelOrder elimina', async () => {
    api.delete.mockResolvedValue({});
    const result = await cancelOrder(5);
    expect(api.delete).toHaveBeenCalledWith('/orders/5');
    expect(result.success).toBe(true);
  });

  test('getMyOrders', async () => {
    api.get.mockResolvedValue({ data: [{ id: 6 }] });
    const result = await getMyOrders();
    expect(api.get).toHaveBeenCalledWith('/orders/my-orders');
    expect(result.success).toBe(true);
  });

  test('getOrderDetails', async () => {
    api.get.mockResolvedValue({ data: [{ perfumeId: 1, perfumeNombre: 'Test', cantidad: 2, precioUnitario: 50, subtotal: 100 }] });
    const result = await getOrderDetails(7);
    expect(api.get).toHaveBeenCalledWith('/orders/7/details');
    expect(result.data[0].productId).toBe(1);
    expect(result.data[0].productName).toBe('Test');
  });

  test('getOrderStatistics', async () => {
    api.get.mockResolvedValue({ data: { total: 10 } });
    const result = await getOrderStatistics();
    expect(api.get).toHaveBeenCalledWith('/orders/statistics');
    expect(result.data.total).toBe(10);
  });
});