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

  const [novoNome, setNovoNome] = useState("");
  const [novoAtivo, setNovoAtivo] = useState(true);
  const [novaQtdConversao, setNovaQtdConversao] = useState("");
  const [novaUnidadeConversao, setNovaUnidadeConversao] = useState("");
  const [novoCustoConsiderado, setNovoCustoConsiderado] = useState("");
  const [novoCustoAtualizado, setNovoCustoAtualizado] = useState("");
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
          ativo: novoAtivo,
          quantidade_conversao: novaQtdConversao ? parseFloat(novaQtdConversao) : null,
          unidade_conversao: novaUnidadeConversao.trim(),
          custo_considerado: novoCustoConsiderado ? parseFloat(novoCustoConsiderado) : null,
          custo_atualizado: novoCustoAtualizado ? parseFloat(novoCustoAtualizado) : null,
          nome_simples_unitario: novoNomeSimples.trim(),
          tipo: novoTipo.trim(),
          fornecedor_padrao: novoFornecedor.trim()
        }]);

      if (error) {
        throw error;
      }

      setNovoNome("");
      setNovoAtivo(true);
      setNovaQtdConversao("");
      setNovaUnidadeConversao("");
      setNovoCustoConsiderado("");
      setNovoCustoAtualizado("");
      setNovoNomeSimples("");
      setNovoTipo("");
      setNovoFornecedor("");
      
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

  return (
    <>
      <Helmet>
        <title>Cadastro de Insumos</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Cadastro de Insumos</h1>
            <p>Gerencie os insumos da loja. Eles poderão ser utilizados em módulos de controle de estoque e receitas.</p>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ marginTop: "20px", maxWidth: "1200px" }}>
          <div className="feriado-form-card" style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#f9fafb", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
            <h4 style={{ marginBottom: "12px", color: "var(--secondary-color)" }}>Cadastrar Novo Insumo</h4>
            <form onSubmit={handleAddInsumo} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", alignItems: "end" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem" }}>Nome do Insumo *</label>
                <input
                  type="text"
                  required
                  className="frequencia-select"
                  placeholder="Ex: Leite Integral 1L"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem" }}>Nome Simples e Unitário</label>
                <input
                  type="text"
                  className="frequencia-select"
                  placeholder="Ex: Leite"
                  value={novoNomeSimples}
                  onChange={(e) => setNovoNomeSimples(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem" }}>Tipo</label>
                <input
                  type="text"
                  className="frequencia-select"
                  placeholder="Ex: Laticínio"
                  value={novoTipo}
                  onChange={(e) => setNovoTipo(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem" }}>Fornecedor Padrão</label>
                <input
                  type="text"
                  className="frequencia-select"
                  placeholder="Nome do fornecedor"
                  value={novoFornecedor}
                  onChange={(e) => setNovoFornecedor(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem" }}>Qtd de Conversão</label>
                <input
                  type="number"
                  step="0.0001"
                  className="frequencia-select"
                  placeholder="Ex: 1000"
                  value={novaQtdConversao}
                  onChange={(e) => setNovaQtdConversao(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem" }}>Unidade de Conversão</label>
                <input
                  type="text"
                  className="frequencia-select"
                  placeholder="Ex: ml, g"
                  value={novaUnidadeConversao}
                  onChange={(e) => setNovaUnidadeConversao(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem" }}>Custo Considerado</label>
                <input
                  type="number"
                  step="0.01"
                  className="frequencia-select"
                  placeholder="R$ 0,00"
                  value={novoCustoConsiderado}
                  onChange={(e) => setNovoCustoConsiderado(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "1.2rem" }}>Custo Atualizado</label>
                <input
                  type="number"
                  step="0.01"
                  className="frequencia-select"
                  placeholder="R$ 0,00"
                  value={novoCustoAtualizado}
                  onChange={(e) => setNovoCustoAtualizado(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0, display: "flex", alignItems: "center", gap: "8px", height: "38px" }}>
                <input
                  type="checkbox"
                  id="ativo"
                  checked={novoAtivo}
                  onChange={(e) => setNovoAtivo(e.target.checked)}
                  style={{ width: "16px", height: "16px" }}
                />
                <label htmlFor="ativo" style={{ fontSize: "1.2rem", margin: 0, cursor: "pointer" }}>Ativo no sistema</label>
              </div>

              <div style={{ display: "flex", gap: "8px", height: "38px" }}>
                <button type="submit" disabled={saving} className="primary-btn" style={{ padding: "0 16px", height: "100%", width: "100%" }}>
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>

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
                    <th>Nome</th>
                    <th>Nome Simples</th>
                    <th>Tipo</th>
                    <th>Fornecedor</th>
                    <th>Qtd Conv.</th>
                    <th>Unid. Conv.</th>
                    <th>Custo Consid.</th>
                    <th>Custo Atual.</th>
                    <th>Ativo</th>
                    <th style={{ textAlign: "center" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {insumos.map((insumo) => (
                    <tr key={insumo.id} style={{ opacity: insumo.ativo ? 1 : 0.6 }}>
                      <td style={{ fontWeight: 500 }}>{insumo.nome}</td>
                      <td>{insumo.nome_simples_unitario || "-"}</td>
                      <td>{insumo.tipo || "-"}</td>
                      <td>{insumo.fornecedor_padrao || "-"}</td>
                      <td>{insumo.quantidade_conversao || "-"}</td>
                      <td>{insumo.unidade_conversao || "-"}</td>
                      <td>{insumo.custo_considerado ? `R$ ${insumo.custo_considerado.toFixed(2)}` : "-"}</td>
                      <td>{insumo.custo_atualizado ? `R$ ${insumo.custo_atualizado.toFixed(2)}` : "-"}</td>
                      <td>{insumo.ativo ? "Sim" : "Não"}</td>
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
    </>
  );
}

export default CadastroInsumos;
