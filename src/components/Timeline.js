import { Link } from "react-router-dom";

function Timeline({ etapas, toggleConclusao }) {
  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {etapas.map((etapa, index) => (
          <div
            key={etapa.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Linha conectora */}
            {index > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "-50%",
                  right: "50%",
                  height: "2px",
                  backgroundColor: "#ddd",
                  zIndex: 0,
                }}
              ></div>
            )}

            {/* Ícone */}
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: etapa.concluido ? "#27ae60" : "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                zIndex: 1,
                transition: "all 0.3s ease",
              }}
              onClick={() => toggleConclusao(etapa.id)}
            >
              {etapa.concluido ? "✓" : index + 1}
            </div>

            {/* Título */}
            <Link
              to={etapa.path}
              style={{
                marginTop: "8px",
                textDecoration: "none",
                color: etapa.concluido ? "#27ae60" : "#2c3e50",
                fontWeight: "500",
                textAlign: "center",
                fontSize: "0.9em",
              }}
            >
              {etapa.titulo}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;
