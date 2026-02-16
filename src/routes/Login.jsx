import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) {
      navigate("/", { replace: true });
    }
  }, [loading, session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
      return;
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
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            background: "#ffffff",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <img
              src="/logo.svg"
              alt="Carmella Gelateria"
              style={{ height: "60px", marginBottom: "0.75rem" }}
            />
            <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Acesso Restrito</h2>
            <p style={{ margin: "0.5rem 0 0", color: "#666", fontSize: "0.9rem" }}>
              Faça login para acessar o painel interno.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="email"
                style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #d9d9d9",
                  fontSize: "0.95rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="password"
                style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem" }}
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #d9d9d9",
                  fontSize: "0.95rem",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  marginBottom: "1rem",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "8px",
                  backgroundColor: "#fff1f0",
                  color: "#cf1322",
                  fontSize: "0.85rem",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "0.7rem 0.75rem",
                borderRadius: "999px",
                border: "none",
                background:
                  "linear-gradient(135deg, #ff8ba7 0%, #ff758c 50%, #ff7eb3 100%)",
                color: "#ffffff",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: submitting ? "default" : "pointer",
                opacity: submitting ? 0.8 : 1,
                transition: "transform 0.1s ease, box-shadow 0.1s ease",
                boxShadow: "0 6px 18px rgba(255, 117, 140, 0.35)",
              }}
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

