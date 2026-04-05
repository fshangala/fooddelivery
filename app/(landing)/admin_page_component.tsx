'use client';

import Link from 'next/link';
import { useProfile } from '@/lib/components/auth_provider';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Box, 
    FileText, 
    ArrowRight 
} from 'lucide-react';

const cards = [
    {
        title: "Order Management",
        description: "Monitor all vegetable delivery orders, track status, and manage assignments.",
        href: "/admin/orders",
        icon: ShoppingBag,
        color: "bg-primary-50 text-primary-600",
        delay: 0.1
    },
    {
        title: "Package Management",
        description: "Configure vegetable packages, update contents, and manage subscription pricing.",
        href: "/admin/packages",
        icon: Box,
        color: "bg-green-50 text-green-600",
        delay: 0.2
    },
    {
        title: "Static Pages",
        description: "Manage Privacy Policy, Terms of Use, and other informational content.",
        href: "/admin/pages",
        icon: FileText,
        color: "bg-purple-50 text-purple-600",
        delay: 0.3
    }
];

export default function AdminPageComponent() {
    const profile = useProfile();

    return (
        <div className="space-y-8">
            <header>
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-900"
                >
                    Admin Dashboard
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 mt-1"
                >
                    Welcome back, <span className="text-gray-900 font-semibold">{profile?.name || 'Administrator'}</span>
                </motion.p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={card.href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: card.delay }}
                        >
                            <Link 
                                href={card.href}
                                className="group block bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all h-full"
                            >
                                <div className={`h-12 w-12 ${card.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    {card.description}
                                </p>
                                <div className="flex items-center text-sm font-semibold text-primary-600 group-hover:translate-x-1 transition-transform">
                                    Manage now
                                    <ArrowRight size={16} className="ml-2" />
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-primary-50 p-6 rounded-2xl border border-primary-100"
            >
                <h3 className="text-primary-800 font-bold mb-1 flex items-center gap-2">
                    <LayoutDashboard size={18} />
                    Admin Quick Tip
                </h3>
                <p className="text-primary-700 text-sm">
                    You can switch between pages using the persistent sidebar on the left. All changes are saved in real-time to the database.
                </p>
            </motion.div>
        </div>
    );
}
