'use client';

import { useActionState, useState } from "react";
import { updateProfileAction } from "../actions/profile";
import { Profile } from "../definitions";
import dynamic from "next/dynamic";

// Load LocationPicker dynamically to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import("./location_picker"), {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading map...</div>
});

interface ProfileFormProps {
    profile: Profile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
    const [state, action, pending] = useActionState(updateProfileAction, {});
    const [phoneNumber, setPhoneNumber] = useState(profile.phone?.slice(4) || ""); // Remove +260 prefix if it exists
    const [preferredLoc, setPreferredLoc] = useState({
        lat: profile.preferred_lat || 0,
        lon: profile.preferred_lon || 0
    });
    const [radius, setRadius] = useState(profile.preferred_radius_km || 5.0);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 9);
        setPhoneNumber(val);
    };

    const handleLocationChange = (lat: number, lon: number) => {
        setPreferredLoc({ lat, lon });
    };

    return (
        <form action={action} className="space-y-6">
            {state?.message === "Success" && (
                <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
                    Profile updated successfully!
                </div>
            )}
            
            {state?.message && state.message !== "Success" && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                    {state.message}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        defaultValue={profile.name || ""}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
                        placeholder="Enter your name" 
                    />
                    {state?.errors?.name && <p className="mt-1 text-sm text-red-600">{state.errors.name}</p>}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="flex mt-1">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            +260
                        </span>
                        <input 
                            type="text" 
                            id="phone_input" 
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
                            placeholder="977123456" 
                        />
                        <input type="hidden" name="phone" value={`+260${phoneNumber}`} />
                    </div>
                    {state?.errors?.phone && <p className="mt-1 text-sm text-red-600">{state.errors.phone}</p>}
                </div>

                {profile.role === 'driver' && (
                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="p-1 bg-primary-100 text-primary-600 rounded">📍</span>
                            Preferred Delivery Zone
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Home Base Location</label>
                                <LocationPicker onLocationChange={handleLocationChange} />
                                <input type="hidden" name="preferred_lat" value={preferredLoc.lat} />
                                <input type="hidden" name="preferred_lon" value={preferredLoc.lon} />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="preferred_radius_km" className="block text-sm font-medium text-gray-700">Preferred Radius</label>
                                    <span className="text-sm font-bold text-primary-600">{radius} km</span>
                                </div>
                                <input 
                                    type="range" 
                                    id="preferred_radius_km" 
                                    name="preferred_radius_km" 
                                    min="1" 
                                    max="50" 
                                    step="0.5"
                                    value={radius}
                                    onChange={(e) => setRadius(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                />
                                <p className="mt-1 text-xs text-gray-500">Clusters within this distance will be prioritized for you.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button 
                type="submit" 
                disabled={pending}
                className={`w-full flex justify-center py-3 px-4 rounded-xl text-white font-bold transition-all shadow-lg
                    ${pending ? 'bg-primary-400 cursor-not-allowed shadow-none' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-100 hover:shadow-primary-200'}`}
            >
                {pending ? "Saving Changes..." : "Save Profile Settings"}
            </button>
        </form>
    );
}
