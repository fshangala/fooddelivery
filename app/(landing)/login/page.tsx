import LoginForm from "@/lib/components/login_form";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
                <h2 className="text-2xl font-bold text-center">Login to Your Account</h2>
                <Suspense fallback={<div className="text-center text-gray-500">Loading form...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}