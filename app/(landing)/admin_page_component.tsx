'use client';

import Link from 'next/link';
import { useAuth, useProfile } from '@/lib/components/auth_provider';

export default function AdminPageComponent() {
    const session = useAuth();
    const profile = useProfile();

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-lg text-gray-600">Welcome back, {profile?.name || 'Administrator'}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">System Dashboard</h2>
                        <p className="text-gray-600 mb-6">Overview of the entire system performance, driver activity, and general statistics.</p>
                        <Link href="/admin" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700">
                            Go to Dashboard
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h2>
                        <p className="text-gray-600 mb-6">Monitor all vegetable delivery orders, track status, and manage assignments.</p>
                        <Link href="/admin/orders" className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700">
                            Go to Orders
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Package Management</h2>
                        <p className="text-gray-600 mb-6">Configure vegetable packages, update contents, and manage subscription pricing.</p>
                        <Link href="/admin/packages" className="inline-flex items-center text-green-600 font-semibold hover:text-green-700">
                            Manage Packages
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>

                <div className="mt-12 bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="text-blue-800 font-bold mb-2">Admin Quick Tip</h3>
                    <p className="text-blue-700 text-sm">You can view the full driver delivery history and current system status directly from the Order Management section.</p>
                </div>
            </div>
        </div>
    );
}
