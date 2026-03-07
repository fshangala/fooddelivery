'use client';

export default function DriverPageComponent() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-secondary-50 to-primary-50 px-4">
            <div className="max-w-2xl w-full text-center">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-secondary-600 to-primary-600 mb-4">Delivery Dashboard</h1>
                <p className="text-xl text-gray-700 mb-8">Manage your deliveries and earn rewards</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <button className="px-6 py-4 bg-linear-to-r from-secondary-500 to-secondary-600 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105">
                        Available Deliveries
                    </button>
                    <button className="px-6 py-4 bg-linear-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105">
                        Earnings
                    </button>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 text-left">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Deliveries</h2>
                    <p className="text-gray-600">No active deliveries. Check available deliveries to start accepting orders!</p>
                </div>
            </div>
        </div>
    );
}