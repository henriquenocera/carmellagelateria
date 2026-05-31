import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/Frequencia.css";

function AnaliseProdutos() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [produtosAnalise, setProdutosAnalise] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnaliseData();
  }, []);

  async function fetchAnaliseData() {
    try {
      setLoading(true);
      
      // Fetch latest prices
      const { data: latestEntradasData } = await supabase
        .from("entradas_mercadoria")
        .select("insumo_id, valor_unitario, created_at")
        .order("created_at", { ascending: false });

      const latestCostMap: Record<string, number> = {};
      if (latestEntradasData) {
        latestEntradasData.forEach((entrada: any) => {
          if (latestCostMap[entrada.insumo_id] === undefined) {
            latestCostMap[entrada.insumo_id] = parseFloat(entrada.valor_unitario) || 0;
          }
        });
      }

      // Fetch active produtos and ficha tecnica
      const { data: produtosData, error: produtosError } = await supabase
        .from("cadastro_produtos")
        .select(`
          id, nome, categoria, preco_venda,
          ficha_tecnica (
            quantidade,
            insumo_id,
            cadastro_insumos (
              custo_considerado_unitario,
              quantidade_conversao
            )
          )
        `)
        .eq("ativo", true)
        .order("categoria", { ascending: true })
        .order("nome", { ascending: true });

      if (produtosError) {
        if (produtosError.code !== '42P01') {
          console.error("Erro ao buscar produtos:", produtosError);
        }
        throw produtosError;
      }

      const analiseList = (produtosData || []).map((prod: any) => {
        let custoTotal = 0;

        if (prod.ficha_tecnica) {
          custoTotal = prod.ficha_tecnica.reduce((acc: number, item: any) => {
             const latestValor = latestCostMap[item.insumo_id];
             let custoUnit = item.cadastro_insumos?.custo_considerado_unitario || 0;
             if (latestValor !== undefined && item.cadastro_insumos?.quantidade_conversao > 0) {
                custoUnit = latestValor / item.cadastro_insumos.quantidade_conversao;
             }
             return acc + (parseFloat(item.quantidade) * custoUnit);
          }, 0);
        }

        const pv = prod.preco_venda || 0;
        const lucro = pv - custoTotal;
        const margem = pv > 0 ? (lucro / pv) * 100 : 0;

        return {
          id: prod.id,
          nome: prod.nome,
          categoria: prod.categoria || "Sem Categoria",
          custo_total: custoTotal,
          preco_venda: pv,
          lucro: lucro,
          margem: margem
        };
      });

      // Ordenar por margem decrescente como um padrão de análise
      analiseList.sort((a, b) => b.margem - a.margem);

      setProdutosAnalise(analiseList);

    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <>
      <Helmet>
        <title>Análise de Produtos</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="frequencia-title-group">
            <h1>Análise de Produtos</h1>
            <p>Visão gerencial da rentabilidade e margens dos seus produtos ativos.</p>
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
          ) : produtosAnalise.length === 0 ? (
             <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#fff", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
              <Icons.BsPieChart style={{ fontSize: "3rem", color: "#94a3b8", marginBottom: "16px" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "1.4rem" }}>Nenhum produto ativo encontrado.</p>
            </div>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="freq-table" style={{ minWidth: "1000px" }}>
                <thead>
                  <tr>
                    <th>Nome do Produto</th>
                    <th>Categoria</th>
                    <th style={{ textAlign: "right" }}>Preço de Venda</th>
                    <th style={{ textAlign: "right" }}>Custo Total (Real)</th>
                    <th style={{ textAlign: "right" }}>Lucro Bruto</th>
                    <th style={{ textAlign: "center" }}>Margem de Lucro</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosAnalise.map((prod) => {
                    return (
                      <tr key={prod.id}>
                        <td style={{ fontWeight: "bold" }}>{prod.nome}</td>
                        <td style={{ color: "#64748b" }}>{prod.categoria}</td>
                        <td style={{ textAlign: "right", fontWeight: "bold", color: "var(--primary-color)" }}>
                          {prod.preco_venda > 0 ? formatCurrency(prod.preco_venda) : "-"}
                        </td>
                        <td style={{ textAlign: "right", color: "#dc2626" }}>
                          {formatCurrency(prod.custo_total)}
                        </td>
                        <td style={{ textAlign: "right", color: prod.lucro > 0 ? "#16a34a" : "#dc2626", fontWeight: "bold" }}>
                          {formatCurrency(prod.lucro)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span style={{ 
                            backgroundColor: prod.margem >= 40 ? "#dcfce7" : prod.margem > 10 ? "#fef9c3" : "#fee2e2",
                            color: prod.margem >= 40 ? "#166534" : prod.margem > 10 ? "#854d0e" : "#991b1b",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            display: "inline-block",
                            minWidth: "80px"
                          }}>
                            {prod.margem.toFixed(1)}%
                          </span>
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

export default AnaliseProdutos;
