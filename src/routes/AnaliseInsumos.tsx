import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "../css/Frequencia.css";

function AnaliseInsumos() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [insumosAnalise, setInsumosAnalise] = useState<any[]>([]);
  const [outliers, setOutliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<any>(null);

  useEffect(() => {
    fetchAnaliseData();
  }, []);

  async function fetchAnaliseData() {
    try {
      setLoading(true);
      
      // Fetch insumos ativos
      const { data: insumosData, error: insumosError } = await supabase
        .from("cadastro_insumos")
        .select("id, nome, tipo, nome_simples_unitario, custo_considerado_unitario, quantidade_conversao, unidade_conversao")
        .eq("ativo", true)
        .order("nome", { ascending: true });

      if (insumosError) throw insumosError;

      // Fetch todas as entradas_mercadoria (pra pegar as 2 ultimas compras de cada insumo)
      const { data: entradasData, error: entradasError } = await supabase
        .from("entradas_mercadoria")
        .select("insumo_id, data_compra, quantidade_comprada, valor_unitario, fornecedor, created_at")
        .order("data_compra", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(10000);

      if (entradasError) {
         console.warn("Nao foi possivel buscar entradas", entradasError);
      }

      // Agrupar entradas por insumo
      const entradasPorInsumo: Record<string, any[]> = {};
      if (entradasData) {
        entradasData.forEach(entrada => {
          if (!entradasPorInsumo[entrada.insumo_id]) {
            entradasPorInsumo[entrada.insumo_id] = [];
          }
          entradasPorInsumo[entrada.insumo_id].push(entrada);
        });
      }

      const newOutliers: any[] = [];

      const analiseList = (insumosData || []).map(insumo => {
        const entradas = entradasPorInsumo[insumo.id] || [];
        const ultimaCompra = entradas[0] || null;
        const penultimaCompra = entradas[1] || null;

        let precoAtualUnit = insumo.custo_considerado_unitario || 0;
        let precoAnteriorUnit = insumo.custo_considerado_unitario || 0;

        if (ultimaCompra && insumo.quantidade_conversao > 0) {
           precoAtualUnit = ultimaCompra.valor_unitario / insumo.quantidade_conversao;
        }
        if (penultimaCompra && insumo.quantidade_conversao > 0) {
           precoAnteriorUnit = penultimaCompra.valor_unitario / insumo.quantidade_conversao;
        } else if (ultimaCompra) {
           precoAnteriorUnit = precoAtualUnit; // Se só tem 1 compra, anterior = atual
        }

        let variacao = 0;
        if (precoAnteriorUnit > 0 && ultimaCompra && penultimaCompra) {
           variacao = ((precoAtualUnit - precoAnteriorUnit) / precoAnteriorUnit) * 100;
        }

        // ====== LÓGICA DE OUTLIER ======
        let isOutlier = false;
        let variacaoOutlier = 0;
        let mediaHistorica = 0;
        
        if (entradas.length >= 3 && ultimaCompra && insumo.quantidade_conversao > 0) {
           // O histórico exclui a compra mais recente
           const historicoEntradas = entradas.slice(1);
           
           let sumPrecos = 0;
           let count = 0;
           historicoEntradas.forEach(e => {
             const precoUn = e.valor_unitario / insumo.quantidade_conversao;
             if (precoUn > 0) {
               sumPrecos += precoUn;
               count++;
             }
           });
           
           if (count > 0) {
             mediaHistorica = sumPrecos / count;
             if (mediaHistorica > 0) {
               variacaoOutlier = ((precoAtualUnit - mediaHistorica) / mediaHistorica) * 100;
               
               // Threshold de 25%
               if (Math.abs(variacaoOutlier) >= 25) {
                 isOutlier = true;
               }
             }
           }
        }

        const insumoFinal = {
           ...insumo,
           ultima_compra_data: ultimaCompra?.data_compra || null,
           ultima_compra_fornecedor: ultimaCompra?.fornecedor || '-',
           preco_atual_unit: precoAtualUnit,
           preco_anterior_unit: precoAnteriorUnit,
           variacao: variacao,
           historico_compras: entradas.length,
           entradas: entradas,
           isOutlier,
           variacaoOutlier,
           mediaHistorica
        };

        if (isOutlier) {
           newOutliers.push(insumoFinal);
        }

        return insumoFinal;
      });

      setInsumosAnalise(analiseList);
      
      // Sort outliers by magnitude of absolute variation descending
      newOutliers.sort((a, b) => Math.abs(b.variacaoOutlier) - Math.abs(a.variacaoOutlier));
      setOutliers(newOutliers);

    } catch (err) {
      console.error("Erro ao buscar analise:", err);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split('-');
    if (day && month && year) return `${day}/${month}/${year}`;
    return dateStr;
  };

  return (
    <>
      <Helmet>
        <title>Análise de Insumos</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div className="frequencia-title-group">
            <h1>Análise de Insumos</h1>
            <p>Monitore a variação de custos e histórico de compras dos seus insumos.</p>
          </div>
          <button className="primary-btn" onClick={fetchAnaliseData} disabled={loading}>
            <Icons.BsArrowClockwise className={loading ? "spin" : ""} style={{ marginRight: "8px" }} />
            Atualizar
          </button>
        </div>

        {!loading && outliers.length > 0 && (
          <div style={{ margin: "20px auto 0 auto", maxWidth: "100%", padding: "0 20px" }}>
            <div style={{
              backgroundColor: "#fff",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
            }}>
              <h2 style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 16px 0", color: "#0f172a", fontSize: "1.5rem" }}>
                <Icons.BsExclamationTriangleFill style={{ color: "#f59e0b" }} /> 
                Alertas Inteligentes de Preço
              </h2>
              <p style={{ color: "#64748b", margin: "0 0 20px 0", fontSize: "1.1rem" }}>
                Identificamos insumos cujo preço da última compra está fora do padrão histórico (Variação de 25% ou mais em relação à média antiga).
              </p>
              
              <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "12px" }}>
                {outliers.map((o) => {
                  const isAlta = o.variacaoOutlier > 0;
                  return (
                    <div 
                      key={o.id}
                      onClick={() => { setSelectedInsumo(o); setIsModalOpen(true); }}
                      style={{
                        flex: "0 0 300px",
                        backgroundColor: isAlta ? "#fee2e2" : "#dcfce7",
                        border: `1px solid ${isAlta ? "#fca5a5" : "#86efac"}`,
                        borderRadius: "12px",
                        padding: "16px",
                        cursor: "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                        <h3 style={{ margin: 0, fontSize: "1.1rem", color: isAlta ? "#991b1b" : "#166534", fontWeight: "bold", lineHeight: 1.3 }}>
                          {o.nome}
                        </h3>
                        <span style={{ 
                          backgroundColor: isAlta ? "#ef4444" : "#22c55e", 
                          color: "#fff", 
                          padding: "4px 8px", 
                          borderRadius: "20px", 
                          fontSize: "0.9rem", 
                          fontWeight: "bold",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "2px",
                          whiteSpace: "nowrap"
                        }}>
                          {isAlta ? <Icons.BsArrowUpShort /> : <Icons.BsArrowDownShort />}
                          {Math.abs(o.variacaoOutlier).toFixed(1)}%
                        </span>
                      </div>
                      
                      <div style={{ fontSize: "0.95rem", color: isAlta ? "#b91c1c" : "#15803d", marginBottom: "4px" }}>
                        <strong>Média Histórica:</strong> {formatCurrency(o.mediaHistorica)}
                      </div>
                      <div style={{ fontSize: "0.95rem", color: isAlta ? "#b91c1c" : "#15803d", marginBottom: "8px" }}>
                        <strong>Última Compra:</strong> {formatCurrency(o.preco_atual_unit)}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: isAlta ? "#7f1d1d" : "#14532d", opacity: 0.8, display: "flex", alignItems: "center", gap: "4px" }}>
                        <Icons.BsShop /> {o.ultima_compra_fornecedor}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : insumosAnalise.length === 0 ? (
             <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#fff", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
              <Icons.BsGraphUp style={{ fontSize: "3rem", color: "#94a3b8", marginBottom: "16px" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "1.4rem" }}>Nenhum insumo encontrado para análise.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ position: "relative", alignSelf: "flex-start" }}>
                <Icons.BsSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="Buscar insumo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: "10px 10px 10px 36px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "1rem",
                    width: "300px",
                    outline: "none"
                  }}
                />
              </div>
              <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
                <table className="freq-table" style={{ minWidth: "1200px" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center", width: "60px" }}>Ver</th>
                      <th>Nome do Insumo</th>
                      <th style={{ textAlign: "center" }}>Tipo</th>
                      <th style={{ textAlign: "center" }}>Nome Simples</th>
                      <th style={{ textAlign: "center" }}>Última Compra</th>
                      <th>Último Fornecedor</th>
                      <th style={{ textAlign: "left" }}>Preço Anterior (Un)</th>
                      <th style={{ textAlign: "left" }}>Preço Atual (Un)</th>
                      <th style={{ textAlign: "center" }}>Variação</th>
                      <th style={{ textAlign: "center" }}>Qtd de Compras</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insumosAnalise
                      .filter(i => 
                        i.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (i.tipo && i.tipo.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .map((insumo) => {
                      const tagStyle = getTagStyles(insumo.tipo);
                      return (
                        <tr key={insumo.id}>
                          <td style={{ textAlign: "center" }}>
                            <button 
                              onClick={() => { setSelectedInsumo(insumo); setIsModalOpen(true); }}
                              style={{ background: "none", border: "none", color: "var(--primary-color)", cursor: "pointer", fontSize: "1.3rem" }}
                              title="Ver detalhes"
                            >
                              <Icons.BsEye />
                            </button>
                          </td>
                          <td style={{ fontWeight: 500 }}>{insumo.nome}</td>
                          <td style={{ textAlign: "center" }}>
                          <span style={{
                            padding: "4px 8px", backgroundColor: tagStyle.bg, borderRadius: "6px", 
                            fontSize: "0.9rem", fontWeight: 600, color: tagStyle.color, border: `1px solid ${tagStyle.border}`, whiteSpace: "nowrap"
                          }}>
                            {insumo.tipo || "-"}
                          </span>
                        </td>
                        <td style={{ textAlign: "center", color: "#64748b" }}>{insumo.nome_simples_unitario || "-"}</td>
                        <td style={{ textAlign: "center", color: "#64748b" }}>
                          {formatDate(insumo.ultima_compra_data)}
                        </td>
                        <td style={{ color: "#64748b" }}>{insumo.ultima_compra_fornecedor}</td>
                        <td style={{ textAlign: "left", color: "#64748b", whiteSpace: "nowrap" }}>
                          {formatCurrency(insumo.preco_anterior_unit)} <span style={{ fontSize: "0.9em", color: "#94a3b8", marginLeft: "4px" }}>/ {insumo.unidade_conversao || "un"}</span>
                        </td>
                        <td style={{ textAlign: "left", fontWeight: "bold", color: "var(--primary-color)", whiteSpace: "nowrap" }}>
                          {formatCurrency(insumo.preco_atual_unit)} <span style={{ fontSize: "0.9em", color: "#94a3b8", fontWeight: "normal", marginLeft: "4px" }}>/ {insumo.unidade_conversao || "un"}</span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {insumo.variacao === 0 ? (
                             <span style={{ 
                               color: "#64748b",
                               backgroundColor: "#f1f5f9",
                               padding: "4px 8px",
                               borderRadius: "20px",
                               fontWeight: "bold",
                               fontSize: "1.1rem",
                               display: "inline-flex",
                               alignItems: "center",
                               gap: "4px"
                             }}>
                                <Icons.BsDash />
                                0.0%
                             </span>
                          ) : (
                             <span style={{ 
                               color: insumo.variacao > 0 ? "#dc2626" : "#16a34a",
                               backgroundColor: insumo.variacao > 0 ? "#fee2e2" : "#dcfce7",
                               padding: "4px 8px",
                               borderRadius: "20px",
                               fontWeight: "bold",
                               fontSize: "1.1rem",
                               display: "inline-flex",
                               alignItems: "center",
                               gap: "4px"
                             }}>
                                {insumo.variacao > 0 ? <Icons.BsArrowUpShort /> : <Icons.BsArrowDownShort />}
                                {Math.abs(insumo.variacao).toFixed(1)}%
                             </span>
                          )}
                        </td>
                        <td style={{ textAlign: "center", color: "#64748b" }}>
                          {insumo.historico_compras}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedInsumo && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)} style={{ zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "800px", width: "95%", maxHeight: "90vh", overflowY: "auto", padding: "30px", borderRadius: "16px", position: "relative" }}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer", color: "#64748b" }}>
              <Icons.BsX />
            </button>
            <h2 style={{ margin: "0 0 12px 0", fontSize: "2rem", color: "#1e293b", fontWeight: "bold", flexShrink: 0 }}>{selectedInsumo.nome}</h2>
            <div style={{ margin: "0 0 24px 0", flexShrink: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.1rem", color: "#64748b", fontWeight: 500 }}>Tipo:</span>
              <span style={{ ...getTagStyles(selectedInsumo.tipo), padding: "4px 12px", borderRadius: "16px", fontSize: "1rem", fontWeight: "bold", border: `1px solid ${getTagStyles(selectedInsumo.tipo).border}` }}>
                {selectedInsumo.tipo || "-"}
              </span>
            </div>

            <div style={{ display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap", flexShrink: 0 }}>
              <div style={{ flex: "1 1 200px", backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)" }}>
                <p style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "1.1rem", fontWeight: 500 }}>Preço Atual</p>
                <p style={{ margin: 0, fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "baseline", gap: "8px" }}>
                  {formatCurrency(selectedInsumo.preco_atual_unit)} 
                  <span style={{ fontSize: "1.1rem", color: "#94a3b8", fontWeight: 500 }}>/ {selectedInsumo.unidade_conversao || "un"}</span>
                </p>
              </div>
              <div style={{ flex: "1 1 200px", backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)" }}>
                <p style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "1.1rem", fontWeight: 500 }}>Variação</p>
                <p style={{ margin: 0, fontSize: "2.2rem", fontWeight: 800, color: selectedInsumo.variacao > 0 ? "#dc2626" : selectedInsumo.variacao < 0 ? "#16a34a" : "#94a3b8" }}>
                  {selectedInsumo.variacao > 0 ? "+" : ""}{selectedInsumo.variacao.toFixed(1)}%
                </p>
              </div>
            </div>

            <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <Icons.BsClockHistory /> Histórico de Compras
            </h3>
            
            {selectedInsumo.entradas && selectedInsumo.entradas.length > 0 ? (
              <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", marginBottom: "24px", flexShrink: 0 }}>
                {(() => {
                  const chartData = [...selectedInsumo.entradas]
                    .reverse()
                    .map((e: any) => ({
                      data: formatDate(e.data_compra),
                      preco: parseFloat((e.valor_unitario / selectedInsumo.quantidade_conversao).toFixed(2)),
                      fornecedor: e.fornecedor,
                      data_compra_raw: e.data_compra
                    }));

                  return (
                    <div style={{ width: '100%', height: 350 }}>
                      <ResponsiveContainer>
                        <LineChart 
                          data={chartData} 
                          margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                          onClick={(e) => {
                            if (e && e.activePayload && e.activePayload.length > 0) {
                              const pointData = e.activePayload[0].payload;
                              navigate(`/entrada-mercadoria?insumo_id=${selectedInsumo.id}&data_compra=${pointData.data_compra_raw}`);
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="data" 
                            tick={{ fontSize: 12, fill: '#64748b' }} 
                            tickMargin={15} 
                            axisLine={{ stroke: '#cbd5e1' }}
                            tickLine={false}
                          />
                          <YAxis 
                            tick={{ fontSize: 12, fill: '#64748b' }} 
                            tickFormatter={(val) => `R$ ${val}`} 
                            width={80} 
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip 
                            isAnimationActive={false}
                            wrapperStyle={{ pointerEvents: 'none', zIndex: 1000 }}
                            formatter={(value: any) => [formatCurrency(Number(value)), 'Preço (Unidade)']}
                            labelFormatter={(label) => `Data: ${label}`}
                            labelStyle={{ color: '#1e293b', fontWeight: 'bold', marginBottom: '8px' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '16px' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="preco" 
                            stroke="var(--primary-color)" 
                            strokeWidth={3} 
                            dot={{ r: 5, fill: "var(--primary-color)", strokeWidth: 2, stroke: "#fff" }} 
                            activeDot={{ 
                              r: 8, 
                              strokeWidth: 0, 
                              fill: "var(--primary-color)",
                              onClick: (event: any, payload: any) => {
                                if (payload && payload.payload) {
                                  navigate(`/entrada-mercadoria?insumo_id=${selectedInsumo.id}&data_compra=${payload.payload.data_compra_raw}`);
                                }
                              }
                            }} 
                            animationDuration={1500}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontStyle: "italic", backgroundColor: "#f8fafc", borderRadius: "10px", marginBottom: "24px", border: "1px dashed #cbd5e1", flexShrink: 0 }}>
                Nenhuma compra registrada para este insumo.
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: "12px 24px", borderRadius: "8px", backgroundColor: "#e2e8f0", color: "#475569", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem", flex: "1 1 auto", maxWidth: "200px" }}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AnaliseInsumos;
