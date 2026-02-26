'use client';

import Link from 'next/link';

export default function AccountPageComponent() {
    // Sample user data
    const user = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Green Street, Fresh City, FC 12345',
        joinDate: 'January 2024',
        totalOrders: 12
    };

    // Sample pending orders
    const pendingOrders = [
        {
            id: 'ORD-001',
            date: 'Feb 26, 2024',
            items: 'Fresh Vegetables Bundle, Organic Lettuce',
            total: '$45.99',
            status: 'Processing',
            estimatedDelivery: 'Feb 28, 2024'
        },
        {
            id: 'ORD-002',
            date: 'Feb 25, 2024',
            items: 'Mixed Fruits Pack, Carrots',
            total: '$32.50',
            status: 'In Transit',
            estimatedDelivery: 'Feb 27, 2024'
        }
    ];

    // Sample completed orders
    const completedOrders = [
        {
            id: 'ORD-003',
            date: 'Feb 20, 2024',
            items: 'Tomatoes, Onions, Garlic',
            total: '$28.75',
            status: 'Delivered',
            deliveredDate: 'Feb 22, 2024'
        },
        {
            id: 'ORD-004',
            date: 'Feb 15, 2024',
            items: 'Fresh Vegetables Bundle',
            total: '$52.00',
            status: 'Delivered',
            deliveredDate: 'Feb 17, 2024'
        },
        {
            id: 'ORD-005',
            date: 'Feb 10, 2024',
            items: 'Apples, Bananas, Oranges',
            total: '$36.25',
            status: 'Delivered',
            deliveredDate: 'Feb 12, 2024'
        }
    ];

    return (
        <div>
            {/* Header Section with User Profile and Logout */}
            <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        {/* User Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                                👤
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{user.name}</h1>
                                <p className="text-white/80">{user.email}</p>
                            </div>
                        </div>
                        {/* Logout Button */}
                        <Link href="/login">
                            <button className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg cursor-pointer">
                                Logout
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* User Profile Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Profile Information</h2>
                    <div className="bg-white rounded-xl shadow-md border border-primary-100 p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {/* Profile Field 1 */}
                            <div className="border-l-4 border-primary-600 pl-6">
                                <p className="text-sm text-gray-600 font-medium mb-2">Full Name</p>
                                <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                            </div>
                            {/* Profile Field 2 */}
                            <div className="border-l-4 border-secondary-600 pl-6">
                                <p className="text-sm text-gray-600 font-medium mb-2">Email Address</p>
                                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                            </div>
                            {/* Profile Field 3 */}
                            <div className="border-l-4 border-primary-600 pl-6">
                                <p className="text-sm text-gray-600 font-medium mb-2">Phone Number</p>
                                <p className="text-lg font-semibold text-gray-900">{user.phone}</p>
                            </div>
                            {/* Profile Field 4 */}
                            <div className="border-l-4 border-secondary-600 pl-6">
                                <p className="text-sm text-gray-600 font-medium mb-2">Member Since</p>
                                <p className="text-lg font-semibold text-gray-900">{user.joinDate}</p>
                            </div>
                        </div>
                        {/* Address Section */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="border-l-4 border-primary-600 pl-6">
                                <p className="text-sm text-gray-600 font-medium mb-2">Delivery Address</p>
                                <p className="text-lg font-semibold text-gray-900">{user.address}</p>
                            </div>
                        </div>
                        {/* Stats */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 font-medium mb-1">Total Orders</p>
                                <p className="text-3xl font-bold text-primary-600">{user.totalOrders}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pending Orders Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Pending Orders</h2>
                    {pendingOrders.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {pendingOrders.map((order, idx) => (
                                <div key={idx} className="bg-white rounded-xl shadow-md border border-primary-100 hover:shadow-lg transition-shadow overflow-hidden">
                                    {/* Order Header */}
                                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 border-b border-primary-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">Order ID</p>
                                                <p className="text-2xl font-bold text-gray-900">{order.id}</p>
                                            </div>
                                            <div>
                                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full">
                                                    <span className="w-2 h-2 bg-yellow-500 rounded-full animated-pulse"></span>
                                                    <span className="text-sm font-semibold text-yellow-800">{order.status}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Order Details */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium mb-2">Order Date</p>
                                                <p className="text-lg font-semibold text-gray-900">{order.date}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium mb-2">Estimated Delivery</p>
                                                <p className="text-lg font-semibold text-gray-900">{order.estimatedDelivery}</p>
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-600 font-medium mb-2">Items</p>
                                            <p className="text-gray-900">{order.items}</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
                                            <p className="text-2xl font-bold text-primary-600">{order.total}</p>
                                            <button className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors cursor-pointer">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <p className="text-gray-600 text-lg">No pending orders at the moment.</p>
                        </div>
                    )}
                </section>

                {/* Completed Orders Section */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Order History</h2>
                    {completedOrders.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {completedOrders.map((order, idx) => (
                                <div key={idx} className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                                    {/* Order Header */}
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">Order ID</p>
                                                <p className="text-2xl font-bold text-gray-900">{order.id}</p>
                                            </div>
                                            <div>
                                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    <span className="text-sm font-semibold text-green-800">{order.status}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Order Details */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium mb-2">Order Date</p>
                                                <p className="text-lg font-semibold text-gray-900">{order.date}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium mb-2">Delivered On</p>
                                                <p className="text-lg font-semibold text-gray-900">{order.deliveredDate}</p>
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-600 font-medium mb-2">Items</p>
                                            <p className="text-gray-900">{order.items}</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
                                            <p className="text-2xl font-bold text-gray-900">{order.total}</p>
                                            <button className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                                Reorder
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <p className="text-gray-600 text-lg">No completed orders yet.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}