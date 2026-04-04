'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import logout from "@/lib/actions/logout";

export default function AdminHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            window.location.href = '/login';
        } else {
            alert("Logout failed: " + result.error);
        }
    };

    return (
    <header className="p-4 bg-white shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <Link href="/" className="inline-flex items-center gap-1 whitespace-nowrap">
            <Image src="/logo.png" alt="PremiumFresh Logo" width={32} height={32} className="h-8 w-auto" />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-br from-primary-600 to-secondary-600">PremiumFresh</span>
          </Link>
        </div>
        <div className="relative" ref={menuRef}>
          <button className="border border-gray-200 rounded-md p-2 cursor-pointer flex items-center gap-2 hover:bg-gray-50 transition" onClick={() => setIsOpen(!isOpen)}>
            <span className="text-sm font-medium text-gray-700">Admin Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <nav className={`${isOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'} absolute top-12 right-0 flex flex-col items-center justify-center gap-1 bg-white shadow-xl border border-gray-100 rounded-md p-2 transition-all z-50 min-w-40`}>
              <Link href="/admin" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition cursor-pointer whitespace-nowrap w-full text-left text-sm font-medium">Dashboard</Link>
              <Link href="/admin/orders" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition cursor-pointer whitespace-nowrap w-full text-left text-sm font-medium">Orders</Link>
              <Link href="/admin/packages" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition cursor-pointer whitespace-nowrap w-full text-left text-sm font-medium">Packages</Link>
              <Link href="/admin/profile" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition cursor-pointer whitespace-nowrap w-full text-left text-sm font-medium">My Profile</Link>
              <div className="h-px bg-gray-100 w-full my-1"></div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-md hover:bg-red-50 text-red-600 transition cursor-pointer whitespace-nowrap w-full text-left text-sm font-medium"
              >
                Logout
              </button>
          </nav>
        </div>
      </div>
    </header>
    );
}