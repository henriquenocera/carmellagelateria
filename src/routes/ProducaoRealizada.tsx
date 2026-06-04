import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";
import "../css/Frequencia.css";

function ProducaoRealizada() {
  const { user, isAdmin } = useAuth();
  const [producoes, setProducoes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
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
  const [filterProdutoId, setFilterProdutoId] = useState<string | null>(null);
  const [filterData, setFilterData] = useState("");

  const isFirstRender = useRef(true);

  // New row state
  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [newRow, setNewRow] = useState({
    produto_id: "",
    data_producao: getToday(),
    quantidade: ""
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData(false, 0, filterProdutoId, filterData);
      return;
    }
    setPage(0);
    fetchData(false, 0, filterProdutoId, filterData);
  }, [filterProdutoId, filterData]);

  const fetchDataRef = useRef<any>(null);

  useEffect(() => {
    const channel = supabase.channel('realtime-producao')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'producao_realizada' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNewlyAddedId(payload.new.id);
            setTimeout(() => {
              setNewlyAddedId(current => current === payload.new.id ? null : current);
            }, 3000);
          }
          if (fetchDataRef.current) {
            fetchDataRef.current(false, 0, undefined, undefined, true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchData(isLoadMore = false, overridePage: number | null = null, fProdutoId = filterProdutoId, fData = filterData, isBackground = false) {
    fetchDataRef.current = fetchData;
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        if (!isBackground) setLoading(true);
        if (produtos.length === 0) {
          // Fetch produtos only on initial load
          const { data: produtosData, error: produtosError } = await supabase
            .from("cadastro_produtos")
            .select("id, nome, ativo")
            .eq("is_sabor", true)
            .order("nome", { ascending: true });

          if (produtosError) throw produtosError;
          setProdutos(produtosData || []);
        }
      }

      const currentPage = overridePage !== null ? overridePage : (isLoadMore ? page : 0);
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Fetch producao
      let query = supabase
        .from("producao_realizada")
        .select(`
          id,
          data_producao,
          quantidade,
          produto_id,
          created_at,
          user_id,
          cadastro_produtos!inner(nome),
          profiles(name)
        `, { count: 'exact' });

      if (fProdutoId) query = query.eq('produto_id', fProdutoId);
      if (fData) query = query.eq('data_producao', fData);

      const { data: prodData, count, error: prodError } = await query
        .order("data_producao", { ascending: false })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(from, to);

      if (prodError) throw prodError;

      const newProds = prodData || [];

      if (isLoadMore) {
        setProducoes(prev => [...prev, ...newProds]);
      } else {
        setProducoes(newProds);
        if (count !== null) setTotalCount(count);
      }

      setHasMore(newProds.length === PAGE_SIZE);
      setPage(isLoadMore ? currentPage + 1 : 1);

    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      alert("Erro ao carregar a produção: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const handleAddRow = async () => {
    if (!newRow.produto_id || !newRow.data_producao || !newRow.quantidade) {
      alert("Por favor, preencha todos os campos para adicionar a produção.");
      return;
    }

    setSavingRow(true);

    try {
      const { data, error } = await supabase
        .from("producao_realizada")
        .insert([{
          produto_id: newRow.produto_id,
          data_producao: newRow.data_producao,
          quantidade: parseFloat(newRow.quantidade),
          user_id: user?.id
        }])
        .select(`
          id,
          data_producao,
          quantidade,
          produto_id,
          created_at,
          user_id,
          cadastro_produtos(nome),
          profiles(name)
        `)
        .single();

      if (error) throw error;

      // Add to list and force sort
      setProducoes(prev => {
        const updated = [data, ...prev];
        return updated.sort((a, b) => {
          const dateA = new Date(a.data_producao).getTime();
          const dateB = new Date(b.data_producao).getTime();
          if (dateB !== dateA) return dateB - dateA;
          // Fallback to created_at if dates are the same
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        });
      });

      setNewlyAddedId(data.id);
      setTimeout(() => {
        setNewlyAddedId(current => current === data.id ? null : current);
      }, 5500);

      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 2000);

      // Clear specific fields but keep date to speed up input
      setNewRow({
        ...newRow,
        produto_id: "",
        quantidade: ""
      });

      // Retornar o foco para o select de produtos após salvar
      setTimeout(() => {
        if (selectRef.current) {
          selectRef.current.focus();
        }
      }, 100);

    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar a produção: " + (err.message || JSON.stringify(err)));
    } finally {
      setSavingRow(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este registro de produção?")) return;
    try {
      const { error } = await supabase
        .from("producao_realizada")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setProducoes(producoes.filter(p => p.id !== id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao excluir o registro.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Produção Realizada</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div>
              <h1>Produção Realizada</h1>
              <p>Registre e acompanhe as produções diárias de gelatos, preparações e outros produtos.</p>
            </div>
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
              Registrar Produção
            </h3>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "flex-end"
            }}>
              <div style={{ flex: "2 1 250px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Produto</label>
                <Select
                  ref={selectRef}
                  autoFocus
                  menuPortalTarget={document.body}
                  maxMenuHeight={350}
                  options={produtos.filter(p => p.ativo !== false).map(p => ({ value: p.id, label: p.nome }))}
                  value={newRow.produto_id ? { value: newRow.produto_id, label: produtos.find(p => p.id === newRow.produto_id)?.nome } : null}
                  onChange={(selectedOption) => setNewRow({ ...newRow, produto_id: selectedOption ? selectedOption.value : "" })}
                  placeholder="Buscar Produto..."
                  isClearable
                  noOptionsMessage={() => "Nenhum produto encontrado"}
                  styles={{
                    control: (base) => ({ ...base, borderColor: '#cbd5e1', minHeight: '46px', borderRadius: '4px', fontSize: '1.2rem' }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: '1.2rem' })
                  }}
                />
              </div>
              <div style={{ flex: "1 1 150px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Data da Produção</label>
                <input
                  type="date"
                  value={newRow.data_producao}
                  onChange={(e) => setNewRow({ ...newRow, data_producao: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "46px", fontSize: "1.2rem" }}
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Quantidade</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Qtd Produzida"
                  value={newRow.quantidade}
                  onChange={(e) => setNewRow({ ...newRow, quantidade: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "46px", fontSize: "1.2rem" }}
                />
              </div>
              <div style={{ flex: "0 0 150px", position: "relative" }}>
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
            <table className="freq-table" style={{ minWidth: "800px" }}>
              <thead>
                <tr>
                  <th style={{ width: "350px" }}>Produto</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Data</th>
                  <th style={{ textAlign: "center", width: "100px" }}>Quantidade</th>
                  <th style={{ textAlign: "center", width: "150px" }}>Usuário</th>
                  <th style={{ textAlign: "center", width: "80px" }}>Ações</th>
                </tr>
                {/* Linha de Filtros */}
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "8px" }}>
                    <Select
                      menuPortalTarget={document.body}
                      maxMenuHeight={350}
                      options={produtos.map(p => ({ value: p.id, label: p.nome }))}
                      value={filterProdutoId ? { value: filterProdutoId, label: produtos.find(p => p.id === filterProdutoId)?.nome } : null}
                      onChange={(selectedOption) => setFilterProdutoId(selectedOption ? selectedOption.value : null)}
                      placeholder="Filtrar Produto..."
                      isClearable
                      noOptionsMessage={() => "Nenhum produto encontrado"}
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
                  <th colSpan={3} style={{ padding: "8px", textAlign: "right" }}>
                    <button
                      onClick={() => {
                        setFilterProdutoId(null);
                        setFilterData("");
                      }}
                      className="cancel-btn"
                      style={{ padding: "6px 12px", fontSize: "0.9rem" }}
                      title="Limpar todos os filtros"
                    >
                      <Icons.BsFunnel /> Limpar Filtros
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && producoes.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                      <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                    </td>
                  </tr>
                ) : producoes.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      Nenhum registro de produção encontrado.
                    </td>
                  </tr>
                ) : (
                  producoes.map((prod) => {
                    const isNew = newlyAddedId === prod.id;
                    const isDeleting = false;
                    
                    return (
                      <tr 
                        key={prod.id} 
                        style={{ 
                          backgroundColor: isNew ? '#dcfce7' : 'inherit',
                          opacity: isDeleting ? 0.6 : 1,
                          transition: "all 0.5s ease"
                        }}
                      >
                        <td style={{ fontWeight: "500" }}>{prod.cadastro_produtos?.nome || "-"}</td>
                        <td style={{ textAlign: "center" }}>
                          {prod.data_producao ? new Date(prod.data_producao + "T12:00:00").toLocaleDateString('pt-BR') : "-"}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: "bold", color: "var(--primary-color)" }}>
                          {prod.quantidade}
                        </td>
                        <td style={{ textAlign: "center", color: "#64748b" }}>
                          {prod.profiles?.name || "Desconhecido"}
                        </td>
                        <td style={{ textAlign: "center", padding: "4px" }}>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="delete-record-btn"
                            title="Excluir Registro"
                            style={{ margin: "0 auto" }}
                          >
                            <Icons.BsTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
                
                {hasMore && producoes.length > 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "16px" }}>
                      <button 
                        onClick={() => fetchData(true)}
                        disabled={loadingMore}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--primary-color)",
                          fontWeight: "bold",
                          cursor: loadingMore ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          margin: "0 auto",
                          fontSize: "1.1rem"
                        }}
                      >
                        {loadingMore ? (
                          <><Icons.BsArrowClockwise className="spin" /> Carregando mais...</>
                        ) : (
                          <><Icons.BsChevronDown /> Mostrar mais resultados</>
                        )}
                      </button>
                    </td>
                  </tr>
                )}
                <tr style={{ backgroundColor: "#f8fafc", fontWeight: "bold" }}>
                  <td colSpan={5} style={{ textAlign: "right", padding: "12px 16px", color: "#64748b" }}>
                    Total de registros encontrados: {totalCount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProducaoRealizada;
