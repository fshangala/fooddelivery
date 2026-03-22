import { SupabaseClient } from "@supabase/supabase-js";

export class AdminService {
    /**
     * Checks if at least one user with the 'admin' role exists in auth.users.
     * Uses a secure RPC function to check the auth schema.
     * 
     * @param supabase - The Supabase client to use.
     * @returns A promise that resolves to true if an admin exists, false otherwise.
     */
    static async exists(supabase: SupabaseClient): Promise<boolean> {
        try {
            const { data, error } = await supabase.rpc('check_admin_exists');

            if (error) {
                console.error("RPC check_admin_exists failed:", error.message);
                return false;
            }

            return !!data;
        } catch (e) {
            console.error("Admin check failed:", e);
            return false;
        }
    }
}
