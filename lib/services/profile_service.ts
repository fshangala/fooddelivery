import { SupabaseClient } from "@supabase/supabase-js";
import { Profile } from "../definitions";

export class ProfileService {
    /**
     * Fetches a user's profile from the 'profiles' table.
     * 
     * @param supabase - The Supabase client to use.
     * @param userId - The ID of the user whose profile is to be fetched.
     * @returns A promise that resolves to the user's profile or null if not found.
     */
    static async getProfile(supabase: SupabaseClient, userId: string): Promise<Profile | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error("ProfileService.getProfile failed:", error.message);
                return null;
            }

            return data as Profile;
        } catch (e) {
            console.error("Profile fetch failed:", e);
            return null;
        }
    }

    /**
     * Updates a user's profile in the 'profiles' table.
     * This method prevents updating the 'role' field for security.
     * 
     * @param supabase - The Supabase client to use.
     * @param userId - The ID of the user whose profile is to be updated.
     * @param data - The profile data to update (name and phone only).
     * @returns A promise that resolves to the updated profile or null if the operation failed.
     */
    static async updateProfile(supabase: SupabaseClient, userId: string, data: Partial<Profile>): Promise<Profile | null> {
        try {
            // Ensure we are only updating allowed fields
            const updateData: {
                name?: string | null;
                phone?: string | null;
                preferred_lat?: number | null;
                preferred_lon?: number | null;
                preferred_radius_km?: number | null;
                updated_at: string;
            } = {
                updated_at: new Date().toISOString()
            };
            if (data.name !== undefined) updateData.name = data.name;
            if (data.phone !== undefined) updateData.phone = data.phone;
            if (data.preferred_lat !== undefined) updateData.preferred_lat = data.preferred_lat;
            if (data.preferred_lon !== undefined) updateData.preferred_lon = data.preferred_lon;
            if (data.preferred_radius_km !== undefined) updateData.preferred_radius_km = data.preferred_radius_km;

            const { data: updatedProfile, error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                console.error("ProfileService.updateProfile failed:", error.message);
                return null;
            }

            return updatedProfile as Profile;
        } catch (e) {
            console.error("Profile update failed:", e);
            return null;
        }
    }
}
