import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import { checklistPrincipaisAbertura, checklistPrincipaisFechamento } from "../config/checklistPrincipais.js";
import { STORE_CONFIG } from "../config/store.js";
import supabase from "../supabase-client";
import "../css/Home.css";

interface ChecklistItemType {
  id: string;
  title: string;
  subtitle1?: string;
  subtitle2?: string;
  buttonText?: string;
  buttonLink?: string;
  weekday?: number;
  [key: string]: any;
}

interface StepType {
  title: string;
  items: ChecklistItemType[];
}

interface BatchType {
  quantity: string;
  date: string;
}

const ChecklistPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"abertura" | "fechamento">("abertura");
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  // Estados de Verificação de ID de Realizador e Revisor
  const [executorId, setExecutorId] = useState("");
  const [executorName, setExecutorName] = useState<string | null>(null);
  const [isCheckingExecutor, setIsCheckingExecutor] = useState(false);

  const [revisorId, setRevisorId] = useState("");
  const [revisorName, setRevisorName] = useState<string | null>(null);
  const [isCheckingRevisor, setIsCheckingRevisor] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ID do checklist salvo no banco (para atualização posterior)
  const [checklistDbId, setChecklistDbId] = useState<string | null>(null);

  // Verificação de checklist do dia
  const [todayChecklist, setTodayChecklist] = useState<{
    id: number;
    person: string;
    reviewer: string | null;
    created_at: string;
    updated_at: string | null;
  } | null>(null);
  const [isCheckingToday, setIsCheckingToday] = useState(false);

  // Estados de Inventário para Fechamento
  const [waffleBatches, setWaffleBatches] = useState<BatchType[]>([{ quantity: "", date: "" }]);
  const [brownieBatches, setBrownieBatches] = useState<BatchType[]>([{ quantity: "", date: "" }]);
  const [panosCount, setPanosCount] = useState<string>("");

  const currentSteps: StepType[] = activeTab === "abertura" ? checklistPrincipaisAbertura : checklistPrincipaisFechamento;
  const todayWeekday = new Date().getDay(); // 0 = Dom, 1 = Seg, ..., 6 = Sáb

  // Filtrar itens do dia
  const shouldDisplayItem = (item: ChecklistItemType): boolean => {
    if (item.weekday === undefined || item.weekday === null) return true;
    return item.weekday === todayWeekday;
  };

  // Carregar progresso salvo
  useEffect(() => {
    const storageKey = `carmella_interactive_check_${activeTab}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { setCheckedItems(JSON.parse(saved)); } catch (e) { setCheckedItems({}); }
    } else {
      setCheckedItems({});
    }

    const savedWaffles = localStorage.getItem("check_fechamento_waffles");
    if (savedWaffles) {
      try { setWaffleBatches(JSON.parse(savedWaffles)); } catch (e) {}
    }
    const savedBrownies = localStorage.getItem("check_fechamento_brownies");
    if (savedBrownies) {
      try { setBrownieBatches(JSON.parse(savedBrownies)); } catch (e) {}
    }
    const savedPanos = localStorage.getItem("check_fechamento_panos");
    if (savedPanos) setPanosCount(savedPanos);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("check_fechamento_waffles", JSON.stringify(waffleBatches));
  }, [waffleBatches]);

  useEffect(() => {
    localStorage.setItem("check_fechamento_brownies", JSON.stringify(brownieBatches));
  }, [brownieBatches]);

  useEffect(() => {
    localStorage.setItem("check_fechamento_panos", panosCount);
  }, [panosCount]);

  // Verificar se já existe checklist feito hoje para esta aba
  useEffect(() => {
    const checkTodayChecklist = async () => {
      setIsCheckingToday(true);
      try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).toISOString();
        
        const checklistType = activeTab === "abertura" ? "Checklist de Abertura" : "Checklist de Fechamento";
        
        const { data, error } = await supabase
          .from("Checklist")
          .select("id, person, reviewer, created_at, updated_at")
          .eq("checklist", checklistType)
          .gte("created_at", startOfDay)
          .lte("created_at", endOfDay)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        
        if (!error && data) {
          setTodayChecklist(data);
        } else {
          setTodayChecklist(null);
        }
      } catch (err) {
        console.warn("Erro ao verificar checklist do dia:", err);
        setTodayChecklist(null);
      } finally {
        setIsCheckingToday(false);
      }
    };

    checkTodayChecklist();
  }, [activeTab]);

  const toggleItem = (id: string) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    localStorage.setItem(`carmella_interactive_check_${activeTab}`, JSON.stringify(updated));
  };

  // Consulta 100% dinâmica da coluna "name" na tabela profiles do Supabase pelo ID (short_id)
  const fetchProfileName = async (shortId: string): Promise<string | null> => {
    const cleanId = shortId.trim();
    if (!cleanId) return null;

    try {
      // 1. Busca por short_id exato
      const { data, error } = await supabase
        .from("profiles")
        .select("name")
        .eq("short_id", cleanId);

      if (!error && data && data.length > 0 && data[0]?.name) {
        const found = data[0].name.trim();
        if (found) return found;
      }

      // 2. Tenta busca secundária por ilike ou id por garantia
      const { data: data2, error: error2 } = await supabase
        .from("profiles")
        .select("name")
        .or(`short_id.ilike.${cleanId},id.eq.${cleanId}`);

      if (!error2 && data2 && data2.length > 0 && data2[0]?.name) {
        const found = data2[0].name.trim();
        if (found) return found;
      }
    } catch (e) {
      console.warn("Erro ao consultar profiles no Supabase:", e);
    }

    return null;
  };

  // Validar ID do Realizador/Executor e salvar checklist no banco
  const handleValidateExecutor = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Bloquear se já existe checklist hoje
    if (todayChecklist && !isCheckingToday) {
      setErrorMessage("Já existe um checklist completado hoje. Não é possível criar outro.");
      return;
    }

    if (!executorId.trim()) {
      setErrorMessage("Por favor, digite o ID do funcionário que realizou o checklist.");
      return;
    }

    if (completedCount === 0) {
      setErrorMessage("Marque ao menos algumas tarefas completadas antes de prosseguir.");
      return;
    }

    try {
      setIsCheckingExecutor(true);
      const name = await fetchProfileName(executorId);
      if (!name) {
        setErrorMessage(`ID "${executorId.trim()}" não encontrado no banco de dados (tabela profiles).`);
        return;
      }
      setExecutorName(name);

      // Salvar checklist no banco com apenas o executor
      const now = new Date();
      const inventoryDetails = activeTab === "fechamento" ? {
        waffles: getFormattedInventoryMessage(waffleBatches, "Waffles"),
        brownies: getFormattedInventoryMessage(brownieBatches, "Brownies"),
        panos: `Panos: ${panosCount || "0"} total`
      } : null;

      const payload = {
        checklist: `Checklist de ${activeTab === "abertura" ? "Abertura" : "Fechamento"}`,
        person: name,
        reviewer: null,
        executor_id: executorId.trim(),
        reviewer_id: null,
        store: STORE_CONFIG.textName || STORE_CONFIG.name,
        created_at: now.toISOString(),
        items_count: completedCount,
        total_items: allCurrentItems.length,
        inventory: inventoryDetails
      };

      const { data, error } = await supabase.from("Checklist").insert([payload]).select("id").single();
      if (error) {
        console.error("Erro ao salvar checklist:", error);
        setErrorMessage("Erro ao salvar checklist no banco de dados.");
        return;
      }
      const newChecklistId = data.id;
      setChecklistDbId(newChecklistId);

      // Salvar histórico no localStorage
      const historyKey = "carmella_checklist_historico";
      const existingHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
      const payloadWithId = { ...payload, id: newChecklistId };
      localStorage.setItem(historyKey, JSON.stringify([payloadWithId, ...existingHistory]));

      setSuccessMessage(`Checklist salvo! Realizado por "${name}". Aguardando revisão.`);
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao consultar ID ou salvar no banco de dados.");
    } finally {
      setIsCheckingExecutor(false);
    }
  };

  // Funções para manipular lotes de Waffles e Brownies
  const handleWaffleChange = (index: number, field: "quantity" | "date", value: string) => {
    const updated = [...waffleBatches];
    updated[index][field] = value;
    setWaffleBatches(updated);
    if (!checkedItems["pf_waffles"]) toggleItem("pf_waffles");
  };

  const addWaffleBatch = () => {
    setWaffleBatches([...waffleBatches, { quantity: "", date: "" }]);
  };

  const removeWaffleBatch = (index: number) => {
    if (waffleBatches.length === 1) return;
    setWaffleBatches(waffleBatches.filter((_, i) => i !== index));
  };

  const handleBrownieChange = (index: number, field: "quantity" | "date", value: string) => {
    const updated = [...brownieBatches];
    updated[index][field] = value;
    setBrownieBatches(updated);
    if (!checkedItems["pf_brownies"]) toggleItem("pf_brownies");
  };

  const addBrownieBatch = () => {
    setBrownieBatches([...brownieBatches, { quantity: "", date: "" }]);
  };

  const removeBrownieBatch = (index: number) => {
    if (brownieBatches.length === 1) return;
    setBrownieBatches(brownieBatches.filter((_, i) => i !== index));
  };

  // Formatadores de mensagem de estoque
  const getFormattedInventoryMessage = (batches: BatchType[], label: string) => {
    const total = batches.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 0), 0);
    const details = batches
      .filter((b) => b.quantity && b.date)
      .map((b) => {
        const parts = b.date.split("-");
        const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : b.date;
        return `${b.quantity} un (venc. ${formattedDate})`;
      })
      .join(", ");
    return `${label}: ${total} total ${details ? `[${details}]` : ""}`;
  };

  // Obter todos os itens elegíveis da aba ativa
  const allCurrentItems = useMemo(() => {
    const list: ChecklistItemType[] = [];
    currentSteps.forEach((step) => {
      step.items.forEach((item) => {
        if (shouldDisplayItem(item)) {
          list.push(item);
        }
      });
    });
    return list;
  }, [currentSteps, todayWeekday]);

  const completedCount = useMemo(() => {
    return allCurrentItems.filter((item) => checkedItems[item.id]).length;
  }, [allCurrentItems, checkedItems]);

  const progressPercent = useMemo(() => {
    if (allCurrentItems.length === 0) return 0;
    return Math.round((completedCount / allCurrentItems.length) * 100);
  }, [completedCount, allCurrentItems]);

  // Enviar confirmação final com ID do Revisor (atualiza checklist existente)
  const handleConfirmFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!revisorId.trim()) {
      setErrorMessage("Por favor, digite o ID do revisor para finalizar o checklist.");
      return;
    }

    // Determinar qual checklist atualizar: o criado nesta sessão ou o de hoje pendente de revisão
    const targetChecklistId = checklistDbId || (todayChecklist && !todayChecklist.reviewer ? todayChecklist.id : null);
    
    if (!targetChecklistId) {
      setErrorMessage("Erro: Checklist original não encontrado. Tente novamente.");
      return;
    }

    // Se há checklist de hoje já revisado, bloquear
    if (todayChecklist && todayChecklist.reviewer) {
      setErrorMessage("Este checklist já foi revisado hoje. Não é possível revisar novamente.");
      return;
    }

    try {
      setIsCheckingRevisor(true);
      setSubmitting(true);

      const rName = await fetchProfileName(revisorId);
      if (!rName) {
        setErrorMessage(`ID do Revisor "${revisorId.trim()}" não encontrado no banco de dados.`);
        setIsCheckingRevisor(false);
        setSubmitting(false);
        return;
      }
      setRevisorName(rName);

      const now = new Date();
      const inventoryDetails = activeTab === "fechamento" ? {
        waffles: getFormattedInventoryMessage(waffleBatches, "Waffles"),
        brownies: getFormattedInventoryMessage(brownieBatches, "Brownies"),
        panos: `Panos: ${panosCount || "0"} total`
      } : null;

      const updatePayload = {
        reviewer: rName,
        reviewer_id: revisorId.trim(),
        updated_at: now.toISOString()
      };

      // Atualizar checklist existente no Supabase
      const { error } = await supabase.from("Checklist").update(updatePayload).eq("id", targetChecklistId);
      if (error) {
        console.error("Erro ao atualizar checklist:", error);
        setErrorMessage("Erro ao atualizar checklist com revisor.");
        return;
      }

      // Atualizar histórico no localStorage
      const historyKey = "carmella_checklist_historico";
      const existingHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
      const updatedHistory = existingHistory.map((item: any) => 
        item.id === targetChecklistId ? { ...item, ...updatePayload } : item
      );
      localStorage.setItem(historyKey, JSON.stringify(updatedHistory));

      const executorDisplayName = executorName || (todayChecklist ? todayChecklist.person : "desconhecido");
      
      setSuccessMessage(
        `Checklist de ${activeTab === "abertura" ? "Abertura" : "Fechamento"} finalizado! Realizado por "${executorDisplayName}" e revisado por "${rName}" às ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.`
      );

      // Limpar formulário e progresso
      setCheckedItems({});
      localStorage.removeItem(`carmella_interactive_check_${activeTab}`);
      setExecutorId("");
      setExecutorName(null);
      setRevisorId("");
      setRevisorName(null);
      setChecklistDbId(null);
      // Recarregar verificação do dia
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).toISOString();
      const checklistType = activeTab === "abertura" ? "Checklist de Abertura" : "Checklist de Fechamento";
      const { data } = await supabase
        .from("Checklist")
        .select("id, person, reviewer, created_at, updated_at")
        .eq("checklist", checklistType)
        .gte("created_at", startOfDay)
        .lte("created_at", endOfDay)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      setTodayChecklist(data || null);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Ocorreu um erro ao salvar o envio. Verifique a conexão e tente novamente.");
    } finally {
      setIsCheckingRevisor(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checklist - Carmella Gelateria</title>
      </Helmet>

      <div className="home" style={{ alignItems: "flex-start" }}>
        <div className="container">
          <div className="home-calendar-card">
            {/* Header da Página */}
            <div className="home-calendar-top-bar" style={{ marginBottom: "1.5rem" }}>
              <div className="home-calendar-title-group">
                <h2>
                  <Icons.BsCheck2Square color="var(--primary-color)" />
                  Checklist de Operações
                </h2>
                <p>Marque as tarefas concluídas, confirme com seu ID e solicite a validação do Revisor.</p>
              </div>

              {/* Tabs Bar */}
              <div style={{ display: "flex", gap: "0.75rem", background: "#f1f5f9", padding: "6px", borderRadius: "14px" }}>
                <button
                  className="btn-cal-nav"
                  style={{
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.75rem 1.6rem",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    backgroundColor: activeTab === "abertura" ? "var(--primary-color, #d4a373)" : "transparent",
                    color: activeTab === "abertura" ? "#ffffff" : "#475569",
                    boxShadow: activeTab === "abertura" ? "0 2px 8px rgba(212, 163, 115, 0.35)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => {
                    setActiveTab("abertura");
                    setExecutorName(null);
                    setRevisorName(null);
                    setChecklistDbId(null);
                  }}
                >
                  <Icons.BsSun size={18} /> Abertura
                </button>

                <button
                  className="btn-cal-nav"
                  style={{
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.75rem 1.6rem",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    backgroundColor: activeTab === "fechamento" ? "var(--secondary-color, #5a432c)" : "transparent",
                    color: activeTab === "fechamento" ? "#ffffff" : "#475569",
                    boxShadow: activeTab === "fechamento" ? "0 2px 8px rgba(90, 67, 44, 0.35)" : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => {
                    setActiveTab("fechamento");
                    setExecutorName(null);
                    setRevisorName(null);
                    setChecklistDbId(null);
                  }}
                >
                  <Icons.BsMoonStars size={18} /> Fechamento
                </button>
              </div>
            </div>

            {/* Progresso de Conclusão */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "1.25rem 1.5rem",
                marginBottom: "2rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#1e293b" }}>
                  Progresso do Checklist de {activeTab === "abertura" ? "Abertura" : "Fechamento"}
                </h3>
                <span style={{ fontSize: "1.05rem", fontWeight: 800, color: progressPercent === 100 ? "#16a34a" : "var(--primary-color)" }}>
                  {completedCount} de {allCurrentItems.length} marcadas ({progressPercent}%)
                </span>
              </div>

              <div style={{ background: "#e2e8f0", height: "14px", borderRadius: "10px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: "100%",
                    background: progressPercent === 100 ? "#22c55e" : activeTab === "abertura" ? "var(--primary-color, #d4a373)" : "var(--secondary-color, #5a432c)",
                    borderRadius: "10px",
                    transition: "width 0.3s ease"
                  }}
                />
              </div>
            </div>

            {/* Alerta de Checklist Já Realizado Hoje */}
            {isCheckingToday && (
              <div style={{ background: "#fff3cd", border: "1px solid #ffc107", color: "#856404", padding: "1rem 1.25rem", borderRadius: "12px", marginBottom: "1.5rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Icons.BsHourglassSplit size={20} color="#ffc107" /> Verificando se já existe checklist hoje...
              </div>
            )}

            {todayChecklist && !isCheckingToday && (
              <div style={{ background: "#e7f3ff", border: "1px solid #90caf9", color: "#1565c0", padding: "1rem 1.25rem", borderRadius: "12px", marginBottom: "1.5rem", fontWeight: 700 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <Icons.BsInfoCircleFill size={20} color="#1976d2" />
                  <span>Este checklist já foi completado hoje</span>
                </div>
                <div style={{ fontWeight: 400, fontSize: "0.95rem", lineHeight: 1.6 }}>
                  <div>✅ Realizado por: <strong>{todayChecklist.person}</strong> às <strong>{new Date(todayChecklist.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</strong></div>
                  {todayChecklist.reviewer && todayChecklist.updated_at && (
                    <div>👁️ Revisado por: <strong>{todayChecklist.reviewer}</strong> às <strong>{new Date(todayChecklist.updated_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</strong></div>
                  )}
                  {!todayChecklist.reviewer && (
                    <div style={{ color: "#f57c00" }}>⏳ Aguardando revisão</div>
                  )}
                </div>
              </div>
            )}

            {/* Mensagens de Sucesso ou Erro */}
            {successMessage && (
              <div style={{ background: "#dcfce7", border: "1px solid #86efac", color: "#166534", padding: "1rem 1.25rem", borderRadius: "12px", marginBottom: "1.5rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Icons.BsCheckCircleFill size={20} color="#16a34a" /> {successMessage}
              </div>
            )}

            {errorMessage && (
              <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", padding: "1rem 1.25rem", borderRadius: "12px", marginBottom: "1.5rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Icons.BsExclamationTriangleFill size={20} color="#dc2626" /> {errorMessage}
              </div>
            )}

            {/* Lista Interativa de Tarefas com Checkbox */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "2.5rem" }}>
                {currentSteps.map((step, stepIdx) => {
                  const validItems = step.items.filter(shouldDisplayItem);
                  if (validItems.length === 0) return null;

                  return (
                    <div
                      key={stepIdx}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                      }}
                    >
                      <div
                        style={{
                          background: activeTab === "abertura" ? "#fef3c7" : "#f1f5f9",
                          color: activeTab === "abertura" ? "#92400e" : "#334155",
                          padding: "1.1rem 1.4rem",
                          fontWeight: 800,
                          fontSize: "1.3rem",
                          borderBottom: "1px solid #e2e8f0",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem"
                        }}
                      >
                        <Icons.BsFolder2Open size={22} /> {step.title}
                      </div>

                      <div style={{ padding: "0.5rem 0.85rem" }}>
                        {validItems.map((item) => {
                          const isChecked = Boolean(checkedItems[item.id]);

                          return (
                            <div
                              key={item.id}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.75rem",
                                padding: "1rem 1.1rem",
                                borderBottom: "1px solid #f1f5f9",
                                backgroundColor: isChecked ? "#f0fdf4" : "transparent",
                                transition: "backgroundColor 0.15s ease"
                              }}
                            >
                              <div
                                style={{ display: "flex", alignItems: "flex-start", gap: "1rem", cursor: "pointer" }}
                                onClick={() => toggleItem(item.id)}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => { }}
                                  style={{
                                    width: "22px",
                                    height: "22px",
                                    marginTop: "3px",
                                    accentColor: activeTab === "abertura" ? "var(--primary-color)" : "var(--secondary-color)",
                                    cursor: "pointer"
                                  }}
                                />

                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      fontSize: "1.2rem",
                                      fontWeight: 700,
                                      color: isChecked ? "#166534" : "#1e293b",
                                      textDecoration: isChecked ? "line-through" : "none"
                                    }}
                                  >
                                    {item.title}
                                  </div>

                                  {(item.subtitle1 || item.subtitle2) && (
                                    <div style={{ fontSize: "1rem", color: "#64748b", marginTop: "0.3rem" }}>
                                      {item.subtitle1 && <div>• {item.subtitle1}</div>}
                                      {item.subtitle2 && <div>• {item.subtitle2}</div>}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Renderização Especial dos Inputs de Inventário para Waffles, Brownies e Panos */}
                              {item.id === "pf_waffles" && (
                                <div style={{ marginLeft: "2.2rem", background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
                                  <div style={{ fontWeight: 700, marginBottom: "0.75rem", fontSize: "0.95rem", color: "#334155" }}>
                                    Lotes de Waffles (Quantidade e Validade):
                                  </div>
                                  {waffleBatches.map((batch, bIdx) => (
                                    <div key={bIdx} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.6rem", alignItems: "center" }}>
                                      <input
                                        type="number"
                                        placeholder="Qtd"
                                        style={{ width: "130px", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                                        value={batch.quantity}
                                        onChange={(e) => handleWaffleChange(bIdx, "quantity", e.target.value)}
                                      />
                                      <input
                                        type="date"
                                        style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                                        value={batch.date}
                                        onChange={(e) => handleWaffleChange(bIdx, "date", e.target.value)}
                                      />
                                      {waffleBatches.length > 1 && (
                                        <button type="button" onClick={() => removeWaffleBatch(bIdx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                                          <Icons.BsTrash size={16} />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                  <button type="button" onClick={addWaffleBatch} style={{ background: "#e2e8f0", border: "none", padding: "0.4rem 0.85rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", color: "#475569", marginTop: "0.25rem" }}>
                                    + Adicionar Lote de Waffle
                                  </button>
                                </div>
                              )}

                              {item.id === "pf_brownies" && (
                                <div style={{ marginLeft: "2.2rem", background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
                                  <div style={{ fontWeight: 700, marginBottom: "0.75rem", fontSize: "0.95rem", color: "#334155" }}>
                                    Lotes de Brownies (Quantidade e Validade):
                                  </div>
                                  {brownieBatches.map((batch, bIdx) => (
                                    <div key={bIdx} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.6rem", alignItems: "center" }}>
                                      <input
                                        type="number"
                                        placeholder="Qtd"
                                        style={{ width: "130px", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                                        value={batch.quantity}
                                        onChange={(e) => handleBrownieChange(bIdx, "quantity", e.target.value)}
                                      />
                                      <input
                                        type="date"
                                        style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                                        value={batch.date}
                                        onChange={(e) => handleBrownieChange(bIdx, "date", e.target.value)}
                                      />
                                      {brownieBatches.length > 1 && (
                                        <button type="button" onClick={() => removeBrownieBatch(bIdx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                                          <Icons.BsTrash size={16} />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                  <button type="button" onClick={addBrownieBatch} style={{ background: "#e2e8f0", border: "none", padding: "0.4rem 0.85rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", color: "#475569", marginTop: "0.25rem" }}>
                                    + Adicionar Lote de Brownie
                                  </button>
                                </div>
                              )}

                              {item.id === "pf_panos" && (
                                <div style={{ marginLeft: "2.2rem", background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
                                  <div style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.95rem", color: "#334155" }}>
                                    Quantidade Total de Panos:
                                  </div>
                                  <input
                                    type="number"
                                    placeholder="Ex: 15"
                                    style={{ width: "150px", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                                    value={panosCount}
                                    onChange={(e) => {
                                      setPanosCount(e.target.value);
                                      if (!checkedItems["pf_panos"]) toggleItem("pf_panos");
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Seção Dupla de Confirmação: ID do Realizador e ID do Revisor */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "2px dashed #cbd5e1",
                  borderRadius: "16px",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  alignItems: "center"
                }}
              >
                {/* Mensagem de Erro Inline na caixa de confirmação */}
                {errorMessage && (
                  <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", padding: "0.75rem 1.25rem", borderRadius: "12px", width: "100%", maxWidth: "550px", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <Icons.BsExclamationTriangleFill size={18} color="#dc2626" /> {errorMessage}
                  </div>
                )}

                {/* Passo 1: Confirmação de Quem Realizou */}
                {todayChecklist && !isCheckingToday && todayChecklist.reviewer ? (
                  /* Checklist já completado e revisado hoje - bloquear tudo */
                  <div style={{ width: "100%", maxWidth: "550px", textAlign: "center", padding: "1rem", background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: "12px" }}>
                    <Icons.BsLockFill size={24} color="#f59e0b" />
                    <p style={{ margin: "0.5rem 0 0", fontWeight: 700, color: "#92400e" }}>
                      Não é possível realizar novo checklist. Já existe um completado e revisado hoje.
                    </p>
                  </div>
                ) : todayChecklist && !isCheckingToday && !todayChecklist.reviewer ? (
                  /* Checklist de hoje existe mas aguarda revisão - mostrar formulário de revisor diretamente */
                  <form onSubmit={handleConfirmFinal} style={{ width: "100%", maxWidth: "550px", textAlign: "center" }}>
                    <div
                      style={{
                        background: "#dcfce7",
                        border: "1px solid #86efac",
                        color: "#166534",
                        padding: "0.85rem 1.25rem",
                        borderRadius: "12px",
                        marginBottom: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontWeight: 700
                      }}
                    >
                      <Icons.BsCheckCircleFill color="#16a34a" size={18} />
                      Realizado por: <strong>{todayChecklist.person}</strong> às <strong>{new Date(todayChecklist.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</strong>
                    </div>

                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.35rem" }}>
                      2. ID do Revisor do Checklist
                    </div>
                    <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "1.25rem" }}>
                      Digite o ID do supervisor/revisor para validar e concluir o checklist.
                    </p>

                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        type="password"
                        placeholder="ID do Revisor..."
                        style={{
                          padding: "0.85rem 1.25rem",
                          borderRadius: "12px",
                          border: "2px solid #cbd5e1",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          textAlign: "center",
                          outline: "none",
                          width: "200px"
                        }}
                        value={revisorId}
                        onChange={(e) => setRevisorId(e.target.value)}
                        required
                      />

                      <button
                        type="submit"
                        className="btn-concluir"
                        style={{
                          padding: "0.85rem 1.75rem",
                          fontSize: "1rem",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                        disabled={submitting || isCheckingRevisor}
                      >
                        <Icons.BsCheckCircleFill size={18} />
                        {submitting || isCheckingRevisor ? "Enviando..." : "Finalizar & Enviar"}
                      </button>
                    </div>
                  </form>
                ) : !executorName ? (
                  <form onSubmit={handleValidateExecutor} style={{ width: "100%", maxWidth: "550px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.35rem" }}>
                      1. ID de Quem Realizou o Checklist
                    </div>
                    <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "1.25rem" }}>
                      Digite seu ID de funcionário cadastrado no banco de dados para assinar a execução.
                    </p>

                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        type="password"
                        placeholder="Digite seu ID..."
                        style={{
                          padding: "0.85rem 1.25rem",
                          borderRadius: "12px",
                          border: "2px solid #cbd5e1",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          textAlign: "center",
                          outline: "none",
                          width: "200px"
                        }}
                        value={executorId}
                        onChange={(e) => setExecutorId(e.target.value)}
                        required
                      />

                      <button
                        type="submit"
                        className="btn-concluir"
                        style={{
                          padding: "0.85rem 1.5rem",
                          fontSize: "1rem",
                          borderRadius: "12px"
                        }}
                        disabled={isCheckingExecutor}
                      >
                        {isCheckingExecutor ? "Verificando..." : "Confirmar Realização"}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Passo 2: Exibe o Realizador e Solicita ID do Revisor */
                  <form onSubmit={handleConfirmFinal} style={{ width: "100%", maxWidth: "550px", textAlign: "center" }}>
                    <div
                      style={{
                        background: "#dcfce7",
                        border: "1px solid #86efac",
                        color: "#166534",
                        padding: "0.85rem 1.25rem",
                        borderRadius: "12px",
                        marginBottom: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontWeight: 700
                      }}
                    >
                      <Icons.BsCheckCircleFill color="#16a34a" size={18} />
                      Realizado por: <strong>{executorName}</strong>
                    </div>

                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.35rem" }}>
                      2. ID do Revisor do Checklist
                    </div>
                    <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "1.25rem" }}>
                      Digite o ID do supervisor/revisor para validar e concluir o checklist.
                    </p>

                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        type="password"
                        placeholder="ID do Revisor..."
                        style={{
                          padding: "0.85rem 1.25rem",
                          borderRadius: "12px",
                          border: "2px solid #cbd5e1",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          textAlign: "center",
                          outline: "none",
                          width: "200px"
                        }}
                        value={revisorId}
                        onChange={(e) => setRevisorId(e.target.value)}
                        required
                      />

                      <button
                        type="submit"
                        className="btn-concluir"
                        style={{
                          padding: "0.85rem 1.75rem",
                          fontSize: "1rem",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                        disabled={submitting || isCheckingRevisor}
                      >
                        <Icons.BsCheckCircleFill size={18} />
                        {submitting || isCheckingRevisor ? "Enviando..." : "Finalizar & Enviar"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChecklistPage;
