import { redirect } from "next/navigation";
import supabase from "../supabase/client";

type LoginFormState = {
    errors?: {
    email?: string;
    password?: string;
    };
    message?: string;
};

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