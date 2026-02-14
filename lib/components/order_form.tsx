'use client';

export default function OrderForm() {
    return (
        <form action="" className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">Create Order</button>
            </div>
        </form>
    );
}