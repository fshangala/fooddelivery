'use client';

import { useState } from "react";
import OrderForm from "./order_form";

export default function NewOrderModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors cursor-pointer" onClick={() => setIsOpen(true)}>New Order</button>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
                    <div className="bg-white rounded-md p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-semibold mb-4">New Order</h2>
                        <OrderForm />
                    </div>
                </div>
            )}
        </div>
    );
}