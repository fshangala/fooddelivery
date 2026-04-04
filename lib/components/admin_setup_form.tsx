'use client';

import { useActionState } from "react";
import { registerFirstAdmin } from "@/lib/actions/admin_setup";
import Image from "next/image";

export default function AdminSetupForm() {
    const [state, action, pending] = useActionState(registerFirstAdmin, {});

    if (state.success) {
        return (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-6 shadow-sm">
                <div className="flex justify-center mb-4">
                    <Image src="/logo.png" alt="PremiumFresh Logo" width={64} height={64} className="h-16 w-auto" />
                </div>
                <h2 className="text-xl font-bold text-center mb-2">Registration Successful</h2>
                <p className="text-center mb-6">{state.message}</p>
                <div className="text-center">
                    <a href="/login" className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-md">
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <form action={action} className="space-y-6">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <Image src="/logo.png" alt="PremiumFresh Logo" width={64} height={64} className="h-16 w-auto" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Setup Admin</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Create the primary administrator account for PremiumFresh.
                </p>
            </div>

            {state.message && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 flex items-start space-x-2 animate-in fade-in slide-in-from-top-2">
                    <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="text-sm font-medium">{state.message}</span>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required 
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                        placeholder="e.g. Administrator" 
                    />
                    {state.errors?.name && <p className="mt-1.5 text-xs text-red-600 font-medium">{state.errors.name}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                        placeholder="admin@premiumfresh.com" 
                    />
                    {state.errors?.email && <p className="mt-1.5 text-xs text-red-600 font-medium">{state.errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            required 
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-gray-900"
                        />
                        {state.errors?.password && <p className="mt-1.5 text-xs text-red-600 font-medium">{state.errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">Confirm</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            required 
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none text-gray-900"
                        />
                        {state.errors?.confirmPassword && <p className="mt-1.5 text-xs text-red-600 font-medium">{state.errors.confirmPassword}</p>}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={pending}
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:from-primary-300 disabled:to-primary-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
                {pending ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Initializing System...
                    </span>
                ) : "Create First Admin"}
            </button>

            <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                    This form is only visible because no admin user exists in the system.
                </p>
            </div>
        </form>
    );
}
