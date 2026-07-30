import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import "../css/Onboarding.css";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth/AuthContext";

// Fallback initial categories and tasks if DB tables don't exist yet
const DEFAULT_CATEGORIES = [
  {
    id: 1,
    name: "1. Boas-Vindas & Cultura Carmella",
    type: "checklist",
    ordem: 0,
  },
  {
    id: 2,
    name: "2. Documentação & Cadastro no RH",
    type: "checklist",
    ordem: 1,
  },
  {
    id: 3,
    name: "3. Sistemas, PDV & Equipamentos",
    type: "checklist",
    ordem: 2,
  },
  {
    id: 4,
    name: "4. Treinamento de Produtos & Gelatos",
    type: "checklist",
    ordem: 3,
  },
  {
    id: 5,
    name: "5. Padrões de Qualidade & Higiene",
    type: "checklist",
    ordem: 4,
  },
  {
    id: 6,
    name: "Instruções Gerais de Atendimento",
    type: "text",
    ordem: 5,
  },
];

const DEFAULT_TOPICS = [
  // Categoria 1
  { id: 101, category_id: 1, title: "Apresentação da equipe e tour pela loja", ordem: 0 },
  { id: 102, category_id: 1, title: "Leitura do Regulamento Interno da empresa", ordem: 1 },
  { id: 103, category_id: 1, title: "Apresentação dos valores e padrão de atendimento Carmella", ordem: 2 },
  
  // Categoria 2
  { id: 201, category_id: 2, title: "Entrega de cópia dos documentos pessoais ao RH", ordem: 0 },
  { id: 202, category_id: 2, title: "Assinatura do contrato de trabalho e ficha de registro", ordem: 1 },
  { id: 203, category_id: 2, title: "Cadastro da biometria / registro de ponto", ordem: 2 },

  // Categoria 3
  { id: 301, category_id: 3, title: "Treinamento básico de uso do sistema PDV e caixa", ordem: 0 },
  { id: 302, category_id: 3, title: "Operação da máquina de café espresso e moedor", ordem: 1 },
  { id: 303, category_id: 3, title: "Procedimentos de abertura e fechamento da vitrine de gelatos", ordem: 2 },

  // Categoria 4
  { id: 401, category_id: 4, title: "Degustação técnica e memorização dos sabores de gelato", ordem: 0 },
  { id: 402, category_id: 4, title: "Treinamento de montagem de waffles, brownies e sobremesas", ordem: 1 },
  { id: 403, category_id: 4, title: "Padrão de porcionamento e peso das casquinhas/copos", ordem: 2 },

  // Categoria 5
  { id: 501, category_id: 5, title: "Treinamento de higienização de mãos e uso de uniformes", ordem: 0 },
  { id: 502, category_id: 5, title: "Higienização de utensílios, cubas e mesas", ordem: 1 },
  { id: 503, category_id: 5, title: "Conferência de temperatura das geladeiras e vitrine (-12°C a -15°C)", ordem: 2 },

  // Categoria 6 (Texto)
  { id: 601, category_id: 6, title: "Sempre receba nossos clientes com um sorriso, ofereça amostras de gelatos com cortesia e mantenha a bancada limpa e organizada em todos os momentos.", ordem: 0 },
];

function Onboarding() {
  const { user } = useAuth();

  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [completions, setCompletions] = useState({});

  const [filterStatus, setFilterStatus] = useState("todos"); // todos | pendentes | concluidos
  const [searchQuery, setSearchQuery] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("salvo"); // salvo | salvando | erro

  // Load logged-in user profile
  const fetchUserProfile = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, cargo, data_registro")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setCurrentUserProfile(data);
      } else {
        const fallback = {
          id: user.id || "current-user",
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuário Logado",
          email: user.email || "usuario@carmellagelateria.com.br",
          cargo: "Colaborador",
          data_registro: new Date().toISOString().split("T")[0],
        };
        setCurrentUserProfile(fallback);
      }
    } catch (err) {
      const fallback = {
        id: user?.id || "current-user",
        name: user?.email?.split("@")[0] || "Usuário Logado",
        email: user?.email || "usuario@carmellagelateria.com.br",
        cargo: "Colaborador",
      };
      setCurrentUserProfile(fallback);
    }
  }, [user]);

  // Load onboarding structure and user completions
  const loadUserTasks = useCallback(async (profileId) => {
    if (!profileId) return;
    setLoading(true);

    try {
      // 1. Fetch categories
      let catData = [];
      const { data: dbCats, error: catError } = await supabase
        .from("onboarding_categories")
        .select("*")
        .order("ordem", { ascending: true });

      if (!catError && dbCats && dbCats.length > 0) {
        catData = dbCats;
      } else {
        catData = DEFAULT_CATEGORIES;
      }

      // 2. Fetch topics
      let topData = [];
      const { data: dbTops, error: topError } = await supabase
        .from("onboarding_topics")
        .select("*")
        .order("ordem", { ascending: true });

      if (!topError && dbTops && dbTops.length > 0) {
        topData = dbTops;
      } else {
        topData = DEFAULT_TOPICS;
      }

      setCategories(catData);
      setTopics(topData);

      // 3. Fetch completions for selected user
      let compMap = {};
      const { data: dbComps, error: compError } = await supabase
        .from("onboarding_completions")
        .select("topic_id, completed")
        .eq("profile_id", profileId);

      if (!compError && dbComps) {
        dbComps.forEach((c) => {
          compMap[c.topic_id] = c.completed;
        });
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem(`onboarding_completions_${profileId}`);
        if (stored) {
          try {
            compMap = JSON.parse(stored);
          } catch (e) {}
        }
      }

      setCompletions(compMap);
    } catch (err) {
      console.warn("Usando estrutura local para onboarding:", err);
      setCategories(DEFAULT_CATEGORIES);
      setTopics(DEFAULT_TOPICS);
      
      const stored = localStorage.getItem(`onboarding_completions_${profileId}`);
      if (stored) {
        try {
          setCompletions(JSON.parse(stored));
        } catch (e) {
          setCompletions({});
        }
      } else {
        setCompletions({});
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    const targetId = user?.id || "current-user";
    loadUserTasks(targetId);
  }, [user, loadUserTasks]);

  // Logged-in User Object
  const selectedUser = useMemo(() => {
    return currentUserProfile || {
      id: user?.id || "current-user",
      name: user?.email?.split("@")[0] || "Colaborador",
      email: user?.email || "colaborador@carmellagelateria.com.br",
      cargo: "Colaborador",
    };
  }, [currentUserProfile, user]);

  // Calculate Progress & Statistics
  const stats = useMemo(() => {
    const checklistCatIds = new Set(
      categories.filter((c) => c.type !== "text").map((c) => c.id)
    );
    const checklistTopics = topics.filter((t) => checklistCatIds.has(t.category_id));
    
    const total = checklistTopics.length;
    const completedCount = checklistTopics.filter((t) => completions[t.id] === true).length;
    const pendingCount = total - completedCount;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    let status = "pendente";
    if (completedCount === total && total > 0) {
      status = "concluido";
    } else if (completedCount > 0) {
      status = "em_andamento";
    }

    return { total, completedCount, pendingCount, percentage, status };
  }, [categories, topics, completions]);

  // Toggle Completion Handler
  const handleToggleCompletion = async (topicId) => {
    const targetUserId = selectedUser.id;
    if (!targetUserId) return;

    const newCompletions = {
      ...completions,
      [topicId]: !completions[topicId],
    };

    setCompletions(newCompletions);
    setSaveStatus("salvando");

    // Local Storage backup
    localStorage.setItem(
      `onboarding_completions_${targetUserId}`,
      JSON.stringify(newCompletions)
    );

    try {
      const { error } = await supabase.from("onboarding_completions").upsert(
        [
          {
            profile_id: targetUserId,
            topic_id: topicId,
            completed: newCompletions[topicId],
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "profile_id,topic_id" }
      );

      if (error && error.code !== "PGRST205") {
        console.warn("Aviso ao salvar no Supabase:", error);
      }
      setSaveStatus("salvo");
    } catch (err) {
      console.warn("Salvo localmente (LocalStorage active):", err);
      setSaveStatus("salvo");
    }
  };

  // Filter topics by search & status
  const filterTopic = (topic, isTextCategory) => {
    if (isTextCategory) return true;
    
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    const isCompleted = !!completions[topic.id];
    if (filterStatus === "pendentes" && isCompleted) return false;
    if (filterStatus === "concluidos" && !isCompleted) return false;

    return true;
  };

  return (
    <>
      <Helmet>
        <title>Tarefas de Onboarding - Carmella Gelateria</title>
      </Helmet>

      <div className="onboarding-page-container">
        {/* User Card & Progress Overview */}
        <div className="user-overview-card">
          <div className="user-details-section">
            <div className="user-avatar">
              {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="user-info">
              <span className="welcome-subtitle">
                Bem-vindo(a) {selectedUser.name} ao seu onboarding da Carmella Gelateria
              </span>
              <h2>{selectedUser.name}</h2>
              <p className="user-meta">
                <span><Icons.BsEnvelope /> {selectedUser.email}</span>
                {selectedUser.cargo && (
                  <span> • <Icons.BsBriefcase /> {selectedUser.cargo}</span>
                )}
                {selectedUser.data_registro && (
                  <span> • <Icons.BsCalendar3 /> Admissão: {selectedUser.data_registro}</span>
                )}
              </p>
            </div>
            <div className="status-badge-container">
              <span className={`status-badge ${stats.status}`}>
                {stats.status === "concluido"
                  ? "Concluído"
                  : stats.status === "em_andamento"
                  ? "Em Andamento"
                  : "Pendente"}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar-wrapper">
            <div className="progress-bar-label">
              <span>Progresso de Integração</span>
              <span>{stats.percentage}% Concluído</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="task-filter-bar">
          <div className="search-input-box">
            <Icons.BsSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar tarefa por palavra-chave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                ✕
              </button>
            )}
          </div>

          <div className="filter-buttons-group">
            <button
              className={`filter-btn ${filterStatus === "todos" ? "active" : ""}`}
              onClick={() => setFilterStatus("todos")}
            >
              Todas ({stats.total})
            </button>
            <button
              className={`filter-btn ${filterStatus === "pendentes" ? "active" : ""}`}
              onClick={() => setFilterStatus("pendentes")}
            >
              Pendentes ({stats.pendingCount})
            </button>
            <button
              className={`filter-btn ${filterStatus === "concluidos" ? "active" : ""}`}
              onClick={() => setFilterStatus("concluidos")}
            >
              Concluídas ({stats.completedCount})
            </button>
          </div>
        </div>

        {/* Categories and Task Lists */}
        {loading ? (
          <div className="onboarding-loading-box">
            <Icons.BsArrowClockwise className="spin-icon" />
            <p>Carregando tarefas do colaborador...</p>
          </div>
        ) : (
          <div className="categories-list-container">
            {categories.map((category) => {
              const categoryTopics = topics
                .filter((t) => t.category_id === category.id)
                .filter((t) => filterTopic(t, category.type === "text"));

              if (categoryTopics.length === 0 && searchQuery) {
                return null;
              }

              const catChecklistTopics = topics.filter(
                (t) => t.category_id === category.id
              );
              const catCompletedCount = catChecklistTopics.filter(
                (t) => completions[t.id] === true
              ).length;

              return (
                <div key={category.id} className="category-task-card">
                  <div className="category-header">
                    <div className="category-title">
                      {category.type === "text" ? (
                        <Icons.BsFileEarmarkText className="cat-icon text-icon" />
                      ) : (
                        <Icons.BsJournalBookmark className="cat-icon" />
                      )}
                      <h3>{category.name}</h3>
                    </div>
                    {category.type !== "text" && (
                      <span className="category-count-badge">
                        {catCompletedCount} / {catChecklistTopics.length} concluídos
                      </span>
                    )}
                  </div>

                  <div className="topics-list">
                    {categoryTopics.map((topic) => {
                      const isDone = !!completions[topic.id];

                      if (category.type === "text") {
                        return (
                          <div key={topic.id} className="text-topic-item">
                            <p>{topic.title}</p>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={topic.id}
                          className={`task-row-item ${isDone ? "completed" : ""}`}
                          onClick={() => handleToggleCompletion(topic.id)}
                        >
                          <div className="checkbox-custom">
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}} // Click handled by row
                            />
                            <span className="checkmark">
                              {isDone && <Icons.BsCheckLg />}
                            </span>
                          </div>
                          <span className="task-title">{topic.title}</span>
                        </div>
                      );
                    })}

                    {categoryTopics.length === 0 && category.type !== "text" && (
                      <div className="no-tasks-placeholder">
                        Nenhuma tarefa nesta categoria para o filtro selecionado.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Save Status Footer Indicator */}
        <div className="save-status-footer">
          {saveStatus === "salvando" ? (
            <>
              <Icons.BsArrowClockwise className="spin-icon" />
              Salvando progresso...
            </>
          ) : (
            <>
              <Icons.BsCheckCircle style={{ color: "#10b981" }} />
              Todas as alterações foram salvas
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Onboarding;
