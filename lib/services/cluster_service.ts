import { SupabaseClient } from "@supabase/supabase-js";
import { Cluster, Order } from "../definitions";
import { getDistance } from "../utils/geo";

type AvailableCluster = Cluster & {
    pendingOrdersCount: number;
    representativeAddress?: string;
};

/**
 * Service class for managing smart clusters.
 * Handles grouping orders based on geographic proximity.
 */
export class ClusterService {
    /**
     * Threshold distance in kilometers for adding an order to a cluster's centroid.
     */
    private static readonly CLUSTER_RADIUS_KM = 0.5;

    /**
     * Finds the nearest cluster whose centroid is within 0.5km of the given location.
     * 
     * @param supabase - The Supabase client.
     * @param lat - Latitude of the new order.
     * @param lon - Longitude of the new order.
     * @returns The nearest cluster within range, or null if none found.
     */
    static async findNearestCluster(supabase: SupabaseClient, lat: number, lon: number): Promise<Cluster | null> {
        // Fetch all clusters. For large datasets, this should be optimized with a spatial query.
        const { data: clusters, error } = await supabase
            .from('clusters')
            .select('*');

        if (error || !clusters) {
            console.error("Error fetching clusters:", error?.message);
            return null;
        }

        let nearestCluster: Cluster | null = null;
        let minDistance = this.CLUSTER_RADIUS_KM;

        for (const cluster of (clusters as Cluster[])) {
            const distance = getDistance(lat, lon, cluster.centroid_lat, cluster.centroid_lon);
            if (distance <= minDistance) {
                minDistance = distance;
                nearestCluster = cluster;
            }
        }

        return nearestCluster;
    }

    /**
     * Creates a new cluster with the given coordinates as the initial centroid.
     * 
     * @param supabase - The Supabase client.
     * @param lat - Initial latitude.
     * @param lon - Initial longitude.
     * @returns The newly created cluster.
     */
    static async createCluster(supabase: SupabaseClient, lat: number, lon: number): Promise<Cluster | null> {
        const { data, error } = await supabase
            .from('clusters')
            .insert([{
                centroid_lat: lat,
                centroid_lon: lon,
                order_count: 1
            }])
            .select()
            .single();

        if (error) {
            console.error("Error creating cluster:", error.message);
            return null;
        }

        return data as Cluster;
    }

    /**
     * Updates a cluster's centroid by incorporating a new order's location.
     * Uses the moving average formula to recalculate the centroid.
     * 
     * @param supabase - The Supabase client.
     * @param cluster - The cluster to update.
     * @param orderLat - Latitude of the new order.
     * @param orderLon - Longitude of the new order.
     * @returns True if successful, false otherwise.
     */
    static async addOrderToCluster(
        supabase: SupabaseClient, 
        cluster: Cluster, 
        orderLat: number, 
        orderLon: number
    ): Promise<boolean> {
        const currentCount = cluster.order_count || 0;
        const newCount = currentCount + 1;
        const newLat = ((cluster.centroid_lat * currentCount) + orderLat) / newCount;
        const newLon = ((cluster.centroid_lon * currentCount) + orderLon) / newCount;

        const { error } = await supabase
            .from('clusters')
            .update({
                centroid_lat: newLat,
                centroid_lon: newLon,
                order_count: newCount
            })
            .eq('id', cluster.id);

        if (error) {
            console.error("Error updating cluster centroid:", error.message);
            return false;
        }

        return true;
    }

    /**
     * Retrieves clusters that are available for driver assignment.
     * Only clusters without an assigned driver and with pending orders are returned.
     */
    static async getAvailableClusters(supabase: SupabaseClient): Promise<AvailableCluster[]> {
        const { data: clusters, error } = await supabase
            .from('clusters')
            .select('*')
            .is('driver_id', null);

        if (error || !clusters) {
            console.error("Error fetching available clusters:", error?.message);
            return [];
        }

        const clusterIds = (clusters as Cluster[]).map((cluster) => cluster.id);
        if (clusterIds.length === 0) {
            return [];
        }

        const { data: pendingOrders, error: ordersError } = await supabase
            .from('orders')
            .select('id, cluster_id, address')
            .in('cluster_id', clusterIds)
            .eq('status', 'PENDING');

        if (ordersError) {
            console.error("Error fetching pending orders for clusters:", ordersError.message);
            return [];
        }

        const ordersByCluster = new Map<string, Order[]>();
        for (const order of (pendingOrders as Order[])) {
            if (!order.cluster_id) continue;
            const current = ordersByCluster.get(order.cluster_id) || [];
            current.push(order);
            ordersByCluster.set(order.cluster_id, current);
        }

        return (clusters as Cluster[])
            .map((cluster) => {
                const orders = ordersByCluster.get(cluster.id) || [];
                return {
                    ...cluster,
                    pendingOrdersCount: orders.length,
                    representativeAddress: orders[0]?.address,
                };
            })
            .filter((cluster) => cluster.pendingOrdersCount > 0);
    }

    /**
     * Retrieves clusters currently assigned to a specific driver.
     */
    static async getActiveClustersByDriver(supabase: SupabaseClient, driverId: string): Promise<Cluster[]> {
        const { data, error } = await supabase
            .from('clusters')
            .select('*')
            .eq('driver_id', driverId);

        if (error || !data) {
            console.error("Error fetching active clusters for driver:", error?.message);
            return [];
        }

        return data as Cluster[];
    }

    /**
     * Assigns a driver to a cluster and marks all pending orders in that cluster as in progress.
     */
    static async assignDriverToCluster(supabase: SupabaseClient, clusterId: string, driverId: string): Promise<boolean> {
        const { error: clusterError } = await supabase
            .from('clusters')
            .update({ driver_id: driverId })
            .eq('id', clusterId)
            .is('driver_id', null);

        if (clusterError) {
            console.error("Error assigning driver to cluster:", clusterError.message);
            return false;
        }

        const { error: ordersError } = await supabase
            .from('orders')
            .update({ driver_id: driverId, status: 'IN_PROGRESS' })
            .eq('cluster_id', clusterId)
            .eq('status', 'PENDING');

        if (ordersError) {
            console.error("Error assigning driver to cluster orders:", ordersError.message);
            return false;
        }

        return true;
    }
}
