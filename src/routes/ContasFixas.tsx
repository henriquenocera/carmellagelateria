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

function ContasFixas() {
  const { isAdmin, user } = useAuth();

  const [categoriasDb, setCategoriasDb] = useState<any[]>([]);
  const [fornecedoresDb, setFornecedoresDb] = useState<any[]>([]);
  const [clientesDb, setClientesDb] = useState<any[]>([]);
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [profilesMap, setProfilesMap] = useState<{[key: string]: string}>({});
  const [contasDb, setContasDb] = useState<any[]>([]);
  const [savingRow, setSavingRow] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRowData, setEditRowData] = useState<any>({});

  const [confirmingLancamento, setConfirmingLancamento] = useState<any | null>(null);
  const [confirmData, setConfirmData] = useState<string>("");
  const [selectedConta, setSelectedConta] = useState<string>("");
  const [confirmingLoading, setConfirmingLoading] = useState(false);

  const [filterDia, setFilterDia] = useState("");
  const [filterDescricao, setFilterDescricao] = useState("");
  const [filterFornecedor, setFilterFornecedor] = useState<string | null>(null);
  const [filterCategoria, setFilterCategoria] = useState<string | null>(null);
  const [filterTipo, setFilterTipo] = useState<string | null>(null);

  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [newRow, setNewRow] = useState({
    dia_vencimento: 1,
    descricao: "",
    fornecedor_cliente: "",
    valor: "",
    categoria: ""
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
      minWidth: '120px',
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
  const pessoaOptions = [
    { label: 'Fornecedores', options: fornecedorOptions },
    { label: 'Clientes', options: clienteOptions }
  ];

  const getPessoaOptions = (valorStr: string) => {
    if (!valorStr) return pessoaOptions;
    const val = parseFloat(valorStr.replace(",", ".") || "0");
    if (val < 0) return [{ label: 'Fornecedores', options: fornecedorOptions }];
    if (val > 0) return [{ label: 'Clientes', options: clienteOptions }];
    return pessoaOptions;
  };

  const contaOptions = contasDb.map(c => {
    const label = [c.banco, c.agencia, c.conta_corrente].filter(Boolean).join(" - ");
    return { value: label, label: label };
  });

  const categoriaOptions = categoriasDb.filter(c => !c.parent_id).map(pai => ({
    label: pai.nome,
    options: categoriasDb.filter(sub => sub.parent_id === pai.id).map(sub => ({
      value: cleanCategoryName(sub.nome),
      label: sub.nome
    }))
  }));



  useEffect(() => {
    async function fetchData() {
      try {

        const { data: cData, error: cError } = await supabase
          .from("contas")
          .select("id, banco, agencia, conta_corrente")
          .eq("ativo", true)
          .order("banco", { ascending: true });

        if (!cError && cData) {
          setContasDb(cData);
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
          const map: {[key: string]: string} = {};
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

  const fetchLancamentosRef = useRef<any>(null);

  const fetchLancamentos = useCallback(async () => {
    fetchLancamentosRef.current = fetchLancamentos;
    try {
      let query = supabase
        .from("contas_fixas")
        .select("*")
        .order("dia_vencimento", { ascending: true })
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setLancamentos(data || []);
    } catch (err) {
      console.error("Erro ao buscar lançamentos:", err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchLancamentos();
    }
  }, [fetchLancamentos, user]);

  useEffect(() => {
    const channel = supabase.channel('realtime-lancamentos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contas_fixas' },
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



  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRow.descricao || !newRow.valor) {
      alert("Preencha descrição e valor.");
      return;
    }

    try {
      setSavingRow(true);
      let val = parseFloat(newRow.valor.replace(",", "."));

      const payload = {
        dia_vencimento: newRow.dia_vencimento,
        descricao: newRow.descricao,
        fornecedor_cliente: newRow.fornecedor_cliente || null,
        valor: val,
        categoria: newRow.categoria || null,
        user_id: user?.id
      };

      const { error } = await supabase.from("contas_fixas").insert([payload]);
      if (error) throw error;

      setNewRow({ dia_vencimento: 1, descricao: "", tipo: "pagar", valor: "", fornecedor: "", cliente: "", categoria: "" });
      fetchLancamentos();
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar lançamento: " + (err?.message || JSON.stringify(err)));
    } finally {
      setSavingRow(false);
    }
  };

  const handleSaveInline = async (id: string) => {
    if (!editRowData.descricao || !editRowData.valor) {
      alert("Preencha descrição e valor.");
      return;
    }

    try {
      setSavingRow(true);
      const originalRow = lancamentos.find(l => l.id === id);
      const diffs = [];
      if (originalRow) {
        if (originalRow.descricao !== editRowData.descricao) diffs.push(`Descrição`);
        if (originalRow.data !== editRowData.data) diffs.push(`Data`);
        if (parseFloat(originalRow.valor).toFixed(2) !== parseFloat(editRowData.valor.toString().replace(",", ".")).toFixed(2)) diffs.push(`Valor`);
      }

      const hasChanges = diffs.length > 0;

      let val = parseFloat(editRowData.valor.toString().replace(",", "."));

      const payload: any = {
        dia_vencimento: editRowData.dia_vencimento,
        descricao: editRowData.descricao,
        fornecedor_cliente: editRowData.fornecedor_cliente || null,
        valor: val,
        categoria: editRowData.categoria || null
      };

      if (hasChanges) {
        payload.updated_at = new Date().toISOString();
      }

      const { error } = await supabase.from("contas_fixas").update(payload).eq("id", id);
      if (error) throw error;

      setEditingId(null);
      fetchLancamentos();
    } catch (err: any) {
      console.error("Erro ao salvar edição:", err);
      alert("Erro ao atualizar lançamento: " + (err?.message || JSON.stringify(err)));
    } finally {
      setSavingRow(false);
    }
  };

  const handleEdit = (lancamento: any) => {
    setEditingId(lancamento.id);
    setEditRowData({
      dia_vencimento: lancamento.dia_vencimento,
      descricao: lancamento.descricao,
      fornecedor_cliente: lancamento.fornecedor_cliente || "",
      valor: lancamento.valor.toString(),
      categoria: lancamento.categoria || ""
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja excluir este lançamento?")) {
      try {
        const { error } = await supabase.from("contas_fixas").delete().eq("id", id);
        if (error) throw error;
        fetchLancamentos();
      } catch (err) {
        console.error("Erro ao excluir:", err);
        alert("Erro ao excluir lançamento.");
      }
    }
  }

  const handleConfirmar = async () => {
    if (!selectedConta) {
      alert("Selecione uma conta bancária para confirmar o lançamento.");
      return;
    }

    try {
      setConfirmingLoading(true);
      const payload = {
        dia_vencimento: confirmData,
        descricao: confirmingLancamento.descricao,
        fornecedor: confirmingLancamento.fornecedor_cliente,
        valor: confirmingLancamento.valor,
        categoria: confirmingLancamento.categoria,
        conta: selectedConta,
        user_id: user?.id,
        status_revisao: null
      };

      const { error: insertError } = await supabase.from("lancamentos_financeiros").insert([payload]);
      if (insertError) throw insertError;

      const { error: deleteError } = await supabase.from("contas_fixas").delete().eq("id", confirmingLancamento.id);
      if (deleteError) throw deleteError;

      setConfirmingLancamento(null);
        } catch (err: any) {
      console.error("Erro ao confirmar:", err);
      alert("Erro ao confirmar lançamento: " + (err?.message || JSON.stringify(err)));
    } finally {
      setConfirmingLoading(false);
    }
  };

  const lancamentosFiltrados = lancamentos.filter(l => {
    if (filterDia && String(l.dia_vencimento) !== filterDia) return false;
    if (filterDescricao && !l.descricao.toLowerCase().includes(filterDescricao.toLowerCase())) return false;
    if (filterFornecedor && l.fornecedor_cliente !== filterFornecedor) return false;
    if (filterCategoria && l.categoria !== filterCategoria) return false;
    if (filterTipo === "pagar" && l.valor >= 0) return false;
    if (filterTipo === "receber" && l.valor < 0) return false;
    return true;
  });

  const totalDespesas = lancamentosFiltrados.filter(l => l.valor < 0).reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <>
      <Helmet>
        <title>Contas a pagar e receber</title>
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
            <h1>Contas Fixas</h1>
            <p>Gerencie contas recorrentes e gere lançamentos automáticos.</p>
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
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Dia Vencimento</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={newRow.dia_vencimento}
                  onChange={(e) => setNewRow({ ...newRow, dia_vencimento: parseInt(e.target.value) || 1 })}
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
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>{newRow.valor && parseFloat(newRow.valor.replace(",", ".") || "0") < 0 ? "Fornecedor" : newRow.valor && parseFloat(newRow.valor.replace(",", ".") || "0") > 0 ? "Cliente" : "Fornecedor / Cliente"}</label>
                <Select
                  options={getPessoaOptions(newRow.valor)}
                  value={pessoaOptions.flatMap(g => g.options).find(o => o.value === newRow.fornecedor_cliente) || null}
                  onChange={(option: any) => setNewRow({ ...newRow, fornecedor_cliente: option ? option.value : "" })}
                  placeholder="Buscar..."
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

          {/* Resumo Financeiro */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px", backgroundColor: "#fff", padding: "16px 20px", borderRadius: "8px", borderLeft: "4px solid #ef4444", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
              <h4 style={{ margin: 0, color: "#64748b", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsArrowDownRightCircleFill style={{ color: "#ef4444" }} /> Total Despesas
              </h4>
              <p style={{ margin: "8px 0 0", color: "#ef4444", fontSize: "2rem", fontWeight: "bold" }}>R$ {Math.abs(totalDespesas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", marginTop: "16px" }}>
            <table className="freq-table" style={{ minWidth: "1000px" }}>
              <thead>
                <tr>
                  <th style={{ width: "250px" }}>Descrição</th>
                  <th style={{ textAlign: "center", width: "80px" }}>Dia</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Valor</th>
                  <th style={{ textAlign: "center", width: "150px" }}>Fornecedor / Cliente</th>
                  <th style={{ textAlign: "center", width: "150px" }}>Categoria</th>
                  <th style={{ textAlign: "center", width: "140px" }}>Tipo</th>
                  {isAdmin && <th style={{ textAlign: "center", width: "150px" }}>Usuário</th>}
                  <th style={{ textAlign: "center", width: "120px" }}>Ações</th>
                </tr>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "8px" }}>
                    <input
                      type="text"
                      placeholder="Descrição..."
                      value={filterDescricao}
                      onChange={(e) => setFilterDescricao(e.target.value)}
                      style={{ width: "100%", height: "38px", padding: "6px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.2rem", boxSizing: "border-box" }}
                    />
                  </th>
                  <th style={{ padding: "8px" }}>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      placeholder="Dia..."
                      value={filterDia}
                      onChange={(e) => setFilterDia(e.target.value)}
                      style={{ width: "100%", height: "38px", padding: "6px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.2rem", boxSizing: "border-box" }}
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
                      styles={filterSelectStyles}
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
                      styles={filterSelectStyles}
                    />
                  </th>
                  <th style={{ padding: "8px" }}>
                    <Select
                      menuPortalTarget={document.body}
                      options={[
                        { value: "pagar", label: "A Pagar" },
                        { value: "receber", label: "A Receber" }
                      ]}
                      value={filterTipo ? { value: filterTipo, label: filterTipo === "pagar" ? "A Pagar" : "A Receber" } : null}
                      onChange={(sel: any) => setFilterTipo(sel ? sel.value : null)}
                      placeholder="Tipo..."
                      isClearable
                      styles={filterSelectStyles}
                    />
                  </th>
                  {isAdmin && <th></th>}
                  <th style={{ padding: "8px", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                      <button
                        onClick={() => {
                          setFilterDia("");
                          setFilterDescricao("");
                          setFilterFornecedor(null);
                          setFilterCategoria(null);
                          setFilterTipo(null);
                          fetchLancamentos();
                        }}
                        style={{
                          padding: "6px 8px",
                          backgroundColor: "#cbd5e1",
                          color: "#334155",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        title="Limpar Filtros"
                      >
                        <Icons.BsXCircleFill />
                      </button>
                      <button
                        onClick={() => fetchLancamentos()}
                        style={{
                          padding: "6px 8px",
                          backgroundColor: "#f1f5f9",
                          color: "#475569",
                          border: "1px solid #cbd5e1",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        title="Atualizar Dados"
                      >
                        <Icons.BsArrowClockwise />
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  if (lancamentosFiltrados.length === 0) {
                    return (
                      <tr>
                        <td colSpan={isAdmin ? 9 : 8} style={{ textAlign: "center", padding: "24px", color: "#94a3b8", fontSize: "1.3rem" }}>
                          Nenhum lançamento encontrado.
                        </td>
                      </tr>
                    );
                  }

                  const renderRow = (l: any) => {
                    const diffMin = l.created_at ? (new Date().getTime() - new Date(l.created_at).getTime()) / (1000 * 60) : -1;
                    const diffEditMin = l.updated_at ? (new Date().getTime() - new Date(l.updated_at).getTime()) / (1000 * 60) : -1;
                    const isRowNew = l.created_at && diffMin >= 0 && diffMin < 60;
                    const isRowEdited = l.updated_at && diffEditMin >= 0 && diffEditMin < 60;

                    return (
                      <tr key={l.id}>
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
                                type="number"
                                min="1"
                                max="31"
                                value={editRowData.dia_vencimento}
                                onChange={(e) => setEditRowData({ ...editRowData, dia_vencimento: parseInt(e.target.value) || 1 })}
                                style={{ width: "100%", height: "36px", padding: "4px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", boxSizing: "border-box", fontSize: "1.3rem" }}
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
                            <td style={{ width: "20%" }}>
                              <Select
                                options={getPessoaOptions(editRowData.valor)}
                                value={pessoaOptions.flatMap(g => g.options).find(o => o.value === editRowData.fornecedor_cliente) || null}
                                onChange={(opt: any) => setEditRowData({ ...editRowData, fornecedor_cliente: opt ? opt.value : "" })}
                                placeholder="Selecionar..."
                                styles={filterSelectStyles}
                                menuPortalTarget={document.body}
                                isClearable
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <Select
                                options={categoriaOptions}
                                value={categoriaOptions.flatMap(g => g.options).find(o => o.value === editRowData.categoria) || null}
                                onChange={(option: any) => setEditRowData({ ...editRowData, categoria: option ? option.value : "" })}
                                menuPortalTarget={document.body}
                                styles={{ ...selectStyles, control: (b: any) => ({ ...b, minHeight: '36px', height: '36px', fontSize: '1.3rem' }), valueContainer: (b: any) => ({ ...b, padding: '0 8px' }) }}
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <span style={{
                                backgroundColor: parseFloat(editRowData.valor.toString().replace(",", ".") || "0") < 0 ? "#fee2e2" : "#dcfce7",
                                color: parseFloat(editRowData.valor.toString().replace(",", ".") || "0") < 0 ? "#b91c1c" : "#15803d",
                                padding: "4px 8px",
                                borderRadius: "12px",
                                fontWeight: "bold",
                                fontSize: "1.1rem",
                                display: "inline-block"
                              }}>
                                {parseFloat(editRowData.valor.toString().replace(",", ".") || "0") < 0 ? 'A Pagar' : 'A Receber'}
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
                                {(l.status_revisao === 'admin_only' || isRowNew || isRowEdited) && (
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
                                  </div>
                                )}
                                <span>{l.descricao}</span>
                              </div>
                            </td>
                            <td style={{ textAlign: "center", fontSize: "1.3rem", fontWeight: "bold" }}>{l.dia_vencimento}</td>
                            <td style={{ textAlign: "center", fontWeight: "bold", color: l.valor < 0 ? "#ef4444" : "#334155", fontSize: "1.3rem" }}>
                              R$ {l.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ textAlign: "center" }}>{l.fornecedor_cliente || "-"}</td>
                            <td style={{ textAlign: "center" }}>{l.categoria || "-"}</td>
                            <td style={{ textAlign: "center" }}>
                              <span style={{
                                background: l.valor >= 0 ? "#dcfce7" : "#fee2e2",
                                color: l.valor >= 0 ? "#15803d" : "#b91c1c",
                                padding: "4px 8px",
                                borderRadius: "12px",
                                fontWeight: "bold",
                                fontSize: "1.1rem"
                              }}>
                                {l.valor >= 0 ? "A Receber" : "A Pagar"}
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
                                <button
                                  onClick={() => handleEdit(l)}
                                  className="nav-btn"
                                  title="Editar"
                                  style={{ padding: "4px 8px", fontSize: "0.9rem" }}
                                >
                                  <Icons.BsPencil />
                                </button>
                                <button
                                  onClick={() => handleDelete(l.id)}
                                  className="delete-record-btn"
                                  title="Excluir"
                                  style={{ margin: 0, padding: "4px 8px", fontSize: "0.9rem" }}
                                >
                                  <Icons.BsTrash />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  };

                  return (
                    <>
                      {lancamentosFiltrados.map(renderRow)}
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
}

export default ContasFixas;
