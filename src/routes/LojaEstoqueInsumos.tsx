import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/Frequencia.css";

const STORES = [
  { id: "mh", name: "Estoque MH" },
  { id: "ahu", name: "Loja Ahú" },
  { id: "altoxv", name: "Loja Alto XV" },
  { id: "fabrica", name: "Fábrica" },
];

function LojaEstoqueInsumos() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [activeTab, setActiveTab] = useState(STORES[0].id);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [lastInventoryDate, setLastInventoryDate] = useState<string | null>(null);
  
  const [insumos, setInsumos] = useState<any[]>([]);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showConfigCols, setShowConfigCols] = useState(false);
  const [sortByStatus, setSortByStatus] = useState(false);
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [shoppingDrafts, setShoppingDrafts] = useState<Array<{ key: string; insumo_id: string; quantidade: string }>>([]);
  const [sendingToShopping, setSendingToShopping] = useState(false);
  const [editingShoppingRowKey, setEditingShoppingRowKey] = useState<string | null>(null);

  useEffect(() => {
    fetchInsumos();
  }, []);

  useEffect(() => {
    fetchStockForTab();
  }, [activeTab, selectedDate]);

  async function fetchInsumos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cadastro_insumos")
        .select("id, nome, tipo, ativo, config_estoque, ordem, inventario_especial, estoque_nome")
        .eq("ativo", true)
        .order("ordem", { ascending: true })
        .order("nome", { ascending: true });

      if (error) throw error;
      setInsumos(data || []);
    } catch (err) {
      console.error("Erro ao buscar insumos:", err);
      alert("Erro ao carregar os insumos.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchStockForTab(): Promise<Record<string, number>> {
    try {
      setLoading(true);
      const unitName = STORES.find(s => s.id === activeTab)?.name;
       if (!unitName) return {};

      // 1. Fetch latest inventory counts
      const { data: invData, error: invError } = await supabase
        .from("inventario_insumos")
        .select("insumo_id, data_inventario, quantidade")
        .eq("unidade", unitName)
        .lte("data_inventario", selectedDate)
        .order("data_inventario", { ascending: false })
        .limit(5000);

      if (invError) throw invError;

      const latestInv: Record<string, { data: string, quantidade: number }> = {};
      let maxDate = "";
      
      (invData || []).forEach(inv => {
        if (!latestInv[inv.insumo_id] || inv.data_inventario > latestInv[inv.insumo_id].data) {
          latestInv[inv.insumo_id] = { data: inv.data_inventario, quantidade: Number(inv.quantidade) };
        }
        if (inv.data_inventario > maxDate) {
          maxDate = inv.data_inventario;
        }
      });
      setLastInventoryDate(maxDate !== "" ? maxDate : null);

      // 2. Fetch movements
      const { data: movData, error: movError } = await supabase
        .from("movimentacoes_estoque")
        .select("insumo_id, data_movimentacao, quantidade, origem, destino")
        .or(`origem.eq.${unitName},destino.eq.${unitName}`)
        .lte("data_movimentacao", selectedDate);

      if (movError) throw movError;

      const calculatedStock: Record<string, number> = {};

      // Initialize with inventory quantities
      Object.keys(latestInv).forEach(insumoId => {
        calculatedStock[insumoId] = latestInv[insumoId].quantidade;
      });

      // Add/subtract movements
      (movData || []).forEach(mov => {
        const inv = latestInv[mov.insumo_id];
        
        // Skip movements that occurred strictly BEFORE the inventory date
        // Movements on the SAME date are considered
        if (inv && mov.data_movimentacao < inv.data) {
          return;
        }

        if (calculatedStock[mov.insumo_id] === undefined) {
          calculatedStock[mov.insumo_id] = 0;
        }
        
        if (mov.destino === unitName) {
          calculatedStock[mov.insumo_id] += Number(mov.quantidade);
        }
        if (mov.origem === unitName) {
          calculatedStock[mov.insumo_id] -= Number(mov.quantidade);
        }
      });

      setStockMap(calculatedStock);
      return calculatedStock;
    } catch (err) {
      console.error("Erro ao buscar movimentações/inventário:", err);
      alert("Erro ao calcular o estoque.");
    } finally {
      setLoading(false);
    }
    return {};
  }

  async function openShoppingModal() {
    const currentStock = await fetchStockForTab();
    const rows = visibleInsumos.map(insumo => {
      const config = insumo.config_estoque?.[activeTab] || {};
      const toOrder = Math.max(0, Number(config.desejado || 0) - Number(currentStock[insumo.id] || 0));
      return { key: insumo.id, insumo_id: insumo.id, quantidade: String(toOrder) };
    });
    setShoppingDrafts(rows);
    setEditingShoppingRowKey(null);
    setShowShoppingModal(true);
  }

  function addShoppingDraft() {
    const key = crypto.randomUUID();
    setShoppingDrafts(rows => [...rows, { key, insumo_id: "", quantidade: "" }]);
    setEditingShoppingRowKey(key);
  }

  async function sendStockShoppingList() {
    const validRows = shoppingDrafts.filter(row => row.insumo_id && Number.isFinite(Number(row.quantidade)) && Number(row.quantidade) > 0);
    if (!validRows.length) {
      alert("Informe ao menos um insumo com quantidade maior que zero.");
      return;
    }
    setSendingToShopping(true);
    try {
      let { data: list, error } = await supabase.from("lista_compras_manual")
        .select("id").eq("status", "Aberta").order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (error) throw error;
      if (!list) {
        const result = await supabase.from("lista_compras_manual")
          .insert({ nome: "Lista de Compras", user_id: user?.id || null, criado_por: `Criado a Partir do Estoque - ${STORES.find(store => store.id === activeTab)?.name || "Estoque"}` })
          .select("id").single();
        if (result.error) throw result.error;
        list = result.data;
      }

      const quantityByIngredient = new Map<string, number>();
      validRows.forEach(row => quantityByIngredient.set(row.insumo_id, (quantityByIngredient.get(row.insumo_id) || 0) + Number(row.quantidade)));
      const stockOrigin = STORES.find(store => store.id === activeTab)?.name || "Estoque";
      const inserts = Array.from(quantityByIngredient.entries()).map(([insumo_id, quantidade]) => ({ lista_id: list!.id, insumo_id, quantidade, origem: stockOrigin }));
      const { error: insertError } = await supabase.from("lista_compras_manual_itens").insert(inserts);
      if (insertError) throw insertError;
      setShowShoppingModal(false);
      setEditingShoppingRowKey(null);
      alert("Insumos enviados para a lista de compras.");
    } catch (error: any) {
      console.error("Erro ao enviar insumos do estoque para compras:", error);
      alert(`Não foi possível enviar os insumos: ${error.message || "erro inesperado"}`);
    } finally {
      setSendingToShopping(false);
    }
  }

  let visibleInsumos = insumos.filter(insumo => insumo.config_estoque?.[activeTab]?.ativo === true);

  if (sortByStatus) {
    visibleInsumos.sort((a, b) => {
      const configA = a.config_estoque?.[activeTab] || {};
      const configB = b.config_estoque?.[activeTab] || {};
      const currentA = stockMap[a.id] || 0;
      const currentB = stockMap[b.id] || 0;

      const getStatusScore = (current: number, min: number | undefined | null, desired: number | undefined | null) => {
        if (min != null && current < min) return 1; // Critical
        if (desired != null && current < desired) return 2; // Warning
        return 3; // OK
      };

      const scoreA = getStatusScore(currentA, configA.minimo, configA.desejado);
      const scoreB = getStatusScore(currentB, configB.minimo, configB.desejado);

      return scoreA - scoreB;
    });
  }

  const formatDateBR = (isoStr: string) => {
    if (!isoStr) return "";
    const [y, m, d] = isoStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <>
      <Helmet>
        <title>Loja - Estoque Insumos</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Estoque Insumos</h1>
            <p>Relatório de estoque calculado dinamicamente com base no histórico de movimentações.</p>
          </div>
        </div>

        <div style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "24px",
            borderBottom: "2px solid #e2e8f0",
            paddingBottom: "16px"
          }}>
            {/* Tab Navigation */}
            <div style={{ 
              display: "flex", 
              gap: "12px", 
              overflowX: "auto"
            }}>
              {STORES.map((store) => (
                <button
                  key={store.id}
                  onClick={() => setActiveTab(store.id)}
                  style={{
                    padding: "10px 24px",
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: activeTab === store.id ? "#a17550" : "#f1f5f9",
                    color: activeTab === store.id ? "#fff" : "#64748b",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap"
                  }}
                >
                  {store.name}
                </button>
              ))}
            </div>

            {/* Options & Badges */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => showShoppingModal ? setShowShoppingModal(false) : void openShoppingModal()}
                style={{ padding: "10px 16px", border: 0, borderRadius: "8px", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: "1.1rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                {showShoppingModal ? <><Icons.BsX /> Sair do Modo Edição</> : <><Icons.BsCartCheck /> Enviar para Compras</>}
              </button>
              <button
                onClick={() => setSortByStatus(!sortByStatus)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: sortByStatus ? "#f1f5f9" : "#fff",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s"
                }}
              >
                <Icons.BsFilter />
                {sortByStatus ? "Remover Ordenação de Status" : "Ordenar por Status Crítico"}
              </button>

              <button
                onClick={() => setShowConfigCols(!showConfigCols)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: showConfigCols ? "#f1f5f9" : "#fff",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s"
                }}
              >
                {showConfigCols ? <Icons.BsEyeSlashFill /> : <Icons.BsEyeFill />}
                {showConfigCols ? "Ocultar Config. de Estoque" : "Ver Config. de Estoque"}
              </button>
              
              {/* Last Inventory Badge */}
              {lastInventoryDate ? (
                <div style={{
                  backgroundColor: "#eef2ff",
                color: "#4338ca",
                padding: "12px 20px",
                borderRadius: "8px",
                fontSize: "1.2rem",
                fontWeight: 600,
                border: "1px solid #e0e7ff",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
              }}>
                <Icons.BsInfoCircleFill />
                Baseado no inventário de {formatDateBR(lastInventoryDate)}
              </div>
            ) : (
              <div style={{
                backgroundColor: "#fff7ed",
                color: "#c2410c",
                padding: "12px 20px",
                borderRadius: "8px",
                fontSize: "1.2rem",
                fontWeight: 600,
                border: "1px solid #ffedd5",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
              }}>
                <Icons.BsExclamationTriangleFill />
                Nenhum inventário base encontrado
              </div>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : visibleInsumos.length === 0 && !showShoppingModal ? (
            <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
              <Icons.BsBoxSeam style={{ fontSize: "3rem", color: "#cbd5e1", marginBottom: "16px" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", margin: 0 }}>
                Nenhum insumo configurado como ativo para esta unidade.
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "8px" }}>
                Acesse a tela "Configuração de Estoque" para ativar insumos para {STORES.find(s => s.id === activeTab)?.name}.
              </p>
            </div>
          ) : (
            <>
            {showShoppingModal && <div style={{ margin: "0 0 12px", padding: "12px 16px", border: "1px solid #e2d4c4", borderRadius: 8, background: "#f8f2eb", color: "#80501f" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Lista de compras</h2>
              <p style={{ margin: "4px 0 0", color: "#64748b" }}>Use o ícone de edição na linha para alterar o insumo ou a quantidade.</p>
            </div>}
            <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <table className="freq-table" style={{ minWidth: "900px" }}>
                <thead>
                  <tr style={{ fontSize: "1.1rem" }}>
                    <th style={{ width: "250px" }}>Insumo</th>
                    <th style={{ width: "100px" }}>Tipo</th>
                    {showConfigCols && <th style={{ textAlign: "center", width: "120px" }}>Estoque Mínimo</th>}
                    {showConfigCols && <th style={{ textAlign: "center", width: "120px" }}>Estoque Desejado</th>}
                    <th style={{ textAlign: "center", width: "150px", color: "var(--primary-color)" }}>Estoque Atual</th>
                    <th style={{ width: "80px", textAlign: "center" }}>Status</th>
                    <th style={{ textAlign: "center", width: "150px" }}>Para Pedir</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleInsumos.map((baseInsumo) => {
                    const row = shoppingDrafts.find(draft => draft.key === baseInsumo.id);
                    if (showShoppingModal && !row) return null;
                    const isEditing = showShoppingModal && editingShoppingRowKey === baseInsumo.id;
                    const insumo = showShoppingModal ? insumos.find(item => item.id === row?.insumo_id) || baseInsumo : baseInsumo;
                    const config = insumo.config_estoque?.[activeTab] || {};
                    const min = config.minimo;
                    const desired = config.desejado;
                    
                    // The calculated dynamic stock
                    const current = stockMap[insumo.id] || 0;
                    
                    let toOrder = null;
                    if (desired != null && current != null) {
                      toOrder = desired - current;
                      if (toOrder < 0) toOrder = 0;
                    }

                    let rowBg = "#f0fdf4"; // light green
                    if (min != null && current < min) {
                      rowBg = "#fef2f2"; // light red
                    } else if (desired != null && current < desired) {
                      rowBg = "#fefce8"; // light yellow
                    }

                    const getTagStyles = (tipo: string) => {
                      switch (tipo) {
                        case "Insumos": return { bg: "#e0f2fe", color: "#0284c7", border: "#bae6fd" };
                        case "Matéria Prima": return { bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" };
                        case "Bebidas": return { bg: "#f3e8ff", color: "#9333ea", border: "#e9d5ff" };
                        case "Material de Limpeza": return { bg: "#ccfbf1", color: "#0d9488", border: "#99f6e4" };
                        case "Salgados": return { bg: "#ffedd5", color: "#ea580c", border: "#fed7aa" };
                        default: return { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" };
                      }
                    };
                    const tagStyle = getTagStyles(insumo.tipo);

                    return (
                      <tr key={baseInsumo.id} style={{ backgroundColor: rowBg, transition: "background 0.2s" }}>
                        <td style={{ fontWeight: 600, fontSize: "1.3rem" }}>{isEditing ? <select aria-label="Insumo para compras" value={row?.insumo_id || ""} onChange={event => setShoppingDrafts(rows => rows.map(item => item.key === baseInsumo.id ? { ...item, insumo_id: event.target.value } : item))} style={{ boxSizing: "border-box", width: "100%", minWidth: 220, height: 38, padding: "0 8px", border: "1px solid #cbd5e1", borderRadius: 5, background: "#fff" }}>{insumos.map(item => <option key={item.id} value={item.id}>{item.estoque_nome || item.nome}</option>)}</select> : (insumo.estoque_nome || insumo.nome)}</td>
                        <td>
                            <span style={{
                              padding: "6px 12px", 
                              backgroundColor: tagStyle.bg, 
                              borderRadius: "6px", 
                              fontSize: "1.1rem", 
                              fontWeight: 600,
                              color: tagStyle.color,
                              border: `1px solid ${tagStyle.border}`
                            }}>
                              {insumo.tipo || "-"}
                            </span>
                        </td>
                        {showConfigCols && (
                          <td style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "1.3rem", fontWeight: 500 }}>
                            {min != null ? (insumo.inventario_especial ? `${min}%` : min) : "-"}
                          </td>
                        )}
                        {showConfigCols && (
                          <td style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "1.3rem", fontWeight: 500 }}>
                            {desired != null ? (insumo.inventario_especial ? `${desired}%` : desired) : "-"}
                          </td>
                        )}
                        <td style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}>
                          {insumo.inventario_especial ? `${stockMap[insumo.id] || 0}%` : (stockMap[insumo.id] || 0)}
                        </td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                          {(() => { const selectedCurrent = stockMap[insumo.id] || 0; const selectedMin = config.minimo; const selectedDesired = config.desejado; return selectedMin != null && selectedCurrent < selectedMin ? <Icons.BsXCircleFill style={{ color: "#dc2626", fontSize: "1.6rem" }} title="Estoque Crítico (Abaixo do Mínimo)" /> : selectedDesired != null && selectedCurrent < selectedDesired ? <Icons.BsExclamationCircleFill style={{ color: "#eab308", fontSize: "1.6rem" }} title="Atenção (Abaixo do Desejado)" /> : <Icons.BsCheckCircleFill style={{ color: "#16a34a", fontSize: "1.6rem" }} title="Estoque Ideal" />; })()}
                        </td>
                        <td style={{ 
                          textAlign: "center", 
                          fontWeight: 700, 
                          fontSize: "1.4rem",
                          color: toOrder != null && toOrder > 0 ? "var(--primary-color)" : "var(--text-muted)" 
                        }}>
                          {showShoppingModal && row ? (isEditing ? <><input aria-label={`Quantidade para ${insumo.nome}`} type="number" min="0" step="any" value={row.quantidade} onChange={event => setShoppingDrafts(rows => rows.map(item => item.key === baseInsumo.id ? { ...item, quantidade: event.target.value } : item))} style={{ width: 86, height: 32, border: "1px solid #cbd5e1", borderRadius: 5, textAlign: "center" }} /><button type="button" title="Salvar edição" aria-label="Salvar edição" onClick={() => setEditingShoppingRowKey(null)} style={{ marginLeft: 5, border: 0, background: "transparent", color: "#15803d", cursor: "pointer" }}><Icons.BsCheck2 /></button><button type="button" title="Remover da lista de compras" aria-label="Remover da lista de compras" onClick={() => { setShoppingDrafts(rows => rows.filter(item => item.key !== baseInsumo.id)); setEditingShoppingRowKey(null); }} style={{ marginLeft: 4, border: 0, background: "transparent", color: "#dc2626", cursor: "pointer" }}><Icons.BsTrash /></button></> : <>{row.quantidade || 0}<button type="button" title="Editar insumo e quantidade" aria-label="Editar insumo e quantidade" disabled={Boolean(editingShoppingRowKey)} onClick={() => setEditingShoppingRowKey(baseInsumo.id)} style={{ marginLeft: 7, border: 0, background: "transparent", color: "#2563eb", cursor: editingShoppingRowKey ? "not-allowed" : "pointer", opacity: editingShoppingRowKey ? .5 : 1 }}><Icons.BsPencil /></button><button type="button" title="Remover da lista de compras" aria-label="Remover da lista de compras" disabled={Boolean(editingShoppingRowKey)} onClick={() => setShoppingDrafts(rows => rows.filter(item => item.key !== baseInsumo.id))} style={{ marginLeft: 4, border: 0, background: "transparent", color: "#dc2626", cursor: editingShoppingRowKey ? "not-allowed" : "pointer", opacity: editingShoppingRowKey ? .5 : 1 }}><Icons.BsTrash /></button></>) : toOrder != null ? (insumo.inventario_especial ? `${toOrder}%` : toOrder) : "-"}
                        </td>
                      </tr>
                    );
                  })}
                  {showShoppingModal && shoppingDrafts.filter(row => !visibleInsumos.some(insumo => insumo.id === row.key)).map(row => {
                    const insumo = insumos.find(item => item.id === row.insumo_id);
                    const config = insumo?.config_estoque?.[activeTab] || {};
                    const current = stockMap[row.insumo_id] || 0;
                    const min = config.minimo;
                    const desired = config.desejado;
                    const isEditing = editingShoppingRowKey === row.key;
                    const rowBg = min != null && current < min ? "#fef2f2" : desired != null && current < desired ? "#fefce8" : "#f0fdf4";
                    return <tr key={row.key} style={{ backgroundColor: rowBg }}>
                      <td style={{ fontWeight: 600, fontSize: "1.3rem" }}>{isEditing ? <select aria-label="Selecionar insumo" value={row.insumo_id} onChange={event => setShoppingDrafts(rows => rows.map(item => item.key === row.key ? { ...item, insumo_id: event.target.value } : item))} style={{ width: "100%", height: 38, padding: "0 8px", border: "1px solid #cbd5e1", borderRadius: 5, background: "#fff" }}><option value="">Selecione um insumo</option>{insumos.map(item => <option key={item.id} value={item.id}>{item.estoque_nome || item.nome}</option>)}</select> : (insumo?.estoque_nome || insumo?.nome || "—")}</td>
                      <td><span style={{ padding: "6px 12px", borderRadius: 6, background: "#e0f2fe", color: "#0284c7", fontSize: "1.1rem", fontWeight: 600 }}>{insumo?.tipo || "-"}</span></td>
                      {showConfigCols && <td style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "1.3rem" }}>{min ?? "-"}</td>}
                      {showConfigCols && <td style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "1.3rem" }}>{desired ?? "-"}</td>}
                      <td style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}>{current}</td>
                      <td style={{ textAlign: "center" }}>{min != null && current < min ? <Icons.BsXCircleFill style={{ color: "#dc2626", fontSize: "1.6rem" }} /> : desired != null && current < desired ? <Icons.BsExclamationCircleFill style={{ color: "#eab308", fontSize: "1.6rem" }} /> : <Icons.BsCheckCircleFill style={{ color: "#16a34a", fontSize: "1.6rem" }} />}</td>
                      <td style={{ textAlign: "center", fontWeight: 700, fontSize: "1.4rem", color: "var(--primary-color)" }}>{isEditing ? <><input aria-label="Quantidade para pedir" type="number" min="0" step="any" value={row.quantidade} onChange={event => setShoppingDrafts(rows => rows.map(item => item.key === row.key ? { ...item, quantidade: event.target.value } : item))} style={{ width: 86, height: 32, border: "1px solid #cbd5e1", borderRadius: 5, textAlign: "center" }} /><button type="button" title="Salvar edição" onClick={() => { if (!row.insumo_id) { alert("Selecione um insumo."); return; } setEditingShoppingRowKey(null); }} style={{ marginLeft: 5, border: 0, background: "transparent", color: "#15803d", cursor: "pointer" }}><Icons.BsCheck2 /></button></> : <>{row.quantidade}<button type="button" title="Editar" onClick={() => setEditingShoppingRowKey(row.key)} style={{ marginLeft: 7, border: 0, background: "transparent", color: "#2563eb", cursor: "pointer" }}><Icons.BsPencil /></button><button type="button" title="Remover" onClick={() => setShoppingDrafts(rows => rows.filter(item => item.key !== row.key))} style={{ marginLeft: 4, border: 0, background: "transparent", color: "#dc2626", cursor: "pointer" }}><Icons.BsTrash /></button></>}</td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
            {showShoppingModal && <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
              <button type="button" onClick={addShoppingDraft} style={{ padding: "9px 14px", border: "1px solid #cbd5e1", borderRadius: 6, background: "#fff", color: "#475569", fontWeight: 700, cursor: "pointer" }}><Icons.BsPlus /> Adicionar insumo</button>
              <button type="button" onClick={() => void sendStockShoppingList()} disabled={sendingToShopping} style={{ padding: "9px 16px", border: 0, borderRadius: 6, background: "#16a34a", color: "#fff", fontWeight: 700, cursor: sendingToShopping ? "wait" : "pointer" }}>{sendingToShopping ? "Enviando..." : <><Icons.BsCartCheck /> Enviar para Compras</>}</button>
            </div>}
            </>
          )}
        </div>
      </div>

    </>
  );
}

export default LojaEstoqueInsumos;
