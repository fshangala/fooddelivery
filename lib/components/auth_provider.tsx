'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "../supabase/client";
import { Session } from "@supabase/supabase-js";

const AuthContext = createContext<Session | null>(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            switch (event) {
                case "INITIAL_SESSION":
                    console.log("Initial session:", session);
                    setCurrentSession(session);
                    break;

                case "SIGNED_IN":
                    console.log("User signed in:", session);
                    setCurrentSession(session);
                    break;
                
                case "SIGNED_OUT":
                    console.log("User signed out");
                    setCurrentSession(null);
                    break;
            
                default:
                    break;
            }
        });

        return () => {
            data.subscription.unsubscribe();
        };
    }, []);

  return (
    <AuthContext.Provider value={currentSession}>
      {children}
    </AuthContext.Provider>
  );
}

export function useProtectedRoute() {
    const session = useAuth();
    if (!session) {
        throw new Error("Unauthorized");
    }
    return session;
}