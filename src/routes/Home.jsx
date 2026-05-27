import React, { useEffect, useState } from "react";
import * as Icons from "react-icons/bs";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import supabase from "../supabase-client";
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
  if (!fieldStr) return { main: "-", sub: null };
  const str = String(fieldStr).trim();
  const bracketIndex = str.indexOf('[');
  if (bracketIndex !== -1) {
    const main = str.substring(0, bracketIndex).trim();
    let sub = str.substring(bracketIndex);
    sub = sub.replace('venc. ', 'venc.\n');
    return { main, sub };
  }
  return { main: str, sub: null };
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
  const [folgas, setFolgas] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);

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

        // 2. Fetch Estoque
        const [ahuRes, altoxvRes] = await Promise.all([
          supabase.from("cardsahu").select("status").in("status", ["vitrine-atual", "freezer-estoque"]),
          supabase.from("cardsaltoxv").select("status").in("status", ["vitrine-atual", "freezer-estoque"])
        ]);

        const calcEstoque = (data) => {
          if (!data) return { vitrine: 0, estoque: 0 };
          return data.reduce((acc, curr) => {
            if (curr.status === "vitrine-atual") acc.vitrine++;
            else if (curr.status === "freezer-estoque") acc.estoque++;
            return acc;
          }, { vitrine: 0, estoque: 0 });
        };

        const ahuEstoque = calcEstoque(ahuRes.data);
        const altoxvEstoque = calcEstoque(altoxvRes.data);

        // 3. Fetch Frequência (Folgas de hoje)
        const today = new Date();
        const todayStr = getLocalDateString(today);
        const weekdayVal = String(today.getDay()); // "0" for Sunday, etc.

        const [profilesRes, freqRes] = await Promise.all([
          supabase.from("profiles").select("id, name, folgas_fixas, ativo").eq("ativo", true),
          supabase.from("frequencia").select("employee_id, status").eq("date", todayStr)
        ]);

        const profiles = profilesRes.data || [];
        const frequencias = freqRes.data || [];
        const folgasHoje = [];

        profiles.forEach(p => {
          const freqEntry = frequencias.find(f => f.employee_id === p.id);
          const fixedOffDays = p.folgas_fixas ? p.folgas_fixas.split(",") : [];
          const isFixedOff = fixedOffDays.includes(weekdayVal);

          let status = isFixedOff ? "Folga Fixa Semanal" : "Trabalhado";
          if (freqEntry) {
            status = freqEntry.status;
          }

          if (["Folga Fixa Semanal", "Domingo de Folga", "Folga Compensatória", "Férias", "Atestado", "Falta Não Justificada"].includes(status)) {
            folgasHoje.push({ name: p.name, status });
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

          setFolgas(folgasHoje);
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "32px", textAlign: "center" }}>
          
          <div style={{ borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "1rem", color: "#a68a71", fontWeight: "700", marginBottom: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>MASSAS</div>
            <div style={{ fontSize: "2.8rem", color: "#a68a71", fontWeight: "700", marginBottom: "12px", lineHeight: "1" }}>{massas.main}</div>
            {massas.sub && <div style={{ fontSize: "1rem", background: "#fdf8f4", color: "#8c6b51", padding: "4px 8px", borderRadius: "6px", fontWeight: "600", display: "inline-block", whiteSpace: "pre-line" }}>{massas.sub}</div>}
          </div>
          
          <div style={{ borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "1rem", color: "#a68a71", fontWeight: "700", marginBottom: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>BROWNIES</div>
            <div style={{ fontSize: "2.8rem", color: "#a68a71", fontWeight: "700", marginBottom: "12px", lineHeight: "1" }}>{brownies.main}</div>
            {brownies.sub && <div style={{ fontSize: "1rem", background: "#fdf8f4", color: "#8c6b51", padding: "4px 8px", borderRadius: "6px", fontWeight: "600", display: "inline-block", whiteSpace: "pre-line" }}>{brownies.sub}</div>}
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "1rem", color: "#a68a71", fontWeight: "700", marginBottom: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>PANOS</div>
            <div style={{ fontSize: "2.8rem", color: "#a68a71", fontWeight: "700", marginBottom: "12px", lineHeight: "1" }}>{panos.main}</div>
            {panos.sub && <div style={{ fontSize: "1rem", background: "#fdf8f4", color: "#8c6b51", padding: "4px 8px", borderRadius: "6px", fontWeight: "600", display: "inline-block", whiteSpace: "pre-line" }}>{panos.sub}</div>}
          </div>
          
        </div>

        {/* Footer Row */}
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "16px", display: "flex", justifyContent: "space-between", color: "#a68a71", fontSize: "1.2rem", fontWeight: "500", marginTop: "auto" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Icons.BsPerson /> {data.person}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Icons.BsClock /> {formatDateAndTime(data.created_at)}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#a17550", fontSize: "2rem" }}><Icons.BsArrowClockwise className="spin" /> Carregando Dashboard...</div>;
  }

  return (
    <div style={{ paddingLeft: "115px", paddingRight: "40px", paddingTop: "40px", paddingBottom: "40px", width: "100%", maxWidth: "1800px", minHeight: "100vh", background: "#fdfbf7", margin: "0 auto", boxSizing: "border-box" }}>
      
      {/* Page Title */}
      <div style={{ marginBottom: "32px", textAlign: "left" }}>
        <h1 style={{ fontSize: "3rem", color: "#78350f", margin: "0 0 8px 0", fontWeight: "700" }}>Dashboard</h1>
        <p style={{ color: "#78716c", fontSize: "1.4rem", margin: 0 }}>Visão geral das operações da Carmella Gelateria.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "32px", width: "100%" }}>
        
        {/* Checklists Section (Row 1, Col 1) */}
        <section style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <h2 style={{ fontSize: "1.8rem", color: "#44403c", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Icons.BsCardChecklist style={{ color: "#a17550" }} /> Últimos Checklists de Fechamento
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", flex: 1 }}>
            <ChecklistCard title="Alto da XV" data={checklists.altoxv} />
            <ChecklistCard title="Ahú" data={checklists.ahu} />
          </div>
        </section>

        {/* Resumo de Estoque (Row 1, Col 2) */}
        <section style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <h2 style={{ fontSize: "1.8rem", color: "#44403c", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Icons.BsBoxSeam style={{ color: "#a17550" }} /> Resumo de Estoque
          </h2>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Loja Ahú */}
              <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "1.6rem", color: "#334155", fontWeight: "600" }}>Loja Ahú</span>
                  <span style={{ background: "#fef3c7", color: "#b45309", padding: "6px 16px", borderRadius: "20px", fontWeight: "bold", fontSize: "1.3rem" }}>
                    {estoque.ahu.vitrine + estoque.ahu.estoque} cubas totais
                  </span>
                </div>
                <div style={{ display: "flex", gap: "16px", color: "#64748b", fontSize: "1.3rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }}></div> Vitrine: {estoque.ahu.vitrine}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }}></div> Estoque: {estoque.ahu.estoque}</span>
                </div>
              </div>

              {/* Loja Alto XV */}
              <div style={{ paddingBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "1.6rem", color: "#334155", fontWeight: "600" }}>Loja Alto XV</span>
                  <span style={{ background: "#fef3c7", color: "#b45309", padding: "6px 16px", borderRadius: "20px", fontWeight: "bold", fontSize: "1.3rem" }}>
                    {estoque.altoxv.vitrine + estoque.altoxv.estoque} cubas totais
                  </span>
                </div>
                <div style={{ display: "flex", gap: "16px", color: "#64748b", fontSize: "1.3rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }}></div> Vitrine: {estoque.altoxv.vitrine}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }}></div> Estoque: {estoque.altoxv.estoque}</span>
                </div>
              </div>

            </div>
            
            <Link to="/estoque-lojas" style={{ display: "block", textAlign: "center", marginTop: "32px", color: "#4f46e5", textDecoration: "none", fontWeight: "600", fontSize: "1.3rem" }}>
              Ver Estoque Completo &rarr;
            </Link>
          </div>
        </section>

        {/* Notificações Section (Row 2, Col 1) */}
        <section style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <h2 style={{ fontSize: "1.8rem", color: "#44403c", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Icons.BsBell style={{ color: "#a17550" }} /> Notificações e Instruções
          </h2>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", flex: 1, display: "flex", flexDirection: "column" }}>
            
            {notificacoes.length === 0 ? (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", color: "#64748b" }}>
                <Icons.BsCheckCircle style={{ fontSize: "2rem", color: "#10b981", flexShrink: 0 }} />
                <div>
                  <h3 style={{ margin: "0 0 8px 0", color: "#334155", fontSize: "1.5rem" }}>Tudo certo por aqui!</h3>
                  <p style={{ margin: 0, fontSize: "1.3rem", lineHeight: "1.5" }}>Não há nenhuma notificação ou recado importante no momento.</p>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {notificacoes.map((notif) => {
                  return (
                    <div key={notif.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0", borderBottom: "1px solid #fef2f2" }}>
                      <Icons.BsExclamationTriangle style={{ fontSize: "1.8rem", color: "#ef4444", flexShrink: 0 }} />
                      <span style={{ color: "#ef4444", fontSize: "1.4rem", fontWeight: "600" }}>{notif.titulo}</span>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </section>

        {/* Quem Folga Hoje (Row 2, Col 2) */}
        <section style={{ display: "flex", flexDirection: "column", alignSelf: "start" }}>
          <h2 style={{ fontSize: "1.8rem", color: "#44403c", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Icons.BsCupHot style={{ color: "#10b981" }} /> Folgas de Hoje
          </h2>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
            
            {folgas.length === 0 ? (
              <p style={{ color: "#94a3b8", fontStyle: "italic", margin: 0, fontSize: "1.3rem" }}>Ninguém de folga hoje.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {folgas.map((folga, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "12px 16px", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                    <span style={{ fontWeight: "600", color: "#334155", fontSize: "1.4rem" }}>{folga.name}</span>
                    <span style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "600", ...getFolgaStyle(folga.status) }}>{folga.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
      
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Home;
