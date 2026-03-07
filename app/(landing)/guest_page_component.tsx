import Link from 'next/link';

export default function GuestPageComponent() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100 p-6">
            <div className="max-w-xl text-center">
                <h1 className="text-4xl font-extrabold mb-4 text-primary-800">
                    Welcome to PremiumFresh
                </h1>
                <p className="text-lg text-stone-700 mb-6">
                    Subscribe for weekly vegetable deliveries and manage your account with ease.
                </p>
                <div className="space-x-4">
                    <a href='/register' className="inline-block px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition">
                        Get Started
                    </a>
                    <a href='/login' className="inline-block px-6 py-3 rounded-md font-semibold text-primary-700 ring-1 ring-primary-700 hover:bg-primary-50 transition">
                        Log In
                    </a>
                </div>
            </div>
        </div>
    );
}