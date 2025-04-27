import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import OnboardingPage from "./components/OnboardingPage";
import "./css/App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="main-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/onboarding" className="nav-link">Onboarding</Link>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="home-page">
              <h1>Bem-vindo à Carmella Gelateria</h1>
              <p>Sistema de Gestão</p>
            </div>
          } />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
