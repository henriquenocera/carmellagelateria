import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "react-router-dom";
import * as Icons from "react-icons/bs";
import "../css/CadastroPessoas.css";
import supabase from "../supabase-client";
import { createClient } from "@supabase/supabase-js";

import { useAuth } from "../AuthProvider";

// Instância secundária para não sobrescrever a sessão atual ao criar um novo usuário
const supabaseAdmin = createClient(
  process.env.REACT_APP_SUPABASE_URL as string,
  process.env.REACT_APP_SUPABASE_KEY as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const WEEKDAYS = [
  { value: "1", label: "Seg" },
  { value: "2", label: "Ter" },
  { value: "3", label: "Qua" },
  { value: "4", label: "Qui" },
  { value: "5", label: "Sex" },
  { value: "6", label: "Sáb" },
  { value: "0", label: "Dom" }
];

interface Profile {
  id: string;
  short_id: string | null;
  name: string;
  email: string;
  updated_at: string;
  is_admin: boolean | null;
  controlar_frequencia?: boolean | null;
  folgas_fixas?: string | null;
  ativo?: boolean | null;
  data_registro?: string | null;
  passagens_urbs?: number | null;
  passagens_metrocard?: number | null;
  data_demissao?: string | null;
  cpf?: string | null;
  rg?: string | null;
  cargo?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  sexo?: string | null;
  data_nascimento?: string | null;
  cidade_nascimento?: string | null;
  estado_civil?: string | null;
  dependentes?: number | null;
  ctps?: string | null;
  unidade_registrada?: string | null;
}

function CadastroPessoas() {
  const { user } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pessoais" | "contratuais">("pessoais");
  const [saving, setSaving] = useState(false);
  
  const initialFormData = {
    id: "", name: "", email: "", short_id: "", is_admin: false, controlar_frequencia: true, folgas_fixas: "", ativo: true, data_registro: "", passagens_urbs: 0, passagens_metrocard: 0,
    data_demissao: "", cpf: "", rg: "", cargo: "", telefone: "", endereco: "", sexo: "", data_nascimento: "", cidade_nascimento: "", estado_civil: "", dependentes: 0, ctps: "", unidade_registrada: ""
  };
  const [formData, setFormData] = useState(initialFormData);
  const [createLogin, setCreateLogin] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  // Estados para o modal de alterar senha
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordUserId, setPasswordUserId] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");

  const handleWeekdayToggle = (dayVal: string) => {
    let currentDays = formData.folgas_fixas ? formData.folgas_fixas.split(",") : [];
    if (currentDays.includes(dayVal)) {
      currentDays = currentDays.filter((d) => d !== dayVal);
    } else {
      currentDays.push(dayVal);
    }
    setFormData({ ...formData, folgas_fixas: currentDays.join(",") });
  };

  useEffect(() => {
    checkAccess();
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get("edit");
    if (editId && profiles.length > 0) {
      const profileToEdit = profiles.find(p => p.id === editId);
      if (profileToEdit && !isModalOpen) {
        openModal(profileToEdit);
        window.history.replaceState(null, "", "/cadastro-pessoas");
      }
    }
  }, [location.search, profiles]);

  async function checkAccess() {
    if (!user) return;
    try {
      const { data, error } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
      if (error) throw error;

      if (data && data.is_admin) {
        setIsAuthorized(true);
        fetchProfiles();
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error("Erro ao verificar acesso:", err);
      setIsAuthorized(false);
    }
  }

  async function fetchProfiles() {
    try {
      setLoading(true);
      setError(null);
      const { data, error: dbError } = await supabase
        .from("profiles")
        .select("*")
        .order("name", { ascending: true });

      if (dbError) throw dbError;

      const sorted = (data || []).sort((a, b) => {
        const aActive = a.ativo !== false;
        const bActive = b.ativo !== false;
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;

        const aAdmin = a.is_admin === true;
        const bAdmin = b.is_admin === true;
        if (aAdmin && !bAdmin) return -1;
        if (!aAdmin && bAdmin) return 1;

        return (a.name || "").localeCompare(b.name || "");
      });

      setProfiles(sorted);
    } catch (err: any) {
      console.error("Erro ao buscar perfis:", err);
      setError("Falha ao carregar a lista de pessoas.");
    } finally {
      setLoading(false);
    }
  }

  const openModal = (profile?: Profile) => {
    if (profile) {
      setFormData({
        id: profile.id,
        name: profile.name || "",
        email: profile.email || "",
        short_id: profile.short_id || "",
        is_admin: profile.is_admin || false,
        controlar_frequencia: profile.controlar_frequencia !== false,
        folgas_fixas: profile.folgas_fixas || "",
        ativo: profile.ativo !== false,
        data_registro: profile.data_registro || "",
        passagens_urbs: profile.passagens_urbs ?? 0,
        passagens_metrocard: profile.passagens_metrocard ?? 0,
        data_demissao: profile.data_demissao || "",
        cpf: profile.cpf || "",
        rg: profile.rg || "",
        cargo: profile.cargo || "",
        telefone: profile.telefone || "",
        endereco: profile.endereco || "",
        sexo: profile.sexo || "",
        data_nascimento: profile.data_nascimento || "",
        cidade_nascimento: profile.cidade_nascimento || "",
        estado_civil: profile.estado_civil || "",
        dependentes: profile.dependentes ?? 0,
        ctps: profile.ctps || "",
        unidade_registrada: profile.unidade_registrada || ""
      });
      setCreateLogin(false);
    } else {
      setFormData(initialFormData);
      setCreateLogin(true); // Default to true for new users
    }
    setActiveTab("pessoais");
    setGeneratedPassword(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormData);
    setCreateLogin(false);
    setGeneratedPassword(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Preencha nome e e-mail.");
      return;
    }

    try {
      setSaving(true);
      if (formData.id) {
        // Update
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            name: formData.name,
            email: formData.email,
            short_id: formData.short_id,
            is_admin: formData.is_admin,
            controlar_frequencia: formData.controlar_frequencia,
            folgas_fixas: formData.folgas_fixas,
            ativo: formData.ativo,
            data_registro: formData.data_registro || null,
            passagens_urbs: formData.passagens_urbs,
            passagens_metrocard: formData.passagens_metrocard,
            data_demissao: formData.data_demissao || null,
            cpf: formData.cpf || null,
            rg: formData.rg || null,
            cargo: formData.cargo || null,
            telefone: formData.telefone || null,
            endereco: formData.endereco || null,
            sexo: formData.sexo || null,
            data_nascimento: formData.data_nascimento || null,
            cidade_nascimento: formData.cidade_nascimento || null,
            estado_civil: formData.estado_civil || null,
            dependentes: formData.dependentes || 0,
            ctps: formData.ctps || null,
            unidade_registrada: formData.unidade_registrada || null,
            updated_at: new Date().toISOString()
          })
          .eq("id", formData.id);
        if (updateError) throw updateError;
        closeModal();
      } else {
        // Create
        if (createLogin) {
          // Generate a random 8-character password
          const newPassword = Math.random().toString(36).slice(-8);

          // Sign up using secondary client so we don't log out the admin
          const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
            email: formData.email,
            password: newPassword,
            options: {
              data: { full_name: formData.name } // Many apps use full_name in user_metadata
            }
          });

          if (authError) {
            if (authError.message.includes("already registered")) {
              throw new Error("Este e-mail já possui um login cadastrado no banco de dados.");
            }
            throw authError;
          }

          // Depending on DB triggers, the profile might be auto-created.
          // To be safe and ensure the profile table matches what the user entered:
          const userId = authData?.user?.id;
          if (userId) {
            const { error: upsertError } = await supabase
              .from("profiles")
              .upsert([{
                id: userId,
                name: formData.name,
                email: formData.email,
                short_id: formData.short_id,
                is_admin: formData.is_admin,
                controlar_frequencia: formData.controlar_frequencia,
                folgas_fixas: formData.folgas_fixas,
                ativo: formData.ativo,
                data_registro: formData.data_registro || null,
                passagens_urbs: formData.passagens_urbs,
                passagens_metrocard: formData.passagens_metrocard,
                data_demissao: formData.data_demissao || null,
                cpf: formData.cpf || null,
                rg: formData.rg || null,
                cargo: formData.cargo || null,
                telefone: formData.telefone || null,
                endereco: formData.endereco || null,
                sexo: formData.sexo || null,
                data_nascimento: formData.data_nascimento || null,
                cidade_nascimento: formData.cidade_nascimento || null,
                estado_civil: formData.estado_civil || null,
                dependentes: formData.dependentes || 0,
                ctps: formData.ctps || null,
                unidade_registrada: formData.unidade_registrada || null,
                updated_at: new Date().toISOString()
              }], { onConflict: 'id' });

            if (upsertError) console.error("Erro ao fazer upsert no profile:", upsertError);
          }

          setGeneratedPassword(newPassword);
        } else {
          // Just insert into profiles without creating a login
          const newId = crypto.randomUUID();
          const { error: insertError } = await supabase
            .from("profiles")
            .insert([{
              id: newId,
              name: formData.name,
              email: formData.email,
              short_id: formData.short_id,
              is_admin: formData.is_admin,
              controlar_frequencia: formData.controlar_frequencia,
              folgas_fixas: formData.folgas_fixas,
              ativo: formData.ativo,
              data_registro: formData.data_registro || null,
              passagens_urbs: formData.passagens_urbs,
              passagens_metrocard: formData.passagens_metrocard,
              data_demissao: formData.data_demissao || null,
              cpf: formData.cpf || null,
              rg: formData.rg || null,
              cargo: formData.cargo || null,
              telefone: formData.telefone || null,
              endereco: formData.endereco || null,
              sexo: formData.sexo || null,
              data_nascimento: formData.data_nascimento || null,
              cidade_nascimento: formData.cidade_nascimento || null,
              estado_civil: formData.estado_civil || null,
              dependentes: formData.dependentes || 0,
              ctps: formData.ctps || null,
              unidade_registrada: formData.unidade_registrada || null,
              updated_at: new Date().toISOString()
            }]);
          if (insertError) throw insertError;
          closeModal();
        }
      }

      fetchProfiles();
    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err);
      alert(`Erro ao salvar: ${err.message || "Verifique se as permissões do banco permitem esta ação."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja remover ${name}?`)) return;

    try {
      const { error: deleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);
      if (deleteError) throw deleteError;

      fetchProfiles();
    } catch (err: any) {
      console.error("Erro ao deletar perfil:", err);
      alert("Erro ao deletar. Verifique se as permissões permitem esta ação.");
    }
  };

  const openPasswordModal = (id: string) => {
    setPasswordUserId(id);
    setNewPasswordInput("");
    setIsPasswordModalOpen(true);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput || !passwordUserId) return;

    try {
      setSaving(true);
      const { error } = await supabase.rpc("update_user_password", {
        target_user_id: passwordUserId,
        new_password: newPasswordInput,
      });

      if (error) throw error;

      alert("Senha alterada com sucesso!");
      setIsPasswordModalOpen(false);
      setPasswordUserId(null);
    } catch (err: any) {
      console.error("Erro ao alterar senha:", err);
      alert("Erro ao alterar senha. Verifique se a função SQL (update_user_password) foi criada no Supabase.");
    } finally {
      setSaving(false);
    }
  };

  if (isAuthorized === null) {
    return (
      <div className="cadastro-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <Icons.BsArrowClockwise className="spin icon-lg" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="cadastro-container">
        <div className="error-state">
          <Icons.BsShieldLock style={{ fontSize: "3rem", color: "#ef4444", marginBottom: "16px" }} />
          <h2 style={{ color: "var(--secondary-color)", marginBottom: "8px" }}>Acesso Negado</h2>
          <p>Somente administradores podem acessar a página de Cadastro de Pessoas.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cadastro de Pessoas</title>
      </Helmet>

      <div className="cadastro-container">
        <div className="cadastro-header">
          <div className="cadastro-title-group">
            <h1>Usuários e Pessoas</h1>
            <p>Gerencie as pessoas cadastradas na plataforma.</p>
          </div>
          <button onClick={() => openModal()} className="primary-btn">
            <Icons.BsPlusLg />
            Novo Usuário
          </button>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">
              <Icons.BsArrowClockwise className="spin icon-lg" style={{ fontSize: "2rem" }} />
              <p>Carregando pessoas...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <Icons.BsExclamationTriangle style={{ fontSize: "2rem", color: "red" }} />
              <p>{error}</p>
              <button onClick={fetchProfiles} className="primary-btn" style={{ marginTop: 10 }}>Tentar Novamente</button>
            </div>
          ) : profiles.length === 0 ? (
            <div className="empty-state">
              <Icons.BsPeople style={{ fontSize: "2rem" }} />
              <p>Nenhuma pessoa cadastrada.</p>
            </div>
          ) : (
            <table className="pessoas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th style={{ width: "100px", textAlign: "center" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id} className={p.ativo === false ? "inactive-row" : ""}>
                    <td style={{ fontFamily: "monospace", fontSize: "14px", color: "var(--primary-color)", fontWeight: "bold" }}>
                      {p.short_id || "-"}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {p.name || "-"}
                      {p.is_admin && <span style={{ marginLeft: "8px", background: "#fef3c7", color: "#d97706", fontSize: "11px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold" }}>Admin</span>}
                      {p.ativo === false && <span style={{ marginLeft: "8px", background: "#fee2e2", color: "#ef4444", fontSize: "11px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold" }}>Inativo</span>}
                    </td>
                    <td>{p.email || "-"}</td>
                    <td>
                      <div className="actions-cell">
                        <Link className="icon-btn" title="Histórico e Ocorrências" to={`/cadastro-pessoas/${p.id}`} style={{ backgroundColor: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}>
                          <Icons.BsFolder2Open />
                        </Link>
                        <button className="icon-btn" title="Alterar Senha" onClick={() => openPasswordModal(p.id)} style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                          <Icons.BsKey />
                        </button>
                        <button className="icon-btn edit-btn" title="Editar" onClick={() => openModal(p)}>
                          <Icons.BsPencil />
                        </button>
                        <button className="icon-btn delete-btn" title="Deletar" onClick={() => handleDelete(p.id, p.name || p.email)}>
                          <Icons.BsTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Alterar Senha</h2>
            <form onSubmit={handleUpdatePassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group">
                <label>Nova Senha</label>
                <input
                  type="text"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Digite a nova senha"
                  minLength={4}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsPasswordModalOpen(false)} disabled={saving}>
                  Cancelar
                </button>
                <button type="submit" className="primary-btn" disabled={saving}>
                  {saving ? <Icons.BsArrowClockwise className="spin" /> : <Icons.BsCheckLg />}
                  Salvar Nova Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: generatedPassword ? "400px" : "680px" }}>
            <h2>{formData.id ? "Editar Pessoa" : "Nova Pessoa"}</h2>

            {generatedPassword ? (
              <div style={{ background: "#d1fae5", padding: "16px", borderRadius: "8px", border: "1px solid #34d399", color: "#065f46" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>Login Criado com Sucesso!</h3>
                <p style={{ margin: "0 0 12px 0", fontSize: "14px" }}>Copie a senha abaixo e envie para o usuário:</p>
                <div style={{ background: "#fff", padding: "10px", borderRadius: "6px", fontWeight: "bold", fontSize: "18px", textAlign: "center", border: "1px dashed #10b981", letterSpacing: "2px" }}>
                  {generatedPassword}
                </div>
                <button type="button" className="primary-btn" onClick={closeModal} style={{ width: "100%", marginTop: "16px", justifyContent: "center" }}>
                  Concluir
                </button>
              </div>
            ) : (
              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="tabs-header" style={{ display: "flex", gap: "16px", borderBottom: "1px solid var(--border-color)", marginBottom: "16px" }}>
                  <button type="button" onClick={() => setActiveTab("pessoais")} style={{ background: "none", border: "none", borderBottom: activeTab === "pessoais" ? "2px solid var(--primary-color)" : "2px solid transparent", color: activeTab === "pessoais" ? "var(--primary-color)" : "var(--text-muted)", padding: "8px 16px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", transition: "all 0.2s" }}>Dados Pessoais</button>
                  <button type="button" onClick={() => setActiveTab("contratuais")} style={{ background: "none", border: "none", borderBottom: activeTab === "contratuais" ? "2px solid var(--primary-color)" : "2px solid transparent", color: activeTab === "contratuais" ? "var(--primary-color)" : "var(--text-muted)", padding: "8px 16px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", transition: "all 0.2s" }}>Dados Contratuais</button>
                </div>
                
                {activeTab === "pessoais" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "popoverFadeIn 0.2s ease-out" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                      <div className="form-group" style={{ flex: 2 }}>
                        <label>Nome Completo</label>
                        <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: João Silva" />
                      </div>
                      <div className="form-group" style={{ flex: 1.5 }}>
                        <label>E-mail</label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="joao@exemplo.com" />
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>CPF</label>
                        <input type="text" value={formData.cpf || ""} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} placeholder="000.000.000-00" />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>RG</label>
                        <input type="text" value={formData.rg || ""} onChange={(e) => setFormData({ ...formData, rg: e.target.value })} />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Data de Nascimento</label>
                        <input type="date" value={formData.data_nascimento || ""} onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })} style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "6px", fontFamily: "inherit", fontSize: "14px", width: "100%" }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Telefone / WhatsApp</label>
                        <input type="text" value={formData.telefone || ""} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} placeholder="(00) 00000-0000" />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Estado Civil</label>
                        <select value={formData.estado_civil || ""} onChange={(e) => setFormData({ ...formData, estado_civil: e.target.value })} style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "6px", fontFamily: "inherit", fontSize: "14px", width: "100%", backgroundColor: "#fff" }}>
                          <option value="">Selecione</option>
                          <option value="Solteiro(a)">Solteiro(a)</option>
                          <option value="Casado(a)">Casado(a)</option>
                          <option value="Divorciado(a)">Divorciado(a)</option>
                          <option value="Viúvo(a)">Viúvo(a)</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Sexo</label>
                        <select value={formData.sexo || ""} onChange={(e) => setFormData({ ...formData, sexo: e.target.value })} style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "6px", fontFamily: "inherit", fontSize: "14px", width: "100%", backgroundColor: "#fff" }}>
                          <option value="">Selecione</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Feminino">Feminino</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                      <div className="form-group" style={{ flex: 2 }}>
                        <label>Endereço Completo</label>
                        <input type="text" value={formData.endereco || ""} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} placeholder="Rua, Número, Bairro, CEP" />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label style={{ whiteSpace: "nowrap" }}>Cidade de Nascimento</label>
                        <input type="text" value={formData.cidade_nascimento || ""} onChange={(e) => setFormData({ ...formData, cidade_nascimento: e.target.value })} />
                      </div>
                      <div className="form-group" style={{ flex: 0.5 }}>
                        <label>Dependentes</label>
                        <input type="number" min={0} value={formData.dependentes || 0} onChange={(e) => setFormData({ ...formData, dependentes: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "contratuais" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "popoverFadeIn 0.2s ease-out" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Cargo</label>
                        <input type="text" value={formData.cargo || ""} onChange={(e) => setFormData({ ...formData, cargo: e.target.value })} />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Unidade Registrada</label>
                        <input type="text" value={formData.unidade_registrada || ""} onChange={(e) => setFormData({ ...formData, unidade_registrada: e.target.value })} placeholder="Ex: Matriz" />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Nº CTPS</label>
                        <input type="text" value={formData.ctps || ""} onChange={(e) => setFormData({ ...formData, ctps: e.target.value })} />
                      </div>
                      <div className="form-group" style={{ flex: 0.5 }}>
                        <label>ID (Máx 4)</label>
                        <input type="text" maxLength={4} value={formData.short_id || ""} onChange={(e) => setFormData({ ...formData, short_id: e.target.value.replace(/\D/g, '') })} placeholder="1234" />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Data de Admissão</label>
                        <input type="date" value={formData.data_registro || ""} onChange={(e) => setFormData({ ...formData, data_registro: e.target.value })} style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "6px", fontFamily: "inherit", fontSize: "14px", width: "100%" }} />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Data de Demissão</label>
                        <input type="date" value={formData.data_demissao || ""} onChange={(e) => setFormData({ ...formData, data_demissao: e.target.value })} style={{ padding: "10px", border: "1px solid var(--border-color)", borderRadius: "6px", fontFamily: "inherit", fontSize: "14px", width: "100%" }} />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label style={{ textTransform: "none", whiteSpace: "nowrap" }}>Passagens URBS/Dia</label>
                        <input type="number" min={0} value={formData.passagens_urbs || 0} onChange={(e) => setFormData({ ...formData, passagens_urbs: parseInt(e.target.value) || 0 })} />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label style={{ textTransform: "none", whiteSpace: "nowrap" }}>Metrocard/Dia</label>
                        <input type="number" min={0} value={formData.passagens_metrocard || 0} onChange={(e) => setFormData({ ...formData, passagens_metrocard: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: "4px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--secondary-color)", display: "block", marginBottom: "6px" }}>Dias Fixos de Folga Semanal</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {WEEKDAYS.map((day) => {
                          const isChecked = (formData.folgas_fixas || "").split(",").includes(day.value);
                          return (
                            <label key={day.value} style={{ display: "flex", alignItems: "center", padding: "6px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, cursor: "pointer", userSelect: "none", transition: "all 0.2s ease", background: isChecked ? "#f5ede4" : "#f3f4f6", border: isChecked ? "1.5px solid #784e21" : "1.5px solid #e5e7eb", color: isChecked ? "#784e21" : "#4b5563" }}>
                              <input type="checkbox" checked={isChecked} onChange={() => handleWeekdayToggle(day.value)} style={{ display: "none" }} />
                              {day.label}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "16px", marginTop: "12px", padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      <div className="checkbox-group">
                        <input type="checkbox" id="ativoCheckbox" checked={formData.ativo} onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })} />
                        <label htmlFor="ativoCheckbox">Usuário Ativo</label>
                      </div>
                      <div className="checkbox-group">
                        <input type="checkbox" id="controlarFrequenciaCheckbox" checked={formData.controlar_frequencia} onChange={(e) => setFormData({ ...formData, controlar_frequencia: e.target.checked })} />
                        <label htmlFor="controlarFrequenciaCheckbox">Controlar Frequência</label>
                      </div>
                      <div className="checkbox-group">
                        <input type="checkbox" id="isAdminCheckbox" checked={formData.is_admin} onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })} />
                        <label htmlFor="isAdminCheckbox">Administrador</label>
                      </div>
                    </div>
                  </div>
                )}

                {!formData.id && (
                  <div className="checkbox-group" style={{ paddingTop: "12px", borderTop: "1px solid var(--border-color)", marginTop: "8px" }}>
                    <input
                      type="checkbox"
                      id="createLoginCheckbox"
                      checked={createLogin}
                      onChange={(e) => setCreateLogin(e.target.checked)}
                    />
                    <label htmlFor="createLoginCheckbox">
                      Gerar senha de acesso (Login)
                    </label>
                  </div>
                )}

                <div className="modal-actions" style={{ marginTop: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
                  <button type="button" className="cancel-btn" onClick={closeModal} disabled={saving}>
                    Cancelar
                  </button>
                  <button type="submit" className="primary-btn" disabled={saving}>
                    {saving ? <Icons.BsArrowClockwise className="spin" /> : <Icons.BsCheckLg />}
                    Salvar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default CadastroPessoas;
