'use client';

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createSubscription } from "@/lib/actions/subscription";
import { Package } from "@/lib/definitions/packages";
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
                    Processing Subscription...
                </span>
            ) : "Subscribe & Pay"}
        </button>
    );
}

interface OrderFormProps {
    packages: Package[];
}

export default function OrderForm({ packages }: OrderFormProps) {
    const [state, action] = useActionState(createSubscription, {});
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

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
        <form action={action} className="space-y-8">
            {state?.message && (
                <div className={`p-4 border-l-4 ${state.errors ? 'bg-red-50 border-red-400 text-red-700' : 'bg-red-50 border-red-400 text-red-700'}`}>
                    <p className="text-sm">{state.message}</p>
                </div>
            )}

            {/* Package Selection */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select a Subscription Package</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <label 
                            key={pkg.id} 
                            className={`relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg
                                ${selectedPackage === pkg.id 
                                    ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-600 ring-offset-2' 
                                    : 'border-gray-200 hover:border-primary-300 bg-white'
                                }
                                ${!pkg.is_active ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <input
                                type="radio"
                                name="package_id"
                                value={pkg.id}
                                disabled={!pkg.is_active}
                                className="sr-only"
                                onChange={() => setSelectedPackage(pkg.id)}
                            />
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xl font-bold text-gray-900">{pkg.name}</h4>
                                {pkg.price && <span className="text-lg font-semibold text-primary-700">${pkg.price}</span>}
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm text-gray-500 mb-3 font-medium">Includes:</p>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    {pkg.vegetables.map(v => (
                                        <li key={v} className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            {v}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </label>
                    ))}
                </div>
                {state?.errors?.package_id && <p className="mt-2 text-sm text-red-600">{state.errors.package_id}</p>}
            </div>

            {/* Location Picker */}
            <div className="pt-6 border-t border-gray-200">
                <label className="block text-lg font-medium text-gray-900 mb-2">Delivery Location</label>
                <p className="text-sm text-gray-500 mb-4">Search for your address or click on the map.</p>
                
                <div className="h-[400px] rounded-xl overflow-hidden shadow-sm border border-gray-300">
                    <Map onLocationChange={handleLocationChange} />
                </div>
                
                <input type="hidden" name="lat" value={latitude ?? ''} />
                <input type="hidden" name="lon" value={longitude ?? ''} />
                
                <div className="mt-4">
                     <label className="block text-sm font-medium text-gray-700">Selected Address</label>
                     <textarea
                        name="address"
                        rows={2}
                        className={`mt-1 block w-full rounded-lg border shadow-sm p-3 bg-gray-50 transition-colors focus:ring-2 focus:ring-primary-500 focus:border-transparent ${state?.errors?.address ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Address will appear here..."
                        value={address}
                        readOnly
                    ></textarea>
                </div>
                
                {state?.errors?.address && <p className="mt-1 text-sm text-red-600">{state.errors.address}</p>}
                {state?.errors?.lat && <p className="mt-1 text-sm text-red-600">{state.errors.lat}</p>}
            </div>

            <div className="pt-6">
                <SubmitButton />
                <p className="mt-4 text-center text-sm text-gray-500">
                    By subscribing, you agree to receive weekly deliveries for one month.
                </p>
            </div>
        </form>
    );
}
