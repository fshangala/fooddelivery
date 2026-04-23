import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '@/lib/services/order_service';
import { Order } from '@/lib/definitions';
import { ClusterService } from '@/lib/services/cluster_service';

vi.mock('@/lib/services/cluster_service', () => ({
    ClusterService: {
        findNearestCluster: vi.fn(),
        addOrderToCluster: vi.fn(),
        createCluster: vi.fn(),
    }
}));

describe('OrderService', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockSupabase: any = {
        from: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset the mock implementations to return 'this' for chaining
        mockSupabase.from.mockReturnValue(mockSupabase);
        mockSupabase.insert.mockReturnValue(mockSupabase);
        mockSupabase.select.mockReturnValue(mockSupabase);
        mockSupabase.single.mockReturnValue(mockSupabase);
        mockSupabase.order.mockReturnValue(mockSupabase);
        mockSupabase.eq.mockReturnValue(mockSupabase);
        mockSupabase.update.mockReturnValue(mockSupabase);
        mockSupabase.neq.mockReturnValue(mockSupabase);
        mockSupabase.lte.mockReturnValue(mockSupabase);
    });

    describe('create', () => {
        it('should successfully create an order and assign it to an existing cluster', async () => {
            const mockOrder: Partial<Order> = {
                customer_id: 'user-123',
                address: '123 Main St',
                lat: 10,
                lon: 10,
                vegetables: ['Carrots', 'Potatoes'],
                status: 'PENDING'
            };

            const mockCluster = { id: 'cluster-1', centroid_lat: 10, centroid_lon: 10, order_count: 1 };
            const mockResponse = { id: '123', created_at: '2024-01-01', cluster_id: 'cluster-1', ...mockOrder };

            vi.mocked(ClusterService.findNearestCluster).mockResolvedValue(mockCluster as any);
            vi.mocked(ClusterService.addOrderToCluster).mockResolvedValue(true);
            mockSupabase.single.mockResolvedValue({ data: mockResponse, error: null });
            
            const result = await OrderService.create(mockSupabase, mockOrder as Order);

            expect(result).toEqual(mockResponse);
            expect(ClusterService.findNearestCluster).toHaveBeenCalledWith(mockSupabase, 10, 10);
            expect(ClusterService.addOrderToCluster).toHaveBeenCalledWith(mockSupabase, mockCluster, 10, 10);
            expect(mockSupabase.insert).toHaveBeenCalledWith([{
                ...mockOrder,
                cluster_id: 'cluster-1',
                vegetables: mockOrder.vegetables
            }]);
        });

        it('should successfully create an order and a new cluster if none nearby', async () => {
            const mockOrder: Partial<Order> = {
                customer_id: 'user-123',
                address: '123 Main St',
                lat: 10,
                lon: 10,
                vegetables: ['Carrots', 'Potatoes'],
                status: 'PENDING'
            };

            const mockNewCluster = { id: 'new-cluster', centroid_lat: 10, centroid_lon: 10, order_count: 1 };
            const mockResponse = { id: '123', created_at: '2024-01-01', cluster_id: 'new-cluster', ...mockOrder };

            vi.mocked(ClusterService.findNearestCluster).mockResolvedValue(null);
            vi.mocked(ClusterService.createCluster).mockResolvedValue(mockNewCluster as any);
            mockSupabase.single.mockResolvedValue({ data: mockResponse, error: null });
            
            const result = await OrderService.create(mockSupabase, mockOrder as Order);

            expect(result).toEqual(mockResponse);
            expect(ClusterService.findNearestCluster).toHaveBeenCalledWith(mockSupabase, 10, 10);
            expect(ClusterService.createCluster).toHaveBeenCalledWith(mockSupabase, 10, 10);
            expect(mockSupabase.insert).toHaveBeenCalledWith([{
                ...mockOrder,
                cluster_id: 'new-cluster',
                vegetables: mockOrder.vegetables
            }]);
        });

        it('should return null on error during creation', async () => {
            const mockOrder = { customer_id: 'Fail', lat: 0, lon: 0 };
            vi.mocked(ClusterService.findNearestCluster).mockResolvedValue(null);

            mockSupabase.single.mockResolvedValue({ data: null, error: { message: 'DB Error' } });
            
            const result = await OrderService.create(mockSupabase, mockOrder as Order);

            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('should fetch all orders', async () => {
            const mockOrders = [{ id: '1', customer_id: 'u1' }, { id: '2', customer_id: 'u2' }];
            mockSupabase.order.mockResolvedValue({ data: mockOrders, error: null });
            
            const result = await OrderService.getAll(mockSupabase);

            expect(result).toEqual(mockOrders);
            expect(mockSupabase.from).toHaveBeenCalledWith('orders');
            expect(mockSupabase.select).toHaveBeenCalledWith('*');
            expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
        });
    });

    describe('getByCustomerId', () => {
        it('should fetch orders for a specific customer', async () => {
            const mockOrders = [{ id: '1', customer_id: 'user-123' }];
            mockSupabase.order.mockResolvedValue({ data: mockOrders, error: null });
            
            const result = await OrderService.getByCustomerId(mockSupabase, 'user-123');

            expect(result).toEqual(mockOrders);
            expect(mockSupabase.eq).toHaveBeenCalledWith('customer_id', 'user-123');
        });
    });

    describe('updateStatus', () => {
        it('should successfully update status', async () => {
            mockSupabase.eq.mockResolvedValue({ error: null });
            
            const result = await OrderService.updateStatus(mockSupabase, '123', 'DELIVERED');

            expect(result).toBe(true);
            expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'DELIVERED' });
            expect(mockSupabase.eq).toHaveBeenCalledWith('id', '123');
        });
    });

    describe('assignDriver', () => {
        it('should successfully assign a driver', async () => {
            mockSupabase.eq.mockResolvedValue({ error: null });
            
            const result = await OrderService.assignDriver(mockSupabase, 'order-123', 'driver-456');

            expect(result).toBe(true);
            expect(mockSupabase.update).toHaveBeenCalledWith({ driver_id: 'driver-456', status: 'IN_PROGRESS' });
            expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'order-123');
        });
    });

    describe('getPendingOrders', () => {
        it('should fetch all pending orders due today or earlier', async () => {
            const mockOrders = [{ id: '1', status: 'PENDING', delivery_date: '2024-01-01' }];
            mockSupabase.order.mockResolvedValue({ data: mockOrders, error: null });
            
            const result = await OrderService.getPendingOrders(mockSupabase);

            expect(result).toEqual(mockOrders);
            expect(mockSupabase.eq).toHaveBeenCalledWith('status', 'PENDING');
            expect(mockSupabase.lte).toHaveBeenCalledWith('delivery_date', expect.any(String));
            expect(mockSupabase.order).toHaveBeenCalledWith('delivery_date', { ascending: true });
        });
    });

    describe('getActiveOrdersByDriver', () => {
        it('should fetch active orders for a driver', async () => {
            const mockOrders = [{ id: '1', driver_id: 'driver-123', status: 'IN_PROGRESS' }];
            mockSupabase.order.mockResolvedValue({ data: mockOrders, error: null });
            
            const result = await OrderService.getActiveOrdersByDriver(mockSupabase, 'driver-123');

            expect(result).toEqual(mockOrders);
            expect(mockSupabase.eq).toHaveBeenCalledWith('driver_id', 'driver-123');
            expect(mockSupabase.eq).toHaveBeenCalledWith('status', 'IN_PROGRESS');
            expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: true });
        });
    });

    describe('getCompletedOrdersByDriver', () => {
        it('should fetch completed orders for a driver', async () => {
            const mockOrders = [{ id: '2', driver_id: 'driver-123', status: 'DELIVERED' }];
            mockSupabase.order.mockResolvedValue({ data: mockOrders, error: null });
            
            const result = await OrderService.getCompletedOrdersByDriver(mockSupabase, 'driver-123');

            expect(result).toEqual(mockOrders);
            expect(mockSupabase.eq).toHaveBeenCalledWith('driver_id', 'driver-123');
            expect(mockSupabase.eq).toHaveBeenCalledWith('status', 'DELIVERED');
            expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
        });
    });
});
