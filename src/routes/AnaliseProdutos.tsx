import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../css/Frequencia.css";

function AnaliseProdutos() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [produtosAnalise, setProdutosAnalise] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<any>(null);

  const openModal = (produto: any) => {
    setSelectedProduto(produto);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduto(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchAnaliseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAnaliseData() {
    try {
      setLoading(true);

      const { data: latestEntradasData } = await supabase
        .from("entradas_mercadoria")
        .select("insumo_id, valor_unitario, data_compra, created_at")
        .order("data_compra", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(10000);

      const latestCostMap: Record<string, number> = {};
      if (latestEntradasData) {
        latestEntradasData.forEach((entrada: any) => {
          if (latestCostMap[entrada.insumo_id] === undefined) {
            latestCostMap[entrada.insumo_id] = parseFloat(entrada.valor_unitario) || 0;
          }
        });
      }

      // Fetch ALL insumos to calculate averages
      const { data: allInsumosData } = await supabase
        .from("cadastro_insumos")
        .select("*")
        .eq("ativo", true);

      const averageCostMap: Record<string, number> = {};
      if (allInsumosData) {
        const groupedCostMap: Record<string, { total: number, count: number }> = {};
        allInsumosData.forEach((insumo: any) => {
          const latestValor = latestCostMap[insumo.id];
          let custoAtualizado = insumo.custo_considerado_unitario || 0;
          if (latestValor !== undefined && insumo.quantidade_conversao > 0) {
            custoAtualizado = latestValor / insumo.quantidade_conversao;
          }

          const groupKey = insumo.nome_simples_unitario || insumo.nome;
          if (!groupedCostMap[groupKey]) {
            groupedCostMap[groupKey] = { total: 0, count: 0 };
          }
          groupedCostMap[groupKey].total += custoAtualizado;
          groupedCostMap[groupKey].count += 1;
        });

        Object.keys(groupedCostMap).forEach(key => {
          averageCostMap[key] = groupedCostMap[key].total / groupedCostMap[key].count;
        });
      }

      // Fetch all produtos and ficha tecnica to resolve dependencies
      const { data: produtosData, error: produtosError } = await supabase
        .from("cadastro_produtos")
        .select(`
          id, nome, categoria, preco_venda, ativo, unidade_venda, ordem, metodo_preparo, rendimento,
          ficha_tecnica!ficha_tecnica_produto_id_fkey (
            quantidade,
            insumo_id,
            produto_base_id,
            cadastro_insumos (
              nome,
              nome_simples_unitario,
              unidade_conversao,
              unidade_estoque,
              custo_considerado_unitario,
              quantidade_conversao,
              fator_desperdicio
            )
          )
        `)
        .order("ordem", { ascending: true })
        .order("nome", { ascending: true });

      if (produtosError) {
        if (produtosError.code !== '42P01') {
          console.error("Erro ao buscar produtos:", produtosError);
        }
        throw produtosError;
      }

      const calculateCusto = (ficha: any[], allProdutos: any[]): number => {
        return ficha.reduce((acc: number, item: any) => {
          if (item.insumo_id || item.cadastro_insumos) {
            const groupKey = item.cadastro_insumos?.nome_simples_unitario || item.cadastro_insumos?.nome || "Desconhecido";
            let custoUnit = item.cadastro_insumos?.custo_considerado_unitario || 0;
            if (averageCostMap[groupKey] !== undefined) {
              custoUnit = averageCostMap[groupKey];
            }
            return acc + (parseFloat(item.quantidade) * custoUnit);
          } else if (item.produto_base_id) {
            const pBase = allProdutos.find(p => p.id === item.produto_base_id);
            if (pBase) {
              const baseCustoTotal = calculateCusto(pBase.ficha_tecnica || [], allProdutos);
              const baseRend = pBase.rendimento && parseFloat(pBase.rendimento) > 0 ? parseFloat(pBase.rendimento) : 1;
              const baseCustoUnit = baseCustoTotal / baseRend;
              return acc + (parseFloat(item.quantidade) * baseCustoUnit);
            }
          }
          return acc;
        }, 0);
      };

      const analiseList = (produtosData || [])
        .filter(prod => prod.ativo)
        .map((prod: any) => {
          let custoTotal = calculateCusto(prod.ficha_tecnica || [], produtosData || []);
          let rend = prod.rendimento && parseFloat(prod.rendimento) > 0 ? parseFloat(prod.rendimento) : 1;
          let custoUnitario = custoTotal / rend;

          const resolvedFicha = (prod.ficha_tecnica || []).map((item: any) => {
            if (item.insumo_id || item.cadastro_insumos) {
              const groupKey = item.cadastro_insumos?.nome_simples_unitario || item.cadastro_insumos?.nome || "Insumo Desconhecido";
              let custoUnit = item.cadastro_insumos?.custo_considerado_unitario || 0;
              if (averageCostMap[groupKey] !== undefined) {
                custoUnit = averageCostMap[groupKey];
              }
              return {
                isProduto: false,
                nome: groupKey,
                quantidade: item.quantidade,
                unidade: item.cadastro_insumos?.unidade_estoque || item.cadastro_insumos?.unidade_conversao || "un",
                fator_desperdicio: item.cadastro_insumos?.fator_desperdicio || 0,
                custo_unit: custoUnit,
                custo_calc: parseFloat(item.quantidade) * custoUnit
              };
            } else if (item.produto_base_id) {
              const pBase = (produtosData || []).find(p => p.id === item.produto_base_id);
              let baseNome = "Produto Desconhecido";
              let baseCusto = 0;
              if (pBase) {
                baseNome = pBase.nome;
                baseCusto = calculateCusto(pBase.ficha_tecnica || [], produtosData || []);
              }
              return {
                isProduto: true,
                nome: baseNome,
                quantidade: item.quantidade,
                unidade: "un",
                custo_unit: baseCusto,
                custo_calc: parseFloat(item.quantidade) * baseCusto
              };
            }
            return null;
          }).filter(Boolean);

          const pv = prod.preco_venda || 0;
          const lucro = pv - custoUnitario;
          const margem = pv > 0 ? (lucro / pv) * 100 : 0;

          return {
            id: prod.id,
            nome: prod.nome,
            categoria: prod.categoria || "Sem Categoria",
            custo_total: custoTotal,
            custo_unitario: custoUnitario,
            preco_venda: pv,
            unidade_venda: prod.unidade_venda,
            lucro: lucro,
            margem: margem,
            metodo_preparo: prod.metodo_preparo,
            ficha_tecnica: resolvedFicha
          };
        });

      // Omitido: Ordenar por margem decrescente
      // analiseList.sort((a, b) => b.margem - a.margem);

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

  const handleExportPdf = (isCompleto: boolean) => {
    if (!selectedProduto) return;

    const doc = new jsPDF();
    let startY = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(isCompleto ? "Ficha Técnica Completa" : "Ficha Técnica - Produção", 14, startY);
    startY += 10;

    doc.setFontSize(14);
    doc.text(`Produto: ${selectedProduto.nome}`, 14, startY);
    startY += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Categoria: ${selectedProduto.categoria || "-"}`, 14, startY);
    startY += 10;

    if (isCompleto) {
      doc.setFont("helvetica", "bold");
      doc.text("Valores Financeiros", 14, startY);
      doc.setFont("helvetica", "normal");
      startY += 6;
      doc.text(`Preço de Venda: ${selectedProduto.preco_venda > 0 ? formatCurrency(selectedProduto.preco_venda) : "-"}`, 14, startY);
      startY += 6;
      doc.text(`Custo Total (Receita): ${formatCurrency(selectedProduto.custo_total || 0)}`, 14, startY);
      startY += 6;
      doc.text(`Custo Unitário: ${formatCurrency(selectedProduto.custo_unitario || 0)}`, 14, startY);
      startY += 6;
      doc.text(`Lucro Unitário: ${formatCurrency(selectedProduto.lucro || 0)}`, 14, startY);
      startY += 6;
      doc.text(`Margem: ${(selectedProduto.margem || 0).toFixed(1)}%`, 14, startY);
      startY += 12;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Composição", 14, startY);
    startY += 6;

    if (selectedProduto.ficha_tecnica && selectedProduto.ficha_tecnica.length > 0) {
      const tableHead = isCompleto 
        ? [["Item", "Tipo", "Quantidade", "Custo Unit.", "Custo Total"]]
        : [["Item", "Tipo", "Quantidade"]];

      const tableRows = selectedProduto.ficha_tecnica.map((item: any) => {
        let qtyString = `${item.quantidade} ${item.unidade}`;
        if (item.fator_desperdicio && item.fator_desperdicio > 0) {
          qtyString += ` (Bruta)\n-> ${(parseFloat(item.quantidade) * (1 - item.fator_desperdicio / 100)).toFixed(4)} ${item.unidade}`;
        }
        
        const row = [
          item.nome,
          item.isProduto ? "Produto" : "Insumo",
          qtyString
        ];

        if (isCompleto) {
          row.push(formatCurrency(item.custo_unit));
          row.push(formatCurrency(item.custo_calc));
        }

        return row;
      });

      autoTable(doc, {
        startY: startY,
        head: tableHead,
        body: tableRows,
        theme: "striped",
        headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255] },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { fontStyle: "bold" }
        }
      });

      startY = (doc as any).lastAutoTable.finalY + 15;
    } else {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text("Este produto não possui ficha técnica cadastrada.", 14, startY);
      startY += 15;
    }

    if (selectedProduto.metodo_preparo) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Método de Preparo", 14, startY);
      startY += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const splitText = doc.splitTextToSize(selectedProduto.metodo_preparo, 180);
      doc.text(splitText, 14, startY);
    }

    const mode = isCompleto ? "Completa" : "Producao";
    const fileName = `Ficha_${mode}_${selectedProduto.nome.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
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
                    <th style={{ width: "50px", textAlign: "center" }}>Ver</th>
                    <th>Nome do Produto</th>
                    <th>Categoria</th>
                    <th style={{ textAlign: "right" }}>Preço de Venda</th>
                    <th style={{ textAlign: "right" }}>Custo Total (Real)</th>
                    <th style={{ textAlign: "right" }}>Custo Unitário</th>
                    <th style={{ textAlign: "right" }}>Lucro Unitário</th>
                    <th style={{ textAlign: "center" }}>Margem de Lucro</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosAnalise.map((prod) => {
                    return (
                      <tr key={prod.id}>
                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                          <button
                            type="button"
                            onClick={() => openModal(prod)}
                            style={{ background: "none", border: "none", color: "var(--primary-color)", cursor: "pointer", fontSize: "1.4rem" }}
                            title="Ver Detalhes"
                          >
                            <Icons.BsEyeFill />
                          </button>
                        </td>
                        <td style={{ fontWeight: "bold" }}>{prod.nome}</td>
                        <td style={{ color: "#64748b" }}>{prod.categoria}</td>
                        <td style={{ textAlign: "right", fontWeight: "bold", color: "var(--primary-color)", whiteSpace: "nowrap" }}>
                          {prod.preco_venda > 0 ? formatCurrency(prod.preco_venda) : "-"}
                          {prod.preco_venda > 0 && prod.unidade_venda && <span style={{ fontSize: "0.9em", color: "#94a3b8", fontWeight: "normal", marginLeft: "4px" }}>/ {prod.unidade_venda}</span>}
                        </td>
                        <td style={{ textAlign: "right", color: "#dc2626" }}>
                          {formatCurrency(prod.custo_total)}
                        </td>
                        <td style={{ textAlign: "right", color: "#b91c1c", fontWeight: "bold" }}>
                          {formatCurrency(prod.custo_unitario)}
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

      {isModalOpen && selectedProduto && (
        <div className="modal-overlay" onClick={closeModal} style={{ zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "800px", width: "95%", maxHeight: "90vh", overflowY: "auto", padding: "30px", borderRadius: "16px", position: "relative" }}>
            <button className="modal-close-btn" onClick={closeModal} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer", color: "#64748b" }}>
              <Icons.BsX />
            </button>            <h2 style={{ margin: "0 0 12px 0", fontSize: "2.2rem", color: "#1e293b", fontWeight: "bold", flexShrink: 0 }}>{selectedProduto.nome}</h2>
            <div style={{ margin: "0 0 24px 0", flexShrink: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.2rem", color: "#64748b", fontWeight: 500 }}>Categoria:</span>
              <span style={{ backgroundColor: "#f8fafc", color: "#475569", padding: "4px 12px", borderRadius: "16px", fontSize: "1.2rem", fontWeight: "bold", border: "1px solid #cbd5e1" }}>
                {selectedProduto.categoria}
              </span>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", flexShrink: 0 }}>
              <div style={{ flex: "1 1 120px", backgroundColor: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <p style={{ margin: "0 0 4px 0", color: "#94a3b8", fontSize: "1rem" }}>Preço de Venda</p>
                <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: "bold", color: "var(--primary-color)", whiteSpace: "nowrap" }}>
                  {selectedProduto.preco_venda > 0 ? formatCurrency(selectedProduto.preco_venda) : "-"}
                  {selectedProduto.preco_venda > 0 && selectedProduto.unidade_venda && <span style={{ fontSize: "0.8em", color: "#94a3b8", fontWeight: "normal", marginLeft: "4px" }}>/ {selectedProduto.unidade_venda}</span>}
                </p>
              </div>
              <div style={{ flex: "1 1 120px", backgroundColor: "#fff1f2", padding: "16px", borderRadius: "10px", border: "1px solid #fecdd3" }}>
                <p style={{ margin: "0 0 4px 0", color: "#f43f5e", fontSize: "1rem" }}>Custo Total (Receita)</p>
                <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: "bold", color: "#e11d48" }}>
                  {formatCurrency(selectedProduto.custo_total)}
                </p>
              </div>
              <div style={{ flex: "1 1 120px", backgroundColor: "#fff1f2", padding: "16px", borderRadius: "10px", border: "1px solid #fecdd3" }}>
                <p style={{ margin: "0 0 4px 0", color: "#f43f5e", fontSize: "1rem" }}>Custo Unitário</p>
                <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: "bold", color: "#e11d48" }}>
                  {formatCurrency(selectedProduto.custo_unitario)}
                </p>
              </div>
              <div style={{ flex: "1 1 120px", backgroundColor: selectedProduto.lucro > 0 ? "#f0fdf4" : "#fff1f2", padding: "16px", borderRadius: "10px", border: selectedProduto.lucro > 0 ? "1px solid #bbf7d0" : "1px solid #fecdd3" }}>
                <p style={{ margin: "0 0 4px 0", color: selectedProduto.lucro > 0 ? "#22c55e" : "#f43f5e", fontSize: "1rem" }}>Lucro Unitário</p>
                <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: "bold", color: selectedProduto.lucro > 0 ? "#16a34a" : "#e11d48" }}>
                  {formatCurrency(selectedProduto.lucro)}
                </p>
              </div>
              <div style={{ flex: "1 1 120px", backgroundColor: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <p style={{ margin: "0 0 4px 0", color: "#94a3b8", fontSize: "1rem" }}>Margem</p>
                <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: "bold", color: selectedProduto.margem >= 40 ? "#16a34a" : selectedProduto.margem > 10 ? "#ca8a04" : "#e11d48" }}>
                  {selectedProduto.margem.toFixed(1)}%
                </p>
              </div>
            </div>

            <h3 style={{ margin: "0 0 12px 0", color: "#334155", fontSize: "1.3rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <Icons.BsLayoutTextSidebarReverse style={{ color: "#64748b" }} /> Composição (Ficha Técnica)
            </h3>

            {selectedProduto.ficha_tecnica && selectedProduto.ficha_tecnica.length > 0 && (
              <div style={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", overflowX: "auto", marginBottom: "20px", flexShrink: 0 }}>
                <table style={{ width: "100%", minWidth: "500px", borderCollapse: "collapse", fontSize: "1.1rem" }}>
                  <thead style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <tr>
                      <th style={{ padding: "12px 16px", textAlign: "left", color: "#475569", fontWeight: "bold" }}>Item</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", color: "#475569", fontWeight: "bold" }}>Tipo</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", color: "#475569", fontWeight: "bold" }}>Quantidade</th>
                      <th style={{ padding: "12px 16px", textAlign: "right", color: "#475569", fontWeight: "bold" }}>Custo Unit.</th>
                      <th style={{ padding: "12px 16px", textAlign: "right", color: "#475569", fontWeight: "bold" }}>Custo Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduto.ficha_tecnica.map((item: any, index: number) => (
                      <tr key={index} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "12px 16px", color: "#1e293b", fontWeight: 500 }}>{item.nome}</td>
                        <td style={{ padding: "12px 16px", textAlign: "left" }}>
                          {item.isProduto ?
                            <span style={{ backgroundColor: "#e0e7ff", color: "#3730a3", padding: "4px 8px", borderRadius: "6px", fontSize: "0.95rem", fontWeight: "bold", whiteSpace: "nowrap" }}>Produto</span> :
                            <span style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "4px 8px", borderRadius: "6px", fontSize: "0.95rem", fontWeight: "bold", whiteSpace: "nowrap" }}>Insumo</span>
                          }
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "center", color: "#334155", fontWeight: 500 }}>
                          {item.fator_desperdicio && item.fator_desperdicio > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                              <div style={{ whiteSpace: "nowrap", fontSize: "1.05rem" }}>
                                {item.quantidade} {item.unidade}
                                <span style={{ fontSize: "0.85rem", color: "#64748b", marginLeft: "4px", fontWeight: "normal" }}>(Bruta)</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#f0fdf4", padding: "2px 6px", borderRadius: "4px", border: "1px solid #bbf7d0", whiteSpace: "nowrap" }}>
                                <Icons.BsArrowReturnRight style={{ color: "#16a34a", fontSize: "0.8rem" }} />
                                <span style={{ fontSize: "0.95rem", color: "#16a34a", fontWeight: "bold" }}>
                                  {(parseFloat(item.quantidade) * (1 - item.fator_desperdicio / 100)).toFixed(4)} {item.unidade}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div style={{ whiteSpace: "nowrap", fontSize: "1.05rem" }}>{item.quantidade} {item.unidade}</div>
                          )}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right", color: "#334155", fontWeight: 500, whiteSpace: "nowrap" }}>{formatCurrency(item.custo_unit)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: "bold", color: "#1e293b", whiteSpace: "nowrap" }}>{formatCurrency(item.custo_calc)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {(!selectedProduto.ficha_tecnica || selectedProduto.ficha_tecnica.length === 0) && (
              <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8", fontStyle: "italic", border: "1px dashed #cbd5e1", borderRadius: "12px", backgroundColor: "#f8fafc", marginBottom: "24px", flexShrink: 0 }}>
                Este produto não possui ficha técnica cadastrada.
              </div>
            )}

            {selectedProduto.metodo_preparo && (
              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px", flexShrink: 0 }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsListTask /> Método de Preparo
                </h3>
                <div style={{ color: "#475569", fontSize: "1.1rem", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                  {selectedProduto.metodo_preparo}
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap", flexShrink: 0 }}>
              <button onClick={() => handleExportPdf(true)} style={{ padding: "12px 24px", borderRadius: "8px", backgroundColor: "#3b82f6", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px", flex: "1 1 auto", maxWidth: "250px", justifyContent: "center" }}>
                <Icons.BsFileEarmarkPdf style={{ fontSize: "1.3rem" }} /> Exportar Completo
              </button>
              <button onClick={() => handleExportPdf(false)} style={{ padding: "12px 24px", borderRadius: "8px", backgroundColor: "#f59e0b", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px", flex: "1 1 auto", maxWidth: "250px", justifyContent: "center" }}>
                <Icons.BsFileEarmarkPdf style={{ fontSize: "1.3rem" }} /> Exportar Produção
              </button>
              <button onClick={closeModal} style={{ padding: "12px 24px", borderRadius: "8px", backgroundColor: "#e2e8f0", color: "#475569", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem", flex: "1 1 auto", maxWidth: "200px" }}>Fechar Consulta</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AnaliseProdutos;
