import React, { useState, useEffect, useMemo } from "react";
import "../css/Home.css";
import supabase from "../supabase-client";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import { STORE_CONFIG } from "../config/store.js";
import { useAuth } from "../components/AuthProvider.tsx";

const INITIAL_DEMO_TASKS = [
  {
    id: 1,
    titulo: "Limpeza das Máquinas de Gelato",
    loja: "Alto XV",
    tipo_repeticao: "dias_semana",
    dias_semana: [1, 4],
    repeticao: "Toda Segunda e Quinta",
    descricao: "Fazer sanitização completa dos cilindros e lavagem de peças.",
    criado_por: "Supervisão"
  },
  {
    id: 2,
    titulo: "Contagem de Estoque e Inventário Mensal",
    loja: "Todas",
    tipo_repeticao: "dia_mes",
    dia_mes: 10,
    repeticao: "Todo dia 10",
    descricao: "Conferir insumos e embalagens para fechamento de caixa.",
    criado_por: "Operações"
  },
  {
    id: 3,
    titulo: "Verificação da Temperatura das Vitrines",
    loja: "Ahú",
    tipo_repeticao: "diaria",
    repeticao: "Todo dia",
    descricao: "Checar se a vitrine está operando entre -12°C e -14°C.",
    criado_por: "Gerência"
  }
];

function Home() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email || "Funcionário";

  const [tarefas, setTarefas] = useState([]);
  const [conclusoes, setConclusoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingConclusao, setSavingConclusao] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Modal state: { task, cellDate }
  const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);

  // Calendar Date State
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  useEffect(() => {
    fetchTarefas();
    fetchConclusoes();
  }, []);

  const fetchTarefas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tarefas_lojas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Lendo tarefas locais/demo:", error.message);
        setUsingFallback(true);
        const stored = localStorage.getItem("carmella_tarefas_lojas");
        if (stored) {
          try {
            setTarefas(JSON.parse(stored));
          } catch (e) {
            setTarefas(INITIAL_DEMO_TASKS);
          }
        } else {
          setTarefas(INITIAL_DEMO_TASKS);
        }
      } else {
        setTarefas(data || []);
      }
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      setTarefas(INITIAL_DEMO_TASKS);
    } finally {
      setLoading(false);
    }
  };

  const fetchConclusoes = async () => {
    try {
      const { data, error } = await supabase
        .from("tarefas_lojas_concluidas")
        .select("*");

      if (error) {
        console.warn("Lendo conclusões do armazenamento local:", error.message);
        const stored = localStorage.getItem("carmella_tarefas_lojas_concluidas");
        if (stored) {
          try {
            setConclusoes(JSON.parse(stored));
          } catch (e) {
            setConclusoes([]);
          }
        }
      } else {
        setConclusoes(data || []);
      }
    } catch (err) {
      console.error("Erro ao buscar conclusões:", err);
      const stored = localStorage.getItem("carmella_tarefas_lojas_concluidas");
      if (stored) {
        try {
          setConclusoes(JSON.parse(stored));
        } catch (e) {
          setConclusoes([]);
        }
      }
    }
  };

  const saveLocalConclusoes = (newConclusoes) => {
    setConclusoes(newConclusoes);
    localStorage.setItem("carmella_tarefas_lojas_concluidas", JSON.stringify(newConclusoes));
  };

  // Helper para formatar data em YYYY-MM-DD local
  const formatDateToKey = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Nome da loja atual configurada no sistema
  const currentStoreName = useMemo(() => {
    const storeKey = (STORE_CONFIG.key || "").toLowerCase();
    const storeText = (STORE_CONFIG.textName || "").toLowerCase();
    const storeName = (STORE_CONFIG.name || "").toLowerCase();

    if (storeKey.includes("ahu") || storeText.includes("ahú") || storeText.includes("ahu") || storeName.includes("ahú")) {
      return "Ahú";
    }
    return "Alto XV";
  }, []);

  // Filtrar e mapear tarefas aplicáveis a esta loja
  const tarefasLojaAtual = useMemo(() => {
    const storeKey = (STORE_CONFIG.key || "").toLowerCase();
    const storeName = (STORE_CONFIG.name || "").toLowerCase();
    const storeText = (STORE_CONFIG.textName || "").toLowerCase();

    return tarefas
      .filter((t) => {
        const taskLoja = (t.loja || "").toLowerCase();
        if (taskLoja === "todas" || taskLoja === "") return true;

        if (storeKey.includes("ahu") || storeName.includes("ahú") || storeText.includes("ahú")) {
          return taskLoja.includes("ahú") || taskLoja.includes("ahu");
        }

        if (storeKey.includes("altoxv") || storeName.includes("alto") || storeText.includes("alto")) {
          return taskLoja.includes("alto");
        }

        return true;
      })
      .map((t) => {
        const isTodas = !t.loja || t.loja.toLowerCase() === "todas";
        return {
          ...t,
          lojaExibicao: isTodas ? currentStoreName : t.loja,
        };
      });
  }, [tarefas, currentStoreName]);

  // Calendário - Helpers de data
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  const formattedMonthYear = useMemo(() => {
    const monthName = currentCalendarDate.toLocaleString("pt-BR", { month: "long" });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `${capitalizedMonth} de ${year}`;
  }, [currentCalendarDate, year]);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Dom
    const totalDaysInMonth = lastDayOfMonth.getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days = [];
    const today = new Date();

    // Mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date: prevDate, isCurrentMonth: false, isToday: false });
    }

    // Mês atual
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const cellDate = new Date(year, month, d);
      const isToday =
        today.getDate() === d &&
        today.getMonth() === month &&
        today.getFullYear() === year;
      days.push({ date: cellDate, isCurrentMonth: true, isToday });
    }

    // Próximo mês para fechar o grid
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false, isToday: false });
    }

    return days;
  }, [year, month]);

  const isTaskOnDate = (task, date) => {
    const dayOfWeek = date.getDay(); // 0 = Dom
    const dayOfMonth = date.getDate();

    if (task.tipo_repeticao === "diaria" || task.repeticao === "Todo dia") {
      return true;
    }

    if (task.tipo_repeticao === "dias_semana" && Array.isArray(task.dias_semana)) {
      return task.dias_semana.includes(dayOfWeek);
    }

    if (task.tipo_repeticao === "dia_mes" && task.dia_mes) {
      return Number(task.dia_mes) === dayOfMonth;
    }

    if (task.tipo_repeticao === "sem_repeticao") {
      if (task.created_at) {
        const createdDate = new Date(task.created_at);
        return (
          createdDate.getDate() === dayOfMonth &&
          createdDate.getMonth() === date.getMonth() &&
          createdDate.getFullYear() === date.getFullYear()
        );
      }
      return false;
    }

    return false;
  };

  // Checar se a tarefa está concluída nesta loja e nesta data
  const isTaskCompletedOnDate = (task, date) => {
    const dateKey = formatDateToKey(date);
    return conclusoes.some(
      (c) =>
        String(c.tarefa_id) === String(task.id) &&
        (c.loja || "").toLowerCase() === (task.lojaExibicao || "").toLowerCase() &&
        c.data_referencia === dateKey
    );
  };

  // Marcar / Desfazer conclusão de tarefa
  const handleToggleConclusao = async (task, date) => {
    const dateKey = formatDateToKey(date);
    const completed = isTaskCompletedOnDate(task, date);

    try {
      setSavingConclusao(true);

      if (completed) {
        // Desfazer conclusão
        const updated = conclusoes.filter(
          (c) =>
            !(
              String(c.tarefa_id) === String(task.id) &&
              (c.loja || "").toLowerCase() === (task.lojaExibicao || "").toLowerCase() &&
              c.data_referencia === dateKey
            )
        );

        if (!usingFallback) {
          const { error } = await supabase
            .from("tarefas_lojas_concluidas")
            .delete()
            .eq("tarefa_id", task.id)
            .eq("loja", task.lojaExibicao)
            .eq("data_referencia", dateKey);

          if (error) {
            console.warn("Erro ao deletar no Supabase, usando armazenamento local:", error.message);
            saveLocalConclusoes(updated);
          } else {
            setConclusoes(updated);
          }
        } else {
          saveLocalConclusoes(updated);
        }
      } else {
        // Concluir tarefa
        const payload = {
          tarefa_id: task.id,
          loja: task.lojaExibicao,
          data_referencia: dateKey,
          concluido_em: new Date().toISOString(),
          concluido_por: userName,
        };

        if (!usingFallback) {
          const { data, error } = await supabase
            .from("tarefas_lojas_concluidas")
            .insert([payload])
            .select();

          if (error) {
            console.warn("Erro ao salvar conclusão no Supabase, salvando localmente:", error.message);
            const newRecord = { id: Date.now(), ...payload };
            saveLocalConclusoes([newRecord, ...conclusoes]);
          } else {
            setConclusoes([...(data || [payload]), ...conclusoes]);
          }
        } else {
          const newRecord = { id: Date.now(), ...payload };
          saveLocalConclusoes([newRecord, ...conclusoes]);
        }
      }
    } catch (err) {
      console.error("Erro ao alterar status da tarefa:", err);
    } finally {
      setSavingConclusao(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentCalendarDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(new Date(year, month + 1, 1));
  };

  const handleTodayMonth = () => {
    setCurrentCalendarDate(new Date());
  };

  const getTaskBadgeClass = (lojaName) => {
    if (lojaName === "Ahú") return "task-loja-ahu";
    if (lojaName === "Alto XV" || lojaName === "Alto da XV") return "task-loja-alto-xv";
    return "task-loja-todas";
  };

  const getLojaPillClass = (lojaName) => {
    if (lojaName === "Ahú") return "badge-loja-ahu";
    if (lojaName === "Alto XV" || lojaName === "Alto da XV") return "badge-loja-alto-xv";
    return "badge-loja-todas";
  };

  return (
    <>
      <Helmet>
        <title>Início - Carmella Gelateria</title>
      </Helmet>

      <div className="home">
        <img className="home-logo" src="/logo.svg" alt="Carmella Gelateria" />

        <div className="container">
          <div className="home-calendar-card">
            {/* Cabeçalho do Calendário */}
            <div className="home-calendar-top-bar">
              <div className="home-calendar-title-group">
                <h2>
                  <Icons.BsCalendarCheck color="var(--primary-color)" />
                  Calendário de Tarefas - {STORE_CONFIG.name || "Nossa Loja"}
                </h2>
                <p>Tarefas agendadas e rotinas operacionais para {formattedMonthYear}</p>
              </div>

              <div className="home-calendar-nav-btns">
                <button className="btn-cal-nav" onClick={handlePrevMonth} title="Mês Anterior">
                  <Icons.BsChevronLeft /> Anterior
                </button>
                <button className="btn-cal-nav" onClick={handleTodayMonth} title="Ir para Mês Atual">
                  Hoje
                </button>
                <button className="btn-cal-nav" onClick={handleNextMonth} title="Próximo Mês">
                  Próximo <Icons.BsChevronRight />
                </button>
              </div>
            </div>

            {/* Grid do Calendário */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                <Icons.BsArrowClockwise className="loading-spinner" size={36} color="var(--primary-color)" />
                <p style={{ marginTop: "1rem" }}>Carregando tarefas da loja...</p>
              </div>
            ) : (
              <div className="home-calendar-grid">
                  {/* Dias da semana */}
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d, i) => (
                    <div key={i} className="home-calendar-day-header">
                      {d}
                    </div>
                  ))}

                  {/* Células do mês */}
                  {calendarDays.map((cell, idx) => {
                  const dayTasks = tarefasLojaAtual.filter((t) => isTaskOnDate(t, cell.date));

                  return (
                    <div
                      key={idx}
                      className={`home-calendar-day-cell ${!cell.isCurrentMonth ? "other-month" : ""} ${
                        cell.isToday ? "is-today" : ""
                      }`}
                    >
                      <div className="home-calendar-day-number">
                        <span>{cell.date.getDate()}</span>
                        {cell.isToday && (
                          <span style={{ fontSize: "0.75rem", color: "var(--primary-color)", fontWeight: 800 }}>
                            Hoje
                          </span>
                        )}
                      </div>

                      <div className="home-calendar-tasks-wrapper">
                        {dayTasks.map((task) => {
                          const isDone = isTaskCompletedOnDate(task, cell.date);
                          return (
                            <div
                              key={task.id}
                              className={`home-calendar-task-item ${
                                isDone ? "is-completed" : getTaskBadgeClass(task.lojaExibicao)
                              }`}
                              onClick={() => setSelectedTaskDetail({ task, date: cell.date })}
                              title={`${task.titulo} - ${isDone ? "Concluída" : "Pendente"}`}
                            >
                              {isDone ? (
                                <Icons.BsCheckCircleFill size={11} color="#16a34a" />
                              ) : (
                                <Icons.BsCheck2Square size={11} />
                              )}
                              <span style={{ whiteSpace: "normal", wordBreak: "break-word", lineHeight: 1.3, fontSize: "0.75rem" }}>
                                {task.titulo}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal de Detalhes da Tarefa ao clicar no calendário */}
        {selectedTaskDetail && (
          <div className="task-detail-modal-overlay" onClick={() => setSelectedTaskDetail(null)}>
            <div className="task-detail-modal-card" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const { task, date } = selectedTaskDetail;
                const isDone = isTaskCompletedOnDate(task, date);
                const formattedDate = date.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });

                return (
                  <>
                    <div className="task-detail-header">
                      <div>
                        <h3>{task.titulo}</h3>
                        <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                          <span className={`badge-loja ${getLojaPillClass(task.lojaExibicao)}`}>
                            <Icons.BsShop size={14} /> {task.lojaExibicao}
                          </span>
                          <span className="badge-repeticao">
                            <Icons.BsArrowRepeat size={15} /> {task.repeticao}
                          </span>
                          <span className={isDone ? "badge-status-concluida" : "badge-status-pendente"}>
                            {isDone ? <Icons.BsCheckCircleFill size={13} /> : <Icons.BsHourglassSplit size={13} />}
                            {isDone ? "Concluída" : "Pendente"}
                          </span>
                        </div>
                      </div>
                      <button className="task-detail-close-btn" onClick={() => setSelectedTaskDetail(null)}>
                        &times;
                      </button>
                    </div>

                    <div className="task-detail-body">
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.95rem", color: "#64748b" }}>
                        <div>Data de referência: <strong>{formattedDate}</strong></div>
                        {isDone && (() => {
                          const completionRecord = conclusoes.find(
                            (c) =>
                              String(c.tarefa_id) === String(task.id) &&
                              (c.loja || "").toLowerCase() === (task.lojaExibicao || "").toLowerCase() &&
                              c.data_referencia === formatDateToKey(date)
                          );
                          const timestamp = completionRecord?.concluido_em || completionRecord?.created_at;

                          if (!timestamp) return null;

                          const d = new Date(timestamp);
                          const dateStr = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
                          const timeStr = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

                          return (
                            <div style={{ color: "#15803d", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                              <Icons.BsClockHistory size={14} color="#16a34a" />
                              Concluída em: <strong>{dateStr} às {timeStr}</strong>
                            </div>
                          );
                        })()}
                      </div>

                      {task.descricao ? (
                        <div>
                          <strong style={{ fontSize: "1rem", color: "#1e293b", display: "block", marginBottom: "0.5rem" }}>
                            Instruções e Observações:
                          </strong>
                          <div className="task-detail-desc-box">
                            {task.descricao}
                          </div>
                        </div>
                      ) : (
                        <div className="task-detail-desc-box" style={{ fontStyle: "italic", color: "#94a3b8" }}>
                          Nenhuma instrução adicional cadastrada para esta tarefa.
                        </div>
                      )}
                    </div>

                    {/* Botões de Ação */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                      {isDone ? (
                        <button
                          className="btn-desfazer"
                          onClick={() => handleToggleConclusao(task, date)}
                          disabled={savingConclusao}
                        >
                          <Icons.BsArrowCounterclockwise /> Desfazer Conclusão
                        </button>
                      ) : (
                        <button
                          className="btn-concluir"
                          onClick={() => handleToggleConclusao(task, date)}
                          disabled={savingConclusao}
                        >
                          <Icons.BsCheckCircleFill /> Marcar como Concluída
                        </button>
                      )}

                      <button
                        className="btn-cal-nav"
                        style={{ padding: "0.65rem 1.5rem" }}
                        onClick={() => setSelectedTaskDetail(null)}
                      >
                        Fechar
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
