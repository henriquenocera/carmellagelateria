import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import { Link } from "react-router-dom";
import "../css/Frequencia.css";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";

interface Profile {
  id: string;
  short_id: string | null;
  name: string;
  email: string;
  is_admin: boolean | null;
  controlar_frequencia?: boolean | null;
  folgas_fixas?: string | null;
  ativo?: boolean | null;
  data_registro?: string | null;
}

interface AttendanceMap {
  [key: string]: string; // key: employeeId_dateStr, value: status
}

const STATUS_OPTIONS = [
  { value: "Trabalhado", label: "Trabalhado", className: "status-trabalhado" },
  { value: "Falta Não Justificada", label: "Falta Não Justificada", className: "status-falta-n-just" },
  { value: "Atestado", label: "Atestado", className: "status-atestado" },
  { value: "Declaração de Horas", label: "Declaração de Horas", className: "status-declaracao-horas" },
  { value: "Saída Antecipada", label: "Saída Antecipada", className: "status-saida-antecipada" },
  { value: "Atraso", label: "Atraso", className: "status-atraso" },
  { value: "Folga Fixa Semanal", label: "Folga Fixa Semanal", className: "status-folga-fixa" },
  { value: "Domingo de Folga", label: "Domingo de Folga", className: "status-folga-dom" },
  { value: "Folga Compensatória", label: "Folga Compensatória", className: "status-folga-comp" },
  { value: "Férias", label: "Férias", className: "status-ferias" },
  { value: "Período de Teste", label: "Período de Teste", className: "status-periodo-teste" },
  { value: "Registro Formal", label: "Registro Formal", className: "status-registro-formal" },
  { value: "Rescisão de Contrato", label: "Rescisão de Contrato", className: "status-rescisao-contrato" },
  { value: "Outro", label: "Outro", className: "status-outro" },
];

function Frequencia() {
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [attendance, setAttendance] = useState<AttendanceMap>({});
  const [globalHolidays, setGlobalHolidays] = useState<{ [date: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default to current month and year
  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth() + 1); // 1-12
  const [year, setYear] = useState<number>(today.getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");

  // Save status indicator: 'idle' | 'saving' | 'saved' | 'error'
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  interface CommentData {
    text: string;
    created_by: string;
    created_at: string;
  }
  interface CommentsMap {
    [key: string]: CommentData;
  }

  const [comments, setComments] = useState<CommentsMap>({});
  const [profileNames, setProfileNames] = useState<{[key: string]: string}>({});
  const [hoveredCell, setHoveredCell] = useState<{ employeeId: string; date: string } | null>(null);
  const [activeCommentModal, setActiveCommentModal] = useState<{ employeeId: string; date: string; text: string } | null>(null);

  const yearsList = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i);
  const monthsList = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  useEffect(() => {
    checkAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (isAuthorized) {
      fetchAttendanceData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized, month, year]);

  // Scroll to today's date once data is loaded
  useEffect(() => {
    if (!loading && profiles.length > 0) {
      setTimeout(() => {
        const todayRow = document.querySelector('.frequencia-table tr.today');
        if (todayRow) {
          todayRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [loading, month, year, profiles.length]);

  async function checkAccess() {
    if (!user) return;
    setIsAuthorized(true);
    fetchProfiles();
    fetchAllProfileNames();
  }

  async function fetchProfiles() {
    try {
      const { data, error: dbError } = await supabase
        .from("profiles")
        .select("id, short_id, name, email, is_admin, controlar_frequencia, folgas_fixas, ativo, data_registro")
        .order("name", { ascending: true });

      if (dbError) throw dbError;

      // Filtra perfis que têm controlar_frequencia ativado (ou não definidos como false) e que estão ativos
      const filteredProfiles = (data || []).filter((p) => p.controlar_frequencia !== false && p.ativo !== false);
      setProfiles(filteredProfiles);
    } catch (err: any) {
      console.error("Erro ao buscar perfis:", err);
      setError("Falha ao carregar a lista de funcionários.");
    }
  }

  async function fetchAllProfileNames() {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, name");
      if (data) {
        const map: {[key: string]: string} = {};
        data.forEach(p => {
          map[p.id] = p.name || "";
        });
        setProfileNames(map);
      }
    } catch (err) {
      console.error("Erro ao buscar nomes dos perfis:", err);
    }
  }

  const formatCommentDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const today = new Date();
    
    const isToday = d.getDate() === today.getDate() &&
                    d.getMonth() === today.getMonth() &&
                    d.getFullYear() === today.getFullYear();
                    
    const timeStr = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    
    if (isToday) {
      return `${timeStr} Hoje`;
    }
    
    const dateFormatted = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    return `${timeStr} ${dateFormatted}`;
  };

  async function fetchAttendanceData() {
    try {
      setLoading(true);
      setError(null);

      // Generate date range for 3 months: prev, current, next
      const startOfPrevMonth = new Date(year, month - 2, 1);
      const endOfNextMonth = new Date(year, month + 1, 0);

      const startOfMonthStr = `${startOfPrevMonth.getFullYear()}-${String(startOfPrevMonth.getMonth() + 1).padStart(2, "0")}-01`;
      const endOfMonthStr = `${endOfNextMonth.getFullYear()}-${String(endOfNextMonth.getMonth() + 1).padStart(2, "0")}-${String(endOfNextMonth.getDate()).padStart(2, "0")}`;

      const { data, error: dbError } = await supabase
        .from("frequencia")
        .select("*")
        .gte("date", startOfMonthStr)
        .lte("date", endOfMonthStr);

      if (dbError) throw dbError;

      // Map rows to map key: 'employeeId_date'
      const attMap: AttendanceMap = {};
      const commMap: CommentsMap = {};
      if (data) {
        data.forEach((row: any) => {
          const key = `${row.employee_id}_${row.date}`;
          attMap[key] = row.status;
          if (row.observacao) {
            commMap[key] = {
              text: row.observacao,
              created_by: row.observacao_by || "",
              created_at: row.observacao_at || ""
            };
          }
        });
      }
      setAttendance(attMap);
      setComments(commMap);
      const { data: feriadosData, error: feriadosError } = await supabase
        .from("feriados_globais")
        .select("*")
        .gte("date", startOfMonthStr)
        .lte("date", endOfMonthStr);

      if (feriadosError) throw feriadosError;

      const hMap: { [date: string]: string } = {};
      if (feriadosData) {
        feriadosData.forEach((f: any) => {
          hMap[f.date] = f.name;
        });
      }
      setGlobalHolidays(hMap);

    } catch (err: any) {
      console.error("Erro ao buscar frequência:", err);
      setError("Erro ao carregar os dados de frequência.");
    } finally {
      setLoading(false);
    }
  }

  const handleSaveComment = async (employeeId: string, dateStr: string, text: string) => {
    if (!user) return;
    setSaveStatus("saving");

    const key = `${employeeId}_${dateStr}`;
    const prevComment = comments[key];
    const now = new Date().toISOString();

    setComments((prev) => ({
      ...prev,
      [key]: {
        text,
        created_by: user.id,
        created_at: now,
      },
    }));

    try {
      const currentStatus = attendance[key] || "Trabalhado";
      const { error } = await supabase
        .from("frequencia")
        .upsert(
          {
            employee_id: employeeId,
            date: dateStr,
            status: currentStatus,
            observacao: text,
            observacao_by: user.id,
            observacao_at: now,
            updated_at: now,
          },
          { onConflict: "employee_id,date" }
        );

      if (error) throw error;
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
      setActiveCommentModal(null);
    } catch (err) {
      console.error("Erro ao salvar comentário:", err);
      setSaveStatus("error");
      if (prevComment) {
        setComments((prev) => ({ ...prev, [key]: prevComment }));
      } else {
        setComments((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
      }
    }
  };

  const handleDeleteComment = async (employeeId: string, dateStr: string) => {
    if (!user) return;
    if (!window.confirm("Deseja realmente remover este comentário?")) return;
    setSaveStatus("saving");

    const key = `${employeeId}_${dateStr}`;
    const prevComment = comments[key];

    setComments((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    try {
      const currentStatus = attendance[key] || "Trabalhado";
      const { error } = await supabase
        .from("frequencia")
        .upsert(
          {
            employee_id: employeeId,
            date: dateStr,
            status: currentStatus,
            observacao: null,
            observacao_by: null,
            observacao_at: null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "employee_id,date" }
        );

      if (error) throw error;
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
      setActiveCommentModal(null);
    } catch (err) {
      console.error("Erro ao deletar comentário:", err);
      setSaveStatus("error");
      if (prevComment) {
        setComments((prev) => ({ ...prev, [key]: prevComment }));
      }
    }
  };

  // Generate days array for 3 months (prev, current, next)
  const getDaysArray = () => {
    const dates = [];
    
    // Previous Month
    const prevMonthDays = new Date(year, month - 1, 0).getDate();
    for (let d = 1; d <= prevMonthDays; d++) {
      dates.push(new Date(year, month - 2, d));
    }
    
    // Current Month
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      dates.push(new Date(year, month - 1, d));
    }
    
    // Next Month
    const nextMonthDays = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= nextMonthDays; d++) {
      dates.push(new Date(year, month, d));
    }
    
    return dates;
  };

  const datesList = getDaysArray();

  const getWorkedDaysCount = (employeeId: string) => {
    let count = 0;
    const profile = profiles.find((p) => p.id === employeeId);
    const fixedOffDays = profile?.folgas_fixas ? profile.folgas_fixas.split(",") : [];
    const regDate = profile?.data_registro;

    datesList.forEach((dateObj) => {
      // Conta apenas para o mês selecionado no topo
      if (dateObj.getMonth() !== month - 1) {
        return;
      }

      const dateStr = getLocalDateString(dateObj);
      
      // Se a data do dia for anterior à data de admissão, não conta como trabalhado
      if (regDate && dateStr < regDate) {
        return;
      }

      const cellKey = `${employeeId}_${dateStr}`;
      const weekdayVal = String(dateObj.getDay());
      const isFixedOff = fixedOffDays.includes(weekdayVal);
      const defaultStatus = isFixedOff ? "Folga Fixa Semanal" : "Trabalhado";

      const status = attendance[cellKey] || defaultStatus;
      const isWorkedStatus = [
        "Trabalhado",
        "Declaração de Horas",
        "Saída Antecipada",
        "Atraso",
        "Registro Formal",
        "Rescisão de Contrato",
        "Outro"
      ].includes(status);

      if (isWorkedStatus) {
        count++;
      }
    });
    return count;
  };

  // Helper date formatters
  const getLocalDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const formatDisplayDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const getWeekdayAbbreviation = (date: Date) => {
    const weekdays = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];
    return weekdays[date.getDay()];
  };

  const handleMonthNavigation = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (month === 1) {
        setMonth(12);
        setYear((prev) => prev - 1);
      } else {
        setMonth((prev) => prev - 1);
      }
    } else {
      if (month === 12) {
        setMonth(1);
        setYear((prev) => prev + 1);
      } else {
        setMonth((prev) => prev + 1);
      }
    }
  };

  const handleGoToToday = () => {
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    if (month === currentMonth && year === currentYear) {
      // Já está no mês atual, só faz o scroll
      const todayRow = document.querySelector('.frequencia-table tr.today');
      if (todayRow) {
        todayRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // Muda para o mês atual, e o useEffect vai cuidar de fazer o scroll quando carregar
      setMonth(currentMonth);
      setYear(currentYear);
    }
  };

  const handleStatusChange = async (employeeId: string, dateStr: string, newStatus: string) => {
    setSaveStatus("saving");
    const cacheKey = `${employeeId}_${dateStr}`;
    const previousStatus = attendance[cacheKey] || "Trabalhado";

    // Optimistic UI update
    setAttendance((prev) => ({
      ...prev,
      [cacheKey]: newStatus,
    }));

    try {
      const { error } = await supabase
        .from("frequencia")
        .upsert(
          {
            employee_id: employeeId,
            date: dateStr,
            status: newStatus,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "employee_id,date" }
        );

      if (error) throw error;
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      console.error("Erro ao salvar alteração:", err);
      setSaveStatus("error");
      // Revert optimistic update
      setAttendance((prev) => ({
        ...prev,
        [cacheKey]: previousStatus,
      }));
    }
  };

  const handleExportCSV = () => {
    const displayProfiles = selectedEmployee === "all" ? profiles : profiles.filter(p => p.id === selectedEmployee);
    if (displayProfiles.length === 0) return;

    // Build CSV Headers
    const headers = [
      "Data",
      "Dia",
      ...displayProfiles.map((p) => `${p.short_id ? p.short_id + " - " : ""}${p.name}`),
    ];

    // Build CSV Rows
    const rows = datesList.map((dateObj) => {
      const dateStr = getLocalDateString(dateObj);
      const displayDate = formatDisplayDate(dateStr);
      const weekday = getWeekdayAbbreviation(dateObj);

      const empStatuses = displayProfiles.map((p) => {
        const key = `${p.id}_${dateStr}`;
        const weekdayVal = String(dateObj.getDay());
        const fixedOffDays = p.folgas_fixas ? p.folgas_fixas.split(",") : [];
        const isFixedOff = fixedOffDays.includes(weekdayVal);
        const defaultStatus = isFixedOff ? "Folga Fixa Semanal" : "Trabalhado";

        return attendance[key] || defaultStatus;
      });

      return [displayDate, weekday, ...empStatuses];
    });

    // Create CSV content with semicolon separator for direct Excel import in PT-BR
    const csvContent = [
      headers.join(";"),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";")),
    ].join("\r\n");

    // Add BOM for proper UTF-8 decoding in Excel
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const monthLabel = monthsList.find((m) => m.value === month)?.label || month;

    link.setAttribute("href", url);
    link.setAttribute("download", `Frequencia_${monthLabel}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isAuthorized === null) {
    return (
      <div className="frequencia-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <Icons.BsArrowClockwise className="spin" style={{ fontSize: "3rem", color: "var(--primary-color)" }} />
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="frequencia-container">
        <div className="error-state">
          <Icons.BsShieldLock style={{ fontSize: "4rem", color: "#ef4444", marginBottom: "16px" }} />
          <h2 style={{ color: "var(--secondary-color)", marginBottom: "8px" }}>Acesso Negado</h2>
          <p>Somente administradores podem acessar a página de Controle de Frequência.</p>
        </div>
      </div>
    );
  }

  const todayStr = getLocalDateString(today);

  const displayProfiles = selectedEmployee === "all" ? profiles : profiles.filter(p => p.id === selectedEmployee);

  return (
    <>
      <Helmet>
        <title>Frequência de Funcionários</title>
      </Helmet>

      <div className="frequencia-container">
        {/* Header */}
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Controle de Frequência</h1>
            <p>Monitore e informe a presença, faltas, folgas e atestados da equipe.</p>
          </div>

          <button onClick={handleExportCSV} className="primary-btn" style={{ marginTop: 15 }}>
            <Icons.BsDownload />
            Exportar Excel (CSV)
          </button>
        </div>

        {/* Controls Bar */}
        <div className="frequencia-controls">
          <div className="control-group">
            <button className="nav-btn" onClick={() => handleMonthNavigation("prev")} title="Mês Anterior">
              <Icons.BsChevronLeft />
            </button>

            <select
              className="frequencia-select"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {monthsList.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              className="frequencia-select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {yearsList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button className="nav-btn" onClick={() => handleMonthNavigation("next")} title="Próximo Mês">
              <Icons.BsChevronRight />
            </button>
            <button className="nav-btn" onClick={handleGoToToday} title="Ir para o dia de hoje" style={{ marginLeft: "8px", fontWeight: "bold" }}>
              Hoje
            </button>

            <select
              className="frequencia-select"
              style={{ marginLeft: "16px", maxWidth: "200px" }}
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="all">Todos os Funcionários</option>
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.name.split(" ")[0]}</option>
              ))}
            </select>
          </div>

          <div className="actions-group">
            {saveStatus === "saving" && (
              <div className="save-status-indicator salvando">
                <Icons.BsArrowClockwise className="spin" />
                <span>Salvando...</span>
              </div>
            )}
            {saveStatus === "saved" && (
              <div className="save-status-indicator salvo">
                <Icons.BsCheckLg />
                <span>Salvo no banco</span>
              </div>
            )}
            {saveStatus === "error" && (
              <div className="save-status-indicator erro">
                <Icons.BsExclamationTriangle />
                <span>Erro ao salvar</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Grid Sheet */}
        {loading ? (
          <div className="frequencia-table-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <div className="loading-state">
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "3rem", marginBottom: "12px" }} />
              <p>Carregando planilha de frequência...</p>
            </div>
          </div>
        ) : error ? (
          <div className="frequencia-table-wrapper" style={{ padding: '40px' }}>
            <div className="error-state">
              <Icons.BsExclamationTriangle style={{ fontSize: "3rem", color: "#ef4444", marginBottom: "12px" }} />
              <p>{error}</p>
              <button onClick={fetchAttendanceData} className="primary-btn" style={{ marginTop: "16px" }}>Tentar Novamente</button>
            </div>
          </div>
        ) : profiles.length === 0 ? (
          <div className="frequencia-table-wrapper" style={{ padding: '40px' }}>
            <div className="empty-state">
              <Icons.BsPeople style={{ fontSize: "3rem", marginBottom: "12px" }} />
              <p>Nenhum funcionário cadastrado no sistema.</p>
              <p style={{ fontSize: "1.2rem", marginTop: "4px" }}>Cadastre pessoas na aba de Usuários primeiro.</p>
            </div>
          </div>
        ) : (
          <div className="frequencia-table-wrapper">
            <table className="frequencia-table">
              <thead>
                <tr>
                  <th className="sticky-date">Data</th>
                  <th className="sticky-day">Dia</th>
                  {displayProfiles.map((p) => {
                    const workedCount = getWorkedDaysCount(p.id);
                    const firstName = p.name.split(" ")[0] || p.name;
                    const displayName = p.short_id ? `${firstName}` : firstName;
                    return (
                      <th key={p.id} title={p.email} style={{ whiteSpace: 'nowrap', width: selectedEmployee !== "all" ? "250px" : "auto", minWidth: selectedEmployee !== "all" ? "250px" : "auto" }}>
                        <Link to={`/cadastro-pessoas/${p.id}`} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }} title={`Ver perfil de ${displayName}`}>
                          <span style={{ textDecoration: 'underline', textDecorationColor: 'rgba(0,0,0,0.2)' }}>{displayName}</span>
                        </Link>
                        <span style={{ marginLeft: '8px', fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', background: '#784e21', padding: '2px 8px', borderRadius: '20px', display: 'inline-block', verticalAlign: 'middle', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                          {workedCount}d
                        </span>
                      </th>
                    );
                  })}
                  {selectedEmployee !== "all" && <th style={{ width: "100%", background: "transparent", borderRight: "none" }}></th>}
                </tr>
              </thead>
              <tbody>
                {datesList.map((dateObj, rowIndex) => {
                  const dateStr = getLocalDateString(dateObj);
                  const displayDate = formatDisplayDate(dateStr);
                  const weekdayStr = getWeekdayAbbreviation(dateObj);
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6; // Sunday or Saturday
                  const isToday = dateStr === todayStr;
                  const isNearBottom = rowIndex > datesList.length - 8;
                  const isHoliday = globalHolidays[dateStr];
                  const isCurrentMonth = dateObj.getMonth() === month - 1;
                  const isFirstDay = dateObj.getDate() === 1;

                  return (
                    <tr
                      key={dateStr}
                      className={`${isWeekend ? "weekend" : ""} ${isToday ? "today" : ""} ${isHoliday ? "holiday-row" : ""} ${!isCurrentMonth ? "other-month-row" : ""} ${isFirstDay ? "first-day-row" : ""}`}
                    >
                      {/* Sticky Date */}
                      <td className="sticky-date">
                        {displayDate}
                        {isHoliday && (
                          <Icons.BsBriefcaseFill 
                            title={isHoliday} 
                            style={{ marginLeft: "8px", color: "var(--primary-color)", fontSize: "1.2rem", verticalAlign: "middle" }} 
                          />
                        )}
                      </td>
                      {/* Sticky Weekday */}
                      <td className="sticky-day">{weekdayStr}</td>

                      {/* Employee Dropdowns */}
                      {displayProfiles.map((p) => {
                        const cellKey = `${p.id}_${dateStr}`;
                        const weekdayVal = String(dateObj.getDay());
                        const fixedOffDays = p.folgas_fixas ? p.folgas_fixas.split(",") : [];
                        const isFixedOff = fixedOffDays.includes(weekdayVal);
                        const defaultStatus = isFixedOff ? "Folga Fixa Semanal" : "Trabalhado";

                        const currentVal = attendance[cellKey] || defaultStatus;
                        const selectedOption = STATUS_OPTIONS.find((opt) => opt.value === currentVal);
                        const comment = comments[cellKey];

                        const regDate = p.data_registro;
                        const isBeforeRegistration = regDate && dateStr < regDate;

                        if (isBeforeRegistration) {
                          return (
                            <td key={p.id} style={{ backgroundColor: "#f3f4f6", color: "#9ca3af", textAlign: "center", verticalAlign: "middle", fontSize: "1.2rem", fontWeight: 500 }}>
                              -
                            </td>
                          );
                        }

                        return (
                          <td key={p.id}>
                            <div 
                              className="cell-select-wrapper"
                              onMouseEnter={() => setHoveredCell({ employeeId: p.id, date: dateStr })}
                              onMouseLeave={() => setHoveredCell(null)}
                            >
                              <select
                                className={`cell-select ${selectedOption?.className || "status-trabalhado"}`}
                                value={currentVal}
                                onChange={(e) => handleStatusChange(p.id, dateStr, e.target.value)}
                              >
                                {STATUS_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>

                              {/* Comment orange indicator */}
                              {comment && (
                                <div 
                                  className="comment-indicator" 
                                  onClick={() => setActiveCommentModal({ employeeId: p.id, date: dateStr, text: comment.text })}
                                />
                              )}

                              {/* Comment hover button to edit/add */}
                              <button 
                                className="comment-hover-btn" 
                                title={comment ? "Editar comentário" : "Adicionar comentário"}
                                onClick={() => setActiveCommentModal({ employeeId: p.id, date: dateStr, text: comment ? comment.text : "" })}
                              >
                                <Icons.BsChatText />
                              </button>

                              {/* Hover Popover */}
                              {hoveredCell?.employeeId === p.id && hoveredCell?.date === dateStr && comment && (
                                <div className={`comment-popover ${isNearBottom ? "popover-up" : ""}`}>
                                  <div className="comment-popover-header">
                                    <div className="comment-avatar">
                                      <Icons.BsPersonFill />
                                    </div>
                                    <div className="comment-meta">
                                      <span className="comment-author">
                                        {profileNames[comment.created_by] || "Usuário"}
                                      </span>
                                      <span className="comment-time">
                                        {formatCommentDate(comment.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="comment-popover-body">
                                    {comment.text}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                      {selectedEmployee !== "all" && <td style={{ width: "100%", borderRight: "none" }}></td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Modal de Comentário */}
      {activeCommentModal && (
        <div className="modal-overlay">
          <div className="modal-content comment-modal">
            <h2>
              {comments[`${activeCommentModal.employeeId}_${activeCommentModal.date}`]
                ? "Editar Comentário"
                : "Adicionar Comentário"}
            </h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "-8px 0 8px 0" }}>
              Colaborador: {profiles.find(p => p.id === activeCommentModal.employeeId)?.name} | Data: {formatDisplayDate(activeCommentModal.date)}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveComment(activeCommentModal.employeeId, activeCommentModal.date, activeCommentModal.text);
              }}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div className="form-group">
                <label>Comentário / Observação</label>
                <textarea
                  required
                  rows={4}
                  value={activeCommentModal.text}
                  onChange={(e) => setActiveCommentModal({ ...activeCommentModal, text: e.target.value })}
                  placeholder="Ex: Chegou 15 minutos atrasado devido ao trânsito."
                  style={{
                    padding: "10px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    fontFamily: "inherit",
                    fontSize: "14px",
                    resize: "vertical",
                  }}
                />
              </div>
              <div className="modal-actions" style={{ justifyContent: "space-between" }}>
                {comments[`${activeCommentModal.employeeId}_${activeCommentModal.date}`] ? (
                  <button
                    type="button"
                    className="delete-btn icon-btn"
                    title="Excluir Comentário"
                    onClick={() => handleDeleteComment(activeCommentModal.employeeId, activeCommentModal.date)}
                    style={{ padding: "10px 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", cursor: "pointer" }}
                  >
                    <Icons.BsTrash /> Excluir
                  </button>
                ) : (
                  <div />
                )}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setActiveCommentModal(null)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="primary-btn" style={{ marginTop: 0 }}>
                    <Icons.BsCheckLg /> Salvar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Frequencia;
