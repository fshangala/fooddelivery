'use client';

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "../supabase/client";
import { Session } from "@supabase/supabase-js";
import { Profile } from "../definitions";
import { ProfileService } from "../services/profile_service";

interface AuthContextType {
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, profile: null, loading: true });
export const useAuth = () => useContext(AuthContext).session;
export const useProfile = () => useContext(AuthContext).profile;
export const useAuthLoading = () => useContext(AuthContext).loading;
export const useFullAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchProfile = useCallback(async (userId: string) => {
        const profile = await ProfileService.getProfile(supabase, userId);
        setCurrentProfile(profile);
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth event:", event);
            setCurrentSession(session);
            
            if (session?.user) {
                await fetchProfile(session.user.id);
            } else {
                setCurrentProfile(null);
                setLoading(false);
            }
        });

        return () => {
            data.subscription.unsubscribe();
        };
    }, [supabase.auth, fetchProfile]);

  return (
    <AuthContext.Provider value={{ session: currentSession, profile: currentProfile, loading }}>
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