import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import supabase from "../services/supabase-client";

function PedidosFoodService() {
  const { isAdmin, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [pedidos, setCompras] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
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
  const [filterProdutoId, setFilterProdutoId] = useState<string | null>(searchParams.get('produto_id') || null);
  const [filterData, setFilterData] = useState(searchParams.get('data_pedido') || "");
  const [filterCliente, setFilterCliente] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'review' | 'deleted'>('all');
  const [filterCreatedToday, setFilterCreatedToday] = useState(false);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [pendingDeleteCount, setPendingDeleteCount] = useState(0);

  const isFirstRender = useRef(true);

  const [inputMode, setInputMode] = useState<'unit' | 'total'>('unit');
  const [valorTotalInput, setValorTotalInput] = useState("");
  const [profilesMap, setProfilesMap] = useState<{[key: string]: string}>({});
  const [focusedCell, setFocusedCell] = useState<string | null>(null);

  // New row state
  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [newRow, setNewRow] = useState({
    produto_id: "",
    data_pedido: getToday(),
    cliente: "",
    quantidade: "",
    valor_unitario: ""
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData(false, 0, filterProdutoId, filterData, filterCliente, filterStatus, filterCreatedToday);
      return;
    }
    setPage(0);
    fetchData(false, 0, filterProdutoId, filterData, filterCliente, filterStatus, filterCreatedToday);
  }, [filterProdutoId, filterData, filterCliente, filterStatus, filterCreatedToday]);

  useEffect(() => {
    async function checkPendingCounts() {
      try {
        let revQuery = supabase.from('pedidos_food_service').select('*', { count: 'exact', head: true });
        if (isAdmin) {
          revQuery = revQuery.in('status_revisao', ['pending_user', 'pending_admin']);
        } else {
          revQuery = revQuery.eq('status_revisao', 'pending_user');
        }
        
        const { count: revCount, error: revError } = await revQuery;
        if (!revError) setPendingReviewCount(revCount || 0);

        if (isAdmin) {
          const { count: delCount, error: delError } = await supabase
            .from('pedidos_food_service')
            .select('*', { count: 'exact', head: true })
            .eq('status_revisao', 'pending_delete');
          if (!delError) setPendingDeleteCount(delCount || 0);
        }
      } catch (err) {
        console.error("Erro ao checar revisões/deletes:", err);
      }
    }
    checkPendingCounts();
  }, [pedidos, isAdmin]);

  const fetchDataRef = useRef<any>(null);

  useEffect(() => {
    const channel = supabase.channel('realtime-pedidos_fs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pedidos_food_service' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNewlyAddedId(payload.new.id);
            setTimeout(() => {
              setNewlyAddedId(current => current === payload.new.id ? null : current);
            }, 3000);
          }
          if (fetchDataRef.current) {
            fetchDataRef.current(false, 0, undefined, undefined, undefined, undefined, undefined, true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchData(isLoadMore = false, overridePage: number | null = null, fProdutoId = filterProdutoId, fData = filterData, fCliente = filterCliente, fStatus = filterStatus, fCreatedToday = filterCreatedToday, isBackground = false) {
    fetchDataRef.current = fetchData;
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        if (!isBackground) setLoading(true);

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, name");
        if (!profilesError && profilesData) {
          const map: any = {};
          profilesData.forEach((p: any) => {
            map[p.id] = p.name;
          });
          setProfilesMap(map);
        }

        if (produtos.length === 0) {
          const { data: produtosData, error: produtosError } = await supabase
            .from("cadastro_produtos")
            .select("id, nome, ativo, preco_venda_food_service")
            .eq("is_sabor", true)
            .order("nome", { ascending: true });
            
          if (produtosError) throw produtosError;
          setProdutos(produtosData || []);
        }

        if (clientes.length === 0) {
          const { data: clientesData, error: clientesError } = await supabase
            .from("clientes_food_service")
            .select("id, nome, ativo")
            .eq("ativo", true)
            .eq("status", "Negócio Fechado")
            .order("nome", { ascending: true });
            
          if (clientesError) throw clientesError;
          setClientes(clientesData || []);
        }
      }

      const currentPage = overridePage !== null ? overridePage : (isLoadMore ? page : 0);
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("pedidos_food_service")
        .select(`
          id,
          data_pedido,
          cliente,
          quantidade,
          quantidade_produzida,
          data_entrega,
          valor_unitario,
          produto_id,
          created_at,
          updated_at,
          user_id,
          status_revisao,
          revisao_observacao,
          cadastro_produtos!inner(nome)
        `, { count: 'exact' });

      if (fProdutoId) query = query.eq('produto_id', fProdutoId);
      if (fData) query = query.eq('data_pedido', fData);
      if (fCliente) query = query.ilike('cliente', `%${fCliente}%`);
      
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

      let orderedQuery = query;
      if (fCreatedToday) {
        orderedQuery = orderedQuery.order("created_at", { ascending: false }).order("data_pedido", { ascending: false });
      } else {
        orderedQuery = orderedQuery.order("data_pedido", { ascending: false }).order("created_at", { ascending: false });
      }
      
      const { data: movData, count, error: movError } = await orderedQuery
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
         console.warn("A tabela pedidos_food_service não existe no Supabase.");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const handleSavePedido = async () => {
    if (!newRow.produto_id || !newRow.data_pedido || !newRow.quantidade || !newRow.valor_unitario) {
      alert("Por favor, preencha produto, data, quantidade e valor unitário.");
      return;
    }

    setSavingRow(true);

    try {
      const { data, error } = await supabase
        .from("pedidos_food_service")
        .insert([{
          produto_id: newRow.produto_id,
          data_pedido: newRow.data_pedido,
          cliente: newRow.cliente,
          quantidade: Number(newRow.quantidade),
          valor_unitario: Number(newRow.valor_unitario.toString().replace(",", ".")),
          user_id: user?.id
        }])
        .select(`
          id,
          data_pedido,
          cliente,
          quantidade,
          quantidade_produzida,
          data_entrega,
          valor_unitario,
          produto_id,
          created_at,
          updated_at,
          user_id,
          status_revisao,
          revisao_observacao,
          cadastro_produtos(nome)
        `)
        .single();

      if (error) throw error;

      setCompras(prev => {
        const updated = [data, ...prev];
        return updated.sort((a, b) => {
          const dateA = new Date(a.data_pedido).getTime();
          const dateB = new Date(b.data_pedido).getTime();
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

      setNewRow({
        ...newRow,
        produto_id: "",
        cliente: "",
        quantidade: "",
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
         alert("A tabela 'pedidos_food_service' ainda não foi criada no banco de dados.");
      } else {
         alert("Erro ao salvar a entrada de mercadoria: " + (err.message || JSON.stringify(err)));
      }
    } finally {
      setSavingRow(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editRowData.produto_id || !editRowData.data_pedido || !editRowData.quantidade) {
      alert("Por favor, preencha produto, data e quantidade.");
      return;
    }

    try {
      setSavingEdit(true);
      const originalRow = pedidos.find(c => c.id === editingRowId);
      let observacaoAdicional = "";
      let hasChanges = false;
      if (originalRow) {
        if (originalRow.produto_id !== editRowData.produto_id ||
            originalRow.data_pedido !== editRowData.data_pedido ||
            (originalRow.cliente || "") !== (editRowData.cliente || "") ||
            String(originalRow.quantidade) !== String(editRowData.quantidade) ||
            String(originalRow.quantidade_produzida || "") !== String(editRowData.quantidade_produzida || "") ||
            (originalRow.data_entrega || "") !== (editRowData.data_entrega || "") ||
            String(originalRow.valor_unitario) !== String(editRowData.valor_unitario)) {
          hasChanges = true;
        }
      }
      
      if (originalRow && originalRow.status_revisao === 'pending_user') {
        const diffs = [];
        if (originalRow.produto_id !== editRowData.produto_id) {
           const nomeAntigo = originalRow.cadastro_produtos?.nome || "Desconhecido";
           const nomeNovo = produtos.find(i => i.id === editRowData.produto_id)?.nome || "Desconhecido";
           diffs.push(`Produto: ${nomeAntigo} ➔ ${nomeNovo}`);
        }
        if (originalRow.data_pedido !== editRowData.data_pedido) diffs.push(`Data: ${originalRow.data_pedido} ➔ ${editRowData.data_pedido}`);
        if ((originalRow.cliente || "") !== (editRowData.cliente || "")) diffs.push(`Fornec: ${originalRow.cliente || "-"} ➔ ${editRowData.cliente || "-"}`);
        if (String(originalRow.quantidade) !== String(editRowData.quantidade)) diffs.push(`Qtd: ${originalRow.quantidade} ➔ ${editRowData.quantidade}`);
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
        produto_id: editRowData.produto_id,
        data_pedido: editRowData.data_pedido,
        cliente: editRowData.cliente,
        quantidade: parseFloat(editRowData.quantidade) || 0,
        quantidade_produzida: editRowData.quantidade_produzida ? parseFloat(editRowData.quantidade_produzida) : null,
        data_entrega: editRowData.data_entrega || null,
        valor_unitario: parseFloat(editRowData.valor_unitario) || null
      };

      if (hasChanges) {
        updateData.updated_at = new Date().toISOString();
      }

      if (originalRow && originalRow.status_revisao === 'pending_user') {
        updateData.revisao_observacao = observacaoAdicional;
        if (!isAdmin) {
          updateData.status_revisao = 'pending_admin';
        }
      }

      const { data, error } = await supabase
        .from("pedidos_food_service")
        .update(updateData)
        .eq("id", editingRowId)
        .select(`
          id,
          data_pedido,
          cliente,
          quantidade,
          quantidade_produzida,
          data_entrega,
          valor_unitario,
          produto_id,
          created_at,
          updated_at,
          user_id,
          status_revisao,
          revisao_observacao,
          cadastro_produtos!inner(nome)
        `)
        .single();

      if (error) throw error;

      setCompras(pedidos.map(c => c.id === editingRowId ? data : c));
      setEditingRowId(null);
    } catch (err: any) {
      console.error("Erro ao atualizar:", err);
      alert("Erro ao atualizar o registro: " + (err.message || JSON.stringify(err)));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleFastUpdate = async (id: string, field: string, value: any) => {
    try {
      const { data, error } = await supabase
        .from("pedidos_food_service")
        .update({ [field]: value })
        .eq("id", id)
        .select(`
          id,
          data_pedido,
          cliente,
          quantidade,
          quantidade_produzida,
          data_entrega,
          valor_unitario,
          produto_id,
          created_at,
          updated_at,
          user_id,
          status_revisao,
          revisao_observacao,
          cadastro_produtos!inner(nome)
        `)
        .single();
      if (error) throw error;
      setCompras(prev => prev.map(c => c.id === id ? data : c));
    } catch (err) {
      console.error("Erro ao atualizar campo rapidamente:", err);
      alert("Erro ao salvar o campo.");
    }
  };



  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir esta entrada de mercadoria?")) return;
    try {
      if (isAdmin) {
        const { error } = await supabase
          .from("pedidos_food_service")
          .delete()
          .eq("id", id);
        if (error) throw error;
        setCompras(pedidos.filter(m => m.id !== id));
      } else {
        const { error } = await supabase
          .from("pedidos_food_service")
          .update({ status_revisao: 'pending_delete' })
          .eq("id", id);
        if (error) throw error;
        if (filterStatus !== 'deleted') {
          setCompras(pedidos.filter(m => m.id !== id));
        } else {
          setCompras(pedidos.map(c => c.id === id ? { ...c, status_revisao: 'pending_delete' } : c));
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
        .from("pedidos_food_service")
        .update(updateData)
        .eq("id", id);
      
      if (error) throw error;
      setCompras(pedidos.map(c => c.id === id ? { ...c, ...updateData } : c));
    } catch (err) {
      console.error("Erro ao alterar status de revisão:", err);
      alert("Erro ao alterar o status de revisão da linha.");
    }
  };

  const handleProdutoSelect = (selectedOption: any) => {
    if (selectedOption) {
       const produto = produtos.find(i => i.id === selectedOption.value);
       setNewRow({ 
         ...newRow, 
         produto_id: selectedOption.value,
         cliente: newRow.cliente,
         valor_unitario: produto?.preco_venda_food_service ? String(produto.preco_venda_food_service) : ""
       });
    } else {
       setNewRow({ ...newRow, produto_id: "", valor_unitario: "" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Pedidos Food Service</title>
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
            <h1>Pedidos Food Service</h1>
            <p>Registre as pedidos de produtos. Isso atualizará automaticamente o Custo Atualizado do produto.</p>
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
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Produto</label>
                <Select
                  ref={selectRef}
                  autoFocus
                  menuPortalTarget={document.body}
                  maxMenuHeight={350}
                  options={produtos.filter(ins => ins.ativo !== false).map(ins => ({ value: ins.id, label: ins.nome }))}
                  value={newRow.produto_id ? { value: newRow.produto_id, label: produtos.find(i => i.id === newRow.produto_id)?.nome } : null}
                  onChange={handleProdutoSelect}
                  placeholder="Buscar Produto..."
                  isClearable
                  noOptionsMessage={() => "Nenhum produto encontrado"}
                  styles={{
                    control: (base) => ({ ...base, borderColor: '#cbd5e1', minHeight: '54px', borderRadius: '4px', fontSize: '1.4rem' }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: '1.4rem' })
                  }}
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Data do Pedido</label>
                <input
                  type="date"
                  value={newRow.data_pedido}
                  onChange={(e) => setNewRow({ ...newRow, data_pedido: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "54px", fontSize: "1.4rem" }}
                />
              </div>
              <div style={{ flex: "1.5 1 150px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Cliente</label>
                <Select
                  menuPortalTarget={document.body}
                  maxMenuHeight={350}
                  options={clientes.filter(f => f.ativo !== false).map(f => ({ value: f.nome, label: f.nome }))}
                  value={newRow.cliente ? { value: newRow.cliente, label: newRow.cliente } : null}
                  onChange={(selectedOption: any) => setNewRow({ ...newRow, cliente: selectedOption ? selectedOption.value : "" })}
                  placeholder="Selecione..."
                  isClearable
                  noOptionsMessage={() => "Nenhum cliente"}
                  styles={{
                    control: (base) => ({ ...base, borderColor: '#cbd5e1', minHeight: '54px', borderRadius: '4px', fontSize: '1.4rem' }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: '1.4rem' })
                  }}
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Qtd (Litros)</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={newRow.quantidade}
                    onChange={(e) => {
                      const q = e.target.value;
                      setNewRow({ ...newRow, quantidade: q });
                    }}
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    style={{ width: "100%", padding: "8px 36px 8px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "54px", fontSize: "1.4rem" }}
                  />
                  <span style={{ position: "absolute", right: "12px", color: "#94a3b8", zIndex: 1, pointerEvents: "none", fontSize: "1.2rem", fontWeight: "bold" }}>L</span>
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
                  onClick={handleSavePedido}
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
                  <th style={{ width: "250px" }}>Produto</th>
                  <th style={{ textAlign: "center", width: "130px" }}>Data do Pedido</th>
                  <th style={{ textAlign: "center", width: "200px" }}>Cliente</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Qtd (L)</th>
                  <th style={{ textAlign: "center", width: "130px" }}>Qtd Prod. (kg)</th>
                  <th style={{ textAlign: "center", width: "130px" }}>Data Entrega</th>
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
                      options={produtos.map(ins => ({ value: ins.id, label: ins.nome }))}
                      value={filterProdutoId ? { value: filterProdutoId, label: produtos.find(i => i.id === filterProdutoId)?.nome } : null}
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
                  <th style={{ padding: "8px" }}>
                    <input
                      type="text"
                      placeholder="Cliente..."
                      value={filterCliente}
                      onChange={(e) => setFilterCliente(e.target.value)}
                      style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.1rem" }}
                    />
                  </th>
                  <th colSpan={isAdmin ? 7 : 6} style={{ padding: "8px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "nowrap" }}>
                      <button
                        onClick={() => setFilterCreatedToday(!filterCreatedToday)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: filterCreatedToday ? "var(--primary-color)" : "#fff",
                          color: filterCreatedToday ? "#fff" : "#64748b",
                          border: `1px solid ${filterCreatedToday ? "var(--primary-color)" : "#e2e8f0"}`,
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: filterCreatedToday ? "bold" : "normal",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.85rem",
                          transition: "0.2s"
                        }}
                        title="Alternar ordenação (Data do Pedido x Data de Criação)"
                      >
                        <Icons.BsSortDown /> {filterCreatedToday ? "Ordem: Criação" : "Ordem: Compra"}
                      </button>
                      <button
                        onClick={() => {
                          const newStatus = filterStatus === 'review' ? 'all' : 'review';
                          setFilterStatus(newStatus);
                          if (newStatus === 'review') {
                            setFilterProdutoId(null);
                            setFilterData("");
                            setFilterCliente("");
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
                              setFilterProdutoId(null);
                              setFilterData("");
                              setFilterCliente("");
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
                          setFilterProdutoId(null);
                          setFilterData("");
                          setFilterCliente("");
                          setFilterStatus('all');
                          setFilterCreatedToday(false);
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
                    <td colSpan={isAdmin ? 10 : 9} style={{ textAlign: "center", padding: "40px" }}>
                      <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                    </td>
                  </tr>
                ) : pedidos.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 10 : 9} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      Nenhuma entrada registrada.
                    </td>
                  </tr>
                ) : (
                  (() => {
                    const duplicatesMap: Record<string, number> = {};
                    pedidos.forEach(c => {
                      const key = `${c.produto_id}_${c.data_pedido}_${c.cliente}_${c.quantidade}`;
                      duplicatesMap[key] = (duplicatesMap[key] || 0) + 1;
                    });
                    
                    return pedidos.map((comp, index) => {
                      const dataFormatada = new Date(comp.data_pedido + 'T00:00:00').toLocaleDateString('pt-BR');
                      const total = (parseFloat(comp.quantidade_produzida) || 0) * (comp.valor_unitario || 0);
                      
                      const key = `${comp.produto_id}_${comp.data_pedido}_${comp.cliente}_${comp.quantidade}`;
                      const isDuplicate = duplicatesMap[key] > 1;
                      const isEditing = editingRowId === comp.id;

                      const isPendenteProducao = !comp.quantidade_produzida && !comp.data_entrega;
                      const isPendenteEntrega = comp.quantidade_produzida && !comp.data_entrega;
                      const isEntregue = comp.quantidade_produzida && comp.data_entrega;

                      let rowBg = "";
                      if (comp.status_revisao === 'pending_delete') rowBg = "#fecaca";
                      else if (comp.status_revisao === 'pending_user') rowBg = "#fee2e2";
                      else if (comp.status_revisao === 'pending_admin') rowBg = "#ffedd5";
                      else if (isDuplicate) rowBg = "#fef08a";
                      else if (isEntregue) rowBg = "#f0fdf4";
                      else if (isPendenteEntrega) rowBg = "#fefce8";
                      else rowBg = "#fef2f2";

                      const leftBorder = isEntregue ? "4px solid #22c55e" : isPendenteEntrega ? "4px solid #eab308" : "4px solid #ef4444";

                      const diffMin = comp.created_at ? (new Date().getTime() - new Date(comp.created_at).getTime()) / (1000 * 60) : -1;
                      const isRowNew = diffMin >= 0 && diffMin < 60; // 1 hora
                      const diffEditMin = comp.updated_at ? (new Date().getTime() - new Date(comp.updated_at).getTime()) / (1000 * 60) : -1;
                      const isRowEdited = comp.updated_at && comp.updated_at !== comp.created_at && diffEditMin >= 0 && diffEditMin < 60; // 1 hora

                      const isToday = comp.data_pedido === getToday();
                      const prevComp = index > 0 ? pedidos[index - 1] : null;
                      const prevIsToday = prevComp ? prevComp.data_pedido === getToday() : false;
                      
                      const showHojeHeader = !filterCreatedToday && isToday && index === 0;
                      const showAnterioresHeader = !filterCreatedToday && !isToday && (index === 0 || prevIsToday);

                      const headerRow = showHojeHeader ? (
                        <tr key={`header-hoje-${comp.id}`} style={{ backgroundColor: "#f0fdf4" }}>
                          <td colSpan={isAdmin ? 10 : 9} style={{ textAlign: "center", padding: "10px", fontWeight: "bold", color: "#166534", borderTop: "2px solid #bbf7d0", borderBottom: "2px solid #bbf7d0", textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.85rem" }}>
                            Lançamentos de Hoje
                          </td>
                        </tr>
                      ) : showAnterioresHeader ? (
                        <tr key={`header-ant-${comp.id}`} style={{ backgroundColor: "#f8fafc" }}>
                          <td colSpan={isAdmin ? 10 : 9} style={{ textAlign: "center", padding: "10px", fontWeight: "bold", color: "#64748b", borderTop: "2px solid #e2e8f0", borderBottom: "2px solid #e2e8f0", textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.85rem" }}>
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
                                options={produtos.filter(ins => ins.ativo !== false || ins.id === editRowData.produto_id).map(ins => ({ value: ins.id, label: ins.nome }))}
                                value={editRowData.produto_id ? { value: editRowData.produto_id, label: produtos.find(i => i.id === editRowData.produto_id)?.nome } : null}
                                onChange={(sel) => setEditRowData({ ...editRowData, produto_id: sel ? sel.value : "" })}
                                styles={{
                                  control: (base) => ({ ...base, minHeight: '38px', fontSize: '1.1rem' }),
                                  menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: '1.1rem' })
                                }}
                              />
                            </td>
                            <td style={{ padding: "8px" }}>
                              <input
                                type="date"
                                value={editRowData.data_pedido}
                                onChange={(e) => setEditRowData({ ...editRowData, data_pedido: e.target.value })}
                                style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                              />
                            </td>
                            <td style={{ padding: "8px" }}>
                              <Select
                                menuPortalTarget={document.body}
                                maxMenuHeight={250}
                                options={clientes.filter(f => f.ativo !== false || f.nome === editRowData.cliente).map(f => ({ value: f.nome, label: f.nome }))}
                                value={editRowData.cliente ? { value: editRowData.cliente, label: editRowData.cliente } : null}
                                onChange={(sel: any) => setEditRowData({ ...editRowData, cliente: sel ? sel.value : "" })}
                                isClearable
                                placeholder="Selecione..."
                                styles={{
                                  control: (base) => ({ ...base, minHeight: '38px', fontSize: '1.1rem' }),
                                  menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: '1.1rem' })
                                }}
                              />
                            </td>
                            <td style={{ padding: "8px" }}>
                              <input
                                type="number"
                                step="any"
                                value={editRowData.quantidade}
                                onChange={(e) => setEditRowData({ ...editRowData, quantidade: e.target.value })}
                                style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px", textAlign: "center" }}
                              />
                            </td>
                            <td style={{ padding: "8px" }}>
                              <input
                                type="number"
                                step="any"
                                value={editRowData.quantidade_produzida || ""}
                                onChange={(e) => setEditRowData({ ...editRowData, quantidade_produzida: e.target.value })}
                                style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px", textAlign: "center" }}
                                placeholder="kg"
                              />
                            </td>
                            <td style={{ padding: "8px" }}>
                              <input
                                type="date"
                                value={editRowData.data_entrega || ""}
                                onChange={(e) => setEditRowData({ ...editRowData, data_entrega: e.target.value })}
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
                          <tr key={comp.id} className={comp.id === newlyAddedId ? "new-row-animation" : ""} style={{ backgroundColor: rowBg }}>
                            <td style={{ fontWeight: 600, opacity: comp.status_revisao === 'pending_delete' ? 0.6 : 1, borderLeft: leftBorder }}>
                              {comp.cadastro_produtos?.nome || "Produto Excluído"}
                              {comp.status_revisao === 'pending_delete' && (
                                <span style={{ marginLeft: "8px", fontSize: "0.75rem", backgroundColor: "#ef4444", color: "white", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase" }}>Deletado</span>
                              )}
                              {isRowNew && comp.status_revisao !== 'pending_delete' && (
                                <span style={{
                                  marginLeft: "8px",
                                  backgroundColor: "#10b981",
                                  color: "#ffffff",
                                  fontSize: "0.75rem",
                                  fontWeight: "bold",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  textTransform: "uppercase",
                                  lineHeight: "1.1",
                                  display: "inline-block",
                                  letterSpacing: "0.03em"
                                }}>
                                  Novo
                                </span>
                              )}
                              {isRowEdited && comp.status_revisao !== 'pending_delete' && (
                                <span style={{
                                  marginLeft: "8px",
                                  backgroundColor: "#f97316",
                                  color: "#ffffff",
                                  fontSize: "0.75rem",
                                  fontWeight: "bold",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  textTransform: "uppercase",
                                  lineHeight: "1.1",
                                  display: "inline-block",
                                  letterSpacing: "0.03em"
                                }}>
                                  Editado
                                </span>
                              )}
                              {isDuplicate && (
                                <span title="Atenção: Possível lançamento duplicado (mesmo produto, data, cliente e qtd)" style={{ marginLeft: "8px", color: "#b45309", cursor: "help" }}>
                                  <Icons.BsExclamationTriangleFill />
                                </span>
                              )}
                              {isPendenteProducao && (
                                <span style={{ marginLeft: "8px", backgroundColor: "#ef4444", color: "#ffffff", fontSize: "0.70rem", fontWeight: "bold", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase", display: "inline-block" }}>Pendente Prod.</span>
                              )}
                              {isPendenteEntrega && (
                                <span style={{ marginLeft: "8px", backgroundColor: "#eab308", color: "#ffffff", fontSize: "0.70rem", fontWeight: "bold", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase", display: "inline-block" }}>Aguardando Entrega</span>
                              )}
                              {isEntregue && (
                                <span style={{ marginLeft: "8px", backgroundColor: "#22c55e", color: "#ffffff", fontSize: "0.70rem", fontWeight: "bold", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase", display: "inline-block" }}>Entregue</span>
                              )}
                            </td>
                            <td style={{ textAlign: "center" }}>{dataFormatada}</td>
                            <td style={{ textAlign: "center" }}>{comp.cliente || "-"}</td>
                            <td style={{ textAlign: "center", fontWeight: "bold" }}>{comp.quantidade}</td>
                            <td style={{ padding: "4px" }}>
                              {comp.quantidade_produzida && focusedCell !== `${comp.id}_qp` ? (
                                <div style={{ textAlign: "center", padding: "6px", color: "var(--text-dark)" }}>{comp.quantidade_produzida} kg</div>
                              ) : (
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                  <input
                                    type="number"
                                    step="any"
                                    value={comp.quantidade_produzida || ""}
                                    onFocus={() => setFocusedCell(`${comp.id}_qp`)}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setCompras(pedidos.map(c => c.id === comp.id ? { ...c, quantidade_produzida: val } : c));
                                    }}
                                    onBlur={(e) => {
                                      setFocusedCell(null);
                                      const val = e.target.value;
                                      handleFastUpdate(comp.id, "quantidade_produzida", val ? parseFloat(val) : null);
                                    }}
                                    style={{ width: "100%", padding: "4px 24px 4px 4px", fontSize: "1rem", border: "1px solid #e2e8f0", borderRadius: "4px", textAlign: "center", backgroundColor: "#f8fafc", transition: "0.2s" }}
                                    placeholder="0"
                                  />
                                  <span style={{ position: "absolute", right: "6px", color: "#94a3b8", pointerEvents: "none", fontSize: "0.85rem", fontWeight: "bold" }}>kg</span>
                                </div>
                              )}
                            </td>
                            <td style={{ padding: "4px" }}>
                              {comp.data_entrega && focusedCell !== `${comp.id}_de` ? (
                                <div style={{ textAlign: "center", padding: "6px", color: "var(--text-dark)" }}>{new Date(comp.data_entrega + 'T00:00:00').toLocaleDateString('pt-BR')}</div>
                              ) : (
                                <input
                                  type="date"
                                  value={comp.data_entrega || ""}
                                  onFocus={() => setFocusedCell(`${comp.id}_de`)}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCompras(pedidos.map(c => c.id === comp.id ? { ...c, data_entrega: val } : c));
                                  }}
                                  onBlur={(e) => {
                                    setFocusedCell(null);
                                    const val = e.target.value;
                                    handleFastUpdate(comp.id, "data_entrega", val || null);
                                  }}
                                  style={{ width: "100%", padding: "4px", fontSize: "1rem", border: "1px solid #e2e8f0", borderRadius: "4px", textAlign: "center", backgroundColor: "#f8fafc", transition: "0.2s" }}
                                />
                              )}
                            </td>
                            <td style={{ textAlign: "center", color: "var(--text-dark)" }}>
                              {comp.valor_unitario ? `R$ ${comp.valor_unitario.toFixed(2)}` : "-"}
                            </td>
                            <td style={{ textAlign: "center", fontWeight: "bold", color: "var(--primary-color)" }}>
                              {total ? `R$ ${total.toFixed(2)}` : "-"}
                            </td>
                            {isAdmin && (
                              <td style={{ textAlign: "center" }}>
                                <span 
                                  title={comp.created_at ? new Date(comp.created_at).toLocaleString("pt-BR") : ""}
                                  style={{
                                    background: "#f1f5f9",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "8px",
                                    padding: "4px 12px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontSize: "1.2rem",
                                    color: "#334155",
                                    cursor: "pointer"
                                  }}
                                >
                                  <Icons.BsPerson style={{ fontSize: "1.4rem", color: "#64748b" }} />
                                  {profilesMap[comp.user_id] || "-"}
                                </span>
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
                                            produto_id: comp.produto_id,
                                            data_pedido: comp.data_pedido,
                                            cliente: comp.cliente || "",
                                            quantidade: comp.quantidade,
                                            quantidade_produzida: comp.quantidade_produzida || "",
                                            data_entrega: comp.data_entrega || "",
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
                                        produto_id: comp.produto_id,
                                        data_pedido: comp.data_pedido,
                                        cliente: comp.cliente || "",
                                        quantidade: comp.quantidade,
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
                Mostrando <strong>{pedidos.length}</strong> de <strong>{totalCount}</strong> totais
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

export default PedidosFoodService;
