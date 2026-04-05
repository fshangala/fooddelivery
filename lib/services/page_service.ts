import { SupabaseClient } from "@supabase/supabase-js";
import { StaticPage } from "../definitions/pages";

export class PageService {
    static async getBySlug(supabase: SupabaseClient, slug: string): Promise<StaticPage | null> {
        const { data, error } = await supabase
            .from('static_pages')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error(`Error fetching page ${slug}:`, error);
            return null;
        }

        return data as StaticPage;
    }

    static async getAll(supabase: SupabaseClient): Promise<StaticPage[]> {
        const { data, error } = await supabase
            .from('static_pages')
            .select('*')
            .order('title', { ascending: true });

        if (error) {
            console.error("Error fetching pages:", error);
            return [];
        }

        return data as StaticPage[];
    }

    static async upsert(supabase: SupabaseClient, page: Partial<StaticPage>): Promise<StaticPage | null> {
        const { data, error } = await supabase
            .from('static_pages')
            .upsert({ ...page, updated_at: new Date().toISOString() })
            .select()
            .single();

        if (error) {
            console.error(`Error upserting page ${page.slug}:`, error);
            return null;
        }

        return data as StaticPage;
    }
}
