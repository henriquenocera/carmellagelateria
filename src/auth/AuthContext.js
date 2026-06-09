import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        console.log("Iniciando verificação de sessão...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log("Resultado da sessão:", { session, sessionError });

        if (session) {
          // getUser() makes a network request to verify the user exists in the database
          console.log("Sessão encontrada, verificando usuário...");
          const { error } = await supabase.auth.getUser();
          console.log("Resultado da verificação do usuário:", error);
          if (error) {
            console.error("Erro na verificação, fazendo logoff...");
            await supabase.auth.signOut();
            if (isMounted) {
              setSession(null);
              setLoading(false);
            }
            return;
          }
        }

        if (isMounted) {
          setSession(session ?? null);
          setLoading(false);
          console.log("Verificação concluída. Loading = false");
        }
      } catch (error) {
        console.error("Exceção capturada em checkSession:", error);
        if (isMounted) {
          setSession(null);
          setLoading(false);
        }
      }
    };

    checkSession();

    // Timeout de segurança para evitar tela de carregamento infinita
    const fallbackTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn("Aviso: Verificação de sessão excedeu o tempo limite (5s). Forçando o fim do carregamento.");
        setLoading(false);
      }
    }, 5000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Mudança de estado de autenticação:", event);
      if (isMounted) {
        setSession(newSession);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

