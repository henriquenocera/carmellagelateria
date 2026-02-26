import React, { useState } from "react";
import "../css/Home.css";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Login - Carmella Gelateria</title>
      </Helmet>
      <div className="manual-page">
        <div className="manual-header">
          <h1>Acesso interno</h1>
          <p>Entre para acessar o manual da loja</p>
        </div>

        <div className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            <label className="login-label">
              <span>E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="login-label">
              <span>Senha</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="login-error">{error}</p>}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;

