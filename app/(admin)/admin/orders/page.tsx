import Modal from "@/lib/components/modal";
import NewOrderModal from "@/lib/components/new_order_modal";
import { faker } from "@faker-js/faker";

export default function AdminOrdersPage() {
    const orders = Array(10).fill(null).map((_, i) => ({
        id: i + 1,
        status: faker.helpers.arrayElement(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
        customer: {
            name: faker.person.fullName(),
            phone: faker.phone.number(),
            email: faker.internet.email(),
        },
        location: {
            lon: faker.location.longitude(),
            lat: faker.location.latitude(),
        },
        items: Array(faker.number.int({ min: 1, max: 5 })).fill(null).map(() => ({
            name: faker.commerce.productName(),
            quantity: faker.number.int({ min: 1, max: 5 }),
            price: faker.number.float({ min: 5, max: 50, fractionDigits: 2 }),
        })),
    }));

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <h1 className="text-2xl font-bold">Orders</h1>
                <NewOrderModal />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map(order => (
                    <div key={order.id} className="p-4 bg-white shadow rounded-md flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                order.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
                                order.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                                "bg-red-100 text-red-800"
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-700 mb-1"><strong>Customer:</strong> {order.customer.name}</p>
                        <p className="text-gray-700 mb-1"><strong>Phone:</strong> {order.customer.phone}</p>
                        <p className="text-gray-700 mb-1"><strong>Email:</strong> {order.customer.email}</p>
                        <p className="text-gray-700 mb-1"><strong>Location:</strong> {order.location.lat.toFixed(4)}, {order.location.lon.toFixed(4)}</p>
                        <div className="mt-2">
                            <h3 className="text-lg font-semibold">Items:</h3>
                            <ul className="list-disc list-inside">
                                {order.items.map((item, index) => (
                                    <li key={index} className="text-gray-700">{item.quantity} x {item.name} - ${item.price.toFixed(2)}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex items-end flex-2">
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${order.location.lat},${order.location.lon}&travelmode=driving&dir_action=navigate`} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">Navigate</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}