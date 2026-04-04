import AdminHeader from "@/lib/components/admin_header";
import Footer from "@/lib/components/footer";
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
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main className="grow max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}