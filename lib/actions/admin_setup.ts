'use server';

import { createClient } from "../supabase/server";
import { AdminService } from "../services/admin_service";
import { redirect } from "next/navigation";

type AdminRegisterState = {
    errors?: {
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    };
    message?: string;
};

/**
 * Special Server Action to create the first admin user.
 * 
 * Only succeeds if no admin user currently exists in the system.
 */
export async function registerFirstAdmin(formState: AdminRegisterState | undefined, formData: FormData) {
    const errorData: AdminRegisterState = {};

    const name = formData.get('name') as string;
    if (!name) errorData.errors = { ...errorData.errors, name: "Name is required" };

    const email = formData.get('email') as string;
    if (!email) errorData.errors = { ...errorData.errors, email: "Email is required" };

    const password = formData.get('password') as string;
    if (!password) errorData.errors = { ...errorData.errors, password: "Password is required" };

    const confirmPassword = formData.get('confirmPassword') as string;
    if (password !== confirmPassword) {
        errorData.errors = { ...errorData.errors, confirmPassword: "Passwords do not match" };
    }

    if (errorData.errors && Object.keys(errorData.errors).length > 0) {
        return errorData;
    }

    const supabase = await createClient();

    // CRITICAL: Double-check if admin exists before allowing creation
    const adminExists = await AdminService.exists(supabase);
    if (adminExists) {
        return { message: "Setup complete. An admin already exists. No further admins can be created this way." };
    }

    // Attempt to sign up the first admin
    const { data, error } = await supabase.auth.signUp({
        email, 
        password, 
        options: { 
            data: { name, role: 'admin' }, 
        }, 
    });

    if (error) {
        return { message: error.message };
    }

    // On success, redirect to login so they can sign in as the new admin
    // Use hard redirect for state sync
    return { message: "Success" };
}
