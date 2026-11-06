import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import supabase from "../services/supabase-client";
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
  const [totalLiquidWeight, setTotalLiquidWeight] = useState<number | null>(null);
  const liquidWeightRequest = useRef(0);
  const [transferMode, setTransferMode] = useState(false);
  const [transferConfirmOpen, setTransferConfirmOpen] = useState(false);
  const [completedTransfer, setCompletedTransfer] = useState<{ date: string; groups: Array<{ store: string; cubas: any[] }> } | null>(null);
  const [transferLoading, setTransferLoading] = useState(false);
  const [savingTransfers, setSavingTransfers] = useState(false);
  const [transferCubas, setTransferCubas] = useState<any[]>([]);
  const [transferDestinations, setTransferDestinations] = useState<Record<string, "Loja Ahu" | "Loja Alto XV">>({});
  const [currentStoreStockCounts, setCurrentStoreStockCounts] = useState<{ ahu: number; altoxv: number }>({ ahu: 0, altoxv: 0 });
  const [currentStoreCards, setCurrentStoreCards] = useState<{ ahu: any[]; altoxv: any[] }>({ ahu: [], altoxv: [] });
  const [draggedCubaId, setDraggedCubaId] = useState<string | null>(null);
  const [transferPickerDestination, setTransferPickerDestination] = useState<"Loja Ahu" | "Loja Alto XV" | null>(null);
  const [transferSearch, setTransferSearch] = useState("");
  const [transferSearchActiveIndex, setTransferSearchActiveIndex] = useState(0);
  const [hoveredCubaId, setHoveredCubaId] = useState<string | null>(null);
  const transferPickerContainerRef = useRef<HTMLDivElement | null>(null);
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
    if (!transferPickerDestination) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!transferPickerContainerRef.current?.contains(event.target as Node)) {
        setTransferPickerDestination(null);
        setTransferSearch("");
        setTransferSearchActiveIndex(0);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setTransferPickerDestination(null);
        setTransferSearch("");
        setTransferSearchActiveIndex(0);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [transferPickerDestination]);

  const sortFactoryProductions = (rows: any[]) => [...rows].sort((a, b) => {
    const dateOrder = String(b.data_producao || "").localeCompare(String(a.data_producao || ""));
    if (dateOrder !== 0) return dateOrder;
    const flavorOrder = String(a.cadastro_produtos?.nome || "").localeCompare(String(b.cadastro_produtos?.nome || ""), "pt-BR", { sensitivity: "base", numeric: true });
    if (flavorOrder !== 0) return flavorOrder;
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
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
          validade,
          produto_id,
          created_at,
          cadastro_produtos!inner(nome, codigo)
        `, { count: 'exact' })
        .is('data_entrada', null)
        .is('destino', null)
        .not('data_producao', 'is', null)
        .not('peso_bruto', 'is', null)
        .not('tara', 'is', null)
        .or('status_revisao.is.null,status_revisao.neq.pending_delete');

      if (fProdutoId) query = query.eq('produto_id', fProdutoId);
      if (fData) query = query.eq('data_producao', fData);

      const { data: prodData, count, error: prodError } = await query
        .order("data_producao", { ascending: false })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(from, to);

      if (prodError) throw prodError;

      const newProds = sortFactoryProductions(prodData || []);
      if (!isLoadMore) {
        setTotalLiquidWeight(null);
        const requestId = ++liquidWeightRequest.current;
        void fetchTotalLiquidWeight(fProdutoId, fData).then(total => {
          if (liquidWeightRequest.current === requestId) setTotalLiquidWeight(total);
        }).catch(error => {
          console.error("Erro ao calcular o peso líquido total em estoque:", error);
          if (liquidWeightRequest.current === requestId) setTotalLiquidWeight(0);
        });
      }

      if (isLoadMore) {
        setProducoes(prev => sortFactoryProductions([...prev, ...newProds]));
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

  async function fetchTotalLiquidWeight(fProdutoId: string | null, fData: string) {
    const batchSize = 1000;
    let from = 0;
    let total = 0;
    while (true) {
      let query = supabase.from("producao_realizada")
        .select("peso_liquido")
        .is("data_entrada", null)
        .is("destino", null)
        .not("data_producao", "is", null)
        .not("peso_bruto", "is", null)
        .not("tara", "is", null)
        .or("status_revisao.is.null,status_revisao.neq.pending_delete");
      if (fProdutoId) query = query.eq("produto_id", fProdutoId);
      if (fData) query = query.eq("data_producao", fData);
      const { data, error } = await query.range(from, from + batchSize - 1);
      if (error) throw error;
      for (const row of data || []) total += Number((row as any).peso_liquido) || 0;
      if (!data || data.length < batchSize) break;
      from += batchSize;
    }
    return total;
  }

  async function openTransferMode() {
    setTransferLoading(true);
    try {
      const batchSize = 1000;
      let from = 0;
      let allCubas: any[] = [];
      while (true) {
        const { data, error } = await supabase.from("producao_realizada")
          .select("id, codigo, data_producao, peso_bruto, tara, peso_liquido, produto_id, cadastro_produtos!inner(nome, codigo)")
          .is("data_entrada", null)
          .is("destino", null)
          .not("data_producao", "is", null)
          .not("peso_bruto", "is", null)
          .not("tara", "is", null)
          .or("status_revisao.is.null,status_revisao.neq.pending_delete")
          .order("data_producao", { ascending: false })
          .range(from, from + batchSize - 1);
        if (error) throw error;
        allCubas = [...allCubas, ...(data || [])];
        if (!data || data.length < batchSize) break;
        from += batchSize;
      }
      const [ahuStockResult, altoXvStockResult] = await Promise.all([
        supabase.from("cardsahu").select("id, title, status, production_date, entry_date, created_at").in("status", ["vitrine-atual", "freezer-estoque"]).order("created_at", { ascending: false }),
        supabase.from("cardsaltoxv").select("id, title, status, production_date, entry_date, created_at").in("status", ["vitrine-atual", "freezer-estoque"]).order("created_at", { ascending: false })
      ]);
      if (ahuStockResult.error) throw ahuStockResult.error;
      if (altoXvStockResult.error) throw altoXvStockResult.error;
      const ahuStock = ahuStockResult.data || [];
      const altoXvStock = altoXvStockResult.data || [];
      setCurrentStoreCards({ ahu: ahuStock, altoxv: altoXvStock });
      setCurrentStoreStockCounts({ ahu: ahuStock.length, altoxv: altoXvStock.length });
      setTransferCubas(sortFactoryProductions(allCubas));
      setTransferDestinations({});
      setTransferPickerDestination(null);
      setTransferSearch("");
      setTransferMode(true);
    } catch (error: any) {
      console.error("Erro ao carregar cubas para transferência:", error);
      alert(`Não foi possível abrir a transferência: ${error.message || "erro inesperado"}`);
    } finally {
      setTransferLoading(false);
    }
  }

  function handleCubaDrop(event: React.DragEvent, destination: "Loja Ahu" | "Loja Alto XV" | null) {
    event.preventDefault();
    const cubaId = event.dataTransfer.getData("text/plain");
    if (!cubaId) return;
    setTransferDestinations(current => {
      const next = { ...current };
      if (destination) next[cubaId] = destination;
      else delete next[cubaId];
      return next;
    });
    setDraggedCubaId(null);
  }

  function addAvailableCubaToStore(cubaId: string, destination: "Loja Ahu" | "Loja Alto XV") {
    setTransferDestinations(current => ({ ...current, [cubaId]: destination }));
    setTransferPickerDestination(null);
    setTransferSearch("");
    setTransferSearchActiveIndex(0);
  }

  function handleRemoveCuba(cuba: any) {
    setTransferDestinations(current => {
      const next = { ...current };
      delete next[cuba.id];
      return next;
    });
  }

  async function saveCubaTransfers(confirmTransfer = false) {
    const assignments = Object.entries(transferDestinations).reduce<Record<string, string[]>>((groups, [id, destination]) => {
      if (!groups[destination]) groups[destination] = [];
      groups[destination].push(id);
      return groups;
    }, {});
    const assignedIds = Object.values(assignments).flat();
    if (!assignedIds.length) {
      alert("Arraste ao menos uma cuba para Loja Ahu ou Loja Alto XV.");
      return;
    }
    if (!confirmTransfer) {
      setTransferConfirmOpen(true);
      return;
    }
    const transferDate = getToday();
    const transferGroups = ["Loja Ahu", "Loja Alto XV"].map(store => ({
      store,
      cubas: transferCubas.filter(cuba => transferDestinations[cuba.id] === store)
    })).filter(group => group.cubas.length > 0);
    setSavingTransfers(true);
    try {
      const records = Object.entries(assignments).map(([destination, ids]) => ({
        data_transferencia: transferDate,
        descricao: "Transf. de Cubas",
        destino,
        cubas_ids: ids.map(id => Number(id)),
        user_id: user?.id || null
      }));
      const { error } = await supabase.from("transferencias_cubas").insert(records);
      if (error) throw error;
      setTransferMode(false);
      setTransferConfirmOpen(false);
      setTransferCubas([]);
      setTransferDestinations({});
      setTransferPickerDestination(null);
      setCompletedTransfer({ date: transferDate, groups: transferGroups });
    } catch (error: any) {
      console.error("Erro ao salvar transferências:", error);
      alert(`Não foi possível salvar as transferências: ${error.message || "erro inesperado"}`);
    } finally {
      setSavingTransfers(false);
    }
  }

  const formatTransferDate = (date: string) => date ? new Date(date + "T12:00:00").toLocaleDateString("pt-BR") : "—";
  const availableTransferCubas = transferCubas.filter(cuba => !transferDestinations[cuba.id]);
  const lojaAhuCubas = transferCubas.filter(cuba => transferDestinations[cuba.id] === "Loja Ahu");
  const lojaAltoXvCubas = transferCubas.filter(cuba => transferDestinations[cuba.id] === "Loja Alto XV");
  const filteredAvailableTransferCubas = availableTransferCubas.filter(cuba => {
    const search = transferSearch.trim().toLocaleLowerCase("pt-BR");
    return !search || `${cuba.cadastro_produtos?.nome || ""} ${cuba.codigo || ""}`.toLocaleLowerCase("pt-BR").includes(search);
  });

  useEffect(() => {
    if (!transferPickerDestination || filteredAvailableTransferCubas.length === 0) return;
    const activeCuba = filteredAvailableTransferCubas[Math.min(transferSearchActiveIndex, filteredAvailableTransferCubas.length - 1)];
    const storeKey = transferPickerDestination === "Loja Ahu" ? "ahu" : "altoxv";
    document.getElementById(`transfer-cuba-option-${storeKey}-${activeCuba.id}`)?.scrollIntoView({ block: "nearest" });
  }, [transferPickerDestination, transferSearchActiveIndex, transferSearch, transferCubas.length]);
  const renderCubaCard = (cuba: any) => (
    <div
      key={cuba.id}
      draggable
      onMouseEnter={() => setHoveredCubaId(cuba.id)}
      onMouseLeave={() => setHoveredCubaId(current => current === cuba.id ? null : current)}
      onDragStart={event => { event.dataTransfer.setData("text/plain", cuba.id); event.dataTransfer.effectAllowed = "move"; setDraggedCubaId(cuba.id); }}
      onDragEnd={() => setDraggedCubaId(null)}
      style={{ position: "relative", display: "grid", gap: 5, marginTop: 8, padding: "10px 36px 10px 12px", border: "1px solid #cbd5e1", borderRadius: 7, background: "#fff", color: "#334155", cursor: "grab", opacity: draggedCubaId === cuba.id ? .45 : 1, userSelect: "none" }}
    >
      {transferDestinations[cuba.id] && <button type="button" aria-label="Devolver às cubas disponíveis" title="Devolver às cubas disponíveis" draggable={false} onDragStart={event => event.preventDefault()} onClick={event => { event.stopPropagation(); handleRemoveCuba(cuba); }} style={{ position: "absolute", top: 7, right: 7, width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, border: "1px solid #fecaca", borderRadius: 5, background: "#fff1f2", color: "#dc2626", cursor: "pointer", opacity: hoveredCubaId === cuba.id ? 1 : 0, pointerEvents: hoveredCubaId === cuba.id ? "auto" : "none", transition: "opacity .15s" }}><Icons.BsTrash /></button>}
      <strong>{cuba.cadastro_produtos?.nome || "Sabor não encontrado"}</strong>
      <span style={{ display: "flex", justifyContent: "space-between", gap: 8, color: "#64748b", fontSize: ".85rem" }}><span>{cuba.codigo || "Sem código"}</span><span>{formatTransferDate(cuba.data_producao)}</span></span>
      <span style={{ color: "#526982", fontSize: ".85rem" }}>Peso líquido: {cuba.peso_liquido != null ? `${Number(cuba.peso_liquido).toFixed(3)} kg` : "—"}</span>
    </div>
  );
  const renderTransferColumn = (title: string, destination: "Loja Ahu" | "Loja Alto XV" | null, cubas: any[]) => (
    <section
      key={title}
      onDragOver={event => event.preventDefault()}
      onDrop={event => handleCubaDrop(event, destination)}
      style={{ boxSizing: "border-box", position: "relative", zIndex: destination && transferPickerDestination === destination ? 3 : 1, minHeight: 460, maxHeight: "65vh", minWidth: 280, overflowY: "auto", padding: 14, border: `1px ${destination ? "solid" : "dashed"} #cbd5e1`, borderRadius: 9, background: destination ? "#f8fafc" : "#fbfcfe" }}
    >
      <h3 style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, margin: 0, paddingBottom: 10, borderBottom: "1px solid #dbe3ec", color: "#475569", fontSize: "1rem" }}>
        <span>{title}</span>{destination ? <span style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 4 }}><span style={{ padding: "3px 8px", borderRadius: 12, background: "#e9eef4", color: "#526982", fontSize: ".78rem" }}>{destination === "Loja Ahu" ? currentStoreStockCounts.ahu : currentStoreStockCounts.altoxv} em estoque</span><span style={{ padding: "3px 8px", borderRadius: 12, background: "#fff7ed", color: "#9a3412", fontSize: ".78rem" }}>{cubas.length} novas</span></span> : <span style={{ padding: "3px 8px", borderRadius: 12, background: "#e9eef4", color: "#526982", fontSize: ".8rem" }}>{cubas.length} cubas</span>}
      </h3>
      {destination && <div ref={transferPickerDestination === destination ? transferPickerContainerRef : null} style={{ position: "relative", marginTop: 10 }}>
        <button type="button" onClick={() => { setTransferPickerDestination(current => current === destination ? null : destination); setTransferSearch(""); setTransferSearchActiveIndex(0); }} style={{ width: "100%", minHeight: 42, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, border: "1px dashed #aab7c6", borderRadius: 7, background: "transparent", color: "#64748b", fontSize: ".9rem", cursor: "pointer" }}><Icons.BsPlus /> Incluir nova cuba</button>
        {transferPickerDestination === destination && <div style={{ position: "absolute", top: 48, left: 0, right: 0, zIndex: 20, maxHeight: 250, overflowY: "auto", padding: 8, border: "1px solid #dbe3ec", borderRadius: 7, background: "#fff", boxShadow: "0 10px 24px rgba(15,23,42,.16)" }}>
          <input autoFocus aria-label="Pesquisar cuba disponível" placeholder="Pesquisar sabor..." value={transferSearch} onChange={event => { setTransferSearch(event.target.value); setTransferSearchActiveIndex(0); }} onKeyDown={event => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setTransferSearchActiveIndex(index => Math.min(index + 1, filteredAvailableTransferCubas.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setTransferSearchActiveIndex(index => Math.max(index - 1, 0));
            } else if (event.key === "Enter" && filteredAvailableTransferCubas.length) {
              event.preventDefault();
              const activeCuba = filteredAvailableTransferCubas[Math.min(transferSearchActiveIndex, filteredAvailableTransferCubas.length - 1)];
              addAvailableCubaToStore(activeCuba.id, destination);
            }
          }} style={{ boxSizing: "border-box", width: "100%", height: 38, marginBottom: 7, padding: "6px 9px", border: "1px solid #cbd5e1", borderRadius: 5, fontSize: ".9rem" }} />
          {filteredAvailableTransferCubas.map((cuba, index) => <button id={`transfer-cuba-option-${destination === "Loja Ahu" ? "ahu" : "altoxv"}-${cuba.id}`} key={cuba.id} type="button" onMouseEnter={() => setTransferSearchActiveIndex(index)} onClick={() => addAvailableCubaToStore(cuba.id, destination)} style={{ width: "100%", display: "block", marginBottom: 5, padding: "9px 10px", border: 0, borderRadius: 5, background: index === transferSearchActiveIndex ? "#eaf1f8" : "#f8fafc", color: "#334155", textAlign: "left", cursor: "pointer", fontSize: ".9rem" }}><strong>{cuba.cadastro_produtos?.nome || "Sabor não encontrado"}</strong><span style={{ display: "block", marginTop: 3, color: "#7b8ba0", fontSize: ".8rem" }}>{cuba.codigo || "Sem código"} · {formatTransferDate(cuba.data_producao)}</span><span style={{ display: "block", marginTop: 2, color: "#64748b", fontSize: ".8rem" }}>Peso líquido: {cuba.peso_liquido != null ? `${Number(cuba.peso_liquido).toFixed(3)} kg` : "—"}</span></button>)}
          {filteredAvailableTransferCubas.length === 0 && <div style={{ padding: 10, color: "#94a3b8", textAlign: "center", fontSize: ".85rem" }}>{availableTransferCubas.length ? "Nenhuma cuba encontrada." : "Não há cubas disponíveis."}</div>}
        </div>}
      </div>}
      {cubas.length ? cubas.map(renderCubaCard) : <div style={{ padding: "24px 8px", color: "#94a3b8", textAlign: "center", fontSize: ".9rem" }}>Arraste cubas para cá</div>}
      {destination && (() => {
        const storeCards = destination === "Loja Ahu" ? currentStoreCards.ahu : currentStoreCards.altoxv;
        const freezerCards = storeCards.filter(card => card.status === "freezer-estoque");
        const displayCards = storeCards.filter(card => card.status === "vitrine-atual");
        const renderExistingCard = (card: any) => <div key={card.id} style={{ marginTop: 7, padding: "9px 10px", border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff", color: "#475569" }}>
          <strong style={{ display: "block", color: "#334155", fontSize: ".88rem" }}>{card.title || "Sabor não encontrado"}</strong>
          <span style={{ display: "flex", justifyContent: "space-between", gap: 6, marginTop: 3, color: "#7b8ba0", fontSize: ".76rem" }}><span>Produção: {formatTransferDate(card.production_date)}</span><span>Entrada: {formatTransferDate(card.entry_date)}</span></span>
        </div>;
        return <div style={{ marginTop: 18, paddingTop: 14, borderTop: "2px solid #cbd5e1" }}>
          <h4 style={{ margin: "0 0 10px", color: "#526982", fontSize: ".92rem" }}>Estoque atual da loja</h4>
          <div style={{ marginBottom: 12 }}><h5 style={{ margin: "0 0 4px", color: "#64748b", fontSize: ".82rem" }}>No estoque ({freezerCards.length})</h5>{freezerCards.length ? freezerCards.map(renderExistingCard) : <span style={{ color: "#94a3b8", fontSize: ".8rem" }}>Nenhuma cuba no estoque.</span>}</div>
          <div><h5 style={{ margin: "0 0 4px", color: "#64748b", fontSize: ".82rem" }}>Na vitrine ({displayCards.length})</h5>{displayCards.length ? displayCards.map(renderExistingCard) : <span style={{ color: "#94a3b8", fontSize: ".8rem" }}>Nenhuma cuba na vitrine.</span>}</div>
        </div>;
      })()}
    </section>
  );

  function printTransferReport(group: { store: string; cubas: any[] }) {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const totalNetWeight = group.cubas.reduce((sum, cuba) => sum + (Number(cuba.peso_liquido) || 0), 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(51, 65, 85);
    doc.text("ROMANEIO DE TRANSFERÊNCIA DE CUBAS", 14, 17);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Destino: ${group.store}    Data de envio: ${formatTransferDate(completedTransfer?.date || getToday())}`, 14, 25);
    doc.text(`Quantidade: ${group.cubas.length} cuba(s)    Peso líquido total: ${totalNetWeight.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} kg`, 14, 32);
    autoTable(doc, {
      startY: 38,
      head: [["Nº", "Sabor", "Código de Produção", "Data de Produção", "Peso Bruto (kg)", "Tara (kg)", "Peso Líquido (kg)"]],
      body: group.cubas.map((cuba, index) => [
        index + 1,
        cuba.cadastro_produtos?.nome || "Sabor não encontrado",
        cuba.codigo || "—",
        formatTransferDate(cuba.data_producao),
        cuba.peso_bruto != null ? Number(cuba.peso_bruto).toFixed(3) : "—",
        cuba.tara != null ? Number(cuba.tara).toFixed(3) : "—",
        cuba.peso_liquido != null ? Number(cuba.peso_liquido).toFixed(3) : "—"
      ]),
      theme: "grid",
      headStyles: { fillColor: [241, 231, 218], textColor: [128, 80, 31], fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 9, cellPadding: 2.5, textColor: [51, 65, 85] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 }
    });
    let signatureY = Number((doc as any).lastAutoTable?.finalY || 38) + 22;
    if (signatureY + 16 > pageHeight - 12) {
      doc.addPage();
      signatureY = 35;
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setDrawColor(100, 116, 139);
    doc.line(24, signatureY, pageWidth / 2 - 12, signatureY);
    doc.line(pageWidth / 2 + 12, signatureY, pageWidth - 24, signatureY);
    doc.text("Assinatura — responsável pelo envio", 24, signatureY + 6);
    doc.text("Assinatura — responsável pelo recebimento", pageWidth / 2 + 12, signatureY + 6);
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Este romaneio deve acompanhar as cubas durante todo o transporte.", 14, pageHeight - 10);
    const fileStore = group.store.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "-");
    doc.save(`romaneio-cubas-${fileStore}-${completedTransfer?.date || getToday()}.pdf`);
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

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 12 }}>
            <button type="button" onClick={() => transferMode ? setTransferMode(false) : void openTransferMode()} disabled={transferLoading || savingTransfers} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", border: 0, borderRadius: 7, background: "#80501f", color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: transferLoading || savingTransfers ? "wait" : "pointer", opacity: transferLoading || savingTransfers ? .7 : 1 }}>
              {transferLoading ? <><Icons.BsArrowClockwise className="spin" /> Carregando cubas...</> : transferMode ? <><Icons.BsX /> Voltar à tabela</> : <><Icons.BsArrowLeftRight /> Transferir cubas para Lojas</>}
            </button>
          </div>
          <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            {transferMode ? <section style={{ minWidth: 900, padding: 20, background: "#fff" }}>
              <div style={{ marginBottom: 14 }}>
                <h2 style={{ margin: "0 0 6px", color: "#334155", fontSize: "1.35rem" }}>Transferir cubas para Lojas</h2>
                <p style={{ margin: 0, color: "#64748b" }}>Arraste cada cuba de <strong>Cubas Disponíveis</strong> para a Loja Ahú ou Loja Alto XV. As alterações só serão gravadas ao salvar.</p>
              </div>
              {transferLoading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} /></div> : <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(260px, 1fr))", gap: 12, minWidth: 850, overflowX: "auto", paddingBottom: 8 }}>
                {renderTransferColumn("Cubas Disponíveis", null, availableTransferCubas)}
                {renderTransferColumn("Loja Ahu", "Loja Ahu", lojaAhuCubas)}
                {renderTransferColumn("Loja Alto XV", "Loja Alto XV", lojaAltoXvCubas)}
              </div>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 14, paddingTop: 14, borderTop: "1px solid #e2e8f0" }}>
                <span style={{ color: "#64748b", fontWeight: 600 }}>{Object.keys(transferDestinations).length} cuba(s) selecionadas para transferência</span>
                <button type="button" onClick={() => void saveCubaTransfers()} disabled={savingTransfers || Object.keys(transferDestinations).length === 0} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", border: 0, borderRadius: 6, background: "#16a34a", color: "#fff", fontWeight: 700, cursor: savingTransfers || Object.keys(transferDestinations).length === 0 ? "not-allowed" : "pointer", opacity: savingTransfers || Object.keys(transferDestinations).length === 0 ? .65 : 1 }}>{savingTransfers ? <><Icons.BsArrowClockwise className="spin" /> Registrando...</> : <><Icons.BsCheckCircleFill /> Registrar Transferência</>}</button>
              </div>
            </section> : <>
            <div style={{ boxSizing: "border-box", display: "grid", gridTemplateColumns: "150px 100px 250px 120px 100px 100px 120px 120px", alignItems: "center", minWidth: "1100px", padding: "9px 6px", borderBottom: "1px solid #e2d8cc", background: "#fbf7f2", color: "#80501f", fontWeight: 700, fontSize: ".95rem" }}>
              <div style={{ gridColumn: "1 / 7", paddingLeft: 8 }}>Total de cubas: {totalCount}</div>
              <div style={{ gridColumn: "7 / 8", textAlign: "center" }}>Peso líquido: {totalLiquidWeight == null ? "—" : `${totalLiquidWeight.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} kg`}</div>
              <div style={{ gridColumn: "8 / 9" }} />
            </div>
            <table className="freq-table" style={{ minWidth: "1100px" }}>
              <thead>
                <tr>
                  <th style={{ width: "150px", textAlign: "center" }}>Cód de Produção</th>
                  <th style={{ width: "100px", textAlign: "center" }}>Cód Produto</th>
                  <th style={{ width: "250px" }}>Produto</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Data Produção</th>
                  <th style={{ textAlign: "center", width: "100px" }}>Peso Bruto (kg)</th>
                  <th style={{ textAlign: "center", width: "100px" }}>Tara (kg)</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Peso Líquido (kg)</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Validade</th>

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
                  <th colSpan={4} style={{ padding: "8px", textAlign: "right" }}>
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
                    <td colSpan={8} style={{ textAlign: "center", padding: "40px" }}>
                      <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                    </td>
                  </tr>
                ) : producoes.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
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
                          {prod.validade ? new Date(prod.validade + "T12:00:00").toLocaleDateString('pt-BR') : "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
                
                {hasMore && producoes.length > 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "16px" }}>
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
                  <td colSpan={8} style={{ textAlign: "right", padding: "12px 16px", color: "#64748b" }}>
                    Total de registros encontrados: {totalCount}
                  </td>
                </tr>
              </tbody>
            </table>
            </>}
          </div>
        </div>
        {transferConfirmOpen && <div role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !savingTransfers) setTransferConfirmOpen(false); }} style={{ position: "fixed", inset: 0, zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "rgba(15,23,42,.5)" }}>
          <section role="alertdialog" aria-modal="true" aria-labelledby="factory-transfer-confirm-title" style={{ boxSizing: "border-box", width: "min(650px, 100%)", maxHeight: "85vh", overflowY: "auto", padding: 24, border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff", boxShadow: "0 20px 60px rgba(15,23,42,.25)" }}>
            <h2 id="factory-transfer-confirm-title" style={{ margin: "0 0 7px", color: "#334155", fontSize: "1.4rem" }}>Confirmar registro de transferência</h2>
            <p style={{ margin: "0 0 16px", color: "#64748b", lineHeight: 1.5 }}>Confira as cubas e os destinos. Será criado apenas o registro de transferência; nenhuma cuba será movimentada ainda.</p>
            {[{ store: "Loja Ahu", cubas: lojaAhuCubas }, { store: "Loja Alto XV", cubas: lojaAltoXvCubas }].filter(group => group.cubas.length > 0).map(group => <div key={group.store} style={{ marginTop: 12, padding: 13, border: "1px solid #dbe3ec", borderRadius: 8, background: "#f8fafc" }}>
              <h3 style={{ margin: "0 0 8px", color: "#475569", fontSize: "1rem" }}>{group.store} — {group.cubas.length} cuba(s)</h3>
              <ul style={{ display: "grid", gap: 5, margin: 0, paddingLeft: 20, color: "#334155", fontSize: ".9rem" }}>{group.cubas.map(cuba => <li key={cuba.id}>{cuba.cadastro_produtos?.nome || "Sabor"} · {cuba.codigo || "Sem código"} · {cuba.peso_liquido != null ? `${Number(cuba.peso_liquido).toFixed(3)} kg` : "Peso líquido —"}</li>)}</ul>
            </div>)}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 9, marginTop: 20 }}>
              <button type="button" onClick={() => setTransferConfirmOpen(false)} disabled={savingTransfers} style={{ padding: "10px 15px", border: "1px solid #cbd5e1", borderRadius: 6, background: "#fff", color: "#475569", fontWeight: 700, cursor: "pointer" }}>Voltar</button>
              <button type="button" onClick={() => void saveCubaTransfers(true)} disabled={savingTransfers} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 16px", border: 0, borderRadius: 6, background: "#16a34a", color: "#fff", fontWeight: 700, cursor: savingTransfers ? "wait" : "pointer" }}>{savingTransfers ? <><Icons.BsArrowClockwise className="spin" /> Registrando...</> : <><Icons.BsCheckCircleFill /> Registrar Transferência</>}</button>
            </div>
          </section>
        </div>}
        {completedTransfer && <div role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setCompletedTransfer(null); }} style={{ position: "fixed", inset: 0, zIndex: 1600, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "rgba(15,23,42,.5)" }}>
          <section role="dialog" aria-modal="true" aria-labelledby="factory-transfer-complete-title" style={{ boxSizing: "border-box", width: "min(720px, 100%)", maxHeight: "88vh", overflowY: "auto", padding: 24, border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff", boxShadow: "0 20px 60px rgba(15,23,42,.25)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 13, marginBottom: 16 }}>
              <span style={{ width: 42, height: 42, flex: "0 0 42px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#dcfce7", color: "#15803d", fontSize: 21 }}><Icons.BsCheckCircleFill /></span>
              <div><h2 id="factory-transfer-complete-title" style={{ margin: "2px 0 5px", color: "#334155", fontSize: "1.4rem" }}>Transferência registrada</h2><p style={{ margin: 0, color: "#64748b" }}>O registro foi criado em {formatTransferDate(completedTransfer.date)}. Nenhuma cuba foi movimentada; elas continuam disponíveis no Estoque Fábrica. Imprima um romaneio para acompanhar cada envio.</p></div>
            </div>
            <div style={{ display: "grid", gap: 11 }}>
              {completedTransfer.groups.map(group => <section key={group.store} style={{ padding: 13, border: "1px solid #dbe3ec", borderRadius: 8, background: "#f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                  <h3 style={{ margin: 0, color: "#475569", fontSize: "1rem" }}>{group.store} — {group.cubas.length} cuba(s)</h3>
                  <button type="button" onClick={() => printTransferReport(group)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6, background: "#fff", color: "#475569", fontWeight: 700, cursor: "pointer" }}><Icons.BsPrinterFill /> Imprimir romaneio</button>
                </div>
                <ul style={{ display: "grid", gap: 4, maxHeight: 160, overflowY: "auto", margin: 0, paddingLeft: 20, color: "#334155", fontSize: ".9rem" }}>{group.cubas.map(cuba => <li key={cuba.id}>{cuba.cadastro_produtos?.nome || "Sabor"} · {cuba.codigo || "Sem código"} · {cuba.peso_liquido != null ? `${Number(cuba.peso_liquido).toFixed(3)} kg` : "Peso líquido —"}</li>)}</ul>
              </section>)}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}><button type="button" autoFocus onClick={() => setCompletedTransfer(null)} style={{ minWidth: 96, padding: "9px 16px", border: 0, borderRadius: 6, background: "var(--primary-color)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Concluir</button></div>
          </section>
        </div>}
      </div>
    </>
  );
}

export default EstoqueFabrica;
