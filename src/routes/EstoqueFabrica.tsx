import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";
import "../css/Frequencia.css";

function EstoqueFabrica() {
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

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editRowData, setEditRowData] = useState<any>({});

  const [newRow, setNewRow] = useState({
    produto_id: "",
    data_producao: getToday(),
    peso_bruto: "",
    tara: "",
    peso_liquido: "",
    validade: ""
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
            .select("id, nome, ativo, codigo")
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
          codigo,
          data_producao,
          peso_bruto,
          tara,
          peso_liquido,
          data_entrada,
          destino,
          validade,
          produto_id,
          created_at,
          user_id,
          cadastro_produtos!inner(nome, codigo),
          profiles(name)
        `, { count: 'exact' })
        .is('data_entrada', null)
        .is('destino', null);

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



  return (
    <>
      <Helmet>
        <title>Estoque Fábrica</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div>
              <h1>Estoque Fábrica</h1>
              <p>Visualização das produções que ainda não tiveram sua entrada e destino registrados.</p>
            </div>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>



          <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <table className="freq-table" style={{ minWidth: "1400px" }}>
              <thead>
                <tr>
                  <th style={{ width: "150px", textAlign: "center" }}>Cód de Produção</th>
                  <th style={{ width: "100px", textAlign: "center" }}>Cód Produto</th>
                  <th style={{ width: "250px" }}>Produto</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Data Produção</th>
                  <th style={{ textAlign: "center", width: "100px" }}>Peso Bruto (kg)</th>
                  <th style={{ textAlign: "center", width: "100px" }}>Tara (kg)</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Peso Líquido (kg)</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Data Entrada</th>
                  <th style={{ textAlign: "center", width: "150px" }}>Destino</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Validade</th>
                  <th style={{ textAlign: "center", width: "150px" }}>Usuário</th>

                </tr>
                {/* Linha de Filtros */}
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "8px" }}></th>
                  <th style={{ padding: "8px" }}></th>
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
                  <th colSpan={7} style={{ padding: "8px", textAlign: "right" }}>
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
                    <td colSpan={12} style={{ textAlign: "center", padding: "40px" }}>
                      <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                    </td>
                  </tr>
                ) : producoes.length === 0 ? (
                  <tr>
                    <td colSpan={12} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
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
                        <td style={{ textAlign: "center", fontWeight: "bold" }}>{prod.codigo || "-"}</td>
                        <td style={{ textAlign: "center" }}>{prod.cadastro_produtos?.codigo || "-"}</td>
                        <td style={{ fontWeight: "500" }}>{prod.cadastro_produtos?.nome || "-"}</td>
                        <td style={{ textAlign: "center" }}>
                          {prod.data_producao ? new Date(prod.data_producao + "T12:00:00").toLocaleDateString('pt-BR') : "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span style={{ color: prod.peso_bruto < 0 ? "#ef4444" : "inherit" }}>
                            {prod.peso_bruto != null ? Number(prod.peso_bruto).toFixed(3) : "-"}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span style={{ color: prod.tara < 0 ? "#ef4444" : "inherit" }}>
                            {prod.tara != null ? Number(prod.tara).toFixed(3) : "-"}
                          </span>
                        </td>
                        <td style={{ textAlign: "center", fontWeight: "bold", color: prod.peso_liquido < 0 ? "#ef4444" : "inherit" }}>{prod.peso_liquido != null ? Number(prod.peso_liquido).toFixed(3) : "-"}</td>
                        <td style={{ textAlign: "center" }}>
                          -
                        </td>
                        <td style={{ textAlign: "center" }}>
                          -
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {prod.validade ? new Date(prod.validade + "T12:00:00").toLocaleDateString('pt-BR') : "-"}
                        </td>
                        <td style={{ textAlign: "center", color: "#64748b" }}>
                          {prod.profiles?.name || "Desconhecido"}
                        </td>

                      </tr>
                    );
                  })
                )}
                
                {hasMore && producoes.length > 0 && (
                  <tr>
                    <td colSpan={12} style={{ textAlign: "center", padding: "16px" }}>
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
                  <td colSpan={12} style={{ textAlign: "right", padding: "12px 16px", color: "#64748b" }}>
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

export default EstoqueFabrica;
