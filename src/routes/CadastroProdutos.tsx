import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/Frequencia.css";

function CadastroProdutos() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState<any[]>([]);
  const [insumosList, setInsumosList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [unidadeVenda, setUnidadeVenda] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [metodoPreparo, setMetodoPreparo] = useState("");
  const [isSabor, setIsSabor] = useState(false);
  const [fichaTecnica, setFichaTecnica] = useState<any[]>([]);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'produtos' | 'sabores'>('produtos');

  // Drag and drop state
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);

  // Form temporary state for adding an item to the ficha
  const [selectedInsumo, setSelectedInsumo] = useState("");
  const [quantidadeInsumo, setQuantidadeInsumo] = useState("");
  const [selectedProdutoBase, setSelectedProdutoBase] = useState("");
  const [quantidadeProdutoBase, setQuantidadeProdutoBase] = useState("");

  useEffect(() => {
    if (isAdmin === false) {
      navigate("/");
    } else if (isAdmin === true) {
      fetchData();
    }
  }, [isAdmin, navigate]);

  async function fetchData() {
    try {
      setLoading(true);

      // Fetch the latest entradas_mercadoria for each insumo to get the updated cost
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

      // Fetch insumos for the dropdown
      const { data: insumosData, error: insumosError } = await supabase
        .from("cadastro_insumos")
        .select("*")
        .eq("ativo", true)
        .order("nome", { ascending: true });

      if (insumosError) throw insumosError;

      const insumosWithUpdatedCosts = (insumosData || []).map((insumo: any) => {
        const latestValor = latestCostMap[insumo.id];
        let custoAtualizado = insumo.custo_considerado_unitario;
        if (latestValor !== undefined && insumo.quantidade_conversao > 0) {
          custoAtualizado = latestValor / insumo.quantidade_conversao;
        }
        return {
          ...insumo,
          custo_considerado_unitario: custoAtualizado
        };
      });

      // Calcular média de custo por nome_simples_unitario
      const groupedCostMap: Record<string, { total: number, count: number }> = {};
      
      insumosWithUpdatedCosts.forEach((insumo: any) => {
        const groupKey = insumo.nome_simples_unitario || insumo.nome;
        if (!groupedCostMap[groupKey]) {
          groupedCostMap[groupKey] = { total: 0, count: 0 };
        }
        groupedCostMap[groupKey].total += insumo.custo_considerado_unitario || 0;
        groupedCostMap[groupKey].count += 1;
      });

      const averageCostMap: Record<string, number> = {};
      Object.keys(groupedCostMap).forEach(key => {
        averageCostMap[key] = groupedCostMap[key].total / groupedCostMap[key].count;
      });

      // Criar lista agrupada para o dropdown
      const groupedInsumosList: any[] = [];
      const seenGroups = new Set<string>();
      
      insumosWithUpdatedCosts.forEach((insumo: any) => {
        const groupKey = insumo.nome_simples_unitario || insumo.nome;
        if (!seenGroups.has(groupKey)) {
          seenGroups.add(groupKey);
          groupedInsumosList.push({
            ...insumo,
            custo_considerado_unitario: averageCostMap[groupKey],
            nome_original: insumo.nome,
            nome: groupKey // Para exibir de forma limpa no dropdown
          });
        }
      });
      
      setInsumosList(groupedInsumosList);

      // Fetch produtos and their ficha tecnica
      const { data: produtosData, error: produtosError } = await supabase
        .from("cadastro_produtos")
        .select(`
          id, nome, categoria, preco_venda, ativo, unidade_venda, metodo_preparo, is_sabor,
          ficha_tecnica!ficha_tecnica_produto_id_fkey (
            id, insumo_id, quantidade, produto_base_id,
            cadastro_insumos ( id, nome_simples_unitario, nome, custo_considerado_unitario, quantidade_conversao, unidade_conversao, fator_desperdicio ),
            cadastro_produtos!ficha_tecnica_produto_base_id_fkey ( id, nome )
          )
        `)
        .order("ordem", { ascending: true })
        .order("nome", { ascending: true });

      if (produtosError) {
        if (produtosError.code !== '42P01') {
          console.error("Erro ao buscar produtos:", produtosError);
        }
        setProdutos([]);
      } else {
        const updatedProdutosData = (produtosData || []).map((prod: any) => ({
          ...prod,
          ficha_tecnica: (prod.ficha_tecnica || []).map((item: any) => {
            if (item.insumo_id) {
              const groupKey = item.cadastro_insumos?.nome_simples_unitario || item.cadastro_insumos?.nome || "Desconhecido";
              let updatedCusto = item.cadastro_insumos?.custo_considerado_unitario || 0;
              
              if (averageCostMap[groupKey] !== undefined) {
                updatedCusto = averageCostMap[groupKey];
              }

              return {
                ...item,
                cadastro_insumos: {
                  ...item.cadastro_insumos,
                  custo_considerado_unitario: updatedCusto
                }
              };
            }
            return item;
          })
        }));
        setProdutos(updatedProdutosData);
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  const openModal = (produto?: any) => {
    if (produto) {
      setEditingId(produto.id);
      setNome(produto.nome);
      setCategoria(produto.categoria || "");
      setPrecoVenda(produto.preco_venda?.toString() || "");
      setUnidadeVenda(produto.unidade_venda || "");
      setMetodoPreparo(produto.metodo_preparo || "");
      setAtivo(produto.ativo);
      setIsSabor(produto.is_sabor || false);

      const mappedFicha = (produto.ficha_tecnica || []).map((item: any) => ({
        id: item.id,
        insumo_id: item.insumo_id,
        produto_base_id: item.produto_base_id,
        quantidade: item.quantidade,
        insumo: item.cadastro_insumos
      }));
      setFichaTecnica(mappedFicha);
    } else {
      setEditingId(null);
      setNome("");
      setCategoria(activeTab === 'sabores' ? "Gelato" : "");
      setPrecoVenda("");
      setUnidadeVenda(activeTab === 'sabores' ? "Kg" : "");
      setMetodoPreparo("");
      setAtivo(true);
      setIsSabor(activeTab === 'sabores');
      setFichaTecnica([]);
    }

    setSelectedInsumo("");
    setQuantidadeInsumo("");
    setSelectedProdutoBase("");
    setQuantidadeProdutoBase("");
    setIsModalOpen(true);
  };

  const calculateCustoProduto = React.useCallback((ficha: any[], allProdutos: any[] = produtos) => {
    return ficha.reduce((acc, item) => {
      if (item.insumo_id || item.insumo || item.cadastro_insumos) {
        const insumoData = item.insumo || item.cadastro_insumos;
        const custoUnitario = insumoData?.custo_considerado_unitario || 0;
        return acc + (parseFloat(item.quantidade) * custoUnitario);
      } else if (item.produto_base_id) {
        const baseProd = allProdutos.find(p => p.id === item.produto_base_id);
        if (baseProd) {
          const baseCusto = calculateCustoProduto(baseProd.ficha_tecnica || [], allProdutos);
          return acc + (parseFloat(item.quantidade) * baseCusto);
        }
      }
      return acc;
    }, 0);
  }, [produtos]);

  const currentCusto = calculateCustoProduto(fichaTecnica);
  const pv = precoVenda ? parseFloat(precoVenda) : 0;
  const currentLucro = pv - currentCusto;
  const currentMargem = pv > 0 ? (currentLucro / pv) * 100 : 0;

  const handleAddFichaItem = () => {
    if (!selectedInsumo || !quantidadeInsumo) {
      alert("Selecione um insumo e digite a quantidade.");
      return;
    }

    const insumoFound = insumosList.find(i => i.id === selectedInsumo);
    if (!insumoFound) return;

    if (fichaTecnica.some(item => item.insumo_id === selectedInsumo)) {
      alert("Este insumo já foi adicionado à ficha técnica.");
      return;
    }

    setFichaTecnica([
      ...fichaTecnica,
      {
        insumo_id: selectedInsumo,
        quantidade: parseFloat(quantidadeInsumo),
        insumo: {
          nome: insumoFound.nome,
          nome_simples_unitario: insumoFound.nome_simples_unitario,
          custo_considerado_unitario: insumoFound.custo_considerado_unitario,
          unidade_conversao: insumoFound.unidade_conversao,
          fator_desperdicio: insumoFound.fator_desperdicio
        }
      }
    ]);

    setSelectedInsumo("");
    setQuantidadeInsumo("");
  };

  const handleAddProdutoBaseItem = () => {
    if (!selectedProdutoBase || !quantidadeProdutoBase) {
      alert("Selecione um produto base e digite a quantidade.");
      return;
    }

    if (selectedProdutoBase === editingId) {
      alert("Um produto não pode usar a si mesmo na ficha técnica!");
      return;
    }

    if (fichaTecnica.some(item => item.produto_base_id === selectedProdutoBase)) {
      alert("Este produto base já foi adicionado à ficha técnica.");
      return;
    }

    setFichaTecnica([
      ...fichaTecnica,
      {
        produto_base_id: selectedProdutoBase,
        quantidade: parseFloat(quantidadeProdutoBase)
      }
    ]);

    setSelectedProdutoBase("");
    setQuantidadeProdutoBase("");
  };

  const handleRemoveFichaItem = (index: number) => {
    const newFicha = [...fichaTecnica];
    newFicha.splice(index, 1);
    setFichaTecnica(newFicha);
  };

  const handleSaveProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert("O nome do produto é obrigatório.");
      return;
    }

    try {
      setSaving(true);

      const produtoPayload = {
        nome: nome.trim(),
        categoria: categoria.trim() || null,
        preco_venda: precoVenda ? parseFloat(precoVenda) : null,
        unidade_venda: unidadeVenda.trim() || null,
        metodo_preparo: metodoPreparo.trim() || null,
        ativo: ativo,
        is_sabor: isSabor
      };

      let produtoId = editingId;

      if (editingId) {
        const { error: prodErr } = await supabase
          .from("cadastro_produtos")
          .update(produtoPayload)
          .eq("id", editingId);

        if (prodErr) throw prodErr;

        const { error: deleteErr } = await supabase
          .from("ficha_tecnica")
          .delete()
          .eq("produto_id", editingId);

        if (deleteErr) throw deleteErr;

      } else {
        const { data: newProd, error: prodErr } = await supabase
          .from("cadastro_produtos")
          .insert([produtoPayload])
          .select("id")
          .single();

        if (prodErr) throw prodErr;
        produtoId = newProd.id;
      }

      if (fichaTecnica.length > 0 && produtoId) {
        const insertFicha = fichaTecnica.map(item => ({
          produto_id: produtoId,
          insumo_id: item.insumo_id || null,
          produto_base_id: item.produto_base_id || null,
          quantidade: item.quantidade
        }));

        const { error: fichaErr } = await supabase
          .from("ficha_tecnica")
          .insert(insertFicha);

        if (fichaErr) throw fichaErr;
      }

      setIsModalOpen(false);
      fetchData();

    } catch (err: any) {
      console.error("Erro ao salvar produto:", err);
      alert(err.message || "Erro ao salvar produto. Verifique se as tabelas foram criadas no Supabase.");
    } finally {
      setSaving(false);
    }
  };

  async function handleDeleteProduto(id: string) {
    if (!window.confirm("Deseja realmente excluir este produto e sua ficha técnica?")) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("cadastro_produtos").delete().eq("id", id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      alert("Erro ao deletar o produto.");
      setLoading(false);
    }
  }

  async function handleToggleAtivo(id: string, currentAtivo: boolean) {
    try {
      setLoading(true);
      const { error } = await supabase.from("cadastro_produtos").update({ ativo: !currentAtivo }).eq("id", id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      alert("Erro ao alterar o status do produto.");
      setLoading(false);
    }
  }

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const sortedProdutos = useMemo(() => {
    let sortableItems = produtos.filter(p => activeTab === 'sabores' ? p.is_sabor : !p.is_sabor);
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'custo') {
           aValue = calculateCustoProduto(a.ficha_tecnica || []);
           bValue = calculateCustoProduto(b.ficha_tecnica || []);
        } else if (sortConfig.key === 'lucro') {
           const aCusto = calculateCustoProduto(a.ficha_tecnica || []);
           const bCusto = calculateCustoProduto(b.ficha_tecnica || []);
           aValue = (a.preco_venda || 0) - aCusto;
           bValue = (b.preco_venda || 0) - bCusto;
        } else if (sortConfig.key === 'margem') {
           const aCusto = calculateCustoProduto(a.ficha_tecnica || []);
           const bCusto = calculateCustoProduto(b.ficha_tecnica || []);
           const aLucro = (a.preco_venda || 0) - aCusto;
           const bLucro = (b.preco_venda || 0) - bCusto;
           aValue = a.preco_venda > 0 ? (aLucro / a.preco_venda) * 100 : 0;
           bValue = b.preco_venda > 0 ? (bLucro / b.preco_venda) * 100 : 0;
        } else if (typeof aValue === 'string') {
           aValue = aValue.toLowerCase();
           bValue = (bValue || '').toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [produtos, sortConfig, calculateCustoProduto, activeTab]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const clearSort = () => {
    setSortConfig(null);
  };

  const handleDragStart = (index: number) => {
    if (sortConfig !== null) return;
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (sortConfig !== null) return;
    if (index !== dragOverItemIndex) {
      setDragOverItemIndex(index);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (sortConfig !== null || draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    const filteredItems = produtos.filter(p => activeTab === 'sabores' ? p.is_sabor : !p.is_sabor);
    const draggedItem = filteredItems[draggedItemIndex];
    filteredItems.splice(draggedItemIndex, 1);
    filteredItems.splice(targetIndex, 0, draggedItem);

    const updatedFilteredItems = filteredItems.map((item, index) => ({
      ...item,
      ordem: index
    }));
    
    const otherItems = produtos.filter(p => activeTab === 'sabores' ? !p.is_sabor : p.is_sabor);
    const finalProdutos = [...otherItems, ...updatedFilteredItems];
    
    setProdutos(finalProdutos);
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);

    try {
      setSaving(true);
      const updates = updatedFilteredItems.map(item => 
        supabase.from("cadastro_produtos").update({ ordem: item.ordem }).eq("id", item.id)
      );
      await Promise.all(updates);
    } catch (err) {
      console.error("Erro ao reordenar:", err);
      alert("Erro ao salvar a nova ordem no banco de dados.");
      fetchData();
    } finally {
      setSaving(false);
    }
  };

  const renderSortableHeader = (label: string, key: string, align: 'left' | 'center' | 'right' = 'left', width?: string) => {
    return (
      <th 
        style={{ textAlign: align, width: width, cursor: "pointer", userSelect: "none" }}
        onClick={() => requestSort(key)}
        title={`Ordenar por ${label}`}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start', gap: "4px" }}>
          {label}
          {sortConfig?.key === key ? (
            sortConfig.direction === 'asc' ? <Icons.BsChevronUp /> : <Icons.BsChevronDown />
          ) : (
            <Icons.BsChevronExpand style={{ color: "#cbd5e1" }} />
          )}
        </div>
      </th>
    );
  };

  return (
    <>
      <Helmet>
        <title>Cadastro de Produtos</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="frequencia-title-group">
            <h1>Cadastro de Produtos</h1>
            <p>Gerencie os produtos finais vendidos pela loja e defina suas fichas técnicas (receitas) baseadas nos insumos.</p>
          </div>
          <button className="primary-btn" onClick={() => openModal()}>
            <Icons.BsPlusLg style={{ marginRight: "8px" }} />
            Novo Produto
          </button>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button 
              onClick={() => setActiveTab('produtos')}
              style={{
                padding: "8px 20px",
                border: "none",
                borderRadius: "8px",
                background: activeTab === 'produtos' ? "#93633e" : "#f1f5f9",
                color: activeTab === 'produtos' ? "#fff" : "#475569",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1.05rem",
                transition: "all 0.2s ease"
              }}
            >
              Produtos Finais
            </button>
            <button 
              onClick={() => setActiveTab('sabores')}
              style={{
                padding: "8px 20px",
                border: "none",
                borderRadius: "8px",
                background: activeTab === 'sabores' ? "#93633e" : "#f1f5f9",
                color: activeTab === 'sabores' ? "#fff" : "#475569",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1.05rem",
                transition: "all 0.2s ease"
              }}
            >
              Sabores de Gelato
            </button>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : produtos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#fff", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
              <Icons.BsBoxSeam style={{ fontSize: "3rem", color: "#94a3b8", marginBottom: "16px" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "1.4rem" }}>Nenhum produto cadastrado.</p>
              <p style={{ color: "#94a3b8", marginTop: "8px" }}>Lembre-se de rodar o SQL no Supabase para criar as tabelas <br /><b>cadastro_produtos</b> e <b>ficha_tecnica</b>.</p>
            </div>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              {sortConfig && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
                  <button onClick={clearSort} className="cancel-btn" style={{ fontSize: "12px", padding: "6px 12px" }}>
                    Limpar Ordenação e Restaurar Ordem Original
                  </button>
                </div>
              )}
              <table className="freq-table" style={{ minWidth: "1000px" }}>
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}></th>
                    {renderSortableHeader("Ativo", "ativo", "center", "60px")}
                    {renderSortableHeader("Nome do Produto", "nome", "left")}
                    {renderSortableHeader("Categoria", "categoria", "left")}
                    {renderSortableHeader("Unid. Venda", "unidade_venda", "center", "100px")}
                    {renderSortableHeader("Preço (Venda)", "preco_venda", "right", "120px")}
                    {renderSortableHeader("Custo Total", "custo", "right", "120px")}
                    {renderSortableHeader("Lucro", "lucro", "right", "120px")}
                    {renderSortableHeader("Margem", "margem", "center", "100px")}
                    <th style={{ textAlign: "center", width: "100px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProdutos.map((produto, index) => {
                    const custo = calculateCustoProduto(produto.ficha_tecnica || []);
                    const pv = produto.preco_venda || 0;
                    const lucro = pv - custo;
                    const margem = pv > 0 ? (lucro / pv) * 100 : 0;
                    
                    const isDragged = index === draggedItemIndex;
                    const isDragOver = index === dragOverItemIndex;

                    return (
                      <tr 
                        key={produto.id} 
                        style={{ 
                          opacity: produto.ativo ? (isDragged ? 0.5 : 1) : 0.6,
                          borderTop: isDragOver && draggedItemIndex !== null && draggedItemIndex > index ? "2px solid var(--primary-color)" : "",
                          borderBottom: isDragOver && draggedItemIndex !== null && draggedItemIndex < index ? "2px solid var(--primary-color)" : ""
                        }}
                        draggable={sortConfig === null}
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <td style={{ textAlign: "center", cursor: sortConfig === null ? "grab" : "not-allowed", color: "#cbd5e1" }} title={sortConfig === null ? "Arraste para reordenar" : "Limpe a ordenação para arrastar"}>
                          <Icons.BsGripVertical />
                        </td>
                        <td
                          style={{ textAlign: "center", cursor: "pointer" }}
                          onClick={() => handleToggleAtivo(produto.id, produto.ativo)}
                          title={produto.ativo ? "Desativar produto" : "Ativar produto"}
                        >
                          {produto.ativo ? (
                            <Icons.BsCheckCircleFill style={{ color: "#22c55e", fontSize: "1.5rem" }} />
                          ) : (
                            <Icons.BsXCircleFill style={{ color: "#94a3b8", fontSize: "1.5rem" }} />
                          )}
                        </td>
                        <td style={{ fontWeight: 500 }}>{produto.nome}</td>
                        <td>{produto.categoria || "-"}</td>
                        <td style={{ textAlign: "center", color: "#64748b" }}>{produto.unidade_venda || "-"}</td>
                        <td style={{ textAlign: "right", color: "var(--primary-color)", fontWeight: "bold" }}>
                          {pv > 0 ? `R$ ${pv.toFixed(2)}` : "-"}
                        </td>
                        <td style={{ textAlign: "right", color: "#dc2626" }}>
                          R$ {custo.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "right", color: lucro > 0 ? "#16a34a" : "#dc2626", fontWeight: "bold" }}>
                          R$ {lucro.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span style={{
                            backgroundColor: margem >= 40 ? "#dcfce7" : margem > 10 ? "#fef9c3" : "#fee2e2",
                            color: margem >= 40 ? "#166534" : margem > 10 ? "#854d0e" : "#991b1b",
                            padding: "4px 8px",
                            borderRadius: "20px",
                            fontSize: "1.1rem",
                            fontWeight: "bold"
                          }}>
                            {margem.toFixed(1)}%
                          </span>
                        </td>
                        <td style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                          <button
                            onClick={() => openModal(produto)}
                            className="delete-record-btn"
                            title="Editar Produto"
                            style={{ margin: 0 }}
                          >
                            <Icons.BsPencil />
                          </button>
                          <button
                            onClick={() => handleDeleteProduto(produto.id)}
                            className="delete-record-btn"
                            title="Excluir Produto"
                            style={{ margin: 0 }}
                          >
                            <Icons.BsTrash />
                          </button>
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "var(--secondary-color)" }}>
                {editingId ? "Editar Produto" : "Cadastrar Novo Produto"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}>
                <Icons.BsX />
              </button>
            </div>

            <form onSubmit={handleSaveProduto} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsBoxSeam /> Dados do Produto
                </h3>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)", display: "block", marginBottom: "8px" }}>Tipo de Cadastro</label>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "1.1rem" }}>
                      <input 
                        type="radio" 
                        name="is_sabor" 
                        checked={!isSabor} 
                        onChange={() => setIsSabor(false)}
                      />
                      Produto
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "1.1rem" }}>
                      <input 
                        type="radio" 
                        name="is_sabor" 
                        checked={isSabor} 
                        onChange={() => {
                          setIsSabor(true);
                          setCategoria("Gelato");
                          setUnidadeVenda("Kg");
                        }}
                      />
                      Sabor de Gelato
                    </label>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                  <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Nome do Produto *</label>
                    <input
                      type="text"
                      required
                      className="frequencia-select"
                      placeholder="Ex: Copinho P - Pistache"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      style={{ background: "#fff" }}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Categoria</label>
                    <input
                      type="text"
                      className="frequencia-select"
                      placeholder="Ex: Gelatos"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      style={{ background: "#fff" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Unidade de Venda</label>
                    <select
                      className="frequencia-select"
                      value={unidadeVenda}
                      onChange={(e) => setUnidadeVenda(e.target.value)}
                      style={{ background: "#fff", fontSize: "1.1rem" }}
                    >
                      <option value="">Selecione...</option>
                      <option value="Unidade">Unidade</option>
                      <option value="Caixa">Caixa</option>
                      <option value="Pacote">Pacote</option>
                      <option value="Kg">Kg</option>
                      <option value="Pote">Pote</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Preço de Venda</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <span style={{ position: "absolute", left: "12px", color: "var(--text-muted)", zIndex: 1, pointerEvents: "none", fontSize: "1.1rem" }}>R$</span>
                      <input
                        type="number"
                        step="0.01"
                        className="frequencia-select"
                        placeholder="0,00"
                        value={precoVenda}
                        onChange={(e) => setPrecoVenda(e.target.value)}
                        style={{ paddingLeft: "36px", background: "#fff" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsCardList /> Ficha Técnica (Receita)
                </h3>

                <div style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "flex-end" }}>
                  <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "#64748b" }}>Insumo</label>
                    <select
                      className="frequencia-select"
                      value={selectedInsumo}
                      onChange={(e) => setSelectedInsumo(e.target.value)}
                      style={{ background: "#fff" }}
                    >
                      <option value="">Selecione um insumo...</option>
                      {insumosList.map((insumo) => (
                        <option key={insumo.id} value={insumo.id}>
                          {insumo.nome_simples_unitario || insumo.nome} {insumo.custo_considerado_unitario ? `(Custo: R$ ${insumo.custo_considerado_unitario.toFixed(2)})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "#64748b" }}>Quantidade</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <input
                        type="number"
                        step="0.00001"
                        className="frequencia-select"
                        placeholder="Qtd"
                        value={quantidadeInsumo}
                        onChange={(e) => setQuantidadeInsumo(e.target.value)}
                        style={{ background: "#fff" }}
                      />
                      <span style={{ position: "absolute", right: "12px", color: "var(--text-muted)", zIndex: 1, pointerEvents: "none", fontSize: "0.9rem", fontWeight: "bold" }}>
                        {selectedInsumo ? insumosList.find(i => i.id === selectedInsumo)?.unidade_conversao || "un" : ""}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFichaItem}
                    style={{
                      padding: "10px 16px", backgroundColor: "#e2e8f0", color: "#475569",
                      border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer",
                      height: "42px", display: "flex", alignItems: "center", gap: "6px"
                    }}
                  >
                    <Icons.BsPlusLg /> Adicionar
                  </button>
                </div>

                <div style={{ display: "flex", gap: "12px", marginBottom: "20px", alignItems: "flex-end" }}>
                  <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "#64748b" }}>Produto Base</label>
                    <select
                      className="frequencia-select"
                      value={selectedProdutoBase}
                      onChange={(e) => setSelectedProdutoBase(e.target.value)}
                      style={{ background: "#fff" }}
                    >
                      <option value="">Selecione um produto base...</option>
                      {produtos.filter(p => p.id !== editingId).map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "#64748b" }}>Quantidade</label>
                    <input
                      type="number"
                      step="0.00001"
                      className="frequencia-select"
                      placeholder="Qtd"
                      value={quantidadeProdutoBase}
                      onChange={(e) => setQuantidadeProdutoBase(e.target.value)}
                      style={{ background: "#fff" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddProdutoBaseItem}
                    style={{
                      padding: "10px 16px", backgroundColor: "#e2e8f0", color: "#475569",
                      border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer",
                      height: "42px", display: "flex", alignItems: "center", gap: "6px"
                    }}
                  >
                    <Icons.BsPlusLg /> Adicionar
                  </button>
                </div>

                {fichaTecnica.length > 0 ? (
                  <div style={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #cbd5e1", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.2rem" }}>
                      <thead style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #cbd5e1" }}>
                        <tr>
                          <th style={{ padding: "10px", textAlign: "left", color: "#475569" }}>Item</th>
                          <th style={{ padding: "10px", textAlign: "center", color: "#475569" }}>Tipo</th>
                          <th style={{ padding: "10px", textAlign: "center", color: "#475569" }}>Quantidade</th>
                          <th style={{ padding: "10px", textAlign: "right", color: "#475569" }}>Custo Base</th>
                          <th style={{ padding: "10px", textAlign: "right", color: "#475569" }}>Custo Calc.</th>
                          <th style={{ padding: "10px", textAlign: "center", color: "#475569" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {fichaTecnica.map((item, index) => {
                          let isProduto = !!item.produto_base_id;
                          let nomeItem = "";
                          let unitario = 0;
                          let unidade = "un";
                          let fatorDesperdicio = 0;

                          if (isProduto) {
                            const pBase = produtos.find(p => p.id === item.produto_base_id);
                            nomeItem = pBase ? pBase.nome : "Produto Desconhecido";
                            unitario = pBase ? calculateCustoProduto(pBase.ficha_tecnica || [], produtos) : 0;
                          } else {
                            const insumoData = item.insumo || item.cadastro_insumos;
                            nomeItem = insumoData?.nome_simples_unitario || insumoData?.nome || "Insumo Desconhecido";
                            unitario = insumoData?.custo_considerado_unitario || 0;
                            unidade = insumoData?.unidade_conversao || "un";
                            fatorDesperdicio = insumoData?.fator_desperdicio || 0;
                          }

                          const calc = parseFloat(item.quantidade) * unitario;

                          return (
                            <tr key={index} style={{ borderBottom: "1px solid #e2e8f0" }}>
                              <td style={{ padding: "10px" }}>{nomeItem}</td>
                              <td style={{ padding: "10px", textAlign: "center" }}>
                                {isProduto ?
                                  <span style={{ backgroundColor: "#e0e7ff", color: "#3730a3", padding: "2px 6px", borderRadius: "4px", fontSize: "1rem", fontWeight: "bold" }}>Produto</span> :
                                  <span style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "2px 6px", borderRadius: "4px", fontSize: "1rem", fontWeight: "bold" }}>Insumo</span>
                                }
                              </td>
                              <td style={{ padding: "10px", textAlign: "center" }}>
                                {fatorDesperdicio > 0 ? (
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                                    <span style={{ fontSize: "1.1rem" }}>{item.quantidade} {unidade} <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "normal" }}>(Bruta)</span></span>
                                    <span style={{ fontSize: "0.95rem", color: "#16a34a" }}>{(parseFloat(item.quantidade) * (1 - fatorDesperdicio / 100)).toFixed(4)} {unidade} <span style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: "normal" }}>(Líq.)</span></span>
                                  </div>
                                ) : (
                                  <>{item.quantidade} {unidade}</>
                                )}
                              </td>
                              <td style={{ padding: "10px", textAlign: "right" }}>R$ {unitario.toFixed(2)}</td>
                              <td style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>R$ {calc.toFixed(2)}</td>
                              <td style={{ padding: "10px", textAlign: "center" }}>
                                <button type="button" onClick={() => handleRemoveFichaItem(index)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                                  <Icons.BsTrash />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontStyle: "italic", border: "1px dashed #cbd5e1", borderRadius: "8px", backgroundColor: "#fff" }}>
                    Nenhum insumo adicionado a esta ficha técnica.
                  </div>
                )}
              </div>

              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsListTask /> Método de Preparo
                </h3>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <textarea
                    className="frequencia-select"
                    placeholder="Ex: 1. Adicione os ingredientes...&#10;2. Misture bem...&#10;3. Sirva frio..."
                    value={metodoPreparo}
                    onChange={(e) => setMetodoPreparo(e.target.value)}
                    style={{ background: "#fff", minHeight: "100px", resize: "vertical", width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1, backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "1.1rem" }}>Custo Total</p>
                  <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold", color: "#dc2626" }}>R$ {currentCusto.toFixed(2)}</p>
                </div>
                <div style={{ flex: 1, backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "1.1rem" }}>Lucro Bruto</p>
                  <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold", color: currentLucro > 0 ? "#16a34a" : "#dc2626" }}>R$ {currentLucro.toFixed(2)}</p>
                </div>
                <div style={{ flex: 1, backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "1.1rem" }}>Margem de Lucro</p>
                  <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold", color: currentMargem >= 40 ? "#166534" : currentMargem > 10 ? "#854d0e" : "#991b1b" }}>
                    {currentMargem.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: "8px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)} disabled={saving}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="primary-btn">
                  {saving ? "Salvando..." : "Salvar Produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CadastroProdutos;
