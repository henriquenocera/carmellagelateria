import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import supabase from "../supabase-client";

function EntradaMercadoria() {
  const { isAdmin, user } = useAuth();
  const [searchParams] = useSearchParams();
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

  // Wizard de Lançamento
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    hasMercadoriaDuplicate: false,
    hasEstoqueDuplicate: false
  });
  
  const [stockDestino, setStockDestino] = useState("Estoque MH");
  const [feedbackModal, setFeedbackModal] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 100;

  // Filters state
  const [filterInsumoId, setFilterInsumoId] = useState<string | null>(searchParams.get('insumo_id') || null);
  const [filterData, setFilterData] = useState(searchParams.get('data_compra') || "");
  const [filterFornecedor, setFilterFornecedor] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'review' | 'deleted'>('all');
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [pendingDeleteCount, setPendingDeleteCount] = useState(0);

  const isFirstRender = useRef(true);

  const [inputMode, setInputMode] = useState<'unit' | 'total'>('unit');
  const [valorTotalInput, setValorTotalInput] = useState("");

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
      fetchData(false, 0, filterInsumoId, filterData, filterFornecedor, filterStatus);
      return;
    }
    setPage(0);
    fetchData(false, 0, filterInsumoId, filterData, filterFornecedor, filterStatus);
  }, [filterInsumoId, filterData, filterFornecedor, filterStatus]);

  useEffect(() => {
    async function checkPendingCounts() {
      try {
        let revQuery = supabase.from('entradas_mercadoria').select('*', { count: 'exact', head: true });
        if (isAdmin) {
          revQuery = revQuery.in('status_revisao', ['pending_user', 'pending_admin']);
        } else {
          revQuery = revQuery.eq('status_revisao', 'pending_user');
        }
        
        const { count: revCount, error: revError } = await revQuery;
        if (!revError) setPendingReviewCount(revCount || 0);

        if (isAdmin) {
          const { count: delCount, error: delError } = await supabase
            .from('entradas_mercadoria')
            .select('*', { count: 'exact', head: true })
            .eq('status_revisao', 'pending_delete');
          if (!delError) setPendingDeleteCount(delCount || 0);
        }
      } catch (err) {
        console.error("Erro ao checar revisões/deletes:", err);
      }
    }
    checkPendingCounts();
  }, [compras, isAdmin]);

  const fetchDataRef = useRef<any>(null);

  useEffect(() => {
    const channel = supabase.channel('realtime-entradas')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'entradas_mercadoria' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNewlyAddedId(payload.new.id);
            setTimeout(() => {
              setNewlyAddedId(current => current === payload.new.id ? null : current);
            }, 3000);
          }
          if (fetchDataRef.current) {
            fetchDataRef.current(false, 0, undefined, undefined, undefined, undefined, true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchData(isLoadMore = false, overridePage: number | null = null, fInsumoId = filterInsumoId, fData = filterData, fFornecedor = filterFornecedor, fStatus = filterStatus, isBackground = false) {
    fetchDataRef.current = fetchData;
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        if (!isBackground) setLoading(true);
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
          user_id,
          status_revisao,
          revisao_observacao,
          cadastro_insumos!inner(nome),
          profiles(name)
        `, { count: 'exact' });

      if (fInsumoId) query = query.eq('insumo_id', fInsumoId);
      if (fData) query = query.eq('data_compra', fData);
      if (fFornecedor) query = query.ilike('fornecedor', `%${fFornecedor}%`);
      
      if (fStatus === 'review') {
        if (isAdmin) {
          query = query.in('status_revisao', ['pending_user', 'pending_admin']);
        } else {
          query = query.eq('status_revisao', 'pending_user');
        }
      } else if (fStatus === 'deleted') {
        query = query.eq('status_revisao', 'pending_delete');
      } else {
        if (!isAdmin) {
          query = query.or('status_revisao.is.null,status_revisao.neq.pending_delete');
        }
      }

      const { data: movData, count, error: movError } = await query
        .order("data_compra", { ascending: false })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
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

  const handleStartWizard = async () => {
    if (!newRow.insumo_id || !newRow.data_compra || !newRow.quantidade_comprada || !newRow.valor_unitario) {
      alert("Por favor, preencha insumo, data, quantidade e valor unitário.");
      return;
    }

    setSavingRow(true);
    try {
      const [mercadoriaRes, estoqueRes] = await Promise.all([
        supabase
          .from("entradas_mercadoria")
          .select("id")
          .eq("insumo_id", newRow.insumo_id)
          .eq("data_compra", newRow.data_compra)
          .eq("quantidade_comprada", Number(newRow.quantidade_comprada))
          .eq("valor_unitario", Number(newRow.valor_unitario.replace(",", ".")))
          .limit(1),
        supabase
          .from("movimentacoes_estoque")
          .select("id")
          .eq("insumo_id", newRow.insumo_id)
          .eq("data_movimentacao", newRow.data_compra)
          .eq("quantidade", Number(newRow.quantidade_comprada))
          .limit(1)
      ]);

      const hasMercadoriaDuplicate = !mercadoriaRes.error && mercadoriaRes.data && mercadoriaRes.data.length > 0;
      const hasEstoqueDuplicate = !estoqueRes.error && estoqueRes.data && estoqueRes.data.length > 0;

      setWizardData({
        hasMercadoriaDuplicate,
        hasEstoqueDuplicate
      });

      if (hasMercadoriaDuplicate) {
        setWizardStep(1);
      } else {
        setWizardStep(2);
      }
      
      setShowWizard(true);
    } catch (err) {
      console.error("Erro na verificação do wizard:", err);
    } finally {
      setSavingRow(false);
    }
  };

  const handleWizardConfirm = async (shouldLaunchStock: boolean) => {
    setShowWizard(false);
    setSavingRow(true);

    try {
      const { data, error } = await supabase
        .from("entradas_mercadoria")
        .insert([{
          insumo_id: newRow.insumo_id,
          data_compra: newRow.data_compra,
          fornecedor: newRow.fornecedor,
          quantidade_comprada: Number(newRow.quantidade_comprada),
          valor_unitario: Number(newRow.valor_unitario.replace(",", ".")),
          user_id: user?.id
        }])
        .select(`
          id,
          data_compra,
          fornecedor,
          quantidade_comprada,
          valor_unitario,
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

      if (shouldLaunchStock) {
        const { error: movError } = await supabase
          .from("movimentacoes_estoque")
          .insert([{
            insumo_id: newRow.insumo_id,
            data_movimentacao: newRow.data_compra,
            quantidade: Number(newRow.quantidade_comprada),
            origem: "Compras",
            destino: stockDestino
          }]);
          
        if (movError) {
          console.error("Erro ao lançar estoque:", movError);
          setFeedbackModal({ type: 'error', message: "Erro ao lançar estoque: " + (movError.message || JSON.stringify(movError)) });
        } else {
          setFeedbackModal({ type: 'success', message: "Lançamento de estoque realizado com sucesso no destino: " + stockDestino });
        }
      }

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
      const originalRow = compras.find(c => c.id === editingRowId);
      let observacaoAdicional = "";
      
      if (originalRow && originalRow.status_revisao === 'pending_user') {
        const diffs = [];
        if (originalRow.insumo_id !== editRowData.insumo_id) {
           const nomeAntigo = originalRow.cadastro_insumos?.nome || "Desconhecido";
           const nomeNovo = insumos.find(i => i.id === editRowData.insumo_id)?.nome || "Desconhecido";
           diffs.push(`Insumo: ${nomeAntigo} ➔ ${nomeNovo}`);
        }
        if (originalRow.data_compra !== editRowData.data_compra) diffs.push(`Data: ${originalRow.data_compra} ➔ ${editRowData.data_compra}`);
        if ((originalRow.fornecedor || "") !== (editRowData.fornecedor || "")) diffs.push(`Fornec: ${originalRow.fornecedor || "-"} ➔ ${editRowData.fornecedor || "-"}`);
        if (String(originalRow.quantidade_comprada) !== String(editRowData.quantidade_comprada)) diffs.push(`Qtd: ${originalRow.quantidade_comprada} ➔ ${editRowData.quantidade_comprada}`);
        if (String(originalRow.valor_unitario) !== String(editRowData.valor_unitario)) diffs.push(`Valor: ${originalRow.valor_unitario || "-"} ➔ ${editRowData.valor_unitario}`);
        
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
        data_compra: editRowData.data_compra,
        fornecedor: editRowData.fornecedor,
        quantidade_comprada: parseFloat(editRowData.quantidade_comprada) || 0,
        valor_unitario: parseFloat(editRowData.valor_unitario) || null
      };

      if (originalRow && originalRow.status_revisao === 'pending_user') {
        updateData.revisao_observacao = observacaoAdicional;
        if (!isAdmin) {
          updateData.status_revisao = 'pending_admin';
        }
      }

      const { data, error } = await supabase
        .from("entradas_mercadoria")
        .update(updateData)
        .eq("id", editingRowId)
        .select(`
          id,
          data_compra,
          fornecedor,
          quantidade_comprada,
          valor_unitario,
          insumo_id,
          created_at,
          user_id,
          status_revisao,
          revisao_observacao,
          cadastro_insumos!inner(nome),
          profiles(name)
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



  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir esta entrada de mercadoria?")) return;
    try {
      if (isAdmin) {
        const { error } = await supabase
          .from("entradas_mercadoria")
          .delete()
          .eq("id", id);
        if (error) throw error;
        setCompras(compras.filter(m => m.id !== id));
      } else {
        const { error } = await supabase
          .from("entradas_mercadoria")
          .update({ status_revisao: 'pending_delete' })
          .eq("id", id);
        if (error) throw error;
        if (filterStatus !== 'deleted') {
          setCompras(compras.filter(m => m.id !== id));
        } else {
          setCompras(compras.map(c => c.id === id ? { ...c, status_revisao: 'pending_delete' } : c));
        }
      }
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
        .from("entradas_mercadoria")
        .update(updateData)
        .eq("id", id);
      
      if (error) throw error;
      setCompras(compras.map(c => c.id === id ? { ...c, ...updateData } : c));
    } catch (err) {
      console.error("Erro ao alterar status de revisão:", err);
      alert("Erro ao alterar o status de revisão da linha.");
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
                  onChange={(e) => {
                    const q = e.target.value;
                    setNewRow({ ...newRow, quantidade_comprada: q });
                    if (inputMode === 'total') {
                      const vt = parseFloat(valorTotalInput) || 0;
                      const qf = parseFloat(q) || 0;
                      if (qf > 0) {
                        setNewRow(prev => ({ ...prev, quantidade_comprada: q, valor_unitario: (vt / qf).toFixed(2) }));
                      } else {
                        setNewRow(prev => ({ ...prev, quantidade_comprada: q, valor_unitario: "" }));
                      }
                    }
                  }}
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
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <span style={{ position: "absolute", left: "12px", color: "#94a3b8", zIndex: 1, pointerEvents: "none", fontSize: "1.2rem", fontWeight: "bold" }}>R$</span>
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
                    readOnly={inputMode === 'total'}
                    onClick={() => {
                      if (inputMode === 'total') setInputMode('unit');
                      if (parseFloat(newRow.valor_unitario) === 0) {
                        setNewRow({ ...newRow, valor_unitario: "" });
                      }
                    }}
                    style={{ width: "100%", padding: "8px 8px 8px 36px", borderRadius: "4px", border: "1px solid #cbd5e1", backgroundColor: inputMode === 'total' ? "#f1f5f9" : "#fff", textAlign: "center", height: "54px", fontSize: "1.4rem", cursor: inputMode === 'total' ? "not-allowed" : "text" }}
                  />
                </div>
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Valor Total</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <span style={{ position: "absolute", left: "12px", color: "#94a3b8", zIndex: 1, pointerEvents: "none", fontSize: "1.2rem", fontWeight: "bold" }}>R$</span>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={inputMode === 'unit' ? (((parseFloat(newRow.quantidade_comprada) || 0) * (parseFloat(newRow.valor_unitario) || 0)) === 0 ? "" : ((parseFloat(newRow.quantidade_comprada) || 0) * (parseFloat(newRow.valor_unitario) || 0)).toFixed(2)) : valorTotalInput}
                    onChange={(e) => {
                      const vt = e.target.value;
                      setValorTotalInput(vt);
                      const qf = parseFloat(newRow.quantidade_comprada) || 0;
                      if (qf > 0) {
                        setNewRow({ ...newRow, valor_unitario: (parseFloat(vt) / qf).toFixed(2) });
                      }
                    }}
                    readOnly={inputMode === 'unit'}
                    onClick={() => {
                      if (inputMode === 'unit') {
                        setInputMode('total');
                        const calc = ((parseFloat(newRow.quantidade_comprada) || 0) * (parseFloat(newRow.valor_unitario) || 0));
                        setValorTotalInput(calc === 0 ? "" : calc.toFixed(2));
                      } else {
                        if (parseFloat(valorTotalInput) === 0) {
                          setValorTotalInput("");
                        }
                      }
                    }}
                    style={{ width: "100%", padding: "8px 8px 8px 36px", borderRadius: "4px", border: "1px solid #cbd5e1", backgroundColor: inputMode === 'unit' ? "#f1f5f9" : "#fff", color: "#64748b", height: "54px", fontSize: "1.4rem", fontWeight: "bold", cursor: inputMode === 'unit' ? "not-allowed" : "text" }}
                  />
                </div>
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
                  onClick={handleStartWizard}
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
                  <th style={{ padding: "8px" }}>
                    <input
                      type="text"
                      placeholder="Fornecedor..."
                      value={filterFornecedor}
                      onChange={(e) => setFilterFornecedor(e.target.value)}
                      style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.1rem" }}
                    />
                  </th>
                  <th colSpan={isAdmin ? 5 : 4} style={{ padding: "8px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "nowrap" }}>
                      <button
                        onClick={() => {
                          const newStatus = filterStatus === 'review' ? 'all' : 'review';
                          setFilterStatus(newStatus);
                          if (newStatus === 'review') {
                            setFilterInsumoId(null);
                            setFilterData("");
                            setFilterFornecedor("");
                          }
                        }}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: filterStatus === 'review' ? "#fca5a5" : (pendingReviewCount > 0 ? "#fee2e2" : "#fff"),
                          color: filterStatus === 'review' ? "#7f1d1d" : (pendingReviewCount > 0 ? "#dc2626" : "#64748b"),
                          border: `1px solid ${filterStatus === 'review' ? "#fca5a5" : (pendingReviewCount > 0 ? "#fca5a5" : "#e2e8f0")}`,
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: filterStatus === 'review' ? "bold" : "normal",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.85rem",
                          animation: pendingReviewCount > 0 && filterStatus !== 'review' ? "pulse-red 2s infinite" : "none"
                        }}
                        title={filterStatus === 'review' ? "Ver Todos os Lançamentos" : "Ver Lançamentos com Revisão Pendente"}
                      >
                        <Icons.BsExclamationTriangleFill /> Revisão {pendingReviewCount > 0 ? `(${pendingReviewCount})` : ""}
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            const newStatus = filterStatus === 'deleted' ? 'all' : 'deleted';
                            setFilterStatus(newStatus);
                            if (newStatus === 'deleted') {
                              setFilterInsumoId(null);
                              setFilterData("");
                              setFilterFornecedor("");
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
                          title={filterStatus === 'deleted' ? "Ver Todos os Lançamentos" : "Ver Itens Aguardando Exclusão"}
                        >
                          <Icons.BsTrashFill /> Deletados {pendingDeleteCount > 0 ? `(${pendingDeleteCount})` : ""}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setFilterInsumoId(null);
                          setFilterData("");
                          setFilterFornecedor("");
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
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#94a3b8"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#cbd5e1"}
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
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#e2e8f0"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                      >
                        <Icons.BsArrowClockwise /> Atualizar
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 7} style={{ textAlign: "center", padding: "40px" }}>
                      <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                    </td>
                  </tr>
                ) : compras.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 7} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
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
                    
                    return compras.map((comp, index) => {
                      const dataFormatada = new Date(comp.data_compra + 'T00:00:00').toLocaleDateString('pt-BR');
                      const total = comp.quantidade_comprada * comp.valor_unitario;
                      
                      const key = `${comp.insumo_id}_${comp.data_compra}_${comp.quantidade_comprada}_${comp.valor_unitario}`;
                      const isDuplicate = duplicatesMap[key] > 1;
                      const isEditing = editingRowId === comp.id;

                      const isToday = comp.data_compra === getToday();
                      const prevComp = index > 0 ? compras[index - 1] : null;
                      const prevIsToday = prevComp ? prevComp.data_compra === getToday() : false;
                      
                      const showHojeHeader = isToday && index === 0;
                      const showAnterioresHeader = !isToday && (index === 0 || prevIsToday);

                      const headerRow = showHojeHeader ? (
                        <tr key={`header-hoje-${comp.id}`} style={{ backgroundColor: "#f0fdf4" }}>
                          <td colSpan={isAdmin ? 8 : 7} style={{ textAlign: "center", padding: "10px", fontWeight: "bold", color: "#166534", borderTop: "2px solid #bbf7d0", borderBottom: "2px solid #bbf7d0", textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.85rem" }}>
                            Lançamentos de Hoje
                          </td>
                        </tr>
                      ) : showAnterioresHeader ? (
                        <tr key={`header-ant-${comp.id}`} style={{ backgroundColor: "#f8fafc" }}>
                          <td colSpan={isAdmin ? 8 : 7} style={{ textAlign: "center", padding: "10px", fontWeight: "bold", color: "#64748b", borderTop: "2px solid #e2e8f0", borderBottom: "2px solid #e2e8f0", textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.85rem" }}>
                            Lançamentos Anteriores
                          </td>
                        </tr>
                      ) : null;

                      let contentRow;
                      if (isEditing) {
                        contentRow = (
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
                            {isAdmin && (
                              <td style={{ textAlign: "center", color: "var(--text-dark)", fontWeight: "bold" }}>
                                -
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
                        contentRow = (
                          <tr key={comp.id} className={comp.id === newlyAddedId ? "new-row-animation" : ""} style={comp.status_revisao === 'pending_delete' ? { backgroundColor: "#fecaca" } : comp.status_revisao === 'pending_user' ? { backgroundColor: "#fee2e2" } : comp.status_revisao === 'pending_admin' ? { backgroundColor: "#ffedd5" } : (isDuplicate ? { backgroundColor: "#fef08a" } : {})}>
                            <td style={{ fontWeight: 600, opacity: comp.status_revisao === 'pending_delete' ? 0.6 : 1 }}>
                              {comp.cadastro_insumos?.nome || "Insumo Excluído"}
                              {comp.status_revisao === 'pending_delete' && (
                                <span style={{ marginLeft: "8px", fontSize: "0.75rem", backgroundColor: "#ef4444", color: "white", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase" }}>Deletado</span>
                              )}
                              {(new Date().getTime() - new Date(comp.created_at).getTime() < 5 * 60 * 1000) && comp.status_revisao !== 'pending_delete' && (
                                <span style={{ marginLeft: "8px", fontSize: "0.75rem", backgroundColor: "#10b981", color: "white", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase" }}>Novo</span>
                              )}
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
                            {isAdmin && (
                              <td style={{ textAlign: "center" }}>
                                <div 
                                  title={comp.created_at ? `Registrado em: ${new Date(comp.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às')}` : "Data de registro não disponível"}
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
                                  {comp.profiles?.name || "-"}
                                </div>
                              </td>
                            )}
                            <td style={{ textAlign: "center" }}>
                              <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
                                {isAdmin && (!comp.status_revisao || comp.status_revisao === 'none') && (
                                  <button
                                    onClick={() => handleUpdateReviewStatus(comp.id, 'pending_user')}
                                    title="Marcar para Revisão"
                                    style={{ padding: "4px 8px", fontSize: "1.1rem", color: "#ef4444", backgroundColor: "transparent", border: "none", cursor: "pointer", display: "flex" }}
                                  >
                                    <Icons.BsExclamationCircleFill />
                                  </button>
                                )}
                                {comp.status_revisao === 'pending_user' && (
                                  <button
                                    onClick={() => {
                                      if (isAdmin) {
                                        handleUpdateReviewStatus(comp.id, 'none');
                                      } else {
                                        if (!comp.revisao_observacao) {
                                          alert("Por favor, faça a correção da linha antes de marcar como resolvido.");
                                          setEditingRowId(comp.id);
                                          setEditRowData({
                                            insumo_id: comp.insumo_id,
                                            data_compra: comp.data_compra,
                                            fornecedor: comp.fornecedor || "",
                                            quantidade_comprada: comp.quantidade_comprada,
                                            valor_unitario: comp.valor_unitario || ""
                                          });
                                        } else {
                                          handleUpdateReviewStatus(comp.id, 'pending_admin');
                                        }
                                      }
                                    }}
                                    title={isAdmin ? "Cancelar Revisão" : "Marcar como Resolvido (Enviar p/ Admin)"}
                                    style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#b91c1c", backgroundColor: "#fca5a5", border: "1px solid #b91c1c", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", margin: 0 }}
                                  >
                                    <Icons.BsCheckCircle /> {isAdmin ? "Cancelar" : "Resolvido"}
                                  </button>
                                )}
                                {comp.status_revisao === 'pending_admin' && (
                                  isAdmin ? (
                                    <div style={{ display: "flex", gap: "4px" }}>
                                      {comp.revisao_observacao && (
                                        <span title={comp.revisao_observacao} style={{ padding: "4px 4px", fontSize: "1.1rem", color: "#ea580c", cursor: "help", display: "flex", alignItems: "center" }}>
                                          <Icons.BsInfoCircleFill />
                                        </span>
                                      )}
                                      <button
                                        onClick={() => handleUpdateReviewStatus(comp.id, 'none')}
                                        title="Aprovar Correção"
                                        style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#166534", backgroundColor: "#dcfce7", border: "1px solid #166534", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", margin: 0 }}
                                      >
                                        <Icons.BsCheckAll />
                                      </button>
                                      <button
                                        onClick={() => handleUpdateReviewStatus(comp.id, 'pending_user')}
                                        title="Rejeitar Correção"
                                        style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#9a3412", backgroundColor: "#fed7aa", border: "1px solid #9a3412", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", margin: 0 }}
                                      >
                                        <Icons.BsArrowCounterclockwise />
                                      </button>
                                    </div>
                                  ) : (
                                    <span style={{ fontSize: "0.85rem", color: "#c2410c", backgroundColor: "#ffedd5", border: "1px solid #c2410c", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                                      <Icons.BsClockHistory /> Pendente
                                    </span>
                                  )
                                )}
                                {comp.status_revisao === 'pending_delete' && (
                                  isAdmin ? (
                                    <div style={{ display: "flex", gap: "4px" }}>
                                      <button
                                        onClick={() => handleDelete(comp.id)}
                                        title="Aprovar Exclusão"
                                        style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#166534", backgroundColor: "#dcfce7", border: "1px solid #166534", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", margin: 0 }}
                                      >
                                        <Icons.BsCheckAll /> Excluir
                                      </button>
                                      <button
                                        onClick={() => handleUpdateReviewStatus(comp.id, 'none')}
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
                                {comp.status_revisao !== 'pending_delete' && (
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
                                )}
                                {comp.status_revisao !== 'pending_delete' && (isAdmin || (!comp.status_revisao || comp.status_revisao === 'none')) && (
                                  <button
                                    onClick={() => handleDelete(comp.id)}
                                    className="delete-record-btn"
                                    title="Excluir"
                                    style={{ margin: 0, padding: "4px 8px", fontSize: "0.9rem" }}
                                  >
                                    <Icons.BsTrash />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <React.Fragment key={`frag-${comp.id}`}>
                          {headerRow}
                          {contentRow}
                        </React.Fragment>
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

      {showWizard && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10000,
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "40px", borderRadius: "16px",
            width: "90%", maxWidth: "650px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            maxHeight: "90vh", overflowY: "auto"
          }}>
            <style>{`
              .wizard-step-enter {
                animation: wizardFadeInSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
              }
              @keyframes wizardFadeInSlide {
                0% { opacity: 0; transform: translateX(20px); }
                100% { opacity: 1; transform: translateX(0); }
              }
            `}</style>

            {/* Stepper Visual */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px", position: "relative", width: "100%", maxWidth: "400px", margin: "0 auto 40px auto" }}>
              {/* Linha base */}
              <div style={{ position: "absolute", top: "20px", left: "25%", right: "25%", height: "3px", backgroundColor: "#e2e8f0", zIndex: 1 }}>
                {/* Linha preenchida animada */}
                <div style={{ height: "100%", backgroundColor: "var(--primary-color)", width: wizardStep === 2 ? "100%" : "0%", transition: "width 0.4s ease-in-out" }}></div>
              </div>

              {/* Passo 1 */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, flex: 1 }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center",
                  backgroundColor: wizardStep > 1 ? "#22c55e" : "var(--primary-color)", 
                  color: "white", 
                  fontWeight: "bold", fontSize: "1.6rem", transition: "all 0.3s ease",
                  boxShadow: "0 0 0 4px #fff"
                }}>
                  {wizardStep > 1 ? "✓" : "1"}
                </div>
                <span style={{ marginTop: "12px", fontSize: "1.3rem", fontWeight: "bold", color: wizardStep > 1 ? "#22c55e" : "var(--primary-color)" }}>1ª - Mercadoria</span>
              </div>

              {/* Passo 2 */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, flex: 1 }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center",
                  backgroundColor: "#e2e8f0", 
                  color: wizardStep === 2 ? "var(--primary-color)" : "#94a3b8", 
                  border: "none",
                  fontWeight: "bold", fontSize: "1.6rem", transition: "all 0.3s ease",
                  boxShadow: "0 0 0 4px #fff"
                }}>
                  2
                </div>
                <span style={{ marginTop: "12px", fontSize: "1.3rem", fontWeight: wizardStep === 2 ? "bold" : "normal", color: wizardStep === 2 ? "var(--primary-color)" : "#94a3b8", transition: "all 0.3s ease" }}>2ª - Estoque</span>
              </div>
            </div>

            <div key={`step-${wizardStep}`} className="wizard-step-enter">
              {wizardStep === 1 && (
                  <>
                    <h3 style={{ margin: "0 0 24px 0", color: "#334155", display: "flex", alignItems: "center", gap: "12px", fontSize: "2.2rem" }}>
                      <Icons.BsExclamationTriangleFill style={{ color: "#eab308" }} /> Lançamento Duplicado
                    </h3>
                    
                    <div style={{
                      backgroundColor: "#fef2f2", color: "#dc2626", padding: "16px 20px",
                      borderRadius: "12px", marginBottom: "24px", border: "2px solid #fecaca",
                      fontSize: "1.4rem", lineHeight: "1.5"
                    }}>
                      <strong style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <Icons.BsExclamationTriangleFill /> Atenção!
                      </strong>
                      Já existe um lançamento de entrada de mercadoria idêntico (mesmo insumo, data, quantidade e valor).
                    </div>

                    <p style={{ fontSize: "1.5rem", color: "#475569", marginBottom: "32px", lineHeight: "1.6" }}>
                      Tem certeza que deseja prosseguir para o próximo passo com este lançamento duplicado?
                    </p>

                    <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
                      <button 
                        onClick={() => setShowWizard(false)}
                        style={{
                          padding: "14px 24px",
                          backgroundColor: "#f1f5f9",
                          color: "#475569",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "1.4rem"
                        }}
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={() => setWizardStep(2)}
                        style={{
                          padding: "14px 24px",
                          backgroundColor: "#eab308",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "1.4rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        Prosseguir <Icons.BsArrowRight />
                      </button>
                    </div>
                  </>
              )}

              {wizardStep === 2 && (
                  <>
                    <h3 style={{ margin: "0 0 24px 0", color: "#334155", display: "flex", alignItems: "center", gap: "12px", fontSize: "2.2rem" }}>
                      <Icons.BsBoxSeam style={{ color: "var(--primary-color)" }} /> Lançamento de Estoque
                    </h3>
                    
                    {!wizardData.hasMercadoriaDuplicate && (
                      <div style={{ marginBottom: "24px" }}>
                        <div style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "1.3rem", fontWeight: "bold" }}>1ª - Mercadoria</div>
                        <div style={{
                          backgroundColor: "#f0fdf4", color: "#166534", padding: "16px 20px",
                          borderRadius: "12px", border: "2px solid #bbf7d0",
                          fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "10px"
                        }}>
                          <Icons.BsCheckCircleFill style={{ fontSize: "1.8rem" }} /> 
                          <span><strong>Verificação concluída:</strong> Nenhuma duplicata encontrada na entrada de mercadoria.</span>
                        </div>
                      </div>
                    )}

                    {wizardData.hasEstoqueDuplicate && (
                      <div style={{ marginBottom: "24px" }}>
                        <div style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "1.3rem", fontWeight: "bold" }}>2ª - Estoque</div>
                        <div style={{
                          backgroundColor: "#fef2f2", color: "#dc2626", padding: "16px 20px",
                          borderRadius: "12px", border: "2px solid #fecaca",
                          fontSize: "1.4rem", lineHeight: "1.5"
                        }}>
                          <strong style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                            <Icons.BsExclamationTriangleFill /> Atenção: Lançamento Duplicado no Estoque!
                          </strong>
                          Já existe um lançamento de estoque para este insumo na mesma data e com esta exata quantidade.
                        </div>
                      </div>
                    )}

                    <p style={{ color: "#64748b", marginBottom: "24px", lineHeight: "1.6", fontSize: "1.5rem" }}>
                      Deseja fazer automaticamente o lançamento de estoque deste insumo considerando que a origem foi <strong>'Compras'</strong>?
                    </p>

                    <div style={{ marginBottom: "32px" }}>
                      <label style={{ display: "block", fontSize: "1.5rem", color: "#64748b", marginBottom: "12px", fontWeight: "bold" }}>
                        Destino do Estoque
                      </label>
                      <select
                        value={stockDestino}
                        onChange={(e) => setStockDestino(e.target.value)}
                        style={{
                          width: "100%", padding: "16px", borderRadius: "10px", border: "2px solid #cbd5e1",
                          fontSize: "1.5rem", backgroundColor: "#f8fafc", color: "#334155", outline: "none"
                        }}
                      >
                        <option value="Estoque MH">Estoque MH</option>
                        <option value="Fábrica">Fábrica</option>
                        <option value="Loja Ahú">Loja Ahú</option>
                        <option value="Loja Alto XV">Loja Alto XV</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                      <button 
                        onClick={() => setShowWizard(false)}
                        style={{
                          padding: "14px 20px",
                          backgroundColor: "#f1f5f9",
                          color: "#475569",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "1.4rem"
                        }}
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={() => handleWizardConfirm(false)}
                        style={{
                          padding: "14px 20px",
                          backgroundColor: "#e2e8f0",
                          color: "#334155",
                          border: "2px solid #cbd5e1",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "1.4rem"
                        }}
                      >
                        Apenas Salvar Mercadoria
                      </button>
                      <button 
                        onClick={() => handleWizardConfirm(true)}
                        style={{
                          padding: "14px 20px",
                          backgroundColor: "var(--primary-color)",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "1.4rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <Icons.BsCheckCircleFill /> Salvar & Lançar Estoque
                      </button>
                    </div>
                  </>
              )}
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
