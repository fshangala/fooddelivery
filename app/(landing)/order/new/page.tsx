'use client';

import OrderForm from "@/lib/components/order_form";
import { useAuth } from "@/lib/components/auth_provider";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function NewOrderPage() {
    const session = useAuth();

    if (!session) {
        redirect('/login');
    }

    if (session.user.user_metadata?.role !== 'customer') {
        redirect('/');
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Weekly Selection</h1>
                    <p className="text-gray-600 mt-2">Curate your fresh vegetable delivery for the coming week.</p>
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
                    <OrderForm />
                </div>
            </div>
            
            <div className="mt-8 text-center text-gray-500 text-sm">
                <p>© 2026 PremiumFresh. Quality vegetables delivered to your doorstep.</p>
            </div>
        </div>
    );
}
