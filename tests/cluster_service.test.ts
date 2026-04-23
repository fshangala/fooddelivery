import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClusterService } from '@/lib/services/cluster_service';
import { Cluster } from '@/lib/definitions';
import * as geo from '@/lib/utils/geo';

describe('ClusterService', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockSupabase: any = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockSupabase.from.mockReturnValue(mockSupabase);
        mockSupabase.select.mockReturnValue(mockSupabase);
        mockSupabase.insert.mockReturnValue(mockSupabase);
        mockSupabase.update.mockReturnValue(mockSupabase);
        mockSupabase.eq.mockReturnValue(mockSupabase);
        mockSupabase.single.mockReturnValue(mockSupabase);
    });

    describe('findNearestCluster', () => {
        it('should return the nearest cluster within 0.5km', async () => {
            const mockClusters: Cluster[] = [
                { id: 'c1', centroid_lat: 10, centroid_lon: 10, order_count: 1, created_at: '' },
                { id: 'c2', centroid_lat: 20, centroid_lon: 20, order_count: 1, created_at: '' },
            ];

            mockSupabase.select.mockResolvedValue({ data: mockClusters, error: null });
            
            // Mock distance: c1 is 0.3km away, c2 is 100km away
            const getDistanceSpy = vi.spyOn(geo, 'getDistance');
            getDistanceSpy.mockImplementation((lat1, lon1, lat2, lon2) => {
                if (lat2 === 10) return 0.3;
                if (lat2 === 20) return 100;
                return 1000;
            });

            const result = await ClusterService.findNearestCluster(mockSupabase, 10.001, 10.001);

            expect(result?.id).toBe('c1');
            getDistanceSpy.mockRestore();
        });

        it('should return null if no cluster is within 0.5km', async () => {
            const mockClusters: Cluster[] = [
                { id: 'c1', centroid_lat: 10, centroid_lon: 10, order_count: 1, created_at: '' },
            ];

            mockSupabase.select.mockResolvedValue({ data: mockClusters, error: null });
            
            const getDistanceSpy = vi.spyOn(geo, 'getDistance');
            getDistanceSpy.mockReturnValue(0.6); // 0.6km > 0.5km

            const result = await ClusterService.findNearestCluster(mockSupabase, 10.1, 10.1);

            expect(result).toBeNull();
            getDistanceSpy.mockRestore();
        });
    });

    describe('createCluster', () => {
        it('should create a new cluster', async () => {
            const mockCluster = { id: 'new-c', centroid_lat: 10, centroid_lon: 10, order_count: 1 };
            mockSupabase.single.mockResolvedValue({ data: mockCluster, error: null });

            const result = await ClusterService.createCluster(mockSupabase, 10, 10);

            expect(result).toEqual(mockCluster);
            expect(mockSupabase.from).toHaveBeenCalledWith('clusters');
            expect(mockSupabase.insert).toHaveBeenCalledWith([{
                centroid_lat: 10,
                centroid_lon: 10,
                order_count: 1
            }]);
        });
    });

    describe('addOrderToCluster', () => {
        it('should update cluster centroid and count', async () => {
            const initialCluster: Cluster = {
                id: 'c1',
                centroid_lat: 10,
                centroid_lon: 10,
                order_count: 1,
                created_at: ''
            };

            mockSupabase.eq.mockResolvedValue({ error: null });

            // New order at 11, 11
            // New lat = (10*1 + 11) / 2 = 10.5
            // New lon = (10*1 + 11) / 2 = 10.5
            const result = await ClusterService.addOrderToCluster(mockSupabase, initialCluster, 11, 11);

            expect(result).toBe(true);
            expect(mockSupabase.update).toHaveBeenCalledWith({
                centroid_lat: 10.5,
                centroid_lon: 10.5,
                order_count: 2
            });
            expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'c1');
        });
    });
});
