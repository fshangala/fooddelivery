'use client';
import logout from "../actions/logout";
import { useAuth } from "./auth_provider";

export default function AccountHeader() {
    const session = useAuth();

    return (
        <div className="bg-white">
            <div className="">
                <span>{session?.user?.email}</span>
            </div>
            <div>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors cursor-pointer" onClick={() => logout()}>Logout</button>
            </div>
        </div>
    );
}