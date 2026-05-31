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
      console.log("initAuth started");
      try {
        console.log("Calling getSession()...");
        
        // Timeout de 5 segundos para evitar que o app trave se a requisição do Supabase pendurar
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((resolve, reject) => 
          setTimeout(() => reject(new Error("Supabase getSession timeout após 5 segundos")), 5000)
        );

        const response = await Promise.race([sessionPromise, timeoutPromise]);
        
        const currentSession = response?.data?.session;
        const error = response?.error;

        console.log("getSession() returned:", currentSession, "error:", error);

        if (error) {
          console.error("Error getting Supabase session", error);
        }

        console.log("isMounted:", isMounted);
        if (isMounted) {
          setSession(currentSession ?? null);
          setLoading(false);
          console.log("setLoading(false) called inside initAuth");
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

