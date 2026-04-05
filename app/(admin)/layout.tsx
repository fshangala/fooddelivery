import AdminSidebar from "@/lib/components/admin_sidebar";
import { AdminService } from "@/lib/services/admin_service";
import { ProfileService } from "@/lib/services/profile_service";
import { createClient } from "@/lib/supabase/server";
import AdminSetupForm from "@/lib/components/admin_setup_form";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const adminExists = await AdminService.exists(supabase);

  if (!adminExists) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
          <AdminSetupForm />
        </div>
      </div>
    );
  }

  // Admin exists, check current user status
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await ProfileService.getProfile(supabase, user.id);

  if (profile?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 transition-all duration-300 lg:pl-20 xl:pl-64">
        <main className="p-6 lg:p-10 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
