import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Timeline from "./components/Timeline";
import DocumentacaoPage from "./pages/DocumentacaoPage";
import BoasVindasPage from "./pages/BoasVindasPage";

function App() {
  const [etapas, setEtapas] = useState([
    { id: 1, titulo: "Documentação", concluido: false, path: "/documentacao" },
    { id: 2, titulo: "Boas-Vindas", concluido: false, path: "/boas-vindas" },
    { id: 3, titulo: "Segurança", concluido: false, path: "/seguranca" },
    { id: 4, titulo: "Ferramentas", concluido: false, path: "/ferramentas" },
    { id: 5, titulo: "Shadowing", concluido: false, path: "/shadowing" },
    { id: 6, titulo: "Revisão", concluido: false, path: "/revisao" },
  ]);

  const toggleConclusao = (id) => {
    setEtapas((prevEtapas) =>
      prevEtapas.map((etapa) =>
        etapa.id === id ? { ...etapa, concluido: !etapa.concluido } : etapa
      )
    );
  };

  return (
    <Router>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Timeline etapas={etapas} toggleConclusao={toggleConclusao} />

        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/documentacao" element={<DocumentacaoPage />} />
            <Route path="/boas-vindas" element={<BoasVindasPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
