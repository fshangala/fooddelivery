'use server';

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

/**
 * State object representing the validation and operation results of the login form.
 */
type LoginFormState = {
    /** Field-specific validation errors. */
    errors?: {
        /** Error message for the email field. */
        email?: string;
        /** Error message for the password field. */
        password?: string;
    };
    /** A general status or error message. */
    message?: string;
};

/**
 * Server Action to handle user login via email and password.
 * 
 * @param formState - The current state of the login form.
 * @param formData - The form data containing 'email' and 'password'.
 * @returns A promise that resolves to the updated LoginFormState on validation error or failure.
 *          Redirects to '/admin' for administrators or '/' for other users upon success.
 */
export async function loginUser(formState: LoginFormState, formData: FormData) {
    const errorData: LoginFormState = {};
    const email = formData.get('email') as string;
    if (!email) {
        errorData.errors = { ...errorData.errors, email: "Email is required" };
    }

    const password = formData.get('password') as string;
    if (!password) {
        errorData.errors = { ...errorData.errors, password: "Password is required" };
    }
    
    if (errorData.errors || errorData.message) {
        return errorData;
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        errorData.message = error.message;
        return errorData;
    }

    if (data.user.user_metadata?.role === 'admin') {
        redirect('/admin');
    }

    redirect('/');
}
