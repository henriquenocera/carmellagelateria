import { Board } from './components/Board';
import { LoginPage } from './components/LoginPage';
import { LogOut } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { SessionTimer } from './components/SessionTimer';
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
        <div className="header-actions">
          <h1 style={{ margin: 0, fontSize: '18px', color: '#fff', fontWeight: 'bold', paddingRight: '8px' }}>Loja Ahú</h1>
          <div className="hide-on-mobile">
            <SessionTimer />
          </div>
          <span className="user-email" style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: '500' }}>{user.email}</span>


          <button
            onClick={signOut}
            className="icon-button"
            title="Sair"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'transparent', border: 'none', color: '#e2e8f0', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseOut={(e) => e.currentTarget.style.color = '#e2e8f0'}
          >
            <LogOut size={20} />
          </button>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('board-action', { detail: 'open-logs' }))}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              padding: '8px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          >
            Logs de Atividades
          </button>
          <div id="header-warnings-portal-target"></div>
        </div>
      </header>
      <main className="app-main">
        <Board />
      </main>
    </div>
  );
}

export default App;
