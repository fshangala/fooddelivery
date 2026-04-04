'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { OrderService } from '@/lib/services/order_service';
import { useAuth, useProfile } from '@/lib/components/auth_provider';
import { Order } from '@/lib/definitions';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AvailableOrdersPage() {
    const session = useAuth();
    const profile = useProfile();
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const userId = session?.user?.id;
    const role = profile?.role;

    useEffect(() => {
        if (session && profile && role !== 'driver') {
            router.replace('/');
        }
    }, [session, profile, role, router]);

    const fetchData = useCallback(async () => {
        if (!userId || role !== 'driver') return;
        setLoading(true);
        const pending = await OrderService.getPendingOrders(supabase);
        setPendingOrders(pending);
        setLoading(false);
    }, [userId, role, supabase]);

    useEffect(() => {
        if (userId && role === 'driver') {
            fetchData();
        }
    }, [fetchData, userId, role]);

    const handleAcceptOrder = async (orderId: string) => {
        if (!session?.user?.id) return;
        const success = await OrderService.assignDriver(supabase, orderId, session.user.id);
        if (success) {
            fetchData();
        } else {
            alert('Failed to accept order. It might have been taken by another driver.');
            fetchData();
        }
    };

    if (!session) {
        if (!loading) return <div className="p-8 text-center">Please log in to view available orders.</div>;
        return null;
    }

    if (role !== 'driver') return null;

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 py-12">
            <div className="max-w-4xl w-full">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Available Orders</h1>
                    <p className="text-gray-600">Pick up new deliveries</p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div>
                        {pendingOrders.length === 0 ? (
                            <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500 border border-gray-200">
                                <p>No new orders available right now. Check back later!</p>
                            </div>
                        ) : (
                            pendingOrders.map(order => (
                                <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition mb-4 border border-gray-100">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm text-gray-500">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">PENDING</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{order.address}</h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {order.vegetables.map((v, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded border border-gray-100">{v}</span>
                                        ))}
                                    </div>
                                    <button onClick={() => handleAcceptOrder(order.id)} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition">Accept Delivery</button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

