'use client';

import { useAuth, useProfile } from "./auth_provider";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import logout from "@/lib/actions/logout";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  pathname: string;
  setIsOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const NavLink = ({ href, pathname, setIsOpen, children }: NavLinkProps) => {
  const isActive = pathname === href;
  return (
    <Link 
      href={href} 
      onClick={() => setIsOpen(false)}
      className={`px-4 py-2 rounded-md transition cursor-pointer whitespace-nowrap w-full text-center ${
        isActive 
          ? "bg-primary-600 text-white" 
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </Link>
  );
};

export default function Header() {
  const session = useAuth();
  const profile = useProfile();
  const pathname = usePathname();
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

  const role = profile?.role;

  return (
    <header className="p-4 bg-white shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <Link href="/" className="inline-flex items-center gap-1 whitespace-nowrap">
            <img src="/logo.png" alt="PremiumFresh Logo" className="h-8" />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-br from-primary-600 to-secondary-600">PremiumFresh</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {session && (
            <>
              {role === "customer" && (
                <>
                  <Link href="/" className={`font-medium ${pathname === '/' ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>Dashboard</Link>
                  <Link href="/orders" className={`font-medium ${pathname === '/orders' ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>My Orders</Link>
                  <Link href="/profile" className={`font-medium ${pathname === '/profile' ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>Profile</Link>
                </>
              )}
              {role === "driver" && (
                <>
                  <Link href="/" className={`font-medium ${pathname === '/' ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>Dashboard</Link>
                  <Link href="/available" className={`font-medium ${pathname === '/available' ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>Available</Link>
                  <Link href="/history" className={`font-medium ${pathname === '/history' ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>History</Link>
                </>
              )}
              {role === "admin" && (
                <Link href="/admin" className="font-medium text-gray-600 hover:text-primary-600">Admin Panel</Link>
              )}
            </>
          )}
        </nav>

        <div className="relative flex items-center gap-4" ref={menuRef}>
          {session ? (
            <button 
              onClick={async () => {
                const result = await logout();
                if (result.success) {
                  window.location.href = '/login';
                } else {
                  alert("Logout failed: " + result.error);
                }
              }} 
              className="hidden md:block px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition font-medium"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="hidden md:block px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition font-medium">
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden border border-gray-200 rounded-md p-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile Menu */}
          <nav id="mobile-nav" className={`${isOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'} absolute top-12 right-0 flex flex-col items-center justify-center gap-2 bg-white shadow-xl rounded-lg p-4 transition-all w-48 md:hidden border border-gray-100`}>
            {session ? (
              <>
                <div className="w-full border-b border-gray-100 pb-2 mb-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">Menu</p>
                </div>
                {role === "customer" && (
                  <>
                    <NavLink href="/" pathname={pathname} setIsOpen={setIsOpen}>Dashboard</NavLink>
                    <NavLink href="/orders" pathname={pathname} setIsOpen={setIsOpen}>My Orders</NavLink>
                    <NavLink href="/profile" pathname={pathname} setIsOpen={setIsOpen}>Profile</NavLink>
                  </>
                )}
                {role === "driver" && (
                  <>
                    <NavLink href="/" pathname={pathname} setIsOpen={setIsOpen}>Dashboard</NavLink>
                    <NavLink href="/available" pathname={pathname} setIsOpen={setIsOpen}>Available</NavLink>
                    <NavLink href="/history" pathname={pathname} setIsOpen={setIsOpen}>History</NavLink>
                  </>
                )}
                {role === "admin" && (
                  <NavLink href="/admin" pathname={pathname} setIsOpen={setIsOpen}>Admin Panel</NavLink>
                )}
                
                <div className="w-full border-t border-gray-100 pt-2 mt-2">
                  <button 
                    onClick={async () => {
                      const result = await logout();
                      if (result.success) {
                        window.location.href = '/login';
                      }
                    }} 
                    className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-700 transition cursor-pointer whitespace-nowrap w-full text-center"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login" className="px-4 py-2 rounded-md bg-primary-500 text-white hover:bg-primary-700 transition cursor-pointer whitespace-nowrap w-full text-center">Sign In</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}