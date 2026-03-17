import { redirect } from "next/navigation";
import supabase from "../supabase/client";

/**
 * Server Action to sign out the current user.
 * 
 * Clears the user's session locally and redirects to the login page on success.
 * Logs any errors encountered during the sign-out process.
 */
export default async function logout() {
    const { error } = await supabase.auth.signOut({ scope: 'local' });

    if (error) {
        console.error("Logout error:", error);
    } else {
        redirect('/login');
    }
}
