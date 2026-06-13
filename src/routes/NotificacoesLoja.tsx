import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "../AuthProvider";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";

const getLojaColors = (loja: string) => {
  if (loja === "Ahú") return { bg: "#fce7f3", color: "#be185d" }; // Rosa
  if (loja === "Alto XV") return { bg: "#e0f2fe", color: "#0369a1" }; // Azul
  return { bg: "#f3f4f6", color: "#374151" }; // Cinza para Todas
};

const NotificacoesLoja: React.FC = () => {
  const { isAdmin } = useAuth();
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loja, setLoja] = useState("Todas");
  const [dataAgendada, setDataAgendada] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchNotificacoes();
    }
  }, [isAdmin]);

  const fetchNotificacoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("notificacao_lojas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotificacoes(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !mensagem || !dataAgendada) {
      alert("Por favor, preencha o título, a mensagem e o horário.");
      return;
    }

    try {
      setSaving(true);

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const baseDate = `${year}-${month}-${day}`;

      const offsetMinutes = now.getTimezoneOffset();
      const sign = offsetMinutes > 0 ? "-" : "+";
      const hours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, '0');
      const minutes = String(Math.abs(offsetMinutes) % 60).padStart(2, '0');
      const dataComFuso = `${baseDate}T${dataAgendada}${sign}${hours}:${minutes}`;

      let error;

      if (editingId) {
        // Atualiza a notificação existente
        const { error: updateError } = await supabase
          .from("notificacao_lojas")
          .update({ 
            titulo, 
            mensagem, 
            loja, 
            data_agendada: dataComFuso
          })
          .eq("id", editingId);
        error = updateError;
      } else {
        // Cria uma nova notificação
        const { error: insertError } = await supabase
          .from("notificacao_lojas")
          .insert([{ 
            titulo, 
            mensagem, 
            loja, 
            data_agendada: dataComFuso,
            dias_semana: []
          }]);
        error = insertError;
      }

      if (error) throw error;

      alert(editingId ? "Notificação atualizada com sucesso!" : "Notificação cadastrada com sucesso!");
      resetForm();
      fetchNotificacoes();
    } catch (error: any) {
      console.error("Erro ao salvar notificação:", error);
      alert(`Erro ao salvar notificação: ${error.message || "Verifique se a tabela foi criada corretamente."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDia = async (notif: any, diaValue: number) => {
    const diasAtuais = notif.dias_semana || [];
    let novosDias;
    if (diasAtuais.includes(diaValue)) {
      novosDias = diasAtuais.filter((d: number) => d !== diaValue);
    } else {
      novosDias = [...diasAtuais, diaValue];
    }

    // Otimista
    setNotificacoes(prev => prev.map(n => n.id === notif.id ? { ...n, dias_semana: novosDias } : n));

    try {
      const { error } = await supabase
        .from("notificacao_lojas")
        .update({ dias_semana: novosDias })
        .eq("id", notif.id);
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Erro ao atualizar dias da semana:", error);
      alert("Erro ao atualizar os dias da semana. Certifique-se de ter criado a coluna 'dias_semana' como JSONB na tabela 'notificacao_lojas'.");
      // Reverter
      setNotificacoes(prev => prev.map(n => n.id === notif.id ? { ...n, dias_semana: diasAtuais } : n));
    }
  };

  const resetForm = () => {
    setTitulo("");
    setMensagem("");
    setLoja("Todas");
    setDataAgendada("");
    setEditingId(null);
  };

  const handleEdit = (notif: any) => {
    setTitulo(notif.titulo);
    setMensagem(notif.mensagem);
    setLoja(notif.loja || "Todas");
    
    // Converte a data_agendada do banco para extrair apenas o horário local
    if (notif.data_agendada) {
      const date = new Date(notif.data_agendada);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
      const timeOnly = localISOTime.split("T")[1];
      setDataAgendada(timeOnly);
    } else {
      setDataAgendada("");
    }
    
    setEditingId(notif.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir esta notificação?")) return;

    try {
      const { error } = await supabase
        .from("notificacao_lojas")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setNotificacoes(prev => prev.filter(n => n.id !== id));
    } catch (error: any) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir notificação.");
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Acesso Negado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Notificações Loja</title>
      </Helmet>
      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ color: "var(--secondary-color)", fontSize: "2rem", margin: 0 }}>Notificações Loja</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "1.1rem" }}>
              Cadastre avisos e tarefas para marcar os dias da semana em que ocorrerão.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Formulário */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "var(--secondary-color)", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem" }}>
              {editingId ? "Editar Tarefa" : "Nova Tarefa"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--text-dark)" }}>Título</label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Limpeza das Máquinas"
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "1rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--text-dark)" }}>Loja Alvo</label>
                  <select
                    value={loja}
                    onChange={(e) => setLoja(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "1rem" }}
                  >
                    <option value="Todas">Todas as Lojas</option>
                    <option value="Ahú">Ahú</option>
                    <option value="Alto XV">Alto XV</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--text-dark)" }}>Horário da Tarefa</label>
                  <input
                    type="time"
                    value={dataAgendada}
                    onChange={(e) => setDataAgendada(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "1rem", fontFamily: "inherit" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--text-dark)" }}>Mensagem</label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Instruções ou detalhes da tarefa..."
                  rows={2}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "1rem", resize: "vertical" }}
                ></textarea>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "0.875rem 2rem",
                    backgroundColor: "var(--primary-color, #d4a373)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.7 : 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  {saving ? <Icons.BsHourglassSplit className="spin" /> : (editingId ? <Icons.BsPencil /> : <Icons.BsSend />)}
                  {saving ? "Salvando..." : (editingId ? "Atualizar Tarefa" : "Criar Tarefa")}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    style={{
                      padding: "0.875rem 2rem",
                      backgroundColor: "#f1f5f9",
                      color: "#475569",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      cursor: saving ? "not-allowed" : "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <Icons.BsXCircle />
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista em Tabela */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "var(--secondary-color)", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Tarefas e Rotinas</span>
              <button onClick={fetchNotificacoes} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary-color)" }}>
                <Icons.BsArrowClockwise size={20} />
              </button>
            </h2>

            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <Icons.BsArrowClockwise className="spin" size={30} color="var(--primary-color)" />
              </div>
            ) : notificacoes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                <Icons.BsBellSlash size={40} style={{ marginBottom: "1rem", opacity: 0.5 }} />
                <p>Nenhuma tarefa cadastrada.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: "1rem", textAlign: "left", color: "var(--secondary-color)" }}>Tarefa</th>
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((d, idx) => (
                        <th key={idx} style={{ padding: "1rem", textAlign: "center", color: "var(--secondary-color)", width: "60px", fontSize: "0.9rem" }}>{d}</th>
                      ))}
                      <th style={{ padding: "1rem", textAlign: "center", color: "var(--secondary-color)", width: "90px" }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notificacoes.map(notif => (
                      <tr key={notif.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "1rem" }}>
                          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--secondary-color)", marginBottom: "0.4rem" }}>{notif.titulo}</div>
                          <div style={{ fontSize: "1rem", color: "#64748b", marginBottom: "0.75rem", maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={notif.mensagem}>
                            {notif.mensagem}
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                            <span style={{ 
                              display: "flex", alignItems: "center", gap: "0.4rem", 
                              background: getLojaColors(notif.loja || "Todas").bg, 
                              color: getLojaColors(notif.loja || "Todas").color, 
                              padding: "4px 12px", borderRadius: "12px", fontWeight: 700, fontSize: "1rem" 
                            }}>
                              <Icons.BsShop size={14} />
                              {notif.loja || "Todas"}
                            </span>
                            {notif.data_agendada && (
                              <span style={{ 
                                display: "flex", alignItems: "center", gap: "0.4rem", 
                                background: "#fef3c7", color: "#b45309", 
                                padding: "4px 12px", borderRadius: "12px", fontWeight: 800, fontSize: "1rem" 
                              }}>
                                <Icons.BsClockFill size={14} />
                                {new Date(notif.data_agendada).toLocaleString("pt-BR", { timeStyle: 'short' })}
                              </span>
                            )}
                          </div>
                        </td>
                        {[0, 1, 2, 3, 4, 5, 6].map(dia => (
                          <td key={dia} style={{ padding: "1rem", textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={(notif.dias_semana || []).includes(dia)}
                              onChange={() => handleToggleDia(notif, dia)}
                              style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer", accentColor: "var(--primary-color)" }}
                              title={`Marcar para ${['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][dia]}`}
                            />
                          </td>
                        ))}
                        <td style={{ padding: "1rem", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                            <button
                              onClick={() => handleEdit(notif)}
                              style={{
                                background: "rgba(212, 163, 115, 0.1)", border: "none", color: "var(--primary-color, #d4a373)",
                                cursor: "pointer", padding: "6px", borderRadius: "6px", display: "flex"
                              }}
                              title="Editar"
                            ><Icons.BsPencil size={16} /></button>
                            <button
                              onClick={() => handleDelete(notif.id)}
                              style={{
                                background: "rgba(239, 68, 68, 0.1)", border: "none", color: "#ef4444",
                                cursor: "pointer", padding: "6px", borderRadius: "6px", display: "flex"
                              }}
                              title="Excluir"
                            ><Icons.BsTrash size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificacoesLoja;
