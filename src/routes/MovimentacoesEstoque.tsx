import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../supabase-client";
import "../css/Frequencia.css";

const UNITS = [
  "Compras",
  "Fábrica",
  "Estoque MH",
  "Loja Ahú",
  "Loja Alto XV",
  "Descarte"
];

const getUnitBgColor = (unit: string) => {
  switch (unit) {
    case 'Compras': return '#e8f5e9'; // light green
    case 'Estoque MH': return '#424242'; // dark grey
    case 'Fábrica': return '#fff3e0'; // light orange
    case 'Loja Ahú': return '#fff9c4'; // light yellow
    case 'Loja Alto XV': return '#e3f2fd'; // light blue
    case 'Descarte': return '#ffebee'; // light red
    default: return '#ffffff';
  }
};

const getUnitColor = (unit: string) => {
  if (unit === 'Estoque MH') return '#ffffff';
  return 'inherit';
};

function MovimentacoesEstoque() {
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [insumos, setInsumos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRow, setSavingRow] = useState(false);

  // New row state
  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [newRow, setNewRow] = useState({
    insumo_id: "",
    data_movimentacao: getToday(),
    quantidade: "",
    origem: "Compras",
    destino: "Estoque MH"
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      // Fetch insumos
      const { data: insumosData, error: insumosError } = await supabase
        .from("cadastro_insumos")
        .select("id, nome")
        .order("nome", { ascending: true });
        
      if (insumosError) throw insumosError;
      setInsumos(insumosData || []);

      // Fetch movimentacoes
      const { data: movData, error: movError } = await supabase
        .from("movimentacoes_estoque")
        .select(`
          id,
          data_movimentacao,
          quantidade,
          origem,
          destino,
          insumo_id,
          created_at,
          cadastro_insumos(nome)
        `)
        .order("data_movimentacao", { ascending: false })
        .order("created_at", { ascending: false });

      if (movError) throw movError;
      setMovimentacoes(movData || []);

    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      alert("Erro ao carregar as movimentações.");
    } finally {
      setLoading(false);
    }
  }

  const handleAddRow = async () => {
    if (!newRow.insumo_id || !newRow.data_movimentacao || !newRow.quantidade || !newRow.origem || !newRow.destino) {
      alert("Por favor, preencha todos os campos para adicionar a movimentação.");
      return;
    }

    if (newRow.origem === newRow.destino) {
      alert("A Origem e o Destino não podem ser a mesma unidade!");
      return;
    }

    try {
      setSavingRow(true);
      const { data, error } = await supabase
        .from("movimentacoes_estoque")
        .insert([{
          insumo_id: newRow.insumo_id,
          data_movimentacao: newRow.data_movimentacao,
          quantidade: parseFloat(newRow.quantidade),
          origem: newRow.origem,
          destino: newRow.destino
        }])
        .select(`
          id,
          data_movimentacao,
          quantidade,
          origem,
          destino,
          insumo_id,
          created_at,
          cadastro_insumos(nome)
        `)
        .single();

      if (error) throw error;

      // Add to list and force sort
      setMovimentacoes(prev => {
        const updated = [data, ...prev];
        return updated.sort((a, b) => {
          const dateA = new Date(a.data_movimentacao).getTime();
          const dateB = new Date(b.data_movimentacao).getTime();
          if (dateB !== dateA) return dateB - dateA;
          // Fallback to created_at if dates are the same
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        });
      });
      
      // Clear specific fields but keep date and maybe origins to speed up input
      setNewRow({
        ...newRow,
        insumo_id: "",
        quantidade: ""
      });

    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar a movimentação: " + (err.message || JSON.stringify(err)));
    } finally {
      setSavingRow(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir esta movimentação? O histórico será perdido.")) return;
    try {
      const { error } = await supabase
        .from("movimentacoes_estoque")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setMovimentacoes(movimentacoes.filter(m => m.id !== id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao excluir a movimentação.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Movimentações de Estoque</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Movimentações de Estoque</h1>
            <p>Registre entradas de compras e transferências entre as unidades.</p>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          
          <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <table className="freq-table" style={{ minWidth: "1000px" }}>
              <thead>
                <tr>
                  <th style={{ width: "300px" }}>Insumo</th>
                  <th style={{ textAlign: "center", width: "130px" }}>Data</th>
                  <th style={{ textAlign: "center", width: "100px" }}>Quantidade</th>
                  <th style={{ textAlign: "center", width: "160px" }}>Origem</th>
                  <th style={{ textAlign: "center", width: "160px" }}>Destino</th>
                  <th style={{ textAlign: "center", width: "80px" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {/* Linha de Nova Inserção (Estilo Planilha) */}
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #cbd5e1" }}>
                  <td style={{ padding: "8px" }}>
                    <select
                      value={newRow.insumo_id}
                      onChange={(e) => setNewRow({ ...newRow, insumo_id: e.target.value })}
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                    >
                      <option value="">-- Selecione o Insumo --</option>
                      {insumos.map(ins => (
                        <option key={ins.id} value={ins.id}>{ins.nome}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "8px" }}>
                    <input
                      type="date"
                      value={newRow.data_movimentacao}
                      onChange={(e) => setNewRow({ ...newRow, data_movimentacao: e.target.value })}
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center" }}
                    />
                  </td>
                  <td style={{ padding: "8px" }}>
                    <input
                      type="number"
                      step="0.001"
                      placeholder="Qtd"
                      value={newRow.quantidade}
                      onChange={(e) => setNewRow({ ...newRow, quantidade: e.target.value })}
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center" }}
                    />
                  </td>
                  <td style={{ padding: "8px" }}>
                    <select
                      value={newRow.origem}
                      onChange={(e) => setNewRow({ ...newRow, origem: e.target.value })}
                      style={{ 
                        width: "100%", 
                        padding: "8px", 
                        borderRadius: "4px", 
                        border: "1px solid transparent",
                        backgroundColor: getUnitBgColor(newRow.origem),
                        color: getUnitColor(newRow.origem),
                        fontWeight: 500
                      }}
                    >
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "8px" }}>
                    <select
                      value={newRow.destino}
                      onChange={(e) => setNewRow({ ...newRow, destino: e.target.value })}
                      style={{ 
                        width: "100%", 
                        padding: "8px", 
                        borderRadius: "4px", 
                        border: "1px solid transparent",
                        backgroundColor: getUnitBgColor(newRow.destino),
                        color: getUnitColor(newRow.destino),
                        fontWeight: 500
                      }}
                    >
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </td>
                  <td style={{ textAlign: "center", padding: "8px" }}>
                    <button
                      onClick={handleAddRow}
                      disabled={savingRow}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "var(--primary-color)",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: savingRow ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        width: "100%"
                      }}
                    >
                      {savingRow ? <Icons.BsArrowClockwise className="spin" /> : "Salvar"}
                    </button>
                  </td>
                </tr>

                {/* Espaçador Visial */}
                <tr style={{ height: "24px", backgroundColor: "transparent" }}>
                  <td colSpan={6} style={{ border: "none", padding: 0 }}></td>
                </tr>

                {/* Linhas Existentes (Histórico) */}
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                      <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                    </td>
                  </tr>
                ) : movimentacoes.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      Nenhuma movimentação registrada.
                    </td>
                  </tr>
                ) : (
                  movimentacoes.map((mov) => {
                    const dataFormatada = new Date(mov.data_movimentacao + 'T00:00:00').toLocaleDateString('pt-BR');
                    
                    return (
                      <tr key={mov.id}>
                        <td>{mov.cadastro_insumos?.nome || "Insumo Excluído"}</td>
                        <td style={{ textAlign: "center" }}>{dataFormatada}</td>
                        <td style={{ textAlign: "center", fontWeight: "bold" }}>{mov.quantidade}</td>
                        <td style={{ 
                          textAlign: "center", 
                          backgroundColor: getUnitBgColor(mov.origem),
                          color: getUnitColor(mov.origem)
                        }}>
                          {mov.origem}
                        </td>
                        <td style={{ 
                          textAlign: "center", 
                          backgroundColor: getUnitBgColor(mov.destino),
                          color: getUnitColor(mov.destino)
                        }}>
                          {mov.destino}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            onClick={() => handleDelete(mov.id)}
                            className="delete-record-btn"
                            title="Excluir Movimentação"
                            style={{ margin: "0 auto" }}
                          >
                            <Icons.BsTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
}

export default MovimentacoesEstoque;
