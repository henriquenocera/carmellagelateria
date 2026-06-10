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
        .select("id, nome, tipo, ativo, config_estoque, ordem, inventario_especial")
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

  async function fetchStockForTab() {
    try {
      setLoading(true);
      const unitName = STORES.find(s => s.id === activeTab)?.name;
      if (!unitName) return;

      // 1. Fetch latest inventory counts
      const { data: invData, error: invError } = await supabase
        .from("inventario_insumos")
        .select("insumo_id, data_inventario, quantidade")
        .eq("unidade", unitName)
        .lte("data_inventario", selectedDate);

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
    } catch (err) {
      console.error("Erro ao buscar movimentações/inventário:", err);
      alert("Erro ao calcular o estoque.");
    } finally {
      setLoading(false);
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
          ) : visibleInsumos.length === 0 ? (
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
                  {visibleInsumos.map((insumo) => {
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
                    let statusIcon = <Icons.BsCheckCircleFill style={{ color: "#16a34a", fontSize: "1.6rem" }} title="Estoque Ideal" />;
                    if (min != null && current < min) {
                      rowBg = "#fef2f2"; // light red
                      statusIcon = <Icons.BsXCircleFill style={{ color: "#dc2626", fontSize: "1.6rem" }} title="Estoque Crítico (Abaixo do Mínimo)" />;
                    } else if (desired != null && current < desired) {
                      rowBg = "#fefce8"; // light yellow
                      statusIcon = <Icons.BsExclamationCircleFill style={{ color: "#eab308", fontSize: "1.6rem" }} title="Atenção (Abaixo do Desejado)" />;
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
                      <tr key={insumo.id} style={{ backgroundColor: rowBg, transition: "background 0.2s" }}>
                        <td style={{ fontWeight: 600, fontSize: "1.3rem" }}>{insumo.nome}</td>
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
                          {insumo.inventario_especial ? `${current}%` : current}
                        </td>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                          {statusIcon}
                        </td>
                        <td style={{ 
                          textAlign: "center", 
                          fontWeight: 700, 
                          fontSize: "1.4rem",
                          color: toOrder != null && toOrder > 0 ? "var(--primary-color)" : "var(--text-muted)" 
                        }}>
                          {toOrder != null ? (insumo.inventario_especial ? `${toOrder}%` : toOrder) : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default LojaEstoqueInsumos;
