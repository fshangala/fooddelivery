import { SupabaseClient } from "@supabase/supabase-js";

export class SettingsService {
    /**
     * Retrieves a setting value by its key.
     * 
     * @param supabase - The Supabase client.
     * @param key - The setting key.
     * @param defaultValue - The fallback value if setting not found.
     * @returns The setting value.
     */
    static async getSetting<T>(supabase: SupabaseClient, key: string, defaultValue: T): Promise<T> {
        const { data, error } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', key)
            .single();

        if (error || !data) {
            return defaultValue;
        }

        return data.value as T;
    }

    /**
     * Retrieves the cluster radius from settings.
     */
    static async getClusterRadius(supabase: SupabaseClient): Promise<number> {
        return this.getSetting<number>(supabase, 'cluster_radius_km', 0.5);
    }

    /**
     * Retrieves the max orders per cluster from settings.
     */
    static async getMaxOrdersPerCluster(supabase: SupabaseClient): Promise<number> {
        return this.getSetting<number>(supabase, 'max_orders_per_cluster', 20);
    }
}
