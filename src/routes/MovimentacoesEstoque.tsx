import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";
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
  const { user, isAdmin } = useAuth();
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

  // Duplicate Warning State
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [pendingMovimentacao, setPendingMovimentacao] = useState<any>(null);

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
  const [filterNeedsReview, setFilterNeedsReview] = useState(false);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);

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
    fetchData(false, 0, filterInsumoId, filterData, filterOrigem, filterDestino, filterNeedsReview);
  }, [filterInsumoId, filterData, filterOrigem, filterDestino, filterNeedsReview]);

  useEffect(() => {
    async function checkPendingReviews() {
      try {
        let query = supabase
          .from('movimentacoes_estoque')
          .select('*', { count: 'exact', head: true });
          
        if (isAdmin) {
          query = query.in('status_revisao', ['pending_user', 'pending_admin']);
        } else {
          query = query.eq('status_revisao', 'pending_user');
        }
        
        const { count, error } = await query;
        if (!error) {
          setPendingReviewCount(count || 0);
        }
      } catch (err) {
        console.error("Erro ao checar revisões pendentes:", err);
      }
    }
    checkPendingReviews();
  }, [movimentacoes, isAdmin]);

  async function fetchData(isLoadMore = false, overridePage: number | null = null, fInsumoId = filterInsumoId, fData = filterData, fOrigem = filterOrigem, fDestino = filterDestino, fReview = filterNeedsReview) {
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
          user_id,
          status_revisao,
          revisao_observacao,
          cadastro_insumos!inner(nome),
          profiles(name)
        `, { count: 'exact' });

      if (fInsumoId) query = query.eq('insumo_id', fInsumoId);
      if (fData) query = query.eq('data_movimentacao', fData);
      if (fOrigem) query = query.eq('origem', fOrigem);
      if (fDestino) query = query.eq('destino', fDestino);
      if (fReview) {
        if (isAdmin) {
          query = query.in('status_revisao', ['pending_user', 'pending_admin']);
        } else {
          query = query.eq('status_revisao', 'pending_user');
        }
      }

      const { data: movData, count, error: movError } = await query
        .order("data_movimentacao", { ascending: false })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
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

    setSavingRow(true);

    try {
      // Duplicate check
      const { data: dups, error: dupErr } = await supabase
        .from("movimentacoes_estoque")
        .select("id")
        .eq("insumo_id", newRow.insumo_id)
        .eq("data_movimentacao", newRow.data_movimentacao)
        .eq("quantidade", parseInt(newRow.quantidade, 10))
        .eq("origem", newRow.origem)
        .eq("destino", newRow.destino)
        .limit(1);

      if (!dupErr && dups && dups.length > 0) {
        setPendingMovimentacao({ ...newRow });
        setShowDuplicateModal(true);
        setSavingRow(false);
        return;
      }

      await executeSave(newRow);
    } catch (err: any) {
      console.error("Erro ao verificar duplicatas:", err);
      setSavingRow(false);
    }
  };

  const executeSave = async (rowToSave: any) => {
    setSavingRow(true);
    try {
      const { data, error } = await supabase
        .from("movimentacoes_estoque")
        .insert([{
          insumo_id: rowToSave.insumo_id,
          data_movimentacao: rowToSave.data_movimentacao,
          quantidade: parseInt(rowToSave.quantidade, 10),
          origem: rowToSave.origem,
          destino: rowToSave.destino
        }])
        .select(`
          id,
          data_movimentacao,
          quantidade,
          origem,
          destino,
          insumo_id,
          created_at,
          user_id,
          status_revisao,
          revisao_observacao,
          cadastro_insumos(nome),
          profiles(name)
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
      const originalRow = movimentacoes.find(m => m.id === editingRowId);
      let observacaoAdicional = "";
      
      if (originalRow && originalRow.status_revisao === 'pending_user') {
        const diffs = [];
        if (originalRow.insumo_id !== editRowData.insumo_id) {
           const nomeAntigo = originalRow.cadastro_insumos?.nome || "Desconhecido";
           const nomeNovo = insumos.find(i => i.id === editRowData.insumo_id)?.nome || "Desconhecido";
           diffs.push(`Insumo: ${nomeAntigo} ➔ ${nomeNovo}`);
        }
        if (originalRow.data_movimentacao !== editRowData.data_movimentacao) diffs.push(`Data: ${originalRow.data_movimentacao} ➔ ${editRowData.data_movimentacao}`);
        if (originalRow.origem !== editRowData.origem) diffs.push(`Origem: ${originalRow.origem} ➔ ${editRowData.origem}`);
        if (originalRow.destino !== editRowData.destino) diffs.push(`Destino: ${originalRow.destino} ➔ ${editRowData.destino}`);
        if (String(originalRow.quantidade) !== String(editRowData.quantidade)) diffs.push(`Qtd: ${originalRow.quantidade} ➔ ${editRowData.quantidade}`);
        
        if (diffs.length > 0) {
          const prev = originalRow.revisao_observacao;
          const prefix = (prev && prev !== "Sem alterações") ? prev + " | " : "";
          observacaoAdicional = prefix + diffs.join(", ");
        } else {
          observacaoAdicional = originalRow.revisao_observacao || "Sem alterações";
        }
      }

      const updateData: any = {
        insumo_id: editRowData.insumo_id,
        data_movimentacao: editRowData.data_movimentacao,
        quantidade: parseInt(editRowData.quantidade, 10),
        origem: editRowData.origem,
        destino: editRowData.destino
      };

      if (originalRow && originalRow.status_revisao === 'pending_user') {
        updateData.revisao_observacao = observacaoAdicional;
        if (!isAdmin) {
          updateData.status_revisao = 'pending_admin';
        }
      }

      const { data, error } = await supabase
        .from("movimentacoes_estoque")
        .update(updateData)
        .eq("id", editingRowId)
        .select(`
          id,
          data_movimentacao,
          quantidade,
          origem,
          destino,
          insumo_id,
          created_at,
          user_id,
          status_revisao,
          revisao_observacao,
          cadastro_insumos(nome),
          profiles(name)
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
      alert("Erro ao excluir o registro.");
    }
  };

  const handleUpdateReviewStatus = async (id: number, newStatus: string) => {
    try {
      const updateData: any = { status_revisao: newStatus };
      if (newStatus === 'none' || newStatus === 'pending_user') {
        updateData.revisao_observacao = null; // Limpa observações antigas ao iniciar novo ciclo
      }

      const { error } = await supabase
        .from("movimentacoes_estoque")
        .update(updateData)
        .eq("id", id);
      
      if (error) throw error;
      setMovimentacoes(movimentacoes.map(m => m.id === id ? { ...m, ...updateData } : m));
    } catch (err) {
      console.error("Erro ao alterar status de revisão:", err);
      alert("Erro ao alterar o status de revisão da linha.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Movimentações de Estoque</title>
        <style>{`
          @keyframes pulse-red {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
        `}</style>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div>
              <h1>Movimentações de Estoque</h1>
              <p>Registre entradas de compras e transferências entre as unidades.</p>
            </div>
            {pendingReviewCount > 0 && (
              <button
                onClick={() => {
                  setFilterNeedsReview(!filterNeedsReview);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  backgroundColor: filterNeedsReview ? "#fee2e2" : "#fef2f2",
                  color: "#dc2626",
                  border: `2px solid ${filterNeedsReview ? "#dc2626" : "#fca5a5"}`,
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: (!isAdmin && pendingReviewCount > 0 && !filterNeedsReview) ? "0 0 0 0 rgba(239, 68, 68, 0.7)" : "none",
                  animation: (!isAdmin && pendingReviewCount > 0 && !filterNeedsReview) ? "pulse-red 2s infinite" : "none"
                }}
                title={isAdmin ? "Ver todas as revisões (Aprovadas e Pendentes)" : "Ver linhas que precisam da sua correção"}
              >
                <Icons.BsExclamationCircleFill style={{ fontSize: "1.2rem" }} />
                {isAdmin ? `${pendingReviewCount} Revisões Pendentes` : `${pendingReviewCount} Correções Solicitadas`}
              </button>
            )}
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
              Registrar Movimentação
            </h3>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "flex-end"
            }}>
              <div style={{ flex: "2 1 250px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Insumo</label>
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
                    control: (base) => ({ ...base, borderColor: '#cbd5e1', minHeight: '46px', borderRadius: '4px', fontSize: '1.2rem' }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: '1.2rem' })
                  }}
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Data</label>
                <input
                  type="date"
                  value={newRow.data_movimentacao}
                  onChange={(e) => setNewRow({ ...newRow, data_movimentacao: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "46px", fontSize: "1.2rem" }}
                />
              </div>
              <div style={{ flex: "1 1 100px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Quantidade</label>
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
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "46px", fontSize: "1.2rem" }}
                />
              </div>
              <div style={{ flex: "1.5 1 150px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Origem</label>
                <select
                  value={newRow.origem}
                  onChange={(e) => setNewRow({ ...newRow, origem: e.target.value })}
                  style={{
                    width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid transparent",
                    backgroundColor: getUnitBgColor(newRow.origem), color: getUnitColor(newRow.origem), fontWeight: 500, height: "46px", fontSize: "1.2rem"
                  }}
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div style={{ flex: "1.5 1 150px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Destino</label>
                <select
                  value={newRow.destino}
                  onChange={(e) => setNewRow({ ...newRow, destino: e.target.value })}
                  style={{
                    width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid transparent",
                    backgroundColor: getUnitBgColor(newRow.destino), color: getUnitColor(newRow.destino), fontWeight: 500, height: "46px", fontSize: "1.2rem"
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
            <table className="freq-table" style={{ minWidth: "1000px" }}>
              <thead>
                <tr>
                  <th style={{ width: "300px" }}>Insumo</th>
                  <th style={{ textAlign: "center", width: "100px" }}>Data</th>
                  <th style={{ textAlign: "center", width: "50px" }}>Qntd</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Origem</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Destino</th>
                  {isAdmin && <th style={{ textAlign: "center", width: "110px" }}>Usuário</th>}
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
                  {isAdmin && <th style={{ padding: "8px" }}></th>}
                  <th style={{ padding: "8px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                      <button
                        onClick={() => setFilterNeedsReview(!filterNeedsReview)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: filterNeedsReview ? "#fee2e2" : "#fef2f2",
                          color: "#dc2626",
                          border: `2px solid ${filterNeedsReview ? "#dc2626" : "#fca5a5"}`,
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "0.2s"
                        }}
                        title="Filtrar por Revisão"
                      >
                        <Icons.BsExclamationTriangleFill /> Revisão {pendingReviewCount > 0 ? `(${pendingReviewCount})` : ''}
                      </button>
                      <button
                        onClick={() => {
                          setFilterInsumoId(null);
                          setFilterData("");
                          setFilterOrigem("");
                          setFilterDestino("");
                          setFilterNeedsReview(false);
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
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Linhas Existentes (Histórico) */}
                {loading ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: "center", padding: "40px" }}>
                      <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                    </td>
                  </tr>
                ) : movimentacoes.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      Nenhuma movimentação registrada.
                    </td>
                  </tr>
                ) : (
                  (() => {
                    const duplicatesMap: Record<string, number> = {};
                    movimentacoes.forEach(m => {
                      const key = `${m.insumo_id}_${m.data_movimentacao}_${m.quantidade}_${m.origem}_${m.destino}`;
                      duplicatesMap[key] = (duplicatesMap[key] || 0) + 1;
                    });

                    return movimentacoes.map((mov, index) => {
                      const isEditing = editingRowId === mov.id;
                      const key = `${mov.insumo_id}_${mov.data_movimentacao}_${mov.quantidade}_${mov.origem}_${mov.destino}`;
                      const isDuplicate = duplicatesMap[key] > 1;

                      const isToday = mov.data_movimentacao === getToday();
                      const prevMov = index > 0 ? movimentacoes[index - 1] : null;
                      const prevIsToday = prevMov ? prevMov.data_movimentacao === getToday() : false;
                      
                      const showHojeHeader = isToday && index === 0;
                      const showAnterioresHeader = !isToday && (index === 0 || prevIsToday);

                      const headerRow = showHojeHeader ? (
                        <tr key={`header-hoje-${mov.id}`} style={{ backgroundColor: "#f0fdf4" }}>
                          <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: "center", padding: "10px", fontWeight: "bold", color: "#166534", borderTop: "2px solid #bbf7d0", borderBottom: "2px solid #bbf7d0", textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.85rem" }}>
                            Lançamentos de Hoje
                          </td>
                        </tr>
                      ) : showAnterioresHeader ? (
                        <tr key={`header-ant-${mov.id}`} style={{ backgroundColor: "#f8fafc" }}>
                          <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: "center", padding: "10px", fontWeight: "bold", color: "#64748b", borderTop: "2px solid #e2e8f0", borderBottom: "2px solid #e2e8f0", textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.85rem" }}>
                            Lançamentos Anteriores
                          </td>
                        </tr>
                      ) : null;

                      let content;
                      if (isEditing) {
                        content = (
                          <tr key={`edit-${mov.id}`} style={{ backgroundColor: "#f8fafc" }}>
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
                            {isAdmin && (
                              <td style={{ textAlign: "center" }}>
                              <div 
                                title={mov.created_at ? `Registrado em: ${new Date(mov.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às')}` : "Data de registro não disponível"}
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
                                {mov.profiles?.name || "-"}
                              </div>
                              </td>
                            )}
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
                      } else {
                        const dataFormatada = new Date(mov.data_movimentacao + 'T00:00:00').toLocaleDateString('pt-BR');

                        content = (
                          <tr key={`view-${mov.id}`} className={mov.id === newlyAddedId ? "new-row-animation" : ""} style={mov.status_revisao === 'pending_user' ? { backgroundColor: "#fca5a5" } : mov.status_revisao === 'pending_admin' ? { backgroundColor: "#fed7aa" } : (isDuplicate ? { backgroundColor: "#fef08a" } : {})}>
                            <td>
                              {mov.cadastro_insumos?.nome || "Insumo Excluído"}
                              {isDuplicate && (
                                <span title="Atenção: Possível lançamento duplicado (mesmo insumo, data, qtd, origem e destino)" style={{ marginLeft: "8px", color: "#b45309", cursor: "help" }}>
                                  <Icons.BsExclamationTriangleFill />
                                </span>
                              )}
                            </td>
                            <td style={{ textAlign: "center" }}>{dataFormatada}</td>
                            <td style={{ textAlign: "center", fontWeight: "bold" }}>{mov.quantidade}</td>
                            <td style={mov.status_revisao !== 'none' ? { textAlign: "center" } : {
                              textAlign: "center",
                              backgroundColor: getUnitBgColor(mov.origem),
                              color: getUnitColor(mov.origem)
                            }}>
                              {mov.origem}
                            </td>
                            <td style={mov.status_revisao !== 'none' ? { textAlign: "center" } : {
                              textAlign: "center",
                              backgroundColor: getUnitBgColor(mov.destino),
                              color: getUnitColor(mov.destino)
                            }}>
                              {mov.destino}
                            </td>
                            {isAdmin && (
                              <td style={{ textAlign: "center" }}>
                                <div 
                                  title={mov.created_at ? `Registrado em: ${new Date(mov.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às')}` : "Data de registro não disponível"}
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
                                  {mov.profiles?.name || "-"}
                                </div>
                              </td>
                            )}
                            <td style={{ textAlign: "center" }}>
                              <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
                                {isAdmin && mov.status_revisao === 'none' && (
                                  <button
                                    onClick={() => handleUpdateReviewStatus(mov.id, 'pending_user')}
                                    title="Marcar para Revisão"
                                    style={{ padding: "4px 8px", fontSize: "1.1rem", color: "#ef4444", backgroundColor: "transparent", border: "none", cursor: "pointer", display: "flex" }}
                                  >
                                    <Icons.BsExclamationCircleFill />
                                  </button>
                                )}
                                {mov.status_revisao === 'pending_admin' && (
                                  isAdmin ? (
                                    <div style={{ display: "flex", gap: "4px" }}>
                                      {mov.revisao_observacao && (
                                        <span title={mov.revisao_observacao} style={{ padding: "4px 4px", fontSize: "1.1rem", color: "#ea580c", cursor: "help", display: "flex", alignItems: "center" }}>
                                          <Icons.BsInfoCircleFill />
                                        </span>
                                      )}
                                      <button
                                        onClick={() => handleUpdateReviewStatus(mov.id, 'none')}
                                        title="Aprovar Correção"
                                        style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#166534", backgroundColor: "#dcfce7", border: "1px solid #166534", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", margin: 0 }}
                                      >
                                        <Icons.BsCheckCircle /> Aprovar
                                      </button>
                                      <button
                                        onClick={() => handleUpdateReviewStatus(mov.id, 'pending_user')}
                                        title="Rejeitar Correção (Devolver ao Usuário)"
                                        style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#991b1b", backgroundColor: "#fca5a5", border: "1px solid #991b1b", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", margin: 0 }}
                                      >
                                        <Icons.BsXCircle /> Rejeitar
                                      </button>
                                    </div>
                                  ) : (
                                    <span title="Em análise pelo Admin" style={{ fontSize: "0.85rem", color: "#c2410c", backgroundColor: "#ffedd5", border: "1px solid #c2410c", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                                      <Icons.BsClockHistory /> Pendente
                                    </span>
                                  )
                                )}
                                {mov.status_revisao === 'pending_user' && (
                                  <button
                                    onClick={() => {
                                      if (isAdmin) {
                                        handleUpdateReviewStatus(mov.id, 'none');
                                      } else {
                                        if (!mov.revisao_observacao) {
                                          alert("Por favor, faça a correção da linha antes de marcar como resolvido.");
                                          setEditingRowId(mov.id);
                                          setEditRowData({
                                            insumo_id: mov.insumo_id,
                                            data_movimentacao: mov.data_movimentacao,
                                            quantidade: mov.quantidade,
                                            origem: mov.origem,
                                            destino: mov.destino
                                          });
                                        } else {
                                          handleUpdateReviewStatus(mov.id, 'pending_admin');
                                        }
                                      }
                                    }}
                                    title={isAdmin ? "Cancelar Revisão" : "Marcar como Resolvido (Enviar p/ Admin)"}
                                    style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#b91c1c", backgroundColor: "#fca5a5", border: "1px solid #b91c1c", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", margin: 0 }}
                                  >
                                    <Icons.BsCheckCircle /> {isAdmin ? "Cancelar" : "Resolvido"}
                                  </button>
                                )}
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
                      }

                      return (
                        <React.Fragment key={mov.id}>
                          {headerRow}
                          {content}
                        </React.Fragment>
                      );
                    });
                  })()
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

      {showDuplicateModal && (
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
              <Icons.BsExclamationTriangleFill style={{ color: "#eab308" }} /> Lançamento Duplicado?
            </h3>

            <div style={{
              backgroundColor: "#fef2f2", color: "#dc2626", padding: "16px 20px",
              borderRadius: "12px", marginBottom: "24px", border: "2px solid #fecaca",
              fontSize: "1.4rem", lineHeight: "1.5"
            }}>
              <strong>Aviso:</strong> Já existe um lançamento idêntico para este insumo (mesma data, quantidade, origem e destino).
            </div>

            <p style={{ color: "#64748b", marginBottom: "32px", lineHeight: "1.6", fontSize: "1.5rem" }}>
              Tem certeza que deseja registrar este lançamento novamente?
            </p>

            <div style={{ display: "flex", gap: "20px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowDuplicateModal(false);
                  setPendingMovimentacao(null);
                }}
                disabled={savingRow}
                style={{
                  padding: "16px 24px", backgroundColor: "#f1f5f9", color: "#475569",
                  border: "2px solid #cbd5e1", borderRadius: "10px", cursor: "pointer",
                  fontWeight: "bold", fontSize: "1.4rem"
                }}
              >
                Não, cancelar
              </button>
              <button
                onClick={async () => {
                  setShowDuplicateModal(false);
                  if (pendingMovimentacao) {
                    await executeSave(pendingMovimentacao);
                  }
                }}
                disabled={savingRow}
                style={{
                  padding: "16px 24px", backgroundColor: "#ef4444", color: "white",
                  border: "none", borderRadius: "10px", cursor: "pointer",
                  fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px", fontSize: "1.4rem"
                }}
              >
                {savingRow ? <><Icons.BsArrowClockwise className="spin" /> Lançando...</> : "Sim, lançar mesmo assim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MovimentacoesEstoque;
