import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../supabase-client";

const STORES = [
  { id: "mh", name: "Estoque MH" },
  { id: "ahu", name: "Loja Ahú" },
  { id: "altoxv", name: "Loja Alto XV" },
  { id: "fabrica", name: "Fábrica" },
];

function ListaCompras() {
  const [loading, setLoading] = useState(true);
  const [byUnit, setByUnit] = useState<Record<string, any[]>>({});
  const [aggregated, setAggregated] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    fetchListaCompras();
  }, []);

  async function fetchListaCompras() {
    try {
      setLoading(true);

      const entradasPromise = supabase
        .from("entradas_mercadoria")
        .select("insumo_id, data_compra, fornecedor, valor_unitario")
        .order("data_compra", { ascending: false })
        .order("created_at", { ascending: false })
        .then(res => {
          if (res.error && res.error.code === '42P01') return { data: [] };
          if (res.error) throw res.error;
          return res;
        });

      const [resInsumos, resInv, resMov, resEntradas] = await Promise.all([
        supabase.from("cadastro_insumos").select("*").eq("ativo", true).order("nome", { ascending: true }),
        supabase.from("inventario_insumos").select("insumo_id, data_inventario, quantidade, unidade").lte("data_inventario", getToday()),
        supabase.from("movimentacoes_estoque").select("insumo_id, data_movimentacao, quantidade, origem, destino").lte("data_movimentacao", getToday()),
        entradasPromise
      ]);

      if (resInsumos.error) throw resInsumos.error;
      if (resInv.error) throw resInv.error;
      if (resMov.error) throw resMov.error;

      const insumos = resInsumos.data || [];
      const allInv = resInv.data || [];
      const allMov = resMov.data || [];
      const allEntradas = resEntradas.data || [];

      // Organize entradas for stats
      const entradasByInsumo: Record<string, any[]> = {};
      allEntradas.forEach(e => {
         if (!entradasByInsumo[e.insumo_id]) entradasByInsumo[e.insumo_id] = [];
         entradasByInsumo[e.insumo_id].push(e);
      });

      // latestInv[unidade][insumo_id] = { data, quantidade }
      const latestInv: Record<string, Record<string, { data: string, quantidade: number }>> = {};
      allInv.forEach(inv => {
        if (!latestInv[inv.unidade]) latestInv[inv.unidade] = {};
        const curr = latestInv[inv.unidade][inv.insumo_id];
        if (!curr || inv.data_inventario > curr.data) {
          latestInv[inv.unidade][inv.insumo_id] = { data: inv.data_inventario, quantidade: Number(inv.quantidade) };
        }
      });

      // calculatedStock[unidade][insumo_id] = quantidade
      const calculatedStock: Record<string, Record<string, number>> = {};
      STORES.forEach(store => {
         calculatedStock[store.name] = {};
         const storeInv = latestInv[store.name] || {};
         Object.keys(storeInv).forEach(insId => {
           calculatedStock[store.name][insId] = storeInv[insId].quantidade;
         });
      });

      allMov.forEach(mov => {
         const processMovement = (unitName: string, isDestino: boolean) => {
             const inv = latestInv[unitName]?.[mov.insumo_id];
             if (inv && mov.data_movimentacao < inv.data) return; 
             
             if (calculatedStock[unitName] === undefined) calculatedStock[unitName] = {};
             if (calculatedStock[unitName][mov.insumo_id] === undefined) calculatedStock[unitName][mov.insumo_id] = 0;

             if (isDestino) {
                 calculatedStock[unitName][mov.insumo_id] += Number(mov.quantidade);
             } else {
                 calculatedStock[unitName][mov.insumo_id] -= Number(mov.quantidade);
             }
         };

         if (STORES.some(s => s.name === mov.destino)) processMovement(mov.destino, true);
         if (STORES.some(s => s.name === mov.origem)) processMovement(mov.origem, false);
      });

      const tempByUnit: Record<string, any[]> = {};
      const tempAggregateMap: Record<string, any> = {};

      insumos.forEach(ins => {
         // Calcula estatísticas do histórico
         let stats = null;
         const list = entradasByInsumo[ins.id] || [];
         if (list.length > 0) {
            const last = list[0];
            let min = Number(list[0].valor_unitario);
            let max = Number(list[0].valor_unitario);
            let sum = 0;
            list.forEach(item => {
               const val = Number(item.valor_unitario);
               if (val < min) min = val;
               if (val > max) max = val;
               sum += val;
            });
            stats = {
               ultimoValor: Number(last.valor_unitario),
               ultimaData: last.data_compra,
               ultimoFornecedor: last.fornecedor,
               media: sum / list.length,
               menor: min,
               maior: max
            };
         }

         STORES.forEach(store => {
            const config = ins.config_estoque?.[store.id];
            if (config?.ativo && config.desejado != null) {
               const current = calculatedStock[store.name]?.[ins.id] || 0;
               if (current < config.desejado) {
                  const toOrder = config.desejado - current;
                  
                  if (!tempByUnit[store.name]) tempByUnit[store.name] = [];
                  tempByUnit[store.name].push({
                      insumo: ins,
                      stats,
                      current,
                      desejado: config.desejado,
                      toOrder
                  });

                  if (!tempAggregateMap[ins.id]) {
                      tempAggregateMap[ins.id] = {
                          insumo: ins,
                          stats,
                          totalToOrder: 0,
                          details: [] 
                      };
                  }
                  tempAggregateMap[ins.id].totalToOrder += toOrder;
                  tempAggregateMap[ins.id].details.push({ storeName: store.name, toOrder });
               }
            }
         });
      });

      setByUnit(tempByUnit);
      
      const aggregatedArray = Object.values(tempAggregateMap).sort((a: any, b: any) => a.insumo.nome.localeCompare(b.insumo.nome));
      setAggregated(aggregatedArray);

    } catch (err) {
      console.error("Erro ao gerar lista de compras:", err);
      alert("Erro ao gerar lista de compras.");
    } finally {
      setLoading(false);
    }
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

  const formatCurrency = (val: number | null | undefined) => (val != null && !isNaN(val)) ? `R$ ${val.toFixed(2).replace('.', ',')}` : "-";
  const formatDateBR = (isoStr: string) => {
    if (!isoStr) return "-";
    const [y, m, d] = isoStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <>
      <Helmet>
        <title>Lista de Compras (Automático)</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Lista de Compras (Automático)</h1>
            <p>Gerada automaticamente com base nos insumos abaixo do estoque desejado.</p>
          </div>
          <button className="primary-btn" onClick={fetchListaCompras} disabled={loading}>
            <Icons.BsArrowClockwise style={{ marginRight: "8px" }} className={loading ? "spin" : ""} />
            Atualizar Lista
          </button>
        </div>

        <div style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", marginBottom: "20px", borderBottom: "2px solid #e2e8f0", paddingBottom: "16px" }}>
            <button
              onClick={() => setActiveTab("all")}
              style={{
                padding: "10px 24px", fontSize: "1.4rem", fontWeight: "bold", borderRadius: "8px", border: "none",
                cursor: "pointer", backgroundColor: activeTab === "all" ? "#a17550" : "#f1f5f9",
                color: activeTab === "all" ? "#fff" : "#64748b", transition: "all 0.2s"
              }}
            >
              Total a Comprar ({aggregated.length})
            </button>
            {STORES.map((store) => {
              const count = byUnit[store.name]?.length || 0;
              if (count === 0) return null; // Only show tabs for units that have things to buy
              
              return (
                <button
                  key={store.id}
                  onClick={() => setActiveTab(store.name)}
                  style={{
                    padding: "10px 24px", fontSize: "1.4rem", fontWeight: "bold", borderRadius: "8px", border: "none",
                    cursor: "pointer", backgroundColor: activeTab === store.name ? "#a17550" : "#f1f5f9",
                    color: activeTab === store.name ? "#fff" : "#64748b", transition: "all 0.2s"
                  }}
                >
                  {store.name} ({count})
                </button>
              );
            })}
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : activeTab === "all" ? (
            aggregated.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <Icons.BsCheckCircleFill style={{ fontSize: "3rem", color: "#16a34a", marginBottom: "16px" }} />
                <p style={{ color: "var(--text-dark)", fontSize: "1.4rem", fontWeight: 600, margin: 0 }}>
                  Estoque em dia!
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginTop: "8px" }}>
                  Não há nenhum insumo abaixo do nível desejado em nenhuma unidade.
                </p>
              </div>
            ) : (
              <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                <table className="freq-table" style={{ minWidth: "1600px" }}>
                  <thead>
                    <tr style={{ fontSize: "1.1rem" }}>
                      <th style={{ width: "200px" }}>Insumo</th>
                      <th style={{ width: "100px" }}>Tipo</th>
                      <th style={{ width: "100px", textAlign: "center" }}>Unid. Medida</th>
                      <th style={{ width: "100px", textAlign: "center", borderRight: "2px solid #e2e8f0" }}>Qtd a Comprar</th>
                      <th style={{ width: "100px", textAlign: "center", backgroundColor: "#f8fafc" }}>Último Valor</th>
                      <th style={{ width: "100px", textAlign: "center", backgroundColor: "#f8fafc" }}>Última Data</th>
                      <th style={{ width: "150px", textAlign: "center", backgroundColor: "#f8fafc", borderRight: "2px solid #e2e8f0" }}>Último Forn.</th>
                      <th style={{ width: "100px", textAlign: "center", backgroundColor: "#fffbeb" }}>Média</th>
                      <th style={{ width: "100px", textAlign: "center", backgroundColor: "#fffbeb" }}>Menor</th>
                      <th style={{ width: "100px", textAlign: "center", backgroundColor: "#fffbeb", borderRight: "2px solid #e2e8f0" }}>Maior</th>
                      <th style={{ width: "200px" }}>Detalhamento por Unidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregated.map((item) => {
                      const tagStyle = getTagStyles(item.insumo.tipo);
                      const stats = item.stats || {};
                      return (
                        <tr key={item.insumo.id}>
                          <td style={{ fontWeight: 600, fontSize: "1.2rem" }}>{item.insumo.nome}</td>
                          <td>
                            <span style={{
                              padding: "4px 8px", backgroundColor: tagStyle.bg, borderRadius: "6px", 
                              fontSize: "0.9rem", fontWeight: 600, color: tagStyle.color, border: `1px solid ${tagStyle.border}`, whiteSpace: "nowrap"
                            }}>
                              {item.insumo.tipo || "-"}
                            </span>
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "var(--text-dark)" }}>
                            {item.insumo.unidade_conversao || "-"}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.4rem", color: "var(--primary-color)", borderRight: "2px solid #e2e8f0" }}>
                            {item.totalToOrder}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "#475569", backgroundColor: "#f8fafc" }}>
                            {formatCurrency(stats.ultimoValor)}
                          </td>
                          <td style={{ textAlign: "center", fontSize: "1.1rem", color: "#475569", backgroundColor: "#f8fafc" }}>
                            {formatDateBR(stats.ultimaData)}
                          </td>
                          <td style={{ textAlign: "center", fontSize: "1.1rem", color: "#475569", backgroundColor: "#f8fafc", borderRight: "2px solid #e2e8f0" }}>
                            {stats.ultimoFornecedor || "-"}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "#92400e", backgroundColor: "#fffbeb" }}>
                            {formatCurrency(stats.media)}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "#92400e", backgroundColor: "#fffbeb" }}>
                            {formatCurrency(stats.menor)}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "#92400e", backgroundColor: "#fffbeb", borderRight: "2px solid #e2e8f0" }}>
                            {formatCurrency(stats.maior)}
                          </td>
                          <td style={{ color: "var(--text-dark)" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                              {item.details.map((det: any, idx: number) => (
                                <span key={idx} style={{ 
                                  background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", 
                                  fontSize: "0.9rem", fontWeight: 600, border: "1px solid #cbd5e1",
                                  display: "inline-flex", alignItems: "center", gap: "6px", color: "#475569"
                                }}>
                                  <Icons.BsShop style={{ color: "#94a3b8" }} />
                                  {det.storeName}: <span style={{ color: "var(--primary-color)" }}>{det.toOrder}</span>
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            byUnit[activeTab]?.length === 0 ? (
               <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Nada a pedir para {activeTab}.</p>
            ) : (
              <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                <table className="freq-table" style={{ minWidth: "1500px" }}>
                  <thead>
                    <tr style={{ fontSize: "1.1rem" }}>
                      <th style={{ width: "200px" }}>Insumo</th>
                      <th style={{ width: "100px" }}>Tipo</th>
                      <th style={{ width: "100px", textAlign: "center" }}>Unid. Medida</th>
                      <th style={{ width: "100px", textAlign: "center" }}>Estoque Atual</th>
                      <th style={{ width: "100px", textAlign: "center" }}>Estoque Desejado</th>
                      <th style={{ width: "100px", textAlign: "center", color: "var(--primary-color)", borderRight: "2px solid #e2e8f0" }}>A Pedir</th>
                      <th style={{ width: "100px", textAlign: "center", backgroundColor: "#f8fafc" }}>Último Valor</th>
                      <th style={{ width: "100px", textAlign: "center", backgroundColor: "#f8fafc" }}>Última Data</th>
                      <th style={{ width: "150px", textAlign: "center", backgroundColor: "#f8fafc", borderRight: "2px solid #e2e8f0" }}>Último Forn.</th>
                      <th style={{ width: "100px", textAlign: "center", backgroundColor: "#fffbeb" }}>Média</th>
                      <th style={{ width: "100px", textAlign: "center", backgroundColor: "#fffbeb" }}>Menor</th>
                      <th style={{ width: "100px", textAlign: "center", backgroundColor: "#fffbeb" }}>Maior</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byUnit[activeTab]?.map((item) => {
                      const tagStyle = getTagStyles(item.insumo.tipo);
                      const stats = item.stats || {};
                      return (
                        <tr key={item.insumo.id} style={{ backgroundColor: "#fefce8" }}>
                          <td style={{ fontWeight: 600, fontSize: "1.2rem" }}>{item.insumo.nome}</td>
                          <td>
                            <span style={{
                              padding: "4px 8px", backgroundColor: tagStyle.bg, borderRadius: "6px", 
                              fontSize: "0.9rem", fontWeight: 600, color: tagStyle.color, border: `1px solid ${tagStyle.border}`, whiteSpace: "nowrap"
                            }}>
                              {item.insumo.tipo || "-"}
                            </span>
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "var(--text-dark)" }}>
                            {item.insumo.unidade_conversao || "-"}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 500, fontSize: "1.2rem" }}>
                            {item.current}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 500, fontSize: "1.2rem" }}>
                            {item.desejado}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.4rem", color: "var(--primary-color)", borderRight: "2px solid #e2e8f0" }}>
                            {item.toOrder}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "#475569", backgroundColor: "#f8fafc" }}>
                            {formatCurrency(stats.ultimoValor)}
                          </td>
                          <td style={{ textAlign: "center", fontSize: "1.1rem", color: "#475569", backgroundColor: "#f8fafc" }}>
                            {formatDateBR(stats.ultimaData)}
                          </td>
                          <td style={{ textAlign: "center", fontSize: "1.1rem", color: "#475569", backgroundColor: "#f8fafc", borderRight: "2px solid #e2e8f0" }}>
                            {stats.ultimoFornecedor || "-"}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "#92400e", backgroundColor: "#fffbeb" }}>
                            {formatCurrency(stats.media)}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "#92400e", backgroundColor: "#fffbeb" }}>
                            {formatCurrency(stats.menor)}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "#92400e", backgroundColor: "#fffbeb" }}>
                            {formatCurrency(stats.maior)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default ListaCompras;
