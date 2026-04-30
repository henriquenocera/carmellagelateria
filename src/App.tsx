import { Board } from './components/Board';
import { LoginPage } from './components/LoginPage';
import { LogOut, Trash2, Plus } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { SessionTimer } from './components/SessionTimer';
import { AUTHORIZED_EMAILS_TO_DELETE } from './constants/config';
import './App.css';

function App() {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' }}>Carregando sessão...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="flex items-center" style={{ gap: '12px' }}>
          {/* Lado esquerdo do header agora vazio */}
        </div>
        <div className="flex items-center" style={{ gap: '16px' }}>
          <SessionTimer />
          <span className="user-email" style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>{user.email}</span>


          <button
            onClick={signOut}
            className="icon-button"
            title="Sair"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'transparent', border: 'none', color: '#64748b' }}
          >
            <LogOut size={20} />
          </button>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('board-action', { detail: 'open-logs' }))}
            style={{
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #e2e8f0',
              padding: '8px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            Logs de Atividades
          </button>
        </div>
      </header>
      <main className="app-main">
        <Board />
      </main>
    </div>
  );
}

export default App;
