import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import "../css/HistoricoFuncionario.css";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";

interface Profile {
  id: string;
  name: string;
  email: string;
  short_id: string | null;
  is_admin: boolean | null;
}

interface HistoricoRecord {
  id: number;
  employee_id: string;
  created_by: string | null;
  type: string;
  date: string;
  title: string;
  description: string;
  created_at: string;
  creator_name?: string;
}

const TYPE_OPTIONS = [
  { value: "Informação", label: "Informação", colorClass: "informacao", icon: <Icons.BsInfoCircleFill /> },
  { value: "Observação", label: "Observação", colorClass: "observacao", icon: <Icons.BsCardText /> },
  { value: "Advertência", label: "Advertência", colorClass: "advertencia", icon: <Icons.BsExclamationTriangle /> },
  { value: "Suspensão", label: "Suspensão", colorClass: "suspensao", icon: <Icons.Bs1SquareFill /> },
  { value: "Elogio", label: "Elogio", colorClass: "elogio", icon: <Icons.BsStarFill /> },
  { value: "Outro", label: "Outro", colorClass: "outro", icon: <Icons.BsThreeDots /> },
];

function HistoricoFuncionario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [employee, setEmployee] = useState<Profile | null>(null);
  const [records, setRecords] = useState<HistoricoRecord[]>([]);

  // Loading states
  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const todayStr = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    type: "Informação",
    date: todayStr,
    title: "",
    description: "",
  });

  useEffect(() => {
    checkAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  async function checkAccess() {
    if (!user) return;
    try {
      const { data, error } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
      if (error) throw error;

      if (data && data.is_admin) {
        setIsAuthorized(true);
        if (id) {
          fetchEmployeeInfo(id);
          fetchHistoricoRecords(id);
        }
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error("Erro ao verificar acesso:", err);
      setIsAuthorized(false);
    }
  }

  async function fetchEmployeeInfo(empId: string) {
    try {
      setLoadingEmployee(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, short_id, is_admin")
        .eq("id", empId)
        .single();

      if (error) throw error;
      setEmployee(data);
    } catch (err) {
      console.error("Erro ao buscar dados do funcionário:", err);
      setError("Não foi possível carregar os dados deste funcionário.");
    } finally {
      setLoadingEmployee(false);
    }
  }

  async function fetchHistoricoRecords(empId: string) {
    try {
      setLoadingRecords(true);

      // Fetch history records
      const { data, error } = await supabase
        .from("historico_colaborador")
        .select("*")
        .eq("employee_id", empId)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      // To display who created the note, we fetch creators names.
      // In small databases, we can do a secondary join or map:
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
            creator_name: creatorsMap[r.created_by] || "Outro Administrador"
          }));
          setRecords(formattedRecords);
        } else {
          setRecords(data.map((r: any) => ({ ...r, creator_name: "Administrador" })));
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
    if (!formData.title || !formData.description) {
      alert("Preencha o título e a descrição.");
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from("historico_colaborador")
        .insert([{
          employee_id: id,
          created_by: user.id,
          type: formData.type,
          date: formData.date,
          title: formData.title,
          description: formData.description,
        }]);

      if (error) throw error;

      // Reset form
      setFormData({
        type: "Informação",
        date: todayStr,
        title: "",
        description: "",
      });

      // Reload
      fetchHistoricoRecords(id);
    } catch (err: any) {
      console.error("Erro ao salvar histórico:", err);
      alert("Falha ao salvar. Certifique-se de que a tabela 'historico_colaborador' foi criada.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (recordId: number) => {
    if (!window.confirm("Tem certeza que deseja apagar esta ocorrência?")) return;

    try {
      const { error } = await supabase
        .from("historico_colaborador")
        .delete()
        .eq("id", recordId);

      if (error) throw error;

      // Reload
      if (id) fetchHistoricoRecords(id);
    } catch (err) {
      console.error("Erro ao deletar histórico:", err);
      alert("Erro ao excluir. Verifique as permissões de acesso.");
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const formatTimestamp = (tsStr: string) => {
    const d = new Date(tsStr);
    return d.toLocaleString("pt-BR", { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (isAuthorized === null) {
    return (
      <div className="historico-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <Icons.BsArrowClockwise className="spin" style={{ fontSize: "3rem", color: "var(--primary-color)" }} />
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="historico-container">
        <div className="error-state">
          <Icons.BsShieldLock style={{ fontSize: "4rem", color: "#ef4444", marginBottom: "16px" }} />
          <h2 style={{ color: "var(--secondary-color)", marginBottom: "8px" }}>Acesso Negado</h2>
          <p>Somente administradores podem gerenciar o histórico de ocorrências dos colaboradores.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Histórico de Ocorrências</title>
      </Helmet>

      <div className="historico-container">
        {/* Header */}
        <div className="historico-header">
          <button onClick={() => navigate("/cadastro-pessoas")} className="back-btn" title="Voltar para Pessoas">
            <Icons.BsChevronLeft />
          </button>
          <div className="historico-title-group">
            {loadingEmployee ? (
              <h1>Carregando colaborador...</h1>
            ) : employee ? (
              <>
                <h1>{employee.name}</h1>
                <p>
                  {employee.short_id && <span className="employee-badge">ID: {employee.short_id}</span>}
                  {employee.email}
                </p>
              </>
            ) : (
              <h1>Funcionário não encontrado</h1>
            )}
          </div>
        </div>

        {error ? (
          <div className="error-state" style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '40px' }}>
            <Icons.BsExclamationTriangle style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '12px' }} />
            <p>{error}</p>
            <button onClick={() => navigate("/cadastro-pessoas")} className="primary-btn" style={{ marginTop: '16px' }}>Voltar para Pessoas</button>
          </div>
        ) : (
          <div className="historico-layout">
            {/* Form Column */}
            <div className="historico-form-card">
              <h2>Nova Ocorrência</h2>
              <form onSubmit={handleSave} className="historico-form">
                <div className="form-group">
                  <label>Tipo</label>
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
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '1.4rem', fontFamily: 'inherit' }}
                  />
                </div>

                <div className="form-group">
                  <label>Título / Assunto</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Ex: Advertência por atraso"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '1.4rem', fontFamily: 'inherit' }}
                  />
                </div>

                <div className="form-group">
                  <label>Descrição / Observações</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Escreva os detalhes da ocorrência aqui..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '1.4rem', fontFamily: 'inherit', resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="primary-btn" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
                  {saving ? (
                    <Icons.BsArrowClockwise className="spin" />
                  ) : (
                    <>
                      <Icons.BsPlusLg />
                      Salvar Registro
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Timeline Column */}
            <div className="historico-timeline-container">
              <h2>Linha do Tempo</h2>
              {loadingRecords ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <Icons.BsArrowClockwise className="spin" style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }} />
                </div>
              ) : records.length === 0 ? (
                <div className="timeline-empty-state">
                  <Icons.BsFolder2Open />
                  <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>Nenhum registro encontrado</p>
                  <p style={{ fontSize: '1.3rem', marginTop: '4px' }}>Utilize o formulário ao lado para cadastrar a primeira ocorrência.</p>
                </div>
              ) : (
                <div className="timeline-wrapper">
                  {records.map((r) => {
                    const typeOption = TYPE_OPTIONS.find((opt) => opt.value === r.type) || TYPE_OPTIONS[5];
                    return (
                      <div key={r.id} className="timeline-item">
                        {/* Circle marker on the line */}
                        <div className={`timeline-marker marker-${typeOption.colorClass}`}>
                          {typeOption.icon}
                        </div>

                        {/* Event Card */}
                        <div className="timeline-card">
                          <div className="timeline-card-header">
                            <div className="timeline-type-group">
                              <span className={`type-badge badge-${typeOption.colorClass}`}>
                                {r.type}
                              </span>
                            </div>
                            <span className="timeline-event-date">
                              Ocorrido em: {formatDisplayDate(r.date)}
                            </span>
                          </div>

                          <h3 className="timeline-card-title">{r.title}</h3>
                          <p className="timeline-card-desc">{r.description}</p>

                          <div className="timeline-card-footer">
                            <span className="timeline-creator-info" title="Responsável pelo registro">
                              <Icons.BsPersonCircle />
                              Por: {r.creator_name}
                            </span>
                            <span style={{ fontSize: '1.1rem' }}>
                              Registrado em: {formatTimestamp(r.created_at)}
                            </span>
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="delete-record-btn"
                              title="Excluir Ocorrência"
                            >
                              <Icons.BsTrash />
                            </button>
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
    </>
  );
}

export default HistoricoFuncionario;
