import supabase from "@/lib/supabase/client";
import { redirect } from "next/navigation";

type RegisterFormState = {
    errors?: {
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    };
    message?: string;
};

export async function registerUser(formState: RegisterFormState | undefined, formData: FormData) {
    const errorData: RegisterFormState = {};

    const name = formData.get('name') as string;
    if (!name) {
        errorData.errors = { ...errorData.errors, name: "Name is required" };
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

    if (errorData.errors || errorData.message) {
        return errorData;
    }

    const { data, error } = await supabase.auth.signUp({email, password, options: { data: { name, }, }, });

    if (error) {
        errorData.message = error.message;
        return errorData;
    }

    redirect('/');
}