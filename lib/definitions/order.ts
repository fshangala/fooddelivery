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

export interface Order {
    id: string;
    created_at: string;
    customer_id: string; // Foreign key to auth.users.id
    driver_id?: string; // Foreign key to auth.users.id
    address: string;
    delivery_instructions?: string;
    lat: number;
    lon: number;
    vegetables: string[];
    status: OrderStatus;
}
