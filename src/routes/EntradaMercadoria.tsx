import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import supabase from "../supabase-client";

function EntradaMercadoria() {
  const [compras, setCompras] = useState<any[]>([]);
  const [insumos, setInsumos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRow, setSavingRow] = useState(false);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const selectRef = useRef<any>(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 100;

  // Filters state
  const [filterInsumoId, setFilterInsumoId] = useState<string | null>(null);
  const [filterData, setFilterData] = useState("");
  const [filterFornecedor, setFilterFornecedor] = useState("");

  const isFirstRender = useRef(true);

  // New row state
  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [newRow, setNewRow] = useState({
    insumo_id: "",
    data_compra: getToday(),
    fornecedor: "",
    quantidade_comprada: "",
    valor_unitario: ""
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData(false, 0, filterInsumoId, filterData, filterFornecedor);
      return;
    }
    setPage(0);
    fetchData(false, 0, filterInsumoId, filterData, filterFornecedor);
  }, [filterInsumoId, filterData, filterFornecedor]);

  async function fetchData(isLoadMore = false, overridePage: number | null = null, fInsumoId = filterInsumoId, fData = filterData, fFornecedor = filterFornecedor) {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        if (insumos.length === 0) {
          const { data: insumosData, error: insumosError } = await supabase
            .from("cadastro_insumos")
            .select("id, nome, ativo, fornecedor_padrao")
            .order("nome", { ascending: true });
            
          if (insumosError) throw insumosError;
          setInsumos(insumosData || []);
        }
      }

      const currentPage = overridePage !== null ? overridePage : (isLoadMore ? page : 0);
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("entradas_mercadoria")
        .select(`
          id,
          data_compra,
          fornecedor,
          quantidade_comprada,
          valor_unitario,
          insumo_id,
          created_at,
          cadastro_insumos!inner(nome)
        `, { count: 'exact' });

      if (fInsumoId) query = query.eq('insumo_id', fInsumoId);
      if (fData) query = query.eq('data_compra', fData);
      if (fFornecedor) query = query.ilike('fornecedor', `%${fFornecedor}%`);

      const { data: movData, count, error: movError } = await query
        .order("data_compra", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (movError) throw movError;
      
      const newMovs = movData || [];
      
      if (isLoadMore) {
        setCompras(prev => [...prev, ...newMovs]);
      } else {
        setCompras(newMovs);
        if (count !== null) setTotalCount(count);
      }
      
      setHasMore(newMovs.length === PAGE_SIZE);
      setPage(isLoadMore ? currentPage + 1 : 1);

    } catch (err: any) {
      console.error("Erro ao buscar dados:", err);
      // Se a tabela não existir ainda, mostramos um erro amigável
      if (err.code === "42P01") {
         console.warn("A tabela entradas_mercadoria não existe no Supabase.");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const handleAddRow = async () => {
    if (!newRow.insumo_id || !newRow.data_compra || !newRow.quantidade_comprada || !newRow.valor_unitario) {
      alert("Por favor, preencha insumo, data, quantidade e valor unitário.");
      return;
    }

    try {
      setSavingRow(true);

      // 1. Inserir a compra na tabela
      const { data, error } = await supabase
        .from("entradas_mercadoria")
        .insert([{
          insumo_id: newRow.insumo_id,
          data_compra: newRow.data_compra,
          fornecedor: newRow.fornecedor,
          quantidade_comprada: Number(newRow.quantidade_comprada),
          valor_unitario: Number(newRow.valor_unitario.replace(",", "."))
        }])
        .select(`
          id,
          data_compra,
          fornecedor,
          quantidade_comprada,
          valor_unitario,
          insumo_id,
          created_at,
          cadastro_insumos(nome)
        `)
        .single();

      if (error) throw error;

      // 2. Atualizar o custo do insumo
      const { error: errUpdate } = await supabase
        .from("cadastro_insumos")
        .update({ custo_atualizado: Number(newRow.valor_unitario.replace(",", ".")) })
        .eq("id", newRow.insumo_id);

      if (errUpdate) {
        console.error("Erro ao atualizar custo no insumo:", errUpdate);
        alert("A entrada foi salva, mas houve um erro ao atualizar o custo_atualizado no insumo.");
      }

      setCompras(prev => {
        const updated = [data, ...prev];
        return updated.sort((a, b) => {
          const dateA = new Date(a.data_compra).getTime();
          const dateB = new Date(b.data_compra).getTime();
          if (dateB !== dateA) return dateB - dateA;
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        });
      });
      
      setNewlyAddedId(data.id);
      setTimeout(() => {
        setNewlyAddedId(current => current === data.id ? null : current);
      }, 5500);
      
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 2000);
      
      setNewRow({
        ...newRow,
        insumo_id: "",
        fornecedor: "",
        quantidade_comprada: "",
        valor_unitario: ""
      });

      setTimeout(() => {
        if (selectRef.current) {
          selectRef.current.focus();
        }
      }, 100);

    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      if (err.code === "42P01") {
         alert("A tabela 'entradas_mercadoria' ainda não foi criada no banco de dados.");
      } else {
         alert("Erro ao salvar a entrada de mercadoria: " + (err.message || JSON.stringify(err)));
      }
    } finally {
      setSavingRow(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir esta entrada de mercadoria?")) return;
    try {
      const { error } = await supabase
        .from("entradas_mercadoria")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setCompras(compras.filter(m => m.id !== id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao excluir o registro.");
    }
  };

  const handleInsumoSelect = (selectedOption: any) => {
    if (selectedOption) {
       const insumo = insumos.find(i => i.id === selectedOption.value);
       setNewRow({ 
         ...newRow, 
         insumo_id: selectedOption.value,
         fornecedor: insumo?.fornecedor_padrao || newRow.fornecedor 
       });
    } else {
       setNewRow({ ...newRow, insumo_id: "" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Entrada de Mercadoria</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Entrada de Mercadoria</h1>
            <p>Registre as compras de insumos. Isso atualizará automaticamente o Custo Atualizado do produto.</p>
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
            <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.BsPlusCircleFill style={{ color: "var(--primary-color)" }} />
              Registrar Compra
            </h3>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "flex-end"
            }}>
              <div style={{ flex: "2 1 250px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Insumo</label>
                <Select
                  ref={selectRef}
                  autoFocus
                  menuPortalTarget={document.body}
                  maxMenuHeight={350}
                  options={insumos.filter(ins => ins.ativo !== false).map(ins => ({ value: ins.id, label: ins.nome }))}
                  value={newRow.insumo_id ? { value: newRow.insumo_id, label: insumos.find(i => i.id === newRow.insumo_id)?.nome } : null}
                  onChange={handleInsumoSelect}
                  placeholder="Buscar Insumo..."
                  isClearable
                  noOptionsMessage={() => "Nenhum insumo encontrado"}
                  styles={{
                    control: (base) => ({ ...base, borderColor: '#cbd5e1', minHeight: '46px', borderRadius: '4px', fontSize: '1.2rem' }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: '1.2rem' })
                  }}
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Data da Compra</label>
                <input
                  type="date"
                  value={newRow.data_compra}
                  onChange={(e) => setNewRow({ ...newRow, data_compra: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "46px", fontSize: "1.2rem" }}
                />
              </div>
              <div style={{ flex: "1.5 1 150px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Fornecedor</label>
                <input
                  type="text"
                  placeholder="Nome do Fornecedor"
                  value={newRow.fornecedor}
                  onChange={(e) => setNewRow({ ...newRow, fornecedor: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", height: "46px", fontSize: "1.2rem" }}
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Qtd Comprada</label>
                <input
                  type="number"
                  step="any"
                  placeholder="0"
                  value={newRow.quantidade_comprada}
                  onChange={(e) => setNewRow({ ...newRow, quantidade_comprada: e.target.value })}
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "46px", fontSize: "1.2rem" }}
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Valor Unt. (R$)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={newRow.valor_unitario}
                  onChange={(e) => setNewRow({ ...newRow, valor_unitario: e.target.value })}
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "46px", fontSize: "1.2rem" }}
                />
              </div>
              <div style={{ flex: "0 0 130px", position: "relative" }}>
                {showSavedMessage && (
                  <span className="saved-message-anim" style={{
                    position: "absolute",
                    top: "-24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "#22c55e",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    pointerEvents: "none",
                    whiteSpace: "nowrap"
                  }}>
                    Salvo!
                  </span>
                )}
                <button
                  onClick={handleAddRow}
                  disabled={savingRow}
                  style={{
                    height: "46px",
                    padding: "0",
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: savingRow ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  {savingRow ? <><Icons.BsArrowClockwise className="spin" /> Salvando...</> : <><Icons.BsCheckCircleFill /> Salvar</>}
                </button>
              </div>
            </div>
          </div>

          <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <table className="freq-table" style={{ minWidth: "1000px" }}>
              <thead>
                <tr>
                  <th style={{ width: "250px" }}>Insumo</th>
                  <th style={{ textAlign: "center", width: "130px" }}>Data da Compra</th>
                  <th style={{ textAlign: "center", width: "200px" }}>Fornecedor</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Qtd Comprada</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Valor Unt.</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Total</th>
                  <th style={{ textAlign: "center", width: "80px" }}>Ações</th>
                </tr>
                {/* Linha de Filtros */}
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "8px" }}>
                    <Select
                      menuPortalTarget={document.body}
                      maxMenuHeight={350}
                      options={insumos.map(ins => ({ value: ins.id, label: ins.nome }))}
                      value={filterInsumoId ? { value: filterInsumoId, label: insumos.find(i => i.id === filterInsumoId)?.nome } : null}
                      onChange={(selectedOption) => setFilterInsumoId(selectedOption ? selectedOption.value : null)}
                      placeholder="Filtrar Insumo..."
                      isClearable
                      noOptionsMessage={() => "Nenhum insumo encontrado"}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: '#cbd5e1',
                          minHeight: '38px',
                          borderRadius: '4px',
                          fontSize: '1.1rem'
                        }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                          fontSize: '1.1rem'
                        })
                      }}
                    />
                  </th>
                  <th style={{ padding: "8px" }}>
                    <input
                      type="date"
                      value={filterData}
                      onChange={(e) => setFilterData(e.target.value)}
                      style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.1rem" }}
                    />
                  </th>
                  <th style={{ padding: "8px" }}>
                    <input
                      type="text"
                      placeholder="Fornecedor..."
                      value={filterFornecedor}
                      onChange={(e) => setFilterFornecedor(e.target.value)}
                      style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.1rem" }}
                    />
                  </th>
                  <th style={{ padding: "8px" }}></th>
                  <th style={{ padding: "8px" }}></th>
                  <th style={{ padding: "8px" }}></th>
                  <th style={{ padding: "8px", textAlign: "center" }}>
                    <button
                      onClick={() => {
                        setFilterInsumoId(null);
                        setFilterData("");
                        setFilterFornecedor("");
                      }}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#cbd5e1",
                        color: "#334155",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "0.85rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        transition: "0.2s"
                      }}
                      title="Limpar Filtros"
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#94a3b8"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#cbd5e1"}
                    >
                      <Icons.BsXCircleFill /> Limpar
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                      <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                    </td>
                  </tr>
                ) : compras.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      Nenhuma entrada registrada.
                    </td>
                  </tr>
                ) : (
                  compras.map((comp) => {
                    const dataFormatada = new Date(comp.data_compra + 'T00:00:00').toLocaleDateString('pt-BR');
                    const total = comp.quantidade_comprada * comp.valor_unitario;
                    
                    return (
                      <tr key={comp.id} className={comp.id === newlyAddedId ? "new-row-animation" : ""}>
                        <td style={{ fontWeight: 600 }}>{comp.cadastro_insumos?.nome || "Insumo Excluído"}</td>
                        <td style={{ textAlign: "center" }}>{dataFormatada}</td>
                        <td style={{ textAlign: "center" }}>{comp.fornecedor || "-"}</td>
                        <td style={{ textAlign: "center", fontWeight: "bold" }}>{comp.quantidade_comprada}</td>
                        <td style={{ textAlign: "center", color: "var(--text-dark)" }}>
                          {comp.valor_unitario ? `R$ ${comp.valor_unitario.toFixed(2)}` : "-"}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: "bold", color: "var(--primary-color)" }}>
                          {total ? `R$ ${total.toFixed(2)}` : "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            onClick={() => handleDelete(comp.id)}
                            className="delete-record-btn"
                            title="Excluir"
                            style={{ margin: 0, padding: "4px 8px", fontSize: "0.9rem" }}
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
            
            {!loading && (
              <div style={{ padding: "16px 20px", color: "#64748b", fontSize: "1.1rem", backgroundColor: "#f8fafc", textAlign: "center", borderTop: "2px solid #e2e8f0" }}>
                Mostrando <strong>{compras.length}</strong> de <strong>{totalCount}</strong> totais
              </div>
            )}

            {hasMore && !loading && (
              <div style={{ textAlign: "center", padding: "20px", marginTop: "10px" }}>
                <button
                  onClick={() => fetchData(true)}
                  disabled={loadingMore}
                  style={{
                    padding: "10px 24px",
                    backgroundColor: "#f8fafc",
                    color: "var(--primary-color)",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    cursor: loadingMore ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    fontSize: "1.1rem"
                  }}
                >
                  {loadingMore ? "Carregando..." : "Carregar mais 100 linhas..."}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default EntradaMercadoria;
