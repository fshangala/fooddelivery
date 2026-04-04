'use client';

import { registerUser } from "@/lib/actions/register";
import { useActionState } from "react";
import Link from "next/link";

export default function RegisterForm() {
    const [state, action, pending] = useActionState(registerUser, {});

    if (state?.success) {
        return (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-4">
                <p className="font-medium text-center">{state.message}</p>
                <div className="mt-4 text-center">
                    <Link href="/login" className="text-primary-600 hover:underline font-semibold transition-all">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form className="space-y-4" action={action}>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" name="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="Enter your name" />
                {state?.errors?.name && <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>}
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="Enter your email" />
                {state?.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" name="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="Enter your password" />
                {state?.errors?.password && <p className="text-red-500 text-sm mt-1">{state.errors.password}</p>}
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="Confirm your password" />
                {state?.errors?.confirmPassword && <p className="text-red-500 text-sm mt-1">{state.errors.confirmPassword}</p>}
            </div>
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Account Type</label>
                <select 
                    id="role" 
                    name="role" 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all"
                    defaultValue="customer"
                >
                    <option value="customer">Customer</option>
                    <option value="driver">Driver</option>
                </select>
                {state?.errors?.role && <p className="text-red-500 text-sm mt-1">{state.errors.role}</p>}
            </div>
            <div>
                {state?.message && !state.success && <p className="text-red-500 text-sm mt-1">{state.message}</p>}
            </div>
            <button 
                type="submit" 
                disabled={pending}
                className={`w-full flex justify-center py-2 px-4 rounded-md text-white transition-all
                    ${pending ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]'}`}
            >
                {pending ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                    </span>
                ) : "Register"}
            </button>
            <div className="pt-2 text-center">
                <Link href="/login" className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200">
                    Already have an account? <span className="font-semibold">Login here</span>
                </Link>
            </div>
        </form>
    );
}