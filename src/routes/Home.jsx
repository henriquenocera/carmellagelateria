import React, { useEffect, useState } from "react";
import * as Icons from "react-icons/bs";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import supabase from "../services/supabase-client";
import { avaliarRegrasDeNegocio } from "../utils/regrasDeNegocio";

// Helpers
const formatDateAndTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}, ${hours}:${mins}`;
};

const getLocalDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const parseChecklistField = (fieldStr) => {
  if (!fieldStr) return { main: "-", subItems: [] };
  const str = String(fieldStr).trim();
  const bracketIndex = str.indexOf('[');
  if (bracketIndex !== -1) {
    const main = str.substring(0, bracketIndex).trim();
    const subStr = str.substring(bracketIndex).trim();
    if (subStr.startsWith('[') && subStr.endsWith(']')) {
      const content = subStr.slice(1, -1).trim();
      if (content) {
        const subItems = content.split(',').map(item => item.trim()).filter(Boolean);
        return { main, subItems };
      }
    }
  }
  return { main: str, subItems: [] };
};

const getFolgaStyle = (status) => {
  switch (status) {
    case "Falta Não Justificada": return { background: "#fce4d6", color: "#c00000" };
    case "Atestado": return { background: "#e1d5e7", color: "#7030a0" };
    case "Folga Fixa Semanal": return { background: "#e2f0d9", color: "#385723" };
    case "Domingo de Folga": return { background: "#c6e0b4", color: "#385723" };
    case "Folga Compensatória": return { background: "#a8d08d", color: "#385723" };
    case "Férias": return { background: "#fce5cd", color: "#b45f06" };
    default: return { background: "#d1fae5", color: "#065f46" };
  }
};

function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Data states
  const [checklists, setChecklists] = useState({ ahu: null, altoxv: null });
  const [estoque, setEstoque] = useState({ ahu: { vitrine: 0, estoque: 0 }, altoxv: { vitrine: 0, estoque: 0 } });
  const [insumosStatus, setInsumosStatus] = useState({ ahu: { ok: 0, warning: 0, critical: 0, criticalItems: [] }, altoxv: { ok: 0, warning: 0, critical: 0, criticalItems: [] } });
  const [folgas, setFolgas] = useState({ hoje: [], amanha: [] });
  const [notificacoes, setNotificacoes] = useState([]);
  const [saldosVales, setSaldosVales] = useState([]);
  const [crmStatus, setCrmStatus] = useState({ atrasados: 0, hoje: 0, proximos: 0 });
  const [financeiroStatus, setFinanceiroStatus] = useState({ vencidos: 0, hoje: 0, proximos: 0 });

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Checklists
        const { data: checklistData } = await supabase
          .from("Checklist")
          .select("*")
          .eq("checklist", "Checklist de Fechamento")
          .order("created_at", { ascending: false })
          .limit(20);

        let latestAhu = null;
        let latestAltoxv = null;
        if (checklistData) {
          latestAhu = checklistData.find(c => c.store === "ahu");
          latestAltoxv = checklistData.find(c => c.store === "altoxv");
        }

        // 2. Fetch Estoque (buscando também o histórico de 2 dias)
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const iso2d = twoDaysAgo.toISOString();

        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const [ahuRes, altoxvRes] = await Promise.all([
          supabase.from("cardsahu").select("id, status, title, production_date, history, updated_at").or(`status.in.(vitrine-atual,freezer-estoque),updated_at.gte.${iso2d}`),
          supabase.from("cardsaltoxv").select("id, status, title, production_date, history, updated_at").or(`status.in.(vitrine-atual,freezer-estoque),updated_at.gte.${iso2d}`)
        ]);

        const calcEstoque = (data) => {
          if (!data) return { vitrine: 0, estoque: 0, itensVitrine: [], itensEstoque: [], itensEstoqueDetalhado: [], entradas2d: 0, saidas2d: 0, entradas1d: 0, saidas1d: 0 };

          const res = data.reduce((acc, curr) => {
            if (curr.status === "vitrine-atual") {
              acc.vitrine++;
              if (curr.title) acc.itensVitrine.push(curr.title.trim().toLowerCase());
            }
            else if (curr.status === "freezer-estoque") {
              acc.estoque++;
              if (curr.title) acc.itensEstoque.push(curr.title.trim().toLowerCase());
              acc.itensEstoqueDetalhado.push(curr);
            }

            if (curr.history && Array.isArray(curr.history)) {
              curr.history.forEach(h => {
                if (h.timestamp) {
                  const hDate = new Date(h.timestamp);
                  const act = (h.action || "").toLowerCase();

                  if (hDate >= twoDaysAgo) {
                    if (act.includes("criado") && !act.includes("quebra")) acc.entradas2d++;
                    if (act.includes("→ arquivo") || act.includes("→ histórico") || act.includes("lixo")) acc.saidas2d++;
                  }

                  if (hDate >= oneDayAgo) {
                    if (act.includes("criado") && !act.includes("quebra")) acc.entradas1d++;
                    if (act.includes("→ arquivo") || act.includes("→ histórico") || act.includes("lixo")) acc.saidas1d++;
                  }
                }
              });
            }

            return acc;
          }, { vitrine: 0, estoque: 0, itensVitrine: [], itensEstoque: [], itensEstoqueDetalhado: [], entradas2d: 0, saidas2d: 0, entradas1d: 0, saidas1d: 0 });

          return res;
        };

        const ahuEstoque = calcEstoque(ahuRes.data);
        const altoxvEstoque = calcEstoque(altoxvRes.data);

        // 3. Fetch Frequência (Folgas de hoje e amanhã)
        const today = new Date();
        const todayStr = getLocalDateString(today);
        const weekdayVal = String(today.getDay()); // "0" for Sunday, etc.

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = getLocalDateString(tomorrow);
        const tomorrowWeekdayVal = String(tomorrow.getDay());

        // 4. Fetch Insumos Status
        const fetchInsumosStatus = async (unitName, unitId) => {
          const [{ data: insData }, { data: invData }, { data: movData }] = await Promise.all([
            supabase.from("cadastro_insumos").select("id, nome, config_estoque").eq("ativo", true).order("ordem", { ascending: true }).order("nome", { ascending: true }),
            supabase.from("inventario_insumos").select("insumo_id, data_inventario, quantidade").eq("unidade", unitName),
            supabase.from("movimentacoes_estoque").select("insumo_id, data_movimentacao, quantidade, origem, destino").or(`origem.eq.${unitName},destino.eq.${unitName}`)
          ]);

          let status = { ok: 0, warning: 0, critical: 0, criticalItems: [] };
          if (!insData) return status;

          const latestInv = {};
          (invData || []).forEach(inv => {
            if (!latestInv[inv.insumo_id] || inv.data_inventario > latestInv[inv.insumo_id].data) {
              latestInv[inv.insumo_id] = { data: inv.data_inventario, quantidade: Number(inv.quantidade) };
            }
          });

          const calculatedStock = {};
          Object.keys(latestInv).forEach(id => { calculatedStock[id] = latestInv[id].quantidade; });

          (movData || []).forEach(mov => {
            const inv = latestInv[mov.insumo_id];
            if (inv && mov.data_movimentacao < inv.data) return;
            if (calculatedStock[mov.insumo_id] === undefined) calculatedStock[mov.insumo_id] = 0;
            if (mov.destino === unitName) calculatedStock[mov.insumo_id] += Number(mov.quantidade);
            if (mov.origem === unitName) calculatedStock[mov.insumo_id] -= Number(mov.quantidade);
          });

          insData.forEach(ins => {
            const config = ins.config_estoque?.[unitId];
            if (!config || !config.ativo) return;

            const current = calculatedStock[ins.id] || 0;
            const min = config.minimo;
            const desired = config.desejado;

            if (min != null && current < min) {
              status.critical++;
              status.criticalItems.push(ins.nome);
            }
            else if (desired != null && current < desired) status.warning++;
            else status.ok++;
          });

          return status;
        };

        const fetchAllVales = async () => {
          let allVales = [];
          let from = 0;
          const step = 1000;
          let hasMore = true;
          while (hasMore) {
            const { data: vData, error: vError } = await supabase
              .from("Vales")
              .select("Nome, valor, created_at")
              .range(from, from + step - 1);
            if (vError) throw vError;
            if (vData && vData.length > 0) {
              allVales = [...allVales, ...vData];
              from += step;
              if (vData.length < step) hasMore = false;
            } else {
              hasMore = false;
            }
          }
          return allVales;
        };

        const [profilesRes, freqRes, allValesData, ahuInsumos, altoxvInsumos, crmRes, financeiroRes] = await Promise.all([
          supabase.from("profiles").select("id, name, folgas_fixas, ativo, data_registro, controlar_frequencia").eq("ativo", true).eq("controlar_frequencia", true),
          supabase.from("frequencia").select("employee_id, date, status").in("date", [todayStr, tomorrowStr]),
          fetchAllVales(),
          fetchInsumosStatus("Loja Ahú", "ahu"),
          fetchInsumosStatus("Loja Alto XV", "altoxv"),
          supabase.from("clientes_food_service").select("id, nome, data_proximo_contato, data_ultimo_contato, status, historico_crm(date)").eq("ativo", true),
          supabase.from("contas_pagar_receber").select("id, data, valor").or("status_revisao.is.null,status_revisao.neq.admin_only")
        ]);

        const profiles = profilesRes.data || [];
        const frequencias = freqRes.data || [];
        const folgasHoje = [];
        const folgasAmanha = [];

        profiles.forEach(p => {
          const fixedOffDays = p.folgas_fixas ? p.folgas_fixas.split(",") : [];

          // Hoje
          const freqEntryHoje = frequencias.find(f => f.employee_id === p.id && f.date === todayStr);
          const isFixedOffHoje = fixedOffDays.includes(weekdayVal);

          let statusHoje = isFixedOffHoje ? "Folga Fixa Semanal" : "Trabalhado";
          if (freqEntryHoje) {
            statusHoje = freqEntryHoje.status;
          }

          if (["Folga Fixa Semanal", "Domingo de Folga", "Folga Compensatória", "Férias", "Atestado", "Falta Não Justificada"].includes(statusHoje)) {
            folgasHoje.push({ name: p.name, status: statusHoje });
          }

          // Amanhã
          const freqEntryAmanha = frequencias.find(f => f.employee_id === p.id && f.date === tomorrowStr);
          const isFixedOffAmanha = fixedOffDays.includes(tomorrowWeekdayVal);

          let statusAmanha = isFixedOffAmanha ? "Folga Fixa Semanal" : "Trabalhado";
          if (freqEntryAmanha) {
            statusAmanha = freqEntryAmanha.status;
          }

          if (["Folga Fixa Semanal", "Domingo de Folga", "Folga Compensatória", "Férias", "Atestado", "Falta Não Justificada"].includes(statusAmanha)) {
            folgasAmanha.push({ name: p.name, status: statusAmanha });
          }
        });

        const valesList = {};
        allValesData.forEach(v => {
          if (!valesList[v.Nome]) valesList[v.Nome] = [];
          valesList[v.Nome].push(v);
        });

        const listaSaldosVales = profiles.map(p => {
          const firstName = p.name ? p.name.split(" ")[0] : "";
          const employeeVales = valesList[p.name] || valesList[firstName] || [];
          let sum = 0;
          employeeVales.forEach(v => {
            if (p.data_registro && v.created_at) {
              const valeDateStr = v.created_at.split('T')[0];
              if (valeDateStr >= p.data_registro) {
                sum += Number(v.valor) || 0;
              }
            } else {
              sum += Number(v.valor) || 0;
            }
          });
          return { name: p.name, saldo: sum };
        }).sort((a, b) => a.name.localeCompare(b.name));

        const crmData = crmRes?.data || [];
        let crmAtrasados = 0;
        let crmHoje = 0;
        let crmProximos = 0;

        crmData.forEach(c => {
          const status = c.status || "Lead";
          if (!["Lead", "Em Contato"].includes(status) || !c.data_proximo_contato) return;

          let ultimo = c.data_ultimo_contato;
          if (c.historico_crm && c.historico_crm.length > 0) {
            const sorted = c.historico_crm.map(h => h.date).sort().reverse();
            if (!ultimo || sorted[0] > ultimo) {
              ultimo = sorted[0];
            }
          }

          if (!ultimo) return; // Se não tem último contato, o CRM.tsx não renderiza o próximo contato, então não contamos

          const targetDate = new Date(c.data_proximo_contato + "T12:00:00");
          const todayDate = new Date();
          todayDate.setHours(12, 0, 0, 0);
          const diffTime = targetDate.getTime() - todayDate.getTime();
          const dias = Math.round(diffTime / (1000 * 60 * 60 * 24));

          if (dias < 0) crmAtrasados++;
          else if (dias === 0) crmHoje++;
          else if (dias > 0 && dias <= 3) crmProximos++;
        });

        const financeiroData = financeiroRes?.data || [];
        let finVencidos = 0;
        let finHoje = 0;
        let finProximos = 0;

        const todayFinDate = new Date(todayStr + "T00:00:00");

        financeiroData.forEach(f => {
          if (!f.data) return;
          if (f.data < todayStr) {
            finVencidos++;
          } else if (f.data === todayStr) {
            finHoje++;
          } else {
            const fDate = new Date(f.data + "T00:00:00");
            const diffTime = fDate.getTime() - todayFinDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 7) {
              finProximos++;
            }
          }
        });

        if (isMounted) {
          const estadoEstoque = { ahu: ahuEstoque, altoxv: altoxvEstoque };
          const estadoChecklists = { ahu: latestAhu, altoxv: latestAltoxv };
          setEstoque(estadoEstoque);
          setChecklists(estadoChecklists);

          // Avaliar regras de negócio para gerar notificações
          const alertas = avaliarRegrasDeNegocio({ estoque: estadoEstoque, checklists: estadoChecklists });
          setNotificacoes(alertas);

          setInsumosStatus({ ahu: ahuInsumos, altoxv: altoxvInsumos });
          setFolgas({ hoje: folgasHoje, amanha: folgasAmanha });
          setSaldosVales(listaSaldosVales);
          setCrmStatus({ atrasados: crmAtrasados, hoje: crmHoje, proximos: crmProximos });
          setFinanceiroStatus({ vencidos: finVencidos, hoje: finHoje, proximos: finProximos });
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => { isMounted = false; };
  }, []);

  // Components for the UI
  const ChecklistCard = ({ title, data }) => {
    if (!data) return (
      <div style={{ background: "#fff", borderTop: "4px solid #78350f", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "1.6rem", color: "#78350f", display: "flex", alignItems: "center", gap: "8px" }}>
          <Icons.BsShop /> {title}
        </h3>
        <p style={{ color: "#94a3b8" }}>Nenhum checklist de fechamento encontrado.</p>
      </div>
    );

    const massas = parseChecklistField(data.massas);
    const brownies = parseChecklistField(data.brownies);
    const panos = parseChecklistField(data.panos);

    return (
      <div style={{ background: "#fff", borderTop: "6px solid #5c3a21", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column" }}>

        {/* Title Row */}
        <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Icons.BsShop style={{ fontSize: "2.4rem", color: "#a68a71" }} />
          <div style={{ border: "1px dashed #a68a71", padding: "6px 16px", color: "#5c3a21", fontWeight: "700", fontSize: "1.8rem" }}>
            {title}
          </div>
        </div>

        {/* Data Columns */}
        <div className="checklist-items-grid" style={{ gap: "8px", marginBottom: "32px", textAlign: "center" }}>

          <div style={{ borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "1rem", color: "#a68a71", fontWeight: "700", marginBottom: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>MASSAS</div>
            <div style={{ fontSize: "2.8rem", color: "#a68a71", fontWeight: "700", marginBottom: "12px", lineHeight: "1" }}>{massas.main}</div>
            {massas.subItems && massas.subItems.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center", width: "100%" }}>
                {massas.subItems.map((item, idx) => (
                  <div key={idx} style={{ fontSize: "1rem", background: "#fdf8f4", color: "#8c6b51", padding: "4px 8px", borderRadius: "6px", fontWeight: "600", display: "inline-block", textAlign: "center", whiteSpace: "nowrap" }}>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "1rem", color: "#a68a71", fontWeight: "700", marginBottom: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>BROWNIES</div>
            <div style={{ fontSize: "2.8rem", color: "#a68a71", fontWeight: "700", marginBottom: "12px", lineHeight: "1" }}>{brownies.main}</div>
            {brownies.subItems && brownies.subItems.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center", width: "100%" }}>
                {brownies.subItems.map((item, idx) => (
                  <div key={idx} style={{ fontSize: "1rem", background: "#fdf8f4", color: "#8c6b51", padding: "4px 8px", borderRadius: "6px", fontWeight: "600", display: "inline-block", textAlign: "center", whiteSpace: "nowrap" }}>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "1rem", color: "#a68a71", fontWeight: "700", marginBottom: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>PANOS</div>
            <div style={{ fontSize: "2.8rem", color: "#a68a71", fontWeight: "700", marginBottom: "12px", lineHeight: "1" }}>{panos.main}</div>
            {panos.subItems && panos.subItems.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center", width: "100%" }}>
                {panos.subItems.map((item, idx) => (
                  <div key={idx} style={{ fontSize: "1rem", background: "#fdf8f4", color: "#8c6b51", padding: "4px 8px", borderRadius: "6px", fontWeight: "600", display: "inline-block", textAlign: "center", whiteSpace: "nowrap" }}>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer Row */}
        <div style={{
          borderTop: "1px solid #f3ebe4",
          paddingTop: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto"
        }}>
          <span style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#6b503c",
            fontSize: "1.3rem",
            fontWeight: "600"
          }}>
            <Icons.BsPerson style={{ color: "#a17550", fontSize: "1.5rem" }} />
            {data.person}
          </span>
          <span style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#8c7664",
            fontSize: "1.25rem",
            fontWeight: "500"
          }}>
            <Icons.BsClock style={{ color: "#a17550", fontSize: "1.3rem" }} />
            {formatDateAndTime(data.created_at)}
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#a17550", fontSize: "2rem" }}><Icons.BsArrowClockwise className="spin" /> Carregando Dashboard...</div>;
  }

  const getCapacityColors = (current, max) => {
    const pct = (current / max) * 100;
    if (pct >= 80) return { bg: "#dcfce7", text: "#15803d", barBg: "#bbf7d0", barFill: "#16a34a" };
    if (pct >= 65) return { bg: "#fef3c7", text: "#b45309", barBg: "#fde68a", barFill: "#d97706" };
    return { bg: "#fee2e2", text: "#b91c1c", barBg: "#fecaca", barFill: "#ef4444" };
  };

  const ahuCurrent = estoque.ahu.vitrine + estoque.ahu.estoque;
  const ahuColors = getCapacityColors(ahuCurrent, 40);

  const altoxvCurrent = estoque.altoxv.vitrine + estoque.altoxv.estoque;
  const altoxvColors = getCapacityColors(altoxvCurrent, 24);

  return (
    <div className="dashboard-container">

      {/* Page Title */}
      <div style={{ marginBottom: "32px", textAlign: "left" }}>
        <h1 style={{ fontSize: "3rem", color: "#78350f", margin: "0 0 8px 0", fontWeight: "700" }}>Dashboard</h1>
        <p style={{ color: "#78716c", fontSize: "1.4rem", margin: 0 }}>Visão geral das operações da Carmella Gelateria.</p>
      </div>

      {/* Main Grid */}
      <div className="dashboard-main-grid">

        {/* Coluna da Esquerda (Notificações + Checklists + Folgas + Vales) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* Notificações Section */}
          <section style={{ display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "1.8rem", color: "#44403c", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.BsBell style={{ color: "#a17550" }} /> Notificações e Instruções
            </h2>
            <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", display: "flex", flexDirection: "column" }}>

              {notificacoes.length === 0 ? (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", color: "#64748b" }}>
                  <Icons.BsCheckCircle style={{ fontSize: "2rem", color: "#10b981", flexShrink: 0 }} />
                  <div>
                    <h3 style={{ margin: "0 0 8px 0", color: "#334155", fontSize: "1.5rem" }}>Tudo certo por aqui!</h3>
                    <p style={{ margin: 0, fontSize: "1.3rem", lineHeight: "1.5" }}>Não há nenhuma notificação ou recado importante no momento.</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {notificacoes.map((notif, idx) => {
                    const isLast = idx === notificacoes.length - 1;
                    return (
                      <div key={notif.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 0", borderBottom: isLast ? "none" : "1px solid #f8fafc" }}>
                        {notif.tipo === 'info' ? (
                          <Icons.BsInfoCircle style={{ fontSize: "1.8rem", color: "#3b82f6", flexShrink: 0, marginTop: "2px" }} />
                        ) : notif.tipo === 'aviso' ? (
                          <Icons.BsExclamationCircle style={{ fontSize: "1.8rem", color: "#f59e0b", flexShrink: 0, marginTop: "2px" }} />
                        ) : (
                          <Icons.BsExclamationTriangle style={{ fontSize: "1.8rem", color: "#ef4444", flexShrink: 0, marginTop: "2px" }} />
                        )}
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{
                            color: notif.tipo === 'info' ? "#3b82f6" : notif.tipo === 'aviso' ? "#d97706" : "#ef4444",
                            fontSize: "1.4rem",
                            fontWeight: "600"
                          }}>
                            {notif.titulo}
                          </span>
                          {notif.mensagem && <span style={{ color: "#64748b", fontSize: "1.3rem", lineHeight: "1.4" }}>{notif.mensagem}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </section>

          {/* Checklists Section */}
          <section className="card-checklists" style={{ display: "flex", flexDirection: "column", alignSelf: "start", width: "100%" }}>
            <h2 style={{ fontSize: "1.8rem", color: "#44403c", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.BsCardChecklist style={{ color: "#a17550" }} /> Últimos Checklists de Fechamento
            </h2>
            <div className="checklists-grid">
              <ChecklistCard title="Alto da XV" data={checklists.altoxv} />
              <ChecklistCard title="Ahú" data={checklists.ahu} />
            </div>
          </section>

          {/* CRM e Financeiro Section */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", width: "100%" }}>

            <section className="card-crm" style={{ display: "flex", flexDirection: "column", alignSelf: "start", width: "100%" }}>
              <h2 style={{ fontSize: "1.8rem", color: "#44403c", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsPeopleFill style={{ color: "#a17550" }} /> CRM
              </h2>
              <Link to="/crm" style={{ background: "#fff", borderRadius: "12px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ backgroundColor: "#fdf8f4", padding: "16px", borderRadius: "50%" }}>
                    <Icons.BsPersonLinesFill style={{ fontSize: "2.4rem", color: "#a68a71" }} />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 8px 0", color: "#334155", fontSize: "1.6rem" }}>Acessar CRM</h3>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                      {crmStatus.atrasados > 0 && <span style={{ background: "#fef2f2", color: "#ef4444", padding: "4px 10px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "bold", border: "1px solid #fecaca" }}>{crmStatus.atrasados} Atrasado(s)</span>}
                      {crmStatus.hoje > 0 && <span style={{ background: "#fffbeb", color: "#d97706", padding: "4px 10px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "bold", border: "1px solid #fde68a" }}>{crmStatus.hoje} P/ Hoje</span>}
                      {crmStatus.proximos > 0 && <span style={{ background: "#eff6ff", color: "#3b82f6", padding: "4px 10px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "bold", border: "1px solid #bfdbfe" }}>{crmStatus.proximos} Próximos</span>}
                      {(crmStatus.atrasados === 0 && crmStatus.hoje === 0 && crmStatus.proximos === 0) && <span style={{ color: "#64748b", fontSize: "1.3rem" }}>Todos em dia.</span>}
                    </div>
                  </div>
                </div>
                <Icons.BsChevronRight style={{ color: "#94a3b8", fontSize: "2rem" }} />
              </Link>
            </section>

            <section className="card-financeiro" style={{ display: "flex", flexDirection: "column", alignSelf: "start", width: "100%" }}>
              <h2 style={{ fontSize: "1.8rem", color: "#44403c", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsCurrencyDollar style={{ color: "#10b981" }} /> Financeiro
              </h2>
              <Link to="/contas-pagar-receber" style={{ background: "#fff", borderRadius: "12px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ backgroundColor: "#f0fdf4", padding: "16px", borderRadius: "50%" }}>
                    <Icons.BsCashCoin style={{ fontSize: "2.4rem", color: "#16a34a" }} />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 8px 0", color: "#334155", fontSize: "1.6rem" }}>Acessar Contas</h3>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                      {financeiroStatus.vencidos > 0 && <span style={{ background: "#fef2f2", color: "#ef4444", padding: "4px 10px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "bold", border: "1px solid #fecaca" }}>{financeiroStatus.vencidos} Vencida(s)</span>}
                      {financeiroStatus.hoje > 0 && <span style={{ background: "#fffbeb", color: "#d97706", padding: "4px 10px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "bold", border: "1px solid #fde68a" }}>{financeiroStatus.hoje} P/ Hoje</span>}
                      {financeiroStatus.proximos > 0 && <span style={{ background: "#eff6ff", color: "#3b82f6", padding: "4px 10px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "bold", border: "1px solid #bfdbfe" }}>{financeiroStatus.proximos} Próximas (7 dias)</span>}
                      {(financeiroStatus.vencidos === 0 && financeiroStatus.hoje === 0 && financeiroStatus.proximos === 0) && <span style={{ color: "#64748b", fontSize: "1.3rem" }}>Tudo em dia.</span>}
                    </div>
                  </div>
                </div>
                <Icons.BsChevronRight style={{ color: "#94a3b8", fontSize: "2rem" }} />
              </Link>
            </section>

          </div>

          <div className="folgas-vales-grid">
            {/* Folgas e Ausências */}
            <section className="card-folgas" style={{ display: "flex", flexDirection: "column", alignSelf: "start", width: "100%" }}>
              <h2 style={{ fontSize: "1.8rem", color: "#44403c", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsCupHot style={{ color: "#10b981" }} /> Folgas e Ausências
              </h2>
              <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", flex: 1 }}>

                <div style={{ marginBottom: "16px", fontWeight: "bold", color: "#475569", fontSize: "1.4rem", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px" }}>Hoje</div>
                {(!folgas.hoje || folgas.hoje.length === 0) ? (
                  <p style={{ color: "#94a3b8", fontStyle: "italic", margin: "0 0 24px 0", fontSize: "1.3rem" }}>Ninguém de folga hoje.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                    {folgas.hoje.map((folga, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "12px 16px", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                        <span style={{ fontWeight: "600", color: "#334155", fontSize: "1.4rem" }}>{folga.name}</span>
                        <span style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "600", ...getFolgaStyle(folga.status) }}>{folga.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginBottom: "16px", fontWeight: "bold", color: "#475569", fontSize: "1.4rem", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px" }}>Amanhã</div>
                {(!folgas.amanha || folgas.amanha.length === 0) ? (
                  <p style={{ color: "#94a3b8", fontStyle: "italic", margin: 0, fontSize: "1.3rem" }}>Ninguém de folga amanhã.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {folgas.amanha.map((folga, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "12px 16px", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                        <span style={{ fontWeight: "600", color: "#334155", fontSize: "1.4rem" }}>{folga.name}</span>
                        <span style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "600", ...getFolgaStyle(folga.status) }}>{folga.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Saldo de Vales */}
            <section className="card-vales" style={{ display: "flex", flexDirection: "column", alignSelf: "start", width: "100%" }}>
              <h2 style={{ fontSize: "1.8rem", color: "#44403c", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsCashCoin style={{ color: "#10b981" }} /> Saldo de Vales (Ativos)
              </h2>
              <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", flex: 1, display: "flex", flexDirection: "column" }}>
                {saldosVales.length === 0 ? (
                  <p style={{ color: "#94a3b8", fontStyle: "italic", margin: 0, fontSize: "1.3rem" }}>Nenhum saldo encontrado.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {saldosVales.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "12px 16px", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                        <span style={{ fontWeight: "600", color: "#334155", fontSize: "1.4rem" }}>{item.name}</span>
                        <span style={{
                          fontSize: "1.3rem",
                          fontWeight: "bold",
                          color: item.saldo < 0 ? "#ef4444" : item.saldo > 0 ? "#22c55e" : "#64748b"
                        }}>
                          {item.saldo > 0 ? '+' : item.saldo < 0 ? '-' : ''} R$ {Math.abs(item.saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <Link to="/analise-vales" style={{ display: "block", textAlign: "center", marginTop: "auto", color: "#4f46e5", textDecoration: "none", fontWeight: "600", fontSize: "1.2rem", paddingTop: "24px" }}>
                  Ver Análise de Vales &rarr;
                </Link>
              </div>
            </section>
          </div>

        </div>

        {/* Coluna da Direita (Resumo de Estoque) */}
        <section className="card-estoque" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <h2 style={{ fontSize: "1.8rem", color: "#44403c", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Icons.BsBoxSeam style={{ color: "#a17550" }} /> Resumo de Estoque
          </h2>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Parte 1: Cubas */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px" }}>
                <Icons.BsSnow style={{ color: "#3b82f6", fontSize: "1.6rem" }} />
                <span style={{ fontWeight: "bold", color: "#475569", fontSize: "1.5rem" }}>Cubas de Gelato</span>
              </div>

              {/* Loja Ahú - Cubas */}
              <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "1.6rem", color: "#334155", fontWeight: "600" }}>Loja Ahú</span>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                    <span style={{ background: ahuColors.bg, color: ahuColors.text, padding: "4px 12px", borderRadius: "12px", fontWeight: "bold", fontSize: "1.2rem", transition: "all 0.3s ease" }}>
                      {ahuCurrent} / 40 cubas
                    </span>
                    <div style={{ width: "100%", height: "6px", background: ahuColors.barBg, borderRadius: "4px", overflow: "hidden", transition: "background 0.3s ease" }}>
                      <div style={{ width: `${Math.min((ahuCurrent / 40) * 100, 100)}%`, height: "100%", background: ahuColors.barFill, borderRadius: "4px", transition: "all 0.5s ease" }}></div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "16px", color: "#64748b", fontSize: "1.3rem", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }}></div> Vitrine: {estoque.ahu.vitrine}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }}></div> Estoque: {estoque.ahu.estoque}</span>
                  </div>
                  <div style={{ fontSize: "1.2rem", color: "#94a3b8", display: "flex", gap: "8px", marginBottom: "4px" }}>
                    <span>Últimas 24h:</span>
                    <span style={{ color: "#16a34a", fontWeight: "600" }}>+{estoque.ahu.entradas1d}</span>
                    <span style={{ color: "#cbd5e1" }}>|</span>
                    <span style={{ color: "#ef4444", fontWeight: "600" }}>-{estoque.ahu.saidas1d}</span>
                  </div>
                  <div style={{ fontSize: "1.2rem", color: "#94a3b8", display: "flex", gap: "8px" }}>
                    <span>Últimas 48h:</span>
                    <span style={{ color: "#16a34a", fontWeight: "600" }}>+{estoque.ahu.entradas2d}</span>
                    <span style={{ color: "#cbd5e1" }}>|</span>
                    <span style={{ color: "#ef4444", fontWeight: "600" }}>-{estoque.ahu.saidas2d}</span>
                  </div>
                </div>
              </div>

              {/* Loja Alto XV - Cubas */}
              <div style={{ paddingBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "1.6rem", color: "#334155", fontWeight: "600" }}>Loja Alto XV</span>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                    <span style={{ background: altoxvColors.bg, color: altoxvColors.text, padding: "4px 12px", borderRadius: "12px", fontWeight: "bold", fontSize: "1.2rem", transition: "all 0.3s ease" }}>
                      {altoxvCurrent} / 24 cubas
                    </span>
                    <div style={{ width: "100%", height: "6px", background: altoxvColors.barBg, borderRadius: "4px", overflow: "hidden", transition: "background 0.3s ease" }}>
                      <div style={{ width: `${Math.min((altoxvCurrent / 24) * 100, 100)}%`, height: "100%", background: altoxvColors.barFill, borderRadius: "4px", transition: "all 0.5s ease" }}></div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "16px", color: "#64748b", fontSize: "1.3rem", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }}></div> Vitrine: {estoque.altoxv.vitrine}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }}></div> Estoque: {estoque.altoxv.estoque}</span>
                  </div>
                  <div style={{ fontSize: "1.2rem", color: "#94a3b8", display: "flex", gap: "8px", marginBottom: "4px" }}>
                    <span>Últimas 24h:</span>
                    <span style={{ color: "#16a34a", fontWeight: "600" }}>+{estoque.altoxv.entradas1d}</span>
                    <span style={{ color: "#cbd5e1" }}>|</span>
                    <span style={{ color: "#ef4444", fontWeight: "600" }}>-{estoque.altoxv.saidas1d}</span>
                  </div>
                  <div style={{ fontSize: "1.2rem", color: "#94a3b8", display: "flex", gap: "8px" }}>
                    <span>Últimas 48h:</span>
                    <span style={{ color: "#16a34a", fontWeight: "600" }}>+{estoque.altoxv.entradas2d}</span>
                    <span style={{ color: "#cbd5e1" }}>|</span>
                    <span style={{ color: "#ef4444", fontWeight: "600" }}>-{estoque.altoxv.saidas2d}</span>
                  </div>
                </div>
              </div>

              <Link to="/lojas-cubas-estoque" style={{ display: "block", textAlign: "center", color: "#4f46e5", textDecoration: "none", fontWeight: "600", fontSize: "1.2rem" }}>
                Ver Estoque Completo de Cubas &rarr;
              </Link>
            </div>

            {/* Separador */}
            <hr style={{ border: "none", borderTop: "1px dashed #cbd5e1", margin: "0" }} />

            {/* Parte 2: Insumos */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px" }}>
                <Icons.BsBasket style={{ color: "#10b981", fontSize: "1.6rem" }} />
                <span style={{ fontWeight: "bold", color: "#475569", fontSize: "1.5rem" }}>Estoque de Insumos</span>
              </div>

              {/* Loja Ahú - Insumos */}
              <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "1.5rem", color: "#334155", fontWeight: "600" }}>Loja Ahú</span>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: insumosStatus.ahu.criticalItems?.length > 0 ? "12px" : "0" }}>
                  <div style={{ background: "#f0fdf4", color: "#16a34a", padding: "6px 12px", borderRadius: "8px", fontSize: "1.2rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }} title="Insumos com Estoque Ideal">
                    <Icons.BsCheckCircleFill /> {insumosStatus.ahu.ok} OK
                  </div>
                  <div style={{ background: "#fefce8", color: "#ca8a04", padding: "6px 12px", borderRadius: "8px", fontSize: "1.2rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }} title="Insumos em Alerta">
                    <Icons.BsExclamationCircleFill /> {insumosStatus.ahu.warning} Alerta
                  </div>
                  <div style={{ background: "#fef2f2", color: "#dc2626", padding: "6px 12px", borderRadius: "8px", fontSize: "1.2rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }} title="Insumos com Estoque Crítico">
                    <Icons.BsXCircleFill /> {insumosStatus.ahu.critical} Crítico
                  </div>
                </div>
                {insumosStatus.ahu.criticalItems?.length > 0 && (
                  <div style={{ backgroundColor: "#fef2f2", padding: "8px 12px", borderRadius: "8px", border: "1px dashed #fecaca" }}>
                    <div style={{ fontWeight: "bold", color: "#ef4444", fontSize: "1.2rem", marginBottom: "4px" }}>Faltando:</div>
                    <ul style={{ margin: 0, paddingLeft: "16px", color: "#ef4444", fontSize: "1.1rem", lineHeight: "1.4" }}>
                      {insumosStatus.ahu.criticalItems.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              {/* Loja Alto XV - Insumos */}
              <div style={{ paddingBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "1.5rem", color: "#334155", fontWeight: "600" }}>Loja Alto XV</span>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: insumosStatus.altoxv.criticalItems?.length > 0 ? "12px" : "0" }}>
                  <div style={{ background: "#f0fdf4", color: "#16a34a", padding: "6px 12px", borderRadius: "8px", fontSize: "1.2rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }} title="Insumos com Estoque Ideal">
                    <Icons.BsCheckCircleFill /> {insumosStatus.altoxv.ok} OK
                  </div>
                  <div style={{ background: "#fefce8", color: "#ca8a04", padding: "6px 12px", borderRadius: "8px", fontSize: "1.2rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }} title="Insumos em Alerta">
                    <Icons.BsExclamationCircleFill /> {insumosStatus.altoxv.warning} Alerta
                  </div>
                  <div style={{ background: "#fef2f2", color: "#dc2626", padding: "6px 12px", borderRadius: "8px", fontSize: "1.2rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }} title="Insumos com Estoque Crítico">
                    <Icons.BsXCircleFill /> {insumosStatus.altoxv.critical} Crítico
                  </div>
                </div>
                {insumosStatus.altoxv.criticalItems?.length > 0 && (
                  <div style={{ backgroundColor: "#fef2f2", padding: "8px 12px", borderRadius: "8px", border: "1px dashed #fecaca" }}>
                    <div style={{ fontWeight: "bold", color: "#ef4444", fontSize: "1.2rem", marginBottom: "4px" }}>Faltando:</div>
                    <ul style={{ margin: 0, paddingLeft: "16px", color: "#ef4444", fontSize: "1.1rem", lineHeight: "1.4" }}>
                      {insumosStatus.altoxv.criticalItems.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <Link to="/loja-estoque-insumos" style={{ display: "block", textAlign: "center", marginTop: "auto", color: "#4f46e5", textDecoration: "none", fontWeight: "600", fontSize: "1.2rem" }}>
                Ver Controle de Insumos &rarr;
              </Link>
            </div>

          </div>
        </section>

      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .dashboard-container {
           padding: 40px 40px 40px 115px;
           width: 100%;
           max-width: 1800px;
           min-height: 100vh;
           background: #fdfbf7;
           margin: 0 auto;
           box-sizing: border-box;
        }
        
        .dashboard-main-grid {
           display: grid;
           grid-template-columns: 1.8fr 1fr;
           gap: 32px;
           width: 100%;
           align-items: start;
        }

        .folgas-vales-grid {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 32px;
           width: 100%;
        }
        
        .checklists-grid {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 24px;
           flex: 1;
        }
        
        .checklist-items-grid {
           display: grid;
           grid-template-columns: 1fr 1fr 1fr;
        }

        /* Responsividade para Tablets */
        @media (max-width: 1100px) {
           .dashboard-main-grid {
              grid-template-columns: 1fr;
           }
           .folgas-vales-grid {
              grid-template-columns: 1fr 1fr;
           }

           .checklists-grid {
              grid-template-columns: 1fr 1fr;
           }
        }

        /* Responsividade para Celulares */
        @media (max-width: 768px) {
           .dashboard-container {
              padding: 85px 15px 80px 85px;
           }
           .folgas-vales-grid {
              grid-template-columns: 1fr;
           }
           .checklists-grid {
              grid-template-columns: 1fr;
           }
           .checklist-items-grid {
              grid-template-columns: 1fr;
              gap: 24px !important; /* Aumenta gap quando empilha */
           }
           .checklist-items-grid > div {
              border-right: none !important;
              border-bottom: 1px solid #f1f5f9;
              padding-bottom: 16px;
           }
           .checklist-items-grid > div:last-child {
              border-bottom: none;
              padding-bottom: 0;
           }
        }
      `}</style>
    </div>
  );
}

export default Home;
