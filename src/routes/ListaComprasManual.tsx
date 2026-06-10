import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import supabase from "../services/supabase-client";

function ListaComprasManual() {
  const [loading, setLoading] = useState(true);
  const [insumos, setInsumos] = useState<any[]>([]);
  const [lista, setLista] = useState<any[]>([]);
  const [entradasByInsumo, setEntradasByInsumo] = useState<Record<string, any[]>>({});
  
  const [selectedInsumo, setSelectedInsumo] = useState<any>(null);
  const [quantidade, setQuantidade] = useState<string>("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      const entradasPromise = supabase
        .from("entradas_mercadoria")
        .select("insumo_id, data_compra, fornecedor, valor_unitario")
        .order("data_compra", { ascending: false })
        .order("created_at", { ascending: false })
        .then(res => {
          if (res.error && res.error.code === '42P01') return { data: [] };
          if (res.error) throw res.error;
          return res;
        });

      const [resInsumos, resLista, resEntradas] = await Promise.all([
        supabase.from("cadastro_insumos").select("*").eq("ativo", true).order("nome", { ascending: true }),
        supabase.from("lista_compras_manual").select("id, quantidade, insumo_id, comprado, cadastro_insumos(nome, tipo, unidade_conversao)").order("created_at", { ascending: true }),
        entradasPromise
      ]);

      if (resInsumos.error) throw resInsumos.error;
      if (resLista.error) throw resLista.error;

      setInsumos(resInsumos.data || []);
      setLista(resLista.data || []);

      const allEntradas = resEntradas.data || [];
      const tempEntradas: Record<string, any[]> = {};
      allEntradas.forEach(e => {
         if (!tempEntradas[e.insumo_id]) tempEntradas[e.insumo_id] = [];
         tempEntradas[e.insumo_id].push(e);
      });
      setEntradasByInsumo(tempEntradas);

    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      alert("Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!selectedInsumo || !quantidade || Number(quantidade) <= 0) {
      alert("Selecione um insumo e informe uma quantidade maior que zero.");
      return;
    }

    try {
      setAdding(true);
      const { data, error } = await supabase
        .from("lista_compras_manual")
        .insert([{ insumo_id: selectedInsumo.value, quantidade: Number(quantidade) }])
        .select("id, quantidade, insumo_id, comprado, cadastro_insumos(nome, tipo, unidade_conversao)")
        .single();
        
      if (error) throw error;
      
      setLista([...lista, data]);
      setSelectedInsumo(null);
      setQuantidade("");
    } catch (err) {
      console.error("Erro ao adicionar:", err);
      alert("Erro ao adicionar à lista.");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Remover este item da lista?")) return;
    try {
      const { error } = await supabase.from("lista_compras_manual").delete().eq("id", id);
      if (error) throw error;
      setLista(lista.filter(item => item.id !== id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao excluir item.");
    }
  }

  async function handleToggleComprado(id: number, currentStatus: boolean) {
    const newStatus = !currentStatus;
    
    // Optimistic update
    setLista(lista.map(item => item.id === id ? { ...item, comprado: newStatus } : item));

    try {
      const { error } = await supabase.from("lista_compras_manual").update({ comprado: newStatus }).eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      // Revert on error
      setLista(lista.map(item => item.id === id ? { ...item, comprado: currentStatus } : item));
      alert("Erro ao marcar item como comprado.");
    }
  }

  async function handleClearList() {
    if (lista.length === 0) return;
    if (!window.confirm("Tem certeza que deseja LIMPAR TODA A LISTA? Essa ação não pode ser desfeita.")) return;
    
    try {
      const { error } = await supabase.from("lista_compras_manual").delete().neq("id", 0); // Delete all
      if (error) throw error;
      setLista([]);
    } catch (err) {
      console.error("Erro ao limpar lista:", err);
      alert("Erro ao limpar a lista.");
    }
  }

  const getStats = (insumoId: string) => {
    const list = entradasByInsumo[insumoId] || [];
    if (list.length === 0) return null;
    const last = list[0];
    let min = Number(list[0].valor_unitario);
    let max = Number(list[0].valor_unitario);
    let sum = 0;
    list.forEach(item => {
        const val = Number(item.valor_unitario);
        if (val < min) min = val;
        if (val > max) max = val;
        sum += val;
    });
    return {
        ultimoValor: Number(last.valor_unitario),
        ultimaData: last.data_compra,
        ultimoFornecedor: last.fornecedor,
        media: sum / list.length,
        menor: min,
        maior: max
    };
  };

  const formatCurrency = (val: number | null | undefined) => (val != null && !isNaN(val)) ? `R$ ${val.toFixed(2).replace('.', ',')}` : "-";
  const formatDateBR = (isoStr: string) => {
    if (!isoStr) return "-";
    const [y, m, d] = isoStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const getTagStyles = (tipo: string) => {
    switch (tipo) {
      case "Insumos": return { bg: "#e0f2fe", color: "#0284c7", border: "#bae6fd" };
      case "Matéria Prima": return { bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" };
      case "Bebidas": return { bg: "#f3e8ff", color: "#9333ea", border: "#e9d5ff" };
      case "Material de Limpeza": return { bg: "#ccfbf1", color: "#0d9488", border: "#99f6e4" };
      case "Salgados": return { bg: "#ffedd5", color: "#ea580c", border: "#fed7aa" };
      default: return { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" };
    }
  };

  const insumoOptions = insumos.map(i => ({ value: i.id, label: i.nome }));

  const sortedLista = [...lista].sort((a, b) => {
    if (a.comprado === b.comprado) {
      return a.id - b.id; // Keep insertion order
    }
    return a.comprado ? 1 : -1;
  });

  return (
    <>
      <Helmet>
        <title>Lista de Compras (Manual)</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Lista de Compras (Manual)</h1>
            <p>Monte sua lista de compras adicionando insumos manualmente.</p>
          </div>
          <button 
            onClick={handleClearList} 
            disabled={lista.length === 0}
            style={{ 
              backgroundColor: "#ef4444", 
              color: "white", 
              padding: "10px 20px", 
              borderRadius: "8px", 
              border: "none", 
              fontWeight: "bold", 
              cursor: lista.length === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: lista.length === 0 ? 0.5 : 1
            }}
          >
            <Icons.BsTrash /> Limpar Lista
          </button>
        </div>

        <div style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          {/* Card de Adição */}
          <div style={{
            backgroundColor: "#fff", padding: "24px", borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)", marginBottom: "24px", border: "1px solid #e2e8f0",
            display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap"
          }}>
            <div style={{ flex: "1 1 300px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#334155" }}>
                Insumo
              </label>
              <Select
                options={insumoOptions}
                value={selectedInsumo}
                onChange={setSelectedInsumo}
                placeholder="Selecione o insumo..."
                isSearchable
                styles={{ container: (base) => ({ ...base, flex: 1 }) }}
              />
            </div>
            <div style={{ flex: "0 0 150px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#334155" }}>
                Quantidade
              </label>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Ex: 10"
                style={{ width: "100%", padding: "9px 12px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
              />
            </div>
            <button 
              onClick={handleAdd}
              disabled={adding}
              style={{
                backgroundColor: "#16a34a", color: "white", padding: "10px 24px", borderRadius: "6px",
                border: "none", fontWeight: "bold", cursor: adding ? "not-allowed" : "pointer",
                height: "38px", display: "flex", alignItems: "center", gap: "8px"
              }}
            >
              {adding ? <Icons.BsArrowClockwise className="spin" /> : <Icons.BsPlusCircle />} 
              Adicionar
            </button>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : lista.length === 0 ? (
             <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
               <Icons.BsCartX style={{ fontSize: "3rem", color: "#94a3b8", marginBottom: "16px" }} />
               <p style={{ color: "var(--text-dark)", fontSize: "1.4rem", fontWeight: 600, margin: 0 }}>
                 Lista Vazia
               </p>
               <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginTop: "8px" }}>
                 Sua lista de compras manual está vazia. Adicione insumos acima.
               </p>
             </div>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <table className="freq-table" style={{ minWidth: "1500px" }}>
                <thead>
                  <tr style={{ fontSize: "1.1rem" }}>
                    <th style={{ width: "50px", textAlign: "center" }}>
                      <Icons.BsCheck2Square />
                    </th>
                    <th style={{ width: "200px" }}>Insumo</th>
                    <th style={{ width: "100px" }}>Tipo</th>
                    <th style={{ width: "100px", textAlign: "center" }}>Unid. Medida</th>
                    <th style={{ width: "100px", textAlign: "center", borderRight: "2px solid #e2e8f0" }}>Qtd a Comprar</th>
                    <th style={{ width: "100px", textAlign: "center", backgroundColor: "#f8fafc" }}>Último Valor</th>
                    <th style={{ width: "100px", textAlign: "center", backgroundColor: "#f8fafc" }}>Última Data</th>
                    <th style={{ width: "150px", textAlign: "center", backgroundColor: "#f8fafc", borderRight: "2px solid #e2e8f0" }}>Último Forn.</th>
                    <th style={{ width: "100px", textAlign: "center", backgroundColor: "#fffbeb" }}>Média</th>
                    <th style={{ width: "100px", textAlign: "center", backgroundColor: "#fffbeb" }}>Menor</th>
                    <th style={{ width: "100px", textAlign: "center", backgroundColor: "#fffbeb", borderRight: "2px solid #e2e8f0" }}>Maior</th>
                    <th style={{ width: "100px", textAlign: "center" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLista.map((item) => {
                    const tagStyle = getTagStyles(item.cadastro_insumos?.tipo || "");
                    const stats = getStats(item.insumo_id) || {};
                    const isComprado = item.comprado;
                    
                    return (
                      <tr key={item.id} style={{ 
                        opacity: isComprado ? 0.5 : 1, 
                        backgroundColor: isComprado ? "#f1f5f9" : "transparent" 
                      }}>
                        <td style={{ textAlign: "center" }}>
                          <input 
                            type="checkbox" 
                            checked={isComprado || false}
                            onChange={() => handleToggleComprado(item.id, isComprado || false)}
                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                          />
                        </td>
                        <td style={{ fontWeight: 600, fontSize: "1.2rem", textDecoration: isComprado ? "line-through" : "none" }}>
                          {item.cadastro_insumos?.nome || "Insumo Excluído"}
                        </td>
                        <td>
                          <span style={{
                            padding: "4px 8px", backgroundColor: tagStyle.bg, borderRadius: "6px", 
                            fontSize: "0.9rem", fontWeight: 600, color: tagStyle.color, border: `1px solid ${tagStyle.border}`, whiteSpace: "nowrap"
                          }}>
                            {item.cadastro_insumos?.tipo || "-"}
                          </span>
                        </td>
                        <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "var(--text-dark)" }}>
                          {item.cadastro_insumos?.unidade_conversao || "-"}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.4rem", color: "var(--primary-color)", borderRight: "2px solid #e2e8f0" }}>
                          {item.quantidade}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "#475569", backgroundColor: "#f8fafc" }}>
                          {formatCurrency(stats.ultimoValor)}
                        </td>
                        <td style={{ textAlign: "center", fontSize: "1.1rem", color: "#475569", backgroundColor: "#f8fafc" }}>
                          {formatDateBR(stats.ultimaData)}
                        </td>
                        <td style={{ textAlign: "center", fontSize: "1.1rem", color: "#475569", backgroundColor: "#f8fafc", borderRight: "2px solid #e2e8f0" }}>
                          {stats.ultimoFornecedor || "-"}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "#92400e", backgroundColor: "#fffbeb" }}>
                          {formatCurrency(stats.media)}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "#92400e", backgroundColor: "#fffbeb" }}>
                          {formatCurrency(stats.menor)}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: 600, fontSize: "1.1rem", color: "#92400e", backgroundColor: "#fffbeb", borderRight: "2px solid #e2e8f0" }}>
                          {formatCurrency(stats.maior)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="delete-record-btn"
                            title="Remover da lista"
                            style={{ margin: "0 auto", padding: "6px 10px", fontSize: "1rem" }}
                          >
                            <Icons.BsTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ListaComprasManual;
