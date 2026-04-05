import PageManagement from "@/lib/components/page_management";
import { PageService } from "@/lib/services/page_service";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPagesPage() {
    const supabase = await createClient();
    const pages = await PageService.getAll(supabase);

    return <PageManagement pages={pages} />;
}
