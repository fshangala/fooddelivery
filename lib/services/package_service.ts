import { SupabaseClient } from "@supabase/supabase-js";
import { Package } from "../definitions/packages";

export class PackageService {
    static async getAll(supabase: SupabaseClient): Promise<Package[]> {
        const { data, error } = await supabase
            .from('packages')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error("Error fetching packages:", error);
            return [];
        }
        
        return data as Package[];
    }

    static async getActive(supabase: SupabaseClient): Promise<Package[]> {
        const { data, error } = await supabase
            .from('packages')
            .select('*')
            .eq('is_active', true)
            .order('price', { ascending: true }); // Starter -> Premium -> Platinum (by price usually)
        
        if (error) {
            console.error("Error fetching active packages:", error);
            return [];
        }
        
        return data as Package[];
    }

    static async getById(supabase: SupabaseClient, id: string): Promise<Package | null> {
        const { data, error } = await supabase
            .from('packages')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) {
            console.error(`Error fetching package ${id}:`, error);
            return null;
        }
        
        return data as Package;
    }

    static async create(supabase: SupabaseClient, pkg: Omit<Package, 'id' | 'created_at'>): Promise<Package | null> {
        const { data, error } = await supabase
            .from('packages')
            .insert(pkg)
            .select()
            .single();

        if (error) {
            console.error("Error creating package:", error);
            return null;
        }

        return data as Package;
    }

    static async update(supabase: SupabaseClient, id: string, pkg: Partial<Omit<Package, 'id' | 'created_at'>>): Promise<Package | null> {
        const { data, error } = await supabase
            .from('packages')
            .update(pkg)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error(`Error updating package ${id}:`, error);
            return null;
        }

        return data as Package;
    }

    static async delete(supabase: SupabaseClient, id: string): Promise<boolean> {
        const { error } = await supabase
            .from('packages')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Error deleting package ${id}:`, error);
            return false;
        }

        return true;
    }
}
