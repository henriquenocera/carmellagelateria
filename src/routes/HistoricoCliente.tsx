import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import "../css/HistoricoFuncionario.css"; // reaproveitando os estilos base
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import ClienteFormModal from "../components/ClienteFormModal.tsx";

interface Cliente {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  status: string | null;
  tipo: string | null;
  nome_contato: string | null;
  endereco: string | null;
  cnpj: string | null;
  observacoes: string | null;
}

const getStatusColor = (statusVal: string | null) => {
  switch (statusVal) {
    case "Lead": return "#3b82f6";
    case "Em Contato": return "#f59e0b";
    case "Negócio Fechado": return "#10b981";
    case "Perdido": return "#ef4444";
    default: return "#94a3b8";
  }
};

interface HistoricoRecord {
  id: number;
  cliente_id: string;
  created_by: string | null;
  type: string;
  date: string;
  title: string;
  description: string;
  created_at: string;
  creator_name?: string;
}

const TYPE_OPTIONS = [
  { value: "Mensagem de Whatsapp", label: "Mensagem de Whatsapp", colorClass: "whatsapp", icon: <Icons.BsWhatsapp /> },
  { value: "Entrega de Amostras", label: "Entrega de Amostras", colorClass: "elogio", icon: <Icons.BsBoxSeam /> },
  { value: "Ligação", label: "Ligação", colorClass: "observacao", icon: <Icons.BsTelephone /> },
  { value: "Reunião Presencial", label: "Reunião Presencial", colorClass: "advertencia", icon: <Icons.BsPeople /> },
  { value: "Outro", label: "Outro", colorClass: "outro", icon: <Icons.BsThreeDots /> },
];

function HistoricoCliente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [records, setRecords] = useState<HistoricoRecord[]>([]);

  const [loadingCliente, setLoadingCliente] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    type: "Mensagem de Whatsapp",
    date: todayStr,
    title: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      fetchClienteInfo(id);
      fetchHistoricoRecords(id);
    }
  }, [id]);

  async function fetchClienteInfo(clienteId: string) {
    try {
      setLoadingCliente(true);
      const { data, error } = await supabase
        .from("clientes_food_service")
        .select("*")
        .eq("id", clienteId)
        .single();

      if (error) throw error;
      setCliente(data);
    } catch (err) {
      console.error("Erro ao buscar dados do cliente:", err);
      setError("Não foi possível carregar os dados deste cliente.");
    } finally {
      setLoadingCliente(false);
    }
  }

  async function fetchHistoricoRecords(clienteId: string) {
    try {
      setLoadingRecords(true);
      const { data, error } = await supabase
        .from("historico_crm")
        .select("*")
        .eq("cliente_id", clienteId)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const creatorIds = Array.from(new Set(data.map((r: any) => r.created_by).filter(Boolean))) as string[];

        if (creatorIds.length > 0) {
          const { data: creatorsData } = await supabase
            .from("profiles")
            .select("id, name")
            .in("id", creatorIds);

          const creatorsMap = (creatorsData || []).reduce((acc: any, curr: any) => {
            acc[curr.id] = curr.name;
            return acc;
          }, {});

          const formattedRecords = data.map((r: any) => ({
            ...r,
            creator_name: creatorsMap[r.created_by] || "Usuário"
          }));
          setRecords(formattedRecords);
        } else {
          setRecords(data.map((r: any) => ({ ...r, creator_name: "Usuário" })));
        }
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
    } finally {
      setLoadingRecords(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;
    if (!formData.title) {
      alert("Preencha o título/assunto da interação.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        const { error } = await supabase
          .from("historico_crm")
          .update({
            type: formData.type,
            date: formData.date,
            title: formData.title,
            description: formData.description,
          })
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("historico_crm")
          .insert([{
            cliente_id: id,
            created_by: user.id,
            type: formData.type,
            date: formData.date,
            title: formData.title,
            description: formData.description,
          }]);

        if (error) throw error;
      }

      setEditingId(null);
      setFormData({
        type: "Mensagem de Whatsapp",
        date: todayStr,
        title: "",
        description: "",
      });

      fetchHistoricoRecords(id);
    } catch (err: any) {
      console.error("Erro ao salvar histórico:", err);
      alert("Falha ao salvar. Certifique-se de que a tabela 'historico_crm' foi criada.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    setFormData({
      type: record.type,
      date: record.date,
      title: record.title,
      description: record.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (recordId: number) => {
    if (!window.confirm("Tem certeza que deseja apagar este registro do histórico?")) return;

    try {
      const { error } = await supabase
        .from("historico_crm")
        .delete()
        .eq("id", recordId);

      if (error) throw error;
      if (id) fetchHistoricoRecords(id);
    } catch (err) {
      console.error("Erro ao deletar histórico:", err);
      alert("Erro ao excluir. Tente novamente.");
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const formatTimestamp = (tsStr: string) => {
    const d = new Date(tsStr);
    return d.toLocaleString("pt-BR", { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <>
      <Helmet>
        <title>Histórico do Cliente</title>
      </Helmet>

      <div className="historico-container">
        {/* Header */}
        <div className="historico-header">
          <button onClick={() => navigate("/crm")} className="back-btn" title="Voltar para o CRM">
            <Icons.BsChevronLeft />
          </button>
          <div className="historico-title-group">
            {loadingCliente ? (
              <h1>Carregando cliente...</h1>
            ) : cliente ? (
              <>
                <h1>{cliente.nome}</h1>
                <p style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "8px", flexWrap: "wrap", fontSize: "1.2rem" }}>
                  {cliente.status && (
                    <span style={{ 
                      backgroundColor: `${getStatusColor(cliente.status)}15`, 
                      color: getStatusColor(cliente.status),
                      border: `1px solid ${getStatusColor(cliente.status)}40`,
                      padding: "4px 12px", 
                      borderRadius: "20px", 
                      fontWeight: 700 
                    }}>
                      {cliente.status}
                    </span>
                  )}
                  {cliente.tipo && <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center" }}><Icons.BsTag style={{ marginRight: "6px" }}/> {cliente.tipo}</span>}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px", backgroundColor: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {cliente.nome_contato && <div style={{ fontSize: "1.1rem" }}><strong style={{ color: "#555" }}>Contato:</strong> <Icons.BsPerson style={{ color: "var(--primary-color)" }} /> {cliente.nome_contato}</div>}
                    {cliente.telefone && <div style={{ fontSize: "1.1rem" }}><strong style={{ color: "#555" }}>Telefone:</strong> <Icons.BsTelephone style={{ color: "var(--primary-color)" }} /> {cliente.telefone}</div>}
                    {cliente.email && <div style={{ fontSize: "1.1rem" }}><strong style={{ color: "#555" }}>E-mail:</strong> <Icons.BsEnvelope style={{ color: "var(--primary-color)" }} /> {cliente.email}</div>}
                    {cliente.cnpj && <div style={{ fontSize: "1.1rem" }}><strong style={{ color: "#555" }}>CNPJ:</strong> <Icons.BsFileEarmarkText style={{ color: "var(--primary-color)" }} /> {cliente.cnpj}</div>}
                  </div>
                  {cliente.observacoes && (
                    <div style={{ marginTop: "8px", fontSize: "1.1rem" }}>
                      <strong style={{ color: "#555", display: "block", marginBottom: "4px" }}>Observações:</strong>
                      <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#666" }}>{cliente.observacoes}</p>
                    </div>
                  )}
                </div>
                <button onClick={() => setIsModalOpen(true)} className="primary-btn" style={{ marginTop: '16px', padding: '8px 16px', alignSelf: 'flex-start' }}>
                  <Icons.BsPencil /> Editar Dados do Cliente
                </button>
              </>
            ) : (
              <h1>Cliente não encontrado</h1>
            )}
          </div>
        </div>

        {error ? (
          <div className="error-state" style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '40px' }}>
            <Icons.BsExclamationTriangle style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '12px' }} />
            <p>{error}</p>
            <button onClick={() => navigate("/crm")} className="primary-btn" style={{ marginTop: '16px' }}>Voltar para CRM</button>
          </div>
        ) : (
          <div className="historico-layout">
            {/* Form Column */}
            <div className="historico-form-card">
              <h2>{editingId ? "Editar Contato" : "Registrar Novo Contato"}</h2>
              <form onSubmit={handleSave} className="historico-form">
                <div className="form-group">
                  <label>Tipo de Contato</label>
                  <select
                    className="frequencia-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Data</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '1.2rem', fontFamily: 'inherit' }}
                  />
                </div>

                <div className="form-group">
                  <label>Título / Assunto</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Ex: Confirmação de endereço"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '1.2rem', fontFamily: 'inherit' }}
                  />
                </div>

                <div className="form-group">
                  <label>Descrição / Resumo da Conversa</label>
                  <textarea
                    rows={5}
                    placeholder="O que foi conversado?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
                  />
                </div>

                <div className="form-actions" style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  {editingId && (
                    <button type="button" onClick={() => {
                      setEditingId(null);
                      setFormData({ type: "Mensagem de Whatsapp", date: todayStr, title: "", description: "" });
                    }} className="secondary-btn" style={{ flex: 1, justifyContent: 'center' }}>
                      Cancelar
                    </button>
                  )}
                  <button type="submit" disabled={saving} className="primary-btn" style={{ flex: 2, justifyContent: 'center' }}>
                    {saving ? "Salvando..." : editingId ? "Salvar Alterações" : "Salvar Contato"}
                  </button>
                </div>
              </form>
            </div>

            {/* List Column */}
            <div className="historico-timeline-container">
              <h2>Histórico de Contatos ({records.length})</h2>
              
              {loadingRecords ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                </div>
              ) : records.length === 0 ? (
                <div className="timeline-empty-state">
                  <Icons.BsJournalX />
                  <p>Nenhum contato registrado ainda para este cliente.</p>
                </div>
              ) : (
                <div className="timeline-wrapper">
                  {records.map((record) => {
                    const typeOption = TYPE_OPTIONS.find(o => o.value === record.type) || TYPE_OPTIONS[TYPE_OPTIONS.length - 1];
                    
                    return (
                      <div key={record.id} className="timeline-item">
                        <div className={`timeline-marker marker-${typeOption.colorClass}`}>
                          {typeOption.icon}
                        </div>
                        <div className="timeline-card">
                          <div className="timeline-card-header">
                            <div>
                              <h3 className="timeline-card-title">{record.title}</h3>
                              <span className="timeline-event-date">
                                <Icons.BsCalendar3 style={{ marginRight: '4px' }} />
                                {formatDisplayDate(record.date)}
                              </span>
                            </div>
                            <div className="timeline-actions" style={{ display: "flex", gap: "8px" }}>
                              <button onClick={() => handleEdit(record)} title="Editar" className="secondary-btn" style={{ padding: "4px", margin: 0 }}><Icons.BsPencil /></button>
                              <button onClick={() => handleDelete(record.id)} title="Excluir" className="delete-record-btn"><Icons.BsTrash /></button>
                            </div>
                          </div>
                          
                          <span className={`type-badge badge-${typeOption.colorClass}`}>{record.type}</span>
                          
                          {record.description && (
                            <p className="timeline-card-desc" style={{ marginTop: "12px" }}>{record.description}</p>
                          )}
                          
                          <div className="timeline-card-footer">
                            <div className="timeline-creator-info">
                              <Icons.BsPersonBadge style={{ marginRight: '4px' }}/>
                              Registrado por: <strong>{record.creator_name}</strong> em {formatTimestamp(record.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ClienteFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cliente={cliente}
        onSuccess={() => {
          if (id) fetchClienteInfo(id);
        }}
      />
    </>
  );
}

export default HistoricoCliente;
