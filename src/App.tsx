import { Board } from './components/Board';
import { IceCream } from 'lucide-react';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="flex items-center" style={{ gap: '12px' }}>
          <div className="logo-icon">
            <IceCream size={24} color="#e07a5f" />
          </div>
          <h1>Carmella Gelateria</h1>
        </div>
      </header>
      <main className="app-main">
        <Board />
      </main>
    </div>
  );
}

export default App;
