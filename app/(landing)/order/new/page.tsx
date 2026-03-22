'use client';

import OrderForm from "@/lib/components/order_form";
import { useAuth } from "@/lib/components/auth_provider";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { PackageService } from "@/lib/services/package_service";
import { Package } from "@/lib/definitions/packages";

export default function NewOrderPage() {
    const session = useAuth();
    const supabase = useMemo(() => createClient(), []);
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPackages() {
            setLoading(true);
            const activePackages = await PackageService.getActive(supabase);
            setPackages(activePackages);
            setLoading(false);
        }
        fetchPackages();
    }, [supabase]);

    if (!session) {
        redirect('/login');
    }

    if (session.user.user_metadata?.role !== 'customer') {
        redirect('/');
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Choose Your Subscription</h1>
                    <p className="text-gray-600 mt-2">Select a weekly vegetable package to get started.</p>
                </div>
                <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back
                </Link>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8 md:p-12">
                    {loading ? (
                         <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <OrderForm packages={packages} />
                    )}
                </div>
            </div>
            
            <div className="mt-8 text-center text-gray-500 text-sm">
                <p>© 2026 PremiumFresh. Quality vegetables delivered to your doorstep.</p>
            </div>
        </div>
    );
}
