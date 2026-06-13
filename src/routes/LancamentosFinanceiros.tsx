import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import { useAuth } from "../AuthProvider";
import supabase from "../services/supabase-client";
import "../css/Frequencia.css";

function LancamentosFinanceiros() {
  const { isAdmin, user } = useAuth();

  const [contasDb, setContasDb] = useState<any[]>([]);
  const [categoriasDb, setCategoriasDb] = useState<any[]>([]);
  const [fornecedoresDb, setFornecedoresDb] = useState<any[]>([]);
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [savingRow, setSavingRow] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRowData, setEditRowData] = useState<any>({});

  const [filterData, setFilterData] = useState("");
  const [filterDescricao, setFilterDescricao] = useState("");
  const [filterFornecedor, setFilterFornecedor] = useState<string | null>(null);
  const [filterCategoria, setFilterCategoria] = useState<string | null>(null);
  const [filterConta, setFilterConta] = useState<string | null>(null);
  const [filterCreatedToday, setFilterCreatedToday] = useState(false);

  const [filterStatus, setFilterStatus] = useState<'all' | 'review' | 'deleted'>('all');
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [pendingDeleteCount, setPendingDeleteCount] = useState(0);

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

  const fornecedorOptions = fornecedoresDb.map(f => ({ value: f.nome, label: f.nome }));

  const categoriaOptions = categoriasDb.filter(c => !c.parent_id).map(pai => ({
    label: pai.nome,
    options: categoriasDb.filter(sub => sub.parent_id === pai.id).map(sub => ({
      value: sub.nome,
      label: sub.nome
    }))
  }));

  const contaOptions = contasDb.map(c => {
    const label = [c.banco, c.agencia, c.conta_corrente].filter(Boolean).join(" - ");
    return { value: label, label: label };
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: contasData, error: contasError } = await supabase
          .from("contas")
          .select("id, banco, agencia, conta_corrente")
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

        await fetchLancamentos();
      } catch (err) {
        console.error("Erro ao buscar dados iniciais:", err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    checkPendingCounts();
  }, [lancamentos, isAdmin]);

  const checkPendingCounts = async () => {
    if (isAdmin) {
      const { count: revCount } = await supabase.from("lancamentos_financeiros").select("*", { count: 'exact', head: true }).in('status_revisao', ['pending_user', 'pending_admin']);
      setPendingReviewCount(revCount || 0);

      const { count: delCount } = await supabase.from("lancamentos_financeiros").select("*", { count: 'exact', head: true }).eq('status_revisao', 'pending_delete');
      setPendingDeleteCount(delCount || 0);
    }
  };

  async function fetchLancamentos(fStatus = filterStatus, orderCreated = filterCreatedToday) {
    try {
      let query = supabase
        .from("lancamentos_financeiros")
        .select("*");

      if (orderCreated) {
        query = query.order("created_at", { ascending: false }).order("data", { ascending: false });
      } else {
        query = query.order("data", { ascending: false }).order("created_at", { ascending: false });
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

      const { data, error } = await query;
      if (error) throw error;
      setLancamentos(data || []);

      checkPendingCounts();
    } catch (err) {
      console.error("Erro ao buscar lançamentos:", err);
    }
  }

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
        status_revisao: isAdmin ? null : 'pending_user'
      };

      const { error } = await supabase.from("lancamentos_financeiros").insert([payload]);
      if (error) throw error;

      setNewRow({ data: getToday(), descricao: "", valor: "", fornecedor: "", categoria: "", conta: "" });
      fetchLancamentos();
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
      const payload = {
        data: editRowData.data,
        descricao: editRowData.descricao,
        fornecedor: editRowData.fornecedor || null,
        valor: parseFloat(editRowData.valor.toString().replace(",", ".")),
        categoria: editRowData.categoria || null,
        conta: editRowData.conta,
        status_revisao: isAdmin ? null : 'pending_user'
      };

      const { error } = await supabase.from("lancamentos_financeiros").update(payload).eq("id", id);
      if (error) throw error;

      setEditingId(null);
      fetchLancamentos();
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
          fetchLancamentos();
        } else {
          const { error } = await supabase.from("lancamentos_financeiros").update({ status_revisao: 'pending_delete' }).eq("id", id);
          if (error) throw error;
          fetchLancamentos();
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
      fetchLancamentos();
    } catch (err) {
      console.error("Erro ao alterar status de revisão:", err);
      alert("Erro ao alterar status.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Lançamentos Financeiros</title>
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
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Fornecedor</label>
                <Select
                  options={fornecedorOptions}
                  value={fornecedorOptions.find(o => o.value === newRow.fornecedor) || null}
                  onChange={(option: any) => setNewRow({ ...newRow, fornecedor: option ? option.value : "" })}
                  placeholder="Buscar Fornecedor..."
                  isClearable
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
              </div>

              <div style={{ flex: "2 1 220px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Categoria</label>
                <Select
                  options={categoriaOptions}
                  value={categoriaOptions.flatMap(g => g.options).find(o => o.value === newRow.categoria) || null}
                  onChange={(option: any) => setNewRow({ ...newRow, categoria: option ? option.value : "" })}
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
          <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", marginTop: "16px" }}>
            <table className="freq-table" style={{ minWidth: "1000px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "center", width: "100px" }}>Data</th>
                  <th style={{ width: "150px" }}>Descrição</th>
                  <th style={{ textAlign: "right", width: "120px" }}>Valor</th>
                  <th style={{ width: "150px" }}>Fornecedor</th>
                  <th style={{ width: "150px" }}>Categoria</th>
                  <th style={{ width: "150px" }}>Conta</th>
                  <th style={{ textAlign: "center", width: "100px" }}>Tipo</th>
                  <th style={{ textAlign: "center", width: "80px" }}>Ações</th>
                </tr>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
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
                      placeholder="Descrição..."
                      value={filterDescricao}
                      onChange={(e) => setFilterDescricao(e.target.value)}
                      style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.1rem" }}
                    />
                  </th>
                  <th></th>
                  <th style={{ padding: "8px" }}>
                    <Select
                      menuPortalTarget={document.body}
                      options={fornecedorOptions}
                      value={filterFornecedor ? { value: filterFornecedor, label: filterFornecedor } : null}
                      onChange={(sel: any) => setFilterFornecedor(sel ? sel.value : null)}
                      placeholder="Fornecedor..."
                      isClearable
                      styles={{ control: (b) => ({ ...b, minHeight: '38px', fontSize: '1.1rem' }), menuPortal: (b) => ({ ...b, zIndex: 9999, fontSize: '1.1rem' }) }}
                    />
                  </th>
                  <th style={{ padding: "8px" }}>
                    <Select
                      menuPortalTarget={document.body}
                      options={categoriaOptions}
                      value={filterCategoria ? { value: filterCategoria, label: filterCategoria } : null}
                      onChange={(sel: any) => setFilterCategoria(sel ? sel.value : null)}
                      placeholder="Categoria..."
                      isClearable
                      styles={{ control: (b) => ({ ...b, minHeight: '38px', fontSize: '1.1rem' }), menuPortal: (b) => ({ ...b, zIndex: 9999, fontSize: '1.1rem' }) }}
                    />
                  </th>
                  <th style={{ padding: "8px" }}>
                    <Select
                      menuPortalTarget={document.body}
                      options={contaOptions}
                      value={filterConta ? { value: filterConta, label: filterConta } : null}
                      onChange={(sel: any) => setFilterConta(sel ? sel.value : null)}
                      placeholder="Conta..."
                      isClearable
                      styles={{ control: (b) => ({ ...b, minHeight: '38px', fontSize: '1.1rem' }), menuPortal: (b) => ({ ...b, zIndex: 9999, fontSize: '1.1rem' }) }}
                    />
                  </th>
                  <th colSpan={2} style={{ padding: "8px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "nowrap" }}>
                      <button
                        onClick={() => {
                          const newOrder = !filterCreatedToday;
                          setFilterCreatedToday(newOrder);
                          fetchLancamentos(filterStatus, newOrder);
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
                          }
                          fetchLancamentos(newStatus, filterCreatedToday);
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
                            }
                            fetchLancamentos(newStatus, filterCreatedToday);
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
                          fetchLancamentos('all', false);
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
                        onClick={() => fetchLancamentos(filterStatus, filterCreatedToday)}
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
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const lancamentosFiltrados = lancamentos.filter(l => {
                    if (filterData && l.data !== filterData) return false;
                    if (filterDescricao && !l.descricao.toLowerCase().includes(filterDescricao.toLowerCase())) return false;
                    if (filterFornecedor && l.fornecedor !== filterFornecedor) return false;
                    if (filterCategoria && l.categoria !== filterCategoria) return false;
                    if (filterConta && l.conta !== filterConta) return false;
                    return true;
                  });

                  if (lancamentosFiltrados.length === 0) {
                    return (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center", padding: "24px", color: "#94a3b8", fontSize: "1.3rem" }}>
                          Nenhum lançamento encontrado.
                        </td>
                      </tr>
                    );
                  }

                  return lancamentosFiltrados.map((l, i) => (
                    <tr key={l.id}>
                      {editingId === l.id ? (
                        <>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="date"
                              value={editRowData.data || ""}
                              onChange={(e) => setEditRowData({ ...editRowData, data: e.target.value })}
                              style={{ width: "100%", height: "36px", padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "1.3rem" }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={editRowData.descricao || ""}
                              onChange={(e) => setEditRowData({ ...editRowData, descricao: e.target.value })}
                              style={{ width: "100%", height: "36px", padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "1.3rem" }}
                            />
                          </td>
                          <td style={{ textAlign: "right" }}>
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
                              style={{ width: "100%", height: "36px", padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "right", boxSizing: "border-box", fontSize: "1.3rem" }}
                            />
                          </td>
                          <td>
                            <Select
                              options={fornecedorOptions}
                              value={fornecedorOptions.find(o => o.value === editRowData.fornecedor) || null}
                              onChange={(option: any) => setEditRowData({ ...editRowData, fornecedor: option ? option.value : "" })}
                              menuPortalTarget={document.body}
                              styles={{ ...selectStyles, control: (b: any) => ({ ...b, minHeight: '36px', height: '36px', fontSize: '1.3rem' }), valueContainer: (b: any) => ({ ...b, padding: '0 8px' }) }}
                            />
                          </td>
                          <td>
                            <Select
                              options={categoriaOptions}
                              value={categoriaOptions.flatMap(g => g.options).find(o => o.value === editRowData.categoria) || null}
                              onChange={(option: any) => setEditRowData({ ...editRowData, categoria: option ? option.value : "" })}
                              menuPortalTarget={document.body}
                              styles={{ ...selectStyles, control: (b: any) => ({ ...b, minHeight: '36px', height: '36px', fontSize: '1.3rem' }), valueContainer: (b: any) => ({ ...b, padding: '0 8px' }) }}
                            />
                          </td>
                          <td>
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
                          <td style={{ textAlign: "center" }}>{new Date(l.data).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</td>
                          <td>{l.descricao}</td>
                          <td style={{ textAlign: "right", fontWeight: "bold", color: l.valor < 0 ? "#ef4444" : "#334155", fontSize: "1.3rem" }}>
                            R$ {l.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td>{l.fornecedor || "-"}</td>
                          <td>{l.categoria || "-"}</td>
                          <td>{l.conta}</td>
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
                          <td style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "8px" }}>
                            {isAdmin && filterStatus === 'review' ? (
                              <button
                                onClick={() => handleUpdateReviewStatus(l.id, null)}
                                style={{ backgroundColor: "transparent", border: "none", color: "#15803d", cursor: "pointer", fontSize: "1.6rem", padding: "4px" }}
                                title="Aprovar Lançamento"
                              >
                                <Icons.BsCheckCircleFill />
                              </button>
                            ) : isAdmin && filterStatus === 'deleted' ? (
                              <button
                                onClick={() => handleUpdateReviewStatus(l.id, null)}
                                style={{ backgroundColor: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: "1.6rem", padding: "4px" }}
                                title="Cancelar Exclusão"
                              >
                                <Icons.BsArrowCounterclockwise />
                              </button>
                            ) : (
                              <>
                                {isAdmin && (!l.status_revisao || l.status_revisao === 'none') && (
                                  <button
                                    onClick={() => handleUpdateReviewStatus(l.id, 'pending_user')}
                                    title="Marcar para Revisão"
                                    style={{ backgroundColor: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.6rem", padding: "4px", margin: 0 }}
                                  >
                                    <Icons.BsExclamationCircleFill />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleEdit(l)}
                                  style={{ backgroundColor: "transparent", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "1.6rem", padding: "4px", margin: 0 }}
                                  title="Editar"
                                >
                                  <Icons.BsPencil />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(l.id)}
                              className="delete-record-btn"
                              title="Excluir"
                              style={{ margin: 0 }}
                            >
                              <Icons.BsTrash />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
}

export default LancamentosFinanceiros;
