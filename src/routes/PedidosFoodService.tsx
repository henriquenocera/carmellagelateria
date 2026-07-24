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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [qtyInput, setQtyInput] = useState("");
  const [filterCodigoPedido, setFilterCodigoPedido] = useState("");
  const [filterStatusPedido, setFilterStatusPedido] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  
  const toggleOrderExpand = (code: string) => {
    setExpandedOrders(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };
  
  // Split state
  const [shouldSplit, setShouldSplit] = useState(false);
  const [numTubs, setNumTubs] = useState(2);
  const [tubQtys, setTubQtys] = useState<string[]>(["", ""]);
  
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

  const groupedOrders = React.useMemo(() => {
    if (!pedidos || !Array.isArray(pedidos)) {
      console.warn("pedidos is not an array:", pedidos);
      return [];
    }

    const groups: Record<string, any[]> = {};
    pedidos.forEach(p => {
      if (!p) return;
      const code = p.codigo_pedido || `Ordem-${p.id}`;
      if (!groups[code]) {
        groups[code] = [];
      }
      groups[code].push(p);
    });

    const orderedCodes: string[] = [];
    pedidos.forEach(p => {
      if (!p) return;
      const code = p.codigo_pedido || `Ordem-${p.id}`;
      if (!orderedCodes.includes(code)) {
        orderedCodes.push(code);
      }
    });

    const result = orderedCodes.map(code => {
      const items = groups[code] || [];
      if (items.length === 0) return null;
      return {
        codigo_pedido: code,
        items,
        id: items[0]?.id || 0,
        data_pedido: items[0]?.data_pedido || "",
        cliente: items[0]?.cliente || "",
        user_id: items[0]?.user_id || "",
        created_at: items[0]?.created_at || "",
        status_revisao: items[0]?.status_revisao || "none"
      };
    }).filter((item): item is any => item !== null);

    return result;
  }, [pedidos]);

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
      fetchData(false, 0, filterProdutoId, filterData, filterCliente, filterStatus, filterCreatedToday, false, filterCodigoPedido, filterStatusPedido);
      return;
    }
    setPage(0);
    fetchData(false, 0, filterProdutoId, filterData, filterCliente, filterStatus, filterCreatedToday, false, filterCodigoPedido, filterStatusPedido);
  }, [filterProdutoId, filterData, filterCliente, filterStatus, filterCreatedToday, filterCodigoPedido, filterStatusPedido]);

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

  async function fetchData(isLoadMore = false, overridePage: number | null = null, fProdutoId = filterProdutoId, fData = filterData, fCliente = filterCliente, fStatus = filterStatus, fCreatedToday = filterCreatedToday, isBackground = false, fCodigoPedido = filterCodigoPedido, fStatusPedido = filterStatusPedido) {
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
          codigo_pedido,
          cadastro_produtos!inner(nome)
        `, { count: 'exact' });

      if (fProdutoId) query = query.eq('produto_id', fProdutoId);
      if (fData) query = query.eq('data_pedido', fData);
      if (fCliente) query = query.ilike('cliente', `%${fCliente}%`);
      if (fCodigoPedido) query = query.ilike('codigo_pedido', `%${fCodigoPedido}%`);
      
      if (fStatusPedido === "pendente_prod") {
        query = query.is('quantidade_produzida', null).is('data_entrega', null);
      } else if (fStatusPedido === "aguardando_entrega") {
        query = query.not('quantidade_produzida', 'is', null).is('data_entrega', null);
      } else if (fStatusPedido === "entregue") {
        query = query.not('quantidade_produzida', 'is', null).not('data_entrega', 'is', null);
      }
      
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
    if (!newRow.data_pedido || !newRow.cliente) {
      alert("Por favor, preencha a data do pedido e selecione o cliente.");
      return;
    }

    if (orderItems.length === 0) {
      alert("Adicione pelo menos um produto ao pedido.");
      return;
    }

    setSavingRow(true);

    try {
      const date = new Date(newRow.data_pedido + "T12:00:00");
      const yy = String(date.getFullYear()).slice(-2);
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const rand = Math.floor(100 + Math.random() * 900);
      const generatedCode = `FS-${mm}/${yy}-${rand}`;

      const payload = orderItems.map(item => ({
        produto_id: item.produto_id,
        data_pedido: newRow.data_pedido,
        cliente: newRow.cliente,
        quantidade: Number(item.quantidade),
        valor_unitario: Number(item.valor_unitario),
        codigo_pedido: generatedCode,
        user_id: user?.id
      }));

      const { data, error } = await supabase
        .from("pedidos_food_service")
        .insert(payload)
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
          codigo_pedido,
          cadastro_produtos(nome)
        `);

      if (error) throw error;

      const insertedRows = data || [];

      setCompras(prev => {
        const updated = [...insertedRows, ...prev];
        return updated.sort((a, b) => {
          const dateA = new Date(a.data_pedido).getTime();
          const dateB = new Date(b.data_pedido).getTime();
          if (dateB !== dateA) return dateB - dateA;
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        });
      });
      
      if (insertedRows.length > 0) {
        setNewlyAddedId(insertedRows[0].id);
        setTimeout(() => {
          setNewlyAddedId(null);
        }, 5500);
      }
      
      setIsModalOpen(false);
      setOrderItems([]);
      setNewRow({
        ...newRow,
        produto_id: "",
        cliente: "",
        quantidade: "",
        valor_unitario: ""
      });

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

  const handleDeleteOrder = async (codigoPedido: string, items: any[]) => {
    if (!window.confirm(`Deseja realmente excluir todo o pedido ${codigoPedido}?`)) return;
    try {
      const ids = items.map(i => i.id);
      if (isAdmin) {
        const { error } = await supabase
          .from("pedidos_food_service")
          .delete()
          .in("id", ids);
        if (error) throw error;
        setCompras(pedidos.filter(m => !ids.includes(m.id)));
      } else {
        const { error } = await supabase
          .from("pedidos_food_service")
          .update({ status_revisao: 'pending_delete' })
          .in("id", ids);
        if (error) throw error;
        if (filterStatus !== 'deleted') {
          setCompras(pedidos.filter(m => !ids.includes(m.id)));
        } else {
          setCompras(pedidos.map(c => ids.includes(c.id) ? { ...c, status_revisao: 'pending_delete' } : c));
        }
      }
    } catch (err) {
      console.error("Erro ao deletar pedido:", err);
      alert("Erro ao excluir o pedido.");
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
        <div className="frequencia-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="frequencia-title-group">
            <h1>Pedidos Food Service</h1>
            <p>Registre os pedidos de produtos. Isso atualizará automaticamente o Custo Atualizado do produto.</p>
          </div>
          <button 
            className="primary-btn" 
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "var(--primary-color)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "1.3rem",
              transition: "background-color 0.2s"
            }}
          >
            <Icons.BsPlusLg />
            Novo Pedido
          </button>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          
          {isModalOpen && (
            <div 
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
                padding: "20px",
                boxSizing: "border-box"
              }}
              onClick={() => {
                setIsModalOpen(false);
                setOrderItems([]);
              }}
            >
              <div 
                style={{
                  backgroundColor: "#fff",
                  padding: "30px",
                  borderRadius: "16px",
                  width: "100%",
                  maxWidth: "700px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  position: "relative",
                  textAlign: "left",
                  maxHeight: "90vh",
                  overflowY: "auto"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
                  <h2 style={{ margin: 0, color: "#334155", fontSize: "1.8rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Icons.BsPlusCircleFill style={{ color: "var(--primary-color)" }} />
                    Novo Pedido Food Service
                  </h2>
                  <button 
                    onClick={() => {
                      setIsModalOpen(false);
                      setOrderItems([]);
                    }} 
                    style={{ background: "none", border: "none", fontSize: "2rem", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", padding: 0 }}
                  >
                    <Icons.BsX />
                  </button>
                </div>

                {/* Form Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* General order fields */}
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 200px" }}>
                      <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "6px", fontWeight: "bold" }}>Cliente *</label>
                      <Select
                        menuPortalTarget={document.body}
                        maxMenuHeight={250}
                        options={clientes.filter(f => f.ativo !== false).map(f => ({ value: f.nome, label: f.nome }))}
                        value={newRow.cliente ? { value: newRow.cliente, label: newRow.cliente } : null}
                        onChange={(selectedOption: any) => setNewRow({ ...newRow, cliente: selectedOption ? selectedOption.value : "" })}
                        placeholder="Selecione o Cliente..."
                        isClearable
                        noOptionsMessage={() => "Nenhum cliente"}
                        styles={{
                          control: (base) => ({ ...base, borderColor: '#cbd5e1', minHeight: '44px', borderRadius: '8px', fontSize: '1.3rem' }),
                          menuPortal: (base) => ({ ...base, zIndex: 10000, fontSize: '1.3rem' })
                        }}
                      />
                    </div>

                    <div style={{ flex: "1 1 200px" }}>
                      <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "6px", fontWeight: "bold" }}>Data do Pedido *</label>
                      <input
                        type="date"
                        value={newRow.data_pedido}
                        onChange={(e) => setNewRow({ ...newRow, data_pedido: e.target.value })}
                        style={{ width: "100%", padding: "0 12px", borderRadius: "8px", border: "1px solid #cbd5e1", height: "44px", fontSize: "1.3rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Section to add products to order */}
                  <div style={{
                    border: "1px dashed #cbd5e1",
                    borderRadius: "12px",
                    padding: "20px",
                    backgroundColor: "#f8fafc"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#475569", fontSize: "1.4rem", fontWeight: "bold" }}>Adicionar Gelato ao Pedido</h4>
                    
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
                      <div style={{ flex: "2 1 200px" }}>
                        <label style={{ display: "block", fontSize: "1.2rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Sabor de Gelato</label>
                        <Select
                          menuPortalTarget={document.body}
                          maxMenuHeight={200}
                          options={produtos.filter(ins => ins.ativo !== false).map(ins => ({ value: ins.id, label: ins.nome }))}
                          value={selectedProductId ? { value: selectedProductId, label: produtos.find(i => i.id === selectedProductId)?.nome } : null}
                          onChange={(option: any) => setSelectedProductId(option ? option.value : "")}
                          placeholder="Buscar Gelato..."
                          isClearable
                          noOptionsMessage={() => "Nenhum sabor encontrado"}
                          styles={{
                            control: (base) => ({ ...base, borderColor: '#cbd5e1', minHeight: '40px', borderRadius: '6px', fontSize: '1.25rem' }),
                            menuPortal: (base) => ({ ...base, zIndex: 10000, fontSize: '1.25rem' })
                          }}
                        />
                      </div>

                      <div style={{ flex: "1 1 100px" }}>
                        <label style={{ display: "block", fontSize: "1.2rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Qtd (Litros)</label>
                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                          <input
                            type="number"
                            step="any"
                            placeholder="0"
                            value={qtyInput}
                            onChange={(e) => {
                              const q = e.target.value;
                              setQtyInput(q);
                              if (shouldSplit) {
                                const total = parseFloat(q) || 0;
                                const share = (total / numTubs).toFixed(1);
                                setTubQtys(Array(numTubs).fill(share));
                              }
                            }}
                            onKeyDown={(e) => {
                              if (['e', 'E', '+', '-'].includes(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            style={{ width: "100%", padding: "0 28px 0 10px", borderRadius: "6px", border: "1px solid #cbd5e1", height: "40px", fontSize: "1.25rem", boxSizing: "border-box" }}
                          />
                          <span style={{ position: "absolute", right: "10px", color: "#94a3b8", zIndex: 1, pointerEvents: "none", fontSize: "1.1rem", fontWeight: "bold" }}>L</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedProductId || !qtyInput || parseFloat(qtyInput) <= 0) {
                            alert("Por favor, selecione um gelato e defina uma quantidade válida.");
                            return;
                          }
                          const prod = produtos.find(p => p.id === selectedProductId);
                          if (!prod) return;

                          if (orderItems.some(item => item.produto_id === selectedProductId)) {
                            alert("Este sabor já foi adicionado ao pedido. Caso queira alterar a quantidade, remova e adicione novamente.");
                            return;
                          }

                          const price = prod.preco_venda_food_service ? parseFloat(prod.preco_venda_food_service) : 0;
                          
                          if (shouldSplit) {
                            const total = parseFloat(qtyInput) || 0;
                            const sum = tubQtys.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
                            if (Math.abs(sum - total) > 0.01) {
                              alert("A soma dos potes (" + sum.toFixed(1) + " L) deve ser igual ao total inserido (" + total.toFixed(1) + " L).");
                              return;
                            }

                            const newItems = tubQtys.map((q, idx) => ({
                              produto_id: selectedProductId,
                              nome: `${prod.nome} (Pote ${idx + 1}/${numTubs})`,
                              quantidade: parseFloat(q),
                              valor_unitario: price
                            }));

                            setOrderItems([...orderItems, ...newItems]);
                          } else {
                            setOrderItems([...orderItems, {
                              produto_id: selectedProductId,
                              nome: prod.nome,
                              quantidade: parseFloat(qtyInput),
                              valor_unitario: price
                            }]);
                          }

                          setSelectedProductId("");
                          setQtyInput("");
                          setShouldSplit(false);
                          setNumTubs(2);
                          setTubQtys(["", ""]);
                        }}
                        style={{
                          height: "40px",
                          padding: "0 16px",
                          backgroundColor: "#1e293b",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "1.25rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <Icons.BsPlusLg /> Adicionar
                      </button>
                    </div>

                    {parseFloat(qtyInput) > 1 && (
                      <div style={{ marginTop: "16px", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.3rem", fontWeight: "bold", color: "#334155", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={shouldSplit}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setShouldSplit(checked);
                              if (checked) {
                                const q = parseFloat(qtyInput) || 0;
                                const half = (q / 2).toFixed(1);
                                setNumTubs(2);
                                setTubQtys([half, half]);
                              } else {
                                setNumTubs(2);
                                setTubQtys(["", ""]);
                              }
                            }}
                            style={{ width: "16px", height: "16px", cursor: "pointer" }}
                          />
                          Separar sabor em potes individuais?
                        </label>

                        {shouldSplit && (
                          <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ fontSize: "1.25rem", color: "#475569" }}>Quantidade de potes:</span>
                              <input
                                type="number"
                                min="2"
                                max="10"
                                value={numTubs}
                                onChange={(e) => {
                                  const val = Math.max(2, parseInt(e.target.value) || 2);
                                  setNumTubs(val);
                                  const q = parseFloat(qtyInput) || 0;
                                  const share = (q / val).toFixed(1);
                                  setTubQtys(Array(val).fill(share));
                                }}
                                style={{ width: "60px", padding: "6px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "1.25rem", textAlign: "center" }}
                              />
                            </div>

                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "8px" }}>
                              {Array.from({ length: numTubs }).map((_, idx) => (
                                <div key={idx} style={{ flex: "1 1 80px", minWidth: "80px" }}>
                                  <span style={{ display: "block", fontSize: "1.15rem", color: "#64748b", marginBottom: "4px" }}>Pote {idx + 1} (L)</span>
                                  <input
                                    type="number"
                                    step="any"
                                    value={tubQtys[idx] || ""}
                                    onChange={(e) => {
                                      const newQtys = [...tubQtys];
                                      newQtys[idx] = e.target.value;
                                      setTubQtys(newQtys);
                                    }}
                                    style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "1.25rem", textAlign: "center", boxSizing: "border-box" }}
                                  />
                                </div>
                              ))}
                            </div>

                            {(() => {
                              const total = parseFloat(qtyInput) || 0;
                              const sum = tubQtys.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
                              const isMatch = Math.abs(sum - total) < 0.01;
                              return (
                                <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: isMatch ? "#166534" : "#991b1b", display: "flex", gap: "8px", marginTop: "4px" }}>
                                  {isMatch ? (
                                    <span>✓ Soma dos potes correta: {sum.toFixed(1)} L</span>
                                  ) : (
                                    <span>⚠️ Soma dos potes ({sum.toFixed(1)} L) difere do total ({total.toFixed(1)} L)</span>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* List of items in the current order */}
                  <div>
                    <h4 style={{ margin: "0 0 10px 0", color: "#334155", fontSize: "1.4rem", fontWeight: "bold" }}>Produtos do Pedido</h4>
                    {orderItems.length === 0 ? (
                      <div style={{ padding: "20px", border: "1px solid #e2e8f0", borderRadius: "8px", textAlign: "center", color: "#94a3b8", fontSize: "1.3rem" }}>
                        Nenhum sabor adicionado ainda.
                      </div>
                    ) : (
                      <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.25rem" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                              <th style={{ padding: "10px", textAlign: "left", color: "#475569" }}>Gelato</th>
                              <th style={{ padding: "10px", textAlign: "center", color: "#475569", width: "150px" }}>Qtd (L)</th>
                              <th style={{ padding: "10px", textAlign: "center", color: "#475569", width: "80px" }}>Excluir</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderItems.map((item, idx) => {
                              return (
                                <tr key={item.produto_id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                  <td style={{ padding: "10px", fontWeight: "600", color: "#334155" }}>{item.nome}</td>
                                  <td style={{ padding: "10px", textAlign: "center" }}>{item.quantidade}</td>
                                  <td style={{ padding: "10px", textAlign: "center" }}>
                                    <button
                                      type="button"
                                      onClick={() => setOrderItems(orderItems.filter((_, i) => i !== idx))}
                                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.4rem", padding: "4px" }}
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

                {/* Actions */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "30px", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setOrderItems([]);
                    }}
                    disabled={savingRow}
                    style={{
                      height: "44px",
                      padding: "0 24px",
                      backgroundColor: "#f1f5f9",
                      color: "#475569",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1.3rem"
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSavePedido}
                    disabled={savingRow || orderItems.length === 0}
                    style={{
                      height: "44px",
                      padding: "0 24px",
                      backgroundColor: orderItems.length === 0 ? "#cbd5e1" : "var(--primary-color)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: (savingRow || orderItems.length === 0) ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    {savingRow ? <><Icons.BsArrowClockwise className="spin" /> Salvando...</> : <><Icons.BsCheckCircleFill /> Salvar Pedido</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <table className="freq-table" style={{ minWidth: "1000px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "center", width: "50px" }}></th>
                  <th style={{ textAlign: "center", width: "150px" }}>Nº Pedido</th>
                  <th style={{ textAlign: "center", width: "130px" }}>Status</th>
                  <th style={{ width: "200px" }}>Cliente</th>
                  <th style={{ textAlign: "center", width: "130px" }}>Data do Pedido</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Qtd Total (L)</th>
                  <th style={{ textAlign: "center", width: "130px" }}>Qtd Prod. Total (kg)</th>
                  <th style={{ textAlign: "center", width: "130px" }}>Data Entrega</th>
                  {isAdmin && <th style={{ textAlign: "center", width: "110px" }}>Usuário</th>}
                  <th style={{ textAlign: "center", width: "100px" }}>Ações</th>
                </tr>
                {/* Linha de Filtros */}
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "8px" }}></th>
                  <th style={{ padding: "8px" }}>
                    <input
                      type="text"
                      placeholder="Nº Pedido..."
                      value={filterCodigoPedido}
                      onChange={(e) => setFilterCodigoPedido(e.target.value)}
                      style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.1rem" }}
                    />
                  </th>
                  <th style={{ padding: "8px" }}>
                    <Select
                      isClearable
                      menuPortalTarget={document.body}
                      maxMenuHeight={250}
                      options={[
                        { value: 'pendente_prod', label: 'Pendente Prod.' },
                        { value: 'aguardando_entrega', label: 'Aguardando Entrega' },
                        { value: 'entregue', label: 'Entregue' }
                      ]}
                      value={filterStatusPedido ? { value: filterStatusPedido, label: filterStatusPedido === 'pendente_prod' ? 'Pendente Prod.' : filterStatusPedido === 'aguardando_entrega' ? 'Aguardando Entrega' : 'Entregue' } : null}
                      onChange={(sel: any) => setFilterStatusPedido(sel ? sel.value : "")}
                      placeholder="Filtrar Status..."
                      styles={{
                        control: (base) => ({ ...base, borderColor: '#cbd5e1', minHeight: '38px', borderRadius: '4px', fontSize: '1.1rem' }),
                        menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: '1.1rem' })
                      }}
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
                  <th style={{ padding: "8px" }}>
                    <input
                      type="date"
                      value={filterData}
                      onChange={(e) => setFilterData(e.target.value)}
                      style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.1rem" }}
                    />
                  </th>
                  <th colSpan={isAdmin ? 5 : 4} style={{ padding: "8px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "nowrap", alignItems: "center" }}>
                      <div style={{ width: "180px", textAlign: "left" }}>
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
                              minHeight: '34px',
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
                      </div>
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
                          setFilterStatusPedido("");
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
                ) : groupedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 10 : 9} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      Nenhuma entrada registrada.
                    </td>
                  </tr>
                ) : (
                  groupedOrders.map((order, index) => {
                      const dataFormatada = new Date(order.data_pedido + 'T00:00:00').toLocaleDateString('pt-BR');
                      const items = order.items;
                      const totalQty = items.reduce((acc, curr) => acc + (curr.quantidade || 0), 0);
                      const totalQtyProd = items.reduce((acc, curr) => acc + (parseFloat(curr.quantidade_produzida) || 0), 0);
                      
                      const allProduced = items.every(item => item.quantidade_produzida);
                      const allDelivered = items.every(item => item.data_entrega);
                      const anyProduced = items.some(item => item.quantidade_produzida);
                      const anyDelivered = items.some(item => item.data_entrega);

                      const isPendenteProducao = !anyProduced && !anyDelivered;
                      const isEntregue = allProduced && allDelivered;
                      const isPendenteEntrega = !isPendenteProducao && !isEntregue;

                      let rowBg = "";
                      if (items.some(item => item.status_revisao === 'pending_delete')) rowBg = "#fecaca";
                      else if (items.some(item => item.status_revisao === 'pending_user')) rowBg = "#fee2e2";
                      else if (items.some(item => item.status_revisao === 'pending_admin')) rowBg = "#ffedd5";
                      else if (isEntregue) rowBg = "#f0fdf4";
                      else if (isPendenteEntrega) rowBg = "#fefce8";
                      else rowBg = "#fef2f2";

                      const leftBorder = isEntregue ? "4px solid #22c55e" : isPendenteEntrega ? "4px solid #eab308" : "4px solid #ef4444";

                      const isToday = order.data_pedido === getToday();
                      const prevOrder = index > 0 ? groupedOrders[index - 1] : null;
                      const prevIsToday = prevOrder ? prevOrder.data_pedido === getToday() : false;
                      
                      const showHojeHeader = !filterCreatedToday && isToday && index === 0;
                      const showAnterioresHeader = !filterCreatedToday && !isToday && (index === 0 || prevIsToday);

                      const headerRow = showHojeHeader ? (
                        <tr key={`header-hoje-${order.codigo_pedido}`} style={{ backgroundColor: "#f0fdf4" }}>
                          <td colSpan={isAdmin ? 10 : 9} style={{ textAlign: "center", padding: "10px", fontWeight: "bold", color: "#166534", borderTop: "2px solid #bbf7d0", borderBottom: "2px solid #bbf7d0", textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.85rem" }}>
                            Lançamentos de Hoje
                          </td>
                        </tr>
                      ) : showAnterioresHeader ? (
                        <tr key={`header-ant-${order.codigo_pedido}`} style={{ backgroundColor: "#f8fafc" }}>
                          <td colSpan={isAdmin ? 10 : 9} style={{ textAlign: "center", padding: "10px", fontWeight: "bold", color: "#64748b", borderTop: "2px solid #e2e8f0", borderBottom: "2px solid #e2e8f0", textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.85rem" }}>
                            Lançamentos Anteriores
                          </td>
                        </tr>
                      ) : null;
                      const isExpanded = expandedOrders.includes(order.codigo_pedido);
                      const deliveryDates = Array.from(new Set(items.map(item => item.data_entrega).filter(Boolean)));
                      let deliveryLabel = "-";
                      if (deliveryDates.length === 1) {
                        deliveryLabel = new Date(deliveryDates[0] + 'T00:00:00').toLocaleDateString('pt-BR');
                      } else if (deliveryDates.length > 1) {
                        deliveryLabel = "Várias datas";
                      }

                      const parentRow = (
                        <tr key={order.codigo_pedido} style={{ backgroundColor: rowBg, cursor: "pointer" }} onClick={() => toggleOrderExpand(order.codigo_pedido)}>
                          <td style={{ textAlign: "center", verticalAlign: "middle", borderLeft: leftBorder, width: "50px" }}>
                            <span style={{ fontSize: "1.4rem", color: "#64748b" }}>
                              {isExpanded ? <Icons.BsChevronDown /> : <Icons.BsChevronRight />}
                            </span>
                          </td>
                          <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                            <span style={{ fontFamily: "monospace", fontWeight: "bold", fontSize: "1.2rem", color: "#475569" }}>
                              {order.codigo_pedido}
                            </span>
                          </td>
                          <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                            {isPendenteProducao && (
                              <span style={{ backgroundColor: "#ef4444", color: "#ffffff", fontSize: "0.70rem", fontWeight: "bold", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase", display: "inline-block" }}>Pendente Prod.</span>
                            )}
                            {isPendenteEntrega && (
                              <span style={{ backgroundColor: "#eab308", color: "#ffffff", fontSize: "0.70rem", fontWeight: "bold", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase", display: "inline-block" }}>Aguardando Entrega</span>
                            )}
                            {isEntregue && (
                              <span style={{ backgroundColor: "#22c55e", color: "#ffffff", fontSize: "0.70rem", fontWeight: "bold", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase", display: "inline-block" }}>Entregue</span>
                            )}
                          </td>
                          <td style={{ verticalAlign: "middle", fontWeight: 600 }}>{order.cliente || "-"}</td>
                          <td style={{ textAlign: "center", verticalAlign: "middle" }}>{dataFormatada}</td>
                          <td style={{ textAlign: "center", fontWeight: "bold", verticalAlign: "middle" }}>{totalQty} L</td>
                          <td style={{ textAlign: "center", verticalAlign: "middle" }}>{totalQtyProd > 0 ? `${totalQtyProd.toFixed(1)} kg` : "-"}</td>
                          <td style={{ textAlign: "center", verticalAlign: "middle" }}>{deliveryLabel}</td>
                          {isAdmin && (
                            <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                              <span 
                                title={order.created_at ? new Date(order.created_at).toLocaleString("pt-BR") : ""}
                                style={{
                                  background: "#f1f5f9",
                                  border: "1px solid #cbd5e1",
                                  borderRadius: "8px",
                                  padding: "4px 12px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  fontSize: "1.2rem",
                                  color: "#334155"
                                }}
                              >
                                <Icons.BsPerson style={{ fontSize: "1.4rem", color: "#64748b" }} />
                                {profilesMap[order.user_id] || "-"}
                              </span>
                            </td>
                          )}
                          <td style={{ textAlign: "center", verticalAlign: "middle" }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
                              <button
                                onClick={() => toggleOrderExpand(order.codigo_pedido)}
                                style={{ background: "none", border: "none", color: "var(--primary-color)", cursor: "pointer", fontSize: "1.3rem", padding: "4px" }}
                                title={isExpanded ? "Recolher detalhes" : "Expandir detalhes"}
                              >
                                {isExpanded ? <Icons.BsEyeSlash /> : <Icons.BsEye />}
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.codigo_pedido, items)}
                                style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.3rem", padding: "4px" }}
                                title="Excluir Pedido Completo"
                              >
                                <Icons.BsTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );

                      const expandedRow = isExpanded ? (
                        <tr key={`${order.codigo_pedido}-expanded`} style={{ backgroundColor: "#f8fafc" }}>
                          <td colSpan={isAdmin ? 10 : 9} style={{ padding: "16px 24px" }}>
                            <div style={{ border: "1px solid #cbd5e1", borderRadius: "12px", overflow: "hidden", backgroundColor: "#ffffff", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)" }}>
                              <div style={{ padding: "12px 16px", backgroundColor: "#f1f5f9", borderBottom: "1px solid #cbd5e1", fontWeight: "bold", fontSize: "1.2rem", color: "#475569", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>Itens do Pedido {order.codigo_pedido}</span>
                                <span style={{ fontSize: "1.1rem", color: "#64748b" }}>{items.length} sabor(es)</span>
                              </div>
                              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.15rem" }}>
                                <thead>
                                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #cbd5e1" }}>
                                    <th style={{ padding: "10px 14px", textAlign: "left", color: "#64748b", fontWeight: "bold" }}>Gelato / Pote</th>
                                    <th style={{ padding: "10px 14px", textAlign: "center", color: "#64748b", fontWeight: "bold", width: "100px" }}>Qtd (L)</th>
                                    <th style={{ padding: "10px 14px", textAlign: "center", color: "#64748b", fontWeight: "bold", width: "180px" }}>Qtd Produzida</th>
                                    <th style={{ padding: "10px 14px", textAlign: "center", color: "#64748b", fontWeight: "bold", width: "180px" }}>Data Entrega</th>
                                    <th style={{ padding: "10px 14px", textAlign: "center", color: "#64748b", fontWeight: "bold", width: "120px" }}>Status</th>
                                    {isAdmin && <th style={{ padding: "10px 14px", textAlign: "center", color: "#64748b", fontWeight: "bold", width: "140px" }}>Usuário</th>}
                                    <th style={{ padding: "10px 14px", textAlign: "center", color: "#64748b", fontWeight: "bold", width: "120px" }}>Ações</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {items.map(comp => {
                                    const isEditing = editingRowId === comp.id;
                                    const diffMin = comp.created_at ? (new Date().getTime() - new Date(comp.created_at).getTime()) / (1000 * 60) : -1;
                                    const isRowNew = diffMin >= 0 && diffMin < 60;
                                    const diffEditMin = comp.updated_at ? (new Date().getTime() - new Date(comp.updated_at).getTime()) / (1000 * 60) : -1;
                                    const isRowEdited = comp.updated_at && comp.updated_at !== comp.created_at && diffEditMin >= 0 && diffEditMin < 60;
                                    const isPendenteProducaoItem = !comp.quantidade_produzida && !comp.data_entrega;
                                    const isPendenteEntregaItem = comp.quantidade_produzida && !comp.data_entrega;
                                    const isEntregueItem = comp.quantidade_produzida && comp.data_entrega;

                                    if (isEditing) {
                                      return (
                                        <tr key={comp.id} style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                                          <td style={{ padding: "8px 12px" }}>
                                            <Select
                                              menuPortalTarget={document.body}
                                              maxMenuHeight={250}
                                              options={produtos.filter(ins => ins.ativo !== false || ins.id === editRowData.produto_id).map(ins => ({ value: ins.id, label: ins.nome }))}
                                              value={editRowData.produto_id ? { value: editRowData.produto_id, label: produtos.find(i => i.id === editRowData.produto_id)?.nome } : null}
                                              onChange={(sel) => setEditRowData({ ...editRowData, produto_id: sel ? sel.value : "" })}
                                              styles={{
                                                control: (base) => ({ ...base, minHeight: '34px', fontSize: '1.1rem' }),
                                                menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: '1.1rem' })
                                              }}
                                            />
                                          </td>
                                          <td style={{ padding: "8px 12px" }}>
                                            <input
                                              type="number"
                                              step="any"
                                              value={editRowData.quantidade}
                                              onChange={(e) => setEditRowData({ ...editRowData, quantidade: e.target.value })}
                                              style={{ width: "100%", padding: "4px 6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px", textAlign: "center" }}
                                            />
                                          </td>
                                          <td style={{ padding: "8px 12px" }}>
                                            <input
                                              type="number"
                                              step="any"
                                              value={editRowData.quantidade_produzida || ""}
                                              onChange={(e) => setEditRowData({ ...editRowData, quantidade_produzida: e.target.value })}
                                              style={{ width: "100%", padding: "4px 6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px", textAlign: "center" }}
                                              placeholder="kg"
                                            />
                                          </td>
                                          <td style={{ padding: "8px 12px" }}>
                                            <input
                                              type="date"
                                              value={editRowData.data_entrega || ""}
                                              onChange={(e) => setEditRowData({ ...editRowData, data_entrega: e.target.value })}
                                              style={{ width: "100%", padding: "4px 6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px", textAlign: "center" }}
                                            />
                                          </td>
                                          <td style={{ textAlign: "center" }}>
                                            {(!editRowData.quantidade_produzida && !editRowData.data_entrega) && (
                                              <span style={{ backgroundColor: "#ef4444", color: "#ffffff", fontSize: "0.65rem", fontWeight: "bold", padding: "2px 4px", borderRadius: "4px", textTransform: "uppercase" }}>Pendente Prod.</span>
                                            )}
                                            {(editRowData.quantidade_produzida && !editRowData.data_entrega) && (
                                              <span style={{ backgroundColor: "#eab308", color: "#ffffff", fontSize: "0.65rem", fontWeight: "bold", padding: "2px 4px", borderRadius: "4px", textTransform: "uppercase" }}>Aguardando Entrega</span>
                                            )}
                                            {(editRowData.quantidade_produzida && editRowData.data_entrega) && (
                                              <span style={{ backgroundColor: "#22c55e", color: "#ffffff", fontSize: "0.65rem", fontWeight: "bold", padding: "2px 4px", borderRadius: "4px", textTransform: "uppercase" }}>Entregue</span>
                                            )}
                                          </td>
                                          {isAdmin && <td style={{ textAlign: "center", color: "#94a3b8" }}>-</td>}
                                          <td style={{ textAlign: "center" }}>
                                            <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                                              <button
                                                onClick={handleSaveEdit}
                                                disabled={savingEdit}
                                                title="Salvar"
                                                style={{ background: "#22c55e", color: "white", border: "none", borderRadius: "4px", padding: "4px 6px", cursor: "pointer", fontSize: "1.1rem" }}
                                              >
                                                {savingEdit ? <Icons.BsArrowClockwise className="spin" /> : <Icons.BsCheck />}
                                              </button>
                                              <button
                                                onClick={() => setEditingRowId(null)}
                                                disabled={savingEdit}
                                                title="Cancelar"
                                                style={{ background: "#ef4444", color: "white", border: "none", borderRadius: "4px", padding: "4px 6px", cursor: "pointer", fontSize: "1.1rem" }}
                                              >
                                                <Icons.BsX />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    }

                                    return (
                                      <tr key={comp.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                        <td style={{ padding: "10px 14px", fontWeight: "600", color: "#334155" }}>
                                          {comp.cadastro_produtos?.nome || "Produto Excluído"}
                                          {comp.status_revisao === 'pending_delete' && (
                                            <span style={{ marginLeft: "8px", fontSize: "0.75rem", backgroundColor: "#ef4444", color: "white", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase" }}>Deletado</span>
                                          )}
                                          {isRowNew && comp.status_revisao !== 'pending_delete' && (
                                            <span style={{ marginLeft: "8px", backgroundColor: "#10b981", color: "#ffffff", fontSize: "0.75rem", fontWeight: "bold", padding: "2px 4px", borderRadius: "4px" }}>Novo</span>
                                          )}
                                          {isRowEdited && comp.status_revisao !== 'pending_delete' && (
                                            <span style={{ marginLeft: "8px", backgroundColor: "#f97316", color: "#ffffff", fontSize: "0.75rem", fontWeight: "bold", padding: "2px 4px", borderRadius: "4px" }}>Editado</span>
                                          )}
                                        </td>
                                        <td style={{ padding: "10px 14px", textAlign: "center" }}>{comp.quantidade} L</td>
                                        <td style={{ padding: "6px 10px" }}>
                                          {comp.quantidade_produzida && focusedCell !== `${comp.id}_qp` ? (
                                            <div style={{ textAlign: "center", padding: "4px", color: "var(--text-dark)" }}>{comp.quantidade_produzida} kg</div>
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
                                                style={{ width: "100%", padding: "4px 20px 4px 4px", fontSize: "1rem", border: "1px solid #e2e8f0", borderRadius: "4px", textAlign: "center", backgroundColor: "#f8fafc" }}
                                                placeholder="0"
                                              />
                                              <span style={{ position: "absolute", right: "4px", color: "#94a3b8", pointerEvents: "none", fontSize: "0.85rem" }}>kg</span>
                                            </div>
                                          )}
                                        </td>
                                        <td style={{ padding: "6px 10px" }}>
                                          {comp.data_entrega && focusedCell !== `${comp.id}_de` ? (
                                            <div style={{ textAlign: "center", padding: "4px", color: "var(--text-dark)" }}>{new Date(comp.data_entrega + 'T00:00:00').toLocaleDateString('pt-BR')}</div>
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
                                              style={{ width: "100%", padding: "4px", fontSize: "1rem", border: "1px solid #e2e8f0", borderRadius: "4px", textAlign: "center", backgroundColor: "#f8fafc" }}
                                            />
                                          )}
                                        </td>
                                        <td style={{ padding: "10px 14px", textAlign: "center" }}>
                                          {isPendenteProducaoItem && (
                                            <span style={{ backgroundColor: "#ef4444", color: "#ffffff", fontSize: "0.65rem", fontWeight: "bold", padding: "2px 4px", borderRadius: "4px", textTransform: "uppercase" }}>Pendente Prod.</span>
                                          )}
                                          {isPendenteEntregaItem && (
                                            <span style={{ backgroundColor: "#eab308", color: "#ffffff", fontSize: "0.65rem", fontWeight: "bold", padding: "2px 4px", borderRadius: "4px", textTransform: "uppercase" }}>Aguardando Entrega</span>
                                          )}
                                          {isEntregueItem && (
                                            <span style={{ backgroundColor: "#22c55e", color: "#ffffff", fontSize: "0.65rem", fontWeight: "bold", padding: "2px 4px", borderRadius: "4px", textTransform: "uppercase" }}>Entregue</span>
                                          )}
                                        </td>
                                        {isAdmin && (
                                          <td style={{ padding: "10px 14px", textAlign: "center" }}>
                                            <span style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "2px 8px", fontSize: "1rem", color: "#334155" }}>
                                              {profilesMap[comp.user_id] || "-"}
                                            </span>
                                          </td>
                                        )}
                                        <td style={{ padding: "10px 14px", textAlign: "center" }}>
                                          <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                            {isAdmin && (!comp.status_revisao || comp.status_revisao === 'none') && (
                                              <button
                                                onClick={() => handleUpdateReviewStatus(comp.id, 'pending_user')}
                                                title="Solicitar Revisão"
                                                style={{ background: "#eab308", color: "white", border: "none", borderRadius: "4px", padding: "4px", cursor: "pointer" }}
                                              >
                                                <Icons.BsExclamationTriangle />
                                              </button>
                                            )}
                                            {comp.status_revisao && comp.status_revisao !== 'none' && (
                                              <div style={{ display: "flex", gap: "2px" }}>
                                                {isAdmin && (comp.status_revisao === 'pending_admin' || comp.status_revisao === 'pending_delete') && (
                                                  <button
                                                    onClick={() => handleApproveReview(comp.id, comp.status_revisao)}
                                                    title="Aprovar Alteração"
                                                    style={{ background: "#22c55e", color: "white", border: "none", borderRadius: "4px", padding: "4px", cursor: "pointer" }}
                                                  >
                                                    <Icons.BsCheck />
                                                  </button>
                                                )}
                                                {isAdmin && (comp.status_revisao === 'pending_admin' || comp.status_revisao === 'pending_delete') && (
                                                  <button
                                                    onClick={() => handleRejectReview(comp.id, comp.status_revisao)}
                                                    title="Rejeitar Alteração"
                                                    style={{ background: "#ef4444", color: "white", border: "none", borderRadius: "4px", padding: "4px", cursor: "pointer" }}
                                                  >
                                                    <Icons.BsX />
                                                  </button>
                                                )}
                                                {!isAdmin && comp.status_revisao === 'pending_user' && (
                                                  <button
                                                    onClick={() => {
                                                      setEditRowData({
                                                        id: comp.id,
                                                        produto_id: comp.produto_id,
                                                        data_pedido: comp.data_pedido,
                                                        cliente: comp.cliente || "",
                                                        quantidade: comp.quantidade.toString(),
                                                        quantidade_produzida: comp.quantidade_produzida?.toString() || "",
                                                        data_entrega: comp.data_entrega || "",
                                                        valor_unitario: comp.valor_unitario?.toString() || ""
                                                      });
                                                      setEditingRowId(comp.id);
                                                    }}
                                                    title="Corrigir Lançamento"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", borderRadius: "4px", padding: "4px", cursor: "pointer" }}
                                                  >
                                                    <Icons.BsPencil />
                                                  </button>
                                                )}
                                              </div>
                                            )}
                                            {comp.status_revisao !== 'pending_delete' && (isAdmin || (!comp.status_revisao || comp.status_revisao === 'none')) && (
                                              <>
                                                <button
                                                  onClick={() => {
                                                    setEditRowData({
                                                      id: comp.id,
                                                      produto_id: comp.produto_id,
                                                      data_pedido: comp.data_pedido,
                                                      cliente: comp.cliente || "",
                                                      quantidade: comp.quantidade.toString(),
                                                      quantidade_produzida: comp.quantidade_produzida?.toString() || "",
                                                      data_entrega: comp.data_entrega || "",
                                                      valor_unitario: comp.valor_unitario?.toString() || ""
                                                    });
                                                    setEditingRowId(comp.id);
                                                  }}
                                                  title="Editar Sabor"
                                                  style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "1.2rem", padding: "2px" }}
                                                >
                                                  <Icons.BsPencil />
                                                </button>
                                                <button
                                                  onClick={() => handleDelete(comp.id)}
                                                  title="Excluir Sabor"
                                                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.2rem", padding: "2px" }}
                                                >
                                                  <Icons.BsTrash />
                                                </button>
                                              </>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      ) : null;

                      return (
                        <React.Fragment key={order.codigo_pedido}>
                          {headerRow}
                          {parentRow}
                          {expandedRow}
                        </React.Fragment>
                      );
                    })
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
