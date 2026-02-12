'use client';

import { useAuth } from "./auth_provider";

export default function Header() {
  const session = useAuth();

  return (
    <header className="p-4 bg-white shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <a href="/" className="inline-flex items-center gap-1 whitespace-nowrap">
            <img src="/logo.png" alt="Food Delivery Logo" className="h-8" />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-br from-primary-600 to-secondary-600">FoodDelivery</span>
          </a>
        </div>
        <div>
          <nav className="flex items-center justify-center gap-2">
            {session ? (
              <a href="/account" className="px-4 py-2 rounded-md bg-primary-500 text-white hover:bg-primary-700 transition cursor-pointer">My Account</a>
            ) : (
              <a href="/login" className="px-4 py-2 rounded-md bg-primary-500 text-white hover:bg-primary-700 transition cursor-pointer">Sign In/ Sign Up</a>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}