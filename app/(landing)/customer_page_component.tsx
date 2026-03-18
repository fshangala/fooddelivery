'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { OrderService } from '@/lib/services/order_service';
import { useAuth } from '@/lib/components/auth_provider';
import { Order } from '@/lib/definitions';
import { createClient } from '@/lib/supabase/client';

export default function CustomerPageComponent() {
    const session = useAuth();
    const supabase = createClient();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            if (session?.user?.id) {
                const customerOrders = await OrderService.getByCustomerId(supabase, session.user.id);
                setOrders(customerOrders);
            }
            setLoading(false);
        }
        fetchOrders();
    }, [session?.user?.id, supabase]);

    const scrollToOrders = () => {
        const ordersSection = document.getElementById('recent-orders');
        if (ordersSection) {
            ordersSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-primary-50 to-secondary-50 px-4 py-12">
            <div className="max-w-2xl w-full text-center">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-secondary-600 mb-4">Welcome Back!</h1>
                <p className="text-xl text-gray-700 mb-8">Fresh vegetables delivered right to your doorstep</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <Link href="/order/new" className="px-6 py-4 bg-linear-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Create New Order
                    </Link>
                    <button 
                        onClick={scrollToOrders}
                        className="px-6 py-4 bg-linear-to-r from-secondary-500 to-secondary-600 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105 cursor-pointer flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                        View Orders
                    </button>
                </div>

                <div id="recent-orders" className="bg-white shadow-md rounded-lg p-6 text-left">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Recent Orders</h2>
                    
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-900">{order.address}</p>
                                            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {order.vegetables.map((veg, i) => (
                                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                {veg}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No orders yet. Start browsing fresh produce to place your first order!</p>
                    )}
                </div>
            </div>
        </div>
    );
}