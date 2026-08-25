import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import "../css/TarefasLojas.css";

interface Tarefa {
  id: number | string;
  titulo: string; // Nome da tarefa
  loja: "Todas" | "Ahú" | "Alto XV" | string; // Loja
  tipo_repeticao: "diaria" | "dias_semana" | "dia_mes" | "sem_repeticao" | "personalizada" | string;
  repeticao: string; // Ex: "Toda Segunda e Quinta", "Todo dia 10", "Todo dia"
  dias_semana?: number[]; // Ex: [1, 4] (1 = Seg, 4 = Qui)
  dia_mes?: number; // Ex: 10
  descricao?: string;
  criado_por?: string;
  created_at?: string;
}

const DIAS_SEMANA_MAP = [
  { id: 1, short: "Seg", full: "Segunda" },
  { id: 2, short: "Ter", full: "Terça" },
  { id: 3, short: "Qua", full: "Quarta" },
  { id: 4, short: "Qui", full: "Quinta" },
  { id: 5, short: "Sex", full: "Sexta" },
  { id: 6, short: "Sáb", full: "Sábado" },
  { id: 0, short: "Dom", full: "Domingo" },
];

const INITIAL_DEMO_TASKS: Tarefa[] = [
  {
    id: 1,
    titulo: "Limpeza das Máquinas de Gelato",
    loja: "Alto XV",
    tipo_repeticao: "dias_semana",
    dias_semana: [1, 4],
    repeticao: "Toda Segunda e Quinta",
    descricao: "Fazer sanitização completa dos cilindros e lavagem de peças.",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    titulo: "Contagem de Estoque e Inventário Mensal",
    loja: "Todas",
    tipo_repeticao: "dia_mes",
    dia_mes: 10,
    repeticao: "Todo dia 10",
    descricao: "Conferir insumos e embalagens para fechamento de caixa.",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    titulo: "Verificação da Temperatura das Vitrines",
    loja: "Ahú",
    tipo_repeticao: "diaria",
    repeticao: "Todo dia",
    descricao: "Checar se a vitrine está operando entre -12°C e -14°C.",
    created_at: new Date().toISOString()
  }
];

const TarefasLojas: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email || "Usuário";

  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [loja, setLoja] = useState<string>("Todas");
  const [tipoRepeticao, setTipoRepeticao] = useState<string>("dias_semana");
  const [selectedDiasSemana, setSelectedDiasSemana] = useState<number[]>([1, 4]); // Seg e Qui por padrão
  const [selectedDiaMes, setSelectedDiaMes] = useState<number>(10); // Dia 10 por padrão
  const [repeticaoPersonalizada, setRepeticaoPersonalizada] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");

  // Filters State
  const [filterLoja, setFilterLoja] = useState<string>("Todas");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Calendar State
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchTarefas();
  }, []);

  const fetchTarefas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tarefas_lojas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Utilizando armazenamento local (tabela tarefas_lojas não encontrada no Supabase):", error.message);
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
          localStorage.setItem("carmella_tarefas_lojas", JSON.stringify(INITIAL_DEMO_TASKS));
        }
      } else {
        setUsingFallback(false);
        setTarefas(data || []);
      }
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
      setUsingFallback(true);
      setTarefas(INITIAL_DEMO_TASKS);
    } finally {
      setLoading(false);
    }
  };

  const saveToLocal = (newTasks: Tarefa[]) => {
    setTarefas(newTasks);
    localStorage.setItem("carmella_tarefas_lojas", JSON.stringify(newTasks));
  };

  // Helper para gerar o texto amigável de repetição
  const computeRepeticaoText = (
    tipo: string,
    dias: number[],
    diaMes: number,
    custom: string
  ): string => {
    if (tipo === "diaria") return "Todo dia";
    if (tipo === "sem_repeticao") return "Sem repetição";
    if (tipo === "personalizada") return custom.trim() || "Personalizada";

    if (tipo === "dia_mes") {
      return `Todo dia ${diaMes}`;
    }

    if (tipo === "dias_semana") {
      if (!dias || dias.length === 0) return "Dias da semana";
      if (dias.length === 7) return "Todo dia";

      const isSegASex =
        dias.length === 5 && [1, 2, 3, 4, 5].every((d) => dias.includes(d));
      if (isSegASex) return "Toda Segunda a Sexta";

      const isFimDeSemana =
        dias.length === 2 && dias.includes(0) && dias.includes(6);
      if (isFimDeSemana) return "Todo Sábado e Domingo";

      // Ordenar por sequência: Seg, Ter, Qua, Qui, Sex, Sáb, Dom
      const sorted = [...dias].sort((a, b) => {
        const order = [1, 2, 3, 4, 5, 6, 0];
        return order.indexOf(a) - order.indexOf(b);
      });

      const names = sorted.map(
        (id) => DIAS_SEMANA_MAP.find((item) => item.id === id)?.full || ""
      );

      if (names.length === 1) return `Toda ${names[0]}`;
      if (names.length === 2) return `Toda ${names[0]} e ${names[1]}`;

      const last = names.pop();
      return `Toda ${names.join(", ")} e ${last}`;
    }

    return "Todo dia";
  };

  const toggleDiaSemana = (diaId: number) => {
    if (selectedDiasSemana.includes(diaId)) {
      if (selectedDiasSemana.length === 1) return;
      setSelectedDiasSemana(selectedDiasSemana.filter((d) => d !== diaId));
    } else {
      setSelectedDiasSemana([...selectedDiasSemana, diaId]);
    }
  };

  const handleEdit = (task: Tarefa) => {
    setEditingId(task.id);
    setTitulo(task.titulo);
    setLoja(task.loja || "Todas");
    setTipoRepeticao(task.tipo_repeticao || "diaria");
    setSelectedDiasSemana(task.dias_semana || [1, 4]);
    setSelectedDiaMes(task.dia_mes || 10);
    setRepeticaoPersonalizada(
      task.tipo_repeticao === "personalizada" ? task.repeticao : ""
    );
    setDescricao(task.descricao || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitulo("");
    setLoja("Todas");
    setTipoRepeticao("dias_semana");
    setSelectedDiasSemana([1, 4]);
    setSelectedDiaMes(10);
    setRepeticaoPersonalizada("");
    setDescricao("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      alert("Por favor, preencha o nome da tarefa.");
      return;
    }

    const repeticaoText = computeRepeticaoText(
      tipoRepeticao,
      selectedDiasSemana,
      selectedDiaMes,
      repeticaoPersonalizada
    );

    try {
      setSaving(true);

      const payload = {
        titulo: titulo.trim(),
        loja,
        tipo_repeticao: tipoRepeticao,
        repeticao: repeticaoText,
        dias_semana: tipoRepeticao === "dias_semana" ? selectedDiasSemana : null,
        dia_mes: tipoRepeticao === "dia_mes" ? selectedDiaMes : null,
        descricao: descricao.trim() || null,
        criado_por: userName,
      };

      if (!usingFallback) {
        if (editingId) {
          const { error } = await supabase
            .from("tarefas_lojas")
            .update(payload)
            .eq("id", editingId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("tarefas_lojas").insert([payload]);
          if (error) throw error;
        }
        await fetchTarefas();
      } else {
        if (editingId) {
          const updated = tarefas.map((t) =>
            t.id === editingId ? { ...t, ...payload } : t
          );
          saveToLocal(updated);
        } else {
          const newTask: Tarefa = {
            id: Date.now(),
            created_at: new Date().toISOString(),
            ...payload,
          };
          saveToLocal([newTask, ...tarefas]);
        }
      }

      resetForm();
    } catch (err: any) {
      console.error("Erro ao salvar tarefa:", err);
      alert(`Erro ao salvar tarefa: ${err.message || "Tente novamente."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!window.confirm("Deseja realmente excluir esta tarefa?")) return;

    const updated = tarefas.filter((t) => t.id !== id);
    setTarefas(updated);

    if (!usingFallback) {
      try {
        await supabase.from("tarefas_lojas").delete().eq("id", id);
      } catch (err) {
        fetchTarefas();
      }
    } else {
      saveToLocal(updated);
    }
  };

  const filteredTarefas = useMemo(() => {
    return tarefas.filter((t) => {
      const matchSearch =
        t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.descricao && t.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
        t.repeticao.toLowerCase().includes(searchTerm.toLowerCase());

      const matchLoja = filterLoja === "Todas" || t.loja === filterLoja;

      return matchSearch && matchLoja;
    });
  }, [tarefas, searchTerm, filterLoja]);

  const getLojaClass = (lojaName: string) => {
    if (lojaName === "Ahú") return "badge-loja-ahu";
    if (lojaName === "Alto XV") return "badge-loja-alto-xv";
    return "badge-loja-todas";
  };

  const getCalendarTaskClass = (lojaName: string) => {
    if (lojaName === "Ahú") return "calendar-task-ahu";
    if (lojaName === "Alto XV") return "calendar-task-alto-xv";
    return "calendar-task-todas";
  };

  const currentRepeticaoSummary = computeRepeticaoText(
    tipoRepeticao,
    selectedDiasSemana,
    selectedDiaMes,
    repeticaoPersonalizada
  );

  // Calendar Helpers
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

    const days: { date: Date; isCurrentMonth: boolean; isToday: boolean }[] = [];
    const today = new Date();

    // Dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date: prevDate, isCurrentMonth: false, isToday: false });
    }

    // Dias do mês atual
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const cellDate = new Date(year, month, d);
      const isToday =
        today.getDate() === d &&
        today.getMonth() === month &&
        today.getFullYear() === year;
      days.push({ date: cellDate, isCurrentMonth: true, isToday });
    }

    // Completar o grid para fechar 35 ou 42 células
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false, isToday: false });
    }

    return days;
  }, [year, month]);

  // Função para checar se uma tarefa ocorre no dia selecionado
  const isTaskOnDate = (task: Tarefa, date: Date) => {
    const dayOfWeek = date.getDay(); // 0 = Dom, 1 = Seg, etc
    const dayOfMonth = date.getDate();

    if (task.tipo_repeticao === "diaria" || task.repeticao === "Todo dia") {
      return true;
    }

    if (task.tipo_repeticao === "dias_semana" && task.dias_semana) {
      return task.dias_semana.includes(dayOfWeek);
    }

    if (task.tipo_repeticao === "dia_mes" && task.dia_mes) {
      return task.dia_mes === dayOfMonth;
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

    // Caso seja texto personalizado que contem números ou nome do dia
    return false;
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

  return (
    <>
      <Helmet>
        <title>Tarefas Lojas</title>
      </Helmet>

      <div className="tarefas-container">
        {/* Header */}
        <div className="tarefas-header">
          <div className="tarefas-title-group">
            <h1>Tarefas Lojas</h1>
            <p>Cadastro e gerenciamento de tarefas recorrentes das lojas.</p>
          </div>
          <div>
            <button className="btn-secondary" onClick={fetchTarefas} title="Atualizar">
              <Icons.BsArrowClockwise className={loading ? "loading-spinner" : ""} />
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {/* Formulário de Cadastro de Tarefas */}
        <div className="card-section">
          <div className="card-section-title">
            <Icons.BsPlusCircle />
            <span>{editingId ? "Editar Tarefa" : "Cadastrar Nova Tarefa"}</span>
          </div>

          <form onSubmit={handleSubmit} className="task-form">
            <div className="form-grid-3">
              {/* Nome da Tarefa */}
              <div className="form-group">
                <label>Nome da Tarefa *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Limpeza das Máquinas, Contagem de Estoque..."
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>

              {/* Loja */}
              <div className="form-group">
                <label>Loja *</label>
                <select
                  className="form-select"
                  value={loja}
                  onChange={(e) => setLoja(e.target.value)}
                >
                  <option value="Todas">Todas as Lojas</option>
                  <option value="Ahú">Ahú</option>
                  <option value="Alto XV">Alto XV</option>
                </select>
              </div>

              {/* Tipo de Repetição */}
              <div className="form-group">
                <label>Data de Repetição *</label>
                <select
                  className="form-select"
                  value={tipoRepeticao}
                  onChange={(e) => setTipoRepeticao(e.target.value)}
                >
                  <option value="diaria">Todo dia (Diária)</option>
                  <option value="dias_semana">Dias da semana (ex: Toda Seg e Qui)</option>
                  <option value="dia_mes">Dia fixo do mês (ex: Todo dia 10)</option>
                  <option value="sem_repeticao">Sem repetição (Única)</option>
                  <option value="personalizada">Personalizada</option>
                </select>
              </div>
            </div>

            {/* Painel Inteligente de Repetição */}
            <div className="repetition-smart-box">
              {tipoRepeticao === "dias_semana" && (
                <div className="form-group">
                  <label>Selecione os dias da semana em que a tarefa deve ocorrer:</label>
                  <div className="weekdays-picker">
                    {DIAS_SEMANA_MAP.map((d) => {
                      const isActive = selectedDiasSemana.includes(d.id);
                      return (
                        <div
                          key={d.id}
                          className={`weekday-pill ${isActive ? "active" : ""}`}
                          onClick={() => toggleDiaSemana(d.id)}
                        >
                          {isActive ? <Icons.BsCheckLg size={12} /> : null}
                          {d.full}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {tipoRepeticao === "dia_mes" && (
                <div className="form-group" style={{ maxWidth: "300px" }}>
                  <label>Selecione o dia do mês (1 a 31):</label>
                  <select
                    className="form-select"
                    value={selectedDiaMes}
                    onChange={(e) => setSelectedDiaMes(Number(e.target.value))}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((dia) => (
                      <option key={dia} value={dia}>
                        Todo dia {dia}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {tipoRepeticao === "personalizada" && (
                <div className="form-group">
                  <label>Descreva a repetição:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: A cada 15 dias, Quinzenalmente, etc."
                    value={repeticaoPersonalizada}
                    onChange={(e) => setRepeticaoPersonalizada(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Preview da Repetição */}
              <div className="repetition-preview">
                <Icons.BsArrowRepeat size={16} />
                <span>Repetição definida: <strong>{currentRepeticaoSummary}</strong></span>
              </div>
            </div>

            {/* Descrição opcional */}
            <div className="form-group">
              <label>Descrição / Instruções da Tarefa (Opcional)</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Orientações ou observações para a equipe de loja..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              ></textarea>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              {editingId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancelar Edição
                </button>
              )}
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <Icons.BsHourglassSplit className="loading-spinner" /> Salvando...
                  </>
                ) : editingId ? (
                  <>
                    <Icons.BsPencil /> Atualizar Tarefa
                  </>
                ) : (
                  <>
                    <Icons.BsCheckLg /> Salvar Tarefa
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tabela de Tarefas Cadastradas */}
        <div className="card-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
            <div className="card-section-title" style={{ margin: 0, border: "none", padding: 0 }}>
              <Icons.BsListCheck />
              <span>Tarefas Cadastradas ({filteredTarefas.length})</span>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <select
                className="form-select"
                style={{ width: "auto", padding: "0.5rem 0.85rem", fontSize: "0.9rem" }}
                value={filterLoja}
                onChange={(e) => setFilterLoja(e.target.value)}
              >
                <option value="Todas">Todas as Lojas</option>
                <option value="Ahú">Ahú</option>
                <option value="Alto XV">Alto XV</option>
              </select>

              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: "0.5rem 0.85rem", fontSize: "0.9rem", width: "240px" }}
                  placeholder="Buscar tarefa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <Icons.BsArrowClockwise className="loading-spinner" size={32} />
              <p>Carregando tarefas...</p>
            </div>
          ) : filteredTarefas.length === 0 ? (
            <div className="empty-state">
              <Icons.BsClipboardX />
              <p>Nenhuma tarefa cadastrada com os filtros selecionados.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="tarefas-list-table">
                <thead>
                  <tr>
                    <th style={{ width: "25%" }}>Nome da Tarefa</th>
                    <th style={{ width: "15%" }}>Loja</th>
                    <th style={{ width: "25%" }}>Data de Repetição</th>
                    <th style={{ width: "25%" }}>Descrição / Instruções</th>
                    <th style={{ width: "10%", textAlign: "center" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTarefas.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <div className="task-title-cell">{task.titulo}</div>
                      </td>
                      <td>
                        <span className={`badge-loja ${getLojaClass(task.loja)}`}>
                          <Icons.BsShop size={13} /> {task.loja}
                        </span>
                      </td>
                      <td>
                        <span className="badge-repeticao">
                          <Icons.BsArrowRepeat size={14} /> {task.repeticao}
                        </span>
                      </td>
                      <td>
                        <span className="task-desc-cell">
                          {task.descricao || "-"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center" }}>
                          <button
                            className="icon-btn btn-edit"
                            onClick={() => handleEdit(task)}
                            title="Editar Tarefa"
                          >
                            <Icons.BsPencil size={15} />
                          </button>
                          <button
                            className="icon-btn btn-delete"
                            onClick={() => handleDelete(task.id)}
                            title="Excluir Tarefa"
                          >
                            <Icons.BsTrash size={15} />
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

        {/* Visualização em Calendário das Tarefas */}
        <div className="card-section">
          <div className="calendar-top-bar">
            <div className="calendar-month-title">
              <Icons.BsCalendar3 />
              <span>Calendário de Tarefas - {formattedMonthYear}</span>
            </div>

            <div className="calendar-nav-btns">
              <button className="btn-secondary" onClick={handlePrevMonth} title="Mês Anterior">
                <Icons.BsChevronLeft /> Anterior
              </button>
              <button className="btn-secondary" onClick={handleTodayMonth} title="Mês Atual">
                Hoje
              </button>
              <button className="btn-secondary" onClick={handleNextMonth} title="Próximo Mês">
                Próximo <Icons.BsChevronRight />
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            {/* Cabeçalho dos dias da semana */}
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dayName, idx) => (
              <div key={idx} className="calendar-day-header">
                {dayName}
              </div>
            ))}

            {/* Grid dos dias do mês */}
            {calendarDays.map((cell, cellIdx) => {
              const dayTasks = filteredTarefas.filter((t) => isTaskOnDate(t, cell.date));

              return (
                <div
                  key={cellIdx}
                  className={`calendar-day-cell ${!cell.isCurrentMonth ? "other-month" : ""} ${
                    cell.isToday ? "is-today" : ""
                  }`}
                >
                  <div className="calendar-day-number">
                    <span>{cell.date.getDate()}</span>
                    {cell.isToday && <span style={{ fontSize: "0.75rem", color: "var(--primary-color)", fontWeight: 700 }}>Hoje</span>}
                  </div>

                  <div className="calendar-tasks-wrapper">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`calendar-task-item ${getCalendarTaskClass(task.loja)}`}
                        onClick={() => handleEdit(task)}
                        title={`${task.titulo} (${task.loja}) - Clique para editar`}
                      >
                        <Icons.BsShop size={10} />
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {task.titulo}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default TarefasLojas;
