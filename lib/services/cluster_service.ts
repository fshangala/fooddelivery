import { SupabaseClient } from "@supabase/supabase-js";
import { Cluster, Order, Profile } from "../definitions";
import { getDistance } from "../utils/geo";
import { SettingsService } from "./settings_service";

type AvailableCluster = Cluster & {
    pendingOrdersCount: number;
    representativeAddress?: string;
    isPreferred?: boolean;
    distanceFromHome?: number;
};

/**
 * Service class for managing smart clusters.
 * Handles grouping orders based on geographic proximity.
 */
export class ClusterService {
    /**
     * Threshold distance in kilometers for adding an order to a cluster's centroid.
     * @deprecated Use SettingsService.getClusterRadius()
     */
    private static readonly CLUSTER_RADIUS_KM = 0.5;

    /**
     * Finds the nearest cluster whose centroid is within range of the given location and on the same delivery date.
     * Only considers OPEN clusters with capacity.
     */
    static async findNearestCluster(
        supabase: SupabaseClient, 
        lat: number, 
        lon: number,
        deliveryDate: string
    ): Promise<Cluster | null> {
        // Fetch radius and max orders from settings
        const [radius, maxOrders] = await Promise.all([
            SettingsService.getClusterRadius(supabase),
            SettingsService.getMaxOrdersPerCluster(supabase)
        ]);

        // Fetch all OPEN clusters for the given date.
        const { data: clusters, error } = await supabase
            .from('clusters')
            .select('*')
            .eq('delivery_date', deliveryDate)
            .eq('status', 'OPEN');

        if (error || !clusters) {
            console.error("Error fetching clusters:", error?.message);
            return null;
        }

        let nearestCluster: Cluster | null = null;
        let minDistance = radius;

        for (const cluster of (clusters as Cluster[])) {
            // Check capacity
            if ((cluster.order_count || 0) >= maxOrders) continue;

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
     */
    static async createCluster(
        supabase: SupabaseClient, 
        lat: number, 
        lon: number,
        deliveryDate: string
    ): Promise<Cluster | null> {
        const { data, error } = await supabase
            .from('clusters')
            .insert([{
                centroid_lat: lat,
                centroid_lon: lon,
                order_count: 1,
                delivery_date: deliveryDate,
                status: 'OPEN'
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
     * Finds an existing cluster within range or creates a new one.
     */
    static async getOrCreateCluster(
        supabase: SupabaseClient,
        lat: number,
        lon: number,
        deliveryDate: string
    ): Promise<Cluster | null> {
        const existing = await this.findNearestCluster(supabase, lat, lon, deliveryDate);
        if (existing) {
            const success = await this.addOrderToCluster(supabase, existing, lat, lon);
            if (success) {
                return {
                    ...existing,
                    order_count: (existing.order_count || 0) + 1
                };
            }
            return existing;
        }

        return this.createCluster(supabase, lat, lon, deliveryDate);
    }

    /**
     * Updates a cluster's centroid by incorporating a new order's location.
     * Uses the moving average formula to recalculate the centroid.
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
     * Updates a cluster's status to COMPLETED if all orders are finished.
     */
    static async checkAndCompleteCluster(supabase: SupabaseClient, clusterId: string): Promise<boolean> {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('status')
            .eq('cluster_id', clusterId);

        if (error || !orders) return false;

        // If all orders are DELIVERED or CANCELLED
        const allFinished = orders.every(o => ['DELIVERED', 'CANCELLED'].includes(o.status));

        if (allFinished && orders.length > 0) {
            const { error: updateError } = await supabase
                .from('clusters')
                .update({ status: 'COMPLETED' })
                .eq('id', clusterId);
            
            return !updateError;
        }

        return false;
    }

    /**
     * Retrieves clusters that are available for driver assignment.
     * Prioritizes clusters based on driver home zone if provided.
     */
    static async getAvailableClusters(supabase: SupabaseClient, driverProfile?: Profile | null): Promise<AvailableCluster[]> {
        const { data: clusters, error } = await supabase
            .from('clusters')
            .select('*')
            .eq('status', 'OPEN')
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

        const results = (clusters as Cluster[])
            .map((cluster) => {
                const orders = ordersByCluster.get(cluster.id) || [];
                let isPreferred = false;
                let distanceFromHome = undefined;

                if (driverProfile?.preferred_lat && driverProfile?.preferred_lon) {
                    distanceFromHome = getDistance(
                        driverProfile.preferred_lat, 
                        driverProfile.preferred_lon, 
                        cluster.centroid_lat, 
                        cluster.centroid_lon
                    );
                    isPreferred = distanceFromHome <= (driverProfile.preferred_radius_km || 5.0);
                }

                return {
                    ...cluster,
                    pendingOrdersCount: orders.length,
                    representativeAddress: orders[0]?.address,
                    isPreferred,
                    distanceFromHome
                };
            })
            .filter((cluster) => cluster.pendingOrdersCount > 0);

        // Sort: Preferred first, then by distance (if available)
        results.sort((a, b) => {
            if (a.isPreferred && !b.isPreferred) return -1;
            if (!a.isPreferred && b.isPreferred) return 1;
            if (a.distanceFromHome !== undefined && b.distanceFromHome !== undefined) {
                return a.distanceFromHome - b.distanceFromHome;
            }
            return 0;
        });

        return results;
    }

    /**
     * Assigns a driver to a cluster and marks all pending orders in that cluster as in progress.
     */
    static async assignDriverToCluster(supabase: SupabaseClient, clusterId: string, driverId: string): Promise<boolean> {
        const { error: clusterError } = await supabase
            .from('clusters')
            .update({ 
                driver_id: driverId,
                status: 'ASSIGNED'
            })
            .eq('id', clusterId)
            .eq('status', 'OPEN')
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
}
