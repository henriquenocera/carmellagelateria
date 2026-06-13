import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../../services/supabase-client";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../../css/Frequencia.css";

function CadastroCategoriasFinanceiras() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRow, setSavingRow] = useState(false);

  const [newRow, setNewRow] = useState({
    nome: "",
    parent_id: ""
  });

  useEffect(() => {
    if (isAdmin === false) {
      navigate("/");
    } else if (isAdmin === true) {
      fetchCategorias();
    }
  }, [isAdmin, navigate]);

  async function fetchCategorias() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categorias_financeiras")
        .select("*")
        .order("nome", { ascending: true });

      if (error) throw error;
      setCategorias(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar categorias:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRow.nome.trim()) {
      alert("Preencha o nome da categoria.");
      return;
    }

    try {
      setSavingRow(true);
      const payload = {
        nome: newRow.nome.trim(),
        parent_id: newRow.parent_id || null
      };

      const { error } = await supabase.from("categorias_financeiras").insert([payload]);
      if (error) throw error;

      setNewRow({ nome: "", parent_id: "" });
      fetchCategorias();
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      if (err.code === "42P01") {
         alert("A tabela 'categorias_financeiras' ainda não existe no Supabase.");
      } else {
         alert("Erro ao salvar: " + err.message);
      }
    } finally {
      setSavingRow(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Atenção: Ao excluir esta categoria, as subcategorias vinculadas à ela ficarão soltas. Deseja realmente excluir?")) return;
    try {
      setLoading(true);
      const { error } = await supabase.from("categorias_financeiras").delete().eq("id", id);
      if (error) throw error;
      fetchCategorias();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao excluir.");
      setLoading(false);
    }
  };

  // Agrupamento para a tabela (Pai -> Filhos)
  const categoriasPai = categorias.filter(c => !c.parent_id);
  const getSubcategorias = (paiId: string) => categorias.filter(c => c.parent_id === paiId);

  return (
    <>
      <Helmet>
        <title>Categorias Financeiras</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Categorias Financeiras</h1>
            <p>Gerencie as categorias e subcategorias usadas nos Lançamentos Financeiros.</p>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          
          {/* Card de Inserção */}
          <div style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            marginBottom: "24px",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.8rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.BsPlusCircleFill style={{ color: "var(--primary-color)" }} />
              Nova Categoria
            </h3>
            
            <form onSubmit={handleSave} style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end" }}>
              
              <div style={{ flex: "2 1 300px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Nome da Categoria *</label>
                <input
                  type="text"
                  placeholder="Ex: Receitas, Vendas Cartão, Energia..."
                  value={newRow.nome}
                  onChange={(e) => setNewRow({ ...newRow, nome: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", height: "54px", fontSize: "1.4rem" }}
                  required
                />
              </div>

              <div style={{ flex: "1.5 1 250px" }}>
                <label style={{ display: "block", fontSize: "1.3rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Categoria Pai (Grupo)</label>
                <select
                  value={newRow.parent_id}
                  onChange={(e) => setNewRow({ ...newRow, parent_id: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", height: "54px", fontSize: "1.4rem", backgroundColor: "#fff" }}
                >
                  <option value="">-- Nenhuma (É uma Categoria Principal) --</option>
                  {categoriasPai.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: "0 0 150px", position: "relative" }}>
                <button
                  type="submit"
                  disabled={savingRow}
                  style={{
                    height: "54px",
                    padding: "0",
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: savingRow ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    fontSize: "1.4rem",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  <Icons.BsCheckCircleFill /> Adicionar
                </button>
              </div>
            </form>
          </div>

          <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <table className="freq-table" style={{ minWidth: "800px" }}>
              <thead>
                <tr>
                  <th style={{ width: "400px" }}>Nome da Categoria</th>
                  <th style={{ width: "150px", textAlign: "center" }}>Tipo</th>
                  <th style={{ textAlign: "center", width: "80px" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: "24px" }}>
                      <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                    </td>
                  </tr>
                ) : categorias.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: "24px", color: "#94a3b8", fontSize: "1.3rem" }}>
                      Nenhuma categoria registrada.
                    </td>
                  </tr>
                ) : (
                  categoriasPai.map(pai => (
                    <React.Fragment key={pai.id}>
                      {/* Categoria Pai */}
                      <tr style={{ backgroundColor: "#f8fafc" }}>
                        <td style={{ fontWeight: "bold", fontSize: "1.4rem", color: "#334155", display: "flex", alignItems: "center", gap: "8px" }}>
                          <Icons.BsFolderFill style={{ color: "var(--primary-color)" }} />
                          {pai.nome}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span style={{ background: "#e2e8f0", color: "#475569", padding: "4px 8px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "bold" }}>
                            Categoria Pai
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button onClick={() => handleDelete(pai.id)} className="delete-record-btn" title="Excluir" style={{ margin: 0 }}>
                            <Icons.BsTrash />
                          </button>
                        </td>
                      </tr>

                      {/* Subcategorias dessa Pai */}
                      {getSubcategorias(pai.id).map(sub => (
                        <tr key={sub.id}>
                          <td style={{ paddingLeft: "40px", color: "#475569", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Icons.BsArrowReturnRight style={{ color: "#94a3b8" }} />
                            {sub.nome}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <span style={{ color: "#94a3b8", fontSize: "1.2rem" }}>Subcategoria</span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button onClick={() => handleDelete(sub.id)} className="delete-record-btn" title="Excluir" style={{ margin: 0 }}>
                              <Icons.BsTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                )}
                
                {/* Categorias Órfãs (Com parent_id que não existe mais) */}
                {!loading && categorias.filter(c => c.parent_id && !categorias.find(p => p.id === c.parent_id)).map(orfao => (
                   <tr key={orfao.id}>
                      <td style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Icons.BsExclamationTriangleFill />
                        {orfao.nome} (Sem Pai)
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span style={{ color: "#ef4444", fontSize: "1.2rem" }}>Desvinculada</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button onClick={() => handleDelete(orfao.id)} className="delete-record-btn" title="Excluir" style={{ margin: 0 }}>
                          <Icons.BsTrash />
                        </button>
                      </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
}

export default CadastroCategoriasFinanceiras;
