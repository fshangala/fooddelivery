import { SupabaseClient } from "@supabase/supabase-js";
import { Package } from "../definitions/packages";

export interface Subscription {
    id: string;
    user_id: string;
    package_id: string;
    start_date: string;
    end_date: string;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    created_at: string;
}

export class SubscriptionService {
    static async create(
        supabase: SupabaseClient,
        userId: string,
        packageId: string,
        address: string,
        lat: number,
        lon: number,
        pkg: Package
    ) {
        // 1. Calculate dates
        const today = new Date();
        const start_date = today.toISOString().split('T')[0];
        
        const endDateObj = new Date(today);
        endDateObj.setMonth(endDateObj.getMonth() + 1);
        const end_date = endDateObj.toISOString().split('T')[0];

        // 2. Create Subscription
        const { data: subData, error: subError } = await supabase
            .from('subscriptions')
            .insert({
                user_id: userId,
                package_id: packageId,
                start_date,
                end_date,
                status: 'ACTIVE'
            })
            .select()
            .single();

        if (subError || !subData) {
            console.error("Error creating subscription:", subError);
            return null;
        }

        const subscriptionId = subData.id;

        // 3. Generate 4 Orders (Next 4 Mondays)
        const orders = [];
        
        // Find next Monday
        const d = new Date();
        const day = d.getDay();
        
        const daysUntilMonday = (1 + 7 - day) % 7;
        
        const nextMonday = new Date(d);
        nextMonday.setDate(d.getDate() + daysUntilMonday);

        const { ClusterService } = await import("./cluster_service");

        for (let i = 0; i < 4; i++) {
            const deliveryDateObj = new Date(nextMonday);
            deliveryDateObj.setDate(nextMonday.getDate() + (i * 7));
            const deliveryDateStr = deliveryDateObj.toISOString().split('T')[0];
            
            // Automated Cluster Assignment
            const cluster = await ClusterService.getOrCreateCluster(
                supabase,
                lat,
                lon,
                deliveryDateStr
            );

            orders.push({
                customer_id: userId,
                subscription_id: subscriptionId,
                cluster_id: cluster?.id || null,
                address,
                lat,
                lon,
                vegetables: pkg.vegetables,
                status: 'PENDING',
                delivery_date: deliveryDateStr
            });
        }

        const { error: ordersError } = await supabase
            .from('orders')
            .insert(orders);

        if (ordersError) {
            console.error("Error creating subscription orders:", ordersError);
            // Ideally rollback subscription here, but simplistic for now
            return null;
        }

        return subData;
    }

    static async getActiveByUserId(supabase: SupabaseClient, userId: string) {
         const { data, error } = await supabase
            .from('subscriptions')
            .select('*, packages(*)')
            .eq('user_id', userId)
            .eq('status', 'ACTIVE')
            .single();
            
        if (error) return null;
        return data;
    }
}
