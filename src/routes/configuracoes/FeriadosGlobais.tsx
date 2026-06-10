import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../../services/supabase-client";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../../css/Frequencia.css";

function FeriadosGlobais() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [feriados, setFeriados] = useState<{ id: string; date: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [novoData, setNovoData] = useState("");
  const [novoNome, setNovoNome] = useState("");

  useEffect(() => {
    if (isAdmin === false) {
      navigate("/");
    } else if (isAdmin === true) {
      fetchFeriados();
    }
  }, [isAdmin, navigate]);

  async function fetchFeriados() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("feriados_globais")
        .select("id, date, name")
        .order("date", { ascending: false });

      if (error) throw error;
      setFeriados(data || []);
    } catch (err) {
      console.error("Erro ao buscar feriados:", err);
      alert("Erro ao buscar feriados");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddFeriado(e: React.FormEvent) {
    e.preventDefault();
    if (!novoData || !novoNome.trim()) {
      alert("Preencha a data e o nome.");
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from("feriados_globais")
        .insert([{ date: novoData, name: novoNome.trim() }]);

      if (error) {
        if (error.code === "23505") { // unique constraint
          throw new Error("Já existe um feriado cadastrado para esta data.");
        }
        throw error;
      }

      setNovoData("");
      setNovoNome("");
      fetchFeriados();
    } catch (err: any) {
      console.error("Erro ao adicionar:", err);
      alert(err.message || "Erro ao adicionar feriado");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteFeriado(id: string) {
    if (!window.confirm("Deseja realmente excluir este feriado?")) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("feriados_globais").delete().eq("id", id);
      if (error) throw error;
      fetchFeriados();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar feriado");
      setLoading(false);
    }
  }

  const formatDisplayDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <>
      <Helmet>
        <title>Feriados Globais</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Feriados Globais</h1>
            <p>Gerencie os feriados da loja. Eles aparecerão no painel de frequência e no histórico dos funcionários.</p>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ marginTop: "20px", maxWidth: "800px" }}>
          <div className="feriado-form-card" style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#f9fafb", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
            <h4 style={{ marginBottom: "12px", color: "var(--secondary-color)" }}>Cadastrar Novo Feriado</h4>
            <form onSubmit={handleAddFeriado} style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div className="form-group" style={{ marginBottom: 0, flex: "1", minWidth: "150px" }}>
                <label style={{ fontSize: "1.2rem" }}>Data do Feriado</label>
                <input
                  type="date"
                  required
                  className="frequencia-select"
                  value={novoData}
                  onChange={(e) => setNovoData(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0, flex: "2", minWidth: "200px" }}>
                <label style={{ fontSize: "1.2rem" }}>Nome do Feriado</label>
                <input
                  type="text"
                  required
                  className="frequencia-select"
                  placeholder="Ex: Natal"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="submit" disabled={saving} className="primary-btn" style={{ padding: "10px 16px" }}>
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : feriados.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Nenhum feriado global registrado.</p>
          ) : (
            <div className="freq-table-wrapper">
              <table className="freq-table">
                <thead>
                  <tr>
                    <th style={{ width: "30%" }}>Data</th>
                    <th style={{ width: "50%" }}>Nome do Feriado</th>
                    <th style={{ width: "20%", textAlign: "center" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {feriados.map((feriado) => (
                    <tr key={feriado.id}>
                      <td style={{ fontWeight: 500 }}>{formatDisplayDate(feriado.date)}</td>
                      <td>{feriado.name}</td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => handleDeleteFeriado(feriado.id)}
                          className="delete-record-btn"
                          title="Excluir Feriado"
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

export default FeriadosGlobais;
