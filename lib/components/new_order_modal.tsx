'use client';

import { useState } from "react";
import OrderForm from "./order_form";
import { Package } from "../definitions/packages";

interface NewOrderModalProps {
    packages: Package[];
}

export default function NewOrderModal({ packages }: NewOrderModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors cursor-pointer" onClick={() => setIsOpen(true)}>New Subscription</button>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
                    <div className="bg-white rounded-md p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Create New Subscription</h2>
                            <button className="text-lg text-red-500 hover:text-red-700 cursor-pointer" onClick={() => setIsOpen(false)}>
                                X
                            </button>
                        </div>
                        <OrderForm packages={packages} />
                    </div>
                </div>
            )}
        </div>
    );
}