'use client';

import { useActionState, useState } from "react";
import { updateProfileAction } from "../actions/profile";
import { Profile } from "../definitions";

interface ProfileFormProps {
    profile: Profile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
    const [state, action, pending] = useActionState(updateProfileAction, {});
    const [phoneNumber, setPhoneNumber] = useState(profile.phone?.slice(4) || ""); // Remove +260 prefix if it exists

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 9);
        setPhoneNumber(val);
    };

    return (
        <form action={action} className="space-y-4">
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
                    {/* Hidden input to send the full phone number with prefix */}
                    <input type="hidden" name="phone" value={`+260${phoneNumber}`} />
                </div>
                <p className="mt-1 text-xs text-gray-500">Please enter the 9 digits after +260.</p>
                {state?.errors?.phone && <p className="mt-1 text-sm text-red-600">{state.errors.phone}</p>}
            </div>

            <button 
                type="submit" 
                disabled={pending}
                className={`w-full flex justify-center py-2 px-4 rounded-md text-white transition-all
                    ${pending ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 cursor-pointer'}`}
            >
                {pending ? "Updating..." : "Save Changes"}
            </button>
        </form>
    );
}
