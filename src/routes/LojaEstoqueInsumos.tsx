import React from "react";
import { Helmet } from "react-helmet";
import "../css/Frequencia.css";

function LojaEstoqueInsumos() {
  return (
    <>
      <Helmet>
        <title>Loja - Estoque Insumos</title>
      </Helmet>
      
      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Estoque Insumos</h1>
            <p>Controle e movimentação do estoque de insumos das lojas.</p>
          </div>
        </div>
        
        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <h3 style={{ color: "var(--text-muted)" }}>Página de Estoque de Insumos (Em construção)</h3>
            <p style={{ color: "var(--text-muted)" }}>Os controles de estoque aparecerão aqui.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LojaEstoqueInsumos;
