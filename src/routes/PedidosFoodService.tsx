import React from "react";
import { Helmet } from "react-helmet";
import "../css/Frequencia.css";

function PedidosFoodService() {
  return (
    <>
      <Helmet>
        <title>Pedidos Food Service</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Pedidos Food Service</h1>
            <p>Gerenciamento de pedidos para clientes Food Service.</p>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "40px 24px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
            textAlign: "center",
            color: "#64748b",
            fontSize: "1.4rem"
          }}>
            Página em construção. Em breve você poderá gerenciar os pedidos aqui.
          </div>
        </div>
      </div>
    </>
  );
}

export default PedidosFoodService;
