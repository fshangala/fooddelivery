'use client';

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createOrder } from "@/lib/actions/order";
import { AVAILABLE_VEGETABLES } from "@/lib/definitions/order";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors
                ${pending ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'}`}
        >
            {pending ? (
                <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Order...
                </span>
            ) : "Confirm Selection & Order"}
        </button>
    );
}

export default function OrderForm() {
    const [state, action] = useActionState(createOrder, undefined);
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const Map = useMemo(() => dynamic(() => import('@/lib/components/location_picker'), {
        loading: () => <p>A map is loading...</p>,
        ssr: false
    }), []);

    const handleLocationChange = (lat: number, lng: number, addr: string) => {
        setLatitude(lat);
        setLongitude(lng);
        setAddress(addr);
    };

    return (
        <form action={action} className="space-y-6">
            {state?.message && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                    <p className="text-sm">{state.message}</p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Delivery Location</label>
                <Map onLocationChange={handleLocationChange} />
                <input type="hidden" name="lat" value={latitude ?? ''} />
                <input type="hidden" name="lon" value={longitude ?? ''} />
                
                <textarea
                    name="address"
                    rows={2}
                    className={`mt-2 block w-full rounded-lg border shadow-sm p-2.5 bg-gray-100 transition-colors focus:ring-2 focus:ring-primary-500 focus:border-transparent ${state?.errors?.address ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Your address will appear here after selecting a location on the map..."
                    value={address}
                    readOnly
                ></textarea>
                {state?.errors?.address && <p className="mt-1 text-sm text-red-600">{state.errors.address}</p>}
                 {state?.errors?.lat && <p className="mt-1 text-sm text-red-600">{state.errors.lat}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Your Vegetables for the Week
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {AVAILABLE_VEGETABLES.map((veg) => (
                        <label key={veg} className="relative flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-all">
                            <input
                                type="checkbox"
                                name="vegetables"
                                value={veg}
                                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="ml-3 text-sm text-gray-900">{veg}</span>
                        </label>
                    ))}
                </div>
                {state?.errors?.vegetables && <p className="mt-2 text-sm text-red-600">{state.errors.vegetables}</p>}
            </div>

            <div className="pt-4">
                <SubmitButton />
            </div>
        </form>
    );
}
