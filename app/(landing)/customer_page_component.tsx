'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { OrderService } from '@/lib/services/order_service';
import { useAuth } from '@/lib/components/auth_provider';
import { Order, OrderStatus } from '@/lib/definitions';
import { createClient } from '@/lib/supabase/client';

type Tab = 'profile' | 'orders';

export default function CustomerPageComponent() {
    const session = useAuth();
    const supabase = useMemo(() => createClient(), []);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('orders');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

    useEffect(() => {
        async function fetchOrders() {
            if (session?.user?.id) {
                setLoading(true);
                const customerOrders = await OrderService.getByCustomerId(supabase, session.user.id);
                setOrders(customerOrders);
            }
            setLoading(false);
        }
        fetchOrders();
    }, [session?.user?.id, supabase]);

    const filteredOrders = useMemo(() => {
        if (statusFilter === 'ALL') return orders;
        return orders.filter(order => order.status === statusFilter);
    }, [orders, statusFilter]);

    const userProfile = session?.user;

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {userProfile?.user_metadata?.name || 'Customer'}</p>
                    </div>
                    <Link href="/order/new" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition shadow-sm">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Create Order
                    </Link>
                </header>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'orders'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Your Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'profile'
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Profile Settings
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <main>
                    {activeTab === 'profile' && (
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
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <label htmlFor="statusFilter" className="text-sm text-gray-500 whitespace-nowrap">Filter by:</label>
                                    <select
                                        id="statusFilter"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
                                        className="block w-full sm:w-auto rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm"
                                    >
                                        <option value="ALL">All Orders</option>
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-20 bg-white rounded-lg border border-gray-200">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                                </div>
                            ) : filteredOrders.length > 0 ? (
                                <div className="grid gap-4">
                                    {filteredOrders.map((order) => (
                                        <div key={order.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:border-primary-200 transition-colors">
                                            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-sm font-mono text-gray-500">#{order.id.slice(0, 8)}</span>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="font-medium text-gray-900">{order.address}</p>
                                                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                                                </div>
                                                <div className="flex flex-wrap gap-2 h-fit sm:justify-end">
                                                    {order.vegetables.map((veg, i) => (
                                                        <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-100">
                                                            {veg}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            {order.delivery_instructions && (
                                                <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 italic border-l-4 border-gray-200">
                                                    &quot;{order.delivery_instructions}&quot;
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-lg border border-gray-200 px-4">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900">No orders found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {statusFilter === 'ALL' 
                                            ? "You haven't placed any orders yet." 
                                            : `No orders matching status "${statusFilter}".`}
                                    </p>
                                    {statusFilter === 'ALL' && (
                                        <div className="mt-6">
                                            <Link href="/order/new" className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition">
                                                Start Shopping
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
