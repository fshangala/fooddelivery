'use client';

import { useAuth } from '@/lib/components/auth_provider';
import GuestPageComponent from './guest_page_component';
import CustomerPageComponent from './customer_page_component';
import DriverPageComponent from './driver_page_component';
import AdminPageComponent from './admin_page_component';

export default function LandingPageComponent() {
    const session = useAuth();
    
    switch (session?.user.user_metadata?.role) {
        case "admin":
            return <AdminPageComponent />;

        case "customer":
            return <CustomerPageComponent />;
        
        case "driver":
            return <DriverPageComponent />;
    
        default:
            return <GuestPageComponent />;
    }
}