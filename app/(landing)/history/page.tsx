'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { OrderService } from '@/lib/services/order_service';
import { useAuth, useProfile } from '@/lib/components/auth_provider';
import { Order } from '@/lib/definitions';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DeliveryHistoryPage() {
    const session = useAuth();
    const profile = useProfile();
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const [history, setHistory] = useState<Order[]>([]);
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
        const completed = await OrderService.getCompletedOrdersByDriver(supabase, userId);
        setHistory(completed);
        setLoading(false);
    }, [userId, role, supabase]);

    useEffect(() => {
        if (userId && role === 'driver') {
            Promise.resolve().then(() => fetchData());
        }
    }, [fetchData, userId, role]);

    if (!session) {
        if (!loading) return <div className="p-8 text-center">Please log in to view delivery history.</div>;
        return null;
    }

    if (role !== 'driver') return null;

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 py-12">
            <div className="max-w-4xl w-full">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Delivery History</h1>
                    <p className="text-gray-600">Your completed vegetable deliveries</p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div>
                        {history.length === 0 ? (
                            <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500 border border-gray-200">
                                <p>You haven&apos;t completed any deliveries yet.</p>
                            </div>
                        ) : (
                            history.map(order => (
                                <div key={order.id} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-500 mb-4 border-t border-r border-b border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-gray-800">Order #{order.id.slice(0, 8)}</h4>
                                            <p className="text-sm text-gray-600">{order.address}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Delivered on</p>
                                            <p className="font-medium text-gray-700">{order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'N/A'}</p>       
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

