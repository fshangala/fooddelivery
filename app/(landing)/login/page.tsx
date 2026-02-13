import LoginForm from "@/lib/components/login_form";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
                <h2 className="text-2xl font-bold text-center">Login to Your Account</h2>
                <LoginForm />
                <a href="/register" className="block text-center text-primary-600 hover:underline">Create an account</a>
            </div>
        </div>
    );
}