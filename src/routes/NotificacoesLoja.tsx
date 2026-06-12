import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "../AuthProvider";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";

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
  const [repeticaoDiaria, setRepeticaoDiaria] = useState(false);
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
      alert("Por favor, preencha o título, a mensagem e a data/horário.");
      return;
    }

    try {
      setSaving(true);

      const offsetMinutes = new Date().getTimezoneOffset();
      const sign = offsetMinutes > 0 ? "-" : "+";
      const hours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, '0');
      const minutes = String(Math.abs(offsetMinutes) % 60).padStart(2, '0');
      const dataComFuso = `${dataAgendada}${sign}${hours}:${minutes}`;

      let error;

      if (editingId) {
        // Atualiza a notificação existente
        const { error: updateError } = await supabase
          .from("notificacao_lojas")
          .update({ 
            titulo, 
            mensagem, 
            loja, 
            data_agendada: dataComFuso,
            repeticao_diaria: repeticaoDiaria
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
            repeticao_diaria: repeticaoDiaria
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

  const resetForm = () => {
    setTitulo("");
    setMensagem("");
    setLoja("Todas");
    setDataAgendada("");
    setRepeticaoDiaria(false);
    setEditingId(null);
  };

  const handleEdit = (notif: any) => {
    setTitulo(notif.titulo);
    setMensagem(notif.mensagem);
    setLoja(notif.loja || "Todas");
    
    // Converte a data_agendada do banco para o formato do input datetime-local (YYYY-MM-DDTHH:mm)
    if (notif.data_agendada) {
      const date = new Date(notif.data_agendada);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
      setDataAgendada(localISOTime);
    } else {
      setDataAgendada("");
    }
    
    setRepeticaoDiaria(notif.repeticao_diaria || false);
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
              Cadastre avisos e notificações que aparecerão para as lojas.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", alignItems: "start" }}>
          {/* Formulário */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "var(--secondary-color)", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem" }}>
              {editingId ? "Editar Notificação" : "Nova Notificação"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--text-dark)" }}>Título</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Atualização de Cardápio"
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "1rem" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
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

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--text-dark)" }}>Data e Horário</label>
                <input
                  type="datetime-local"
                  value={dataAgendada}
                  onChange={(e) => setDataAgendada(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "1rem", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--text-dark)" }}>Mensagem</label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Escreva os detalhes da notificação aqui..."
                  rows={4}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "1rem", resize: "vertical" }}
                ></textarea>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: 600, color: "var(--text-dark)" }}>
                  <input
                    type="checkbox"
                    checked={repeticaoDiaria}
                    onChange={(e) => setRepeticaoDiaria(e.target.checked)}
                    style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer", accentColor: "var(--primary-color)" }}
                  />
                  Repetir todos os dias (nesse mesmo horário)
                </label>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: "0.875rem",
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
                  {saving ? "Salvando..." : (editingId ? "Atualizar Notificação" : "Enviar Notificação")}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    style={{
                      flex: 1,
                      padding: "0.875rem",
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

          {/* Lista */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "var(--secondary-color)", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Notificações Enviadas</span>
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
                <p>Nenhuma notificação cadastrada.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {notificacoes.map(notif => (
                  <div
                    key={notif.id}
                    style={{
                      padding: "1.25rem",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      borderLeft: "5px solid var(--primary-color, #d4a373)",
                      background: "#fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "var(--secondary-color, #1e293b)" }}>
                        {notif.titulo}
                      </h3>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleEdit(notif)}
                          style={{
                            background: "rgba(212, 163, 115, 0.1)",
                            border: "none",
                            color: "var(--primary-color, #d4a373)",
                            cursor: "pointer",
                            padding: "8px",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(212, 163, 115, 0.2)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(212, 163, 115, 0.1)"}
                          title="Editar"
                        >
                          <Icons.BsPencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(notif.id)}
                          style={{
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            padding: "8px",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                          title="Excluir"
                        >
                          <Icons.BsTrash size={16} />
                        </button>
                      </div>
                    </div>

                    <div style={{
                      background: "#f8fafc",
                      padding: "1rem",
                      borderRadius: "8px",
                      color: "#334155",
                      fontSize: "1rem",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                      border: "1px solid #f1f5f9"
                    }}>
                      {notif.mensagem}
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", fontSize: "0.85rem" }}>
                      <span style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        background: "#e0e7ff", color: "#4f46e5", padding: "4px 10px", borderRadius: "20px", fontWeight: 600
                      }}>
                        <Icons.BsShop /> {notif.loja || "Todas"}
                      </span>

                      {notif.data_agendada && (
                        <span style={{
                          display: "flex", alignItems: "center", gap: "6px",
                          background: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: "20px", fontWeight: 600
                        }}>
                          <Icons.BsCalendarCheck />
                          Agendado: {new Date(notif.data_agendada).toLocaleString("pt-BR", { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      )}

                      <span style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        background: "#f1f5f9", color: "#64748b", padding: "4px 10px", borderRadius: "20px", fontWeight: 600
                      }}>
                        <Icons.BsCalendarPlus />
                        Criado: {new Date(notif.created_at).toLocaleString("pt-BR", { dateStyle: 'short', timeStyle: 'short' })}
                      </span>

                      {notif.repeticao_diaria && (
                        <span style={{
                          display: "flex", alignItems: "center", gap: "6px",
                          background: "#fef3c7", color: "#d97706", padding: "4px 10px", borderRadius: "20px", fontWeight: 600
                        }}>
                          <Icons.BsArrowRepeat size={16} />
                          Repete Diariamente
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificacoesLoja;
