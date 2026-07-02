import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "../AuthProvider";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DashboardFinanceiro() {
  const { isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saldosContas, setSaldosContas] = useState<any[]>([]);
  const [saldoTotal, setSaldoTotal] = useState(0);

  const [allLancamentos, setAllLancamentos] = useState<any[]>([]);
  const [allPendentes, setAllPendentes] = useState<any[]>([]);

  const [mesFiltro, setMesFiltro] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const [pagarReceberStatus, setPagarReceberStatus] = useState({
    aPagar: { total: 0, vencido: 0, hoje: 0, proximos: 0, proximos14: 0, proximos21: 0, proximos30: 0 },
    aReceber: { total: 0, vencido: 0, hoje: 0, proximos: 0, proximos14: 0, proximos21: 0, proximos30: 0 }
  });

  const [modalDetails, setModalDetails] = useState<{ title: string; color: string; items: any[] } | null>(null);

  const getLocalDateString = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (!isAdmin) return;
      try {
        const today = new Date();
        const todayStr = getLocalDateString(today);
        const todayZero = new Date(todayStr + "T00:00:00");

        const fetchAllLancamentos = async () => {
          let list: any[] = [];
          let from = 0;
          const step = 1000;
          let hasMore = true;
          while (hasMore) {
            const { data, error } = await supabase
              .from("lancamentos_financeiros")
              .select("conta, valor, status_revisao, data, categoria")
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

        const fetchAllCaixaLancamentos = async () => {
          let list: any[] = [];
          let from = 0;
          const step = 1000;
          let hasMore = true;
          while (hasMore) {
            const { data, error } = await supabase
              .from("caixa_dinheiro_lancamentos")
              .select("tipo, valor_total, data")
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

        const [contasRes, lancamentosData, pendentesRes, caixaLancamentosData] = await Promise.all([
          supabase.from("contas").select("id, banco, agencia, conta_corrente, descricao").eq("ativo", true).order("banco", { ascending: true }),
          fetchAllLancamentos(),
          supabase.from("contas_pagar_receber").select("data, valor, categoria, descricao"),
          fetchAllCaixaLancamentos()
        ]);

        const contasData = contasRes.data || [];
        const pendentesData = pendentesRes.data || [];

        // Calcular Saldos das Contas
        const balancesMap: { [label: string]: number } = {};
        const displayMap: { [label: string]: string } = {};
        const displayToLabelMap: { [display: string]: string } = {};
        let caixaKey: string | null = null;

        contasData.forEach(c => {
          const label = [c.banco, c.agencia, c.conta_corrente].filter(Boolean).join(" - ");
          const displayLabel = [c.descricao, c.banco, c.conta_corrente].filter(Boolean).join(" - ");
          balancesMap[label] = 0;
          displayMap[label] = displayLabel;
          displayToLabelMap[displayLabel] = label;

          // Check if this account corresponds to the physical cash box "Caixa Dinheiro"
          const isCaixa =
            (c.banco && c.banco.toLowerCase().includes("caixa dinheiro")) ||
            (c.descricao && c.descricao.toLowerCase().includes("caixa dinheiro")) ||
            (label && label.toLowerCase().includes("caixa dinheiro"));
          if (isCaixa) {
            caixaKey = label;
          }
        });

        lancamentosData.forEach(l => {
          if (l.status_revisao === 'pending_delete') return;
          // Somar apenas para saldos das contas o que for <= hoje
          if (l.data && l.data <= todayStr && l.conta) {
            let targetKey: string | undefined = undefined;
            if (balancesMap[l.conta] !== undefined) {
              targetKey = l.conta;
            } else if (displayToLabelMap[l.conta] !== undefined) {
              targetKey = displayToLabelMap[l.conta];
            }

            if (targetKey !== undefined) {
              balancesMap[targetKey] += parseFloat(l.valor || 0);
            }
          }
        });

        // Calcular Saldo do Caixa Dinheiro
        let caixaBalance = 0;
        if (caixaLancamentosData) {
          caixaLancamentosData.forEach(l => {
            if (l.data && l.data <= todayStr) {
              const mult = l.tipo === "entrada" ? 1 : -1;
              caixaBalance += parseFloat(l.valor_total || 0) * mult;
            }
          });
        }

        // Overwrite existing account card balance if found
        if (caixaKey) {
          balancesMap[caixaKey] = caixaBalance;
        }

        const listSaldos = Object.keys(balancesMap).map(k => ({ label: displayMap[k] || k, valor: balancesMap[k] }));

        // Fallback: only create a separate card if there was no Cash account in accounts list
        if (!caixaKey) {
          listSaldos.push({ label: "Caixa Dinheiro", valor: caixaBalance });
        }

        const sumSaldos = listSaldos.reduce((acc, curr) => acc + curr.valor, 0);

        // Calcular Pagar/Receber
        let aPagar = { total: 0, vencido: 0, hoje: 0, proximos: 0, proximos14: 0, proximos21: 0, proximos30: 0 };
        let aReceber = { total: 0, vencido: 0, hoje: 0, proximos: 0, proximos14: 0, proximos21: 0, proximos30: 0 };

        pendentesData.forEach(p => {
          if (!p.data || !p.valor) return;
          const valor = parseFloat(p.valor);
          if (isNaN(valor)) return;

          const isReceber = valor > 0;
          const targetObj = isReceber ? aReceber : aPagar;
          const absValor = Math.abs(valor);

          targetObj.total += absValor;

          if (p.data < todayStr) {
            targetObj.vencido += absValor;
          } else if (p.data === todayStr) {
            targetObj.hoje += absValor;
          } else {
            const pDate = new Date(p.data + "T00:00:00");
            const diffTime = pDate.getTime() - todayZero.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 7) {
              targetObj.proximos += absValor;
            } else if (diffDays <= 14) {
              targetObj.proximos14 += absValor;
            } else if (diffDays <= 21) {
              targetObj.proximos21 += absValor;
            } else if (diffDays <= 30) {
              targetObj.proximos30 += absValor;
            }
          }
        });

        if (isMounted) {
          setAllLancamentos(lancamentosData);
          setAllPendentes(pendentesData);
          setSaldosContas(listSaldos);
          setSaldoTotal(sumSaldos);
          setPagarReceberStatus({ aPagar, aReceber });
          setLoading(false);
        }

      } catch (err) {
        console.error("Erro ao buscar dados do dashboard financeiro:", err);
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, [isAdmin]);

  const handleShowDetails = (tipo: "PAGAR" | "RECEBER", periodo: "vencido" | "hoje" | "proximos" | "proximos14" | "proximos21" | "proximos30", title: string, color: string) => {
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const todayZero = new Date(todayStr + "T00:00:00");
    const items = allPendentes.filter(p => {
      if (!p.data || !p.valor) return false;
      const val = parseFloat(p.valor);
      if (isNaN(val)) return false;
      if (tipo === "PAGAR" && val > 0) return false;
      if (tipo === "RECEBER" && val < 0) return false;

      if (periodo === "vencido") return p.data < todayStr;
      if (periodo === "hoje") return p.data === todayStr;

      const pDate = new Date(p.data + "T00:00:00");
      const diffTime = pDate.getTime() - todayZero.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (periodo === "proximos") return diffDays > 0 && diffDays <= 7;
      if (periodo === "proximos14") return diffDays > 7 && diffDays <= 14;
      if (periodo === "proximos21") return diffDays > 14 && diffDays <= 21;
      if (periodo === "proximos30") return diffDays > 21 && diffDays <= 30;
      return false;
    });
    setModalDetails({ title, color, items });
  };

  const formatCurrency = (val: number) => {
    return `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const chartData = React.useMemo(() => {
    if (!mesFiltro) return [];
    const [yearStr, monthStr] = mesFiltro.split("-");
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    const daysInMonth = new Date(year, month, 0).getDate();
    const dataMap: any = {};

    for (let i = 1; i <= daysInMonth; i++) {
      const dStr = `${yearStr}-${monthStr}-${String(i).padStart(2, '0')}`;
      dataMap[dStr] = { dia: `${String(i).padStart(2, '0')}/${monthStr}`, receitas: 0, despesas: 0, saldoDia: 0 };
    }

    const isTransferencia = (categoria?: string) => {
      if (!categoria) return false;
      const normalized = categoria
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\./g, "");
      // Como a variável 'normalized' é convertida para minúsculas e remove pontos,
      // a comparação deve ser feita com strings totalmente minúsculas e sem pontuação.
      return normalized === "transferencia entre contas" || normalized === "transf entre contas";
    };

    // Historico confirmado
    allLancamentos.forEach(l => {
      if (l.status_revisao === 'pending_delete' || !l.data || !l.data.startsWith(mesFiltro)) return;
      if (isTransferencia(l.categoria)) return;
      const val = parseFloat(l.valor || 0);
      if (val > 0) dataMap[l.data].receitas += val;
      else if (val < 0) dataMap[l.data].despesas += Math.abs(val);
      dataMap[l.data].saldoDia += val;
    });

    // Pendente / Projetado
    allPendentes.forEach(p => {
      if (!p.data || !p.data.startsWith(mesFiltro)) return;
      if (isTransferencia(p.categoria)) return;
      const val = parseFloat(p.valor || 0);
      if (val > 0) dataMap[p.data].receitas += val;
      else if (val < 0) dataMap[p.data].despesas += Math.abs(val);
      dataMap[p.data].saldoDia += val;
    });

    return Object.values(dataMap);
  }, [mesFiltro, allLancamentos, allPendentes]);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (!mesFiltro) return;
    let [year, month] = mesFiltro.split('-').map(Number);
    if (direction === 'prev') {
      month -= 1;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
    } else {
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
    setMesFiltro(`${year}-${String(month).padStart(2, '0')}`);
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
        <title>Dashboard Financeiro</title>
      </Helmet>

      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <Icons.BsGraphUp style={{ fontSize: "2.8rem", color: "var(--primary-color)" }} />
          <div>
            <h1 style={{ margin: 0, color: "#334155", fontSize: "2.4rem" }}>Dashboard Financeiro</h1>
            <p style={{ margin: 0, color: "#64748b", fontSize: "1.4rem" }}>Visão geral dos saldos e compromissos financeiros</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8", fontSize: "1.6rem" }}>
            Carregando dados financeiros...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

            {/* SALDO TOTAL */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)", borderRadius: "12px", padding: "16px 20px", color: "#fff", boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.4)", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: "-10px", top: "-10px", opacity: 0.1 }}>
                  <Icons.BsWallet2 style={{ fontSize: "80px" }} />
                </div>
                <h2 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", opacity: 0.8, fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsCashCoin /> Saldo Total (Todas as Contas)
                </h2>
                <div style={{ fontSize: "2.2rem", fontWeight: "800", letterSpacing: "-0.5px", zIndex: 1 }}>
                  {formatCurrency(saldoTotal)}
                </div>
              </div>
            </div>

            {/* CONTAS BANCARIAS E CAIXA */}
            <div>
              <h2 style={{ fontSize: "1.5rem", color: "#334155", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsBank /> Saldos por Conta Bancária
              </h2>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                {(() => {
                  const sortedContas = [...saldosContas].sort((a, b) => {
                    const aIsCaixa = a.label.toLowerCase().includes("caixa dinheiro");
                    const bIsCaixa = b.label.toLowerCase().includes("caixa dinheiro");
                    if (aIsCaixa && !bIsCaixa) return -1;
                    if (!aIsCaixa && bIsCaixa) return 1;
                    return 0;
                  });

                  const totalContas = saldosContas
                    .filter(c => !c.label.toLowerCase().includes("caixa dinheiro"))
                    .reduce((acc, curr) => acc + curr.valor, 0);

                  const hasCaixa = sortedContas.some(c => c.label.toLowerCase().includes("caixa dinheiro"));
                  
                  const contasWithTotal = [...sortedContas];
                  const insertIndex = hasCaixa ? 1 : 0;
                  contasWithTotal.splice(insertIndex, 0, { label: "Total - Contas Bancárias", valor: totalContas, isTotal: true } as any);

                  return contasWithTotal.map((c: any, i, arr) => {
                    const isCaixa = c.label.toLowerCase().includes("caixa dinheiro");
                    const isTotal = c.isTotal;
                    
                    return (
                      <div key={i} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 20px",
                        borderBottom: i < arr.length - 1 ? "1px solid #f1f5f9" : "none",
                        background: isCaixa ? "#f0fdf4" : (isTotal ? "#f8fafc" : "transparent"),
                        transition: "background 0.2s"
                      }} onMouseEnter={(e) => e.currentTarget.style.background = isCaixa ? "#dcfce7" : (isTotal ? "#f1f5f9" : "#f8fafc")} onMouseLeave={(e) => e.currentTarget.style.background = isCaixa ? "#f0fdf4" : (isTotal ? "#f8fafc" : "transparent")}>
                        <div style={{ fontSize: "1.2rem", color: isCaixa ? "#16a34a" : (isTotal ? "#3b82f6" : "#64748b"), fontWeight: isCaixa || isTotal ? 700 : 500, display: "flex", alignItems: "center", gap: "6px" }}>
                          {isCaixa ? <Icons.BsSafe style={{ fontSize: "1.4rem" }} /> : (isTotal ? <Icons.BsPiggyBank style={{ fontSize: "1.4rem" }} /> : <Icons.BsBank2 />)} {c.label}
                        </div>
                        <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: isCaixa ? "#16a34a" : (isTotal ? "#3b82f6" : "#64748b") }}>
                          {formatCurrency(c.valor)}
                        </div>
                      </div>
                    );
                  });
                })()}
                {saldosContas.length === 0 && (
                  <div style={{ padding: "16px 20px", color: "#94a3b8", fontSize: "1.2rem" }}>Nenhuma conta encontrada.</div>
                )}
              </div>
            </div>

            {/* CONTAS A PAGAR E RECEBER */}
            <div>
              <h2 style={{ fontSize: "1.8rem", color: "#334155", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsCalendarX /> Compromissos (A Pagar / A Receber)
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>

                {/* A PAGAR */}
                <div style={{ background: "#fff", border: "1px solid #fecaca", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.1)" }}>
                  <div style={{ background: "#fef2f2", padding: "20px", borderBottom: "1px solid #fecaca" }}>
                    <h3 style={{ margin: 0, color: "#b91c1c", fontSize: "1.8rem", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Icons.BsArrowDownCircleFill /> Total a Pagar
                    </h3>
                    <div style={{ fontSize: "3.2rem", fontWeight: "bold", color: "#ef4444", marginTop: "8px" }}>
                      {formatCurrency(pagarReceberStatus.aPagar.total)}
                    </div>
                  </div>
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px", borderRadius: "8px", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"} onClick={() => handleShowDetails("PAGAR", "vencido", "Atrasado (A Pagar)", "#ef4444")}>
                      <span style={{ color: "#ef4444", fontSize: "1.4rem", display: "flex", alignItems: "center" }}>Atrasado: <Icons.BsInfoCircle style={{ marginLeft: "6px", fontSize: "1.1rem" }} /></span>
                      <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "1.5rem" }}>{formatCurrency(pagarReceberStatus.aPagar.vencido)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px", borderRadius: "8px", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"} onClick={() => handleShowDetails("PAGAR", "hoje", "Para Hoje (A Pagar)", "#ef4444")}>
                      <span style={{ color: "#ef4444", fontSize: "1.4rem", display: "flex", alignItems: "center" }}>Para Hoje: <Icons.BsInfoCircle style={{ marginLeft: "6px", fontSize: "1.1rem" }} /></span>
                      <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "1.5rem" }}>{formatCurrency(pagarReceberStatus.aPagar.hoje)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px", borderRadius: "8px", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"} onClick={() => handleShowDetails("PAGAR", "proximos", "Próximos 7 dias (A Pagar)", "#ef4444")}>
                      <span style={{ color: "#ef4444", fontSize: "1.4rem", display: "flex", alignItems: "center" }}>Próximos 7 dias: <Icons.BsInfoCircle style={{ marginLeft: "6px", fontSize: "1.1rem" }} /></span>
                      <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "1.5rem" }}>{formatCurrency(pagarReceberStatus.aPagar.proximos)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px", borderRadius: "8px", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"} onClick={() => handleShowDetails("PAGAR", "proximos14", "Próximos 14 dias (A Pagar)", "#ef4444")}>
                      <span style={{ color: "#ef4444", fontSize: "1.4rem", display: "flex", alignItems: "center" }}>Próximos 14 dias: <Icons.BsInfoCircle style={{ marginLeft: "6px", fontSize: "1.1rem" }} /></span>
                      <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "1.5rem" }}>{formatCurrency(pagarReceberStatus.aPagar.proximos14)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px", borderRadius: "8px", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"} onClick={() => handleShowDetails("PAGAR", "proximos21", "Próximos 21 dias (A Pagar)", "#ef4444")}>
                      <span style={{ color: "#ef4444", fontSize: "1.4rem", display: "flex", alignItems: "center" }}>Próximos 21 dias: <Icons.BsInfoCircle style={{ marginLeft: "6px", fontSize: "1.1rem" }} /></span>
                      <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "1.5rem" }}>{formatCurrency(pagarReceberStatus.aPagar.proximos21)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px", borderRadius: "8px", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"} onClick={() => handleShowDetails("PAGAR", "proximos30", "Próximos 30 dias (A Pagar)", "#ef4444")}>
                      <span style={{ color: "#ef4444", fontSize: "1.4rem", display: "flex", alignItems: "center" }}>Próximos 30 dias: <Icons.BsInfoCircle style={{ marginLeft: "6px", fontSize: "1.1rem" }} /></span>
                      <span style={{ color: "#ef4444", fontWeight: "bold", fontSize: "1.5rem" }}>{formatCurrency(pagarReceberStatus.aPagar.proximos30)}</span>
                    </div>
                  </div>
                </div>

                {/* A RECEBER */}
                <div style={{ background: "#fff", border: "1px solid #bbf7d0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(34, 197, 94, 0.1)" }}>
                  <div style={{ background: "#f0fdf4", padding: "20px", borderBottom: "1px solid #bbf7d0" }}>
                    <h3 style={{ margin: 0, color: "#15803d", fontSize: "1.8rem", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Icons.BsArrowUpCircleFill /> Total a Receber
                    </h3>
                    <div style={{ fontSize: "3.2rem", fontWeight: "bold", color: "#10b981", marginTop: "8px" }}>
                      {formatCurrency(pagarReceberStatus.aReceber.total)}
                    </div>
                  </div>
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px", borderRadius: "8px", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f0fdf4"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"} onClick={() => handleShowDetails("RECEBER", "vencido", "Atrasado (A Receber)", "#10b981")}>
                      <span style={{ color: "#10b981", fontSize: "1.4rem", display: "flex", alignItems: "center" }}>Atrasado: <Icons.BsInfoCircle style={{ marginLeft: "6px", fontSize: "1.1rem" }} /></span>
                      <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "1.5rem" }}>{formatCurrency(pagarReceberStatus.aReceber.vencido)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px", borderRadius: "8px", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f0fdf4"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"} onClick={() => handleShowDetails("RECEBER", "hoje", "Para Hoje (A Receber)", "#10b981")}>
                      <span style={{ color: "#10b981", fontSize: "1.4rem", display: "flex", alignItems: "center" }}>Para Hoje: <Icons.BsInfoCircle style={{ marginLeft: "6px", fontSize: "1.1rem" }} /></span>
                      <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "1.5rem" }}>{formatCurrency(pagarReceberStatus.aReceber.hoje)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px", borderRadius: "8px", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f0fdf4"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"} onClick={() => handleShowDetails("RECEBER", "proximos", "Próximos 7 dias (A Receber)", "#10b981")}>
                      <span style={{ color: "#10b981", fontSize: "1.4rem", display: "flex", alignItems: "center" }}>Próximos 7 dias: <Icons.BsInfoCircle style={{ marginLeft: "6px", fontSize: "1.1rem" }} /></span>
                      <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "1.5rem" }}>{formatCurrency(pagarReceberStatus.aReceber.proximos)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px", borderRadius: "8px", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f0fdf4"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"} onClick={() => handleShowDetails("RECEBER", "proximos14", "Próximos 14 dias (A Receber)", "#10b981")}>
                      <span style={{ color: "#10b981", fontSize: "1.4rem", display: "flex", alignItems: "center" }}>Próximos 14 dias: <Icons.BsInfoCircle style={{ marginLeft: "6px", fontSize: "1.1rem" }} /></span>
                      <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "1.5rem" }}>{formatCurrency(pagarReceberStatus.aReceber.proximos14)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px", borderRadius: "8px", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f0fdf4"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"} onClick={() => handleShowDetails("RECEBER", "proximos21", "Próximos 21 dias (A Receber)", "#10b981")}>
                      <span style={{ color: "#10b981", fontSize: "1.4rem", display: "flex", alignItems: "center" }}>Próximos 21 dias: <Icons.BsInfoCircle style={{ marginLeft: "6px", fontSize: "1.1rem" }} /></span>
                      <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "1.5rem" }}>{formatCurrency(pagarReceberStatus.aReceber.proximos21)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "4px", borderRadius: "8px", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f0fdf4"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"} onClick={() => handleShowDetails("RECEBER", "proximos30", "Próximos 30 dias (A Receber)", "#10b981")}>
                      <span style={{ color: "#10b981", fontSize: "1.4rem", display: "flex", alignItems: "center" }}>Próximos 30 dias: <Icons.BsInfoCircle style={{ marginLeft: "6px", fontSize: "1.1rem" }} /></span>
                      <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "1.5rem" }}>{formatCurrency(pagarReceberStatus.aReceber.proximos30)}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* GRÁFICO DE FLUXO DE CAIXA */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "16px" }}>
                <h2 style={{ fontSize: "1.8rem", color: "#334155", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsBarChartFill style={{ color: "var(--primary-color)" }} /> Fluxo de Caixa Diário
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => handleMonthChange('prev')}
                    title="Mês Anterior"
                    style={{
                      background: "#fff", border: "1px solid #cbd5e1", borderRadius: "8px",
                      padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#64748b", transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "var(--primary-color)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#64748b"; }}
                  >
                    <Icons.BsChevronLeft />
                  </button>
                  <input
                    type="month"
                    value={mesFiltro}
                    onChange={(e) => setMesFiltro(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "1.4rem",
                      color: "#334155"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleMonthChange('next')}
                    title="Próximo Mês"
                    style={{
                      background: "#fff", border: "1px solid #cbd5e1", borderRadius: "8px",
                      padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#64748b", transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "var(--primary-color)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#64748b"; }}
                  >
                    <Icons.BsChevronRight />
                  </button>
                </div>
              </div>
              <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", height: "400px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="dia" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `R$ ${value}`} width={80} />
                    <Tooltip
                      formatter={(value: any) => formatCurrency(Number(value))}
                      labelStyle={{ color: '#334155', fontWeight: 'bold', marginBottom: '8px' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    <Bar dataKey="receitas" name="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Modal de Detalhes de Contas */}
      {modalDetails && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}>
            <div style={{
              padding: "20px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h2 style={{ margin: 0, fontSize: "1.6rem", color: modalDetails.color, display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsListCheck /> {modalDetails.title}
              </h2>
              <button
                onClick={() => setModalDetails(null)}
                style={{ background: "transparent", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#64748b" }}
              >
                <Icons.BsX />
              </button>
            </div>

            <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
              {modalDetails.items.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8" }}>
                  <Icons.BsInbox style={{ fontSize: "3rem", marginBottom: "12px" }} />
                  <p style={{ fontSize: "1.4rem", margin: 0 }}>Nenhuma conta encontrada para este período.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {modalDetails.items.map((item, idx) => (
                    <div key={idx} style={{
                      padding: "16px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#f8fafc"
                    }}>
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "1.4rem", color: "#334155", marginBottom: "4px" }}>
                          {item.descricao || "Sem descrição"}
                        </div>
                        <div style={{ fontSize: "1.2rem", color: "#64748b", display: "flex", gap: "12px" }}>
                          <span>Venc.: {item.data ? item.data.split('-').reverse().join('/') : "-"}</span>
                          <span>{item.categoria || "Sem categoria"}</span>
                        </div>
                      </div>
                      <div style={{ fontWeight: "bold", fontSize: "1.5rem", color: modalDetails.color }}>
                        {formatCurrency(Math.abs(parseFloat(item.valor || 0)))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: "16px 20px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setModalDetails(null)}
                style={{
                  background: modalDetails.color,
                  color: "#fff",
                  border: "none",
                  padding: "8px 24px",
                  borderRadius: "8px",
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardFinanceiro;
