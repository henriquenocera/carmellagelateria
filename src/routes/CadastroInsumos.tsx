import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/Frequencia.css";

function CadastroInsumos() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [insumos, setInsumos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [novoNome, setNovoNome] = useState("");
  const [novaQtdConversao, setNovaQtdConversao] = useState("");
  const [novaUnidadeConversao, setNovaUnidadeConversao] = useState("");
  const [novoCustoConsiderado, setNovoCustoConsiderado] = useState("");
  const [novoNomeSimples, setNovoNomeSimples] = useState("");
  const [novoTipo, setNovoTipo] = useState("");
  const [novoFornecedor, setNovoFornecedor] = useState("");

  useEffect(() => {
    if (isAdmin === false) {
      navigate("/");
    } else if (isAdmin === true) {
      fetchInsumos();
    }
  }, [isAdmin, navigate]);

  async function fetchInsumos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("cadastro_insumos")
        .select("*")
        .order("nome", { ascending: true });

      if (error) throw error;
      setInsumos(data || []);
    } catch (err) {
      console.error("Erro ao buscar insumos:", err);
      alert("Erro ao buscar insumos. Verifique se as colunas no banco foram atualizadas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddInsumo(e: React.FormEvent) {
    e.preventDefault();
    if (!novoNome.trim()) {
      alert("Preencha o nome do insumo.");
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from("cadastro_insumos")
        .insert([{
          nome: novoNome.trim(),
          ativo: true,
          quantidade_conversao: novaQtdConversao ? parseFloat(novaQtdConversao) : null,
          unidade_conversao: novaUnidadeConversao.trim(),
          custo_considerado: novoCustoConsiderado ? parseFloat(novoCustoConsiderado) : null,
          nome_simples_unitario: novoNomeSimples.trim(),
          tipo: novoTipo.trim(),
          fornecedor_padrao: novoFornecedor.trim()
        }]);

      if (error) {
        throw error;
      }

      setNovoNome("");
      setNovaQtdConversao("");
      setNovaUnidadeConversao("");
      setNovoCustoConsiderado("");
      setNovoNomeSimples("");
      setNovoTipo("");
      setNovoFornecedor("");
      setIsModalOpen(false);

      fetchInsumos();
    } catch (err: any) {
      console.error("Erro ao adicionar:", err);
      alert(err.message || "Erro ao adicionar insumo");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteInsumo(id: string) {
    if (!window.confirm("Deseja realmente excluir este insumo?")) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("cadastro_insumos").delete().eq("id", id);
      if (error) throw error;
      fetchInsumos();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar insumo");
      setLoading(false);
    }
  }

  const handleLocalChange = (id: string, field: string, value: any) => {
    setInsumos((prev) =>
      prev.map((ins) => (ins.id === id ? { ...ins, [field]: value } : ins))
    );
  };

  async function handleUpdateField(id: string, field: string, value: any) {
    try {
      const { error } = await supabase
        .from("cadastro_insumos")
        .update({ [field]: value })
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert("Erro ao atualizar o campo.");
    }
  }

  return (
    <>
      <Helmet>
        <title>Cadastro de Insumos</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="frequencia-title-group">
            <h1>Cadastro de Insumos</h1>
            <p>Gerencie os insumos da loja. Eles poderão ser utilizados em módulos de controle de estoque e receitas.</p>
          </div>
          <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
            <Icons.BsPlusLg style={{ marginRight: "8px" }} />
            Novo Insumo
          </button>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ marginTop: "20px", maxWidth: "1200px", margin: "20px auto" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : insumos.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Nenhum insumo registrado.</p>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="freq-table" style={{ minWidth: "900px" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center", width: "60px" }}>Ativo</th>
                    <th>Nome</th>
                    <th>Nome Simples</th>
                    <th>Tipo</th>
                    <th>Fornecedor</th>
                    <th style={{ width: "90px" }}>Qtd Conv.</th>
                    <th style={{ width: "90px" }}>Unid. Conv.</th>
                    <th style={{ width: "100px" }}>Custo Consid.</th>
                    <th style={{ width: "100px" }}>Custo Atual.</th>
                    <th style={{ textAlign: "center", width: "60px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {insumos.map((insumo) => (
                    <tr key={insumo.id} style={{ opacity: insumo.ativo ? 1 : 0.6, transition: "opacity 0.2s" }}>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={insumo.ativo || false}
                          onChange={(e) => {
                            handleLocalChange(insumo.id, "ativo", e.target.checked);
                            handleUpdateField(insumo.id, "ativo", e.target.checked);
                          }}
                          style={{ cursor: "pointer", width: "16px", height: "16px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={insumo.nome || ""}
                          onChange={(e) => handleLocalChange(insumo.id, "nome", e.target.value)}
                          onBlur={(e) => handleUpdateField(insumo.id, "nome", e.target.value)}
                          style={{ border: "1px solid transparent", background: "transparent", width: "100%", outline: "none", fontWeight: 500, color: "inherit", padding: "4px" }}
                          title="Clique para editar"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={insumo.nome_simples_unitario || ""}
                          onChange={(e) => handleLocalChange(insumo.id, "nome_simples_unitario", e.target.value)}
                          onBlur={(e) => handleUpdateField(insumo.id, "nome_simples_unitario", e.target.value)}
                          style={{ border: "1px solid transparent", background: "transparent", width: "100%", outline: "none", color: "inherit", padding: "4px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={insumo.tipo || ""}
                          onChange={(e) => handleLocalChange(insumo.id, "tipo", e.target.value)}
                          onBlur={(e) => handleUpdateField(insumo.id, "tipo", e.target.value)}
                          style={{ border: "1px solid transparent", background: "transparent", width: "100%", outline: "none", color: "inherit", padding: "4px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={insumo.fornecedor_padrao || ""}
                          onChange={(e) => handleLocalChange(insumo.id, "fornecedor_padrao", e.target.value)}
                          onBlur={(e) => handleUpdateField(insumo.id, "fornecedor_padrao", e.target.value)}
                          style={{ border: "1px solid transparent", background: "transparent", width: "100%", outline: "none", color: "inherit", padding: "4px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.0001"
                          value={insumo.quantidade_conversao || ""}
                          onChange={(e) => handleLocalChange(insumo.id, "quantidade_conversao", e.target.value)}
                          onBlur={(e) => handleUpdateField(insumo.id, "quantidade_conversao", e.target.value ? parseFloat(e.target.value) : null)}
                          style={{ border: "1px solid transparent", background: "transparent", width: "100%", outline: "none", color: "inherit", padding: "4px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={insumo.unidade_conversao || ""}
                          onChange={(e) => handleLocalChange(insumo.id, "unidade_conversao", e.target.value)}
                          onBlur={(e) => handleUpdateField(insumo.id, "unidade_conversao", e.target.value)}
                          style={{ border: "1px solid transparent", background: "transparent", width: "100%", outline: "none", color: "inherit", padding: "4px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={insumo.custo_considerado || ""}
                          onChange={(e) => handleLocalChange(insumo.id, "custo_considerado", e.target.value)}
                          onBlur={(e) => handleUpdateField(insumo.id, "custo_considerado", e.target.value ? parseFloat(e.target.value) : null)}
                          style={{ border: "1px solid transparent", background: "transparent", width: "100%", outline: "none", color: "inherit", padding: "4px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={insumo.custo_atualizado || ""}
                          onChange={(e) => handleLocalChange(insumo.id, "custo_atualizado", e.target.value)}
                          onBlur={(e) => handleUpdateField(insumo.id, "custo_atualizado", e.target.value ? parseFloat(e.target.value) : null)}
                          style={{ border: "1px solid transparent", background: "transparent", width: "100%", outline: "none", color: "inherit", padding: "4px" }}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => handleDeleteInsumo(insumo.id)}
                          className="delete-record-btn"
                          title="Excluir Insumo"
                          style={{ margin: "0 auto" }}
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
          <div className="modal-content" style={{ maxWidth: "680px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "var(--secondary-color)" }}>Cadastrar Novo Insumo</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}>
                <Icons.BsX />
              </button>
            </div>
            <form onSubmit={handleAddInsumo} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Nome do Insumo *</label>
                <input
                  type="text"
                  required
                  className="frequencia-select"
                  placeholder="Ex: Leite Integral UHT -  1L"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Nome Simples e Unitário</label>
                <input
                  type="text"
                  className="frequencia-select"
                  placeholder="Ex: Leite"
                  value={novoNomeSimples}
                  onChange={(e) => setNovoNomeSimples(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Tipo</label>
                  <select
                    className="frequencia-select"
                    value={novoTipo}
                    onChange={(e) => setNovoTipo(e.target.value)}
                    style={{ background: "#fff" }}
                  >
                    <option value="">Selecione um tipo</option>
                    <option value="Insumos">Insumos</option>
                    <option value="Matéria Prima">Matéria Prima</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Material de Limpeza">Material de Limpeza</option>
                    <option value="Salgados">Salgados</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Fornecedor Padrão</label>
                  <input
                    type="text"
                    className="frequencia-select"
                    placeholder="Nome do fornecedor"
                    value={novoFornecedor}
                    onChange={(e) => setNovoFornecedor(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
                <h5 style={{ marginBottom: "12px", color: "var(--secondary-color)", fontSize: "1.4rem" }}>Cálculo de Custo</h5>
                
                <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Qtd de Conversão</label>
                    <input
                      type="number"
                      step="0.0001"
                      className="frequencia-select"
                      placeholder="Ex: 1000"
                      value={novaQtdConversao}
                      onChange={(e) => setNovaQtdConversao(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Unidade de Conversão</label>
                    <input
                      type="text"
                      className="frequencia-select"
                      placeholder="Ex: ml, g"
                      value={novaUnidadeConversao}
                      onChange={(e) => setNovaUnidadeConversao(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Custo Considerado</label>
                  <input
                    type="number"
                    step="0.01"
                    className="frequencia-select"
                    placeholder="R$ 0,00"
                    value={novoCustoConsiderado}
                    onChange={(e) => setNovoCustoConsiderado(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: "12px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)} disabled={saving}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="primary-btn">
                  {saving ? "Salvando..." : "Salvar Insumo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CadastroInsumos;
