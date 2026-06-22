import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import ConfirmModal from "../../components/ConfirmModal";
import * as Icons from "react-icons/bs";
import supabase from "../../services/supabase-client";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import "../../css/Frequencia.css";

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
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, message: string, onConfirm: () => void }>({ isOpen: false, message: "", onConfirm: () => { } });

  // Form state
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [precoVendaFoodService, setPrecoVendaFoodService] = useState("");
  const [unidadeVenda, setUnidadeVenda] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [metodoPreparo, setMetodoPreparo] = useState("");
  const [isSabor, setIsSabor] = useState(false);
  const [isPreparacao, setIsPreparacao] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [rendimento, setRendimento] = useState("");
  const [fichaTecnica, setFichaTecnica] = useState<any[]>([]);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'produtos' | 'sabores' | 'preparacoes'>('produtos');

  // Drag and drop state
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);

  // Form temporary state for adding an item to the ficha
  const [selectedInsumo, setSelectedInsumo] = useState("");
  const [quantidadeInsumo, setQuantidadeInsumo] = useState("");
  const [selectedProdutoBase, setSelectedProdutoBase] = useState("");
  const [quantidadeProdutoBase, setQuantidadeProdutoBase] = useState("");
  const [editingFichaIndex, setEditingFichaIndex] = useState<number | null>(null);
  const [editingFichaValue, setEditingFichaValue] = useState<string>("");

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

      const { data: latestEntradasData } = await supabase
        .from("entradas_mercadoria")
        .select("insumo_id, valor_unitario, data_compra, created_at")
        .order("data_compra", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(10000);

      const latestCostMap: Record<string, number> = {};
      if (latestEntradasData) {
        latestEntradasData.forEach((entrada: any) => {
          const valor = parseFloat(entrada.valor_unitario);
          if (latestCostMap[entrada.insumo_id] === undefined && !isNaN(valor) && valor > 0) {
            latestCostMap[entrada.insumo_id] = valor;
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
        let custoAtualizado = parseFloat(insumo.custo_considerado_unitario) || 0;
        if (latestValor !== undefined && insumo.quantidade_conversao > 0) {
          custoAtualizado = latestValor / parseFloat(insumo.quantidade_conversao);
        } else if (latestValor !== undefined && latestValor > 0) {
          custoAtualizado = latestValor;
        }
        return {
          ...insumo,
          custo_considerado_unitario: custoAtualizado
        };
      });

      // Calcular média de custo por nome_simples_unitario
      const groupedCostMap: Record<string, { total: number, count: number, displayKey: string }> = {};

      insumosWithUpdatedCosts.forEach((insumo: any) => {
        const rawKey = insumo.nome_simples_unitario || insumo.nome || "";
        const groupKey = rawKey.trim().toUpperCase();
        if (!groupedCostMap[groupKey]) {
          groupedCostMap[groupKey] = { total: 0, count: 0, displayKey: rawKey.trim() };
        }
        groupedCostMap[groupKey].total += parseFloat(insumo.custo_considerado_unitario) || 0;
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
        const rawKey = insumo.nome_simples_unitario || insumo.nome || "";
        const groupKey = rawKey.trim().toUpperCase();
        if (!seenGroups.has(groupKey)) {
          seenGroups.add(groupKey);
          groupedInsumosList.push({
            ...insumo,
            custo_considerado_unitario: averageCostMap[groupKey],
            nome_original: insumo.nome,
            nome: groupedCostMap[groupKey].displayKey // Para exibir de forma limpa no dropdown
          });
        }
      });

      setInsumosList(groupedInsumosList);

      // Fetch produtos and their ficha tecnica
      const { data: produtosData, error: produtosError } = await supabase
        .from("cadastro_produtos")
        .select(`
          id, nome, categoria, preco_venda, ativo, unidade_venda, metodo_preparo, is_sabor, is_preparacao, codigo, rendimento,
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
              const rawKey = item.cadastro_insumos?.nome_simples_unitario || item.cadastro_insumos?.nome || "Desconhecido";
              const groupKey = rawKey.trim().toUpperCase();
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
      setPrecoVendaFoodService(produto.preco_venda_food_service?.toString() || "");
      setUnidadeVenda(produto.unidade_venda || "");
      setMetodoPreparo(produto.metodo_preparo || "");
      setAtivo(produto.ativo);
      setIsSabor(produto.is_sabor || false);
      setIsPreparacao(produto.is_preparacao || false);
      setCodigo(produto.codigo || "");
      setRendimento(produto.rendimento?.toString() || "");

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
      setFichaTecnica([]);
      setNome("");
      setCategoria(activeTab === 'sabores' ? "Gelato" : "");
      setPrecoVenda("");
      setPrecoVendaFoodService("");
      setUnidadeVenda(activeTab === 'sabores' ? "Kg" : "");
      setMetodoPreparo("");
      setAtivo(true);
      setIsSabor(activeTab === 'sabores');
      setIsPreparacao(activeTab === 'preparacoes');
      setCodigo("");
      setRendimento("");
    }
    setSelectedInsumo("");
    setQuantidadeInsumo("");
    setSelectedProdutoBase("");
    setQuantidadeProdutoBase("");
    setIsModalOpen(true);
  };

  const handleCloneProduto = (produto: any) => {
    setConfirmModal({
      isOpen: true,
      message: `Deseja criar uma cópia de "${produto.nome}"?`,
      onConfirm: () => {
        setConfirmModal({ isOpen: false, message: "", onConfirm: () => { } });
        setEditingId(null);
        setNome(produto.nome + " (Cópia)");
        setCategoria(produto.categoria || "");
        setPrecoVenda(produto.preco_venda?.toString() || "");
        setPrecoVendaFoodService(produto.preco_venda_food_service?.toString() || "");
        setUnidadeVenda(produto.unidade_venda || "");
        setMetodoPreparo(produto.metodo_preparo || "");
        setAtivo(produto.ativo);
        setIsSabor(produto.is_sabor || false);
        setIsPreparacao(produto.is_preparacao || false);
        setCodigo(produto.codigo || "");
        setRendimento(produto.rendimento?.toString() || "");

        const mappedFicha = (produto.ficha_tecnica || []).map((item: any) => ({
          insumo_id: item.insumo_id,
          produto_base_id: item.produto_base_id,
          quantidade: item.quantidade,
          insumo: item.cadastro_insumos || item.insumo
        }));
        setFichaTecnica(mappedFicha);
        setSelectedInsumo("");
        setQuantidadeInsumo("");
        setSelectedProdutoBase("");
        setQuantidadeProdutoBase("");
        setIsModalOpen(true);
      }
    });
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
          const baseCustoTotal = calculateCustoProduto(baseProd.ficha_tecnica || [], allProdutos);
          const baseRend = baseProd.rendimento && parseFloat(baseProd.rendimento) > 0 ? parseFloat(baseProd.rendimento) : 1;
          const baseCustoUnit = baseCustoTotal / baseRend;
          return acc + (parseFloat(item.quantidade) * baseCustoUnit);
        }
      }
      return acc;
    }, 0);
  }, [produtos]);

  let previewFicha = fichaTecnica;
  if (editingFichaIndex !== null && !isNaN(parseFloat(editingFichaValue.replace(",", ".")))) {
    previewFicha = [...fichaTecnica];
    previewFicha[editingFichaIndex] = {
      ...previewFicha[editingFichaIndex],
      quantidade: parseFloat(editingFichaValue.replace(",", "."))
    };
  }

  const currentCustoTotal = calculateCustoProduto(previewFicha);
  const rendVal = rendimento && parseFloat(rendimento) > 0 ? parseFloat(rendimento) : 1;
  const currentCustoUnitario = currentCustoTotal / rendVal;
  const pv = precoVenda ? parseFloat(precoVenda) : 0;
  const currentLucro = pv - currentCustoUnitario;
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

  const handleEditFichaItem = (index: number) => {
    setEditingFichaIndex(index);
    setEditingFichaValue(String(fichaTecnica[index].quantidade));
  };

  const handleSaveEditFichaItem = (index: number) => {
    const parsed = parseFloat(editingFichaValue.replace(",", "."));
    if (!isNaN(parsed) && parsed > 0) {
      const newFicha = [...fichaTecnica];
      newFicha[index].quantidade = parsed;
      setFichaTecnica(newFicha);
      setEditingFichaIndex(null);
    } else {
      alert("Quantidade inválida.");
    }
  };

  const handleCancelEditFichaItem = () => {
    setEditingFichaIndex(null);
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
        categoria: isPreparacao ? null : (categoria.trim() || null),
        preco_venda: isPreparacao ? null : (precoVenda ? parseFloat(precoVenda) : null),
        preco_venda_food_service: isSabor ? (precoVendaFoodService ? parseFloat(precoVendaFoodService) : null) : null,
        unidade_venda: unidadeVenda.trim() || null,
        metodo_preparo: metodoPreparo.trim() || null,
        ativo: ativo,
        is_sabor: isSabor,
        is_preparacao: isPreparacao,
        codigo: isSabor && codigo.trim() ? codigo.trim() : null,
        rendimento: rendimento ? parseFloat(rendimento) : null
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
    setConfirmModal({
      isOpen: true,
      message: "Deseja realmente excluir este produto e sua ficha técnica?",
      onConfirm: async () => {
        setConfirmModal({ isOpen: false, message: "", onConfirm: () => { } });
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
    });
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
    let sortableItems = produtos.filter(p => {
      if (activeTab === 'sabores') return p.is_sabor;
      if (activeTab === 'preparacoes') return p.is_preparacao;
      return !p.is_sabor && !p.is_preparacao;
    });
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'custo') {
          const aCusto_r = calculateCustoProduto(a.ficha_tecnica || []);
          const bCusto_r = calculateCustoProduto(b.ficha_tecnica || []);
          const aRend = a.rendimento && parseFloat(a.rendimento) > 0 ? parseFloat(a.rendimento) : 1;
          const bRend = b.rendimento && parseFloat(b.rendimento) > 0 ? parseFloat(b.rendimento) : 1;
          aValue = aCusto_r / aRend;
          bValue = bCusto_r / bRend;
        } else if (sortConfig.key === 'custo_total') {
          aValue = calculateCustoProduto(a.ficha_tecnica || []);
          bValue = calculateCustoProduto(b.ficha_tecnica || []);
        } else if (sortConfig.key === 'rendimento') {
          aValue = a.rendimento && parseFloat(a.rendimento) > 0 ? parseFloat(a.rendimento) : 1;
          bValue = b.rendimento && parseFloat(b.rendimento) > 0 ? parseFloat(b.rendimento) : 1;
        } else if (sortConfig.key === 'lucro') {
          const aCusto_r = calculateCustoProduto(a.ficha_tecnica || []);
          const bCusto_r = calculateCustoProduto(b.ficha_tecnica || []);
          const aRend = a.rendimento && parseFloat(a.rendimento) > 0 ? parseFloat(a.rendimento) : 1;
          const bRend = b.rendimento && parseFloat(b.rendimento) > 0 ? parseFloat(b.rendimento) : 1;
          aValue = (a.preco_venda || 0) - (aCusto_r / aRend);
          bValue = (b.preco_venda || 0) - (bCusto_r / bRend);
        } else if (sortConfig.key === 'margem') {
          const aCusto_r = calculateCustoProduto(a.ficha_tecnica || []);
          const bCusto_r = calculateCustoProduto(b.ficha_tecnica || []);
          const aRend = a.rendimento && parseFloat(a.rendimento) > 0 ? parseFloat(a.rendimento) : 1;
          const bRend = b.rendimento && parseFloat(b.rendimento) > 0 ? parseFloat(b.rendimento) : 1;
          const aLucro = (a.preco_venda || 0) - (aCusto_r / aRend);
          const bLucro = (b.preco_venda || 0) - (bCusto_r / bRend);
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

    const filteredItems = produtos.filter(p => {
      if (activeTab === 'sabores') return p.is_sabor;
      if (activeTab === 'preparacoes') return p.is_preparacao;
      return !p.is_sabor && !p.is_preparacao;
    });
    const draggedItem = filteredItems[draggedItemIndex];
    filteredItems.splice(draggedItemIndex, 1);
    filteredItems.splice(targetIndex, 0, draggedItem);

    const updatedFilteredItems = filteredItems.map((item, index) => ({
      ...item,
      ordem: index
    }));

    const otherItems = produtos.filter(p => {
      if (activeTab === 'sabores') return !p.is_sabor;
      if (activeTab === 'preparacoes') return !p.is_preparacao;
      return p.is_sabor || p.is_preparacao;
    });
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
            <button
              onClick={() => setActiveTab('preparacoes')}
              style={{
                padding: "8px 20px",
                border: "none",
                borderRadius: "8px",
                background: activeTab === 'preparacoes' ? "#93633e" : "#f1f5f9",
                color: activeTab === 'preparacoes' ? "#fff" : "#475569",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1.05rem",
                transition: "all 0.2s ease"
              }}
            >
              Preparações
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
                    {renderSortableHeader("Rendimento", "rendimento", "center", "100px")}
                    {renderSortableHeader("Preço Unit. (Venda)", "preco_venda", "center", "150px")}
                    {renderSortableHeader("Custo Total", "custo_total", "center", "140px")}
                    {renderSortableHeader("Custo Unit.", "custo", "center", "120px")}
                    {renderSortableHeader("Lucro Unitário", "lucro", "center", "140px")}
                    {renderSortableHeader("Margem", "margem", "center", "100px")}
                    <th style={{ textAlign: "center", width: "100px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProdutos.map((produto, index) => {
                    const custo_receita = calculateCustoProduto(produto.ficha_tecnica || []);
                    const rend = produto.rendimento && parseFloat(produto.rendimento) > 0 ? parseFloat(produto.rendimento) : 1;
                    const custo = custo_receita / rend;
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
                        <td style={{ textAlign: "center", color: "#64748b" }}>{rend}</td>
                        <td style={{ textAlign: "center", color: "var(--primary-color)", fontWeight: "bold" }}>
                          {pv > 0 ? `R$ ${pv.toFixed(2)}` : "-"}
                        </td>
                        <td style={{ textAlign: "center", color: "#b91c1c" }}>
                          R$ {custo_receita.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "center", color: "#dc2626" }}>
                          R$ {custo.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "center", color: lucro > 0 ? "#16a34a" : "#dc2626", fontWeight: "bold" }}>
                          R$ {lucro.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span style={{
                            backgroundColor: margem >= 40 ? "#dcfce7" : margem > 10 ? "#fef9c3" : "#fee2e2",
                            color: margem >= 40 ? "#166534" : margem > 10 ? "#854d0e" : "#991b1b",
                            padding: "4px 8px",
                            borderRadius: "20px",
                            fontSize: "1.3rem",
                            fontWeight: "bold"
                          }}>
                            {margem.toFixed(1)}%
                          </span>
                        </td>
                        <td style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                          <button
                            onClick={() => handleCloneProduto(produto)}
                            className="delete-record-btn"
                            title="Clonar Produto"
                            style={{ margin: 0, color: "#6366f1" }}
                          >
                            <Icons.BsFiles />
                          </button>
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
                  <Icons.BsTags /> Tipo de Produto
                </h3>
                <div style={{ display: "flex", gap: "20px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "1.3rem" }}>
                    <input
                      type="radio"
                      name="tipo_cadastro"
                      checked={!isSabor && !isPreparacao}
                      onChange={() => {
                        setIsSabor(false);
                        setIsPreparacao(false);
                      }}
                    />
                    Produto
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "1.3rem" }}>
                    <input
                      type="radio"
                      name="tipo_cadastro"
                      checked={isSabor}
                      onChange={() => {
                        setIsSabor(true);
                        setIsPreparacao(false);
                        setCategoria("Gelato");
                        setUnidadeVenda("Kg");
                      }}
                    />
                    Sabor de Gelato
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "1.3rem" }}>
                    <input
                      type="radio"
                      name="tipo_cadastro"
                      checked={isPreparacao}
                      onChange={() => {
                        setIsSabor(false);
                        setIsPreparacao(true);
                      }}
                    />
                    Preparação
                  </label>
                </div>
              </div>

              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsBoxSeam /> Dados do Produto
                </h3>

                <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                  <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--secondary-color)", width: "100%", textAlign: "center" }}>Nome do Produto *</label>
                    <input
                      type="text"
                      required
                      className="frequencia-select"
                      placeholder={isSabor ? "Baunilha" : isPreparacao ? "Calda de Caramelo" : "Pequeno ( 1 Sabor )"}
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      style={{ background: "#fff", textAlign: "center" }}
                    />
                  </div>
                  {isSabor && (
                    <div className="form-group" style={{ flex: "0 0 150px", marginBottom: 0 }}>
                      <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--secondary-color)", width: "100%", textAlign: "center" }}>Código</label>
                      <input
                        type="text"
                        className="frequencia-select"
                        placeholder="BAU"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        style={{ background: "#fff", textAlign: "center" }}
                      />
                    </div>
                  )}
                  {!isPreparacao && (
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                      <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--secondary-color)", width: "100%", textAlign: "center" }}>Categoria</label>
                      <CreatableSelect
                        isClearable
                        placeholder="Ex: Gelatos"
                        options={[
                          { value: 'Gelato', label: 'Gelato' },
                          { value: 'Waffles', label: 'Waffles' },
                          { value: 'Doces', label: 'Doces' },
                          { value: 'Bebidas', label: 'Bebidas' },
                          { value: 'Café', label: 'Café' },
                          { value: 'Salgados', label: 'Salgados' },
                          { value: 'Conveniência', label: 'Conveniência' }
                        ]}
                        value={categoria ? { value: categoria, label: categoria } : null}
                        onChange={(selectedOption) => setCategoria(selectedOption?.value || "")}
                        formatCreateLabel={(inputValue) => `Criar "${inputValue}"`}
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: '1.4rem',
                            minHeight: '42px',
                            borderRadius: '8px',
                            borderColor: '#cbd5e1',
                            backgroundColor: '#fff',
                            textAlign: 'center'
                          }),
                          singleValue: (base) => ({
                            ...base,
                            textAlign: 'center'
                          }),
                          menu: (base) => ({
                            ...base,
                            fontSize: '1.4rem',
                            zIndex: 1000
                          })
                        }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "flex-end", justifyContent: "flex-start", flexWrap: "wrap" }}>
                  <div className="form-group" style={{ flex: "0 0 150px", marginBottom: 0 }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--secondary-color)", width: "100%", textAlign: "center" }}>Unidade de Venda</label>
                    <select
                      className="frequencia-select"
                      value={unidadeVenda}
                      onChange={(e) => setUnidadeVenda(e.target.value)}
                      style={{ background: "#fff", fontSize: "1.3rem", textAlign: "center" }}
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
                  <div className="form-group" style={{ flex: "0 0 120px", maxWidth: "120px", marginBottom: 0 }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--secondary-color)", width: "100%", textAlign: "center", whiteSpace: "normal", lineHeight: 1.2 }}>Rendimento </label>
                    <input
                      type="number"
                      step="0.01"
                      className="frequencia-select"
                      placeholder="Ex: 30"
                      value={rendimento}
                      onChange={(e) => setRendimento(e.target.value)}
                      style={{ background: "#fff", textAlign: "center" }}
                    />
                  </div>
                  {!isPreparacao && (
                    <div className="form-group" style={{ flex: "0 0 160px", maxWidth: "160px", marginBottom: 0 }}>
                      <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--secondary-color)", width: "100%", textAlign: "center", whiteSpace: "normal", lineHeight: 1.2 }}>Preço de Venda<br />(Unid.)</label>
                      <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
                        <span style={{ position: "absolute", left: "12px", color: "var(--text-muted)", zIndex: 1, pointerEvents: "none", fontSize: "1.3rem" }}>R$</span>
                        <input
                          type="number"
                          step="0.01"
                          className="frequencia-select"
                          placeholder="0,00"
                          value={precoVenda}
                          onChange={(e) => setPrecoVenda(e.target.value)}
                          style={{ paddingLeft: "36px", background: "#fff", textAlign: "center", width: "100%", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  )}
                  {isSabor && (
                    <div className="form-group" style={{ flex: "0 0 160px", maxWidth: "160px", marginBottom: 0 }}>
                      <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--secondary-color)", width: "100%", textAlign: "center", whiteSpace: "normal", lineHeight: 1.2 }}>Preço de Venda<br />(Food Service)</label>
                      <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
                        <span style={{ position: "absolute", left: "12px", color: "var(--text-muted)", zIndex: 1, pointerEvents: "none", fontSize: "1.3rem" }}>R$</span>
                        <input
                          type="number"
                          step="0.01"
                          className="frequencia-select"
                          placeholder="0,00"
                          value={precoVendaFoodService}
                          onChange={(e) => setPrecoVendaFoodService(e.target.value)}
                          style={{ paddingLeft: "36px", background: "#fff", textAlign: "center", width: "100%", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsCardList /> Ficha Técnica (Receita)
                </h3>

                <div style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "flex-end" }}>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "#64748b" }}>Insumo</label>
                    <Select
                      options={insumosList.map((insumo) => ({
                        value: insumo.id,
                        label: insumo.nome_simples_unitario || insumo.nome
                      }))}
                      value={selectedInsumo ? { value: selectedInsumo, label: insumosList.find(i => i.id === selectedInsumo)?.nome_simples_unitario || insumosList.find(i => i.id === selectedInsumo)?.nome } : null}
                      onChange={(selectedOption) => setSelectedInsumo(selectedOption?.value || "")}
                      placeholder="Selecione ou pesquise..."
                      isClearable
                      styles={{
                        control: (base) => ({
                          ...base,
                          fontSize: '1.4rem',
                          minHeight: '42px',
                          borderRadius: '8px',
                          borderColor: '#cbd5e1'
                        }),
                        menu: (base) => ({
                          ...base,
                          fontSize: '1.4rem',
                          zIndex: 1000
                        })
                      }}
                    />
                  </div>
                  <div className="form-group" style={{ flex: "0 0 100px", maxWidth: "100px", marginBottom: 0 }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "#64748b", width: "100%", textAlign: "center" }}>Quantidade</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
                      <input
                        type="number"
                        step="0.00001"
                        className="frequencia-select"
                        placeholder="Qtd"
                        value={quantidadeInsumo}
                        onChange={(e) => setQuantidadeInsumo(e.target.value)}
                        style={{ background: "#fff", textAlign: "center", width: "100%", boxSizing: "border-box", paddingRight: "28px" }}
                      />
                      <span style={{ position: "absolute", right: "12px", color: "var(--text-muted)", zIndex: 1, pointerEvents: "none", fontSize: "0.9rem", fontWeight: "bold" }}>
                        {(() => {
                          const unit = selectedInsumo ? insumosList.find(i => i.id === selectedInsumo)?.unidade_conversao : "";
                          if (!unit) return "";
                          const u = String(unit).toLowerCase();
                          if (u === "unidade" || u === "unidades") return "un";
                          if (u === "gramas" || u === "grama") return "g";
                          if (u === "quilogramas" || u === "quilograma" || u === "quilo") return "kg";
                          if (u === "mililitros" || u === "mililitro") return "ml";
                          if (u === "litros" || u === "litro") return "L";
                          return unit;
                        })()}
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
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "#64748b" }}>Produto Base</label>
                    <Select
                      options={produtos.filter(p => !isPreparacao || p.is_preparacao).map((p) => ({
                        value: p.id,
                        label: p.nome
                      }))}
                      value={selectedProdutoBase ? { value: selectedProdutoBase, label: produtos.find(p => p.id === selectedProdutoBase)?.nome } : null}
                      onChange={(selectedOption) => setSelectedProdutoBase(selectedOption?.value || "")}
                      placeholder="Selecione ou pesquise..."
                      isClearable
                      styles={{
                        control: (base) => ({
                          ...base,
                          fontSize: '1.4rem',
                          minHeight: '42px',
                          borderRadius: '8px',
                          borderColor: '#cbd5e1'
                        }),
                        menu: (base) => ({
                          ...base,
                          fontSize: '1.4rem',
                          zIndex: 1000
                        })
                      }}
                    />
                  </div>
                  <div className="form-group" style={{ flex: "0 0 100px", maxWidth: "100px", marginBottom: 0 }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "#64748b", width: "100%", textAlign: "center" }}>Quantidade</label>
                    <input
                      type="number"
                      step="0.00001"
                      className="frequencia-select"
                      placeholder="Qtd"
                      value={quantidadeProdutoBase}
                      onChange={(e) => setQuantidadeProdutoBase(e.target.value)}
                      style={{ background: "#fff", textAlign: "center", width: "100%", boxSizing: "border-box" }}
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
                          <th style={{ padding: "10px", textAlign: "right", color: "#475569" }}>
                            Custo Atual
                            <span
                              title="Esse valor é o último custo comprado dessa matéria prima"
                              style={{ cursor: "help", marginLeft: "6px", color: "#64748b" }}
                            >
                              <Icons.BsInfoCircle />
                            </span>
                          </th>
                          <th style={{ padding: "10px", textAlign: "right", color: "#475569" }}>Custo Calc.</th>
                          <th style={{ padding: "10px", textAlign: "center", color: "#475569", width: "80px" }}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewFicha.map((item, index) => {
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
                                {editingFichaIndex === index ? (
                                  <div style={{ display: "flex", gap: "6px", alignItems: "center", justifyContent: "center" }}>
                                    <input
                                      type="text"
                                      inputMode="decimal"
                                      value={editingFichaValue}
                                      onChange={(e) => setEditingFichaValue(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSaveEditFichaItem(index);
                                        if (e.key === "Escape") handleCancelEditFichaItem();
                                      }}
                                      style={{ width: "65px", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", fontSize: "1.1rem" }}
                                      autoFocus
                                    />
                                    <span style={{ fontSize: "0.9rem" }}>{unidade}</span>
                                    <button type="button" onClick={() => handleSaveEditFichaItem(index)} style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", padding: "4px" }} title="Salvar">
                                      <Icons.BsCheckLg style={{ fontSize: "1.2rem" }} />
                                    </button>
                                    <button type="button" onClick={handleCancelEditFichaItem} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }} title="Cancelar">
                                      <Icons.BsXLg style={{ fontSize: "1.2rem" }} />
                                    </button>
                                  </div>
                                ) : (
                                  fatorDesperdicio > 0 ? (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                                      <span style={{ fontSize: "1.1rem" }}>{item.quantidade} {unidade} <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "normal" }}>(Bruta)</span></span>
                                      <span style={{ fontSize: "0.95rem", color: "#16a34a" }}>{(parseFloat(item.quantidade) * (1 - fatorDesperdicio / 100)).toFixed(4)} {unidade} <span style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: "normal" }}>(Líq.)</span></span>
                                    </div>
                                  ) : (
                                    <>{item.quantidade} {unidade}</>
                                  )
                                )}
                              </td>
                              <td style={{ padding: "10px", textAlign: "right" }}>R$ {unitario.toFixed(2)}</td>
                              <td style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>R$ {calc.toFixed(2)}</td>
                              <td style={{ padding: "10px", textAlign: "center" }}>
                                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                  <button type="button" onClick={() => handleEditFichaItem(index)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer" }} title="Editar quantidade">
                                    <Icons.BsPencil />
                                  </button>
                                  <button type="button" onClick={() => handleRemoveFichaItem(index)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }} title="Remover item">
                                    <Icons.BsTrash />
                                  </button>
                                </div>
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
                  <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "1.3rem", lineHeight: 1.1 }}>Custo Total<br /><span style={{ fontSize: "0.95rem" }}>(Receita)</span></p>
                  <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: "bold", color: "#dc2626" }}>R$ {currentCustoTotal.toFixed(2)}</p>
                </div>
                <div style={{ flex: 1, backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "1.3rem", lineHeight: 1.1 }}>Custo Unitário<br /><span style={{ fontSize: "0.95rem" }}>(Por Rendimento)</span></p>
                  <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: "bold", color: "#dc2626" }}>R$ {currentCustoUnitario.toFixed(2)}</p>
                </div>
                <div style={{ flex: 1, backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "1.3rem", lineHeight: 1.1 }}>Lucro Bruto<br /><span style={{ fontSize: "0.95rem" }}>(Unid.)</span></p>
                  <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: "bold", color: currentLucro > 0 ? "#16a34a" : "#dc2626" }}>R$ {currentLucro.toFixed(2)}</p>
                </div>
                <div style={{ flex: 1, backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "1.3rem", lineHeight: 1.1 }}>Margem de Lucro<br /><span style={{ fontSize: "0.95rem" }}>(Unid.)</span></p>
                  <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: "bold", color: currentMargem >= 40 ? "#166534" : currentMargem > 10 ? "#854d0e" : "#991b1b" }}>
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
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, message: "", onConfirm: () => { } })}
      />
    </>
  );
}

export default CadastroProdutos;
