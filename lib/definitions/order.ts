import { Order as DbOrder } from "./supabase";

export type UserRole = 'customer' | 'driver' | 'admin';

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED';

/**
 * List of available vegetables that can be included in an order.
 */
export const AVAILABLE_VEGETABLES = [
    "Spinach",
    "Carrots",
    "Potatoes",
    "Tomatoes",
    "Onions",
    "Broccoli",
    "Peppers",
    "Lettuce",
    "Cabbage"
];

export interface Order extends Omit<DbOrder, 'vegetables' | 'status'> {
    vegetables: string[];
    status: OrderStatus;
}
