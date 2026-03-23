'use client';

import { useAuth } from '@/lib/components/auth_provider';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const session = useAuth();
    const router = useRouter();
    const userProfile = session?.user;
    const role = userProfile?.user_metadata?.role;

    useEffect(() => {
        if (session && !['customer', 'driver'].includes(role)) {
            router.replace('/');
        }
    }, [session, role, router]);

    if (!session) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!['customer', 'driver'].includes(role)) return null;

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-600">Manage your account information</p>
                </header>

                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <p className="mt-1 text-lg text-gray-900">{userProfile?.user_metadata?.name || 'Not provided'}</p>
                            </div>
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <p className="mt-1 text-lg text-gray-900">{userProfile?.email}</p>
                            </div>
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                                <p className="mt-1">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                        {userProfile?.user_metadata?.role || 'customer'}
                                    </span>
                                </p>
                            </div>
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                                <p className="mt-1 text-gray-900">{userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                    <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
                        &larr; Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

