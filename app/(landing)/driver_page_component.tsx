'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { OrderService } from '@/lib/services/order_service';
import { useAuth, useProfile } from '@/lib/components/auth_provider';
import { Order } from '@/lib/definitions';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function DriverPageComponent() {
    const session = useAuth();
    const profile = useProfile();
    const supabase = useMemo(() => createClient(), []);
    
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const userId = session?.user?.id;

    const fetchData = useCallback(async () => {
        if (!userId) return;
        
        const [pending, active] = await Promise.all([
            OrderService.getPendingOrders(supabase),
            OrderService.getActiveOrdersByDriver(supabase, userId)
        ]);
        setPendingOrdersCount(pending.length);
        setActiveOrders(active);
        setLoading(false);
    }, [userId, supabase]);

    useEffect(() => {
        if (userId) {
            Promise.resolve().then(() => fetchData());
        }
    }, [fetchData, userId]);

    const handleNavigate = (lat: number, lon: number) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
        window.open(url, '_blank');
    };

    const handleComplete = async (orderId: string) => {
        setLoading(true);
        const success = await OrderService.updateStatus(supabase, orderId, 'DELIVERED');
        if (success) {
            fetchData();
        } else {
            alert('Failed to complete order.');
        }
    };

    const name = profile?.name;
    const email = profile?.email;

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 py-12">
            <div className="max-w-4xl w-full">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Driver Dashboard</h1>
                        <p className="text-gray-600 font-medium">Welcome back, {name}</p>
                    </div>
                    <div className="text-right">
                        <Link href="/available" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-200 relative">
                            Available Orders
                            {pendingOrdersCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white animate-bounce">
                                    {pendingOrdersCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
                
                <main className="space-y-8">
                    {/* Stats/Profile Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold uppercase">
                                {name?.charAt(0) || 'D'}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{name}</h2>
                                <p className="text-sm text-gray-500">{email}</p>
                            </div>
                        </div>
                        <Link href="/history" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center group hover:border-primary-200 transition-all">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Deliveries</span>
                            <span className="text-3xl font-black text-gray-900 group-hover:text-primary-600 transition-colors">View History</span>
                        </Link>
                    </div>

                    {/* Active Deliveries */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                            Active Deliveries
                        </h3>
                        
                        {loading ? (
                            <div className="flex justify-center py-12 bg-white rounded-2xl border border-gray-100">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                            </div>
                        ) : activeOrders.length === 0 ? (
                            <div className="bg-white p-12 rounded-2xl shadow-sm text-center text-gray-500 border border-dashed border-gray-300">
                                <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-3xl">🚚</div>
                                <p className="text-lg font-medium text-gray-900 mb-1">No active deliveries</p>
                                <p className="mb-6">Ready for a new task? Check the available orders queue.</p>
                                <Link href="/available" className="text-primary-600 font-bold hover:underline">Pick up an order &rarr;</Link>
                            </div>
                        ) : (
                            activeOrders.map(order => (
                                <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-primary-500 mb-4 border border-gray-100">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-bold text-gray-900">Delivery #{order.id.slice(0, 8)}</h3>
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-full uppercase tracking-tighter">IN PROGRESS</span>
                                            </div>
                                            <p className="text-gray-600 font-medium">{order.address}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Assigned At</p>
                                            <p className="text-sm font-bold text-gray-700">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => handleNavigate(order.lat, order.lon)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            Navigate
                                        </button>
                                        <button onClick={() => handleComplete(order.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold transition shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            Complete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}