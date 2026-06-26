import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import { useAuth } from "../AuthProvider";
import supabase from "../services/supabase-client";
import "../css/Frequencia.css";

const DENOMINATIONS = [
  { value: 200.00, label: "R$ 200,00", key: "200" },
  { value: 100.00, label: "R$ 100,00", key: "100" },
  { value: 50.00, label: "R$ 50,00", key: "50" },
  { value: 20.00, label: "R$ 20,00", key: "20" },
  { value: 10.00, label: "R$ 10,00", key: "10" },
  { value: 5.00, label: "R$ 5,00", key: "5" },
  { value: 2.00, label: "R$ 2,00", key: "2" },
  { value: 1.00, label: "R$ 1,00", key: "1" },
  { value: 0.50, label: "R$ 0,50", key: "0.5" },
  { value: 0.25, label: "R$ 0,25", key: "0.25" },
  { value: 0.10, label: "R$ 0,10", key: "0.1" },
  { value: 0.05, label: "R$ 0,05", key: "0.05" },
  { value: 0.01, label: "R$ 0,01", key: "0.01" }
];

function CaixaDinheiro() {
  const { isAdmin, user } = useAuth();

  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [profilesMap, setProfilesMap] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [formData, setFormData] = useState({
    data: getToday(),
    descricao: ""
  });

  // Quantities currently being typed in the inputs (Right panel)
  const [inputQuantities, setInputQuantities] = useState<{ [key: string]: string }>(() => {
    const init: { [key: string]: string } = {};
    DENOMINATIONS.forEach(d => {
      init[d.key] = "";
    });
    return init;
  });

  // Fetch Profiles Map
  useEffect(() => {
    async function fetchProfiles() {
      try {
        const { data } = await supabase.from("profiles").select("id, name");
        if (data) {
          const map: { [key: string]: string } = {};
          data.forEach(p => {
            map[p.id] = p.name || "";
          });
          setProfilesMap(map);
        }
      } catch (err) {
        console.error("Erro ao buscar perfis:", err);
      }
    }
    fetchProfiles();
  }, []);

  // Fetch Caixa Dinheiro Lancamentos
  const fetchCaixaLancamentos = useCallback(async () => {
    try {
      setLoading(true);
      let list: any[] = [];
      let from = 0;
      const step = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from("caixa_dinheiro_lancamentos")
          .select("*")
          .order("data", { ascending: false })
          .order("created_at", { ascending: false })
          .range(from, from + step - 1);

        if (error) throw error;

        if (data && data.length > 0) {
          list = [...list, ...data];
          from += step;
          if (data.length < step) hasMore = false;
        } else {
          hasMore = false;
        }
      }

      setLancamentos(list);
    } catch (err) {
      console.error("Erro ao buscar lançamentos detalhados de caixa:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && isAdmin) {
      fetchCaixaLancamentos();
    }
  }, [fetchCaixaLancamentos, user, isAdmin]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase.channel('realtime-caixa-detalhado')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'caixa_dinheiro_lancamentos' },
        () => {
          fetchCaixaLancamentos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCaixaLancamentos]);

  // Calculate current running balance counts for Left panel
  const calculatedCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    DENOMINATIONS.forEach(d => {
      counts[d.key] = 0;
    });

    lancamentos.forEach(l => {
      const qMap = l.valores_json || {};
      const mult = l.tipo === "entrada" ? 1 : -1;

      Object.keys(qMap).forEach(k => {
        const qty = Number(qMap[k]) || 0;
        if (counts[k] !== undefined) {
          counts[k] += (qty * mult);
        }
      });
    });

    return counts;
  }, [lancamentos]);

  // Total value for left panel
  const columnTotal = React.useMemo(() => {
    let total = 0;

    DENOMINATIONS.forEach(d => {
      const qty = calculatedCounts[d.key] || 0;
      total += (qty * d.value);
    });

    return total;
  }, [calculatedCounts]);

  // Calculate current sum on the input form (Right panel)
  const currentInputSum = React.useMemo(() => {
    let sum = 0;
    DENOMINATIONS.forEach(d => {
      const qty = parseInt(inputQuantities[d.key] || "0", 10) || 0;
      sum += (qty * d.value);
    });
    return sum;
  }, [inputQuantities]);

  const handleQtyChange = (key: string, val: string) => {
    // Only digits
    const cleaned = val.replace(/\D/g, "");
    setInputQuantities(prev => ({
      ...prev,
      [key]: cleaned
    }));
  };

  const handleResetInputs = () => {
    const cleared: { [key: string]: string } = {};
    DENOMINATIONS.forEach(d => {
      cleared[d.key] = "";
    });
    setInputQuantities(cleared);
    setFormData(prev => ({ ...prev, descricao: "" }));
  };

  const handleRegisterMovement = async (tipo: "entrada" | "saida") => {
    if (!formData.descricao) {
      alert("Por favor, preencha a descrição do lançamento.");
      return;
    }

    if (currentInputSum <= 0) {
      alert("Por favor, informe a quantidade de pelo menos uma nota ou moeda.");
      return;
    }

    try {
      setSubmitting(true);

      const jsonQuantities: { [key: string]: number } = {};
      DENOMINATIONS.forEach(d => {
        const qty = parseInt(inputQuantities[d.key] || "0", 10) || 0;
        if (qty > 0) {
          jsonQuantities[d.key] = qty;
        }
      });

      // 1. Insert into caixa_dinheiro_lancamentos
      const caixaPayload = {
        data: formData.data,
        descricao: formData.descricao,
        tipo: tipo,
        valores_json: jsonQuantities,
        valor_total: currentInputSum,
        user_id: user?.id
      };

      const { data: insertedRows, error: errCaixa } = await supabase
        .from("caixa_dinheiro_lancamentos")
        .insert([caixaPayload])
        .select();

      if (errCaixa) throw errCaixa;

      const caixaId = insertedRows?.[0]?.id;

      // 2. Insert corresponding record into lancamentos_financeiros
      // If it's a saida, valor is negative; if entrada, positive.
      const valFinal = tipo === "saida" ? -Math.abs(currentInputSum) : Math.abs(currentInputSum);
      const financeiroPayload = {
        data: formData.data,
        descricao: `${formData.descricao} (Ref Caixa: ${caixaId})`,
        valor: valFinal,
        conta: "Caixa Dinheiro",
        categoria: "Ajuste de Caixa",
        user_id: user?.id,
        status_revisao: null
      };

      const { error: errFin } = await supabase
        .from("lancamentos_financeiros")
        .insert([financeiroPayload]);

      if (errFin) {
        console.error("Erro ao sincronizar com lançamentos financeiros:", errFin);
      }

      handleResetInputs();
      fetchCaixaLancamentos();
      alert("Lançamento de caixa registrado e sincronizado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao registrar lançamento de caixa:", err);
      alert("Erro ao registrar lançamento de caixa.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta movimentação de caixa? Isso também reverterá a soma no controle financeiro geral.")) {
      try {
        setLoading(true);

        // Delete from caixa_dinheiro_lancamentos
        const { error: errCaixa } = await supabase
          .from("caixa_dinheiro_lancamentos")
          .delete()
          .eq("id", id);

        if (errCaixa) throw errCaixa;

        // Delete from lancamentos_financeiros linked by ID
        const { error: errFin } = await supabase
          .from("lancamentos_financeiros")
          .delete()
          .eq("conta", "Caixa Dinheiro")
          .like("descricao", `% (Ref Caixa: ${id})`);

        if (errFin) {
          console.error("Erro ao excluir lançamento financeiro correspondente:", errFin);
        }

        fetchCaixaLancamentos();
        alert("Lançamento removido com sucesso!");
      } catch (err) {
        console.error("Erro ao excluir lançamento:", err);
        alert("Erro ao excluir lançamento.");
      } finally {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (val: number) => {
    return `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
        <h2>Acesso Negado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Caixa Físico - Cédulas e Moedas</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Caixa Físico - Cédulas e Moedas</h1>
            <p>Controle do saldo físico de dinheiro e lançamento detalhado de entradas e saídas.</p>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-start" }}>
            
            {/* PAINEL ESQUERDO: CONTADOR DE SALDO FÍSICO */}
            <div style={{ flex: "1 1 450px", backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <h2 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.8rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsCalculatorFill style={{ color: "var(--primary-color)" }} />
                Saldo Físico Atual
              </h2>
              
              <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
                <table className="freq-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "10px" }}>Notas e Moedas</th>
                      <th style={{ textAlign: "center", padding: "10px" }}>Quantidade</th>
                      <th style={{ textAlign: "right", padding: "10px" }}>Soma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DENOMINATIONS.map(d => {
                      const qty = calculatedCounts[d.key] || 0;
                      const sumRow = qty * d.value;

                      return (
                        <tr key={d.key} style={{ borderBottom: "1px solid #e2e8f0" }}>
                          <td style={{ padding: "8px 10px", fontWeight: 600, color: "#475569" }}>{d.label}</td>
                          <td style={{ padding: "8px 10px", textAlign: "center", fontWeight: "bold", color: qty !== 0 ? "#1e293b" : "#94a3b8" }}>{qty}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: "bold", color: sumRow !== 0 ? "#10b981" : "#94a3b8" }}>
                            {formatCurrency(sumRow)}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Linha de Total */}
                    <tr style={{ backgroundColor: "#f8fafc", fontWeight: "bold", borderTop: "2px solid #cbd5e1" }}>
                      <td style={{ padding: "14px 10px", fontSize: "1.4rem" }}>TOTAL</td>
                      <td style={{ padding: "14px 10px", textAlign: "center" }}></td>
                      <td style={{ padding: "14px 10px", textAlign: "right", fontSize: "1.5rem", color: "var(--primary-color)" }}>
                        {formatCurrency(columnTotal)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAINEL DIREITO: LANÇADOR DE ENTRADAS E SAÍDAS */}
            <div style={{ flex: "1.2 1 500px", backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <h2 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.8rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsArrowLeftRight style={{ color: "#f59e0b" }} />
                Lançador de Movimentações
              </h2>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
                
                <div style={{ flex: "1 1 150px" }}>
                  <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Data</label>
                  <input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", height: "46px", fontSize: "1.4rem" }}
                  />
                </div>

                <div style={{ flex: "2 1 300px" }}>
                  <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Descrição / Motivo</label>
                  <input
                    type="text"
                    placeholder="Ex: Troco p/ Loja, Vendas Pix em espécie"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", height: "46px", fontSize: "1.4rem" }}
                  />
                </div>

              </div>

              {/* Tabela de entrada de quantidades */}
              <div className="freq-table-wrapper" style={{ overflowY: "auto", maxHeight: "350px", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "4px" }}>
                <table className="freq-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc" }}>
                      <th style={{ textAlign: "left", padding: "10px" }}>Notas e Moedas</th>
                      <th style={{ textAlign: "center", padding: "10px", width: "120px" }}>Quantidade</th>
                      <th style={{ textAlign: "right", padding: "10px", width: "150px" }}>Soma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DENOMINATIONS.map(d => {
                      const qtyVal = parseInt(inputQuantities[d.key] || "0", 10) || 0;
                      const rowVal = qtyVal * d.value;

                      return (
                        <tr key={d.key} style={{ borderBottom: "1px solid #cbd5e1" }}>
                          <td style={{ padding: "6px 10px", fontWeight: 600, color: "#475569" }}>{d.label}</td>
                          <td style={{ padding: "4px 10px", textAlign: "center" }}>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="0"
                              value={inputQuantities[d.key]}
                              onChange={(e) => handleQtyChange(d.key, e.target.value)}
                              style={{ width: "80px", padding: "6px", textAlign: "center", borderRadius: "4px", border: "1px solid #cbd5e1", fontWeight: "bold" }}
                            />
                          </td>
                          <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: "bold", color: rowVal > 0 ? "var(--primary-color)" : "#94a3b8" }}>
                            {formatCurrency(rowVal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totalizador do Lançador e Botões */}
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "#fef3c7", borderRadius: "8px", border: "1px solid #fde68a" }}>
                  <span style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#92400e" }}>TOTAL A LANÇAR:</span>
                  <span style={{ fontSize: "2rem", fontWeight: "800", color: "#b45309" }}>{formatCurrency(currentInputSum)}</span>
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={handleResetInputs}
                    style={{
                      height: "50px",
                      padding: "0 20px",
                      backgroundColor: "#e2e8f0",
                      color: "#475569",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1.3rem"
                    }}
                  >
                    Limpar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRegisterMovement("entrada")}
                    disabled={submitting || currentInputSum <= 0}
                    style={{
                      height: "50px",
                      padding: "0 20px",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: (submitting || currentInputSum <= 0) ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <Icons.BsPlusCircleFill /> Entrada de Caixa
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRegisterMovement("saida")}
                    disabled={submitting || currentInputSum <= 0}
                    style={{
                      height: "50px",
                      padding: "0 20px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: (submitting || currentInputSum <= 0) ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <Icons.BsDashCircleFill /> Saída de Caixa
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* HISTÓRICO DE LANÇAMENTOS */}
          <div style={{ marginTop: "32px" }}>
            <h2 style={{ fontSize: "1.8rem", color: "#334155", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.BsListUl /> Histórico de Lançamentos
            </h2>

            <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              {loading ? (
                <div style={{ padding: "40px", textAlign: "center", fontSize: "1.4rem", color: "#64748b" }}>Carregando histórico...</div>
              ) : (
                <table className="freq-table" style={{ width: "100%", minWidth: "850px" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "120px", textAlign: "center" }}>Data</th>
                      <th style={{ textAlign: "left" }}>Descrição</th>
                      <th style={{ width: "120px", textAlign: "center" }}>Operação</th>
                      <th style={{ width: "150px", textAlign: "right" }}>Valor Total</th>
                      {isAdmin && <th style={{ width: "150px", textAlign: "center" }}>Registrado por</th>}
                      <th style={{ width: "80px", textAlign: "center" }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lancamentos.map((l) => {
                      const isSaida = l.tipo === "saida";
                      return (
                        <tr key={l.id}>
                          <td style={{ textAlign: "center" }}>
                            {l.data ? new Date(l.data + "T00:00:00").toLocaleDateString("pt-BR") : "-"}
                          </td>
                          <td style={{ fontWeight: 500 }}>{l.descricao}</td>
                          <td style={{ textAlign: "center" }}>
                            <span style={{
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "1.1rem",
                              fontWeight: "bold",
                              backgroundColor: isSaida ? "#fef2f2" : "#f0fdf4",
                              color: isSaida ? "#ef4444" : "#10b981"
                            }}>
                              {isSaida ? "Saída (-)" : "Entrada (+)"}
                            </span>
                          </td>
                          <td style={{ textAlign: "right", fontWeight: "bold", color: isSaida ? "#ef4444" : "#10b981" }}>
                            {formatCurrency(l.valor_total)}
                          </td>
                          {isAdmin && (
                            <td style={{ textAlign: "center", fontSize: "1.1rem", color: "#64748b" }}>
                              {profilesMap[l.user_id] || "-"}
                            </td>
                          )}
                          <td style={{ textAlign: "center" }}>
                            <button
                              onClick={() => handleDelete(l.id)}
                              style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 0, fontSize: "1.3rem" }}
                              title="Excluir Lançamento"
                            >
                              <Icons.BsTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {lancamentos.length === 0 && (
                      <tr>
                        <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                          Nenhum lançamento no histórico.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default CaixaDinheiro;
