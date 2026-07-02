import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../../services/supabase-client";
import { useNavigate } from "react-router-dom";
import "../../css/Frequencia.css";

function CadastroFornecedores() {
  const navigate = useNavigate();

  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [ativo, setAtivo] = useState(true);
  const [nome, setNome] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [metodoCompra, setMetodoCompra] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [contatoNome, setContatoNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    fetchFornecedores();
  }, []);

  async function fetchFornecedores() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .order("nome", { ascending: true });

      if (error) throw error;
      setFornecedores(data || []);
    } catch (err) {
      console.error("Erro ao buscar fornecedores:", err);
      alert("Erro ao buscar fornecedores. Verifique se a tabela foi criada no banco de dados.");
    } finally {
      setLoading(false);
    }
  }

  const openModal = (fornecedor?: any) => {
    if (fornecedor) {
      setEditingId(fornecedor.id);
      setAtivo(fornecedor.ativo ?? true);
      setNome(fornecedor.nome || "");
      setRazaoSocial(fornecedor.razao_social || "");
      setMetodoCompra(fornecedor.metodo_compra || "");
      setEmail(fornecedor.email || "");
      setTelefone(fornecedor.telefone || "");
      setContatoNome(fornecedor.contato_nome || "");
      setCnpj(fornecedor.cnpj || "");
      setObservacoes(fornecedor.observacoes || "");
    } else {
      setEditingId(null);
      setAtivo(true);
      setNome("");
      setRazaoSocial("");
      setMetodoCompra("");
      setEmail("");
      setTelefone("");
      setContatoNome("");
      setCnpj("");
      setObservacoes("");
    }
    setIsModalOpen(true);
  };

  async function handleToggleAtivo(id: string, currentAtivo: boolean) {
    try {
      setLoading(true);
      const { error } = await supabase.from("fornecedores").update({ ativo: !currentAtivo }).eq("id", id);
      if (error) throw error;
      fetchFornecedores();
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      alert("Erro ao alterar o status do fornecedor.");
      setLoading(false);
    }
  }

  async function handleSaveFornecedor(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      alert("Preencha o nome do fornecedor.");
      return;
    }

    const payload = {
      ativo,
      nome: nome.trim(),
      razao_social: razaoSocial.trim(),
      metodo_compra: metodoCompra.trim(),
      email: email.trim(),
      telefone: telefone.trim(),
      contato_nome: contatoNome.trim(),
      cnpj: cnpj.trim(),
      observacoes: observacoes.trim(),
    };

    try {
      setSaving(true);
      
      if (editingId) {
        const { error } = await supabase
          .from("fornecedores")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("fornecedores")
          .insert([payload]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchFornecedores();
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      alert(err.message || "Erro ao salvar fornecedor");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteFornecedor(id: string) {
    if (!window.confirm("Deseja realmente excluir este fornecedor?")) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("fornecedores").delete().eq("id", id);
      if (error) throw error;
      fetchFornecedores();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar fornecedor");
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Cadastro de Fornecedores</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="frequencia-title-group">
            <h1>Cadastro de Fornecedores</h1>
            <p>Gerencie os fornecedores da empresa, informações de contato e métodos de compra.</p>
          </div>
          <button className="primary-btn" onClick={() => openModal()}>
            <Icons.BsPlusLg style={{ marginRight: "8px" }} />
            Novo Fornecedor
          </button>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : fornecedores.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Nenhum fornecedor registrado.</p>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="freq-table" style={{ minWidth: "1100px" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center", width: "60px" }}>Ativo</th>
                    <th style={{ width: "250px" }}>Nome / Fantasia</th>
                    <th style={{ width: "200px" }}>Razão Social</th>
                    <th style={{ width: "150px" }}>Método Compra</th>
                    <th style={{ width: "150px" }}>Contato</th>
                    <th style={{ width: "150px" }}>Telefone</th>
                    <th style={{ width: "150px" }}>E-mail</th>
                    <th style={{ textAlign: "center", width: "80px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {fornecedores.map((f) => (
                    <tr key={f.id} style={{ opacity: f.ativo ? 1 : 0.6 }}>
                      <td
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleToggleAtivo(f.id, f.ativo)}
                        title={f.ativo ? "Desativar fornecedor" : "Ativar fornecedor"}
                      >
                        {f.ativo ? (
                          <Icons.BsCheckCircleFill style={{ color: "#22c55e", fontSize: "1.5rem" }} />
                        ) : (
                          <Icons.BsXCircleFill style={{ color: "#94a3b8", fontSize: "1.5rem" }} />
                        )}
                      </td>
                      <td style={{ fontWeight: 500 }}>{f.nome}</td>
                      <td>{f.razao_social || "-"}</td>
                      <td>{f.metodo_compra || "-"}</td>
                      <td>{f.contato_nome || "-"}</td>
                      <td>{f.telefone || "-"}</td>
                      <td>{f.email || "-"}</td>
                      <td style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center", height: "100%", padding: "12px 8px" }}>
                        <button
                          onClick={() => openModal(f)}
                          className="delete-record-btn"
                          title="Editar Fornecedor"
                          style={{ margin: 0, color: "var(--primary-color)" }}
                        >
                          <Icons.BsPencil />
                        </button>
                        <button
                          onClick={() => handleDeleteFornecedor(f.id)}
                          className="delete-record-btn"
                          title="Excluir Fornecedor"
                          style={{ margin: 0 }}
                        >
                          <Icons.BsTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "680px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "var(--secondary-color)" }}>
                {editingId ? "Editar Fornecedor" : "Cadastrar Novo Fornecedor"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}>
                <Icons.BsX />
              </button>
            </div>
            <form onSubmit={handleSaveFornecedor} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Nome Fantasia *</label>
                  <input
                    type="text"
                    required
                    className="frequencia-select"
                    placeholder="Ex: Nestle"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Razão Social</label>
                  <input
                    type="text"
                    className="frequencia-select"
                    placeholder="Ex: Nestle Brasil Ltda"
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>CNPJ</label>
                  <input
                    type="text"
                    className="frequencia-select"
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Método de Compra</label>
                  <input
                    type="text"
                    className="frequencia-select"
                    placeholder="Ex: Site, WhatsApp, Vendedor"
                    value={metodoCompra}
                    onChange={(e) => setMetodoCompra(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Nome do Contato</label>
                  <input
                    type="text"
                    className="frequencia-select"
                    placeholder="Ex: João Silva"
                    value={contatoNome}
                    onChange={(e) => setContatoNome(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Telefone</label>
                  <input
                    type="text"
                    className="frequencia-select"
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>E-mail</label>
                <input
                  type="email"
                  className="frequencia-select"
                  placeholder="contato@fornecedor.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Observações</label>
                <textarea
                  className="frequencia-select"
                  style={{ minHeight: "80px", resize: "vertical" }}
                  placeholder="Detalhes sobre entrega, pedido mínimo, etc."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px", marginTop: "12px" }}>
                <input
                  type="checkbox"
                  id="fornecedorAtivo"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer", margin: 0 }}
                />
                <label htmlFor="fornecedorAtivo" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)", cursor: "pointer", margin: 0 }}>
                  Fornecedor Ativo
                </label>
              </div>

              <div className="modal-actions" style={{ marginTop: "12px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)} disabled={saving}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="primary-btn">
                  {saving ? "Salvando..." : "Salvar Fornecedor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CadastroFornecedores;
