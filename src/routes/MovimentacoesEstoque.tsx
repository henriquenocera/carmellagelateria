import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import supabase from "../supabase-client";
import "../css/Frequencia.css";

const UNITS = [
  "Compras",
  "Fábrica",
  "Estoque MH",
  "Loja Ahú",
  "Loja Alto XV",
  "Descarte"
];

const getUnitBgColor = (unit: string) => {
  switch (unit) {
    case 'Compras': return '#e8f5e9'; // light green
    case 'Estoque MH': return '#424242'; // dark grey
    case 'Fábrica': return '#fff3e0'; // light orange
    case 'Loja Ahú': return '#fff9c4'; // light yellow
    case 'Loja Alto XV': return '#e3f2fd'; // light blue
    case 'Descarte': return '#ffebee'; // light red
    default: return '#ffffff';
  }
};

const getUnitColor = (unit: string) => {
  if (unit === 'Estoque MH') return '#ffffff';
  return 'inherit';
};

function MovimentacoesEstoque() {
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
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

  // Pagination state
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 100;

  // Filters state
  const [filterInsumoId, setFilterInsumoId] = useState<string | null>(null);
  const [filterData, setFilterData] = useState("");
  const [filterOrigem, setFilterOrigem] = useState("");
  const [filterDestino, setFilterDestino] = useState("");

  const isFirstRender = useRef(true);

  // New row state
  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [newRow, setNewRow] = useState({
    insumo_id: "",
    data_movimentacao: getToday(),
    quantidade: "",
    origem: "Compras",
    destino: "Estoque MH"
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData(false, 0, filterInsumoId, filterData, filterOrigem, filterDestino);
      return;
    }
    setPage(0);
    fetchData(false, 0, filterInsumoId, filterData, filterOrigem, filterDestino);
  }, [filterInsumoId, filterData, filterOrigem, filterDestino]);

  async function fetchData(isLoadMore = false, overridePage: number | null = null, fInsumoId = filterInsumoId, fData = filterData, fOrigem = filterOrigem, fDestino = filterDestino) {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        if (insumos.length === 0) {
          // Fetch insumos only on initial load
          const { data: insumosData, error: insumosError } = await supabase
            .from("cadastro_insumos")
            .select("id, nome, ativo")
            .order("nome", { ascending: true });
            
          if (insumosError) throw insumosError;
          setInsumos(insumosData || []);
        }
      }

      const currentPage = overridePage !== null ? overridePage : (isLoadMore ? page : 0);
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Fetch movimentacoes
      let query = supabase
        .from("movimentacoes_estoque")
        .select(`
          id,
          data_movimentacao,
          quantidade,
          origem,
          destino,
          insumo_id,
          created_at,
          cadastro_insumos!inner(nome)
        `, { count: 'exact' });

      if (fInsumoId) query = query.eq('insumo_id', fInsumoId);
      if (fData) query = query.eq('data_movimentacao', fData);
      if (fOrigem) query = query.eq('origem', fOrigem);
      if (fDestino) query = query.eq('destino', fDestino);

      const { data: movData, count, error: movError } = await query
        .order("data_movimentacao", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (movError) throw movError;
      
      const newMovs = movData || [];
      
      if (isLoadMore) {
        setMovimentacoes(prev => [...prev, ...newMovs]);
      } else {
        setMovimentacoes(newMovs);
        if (count !== null) setTotalCount(count);
      }
      
      setHasMore(newMovs.length === PAGE_SIZE);
      setPage(isLoadMore ? currentPage + 1 : 1);

    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      alert("Erro ao carregar as movimentações.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const handleAddRow = async () => {
    if (!newRow.insumo_id || !newRow.data_movimentacao || !newRow.quantidade || !newRow.origem || !newRow.destino) {
      alert("Por favor, preencha todos os campos para adicionar a movimentação.");
      return;
    }

    if (newRow.origem === newRow.destino) {
      alert("A Origem e o Destino não podem ser a mesma unidade!");
      return;
    }

    try {
      setSavingRow(true);
      const { data, error } = await supabase
        .from("movimentacoes_estoque")
        .insert([{
          insumo_id: newRow.insumo_id,
          data_movimentacao: newRow.data_movimentacao,
          quantidade: parseInt(newRow.quantidade, 10),
          origem: newRow.origem,
          destino: newRow.destino
        }])
        .select(`
          id,
          data_movimentacao,
          quantidade,
          origem,
          destino,
          insumo_id,
          created_at,
          cadastro_insumos(nome)
        `)
        .single();

      if (error) throw error;

      // Add to list and force sort
      setMovimentacoes(prev => {
        const updated = [data, ...prev];
        return updated.sort((a, b) => {
          const dateA = new Date(a.data_movimentacao).getTime();
          const dateB = new Date(b.data_movimentacao).getTime();
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
      
      // Clear specific fields but keep date and maybe origins to speed up input
      setNewRow({
        ...newRow,
        insumo_id: "",
        quantidade: ""
      });

      // Retornar o foco para o select de insumos após salvar
      setTimeout(() => {
        if (selectRef.current) {
          selectRef.current.focus();
        }
      }, 100);

    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar a movimentação: " + (err.message || JSON.stringify(err)));
    } finally {
      setSavingRow(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editRowData.insumo_id || !editRowData.data_movimentacao || !editRowData.quantidade || !editRowData.origem || !editRowData.destino) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (editRowData.origem === editRowData.destino) {
      alert("A Origem e o Destino não podem ser a mesma unidade!");
      return;
    }

    try {
      setSavingEdit(true);
      const { data, error } = await supabase
        .from("movimentacoes_estoque")
        .update({
          insumo_id: editRowData.insumo_id,
          data_movimentacao: editRowData.data_movimentacao,
          quantidade: parseInt(editRowData.quantidade, 10),
          origem: editRowData.origem,
          destino: editRowData.destino
        })
        .eq("id", editingRowId)
        .select(`
          id,
          data_movimentacao,
          quantidade,
          origem,
          destino,
          insumo_id,
          created_at,
          cadastro_insumos(nome)
        `)
        .single();

      if (error) throw error;

      setMovimentacoes(prev => prev.map(m => m.id === editingRowId ? data : m));
      setEditingRowId(null);
    } catch (err: any) {
      console.error("Erro ao salvar edição:", err);
      alert("Erro ao salvar a movimentação: " + (err.message || JSON.stringify(err)));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir esta movimentação? O histórico será perdido.")) return;
    try {
      const { error } = await supabase
        .from("movimentacoes_estoque")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setMovimentacoes(movimentacoes.filter(m => m.id !== id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao excluir a movimentação.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Movimentações de Estoque</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Movimentações de Estoque</h1>
            <p>Registre entradas de compras e transferências entre as unidades.</p>
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
            <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.BsPlusCircleFill style={{ color: "var(--primary-color)" }} />
              Registrar Movimentação
            </h3>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "flex-end"
            }}>
              <div style={{ flex: "2 1 250px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Insumo</label>
                <Select
                  ref={selectRef}
                  autoFocus
                  menuPortalTarget={document.body}
                  maxMenuHeight={350}
                  options={insumos.filter(ins => ins.ativo !== false).map(ins => ({ value: ins.id, label: ins.nome }))}
                  value={newRow.insumo_id ? { value: newRow.insumo_id, label: insumos.find(i => i.id === newRow.insumo_id)?.nome } : null}
                  onChange={(selectedOption) => setNewRow({ ...newRow, insumo_id: selectedOption ? selectedOption.value : "" })}
                  placeholder="Buscar Insumo..."
                  isClearable
                  noOptionsMessage={() => "Nenhum insumo encontrado"}
                  styles={{
                    control: (base) => ({ ...base, borderColor: '#cbd5e1', minHeight: '38px', borderRadius: '4px' }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                  }}
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Data</label>
                <input
                  type="date"
                  value={newRow.data_movimentacao}
                  onChange={(e) => setNewRow({ ...newRow, data_movimentacao: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "38px" }}
                />
              </div>
              <div style={{ flex: "1 1 100px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Quantidade</label>
                <input
                  type="number"
                  step="1"
                  placeholder="Qtd"
                  value={newRow.quantidade}
                  onChange={(e) => setNewRow({ ...newRow, quantidade: e.target.value })}
                  onKeyDown={(e) => {
                    if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "38px" }}
                />
              </div>
              <div style={{ flex: "1.5 1 150px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Origem</label>
                <select
                  value={newRow.origem}
                  onChange={(e) => setNewRow({ ...newRow, origem: e.target.value })}
                  style={{ 
                    width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid transparent",
                    backgroundColor: getUnitBgColor(newRow.origem), color: getUnitColor(newRow.origem), fontWeight: 500, height: "38px"
                  }}
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div style={{ flex: "1.5 1 150px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Destino</label>
                <select
                  value={newRow.destino}
                  onChange={(e) => setNewRow({ ...newRow, destino: e.target.value })}
                  style={{ 
                    width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid transparent",
                    backgroundColor: getUnitBgColor(newRow.destino), color: getUnitColor(newRow.destino), fontWeight: 500, height: "38px"
                  }}
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
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
                    height: "38px",
                    padding: "0",
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: savingRow ? "not-allowed" : "pointer",
                    fontWeight: "bold",
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
                  <th style={{ width: "300px" }}>Insumo</th>
                  <th style={{ textAlign: "center", width: "130px" }}>Data</th>
                  <th style={{ textAlign: "center", width: "100px" }}>Quantidade</th>
                  <th style={{ textAlign: "center", width: "160px" }}>Origem</th>
                  <th style={{ textAlign: "center", width: "160px" }}>Destino</th>
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
                  <th style={{ padding: "8px" }}></th>
                  <th style={{ padding: "8px" }}>
                    <select
                      value={filterOrigem}
                      onChange={(e) => setFilterOrigem(e.target.value)}
                      style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.1rem" }}
                    >
                      <option value="">Todas as origens</option>
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </th>
                  <th style={{ padding: "8px" }}>
                    <select
                      value={filterDestino}
                      onChange={(e) => setFilterDestino(e.target.value)}
                      style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.1rem" }}
                    >
                      <option value="">Todos os destinos</option>
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </th>
                  <th style={{ padding: "8px", textAlign: "center" }}>
                    <button
                      onClick={() => {
                        setFilterInsumoId(null);
                        setFilterData("");
                        setFilterOrigem("");
                        setFilterDestino("");
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
                {/* Linhas Existentes (Histórico) */}
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                      <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                    </td>
                  </tr>
                ) : movimentacoes.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      Nenhuma movimentação registrada.
                    </td>
                  </tr>
                ) : (
                  movimentacoes.map((mov) => {
                    const isEditing = editingRowId === mov.id;

                    if (isEditing) {
                      return (
                        <tr key={mov.id} style={{ backgroundColor: "#f8fafc" }}>
                          <td style={{ padding: "8px" }}>
                            <Select
                              menuPortalTarget={document.body}
                              maxMenuHeight={250}
                              options={insumos.map(ins => ({ value: ins.id, label: ins.nome }))}
                              value={editRowData.insumo_id ? { value: editRowData.insumo_id, label: insumos.find((i: any) => i.id === editRowData.insumo_id)?.nome } : null}
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
                              value={editRowData.data_movimentacao}
                              onChange={(e) => setEditRowData({ ...editRowData, data_movimentacao: e.target.value })}
                              style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                            />
                          </td>
                          <td style={{ padding: "8px" }}>
                            <input
                              type="number"
                              step="1"
                              value={editRowData.quantidade}
                              onChange={(e) => setEditRowData({ ...editRowData, quantidade: e.target.value })}
                              onKeyDown={(e) => {
                                if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px", textAlign: "center" }}
                            />
                          </td>
                          <td style={{ padding: "8px" }}>
                            <select
                              value={editRowData.origem}
                              onChange={(e) => setEditRowData({ ...editRowData, origem: e.target.value })}
                              style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                            >
                              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                          </td>
                          <td style={{ padding: "8px" }}>
                            <select
                              value={editRowData.destino}
                              onChange={(e) => setEditRowData({ ...editRowData, destino: e.target.value })}
                              style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                            >
                              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
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

                    const dataFormatada = new Date(mov.data_movimentacao + 'T00:00:00').toLocaleDateString('pt-BR');
                    
                    return (
                      <tr key={mov.id} className={mov.id === newlyAddedId ? "new-row-animation" : ""}>
                        <td>{mov.cadastro_insumos?.nome || "Insumo Excluído"}</td>
                        <td style={{ textAlign: "center" }}>{dataFormatada}</td>
                        <td style={{ textAlign: "center", fontWeight: "bold" }}>{mov.quantidade}</td>
                        <td style={{ 
                          textAlign: "center", 
                          backgroundColor: getUnitBgColor(mov.origem),
                          color: getUnitColor(mov.origem)
                        }}>
                          {mov.origem}
                        </td>
                        <td style={{ 
                          textAlign: "center", 
                          backgroundColor: getUnitBgColor(mov.destino),
                          color: getUnitColor(mov.destino)
                        }}>
                          {mov.destino}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <button
                              onClick={() => {
                                setEditingRowId(mov.id);
                                setEditRowData({
                                  insumo_id: mov.insumo_id,
                                  data_movimentacao: mov.data_movimentacao,
                                  quantidade: mov.quantidade,
                                  origem: mov.origem,
                                  destino: mov.destino
                                });
                              }}
                              className="nav-btn"
                              title="Editar"
                              style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                            >
                              <Icons.BsPencil />
                            </button>
                            <button
                              onClick={() => handleDelete(mov.id)}
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
                  })
                )}
              </tbody>
            </table>
            
            {!loading && (
              <div style={{ padding: "16px 20px", color: "#64748b", fontSize: "1.1rem", backgroundColor: "#f8fafc", textAlign: "center", borderTop: "2px solid #e2e8f0" }}>
                Mostrando <strong>{movimentacoes.length}</strong> de <strong>{totalCount}</strong> totais
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
    </>
  );
}

export default MovimentacoesEstoque;
