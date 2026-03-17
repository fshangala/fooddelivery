import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '@/lib/services/order_service';
import supabase from '@/lib/supabase/client';

describe('OrderService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('create', () => {
        it('should successfully create an order', async () => {
            const mockOrder = {
                customer_id: 'user-123',
                address: '123 Main St',
                lat: 0,
                lon: 0,
                vegetables: ['Carrots', 'Potatoes'],
                status: 'PENDING'
            } as any;

            const mockResponse = { id: '123', created_at: '2024-01-01', ...mockOrder };

            const singleMock = vi.fn().mockResolvedValue({ data: mockResponse, error: null });
            const selectMock = vi.fn().mockReturnValue({ single: singleMock });
            const insertMock = vi.fn().mockReturnValue({ select: selectMock });
            
            vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as any);

            const result = await OrderService.create(mockOrder);

            expect(result).toEqual(mockResponse);
            expect(supabase.from).toHaveBeenCalledWith('orders');
            expect(insertMock).toHaveBeenCalledWith([mockOrder]);
        });

        it('should return null on error during creation', async () => {
            const mockOrder = { customer_id: 'Fail' } as any;

            const singleMock = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } });
            const selectMock = vi.fn().mockReturnValue({ single: singleMock });
            const insertMock = vi.fn().mockReturnValue({ select: selectMock });
            
            vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as any);

            const result = await OrderService.create(mockOrder);

            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('should fetch all orders', async () => {
            const mockOrders = [{ id: '1', customer_id: 'u1' }, { id: '2', customer_id: 'u2' }];
            const orderMock = vi.fn().mockResolvedValue({ data: mockOrders, error: null });
            const selectMock = vi.fn().mockReturnValue({ order: orderMock });
            
            vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any);

            const result = await OrderService.getAll();

            expect(result).toEqual(mockOrders);
            expect(selectMock).toHaveBeenCalledWith('*');
            expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false });
        });
    });

    describe('getByCustomerId', () => {
        it('should fetch orders for a specific customer', async () => {
            const mockOrders = [{ id: '1', customer_id: 'user-123' }];
            const orderMock = vi.fn().mockResolvedValue({ data: mockOrders, error: null });
            const eqMock = vi.fn().mockReturnValue({ order: orderMock });
            const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
            
            vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any);

            const result = await OrderService.getByCustomerId('user-123');

            expect(result).toEqual(mockOrders);
            expect(eqMock).toHaveBeenCalledWith('customer_id', 'user-123');
        });
    });

    describe('updateStatus', () => {
        it('should successfully update status', async () => {
            const eqMock = vi.fn().mockResolvedValue({ error: null });
            const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
            
            vi.mocked(supabase.from).mockReturnValue({ update: updateMock } as any);

            const result = await OrderService.updateStatus('123', 'DELIVERED');

            expect(result).toBe(true);
            expect(updateMock).toHaveBeenCalledWith({ status: 'DELIVERED' });
            expect(eqMock).toHaveBeenCalledWith('id', '123');
        });
    });
});
