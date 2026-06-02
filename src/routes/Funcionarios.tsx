import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import * as Icons from "react-icons/bs";
import "../css/CadastroPessoas.css";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";

interface Profile {
  id: string;
  short_id: string | null;
  name: string;
  email: string;
  ativo?: boolean | null;
  data_registro?: string | null;
  feriadosAbertos?: number;
}

function Funcionarios() {
  const { isAdmin } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  async function fetchFuncionarios() {
    try {
      setLoading(true);
      setError(null);
      const { data: profilesData, error: dbError } = await supabase
        .from("profiles")
        .select("*")
        .eq("controlar_frequencia", true)
        .order("name", { ascending: true });

      if (dbError) throw dbError;

      const { data: feriadosData, error: feriadosError } = await supabase
        .from("feriados_trabalhados")
        .select("employee_id, data_folga, pago_em_dobro");

      if (feriadosError) throw feriadosError;

      const feriadosAbertosCount = (feriadosData || []).reduce((acc: any, curr: any) => {
        if (!curr.data_folga && !curr.pago_em_dobro) {
          acc[curr.employee_id] = (acc[curr.employee_id] || 0) + 1;
        }
        return acc;
      }, {});

      const sorted = (profilesData || []).map((p: any) => ({
        ...p,
        feriadosAbertos: feriadosAbertosCount[p.id] || 0
      })).sort((a: any, b: any) => {
        const aActive = a.ativo !== false;
        const bActive = b.ativo !== false;
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;

        return (a.name || "").localeCompare(b.name || "");
      });

      setProfiles(sorted);
    } catch (err: any) {
      console.error("Erro ao buscar funcionários:", err);
      setError("Falha ao carregar a lista de funcionários.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Funcionários</title>
      </Helmet>

      <div className="cadastro-container">
        <div className="cadastro-header">
          <div className="cadastro-title-group">
            <h1>Funcionários</h1>
            <p>Lista de pessoas com controle de frequência ativo.</p>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">
              <Icons.BsArrowClockwise className="spin icon-lg" style={{ fontSize: "2rem" }} />
              <p>Carregando funcionários...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <Icons.BsExclamationTriangle style={{ fontSize: "2rem", color: "red" }} />
              <p>{error}</p>
              <button onClick={fetchFuncionarios} className="primary-btn" style={{ marginTop: 10 }}>Tentar Novamente</button>
            </div>
          ) : profiles.length === 0 ? (
            <div className="empty-state">
              <Icons.BsPeople style={{ fontSize: "2rem" }} />
              <p>Nenhum funcionário encontrado.</p>
            </div>
          ) : (
            <table className="pessoas-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Data Registro</th>
                  {isAdmin && (
                    <>
                      <th style={{ textAlign: "center", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                          <span style={{ background: "#fef3c7", color: "#d97706", fontSize: "11px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold", width: "fit-content" }}>Admin</span>
                          <span>Dias de Casa</span>
                        </div>
                      </th>
                      <th style={{ textAlign: "center", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                          <span style={{ background: "#fef3c7", color: "#d97706", fontSize: "11px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold", width: "fit-content" }}>Admin</span>
                          <span>Status</span>
                        </div>
                      </th>
                      <th style={{ textAlign: "center", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                          <span style={{ background: "#fef3c7", color: "#d97706", fontSize: "11px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold", width: "fit-content" }}>Admin</span>
                          <span>Feriados em Aberto</span>
                        </div>
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => {
                  const dataRegistro = p.data_registro ? new Date(p.data_registro + 'T00:00:00') : null;
                  const diasDesdeRegistro = dataRegistro ? Math.floor((new Date().getTime() - dataRegistro.getTime()) / (1000 * 60 * 60 * 24)) : null;
                  
                  let dataFim1 = "";
                  let dataFim2 = "";
                  if (dataRegistro) {
                    const d1 = new Date(dataRegistro.getTime() + 45 * 24 * 60 * 60 * 1000);
                    const d2 = new Date(dataRegistro.getTime() + 90 * 24 * 60 * 60 * 1000);
                    dataFim1 = d1.toLocaleDateString('pt-BR');
                    dataFim2 = d2.toLocaleDateString('pt-BR');
                  }

                  let statusContrato = "-";
                  let diasRestantes: number | null = null;
                  if (diasDesdeRegistro !== null) {
                    if (diasDesdeRegistro <= 45) {
                      statusContrato = "Experiência (1º Período)";
                      diasRestantes = 45 - diasDesdeRegistro;
                    } else if (diasDesdeRegistro <= 90) {
                      statusContrato = "Experiência (2º Período)";
                      diasRestantes = 90 - diasDesdeRegistro;
                    } else {
                      statusContrato = "Efetivado";
                    }
                  }

                  let tempoFormatado = "-";
                  if (dataRegistro) {
                    const start = dataRegistro;
                    const end = new Date();
                    if (start <= end) {
                      let years = end.getFullYear() - start.getFullYear();
                      let months = end.getMonth() - start.getMonth();
                      let days = end.getDate() - start.getDate();

                      if (days < 0) {
                        months--;
                        const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
                        days += previousMonth.getDate();
                      }
                      if (months < 0) {
                        years--;
                        months += 12;
                      }

                      const parts = [];
                      if (years > 0) parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
                      if (months > 0) parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
                      if (days > 0 || parts.length === 0) parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);

                      if (parts.length > 1) {
                        const last = parts.pop();
                        tempoFormatado = parts.join(', ') + ' e ' + last;
                      } else {
                        tempoFormatado = parts[0];
                      }
                    } else {
                      tempoFormatado = "0 dias";
                    }
                  }

                  return (
                    <tr key={p.id} className={p.ativo === false ? "inactive-row" : ""}>
                      <td style={{ fontWeight: 600 }}>
                        <Link to={`/cadastro-pessoas/${p.id}`} className="employee-link" style={{ textDecoration: 'none', color: 'var(--primary-color)' }}>
                          {p.name || "-"}
                        </Link>
                        {p.ativo === false && <span style={{ marginLeft: "8px", background: "#fee2e2", color: "#ef4444", fontSize: "11px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold" }}>Inativo</span>}
                      </td>
                      <td>{p.email || "-"}</td>
                      <td>{p.data_registro ? p.data_registro.split('-').reverse().join('/') : "-"}</td>
                      {isAdmin && (
                        <>
                          <td style={{ textAlign: "center" }}>
                            {tempoFormatado}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {diasDesdeRegistro !== null ? (
                              <div 
                                style={{ position: "relative", display: "inline-block", zIndex: diasDesdeRegistro <= 90 ? 10 : 1 }}
                                onMouseEnter={(e) => {
                                  const tooltip = e.currentTarget.querySelector('.experiencia-tooltip') as HTMLElement;
                                  if (tooltip) {
                                    tooltip.style.opacity = '1';
                                    tooltip.style.visibility = 'visible';
                                    tooltip.style.transform = 'translateX(-50%) translateY(0)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  const tooltip = e.currentTarget.querySelector('.experiencia-tooltip') as HTMLElement;
                                  if (tooltip) {
                                    tooltip.style.opacity = '0';
                                    tooltip.style.visibility = 'hidden';
                                    tooltip.style.transform = 'translateX(-50%) translateY(5px)';
                                  }
                                }}
                              >
                                <span style={{
                                  padding: "6px 12px",
                                  borderRadius: "8px",
                                  fontSize: "0.85rem",
                                  fontWeight: "bold",
                                  backgroundColor: diasDesdeRegistro <= 45 ? "#ffedd5" : (diasDesdeRegistro <= 90 ? "#fee2e2" : "#dcfce7"),
                                  color: diasDesdeRegistro <= 45 ? "#c2410c" : (diasDesdeRegistro <= 90 ? "#b91c1c" : "#15803d"),
                                  border: `1px solid ${diasDesdeRegistro <= 45 ? "#fed7aa" : (diasDesdeRegistro <= 90 ? "#fecaca" : "#bbf7d0")}`,
                                  display: "inline-flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: "2px",
                                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                  cursor: diasDesdeRegistro <= 90 ? "help" : "default"
                                }}>
                                  <span style={{ letterSpacing: "0.3px" }}>{statusContrato}</span>
                                  {diasRestantes !== null && (
                                    <span style={{ 
                                      fontSize: "0.75rem", 
                                      fontWeight: "600", 
                                      opacity: 0.85,
                                      backgroundColor: "rgba(255,255,255,0.5)",
                                      padding: "2px 6px",
                                      borderRadius: "4px",
                                      marginTop: "2px"
                                    }}>
                                      Faltam {diasRestantes} {diasRestantes === 1 ? 'dia' : 'dias'}
                                    </span>
                                  )}
                                </span>
                                
                                {diasDesdeRegistro <= 90 && (
                                  <div 
                                    className="experiencia-tooltip" 
                                    style={{
                                      position: "absolute",
                                      bottom: "100%",
                                      left: "50%",
                                      transform: "translateX(-50%) translateY(5px)",
                                      marginBottom: "10px",
                                      backgroundColor: "#1e293b",
                                      color: "white",
                                      padding: "12px 16px",
                                      borderRadius: "8px",
                                      width: "max-content",
                                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
                                      opacity: 0,
                                      visibility: "hidden",
                                      pointerEvents: "none",
                                      transition: "all 0.2s ease-out"
                                    }}
                                  >
                                    <div style={{ fontSize: "0.95rem", fontWeight: "bold", marginBottom: "8px", color: "#f8fafc", textAlign: "left" }}>Fim do Período de Experiência</div>
                                    <div style={{ fontSize: "0.85rem", display: "flex", justifyContent: "space-between", gap: "24px", color: "#cbd5e1" }}>
                                      <span>1ª Etapa (45 dias):</span>
                                      <span style={{ fontWeight: "bold", color: "#fed7aa" }}>{dataFim1}</span>
                                    </div>
                                    <div style={{ fontSize: "0.85rem", display: "flex", justifyContent: "space-between", gap: "24px", color: "#cbd5e1", marginTop: "6px" }}>
                                      <span>2ª Etapa (90 dias):</span>
                                      <span style={{ fontWeight: "bold", color: "#fca5a5" }}>{dataFim2}</span>
                                    </div>
                                    {/* Seta do tooltip */}
                                    <div style={{
                                      position: "absolute",
                                      top: "100%",
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                      borderWidth: "6px",
                                      borderStyle: "solid",
                                      borderColor: "#1e293b transparent transparent transparent"
                                    }}></div>
                                  </div>
                                )}
                              </div>
                            ) : "-"}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: "bold", color: (p.feriadosAbertos || 0) > 0 ? "#ef4444" : "inherit" }}>
                            {p.feriadosAbertos || 0}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Funcionarios;
