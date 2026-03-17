'use client';

import { useActionState } from "react";
import { loginUser } from "../actions/login";

export default function LoginForm() {
    const [state, action, pending] = useActionState(loginUser, {});

    return (
        <form action={action} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="Enter your email" />
                {state.errors?.email && <p className="mt-1 text-sm text-red-600">{state.errors.email}</p>}
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" name="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" placeholder="Enter your password" />
                {state.errors?.password && <p className="mt-1 text-sm text-red-600">{state.errors.password}</p>}
            </div>
            <div>
                {state.message && <p className="mt-1 text-sm text-red-600">{state.message}</p>}
            </div>
            <button 
                type="submit" 
                disabled={pending}
                className={`w-full flex justify-center py-2 px-4 rounded-md text-white transition-all
                    ${pending ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 cursor-pointer'}`}
            >
                {pending ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                    </span>
                ) : "Login"}
            </button>
        </form>
    );
}