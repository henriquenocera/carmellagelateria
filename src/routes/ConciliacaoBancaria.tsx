import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import "../css/Frequencia.css";

function ConciliacaoBancaria() {
  const [contas, setContas] = useState<any[]>([]);
  const [saldosCalculados, setSaldosCalculados] = useState<{ [conta: string]: number }>({});
  const [saldosBanco, setSaldosBanco] = useState<{ [conta: string]: string }>({});
  
  const [loadingContas, setLoadingContas] = useState(true);
  const [loadingBalances, setLoadingBalances] = useState(false);

  // Default to today
  const [dataFiltro, setDataFiltro] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  // Fetch Contas on mount
  useEffect(() => {
    async function fetchContas() {
      try {
        const { data: contasData, error: contasError } = await supabase
          .from("contas")
          .select("id, banco, agencia, conta_corrente, descricao")
          .eq("ativo", true)
          .order("banco", { ascending: true });

        if (contasError) throw contasError;

        const contasFormatadas = (contasData || [])
          .map(c => {
            const label = [c.banco, c.agencia, c.conta_corrente].filter(Boolean).join(" - ");
            const displayLabel = [c.descricao, c.banco, c.conta_corrente].filter(Boolean).join(" - ");
            return { ...c, label, displayLabel };
          })
          .filter(c => {
            const isCaixa = 
              (c.banco && c.banco.toLowerCase().includes("caixa dinheiro")) ||
              (c.descricao && c.descricao.toLowerCase().includes("caixa dinheiro")) ||
              (c.label && c.label.toLowerCase().includes("caixa dinheiro"));
            return !isCaixa;
          });

        setContas(contasFormatadas);
      } catch (error) {
        console.error("Erro ao buscar contas:", error);
      } finally {
        setLoadingContas(false);
      }
    }

    fetchContas();
  }, []);

  // Fetch balances when date or contas change
  useEffect(() => {
    async function computeBalances() {
      if (contas.length === 0 || !dataFiltro) return;
      setLoadingBalances(true);

      try {
        const fetchAllLancamentos = async () => {
          let list: any[] = [];
          let from = 0;
          const step = 1000;
          let hasMore = true;
          while (hasMore) {
            const { data, error } = await supabase
              .from("lancamentos_financeiros")
              .select("conta, valor, status_revisao")
              .lte("data", dataFiltro)
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
          return list;
        };

        const lancamentosData = await fetchAllLancamentos();

        const balances: { [conta: string]: number } = {};
        const displayToLabelMap: { [display: string]: string } = {};
        
        contas.forEach(c => {
          balances[c.label] = 0;
          if (c.displayLabel) {
            displayToLabelMap[c.displayLabel] = c.label;
          }
        });

        if (lancamentosData) {
          lancamentosData.forEach((l: any) => {
            if (l.status_revisao === 'pending_delete') return;

            if (l.conta) {
              let targetKey: string | undefined = undefined;
              if (balances[l.conta] !== undefined) {
                targetKey = l.conta;
              } else if (displayToLabelMap[l.conta] !== undefined) {
                targetKey = displayToLabelMap[l.conta];
              }

              if (targetKey !== undefined) {
                balances[targetKey] += parseFloat(l.valor || 0);
              }
            }
          });
        }

        setSaldosCalculados(balances);
      } catch (error) {
        console.error("Erro ao calcular saldos:", error);
      } finally {
        setLoadingBalances(false);
      }
    }

    computeBalances();
  }, [dataFiltro, contas]);

  // Load Saldos from LocalStorage when date changes
  useEffect(() => {
    if (!dataFiltro) return;
    const saved = localStorage.getItem(`saldos_banco_${dataFiltro}`);
    if (saved) {
      try {
        setSaldosBanco(JSON.parse(saved));
      } catch {
        setSaldosBanco({});
      }
    } else {
      setSaldosBanco({});
    }
  }, [dataFiltro]);

  const handleSaldoBancoChange = (contaLabel: string, value: string) => {
    setSaldosBanco(prev => {
      const next = { ...prev, [contaLabel]: value };
      localStorage.setItem(`saldos_banco_${dataFiltro}`, JSON.stringify(next));
      return next;
    });
  };

  const renderStatus = (contaLabel: string) => {
    const calculado = saldosCalculados[contaLabel] || 0;
    const informadoStr = saldosBanco[contaLabel];
    
    if (!informadoStr || informadoStr.trim() === "") {
      return <span style={{ color: "var(--text-secondary)" }}>Aguardando...</span>;
    }

    const informado = parseFloat(informadoStr.replace(",", "."));
    
    if (Math.abs(calculado - informado) < 0.01) {
      return (
        <span style={{
          background: "#dcfce7",
          color: "#15803d",
          padding: "4px 8px",
          borderRadius: "12px",
          fontWeight: "bold",
          fontSize: "1.2rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px"
        }}>
          <Icons.BsCheckCircleFill /> Correto
        </span>
      );
    } else {
      const diferenca = calculado - informado;
      return (
        <span style={{
          background: "#fee2e2",
          color: "#b91c1c",
          padding: "4px 8px",
          borderRadius: "12px",
          fontWeight: "bold",
          fontSize: "1.2rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px"
        }} title={`Diferença de R$ ${Math.abs(diferenca).toFixed(2)}`}>
          <Icons.BsXCircleFill /> Incorreto
        </span>
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>Conciliação Bancária</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Conciliação Bancária</h1>
            <p>Verifique se o saldo do sistema bate com o saldo real no banco até a data selecionada.</p>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          
          {/* Controls / Filter Area */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "flex-end" }}>
            <div style={{ flex: "0 0 200px" }}>
              <label style={{ display: "block", fontSize: "1.3rem", color: "var(--text-secondary)", marginBottom: "4px", fontWeight: "bold" }}>
                Data de Corte
              </label>
              <input
                type="date"
                value={dataFiltro}
                onChange={(e) => setDataFiltro(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color)",
                  textAlign: "center",
                  height: "54px",
                  fontSize: "1.4rem"
                }}
              />
            </div>
          </div>

          <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
            <table className="freq-table" style={{ width: "100%", minWidth: "600px", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "16px" }}>Conta Bancária</th>
                  <th style={{ textAlign: "center", padding: "16px", width: "180px" }}>Saldo Calculado</th>
                  <th style={{ textAlign: "center", padding: "16px", width: "200px" }}>Saldo no Banco (R$)</th>
                  <th style={{ textAlign: "center", padding: "16px", width: "150px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingContas ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "32px", color: "var(--text-secondary)", fontSize: "1.4rem" }}>
                      Carregando contas...
                    </td>
                  </tr>
                ) : contas.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "32px", color: "var(--text-secondary)", fontSize: "1.4rem" }}>
                      Nenhuma conta ativa encontrada.
                    </td>
                  </tr>
                ) : (
                  contas.map((conta, index) => {
                    const saldoCalc = saldosCalculados[conta.label] || 0;
                    return (
                      <tr key={index} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <td style={{ padding: "16px", fontWeight: "bold", color: "var(--text-primary)", fontSize: "1.3rem" }}>
                          {conta.displayLabel || conta.label}
                        </td>
                        <td style={{ padding: "16px", textAlign: "center", fontSize: "1.4rem", fontWeight: "bold", color: loadingBalances ? "#94a3b8" : (saldoCalc < 0 ? "#ef4444" : "#10b981") }}>
                          {loadingBalances ? "Calculando..." : `R$ ${saldoCalc.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                        </td>
                        <td style={{ padding: "16px", textAlign: "center" }}>
                          <input
                            type="number"
                            step="0.01"
                            className="no-spinner"
                            placeholder="0.00"
                            value={saldosBanco[conta.label] || ""}
                            onChange={(e) => handleSaldoBancoChange(conta.label, e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px",
                              borderRadius: "4px",
                              border: "1px solid var(--border-color)",
                              textAlign: "center",
                              fontSize: "1.3rem",
                              height: "40px"
                            }}
                          />
                        </td>
                        <td style={{ padding: "16px", textAlign: "center" }}>
                          {loadingBalances ? <span style={{ color: "var(--text-secondary)" }}>...</span> : renderStatus(conta.label)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConciliacaoBancaria;
