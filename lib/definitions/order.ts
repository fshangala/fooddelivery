export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED';

export interface Order {
    id: string;
    created_at: string;
    customer_id: string; // Foreign key to auth.users.id
    address: string;
    lat: number;
    lon: number;
    vegetables: string[];
    status: OrderStatus;
}
