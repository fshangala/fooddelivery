import MarkdownRenderer from "@/lib/components/markdown_renderer";
import { PageService } from "@/lib/services/page_service";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function PrivacyPolicyPage() {
    const supabase = await createClient();
    const page = await PageService.getBySlug(supabase, 'privacy-policy');

    if (!page) {
        notFound();
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-12">
            <header className="mb-12 text-center">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{page.title}</h1>
                <p className="text-gray-500 italic">Last updated: {new Date(page.updated_at).toLocaleDateString()}</p>
                <div className="mt-8 h-1 w-20 bg-linear-to-r from-primary-600 to-secondary-600 mx-auto rounded-full" />
            </header>

            <MarkdownRenderer content={page.content} />
        </div>
    );
}
