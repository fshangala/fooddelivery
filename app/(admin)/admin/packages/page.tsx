import { createClient } from "@/lib/supabase/server";
import { PackageService } from "@/lib/services/package_service";
import PackageForm from "@/lib/components/package_form";
import { redirect } from "next/navigation";

export default async function PackagesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== 'admin') {
        redirect('/login');
    }

    const packages = await PackageService.getAll(supabase);

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Manage Packages</h2>
                        <PackageForm />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4">Existing Packages</h2>
                        <div className="space-y-4">
                            {packages.length === 0 ? (
                                <p className="text-gray-500">No packages created yet.</p>
                            ) : (
                                packages.map((pkg) => (
                                    <div key={pkg.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    ${Number(pkg.price).toFixed(2)} • {pkg.is_active ? 'Active' : 'Inactive'}
                                                </p>
                                            </div>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {pkg.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-700 font-medium">Includes:</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {pkg.vegetables.map(v => (
                                                    <span key={v} className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                                        {v}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
