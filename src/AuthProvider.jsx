import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "./supabase-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchAdminStatus = async (userId) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    try {
      const { data } = await supabase
        .from("profiles")
        .select("is_admin, ativo")
        .eq("id", userId)
        .single();

      if (data && data.ativo === false) {
        await supabase.auth.signOut();
        setIsAdmin(false);
        return;
      }

      setIsAdmin(data?.is_admin === true);
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting Supabase session", error);
        }

        if (isMounted) {
          setSession(currentSession ?? null);
          setLoading(false);
          if (currentSession?.user) {
            fetchAdminStatus(currentSession.user.id);
          }
        }
      } catch (err) {
        console.error("Unexpected error getting Supabase session", err);
        if (isMounted) {
          setSession(null);
          setLoading(false);
        }
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession ?? null);
        fetchAdminStatus(newSession?.user?.id ?? null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

