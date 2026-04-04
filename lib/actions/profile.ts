'use server';

import { createClient } from "../supabase/server";
import { ProfileService } from "../services/profile_service";
import { revalidatePath } from "next/cache";

export type ProfileFormState = {
    errors?: {
        name?: string;
        phone?: string;
    };
    message?: string;
};

/**
 * Server Action to update the current user's profile.
 * 
 * @param formState - The current state of the profile form.
 * @param formData - The form data containing 'name' and 'phone'.
 * @returns A promise that resolves to the updated ProfileFormState.
 */
export async function updateProfileAction(formState: ProfileFormState | undefined, formData: FormData) {
    const errorData: ProfileFormState = {};

    const name = formData.get('name') as string;
    if (!name) {
        errorData.errors = { ...errorData.errors, name: "Name is required" };
    }

    const phone = formData.get('phone') as string;
    // The phone field in the UI will have a read-only +260 prefix.
    // The user will enter 9 digits.
    // The final string should be exactly 13 characters (e.g., +260977123456)
    
    if (!phone) {
        errorData.errors = { ...errorData.errors, phone: "Phone number is required" };
    } else if (!phone.startsWith('+260')) {
        errorData.errors = { ...errorData.errors, phone: "Phone must start with +260" };
    } else if (phone.length !== 13) {
        errorData.errors = { ...errorData.errors, phone: "Phone must be exactly 13 characters (including +260)" };
    } else if (!/^\+260\d{9}$/.test(phone)) {
        errorData.errors = { ...errorData.errors, phone: "Phone must contain 9 digits after +260" };
    }

    if (errorData.errors && Object.keys(errorData.errors).length > 0) {
        return errorData;
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "Not authenticated" };
    }

    // Role cannot be updated here (enforced by ProfileService.updateProfile)
    const result = await ProfileService.updateProfile(supabase, user.id, { name, phone });

    if (!result) {
        return { message: "Failed to update profile" };
    }

    revalidatePath('/profile');
    revalidatePath('/admin/profile');
    
    return { message: "Success" };
}
