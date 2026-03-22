'use client';

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createPackage } from "@/lib/actions/packages";
import { AVAILABLE_VEGETABLES } from "@/lib/definitions/order";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors
                ${pending ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
        >
            {pending ? 'Saving...' : 'Create Package'}
        </button>
    );
}

export default function PackageForm() {
    const [state, action] = useActionState(createPackage, {});

    return (
        <form action={action} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div>
                <h3 className="text-lg font-medium text-gray-900">Create New Package</h3>
                <p className="mt-1 text-sm text-gray-500">Define a new subscription package.</p>
            </div>

            {state.message && (
                <div className={`p-4 rounded-md ${state.errors ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {state.message}
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Package Name</label>
                <select id="name" name="name" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="">Select a name...</option>
                    <option value="Starter">Starter</option>
                    <option value="Premium">Premium</option>
                    <option value="Platinum">Platinum</option>
                </select>
                {state.errors?.name && <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>}
            </div>

            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input type="number" name="price" id="price" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="0.00" step="0.01" />
                </div>
                {state.errors?._form && <p className="mt-1 text-sm text-red-600">{state.errors._form[0]}</p>}
            </div>

            <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">Included Vegetables</span>
                <div className="grid grid-cols-2 gap-4">
                    {AVAILABLE_VEGETABLES.map((veg) => {
                        const isMandatory = ["Tomatoes", "Onions", "Peppers"].includes(veg);
                        return (
                            <label key={veg} className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    name="vegetables"
                                    value={veg}
                                    defaultChecked={isMandatory}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    disabled={isMandatory} // Prevent unchecking mandatory ones? Or just warn?
                                />
                                {/* If disabled, input value isn't sent. Need a hidden input for mandatory ones if disabled. */}
                                {isMandatory && <input type="hidden" name="vegetables" value={veg} />}
                                <span className={`text-sm ${isMandatory ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                                    {veg} {isMandatory && <span className="text-xs text-indigo-500">(Required)</span>}
                                </span>
                            </label>
                        );
                    })}
                </div>
                {state.errors?.vegetables && <p className="mt-1 text-sm text-red-600">{state.errors.vegetables[0]}</p>}
            </div>

            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input id="is_active" name="is_active" type="checkbox" defaultChecked className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="is_active" className="font-medium text-gray-700">Active</label>
                    <p className="text-gray-500">Available for customers to purchase.</p>
                </div>
            </div>

            <div>
                <SubmitButton />
            </div>
        </form>
    );
}
