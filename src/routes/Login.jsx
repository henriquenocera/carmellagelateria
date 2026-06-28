import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import "../css/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const hasAttemptedLogin = React.useRef(false);

  useEffect(() => {
    if (!loading && session && !hasAttemptedLogin.current) {
      navigate("/", { replace: true });
    }
  }, [loading, session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    hasAttemptedLogin.current = true;

    const withTimeout = (promise, ms, errorMessage) => {
      return Promise.race([
        promise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(errorMessage)), ms)
        ),
      ]);
    };

    try {
      const response = await withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        10000,
        "Tempo limite esgotado ao tentar autenticar. Verifique sua conexão."
      );

      const { data: signInData, error: signInError } = response;

      if (signInError) {
        setError(signInError.message);
        setSubmitting(false);
        return;
      }

      const loggedUser = signInData?.user;
      if (loggedUser) {
        const profileResponse = await withTimeout(
          supabase
            .from("profiles")
            .select("ativo")
            .eq("id", loggedUser.id)
            .single(),
          5000,
          "Tempo limite esgotado ao verificar os dados da sua conta."
        );

        const { data: profileData, error: profileError } = profileResponse;

        if (profileError) {
          throw profileError;
        }

        if (profileData && profileData.ativo === false) {
          await supabase.auth.signOut();
          setError("Sua conta está inativa no sistema. Entre em contato com o administrador.");
          setSubmitting(false);
          return;
        }
      }

      setSubmitting(false);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Erro no processo de login:", err);
      
      // Desloga por segurança para não deixar sessão pendente corrompida
      try {
        await supabase.auth.signOut();
      } catch (signOutErr) {
        console.error("Erro ao limpar sessão após falha no login:", signOutErr);
      }

      const userMessage = err.message || "";
      if (userMessage.includes("Tempo limite")) {
        setError(userMessage);
      } else {
        setError("Erro de conexão com o banco de dados. Verifique se o projeto Supabase está ativo.");
      }
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Carregando...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <img
              src="/logo.svg"
              alt="Carmella Gelateria"
              className="login-logo"
            />
            <h2 className="login-title">Acesso Restrito</h2>
            <p className="login-subtitle">
              Faça login para acessar o painel interno.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
              />
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="login-submit"
            >
              {submitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;

