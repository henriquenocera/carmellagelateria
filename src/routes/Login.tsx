import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../supabase-client';
import '../css/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redireciona de volta para a página que o usuário tentou acessar originalmente, ou para '/'
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Email ou senha incorretos.');
      setLoading(false);
    } else {
      // Redireciona para a página de onde veio ou para a raiz
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <h1>CARMELLA</h1>
          <p>Gelateria Artigianale</p>
        </div>
        
        <h2 className="login-title">Acesso Restrito</h2>
        <p className="login-subtitle">Faça login para acessar o painel interno.</p>

        <form className="login-form" onSubmit={handleLogin}>
          {error && <div className="login-error">{error}</div>}
          
          <div className="login-form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="login-form-group">
            <label htmlFor="password">Senha</label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
