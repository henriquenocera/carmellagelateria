import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import "../css/Frequencia.css";

interface ReviewItem {
  id: string;
  data_compra?: string;
  data_movimentacao?: string;
  data?: string;
  fornecedor?: string;
  quantidade_comprada?: number;
  valor_unitario?: number;
  quantidade?: number;
  origem?: string;
  destino?: string;
  insumo_id?: string;
  status_revisao?: string;
  revisao_observacao?: string;
  cadastro_insumos?: { nome: string };
  valor?: number;
  categoria?: string;
  conta?: string;
  table: "entradas_mercadoria" | "movimentacoes_estoque" | "lancamentos_financeiros";
}

const RevisoesAprovacoes: React.FC = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"todas" | "entradas" | "movimentacoes" | "lancamentos">("todas");
  const [filterStatus, setFilterStatus] = useState<"todos" | "revisao" | "exclusao">("todos");
  
  const [revisoes, setRevisoes] = useState<{
    entradas: ReviewItem[];
    movimentacoes: ReviewItem[];
    lancamentos: ReviewItem[];
  }>({
    entradas: [],
    movimentacoes: [],
    lancamentos: []
  });

  const fetchRevisoes = async () => {
    try {
      setLoading(true);
      const [entradasRes, movRes, lanRes] = await Promise.all([
        supabase
          .from("entradas_mercadoria")
          .select(`
            id,
            data_compra,
            fornecedor,
            quantidade_comprada,
            valor_unitario,
            insumo_id,
            status_revisao,
            revisao_observacao,
            cadastro_insumos(nome)
          `)
          .in("status_revisao", ["pending_user", "pending_admin", "pending_delete"]),
        supabase
          .from("movimentacoes_estoque")
          .select(`
            id,
            data_movimentacao,
            quantidade,
            origem,
            destino,
            insumo_id,
            status_revisao,
            revisao_observacao,
            cadastro_insumos(nome)
          `)
          .in("status_revisao", ["pending_user", "pending_admin", "pending_delete"]),
        supabase
          .from("lancamentos_financeiros")
          .select(`
            id,
            data,
            valor,
            fornecedor,
            categoria,
            conta,
            status_revisao,
            revisao_observacao
          `)
          .in("status_revisao", ["pending_user", "pending_admin", "pending_delete"])
      ]);

      const entradasData: ReviewItem[] = (entradasRes.data || []).map((item: any) => ({ ...item, table: "entradas_mercadoria" }));
      const movData: ReviewItem[] = (movRes.data || []).map((item: any) => ({ ...item, table: "movimentacoes_estoque" }));
      const lanData: ReviewItem[] = (lanRes.data || []).map((item: any) => ({ ...item, table: "lancamentos_financeiros" }));

      setRevisoes({
        entradas: entradasData,
        movimentacoes: movData,
        lancamentos: lanData
      });
    } catch (err) {
      console.error("Erro ao buscar dados de revisão:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchRevisoes();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleApproveReview = async (table: string, id: string) => {
    try {
      const isFinance = table === "lancamentos_financeiros";
      const { error } = await supabase
        .from(table)
        .update({ status_revisao: isFinance ? null : "none", revisao_observacao: null })
        .eq("id", id);

      if (error) throw error;

      setRevisoes(prev => {
        const key = table === "entradas_mercadoria" ? "entradas"
          : table === "movimentacoes_estoque" ? "movimentacoes"
            : "lancamentos";
        return {
          ...prev,
          [key]: prev[key].filter(item => item.id !== id)
        };
      });
    } catch (err) {
      console.error("Erro ao aprovar revisão:", err);
      alert("Erro ao aprovar a revisão.");
    }
  };

  const handleConfirmDelete = async (table: string, id: string) => {
    if (!window.confirm("Deseja realmente confirmar a exclusão definitiva deste registro?")) return;
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", id);

      if (error) throw error;

      setRevisoes(prev => {
        const key = table === "entradas_mercadoria" ? "entradas"
          : table === "movimentacoes_estoque" ? "movimentacoes"
            : "lancamentos";
        return {
          ...prev,
          [key]: prev[key].filter(item => item.id !== id)
        };
      });
    } catch (err) {
      console.error("Erro ao confirmar exclusão:", err);
      alert("Erro ao excluir o registro.");
    }
  };

  const handleRestoreDelete = async (table: string, id: string) => {
    try {
      const isFinance = table === "lancamentos_financeiros";
      const { error } = await supabase
        .from(table)
        .update({ status_revisao: isFinance ? null : "none", revisao_observacao: null })
        .eq("id", id);

      if (error) throw error;

      setRevisoes(prev => {
        const key = table === "entradas_mercadoria" ? "entradas"
          : table === "movimentacoes_estoque" ? "movimentacoes"
            : "lancamentos";
        return {
          ...prev,
          [key]: prev[key].filter(item => item.id !== id)
        };
      });
    } catch (err) {
      console.error("Erro ao restaurar registro:", err);
      alert("Erro ao restaurar o registro.");
    }
  };

  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case "pending_user":
        return (
          <span style={{ fontSize: "1.1rem", color: "#b45309", backgroundColor: "#fffbeb", border: "1px solid #fde68a", padding: "4px 10px", borderRadius: "12px", fontWeight: "700" }}>
            Revisão Usuário
          </span>
        );
      case "pending_admin":
        return (
          <span style={{ fontSize: "1.1rem", color: "#c2410c", backgroundColor: "#ffedd5", border: "1px solid #fed7aa", padding: "4px 10px", borderRadius: "12px", fontWeight: "700" }}>
            Revisão Admin
          </span>
        );
      case "pending_delete":
        return (
          <span style={{ fontSize: "1.1rem", color: "#b91c1c", backgroundColor: "#fee2e2", border: "1px solid #fecaca", padding: "4px 10px", borderRadius: "12px", fontWeight: "700" }}>
            Exclusão Pendente
          </span>
        );
      default:
        return null;
    }
  };

  const renderRevisaoObservacao = (observacao?: string) => {
    if (!observacao || observacao === "Sem alterações") return null;

    const revisions = observacao.split(" | ").map(rev => rev.trim()).filter(Boolean);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
        {revisions.map((revision, revIdx) => {
          const parts = revision.split(", ").map(p => p.trim()).filter(Boolean);
          return (
            <div key={revIdx} style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
              {parts.map((part, partIdx) => {
                const colonIndex = part.indexOf(":");
                if (colonIndex === -1) {
                  return (
                    <span key={partIdx} style={{ padding: "4px 8px", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "1.15rem", color: "#64748b", fontWeight: "500" }}>
                      {part}
                    </span>
                  );
                }

                const field = part.substring(0, colonIndex).trim();
                const values = part.substring(colonIndex + 1).trim();
                const arrowIndex = values.indexOf("➔");

                if (arrowIndex === -1) {
                  return (
                    <span key={partIdx} style={{ padding: "4px 8px", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "1.15rem", color: "#64748b", fontWeight: "500" }}>
                      <strong>{field}:</strong> {values}
                    </span>
                  );
                }

                const antes = values.substring(0, arrowIndex).trim();
                const depois = values.substring(arrowIndex + 1).trim();

                return (
                  <div key={partIdx} style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#fff", border: "1px solid #e2e8f0", padding: "4px 10px", borderRadius: "8px", fontSize: "1.2rem", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
                    <span style={{ fontWeight: "600", color: "#64748b" }}>{field}</span>
                    <span style={{ color: "#ef4444", textDecoration: "line-through", backgroundColor: "#fef2f2", padding: "2px 6px", borderRadius: "4px", fontSize: "1.15rem" }}>
                      {antes}
                    </span>
                    <span style={{ color: "#94a3b8", display: "inline-flex", alignItems: "center" }}>➔</span>
                    <span style={{ color: "#16a34a", fontWeight: "600", backgroundColor: "#f0fdf4", padding: "2px 6px", borderRadius: "4px", fontSize: "1.15rem" }}>
                      {depois}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const renderActionButtons = (table: string, id: string, status?: string) => {
    if (status === "pending_delete") {
      return (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => handleConfirmDelete(table, id)}
            style={{
              padding: "8px 14px",
              fontSize: "1.2rem",
              color: "#fff",
              backgroundColor: "#ef4444",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s"
            }}
          >
            <Icons.BsTrash /> Confirmar Exclusão
          </button>
          <button
            onClick={() => handleRestoreDelete(table, id)}
            style={{
              padding: "8px 14px",
              fontSize: "1.2rem",
              color: "#334155",
              backgroundColor: "#e2e8f0",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s"
            }}
          >
            <Icons.BsArrowCounterclockwise /> Restaurar
          </button>
        </div>
      );
    } else {
      return (
        <button
          onClick={() => handleApproveReview(table, id)}
          style={{
            padding: "8px 16px",
            fontSize: "1.2rem",
            color: "#fff",
            backgroundColor: "#10b981",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s",
            boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)"
          }}
        >
          <Icons.BsCheckLg /> Aprovar Alteração
        </button>
      );
    }
  };

  const applyStatusFilter = (items: ReviewItem[]) => {
    if (filterStatus === "revisao") {
      return items.filter(item => item.status_revisao !== "pending_delete");
    }
    if (filterStatus === "exclusao") {
      return items.filter(item => item.status_revisao === "pending_delete");
    }
    return items;
  };

  const filteredEntradas = applyStatusFilter(revisoes.entradas);
  const filteredMovimentacoes = applyStatusFilter(revisoes.movimentacoes);
  const filteredLancamentos = applyStatusFilter(revisoes.lancamentos);

  const totalEntradas = revisoes.entradas.length;
  const totalMovimentacoes = revisoes.movimentacoes.length;
  const totalLancamentos = revisoes.lancamentos.length;
  const totalGeral = totalEntradas + totalMovimentacoes + totalLancamentos;

  const showEntradas = (activeTab === "todas" || activeTab === "entradas") && filteredEntradas.length > 0;
  const showMovimentacoes = (activeTab === "todas" || activeTab === "movimentacoes") && filteredMovimentacoes.length > 0;
  const showLancamentos = (activeTab === "todas" || activeTab === "lancamentos") && filteredLancamentos.length > 0;

  const hasItemsToDisplay = showEntradas || showMovimentacoes || showLancamentos;

  if (!isAdmin && !loading) {
    return (
      <div className="frequencia-container" style={{ padding: "40px 40px 40px 115px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <Icons.BsShieldLock style={{ fontSize: "3.5rem", color: "#ef4444", marginBottom: "16px" }} />
          <h2 style={{ color: "#334155", margin: "0 0 8px 0" }}>Acesso Restrito</h2>
          <p style={{ color: "#64748b", fontSize: "1.2rem", margin: 0 }}>Você precisa ser um administrador para acessar a central de revisões e aprovações.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Revisões e Aprovações - Carmella Gelateria</title>
      </Helmet>

      <div className="frequencia-container" style={{ padding: "40px 40px 40px 115px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "2.6rem", color: "#e11d48", margin: "0 0 8px 0", fontWeight: "700", display: "flex", alignItems: "center", gap: "12px" }}>
              <Icons.BsShieldCheck /> Revisões e Aprovações
            </h1>
            <p style={{ color: "#64748b", fontSize: "1.3rem", margin: 0 }}>
              Gerencie solicitações de alteração, edições pendentes e exclusões enviadas pelos usuários.
            </p>
          </div>

          <button
            onClick={fetchRevisoes}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              backgroundColor: "#fff",
              color: "#e11d48",
              border: "2px solid #e11d48",
              borderRadius: "8px",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "1.1rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              transition: "all 0.2s"
            }}
          >
            <Icons.BsArrowClockwise className={loading ? "spin" : ""} /> Atualizar Lista
          </button>
        </div>

        {/* Tab Filters & Options */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
          {/* Main Category Tabs */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveTab("todas")}
              style={{
                padding: "10px 20px",
                fontSize: "1.25rem",
                fontWeight: "700",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                backgroundColor: activeTab === "todas" ? "#e11d48" : "#f1f5f9",
                color: activeTab === "todas" ? "#fff" : "#64748b",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              Todas
              <span style={{
                backgroundColor: activeTab === "todas" ? "rgba(255,255,255,0.25)" : "#cbd5e1",
                color: activeTab === "todas" ? "#fff" : "#475569",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "1rem"
              }}>
                {totalGeral}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("entradas")}
              style={{
                padding: "10px 20px",
                fontSize: "1.25rem",
                fontWeight: "700",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                backgroundColor: activeTab === "entradas" ? "#e11d48" : "#f1f5f9",
                color: activeTab === "entradas" ? "#fff" : "#64748b",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              Entradas de Mercadoria
              <span style={{
                backgroundColor: activeTab === "entradas" ? "rgba(255,255,255,0.25)" : "#cbd5e1",
                color: activeTab === "entradas" ? "#fff" : "#475569",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "1rem"
              }}>
                {totalEntradas}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("movimentacoes")}
              style={{
                padding: "10px 20px",
                fontSize: "1.25rem",
                fontWeight: "700",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                backgroundColor: activeTab === "movimentacoes" ? "#e11d48" : "#f1f5f9",
                color: activeTab === "movimentacoes" ? "#fff" : "#64748b",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              Movimentações
              <span style={{
                backgroundColor: activeTab === "movimentacoes" ? "rgba(255,255,255,0.25)" : "#cbd5e1",
                color: activeTab === "movimentacoes" ? "#fff" : "#475569",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "1rem"
              }}>
                {totalMovimentacoes}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("lancamentos")}
              style={{
                padding: "10px 20px",
                fontSize: "1.25rem",
                fontWeight: "700",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                backgroundColor: activeTab === "lancamentos" ? "#e11d48" : "#f1f5f9",
                color: activeTab === "lancamentos" ? "#fff" : "#64748b",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              Financeiro
              <span style={{
                backgroundColor: activeTab === "lancamentos" ? "rgba(255,255,255,0.25)" : "#cbd5e1",
                color: activeTab === "lancamentos" ? "#fff" : "#475569",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "1rem"
              }}>
                {totalLancamentos}
              </span>
            </button>
          </div>

          {/* Sub filter by status */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#fff", padding: "6px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
            <span style={{ fontSize: "1.1rem", fontWeight: "600", color: "#64748b" }}>Filtrar Tipo:</span>
            <select
              value={filterStatus}
              onChange={(e: any) => setFilterStatus(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "1.1rem", fontWeight: "600", outline: "none", backgroundColor: "#fff" }}
            >
              <option value="todos">Todos os Tipos</option>
              <option value="revisao">Apenas Edições Pendentes</option>
              <option value="exclusao">Apenas Exclusões Pendentes</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2.5rem", color: "#e11d48" }} />
          </div>
        ) : !hasItemsToDisplay ? (
          <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#fff", borderRadius: "12px", border: "2px dashed #cbd5e1" }}>
            <Icons.BsCheckCircleFill style={{ fontSize: "3.5rem", color: "#10b981", marginBottom: "16px" }} />
            <h2 style={{ margin: "0 0 8px 0", color: "#334155", fontSize: "1.8rem" }}>Nenhuma pendência localizada</h2>
            <p style={{ color: "#64748b", fontSize: "1.2rem", maxWidth: "500px", margin: "0 auto" }}>
              Não há nenhuma revisão ou confirmação de exclusão pendente para a categoria selecionada. Tudo em dia!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* Entradas Section */}
            {showEntradas && (
              <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <h3 style={{ fontSize: "1.6rem", color: "#334155", borderBottom: "2px solid #f1f5f9", paddingBottom: "12px", margin: "0 0 20px 0", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsCartCheck style={{ color: "#3b82f6" }} /> Entrada de Mercadoria ({filteredEntradas.length})
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {filteredEntradas.map(item => {
                    const totalVal = (item.quantidade_comprada || 0) * (item.valor_unitario || 0);
                    const insumoNome = item.cadastro_insumos?.nome || "Insumo Desconhecido";
                    return (
                      <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#f8fafc", padding: "20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "12px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "1.4rem" }}>
                              Compra de {item.quantidade_comprada}x {insumoNome} ({item.fornecedor || "Sem Fornecedor"})
                            </span>
                            <span style={{ fontSize: "1.2rem", color: "#64748b" }}>
                              Data: {item.data_compra ? new Date(item.data_compra).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "-"} | Total: <strong style={{ color: "#334155" }}>R$ {totalVal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {renderStatusBadge(item.status_revisao)}
                            {renderActionButtons("entradas_mercadoria", item.id, item.status_revisao)}
                          </div>
                        </div>

                        {item.revisao_observacao && item.revisao_observacao !== "Sem alterações" && (
                          <div style={{ padding: "14px 18px", backgroundColor: "#fffbeb", borderRadius: "8px", border: "1px dashed #fcd34d", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "#7c2d12" }}>Alterações Pendentes:</span>
                            {renderRevisaoObservacao(item.revisao_observacao)}
                          </div>
                        )}

                        {(!item.revisao_observacao || item.revisao_observacao === "Sem alterações") && item.status_revisao !== "pending_delete" && (
                          <div style={{ padding: "10px 14px", backgroundColor: "#f0fdf4", borderRadius: "6px", border: "1px dashed #bbf7d0", fontSize: "1.25rem", color: "#166534" }}>
                            <strong>Ação:</strong> Novo registro criado pendente de aprovação.
                          </div>
                        )}

                        {item.status_revisao === "pending_delete" && (
                          <div style={{ padding: "10px 14px", backgroundColor: "#fef2f2", borderRadius: "6px", border: "1px dashed #fecaca", fontSize: "1.25rem", color: "#991b1b" }}>
                            <strong>Ação:</strong> Este registro será excluído definitivamente.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Movimentações Section */}
            {showMovimentacoes && (
              <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <h3 style={{ fontSize: "1.6rem", color: "#334155", borderBottom: "2px solid #f1f5f9", paddingBottom: "12px", margin: "0 0 20px 0", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsArrowLeftRight style={{ color: "#f59e0b" }} /> Movimentações de Estoque ({filteredMovimentacoes.length})
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {filteredMovimentacoes.map(item => {
                    const insumoNome = item.cadastro_insumos?.nome || "Insumo Desconhecido";
                    return (
                      <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#f8fafc", padding: "20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "12px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "1.4rem" }}>
                              Mover {item.quantidade}x {insumoNome} de {item.origem || "Sem Origem"} para {item.destino || "Sem Destino"}
                            </span>
                            <span style={{ fontSize: "1.2rem", color: "#64748b" }}>
                              Data: {item.data_movimentacao ? new Date(item.data_movimentacao).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "-"}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {renderStatusBadge(item.status_revisao)}
                            {renderActionButtons("movimentacoes_estoque", item.id, item.status_revisao)}
                          </div>
                        </div>

                        {item.revisao_observacao && item.revisao_observacao !== "Sem alterações" && (
                          <div style={{ padding: "14px 18px", backgroundColor: "#fffbeb", borderRadius: "8px", border: "1px dashed #fcd34d", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "#7c2d12" }}>Alterações Pendentes:</span>
                            {renderRevisaoObservacao(item.revisao_observacao)}
                          </div>
                        )}

                        {(!item.revisao_observacao || item.revisao_observacao === "Sem alterações") && item.status_revisao !== "pending_delete" && (
                          <div style={{ padding: "10px 14px", backgroundColor: "#f0fdf4", borderRadius: "6px", border: "1px dashed #bbf7d0", fontSize: "1.25rem", color: "#166534" }}>
                            <strong>Ação:</strong> Novo registro criado pendente de aprovação.
                          </div>
                        )}

                        {item.status_revisao === "pending_delete" && (
                          <div style={{ padding: "10px 14px", backgroundColor: "#fef2f2", borderRadius: "6px", border: "1px dashed #fecaca", fontSize: "1.25rem", color: "#991b1b" }}>
                            <strong>Ação:</strong> Este registro será excluído definitivamente.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lancamentos Section */}
            {showLancamentos && (
              <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <h3 style={{ fontSize: "1.6rem", color: "#334155", borderBottom: "2px solid #f1f5f9", paddingBottom: "12px", margin: "0 0 20px 0", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsCurrencyDollar style={{ color: "#10b981" }} /> Lançamentos Financeiros ({filteredLancamentos.length})
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {filteredLancamentos.map(item => {
                    const isDespesa = (item.valor || 0) < 0;
                    return (
                      <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#f8fafc", padding: "20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "12px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "1.4rem" }}>
                              {item.fornecedor || "Lançamento Sem Fornecedor"} - Conta: {item.conta} {item.categoria && `(${item.categoria})`}
                            </span>
                            <span style={{ fontSize: "1.2rem", color: "#64748b" }}>
                              Data: {item.data ? new Date(item.data).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "-"} | Valor: <span style={{ fontWeight: "700", color: isDespesa ? "#ef4444" : "#16a34a" }}>R$ {(item.valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {renderStatusBadge(item.status_revisao)}
                            {renderActionButtons("lancamentos_financeiros", item.id, item.status_revisao)}
                          </div>
                        </div>

                        {item.revisao_observacao && item.revisao_observacao !== "Sem alterações" && (
                          <div style={{ padding: "14px 18px", backgroundColor: "#fffbeb", borderRadius: "8px", border: "1px dashed #fcd34d", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "#7c2d12" }}>Alterações Pendentes:</span>
                            {renderRevisaoObservacao(item.revisao_observacao)}
                          </div>
                        )}

                        {(!item.revisao_observacao || item.revisao_observacao === "Sem alterações") && item.status_revisao !== "pending_delete" && (
                          <div style={{ padding: "10px 14px", backgroundColor: "#f0fdf4", borderRadius: "6px", border: "1px dashed #bbf7d0", fontSize: "1.25rem", color: "#166534" }}>
                            <strong>Ação:</strong> Novo registro criado pendente de aprovação.
                          </div>
                        )}

                        {item.status_revisao === "pending_delete" && (
                          <div style={{ padding: "10px 14px", backgroundColor: "#fef2f2", borderRadius: "6px", border: "1px dashed #fecaca", fontSize: "1.25rem", color: "#991b1b" }}>
                            <strong>Ação:</strong> Este registro será excluído definitivamente.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default RevisoesAprovacoes;
