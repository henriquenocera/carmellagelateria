import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../supabase-client";
import { useAuth } from "../components/AuthProvider.tsx";
import "../css/Home.css";

interface Tarefa {
  id: number | string;
  titulo: string;
  loja: string;
  tipo_repeticao: string;
  repeticao: string;
  dias_semana?: number[];
  dia_mes?: number;
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

  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [loja, setLoja] = useState<string>("Todas");
  const [tipoRepeticao, setTipoRepeticao] = useState<string>("dias_semana");
  const [selectedDiasSemana, setSelectedDiasSemana] = useState<number[]>([1, 4]);
  const [selectedDiaMes, setSelectedDiaMes] = useState<number>(10);
  const [repeticaoPersonalizada, setRepeticaoPersonalizada] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");

  const [filterLoja, setFilterLoja] = useState<string>("Todas");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
        setUsingFallback(true);
        const stored = localStorage.getItem("carmella_tarefas_lojas");
        if (stored) {
          try { setTarefas(JSON.parse(stored)); } catch (e) { setTarefas(INITIAL_DEMO_TASKS); }
        } else {
          setTarefas(INITIAL_DEMO_TASKS);
          localStorage.setItem("carmella_tarefas_lojas", JSON.stringify(INITIAL_DEMO_TASKS));
        }
      } else {
        setUsingFallback(false);
        setTarefas(data || []);
      }
    } catch (err) {
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

  const computeRepeticaoText = (tipo: string, dias: number[], diaMes: number, custom: string): string => {
    if (tipo === "diaria") return "Todo dia";
    if (tipo === "sem_repeticao") return "Sem repetição";
    if (tipo === "personalizada") return custom.trim() || "Personalizada";
    if (tipo === "dia_mes") return `Todo dia ${diaMes}`;
    if (tipo === "dias_semana") {
      if (!dias || dias.length === 0) return "Dias da semana";
      if (dias.length === 7) return "Todo dia";
      const sorted = [...dias].sort((a, b) => a - b);
      const names = sorted.map((id) => DIAS_SEMANA_MAP.find((item) => item.id === id)?.full || "");
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
    if (!titulo.trim()) return;

    const repeticaoText = computeRepeticaoText(
      tipoRepeticao,
      selectedDiasSemana,
      selectedDiaMes,
      repeticaoPersonalizada
    );

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

    try {
      setSaving(true);
      if (!usingFallback) {
        if (editingId) {
          await supabase.from("tarefas_lojas").update(payload).eq("id", editingId);
        } else {
          await supabase.from("tarefas_lojas").insert([payload]);
        }
        await fetchTarefas();
      } else {
        if (editingId) {
          const updated = tarefas.map((t) => (t.id === editingId ? { ...t, ...payload } : t));
          saveToLocal(updated);
        } else {
          const newTask: Tarefa = { id: Date.now(), created_at: new Date().toISOString(), ...payload };
          saveToLocal([newTask, ...tarefas]);
        }
      }
      resetForm();
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!window.confirm("Excluir esta tarefa?")) return;
    const updated = tarefas.filter((t) => t.id !== id);
    setTarefas(updated);
    if (!usingFallback) {
      await supabase.from("tarefas_lojas").delete().eq("id", id);
    } else {
      saveToLocal(updated);
    }
  };

  const filteredTarefas = useMemo(() => {
    return tarefas.filter((t) => {
      const matchSearch =
        t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.descricao && t.descricao.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchLoja = filterLoja === "Todas" || t.loja === filterLoja;
      return matchSearch && matchLoja;
    });
  }, [tarefas, searchTerm, filterLoja]);

  return (
    <>
      <Helmet>
        <title>Tarefas Lojas - Carmella Gelateria</title>
      </Helmet>

      <div className="home" style={{ alignItems: "flex-start" }}>
        <div className="container">
          <div className="home-calendar-card">
            <div className="home-calendar-title-group" style={{ marginBottom: "1.5rem" }}>
              <h2>
                <Icons.BsCalendar3 color="var(--primary-color)" />
                Cadastro de Tarefas das Lojas
              </h2>
              <p>Cadastre e edite tarefas recorrentes para as unidades.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.95rem" }}>Nome da Tarefa *</label>
                  <input
                    type="text"
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "0.4rem" }}
                    placeholder="Ex: Limpeza de Máquinas..."
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.95rem" }}>Loja *</label>
                  <select
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "0.4rem" }}
                    value={loja}
                    onChange={(e) => setLoja(e.target.value)}
                  >
                    <option value="Todas">Todas as Lojas</option>
                    <option value="Ahú">Ahú</option>
                    <option value="Alto XV">Alto XV</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: 700, fontSize: "0.95rem" }}>Repetição *</label>
                  <select
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "0.4rem" }}
                    value={tipoRepeticao}
                    onChange={(e) => setTipoRepeticao(e.target.value)}
                  >
                    <option value="diaria">Todo dia (Diária)</option>
                    <option value="dias_semana">Dias da semana (ex: Seg e Qui)</option>
                    <option value="dia_mes">Dia fixo do mês (ex: Todo dia 10)</option>
                    <option value="sem_repeticao">Sem repetição</option>
                    <option value="personalizada">Personalizada</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontWeight: 700, fontSize: "0.95rem" }}>Descrição / Instruções (Opcional)</label>
                <textarea
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "0.4rem" }}
                  rows={2}
                  placeholder="Instruções para os funcionários..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                {editingId && (
                  <button type="button" className="btn-desfazer" onClick={resetForm}>
                    Cancelar Edição
                  </button>
                )}
                <button type="submit" className="btn-concluir" disabled={saving}>
                  {saving ? "Salvando..." : editingId ? "Atualizar Tarefa" : "Salvar Tarefa"}
                </button>
              </div>
            </form>

            <div style={{ marginTop: "2rem", borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
              <h3>Tarefas Cadastradas ({filteredTarefas.length})</h3>
              <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                      <th style={{ padding: "0.75rem" }}>Nome</th>
                      <th style={{ padding: "0.75rem" }}>Loja</th>
                      <th style={{ padding: "0.75rem" }}>Repetição</th>
                      <th style={{ padding: "0.75rem" }}>Descrição</th>
                      <th style={{ padding: "0.75rem", textAlign: "center" }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTarefas.map((task) => (
                      <tr key={task.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "0.75rem", fontWeight: 700 }}>{task.titulo}</td>
                        <td style={{ padding: "0.75rem" }}>{task.loja}</td>
                        <td style={{ padding: "0.75rem" }}>{task.repeticao}</td>
                        <td style={{ padding: "0.75rem", color: "#64748b" }}>{task.descricao || "-"}</td>
                        <td style={{ padding: "0.75rem", textAlign: "center" }}>
                          <button
                            style={{ background: "none", border: "none", cursor: "pointer", marginRight: "0.5rem" }}
                            onClick={() => {
                              setEditingId(task.id);
                              setTitulo(task.titulo);
                              setLoja(task.loja);
                              setTipoRepeticao(task.tipo_repeticao || "diaria");
                              setDescricao(task.descricao || "");
                            }}
                          >
                            <Icons.BsPencil color="#3b82f6" size={16} />
                          </button>
                          <button
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                            onClick={() => handleDelete(task.id)}
                          >
                            <Icons.BsTrash color="#ef4444" size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TarefasLojas;
