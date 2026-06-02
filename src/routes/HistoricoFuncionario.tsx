import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import "../css/HistoricoFuncionario.css";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";

const WEEKDAYS = [
  { value: "1", label: "SEG" },
  { value: "2", label: "TER" },
  { value: "3", label: "QUA" },
  { value: "4", label: "QUI" },
  { value: "5", label: "SEX" },
  { value: "6", label: "SÁB" },
  { value: "0", label: "DOM" }
];

interface Profile {
  id: string;
  name: string;
  email: string;
  short_id: string | null;
  is_admin: boolean | null;
  folgas_fixas?: string | null;
  data_registro?: string | null;
  controlar_frequencia?: boolean | null;
  ativo?: boolean | null;
  passagens_urbs?: number | null;
  passagens_metrocard?: number | null;
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

const FolgaDateInput = ({ globalFeriado, onSave, saving }: { globalFeriado: any, onSave: (gf: any, val: string) => void, saving: boolean }) => {
  const [val, setVal] = useState("");
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      <input
        type="date"
        className="frequencia-select"
        style={{ width: "auto", padding: "4px 8px", minHeight: "auto", fontSize: "1.1rem", margin: 0, border: "1px solid #cbd5e1", borderRadius: "6px" }}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        title="Registrar data da folga"
        disabled={saving}
      />
      {val && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onSave(globalFeriado, val); }}
          style={{ padding: "4px 8px", fontSize: "1.1rem", margin: 0, background: "var(--primary-color)", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}
          disabled={saving}
          title="Salvar data escolhida"
        >
          OK
        </button>
      )}
    </div>
  );
};

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
  const [savingEmployee, setSavingEmployee] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [employeeFormData, setEmployeeFormData] = useState({
    name: "", email: "", short_id: "", is_admin: false, controlar_frequencia: true, folgas_fixas: "", ativo: true, data_registro: "", passagens_urbs: 0, passagens_metrocard: 0
  });

  // Form state
  const todayStr = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    type: "Informação",
    date: todayStr,
    title: "",
    description: "",
  });

  // Frequency state
  const today = new Date();
  const [freqMonth, setFreqMonth] = useState<number>(today.getMonth() + 1);
  const [freqYear, setFreqYear] = useState<number>(today.getFullYear());
  const [freqRecords, setFreqRecords] = useState<{ date: string; status: string; observacao?: string | null }[]>([]);
  const [loadingFreq, setLoadingFreq] = useState(false);

  // Annual state
  const [annualRecords, setAnnualRecords] = useState<{ date: string; status: string }[]>([]);
  const [loadingAnnual, setLoadingAnnual] = useState(false);

  // Expansion state
  const [isAnnualExpanded, setIsAnnualExpanded] = useState(true);
  const [isMonthlyExpanded, setIsMonthlyExpanded] = useState(true);

  // Feriados state
  const [feriadosGlobais, setFeriadosGlobais] = useState<{ id: string; date: string; name: string }[]>([]);
  const [feriadosTrabalhados, setFeriadosTrabalhados] = useState<{ id: string; data_feriado: string; nome_feriado: string; data_folga: string | null; pago_em_dobro?: boolean | null }[]>([]);
  const [loadingFeriados, setLoadingFeriados] = useState(false);
  const [isFeriadosExpanded, setIsFeriadosExpanded] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const freqYearsList = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i);
  const freqMonthsList = [
    { value: 1, label: "Janeiro" }, { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" }, { value: 4, label: "Abril" },
    { value: 5, label: "Maio" }, { value: 6, label: "Junho" },
    { value: 7, label: "Julho" }, { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" }, { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" }, { value: 12, label: "Dezembro" }
  ];

  const handlePrevMonth = () => {
    if (freqMonth === 1) {
      setFreqMonth(12);
      setFreqYear((y) => y - 1);
    } else {
      setFreqMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (freqMonth === 12) {
      setFreqMonth(1);
      setFreqYear((y) => y + 1);
    } else {
      setFreqMonth((m) => m + 1);
    }
  };

  const handlePrevYear = () => setFreqYear((y) => y - 1);
  const handleNextYear = () => setFreqYear((y) => y + 1);

  const FREQ_STATUS_OPTIONS = [
    { value: "Trabalhado", className: "freq-status-trabalhado" },
    { value: "Falta Não Justificada", className: "freq-status-falta" },
    { value: "Atestado", className: "freq-status-atestado" },
    { value: "Declaração de Horas", className: "freq-status-declaracao" },
    { value: "Saída Antecipada", className: "freq-status-saida" },
    { value: "Atraso", className: "freq-status-atraso" },
    { value: "Folga Fixa Semanal", className: "freq-status-folga-fixa" },
    { value: "Domingo de Folga", className: "freq-status-folga-dom" },
    { value: "Folga Compensatória", className: "freq-status-folga-comp" },
    { value: "Férias", className: "freq-status-ferias" },
    { value: "Período de Teste", className: "freq-status-periodo" },
    { value: "Registro Formal", className: "freq-status-registro" },
    { value: "Rescisão de Contrato", className: "freq-status-rescisao" },
    { value: "Outro", className: "freq-status-outro" },
  ];

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
        .select("id, name, email, short_id, is_admin, folgas_fixas, data_registro, controlar_frequencia, ativo, passagens_urbs, passagens_metrocard")
        .eq("id", empId)
        .single();

      if (error) throw error;
      setEmployee(data);
      setEmployeeFormData({
        name: data.name || "",
        email: data.email || "",
        short_id: data.short_id || "",
        is_admin: data.is_admin || false,
        controlar_frequencia: data.controlar_frequencia !== false,
        folgas_fixas: data.folgas_fixas || "",
        ativo: data.ativo !== false,
        data_registro: data.data_registro || "",
        passagens_urbs: data.passagens_urbs ?? 0,
        passagens_metrocard: data.passagens_metrocard ?? 0
      });
    } catch (err) {
      console.error("Erro ao buscar dados do funcionário:", err);
      setError("Não foi possível carregar os dados deste funcionário.");
    } finally {
      setLoadingEmployee(false);
    }
  }

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!employeeFormData.name || !employeeFormData.email) {
      alert("Preencha nome e e-mail.");
      return;
    }
    try {
      setSavingEmployee(true);
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: employeeFormData.name,
          email: employeeFormData.email,
          short_id: employeeFormData.short_id,
          is_admin: employeeFormData.is_admin,
          controlar_frequencia: employeeFormData.controlar_frequencia,
          folgas_fixas: employeeFormData.folgas_fixas,
          ativo: employeeFormData.ativo,
          data_registro: employeeFormData.data_registro || null,
          passagens_urbs: employeeFormData.passagens_urbs,
          passagens_metrocard: employeeFormData.passagens_metrocard,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);
      if (updateError) throw updateError;
      alert("Dados atualizados com sucesso!");
      fetchEmployeeInfo(id);
    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err);
      alert(`Erro ao salvar: ${err.message}`);
    } finally {
      setSavingEmployee(false);
    }
  };

  const handleWeekdayToggle = (dayVal: string) => {
    let currentDays = employeeFormData.folgas_fixas ? employeeFormData.folgas_fixas.split(",") : [];
    if (currentDays.includes(dayVal)) {
      currentDays = currentDays.filter((d) => d !== dayVal);
    } else {
      currentDays.push(dayVal);
    }
    setEmployeeFormData({ ...employeeFormData, folgas_fixas: currentDays.join(",") });
  };

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

      if (editingId) {
        const { error } = await supabase
          .from("historico_colaborador")
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
      }

      // Reset form
      setEditingId(null);
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
      alert("Falha ao salvar. Certifique-se de que a tabela 'historico_colaborador' foi configurada.");
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
      description: record.description,
    });
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

  // Frequency logic
  async function fetchFrequency(empId: string, m: number, y: number) {
    try {
      setLoadingFreq(true);
      const daysInMonth = new Date(y, m, 0).getDate();
      const startStr = `${y}-${String(m).padStart(2, "0")}-01`;
      const endStr = `${y}-${String(m).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;

      const { data, error } = await supabase
        .from("frequencia")
        .select("date, status, observacao")
        .eq("employee_id", empId)
        .gte("date", startStr)
        .lte("date", endStr)
        .order("date", { ascending: true });

      if (error) throw error;
      setFreqRecords(data || []);
    } catch (err) {
      console.error("Erro ao buscar frequência:", err);
    } finally {
      setLoadingFreq(false);
    }
  }

  async function fetchAnnualFrequency(empId: string, y: number) {
    try {
      setLoadingAnnual(true);
      const startStr = `${y}-01-01`;
      const endStr = `${y}-12-31`;

      const { data, error } = await supabase
        .from("frequencia")
        .select("date, status")
        .eq("employee_id", empId)
        .gte("date", startStr)
        .lte("date", endStr);

      if (error) throw error;
      setAnnualRecords(data || []);
    } catch (err) {
      console.error("Erro ao buscar frequência anual:", err);
    } finally {
      setLoadingAnnual(false);
    }
  }

  async function fetchFeriadosTrabalhados(empId: string) {
    try {
      setLoadingFeriados(true);
      const { data, error } = await supabase
        .from("feriados_trabalhados")
        .select("id, data_feriado, nome_feriado, data_folga, pago_em_dobro")
        .eq("employee_id", empId)
        .order("data_feriado", { ascending: false });

      if (error) throw error;
      setFeriadosTrabalhados(data || []);
    } catch (err) {
      console.error("Erro ao buscar feriados trabalhados:", err);
    } finally {
      setLoadingFeriados(false);
    }
  }

  async function fetchFeriadosGlobais() {
    try {
      setLoadingFeriados(true);
      const { data, error } = await supabase
        .from("feriados_globais")
        .select("id, date, name")
        .order("date", { ascending: false });

      if (error) throw error;
      setFeriadosGlobais(data || []);
    } catch (err) {
      console.error("Erro ao buscar feriados globais:", err);
    } finally {
      setLoadingFeriados(false);
    }
  }

  async function handleUpdateFolga(globalFeriado: any, dataFolga: string) {
    if (!id) return;
    try {
      setSaving(true);
      // Busca diretamente no banco de dados para evitar duplicação por cache de tela
      const { data: dbExisting } = await supabase
        .from("feriados_trabalhados")
        .select("id")
        .eq("employee_id", id)
        .eq("data_feriado", globalFeriado.date)
        .maybeSingle();

      if (dbExisting) {
        const { error } = await supabase
          .from("feriados_trabalhados")
          .update({ data_folga: dataFolga || null, pago_em_dobro: false })
          .eq("id", dbExisting.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("feriados_trabalhados").insert([{
          employee_id: id,
          data_feriado: globalFeriado.date,
          nome_feriado: globalFeriado.name,
          data_folga: dataFolga || null,
          pago_em_dobro: false
        }]);
        if (error) throw error;
      }
      await fetchFeriadosTrabalhados(id);
    } catch (err: any) {
      console.error("Erro ao atualizar data da folga:", err);
      alert(err.message || "Erro ao atualizar data da folga");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdatePagoEmDobro(globalFeriado: any, pago: boolean) {
    if (!id) return;
    try {
      setSaving(true);
      // Busca diretamente no banco de dados para evitar duplicação por cache de tela
      const { data: dbExisting } = await supabase
        .from("feriados_trabalhados")
        .select("id")
        .eq("employee_id", id)
        .eq("data_feriado", globalFeriado.date)
        .maybeSingle();

      if (dbExisting) {
        const { error } = await supabase
          .from("feriados_trabalhados")
          .update({ pago_em_dobro: pago, data_folga: null })
          .eq("id", dbExisting.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("feriados_trabalhados").insert([{
          employee_id: id,
          data_feriado: globalFeriado.date,
          nome_feriado: globalFeriado.name,
          pago_em_dobro: pago,
          data_folga: null
        }]);
        if (error) throw error;
      }
      await fetchFeriadosTrabalhados(id);
    } catch (err: any) {
      console.error("Erro ao atualizar pagamento em dobro:", err);
      alert(err.message || "Erro ao atualizar pagamento em dobro");
    } finally {
      setSaving(false);
    }
  }


  useEffect(() => {
    if (isAuthorized && id) {
      fetchFeriadosTrabalhados(id);
      fetchFeriadosGlobais();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized, id]);

  useEffect(() => {
    if (isAuthorized && id) {
      fetchFrequency(id, freqMonth, freqYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized, id, freqMonth, freqYear]);

  useEffect(() => {
    if (isAuthorized && id) {
      fetchAnnualFrequency(id, freqYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized, id, freqYear]);

  const getFreqDaysArray = () => {
    const daysInMonth = new Date(freqYear, freqMonth, 0).getDate();
    const dates: Date[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      dates.push(new Date(freqYear, freqMonth - 1, d));
    }
    return dates;
  };

  const getWeekdayName = (date: Date) => {
    const names = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return names[date.getDay()];
  };

  const getFreqStatusForDate = (dateStr: string, dateObj: Date) => {
    const record = freqRecords.find((r) => r.date === dateStr);
    if (record) return record.status;

    // Default status based on fixed off-days
    const fixedOffDays = employee?.folgas_fixas ? employee.folgas_fixas.split(",") : [];
    const dayOfWeek = String(dateObj.getDay());
    if (fixedOffDays.includes(dayOfWeek)) return "Folga Fixa Semanal";
    return "Trabalhado";
  };

  const getFreqStatusClass = (status: string) => {
    const opt = FREQ_STATUS_OPTIONS.find((o) => o.value === status);
    return opt?.className || "freq-status-trabalhado";
  };

  const isWorkedStatus = (status: string) => {
    return ["Trabalhado", "Declaração de Horas", "Saída Antecipada", "Registro Formal", "Rescisão de Contrato", "Outro"].includes(status);
  };

  const getFreqSummary = () => {
    const allDates = getFreqDaysArray();
    let trabalhados = 0;
    let faltas = 0;
    let atestados = 0;
    let folgas = 0;
    let outros = 0;
    let atrasos = 0;

    allDates.forEach((dateObj) => {
      const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;

      // Skip dates before registration
      if (employee?.data_registro && dateStr < employee.data_registro) return;

      const status = getFreqStatusForDate(dateStr, dateObj);
      if (isWorkedStatus(status)) trabalhados++;
      else if (status === "Falta Não Justificada") faltas++;
      else if (status === "Atestado") atestados++;
      else if (status === "Atraso") atrasos++;
      else if (["Folga Fixa Semanal", "Domingo de Folga", "Folga Compensatória", "Férias"].includes(status)) folgas++;
      else outros++;
    });

    return { trabalhados, faltas, atestados, folgas, outros, atrasos };
  };

  const getAnnualSummaryByMonth = () => {
    const summary = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      faltas: 0,
      atestados: 0,
      atrasos: 0
    }));

    annualRecords.forEach(record => {
      if (employee?.data_registro && record.date < employee.data_registro) return;

      const recordMonth = parseInt(record.date.split('-')[1], 10);

      if (record.status === "Falta Não Justificada") summary[recordMonth - 1].faltas++;
      else if (record.status === "Atestado") summary[recordMonth - 1].atestados++;
      else if (record.status === "Atraso") summary[recordMonth - 1].atrasos++;
    });

    return summary;
  };

  const freqSummary = getFreqSummary();
  const annualSummaryData = getAnnualSummaryByMonth();

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
        <title>Ficha Cadastral</title>
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
                <button onClick={() => navigate(`/cadastro-pessoas?edit=${id}`)} className="primary-btn" style={{ marginTop: '12px', padding: '8px 16px', alignSelf: 'flex-start' }}>
                  <Icons.BsPencil /> Editar Dados Cadastrais
                </button>
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
          <>
            <div className="historico-layout">
              {/* Form Column */}
              <div className="historico-form-card">
                <h2>{editingId ? "Editar Ocorrência" : "Nova Ocorrência"}</h2>
                <form onSubmit={handleSave} className="historico-form">
                  <div className="form-group">
                    <label>Tipo</label>
                    <select
                      className="frequencia-select"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      {TYPE_OPTIONS.filter((opt) => ["Advertência", "Suspensão", "Informação"].includes(opt.value)).map((opt) => (
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

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" className="primary-btn" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                      {saving ? (
                        <Icons.BsArrowClockwise className="spin" />
                      ) : (
                        <>
                          <Icons.BsSave />
                          {editingId ? "Atualizar" : "Salvar Registro"}
                        </>
                      )}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        className="secondary-btn"
                        disabled={saving}
                        onClick={() => {
                          setEditingId(null);
                          setFormData({ type: "Informação", date: todayStr, title: "", description: "" });
                        }}
                        style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Icons.BsX />
                        Cancelar
                      </button>
                    )}
                  </div>
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
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => handleEdit(r)}
                                  className="edit-record-btn"
                                  title="Editar Ocorrência"
                                  style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '1.3rem' }}
                                >
                                  <Icons.BsPencilSquare />
                                </button>
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
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Feriados Trabalhados Section */}
            {employee?.controlar_frequencia !== false && (
              <div className="freq-section">
                <div className="freq-section-header" style={{ cursor: "pointer" }} onClick={() => setIsFeriadosExpanded(!isFeriadosExpanded)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <h2 style={{ margin: 0 }}><Icons.BsBriefcaseFill style={{ marginRight: "8px" }} />Feriados Trabalhados</h2>
                    <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", padding: "4px" }}>
                      {isFeriadosExpanded ? <Icons.BsChevronUp /> : <Icons.BsChevronDown />}
                    </button>
                  </div>
                </div>

                {isFeriadosExpanded && (
                  <div className="freq-annual-summary-wrapper">
                    {loadingFeriados ? (
                      <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                        <Icons.BsArrowClockwise className="spin" style={{ fontSize: "1.5rem", color: "var(--primary-color)" }} />
                      </div>
                    ) : feriadosGlobais.length === 0 ? (
                      <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Nenhum feriado global configurado no sistema.</p>
                    ) : (
                      <div className="freq-table-wrapper" style={{ maxHeight: "420px", overflowY: "auto" }}>
                        <table className="freq-table">
                          <thead>
                            <tr>
                              <th style={{ width: "20%" }}>Data</th>
                              <th style={{ width: "30%" }}>Feriado</th>
                              <th style={{ width: "15%", textAlign: "center" }}>Trabalhou?</th>
                              <th style={{ width: "35%" }}>Folga Compensatória</th>
                            </tr>
                          </thead>
                          <tbody>
                            {feriadosGlobais
                              .filter((globalFeriado) => {
                                if (!employee?.data_registro) return true;
                                return globalFeriado.date >= employee.data_registro;
                              })
                              .map((globalFeriado) => {
                              const freqRecord = annualRecords.find(r => r.date === globalFeriado.date);
                              let freqStatus = freqRecord?.status;
                              if (!freqStatus) {
                                const [y, m, d] = globalFeriado.date.split("-");
                                const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                                const fixedOffDays = employee?.folgas_fixas ? employee.folgas_fixas.split(",") : [];
                                const dayOfWeek = String(dateObj.getDay());
                                freqStatus = fixedOffDays.includes(dayOfWeek) ? "Folga Fixa Semanal" : "Trabalhado";
                              }

                              const didWork = freqStatus === "Trabalhado";
                              const trabalhadoRecord = feriadosTrabalhados.find(f => f.data_feriado === globalFeriado.date);
                              const isFuture = globalFeriado.date > todayStr;

                              return (
                                <tr key={globalFeriado.id}>
                                  <td style={{ fontWeight: 500 }}>{formatDisplayDate(globalFeriado.date)}</td>
                                  <td>{globalFeriado.name}</td>
                                  <td style={{ textAlign: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} title={isFuture ? "Aguardando a data do feriado" : "Sincronizado automaticamente da tabela de Frequência"}>
                                      {isFuture ? (
                                        <span className="type-badge" style={{ margin: 0, padding: "4px 8px", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#f8fafc", color: "#94a3b8", border: "1px solid #e2e8f0" }}>
                                          <Icons.BsClockHistory /> Aguardando
                                        </span>
                                      ) : didWork ? (
                                        <span className="type-badge badge-elogio" style={{ margin: 0, padding: "4px 8px", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "6px" }}>
                                          <Icons.BsCheckCircleFill /> Sim
                                        </span>
                                      ) : (
                                        <span className="type-badge" style={{ margin: 0, padding: "4px 8px", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#f1f5f9", color: "#64748b" }}>
                                          <Icons.BsDashCircleFill /> Não
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    {isFuture ? (
                                      <span className="type-badge" style={{ margin: 0, padding: "4px 8px", fontSize: "1.1rem", backgroundColor: "#f8fafc", color: "#94a3b8", border: "1px solid #e2e8f0" }}>AGUARDANDO</span>
                                    ) : !didWork ? (
                                      <span style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}>-</span>
                                    ) : trabalhadoRecord?.pago_em_dobro ? (
                                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span className="type-badge badge-pago-dobro" style={{ margin: 0, padding: "4px 8px", fontSize: "1.1rem" }}>Pago em Dobro</span>
                                        <button
                                          type="button"
                                          onClick={async (e) => { e.preventDefault(); await handleUpdatePagoEmDobro(globalFeriado, false); }}
                                          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
                                          title="Remover pagamento em dobro"
                                          disabled={saving}
                                        >
                                          <Icons.BsXCircleFill />
                                        </button>
                                      </div>
                                    ) : trabalhadoRecord?.data_folga ? (
                                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span className="type-badge badge-folga-tirada" style={{ margin: 0, padding: "4px 8px", fontSize: "1.1rem" }}>Tirada em: {formatDisplayDate(trabalhadoRecord.data_folga)}</span>
                                        <button
                                          type="button"
                                          onClick={async (e) => { e.preventDefault(); await handleUpdateFolga(globalFeriado, ""); }}
                                          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
                                          title="Remover data da folga"
                                          disabled={saving}
                                        >
                                          <Icons.BsXCircleFill />
                                        </button>
                                      </div>
                                    ) : (
                                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span className="type-badge badge-advertencia" style={{ margin: 0, padding: "4px 8px", fontSize: "1.1rem", whiteSpace: "nowrap" }}>Pendente</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 600 }}>Dar Folga:</span>
                                            <FolgaDateInput globalFeriado={globalFeriado} onSave={handleUpdateFolga} saving={saving} />
                                          </div>
                                          <span style={{ color: "#cbd5e1", fontSize: "1.2rem", fontWeight: 300 }}>|</span>
                                          <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); handleUpdatePagoEmDobro(globalFeriado, true); }}
                                            className="primary-btn"
                                            style={{ padding: "6px 10px", fontSize: "1.1rem", margin: 0, whiteSpace: "nowrap" }}
                                            disabled={saving}
                                          >
                                            Pagar em Dobro
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Frequency Grids (Annual and Monthly) */}
            {employee?.controlar_frequencia !== false && (
              <div className="freq-grid-container">
                {/* Annual Summary Section */}
                <div className="freq-section">
                  <div className="freq-section-header" style={{ cursor: "pointer" }} onClick={() => setIsAnnualExpanded(!isAnnualExpanded)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <h2 style={{ margin: 0 }}><Icons.BsCalendar3 style={{ marginRight: "8px" }} />Resumo Anual</h2>
                      <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", padding: "4px" }}>
                        {isAnnualExpanded ? <Icons.BsChevronUp /> : <Icons.BsChevronDown />}
                      </button>
                    </div>
                  </div>

                  {isAnnualExpanded && (
                    <div className="freq-annual-summary-wrapper">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '0 0 16px 0' }}>
                        <button type="button" onClick={handlePrevYear} style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', padding: '6px 10px', display: 'flex', alignItems: 'center', color: 'var(--text-dark)' }}>
                          <Icons.BsChevronLeft style={{ strokeWidth: 1 }} />
                        </button>
                        <select className="freq-select" value={freqYear} onChange={(e) => setFreqYear(parseInt(e.target.value))} style={{ minWidth: '100px', fontSize: '1.4rem', margin: 0 }}>
                          {freqYearsList.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                        <button type="button" onClick={handleNextYear} style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', padding: '6px 10px', display: 'flex', alignItems: 'center', color: 'var(--text-dark)' }}>
                          <Icons.BsChevronRight style={{ strokeWidth: 1 }} />
                        </button>
                      </div>

                      {loadingAnnual ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                          <Icons.BsArrowClockwise className="spin" style={{ fontSize: "1.5rem", color: "var(--primary-color)" }} />
                        </div>
                      ) : (
                        <div className="freq-table-wrapper">
                          <table className="freq-table">
                            <thead>
                              <tr>
                                <th>Mês</th>
                                <th style={{ textAlign: 'center' }}>Faltas</th>
                                <th style={{ textAlign: 'center' }}>Atestados</th>
                                <th style={{ textAlign: 'center' }}>Atrasos</th>
                              </tr>
                            </thead>
                            <tbody>
                              {annualSummaryData.map((row) => (
                                <tr key={row.month}>
                                  <td style={{ fontWeight: 600 }}>{freqMonthsList.find(m => m.value === row.month)?.label}</td>
                                  <td style={{ textAlign: 'center' }}>
                                    {row.faltas > 0 ? <span className="freq-status-pill freq-status-falta">{row.faltas}</span> : <span style={{ color: '#9ca3af' }}>-</span>}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {row.atestados > 0 ? <span className="freq-status-pill freq-status-atestado">{row.atestados}</span> : <span style={{ color: '#9ca3af' }}>-</span>}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    {row.atrasos > 0 ? <span className="freq-status-pill freq-status-atraso">{row.atrasos}</span> : <span style={{ color: '#9ca3af' }}>-</span>}
                                  </td>
                                </tr>
                              ))}
                              {/* Total Row */}
                              <tr style={{ backgroundColor: 'rgba(120, 78, 33, 0.05)', fontWeight: 700 }}>
                                <td style={{ color: 'var(--primary-color)' }}>Total {freqYear}</td>
                                <td style={{ textAlign: 'center' }}>
                                  {annualSummaryData.reduce((acc, row) => acc + row.faltas, 0)}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  {annualSummaryData.reduce((acc, row) => acc + row.atestados, 0)}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  {annualSummaryData.reduce((acc, row) => acc + row.atrasos, 0)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Monthly Frequency Section */}
                <div className="freq-section">
                  <div className="freq-section-header" style={{ cursor: "pointer" }} onClick={() => setIsMonthlyExpanded(!isMonthlyExpanded)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <h2 style={{ margin: 0 }}><Icons.BsCalendarCheck style={{ marginRight: "8px" }} />Frequência Mensal</h2>
                      <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", padding: "4px" }}>
                        {isMonthlyExpanded ? <Icons.BsChevronUp /> : <Icons.BsChevronDown />}
                      </button>
                    </div>
                  </div>

                  {isMonthlyExpanded && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '0 0 16px 0' }}>
                        <button type="button" onClick={handlePrevMonth} style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', padding: '6px 10px', display: 'flex', alignItems: 'center', color: 'var(--text-dark)' }}>
                          <Icons.BsChevronLeft style={{ strokeWidth: 1 }} />
                        </button>
                        <select className="freq-select" value={freqMonth} onChange={(e) => setFreqMonth(parseInt(e.target.value))} style={{ minWidth: '140px', fontSize: '1.4rem', margin: 0 }}>
                          {freqMonthsList.map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </select>
                        <button type="button" onClick={handleNextMonth} style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', padding: '6px 10px', display: 'flex', alignItems: 'center', color: 'var(--text-dark)' }}>
                          <Icons.BsChevronRight style={{ strokeWidth: 1 }} />
                        </button>
                      </div>

                      {/* Summary badges */}
                      <div className="freq-summary-row">
                        <div className="freq-summary-badge freq-badge-absence">
                          <Icons.BsXCircleFill />
                          <span className="freq-badge-number">{freqSummary.faltas}</span>
                          <span className="freq-badge-label">Faltas</span>
                        </div>
                        <div className="freq-summary-badge freq-badge-medical">
                          <Icons.BsClipboard2PulseFill />
                          <span className="freq-badge-number">{freqSummary.atestados}</span>
                          <span className="freq-badge-label">Atestados</span>
                        </div>
                        <div className="freq-summary-badge freq-badge-late">
                          <Icons.BsClockHistory />
                          <span className="freq-badge-number">{freqSummary.atrasos}</span>
                          <span className="freq-badge-label">Atrasos</span>
                        </div>
                      </div>

                      {/* Frequency table */}
                      <div className="freq-table-wrapper">
                        {loadingFreq ? (
                          <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
                            <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                          </div>
                        ) : (
                          <table className="freq-table">
                            <thead>
                              <tr>
                                <th style={{ width: "80px" }}>Data</th>
                                <th style={{ width: "50px" }}>Dia</th>
                                <th>Status</th>
                                <th style={{ width: "40%" }}>Observação</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getFreqDaysArray().map((dateObj) => {
                                const yStr = dateObj.getFullYear();
                                const mStr = String(dateObj.getMonth() + 1).padStart(2, "0");
                                const dStr = String(dateObj.getDate()).padStart(2, "0");
                                const dateStr = `${yStr}-${mStr}-${dStr}`;
                                const weekday = getWeekdayName(dateObj);
                                const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                                const isBeforeReg = employee?.data_registro && dateStr < employee.data_registro;
                                const todayDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                                const isToday = dateStr === todayDateStr;

                                if (isBeforeReg) {
                                  return (
                                    <tr key={dateStr} className="freq-row-disabled">
                                      <td>{`${dStr}/${mStr}`}</td>
                                      <td>{weekday}</td>
                                      <td colSpan={2} style={{ color: "#9ca3af", textAlign: "center" }}>—</td>
                                    </tr>
                                  );
                                }

                                const status = getFreqStatusForDate(dateStr, dateObj);
                                const statusClass = getFreqStatusClass(status);
                                const obs = freqRecords.find((r) => r.date === dateStr)?.observacao || "";

                                return (
                                  <tr key={dateStr} className={`${isWeekend ? "freq-row-weekend" : ""} ${isToday ? "freq-row-today" : ""}`}>
                                    <td className="freq-td-date">{`${dStr}/${mStr}`}</td>
                                    <td className="freq-td-weekday">{weekday}</td>
                                    <td>
                                      <span className={`freq-status-pill ${statusClass}`}>{status}</span>
                                    </td>
                                    <td className="freq-td-obs">{obs}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </>
  );
}

export default HistoricoFuncionario;
