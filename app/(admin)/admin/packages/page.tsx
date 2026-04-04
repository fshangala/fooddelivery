import { createClient } from "@/lib/supabase/server";
import { PackageService } from "@/lib/services/package_service";
import { ProfileService } from "@/lib/services/profile_service";
import PackageManagement from "@/lib/components/package_management";
import { redirect } from "next/navigation";

export default async function PackagesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const profile = await ProfileService.getProfile(supabase, user.id);

    if (profile?.role !== 'admin') {
        redirect('/');
    }

    const packages = await PackageService.getAll(supabase);

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Package Configuration</h1>
                <p className="text-gray-600 mt-2">Manage subscription tiers and vegetable offerings.</p>
            </header>
            
            <PackageManagement initialPackages={packages} />
        </div>
    );
}
