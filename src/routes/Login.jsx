import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import supabase from "../supabase-client";
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

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
      return;
    }

    const loggedUser = signInData?.user;
    if (loggedUser) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("ativo")
        .eq("id", loggedUser.id)
        .single();

      if (profileData && profileData.ativo === false) {
        await supabase.auth.signOut();
        setError("Sua conta está inativa no sistema. Entre em contato com o administrador.");
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    navigate("/", { replace: true });
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

