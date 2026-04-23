import { SupabaseClient } from "@supabase/supabase-js";
import { Cluster } from "../definitions";
import { getDistance } from "../utils/geo";

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
        const newCount = cluster.order_count + 1;
        const newLat = ((cluster.centroid_lat * cluster.order_count) + orderLat) / newCount;
        const newLon = ((cluster.centroid_lon * cluster.order_count) + orderLon) / newCount;

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
}
