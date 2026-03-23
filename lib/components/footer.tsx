'use client';

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="PremiumFresh Logo" className="h-8 filter brightness-0 invert" />
              <span className="text-xl font-bold text-white">PremiumFresh</span>
            </Link>
            <p className="text-sm text-gray-400">
              PremiumFresh is a subscription-based information system for weekly vegetable deliveries, connecting Customers, Drivers, and Administrators through a unified platform.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Portal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/order/new" className="hover:text-primary-400 transition">Weekly Selection</Link></li>
              <li><Link href="/orders" className="hover:text-primary-400 transition">Order History</Link></li>
              <li><Link href="/profile" className="hover:text-primary-400 transition">Profile Settings</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Driver Dashboard</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/available" className="hover:text-primary-400 transition">Available Orders</Link></li>
              <li><Link href="/history" className="hover:text-primary-400 transition">Completed Deliveries</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Administration</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/admin" className="hover:text-primary-400 transition">Admin Area</Link></li>
              <li><Link href="/admin/orders" className="hover:text-primary-400 transition">Manage Orders</Link></li>
              <li><Link href="/admin/packages" className="hover:text-primary-400 transition">Manage Packages</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; 2026 PremiumFresh. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://www.flaticon.com/free-icons/courier" title="courier icons" className="hover:text-gray-100">
              Courier icons by mia elysia - Flaticon
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}