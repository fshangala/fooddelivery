import RegisterForm from "@/lib/components/register_form";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
                <h2 className="text-2xl font-bold text-center">Create Your Account</h2>
                <RegisterForm />
            </div>
        </div>
    );
}