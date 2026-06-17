import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import { useAuth } from "../AuthProvider";
import supabase from "../services/supabase-client";
import "../css/Frequencia.css";

function ContasPagarReceber() {
  const { user } = useAuth();

  // Database presence state
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  const [checkingTable, setCheckingTable] = useState(true);

  // DB Data lists
  const [contasBancarias, setContasBancarias] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [contasPagarReceberList, setContasPagarReceberList] = useState<any[]>([]);
  
  // Loading state
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [newRow, setNewRow] = useState({
    tipo: "Pagar", // Pagar or Receber
    descricao: "",
    fornecedor_cliente: "",
    valor: "",
    data_vencimento: getTodayStr(),
    categoria: ""
  });

  // Modal / Baixa states
  const [payingItem, setPayingItem] = useState<any | null>(null);
  const [baixaData, setBaixaData] = useState({
    data_pagamento: getTodayStr(),
    conta_pagamento: "",
    lancar_financeiro: true
  });

  // Filters state
  const [tabFiltro, setTabFiltro] = useState<"Todas" | "Pagar" | "Receber">("Todas");
  const [statusFiltro, setStatusFiltro] = useState<"Todos" | "Pendente" | "Pago" | "Atrasado">("Todos");
  const [buscaTexto, setBuscaTexto] = useState("");

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      height: '54px',
      minHeight: '54px',
      borderRadius: '4px',
      borderColor: '#cbd5e1',
      fontSize: '1.4rem',
      backgroundColor: 'var(--card-bg, #ffffff)',
      color: 'var(--text-dark, #2d241e)'
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

  // Check if target database table exists
  useEffect(() => {
    async function verifyTablePresence() {
      try {
        const { error } = await supabase
          .from("contas_pagar_receber")
          .select("id")
          .limit(1);

        if (error) {
          if (
            error.code === "PGRST205" || 
            (error.message && error.message.includes("relation \"public.contas_pagar_receber\" does not exist"))
          ) {
            setTableExists(false);
          } else {
            // If it is an RLS or auth issue, the table does exist, but we have error.
            // Let's assume table exists unless it is PGRST205
            setTableExists(true);
          }
        } else {
          setTableExists(true);
        }
      } catch (err) {
        console.error("Erro ao verificar existência da tabela contas_pagar_receber:", err);
        setTableExists(false);
      } finally {
        setCheckingTable(false);
      }
    }
    verifyTablePresence();
  }, []);

  // Fetch metadata options and accounts payable list if table exists
  useEffect(() => {
    if (tableExists !== true) return;

    async function fetchOptionsAndData() {
      setLoadingData(true);
      try {
        // Fetch active bank accounts
        const { data: contasData } = await supabase
          .from("contas")
          .select("id, banco, agencia, conta_corrente")
          .eq("ativo", true)
          .order("banco", { ascending: true });

        const contasFormatadas = (contasData || []).map(c => {
          const label = [c.banco, c.agencia, c.conta_corrente].filter(Boolean).join(" - ");
          return { value: label, label };
        });
        setContasBancarias(contasFormatadas);

        // Fetch categories
        const { data: catData } = await supabase
          .from("categorias_financeiras")
          .select("id, nome, parent_id")
          .order("nome", { ascending: true });

        setCategorias(catData || []);

        // Fetch active suppliers
        const { data: fornData } = await supabase
          .from("fornecedores")
          .select("id, nome")
          .eq("ativo", true)
          .order("nome", { ascending: true });

        setFornecedores(fornData || []);

        // Fetch accounts payable & receivable
        await fetchContasList();
      } catch (err) {
        console.error("Erro ao buscar dados do Supabase:", err);
      } finally {
        setLoadingData(false);
      }
    }

    fetchOptionsAndData();
  }, [tableExists]);

  const fetchContasList = async () => {
    try {
      const { data, error } = await supabase
        .from("contas_pagar_receber")
        .select("*")
        .order("data_vencimento", { ascending: true });

      if (error) throw error;
      setContasPagarReceberList(data || []);
    } catch (err) {
      console.error("Erro ao carregar lista de contas:", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRow.descricao || !newRow.valor || !newRow.data_vencimento) {
      alert("Por favor, preencha descrição, valor e data de vencimento.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        tipo: newRow.tipo,
        descricao: newRow.descricao,
        fornecedor_cliente: newRow.fornecedor_cliente || null,
        valor: parseFloat(newRow.valor.replace(",", ".")),
        data_vencimento: newRow.data_vencimento,
        categoria: newRow.categoria || null,
        status: "Pendente",
        user_id: user?.id
      };

      const { error } = await supabase.from("contas_pagar_receber").insert([payload]);
      if (error) throw error;

      // Reset form
      setNewRow({
        tipo: "Pagar",
        descricao: "",
        fornecedor_cliente: "",
        valor: "",
        data_vencimento: getTodayStr(),
        categoria: ""
      });

      await fetchContasList();
      alert("Conta adicionada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao salvar conta:", err);
      alert("Erro ao salvar conta.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir esta conta?")) return;

    try {
      setLoadingData(true);
      const { error } = await supabase.from("contas_pagar_receber").delete().eq("id", id);
      if (error) throw error;
      await fetchContasList();
      alert("Conta excluída com sucesso.");
    } catch (err) {
      console.error("Erro ao excluir conta:", err);
      alert("Erro ao excluir conta.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleOpenBaixa = (item: any) => {
    setPayingItem(item);
    setBaixaData({
      data_pagamento: getTodayStr(),
      conta_pagamento: contasBancarias[0]?.value || "",
      lancar_financeiro: true
    });
  };

  const handleConfirmarBaixa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingItem) return;
    if (!baixaData.data_pagamento || !baixaData.conta_pagamento) {
      alert("Por favor, preencha a data e selecione a conta de pagamento.");
      return;
    }

    try {
      setSaving(true);

      // 1. Update status in contas_pagar_receber
      const { error: updateError } = await supabase
        .from("contas_pagar_receber")
        .update({
          status: "Pago",
          data_pagamento: baixaData.data_pagamento,
          conta_pagamento: baixaData.conta_pagamento
        })
        .eq("id", payingItem.id);

      if (updateError) throw updateError;

      // 2. Post to lancamentos_financeiros if checked
      if (baixaData.lancar_financeiro) {
        // Expenses are negative, revenues are positive
        const val = payingItem.tipo === "Pagar" 
          ? -Math.abs(payingItem.valor) 
          : Math.abs(payingItem.valor);

        const payloadLancamento = {
          data: baixaData.data_pagamento,
          descricao: `[BAIXA] ${payingItem.descricao}`,
          fornecedor: payingItem.fornecedor_cliente || null,
          valor: val,
          categoria: payingItem.categoria || null,
          conta: baixaData.conta_pagamento,
          user_id: user?.id,
          status_revisao: null
        };

        const { error: insertError } = await supabase
          .from("lancamentos_financeiros")
          .insert([payloadLancamento]);

        if (insertError) throw insertError;
      }

      setPayingItem(null);
      await fetchContasList();
      alert("Baixa realizada com sucesso!");
    } catch (err) {
      console.error("Erro ao confirmar baixa:", err);
      alert("Erro ao realizar a baixa da conta.");
    } finally {
      setSaving(false);
    }
  };

  // Format options for selects
  const fornecedorOptions = fornecedores.map(f => ({ value: f.nome, label: f.nome }));
  
  const categoriaOptions = categorias.filter(c => !c.parent_id).map(pai => ({
    label: pai.nome,
    options: categorias.filter(sub => sub.parent_id === pai.id).map(sub => ({
      value: sub.nome,
      label: sub.nome
    }))
  }));

  // Filtering list
  const filteredList = contasPagarReceberList.filter(item => {
    // Tab filter
    if (tabFiltro === "Pagar" && item.tipo !== "Pagar") return false;
    if (tabFiltro === "Receber" && item.tipo !== "Receber") return false;

    // Status filter
    if (statusFiltro !== "Todos") {
      const todayStr = getTodayStr();
      const isOverdue = item.status === "Pendente" && item.data_vencimento < todayStr;
      
      if (statusFiltro === "Pendente" && (item.status !== "Pendente" || isOverdue)) return false;
      if (statusFiltro === "Pago" && item.status !== "Pago") return false;
      if (statusFiltro === "Atrasado" && !isOverdue) return false;
    }

    // Text search
    if (buscaTexto) {
      const query = buscaTexto.toLowerCase();
      const matchDesc = item.descricao?.toLowerCase().includes(query);
      const matchForn = item.fornecedor_cliente?.toLowerCase().includes(query);
      const matchCat = item.categoria?.toLowerCase().includes(query);
      return matchDesc || matchForn || matchCat;
    }

    return true;
  });

  // Summary stats
  const todayStr = getTodayStr();
  const totalPagar = contasPagarReceberList
    .filter(item => item.tipo === "Pagar" && item.status === "Pendente")
    .reduce((acc, curr) => acc + parseFloat(curr.valor || 0), 0);

  const totalReceber = contasPagarReceberList
    .filter(item => item.tipo === "Receber" && item.status === "Pendente")
    .reduce((acc, curr) => acc + parseFloat(curr.valor || 0), 0);

  const saldoPrevisto = totalReceber - totalPagar;

  if (checkingTable) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--primary-color)", fontSize: "2rem" }}>
        <Icons.BsArrowClockwise className="spin" /> Verificando banco de dados...
      </div>
    );
  }

  // Render database missing error screen
  if (tableExists === false) {
    const sqlText = `CREATE TABLE public.contas_pagar_receber (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo text NOT NULL CHECK (tipo IN ('Pagar', 'Receber')),
    descricao text NOT NULL,
    fornecedor_cliente text,
    valor numeric NOT NULL,
    data_vencimento date NOT NULL,
    status text NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Pago')),
    data_pagamento date,
    conta_pagamento text,
    categoria text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.contas_pagar_receber ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança para usuários autenticados
CREATE POLICY "Permitir leitura para usuários autenticados" 
ON public.contas_pagar_receber FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir inserção para usuários autenticados" 
ON public.contas_pagar_receber FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Permitir atualização para usuários autenticados" 
ON public.contas_pagar_receber FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Permitir exclusão para usuários autenticados" 
ON public.contas_pagar_receber FOR DELETE 
TO authenticated 
USING (true);`;

    return (
      <>
        <Helmet>
          <title>Erro - Contas a Pagar e Receber</title>
        </Helmet>
        <div className="frequencia-container" style={{ color: "var(--text-dark, #2d241e)" }}>
          <div className="frequencia-header">
            <div className="frequencia-title-group">
              <h1 style={{ color: "#b91c1c" }}>Tabela Inexistente no Banco de Dados</h1>
              <p>A tabela correspondente a esta página não foi encontrada no Supabase.</p>
            </div>
          </div>

          <div style={{
            background: "var(--card-bg, #ffffff)",
            border: "1px solid #fee2e2",
            borderLeft: "6px solid #ef4444",
            padding: "24px",
            borderRadius: "8px",
            marginBottom: "24px",
            boxShadow: "var(--shadow)"
          }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#b91c1c", fontSize: "1.8rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.BsExclamationTriangleFill /> Erro de Configuração de Banco de Dados
            </h3>
            <p style={{ fontSize: "1.4rem", lineHeight: "1.6", margin: "0 0 16px 0" }}>
              A página <strong>Contas a Pagar e Receber</strong> requer a tabela <code>contas_pagar_receber</code> no Supabase. Para corrigir este problema e usar esta página, siga os passos abaixo para criar a tabela no banco de dados:
            </p>

            <ol style={{ fontSize: "1.4rem", lineHeight: "1.8", margin: "0 0 24px 24px", padding: 0 }}>
              <li>Acesse o painel do seu projeto no <strong>Supabase</strong>.</li>
              <li>No menu lateral esquerdo, clique em <strong>SQL Editor</strong>.</li>
              <li>Clique no botão <strong>New query</strong> (Nova consulta).</li>
              <li>Copie e cole o código SQL abaixo no editor.</li>
              <li>Clique no botão <strong>Run</strong> (ou aperte Ctrl+Enter) para executar o script.</li>
              <li>Assim que o script for executado com sucesso, atualize esta página.</li>
            </ol>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--text-muted, #857264)" }}>Script SQL de Criação:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sqlText);
                    alert("Script SQL copiado para a área de transferência!");
                  }}
                  style={{
                    backgroundColor: "var(--primary-color, #a17550)",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  <Icons.BsFiles /> Copiar SQL
                </button>
              </div>
              <textarea
                readOnly
                value={sqlText}
                style={{
                  width: "100%",
                  height: "260px",
                  fontFamily: "monospace",
                  fontSize: "1.2rem",
                  padding: "12px",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color, #e6dfd9)",
                  backgroundColor: "var(--bg-color, #faf7f2)",
                  color: "#334155",
                  resize: "none"
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Contas a Pagar e Receber</title>
      </Helmet>

      <div className="frequencia-container" style={{ color: "var(--text-dark, #2d241e)" }}>
        
        {/* Header */}
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Contas a Pagar e Receber</h1>
            <p>Gerencie os compromissos financeiros e receitas futuras da Carmella Gelateria.</p>
          </div>
        </div>

        {/* Resumo de Indicadores */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "24px"
        }}>
          {/* Card A Pagar */}
          <div style={{
            backgroundColor: "var(--card-bg, #ffffff)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid var(--border-color, #e6dfd9)",
            borderLeft: "6px solid #ef4444",
            boxShadow: "var(--shadow)"
          }}>
            <div style={{ fontSize: "1.3rem", color: "var(--text-muted, #857264)", fontWeight: "bold", textTransform: "uppercase" }}>Total a Pagar (Pendente)</div>
            <div style={{ fontSize: "2.4rem", fontWeight: "bold", color: "#ef4444", marginTop: "8px" }}>
              R$ {totalPagar.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Card A Receber */}
          <div style={{
            backgroundColor: "var(--card-bg, #ffffff)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid var(--border-color, #e6dfd9)",
            borderLeft: "6px solid #10b981",
            boxShadow: "var(--shadow)"
          }}>
            <div style={{ fontSize: "1.3rem", color: "var(--text-muted, #857264)", fontWeight: "bold", textTransform: "uppercase" }}>Total a Receber (Pendente)</div>
            <div style={{ fontSize: "2.4rem", fontWeight: "bold", color: "#10b981", marginTop: "8px" }}>
              R$ {totalReceber.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Card Saldo Previsto */}
          <div style={{
            backgroundColor: "var(--card-bg, #ffffff)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid var(--border-color, #e6dfd9)",
            borderLeft: `6px solid ${saldoPrevisto < 0 ? "#f59e0b" : "#3b82f6"}`,
            boxShadow: "var(--shadow)"
          }}>
            <div style={{ fontSize: "1.3rem", color: "var(--text-muted, #857264)", fontWeight: "bold", textTransform: "uppercase" }}>Saldo Previsto (Pendente)</div>
            <div style={{ fontSize: "2.4rem", fontWeight: "bold", color: saldoPrevisto < 0 ? "#b45309" : "#2563eb", marginTop: "8px" }}>
              R$ {saldoPrevisto.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Card de Inserção de Novo Registro */}
        <div style={{
          backgroundColor: "var(--card-bg, #ffffff)",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "var(--shadow)",
          marginBottom: "24px",
          border: "1px solid var(--border-color, #e6dfd9)"
        }}>
          <h3 style={{ margin: "0 0 16px 0", color: "var(--secondary-color, #5a432c)", fontSize: "1.8rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <Icons.BsPlusCircleFill style={{ color: "var(--primary-color, #a17550)" }} />
            Nova Conta à Pagar / Receber
          </h3>

          <form onSubmit={handleSave} style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end" }}>
            
            {/* Tipo */}
            <div style={{ flex: "1 1 120px" }}>
              <label style={{ display: "block", fontSize: "1.3rem", color: "var(--text-muted, #857264)", marginBottom: "4px", fontWeight: "bold" }}>Tipo</label>
              <select
                value={newRow.tipo}
                onChange={(e) => setNewRow({ ...newRow, tipo: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color, #e6dfd9)",
                  height: "54px",
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  backgroundColor: "var(--card-bg, #ffffff)",
                  color: "var(--text-dark, #2d241e)"
                }}
              >
                <option value="Pagar">A Pagar (Despesa)</option>
                <option value="Receber">A Receber (Receita)</option>
              </select>
            </div>

            {/* Descrição */}
            <div style={{ flex: "2 1 200px" }}>
              <label style={{ display: "block", fontSize: "1.3rem", color: "var(--text-muted, #857264)", marginBottom: "4px", fontWeight: "bold" }}>Descrição</label>
              <input
                type="text"
                placeholder="Ex: Aluguel da Loja, Venda Foodservice"
                value={newRow.descricao}
                onChange={(e) => setNewRow({ ...newRow, descricao: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color, #e6dfd9)",
                  height: "54px",
                  fontSize: "1.4rem",
                  backgroundColor: "var(--card-bg, #ffffff)",
                  color: "var(--text-dark, #2d241e)"
                }}
                required
              />
            </div>

            {/* Valor */}
            <div style={{ flex: "1 1 120px" }}>
              <label style={{ display: "block", fontSize: "1.3rem", color: "var(--text-muted, #857264)", marginBottom: "4px", fontWeight: "bold" }}>Valor (R$)</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: "12px", color: "var(--text-muted, #857264)", zIndex: 1, pointerEvents: "none", fontSize: "1.2rem", fontWeight: "bold" }}>R$</span>
                <input
                  type="text"
                  placeholder="0.00"
                  value={newRow.valor}
                  onChange={(e) => setNewRow({ ...newRow, valor: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 8px 8px 36px",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color, #e6dfd9)",
                    textAlign: "center",
                    height: "54px",
                    fontSize: "1.4rem",
                    backgroundColor: "var(--card-bg, #ffffff)",
                    color: "var(--text-dark, #2d241e)"
                  }}
                  required
                />
              </div>
            </div>

            {/* Vencimento */}
            <div style={{ flex: "1 1 140px" }}>
              <label style={{ display: "block", fontSize: "1.3rem", color: "var(--text-muted, #857264)", marginBottom: "4px", fontWeight: "bold" }}>Vencimento</label>
              <input
                type="date"
                value={newRow.data_vencimento}
                onChange={(e) => setNewRow({ ...newRow, data_vencimento: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color, #e6dfd9)",
                  textAlign: "center",
                  height: "54px",
                  fontSize: "1.4rem",
                  backgroundColor: "var(--card-bg, #ffffff)",
                  color: "var(--text-dark, #2d241e)"
                }}
                required
              />
            </div>

            {/* Fornecedor / Cliente */}
            <div style={{ flex: "2 1 200px" }}>
              <label style={{ display: "block", fontSize: "1.3rem", color: "var(--text-muted, #857264)", marginBottom: "4px", fontWeight: "bold" }}>Fornecedor / Cliente</label>
              <Select
                options={fornecedorOptions}
                value={fornecedorOptions.find(o => o.value === newRow.fornecedor_cliente) || (newRow.fornecedor_cliente ? { value: newRow.fornecedor_cliente, label: newRow.fornecedor_cliente } : null)}
                onChange={(option: any) => setNewRow({ ...newRow, fornecedor_cliente: option ? option.value : "" })}
                onInputChange={(inputValue) => {
                  if (inputValue) setNewRow({ ...newRow, fornecedor_cliente: inputValue });
                }}
                placeholder="Selecionar ou digitar..."
                isClearable
                isSearchable
                styles={selectStyles}
                menuPortalTarget={document.body}
              />
            </div>

            {/* Categoria */}
            <div style={{ flex: "2 1 200px" }}>
              <label style={{ display: "block", fontSize: "1.3rem", color: "var(--text-muted, #857264)", marginBottom: "4px", fontWeight: "bold" }}>Categoria</label>
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

            {/* Botão Salvar */}
            <div style={{ flex: "0 0 130px", position: "relative" }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  height: "54px",
                  padding: "0",
                  backgroundColor: "var(--primary-color, #a17550)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  fontSize: "1.4rem",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                {saving ? "Salvando..." : <><Icons.BsCheckCircleFill /> Adicionar</>}
              </button>
            </div>
          </form>
        </div>

        {/* Controle de Filtros e Lista */}
        <div style={{
          backgroundColor: "var(--card-bg, #ffffff)",
          borderRadius: "8px",
          border: "1px solid var(--border-color, #e6dfd9)",
          padding: "20px",
          boxShadow: "var(--shadow)",
          marginBottom: "40px"
        }}>
          {/* Barra Superior Filtros */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "20px"
          }}>
            {/* Tabs Pagar / Receber */}
            <div style={{ display: "flex", gap: "4px", backgroundColor: "var(--bg-color, #faf7f2)", padding: "4px", borderRadius: "8px" }}>
              {(["Todas", "Pagar", "Receber"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setTabFiltro(tab)}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: tabFiltro === tab ? "var(--primary-color, #a17550)" : "transparent",
                    color: tabFiltro === tab ? "#ffffff" : "var(--text-muted, #857264)",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {tab === "Todas" ? "Todas" : tab === "Pagar" ? "Contas a Pagar" : "Contas a Receber"}
                </button>
              ))}
            </div>

            {/* Filtros Status e Busca */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              {/* Select Status */}
              <div>
                <select
                  value={statusFiltro}
                  onChange={(e) => setStatusFiltro(e.target.value as any)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color, #e6dfd9)",
                    fontSize: "1.3rem",
                    backgroundColor: "var(--card-bg, #ffffff)",
                    color: "var(--text-dark, #2d241e)",
                    height: "38px"
                  }}
                >
                  <option value="Todos">Todos os Status</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Pago">Pago</option>
                  <option value="Atrasado">Atrasado</option>
                </select>
              </div>

              {/* Input Busca */}
              <div style={{ position: "relative" }}>
                <Icons.BsSearch style={{ position: "absolute", left: "10px", top: "12px", color: "var(--text-muted, #857264)", fontSize: "1.2rem" }} />
                <input
                  type="text"
                  placeholder="Pesquisar descrição/fornecedor..."
                  value={buscaTexto}
                  onChange={(e) => setBuscaTexto(e.target.value)}
                  style={{
                    padding: "8px 12px 8px 28px",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color, #e6dfd9)",
                    fontSize: "1.3rem",
                    backgroundColor: "var(--card-bg, #ffffff)",
                    color: "var(--text-dark, #2d241e)",
                    height: "38px",
                    width: "220px"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Tabela de Contas */}
          <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
            <table className="freq-table" style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-color, #e6dfd9)" }}>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Tipo</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Descrição</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Fornecedor / Cliente</th>
                  <th style={{ textAlign: "left", padding: "12px 8px" }}>Categoria</th>
                  <th style={{ textAlign: "right", padding: "12px 8px" }}>Valor</th>
                  <th style={{ textAlign: "center", padding: "12px 8px" }}>Vencimento</th>
                  <th style={{ textAlign: "center", padding: "12px 8px" }}>Status</th>
                  <th style={{ textAlign: "center", padding: "12px 8px" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loadingData ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted, #857264)" }}>
                      <Icons.BsArrowClockwise className="spin" /> Carregando lançamentos...
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted, #857264)" }}>
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => {
                    const isPendente = item.status === "Pendente";
                    const isOverdue = isPendente && item.data_vencimento < todayStr;
                    
                    const formatData = (dateStr: string) => {
                      if (!dateStr) return "-";
                      const [y, m, d] = dateStr.split("-");
                      return `${d}/${m}/${y}`;
                    };

                    return (
                      <tr key={item.id} style={{ borderBottom: "1px solid var(--border-color, #e6dfd9)" }}>
                        {/* Tipo */}
                        <td style={{ padding: "12px 8px" }}>
                          <span style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            color: item.tipo === "Pagar" ? "#b91c1c" : "#15803d",
                            backgroundColor: item.tipo === "Pagar" ? "#fee2e2" : "#dcfce7"
                          }}>
                            {item.tipo === "Pagar" ? "PAGAR" : "RECEBER"}
                          </span>
                        </td>
                        
                        {/* Descrição */}
                        <td style={{ padding: "12px 8px", fontWeight: "bold", color: "var(--text-dark, #2d241e)" }}>
                          {item.descricao}
                        </td>

                        {/* Fornecedor / Cliente */}
                        <td style={{ padding: "12px 8px", color: "var(--text-dark, #2d241e)" }}>
                          {item.fornecedor_cliente || "-"}
                        </td>

                        {/* Categoria */}
                        <td style={{ padding: "12px 8px", color: "var(--text-muted, #857264)", fontSize: "1.3rem" }}>
                          {item.categoria || "-"}
                        </td>

                        {/* Valor */}
                        <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: "bold", color: "var(--text-dark, #2d241e)" }}>
                          R$ {parseFloat(item.valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>

                        {/* Vencimento */}
                        <td style={{ padding: "12px 8px", textAlign: "center", color: "var(--text-dark, #2d241e)" }}>
                          {formatData(item.data_vencimento)}
                        </td>

                        {/* Status */}
                        <td style={{ padding: "12px 8px", textAlign: "center" }}>
                          {item.status === "Pago" ? (
                            <span style={{
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "1.1rem",
                              fontWeight: "bold",
                              color: "#15803d",
                              backgroundColor: "#dcfce7"
                            }}>
                              Pago
                            </span>
                          ) : isOverdue ? (
                            <span style={{
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "1.1rem",
                              fontWeight: "bold",
                              color: "#b91c1c",
                              backgroundColor: "#fee2e2"
                            }}>
                              Atrasado
                            </span>
                          ) : (
                            <span style={{
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "1.1rem",
                              fontWeight: "bold",
                              color: "#d97706",
                              backgroundColor: "#fef3c7"
                            }}>
                              Pendente
                            </span>
                          )}
                        </td>

                        {/* Ações */}
                        <td style={{ padding: "12px 8px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            {isPendente && (
                              <button
                                onClick={() => handleOpenBaixa(item)}
                                style={{
                                  backgroundColor: "#10b981",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "6px 10px",
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontSize: "1.2rem"
                                }}
                                title="Dar baixa (Marcar como Pago)"
                              >
                                <Icons.BsCheck2Circle /> Dar Baixa
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(item.id)}
                              style={{
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "6px 8px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center"
                              }}
                              title="Excluir"
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
          </div>
        </div>

        {/* Modal de Baixa de Conta (Efetuar Pagamento) */}
        {payingItem && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000
          }}>
            <div style={{
              backgroundColor: "var(--card-bg, #ffffff)",
              padding: "24px",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              border: "1px solid var(--border-color, #e6dfd9)",
              color: "var(--text-dark, #2d241e)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: "var(--secondary-color, #5a432c)", fontSize: "1.8rem" }}>
                  Confirmar Baixa: {payingItem.tipo === "Pagar" ? "Contas a Pagar" : "Contas a Receber"}
                </h3>
                <button
                  onClick={() => setPayingItem(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "2rem", color: "var(--text-muted, #857264)" }}
                >
                  <Icons.BsX />
                </button>
              </div>

              <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "var(--bg-color, #faf7f2)", borderRadius: "4px", fontSize: "1.4rem" }}>
                <div style={{ marginBottom: "6px" }}><strong>Descrição:</strong> {payingItem.descricao}</div>
                <div style={{ marginBottom: "6px" }}><strong>Valor:</strong> R$ {parseFloat(payingItem.valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                <div><strong>Vencimento:</strong> {payingItem.data_vencimento.split("-").reverse().join("/")}</div>
              </div>

              <form onSubmit={handleConfirmarBaixa} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Data do Pagamento */}
                <div>
                  <label style={{ display: "block", fontSize: "1.3rem", fontWeight: "bold", color: "var(--text-muted, #857264)", marginBottom: "4px" }}>
                    Data do {payingItem.tipo === "Pagar" ? "Pagamento" : "Recebimento"}
                  </label>
                  <input
                    type="date"
                    value={baixaData.data_pagamento}
                    onChange={(e) => setBaixaData({ ...baixaData, data_pagamento: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid var(--border-color, #e6dfd9)",
                      fontSize: "1.4rem",
                      backgroundColor: "var(--card-bg, #ffffff)",
                      color: "var(--text-dark, #2d241e)"
                    }}
                    required
                  />
                </div>

                {/* Conta de Pagamento */}
                <div>
                  <label style={{ display: "block", fontSize: "1.3rem", fontWeight: "bold", color: "var(--text-muted, #857264)", marginBottom: "4px" }}>
                    Conta Bancária
                  </label>
                  <select
                    value={baixaData.conta_pagamento}
                    onChange={(e) => setBaixaData({ ...baixaData, conta_pagamento: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid var(--border-color, #e6dfd9)",
                      fontSize: "1.4rem",
                      backgroundColor: "var(--card-bg, #ffffff)",
                      color: "var(--text-dark, #2d241e)"
                    }}
                    required
                  >
                    <option value="" disabled>Selecione a conta...</option>
                    {contasBancarias.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Checkbox Lancar em Fluxo de Caixa */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    id="lancar_financeiro"
                    checked={baixaData.lancar_financeiro}
                    onChange={(e) => setBaixaData({ ...baixaData, lancar_financeiro: e.target.checked })}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <label htmlFor="lancar_financeiro" style={{ fontSize: "1.3rem", fontWeight: "600", cursor: "pointer" }}>
                    Lançar no Fluxo de Caixa (Lançamentos Financeiros)
                  </label>
                </div>

                {/* Botões Ação */}
                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setPayingItem(null)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      border: "1px solid var(--border-color, #e6dfd9)",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1.4rem",
                      backgroundColor: "var(--card-bg, #ffffff)",
                      color: "var(--text-muted, #857264)"
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      flex: 2,
                      padding: "12px",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: saving ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                      fontSize: "1.4rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    {saving ? "Processando..." : <><Icons.BsCheckCircleFill /> Confirmar Baixa</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default ContasPagarReceber;
