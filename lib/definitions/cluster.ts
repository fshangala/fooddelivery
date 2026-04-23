/**
 * Interface representing a group of geographically close orders.
 */
export interface Cluster {
    id: string;
    created_at: string;
    /** Latitude of the cluster's centroid. */
    centroid_lat: number;
    /** Longitude of the cluster's centroid. */
    centroid_lon: number;
    /** Number of orders associated with this cluster. */
    order_count: number;
}
