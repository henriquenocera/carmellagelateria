import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import "../css/Frequencia.css";

function ProducaoRealizada() {
  const { user, isAdmin } = useAuth();
  const [producoes, setProducoes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRow, setSavingRow] = useState(false);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const selectRef = useRef<any>(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 100;

  // Filters state
  const [filterProdutoId, setFilterProdutoId] = useState<string | null>(null);
  const [filterData, setFilterData] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'deleted'>('all');
  const [pendingDeleteCount, setPendingDeleteCount] = useState(0);

  useEffect(() => {
    async function checkPendingCounts() {
      try {
        if (isAdmin) {
          const { count: delCount, error: delError } = await supabase
            .from('producao_realizada')
            .select('*', { count: 'exact', head: true })
            .eq('status_revisao', 'pending_delete');
          if (!delError) setPendingDeleteCount(delCount || 0);
        }
      } catch (err) {
        console.error("Erro ao checar deletes:", err);
      }
    }
    checkPendingCounts();
  }, [producoes, isAdmin]);

  const isFirstRender = useRef(true);

  // New row state
  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editRowData, setEditRowData] = useState<any>({});

  const [newRow, setNewRow] = useState({
    produto_id: "",
    data_producao: getToday(),
    peso_bruto: "",
    tara: "",
    peso_liquido: "",
    validade: ""
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData(false, 0, filterProdutoId, filterData, filterStatus);
      return;
    }
    setPage(0);
    fetchData(false, 0, filterProdutoId, filterData, filterStatus);
  }, [filterProdutoId, filterData, filterStatus]);

  const fetchDataRef = useRef<any>(null);

  useEffect(() => {
    const channel = supabase.channel('realtime-producao')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'producao_realizada' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNewlyAddedId(payload.new.id);
            setTimeout(() => {
              setNewlyAddedId(current => current === payload.new.id ? null : current);
            }, 3000);
          }
          if (fetchDataRef.current) {
            fetchDataRef.current(false, 0, undefined, undefined, undefined, true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchData(isLoadMore = false, overridePage: number | null = null, fProdutoId = filterProdutoId, fData = filterData, fStatus = filterStatus, isBackground = false) {
    fetchDataRef.current = fetchData;
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        if (!isBackground) setLoading(true);
        if (produtos.length === 0) {
          // Fetch produtos only on initial load
          const { data: produtosData, error: produtosError } = await supabase
            .from("cadastro_produtos")
            .select("id, nome, ativo, codigo")
            .eq("is_sabor", true)
            .order("nome", { ascending: true });

          if (produtosError) throw produtosError;
          setProdutos(produtosData || []);
        }
      }

      const currentPage = overridePage !== null ? overridePage : (isLoadMore ? page : 0);
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("producao_realizada")
        .select(`
          id,
          codigo,
          data_producao,
          peso_bruto,
          tara,
          peso_liquido,
          data_entrada,
          destino,
          validade,
          produto_id,
          created_at,
          user_id,
          status_revisao,
          revisao_observacao,
          cadastro_produtos!inner(nome, codigo),
          profiles(name)
        `, { count: 'exact' });

      if (fProdutoId) query = query.eq('produto_id', fProdutoId);
      if (fData) query = query.eq('data_producao', fData);
      
      if (!isAdmin) {
        query = query.neq('status_revisao', 'pending_delete');
      } else {
        if (fStatus === 'deleted') {
          query = query.eq('status_revisao', 'pending_delete');
        }
      }

      const { data: prodData, count, error: prodError } = await query
        .order("data_producao", { ascending: false })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(from, to);

      if (prodError) throw prodError;

      const newProds = prodData || [];

      if (isLoadMore) {
        setProducoes(prev => [...prev, ...newProds]);
      } else {
        setProducoes(newProds);
        if (count !== null) setTotalCount(count);
      }

      setHasMore(newProds.length === PAGE_SIZE);
      setPage(isLoadMore ? currentPage + 1 : 1);

    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      alert("Erro ao carregar a produção: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const handleAddRow = async () => {
    if (!newRow.produto_id || !newRow.data_producao || !newRow.peso_bruto || !newRow.tara) {
      alert("Por favor, preencha todos os campos obrigatórios (Produto, Data, Peso Bruto e Tara).");
      return;
    }

    setSavingRow(true);

    try {
      const selectedProduct = produtos.find(p => p.id === newRow.produto_id);
      const prodCodigo = selectedProduct?.codigo || "ND";
      
      let ddMMyy = "";
      if (newRow.data_producao) {
        const parts = newRow.data_producao.split('-');
        if (parts.length === 3) {
          ddMMyy = `${parts[2]}${parts[1]}${parts[0].substring(2)}`;
        }
      }
      const baseCodProducao = `${prodCodigo}${ddMMyy}`;
      
      const { data: existingProds } = await supabase
        .from("producao_realizada")
        .select("codigo")
        .eq("produto_id", newRow.produto_id)
        .eq("data_producao", newRow.data_producao);

      let finalCodProducao = baseCodProducao;
      if (existingProds && existingProds.length > 0) {
        let maxSuffix = -1;
        for (const p of existingProds) {
          if (p.codigo === baseCodProducao) {
            if (maxSuffix < 0) maxSuffix = 0;
          } else if (p.codigo?.startsWith(baseCodProducao + "-")) {
            const suffixStr = p.codigo.substring((baseCodProducao + "-").length);
            const suffixNum = parseInt(suffixStr, 10);
            if (!isNaN(suffixNum) && suffixNum > maxSuffix) {
              maxSuffix = suffixNum;
            }
          }
        }
        if (maxSuffix >= 0) {
           finalCodProducao = `${baseCodProducao}-${maxSuffix + 1}`;
        }
      }

      let calculatedPesoLiquido: number | null = null;
      const pb = newRow.peso_bruto ? parseFloat(newRow.peso_bruto) : null;
      const t = newRow.tara ? parseFloat(newRow.tara) : null;
      if (pb !== null && t !== null) {
        calculatedPesoLiquido = parseFloat((pb - t).toFixed(2));
      }

      let calculatedValidade: string | null = null;
      if (newRow.data_producao) {
        const dataProdDate = new Date(newRow.data_producao + "T12:00:00");
        dataProdDate.setDate(dataProdDate.getDate() + 180);
        calculatedValidade = `${dataProdDate.getFullYear()}-${String(dataProdDate.getMonth() + 1).padStart(2, '0')}-${String(dataProdDate.getDate()).padStart(2, '0')}`;
      }

      const { data, error } = await supabase
        .from("producao_realizada")
        .insert([{
          produto_id: newRow.produto_id,
          codigo: finalCodProducao,
          data_producao: newRow.data_producao,
          peso_bruto: pb,
          tara: t,
          peso_liquido: calculatedPesoLiquido,
          data_entrada: null,
          destino: null,
          validade: calculatedValidade,
          user_id: user?.id
        }])
        .select(`
          id,
          codigo,
          data_producao,
          peso_bruto,
          tara,
          peso_liquido,
          data_entrada,
          destino,
          validade,
          produto_id,
          created_at,
          user_id,
          cadastro_produtos(nome, codigo),
          profiles(name)
        `)
        .single();

      if (error) throw error;

      // Add to list and force sort
      setProducoes(prev => {
        const updated = [data, ...prev];
        return updated.sort((a, b) => {
          const dateA = new Date(a.data_producao).getTime();
          const dateB = new Date(b.data_producao).getTime();
          if (dateB !== dateA) return dateB - dateA;
          // Fallback to created_at if dates are the same
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        });
      });

      setNewlyAddedId(data.id);
      setTimeout(() => {
        setNewlyAddedId(current => current === data.id ? null : current);
      }, 5500);

      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 2000);

      // Clear specific fields but keep date to speed up input
      setNewRow({
        ...newRow,
        produto_id: "",
        peso_bruto: "",
        tara: "",
        peso_liquido: "",
        validade: ""
      });

      // Retornar o foco para o select de produtos após salvar
      setTimeout(() => {
        if (selectRef.current) {
          selectRef.current.focus();
        }
      }, 100);

    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar a produção: " + (err.message || JSON.stringify(err)));
    } finally {
      setSavingRow(false);
    }
  };

  const handleQuickUpdate = async (id: string, field: "data_entrada" | "destino", value: string) => {
    try {
      const { error } = await supabase
        .from("producao_realizada")
        .update({ [field]: value || null })
        .eq("id", id);
      
      if (error) throw error;

      setProducoes(prev => prev.map(p => p.id === id ? { ...p, [field]: value || null } : p));
    } catch (err: any) {
      console.error(`Erro ao atualizar ${field}:`, err);
      alert(`Erro ao atualizar: ${err.message || JSON.stringify(err)}`);
    }
  };

  const saveEdit = async (prod: any) => {
    try {
      setSavingRow(true);
      const pb = parseFloat(editRowData.peso_bruto);
      const t = parseFloat(editRowData.tara);
      let calculatedPesoLiquido: number | null = null;
      if (!isNaN(pb) && !isNaN(t)) {
        calculatedPesoLiquido = parseFloat((pb - t).toFixed(3));
      }

      let calculatedValidade: string | null = prod.validade;
      let finalCodProducao: string = prod.codigo;

      const dateChanged = editRowData.data_producao && editRowData.data_producao !== prod.data_producao;
      const productChanged = editRowData.produto_id && editRowData.produto_id !== prod.produto_id;
      const newProdutoId = editRowData.produto_id || prod.produto_id;

      if (dateChanged || productChanged) {
        if (dateChanged) {
          const dataProdDate = new Date(editRowData.data_producao + "T12:00:00");
          dataProdDate.setDate(dataProdDate.getDate() + 180);
          calculatedValidade = `${dataProdDate.getFullYear()}-${String(dataProdDate.getMonth() + 1).padStart(2, '0')}-${String(dataProdDate.getDate()).padStart(2, '0')}`;
        }

        const selectedProduct = produtos.find(p => p.id === newProdutoId);
        const prodCodigo = selectedProduct?.codigo || "ND";
        const parts = editRowData.data_producao.split('-');
        let ddMMyy = "";
        if (parts.length === 3) {
          ddMMyy = `${parts[2]}${parts[1]}${parts[0].substring(2)}`;
        }
        const baseCodProducao = `${prodCodigo}${ddMMyy}`;
        
        const { data: existingProds } = await supabase
          .from("producao_realizada")
          .select("codigo")
          .eq("produto_id", newProdutoId)
          .eq("data_producao", editRowData.data_producao)
          .neq("id", prod.id);

        finalCodProducao = baseCodProducao;
        if (existingProds && existingProds.length > 0) {
          let maxSuffix = -1;
          for (const p of existingProds) {
            if (p.codigo === baseCodProducao) {
              if (maxSuffix < 0) maxSuffix = 0;
            } else if (p.codigo?.startsWith(baseCodProducao + "-")) {
              const suffixStr = p.codigo.substring((baseCodProducao + "-").length);
              const suffixNum = parseInt(suffixStr, 10);
              if (!isNaN(suffixNum) && suffixNum > maxSuffix) {
                maxSuffix = suffixNum;
              }
            }
          }
          if (maxSuffix >= 0) {
             finalCodProducao = `${baseCodProducao}-${maxSuffix + 1}`;
          }
        }
      }

      const { data, error } = await supabase
        .from("producao_realizada")
        .update({
          produto_id: newProdutoId,
          peso_bruto: isNaN(pb) ? null : pb,
          tara: isNaN(t) ? null : t,
          peso_liquido: calculatedPesoLiquido,
          data_producao: editRowData.data_producao,
          data_entrada: editRowData.data_entrada || null,
          destino: editRowData.destino || null,
          validade: calculatedValidade,
          codigo: finalCodProducao
        })
        .eq("id", prod.id)
        .select(`
          id, codigo, data_producao, peso_bruto, tara, peso_liquido, 
          data_entrada, destino, validade, produto_id, created_at, user_id, 
          cadastro_produtos(nome, codigo), profiles(name)
        `)
        .single();
      
      if (error) throw error;

      setProducoes(prev => prev.map(p => p.id === prod.id ? data : p));
      setEditingRowId(null);
    } catch (err: any) {
      console.error("Erro ao salvar edição:", err);
      alert("Erro ao salvar: " + (err.message || JSON.stringify(err)));
    } finally {
      setSavingRow(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este registro de produção? O histórico será perdido.")) return;
    try {
      if (isAdmin) {
        const { error } = await supabase
          .from("producao_realizada")
          .delete()
          .eq("id", id);
        if (error) throw error;
        setProducoes(producoes.filter(p => p.id !== id));
      } else {
        const { error } = await supabase
          .from("producao_realizada")
          .update({ status_revisao: 'pending_delete' })
          .eq("id", id);
        if (error) throw error;
        
        if (filterStatus !== 'deleted') {
          setProducoes(producoes.filter(p => p.id !== id));
        } else {
          setProducoes(producoes.map(c => c.id === id ? { ...c, status_revisao: 'pending_delete' } : c));
        }
      }
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao excluir o registro.");
    }
  };

  const handleUpdateReviewStatus = async (id: string, newStatus: string) => {
    try {
      const updateData: any = { status_revisao: newStatus };
      if (newStatus === 'none' || newStatus === 'pending_user') {
        updateData.revisao_observacao = null;
      }

      const { error } = await supabase
        .from("producao_realizada")
        .update(updateData)
        .eq("id", id);
      
      if (error) throw error;
      setProducoes(producoes.map(m => m.id === id ? { ...m, ...updateData } : m));
    } catch (err) {
      console.error("Erro ao alterar status de revisão:", err);
      alert("Erro ao alterar o status de revisão.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Produção Realizada</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div>
              <h1>Produção Realizada</h1>
              <p>Registre e acompanhe as produções diárias de gelatos, preparações e outros produtos.</p>
            </div>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>

          {/* Card de Inserção */}
          <div style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            marginBottom: "24px",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.BsPlusCircleFill style={{ color: "var(--primary-color)" }} />
              Registrar Produção
            </h3>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "flex-end"
            }}>
              <div style={{ flex: "2 1 250px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Produto *</label>
                <Select
                  ref={selectRef}
                  autoFocus
                  menuPortalTarget={document.body}
                  maxMenuHeight={350}
                  options={produtos.filter(p => p.ativo !== false).map(p => ({ value: p.id, label: p.nome }))}
                  value={newRow.produto_id ? { value: newRow.produto_id, label: produtos.find(p => p.id === newRow.produto_id)?.nome } : null}
                  onChange={(selectedOption) => setNewRow({ ...newRow, produto_id: selectedOption ? selectedOption.value : "" })}
                  placeholder="Buscar Produto..."
                  isClearable
                  noOptionsMessage={() => "Nenhum produto encontrado"}
                  styles={{
                    control: (base) => ({ ...base, borderColor: '#cbd5e1', minHeight: '46px', borderRadius: '4px', fontSize: '1.2rem' }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: '1.2rem' })
                  }}
                />
              </div>
              <div style={{ flex: "1 1 150px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Data Produção *</label>
                <input
                  type="date"
                  value={newRow.data_producao}
                  onChange={(e) => setNewRow({ ...newRow, data_producao: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "46px", fontSize: "1.2rem" }}
                />
              </div>
              <div style={{ flex: "1 1 100px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Peso Bruto (kg) *</label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="Bruto"
                  value={newRow.peso_bruto}
                  onChange={(e) => setNewRow({ ...newRow, peso_bruto: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "46px", fontSize: "1.2rem" }}
                />
              </div>
              <div style={{ flex: "1 1 100px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Tara (kg) *</label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="Tara"
                  value={newRow.tara}
                  onChange={(e) => setNewRow({ ...newRow, tara: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "46px", fontSize: "1.2rem" }}
                />
              </div>

              <div style={{ flex: "0 0 150px", position: "relative" }}>
                {showSavedMessage && (
                  <span className="saved-message-anim" style={{
                    position: "absolute",
                    top: "-24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "#22c55e",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    pointerEvents: "none",
                    whiteSpace: "nowrap"
                  }}>
                    Salvo!
                  </span>
                )}
                <button
                  onClick={handleAddRow}
                  disabled={savingRow}
                  style={{
                    height: "46px",
                    padding: "0",
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: savingRow ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  {savingRow ? <><Icons.BsArrowClockwise className="spin" /> Salvando...</> : <><Icons.BsCheckCircleFill /> Salvar</>}
                </button>
              </div>
            </div>
          </div>

          <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <table className="freq-table" style={{ minWidth: "1400px" }}>
              <thead>
                <tr>
                  <th style={{ width: "150px", textAlign: "center" }}>Cód de Produção</th>
                  <th style={{ width: "100px", textAlign: "center" }}>Cód Produto</th>
                  <th style={{ width: "250px" }}>Produto</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Data Produção</th>
                  <th style={{ textAlign: "center", width: "100px" }}>Peso Bruto (kg)</th>
                  <th style={{ textAlign: "center", width: "100px" }}>Tara (kg)</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Peso Líquido (kg)</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Data Entrada</th>
                  <th style={{ textAlign: "center", width: "150px" }}>Destino</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Validade</th>
                  <th style={{ textAlign: "center", width: "150px" }}>Usuário</th>
                  <th style={{ textAlign: "center", width: "80px" }}>Ações</th>
                </tr>
                {/* Linha de Filtros */}
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "8px" }}></th>
                  <th style={{ padding: "8px" }}></th>
                  <th style={{ padding: "8px" }}>
                    <Select
                      menuPortalTarget={document.body}
                      maxMenuHeight={350}
                      options={produtos.map(p => ({ value: p.id, label: p.nome }))}
                      value={filterProdutoId ? { value: filterProdutoId, label: produtos.find(p => p.id === filterProdutoId)?.nome } : null}
                      onChange={(selectedOption) => setFilterProdutoId(selectedOption ? selectedOption.value : null)}
                      placeholder="Filtrar Produto..."
                      isClearable
                      noOptionsMessage={() => "Nenhum produto encontrado"}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: '#cbd5e1',
                          minHeight: '38px',
                          borderRadius: '4px',
                          fontSize: '1.1rem'
                        }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                          fontSize: '1.1rem'
                        })
                      }}
                    />
                  </th>
                  <th style={{ padding: "8px" }}>
                    <input
                      type="date"
                      value={filterData}
                      onChange={(e) => setFilterData(e.target.value)}
                      style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.1rem" }}
                    />
                  </th>
                  <th colSpan={8} style={{ padding: "8px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "nowrap" }}>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            const newStatus = filterStatus === 'deleted' ? 'all' : 'deleted';
                            setFilterStatus(newStatus);
                            if (newStatus === 'deleted') {
                              setFilterProdutoId(null);
                              setFilterData("");
                            }
                          }}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: filterStatus === 'deleted' ? "#fca5a5" : (pendingDeleteCount > 0 ? "#fee2e2" : "#fff"),
                            color: filterStatus === 'deleted' ? "#7f1d1d" : (pendingDeleteCount > 0 ? "#b91c1c" : "#64748b"),
                            border: `1px solid ${filterStatus === 'deleted' ? "#f87171" : (pendingDeleteCount > 0 ? "#fca5a5" : "#e2e8f0")}`,
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: filterStatus === 'deleted' ? "bold" : "normal",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.85rem",
                            animation: pendingDeleteCount > 0 && filterStatus !== 'deleted' ? "pulse-red 2s infinite" : "none"
                          }}
                          title={filterStatus === 'deleted' ? "Ver Todas as Produções" : "Ver Itens Aguardando Exclusão"}
                        >
                          <Icons.BsTrashFill /> Deletados {pendingDeleteCount > 0 ? `(${pendingDeleteCount})` : ""}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setFilterProdutoId(null);
                          setFilterData("");
                          setFilterStatus('all');
                        }}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#cbd5e1",
                          color: "#334155",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "0.2s"
                        }}
                        title="Limpar Filtros"
                      >
                        <Icons.BsXCircleFill /> Limpar
                      </button>
                      <button
                        onClick={() => fetchData(false, 0)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#f1f5f9",
                          color: "#334155",
                          border: "1px solid #cbd5e1",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "0.2s"
                        }}
                        title="Atualizar Dados"
                      >
                        <Icons.BsArrowClockwise /> Atualizar
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && producoes.length === 0 ? (
                  <tr>
                    <td colSpan={12} style={{ textAlign: "center", padding: "40px" }}>
                      <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                    </td>
                  </tr>
                ) : producoes.length === 0 ? (
                  <tr>
                    <td colSpan={12} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      Nenhum registro de produção encontrado.
                    </td>
                  </tr>
                ) : (
                  producoes.map((prod) => {
                    const isNew = newlyAddedId === prod.id;
                    const isDeleting = false;
                    
                    return (
                      <tr 
                        key={prod.id} 
                        style={{ 
                          backgroundColor: isNew ? '#dcfce7' : (prod.status_revisao === 'pending_delete' ? '#fecaca' : 'inherit'),
                          opacity: (isDeleting || prod.status_revisao === 'pending_delete') ? 0.6 : 1,
                          transition: "all 0.5s ease"
                        }}
                      >
                        <td style={{ textAlign: "center", fontWeight: "bold" }}>
                          {prod.codigo || "-"}
                          {prod.status_revisao === 'pending_delete' && (
                            <span style={{ display: "block", fontSize: "0.75rem", backgroundColor: "#ef4444", color: "white", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase", marginTop: "4px", width: "fit-content", margin: "4px auto 0 auto" }}>Deletado</span>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>{prod.cadastro_produtos?.codigo || "-"}</td>
                        <td style={{ fontWeight: "500" }}>
                          {editingRowId === prod.id ? (
                            <Select
                              menuPortalTarget={document.body}
                              options={produtos.map(p => ({ value: p.id, label: p.nome }))}
                              value={editRowData.produto_id ? { value: editRowData.produto_id, label: produtos.find(p => p.id === editRowData.produto_id)?.nome } : null}
                              onChange={(selectedOption) => setEditRowData({ ...editRowData, produto_id: selectedOption ? selectedOption.value : "" })}
                              placeholder="Selecione..."
                              styles={{
                                control: (base) => ({ ...base, minHeight: '30px', fontSize: '0.9rem' }),
                                menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: '0.9rem' })
                              }}
                            />
                          ) : (
                            prod.cadastro_produtos?.nome || "-"
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {editingRowId === prod.id ? (
                            <input 
                              type="date"
                              value={editRowData.data_producao || ""}
                              onChange={e => setEditRowData({ ...editRowData, data_producao: e.target.value })}
                              style={{ width: "100%", padding: "4px", fontSize: "0.9rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                            />
                          ) : (
                            prod.data_producao ? new Date(prod.data_producao + "T12:00:00").toLocaleDateString('pt-BR') : "-"
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {editingRowId === prod.id ? (
                            <input 
                              type="number" step="0.001"
                              value={editRowData.peso_bruto || ""}
                              onChange={e => setEditRowData({ ...editRowData, peso_bruto: e.target.value })}
                              style={{ width: "80px", padding: "4px", fontSize: "0.9rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                            />
                          ) : (
                            <span style={{ color: prod.peso_bruto < 0 ? "#ef4444" : "inherit" }}>
                              {prod.peso_bruto != null ? Number(prod.peso_bruto).toFixed(3) : "-"}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {editingRowId === prod.id ? (
                            <input 
                              type="number" step="0.001"
                              value={editRowData.tara || ""}
                              onChange={e => setEditRowData({ ...editRowData, tara: e.target.value })}
                              style={{ width: "80px", padding: "4px", fontSize: "0.9rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                            />
                          ) : (
                            <span style={{ color: prod.tara < 0 ? "#ef4444" : "inherit" }}>
                              {prod.tara != null ? Number(prod.tara).toFixed(3) : "-"}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: "bold", color: prod.peso_liquido < 0 ? "#ef4444" : "inherit" }}>{prod.peso_liquido != null ? Number(prod.peso_liquido).toFixed(3) : "-"}</td>
                        <td style={{ textAlign: "center" }}>
                          {editingRowId === prod.id ? (
                            <input 
                              type="date"
                              value={editRowData.data_entrada || ""}
                              onChange={e => setEditRowData({ ...editRowData, data_entrada: e.target.value })}
                              style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                            />
                          ) : prod.data_entrada ? (
                            new Date(prod.data_entrada + "T12:00:00").toLocaleDateString('pt-BR')
                          ) : (
                            <input 
                              type="date"
                              style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                              onBlur={(e) => {
                                if (e.target.value) {
                                  handleQuickUpdate(prod.id, "data_entrada", e.target.value);
                                }
                              }}
                            />
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {editingRowId === prod.id ? (
                            <select 
                              value={editRowData.destino || ""}
                              style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                              onChange={(e) => setEditRowData({ ...editRowData, destino: e.target.value })}
                            >
                              <option value="" disabled>Selecionar...</option>
                              <option value="Loja Ahu">Loja Ahu</option>
                              <option value="Loja Alto XV">Loja Alto XV</option>
                              <option value="Venda">Venda</option>
                              <option value="Rebatido">Rebatido</option>
                              <option value="Descartado">Descartado</option>
                              <option value="Outro">Outro</option>
                            </select>
                          ) : prod.destino ? (
                            prod.destino
                          ) : (
                            <select 
                              defaultValue=""
                              style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleQuickUpdate(prod.id, "destino", e.target.value);
                                }
                              }}
                            >
                              <option value="" disabled>Selecionar...</option>
                              <option value="Loja Ahu">Loja Ahu</option>
                              <option value="Loja Alto XV">Loja Alto XV</option>
                              <option value="Venda">Venda</option>
                              <option value="Rebatido">Rebatido</option>
                              <option value="Descartado">Descartado</option>
                              <option value="Outro">Outro</option>
                            </select>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {prod.validade ? new Date(prod.validade + "T12:00:00").toLocaleDateString('pt-BR') : "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <div 
                            title={prod.created_at ? `Registrado em: ${new Date(prod.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às')}` : "Data de registro não disponível"}
                            style={{ 
                              color: "#334155", 
                              fontWeight: 600, 
                              display: "inline-flex", 
                              alignItems: "center", 
                              justifyContent: "center", 
                              gap: "6px", 
                              cursor: "help",
                              backgroundColor: "#f8fafc",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid #e2e8f0"
                            }}
                          >
                            <Icons.BsPersonFill style={{ color: "#94a3b8", fontSize: "1.1rem" }} />
                            {prod.profiles?.name || "-"}
                          </div>
                        </td>
                        <td style={{ textAlign: "center", padding: "4px" }}>
                          {editingRowId === prod.id ? (
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                              <button onClick={() => saveEdit(prod)} title="Salvar" disabled={savingRow} style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", fontSize: "1.2rem" }}>
                                {savingRow ? <Icons.BsArrowClockwise className="spin" /> : <Icons.BsCheckLg />}
                              </button>
                              <button onClick={() => setEditingRowId(null)} title="Cancelar" disabled={savingRow} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.2rem" }}>
                                <Icons.BsXLg />
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                              {prod.status_revisao === 'pending_delete' && (
                                isAdmin ? (
                                  <div style={{ display: "flex", gap: "4px" }}>
                                    <button
                                      onClick={() => handleDelete(prod.id)}
                                      title="Aprovar Exclusão"
                                      style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#166534", backgroundColor: "#dcfce7", border: "1px solid #166534", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", margin: 0 }}
                                    >
                                      <Icons.BsCheckAll /> Excluir
                                    </button>
                                    <button
                                      onClick={() => handleUpdateReviewStatus(prod.id, 'none')}
                                      title="Restaurar Registro"
                                      style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#9a3412", backgroundColor: "#fed7aa", border: "1px solid #9a3412", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", margin: 0 }}
                                    >
                                      <Icons.BsXCircle /> Restaurar
                                    </button>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: "0.85rem", color: "#991b1b", backgroundColor: "#fecaca", border: "1px solid #991b1b", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Icons.BsTrash /> Aguardando
                                  </span>
                                )
                              )}
                              {prod.status_revisao !== 'pending_delete' && (
                                <button onClick={() => { setEditingRowId(prod.id); setEditRowData({ produto_id: prod.produto_id, peso_bruto: prod.peso_bruto, tara: prod.tara, data_producao: prod.data_producao, data_entrada: prod.data_entrada, destino: prod.destino }); }} title="Editar Registro" style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "1.1rem" }}>
                                  <Icons.BsPencil />
                                </button>
                              )}
                              {prod.status_revisao !== 'pending_delete' && (isAdmin || (!prod.status_revisao || prod.status_revisao === 'none')) && (
                                <button onClick={() => handleDelete(prod.id)} className="delete-record-btn" title="Excluir Registro" style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                                  <Icons.BsTrash />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
                
                {hasMore && producoes.length > 0 && (
                  <tr>
                    <td colSpan={12} style={{ textAlign: "center", padding: "16px" }}>
                      <button 
                        onClick={() => fetchData(true)}
                        disabled={loadingMore}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--primary-color)",
                          fontWeight: "bold",
                          cursor: loadingMore ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          margin: "0 auto",
                          fontSize: "1.1rem"
                        }}
                      >
                        {loadingMore ? (
                          <><Icons.BsArrowClockwise className="spin" /> Carregando mais...</>
                        ) : (
                          <><Icons.BsChevronDown /> Mostrar mais resultados</>
                        )}
                      </button>
                    </td>
                  </tr>
                )}
                <tr style={{ backgroundColor: "#f8fafc", fontWeight: "bold" }}>
                  <td colSpan={12} style={{ textAlign: "right", padding: "12px 16px", color: "#64748b" }}>
                    Total de registros encontrados: {totalCount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProducaoRealizada;
