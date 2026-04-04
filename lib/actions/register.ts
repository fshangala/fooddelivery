'use server';

import { UserRole } from "@/lib/definitions";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

/**
 * State object representing the validation and operation results of the registration form.
 */
type RegisterFormState = {
    /** Field-specific validation errors. */
    errors?: {
        /** Error message for the name field. */
        name?: string;
        /** Error message for the email field. */
        email?: string;
        /** Error message for the password field. */
        password?: string;
        /** Error message for the confirm password field. */
        confirmPassword?: string;
        /** Error message for the role field. */
        role?: string;
    };
    /** A general status or error message. */
    message?: string;
    /** Whether the registration was successful. */
    success?: boolean;
};

/**
 * Server Action to register a new user with Supabase Auth.
 * 
 * Validates 'name', 'email', 'password', and 'confirmPassword'.
 * On success, signs up the user. A database trigger automatically creates 
 * a record in the 'profiles' table with the provided name and role.
 * 
 * @param formState - The current state of the registration form.
 * @param formData - The form data containing registration fields.
 * @returns A promise that resolves to the updated RegisterFormState on validation error or failure.
 *          Returns success message upon successful registration.
 */
export async function registerUser(formState: RegisterFormState | undefined, formData: FormData) {
    const errorData: RegisterFormState = {};

    const name = formData.get('name') as string;
    if (!name) {
        errorData.errors = { ...errorData.errors, name: "Name is required" };
    }

    const role = formData.get('role') as UserRole;
    if (!role || !['customer', 'driver'].includes(role)) {
        errorData.errors = { ...errorData.errors, role: "Invalid account type selected" };
    }

    const email = formData.get('email') as string;
    if (!email) {
        errorData.errors = { ...errorData.errors, email: "Email is required" };
    }

    const password = formData.get('password') as string;
    if (!password) {
        errorData.errors = { ...errorData.errors, password: "Password is required" };
    }

    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
        errorData.errors = { ...errorData.errors, confirmPassword: "Passwords do not match" };
    }

    if (errorData.errors && Object.keys(errorData.errors).length > 0) {
        return errorData;
    }

    const supabase = await createClient();
    const origin = (await headers()).get('origin');
    const { error } = await supabase.auth.signUp({
        email, 
        password, 
        options: { 
            data: { name, role },
            emailRedirectTo: `${origin}/login?email_comfirmation=success`,
        }, 
    });

    if (error) {
        errorData.message = error.message;
        errorData.success = false;
        return errorData;
    }

    return {
        success: true,
        message: "Successfully registered! Please check your email for a confirmation link."
    };
}
