import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import supabase from "../supabase-client";

function EntradaMercadoria() {
  const [compras, setCompras] = useState<any[]>([]);
  const [insumos, setInsumos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRow, setSavingRow] = useState(false);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const selectRef = useRef<any>(null);

  // Edit state
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editRowData, setEditRowData] = useState<any>({});
  const [savingEdit, setSavingEdit] = useState(false);

  // Modal de Lançamento de Estoque
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockModalData, setStockModalData] = useState<any>(null);
  const [stockDestino, setStockDestino] = useState("Estoque MH");
  const [launchingStock, setLaunchingStock] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 100;

  // Filters state
  const [filterInsumoId, setFilterInsumoId] = useState<string | null>(null);
  const [filterData, setFilterData] = useState("");
  const [filterFornecedor, setFilterFornecedor] = useState("");

  const isFirstRender = useRef(true);

  // New row state
  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [newRow, setNewRow] = useState({
    insumo_id: "",
    data_compra: getToday(),
    fornecedor: "",
    quantidade_comprada: "",
    valor_unitario: ""
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData(false, 0, filterInsumoId, filterData, filterFornecedor);
      return;
    }
    setPage(0);
    fetchData(false, 0, filterInsumoId, filterData, filterFornecedor);
  }, [filterInsumoId, filterData, filterFornecedor]);

  async function fetchData(isLoadMore = false, overridePage: number | null = null, fInsumoId = filterInsumoId, fData = filterData, fFornecedor = filterFornecedor) {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        if (insumos.length === 0) {
          const { data: insumosData, error: insumosError } = await supabase
            .from("cadastro_insumos")
            .select("id, nome, ativo, fornecedor_padrao")
            .order("nome", { ascending: true });
            
          if (insumosError) throw insumosError;
          setInsumos(insumosData || []);
        }
      }

      const currentPage = overridePage !== null ? overridePage : (isLoadMore ? page : 0);
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("entradas_mercadoria")
        .select(`
          id,
          data_compra,
          fornecedor,
          quantidade_comprada,
          valor_unitario,
          insumo_id,
          created_at,
          cadastro_insumos!inner(nome)
        `, { count: 'exact' });

      if (fInsumoId) query = query.eq('insumo_id', fInsumoId);
      if (fData) query = query.eq('data_compra', fData);
      if (fFornecedor) query = query.ilike('fornecedor', `%${fFornecedor}%`);

      const { data: movData, count, error: movError } = await query
        .order("data_compra", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (movError) throw movError;
      
      const newMovs = movData || [];
      
      if (isLoadMore) {
        setCompras(prev => [...prev, ...newMovs]);
      } else {
        setCompras(newMovs);
        if (count !== null) setTotalCount(count);
      }
      
      setHasMore(newMovs.length === PAGE_SIZE);
      setPage(isLoadMore ? currentPage + 1 : 1);

    } catch (err: any) {
      console.error("Erro ao buscar dados:", err);
      // Se a tabela não existir ainda, mostramos um erro amigável
      if (err.code === "42P01") {
         console.warn("A tabela entradas_mercadoria não existe no Supabase.");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const handleAddRow = async (forceProceed: any = false) => {
    const isForced = typeof forceProceed === 'boolean' && forceProceed === true;

    if (!newRow.insumo_id || !newRow.data_compra || !newRow.quantidade_comprada || !newRow.valor_unitario) {
      alert("Por favor, preencha insumo, data, quantidade e valor unitário.");
      return;
    }

    try {
      setSavingRow(true);

      if (!isForced) {
        const { data: dups, error: dupErr } = await supabase
          .from("entradas_mercadoria")
          .select("id")
          .eq("insumo_id", newRow.insumo_id)
          .eq("data_compra", newRow.data_compra)
          .eq("quantidade_comprada", Number(newRow.quantidade_comprada))
          .eq("valor_unitario", Number(newRow.valor_unitario.replace(",", ".")))
          .limit(1);

        if (!dupErr && dups && dups.length > 0) {
          setSavingRow(false);
          setShowDuplicateModal(true);
          return;
        }
      }

      // 1. Inserir a compra na tabela
      const { data, error } = await supabase
        .from("entradas_mercadoria")
        .insert([{
          insumo_id: newRow.insumo_id,
          data_compra: newRow.data_compra,
          fornecedor: newRow.fornecedor,
          quantidade_comprada: Number(newRow.quantidade_comprada),
          valor_unitario: Number(newRow.valor_unitario.replace(",", "."))
        }])
        .select(`
          id,
          data_compra,
          fornecedor,
          quantidade_comprada,
          valor_unitario,
          insumo_id,
          created_at,
          cadastro_insumos(nome)
        `)
        .single();

      if (error) throw error;

      setCompras(prev => {
        const updated = [data, ...prev];
        return updated.sort((a, b) => {
          const dateA = new Date(a.data_compra).getTime();
          const dateB = new Date(b.data_compra).getTime();
          if (dateB !== dateA) return dateB - dateA;
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        });
      });
      
      setNewlyAddedId(data.id);
      setTimeout(() => {
        setNewlyAddedId(current => current === data.id ? null : current);
      }, 5500);
      
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 2000);
      
      const insumoIdParaEstoque = newRow.insumo_id;
      const dataCompraParaEstoque = newRow.data_compra;
      const quantidadeParaEstoque = Number(newRow.quantidade_comprada);

      setNewRow({
        ...newRow,
        insumo_id: "",
        fornecedor: "",
        quantidade_comprada: "",
        valor_unitario: ""
      });

      setTimeout(() => {
        if (selectRef.current) {
          selectRef.current.focus();
        }
      }, 100);

      setTimeout(async () => {
        let hasDuplicate = false;
        try {
          const { data: dups, error: dupErr } = await supabase
            .from("movimentacoes_estoque")
            .select("id")
            .eq("insumo_id", insumoIdParaEstoque)
            .eq("data_movimentacao", dataCompraParaEstoque)
            .eq("quantidade", quantidadeParaEstoque)
            .limit(1);
            
          if (!dupErr && dups && dups.length > 0) {
            hasDuplicate = true;
          }
        } catch (err) {
          console.error("Erro ao checar duplicatas:", err);
        }

        setStockModalData({
          insumo_id: insumoIdParaEstoque,
          data_movimentacao: dataCompraParaEstoque,
          quantidade: quantidadeParaEstoque,
          hasDuplicate
        });
        setShowStockModal(true);
      }, 50);

    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      if (err.code === "42P01") {
         alert("A tabela 'entradas_mercadoria' ainda não foi criada no banco de dados.");
      } else {
         alert("Erro ao salvar a entrada de mercadoria: " + (err.message || JSON.stringify(err)));
      }
    } finally {
      setSavingRow(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editRowData.insumo_id || !editRowData.data_compra || !editRowData.quantidade_comprada) {
      alert("Por favor, preencha insumo, data e quantidade.");
      return;
    }

    try {
      setSavingEdit(true);
      const { data, error } = await supabase
        .from("entradas_mercadoria")
        .update({
          insumo_id: editRowData.insumo_id,
          data_compra: editRowData.data_compra,
          fornecedor: editRowData.fornecedor,
          quantidade_comprada: parseFloat(editRowData.quantidade_comprada) || 0,
          valor_unitario: parseFloat(editRowData.valor_unitario) || null
        })
        .eq("id", editingRowId)
        .select(`
          id,
          data_compra,
          fornecedor,
          quantidade_comprada,
          valor_unitario,
          insumo_id,
          created_at,
          cadastro_insumos!inner(nome)
        `)
        .single();

      if (error) throw error;

      setCompras(compras.map(c => c.id === editingRowId ? data : c));
      setEditingRowId(null);
    } catch (err: any) {
      console.error("Erro ao atualizar:", err);
      alert("Erro ao atualizar o registro: " + (err.message || JSON.stringify(err)));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleLaunchStock = async () => {
    if (!stockModalData) return;
    setLaunchingStock(true);
    try {
      const { error: movError } = await supabase
        .from("movimentacoes_estoque")
        .insert([{
          insumo_id: stockModalData.insumo_id,
          data_movimentacao: stockModalData.data_movimentacao,
          quantidade: stockModalData.quantidade,
          origem: "Compras",
          destino: stockDestino
        }]);
        
      if (movError) {
        console.error("Erro ao lançar estoque:", movError);
        setFeedbackModal({ type: 'error', message: "Erro ao lançar estoque: " + (movError.message || JSON.stringify(movError)) });
      } else {
        setFeedbackModal({ type: 'success', message: "Lançamento de estoque realizado com sucesso no destino: " + stockDestino });
      }
    } catch (err) {
      console.error("Erro ao lançar estoque:", err);
      setFeedbackModal({ type: 'error', message: "Erro inesperado ao lançar estoque." });
    } finally {
      setLaunchingStock(false);
      setShowStockModal(false);
      setStockModalData(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir esta entrada de mercadoria?")) return;
    try {
      const { error } = await supabase
        .from("entradas_mercadoria")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setCompras(compras.filter(m => m.id !== id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao excluir o registro.");
    }
  };

  const handleInsumoSelect = (selectedOption: any) => {
    if (selectedOption) {
       const insumo = insumos.find(i => i.id === selectedOption.value);
       setNewRow({ 
         ...newRow, 
         insumo_id: selectedOption.value,
         fornecedor: insumo?.fornecedor_padrao || newRow.fornecedor 
       });
    } else {
       setNewRow({ ...newRow, insumo_id: "" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Entrada de Mercadoria</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Entrada de Mercadoria</h1>
            <p>Registre as compras de insumos. Isso atualizará automaticamente o Custo Atualizado do produto.</p>
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
            <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.8rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.BsPlusCircleFill style={{ color: "var(--primary-color)" }} />
              Registrar Compra
            </h3>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "flex-end"
            }}>
              <div style={{ flex: "2 1 250px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Insumo</label>
                <Select
                  ref={selectRef}
                  autoFocus
                  menuPortalTarget={document.body}
                  maxMenuHeight={350}
                  options={insumos.filter(ins => ins.ativo !== false).map(ins => ({ value: ins.id, label: ins.nome }))}
                  value={newRow.insumo_id ? { value: newRow.insumo_id, label: insumos.find(i => i.id === newRow.insumo_id)?.nome } : null}
                  onChange={handleInsumoSelect}
                  placeholder="Buscar Insumo..."
                  isClearable
                  noOptionsMessage={() => "Nenhum insumo encontrado"}
                  styles={{
                    control: (base) => ({ ...base, borderColor: '#cbd5e1', minHeight: '54px', borderRadius: '4px', fontSize: '1.4rem' }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: '1.4rem' })
                  }}
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Data da Compra</label>
                <input
                  type="date"
                  value={newRow.data_compra}
                  onChange={(e) => setNewRow({ ...newRow, data_compra: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "54px", fontSize: "1.4rem" }}
                />
              </div>
              <div style={{ flex: "1.5 1 150px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Fornecedor</label>
                <input
                  type="text"
                  placeholder="Nome do Fornecedor"
                  value={newRow.fornecedor}
                  onChange={(e) => setNewRow({ ...newRow, fornecedor: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", height: "54px", fontSize: "1.4rem" }}
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Qtd Comprada</label>
                <input
                  type="number"
                  step="any"
                  placeholder="0"
                  value={newRow.quantidade_comprada}
                  onChange={(e) => setNewRow({ ...newRow, quantidade_comprada: e.target.value })}
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "54px", fontSize: "1.4rem" }}
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Valor Unt. (R$)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={newRow.valor_unitario}
                  onChange={(e) => setNewRow({ ...newRow, valor_unitario: e.target.value })}
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "54px", fontSize: "1.4rem" }}
                />
              </div>
              <div style={{ flex: "0 0 130px", position: "relative" }}>
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
                    height: "54px",
                    padding: "0",
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: savingRow ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    fontSize: "1.4rem",
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
            <table className="freq-table" style={{ minWidth: "1000px" }}>
              <thead>
                <tr>
                  <th style={{ width: "250px" }}>Insumo</th>
                  <th style={{ textAlign: "center", width: "130px" }}>Data da Compra</th>
                  <th style={{ textAlign: "center", width: "200px" }}>Fornecedor</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Qtd Comprada</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Valor Unt.</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Total</th>
                  <th style={{ textAlign: "center", width: "80px" }}>Ações</th>
                </tr>
                {/* Linha de Filtros */}
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "8px" }}>
                    <Select
                      menuPortalTarget={document.body}
                      maxMenuHeight={350}
                      options={insumos.map(ins => ({ value: ins.id, label: ins.nome }))}
                      value={filterInsumoId ? { value: filterInsumoId, label: insumos.find(i => i.id === filterInsumoId)?.nome } : null}
                      onChange={(selectedOption) => setFilterInsumoId(selectedOption ? selectedOption.value : null)}
                      placeholder="Filtrar Insumo..."
                      isClearable
                      noOptionsMessage={() => "Nenhum insumo encontrado"}
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
                  <th style={{ padding: "8px" }}>
                    <input
                      type="text"
                      placeholder="Fornecedor..."
                      value={filterFornecedor}
                      onChange={(e) => setFilterFornecedor(e.target.value)}
                      style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.1rem" }}
                    />
                  </th>
                  <th style={{ padding: "8px" }}></th>
                  <th style={{ padding: "8px" }}></th>
                  <th style={{ padding: "8px" }}></th>
                  <th style={{ padding: "8px", textAlign: "center" }}>
                    <button
                      onClick={() => {
                        setFilterInsumoId(null);
                        setFilterData("");
                        setFilterFornecedor("");
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
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#94a3b8"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#cbd5e1"}
                    >
                      <Icons.BsXCircleFill /> Limpar
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                      <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                    </td>
                  </tr>
                ) : compras.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      Nenhuma entrada registrada.
                    </td>
                  </tr>
                ) : (
                  (() => {
                    const duplicatesMap: Record<string, number> = {};
                    compras.forEach(c => {
                      const key = `${c.insumo_id}_${c.data_compra}_${c.quantidade_comprada}_${c.valor_unitario}`;
                      duplicatesMap[key] = (duplicatesMap[key] || 0) + 1;
                    });
                    
                    return compras.map((comp) => {
                      const dataFormatada = new Date(comp.data_compra + 'T00:00:00').toLocaleDateString('pt-BR');
                      const total = comp.quantidade_comprada * comp.valor_unitario;
                      
                      const key = `${comp.insumo_id}_${comp.data_compra}_${comp.quantidade_comprada}_${comp.valor_unitario}`;
                      const isDuplicate = duplicatesMap[key] > 1;
                      const isEditing = editingRowId === comp.id;

                      if (isEditing) {
                        return (
                          <tr key={comp.id} style={{ backgroundColor: "#f8fafc" }}>
                            <td style={{ padding: "8px" }}>
                              <Select
                                menuPortalTarget={document.body}
                                maxMenuHeight={250}
                                options={insumos.filter(ins => ins.ativo !== false || ins.id === editRowData.insumo_id).map(ins => ({ value: ins.id, label: ins.nome }))}
                                value={editRowData.insumo_id ? { value: editRowData.insumo_id, label: insumos.find(i => i.id === editRowData.insumo_id)?.nome } : null}
                                onChange={(sel) => setEditRowData({ ...editRowData, insumo_id: sel ? sel.value : "" })}
                                styles={{
                                  control: (base) => ({ ...base, minHeight: '38px', fontSize: '1.1rem' }),
                                  menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: '1.1rem' })
                                }}
                              />
                            </td>
                            <td style={{ padding: "8px" }}>
                              <input
                                type="date"
                                value={editRowData.data_compra}
                                onChange={(e) => setEditRowData({ ...editRowData, data_compra: e.target.value })}
                                style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                              />
                            </td>
                            <td style={{ padding: "8px" }}>
                              <input
                                type="text"
                                value={editRowData.fornecedor}
                                onChange={(e) => setEditRowData({ ...editRowData, fornecedor: e.target.value })}
                                style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                              />
                            </td>
                            <td style={{ padding: "8px" }}>
                              <input
                                type="number"
                                step="any"
                                value={editRowData.quantidade_comprada}
                                onChange={(e) => setEditRowData({ ...editRowData, quantidade_comprada: e.target.value })}
                                style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px", textAlign: "center" }}
                              />
                            </td>
                            <td style={{ padding: "8px" }}>
                              <input
                                type="number"
                                step="any"
                                value={editRowData.valor_unitario}
                                onChange={(e) => setEditRowData({ ...editRowData, valor_unitario: e.target.value })}
                                style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px", textAlign: "center" }}
                              />
                            </td>
                            <td style={{ textAlign: "center", color: "var(--text-dark)", fontWeight: "bold" }}>
                              -
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                                <button
                                  onClick={handleSaveEdit}
                                  disabled={savingEdit}
                                  title="Salvar"
                                  style={{ background: "#22c55e", color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center" }}
                                >
                                  {savingEdit ? <Icons.BsArrowClockwise className="spin" /> : <Icons.BsCheck />}
                                </button>
                                <button
                                  onClick={() => setEditingRowId(null)}
                                  disabled={savingEdit}
                                  title="Cancelar"
                                  style={{ background: "#ef4444", color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center" }}
                                >
                                  <Icons.BsX />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      
                      return (
                        <tr key={comp.id} className={comp.id === newlyAddedId ? "new-row-animation" : ""} style={isDuplicate ? { backgroundColor: "#fef08a" } : {}}>
                          <td style={{ fontWeight: 600 }}>
                            {comp.cadastro_insumos?.nome || "Insumo Excluído"}
                            {isDuplicate && (
                              <span title="Atenção: Possível lançamento duplicado (mesmo insumo, data, qtd e valor)" style={{ marginLeft: "8px", color: "#b45309", cursor: "help" }}>
                                <Icons.BsExclamationTriangleFill />
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: "center" }}>{dataFormatada}</td>
                          <td style={{ textAlign: "center" }}>{comp.fornecedor || "-"}</td>
                          <td style={{ textAlign: "center", fontWeight: "bold" }}>{comp.quantidade_comprada}</td>
                          <td style={{ textAlign: "center", color: "var(--text-dark)" }}>
                            {comp.valor_unitario ? `R$ ${comp.valor_unitario.toFixed(2)}` : "-"}
                          </td>
                          <td style={{ textAlign: "center", fontWeight: "bold", color: "var(--primary-color)" }}>
                            {total ? `R$ ${total.toFixed(2)}` : "-"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                              <button
                                onClick={() => {
                                  setEditingRowId(comp.id);
                                  setEditRowData({
                                    insumo_id: comp.insumo_id,
                                    data_compra: comp.data_compra,
                                    fornecedor: comp.fornecedor || "",
                                    quantidade_comprada: comp.quantidade_comprada,
                                    valor_unitario: comp.valor_unitario || ""
                                  });
                                }}
                                className="nav-btn"
                                title="Editar"
                                style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                              >
                                <Icons.BsPencil />
                              </button>
                              <button
                                onClick={() => handleDelete(comp.id)}
                                className="delete-record-btn"
                                title="Excluir"
                                style={{ margin: 0, padding: "4px 8px", fontSize: "0.9rem" }}
                              >
                                <Icons.BsTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()
                )}
              </tbody>
            </table>
            
            {!loading && (
              <div style={{ padding: "16px 20px", color: "#64748b", fontSize: "1.1rem", backgroundColor: "#f8fafc", textAlign: "center", borderTop: "2px solid #e2e8f0" }}>
                Mostrando <strong>{compras.length}</strong> de <strong>{totalCount}</strong> totais
              </div>
            )}

            {hasMore && !loading && (
              <div style={{ textAlign: "center", padding: "20px", marginTop: "10px" }}>
                <button
                  onClick={() => fetchData(true)}
                  disabled={loadingMore}
                  style={{
                    padding: "10px 24px",
                    backgroundColor: "#f8fafc",
                    color: "var(--primary-color)",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    cursor: loadingMore ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    fontSize: "1.1rem"
                  }}
                >
                  {loadingMore ? "Carregando..." : "Carregar mais 100 linhas..."}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {showDuplicateModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10000,
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "40px", borderRadius: "16px",
            width: "90%", maxWidth: "500px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ margin: "0 0 24px 0", color: "#334155", display: "flex", alignItems: "center", gap: "12px", fontSize: "2.2rem" }}>
              <Icons.BsExclamationTriangleFill style={{ color: "#eab308" }} /> Lançamento Duplicado
            </h3>
            
            <p style={{ fontSize: "1.4rem", color: "#475569", lineHeight: "1.6", marginBottom: "32px" }}>
              Já existe um lançamento de entrada de mercadoria idêntico (mesmo insumo, data, quantidade e valor). Tem certeza que deseja prosseguir com este lançamento?
            </p>

            <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowDuplicateModal(false)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#f1f5f9",
                  color: "#475569",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e2e8f0"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowDuplicateModal(false);
                  handleAddRow(true);
                }}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#eab308",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#ca8a04"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#eab308"}
              >
                <Icons.BsCheckCircleFill /> Prosseguir
              </button>
            </div>
          </div>
        </div>
      )}

      {showStockModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10000,
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "40px", borderRadius: "16px",
            width: "90%", maxWidth: "650px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ margin: "0 0 24px 0", color: "#334155", display: "flex", alignItems: "center", gap: "12px", fontSize: "2.2rem" }}>
              <Icons.BsBoxSeam /> Lançar no Estoque?
            </h3>
            
            {stockModalData?.hasDuplicate && (
              <div style={{
                backgroundColor: "#fef2f2", color: "#dc2626", padding: "16px 20px",
                borderRadius: "12px", marginBottom: "24px", border: "2px solid #fecaca",
                fontSize: "1.4rem", lineHeight: "1.5"
              }}>
                <strong style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Icons.BsExclamationTriangleFill /> Atenção: Lançamento Duplicado!
                </strong>
                Já existe um lançamento de estoque para este insumo na mesma data e com esta exata quantidade. Tem certeza que deseja lançar novamente?
              </div>
            )}

            <p style={{ color: "#64748b", marginBottom: "32px", lineHeight: "1.6", fontSize: "1.5rem" }}>
              A entrada de mercadoria foi salva. Deseja fazer automaticamente o lançamento de estoque deste insumo considerando que a origem foi <strong>'Compras'</strong>?
            </p>
            
            <label style={{ display: "block", fontSize: "1.5rem", color: "#64748b", marginBottom: "12px", fontWeight: "bold" }}>Destino do Estoque</label>
            <select
              value={stockDestino}
              onChange={(e) => setStockDestino(e.target.value)}
              style={{
                width: "100%", padding: "16px", borderRadius: "10px", border: "2px solid #cbd5e1", 
                fontSize: "1.5rem", marginBottom: "36px", backgroundColor: "#f8fafc", color: "#334155"
              }}
            >
              <option value="Estoque MH">Estoque MH</option>
              <option value="Fábrica">Fábrica</option>
              <option value="Loja Ahú">Loja Ahú</option>
              <option value="Loja Alto XV">Loja Alto XV</option>
            </select>

            <div style={{ display: "flex", gap: "20px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setStockModalData(null);
                }}
                disabled={launchingStock}
                style={{
                  padding: "16px 24px", backgroundColor: "#f1f5f9", color: "#475569",
                  border: "2px solid #cbd5e1", borderRadius: "10px", cursor: "pointer",
                  fontWeight: "bold", fontSize: "1.4rem"
                }}
              >
                Não, obrigado
              </button>
              <button
                onClick={handleLaunchStock}
                disabled={launchingStock}
                style={{
                  padding: "16px 24px", backgroundColor: "var(--primary-color)", color: "white",
                  border: "none", borderRadius: "10px", cursor: "pointer",
                  fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px", fontSize: "1.4rem"
                }}
              >
                {launchingStock ? <><Icons.BsArrowClockwise className="spin" /> Lançando...</> : "Lançar Estoque"}
              </button>
            </div>
          </div>
        </div>
      )}

      {feedbackModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10001,
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "40px", borderRadius: "16px",
            width: "90%", maxWidth: "500px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            textAlign: "center"
          }}>
            <div style={{ color: feedbackModal.type === 'success' ? "#22c55e" : "#ef4444", fontSize: "5rem", marginBottom: "20px" }}>
              {feedbackModal.type === 'success' ? <Icons.BsCheckCircleFill /> : <Icons.BsExclamationCircleFill />}
            </div>
            <h3 style={{ margin: "0 0 20px 0", color: "#334155", fontSize: "2.2rem" }}>
              {feedbackModal.type === 'success' ? "Sucesso!" : "Atenção"}
            </h3>
            <p style={{ color: "#64748b", marginBottom: "32px", lineHeight: "1.6", fontSize: "1.5rem" }}>
              {feedbackModal.message}
            </p>
            
            <button
              onClick={() => setFeedbackModal(null)}
              style={{
                padding: "16px 32px", backgroundColor: feedbackModal.type === 'success' ? "var(--primary-color)" : "#ef4444", color: "white",
                border: "none", borderRadius: "10px", cursor: "pointer",
                fontWeight: "bold", fontSize: "1.4rem", width: "100%"
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default EntradaMercadoria;
