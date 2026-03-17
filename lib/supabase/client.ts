import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "";

if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase URL or Key is missing. Check your environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;