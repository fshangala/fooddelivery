'use client';

import { useAuth, useProfile } from '@/lib/components/auth_provider';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileForm from '@/lib/components/profile_form';

export default function ProfileEditPage() {
    const session = useAuth();
    const profile = useProfile();
    const router = useRouter();

    useEffect(() => {
        if (session && profile && !['customer', 'driver'].includes(profile.role)) {
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

    if (!['customer', 'driver'].includes(profile.role)) return null;

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                    <p className="text-gray-600">Update your personal details</p>
                </header>

                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                    <ProfileForm profile={profile} />
                </div>
                
                <div className="mt-8 flex justify-end">
                    <Link href="/profile" className="text-gray-600 hover:text-gray-800 font-medium">
                        Cancel and return to Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}
