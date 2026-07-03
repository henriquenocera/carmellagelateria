import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import { useAuth } from "../AuthProvider";
import supabase from "../services/supabase-client";
import "../css/Frequencia.css";

const cleanCategoryName = (name: string | null | undefined): string => {
  if (!name) return "";
  const cleaned = name.replace(/^\d+(?:\.\d+)*[\s\-\.]*/, "").trim();
  return cleaned || name;
};

function LancamentosFinanceiros() {
  const { isAdmin, user } = useAuth();

  const [contasDb, setContasDb] = useState<any[]>([]);
  const [categoriasDb, setCategoriasDb] = useState<any[]>([]);
  const [fornecedoresDb, setFornecedoresDb] = useState<any[]>([]);
  const [clientesDb, setClientesDb] = useState<any[]>([]);
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [profilesMap, setProfilesMap] = useState<{ [key: string]: string }>({});
  const [savingRow, setSavingRow] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRowData, setEditRowData] = useState<any>({});

  const [filterData, setFilterData] = useState("");
  const [filterDescricao, setFilterDescricao] = useState("");
  const [debouncedDescricao, setDebouncedDescricao] = useState("");
  const [filterFornecedor, setFilterFornecedor] = useState<string | null>(null);
  const [filterCategoria, setFilterCategoria] = useState<string | null>(null);
  const [filterConta, setFilterConta] = useState<string | null>(null);
  const [filterCreatedToday, setFilterCreatedToday] = useState(false);
  const [filterMes, setFilterMes] = useState("");
  const [filterNoCategory, setFilterNoCategory] = useState(false);
  const [activeTab, setActiveTab] = useState<'normal' | 'vendas'>('normal');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDescricao(filterDescricao);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [filterDescricao]);

  const [filterStatus, setFilterStatus] = useState<'all' | 'review' | 'deleted'>('all');
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [pendingDeleteCount, setPendingDeleteCount] = useState(0);
  const [limit, setLimit] = useState(100);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [newRow, setNewRow] = useState({
    data: getToday(),
    descricao: "",
    fornecedor: "",
    valor: "",
    categoria: "",
    conta: ""
  });

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      height: '54px',
      minHeight: '54px',
      borderRadius: '4px',
      borderColor: '#cbd5e1',
      fontSize: '1.4rem'
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '0 8px'
    }),
    menu: (base: any) => ({
      ...base,
      fontSize: '1.4rem'
    }),
    option: (base: any) => ({
      ...base,
      fontSize: '1.4rem'
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999
    })
  };

  const filterSelectStyles = {
    control: (base: any) => ({
      ...base,
      height: '38px',
      minHeight: '38px',
      borderRadius: '4px',
      borderColor: '#cbd5e1',
      fontSize: '1.2rem'
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '0 8px',
      height: '38px',
      minHeight: '38px',
      display: 'flex',
      alignItems: 'center'
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      height: '38px',
      minHeight: '38px'
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#94a3b8',
      fontSize: '1.2rem',
      fontWeight: 'normal',
      textTransform: 'none'
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#334155',
      fontSize: '1.2rem',
      fontWeight: 'normal'
    }),
    input: (base: any) => ({
      ...base,
      fontSize: '1.2rem',
      fontWeight: 'normal'
    }),
    menu: (base: any) => ({
      ...base,
      fontSize: '1.2rem'
    }),
    option: (base: any) => ({
      ...base,
      fontSize: '1.2rem'
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999
    })
  };

  const fornecedorOptions = fornecedoresDb.map(f => ({ value: f.nome, label: f.nome }));
  const clienteOptions = clientesDb.map(c => ({ value: c.nome, label: c.nome }));

  const categoriaOptions = categoriasDb
    .filter(c => !c.parent_id)
    .map(pai => {
      const subOptions = categoriasDb
        .filter(sub => sub.parent_id === pai.id)
        .filter(sub => {
          const isVenda = sub.nome && sub.nome.toLowerCase().includes("vendas loja");
          return activeTab === 'vendas' ? isVenda : !isVenda;
        })
        .map(sub => ({
          value: cleanCategoryName(sub.nome),
          label: sub.nome
        }));
      return {
        label: pai.nome,
        options: subOptions
      };
    })
    .filter(group => group.options.length > 0);

  const categoriaOptionsAll = categoriasDb.filter(c => !c.parent_id).map(pai => ({
    label: pai.nome,
    options: categoriasDb.filter(sub => sub.parent_id === pai.id).map(sub => ({
      value: cleanCategoryName(sub.nome),
      label: sub.nome
    }))
  }));

  const contaOptions = contasDb.map(c => {
    const value = [c.banco, c.agencia, c.conta_corrente].filter(Boolean).join(" - ");
    const label = [c.descricao, c.banco, c.conta_corrente].filter(Boolean).join(" - ");
    return { value: value, label: label };
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: contasData, error: contasError } = await supabase
          .from("contas")
          .select("id, banco, agencia, conta_corrente, descricao")
          .eq("ativo", true)
          .order("banco", { ascending: true });

        if (!contasError && contasData) {
          setContasDb(contasData);
        }

        const { data: catData, error: catError } = await supabase
          .from("categorias_financeiras")
          .select("id, nome, parent_id")
          .order("nome", { ascending: true });

        if (!catError && catData) {
          setCategoriasDb(catData);
        }

        const { data: fornData, error: fornError } = await supabase
          .from("fornecedores")
          .select("id, nome")
          .eq("ativo", true)
          .order("nome", { ascending: true });

        if (!fornError && fornData) {
          setFornecedoresDb(fornData);
        }

        const { data: cliData, error: cliError } = await supabase
          .from("clientes_food_service")
          .select("id, nome")
          .eq("ativo", true)
          .order("nome", { ascending: true });

        if (!cliError && cliData) {
          setClientesDb(cliData);
        }

        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, name");

        if (!profilesError && profilesData) {
          const map: { [key: string]: string } = {};
          profilesData.forEach((p: any) => {
            map[p.id] = p.name || "";
          });
          setProfilesMap(map);
        }

        // fetchLancamentos will be handled by the useEffect below
      } catch (err) {
        console.error("Erro ao buscar dados iniciais:", err);
      }
    }
    fetchData();
  }, []);

  const checkPendingCounts = useCallback(async () => {
    try {
      if (isAdmin) {
        const { count: revCount } = await supabase.from("lancamentos_financeiros").select("*", { count: 'exact', head: true }).in('status_revisao', ['pending_user', 'pending_admin']);
        setPendingReviewCount(revCount || 0);

        const { count: delCount } = await supabase.from("lancamentos_financeiros").select("*", { count: 'exact', head: true }).eq('status_revisao', 'pending_delete');
        setPendingDeleteCount(delCount || 0);
      } else {
        const { count: revCount } = await supabase.from("lancamentos_financeiros").select("*", { count: 'exact', head: true }).eq('status_revisao', 'pending_user');
        setPendingReviewCount(revCount || 0);
      }
    } catch (err) {
      console.error("Erro ao checar contagens pendentes:", err);
    }
  }, [isAdmin]);

  const fetchLancamentosRef = useRef<any>(null);

  const getMonthRange = (monthStr: string) => {
    if (!monthStr) return null;
    const [year, month] = monthStr.split("-").map(Number);
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;

    let nextYear = year;
    let nextMonth = month + 1;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

    return { startDate, endDate };
  };

  const fetchLancamentos = useCallback(async (options: {
    currentLimit?: number;
    fStatus?: 'all' | 'review' | 'deleted';
    orderCreated?: boolean;
    fData?: string;
    fDesc?: string;
    fForn?: string | null;
    fCat?: string | null;
    fConta?: string | null;
    fMes?: string;
    fNoCategory?: boolean;
    fTab?: 'normal' | 'vendas';
  } = {}) => {
    const {
      currentLimit = limit,
      fStatus = filterStatus,
      orderCreated = filterCreatedToday,
      fData = filterData,
      fDesc = debouncedDescricao,
      fForn = filterFornecedor,
      fCat = filterCategoria,
      fConta = filterConta,
      fMes = filterMes,
      fNoCategory = filterNoCategory,
      fTab = activeTab
    } = options;

    fetchLancamentosRef.current = fetchLancamentos;
    try {
      let query = supabase
        .from("lancamentos_financeiros")
        .select("*", { count: "exact" });

      if (orderCreated) {
        query = query.order("created_at", { ascending: false }).order("data", { ascending: false }).order("id", { ascending: false });
      } else {
        query = query.order("data", { ascending: false }).order("created_at", { ascending: false }).order("id", { ascending: false });
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
          query = query.or('status_revisao.is.null,status_revisao.eq.pending_user,status_revisao.eq.pending_admin');
        }
      }

      // Apply DB filters
      if (fData) {
        query = query.eq('data', fData);
      }
      if (fDesc) {
        query = query.ilike('descricao', `%${fDesc}%`);
      }
      if (fForn) {
        query = query.eq('fornecedor', fForn);
      }
      if (fCat) {
        query = query.eq('categoria', fCat);
      }
      if (fConta) {
        const matchingConta = contasDb.find(c => {
          const val = [c.banco, c.agencia, c.conta_corrente].filter(Boolean).join(" - ");
          return val === fConta;
        });
        if (matchingConta) {
          const label = [matchingConta.descricao, matchingConta.banco, matchingConta.conta_corrente].filter(Boolean).join(" - ");
          query = query.in('conta', [fConta, label]);
        } else {
          query = query.eq('conta', fConta);
        }
      }
      if (fMes) {
        const range = getMonthRange(fMes);
        if (range) {
          query = query.gte('data', range.startDate).lt('data', range.endDate);
        }
      }
      if (fNoCategory) {
        query = query.is('categoria', null);
      }

      // Tab filter (separar lançamentos normais das vendas das lojas)
      if (fTab === 'vendas') {
        query = query.ilike('categoria', '%Vendas Loja%');
      } else {
        query = query.or('categoria.is.null,categoria.not.ilike.%Vendas Loja%');
      }

      // range is inclusive, so to fetch currentLimit + 1 rows we request range 0 to currentLimit
      const { data, error, count } = await query.range(0, currentLimit - 1);
      if (error) throw error;

      if (data) {
        setLancamentos(data);
        setHasMore(data.length >= currentLimit);
      } else {
        setLancamentos([]);
        setHasMore(false);
      }

      if (count !== null) {
        setTotalCount(count);
      }

      checkPendingCounts();
    } catch (err) {
      console.error("Erro ao buscar lançamentos:", err);
    }
  }, [isAdmin, filterStatus, filterCreatedToday, limit, filterData, debouncedDescricao, filterFornecedor, filterCategoria, filterConta, filterMes, filterNoCategory, activeTab, checkPendingCounts, contasDb]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    fetchLancamentosRef.current = fetchLancamentos;
  }, [fetchLancamentos]);

  useEffect(() => {
    if (user) {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        fetchLancamentosRef.current?.({ currentLimit: 100, fTab: activeTab });
        return;
      }
      setLimit(100);
      fetchLancamentosRef.current?.({ currentLimit: 100, fTab: activeTab });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterCreatedToday, filterData, debouncedDescricao, filterFornecedor, filterCategoria, filterConta, filterMes, filterNoCategory, activeTab, user]);

  useEffect(() => {
    if (user && limit !== 100) {
      fetchLancamentosRef.current?.({ currentLimit: limit });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, user]);

  useEffect(() => {
    const channel = supabase.channel('realtime-lancamentos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lancamentos_financeiros' },
        () => {
          if (fetchLancamentosRef.current) {
            fetchLancamentosRef.current();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    checkPendingCounts();
  }, [checkPendingCounts, lancamentos]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRow.descricao || !newRow.valor || !newRow.conta) {
      alert("Preencha descrição, conta e valor.");
      return;
    }

    try {
      setSavingRow(true);
      const payload = {
        data: newRow.data,
        descricao: newRow.descricao,
        fornecedor: newRow.fornecedor || null,
        valor: parseFloat(newRow.valor.replace(",", ".")),
        categoria: newRow.categoria || null,
        conta: newRow.conta,
        user_id: user?.id,
        status_revisao: null
      };

      const { error } = await supabase.from("lancamentos_financeiros").insert([payload]);
      if (error) throw error;

      setNewRow({ data: getToday(), descricao: "", valor: "", fornecedor: "", categoria: "", conta: "" });
      fetchLancamentosRef.current?.();
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar lançamento.");
    } finally {
      setSavingRow(false);
    }
  };

  const handleSaveInline = async (id: string) => {
    if (!editRowData.descricao || !editRowData.valor || !editRowData.conta) {
      alert("Preencha descrição, conta e valor.");
      return;
    }

    try {
      setSavingRow(true);
      const originalRow = lancamentos.find(l => l.id === id);
      const diffs = [];
      if (originalRow) {
        if (originalRow.descricao !== editRowData.descricao) diffs.push(`Descrição: ${originalRow.descricao} ➔ ${editRowData.descricao}`);
        if (originalRow.data !== editRowData.data) diffs.push(`Data: ${originalRow.data} ➔ ${editRowData.data}`);
        if (parseFloat(originalRow.valor).toFixed(2) !== parseFloat(editRowData.valor.toString().replace(",", ".")).toFixed(2)) diffs.push(`Valor: R$ ${originalRow.valor} ➔ R$ ${editRowData.valor}`);
        if ((originalRow.fornecedor || "") !== (editRowData.fornecedor || "")) diffs.push(`Fornecedor: ${originalRow.fornecedor || "-"} ➔ ${editRowData.fornecedor || "-"}`);
        if ((originalRow.categoria || "") !== (editRowData.categoria || "")) diffs.push(`Categoria: ${originalRow.categoria || "-"} ➔ ${editRowData.categoria || "-"}`);
        if (originalRow.conta !== editRowData.conta) diffs.push(`Conta: ${originalRow.conta} ➔ ${editRowData.conta}`);
      }

      const hasChanges = diffs.length > 0;
      let observacaoAdicional = null;
      if (originalRow && originalRow.status_revisao === 'pending_user' && hasChanges) {
        const prev = originalRow.revisao_observacao;
        const prefix = (prev && prev !== "Sem alterações") ? prev + " | " : "";
        observacaoAdicional = prefix + diffs.join(", ");
      } else if (originalRow) {
        observacaoAdicional = originalRow.revisao_observacao;
      }

      const payload: any = {
        data: editRowData.data,
        descricao: editRowData.descricao,
        fornecedor: editRowData.fornecedor || null,
        valor: parseFloat(editRowData.valor.toString().replace(",", ".")),
        categoria: editRowData.categoria || null,
        conta: editRowData.conta,
        status_revisao: isAdmin ? null : (hasChanges ? 'pending_admin' : (originalRow.status_revisao || 'pending_user')),
        revisao_observacao: observacaoAdicional
      };

      if (hasChanges) {
        payload.updated_at = new Date().toISOString();
      }

      const { error } = await supabase.from("lancamentos_financeiros").update(payload).eq("id", id);
      if (error) throw error;

      setEditingId(null);
      fetchLancamentosRef.current?.();
    } catch (err: any) {
      console.error("Erro ao salvar edição:", err);
      alert("Erro ao atualizar lançamento.");
    } finally {
      setSavingRow(false);
    }
  };

  const handleEdit = (lancamento: any) => {
    setEditingId(lancamento.id);
    setEditRowData({
      data: lancamento.data,
      descricao: lancamento.descricao,
      fornecedor: lancamento.fornecedor || "",
      valor: lancamento.valor.toString(),
      categoria: lancamento.categoria || "",
      conta: lancamento.conta
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja excluir este lançamento?")) {
      try {
        if (isAdmin) {
          const { error } = await supabase.from("lancamentos_financeiros").delete().eq("id", id);
          if (error) throw error;
          fetchLancamentosRef.current?.();
        } else {
          const { error } = await supabase.from("lancamentos_financeiros").update({ status_revisao: 'pending_delete' }).eq("id", id);
          if (error) throw error;
          fetchLancamentosRef.current?.();
        }
      } catch (err) {
        console.error("Erro ao excluir:", err);
        alert("Erro ao excluir lançamento.");
      }
    }
  }

  const handleUpdateReviewStatus = async (id: string, newStatus: string | null) => {
    try {
      const { error } = await supabase
        .from("lancamentos_financeiros")
        .update({ status_revisao: newStatus, revisao_observacao: null })
        .eq("id", id);

      if (error) throw error;
      fetchLancamentosRef.current?.();
    } catch (err) {
      console.error("Erro ao alterar status de revisão:", err);
      alert("Erro ao alterar status.");
    }
  };

  const handleLoadMore = () => {
    setLimit(prev => prev + 100);
  };

  return (
    <>
      <Helmet>
        <title>Lançamentos Financeiros</title>
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
            <h1>Lançamentos Financeiros</h1>
            <p>Registre receitas e despesas. Acompanhe o fluxo de caixa detalhado.</p>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, color: "#334155", fontSize: "1.8rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsPlusCircleFill style={{ color: "var(--primary-color)" }} />
                Novo Lançamento
              </h3>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end" }}>

              <div style={{ flex: "2 1 200px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Pagamento Fornecedor X"
                  value={newRow.descricao}
                  onChange={(e) => setNewRow({ ...newRow, descricao: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", height: "54px", fontSize: "1.4rem" }}
                  required
                />
              </div>

              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Data</label>
                <input
                  type="date"
                  value={newRow.data}
                  onChange={(e) => setNewRow({ ...newRow, data: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "54px", fontSize: "1.4rem" }}
                  required
                />
              </div>

              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Valor (R$)</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <span style={{ position: "absolute", left: "12px", color: "#94a3b8", zIndex: 1, pointerEvents: "none", fontSize: "1.2rem", fontWeight: "bold" }}>R$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="no-spinner"
                    placeholder="0.00"
                    value={newRow.valor}
                    onChange={(e) => setNewRow({ ...newRow, valor: e.target.value })}
                    onBlur={(e) => {
                      if (e.target.value) {
                        setNewRow({ ...newRow, valor: parseFloat(e.target.value).toFixed(2) });
                      }
                    }}
                    style={{ width: "100%", padding: "8px 8px 8px 36px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "54px", fontSize: "1.4rem" }}
                    required
                  />
                </div>
              </div>

              <div style={{ flex: "2 1 220px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>
                  {parseFloat(String(newRow.valor || "0").replace(",", ".")) >= 0 ? "Cliente" : "Fornecedor"}
                </label>
                <Select
                  options={parseFloat(String(newRow.valor || "0").replace(",", ".")) >= 0 ? clienteOptions : fornecedorOptions}
                  value={
                    (parseFloat(String(newRow.valor || "0").replace(",", ".")) >= 0
                      ? clienteOptions.find(o => o.value === newRow.fornecedor)
                      : fornecedorOptions.find(o => o.value === newRow.fornecedor)) || null
                  }
                  onChange={(option: any) => setNewRow({ ...newRow, fornecedor: option ? option.value : null })}
                  placeholder={parseFloat(String(newRow.valor || "0").replace(",", ".")) >= 0 ? "Buscar Cliente..." : "Buscar Fornecedor..."}
                  isClearable
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
              </div>

              <div style={{ flex: "2 1 220px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Categoria</label>
                <Select
                  options={categoriaOptionsAll}
                  value={categoriaOptionsAll.flatMap(g => g.options).find(o => o.value === newRow.categoria) || null}
                  onChange={(option: any) => setNewRow({ ...newRow, categoria: option ? option.value : null })}
                  placeholder="Buscar Categoria..."
                  isClearable
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
              </div>

              <div style={{ flex: "2 1 220px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Conta</label>
                <Select
                  options={contaOptions}
                  value={contaOptions.find(o => o.value === newRow.conta) || null}
                  onChange={(option: any) => setNewRow({ ...newRow, conta: option ? option.value : "" })}
                  placeholder="Buscar Conta..."
                  isClearable
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
              </div>

              <div style={{ flex: "0 0 130px", position: "relative" }}>
                <button
                  type="submit"
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
                  <Icons.BsCheckCircleFill /> Adicionar
                </button>
              </div>
            </form>
          </div>

          {/* Barra de Filtros e Ordenação Globais */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap", marginBottom: "12px", padding: "0 20px", alignItems: "center" }}>

            {/* Campo de Filtro de Mês */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "4px", padding: "4px 10px", height: "32px", boxSizing: "border-box" }}>
              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "bold" }}>Mês:</span>
              <input
                type="month"
                value={filterMes}
                onChange={(e) => {
                  setFilterMes(e.target.value);
                  if (e.target.value) {
                    setFilterData(""); // Limpa o filtro de data específica se selecionar um mês completo
                  }
                }}
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: "0.85rem",
                  color: "#334155",
                  fontFamily: "inherit",
                  cursor: "pointer",
                  padding: 0,
                  height: "100%"
                }}
              />
            </div>

            {/* Botão Sem Categoria */}
            {activeTab === 'normal' && (
              <button
                onClick={() => {
                  const newNoCat = !filterNoCategory;
                  setFilterNoCategory(newNoCat);
                  if (newNoCat) {
                    setFilterCategoria(null); // Limpa o filtro de categoria específica
                  }
                }}
                style={{
                  padding: "6px 12px",
                  backgroundColor: filterNoCategory ? "#fffbeb" : "#fff",
                  color: filterNoCategory ? "#b45309" : "#64748b",
                  border: `1px solid ${filterNoCategory ? "#fde68a" : "#e2e8f0"}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: filterNoCategory ? "bold" : "normal",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.85rem",
                  transition: "0.2s"
                }}
                title="Filtrar lançamentos sem categoria"
              >
                <Icons.BsExclamationTriangleFill style={{ color: filterNoCategory ? "#d97706" : "#cbd5e1" }} />
                Sem Categoria
              </button>
            )}

            <button
              onClick={() => {
                const newOrder = !filterCreatedToday;
                setFilterCreatedToday(newOrder);
              }}
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
              title="Alternar ordenação (Data x Data de Criação)"
            >
              <Icons.BsSortDown /> {filterCreatedToday ? "Ordem: Criação" : "Ordem: Data"}
            </button>

            <button
              onClick={() => {
                const newStatus = filterStatus === 'review' ? 'all' : 'review';
                setFilterStatus(newStatus);
                if (newStatus === 'review') {
                  setFilterData("");
                  setFilterDescricao("");
                  setFilterFornecedor(null);
                  setFilterCategoria(null);
                  setFilterConta(null);
                  setFilterMes("");
                  setFilterNoCategory(false);
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
            >
              <Icons.BsExclamationTriangleFill /> Revisão {pendingReviewCount > 0 ? `(${pendingReviewCount})` : ""}
            </button>
            {(isAdmin || filterStatus === 'deleted') && (
              <button
                onClick={() => {
                  const newStatus = filterStatus === 'deleted' ? 'all' : 'deleted';
                  setFilterStatus(newStatus);
                  if (newStatus === 'deleted') {
                    setFilterData("");
                    setFilterDescricao("");
                    setFilterFornecedor(null);
                    setFilterCategoria(null);
                    setFilterConta(null);
                    setFilterMes("");
                    setFilterNoCategory(false);
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
              >
                <Icons.BsTrashFill /> Deletados {pendingDeleteCount > 0 ? `(${pendingDeleteCount})` : ""}
              </button>
            )}
            <button
              onClick={() => {
                setFilterData("");
                setFilterDescricao("");
                setFilterFornecedor(null);
                setFilterCategoria(null);
                setFilterConta(null);
                setFilterStatus('all');
                setFilterCreatedToday(false);
                setFilterMes("");
                setFilterNoCategory(false);
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
                gap: "4px"
              }}
            >
              <Icons.BsXCircleFill /> Limpar
            </button>
            <button
              onClick={() => fetchLancamentosRef.current?.()}
              style={{
                padding: "6px 12px",
                backgroundColor: "#f1f5f9",
                color: "#475569",
                border: "1px solid #cbd5e1",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Icons.BsArrowClockwise /> Atualizar
            </button>
          </div>

          {/* Tabs para separar lançamentos normais das vendas das lojas */}
          <div style={{
            display: "flex",
            gap: "8px",
            borderBottom: "2px solid #e2e8f0",
            marginBottom: "16px",
            marginTop: "16px",
            padding: "0 4px"
          }}>
            <button
              onClick={() => {
                setActiveTab('normal');
                setFilterCategoria(null); // Limpa o filtro de categoria específica que possa pertencer à outra aba
              }}
              style={{
                padding: "10px 20px",
                fontSize: "1.4rem",
                fontWeight: "bold",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: activeTab === 'normal' ? "3px solid var(--primary-color)" : "3px solid transparent",
                color: activeTab === 'normal' ? "var(--primary-color)" : "#64748b",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Icons.BsFileText /> Lançamentos Normais
            </button>
            <button
              onClick={() => {
                setActiveTab('vendas');
                setFilterCategoria(null); // Limpa o filtro de categoria específica que possa pertencer à outra aba
              }}
              style={{
                padding: "10px 20px",
                fontSize: "1.4rem",
                fontWeight: "bold",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: activeTab === 'vendas' ? "3px solid var(--primary-color)" : "3px solid transparent",
                color: activeTab === 'vendas' ? "var(--primary-color)" : "#64748b",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Icons.BsShop /> Vendas das Lojas
            </button>
          </div>

          <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", marginTop: "16px" }}>
            <table className="freq-table" style={{ minWidth: "1250px" }}>
              <thead>
                <tr>
                  <th style={{ width: "220px", minWidth: "220px" }}>Descrição</th>
                  <th style={{ textAlign: "center", width: "130px", minWidth: "130px" }}>Data</th>
                  <th style={{ textAlign: "center", width: "110px", minWidth: "110px" }}>Valor</th>
                  <th style={{ textAlign: "center", width: "180px", minWidth: "180px" }}>Fornecedor</th>
                  <th style={{ textAlign: "center", width: "180px", minWidth: "180px" }}>Categoria</th>
                  <th style={{ textAlign: "center", width: "180px", minWidth: "180px" }}>Conta</th>
                  <th style={{ textAlign: "center", width: "90px", minWidth: "90px" }}>Tipo</th>
                  {isAdmin && <th style={{ textAlign: "center", width: "140px", minWidth: "140px" }}>Usuário</th>}
                  <th style={{ textAlign: "center", width: "100px", minWidth: "100px" }}>Ações</th>
                </tr>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "8px", minWidth: "220px" }}>
                    <input
                      type="text"
                      placeholder="Descrição..."
                      value={filterDescricao}
                      onChange={(e) => setFilterDescricao(e.target.value)}
                      style={{ width: "100%", height: "38px", padding: "6px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.2rem", boxSizing: "border-box" }}
                    />
                  </th>
                  <th style={{ padding: "8px", minWidth: "130px" }}>
                    <input
                      type="date"
                      value={filterData}
                      onChange={(e) => {
                        setFilterData(e.target.value);
                        if (e.target.value) {
                          setFilterMes(""); // Limpa o filtro de mês se selecionar um dia específico
                        }
                      }}
                      style={{ width: "100%", height: "38px", padding: "6px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.2rem", boxSizing: "border-box" }}
                    />
                  </th>
                  <th style={{ minWidth: "110px" }}></th>
                  <th style={{ padding: "8px", minWidth: "180px" }}>
                    <Select
                      menuPortalTarget={document.body}
                      options={fornecedorOptions}
                      value={filterFornecedor ? (fornecedorOptions.find(o => o.value === filterFornecedor) || { value: filterFornecedor, label: filterFornecedor }) : null}
                      onChange={(sel: any) => setFilterFornecedor(sel ? sel.value : null)}
                      placeholder="Fornecedor..."
                      isClearable
                      styles={filterSelectStyles}
                    />
                  </th>
                  <th style={{ padding: "8px", minWidth: "180px" }}>
                    <Select
                      menuPortalTarget={document.body}
                      options={categoriaOptions}
                      value={filterCategoria ? (categoriaOptions.flatMap(g => g.options).find(o => o.value === filterCategoria) || { value: filterCategoria, label: filterCategoria }) : null}
                      onChange={(sel: any) => {
                        setFilterCategoria(sel ? sel.value : null);
                        if (sel) {
                          setFilterNoCategory(false); // Desmarca o filtro global "Sem Categoria" ao escolher uma categoria específica
                        }
                      }}
                      placeholder="Categoria..."
                      isClearable
                      styles={filterSelectStyles}
                    />
                  </th>
                  <th style={{ padding: "8px", minWidth: "180px" }}>
                    <Select
                      menuPortalTarget={document.body}
                      options={contaOptions}
                      value={filterConta ? (contaOptions.find(o => o.value === filterConta) || { value: filterConta, label: filterConta }) : null}
                      onChange={(sel: any) => setFilterConta(sel ? sel.value : null)}
                      placeholder="Conta..."
                      isClearable
                      styles={filterSelectStyles}
                    />
                  </th>
                  <th style={{ minWidth: "90px" }}></th>
                  {isAdmin && <th style={{ minWidth: "140px" }}></th>}
                  <th style={{ minWidth: "100px" }}></th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const lancamentosFiltrados = lancamentos;

                  if (lancamentosFiltrados.length === 0) {
                    return (
                      <tr>
                        <td colSpan={isAdmin ? 9 : 8} style={{ textAlign: "center", padding: "24px", color: "#94a3b8", fontSize: "1.3rem" }}>
                          Nenhum lançamento encontrado.
                        </td>
                      </tr>
                    );
                  }

                  const hoje = lancamentosFiltrados.filter(l => l.data === getToday());
                  const anteriores = lancamentosFiltrados.filter(l => l.data !== getToday());

                  const renderRow = (l: any) => {
                    const diffMin = l.created_at ? (new Date().getTime() - new Date(l.created_at).getTime()) / (1000 * 60) : -1;
                    const isRowNew = diffMin >= 0 && diffMin < 60; // 1 hora de duração

                    const diffEditMin = l.updated_at ? (new Date().getTime() - new Date(l.updated_at).getTime()) / (1000 * 60) : -1;
                    const isRowEdited = l.updated_at && diffEditMin >= 0 && diffEditMin < 60; // 1 hora de duração

                    return (
                      <tr key={l.id} style={l.status_revisao === 'pending_delete' ? { backgroundColor: "#fecaca" } : l.status_revisao === 'pending_user' ? { backgroundColor: "#fee2e2" } : l.status_revisao === 'pending_admin' ? { backgroundColor: "#ffedd5" } : {}}>
                        {editingId === l.id ? (
                          <>
                            <td>
                              <input
                                type="text"
                                value={editRowData.descricao || ""}
                                onChange={(e) => setEditRowData({ ...editRowData, descricao: e.target.value })}
                                style={{ width: "100%", height: "36px", padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "1.3rem" }}
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                type="date"
                                value={editRowData.data || ""}
                                onChange={(e) => setEditRowData({ ...editRowData, data: e.target.value })}
                                style={{ width: "100%", height: "36px", padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "1.3rem" }}
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <input
                                type="number"
                                step="0.01"
                                className="no-spinner"
                                value={editRowData.valor || ""}
                                onChange={(e) => setEditRowData({ ...editRowData, valor: e.target.value })}
                                onBlur={(e) => {
                                  if (e.target.value) {
                                    setEditRowData({ ...editRowData, valor: parseFloat(e.target.value).toFixed(2) });
                                  }
                                }}
                                style={{ width: "100%", height: "36px", padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", boxSizing: "border-box", fontSize: "1.3rem" }}
                              />
                            </td>
                             <td style={{ textAlign: "center" }}>
                               <Select
                                 isClearable
                                 options={parseFloat(String(editRowData.valor || "0").replace(",", ".")) >= 0 ? clienteOptions : fornecedorOptions}
                                 value={
                                   (parseFloat(String(editRowData.valor || "0").replace(",", ".")) >= 0
                                     ? clienteOptions.find(o => o.value === editRowData.fornecedor)
                                     : fornecedorOptions.find(o => o.value === editRowData.fornecedor)) || null
                                 }
                                 onChange={(option: any) => setEditRowData({ ...editRowData, fornecedor: option ? option.value : null })}
                                 menuPortalTarget={document.body}
                                 placeholder={parseFloat(String(editRowData.valor || "0").replace(",", ".")) >= 0 ? "Cliente..." : "Fornecedor..."}
                                 styles={{ ...selectStyles, control: (b: any) => ({ ...b, minHeight: '36px', height: '36px', fontSize: '1.3rem' }), valueContainer: (b: any) => ({ ...b, padding: '0 8px' }) }}
                               />
                             </td>
                            <td style={{ textAlign: "center" }}>
                              <Select
                                isClearable
                                options={categoriaOptionsAll}
                                value={categoriaOptionsAll.flatMap(g => g.options).find(o => o.value === editRowData.categoria) || null}
                                onChange={(option: any) => setEditRowData({ ...editRowData, categoria: option ? option.value : null })}
                                menuPortalTarget={document.body}
                                styles={{ ...selectStyles, control: (b: any) => ({ ...b, minHeight: '36px', height: '36px', fontSize: '1.3rem' }), valueContainer: (b: any) => ({ ...b, padding: '0 8px' }) }}
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <Select
                                options={contaOptions}
                                value={contaOptions.find(o => o.value === editRowData.conta) || null}
                                onChange={(option: any) => setEditRowData({ ...editRowData, conta: option ? option.value : "" })}
                                menuPortalTarget={document.body}
                                styles={{ ...selectStyles, control: (b: any) => ({ ...b, minHeight: '36px', height: '36px', fontSize: '1.3rem' }), valueContainer: (b: any) => ({ ...b, padding: '0 8px' }) }}
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <span style={{
                                background: parseFloat(editRowData.valor || 0) >= 0 ? "#dcfce7" : "#fee2e2",
                                color: parseFloat(editRowData.valor || 0) >= 0 ? "#15803d" : "#b91c1c",
                                padding: "4px 8px",
                                borderRadius: "12px",
                                fontWeight: "bold",
                                fontSize: "1.1rem"
                              }}>
                                {parseFloat(editRowData.valor || 0) >= 0 ? "Entrada" : "Saída"}
                              </span>
                            </td>
                            {isAdmin && <td></td>}
                            <td style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "8px" }}>
                              <button
                                onClick={() => handleSaveInline(l.id)}
                                style={{ backgroundColor: "transparent", border: "none", color: "#15803d", cursor: "pointer", fontSize: "1.6rem", padding: "4px", margin: 0 }}
                                title="Salvar"
                              >
                                <Icons.BsCheckCircleFill />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                style={{ backgroundColor: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.6rem", padding: "4px", margin: 0 }}
                                title="Cancelar"
                              >
                                <Icons.BsXCircleFill />
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
                                {(l.status_revisao === 'admin_only' || isRowNew || isRowEdited || l.conciliado) && (
                                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                    {l.status_revisao === 'admin_only' && (
                                      <span style={{
                                        backgroundColor: "#3b82f6",
                                        color: "#ffffff",
                                        fontSize: "0.9rem",
                                        fontWeight: "bold",
                                        padding: "2px 6px",
                                        borderRadius: "4px",
                                        textTransform: "uppercase",
                                        lineHeight: "1.1",
                                        display: "inline-block",
                                        letterSpacing: "0.03em"
                                      }}>
                                        Somente Admin
                                      </span>
                                    )}
                                    {isRowNew && (
                                      <span style={{
                                        backgroundColor: "#10b981",
                                        color: "#ffffff",
                                        fontSize: "0.9rem",
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
                                    {isRowEdited && (
                                      <span style={{
                                        backgroundColor: "#f97316",
                                        color: "#ffffff",
                                        fontSize: "0.9rem",
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
                                    {l.conciliado && (
                                      <span style={{
                                        backgroundColor: "#e0f2fe",
                                        color: "#0369a1",
                                        border: "1px solid #bae6fd",
                                        fontSize: "0.9rem",
                                        fontWeight: "bold",
                                        padding: "2px 6px",
                                        borderRadius: "4px",
                                        textTransform: "uppercase",
                                        lineHeight: "1.1",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        letterSpacing: "0.03em"
                                      }}>
                                        <Icons.BsCheckCircleFill style={{ fontSize: "0.95rem", color: "#0284c7" }} />
                                        Conciliado
                                      </span>
                                    )}
                                  </div>
                                )}
                                <span>{l.descricao}</span>
                              </div>
                            </td>
                            <td style={{ textAlign: "center" }}>{new Date(l.data).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</td>
                            <td style={{ textAlign: "center", fontWeight: "bold", color: l.valor < 0 ? "#ef4444" : "#334155", fontSize: "1.3rem" }}>
                              R$ {l.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ textAlign: "center" }}>{l.fornecedor || "-"}</td>
                            <td style={{ textAlign: "center" }}>
                              {l.categoria ? (
                                <span>{l.categoria}</span>
                              ) : (
                                <span 
                                  onClick={() => handleEdit(l)}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    backgroundColor: "#fffbeb",
                                    color: "#b45309",
                                    border: "1px solid #fde68a",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    fontWeight: "bold",
                                    fontSize: "1.1rem",
                                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-in-out"
                                  }} 
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#fef3c7";
                                    e.currentTarget.style.borderColor = "#fcd34d";
                                    e.currentTarget.style.transform = "scale(1.03)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#fffbeb";
                                    e.currentTarget.style.borderColor = "#fde68a";
                                    e.currentTarget.style.transform = "scale(1)";
                                  }}
                                  title="Clique para definir uma categoria para este lançamento."
                                >
                                  <Icons.BsExclamationTriangleFill style={{ color: "#d97706", fontSize: "1.2rem" }} />
                                  Sem Categoria
                                </span>
                              )}
                            </td>
                            <td style={{ textAlign: "center" }}>{contaOptions.find(o => o.value === l.conta)?.label || l.conta}</td>
                            <td style={{ textAlign: "center" }}>
                              <span style={{
                                background: l.valor >= 0 ? "#dcfce7" : "#fee2e2",
                                color: l.valor >= 0 ? "#15803d" : "#b91c1c",
                                padding: "4px 8px",
                                borderRadius: "12px",
                                fontWeight: "bold",
                                fontSize: "1.1rem"
                              }}>
                                {l.valor >= 0 ? "Entrada" : "Saída"}
                              </span>
                            </td>
                            {isAdmin && (
                              <td style={{ textAlign: "center" }}>
                                <span
                                  title={l.created_at ? new Date(l.created_at).toLocaleString("pt-BR") : ""}
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
                                  {profilesMap[l.user_id] || "-"}
                                </span>
                              </td>
                            )}
                            <td style={{ textAlign: "center" }}>
                              <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
                                {l.status_revisao === 'pending_delete' ? (
                                  <>
                                    {isAdmin && (
                                      <button
                                        onClick={() => handleDelete(l.id)}
                                        title="Excluir permanentemente"
                                        style={{
                                          padding: "4px 8px",
                                          color: "#166534",
                                          backgroundColor: "#dcfce7",
                                          border: "1px solid #166534",
                                          borderRadius: "4px",
                                          cursor: "pointer",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "4px",
                                          fontWeight: "bold",
                                          fontSize: "1.1rem",
                                          margin: 0
                                        }}
                                      >
                                        <Icons.BsCheckAll style={{ fontSize: "1.4rem" }} /> Excluir
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleUpdateReviewStatus(l.id, null)}
                                      title="Restaurar Lançamento"
                                      style={{
                                        padding: "4px 8px",
                                        color: "#c2410c",
                                        backgroundColor: "#ffedd5",
                                        border: "1px solid #c2410c",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        fontWeight: "bold",
                                        fontSize: "1.1rem",
                                        margin: 0
                                      }}
                                    >
                                      <Icons.BsXCircle style={{ fontSize: "1.2rem" }} /> Restaurar
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {isAdmin && l.status_revisao === 'pending_admin' ? (
                                      <>
                                        {l.revisao_observacao && (
                                          <span title={l.revisao_observacao} style={{ padding: "4px 4px", fontSize: "1.1rem", color: "#ea580c", cursor: "help", display: "flex", alignItems: "center" }}>
                                            <Icons.BsInfoCircleFill />
                                          </span>
                                        )}
                                        <button
                                          onClick={() => handleUpdateReviewStatus(l.id, null)}
                                          title="Aprovar Correção"
                                          style={{ padding: "4px 8px", color: "#166534", backgroundColor: "#dcfce7", border: "1px solid #166534", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                                        >
                                          <Icons.BsCheckAll />
                                        </button>
                                        <button
                                          onClick={() => handleUpdateReviewStatus(l.id, 'pending_user')}
                                          title="Voltar para Revisão"
                                          style={{ padding: "4px 8px", color: "#c2410c", backgroundColor: "#ffedd5", border: "1px solid #c2410c", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                                        >
                                          <Icons.BsArrowCounterclockwise />
                                        </button>
                                        <button
                                          onClick={() => handleEdit(l)}
                                          className="nav-btn"
                                          title="Editar"
                                          style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                                        >
                                          <Icons.BsPencil />
                                        </button>
                                      </>
                                    ) : isAdmin && filterStatus === 'review' ? (
                                      <>
                                        {l.status_revisao === 'pending_user' && (
                                          <button
                                            onClick={() => handleUpdateReviewStatus(l.id, null)}
                                            title="Cancelar Revisão"
                                            style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#b91c1c", backgroundColor: "#fca5a5", border: "1px solid #b91c1c", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", margin: 0 }}
                                          >
                                            <Icons.BsXCircle /> Cancelar
                                          </button>
                                        )}
                                        <button
                                          onClick={() => handleEdit(l)}
                                          className="nav-btn"
                                          title="Editar"
                                          style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                                        >
                                          <Icons.BsPencil />
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        {l.status_revisao === 'pending_user' ? (
                                          isAdmin ? (
                                            <>
                                              <button
                                                onClick={() => handleUpdateReviewStatus(l.id, null)}
                                                title="Cancelar Revisão"
                                                style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#b91c1c", backgroundColor: "#fca5a5", border: "1px solid #b91c1c", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", margin: 0 }}
                                              >
                                                <Icons.BsXCircle /> Cancelar
                                              </button>
                                              <button
                                                onClick={() => handleEdit(l)}
                                                className="nav-btn"
                                                title="Editar"
                                                style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                                              >
                                                <Icons.BsPencil />
                                              </button>
                                            </>
                                          ) : (
                                            <button
                                              onClick={() => handleEdit(l)}
                                              title="Revisar Lançamento"
                                              style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#b91c1c", backgroundColor: "#fca5a5", border: "1px solid #b91c1c", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", margin: 0 }}
                                            >
                                              <Icons.BsExclamationCircle /> Revisar
                                            </button>
                                          )
                                        ) : (
                                          <>
                                            {isAdmin && (
                                              l.status_revisao === 'admin_only' ? (
                                                <button
                                                  onClick={() => handleUpdateReviewStatus(l.id, null)}
                                                  title="Tornar Público (Todos visualizam)"
                                                  style={{ padding: "4px 8px", fontSize: "1.1rem", color: "#3b82f6", backgroundColor: "transparent", border: "none", cursor: "pointer", display: "flex" }}
                                                >
                                                  <Icons.BsShieldLockFill />
                                                </button>
                                              ) : (!l.status_revisao || l.status_revisao === 'none') && (
                                                <button
                                                  onClick={() => handleUpdateReviewStatus(l.id, 'admin_only')}
                                                  title="Restringir aos Admins (Apenas admins visualizam)"
                                                  style={{ padding: "4px 8px", fontSize: "1.1rem", color: "#64748b", backgroundColor: "transparent", border: "none", cursor: "pointer", display: "flex" }}
                                                >
                                                  <Icons.BsShieldLock />
                                                </button>
                                              )
                                            )}
                                            {isAdmin && (!l.status_revisao || l.status_revisao === 'none') && (
                                              <button
                                                onClick={() => handleUpdateReviewStatus(l.id, 'pending_user')}
                                                title="Marcar para Revisão"
                                                style={{ padding: "4px 8px", fontSize: "1.1rem", color: "#ef4444", backgroundColor: "transparent", border: "none", cursor: "pointer", display: "flex" }}
                                              >
                                                <Icons.BsExclamationCircleFill />
                                              </button>
                                            )}
                                            <button
                                              onClick={() => handleEdit(l)}
                                              className="nav-btn"
                                              title="Editar"
                                              style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                                            >
                                              <Icons.BsPencil />
                                            </button>
                                          </>
                                        )}
                                      </>
                                    )}
                                    {!(!isAdmin && (l.status_revisao === 'pending_user' || l.status_revisao === 'pending_admin')) && (
                                      <button
                                        onClick={() => handleDelete(l.id)}
                                        className="delete-record-btn"
                                        title="Excluir"
                                        style={{ margin: 0, padding: "4px 8px", fontSize: "0.9rem" }}
                                      >
                                        <Icons.BsTrash />
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  };

                  return (
                    <>
                      {hoje.length > 0 && (
                        <>
                          <tr style={{ backgroundColor: "#f0fdf4", borderBottom: "1px solid #bbf7d0", borderTop: "1px solid #bbf7d0" }}>
                            <td colSpan={isAdmin ? 9 : 8} style={{ textAlign: "center", padding: "10px", color: "#166534", fontWeight: "bold", fontSize: "1.15rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                              Lançamentos de Hoje
                            </td>
                          </tr>
                          {hoje.map(renderRow)}
                        </>
                      )}
                      {anteriores.length > 0 && (
                        <>
                          <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #cbd5e1", borderTop: "1px solid #cbd5e1" }}>
                            <td colSpan={isAdmin ? 9 : 8} style={{ textAlign: "center", padding: "10px", color: "#475569", fontWeight: "bold", fontSize: "1.15rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                              Lançamentos Anteriores
                            </td>
                          </tr>
                          {anteriores.map(renderRow)}
                        </>
                      )}
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginTop: "24px", marginBottom: "24px" }}>
            <span style={{ fontSize: "1.3rem", color: "#64748b" }}>
              Mostrando <strong style={{ fontWeight: "bold", color: "#334155" }}>{lancamentos.length}</strong> de <strong style={{ fontWeight: "bold", color: "#334155" }}>{totalCount}</strong> totais
            </span>
            {hasMore && (
              <button
                onClick={handleLoadMore}
                style={{
                  padding: "12px 32px",
                  backgroundColor: "#f8fafc",
                  color: "#78593e",
                  border: "1px solid #cbd5e1",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1.4rem",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f1f5f9";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#94a3b8";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f8fafc";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#cbd5e1";
                }}
              >
                Carregar mais 100 linhas...
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default LancamentosFinanceiros;
