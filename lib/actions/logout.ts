import { redirect } from "next/navigation";
import supabase from "../supabase/client";

export default async function logout() {
    const { error } = await supabase.auth.signOut({ scope: 'local' });

    if (error) {
        console.error("Logout error:", error);
    } else {
        redirect('/login');
    }
}