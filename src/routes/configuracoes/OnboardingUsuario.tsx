import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import "../../css/OnboardingUsuario.css";
import supabase from "../../services/supabase-client";
import { useAuth } from "../../AuthProvider";

interface Profile {
  id: string;
  name: string;
  email: string;
  cargo?: string | null;
  unidade_registrada?: string | null;
  data_registro?: string | null;
}

interface Category {
  id: number;
  name: string;
  type: 'checklist' | 'text';
  ordem: number;
}

interface Topic {
  id: number;
  category_id: number;
  title: string;
  ordem: number;
}


interface OnboardingStatus {
  id: string;
  status: 'pendente' | 'em_andamento' | 'concluido';
}

// No default categories or topics - dynamic management only

function OnboardingUsuario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [employee, setEmployee] = useState<Profile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [completions, setCompletions] = useState<Record<number, boolean>>({});
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null);

  // UI Management Mode States
  const [isEditingStructure, setIsEditingStructure] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
  const [editingTopicTitle, setEditingTopicTitle] = useState("");
  
  const [newTopicInputs, setNewTopicInputs] = useState<Record<number, string>>({});
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"salvo" | "salvando" | "erro">("salvo");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  const checkAccess = async () => {
    if (!user) return;
    try {
      const { data, error: accessError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (accessError) throw accessError;

      if (data && data.is_admin) {
        setIsAuthorized(true);
        if (id) {
          fetchInitialData();
        }
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error("Erro ao verificar acesso:", err);
      setIsAuthorized(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch employee profile details
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, email, cargo, unidade_registrada, data_registro")
        .eq("id", id)
        .single();

      if (profileError) throw profileError;
      setEmployee(profileData);

      // 2. Load structural categories, topics, and completions
      await loadOnboardingStructure();
    } catch (err: any) {
      console.error("Erro ao carregar dados:", err);
      setError("Falha ao carregar as informações do colaborador.");
    } finally {
      setLoading(false);
    }
  };

  const loadOnboardingStructure = async () => {
    try {
      // Test if table exists
      const { error: testError } = await supabase.from("onboarding_categories").select("id").limit(1);
      
      if (testError && (testError.code === "PGRST205" || testError.message?.includes("does not exist"))) {
        setIsSimulated(true);
        loadSimulatedData();
        return;
      }

      // Fetch Categories
      const { data: catData, error: catError } = await supabase
        .from("onboarding_categories")
        .select("*")
        .order("ordem", { ascending: true });

      if (catError) throw catError;

      // Fetch Topics
      const { data: topData, error: topError } = await supabase
        .from("onboarding_topics")
        .select("*")
        .order("ordem", { ascending: true });

      if (topError) throw topError;

      // If empty, let the UI handle empty state

      setCategories(catData);
      setTopics(topData || []);

      // Fetch completions for this user
      const { data: compData, error: compError } = await supabase
        .from("onboarding_completions")
        .select("topic_id, completed")
        .eq("profile_id", id);

      if (compError) throw compError;
      const compMap: Record<number, boolean> = {};
      compData?.forEach(c => {
        compMap[c.topic_id] = c.completed;
      });
      setCompletions(compMap);

      // Fetch general status and notes
      const { data: statusData, error: statusError } = await supabase
        .from("onboarding")
        .select("*")
        .eq("id", id)
        .single();

      if (statusError) {
        if (statusError.code === "PGRST116") {
          // Initialize status
          const defaultStatus: OnboardingStatus = {
            id: id || "",
            status: "pendente"
          };
          await supabase.from("onboarding").insert([defaultStatus]);
          setOnboardingStatus(defaultStatus);
        } else {
          throw statusError;
        }
      } else {
        setOnboardingStatus(statusData);
      }
    } catch (err) {
      console.warn("Erro ao ler estrutura. Ativando modo simulação:", err);
      setIsSimulated(true);
      loadSimulatedData();
    }
  };

  const loadSimulatedData = () => {
    // Categories
    let cats = localStorage.getItem("onboarding_categories_simulated");
    let tops = localStorage.getItem("onboarding_topics_simulated");
    if (!cats || !tops) {
      localStorage.setItem("onboarding_categories_simulated", JSON.stringify([]));
      localStorage.setItem("onboarding_topics_simulated", JSON.stringify([]));
      cats = JSON.stringify([]);
      tops = JSON.stringify([]);
    }
    setCategories(JSON.parse(cats));
    setTopics(JSON.parse(tops));

    // Completions
    const cachedComps = localStorage.getItem(`onboarding_completions_simulated_${id}`);
    if (cachedComps) {
      setCompletions(JSON.parse(cachedComps));
    } else {
      setCompletions({});
    }

    // Notes
    const cachedStatus = localStorage.getItem(`onboarding_status_simulated_${id}`);
    if (cachedStatus) {
      setOnboardingStatus(JSON.parse(cachedStatus));
    } else {
      const defaultState: OnboardingStatus = {
        id: id || "",
        status: "pendente"
      };
      localStorage.setItem(`onboarding_status_simulated_${id}`, JSON.stringify(defaultState));
      setOnboardingStatus(defaultState);
    }
  };



  const calculateStatusAndProgress = (tempCompletions: Record<number, boolean>, tempTopics: Topic[]) => {
    // Only topics that belong to a 'checklist' category count
    const checklistCategoryIds = new Set(categories.filter(c => c.type !== 'text').map(c => c.id));
    const checklistTopics = tempTopics.filter(t => checklistCategoryIds.has(t.category_id));

    const totalItems = checklistTopics.length;
    if (totalItems === 0) return { status: 'pendente' as const, percentage: 0 };
    
    const completedItems = checklistTopics.filter(t => tempCompletions[t.id] === true).length;
    
    let status: 'pendente' | 'em_andamento' | 'concluido' = 'em_andamento';
    if (completedItems === 0) {
      status = 'pendente';
    } else if (completedItems === totalItems) {
      status = 'concluido';
    }

    const percentage = Math.round((completedItems / totalItems) * 100);

    return { status, percentage };
  };

  // Toggle checklist task completion
  const handleToggleCompletion = async (topicId: number) => {
    const newCompletions = {
      ...completions,
      [topicId]: !completions[topicId]
    };
    setCompletions(newCompletions);
    setSaveStatus("salvando");

    const { status } = calculateStatusAndProgress(newCompletions, topics);

    try {
      if (isSimulated) {
        localStorage.setItem(`onboarding_completions_simulated_${id}`, JSON.stringify(newCompletions));
        
        const newStatus = {
          ...onboardingStatus!,
          status
        };
        setOnboardingStatus(newStatus);
        localStorage.setItem(`onboarding_status_simulated_${id}`, JSON.stringify(newStatus));
        setTimeout(() => setSaveStatus("salvo"), 300);
      } else {
        // Update completion
        const { error: compError } = await supabase
          .from("onboarding_completions")
          .upsert([{
            profile_id: id,
            topic_id: topicId,
            completed: newCompletions[topicId],
            updated_at: new Date().toISOString()
          }], { onConflict: "profile_id,topic_id" });

        if (compError) throw compError;

        // Update overall status
        const { error: statusError } = await supabase
          .from("onboarding")
          .update({
            status,
            updated_at: new Date().toISOString()
          })
          .eq("id", id);

        if (statusError) throw statusError;

        setOnboardingStatus(prev => prev ? { ...prev, status } : null);
        setSaveStatus("salvo");
      }
    } catch (err) {
      console.error("Erro ao salvar conclusão:", err);
      setSaveStatus("erro");
    }
  };

  // Add Category
  const handleAddCategory = async () => {
    const catName = prompt("Nome da nova categoria:");
    if (!catName || !catName.trim()) return;

    setSaveStatus("salvando");
    const nextOrdem = categories.length;

    try {
      if (isSimulated) {
        const newCat: Category = {
          id: Date.now(),
          name: catName.trim(),
          type: 'checklist',
          ordem: nextOrdem
        };
        const updatedCats = [...categories, newCat];
        setCategories(updatedCats);
        localStorage.setItem("onboarding_categories_simulated", JSON.stringify(updatedCats));
        setSaveStatus("salvo");
      } else {
        const { data, error: catErr } = await supabase
          .from("onboarding_categories")
          .insert([{ name: catName.trim(), type: 'checklist', ordem: nextOrdem }])
          .select()
          .single();

        if (catErr) throw catErr;

        setCategories([...categories, data]);
        setSaveStatus("salvo");
      }
    } catch (err) {
      console.error("Erro ao adicionar categoria:", err);
      setSaveStatus("erro");
    }
  };

  // Update Category
  const handleSaveCategoryName = async (catId: number) => {
    if (!editingCategoryName.trim()) return;
    setSaveStatus("salvando");

    try {
      if (isSimulated) {
        const updatedCats = categories.map(c => 
          c.id === catId ? { ...c, name: editingCategoryName.trim() } : c
        );
        setCategories(updatedCats);
        localStorage.setItem("onboarding_categories_simulated", JSON.stringify(updatedCats));
        setEditingCategoryId(null);
        setSaveStatus("salvo");
      } else {
        const { error: catErr } = await supabase
          .from("onboarding_categories")
          .update({ name: editingCategoryName.trim() })
          .eq("id", catId);

        if (catErr) throw catErr;

        setCategories(categories.map(c => 
          c.id === catId ? { ...c, name: editingCategoryName.trim() } : c
        ));
        setEditingCategoryId(null);
        setSaveStatus("salvo");
      }
    } catch (err) {
      console.error("Erro ao editar categoria:", err);
      setSaveStatus("erro");
    }
  };

  // Update Category Type (checklist vs text)
  const handleUpdateCategoryType = async (catId: number, type: 'checklist' | 'text') => {
    setSaveStatus("salvando");
    try {
      if (isSimulated) {
        const updatedCats = categories.map(c => 
          c.id === catId ? { ...c, type } : c
        );
        setCategories(updatedCats);
        localStorage.setItem("onboarding_categories_simulated", JSON.stringify(updatedCats));
        
        // Remove completions for topics in this category
        const newComps = { ...completions };
        const topicsToDeleteComps = topics.filter(t => t.category_id === catId);
        topicsToDeleteComps.forEach(t => {
          delete newComps[t.id];
        });
        setCompletions(newComps);
        localStorage.setItem(`onboarding_completions_simulated_${id}`, JSON.stringify(newComps));

        setSaveStatus("salvo");
      } else {
        const { error: catErr } = await supabase
          .from("onboarding_categories")
          .update({ type })
          .eq("id", catId);

        if (catErr) throw catErr;

        setCategories(categories.map(c => 
          c.id === catId ? { ...c, type } : c
        ));

        // Delete database completions for the topics of this category
        const topicIds = topics.filter(t => t.category_id === catId).map(t => t.id);
        if (topicIds.length > 0) {
          await supabase.from("onboarding_completions").delete().eq("profile_id", id).in("topic_id", topicIds);
          
          const newComps = { ...completions };
          topicIds.forEach(tid => {
            delete newComps[tid];
          });
          setCompletions(newComps);
        }

        setSaveStatus("salvo");
      }
    } catch (err) {
      console.error("Erro ao atualizar tipo de categoria:", err);
      setSaveStatus("erro");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catId: number) => {
    if (!window.confirm("Deseja realmente excluir esta categoria? Todos os tópicos vinculados serão removidos!")) return;
    setSaveStatus("salvando");

    try {
      if (isSimulated) {
        const updatedCats = categories.filter(c => c.id !== catId);
        const updatedTops = topics.filter(t => t.category_id !== catId);
        setCategories(updatedCats);
        setTopics(updatedTops);
        localStorage.setItem("onboarding_categories_simulated", JSON.stringify(updatedCats));
        localStorage.setItem("onboarding_topics_simulated", JSON.stringify(updatedTops));
        setSaveStatus("salvo");
      } else {
        const { error: catErr } = await supabase
          .from("onboarding_categories")
          .delete()
          .eq("id", catId);

        if (catErr) throw catErr;

        setCategories(categories.filter(c => c.id !== catId));
        setTopics(topics.filter(t => t.category_id !== catId));
        setSaveStatus("salvo");
      }
    } catch (err) {
      console.error("Erro ao deletar categoria:", err);
      setSaveStatus("erro");
    }
  };

  // Add Topic
  const handleAddTopic = async (categoryId: number) => {
    const topicTitle = newTopicInputs[categoryId];
    if (!topicTitle || !topicTitle.trim()) return;

    setSaveStatus("salvando");
    const nextOrdem = topics.filter(t => t.category_id === categoryId).length;

    try {
      if (isSimulated) {
        const newTop: Topic = {
          id: Date.now(),
          category_id: categoryId,
          title: topicTitle.trim(),
          ordem: nextOrdem
        };
        const updatedTops = [...topics, newTop];
        setTopics(updatedTops);
        localStorage.setItem("onboarding_topics_simulated", JSON.stringify(updatedTops));
        
        setNewTopicInputs({
          ...newTopicInputs,
          [categoryId]: ""
        });
        setSaveStatus("salvo");
      } else {
        const { data, error: topErr } = await supabase
          .from("onboarding_topics")
          .insert([{ category_id: categoryId, title: topicTitle.trim(), ordem: nextOrdem }])
          .select()
          .single();

        if (topErr) throw topErr;

        setTopics([...topics, data]);
        setNewTopicInputs({
          ...newTopicInputs,
          [categoryId]: ""
        });
        setSaveStatus("salvo");
      }
    } catch (err) {
      console.error("Erro ao adicionar tópico:", err);
      setSaveStatus("erro");
    }
  };

  // Save Topic Name
  const handleSaveTopicTitle = async (topicId: number) => {
    if (!editingTopicTitle.trim()) return;
    setSaveStatus("salvando");

    try {
      if (isSimulated) {
        const updatedTops = topics.map(t => 
          t.id === topicId ? { ...t, title: editingTopicTitle.trim() } : t
        );
        setTopics(updatedTops);
        localStorage.setItem("onboarding_topics_simulated", JSON.stringify(updatedTops));
        setEditingTopicId(null);
        setSaveStatus("salvo");
      } else {
        const { error: topErr } = await supabase
          .from("onboarding_topics")
          .update({ title: editingTopicTitle.trim() })
          .eq("id", topicId);

        if (topErr) throw topErr;

        setTopics(topics.map(t => 
          t.id === topicId ? { ...t, title: editingTopicTitle.trim() } : t
        ));
        setEditingTopicId(null);
        setSaveStatus("salvo");
      }
    } catch (err) {
      console.error("Erro ao editar tópico:", err);
      setSaveStatus("erro");
    }
  };

  // Delete Topic
  const handleDeleteTopic = async (topicId: number) => {
    if (!window.confirm("Deseja realmente remover este tópico?")) return;
    setSaveStatus("salvando");

    try {
      if (isSimulated) {
        const updatedTops = topics.filter(t => t.id !== topicId);
        setTopics(updatedTops);
        localStorage.setItem("onboarding_topics_simulated", JSON.stringify(updatedTops));
        
        // Remove completion key
        const newComps = { ...completions };
        delete newComps[topicId];
        setCompletions(newComps);
        localStorage.setItem(`onboarding_completions_simulated_${id}`, JSON.stringify(newComps));

        setSaveStatus("salvo");
      } else {
        const { error: topErr } = await supabase
          .from("onboarding_topics")
          .delete()
          .eq("id", topicId);

        if (topErr) throw topErr;

        setTopics(topics.filter(t => t.id !== topicId));
        setSaveStatus("salvo");
      }
    } catch (err) {
      console.error("Erro ao deletar tópico:", err);
      setSaveStatus("erro");
    }
  };

  const copySQLCode = () => {
    const sql = `-- 1. Categorias de Onboarding (dinâmicas)
CREATE TABLE IF NOT EXISTS public.onboarding_categories (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    ordem integer NOT NULL DEFAULT 0
);
-- 2. Tópicos/Tarefas de Onboarding
CREATE TABLE IF NOT EXISTS public.onboarding_topics (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    category_id bigint NOT NULL REFERENCES public.onboarding_categories(id) ON DELETE CASCADE,
    title text NOT NULL,
    ordem integer NOT NULL DEFAULT 0
);
-- 3. Registro de conclusão por colaborador
CREATE TABLE IF NOT EXISTS public.onboarding_completions (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id bigint NOT NULL REFERENCES public.onboarding_topics(id) ON DELETE CASCADE,
    completed boolean NOT NULL DEFAULT false,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (profile_id, topic_id)
);
-- 4. Status geral do onboarding por colaborador
CREATE TABLE IF NOT EXISTS public.onboarding (
    id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluido'))
);
ALTER TABLE public.onboarding_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir leitura de categorias para autenticados" ON public.onboarding_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir inserção de categorias para autenticados" ON public.onboarding_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Permitir atualização de categorias para autenticados" ON public.onboarding_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir exclusão de categorias para autenticados" ON public.onboarding_categories FOR DELETE TO authenticated USING (true);
CREATE POLICY "Permitir leitura de tópicos para autenticados" ON public.onboarding_topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir inserção de tópicos para autenticados" ON public.onboarding_topics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Permitir atualização de tópicos para autenticados" ON public.onboarding_topics FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir exclusão de tópicos para autenticados" ON public.onboarding_topics FOR DELETE TO authenticated USING (true);
CREATE POLICY "Permitir leitura de conclusões para autenticados" ON public.onboarding_completions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir inserção de conclusões para autenticados" ON public.onboarding_completions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Permitir atualização de conclusões para autenticados" ON public.onboarding_completions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir exclusão de conclusões para autenticados" ON public.onboarding_completions FOR DELETE TO authenticated USING (true);
CREATE POLICY "Permitir leitura de onboarding para autenticados" ON public.onboarding FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir inserção de onboarding para autenticados" ON public.onboarding FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Permitir atualização de onboarding para autenticados" ON public.onboarding FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir exclusão de onboarding para autenticados" ON public.onboarding FOR DELETE TO authenticated USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.onboarding_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.onboarding_topics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.onboarding_completions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.onboarding;`;

    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isAuthorized === null || (loading && categories.length === 0)) {
    return (
      <div className="onboarding-loading">
        <Icons.BsArrowClockwise className="spin icon-lg" style={{ fontSize: "2.5rem", color: "var(--primary-color)" }} />
        <p>Carregando onboarding...</p>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="onboarding-error">
        <Icons.BsShieldLock style={{ fontSize: "3.5rem", color: "#ef4444" }} />
        <h2>Acesso Negado</h2>
        <p>Você precisa de permissões de administrador para gerenciar o onboarding.</p>
        <button onClick={() => navigate("/configuracoes/cadastro-pessoas")} className="primary-btn">
          Voltar para Cadastro de Pessoas
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="onboarding-error">
        <Icons.BsExclamationTriangle style={{ fontSize: "3.5rem", color: "#ef4444" }} />
        <h2>Erro ao Carregar</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/configuracoes/cadastro-pessoas")} className="primary-btn">
          Voltar
        </button>
      </div>
    );
  }

  const { percentage } = calculateStatusAndProgress(completions, topics);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Helmet>
        <title>Onboarding - {employee?.name || "Colaborador"}</title>
      </Helmet>

      <div className="onboarding-container">
        <button className="onboarding-back-btn" onClick={() => navigate("/configuracoes/cadastro-pessoas")}>
          <Icons.BsArrowLeft />
          Voltar para Usuários e Pessoas
        </button>

        {isSimulated && (
          <div className="simulated-banner">
            <div className="simulated-banner-content">
              <Icons.BsInfoCircle style={{ fontSize: "1.5rem", flexShrink: 0 }} />
              <div className="simulated-banner-text">
                <strong>Modo Simulação Ativo (LocalStorage)</strong>
                As tabelas do onboarding dinâmico não foram detectadas no banco. Para produção, execute o script SQL atualizado no Supabase.
              </div>
            </div>
            <button className="copy-sql-btn" onClick={copySQLCode}>
              {copied ? <Icons.BsCheckLg /> : <Icons.BsClipboard />}
              {copied ? "Copiado!" : "Copiar SQL Completo"}
            </button>
          </div>
        )}

        <div className="onboarding-header">
          <div className="onboarding-profile-info">
            <div className="onboarding-user-details">
              <h1>Onboarding de Colaborador</h1>
              <p style={{ marginTop: "4px", fontSize: "15px", color: "var(--text-dark)", fontWeight: 600 }}>
                {employee?.name}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "2px" }}>
                {employee?.email} | Cargo: <strong>{employee?.cargo || "-"}</strong> | Unidade: <strong>{employee?.unidade_registrada || "-"}</strong>
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "2px" }}>
                Admissão: <strong>{formatDate(employee?.data_registro)}</strong>
              </p>
            </div>
            <div>
              <span className={`onboarding-badge ${onboardingStatus?.status || "pendente"}`}>
                {onboardingStatus?.status === "concluido" ? "Concluído" : onboardingStatus?.status === "em_andamento" ? "Em Andamento" : "Pendente"}
              </span>
            </div>
          </div>

          <div className="onboarding-progress-section">
            <div className="progress-header">
              <span>Progresso de Integração</span>
              <span>{percentage}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        </div>

        {/* Structure Control Bar */}
        <div className="onboarding-control-bar">
          <div className="manage-toggle-group">
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input 
                type="checkbox" 
                checked={isEditingStructure}
                onChange={(e) => {
                  setIsEditingStructure(e.target.checked);
                  // Clear edits on switch
                  setEditingCategoryId(null);
                  setEditingTopicId(null);
                }}
              />
              <Icons.BsGear style={{ fontSize: "16px" }} />
              Gerenciar Estrutura (Adicionar/Editar categorias e tópicos)
            </label>
          </div>

          {isEditingStructure && (
            <button className="add-category-btn" onClick={handleAddCategory}>
              <Icons.BsPlusLg />
              Nova Categoria
            </button>
          )}
        </div>

        <div className="onboarding-grid">
          {categories.map((category) => {
            const categoryTopics = topics.filter(t => t.category_id === category.id);
            return (
              <div key={category.id} className="onboarding-card">
                <h2>
                  {isEditingStructure ? (
                    <div className="category-header-group">
                      {editingCategoryId === category.id ? (
                        <input 
                          type="text"
                          className="category-title-edit"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveCategoryName(category.id);
                            if (e.key === "Escape") setEditingCategoryId(null);
                          }}
                          autoFocus
                        />
                      ) : (
                        <span>{category.name}</span>
                      )}
                      
                      <div className="category-actions">
                        <select
                          value={category.type || 'checklist'}
                          onChange={(e) => handleUpdateCategoryType(category.id, e.target.value as 'checklist' | 'text')}
                          style={{
                            fontSize: "11px",
                            padding: "2px 4px",
                            borderRadius: "6px",
                            border: "1px solid var(--border-color)",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            fontWeight: "bold",
                            marginRight: "6px"
                          }}
                        >
                          <option value="checklist">Checklist</option>
                          <option value="text">Texto</option>
                        </select>

                        {editingCategoryId === category.id ? (
                          <button 
                            className="category-action-btn save"
                            title="Salvar Nome"
                            onClick={() => handleSaveCategoryName(category.id)}
                          >
                            <Icons.BsCheckLg />
                          </button>
                        ) : (
                          <button 
                            className="category-action-btn edit"
                            title="Editar Categoria"
                            onClick={() => {
                              setEditingCategoryId(category.id);
                              setEditingCategoryName(category.name);
                            }}
                          >
                            <Icons.BsPencil />
                          </button>
                        )}
                        <button 
                          className="category-action-btn delete"
                          title="Remover Categoria"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Icons.BsTrash />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Icons.BsFileEarmarkText />
                      {category.name}
                    </>
                  )}
                </h2>

                <div className="checklist-list">
                  {categoryTopics.map(topic => (
                    <div 
                      key={topic.id} 
                      className={`checklist-item ${completions[topic.id] ? "completed" : ""} ${category.type === 'text' ? "text-block" : ""}`}
                      onClick={() => !isEditingStructure && category.type !== 'text' && handleToggleCompletion(topic.id)}
                      style={category.type === 'text' ? { cursor: "default" } : {}}
                    >
                      {isEditingStructure ? (
                        <div className="topic-item-row" onClick={(e) => e.stopPropagation()}>
                          {editingTopicId === topic.id ? (
                            <input 
                              type="text"
                              className="topic-title-edit"
                              value={editingTopicTitle}
                              onChange={(e) => setEditingTopicTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveTopicTitle(topic.id);
                                if (e.key === "Escape") setEditingTopicId(null);
                              }}
                              autoFocus
                            />
                          ) : (
                            <span>{topic.title}</span>
                          )}

                          <div className="topic-edit-controls">
                            {editingTopicId === topic.id ? (
                              <button 
                                className="topic-action-btn save"
                                title="Salvar"
                                onClick={() => handleSaveTopicTitle(topic.id)}
                              >
                                <Icons.BsCheckLg />
                              </button>
                            ) : (
                              <button 
                                className="topic-action-btn edit"
                                title="Editar Tópico"
                                onClick={() => {
                                  setEditingTopicId(topic.id);
                                  setEditingTopicTitle(topic.title);
                                }}
                              >
                                <Icons.BsPencil />
                              </button>
                            )}
                            <button 
                              className="topic-action-btn delete"
                              title="Remover Tópico"
                              onClick={() => handleDeleteTopic(topic.id)}
                            >
                              <Icons.BsTrash />
                            </button>
                          </div>
                        </div>
                      ) : (
                        category.type === 'text' ? (
                          <div className="topic-item-left" style={{ cursor: "default" }}>
                            <p style={{ margin: 0, padding: "4px 8px", color: "var(--text-dark)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                              {topic.title}
                            </p>
                          </div>
                        ) : (
                          <div className="topic-item-left">
                            <input 
                              type="checkbox" 
                              checked={completions[topic.id] || false}
                              onChange={() => {}} // Controlled click via parent row
                              style={{ pointerEvents: "none" }}
                            />
                            <span style={{ marginLeft: "8px" }}>{topic.title}</span>
                          </div>
                        )
                      )}
                    </div>
                  ))}

                  {isEditingStructure && (
                    <div className="add-topic-inline" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="text"
                        placeholder={category.type === 'text' ? "+ Novo Bloco de Texto" : "+ Novo Tópico"}
                        className="add-topic-input"
                        value={newTopicInputs[category.id] || ""}
                        onChange={(e) => setNewTopicInputs({
                          ...newTopicInputs,
                          [category.id]: e.target.value
                        })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddTopic(category.id);
                        }}
                      />
                      <button 
                        className="add-topic-inline-btn"
                        onClick={() => handleAddTopic(category.id)}
                      >
                        <Icons.BsPlusLg />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {categories.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--text-muted)", background: "var(--card-bg)", borderRadius: "16px", border: "1px dashed var(--border-color)" }}>
              Nenhuma categoria criada. Clique em "Gerenciar Estrutura" e crie sua primeira categoria!
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px 0 40px 0" }}>
          <div className="autosave-status">
            {saveStatus === "salvando" ? (
              <>
                <Icons.BsArrowClockwise className="spin" />
                Salvando alterações...
              </>
            ) : saveStatus === "erro" ? (
              <>
                <Icons.BsExclamationTriangle style={{ color: "#ef4444" }} />
                Erro ao salvar alterações
              </>
            ) : (
              <>
                <Icons.BsCheckCircle />
                Alterações salvas
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default OnboardingUsuario;
