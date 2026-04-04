'use client';

import { useAuth, useProfile } from '@/lib/components/auth_provider';
import GuestPageComponent from './guest_page_component';
import CustomerPageComponent from './customer_page_component';
import DriverPageComponent from './driver_page_component';
import AdminPageComponent from './admin_page_component';

export default function LandingPageComponent() {
    const session = useAuth();
    const profile = useProfile();
    
    if (!session) return <GuestPageComponent />;

    switch (profile?.role) {
        case "admin":
            return <AdminPageComponent />;

        case "customer":
            return <CustomerPageComponent />;
        
        case "driver":
            return <DriverPageComponent />;
    
        default:
            return (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                </div>
            );
    }
}