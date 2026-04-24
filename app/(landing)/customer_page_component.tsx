'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { OrderService } from '@/lib/services/order_service';
import { SubscriptionService, Subscription } from '@/lib/services/subscription_service';
import { useAuth, useProfile } from '@/lib/components/auth_provider';
import { Order } from '@/lib/definitions';
import { createClient } from '@/lib/supabase/client';
import { Package } from '@/lib/definitions/packages';

type SubscriptionWithPackage = Subscription & { packages: Package };

export default function CustomerPageComponent() {
    const session = useAuth();
    const profile = useProfile();
    const supabase = useMemo(() => createClient(), []);
    const [orders, setOrders] = useState<Order[]>([]);
    const [subscription, setSubscription] = useState<SubscriptionWithPackage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (session?.user?.id) {
                setLoading(true);
                const [customerOrders, activeSub] = await Promise.all([
                    OrderService.getByCustomerId(supabase, session.user.id),
                    SubscriptionService.getActiveByUserId(supabase, session.user.id)
                ]);
                setOrders(customerOrders.slice(0, 3)); // Only show 3 most recent
                setSubscription(activeSub as SubscriptionWithPackage);
            }
            setLoading(false);
        }
        fetchData();
    }, [session?.user?.id, supabase]);

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {profile?.name || 'Customer'}</p>
                    </div>
                    <Link href="/order/new" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition shadow-sm">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Create Order
                    </Link>
                </header>

                <main className="space-y-8">
                    {/* Active Subscription Banner */}
                    {subscription ? (
                        <div className="bg-white p-8 rounded-2xl border border-primary-200 shadow-sm bg-gradient-to-r from-primary-50 to-white overflow-hidden relative">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-1">Your Active Plan</h3>
                                        <p className="text-3xl font-extrabold text-gray-900">{subscription.packages?.name} Package</p>
                                    </div>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200 shadow-xs">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                        Active
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-3 font-medium">Valid from <span className="text-gray-900">{new Date(subscription.start_date).toLocaleDateString()}</span> to <span className="text-gray-900">{new Date(subscription.end_date).toLocaleDateString()}</span></p>
                                        <div className="flex flex-wrap gap-2">
                                            {subscription.packages?.vegetables?.map((veg: string) => (
                                                <span key={veg} className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 shadow-xs">
                                                    {veg}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                         <Link href="/orders" className="text-sm font-bold text-primary-600 hover:text-primary-700 inline-flex items-center group transition">
                                            Manage your deliveries
                                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center">
                             <h3 className="text-xl font-bold text-gray-900 mb-2">No active subscription</h3>
                             <p className="text-gray-500 mb-6">Subscribe to start receiving your weekly fresh vegetables.</p>
                             <Link href="/order/new" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-200">
                                Choose a Plan
                             </Link>
                        </div>
                    )}

                    {/* Recent Orders */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Recent Deliveries</h3>
                            <Link href="/orders" className="text-sm font-semibold text-gray-500 hover:text-primary-600 transition">View All Orders</Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-10 bg-white rounded-xl border border-gray-100">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="grid gap-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-primary-200 transition-all hover:shadow-md">
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`w-2 h-2 rounded-full ${
                                                        order.status === 'PENDING' ? 'bg-yellow-400' :
                                                        order.status === 'IN_PROGRESS' ? 'bg-blue-400' :
                                                        order.status === 'DELIVERED' ? 'bg-green-400' :
                                                        'bg-red-400'
                                                    }`}></span>
                                                    <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">{order.status}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 truncate max-w-[200px] sm:max-w-md">{order.address}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-mono text-gray-400">#{order.id.slice(0, 8)}</p>
                                                <p className="text-xs text-gray-500">{new Date(order.created_at || 0).toLocaleDateString()}</p>      

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500 italic">
                                Your recent orders will appear here.
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
