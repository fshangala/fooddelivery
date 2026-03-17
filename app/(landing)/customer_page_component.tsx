'use client';

import Link from 'next/link';

export default function CustomerPageComponent() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-primary-50 to-secondary-50 px-4">
            <div className="max-w-2xl w-full text-center">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-secondary-600 mb-4">Welcome Back!</h1>
                <p className="text-xl text-gray-700 mb-8">Fresh vegetables delivered right to your doorstep</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <Link href="/order/new" className="px-6 py-4 bg-linear-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105 text-center">
                        Create New Order
                    </Link>
                    <button className="px-6 py-4 bg-linear-to-r from-secondary-500 to-secondary-600 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105">
                        View Orders
                    </button>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 text-left">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Recent Orders</h2>
                    <p className="text-gray-600">No orders yet. Start browsing fresh produce to place your first order!</p>
                </div>
            </div>
        </div>
    );
}