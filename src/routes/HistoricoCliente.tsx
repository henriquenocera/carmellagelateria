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
  data_ultimo_contato?: string | null;
  data_primeiro_contato?: string | null;
  data_proximo_contato?: string | null;
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
        <style>{`
          .historico-container .historico-title-group { flex: 1; width: 100%; min-width: 0; }
          .crm-client-title { display: flex; align-items: center; gap: 10px; min-width: 0; }
          .crm-client-title h1 { min-width: 0; overflow-wrap: anywhere; }
          .crm-inline-back-btn { flex: 0 0 34px; width: 34px; height: 34px; }
          .crm-edit-client-btn { flex: 0 0 30px; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #d8c7b5; border-radius: 7px; background: #fffaf4; color: #80501f; cursor: pointer; font-size: 1rem; }
          .crm-edit-client-btn:hover { background: #f5eadc; }
          .crm-client-contact-info { box-sizing: border-box; width: min(1160px, 100%); min-height: 0; margin-top: 8px !important; padding: 11px 14px !important; gap: 4px !important; }
          .crm-client-contact-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px 18px; }
          .crm-client-field { display: grid; grid-template-columns: max-content minmax(0, 1fr); align-items: center; gap: 4px; min-height: 22px; font-size: 1rem; }
          .crm-client-field-label { color: #475569; white-space: nowrap; }
          .crm-client-field-value { display: inline-flex; align-items: center; gap: 6px; min-width: 0; color: #334155; }
          .crm-client-field-value svg { flex: 0 0 auto; color: var(--primary-color); }
          .crm-client-field-address { grid-column: 1 / -1; }
          .crm-client-field-address .crm-client-field-value { overflow-wrap: anywhere; }
          .historico-layout.crm-client-layout { display: flex; flex-direction: column; gap: 18px; align-items: stretch; }
          .crm-client-layout .historico-form-card, .crm-client-layout .historico-timeline-container { box-sizing: border-box; width: 100%; }
          .crm-client-layout .historico-form-card { max-width: 1160px; padding: 18px 22px; border-radius: 12px; }
          .crm-client-layout .historico-form-card h2 { margin-bottom: 14px; padding-bottom: 8px; font-size: 1.55rem; }
          .crm-client-layout .historico-timeline-container { max-height: none; overflow: visible; }
          .crm-client-form { display: grid; grid-template-columns: minmax(170px, 1fr) minmax(145px, .8fr) minmax(200px, 1.2fr); align-items: end; gap: 10px 12px; }
          .crm-client-form .form-group { min-width: 0; margin: 0; }
          .crm-client-form .crm-description-field { grid-column: 1 / -1; }
          .crm-client-form .form-group label { display: block; margin-bottom: 5px; font-size: 1rem; }
          .crm-client-form .form-group input, .crm-client-form .form-group select { box-sizing: border-box; width: 100%; min-width: 0; height: 40px; padding: 6px 10px !important; border-radius: 6px !important; font-size: 1rem !important; }
          .crm-client-form .form-group textarea { box-sizing: border-box; width: 100%; height: 64px; min-height: 64px; padding: 8px 10px !important; border-radius: 6px !important; font-size: .95rem !important; resize: vertical; }
          .crm-client-form .form-actions { grid-column: 1 / -1; justify-content: flex-end; margin-top: 0 !important; }
          .crm-client-form .form-actions button { flex: 0 0 auto !important; min-width: 145px; min-height: 38px; padding: 7px 14px !important; font-size: 1rem; }
          @media (max-width: 900px) { .crm-client-form { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
          @media (max-width: 600px) { .crm-client-form { grid-template-columns: minmax(0, 1fr); } .crm-client-form .form-actions { grid-column: auto; } .crm-client-form .form-actions button { width: 100%; } .crm-client-contact-grid { grid-template-columns: minmax(0, 1fr); } .crm-client-address { grid-column: auto; } }
        `}</style>
      </Helmet>

      <div className="historico-container">
        {/* Header */}
        <div className="historico-header">
          <div className="historico-title-group">
            {loadingCliente ? (
              <div className="crm-client-title">
                <button onClick={() => navigate("/crm")} className="back-btn crm-inline-back-btn" title="Voltar para o CRM"><Icons.BsChevronLeft /></button>
                <h1>Carregando cliente...</h1>
              </div>
            ) : cliente ? (
              <>
                <div className="crm-client-title">
                  <button onClick={() => navigate("/crm")} className="back-btn crm-inline-back-btn" title="Voltar para o CRM"><Icons.BsChevronLeft /></button>
                  <button type="button" onClick={() => setIsModalOpen(true)} className="crm-edit-client-btn" aria-label="Editar dados do cliente" title="Editar dados do cliente"><Icons.BsPencil /></button>
                  <h1>{cliente.nome}</h1>
                </div>
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
                <div className="crm-client-contact-info" style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px", backgroundColor: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                  <div className="crm-client-contact-grid">
                    <div className="crm-client-field crm-client-field-address"><strong className="crm-client-field-label">Endereço:</strong><span className="crm-client-field-value"><Icons.BsGeoAlt />{cliente.endereco || ""}</span></div>
                    <div className="crm-client-field"><strong className="crm-client-field-label">Contato:</strong><span className="crm-client-field-value"><Icons.BsPerson />{cliente.nome_contato || ""}</span></div>
                    <div className="crm-client-field"><strong className="crm-client-field-label">Telefone:</strong><span className="crm-client-field-value"><Icons.BsTelephone />{cliente.telefone || ""}</span></div>
                    <div className="crm-client-field"><strong className="crm-client-field-label">Último contato:</strong><span className="crm-client-field-value"><Icons.BsCalendar3 />{formatDisplayDate(records[0]?.date || cliente.data_ultimo_contato || "")}</span></div>
                    <div className="crm-client-field"><strong className="crm-client-field-label">Próximo contato:</strong><span className="crm-client-field-value"><Icons.BsCalendar3 />{formatDisplayDate(cliente.data_proximo_contato || "")}</span></div>
                    {cliente.email && <div className="crm-client-field"><strong className="crm-client-field-label">E-mail:</strong><span className="crm-client-field-value"><Icons.BsEnvelope />{cliente.email}</span></div>}
                    {cliente.cnpj && <div className="crm-client-field"><strong className="crm-client-field-label">CNPJ:</strong><span className="crm-client-field-value"><Icons.BsFileEarmarkText />{cliente.cnpj}</span></div>}
                  </div>
                  {cliente.observacoes && (
                    <div style={{ marginTop: "8px", fontSize: "1.1rem" }}>
                      <strong style={{ color: "#555", display: "block", marginBottom: "4px" }}>Observações:</strong>
                      <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "#666" }}>{cliente.observacoes}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="crm-client-title">
                <button onClick={() => navigate("/crm")} className="back-btn crm-inline-back-btn" title="Voltar para o CRM"><Icons.BsChevronLeft /></button>
                <h1>Cliente não encontrado</h1>
              </div>
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
          <div className="historico-layout crm-client-layout">
            {/* Form Column */}
            <div className="historico-form-card">
              <h2>{editingId ? "Editar Contato" : "Registrar Novo Contato"}</h2>
              <form onSubmit={handleSave} className="historico-form crm-client-form">
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

                <div className="form-group crm-description-field">
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
