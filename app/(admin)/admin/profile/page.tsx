'use client';

import { useAuth, useProfile } from '@/lib/components/auth_provider';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileForm from '@/lib/components/profile_form';

export default function AdminProfilePage() {
    const session = useAuth();
    const profile = useProfile();
    const router = useRouter();

    useEffect(() => {
        if (session && profile && profile.role !== 'admin') {
            router.replace('/');
        }
    }, [session, profile, router]);

    if (!session || !profile) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (profile.role !== 'admin') return null;

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">My Administrator Profile</h1>
                <p className="text-gray-600">Update your administrator contact details</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 h-fit">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Profile Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Full Name</label>
                            <p className="text-gray-900 font-medium">{profile.name || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Email Address</label>
                            <p className="text-gray-900 font-medium">{profile.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                            <p className="text-gray-900 font-medium">{profile.phone || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Role</label>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 uppercase">
                                {profile.role}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Update Details</h3>
                    <ProfileForm profile={profile} />
                </div>
            </div>
            
            <div className="flex justify-start">
                <Link href="/admin" className="text-primary-600 hover:text-primary-700 font-medium">
                    &larr; Back to Admin Dashboard
                </Link>
            </div>
        </div>
    );
}
