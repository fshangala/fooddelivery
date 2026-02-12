'use client';

import { registerUser } from "@/lib/actions/register";
import { useActionState } from "react";

export default function RegisterForm() {
    const [state, action, pending] = useActionState(registerUser, {});

    return (
        <form className="space-y-4" action={action}>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" name="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="Enter your name" />
                {state?.errors?.name && <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>}
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="Enter your email" />
                {state?.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" name="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="Enter your password" />
                {state?.errors?.password && <p className="text-red-500 text-sm mt-1">{state.errors.password}</p>}
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="Confirm your password" />
                {state?.errors?.confirmPassword && <p className="text-red-500 text-sm mt-1">{state.errors.confirmPassword}</p>}
            </div>
            <div>
                {state?.message && <p className="text-red-500 text-sm mt-1">{state.message}</p>}
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition cursor-pointer">Register</button>
        </form>
    );
}