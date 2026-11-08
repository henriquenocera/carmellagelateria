import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import "../css/Frequencia.css";

const PAGE_SIZE = 100;
const DESTINATIONS = ["Loja Ahu", "Loja Alto XV", "Food Service", "Descartado", "Outro"];

type TransferRecord = {
  id: number;
  data_transferencia: string;
  descricao: string;
  destino: string | null;
  status: "Pendente" | "Concluída" | "Cancelada";
  cubas_ids?: number[] | null;
  created_at: string;
  profiles?: { name?: string | null } | null;
  cubas: any[];
};

function TransferenciasEstoque() {
  const { user } = useAuth();
  const [transferencias, setTransferencias] = useState<TransferRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [savingFieldId, setSavingFieldId] = useState<number | null>(null);
  const [transferToDelete, setTransferToDelete] = useState<TransferRecord | null>(null);
  const [deletingTransfer, setDeletingTransfer] = useState(false);
  const [selectedTransferDetail, setSelectedTransferDetail] = useState<TransferRecord | null>(null);
  const [selectedCubeIds, setSelectedCubeIds] = useState<number[]>([]);
  const [confirmingTransfer, setConfirmingTransfer] = useState(false);
  const [copiedTransferId, setCopiedTransferId] = useState<number | null>(null);
  const [showCompleteConfirmation, setShowCompleteConfirmation] = useState(false);
  const [showTransferCreated, setShowTransferCreated] = useState(false);
  const [editingTransferDateId, setEditingTransferDateId] = useState<number | null>(null);
  const [editingTransferDestinationId, setEditingTransferDestinationId] = useState<number | null>(null);
  const [destinationSelectionValue, setDestinationSelectionValue] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [showNewTransfer, setShowNewTransfer] = useState(false);
  const [showCategorySelection, setShowCategorySelection] = useState(false);
  const [unavailableCategory, setUnavailableCategory] = useState<string | null>(null);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferSaving, setTransferSaving] = useState(false);
  const [showTransferConfirmation, setShowTransferConfirmation] = useState(false);
  const [availableCubas, setAvailableCubas] = useState<any[]>([]);
  const [storeCards, setStoreCards] = useState<{ ahu: any[]; altoxv: any[] }>({ ahu: [], altoxv: [] });
  const [storeCounts, setStoreCounts] = useState({ ahu: 0, altoxv: 0 });
  const [destinationByCuba, setDestinationByCuba] = useState<Record<string, "Loja Ahu" | "Loja Alto XV">>({});
  const [pickerStore, setPickerStore] = useState<"Loja Ahu" | "Loja Alto XV" | null>(null);
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerActiveIndex, setPickerActiveIndex] = useState(0);
  const [draggedCubaId, setDraggedCubaId] = useState<string | null>(null);
  const [hoveredCubaId, setHoveredCubaId] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { void fetchTransfers(); }, []);

  useEffect(() => {
    if (!selectedTransferDetail) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedTransferDetail(null);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [selectedTransferDetail]);

  useEffect(() => {
    if (!pickerStore) return;
    const onOutsideClick = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setPickerStore(null);
        setPickerSearch("");
        setPickerActiveIndex(0);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPickerStore(null);
        setPickerSearch("");
        setPickerActiveIndex(0);
      }
    };
    document.addEventListener("mousedown", onOutsideClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [pickerStore]);

  useEffect(() => {
    if (!pickerStore) return;
    const onOutsideClick = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setPickerStore(null);
        setPickerSearch("");
        setPickerActiveIndex(0);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPickerStore(null);
        setPickerSearch("");
        setPickerActiveIndex(0);
      }
    };
    document.addEventListener("mousedown", onOutsideClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [pickerStore]);

  async function fetchTransfers(loadMore = false) {
    const currentPage = loadMore ? page : 0;
    if (loadMore) setLoadingMore(true);
    else setLoading(true);
    try {
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data: headerData, count, error: headerError } = await supabase.from("transferencias_cubas")
        .select("id, data_transferencia, descricao, destino, cubas_ids, status, user_id, created_at, profiles(name)", { count: "exact" })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(from, to);
      if (headerError) throw headerError;

      const headers = headerData || [];
      let cubesByTransfer = new Map<number, any[]>();
      if (headers.length) {
        cubesByTransfer = new Map<number, any[]>();
        const directlyLinkedHeaders = headers.filter((header: any) => header.cubas_ids?.length);
        const directCubeIds = Array.from(new Set(directlyLinkedHeaders.flatMap((header: any) => header.cubas_ids.map((id: number) => Number(id)))));
        if (directCubeIds.length) {
          const { data, error } = await supabase.from("producao_realizada")
            .select("id, codigo, data_producao, peso_bruto, tara, peso_liquido, produto_id, cadastro_produtos!inner(nome, codigo)")
            .in("id", directCubeIds);
          if (error) throw error;
          const cubeById = new Map((data || []).map((cube: any) => [Number(cube.id), cube]));
          directlyLinkedHeaders.forEach((header: any) => cubesByTransfer.set(header.id, header.cubas_ids.map((id: number) => cubeById.get(Number(id))).filter(Boolean)));
        }
        const legacyHeaders = headers.filter((header: any) => !header.cubas_ids?.length);
        if (legacyHeaders.length) {
          const { data, error } = await supabase.from("producao_realizada")
            .select("id, transferencia_cubas_id, codigo, data_producao, peso_bruto, tara, peso_liquido, produto_id, cadastro_produtos!inner(nome, codigo)")
            .in("transferencia_cubas_id", legacyHeaders.map((header: any) => header.id));
          if (error) throw error;
          (data || []).forEach((cube: any) => {
            const group = cubesByTransfer.get(cube.transferencia_cubas_id) || [];
            group.push(cube);
            cubesByTransfer.set(cube.transferencia_cubas_id, group);
          });
        }
      }

      const rows: TransferRecord[] = headers.map((header: any) => ({
        ...header,
        cubas: cubesByTransfer.get(header.id) || []
      }));
      if (loadMore) setTransferencias(current => [...current, ...rows]);
      else setTransferencias(rows);
      if (count !== null) setTotalCount(count);
      setHasMore(rows.length === PAGE_SIZE);
      setPage(currentPage + 1);
    } catch (error: any) {
      console.error("Erro ao carregar transferências de cubas:", error);
      alert(`Não foi possível carregar as transferências: ${error.message || "erro inesperado"}`);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  async function openNewTransfer() {
    setTransferLoading(true);
    try {
      const batchSize = 1000;
      let from = 0;
      let cubes: any[] = [];
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
        cubes = [...cubes, ...(data || [])];
        if (!data || data.length < batchSize) break;
        from += batchSize;
      }

      const [ahuResponse, altoXvResponse] = await Promise.all([
        supabase.from("cardsahu").select("id, title, status, production_date, entry_date, created_at").in("status", ["vitrine-atual", "freezer-estoque"]).order("created_at", { ascending: false }),
        supabase.from("cardsaltoxv").select("id, title, status, production_date, entry_date, created_at").in("status", ["vitrine-atual", "freezer-estoque"]).order("created_at", { ascending: false })
      ]);
      if (ahuResponse.error) throw ahuResponse.error;
      if (altoXvResponse.error) throw altoXvResponse.error;
      const ahuCards = ahuResponse.data || [];
      const altoXvCards = altoXvResponse.data || [];
      setAvailableCubas(cubes.sort((a, b) => String(b.data_producao).localeCompare(String(a.data_producao)) || String(a.cadastro_produtos?.nome || "").localeCompare(String(b.cadastro_produtos?.nome || ""), "pt-BR", { sensitivity: "base", numeric: true })));
      setStoreCards({ ahu: ahuCards, altoxv: altoXvCards });
      setStoreCounts({ ahu: ahuCards.length, altoxv: altoXvCards.length });
      setDestinationByCuba({});
      setShowCategorySelection(false);
      setShowNewTransfer(true);
    } catch (error: any) {
      console.error("Erro ao buscar estoque para nova transferência:", error);
      alert(`Não foi possível carregar cubas para transferir: ${error.message || "erro inesperado"}`);
    } finally {
      setTransferLoading(false);
    }
  }

  const assignedAhuCubas = availableCubas.filter(cuba => destinationByCuba[String(cuba.id)] === "Loja Ahu");
  const assignedAltoXvCubas = availableCubas.filter(cuba => destinationByCuba[String(cuba.id)] === "Loja Alto XV");
  const unassignedCubas = availableCubas.filter(cuba => !destinationByCuba[String(cuba.id)]);
  const filteredUnassignedCubas = unassignedCubas.filter(cuba => {
    const search = pickerSearch.trim().toLocaleLowerCase("pt-BR");
    return !search || `${cuba.cadastro_produtos?.nome || ""} ${cuba.codigo || ""}`.toLocaleLowerCase("pt-BR").includes(search);
  });

  function handleDrop(event: React.DragEvent, destination: "Loja Ahu" | "Loja Alto XV" | null) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (!id) return;
    setDestinationByCuba(current => {
      const next = { ...current };
      if (destination) next[id] = destination;
      else delete next[id];
      return next;
    });
    setDraggedCubaId(null);
  }

  function assignCube(cubeId: string, destination: "Loja Ahu" | "Loja Alto XV") {
    setDestinationByCuba(current => ({ ...current, [cubeId]: destination }));
    setPickerStore(destination);
    setPickerSearch("");
    setPickerActiveIndex(0);
    pickerRef.current?.querySelector("input")?.focus();
  }

  function removeCubeFromAssignment(cubeId: string) {
    setDestinationByCuba(current => {
      const next = { ...current };
      delete next[cubeId];
      return next;
    });
  }

  async function saveNewTransfer(confirm = false) {
    const groups = [
      { destination: "Loja Ahu", cubas: assignedAhuCubas },
      { destination: "Loja Alto XV", cubas: assignedAltoXvCubas }
    ].filter(group => group.cubas.length > 0);
    if (!groups.length) {
      alert("Arraste ao menos uma cuba para uma das lojas.");
      return;
    }
    if (!confirm) {
      setShowTransferConfirmation(true);
      return;
    }

    setTransferSaving(true);
    const today = new Date();
    const transferDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    try {
      const transferRows = groups.map(group => ({
        data_transferencia: transferDate,
        descricao: "Transferência de Cubas - Lojas",
        destino: group.destination,
        cubas_ids: group.cubas.map(cuba => Number(cuba.id)),
        user_id: user?.id || null
      }));
      const { error } = await supabase.from("transferencias_cubas").insert(transferRows);
      if (error) throw error;
      setShowTransferConfirmation(false);
      setShowNewTransfer(false);
      await fetchTransfers();
      setShowTransferCreated(true);
    } catch (error: any) {
      console.error("Erro ao salvar nova transferência:", error);
      alert(`Não foi possível salvar a transferência: ${error.message || "erro inesperado"}`);
    } finally {
      setTransferSaving(false);
    }
  }

  async function deleteTransfer() {
    if (!transferToDelete || deletingTransfer) return;
    setDeletingTransfer(true);
    try {
      const { error } = await supabase.from("transferencias_cubas").delete().eq("id", transferToDelete.id);
      if (error) throw error;
      setTransferToDelete(null);
      await fetchTransfers();
    } catch (error: any) {
      console.error("Erro ao excluir transferência:", error);
      alert(`Não foi possível excluir a transferência: ${error.message || "erro inesperado"}`);
    } finally {
      setDeletingTransfer(false);
    }
  }

  async function confirmTransfer() {
    if (!selectedTransferDetail || confirmingTransfer || !selectedCubeIds.length) return;
    setConfirmingTransfer(true);
    try {
      const { error } = await supabase.rpc("concluir_transferencia_cubas", {
        p_transferencia_id: selectedTransferDetail.id,
        p_cubas_ids: selectedCubeIds
      });
      if (error) throw error;
      setShowCompleteConfirmation(false);
      setSelectedTransferDetail(null);
      setSelectedCubeIds([]);
      await fetchTransfers();
    } catch (error: any) {
      console.error("Erro ao confirmar transferência:", error);
      alert(`Não foi possível concluir a transferência: ${error.message || "erro inesperado"}`);
    } finally {
      setConfirmingTransfer(false);
    }
  }

  const formatCubeDate = (date?: string | null) => date ? new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR") : "—";
  const formatCubeWeight = (weight?: number | null) => weight == null ? "—" : `${Number(weight).toFixed(3)} kg`;

  function dropCube(event: React.DragEvent, destination: "Loja Ahu" | "Loja Alto XV" | null) {
    event.preventDefault();
    const cubeId = event.dataTransfer.getData("text/plain");
    if (!cubeId) return;
    setDestinationByCuba(current => {
      const next = { ...current };
      if (destination) next[cubeId] = destination;
      else delete next[cubeId];
      return next;
    });
    setDraggedCubaId(null);
  }

  function renderKanbanCube(cube: any, isAssigned: boolean) {
    const cubeId = String(cube.id);
    return <div key={cubeId} draggable onMouseEnter={() => setHoveredCubaId(cubeId)} onMouseLeave={() => setHoveredCubaId(current => current === cubeId ? null : current)} onDragStart={event => { event.dataTransfer.setData("text/plain", cubeId); event.dataTransfer.effectAllowed = "move"; setDraggedCubaId(cubeId); }} onDragEnd={() => setDraggedCubaId(null)} style={{ position: "relative", display: "grid", gap: 5, marginTop: 8, padding: "11px 38px 11px 13px", border: "1px solid #cbd5e1", borderRadius: 7, background: "#fff", color: "#334155", cursor: "grab", opacity: draggedCubaId === cubeId ? .45 : 1, userSelect: "none" }}>
      {isAssigned && <button type="button" aria-label="Devolver às cubas disponíveis" title="Devolver às cubas disponíveis" draggable={false} onDragStart={event => event.preventDefault()} onClick={event => { event.stopPropagation(); setDestinationByCuba(current => { const next = { ...current }; delete next[cubeId]; return next; }); }} style={{ position: "absolute", top: 7, right: 7, width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, border: "1px solid #fecaca", borderRadius: 5, background: "#fff1f2", color: "#dc2626", cursor: "pointer", opacity: hoveredCubaId === cubeId ? 1 : 0, pointerEvents: hoveredCubaId === cubeId ? "auto" : "none", transition: "opacity .15s" }}><Icons.BsTrash /></button>}
      <strong>{cube.cadastro_produtos?.nome || "Sabor não encontrado"}</strong>
      <span style={{ display: "flex", justifyContent: "space-between", gap: 8, color: "#64748b", fontSize: ".85rem" }}><span>{cube.codigo || "Sem código"}</span><span>{formatCubeDate(cube.data_producao)}</span></span>
      <span style={{ color: "#526982", fontSize: ".85rem" }}>Peso líquido: {formatCubeWeight(cube.peso_liquido)}</span>
    </div>;
  }

  function renderExistingStoreCube(cube: any) {
    return <div key={cube.id} style={{ marginTop: 7, padding: "9px 10px", border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff", color: "#475569" }}>
      <strong style={{ display: "block", color: "#334155", fontSize: ".88rem" }}>{cube.title || "Sabor não encontrado"}</strong>
      <span style={{ display: "flex", justifyContent: "space-between", gap: 6, marginTop: 3, color: "#7b8ba0", fontSize: ".76rem" }}><span>Produção: {formatCubeDate(cube.production_date)}</span><span>Entrada: {formatCubeDate(cube.entry_date)}</span></span>
    </div>;
  }

  function renderNewTransferColumn(store: "Loja Ahu" | "Loja Alto XV") {
    const assigned = store === "Loja Ahu" ? assignedAhuCubas : assignedAltoXvCubas;
    const currentCards = store === "Loja Ahu" ? storeCards.ahu : storeCards.altoxv;
    const currentFreezer = currentCards.filter(card => card.status === "freezer-estoque");
    const currentVitrine = currentCards.filter(card => card.status === "vitrine-atual");
    const isPickerOpen = pickerStore === store;
    return <section key={store} onDragOver={event => event.preventDefault()} onDrop={event => dropCube(event, store)} style={{ boxSizing: "border-box", position: "relative", zIndex: isPickerOpen ? 3 : 1, minHeight: 540, maxHeight: "78vh", minWidth: 300, overflowY: "auto", padding: 16, border: "1px solid #cbd5e1", borderRadius: 9, background: "#f8fafc" }}>
      <h3 style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, margin: 0, paddingBottom: 10, borderBottom: "1px solid #dbe3ec", color: "#475569", fontSize: "1rem" }}><span>{store}</span><span style={{ display: "inline-flex", gap: 5 }}><span style={{ padding: "3px 8px", borderRadius: 12, background: "#e9eef4", color: "#526982", fontSize: ".78rem" }}>{currentCards.length} em estoque</span><span style={{ padding: "3px 8px", borderRadius: 12, background: "#fff7ed", color: "#9a3412", fontSize: ".78rem" }}>{assigned.length} novas</span></span></h3>
      <div ref={isPickerOpen ? pickerRef : null} style={{ position: "relative", marginTop: 10 }}>
        <button type="button" onClick={() => { setPickerStore(current => current === store ? null : store); setPickerSearch(""); setPickerActiveIndex(0); }} style={{ width: "100%", minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, border: "1px dashed #aab7c6", borderRadius: 7, background: "transparent", color: "#64748b", cursor: "pointer" }}><Icons.BsPlus /> Incluir nova cuba</button>
        {isPickerOpen && <div style={{ position: "absolute", top: 50, left: 0, right: 0, zIndex: 20, maxHeight: 300, overflowY: "auto", padding: 8, border: "1px solid #dbe3ec", borderRadius: 7, background: "#fff", boxShadow: "0 10px 24px rgba(15,23,42,.16)" }}>
          <input autoFocus aria-label="Pesquisar cuba disponível" placeholder="Pesquisar sabor..." value={pickerSearch} onChange={event => { setPickerSearch(event.target.value); setPickerActiveIndex(0); }} onKeyDown={event => {
            if (event.key === "ArrowDown") { event.preventDefault(); setPickerActiveIndex(index => Math.min(index + 1, filteredUnassignedCubas.length - 1)); }
            else if (event.key === "ArrowUp") { event.preventDefault(); setPickerActiveIndex(index => Math.max(index - 1, 0)); }
            else if (event.key === "Enter" && filteredUnassignedCubas.length) { event.preventDefault(); assignCube(String(filteredUnassignedCubas[Math.min(pickerActiveIndex, filteredUnassignedCubas.length - 1)].id), store); }
          }} style={{ boxSizing: "border-box", width: "100%", height: 40, marginBottom: 7, padding: "6px 9px", border: "1px solid #cbd5e1", borderRadius: 5, fontSize: ".9rem" }} />
          {filteredUnassignedCubas.map((cube, index) => <button key={cube.id} type="button" onMouseEnter={() => setPickerActiveIndex(index)} onClick={() => assignCube(String(cube.id), store)} style={{ width: "100%", display: "block", marginBottom: 5, padding: "9px 10px", border: 0, borderRadius: 5, background: index === pickerActiveIndex ? "#eaf1f8" : "#f8fafc", color: "#334155", textAlign: "left", cursor: "pointer", fontSize: ".9rem" }}><strong>{cube.cadastro_produtos?.nome || "Sabor não encontrado"}</strong><span style={{ display: "block", marginTop: 3, color: "#7b8ba0", fontSize: ".8rem" }}>{cube.codigo || "Sem código"} · {formatCubeDate(cube.data_producao)}</span><span style={{ display: "block", marginTop: 2, color: "#64748b", fontSize: ".8rem" }}>Peso líquido: {formatCubeWeight(cube.peso_liquido)}</span></button>)}
          {!filteredUnassignedCubas.length && <div style={{ padding: 10, color: "#94a3b8", textAlign: "center", fontSize: ".85rem" }}>{unassignedCubas.length ? "Nenhuma cuba encontrada." : "Não há cubas disponíveis."}</div>}
        </div>}
      </div>
      {assigned.length ? assigned.map(cube => renderKanbanCube(cube, true)) : <div onDragOver={event => event.preventDefault()} style={{ padding: "22px 8px", color: "#94a3b8", textAlign: "center", fontSize: ".9rem" }}>Arraste cubas para cá</div>}
      <div style={{ marginTop: 20, paddingTop: 14, borderTop: "2px solid #cbd5e1" }}>
        <h4 style={{ margin: "0 0 10px", color: "#526982", fontSize: ".92rem" }}>Estoque atual da loja</h4>
        <div style={{ marginBottom: 12 }}><h5 style={{ margin: "0 0 4px", color: "#64748b", fontSize: ".82rem" }}>No estoque ({currentFreezer.length})</h5>{currentFreezer.length ? currentFreezer.map(renderExistingStoreCube) : <span style={{ color: "#94a3b8", fontSize: ".8rem" }}>Nenhuma cuba no estoque.</span>}</div>
        <div><h5 style={{ margin: "0 0 4px", color: "#64748b", fontSize: ".82rem" }}>Na vitrine ({currentVitrine.length})</h5>{currentVitrine.length ? currentVitrine.map(renderExistingStoreCube) : <span style={{ color: "#94a3b8", fontSize: ".8rem" }}>Nenhuma cuba na vitrine.</span>}</div>
      </div>
    </section>;
  }

  function changeDraft(id: number, field: "data_transferencia" | "descricao" | "destino", value: string) {
    setTransferencias(current => current.map(row => row.id === id ? { ...row, [field]: value } : row));
  }

  async function persistField(id: number, field: "data_transferencia" | "descricao" | "destino", value: string) {
    if (field === "data_transferencia" && !value) {
      alert("Informe uma data de transferência válida.");
      return;
    }
    const previous = transferencias.find(row => row.id === id);
    if (!previous || previous[field] === value) return;
    setSavingFieldId(id);
    try {
      const { error } = await supabase.from("transferencias_cubas")
        .update({ [field]: field === "destino" ? value || null : value })
        .eq("id", id);
      if (error) throw error;
    } catch (error: any) {
      console.error("Erro ao atualizar transferência:", error);
      alert(`Não foi possível salvar a alteração: ${error.message || "erro inesperado"}`);
      void fetchTransfers();
    } finally {
      setSavingFieldId(null);
    }
  }

  function printTransferReport(transfer: TransferRecord) {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const totalWeight = transfer.cubas.reduce((sum, cube) => sum + (Number(cube.peso_liquido) || 0), 0);
    const formatDate = (date?: string | null) => date ? new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR") : "—";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(51, 65, 85);
    doc.text("ROMANEIO DE TRANSFERÊNCIA DE CUBAS", 14, 17);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Destino: ${transfer.destino || "A definir"}    Data de transferência: ${formatDate(transfer.data_transferencia)}`, 14, 25);
    doc.text(`Descrição: ${transfer.descricao}    Quantidade: ${transfer.cubas.length} cuba(s)    Peso líquido total: ${totalWeight.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} kg`, 14, 32);
    autoTable(doc, {
      startY: 38,
      head: [["Nº", "Sabor", "Código de Produção", "Data de Produção", "Peso Bruto (kg)", "Tara (kg)", "Peso Líquido (kg)"]],
      body: transfer.cubas.map((cube, index) => [
        index + 1,
        cube.cadastro_produtos?.nome || "Sabor não encontrado",
        cube.codigo || "—",
        formatDate(cube.data_producao),
        cube.peso_bruto == null ? "—" : Number(cube.peso_bruto).toFixed(3),
        cube.tara == null ? "—" : Number(cube.tara).toFixed(3),
        cube.peso_liquido == null ? "—" : Number(cube.peso_liquido).toFixed(3)
      ]),
      theme: "grid",
      headStyles: { fillColor: [241, 231, 218], textColor: [128, 80, 31], fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 9, cellPadding: 2.5, textColor: [51, 65, 85] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 }
    });
    let signatureY = Number((doc as any).lastAutoTable?.finalY || 38) + 22;
    if (signatureY + 16 > height - 12) {
      doc.addPage();
      signatureY = 35;
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setDrawColor(100, 116, 139);
    doc.line(24, signatureY, width / 2 - 12, signatureY);
    doc.line(width / 2 + 12, signatureY, width - 24, signatureY);
    doc.text("Assinatura — responsável pelo envio", 24, signatureY + 6);
    doc.text("Assinatura — responsável pelo recebimento", width / 2 + 12, signatureY + 6);
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Este romaneio deve acompanhar as cubas durante todo o transporte.", 14, height - 10);
    const slug = (transfer.destino || "destino-a-definir").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "-");
    doc.save(`romaneio-cubas-${slug}-${transfer.data_transferencia}.pdf`);
  }

  async function copyTransferMessage(transfer: TransferRecord) {
    const cubeList = transfer.cubas.map((cube, index) =>
      `${index + 1}. ${cube.cadastro_produtos?.nome || "Sabor não encontrado"} — ${cube.codigo || "sem código"} (${formatWeight(cube.peso_liquido)} kg)`
    ).join("\n");
    const storeName = transfer.destino === "Loja Ahu" ? "Ahu" : transfer.destino === "Loja Alto XV" ? "Alto XV" : transfer.destino || "Loja";
    const message = `Nova Entrada de Estoque - Cubas ${storeName}\n\nTransferência de cubas concluída em ${formatDate(transfer.data_transferencia)}. As seguintes cubas foram enviadas para o estoque da loja:\n\n${cubeList}\n\nTotal: ${transfer.cubas.length} cuba(s).`;
    try {
      await navigator.clipboard.writeText(message);
      setCopiedTransferId(transfer.id);
    } catch (error) {
      console.error("Erro ao copiar mensagem da transferência:", error);
      alert("Não foi possível copiar a mensagem. Verifique a permissão da área de transferência do navegador.");
    }
  }

  const formatDate = (date?: string | null) => {
    if (!date) return "—";
    const parsedDate = new Date(`${date.slice(0, 10)}T12:00:00`);
    return Number.isNaN(parsedDate.getTime()) ? "—" : parsedDate.toLocaleDateString("pt-BR");
  };
  const formatDateTime = (date?: string | null) => date ? new Date(date).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";
  const formatWeight = (weight?: number | null) => weight == null ? "—" : Number(weight).toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

  const renderAvailableCuba = (cuba: any) => <div key={cuba.id} draggable onDragStart={event => { event.dataTransfer.setData("text/plain", String(cuba.id)); event.dataTransfer.effectAllowed = "move"; }} style={{ display: "grid", gap: 4, marginTop: 8, padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 7, background: "#fff", color: "#334155", cursor: "grab" }}>
    <strong>{cuba.cadastro_produtos?.nome || "Sabor"}</strong><span style={{ display: "flex", justifyContent: "space-between", gap: 8, color: "#64748b", fontSize: "14px" }}><span>{cuba.codigo || "Sem código"}</span><span>{formatDate(cuba.data_producao)}</span></span><span style={{ color: "#526982", fontSize: "14px" }}>Peso líquido: {formatWeight(cuba.peso_liquido)} kg</span>
  </div>;

  const renderNewTransferStoreColumn = (store: "Loja Ahu" | "Loja Alto XV") => {
    const assigned = store === "Loja Ahu" ? assignedAhuCubas : assignedAltoXvCubas;
    const currentCards = store === "Loja Ahu" ? storeCards.ahu : storeCards.altoxv;
    const currentFreezer = currentCards.filter(card => card.status === "freezer-estoque");
    const currentVitrine = currentCards.filter(card => card.status === "vitrine-atual");
    const pickerOpen = pickerStore === store;
    return <section key={store} onDragOver={event => event.preventDefault()} onDrop={event => dropCube(event, store)} style={{ boxSizing: "border-box", position: "relative", zIndex: pickerOpen ? 3 : 1, minHeight: 520, maxHeight: "72vh", minWidth: 300, overflowY: "auto", padding: 15, border: "1px solid #cbd5e1", borderRadius: 9, background: "#f8fafc" }}>
      <h3 style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, margin: 0, paddingBottom: 10, borderBottom: "1px solid #dbe3ec", color: "#475569", fontSize: "16px" }}><span>{store}</span><span style={{ display: "flex", gap: 5 }}><span style={{ padding: "3px 8px", borderRadius: 12, background: "#e9eef4", color: "#526982", fontSize: "13px" }}>{currentCards.length} em estoque</span><span style={{ padding: "3px 8px", borderRadius: 12, background: "#fff7ed", color: "#9a3412", fontSize: "13px" }}>{assigned.length} novas</span></span></h3>
      <div ref={pickerOpen ? pickerRef : null} style={{ position: "relative", marginTop: 10 }}>
        <button type="button" onClick={() => { setPickerStore(current => current === store ? null : store); setPickerSearch(""); setPickerActiveIndex(0); }} style={{ width: "100%", minHeight: 43, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, border: "1px dashed #aab7c6", borderRadius: 7, background: "transparent", color: "#64748b", cursor: "pointer", fontSize: "16px" }}><Icons.BsPlus /> Incluir nova cuba</button>
        {pickerOpen && <div style={{ position: "absolute", top: 49, left: 0, right: 0, zIndex: 20, maxHeight: 300, overflowY: "auto", padding: 8, border: "1px solid #dbe3ec", borderRadius: 7, background: "#fff", boxShadow: "0 10px 24px rgba(15,23,42,.16)" }}>
          <input autoFocus aria-label="Pesquisar cuba" placeholder="Pesquisar sabor..." value={pickerSearch} onChange={event => { setPickerSearch(event.target.value); setPickerActiveIndex(0); }} onKeyDown={event => {
            if (event.key === "ArrowDown") { event.preventDefault(); setPickerActiveIndex(index => Math.min(index + 1, filteredUnassignedCubas.length - 1)); }
            else if (event.key === "ArrowUp") { event.preventDefault(); setPickerActiveIndex(index => Math.max(index - 1, 0)); }
            else if (event.key === "Enter" && filteredUnassignedCubas.length) { event.preventDefault(); assignCube(String(filteredUnassignedCubas[Math.min(pickerActiveIndex, filteredUnassignedCubas.length - 1)].id), store); }
          }} style={{ boxSizing: "border-box", width: "100%", height: 39, marginBottom: 7, padding: "6px 9px", border: "1px solid #cbd5e1", borderRadius: 5, fontSize: "16px" }} />
          {filteredUnassignedCubas.map((cube, index) => <button key={cube.id} type="button" onMouseEnter={() => setPickerActiveIndex(index)} onClick={() => assignCube(String(cube.id), store)} style={{ width: "100%", display: "block", marginBottom: 5, padding: "9px 10px", border: 0, borderRadius: 5, background: index === pickerActiveIndex ? "#eaf1f8" : "#f8fafc", color: "#334155", textAlign: "left", cursor: "pointer", fontSize: "16px" }}><strong>{cube.cadastro_produtos?.nome || "Sabor"}</strong><span style={{ display: "block", marginTop: 3, color: "#7b8ba0", fontSize: "14px" }}>{cube.codigo || "Sem código"} · {formatDate(cube.data_producao)}</span><span style={{ display: "block", marginTop: 2, color: "#64748b", fontSize: "14px" }}>Peso líquido: {formatWeight(cube.peso_liquido)} kg</span></button>)}
          {!filteredUnassignedCubas.length && <p style={{ color: "#94a3b8", textAlign: "center", fontSize: "14px" }}>{unassignedCubas.length ? "Nenhuma cuba encontrada." : "Não há cubas disponíveis."}</p>}
        </div>}
      </div>
      {assigned.length ? assigned.map(cube => <div key={cube.id} draggable onDragStart={event => { event.dataTransfer.setData("text/plain", String(cube.id)); event.dataTransfer.effectAllowed = "move"; }} style={{ marginTop: 8, padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 7, background: "#fff", cursor: "grab" }}><strong>{cube.cadastro_produtos?.nome || "Sabor"}</strong><span style={{ display: "block", marginTop: 3, color: "#64748b", fontSize: "14px" }}>{cube.codigo || "Sem código"} · {formatDate(cube.data_producao)}</span><span style={{ display: "block", color: "#526982", fontSize: "14px" }}>Peso líquido: {formatWeight(cube.peso_liquido)} kg</span></div>) : <p onDragOver={event => event.preventDefault()} style={{ padding: "22px 8px", color: "#94a3b8", textAlign: "center" }}>Arraste cubas para cá</p>}
      <div style={{ marginTop: 18, paddingTop: 13, borderTop: "2px solid #cbd5e1" }}>
        <h4 style={{ margin: "0 0 10px", color: "#526982", fontSize: "16px" }}>Estoque atual da loja</h4>
        <h5 style={{ margin: "0 0 5px", color: "#64748b", fontSize: "14px" }}>No estoque ({currentFreezer.length})</h5>{currentFreezer.map(card => <div key={card.id} style={{ marginBottom: 6, padding: "9px 10px", border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff" }}><strong>{card.title}</strong><small style={{ display: "block", color: "#748298", fontSize: "14px" }}>Produção: {formatDate(card.production_date)}</small></div>)}
        <h5 style={{ margin: "10px 0 5px", color: "#64748b", fontSize: "14px" }}>Na vitrine ({currentVitrine.length})</h5>{currentVitrine.map(card => <div key={card.id} style={{ marginBottom: 6, padding: "9px 10px", border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff" }}><strong>{card.title}</strong><small style={{ display: "block", color: "#748298", fontSize: "14px" }}>Produção: {formatDate(card.production_date)} · Entrada: {formatDate(card.entry_date)}</small></div>)}
      </div>
    </section>;
  };

  return <>
    <Helmet>
      <title>Transferências de Estoque</title>
      <style>{`
        .transfer-editable-field:hover { background: #eff6ff !important; border-color: #93c5fd !important; color: #1d4ed8 !important; }
        @media (max-width: 700px) {
          .transfer-detail-overlay { padding: 8px !important; }
          .transfer-detail-dialog { width: 100% !important; max-height: calc(100dvh - 16px) !important; padding: 18px !important; }
          .transfer-detail-table-wrapper { overflow: visible !important; border: 0 !important; }
          .transfer-detail-table { min-width: 0 !important; display: block; background: transparent !important; }
          .transfer-detail-table thead { display: none; }
          .transfer-detail-table tbody { display: grid; gap: 10px; }
          .transfer-detail-table tbody tr { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; padding: 14px; border: 1px solid #dbe3ec; border-radius: 9px; }
          .transfer-detail-table tbody td { display: flex; flex-direction: column; gap: 3px; min-width: 0; padding: 0 !important; border: 0 !important; text-align: left !important; font-size: 14px !important; overflow-wrap: anywhere; }
          .transfer-detail-table tbody td::before { content: attr(data-label); color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; }
          .transfer-detail-table tbody td[data-label="Transferir"] { grid-column: 1 / -1; flex-direction: row; align-items: center; gap: 10px; }
          .transfer-detail-table tbody td[data-label="Sabor"] { grid-column: 1 / -1; font-size: 16px !important; }
          .transfer-detail-actions { flex-wrap: wrap; }
          .transfer-detail-actions button { flex: 1 1 auto; min-height: 42px; font-size: 14px !important; }
        }
      `}</style>
    </Helmet>
    <div className="frequencia-container">
      <div className="frequencia-header">
        <div className="frequencia-title-group">
          <h1>Transferências de Estoque</h1>
          <p>Registros dos romaneios de envio para as lojas.</p>
        </div>
      </div>
      <div style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <span style={{ color: "#64748b", fontWeight: 600 }}>Total de transferências: {totalCount}</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
             <button type="button" onClick={() => { setUnavailableCategory(null); setShowCategorySelection(true); }} disabled={transferLoading} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", border: 0, borderRadius: 6, background: "#80501f", color: "#fff", fontWeight: 700, cursor: transferLoading ? "wait" : "pointer" }}>{transferLoading ? <><Icons.BsArrowClockwise className="spin" /> Carregando...</> : <><Icons.BsPlusCircleFill /> Nova transferência</>}</button>
            <button type="button" onClick={() => void fetchTransfers()} disabled={loading} style={{ padding: "7px 12px", border: "1px solid #cbd5e1", borderRadius: 5, background: "#f1f5f9", color: "#475569", fontWeight: 700, cursor: loading ? "wait" : "pointer" }}><Icons.BsArrowClockwise /> Atualizar</button>
          </div>
        </div>
        <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <table className="freq-table" style={{ minWidth: 1150 }}>
            <thead><tr>
              {["Data", "Data de Transferência", "Descrição", "Quantidade de Cubas", "Destino", "Status", "Download", "Registrado Por", "Ações"].map(label => <th key={label} style={{ textAlign: "center", background: "#f1e7da", color: "#80501f", textTransform: "uppercase" }}>{label}</th>)}
            </tr></thead>
            <tbody>
              {loading && transferencias.length === 0 ? <tr><td colSpan={9} style={{ textAlign: "center", padding: 36 }}><Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} /></td></tr>
                : transferencias.length === 0 ? <tr><td colSpan={9} style={{ textAlign: "center", padding: 36, color: "#94a3b8", fontSize: "1.1rem" }}>Nenhuma transferência de cuba registrada.</td></tr>
                  : transferencias.map(transfer => <tr key={transfer.id} onClick={() => { setSelectedCubeIds([]); setSelectedTransferDetail(transfer); }} title="Clique para ver as cubas desta transferência" style={{ cursor: "pointer" }}>
                    <td style={{ textAlign: "center" }}>{formatDate(transfer.created_at)}</td>
                    <td style={{ textAlign: "center" }}>{editingTransferDateId === transfer.id ? <input aria-label="Data de transferência" type="date" autoFocus value={transfer.data_transferencia || ""} onClick={event => event.stopPropagation()} onChange={event => changeDraft(transfer.id, "data_transferencia", event.target.value)} onBlur={event => { void persistField(transfer.id, "data_transferencia", event.target.value); setEditingTransferDateId(null); }} onKeyDown={event => { if (event.key === "Enter") event.currentTarget.blur(); if (event.key === "Escape") setEditingTransferDateId(null); }} style={{ padding: "6px", border: "1px solid #cbd5e1", borderRadius: 5 }} /> : <button type="button" className="transfer-editable-field" title="Clique para editar a data de transferência" onClick={event => { event.stopPropagation(); setEditingTransferDateId(transfer.id); }} style={{ padding: "6px 8px", border: "1px solid transparent", borderRadius: 5, background: "transparent", color: "#334155", cursor: "pointer" }}>{formatDate(transfer.data_transferencia)}</button>}</td>
                    <td style={{ minWidth: 160, fontWeight: 600 }}>{transfer.descricao || "Transf. de Cubas"}</td>
                    <td style={{ textAlign: "center", fontWeight: 700 }}>{transfer.cubas.length}</td>
                    <td style={{ textAlign: "center" }} onClick={event => event.stopPropagation()}>{editingTransferDestinationId === transfer.id ? <select aria-label="Destino da transferência" autoFocus value={destinationSelectionValue} onChange={event => { const value = event.target.value; changeDraft(transfer.id, "destino", value); void persistField(transfer.id, "destino", value); setEditingTransferDestinationId(null); }} onBlur={() => setEditingTransferDestinationId(null)} onKeyDown={event => { if (event.key === "Escape") setEditingTransferDestinationId(null); }} style={{ padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: 5, background: "#fff", color: "#94a3b8" }}><option value="" disabled>Selecionar destino...</option>{DESTINATIONS.map(destination => <option key={destination} value={destination}>{destination === "Loja Alto XV" ? "Loja XV" : destination}</option>)}</select> : <button type="button" className="transfer-editable-field" title="Clique para editar o destino" onClick={event => { event.stopPropagation(); setDestinationSelectionValue(""); setEditingTransferDestinationId(transfer.id); }} style={{ padding: "6px 8px", border: "1px solid transparent", borderRadius: 5, background: "transparent", color: transfer.destino ? "#334155" : "#94a3b8", cursor: "pointer" }}>{transfer.destino ? (transfer.destino === "Loja Alto XV" ? "Loja XV" : transfer.destino) : "Selecionar destino..."}</button>}{savingFieldId === transfer.id && <span style={{ display: "block", color: "#64748b", fontSize: ".75rem" }}>Salvando…</span>}</td>
                    <td style={{ textAlign: "center" }}><span style={{ display: "inline-block", padding: "6px 10px", borderRadius: 5, background: transfer.status === "Concluída" ? "#f0fdf4" : transfer.status === "Cancelada" ? "#fef2f2" : "#fffbeb", color: transfer.status === "Concluída" ? "#15803d" : transfer.status === "Cancelada" ? "#b91c1c" : "#a16207", fontWeight: 700 }}>{transfer.status || "Pendente"}</span></td>
                    <td style={{ textAlign: "center" }}>{transfer.status === "Concluída" && transfer.cubas.length > 0 && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}><button type="button" title="Baixar romaneio de envio" aria-label={`Baixar romaneio de ${transfer.destino || "destino não selecionado"}`} onClick={event => { event.stopPropagation(); printTransferReport(transfer); }} style={{ width: 34, height: 34, border: "1px solid #bfdbfe", borderRadius: 6, background: "#eff6ff", color: "#2563eb", cursor: "pointer" }}><Icons.BsDownload /></button><button type="button" title={copiedTransferId === transfer.id ? "Mensagem copiada!" : "Copiar mensagem para WhatsApp"} aria-label={copiedTransferId === transfer.id ? "Mensagem copiada para a área de transferência" : `Copiar mensagem para avisar ${transfer.destino || "a loja"} pelo WhatsApp`} onClick={event => { event.stopPropagation(); void copyTransferMessage(transfer); }} style={{ width: 34, height: 34, border: "1px solid #bbf7d0", borderRadius: 6, background: "#f0fdf4", color: "#16a34a", cursor: "pointer" }}>{copiedTransferId === transfer.id ? <Icons.BsCheck /> : <Icons.BsWhatsapp />}</button></div>}</td>
                    <td style={{ textAlign: "center", color: "#64748b" }}><strong style={{ display: "block", color: "#475569" }}>{transfer.profiles?.name || "—"}</strong><span style={{ fontSize: ".82rem" }}>{formatDateTime(transfer.created_at)}</span></td>
                    <td style={{ textAlign: "center" }}><button type="button" title="Excluir transferência" aria-label={`Excluir transferência ${transfer.id}`} onClick={event => { event.stopPropagation(); setTransferToDelete(transfer); }} style={{ width: 34, height: 34, border: "1px solid #fecaca", borderRadius: 6, background: "#fff1f2", color: "#dc2626", cursor: "pointer" }}><Icons.BsTrash /></button></td>
                  </tr>)}
              {hasMore && <tr><td colSpan={9} style={{ padding: 14, textAlign: "center" }}><button type="button" onClick={() => void fetchTransfers(true)} disabled={loadingMore} style={{ display: "inline-flex", alignItems: "center", gap: 7, border: 0, background: "transparent", color: "var(--primary-color)", fontWeight: 700, fontSize: "1rem", cursor: loadingMore ? "wait" : "pointer" }}>{loadingMore ? <><Icons.BsArrowClockwise className="spin" /> Carregando...</> : <><Icons.BsChevronDown /> Carregar mais transferências</>}</button></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    {transferToDelete && <div role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !deletingTransfer) setTransferToDelete(null); }} style={{ position: "fixed", inset: 0, zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "rgba(15,23,42,.52)" }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="delete-transfer-title" aria-describedby="delete-transfer-description" style={{ boxSizing: "border-box", width: "min(480px, 100%)", padding: 24, border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff", boxShadow: "0 20px 60px rgba(15,23,42,.25)", fontSize: "16px" }}>
        <h2 id="delete-transfer-title" style={{ margin: "0 0 10px", color: "#334155", fontSize: "22px" }}>Excluir transferência?</h2>
        <p id="delete-transfer-description" style={{ margin: "0 0 20px", color: "#64748b", lineHeight: 1.5, fontSize: "16px" }}>O registro de {transferToDelete.destino || "destino não definido"} de {formatDate(transferToDelete.data_transferencia)} será excluído permanentemente. As cubas não serão removidas dos estoques.</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
          <button type="button" onClick={() => setTransferToDelete(null)} disabled={deletingTransfer} style={{ padding: "10px 15px", border: "1px solid #cbd5e1", borderRadius: 6, background: "#fff", color: "#475569", fontWeight: 700, fontSize: "16px", cursor: deletingTransfer ? "wait" : "pointer" }}>Cancelar</button>
          <button type="button" onClick={() => void deleteTransfer()} disabled={deletingTransfer} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 15px", border: 0, borderRadius: 6, background: "#dc2626", color: "#fff", fontWeight: 700, fontSize: "16px", cursor: deletingTransfer ? "wait" : "pointer" }}>{deletingTransfer ? <><Icons.BsArrowClockwise className="spin" /> Excluindo...</> : <><Icons.BsTrash /> Excluir transferência</>}</button>
        </div>
      </section>
    </div>}
    {selectedTransferDetail && <div className="transfer-detail-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setSelectedTransferDetail(null); }} style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "rgba(15,23,42,.52)" }}>
      <section className="transfer-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="transfer-detail-title" style={{ boxSizing: "border-box", width: "min(1100px, 100%)", maxHeight: "88vh", overflowY: "auto", padding: 28, border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff", boxShadow: "0 20px 60px rgba(15,23,42,.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
          <div><h2 id="transfer-detail-title" style={{ margin: "0 0 11px", color: "#334155", fontSize: "1.8rem" }}>Cubas da transferência</h2><div style={{ display: "grid", gap: 6, color: "#64748b", fontSize: "1.25rem", lineHeight: 1.4 }}><span><strong>Destino:</strong> {selectedTransferDetail.destino || "A definir"}</span><span><strong>Status:</strong> {selectedTransferDetail.status || "Pendente"}</span><span><strong>Data de transferência:</strong> {formatDate(selectedTransferDetail.data_transferencia)}</span><span><strong>Descrição:</strong> {selectedTransferDetail.descricao || "Transf. de Cubas"}</span><span><strong>Quantidade:</strong> {selectedTransferDetail.cubas.length} cuba(s)</span></div></div>
          <button type="button" aria-label="Fechar detalhes da transferência" onClick={() => setSelectedTransferDetail(null)} style={{ border: 0, background: "transparent", color: "#64748b", fontSize: "2rem", cursor: "pointer" }}><Icons.BsX /></button>
        </div>
        {selectedTransferDetail.status === "Pendente" && (selectedTransferDetail.destino === "Loja Ahu" || selectedTransferDetail.destino === "Loja Alto XV") && <p style={{ margin: "12px 0", color: "#475569", fontSize: "15px" }}>Selecione as cubas que realmente chegaram à loja. As demais permanecerão disponíveis no Estoque Fábrica.</p>}
        {selectedTransferDetail.cubas.length ? <div className="freq-table-wrapper transfer-detail-table-wrapper" style={{ marginTop: 18, overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 7 }}>
          <table className="freq-table transfer-detail-table" style={{ minWidth: 840, background: "#fff", fontSize: "14px" }}>
            <thead><tr>{selectedTransferDetail.status === "Pendente" && (selectedTransferDetail.destino === "Loja Ahu" || selectedTransferDetail.destino === "Loja Alto XV") && <th style={{ textAlign: "center", padding: "12px 10px", fontSize: "14px" }}>TRANSFERIR</th>}{["Sabor", "Código de Produção", "Data de Produção", "Peso Bruto (kg)", "Tara (kg)", "Peso Líquido (kg)"].map(label => <th key={label} style={{ textAlign: "center", padding: "12px 10px", fontSize: "14px" }}>{label}</th>)}</tr></thead>
            <tbody>{selectedTransferDetail.cubas.map(cube => {
              const selectable = selectedTransferDetail.status === "Pendente" && (selectedTransferDetail.destino === "Loja Ahu" || selectedTransferDetail.destino === "Loja Alto XV");
              const selected = selectedCubeIds.includes(Number(cube.id));
              const toggleCube = () => { if (!confirmingTransfer) setSelectedCubeIds(current => current.includes(Number(cube.id)) ? current.filter(id => id !== Number(cube.id)) : [...current, Number(cube.id)]); };
              return <tr key={cube.id} onClick={selectable ? toggleCube : undefined} onKeyDown={selectable ? event => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); toggleCube(); } } : undefined} tabIndex={selectable ? 0 : undefined} aria-selected={selectable ? selected : undefined} style={{ background: selected && selectable ? "#e8f5ed" : "#fff", cursor: selectable ? "pointer" : "default" }}>
              {selectable && <td data-label="Transferir" style={{ textAlign: "center" }}><input type="checkbox" aria-label={`Transferir cuba ${cube.codigo || cube.cadastro_produtos?.nome || cube.id}`} checked={selected} disabled={confirmingTransfer} onClick={event => event.stopPropagation()} onChange={toggleCube} style={{ width: 18, height: 18, cursor: "pointer" }} /></td>}
              <td data-label="Sabor" style={{ padding: "11px 10px", fontWeight: 700, fontSize: "15px" }}>{cube.cadastro_produtos?.nome || "Sabor não encontrado"}</td>
              <td data-label="Código" style={{ padding: "11px 10px", textAlign: "center", fontSize: "14px" }}>{cube.codigo || "—"}</td>
              <td data-label="Produção" style={{ padding: "11px 10px", textAlign: "center", fontSize: "14px" }}>{formatDate(cube.data_producao)}</td>
              <td data-label="Peso bruto (kg)" style={{ padding: "11px 10px", textAlign: "center", fontSize: "14px" }}>{formatWeight(cube.peso_bruto)}</td>
              <td data-label="Tara (kg)" style={{ padding: "11px 10px", textAlign: "center", fontSize: "14px" }}>{formatWeight(cube.tara)}</td>
              <td data-label="Peso líquido (kg)" style={{ padding: "11px 10px", textAlign: "center", fontWeight: 700, fontSize: "14px" }}>{formatWeight(cube.peso_liquido)}</td>
            </tr>; })}</tbody>
          </table>
        </div> : <p style={{ marginTop: 18, color: "#94a3b8", textAlign: "center", fontSize: "1.2rem" }}>Nenhuma cuba vinculada a este registro.</p>}
        <div className="transfer-detail-actions" style={{ display: "flex", justifyContent: "flex-end", gap: 9, marginTop: 20 }}>
          {selectedTransferDetail.status === "Pendente" && (selectedTransferDetail.destino === "Loja Ahu" || selectedTransferDetail.destino === "Loja Alto XV") && <button type="button" onClick={() => setShowCompleteConfirmation(true)} disabled={!selectedCubeIds.length || confirmingTransfer} style={{ padding: "10px 18px", border: 0, borderRadius: 6, background: "#16a34a", color: "#fff", fontSize: "1.05rem", fontWeight: 700, cursor: selectedCubeIds.length ? "pointer" : "not-allowed", opacity: selectedCubeIds.length ? 1 : .6 }}>Confirmar {selectedCubeIds.length} cuba(s)</button>}
          <button type="button" onClick={() => setSelectedTransferDetail(null)} style={{ padding: "10px 18px", border: "1px solid #cbd5e1", borderRadius: 6, background: "#fff", color: "#475569", fontSize: "1.05rem", fontWeight: 700, cursor: "pointer" }}>Fechar</button>
          {selectedTransferDetail.status === "Concluída" && selectedTransferDetail.cubas.length > 0 && <button type="button" onClick={() => printTransferReport(selectedTransferDetail)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", border: 0, borderRadius: 6, background: "#80501f", color: "#fff", fontSize: "1.05rem", fontWeight: 700, cursor: "pointer" }}><Icons.BsPrinterFill /> Imprimir romaneio</button>}
        </div>
      </section>
    </div>}
    {showCompleteConfirmation && selectedTransferDetail && <div role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !confirmingTransfer) setShowCompleteConfirmation(false); }} style={{ position: "fixed", inset: 0, zIndex: 1400, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "rgba(15,23,42,.52)" }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="complete-transfer-title" style={{ width: "min(500px, 100%)", padding: 24, borderRadius: 12, background: "#fff", boxShadow: "0 20px 60px rgba(15,23,42,.25)", fontSize: "16px" }}>
        <h2 id="complete-transfer-title" style={{ margin: "0 0 12px", color: "#334155", fontSize: "26px" }}>Confirmar entrada na loja?</h2>
        <p style={{ color: "#475569", lineHeight: 1.5, fontSize: "16px" }}>{selectedCubeIds.length} cuba(s) serão enviadas ao estoque de {selectedTransferDetail.destino}. As cubas não selecionadas continuarão no Estoque Fábrica. A transferência será marcada como concluída.</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 9, marginTop: 20 }}>
          <button type="button" onClick={() => setShowCompleteConfirmation(false)} disabled={confirmingTransfer} style={{ padding: "10px 15px", border: "1px solid #cbd5e1", borderRadius: 6, background: "#fff", color: "#475569", fontSize: "16px", cursor: "pointer" }}>Voltar</button>
          <button type="button" onClick={() => void confirmTransfer()} disabled={confirmingTransfer} style={{ padding: "10px 15px", border: 0, borderRadius: 6, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: "16px", cursor: confirmingTransfer ? "wait" : "pointer" }}>{confirmingTransfer ? "Transferindo..." : "Confirmar transferência"}</button>
        </div>
      </section>
    </div>}
    {showTransferCreated && <div role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setShowTransferCreated(false); }} style={{ position: "fixed", inset: 0, zIndex: 1400, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "rgba(15,23,42,.52)" }}>
      <section role="dialog" aria-modal="true" aria-labelledby="transfer-created-title" style={{ width: "min(480px, 100%)", padding: 26, borderRadius: 12, background: "#fff", boxShadow: "0 20px 60px rgba(15,23,42,.25)", textAlign: "center", fontSize: "16px" }}>
        <Icons.BsCheckCircleFill style={{ color: "#16a34a", fontSize: 36 }} />
        <h2 id="transfer-created-title" style={{ margin: "12px 0", color: "#334155", fontSize: "26px" }}>Transferência registrada</h2>
        <p style={{ color: "#475569", lineHeight: 1.5, fontSize: "16px" }}>O registro foi criado. As cubas continuam disponíveis no Estoque Fábrica até você confirmar quais foram transferidas.</p>
        <button type="button" autoFocus onClick={() => setShowTransferCreated(false)} style={{ marginTop: 14, padding: "10px 24px", border: 0, borderRadius: 6, background: "#80501f", color: "#fff", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}>Entendi</button>
      </section>
    </div>}
    {showCategorySelection && <div role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !transferLoading) setShowCategorySelection(false); }} style={{ position: "fixed", inset: 0, zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "rgba(15,23,42,.52)" }}>
      <section role="dialog" aria-modal="true" aria-labelledby="transfer-category-title" style={{ boxSizing: "border-box", width: "min(480px, 100%)", padding: 24, border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff", boxShadow: "0 20px 60px rgba(15,23,42,.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div><h2 id="transfer-category-title" style={{ margin: "0 0 7px", color: "#334155", fontSize: "1.4rem" }}>Nova transferência</h2><p style={{ margin: "0 0 18px", color: "#64748b" }}>Qual categoria você quer transferir?</p></div>
          <button type="button" aria-label="Fechar seleção de categoria" onClick={() => setShowCategorySelection(false)} disabled={transferLoading} style={{ border: 0, background: "transparent", color: "#64748b", fontSize: "1.6rem", cursor: "pointer" }}><Icons.BsX /></button>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {["Gelato", "Food Service", "Doces"].map(category => <button key={category} type="button" onClick={() => { if (category === "Gelato") void openNewTransfer(); else setUnavailableCategory(category); }} disabled={transferLoading} style={{ padding: "14px 16px", border: "1px solid #dbe3ec", borderRadius: 8, background: category === unavailableCategory ? "#f5ede5" : "#fff", color: "#80501f", fontWeight: 700, textAlign: "left", cursor: transferLoading ? "wait" : "pointer" }}>{category}</button>)}
        </div>
        {transferLoading && <p role="status" style={{ margin: "16px 0 0", color: "#64748b" }}>Carregando cubas disponíveis...</p>}
        {unavailableCategory && <p role="status" style={{ margin: "16px 0 0", color: "#64748b" }}>Transferências de {unavailableCategory} ainda não estão disponíveis.</p>}
      </section>
    </div>}
    {showNewTransfer && <div role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !transferSaving) { setShowNewTransfer(false); setPickerStore(null); } }} style={{ position: "fixed", inset: 0, zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: 12, background: "rgba(15,23,42,.52)" }}>
      <section role="dialog" aria-modal="true" aria-labelledby="new-transfer-title" style={{ boxSizing: "border-box", width: "min(1600px, calc(100vw - 24px))", maxHeight: "96vh", overflowY: "auto", padding: 24, border: "1px solid #e2e8f0", borderRadius: 14, background: "#fff", boxShadow: "0 24px 70px rgba(15,23,42,.25)", fontSize: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 8 }}>
          <div><h2 id="new-transfer-title" style={{ margin: "0 0 6px", color: "#334155", fontSize: "24px" }}>Transferir cubas para Lojas</h2><p style={{ margin: 0, color: "#64748b" }}>Arraste cada cuba de <strong>Cubas Disponíveis</strong> para a Loja Ahú ou Loja Alto XV. As alterações só serão gravadas ao salvar.</p></div>
          <button type="button" aria-label="Fechar nova transferência" onClick={() => { if (!transferSaving) { setShowNewTransfer(false); setPickerStore(null); } }} style={{ border: 0, background: "transparent", color: "#64748b", fontSize: "26px", cursor: transferSaving ? "wait" : "pointer" }}><Icons.BsX /></button>
        </div>
        {transferLoading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} /></div> : <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(280px, 1fr))", gap: 12, minWidth: 940, overflowX: "auto", padding: "12px 2px 8px" }}>
          <section onDragOver={event => event.preventDefault()} onDrop={event => dropCube(event, null)} style={{ boxSizing: "border-box", minHeight: 520, maxHeight: "72vh", minWidth: 300, overflowY: "auto", padding: 15, border: "1px dashed #cbd5e1", borderRadius: 9, background: "#fbfcfe" }}>
            <h3 style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, margin: 0, paddingBottom: 10, borderBottom: "1px solid #dbe3ec", color: "#475569", fontSize: "16px" }}><span>Cubas Disponíveis</span><span style={{ padding: "3px 8px", borderRadius: 12, background: "#e9eef4", color: "#526982", fontSize: "13px" }}>{unassignedCubas.length} cubas</span></h3>
            {unassignedCubas.length ? unassignedCubas.map(renderAvailableCuba) : <div style={{ padding: "22px 8px", color: "#94a3b8", textAlign: "center" }}>Todas as cubas foram destinadas</div>}
          </section>
          {renderNewTransferStoreColumn("Loja Ahu")}
          {renderNewTransferStoreColumn("Loja Alto XV")}
        </div>}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 12, paddingTop: 14, borderTop: "1px solid #e2e8f0" }}>
          <span style={{ color: "#64748b", fontWeight: 600 }}>{Object.keys(destinationByCuba).length} cuba(s) selecionadas para transferência</span>
          <div style={{ display: "flex", gap: 9 }}>
            <button type="button" onClick={() => { setShowNewTransfer(false); setPickerStore(null); }} disabled={transferSaving} style={{ padding: "10px 15px", border: "1px solid #cbd5e1", borderRadius: 6, background: "#fff", color: "#475569", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}>Cancelar</button>
            <button type="button" onClick={() => void saveNewTransfer(false)} disabled={transferSaving || !Object.keys(destinationByCuba).length} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", border: 0, borderRadius: 6, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: "16px", cursor: transferSaving || !Object.keys(destinationByCuba).length ? "not-allowed" : "pointer", opacity: transferSaving || !Object.keys(destinationByCuba).length ? .65 : 1 }}><Icons.BsCheckCircleFill /> Registrar transferência</button>
          </div>
        </div>
      </section>
    </div>}
    {showTransferConfirmation && <div role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !transferSaving) setShowTransferConfirmation(false); }} style={{ position: "fixed", inset: 0, zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "rgba(15,23,42,.52)" }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="transfer-cubes-confirm-title" style={{ boxSizing: "border-box", width: "min(650px, 100%)", maxHeight: "85vh", overflowY: "auto", padding: 24, border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff", boxShadow: "0 20px 60px rgba(15,23,42,.25)", fontSize: "16px" }}>
        <h2 id="transfer-cubes-confirm-title" style={{ margin: "0 0 7px", color: "#334155", fontSize: "24px" }}>Confirmar registro de transferência</h2>
        <p style={{ margin: "0 0 16px", color: "#64748b", lineHeight: 1.5 }}>Confira as cubas e os destinos. Será criado apenas o registro; nenhuma cuba será movimentada ainda.</p>
        {[{ store: "Loja Ahu", cubas: assignedAhuCubas }, { store: "Loja Alto XV", cubas: assignedAltoXvCubas }].filter(group => group.cubas.length > 0).map(group => <div key={group.store} style={{ marginTop: 12, padding: 13, border: "1px solid #dbe3ec", borderRadius: 8, background: "#f8fafc" }}>
          <h3 style={{ margin: "0 0 8px", color: "#475569", fontSize: "17px" }}>{group.store} — {group.cubas.length} cuba(s)</h3>
          <ul style={{ display: "grid", gap: 5, margin: 0, paddingLeft: 20, color: "#334155", fontSize: "15px" }}>{group.cubas.map(cube => <li key={cube.id}>{cube.cadastro_produtos?.nome || "Sabor"} · {cube.codigo || "Sem código"} · {cube.peso_liquido != null ? `${Number(cube.peso_liquido).toFixed(3)} kg` : "Peso líquido —"}</li>)}</ul>
        </div>)}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 9, marginTop: 20 }}>
          <button type="button" onClick={() => setShowTransferConfirmation(false)} disabled={transferSaving} style={{ padding: "10px 15px", border: "1px solid #cbd5e1", borderRadius: 6, background: "#fff", color: "#475569", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}>Voltar</button>
          <button type="button" onClick={() => void saveNewTransfer(true)} disabled={transferSaving} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 16px", border: 0, borderRadius: 6, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: "16px", cursor: transferSaving ? "wait" : "pointer" }}>{transferSaving ? <><Icons.BsArrowClockwise className="spin" /> Registrando...</> : <><Icons.BsCheckCircleFill /> Registrar transferência</>}</button>
        </div>
      </section>
    </div>}
  </>;
}

export default TransferenciasEstoque;
