import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './LoginPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [showUsers, setShowUsers] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<{ name: string, email: string }[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsFetchingUsers(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, email')
          .or('and(ativo.eq.true,controlar_frequencia.eq.true),name.ilike.%henrique%,name.ilike.%marina%')
          .order('name');

        if (error) {
          console.error("Erro Supabase:", error.message);
        }
        if (data) {
          setRegisteredUsers(data);
        }
      } catch (err) {
        console.error("Erro ao buscar usuários do banco", err);
      } finally {
        setIsFetchingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciais inválidas. Tente novamente.');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img width="200px" src="/Logo.png" alt="Carmella Gelateria" className="login-logo" />
          <h2>Acesso Restrito</h2>
          <p>Faça login para acessar o estoque.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="login-error">{error}</div>}

          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="email">Usuário / Email</label>
            <input
              id="email"
              type="text"
              value={selectedName || email}
              onChange={(e) => {
                setSelectedName('');
                setEmail(e.target.value);
              }}
              onFocus={() => setShowUsers(true)}
              onBlur={() => setTimeout(() => setShowUsers(false), 200)}
              placeholder="Selecione ou digite seu e-mail"
              required
            />
            {showUsers && (
              <ul style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px',
                listStyle: 'none', padding: 0, margin: '4px 0 0 0', zIndex: 10,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden'
              }}>
                {isFetchingUsers ? (
                  <li style={{ padding: '12px 16px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
                    Carregando usuários...
                  </li>
                ) : registeredUsers.length === 0 ? (
                  <li style={{ padding: '12px 16px', color: '#ef4444', fontStyle: 'italic', textAlign: 'center' }}>
                    Nenhum usuário listado.
                  </li>
                ) : (
                  registeredUsers.map(u => (
                    <li
                      key={u.email}
                      style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', color: '#334155', fontWeight: '500' }}
                      onClick={() => {
                        setSelectedName(u.name);
                        setEmail(u.email);
                        setShowUsers(false);
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                      {u.name}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Seu ID"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
