import { SupabaseClient } from "@supabase/supabase-js";
import { Order, OrderStatus } from "../definitions";
import { ClusterService } from "./cluster_service";

/**
 * Service class for managing vegetable orders in Supabase.
 * Handles CRUD operations and filtering for the 'orders' table.
 */
export class OrderService {
    /**
     * Creates a new vegetable order in the database and assigns it to a smart cluster.
     * 
     * @param supabase - The Supabase client to use for the operation.
     * @param orderData - The order details excluding system-generated fields (id, created_at).
     * @returns The newly created order object, or null if the operation fails.
     */
    static async create(supabase: SupabaseClient, orderData: Partial<Order>): Promise<Order | null> {
        // Find or create a cluster for the new order
        const lat = orderData.lat || 0;
        const lon = orderData.lon || 0;
        const deliveryDate = orderData.delivery_date || new Date().toISOString().split('T')[0];
        
        const cluster = await ClusterService.getOrCreateCluster(
            supabase, 
            lat, 
            lon, 
            deliveryDate
        );

        const { data, error } = await supabase
            .from('orders')
            .insert([{
                ...orderData,
                delivery_date: deliveryDate,
                cluster_id: cluster?.id || null,
                // Supabase-js handles objects for JSONB columns automatically
                vegetables: orderData.vegetables 
            }])
            .select()
            .single();

        if (error) {
            console.error("Error creating order:", error.message);
            return null;
        }

        return data as Order;
    }

    /**
     * Retrieves all orders from the database.
     * Orders are returned in descending order based on their creation date (newest first).
     * 
     * @param supabase - The Supabase client to use for the operation.
     * @returns A promise that resolves to an array of Order objects. Returns an empty array on error.
     */
    static async getAll(supabase: SupabaseClient): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error.message);
            return [];
        }

        return (data || []) as Order[];
    }

    /**
     * Retrieves a specific order by its unique identifier.
     * 
     * @param supabase - The Supabase client to use for the operation.
     * @param id - The UUID of the order to retrieve.
     * @returns A promise that resolves to the Order object if found, or null if not found or an error occurs.
     */
    static async getById(supabase: SupabaseClient, id: string): Promise<Order | null> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching order by ID:", error.message);
            return null;
        }

        return data as Order;
    }

    /**
     * Retrieves all orders associated with a specific customer.
     * Orders are returned in descending order based on their creation date (newest first).
     * 
     * @param supabase - The Supabase client to use for the operation.
     * @param customerId - The UUID of the customer whose orders are being retrieved.
     * @returns A promise that resolves to an array of Order objects. Returns an empty array on error.
     */
    static async getByCustomerId(supabase: SupabaseClient, customerId: string): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching orders by customer ID:", error.message);
            return [];
        }

        return (data || []) as Order[];
    }

    /**
     * Updates the status of an existing order.
     * 
     * @param supabase - The Supabase client to use for the operation.
     * @param id - The UUID of the order to update.
     * @param status - The new status to apply to the order.
     * @returns A promise that resolves to true if the update was successful, or false if it failed.
     */
    static async updateStatus(supabase: SupabaseClient, id: string, status: OrderStatus): Promise<boolean> {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error("Error updating order status:", error.message);
            return false;
        }

        return true;
    }

    /**
     * Assigns a driver to an order and updates the status to 'IN_PROGRESS'.
     * 
     * @param supabase - The Supabase client to use for the operation.
     * @param id - The UUID of the order to update.
     * @param driverId - The UUID of the driver to assign.
     * @returns A promise that resolves to true if the update was successful, or false if it failed.
     */
    static async assignDriver(supabase: SupabaseClient, id: string, driverId: string): Promise<boolean> {
        const { error } = await supabase
            .from('orders')
            .update({ driver_id: driverId, status: 'IN_PROGRESS' })
            .eq('id', id);

        if (error) {
            console.error("Error assigning driver:", error.message);
            return false;
        }

        return true;
    }

    /**
     * Retrieves all orders with 'PENDING' status that are due for delivery (date <= today).
     * 
     * @param supabase - The Supabase client to use for the operation.
     * @returns A promise that resolves to an array of pending Order objects. Returns an empty array on error.
     */
    static async getPendingOrders(supabase: SupabaseClient): Promise<Order[]> {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('status', 'PENDING')
            .lte('delivery_date', today)
            .order('delivery_date', { ascending: true });

        if (error) {
            console.error("Error fetching pending orders:", error.message);
            return [];
        }

        return (data || []) as Order[];
    }

    /**
     * Retrieves all active orders assigned to a specific driver.
     * 
     * @param supabase - The Supabase client to use for the operation.
     * @param driverId - The UUID of the driver.
     * @returns A promise that resolves to an array of Order objects. Returns an empty array on error.
     */
    static async getActiveOrdersByDriver(supabase: SupabaseClient, driverId: string): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('driver_id', driverId)
            .eq('status', 'IN_PROGRESS')
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Error fetching driver orders:", error.message);
            return [];
        }

        return (data || []) as Order[];
    }

    /**
     * Retrieves all completed orders assigned to a specific driver.
     * 
     * @param supabase - The Supabase client to use for the operation.
     * @param driverId - The UUID of the driver.
     * @returns A promise that resolves to an array of completed Order objects.
     */
    static async getCompletedOrdersByDriver(supabase: SupabaseClient, driverId: string): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('driver_id', driverId)
            .eq('status', 'DELIVERED')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching completed orders:", error.message);
            return [];
        }

        return (data || []) as Order[];
    }
}
