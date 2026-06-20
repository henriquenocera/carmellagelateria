import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import Select from "react-select";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/Frequencia.css";
import ClienteFormModal from "../components/ClienteFormModal.tsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

const STATUSES = ["Lead", "Em Contato", "Negócio Fechado", "Perdido"];

const getStatusColor = (statusVal: string) => {
  switch (statusVal) {
    case "Lead": return "#3b82f6";
    case "Em Contato": return "#f59e0b";
    case "Negócio Fechado": return "#10b981";
    case "Perdido": return "#ef4444";
    default: return "#94a3b8";
  }
};

const formatDateBr = (dateStr: string) => {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

function CRM() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<any[]>([]);
  const [filterNome, setFilterNome] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<any>(null);
  const [editingProximoContatoId, setEditingProximoContatoId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      navigate("/");
    } else {
      fetchClientes();
    }
  }, [session, navigate]);

  async function fetchClientes() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clientes_food_service")
        .select(`
          *,
          historico_crm (date)
        `)
        .eq("ativo", true)
        .order("nome", { ascending: true });

      if (error) throw error;

      const clientesProcessados = (data || []).map((c: any) => {
        let ultimo = c.data_ultimo_contato;
        let primeiro = c.data_primeiro_contato;

        if (c.historico_crm && c.historico_crm.length > 0) {
          const sorted = c.historico_crm.map((h: any) => h.date).sort().reverse();

          if (!ultimo || sorted[0] > ultimo) {
            ultimo = sorted[0];
          }

          const maisAntigo = sorted[sorted.length - 1];
          if (!primeiro || maisAntigo < primeiro) {
            primeiro = maisAntigo;
          }
        }
        return {
          ...c,
          data_ultimo_contato_calc: ultimo,
          data_primeiro_contato_calc: primeiro
        };
      });

      clientesProcessados.sort((a: any, b: any) => {
        const getStatusOrder = (status: string) => {
          switch (status) {
            case "Em Contato": return 1;
            case "Lead": return 2;
            case "Negócio Fechado": return 3;
            case "Perdido": return 4;
            default: return 5;
          }
        };

        const orderA = getStatusOrder(a.status);
        const orderB = getStatusOrder(b.status);

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        if (orderA === 1 || orderA === 2) {
          const diasA = getDiasRestantes(a.data_proximo_contato);
          const diasB = getDiasRestantes(b.data_proximo_contato);

          if (diasA !== null && diasB !== null) {
            return diasA - diasB;
          }
          if (diasA !== null) return -1;
          if (diasB !== null) return 1;
        }

        return a.nome.localeCompare(b.nome);
      });

      setClientes(clientesProcessados);
    } catch (err) {
      console.error("Erro ao buscar clientes pro CRM:", err);
      alert("Erro ao carregar os clientes.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      setClientes((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );

      const { error } = await supabase
        .from("clientes_food_service")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao alterar o status do cliente.");
      fetchClientes();
    }
  }

  async function handleProximoContatoChange(id: string, newDate: string) {
    try {
      setClientes((prev) =>
        prev.map((c) => (c.id === id ? { ...c, data_proximo_contato: newDate || null } : c))
      );

      const { error } = await supabase
        .from("clientes_food_service")
        .update({ data_proximo_contato: newDate || null })
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Erro ao atualizar data do próximo contato:", err);
      alert("Erro ao alterar a data.");
      fetchClientes();
    }
  }

  async function handleDeleteCliente(id: string) {
    setConfirmId(id);
    setIsConfirmOpen(true);
  }

  async function performDelete() {
    if (!confirmId) return;

    try {
      const { error } = await supabase
        .from("clientes_food_service")
        .delete()
        .eq("id", confirmId);

      if (error) throw error;
      setClientes(prev => prev.filter(c => c.id !== confirmId));
    } catch (err) {
      console.error("Erro ao excluir cliente:", err);
      alert("Erro ao excluir cliente.");
    } finally {
      setIsConfirmOpen(false);
      setConfirmId(null);
    }
  }

  function getDiasRestantes(dateString: string) {
    if (!dateString) return null;
    const targetDate = new Date(dateString + "T12:00:00");
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  }

  const openModal = (cliente?: any) => {
    setEditingCliente(cliente || null);
    setIsModalOpen(true);
  };

  const filteredClientes = clientes.filter(c => {
    let match = true;
    if (filterNome) {
      match = match && (c.nome === filterNome);
    }
    if (filterStatus) {
      match = match && (c.status === filterStatus);
    }
    if (filterTipo) {
      match = match && (c.tipo === filterTipo);
    }
    return match;
  });

  return (
    <>
      <Helmet>
        <title>CRM de Vendas</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="frequencia-title-group">
            <h1>Pipeline do CRM</h1>
            <p>Acompanhamento e gestão de contato com potenciais clientes.</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button className="primary-btn" onClick={() => openModal()}>
              <Icons.BsPlusLg style={{ marginRight: "8px" }} />
              Novo Cliente
            </button>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2.5rem", color: "var(--primary-color)" }} />
            </div>
          ) : clientes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontStyle: "italic" }}>
              Nenhum cliente encontrado.
            </div>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="freq-table" style={{ minWidth: "1200px", borderCollapse: "separate", borderSpacing: "0 8px", backgroundColor: "transparent", boxShadow: "none" }}>
                <thead>
                  <tr>
                    <th style={{ width: "250px", textAlign: "left", paddingLeft: "20px" }}>Cliente / Endereço</th>
                    <th style={{ width: "180px", textAlign: "center" }}>Status da Negociação</th>
                    <th style={{ width: "110px", textAlign: "center" }}>1º Contato</th>
                    <th style={{ width: "110px", textAlign: "center" }}>Últ. Contato</th>
                    <th style={{ width: "110px", textAlign: "center" }}>Próx. Contato</th>
                    <th style={{ width: "100px", textAlign: "center" }}>Tipo</th>
                    <th style={{ width: "120px", textAlign: "right", paddingRight: "20px" }}>Ações</th>
                  </tr>

                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "8px" }}>
                      <Select
                        menuPortalTarget={document.body}
                        maxMenuHeight={350}
                        options={clientes.map(c => ({ value: c.nome, label: c.nome }))}
                        value={filterNome ? { value: filterNome, label: filterNome } : null}
                        onChange={(selectedOption: any) => setFilterNome(selectedOption ? selectedOption.value : "")}
                        placeholder="Filtrar por nome..."
                        isClearable
                        noOptionsMessage={() => "Nenhum cliente encontrado"}
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
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.1rem", textAlign: "center" }}
                      >
                        <option value="">Todos</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </th>
                    <th colSpan={3}></th>
                    <th style={{ padding: "8px" }}>
                      <select
                        value={filterTipo}
                        onChange={(e) => setFilterTipo(e.target.value)}
                        style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.1rem", textAlign: "center" }}
                      >
                        <option value="">Todos</option>
                        {["Cafeteria", "Restaurante", "Empório", "Mercado", "Pizzaria", "Hotel", "Padaria", "Outros"].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/crm/cliente/${c.id}`)}
                      style={{ backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderRadius: "12px", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
                    >

                      <td style={{ padding: "10px 16px", borderRadius: "12px 0 0 12px", border: "none" }}>
                        <div style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--secondary-color)", marginBottom: "2px" }}>{c.nome}</div>
                        {c.endereco && (
                          <div style={{ fontSize: "1.05rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Icons.BsGeoAlt /> {c.endereco.length > 40 ? c.endereco.substring(0, 40) + "..." : c.endereco}
                          </div>
                        )}
                      </td>

                      <td style={{ textAlign: "center", border: "none" }}>
                        <select
                          value={c.status || "Lead"}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(c.id, e.target.value)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            backgroundColor: `${getStatusColor(c.status || "Lead")}15`,
                            color: getStatusColor(c.status || "Lead"),
                            border: `1px solid ${getStatusColor(c.status || "Lead")}40`,
                            cursor: "pointer",
                            outline: "none",
                            appearance: "none",
                            textAlign: "center",
                            width: "160px",
                            margin: "0 auto",
                            display: "block"
                          }}
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s} style={{ color: "#000", backgroundColor: "#fff" }}>{s}</option>
                          ))}
                        </select>
                      </td>

                      <td style={{ textAlign: "center", border: "none", fontSize: "1.25rem", color: "#555" }}>
                        {(c.status === "Lead" || c.status === "Em Contato") ? (formatDateBr(c.data_primeiro_contato_calc) !== "-" ? formatDateBr(c.data_primeiro_contato_calc) : <span style={{ color: "#bbb", fontSize: "1.4rem" }}>-</span>) : <span style={{ color: "#bbb", fontSize: "1.4rem" }}>-</span>}
                      </td>

                      <td style={{ textAlign: "center", border: "none", fontSize: "1.25rem", color: "#555" }}>
                        {(c.status === "Lead" || c.status === "Em Contato") ? (formatDateBr(c.data_ultimo_contato_calc) !== "-" ? formatDateBr(c.data_ultimo_contato_calc) : <span style={{ color: "#bbb", fontSize: "1.4rem" }}>-</span>) : <span style={{ color: "#bbb", fontSize: "1.4rem" }}>-</span>}
                      </td>

                      <td style={{ textAlign: "center", border: "none", fontSize: "1.25rem", color: "#555", fontWeight: c.data_proximo_contato ? 700 : 400 }}>
                        {(c.status === "Lead" || c.status === "Em Contato") ? (
                          c.data_ultimo_contato_calc ? (
                            (!c.data_proximo_contato || editingProximoContatoId === c.id) ? (
                              <input
                                type="date"
                                autoFocus
                                value={c.data_proximo_contato || ""}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  handleProximoContatoChange(c.id, e.target.value);
                                  setEditingProximoContatoId(null);
                                }}
                                onBlur={() => setEditingProximoContatoId(null)}
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: "8px",
                                  border: "1px solid var(--border-color)",
                                  fontSize: "1rem",
                                  fontFamily: "inherit",
                                  color: "var(--text-dark)",
                                  fontWeight: 700,
                                  backgroundColor: "transparent",
                                  cursor: "pointer",
                                  width: "140px"
                                }}
                              />
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                                {c.data_proximo_contato && (() => {
                                  const dias = getDiasRestantes(c.data_proximo_contato);
                                  if (dias === null) return null;

                                  let bg = "#e5e7eb";
                                  let color = "#4b5563";
                                  let text = "";

                                  if (dias < 0) {
                                    bg = "rgba(239, 68, 68, 0.15)";
                                    color = "#dc2626";
                                    text = `${Math.abs(dias)} dia(s) atrasado`;
                                  } else if (dias === 0) {
                                    bg = "rgba(245, 158, 11, 0.15)";
                                    color = "#d97706";
                                    text = "Hoje";
                                  } else if (dias > 0 && dias <= 3) {
                                    bg = "rgba(59, 130, 246, 0.15)";
                                    color = "#2563eb";
                                    text = `Em ${dias} dia(s)`;
                                  } else {
                                    bg = "rgba(16, 185, 129, 0.15)";
                                    color = "#059669";
                                    text = `Em ${dias} dia(s)`;
                                  }

                                  return (
                                    <span style={{
                                      backgroundColor: bg, color: color, fontSize: "1rem",
                                      fontWeight: 800, padding: "4px 10px", borderRadius: "12px",
                                      textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px"
                                    }}>
                                      {text}
                                    </span>
                                  );
                                })()}
                                <span
                                  onClick={(e) => { e.stopPropagation(); setEditingProximoContatoId(c.id); }}
                                  style={{ cursor: "pointer", textDecoration: "underline", textDecorationColor: "var(--border-color)", textDecorationThickness: "2px", padding: "2px" }}
                                  title="Clique para editar"
                                  onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = "var(--primary-color)"}
                                  onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = "var(--border-color)"}
                                >
                                  {formatDateBr(c.data_proximo_contato)}
                                </span>
                              </div>
                            )
                          ) : (
                            <span style={{ color: "#bbb", fontSize: "1.4rem" }}>-</span>
                          )
                        ) : <span style={{ color: "#bbb", fontSize: "1.4rem" }}>-</span>}
                      </td>

                      <td style={{ textAlign: "center", border: "none", fontSize: "1.4rem" }}>
                        <span style={{ fontWeight: 600, color: "#444" }}>{c.tipo || "-"}</span>
                      </td>

                      <td style={{ textAlign: "right", paddingRight: "20px", borderRadius: "0 12px 12px 0", border: "none" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                          {c.telefone && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const numeroFormatado = c.telefone.replace(/\D/g, "");
                                const numeroFinal = numeroFormatado.length <= 11 ? `55${numeroFormatado}` : numeroFormatado;
                                window.open(`https://wa.me/${numeroFinal}`, "_blank");
                              }}
                              title="Chamar no WhatsApp"
                              style={{
                                background: "none",
                                border: "none",
                                color: "#25D366", // WhatsApp Green
                                cursor: "pointer",
                                padding: "6px",
                                backgroundColor: "rgba(37, 211, 102, 0.1)",
                                borderRadius: "6px"
                              }}
                            >
                              <Icons.BsWhatsapp size={18} />
                            </button>
                          )}
                          {c.endereco && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.nome} ${c.endereco}`)}`, "_blank");
                              }}
                              title="Buscar no Google Maps"
                              style={{
                                background: "none",
                                border: "none",
                                color: "#4285F4",
                                cursor: "pointer",
                                padding: "6px",
                                backgroundColor: "rgba(66, 133, 244, 0.1)",
                                borderRadius: "6px"
                              }}
                            >
                              <Icons.BsGoogle size={18} />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/crm/cliente/${c.id}`); }}
                            title="Histórico / Detalhes"
                            style={{
                              background: "none",
                              border: "none",
                              color: "#d97706",
                              cursor: "pointer",
                              padding: "6px",
                              backgroundColor: "rgba(245, 158, 11, 0.1)",
                              borderRadius: "6px"
                            }}
                          >
                            <Icons.BsListUl size={18} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); openModal(c); }}
                            title="Editar"
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--primary-color)",
                              cursor: "pointer",
                              padding: "6px",
                              backgroundColor: "rgba(212, 163, 115, 0.1)",
                              borderRadius: "6px"
                            }}
                          >
                            <Icons.BsPencil size={18} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteCliente(c.id); }}
                            title="Excluir"
                            style={{
                              background: "none",
                              border: "none",
                              color: "#dc3545",
                              cursor: "pointer",
                              padding: "6px",
                              backgroundColor: "rgba(220, 53, 69, 0.1)",
                              borderRadius: "6px"
                            }}
                          >
                            <Icons.BsTrash size={18} />
                          </button>
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

      <ClienteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cliente={editingCliente}
        onSuccess={fetchClientes}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
        onConfirm={performDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setConfirmId(null);
        }}
        confirmText="Excluir Cliente"
      />
    </>
  );
}

export default CRM;
