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
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'available' | 'completed'>('profile');

    const userId = session?.user?.id;

    const fetchData = useCallback(async () => {
        if (!userId) return;
        
        setLoading(true);
        const [pending, active, completed] = await Promise.all([
            OrderService.getPendingOrders(supabase),
            OrderService.getActiveOrdersByDriver(supabase, userId),
            OrderService.getCompletedOrdersByDriver(supabase, userId)
        ]);
        setPendingOrders(pending);
        setActiveOrders(active);
        setCompletedOrders(completed);
        setLoading(false);

        // Smart tab selection
        if (active.length > 0) {
            setActiveTab('profile');
        } else if (pending.length > 0) {
            setActiveTab('available');
        } else {
            setActiveTab('profile');
        }
    }, [userId, supabase]);

    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [fetchData, userId]);

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

    const name = session?.user?.user_metadata.name;
    const email = session?.user?.email;

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 py-12">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Driver Dashboard</h1>
                    <p className="text-gray-600">Manage your deliveries efficiently</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-200 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`py-3 font-bold rounded-md transition ${activeTab === 'profile' 
                            ? 'bg-white text-primary-600 shadow' 
                            : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
                    >
                        Profile & Active ({activeOrders.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('available')}
                        className={`py-3 font-bold rounded-md transition ${activeTab === 'available' 
                            ? 'bg-white text-primary-600 shadow' 
                            : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
                    >
                        Available ({pendingOrders.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('completed')}
                        className={`py-3 font-bold rounded-md transition ${activeTab === 'completed' 
                            ? 'bg-white text-primary-600 shadow' 
                            : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
                    >
                        History ({completedOrders.length})
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {activeTab === 'profile' && (
                            <div>
                                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{name}</h2>
                                    <p className="text-gray-600">{email}</p>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">Active Deliveries</h3>
                                {activeOrders.length === 0 ? (
                                    <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
                                        <p>No active deliveries. Check the &quot;Available&quot; tab!</p>
                                    </div>
                                ) : (
                                    activeOrders.map(order => (
                                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary-500 mb-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">Delivery #{order.id.slice(0, 8)}</h3>
                                                    <p className="text-gray-600">{order.address}</p>
                                                </div>
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">IN PROGRESS</span>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => handleNavigate(order.lat, order.lon)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition">Navigate</button>
                                                <button onClick={() => handleComplete(order.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition">Mark Delivered</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'available' && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">Available for Pickup</h3>
                                {pendingOrders.length === 0 ? (
                                    <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
                                        <p>No new orders available right now. Check back later!</p>
                                    </div>
                                ) : (
                                    pendingOrders.map(order => (
                                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition mb-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm text-gray-500">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">PENDING</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{order.address}</h3>
                                            <button onClick={() => handleAcceptOrder(order.id)} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition">Accept Delivery</button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'completed' && (
                             <div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">Completed Deliveries</h3>
                                {completedOrders.length === 0 ? (
                                    <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
                                        <p>You haven&apos;t completed any deliveries yet.</p>
                                    </div>
                                ) : (
                                    completedOrders.map(order => (
                                        <div key={order.id} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-500 mb-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-bold text-gray-800">Order #{order.id.slice(0, 8)}</h4>
                                                    <p className="text-sm text-gray-600">{order.address}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">Completed on</p>
                                                    <p className="font-medium text-gray-700">{new Date(order.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}