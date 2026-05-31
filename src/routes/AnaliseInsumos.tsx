import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/Frequencia.css";

function AnaliseInsumos() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [insumosAnalise, setInsumosAnalise] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        .order("created_at", { ascending: false });

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

        return {
           ...insumo,
           ultima_compra_data: ultimaCompra?.data_compra || null,
           ultima_compra_fornecedor: ultimaCompra?.fornecedor || '-',
           preco_atual_unit: precoAtualUnit,
           preco_anterior_unit: precoAnteriorUnit,
           variacao: variacao,
           historico_compras: entradas.length
        };
      });

      setInsumosAnalise(analiseList);

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
        <div className="frequencia-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="frequencia-title-group">
            <h1>Análise de Insumos</h1>
            <p>Monitore a variação de custos e histórico de compras dos seus insumos.</p>
          </div>
          <button className="primary-btn" onClick={fetchAnaliseData} disabled={loading}>
            <Icons.BsArrowClockwise className={loading ? "spin" : ""} style={{ marginRight: "8px" }} />
            Atualizar
          </button>
        </div>

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
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="freq-table" style={{ minWidth: "1200px" }}>
                <thead>
                  <tr>
                    <th>Nome do Insumo</th>
                    <th style={{ textAlign: "center" }}>Tipo</th>
                    <th style={{ textAlign: "center" }}>Nome Simples</th>
                    <th style={{ textAlign: "center" }}>Última Compra</th>
                    <th>Último Fornecedor</th>
                    <th style={{ textAlign: "right" }}>Preço Anterior (Un)</th>
                    <th style={{ textAlign: "right" }}>Preço Atual (Un)</th>
                    <th style={{ textAlign: "center" }}>Variação</th>
                    <th style={{ textAlign: "center" }}>Qtd de Compras</th>
                  </tr>
                </thead>
                <tbody>
                  {insumosAnalise.map((insumo) => {
                    const tagStyle = getTagStyles(insumo.tipo);
                    return (
                      <tr key={insumo.id}>
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
                        <td style={{ textAlign: "right", color: "#64748b" }}>
                          {formatCurrency(insumo.preco_anterior_unit)}
                        </td>
                        <td style={{ textAlign: "right", fontWeight: "bold", color: "var(--primary-color)" }}>
                          {formatCurrency(insumo.preco_atual_unit)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {insumo.variacao === 0 ? (
                             <span style={{ color: "#64748b" }}>-</span>
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
          )}
        </div>
      </div>
    </>
  );
}

export default AnaliseInsumos;
