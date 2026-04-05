'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Box, 
    FileText, 
    User, 
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import logout from "@/lib/actions/logout";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Packages", href: "/admin/packages", icon: Box },
    { name: "Static Pages", href: "/admin/pages", icon: FileText },
    { name: "My Profile", href: "/admin/profile", icon: User },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            window.location.href = '/login';
        } else {
            alert("Logout failed: " + result.error);
        }
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button 
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md text-gray-600"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Backdrop for mobile */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-100 transition-all duration-300 z-40
                    ${isCollapsed ? 'w-20' : 'w-64'} 
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 flex items-center justify-between">
                        {!isCollapsed && (
                            <Link href="/" className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-linear-to-br from-primary-600 to-secondary-600 rounded-lg" />
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-br from-primary-600 to-secondary-600">PremiumFresh</span>
                            </Link>
                        )}
                        <button 
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                        >
                            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            
                            return (
                                <Link 
                                    key={item.href} 
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all group relative
                                        ${isActive 
                                            ? 'bg-primary-50 text-primary-600 font-semibold' 
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <Icon size={20} />
                                    {!isCollapsed && <span>{item.name}</span>}
                                    
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                            {item.name}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100">
                        <button 
                            onClick={handleLogout}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-all group relative
                                ${isCollapsed ? 'justify-center' : ''}
                            `}
                        >
                            <LogOut size={20} />
                            {!isCollapsed && <span>Logout</span>}
                            
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                    Logout
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
