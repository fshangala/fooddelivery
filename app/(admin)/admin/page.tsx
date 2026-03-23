import { createClient } from "@/lib/supabase/server";
import { OrderService } from "@/lib/services/order_service";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();
  
  // Fetch statistics
  const [allOrders, pendingOrders] = await Promise.all([
    OrderService.getAll(supabase),
    OrderService.getPendingOrders(supabase)
  ]);

  // For a real app, we'd have more robust ways to count these, but using current services:
  const activeOrders = allOrders.filter(o => o.status === 'IN_PROGRESS').length;
  const completedOrders = allOrders.filter(o => o.status === 'DELIVERED').length;
  
  // Get active subscriptions count
  const { count: activeSubs } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ACTIVE');

  const stats = [
    { name: 'Total Orders', value: allOrders.length, icon: '📋', color: 'bg-blue-500' },
    { name: 'Pending Deliveries', value: pendingOrders.length, icon: '⏳', color: 'bg-yellow-500' },
    { name: 'Active Subscriptions', value: activeSubs || 0, icon: '🌿', color: 'bg-green-500' },
    { name: 'Orders in Progress', value: activeOrders, icon: '🚚', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to PremiumFresh Admin</h1>
          <p className="text-gray-600 text-lg mb-6">
            Monitor your vegetable delivery service operations, manage subscriptions, and track orders in real-time.
          </p>
          <div className="flex gap-4">
            <Link href="/admin/orders" className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm">
              Manage Orders
            </Link>
            <Link href="/admin/packages" className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition">
              Configure Packages
            </Link>
          </div>
        </div>
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 translate-y-12 -translate-x-12 w-48 h-48 bg-secondary-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-lg flex items-center justify-center text-2xl shadow-inner`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <Link href="/admin/orders" className="text-primary-600 text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="p-0">
            {allOrders.length > 0 ? (
              <ul className="divide-y divide-gray-50">
                {allOrders.slice(0, 5).map((order) => (
                  <li key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 truncate max-w-xs">{order.address}</span>
                        <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                            {order.status}
                        </span>
                        <span className="text-sm font-mono text-gray-400">#{order.id.slice(0, 6)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-12 text-center text-gray-500 italic">
                No recent orders found.
              </div>
            )}
          </div>
        </div>

        {/* System Status / Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Database
                </span>
                <span className="text-xs font-bold text-green-600 uppercase">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Authentication
                </span>
                <span className="text-xs font-bold text-green-600 uppercase">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Order Queue
                </span>
                <span className="text-xs font-bold text-green-600 uppercase">Processing</span>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-secondary-600 to-primary-600 p-6 rounded-xl shadow-lg text-white">
            <h3 className="text-lg font-bold mb-2">Admin Notice</h3>
            <p className="text-white/80 text-sm mb-4">
              Remember to update next week's vegetable offerings by Friday at midnight to ensure accurate customer selections.
            </p>
            <Link href="/admin/packages" className="block w-full py-2 bg-white/20 hover:bg-white/30 transition text-center rounded-lg text-sm font-bold backdrop-blur-sm border border-white/30">
              Go to Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}