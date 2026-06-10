import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import * as Icons from "react-icons/bs";
import "../css/CadastroPessoas.css";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";

interface Profile {
  id: string;
  short_id: string | null;
  name: string;
  email: string;
  ativo?: boolean | null;
  data_registro?: string | null;
  feriadosAbertos?: number;
  total_vales?: number;
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

      const { data: feriadosGlobaisData, error: fgError } = await supabase
        .from("feriados_globais")
        .select("date");

      if (fgError) throw fgError;

      const todayStr = new Date().toISOString().split("T")[0];
      const pastFeriados = (feriadosGlobaisData || []).filter((f: any) => f.date <= todayStr).map((f: any) => f.date);

      let freqData: any[] = [];
      if (pastFeriados.length > 0) {
        const { data: fData, error: fError } = await supabase
          .from("frequencia")
          .select("employee_id, date, status")
          .in("date", pastFeriados);
        if (fError) throw fError;
        freqData = fData || [];
      }

      const { data: feriadosData, error: feriadosError } = await supabase
        .from("feriados_trabalhados")
        .select("employee_id, data_feriado, data_folga, pago_em_dobro");

      if (feriadosError) throw feriadosError;

      // Buscar todos os vales usando paginação para garantir a soma correta (burlar o limite de 1000 do Supabase)
      let allValesData: any[] = [];
      let from = 0;
      const step = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data: vData, error: vError } = await supabase
          .from("Vales")
          .select("Nome, valor, Item, created_at")
          .range(from, from + step - 1);

        if (vError) throw vError;

        if (vData && vData.length > 0) {
          allValesData = [...allValesData, ...vData];
          from += step;
          if (vData.length < step) hasMore = false;
        } else {
          hasMore = false;
        }
      }

      const valesData = allValesData;

      const freqByEmpDate: Record<string, Record<string, string>> = {};
      freqData.forEach((f: any) => {
        if (!freqByEmpDate[f.employee_id]) freqByEmpDate[f.employee_id] = {};
        freqByEmpDate[f.employee_id][f.date] = f.status;
      });

      const feriadosTrabalhadosMap: Record<string, Record<string, any>> = {};
      (feriadosData || []).forEach((f: any) => {
        if (!feriadosTrabalhadosMap[f.employee_id]) feriadosTrabalhadosMap[f.employee_id] = {};
        feriadosTrabalhadosMap[f.employee_id][f.data_feriado] = f;
      });

      const feriadosAbertosCount: Record<string, number> = {};
      (profilesData || []).forEach((p: any) => {
        let abertos = 0;
        pastFeriados.forEach(fDate => {
          if (p.data_registro && fDate < p.data_registro) return;

          let freqStatus = freqByEmpDate[p.id]?.[fDate];
          if (!freqStatus) {
            const [y, m, d] = fDate.split("-");
            const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
            const fixedOffDays = p.folgas_fixas ? p.folgas_fixas.split(",") : [];
            const dayOfWeek = String(dateObj.getDay());
            freqStatus = fixedOffDays.includes(dayOfWeek) ? "Folga Fixa Semanal" : "Trabalhado";
          }

          if (freqStatus === "Trabalhado") {
            const ft = feriadosTrabalhadosMap[p.id]?.[fDate];
            const compensado = ft && (ft.data_folga || ft.pago_em_dobro);
            if (!compensado) {
              abertos++;
            }
          }
        });
        feriadosAbertosCount[p.id] = abertos;
      });

      const valesList: Record<string, any[]> = {};
      (valesData || []).forEach((v: any) => {
        if (!valesList[v.Nome]) valesList[v.Nome] = [];
        valesList[v.Nome].push(v);
      });

      const sorted = (profilesData || []).map((p: any) => {
        const firstName = p.name ? p.name.split(" ")[0] : "";
        const employeeVales = valesList[p.name] || valesList[firstName] || [];

        let sum = 0;
        employeeVales.forEach((v: any) => {
          if (p.data_registro && v.created_at) {
            const valeDateStr = v.created_at.split('T')[0];
            if (valeDateStr >= p.data_registro) {
              sum += Number(v.valor) || 0;
            }
          } else {
            sum += Number(v.valor) || 0;
          }
        });

        return {
          ...p,
          feriadosAbertos: feriadosAbertosCount[p.id] || 0,
          total_vales: sum
        };
      }).sort((a: any, b: any) => {
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
                      <th style={{ textAlign: "center", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                          <span style={{ background: "#fef3c7", color: "#d97706", fontSize: "11px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold", width: "fit-content" }}>Admin</span>
                          <span>Saldo de Vales</span>
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
                          <td style={{ textAlign: "center", fontWeight: "bold", color: (p.total_vales && p.total_vales < 0) ? "#ef4444" : (p.total_vales && p.total_vales > 0) ? "#22c55e" : "inherit" }}>
                            {p.total_vales !== undefined && p.total_vales !== null ? `${p.total_vales > 0 ? '+' : p.total_vales < 0 ? '-' : ''} R$ ${Math.abs(Number(p.total_vales)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "R$ 0,00"}
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
