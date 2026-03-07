'use client';

import { useAuth } from "./auth_provider";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const session = useAuth();
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

  return (
    <header className="p-4 bg-white shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <Link href="/" className="inline-flex items-center gap-1 whitespace-nowrap">
            <img src="/logo.png" alt="Food Delivery Logo" className="h-8" />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-br from-primary-600 to-secondary-600">FoodDelivery</span>
          </Link>
        </div>
        <div className="relative" ref={menuRef}>
          <button className="border border-gray-200 rounded-md p-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <nav id="main-nav" className={`${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} absolute top-12 right-0 flex flex-col items-center justify-center gap-2 bg-white shadow-lg rounded-md p-2 transition-opacity`}>
            {session ? (
              <>
              {session.user.role === "admin" && (
              <Link href="/admin" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer whitespace-nowrap w-full text-center">Admin</Link>
              )}

              {session.user.role === "courier" && (
              <Link href="/courier" className="px-4 py-2 rounded-md bg-secondary-500 text-white hover:bg-secondary-700 transition cursor-pointer whitespace-nowrap w-full text-center">Courier Dashboard</Link>
              )}
              <Link href="/listings" className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer whitespace-nowrap w-full text-center">Listings</Link>
              </>
            ) : (
              <Link href="/login" className="px-4 py-2 rounded-md bg-primary-500 text-white hover:bg-primary-700 transition cursor-pointer whitespace-nowrap w-full text-center">Sign In/ Sign Up</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}