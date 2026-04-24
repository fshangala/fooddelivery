'use server';

import { createClient } from "../supabase/server";
import { ProfileService } from "../services/profile_service";
import { revalidatePath } from "next/cache";

export type ProfileFormState = {
    errors?: {
        name?: string;
        phone?: string;
        preferred_lat?: string;
        preferred_lon?: string;
        preferred_radius_km?: string;
    };
    message?: string;
};

/**
 * Server Action to update the current user's profile.
 * 
 * @param formState - The current state of the profile form.
 * @param formData - The form data containing 'name', 'phone', and driver preferences.
 * @returns A promise that resolves to the updated ProfileFormState.
 */
export async function updateProfileAction(formState: ProfileFormState | undefined, formData: FormData) {
    const errorData: ProfileFormState = {};

    const name = formData.get('name') as string;
    if (!name) {
        errorData.errors = { ...errorData.errors, name: "Name is required" };
    }

    const phone = formData.get('phone') as string;
    if (!phone) {
        errorData.errors = { ...errorData.errors, phone: "Phone number is required" };
    } else if (!phone.startsWith('+260')) {
        errorData.errors = { ...errorData.errors, phone: "Phone must start with +260" };
    } else if (phone.length !== 13) {
        errorData.errors = { ...errorData.errors, phone: "Phone must be exactly 13 characters (including +260)" };
    } else if (!/^\+260\d{9}$/.test(phone)) {
        errorData.errors = { ...errorData.errors, phone: "Phone must contain 9 digits after +260" };
    }

    const preferred_lat = formData.get('preferred_lat') as string;
    const preferred_lon = formData.get('preferred_lon') as string;
    const preferred_radius_km = formData.get('preferred_radius_km') as string;

    if (errorData.errors && Object.keys(errorData.errors).length > 0) {
        return errorData;
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "Not authenticated" };
    }

    // Role cannot be updated here (enforced by ProfileService.updateProfile)
    const result = await ProfileService.updateProfile(supabase, user.id, { 
        name, 
        phone,
        preferred_lat: preferred_lat ? parseFloat(preferred_lat) : undefined,
        preferred_lon: preferred_lon ? parseFloat(preferred_lon) : undefined,
        preferred_radius_km: preferred_radius_km ? parseFloat(preferred_radius_km) : undefined
    });

    if (!result) {
        return { message: "Failed to update profile" };
    }

    revalidatePath('/profile');
    revalidatePath('/admin/profile');
    
    return { message: "Success" };
}
