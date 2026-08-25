import React, { useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import { checklistAberturaSteps, checklistFechamentoSteps } from "../config/checklists.js";
import "../css/Home.css";

interface ChecklistItemType {
  id: string;
  title: string;
  subtitle1?: string;
  subtitle2?: string;
  buttonText?: string;
  buttonLink?: string;
  weekday?: number;
  [key: string]: any;
}

interface StepType {
  title: string;
  items: ChecklistItemType[];
}

const TarefasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"abertura" | "fechamento">("abertura");

  const currentSteps: StepType[] = activeTab === "abertura" ? checklistAberturaSteps : checklistFechamentoSteps;

  return (
    <>
      <Helmet>
        <title>Tarefas - Carmella Gelateria</title>
      </Helmet>

      <div className="home" style={{ alignItems: "flex-start" }}>
        <div className="container">
          <div className="home-calendar-card">
            {/* Header da Página */}
            <div className="home-calendar-top-bar" style={{ marginBottom: "1.5rem" }}>
              <div className="home-calendar-title-group">
                <h2>
                  <Icons.BsListCheck color="var(--primary-color)" />
                  Tarefas Operacionais
                </h2>
                <p>Lista de rotinas e verificações da loja para abertura e fechamento.</p>
              </div>

              {/* Tabs Bar */}
              <div style={{ display: "flex", gap: "0.75rem", background: "#f1f5f9", padding: "6px", borderRadius: "14px" }}>
                <button
                  className="btn-cal-nav"
                  style={{
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.75rem 1.6rem",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    backgroundColor: activeTab === "abertura" ? "var(--primary-color, #d4a373)" : "transparent",
                    color: activeTab === "abertura" ? "#ffffff" : "#475569",
                    boxShadow: activeTab === "abertura" ? "0 2px 8px rgba(212, 163, 115, 0.35)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setActiveTab("abertura")}
                >
                  <Icons.BsSun size={18} /> Abertura
                </button>

                <button
                  className="btn-cal-nav"
                  style={{
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.75rem 1.6rem",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    backgroundColor: activeTab === "fechamento" ? "var(--secondary-color, #5a432c)" : "transparent",
                    color: activeTab === "fechamento" ? "#ffffff" : "#475569",
                    boxShadow: activeTab === "fechamento" ? "0 2px 8px rgba(90, 67, 44, 0.35)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setActiveTab("fechamento")}
                >
                  <Icons.BsMoonStars size={18} /> Fechamento
                </button>
              </div>
            </div>

            {/* Renderização da Lista Simples das Seções de Tarefas */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {currentSteps.map((step, stepIdx) => (
                <div
                  key={stepIdx}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                  }}
                >
                  <div
                    style={{
                      background: activeTab === "abertura" ? "#fef3c7" : "#f1f5f9",
                      color: activeTab === "abertura" ? "#92400e" : "#334155",
                      padding: "1rem 1.25rem",
                      fontWeight: 800,
                      fontSize: "1.15rem",
                      borderBottom: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <Icons.BsFolder2Open /> {step.title}
                  </div>

                  <div style={{ padding: "0.5rem 0.75rem" }}>
                    {step.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.85rem",
                          padding: "0.9rem 1rem",
                          borderBottom: "1px solid #f1f5f9"
                        }}
                      >
                        <Icons.BsDot size={24} color="var(--primary-color, #d4a373)" style={{ flexShrink: 0, marginTop: "-2px" }} />

                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "1.05rem",
                              fontWeight: 700,
                              color: "#1e293b"
                            }}
                          >
                            {item.title}
                            {item["new"] && (
                              <span
                                style={{
                                  marginLeft: "8px",
                                  fontSize: "0.75rem",
                                  background: "#22c55e",
                                  color: "#fff",
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  fontWeight: 800
                                }}
                              >
                                NOVO
                              </span>
                            )}
                          </div>

                          {(item.subtitle1 || item.subtitle2) && (
                            <div style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "0.25rem" }}>
                              {item.subtitle1 && <div>• {item.subtitle1}</div>}
                              {item.subtitle2 && <div>• {item.subtitle2}</div>}
                            </div>
                          )}

                          {item.buttonLink && (
                            <a
                              href={item.buttonLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                marginTop: "0.5rem",
                                fontSize: "0.85rem",
                                color: "var(--primary-color)",
                                fontWeight: 700,
                                textDecoration: "none"
                              }}
                            >
                              <Icons.BsBoxArrowUpRight size={12} /> {item.buttonText || "Acessar Link"}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TarefasPage;
