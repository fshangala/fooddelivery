'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { OrderService } from '@/lib/services/order_service';
import { useAuth } from '@/lib/components/auth_provider';
import { Order } from '@/lib/definitions';
import { createClient } from '@/lib/supabase/client';

export default function DriverPageComponent() {
    const session = useAuth();
    const supabase = useMemo(() => createClient(), []);
    const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
    const [myOrders, setMyOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'available' | 'active'>('active');

    const userId = session?.user?.id;

    const fetchData = useCallback(async () => {
        if (!userId) return;
        
        setLoading(true);
        const [pending, mine] = await Promise.all([
            OrderService.getPendingOrders(supabase),
            OrderService.getDriverOrders(supabase, userId)
        ]);
        setPendingOrders(pending);
        setMyOrders(mine);
        setLoading(false);

        // Update active tab based on fetched data
        if (mine.length > 0) {
            setActiveTab('active');
        } else if (pending.length > 0) {
            setActiveTab('available');
        }
    }, [userId, supabase]);

    useEffect(() => {
        if (userId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchData();
        }
    }, [fetchData, userId]);

    const handleAcceptOrder = async (orderId: string) => {
        if (!session?.user?.id) return;
        
        const success = await OrderService.assignDriver(supabase, orderId, session.user.id);
        if (success) {
            fetchData();
            setActiveTab('active');
        } else {
            alert('Failed to accept order. It might have been taken by another driver.');
            fetchData();
        }
    };

    const handleNavigate = (lat: number, lon: number) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
        window.open(url, '_blank');
    };

    const handleComplete = async (orderId: string) => {
        const success = await OrderService.updateStatus(supabase, orderId, 'DELIVERED');
        if (success) {
            fetchData();
        } else {
            alert('Failed to complete order.');
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-linear-to-br from-secondary-50 to-primary-50 px-4 py-12">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-secondary-600 to-primary-600 mb-2">Delivery Dashboard</h1>
                    <p className="text-gray-600">Manage your deliveries efficiently</p>
                </div>
                
                <div className="flex space-x-2 mb-6">
                    <button 
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 py-3 font-bold rounded-lg transition ${activeTab === 'active' 
                            ? 'bg-primary-600 text-white shadow-lg' 
                            : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Active Deliveries ({myOrders.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('available')}
                        className={`flex-1 py-3 font-bold rounded-lg transition ${activeTab === 'available' 
                            ? 'bg-secondary-600 text-white shadow-lg' 
                            : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Available ({pendingOrders.length})
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeTab === 'active' && (
                            <>
                                {myOrders.length === 0 ? (
                                    <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                                        <p>No active deliveries. Check the &quot;Available&quot; tab to pick up work!</p>
                                    </div>
                                ) : (
                                    myOrders.map(order => (
                                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-500">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">Delivery #{order.id.slice(0, 8)}</h3>
                                                    <p className="text-gray-600">{order.address}</p>
                                                    {order.delivery_instructions && (
                                                        <p className="text-sm text-yellow-700 bg-yellow-50 p-2 mt-2 rounded">Note: {order.delivery_instructions}</p>
                                                    )}
                                                </div>
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                                    IN PROGRESS
                                                </span>
                                            </div>
                                            
                                            <div className="mb-4">
                                                <p className="text-sm font-semibold text-gray-700 mb-1">Items:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {order.vegetables.map((veg, i) => (
                                                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{veg}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={() => handleNavigate(order.lat, order.lon)}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition flex items-center justify-center cursor-pointer"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    </svg>
                                                    Navigate
                                                </button>
                                                <button 
                                                    onClick={() => handleComplete(order.id)}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition cursor-pointer"
                                                >
                                                    Mark Delivered
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </>
                        )}

                        {activeTab === 'available' && (
                            <>
                                {pendingOrders.length === 0 ? (
                                    <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                                        <p>No new orders available right now. Check back later!</p>
                                    </div>
                                ) : (
                                    pendingOrders.map(order => (
                                        <div key={order.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm text-gray-500">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">PENDING</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{order.address}</h3>
                                            <div className="text-sm text-gray-600 mb-4">
                                                {order.vegetables.length} items: {order.vegetables.slice(0, 3).join(', ')}{order.vegetables.length > 3 ? '...' : ''}
                                            </div>
                                            <button 
                                                onClick={() => handleAcceptOrder(order.id)}
                                                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition cursor-pointer"
                                            >
                                                Accept Delivery
                                            </button>
                                        </div>
                                    ))
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}