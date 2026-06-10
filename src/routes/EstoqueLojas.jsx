import React, { useEffect, useState } from "react";
import supabase from "../services/supabase-client";
import * as Icons from "react-icons/bs";

const fetchEstoque = async () => {
  const [ahuRes, altoXvRes] = await Promise.all([
    supabase.from("cardsahu").select("id, title, status, production_date, entry_date").in("status", ["vitrine-atual", "freezer-estoque"]),
    supabase.from("cardsaltoxv").select("id, title, status, production_date, entry_date").in("status", ["vitrine-atual", "freezer-estoque"])
  ]);

  if (ahuRes.error) console.error("Erro ao buscar Ahú:", ahuRes.error);
  if (altoXvRes.error) console.error("Erro ao buscar Alto XV:", altoXvRes.error);

  return {
    ahu: ahuRes.data || [],
    altoxv: altoXvRes.data || []
  };
};

const processData = (data) => {
  const vitrine = [];
  const estoque = [];
  const today = new Date();

  // Remove time portion of today for accurate day diff
  today.setHours(0, 0, 0, 0);

  data.forEach(item => {
    // Handling potential date string formats
    let prodDateObj = null;
    if (item.production_date) {
      const parts = item.production_date.split('-');
      if (parts.length === 3) {
        prodDateObj = new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        prodDateObj = new Date(item.production_date);
      }
    }

    let entryDateObj = null;
    if (item.entry_date) {
      const parts = item.entry_date.split('-');
      if (parts.length === 3) {
        entryDateObj = new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        entryDateObj = new Date(item.entry_date);
      }
    }

    const formatDate = (d) => {
      if (!d) return "-";
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    };

    let daysOld = null;
    if (prodDateObj) {
      const diffTime = today - prodDateObj;
      daysOld = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    const processedItem = {
      id: item.id || Math.random().toString(),
      flavor: item.title,
      prodDateFormatted: formatDate(prodDateObj),
      entryDateFormatted: formatDate(entryDateObj),
      prodDate: prodDateObj,
      entryDate: entryDateObj,
      daysOld: daysOld
    };

    if (item.status === "vitrine-atual") {
      vitrine.push(processedItem);
    } else {
      estoque.push(processedItem);
    }
  });

  estoque.sort((a, b) => {
    if (!a.prodDate) return 1;
    if (!b.prodDate) return -1;
    return a.prodDate - b.prodDate; // Oldest first
  });

  vitrine.sort((a, b) => {
    if (!a.entryDate) return 1;
    if (!b.entryDate) return -1;
    return b.entryDate - a.entryDate; // Newest first
  });

  return { vitrine, estoque };
};

function EstoqueLojas() {
  const [data, setData] = useState({ ahu: { vitrine: [], estoque: [] }, altoxv: { vitrine: [], estoque: [] } });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ahu");

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      const res = await fetchEstoque();
      if (isMounted) {
        setData({
          ahu: processData(res.ahu),
          altoxv: processData(res.altoxv)
        });
        setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  const CardItem = ({ item, isEstoque }) => (
    <div style={{ background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", marginBottom: "12px", border: "1px solid rgba(0,0,0,0.05)", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <h4 style={{ margin: 0, fontSize: "1.4rem", color: "#334155", fontWeight: "600", paddingRight: "40px" }}>{item.flavor}</h4>
        {isEstoque && item.daysOld !== null && item.daysOld >= 0 && (
          <span style={{ background: "#ef4444", color: "#fff", padding: "4px 8px", borderRadius: "20px", fontSize: "1.1rem", fontWeight: "bold", position: "absolute", top: "16px", right: "16px" }}>
            {item.daysOld}d
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed #e2e8f0", paddingBottom: "4px" }}>
          <span style={{ color: "#64748b", fontSize: "1.2rem" }}>Data de produção</span>
          <span style={{ color: "#0f172a", fontSize: "1.2rem", fontWeight: "500" }}>{item.prodDateFormatted}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#64748b", fontSize: "1.2rem" }}>Data de entrada</span>
          <span style={{ color: "#0f172a", fontSize: "1.2rem", fontWeight: "500" }}>{item.entryDateFormatted}</span>
        </div>
      </div>
    </div>
  );

  const StoreSection = ({ title, storeData, maxVitrine = 16, maxEstoque = 18 }) => (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
      <h2 style={{ fontSize: "2.2rem", color: "#a17550", marginBottom: "24px", borderBottom: "2px solid #f0f0f0", paddingBottom: "12px", textAlign: "center" }}>
        {title}
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>

        {/* Freezer Estoque Column */}
        <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "16px", border: "1px solid #e2e8f0", maxHeight: "800px", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.6rem", color: "#1e293b", fontWeight: "700" }}>Freezer Estoque</h3>
              <span style={{ background: "#e2e8f0", color: "#475569", padding: "2px 8px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "600" }}>
                {storeData.estoque.length} / {maxEstoque}
              </span>
            </div>
          </div>
          <div style={{ color: "#b91c1c", fontSize: "1.1rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "4px" }}>
            <Icons.BsSortDown /> Mais antigos no topo
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {storeData.estoque.map(item => (
              <CardItem key={item.id} item={item} isEstoque={true} />
            ))}
            {storeData.estoque.length === 0 && <span style={{ color: "#94a3b8", fontStyle: "italic", textAlign: "center", display: "block", marginTop: "20px" }}>Nenhuma cuba no estoque.</span>}
          </div>
        </div>

        {/* Vitrine Atual Column */}
        <div style={{ background: "#ffedd5", borderRadius: "12px", padding: "16px", border: "1px solid #fed7aa", maxHeight: "800px", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <h3 style={{ margin: 0, fontSize: "1.6rem", color: "#1e293b", fontWeight: "700" }}>Vitrine Atual</h3>
            <span style={{ background: "#fed7aa", color: "#78350f", padding: "2px 8px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "600" }}>
              {storeData.vitrine.length} / {maxVitrine}
            </span>
          </div>
          <div style={{ color: "#b91c1c", fontSize: "1.1rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "4px" }}>
            <Icons.BsSortDown /> Mais novos no topo
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {storeData.vitrine.map(item => (
              <CardItem key={item.id} item={item} isEstoque={false} />
            ))}
            {storeData.vitrine.length === 0 && <span style={{ color: "#94a3b8", fontStyle: "italic", textAlign: "center", display: "block", marginTop: "20px" }}>Nenhuma cuba na vitrine.</span>}
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="container" style={{ paddingLeft: "115px", paddingTop: "40px", paddingBottom: "40px", maxWidth: "1500px", minHeight: "100vh" }}>
      <div style={{ width: "100%", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2.8rem", color: "#a17550", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
            <Icons.BsBoxSeam /> Estoque Lojas
          </h1>
          <p style={{ color: "#64748b", fontSize: "1.4rem", margin: 0 }}>Visão consolidada das cubas de gelato.</p>
        </div>
        <button
          onClick={async () => {
            setLoading(true);
            const res = await fetchEstoque();
            setData({ ahu: processData(res.ahu), altoxv: processData(res.altoxv) });
            setLoading(false);
          }}
          disabled={loading}
          style={{ background: "#a17550", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "1.3rem", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "0.2s" }}
        >
          <Icons.BsArrowRepeat style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          {loading ? "Atualizando..." : "Atualizar"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "2px solid #e2e8f0", paddingBottom: "16px", overflowX: "auto" }}>
        <button
          onClick={() => setActiveTab("ahu")}
          style={{
            padding: "10px 24px",
            fontSize: "1.4rem",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            backgroundColor: activeTab === "ahu" ? "#a17550" : "#f1f5f9",
            color: activeTab === "ahu" ? "#fff" : "#64748b",
            transition: "all 0.2s",
            whiteSpace: "nowrap"
          }}
        >
          Loja Ahú
        </button>
        <button
          onClick={() => setActiveTab("altoxv")}
          style={{
            padding: "10px 24px",
            fontSize: "1.4rem",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            backgroundColor: activeTab === "altoxv" ? "#a17550" : "#f1f5f9",
            color: activeTab === "altoxv" ? "#fff" : "#64748b",
            transition: "all 0.2s",
            whiteSpace: "nowrap"
          }}
        >
          Loja Alto XV
        </button>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      {loading && data.ahu.vitrine.length === 0 ? (
        <div style={{ width: "100%", textAlign: "center", padding: "60px 0" }}>
          <Icons.BsArrowRepeat style={{ fontSize: "3rem", color: "#a17550", animation: "spin 1s linear infinite" }} />
          <p style={{ color: "#64748b", fontSize: "1.4rem", marginTop: "16px" }}>Carregando informações...</p>
        </div>
      ) : (
        <div style={{ width: "100%" }}>
          {activeTab === "ahu" && (
            <StoreSection title="Loja Ahú" storeData={data.ahu} maxVitrine={16} maxEstoque={18} />
          )}
          {activeTab === "altoxv" && (
            <StoreSection title="Loja Alto XV" storeData={data.altoxv} maxVitrine={12} maxEstoque={18} />
          )}
        </div>
      )}
    </div>
  );
}

export default EstoqueLojas;
