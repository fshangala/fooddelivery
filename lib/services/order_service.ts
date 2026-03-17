import supabase from "../supabase/client";
import { Order, OrderStatus } from "../definitions";

/**
 * Service class for managing vegetable orders in Supabase.
 * Handles CRUD operations and filtering for the 'orders' table.
 */
export class OrderService {
    /**
     * Creates a new vegetable order in the database.
     * 
     * @param orderData - The order details excluding system-generated fields (id, created_at).
     * @param orderData.customer_id - The UUID of the customer from auth.users.
     * @param orderData.address - The physical delivery address.
     * @param orderData.lat - Latitude coordinate for delivery location.
     * @param orderData.lon - Longitude coordinate for delivery location.
     * @param orderData.vegetables - Array of selected vegetable names.
     * @param orderData.status - Initial status of the order (usually 'PENDING').
     * @returns The newly created order object, or null if the operation fails.
     */
    static async create(orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order | null> {
        const { data, error } = await supabase
            .from('orders')
            .insert([{
                ...orderData,
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
     * @returns A promise that resolves to an array of Order objects. Returns an empty array on error.
     */
    static async getAll(): Promise<Order[]> {
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
     * @param id - The UUID of the order to retrieve.
     * @returns A promise that resolves to the Order object if found, or null if not found or an error occurs.
     */
    static async getById(id: string): Promise<Order | null> {
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
     * @param customerId - The UUID of the customer whose orders are being retrieved.
     * @returns A promise that resolves to an array of Order objects. Returns an empty array on error.
     */
    static async getByCustomerId(customerId: string): Promise<Order[]> {
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
     * @param id - The UUID of the order to update.
     * @param status - The new status to apply to the order.
     * @returns A promise that resolves to true if the update was successful, or false if it failed.
     */
    static async updateStatus(id: string, status: OrderStatus): Promise<boolean> {
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
}
