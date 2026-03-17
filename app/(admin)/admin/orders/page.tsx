import NewOrderModal from "@/lib/components/new_order_modal";
import { OrderService } from "@/lib/services/order_service";

export default async function AdminOrdersPage() {
    const orders = await OrderService.getAll();

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <h1 className="text-2xl font-bold">Orders</h1>
                <NewOrderModal />
            </div>
            {orders.length === 0 ? (
                <div className="p-8 bg-white shadow rounded-md text-center text-gray-500">
                    No orders found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.map(order => (
                        <div key={order.id} className="p-4 bg-white shadow rounded-md flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold truncate max-w-[150px]" title={order.id}>Order #{order.id.slice(0, 8)}</h2>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                    order.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                                    order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                                    "bg-red-100 text-red-800"
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-gray-700 mb-1 text-sm"><strong>Customer ID:</strong> {order.customer_id.slice(0, 8)}...</p>
                            <p className="text-gray-700 mb-1 text-sm"><strong>Address:</strong> {order.address}</p>
                            <p className="text-gray-700 mb-1 text-sm"><strong>Location:</strong> {order.lat?.toFixed(4)}, {order.lon?.toFixed(4)}</p>
                            <div className="mt-2 flex-grow">
                                <h3 className="text-sm font-semibold mb-1">Vegetables:</h3>
                                <div className="flex flex-wrap gap-1">
                                    {order.vegetables.map((veg, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                                            {veg}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-end mt-4">
                                <a href={`https://www.google.com/maps/dir/?api=1&destination=${order.lat},${order.lon}&travelmode=driving&dir_action=navigate`} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm w-full text-center">Navigate</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}