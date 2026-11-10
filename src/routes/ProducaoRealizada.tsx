import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import { generateGelatoLabelsPdf } from "../utils/gelatoLabelPdf.ts";
import "../css/Frequencia.css";

const addCalendarMonthsToDate = (date: string, months: number) => {
  const [year, month, day] = date.split("-").map(Number);
  const targetMonthStart = new Date(year, month - 1 + months, 1, 12);
  const lastDayOfTargetMonth = new Date(targetMonthStart.getFullYear(), targetMonthStart.getMonth() + 1, 0, 12).getDate();
  targetMonthStart.setDate(Math.min(day, lastDayOfTargetMonth));
  return `${targetMonthStart.getFullYear()}-${String(targetMonthStart.getMonth() + 1).padStart(2, "0")}-${String(targetMonthStart.getDate()).padStart(2, "0")}`;
};

const addDaysToDate = (date: string, days: number) => {
  const [year, month, day] = date.split("-").map(Number);
  const result = new Date(year, month - 1, day + days, 12);
  return `${result.getFullYear()}-${String(result.getMonth() + 1).padStart(2, "0")}-${String(result.getDate()).padStart(2, "0")}`;
};

const calculateProductionValidity = (date: string, category?: string | null, productName?: string | null) => {
  if (category === "Doces") return addDaysToDate(date, (productName || "").toLowerCase().startsWith("waffle") ? 7 : 30);
  return addCalendarMonthsToDate(date, 3);
};

const historyFieldLabels: Record<string, string> = {
  codigo: "Código de produção", produto_id: "Produto", categoria_producao: "Categoria",
  data_producao: "Data de produção", peso_bruto: "Peso bruto", tara: "Tara",
  peso_liquido: "Peso líquido", data_entrada: "Data de entrada", destino: "Destino",
  validade: "Validade", quantidade: "Quantidade", cliente: "Cliente",
  embalagem: "Embalagem", quantidade_embalagem: "Quantidade de embalagens",
  status_revisao: "Status da revisão", revisao_observacao: "Observação da revisão",
  importado_automaticamente: "Importado automaticamente", data_ordem_producao: "Data da ordem de produção",
  ordem_producao_item_id: "Item da ordem de produção", user_id: "Usuário do registro",
  transferencia_cubas_id: "Transferência", created_at: "Data de criação"
};

type ProductionHistoryEvent = {
  id: number;
  acao: "criado" | "editado" | "excluido";
  alteracoes: Record<string, any>;
  responsavel_nome: string | null;
  ocorrido_em: string;
};

function ProducaoRealizada() {
  const { user, isAdmin } = useAuth();
  const [producoes, setProducoes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [historyProduction, setHistoryProduction] = useState<any | null>(null);
  const [historyEvents, setHistoryEvents] = useState<ProductionHistoryEvent[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const historyRequest = useRef(0);
  const formatHistoryValue = (field: string, value: any) => {
    if (value === null || value === undefined || value === "") return "—";
    if (field === "produto_id") return produtos.find(product => String(product.id) === String(value))?.nome || String(value);
    if (typeof value === "boolean") return value ? "Sim" : "Não";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  async function openProductionHistory(production: any) {
    const requestId = ++historyRequest.current;
    setHistoryProduction(production);
    setHistoryEvents([]);
    setHistoryError("");
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase.from("producao_realizada_historico")
        .select("id, acao, alteracoes, responsavel_nome, ocorrido_em")
        .eq("producao_id", production.id)
        .order("ocorrido_em", { ascending: true })
        .order("id", { ascending: true });
      if (error) throw error;
      if (requestId === historyRequest.current) setHistoryEvents((data || []) as ProductionHistoryEvent[]);
    } catch (error: any) {
      if (requestId === historyRequest.current) setHistoryError("Não foi possível carregar o histórico desta produção.");
      console.error("Erro ao carregar histórico da produção:", error);
    } finally {
      if (requestId === historyRequest.current) setHistoryLoading(false);
    }
  }

  function closeProductionHistory() {
    historyRequest.current++;
    setHistoryProduction(null);
  }
  const [clientesFoodService, setClientesFoodService] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRow, setSavingRow] = useState(false);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const selectRef = useRef<any>(null);
  const [productMenuMaxHeight, setProductMenuMaxHeight] = useState(350);
  const newModalRef = useRef<HTMLDialogElement>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Gelato");
  const [newRowCategory, setNewRowCategory] = useState("Gelato");
  const [newQuantity, setNewQuantity] = useState("");
  const [newClient, setNewClient] = useState("");
  const [packagingRows, setPackagingRows] = useState([{ embalagem: "", quantidade: "1" }]);
  const productionCategories = ["Gelato", "Food Service", "Doces"];
  const isDessertsTab = activeCategory === "Doces";
  const isSweetProduct = (product: any) => {
    const name = (product.nome || "").trim().toLowerCase();
    return name === "brownie" || name === "waffle" || name.startsWith("waffle ");
  };
  const getFormProductLabel = (product: any) => newRowCategory === "Doces" && isSweetProduct(product)
    ? product.nome.trim().toLowerCase().startsWith("waffle") ? "Waffle" : "Brownie"
    : product.nome;
  const categoryProducts = produtos.filter(product => activeCategory === "Food Service" ? product.is_sabor : activeCategory === "Doces" ? isSweetProduct(product) : (product.categoria || "").toLowerCase() === "gelato");
  const formCategoryProducts = produtos.filter(product => newRowCategory === "Food Service" ? product.is_sabor : newRowCategory === "Doces" ? isSweetProduct(product) : (product.categoria || "").toLowerCase() === "gelato");

  useEffect(() => {
    if (!showNewModal) return;
    const dialog = newModalRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [showNewModal]);

  useEffect(() => {
    if (!showNewModal) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !savingRow) setShowNewModal(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showNewModal, savingRow]);

  // Pagination state
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 100;

  // Filters state
  const [filterProdutoId, setFilterProdutoId] = useState<string | null>(null);
  const [filterData, setFilterData] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'deleted'>('all');
  const [productionDateSort, setProductionDateSort] = useState<"desc" | "asc">("desc");
  const [labelSelectionMode, setLabelSelectionMode] = useState(false);
  const [deleteSelectionMode, setDeleteSelectionMode] = useState(false);
  const [selectedDeleteIds, setSelectedDeleteIds] = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const selectionMode = labelSelectionMode || deleteSelectionMode;
  const showEntryAndDestination = activeCategory === "Gelato";
  const tableColumnCount = (selectionMode ? 14 : 13) - (isDessertsTab ? 4 : 0);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  useEffect(() => {
    setSelectedDeleteIds([]);
    setSelectedLabelIds([]);
  }, [activeCategory, filterProdutoId, filterData, filterStatus]);
  const productionDateSaveTimers = useRef<Record<string, number>>({});

  useEffect(() => () => {
    Object.values(productionDateSaveTimers.current).forEach(timer => window.clearTimeout(timer));
  }, []);
  const [pendingDeleteCount, setPendingDeleteCount] = useState(0);
  const [importCountdownNow, setImportCountdownNow] = useState(Date.now());
  const AUTO_IMPORT_RETENTION_MS = 10 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    async function checkPendingCounts() {
      try {
        if (isAdmin) {
          const { count: delCount, error: delError } = await supabase
            .from('producao_realizada')
            .select('*', { count: 'exact', head: true })
            .eq('status_revisao', 'pending_delete');
          if (!delError) setPendingDeleteCount(delCount || 0);
        }
      } catch (err) {
        console.error("Erro ao checar deletes:", err);
      }
    }
    checkPendingCounts();
  }, [producoes, isAdmin]);

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

  const sortProductionRows = (rows: any[]) => [...rows].sort((a, b) => {
    const dateA = a.data_producao || "";
    const dateB = b.data_producao || "";
    if (!dateA && dateB) {
      return 1;
    }
    if (dateA && !dateB) {
      return -1;
    }
    if (dateA && dateB) {
      const dateOrder = dateA.localeCompare(dateB);
      if (dateOrder !== 0) return productionDateSort === "desc" ? -dateOrder : dateOrder;
    }
    const nameA = a.cadastro_produtos?.nome || "";
    const nameB = b.cadastro_produtos?.nome || "";
    const nameOrder = nameA.localeCompare(nameB, "pt-BR", { sensitivity: "base", numeric: true });
    if (nameOrder !== 0) return nameOrder;
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchData(false, 0, filterProdutoId, filterData, filterStatus);
      return;
    }
    setPage(0);
    fetchData(false, 0, filterProdutoId, filterData, filterStatus);
  }, [filterProdutoId, filterData, filterStatus, productionDateSort, activeCategory]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setImportCountdownNow(Date.now());
      if (isAdmin) void cleanupExpiredAutoImports();
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [isAdmin]);

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
            fetchDataRef.current(false, 0, undefined, undefined, undefined, true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchData(isLoadMore = false, overridePage: number | null = null, fProdutoId = filterProdutoId, fData = filterData, fStatus = filterStatus, isBackground = false) {
    fetchDataRef.current = fetchData;
    try {
      if (!isLoadMore && isAdmin) await cleanupExpiredAutoImports();
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        if (!isBackground) setLoading(true);
        if (produtos.length === 0) {
          // Fetch produtos only on initial load
          const { data: produtosData, error: produtosError } = await supabase
            .from("cadastro_produtos")
            .select("id, nome, ativo, codigo, categoria, is_sabor")
            .order("nome", { ascending: true });

          if (produtosError) throw produtosError;
          setProdutos(produtosData || []);
        }
        if (clientesFoodService.length === 0) {
          const { data: clients, error: clientsError } = await supabase.from("clientes_food_service")
            .select("id, nome, ativo, status")
            .eq("ativo", true)
            .eq("status", "Negócio Fechado")
            .order("nome", { ascending: true });
          if (clientsError) throw clientsError;
          setClientesFoodService(clients || []);
        }
      }

      const currentPage = overridePage !== null ? overridePage : (isLoadMore ? page : 0);
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

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
          status_revisao,
          revisao_observacao,
          categoria_producao,
          quantidade,
          cliente,
          embalagem,
          quantidade_embalagem,
          importado_automaticamente,
          ordem_producao_item_id,
          data_ordem_producao,
          cadastro_produtos!inner(nome, codigo, categoria),
          profiles(name)
        `, { count: 'exact' });

      query = query.eq('categoria_producao', activeCategory);
      if (fProdutoId) query = query.eq('produto_id', fProdutoId);
      if (fData) query = query.eq('data_producao', fData);
      
      if (!isAdmin) {
        query = query.neq('status_revisao', 'pending_delete');
      } else {
        if (fStatus === 'deleted') {
          query = query.eq('status_revisao', 'pending_delete');
        }
      }

      const { data: prodData, count, error: prodError } = await query
        .order("data_producao", { ascending: productionDateSort === "asc", nullsFirst: false })
        .order("nome", { referencedTable: "cadastro_produtos", ascending: true })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(from, to);

      if (prodError) throw prodError;

      const fetchedProductions = (prodData || []).map((production: any) => {
        if (production.data_producao && !production.validade) {
          const validade = calculateProductionValidity(production.data_producao, production.categoria_producao, production.cadastro_produtos?.nome);
          void supabase.from("producao_realizada").update({ validade }).eq("id", production.id).then(({ error }) => {
            if (error) console.warn("Não foi possível salvar a validade calculada:", error);
          });
          return { ...production, validade };
        }
        return production;
      });
      const newProds = sortProductionRows(fetchedProductions);

      if (isLoadMore) {
        setProducoes(prev => sortProductionRows([...prev, ...newProds]));
      } else if (isBackground) {
        setProducoes(prev => {
          const fetchedById = new Map(newProds.map((row: any) => [row.id, row]));
          const previousIds = new Set(prev.map(row => row.id));
          const newlyFetched = newProds.filter((row: any) => !previousIds.has(row.id));
          const keptInPreviousOrder = prev.flatMap((row, index) => {
            const refreshed = fetchedById.get(row.id);
            if (refreshed) return [refreshed];
            return index >= PAGE_SIZE ? [row] : [];
          });
          return [...newlyFetched, ...keptInPreviousOrder];
        });
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

  async function cleanupExpiredAutoImports() {
    const cutoff = new Date(Date.now() - AUTO_IMPORT_RETENTION_MS).toISOString();
    try {
      const { data, error } = await supabase.from("producao_realizada")
        .delete()
        .eq("importado_automaticamente", true)
        .is("data_producao", null)
        .lt("created_at", cutoff)
        .select("id");
      if (error) throw error;
      const expiredIds = new Set((data || []).map((row: any) => row.id));
      if (expiredIds.size) setProducoes(rows => rows.filter(row => !expiredIds.has(row.id)));
    } catch (error) {
      console.error("Erro ao remover importações sem data de produção após 10 dias:", error);
    }
  }

  const getImportCountdown = (createdAt?: string | null) => {
    if (!createdAt) return "Prazo indisponível";
    const remaining = new Date(createdAt).getTime() + AUTO_IMPORT_RETENTION_MS - importCountdownNow;
    if (remaining <= 0) return "Expirado";
    if (remaining < 24 * 60 * 60 * 1000) return `Faltam ${Math.ceil(remaining / (60 * 60 * 1000))}h`;
    return `Faltam ${Math.ceil(remaining / (24 * 60 * 60 * 1000))} dias`;
  };

  const handleAddRow = async () => {
    if (!newRow.produto_id || !newRow.data_producao) {
      alert("Por favor, selecione o produto e informe a data de produção.");
      return;
    }

    setSavingRow(true);

    try {
      if (newRowCategory === "Doces" && (!newQuantity || Number(newQuantity) <= 0)) {
        alert("Informe uma quantidade válida.");
        return;
      }
      if (newRowCategory === "Food Service" && !newClient) {
        alert("Selecione o cliente.");
        return;
      }
      const selectedPackagingRows = newRowCategory === "Food Service"
        ? packagingRows.filter(row => row.embalagem.trim() || row.quantidade !== "1")
        : [];
      for (const packagingRow of selectedPackagingRows) {
        if (!packagingRow.embalagem.trim() || !Number.isInteger(Number(packagingRow.quantidade)) || Number(packagingRow.quantidade) < 1) {
          alert("Informe uma embalagem e uma quantidade válida para cada tipo.");
          return;
        }
      }
      const selectedProduct = produtos.find(p => p.id === newRow.produto_id);
      const prodCodigo = selectedProduct?.codigo || "ND";
      
      let ddMMyy = "";
      if (newRow.data_producao) {
        const parts = newRow.data_producao.split('-');
        if (parts.length === 3) {
          ddMMyy = `${parts[2]}${parts[1]}${parts[0].substring(2)}`;
        }
      }
      const baseCodProducao = `${prodCodigo}${ddMMyy}`;
      
      const { data: existingProds, error: existingProdsError } = await supabase
        .from("producao_realizada")
        .select("codigo")
        .eq("produto_id", newRow.produto_id)
        .eq("data_producao", newRow.data_producao);
      if (existingProdsError) throw existingProdsError;
      const packagingUnits = selectedPackagingRows.flatMap(row => Array.from({ length: Number(row.quantidade) }, () => row.embalagem.trim()));
      const packagingCount = packagingUnits.length || 1;
      const usedCodes = new Set((existingProds || []).map((production: any) => production.codigo).filter(Boolean));
      const productionCodes: string[] = [];
      for (let index = 0; index < packagingCount; index += 1) {
        let suffix = 1;
        let candidate = `${baseCodProducao}-${suffix++}`;
        while (usedCodes.has(candidate)) candidate = `${baseCodProducao}-${suffix++}`;
        usedCodes.add(candidate);
        productionCodes.push(candidate);
      }

      let calculatedPesoLiquido: number | null = null;
      const pb = newRowCategory === "Gelato" && newRow.peso_bruto.trim() !== "" ? parseFloat(newRow.peso_bruto) : null;
      const t = newRowCategory === "Gelato" && newRow.tara.trim() !== "" ? parseFloat(newRow.tara) : null;
      if ((pb !== null && !Number.isFinite(pb)) || (t !== null && !Number.isFinite(t))) {
        alert("Informe um valor numérico válido para o peso ou a tara.");
        return;
      }
      if (pb !== null && t !== null) {
        calculatedPesoLiquido = parseFloat((pb - t).toFixed(2));
      }

      let calculatedValidade: string | null = null;
      if (newRow.data_producao) {
        calculatedValidade = calculateProductionValidity(newRow.data_producao, newRowCategory, selectedProduct?.nome);
      }

      const productionRows = productionCodes.map((codigo, index) => ({
          produto_id: newRow.produto_id,
          codigo,
          data_producao: newRow.data_producao,
          peso_bruto: pb,
          tara: t,
          peso_liquido: calculatedPesoLiquido,
          categoria_producao: newRowCategory,
          quantidade: newRowCategory === "Doces" ? Number(newQuantity) : null,
          cliente: newRowCategory === "Food Service" ? newClient : null,
          embalagem: newRowCategory === "Food Service" ? (packagingUnits[index] || null) : null,
          quantidade_embalagem: packagingUnits[index] ? 1 : null,
          data_entrada: null,
          destino: null,
          validade: calculatedValidade,
          user_id: user?.id
        }));

      const { data, error } = await supabase
        .from("producao_realizada")
        .insert(productionRows)
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
          categoria_producao,
          quantidade,
          cliente,
          embalagem,
          quantidade_embalagem,
          produto_id,
          created_at,
          user_id,
          cadastro_produtos(nome, codigo, categoria),
          profiles(name)
        `);

      if (error) throw error;

      // Mostra qualquer novo registro no início, independentemente da data de produção.
      setProducoes(prev => [...(data || []).reverse(), ...prev]);
      setActiveCategory(newRowCategory);

      const firstInsertedId = data?.[0]?.id;
      setNewlyAddedId(firstInsertedId || null);
      setTimeout(() => {
        setNewlyAddedId(current => current === firstInsertedId ? null : current);
      }, 5500);

      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 2000);
      setShowNewModal(false);

      // Clear specific fields but keep date to speed up input
      setNewRow({
        ...newRow,
        produto_id: "",
        peso_bruto: "",
        tara: "",
        peso_liquido: "",
        validade: ""
      });
      setNewQuantity("");
      setNewClient("");
      setPackagingRows([{ embalagem: "", quantidade: "1" }]);

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

  const handleQuickUpdate = async (id: string, field: "data_producao" | "data_entrada" | "destino", value: string) => {
    try {
      const production = producoes.find(row => row.id === id);
      const updateData: Record<string, any> = { [field]: value || null };
      if (field === "data_producao") {
        updateData.validade = value ? calculateProductionValidity(value, production?.categoria_producao, production?.cadastro_produtos?.nome) : null;
        if (value && production) {
          const productCode = produtos.find(product => product.id === production.produto_id)?.codigo || production.cadastro_produtos?.codigo || "ND";
          const [year, month, day] = value.split("-");
          const baseCode = `${productCode}${day}${month}${year.slice(-2)}`;
          const { data: existingCodes, error: codeError } = await supabase.from("producao_realizada")
            .select("codigo")
            .eq("produto_id", production.produto_id)
            .eq("data_producao", value)
            .neq("id", id);
          if (codeError) throw codeError;
          const usedCodes = new Set((existingCodes || []).map((row: any) => row.codigo).filter(Boolean));
          let suffix = 1;
          let nextCode = `${baseCode}-${suffix++}`;
          while (usedCodes.has(nextCode)) nextCode = `${baseCode}-${suffix++}`;
          updateData.codigo = nextCode;
        } else if (!value) {
          updateData.codigo = null;
        }
      }
      const { error } = await supabase
        .from("producao_realizada")
        .update(updateData)
        .eq("id", id);
      
      if (error) throw error;

      setProducoes(prev => prev.map(p => p.id === id ? { ...p, ...updateData } : p));
    } catch (err: any) {
      console.error(`Erro ao atualizar ${field}:`, err);
      alert(`Erro ao atualizar: ${err.message || JSON.stringify(err)}`);
    }
  };

  const scheduleProductionDateSave = (id: string, value: string) => {
    const currentTimer = productionDateSaveTimers.current[id];
    if (currentTimer) window.clearTimeout(currentTimer);
    productionDateSaveTimers.current[id] = window.setTimeout(() => {
      delete productionDateSaveTimers.current[id];
      void handleQuickUpdate(id, "data_producao", value);
    }, 1000);
  };

  const handleQuickWeightUpdate = async (id: string, field: "peso_bruto" | "tara", value: string) => {
    if (!value.trim()) return;
    const weight = Number(value);
    if (!Number.isFinite(weight)) {
      alert("Informe um peso válido.");
      return;
    }
    const production = producoes.find(row => row.id === id);
    if (!production) return;
    const pesoBruto = field === "peso_bruto" ? weight : production.peso_bruto;
    const tara = field === "tara" ? weight : production.tara;
    const pesoLiquido = pesoBruto != null && tara != null ? Number((Number(pesoBruto) - Number(tara)).toFixed(3)) : null;
    try {
      const { error } = await supabase.from("producao_realizada")
        .update({ [field]: weight, peso_liquido: pesoLiquido })
        .eq("id", id);
      if (error) throw error;
      setProducoes(rows => rows.map(row => row.id === id ? { ...row, [field]: weight, peso_liquido: pesoLiquido } : row));
    } catch (error: any) {
      console.error(`Erro ao atualizar ${field}:`, error);
      alert(`Não foi possível salvar o peso: ${error.message || "erro inesperado"}`);
    }
  };

  const saveEdit = async (prod: any) => {
    try {
      setSavingRow(true);
      const pb = parseFloat(editRowData.peso_bruto);
      const t = parseFloat(editRowData.tara);
      let calculatedPesoLiquido: number | null = null;
      if (!isNaN(pb) && !isNaN(t)) {
        calculatedPesoLiquido = parseFloat((pb - t).toFixed(3));
      }

      let calculatedValidade: string | null = prod.validade;
      let finalCodProducao: string | null = prod.codigo;
      const newProductionDate: string | null = editRowData.data_producao || null;

      const dateChanged = newProductionDate !== (prod.data_producao || null);
      const productChanged = editRowData.produto_id && editRowData.produto_id !== prod.produto_id;
      const newProdutoId = editRowData.produto_id || prod.produto_id;

      if (dateChanged || productChanged) {
        if (newProductionDate && (dateChanged || productChanged)) {
          const editProductName = produtos.find(product => product.id === (editRowData.produto_id || prod.produto_id))?.nome || prod.cadastro_produtos?.nome;
          calculatedValidade = calculateProductionValidity(newProductionDate, prod.categoria_producao, editProductName);
        }

        if (newProductionDate) {
          const selectedProduct = produtos.find(p => p.id === newProdutoId);
          const prodCodigo = selectedProduct?.codigo || "ND";
          const parts = newProductionDate.split('-');
          const ddMMyy = parts.length === 3 ? `${parts[2]}${parts[1]}${parts[0].substring(2)}` : "";
          const baseCodProducao = `${prodCodigo}${ddMMyy}`;

          const { data: existingProds, error: existingCodesError } = await supabase
            .from("producao_realizada")
            .select("codigo")
            .eq("produto_id", newProdutoId)
            .eq("data_producao", newProductionDate)
            .neq("id", prod.id);
          if (existingCodesError) throw existingCodesError;

          finalCodProducao = `${baseCodProducao}-1`;
          if (existingProds && existingProds.length > 0) {
            let maxSuffix = -1;
            for (const p of existingProds) {
              if (p.codigo === baseCodProducao) {
                if (maxSuffix < 0) maxSuffix = 0;
              } else if (p.codigo?.startsWith(baseCodProducao + "-")) {
                const suffixStr = p.codigo.substring((baseCodProducao + "-").length);
                const suffixNum = parseInt(suffixStr, 10);
                if (!isNaN(suffixNum) && suffixNum > maxSuffix) {
                  maxSuffix = suffixNum;
                }
              }
            }
            if (maxSuffix >= 0) finalCodProducao = `${baseCodProducao}-${maxSuffix + 1}`;
          }
        } else {
          calculatedValidade = null;
          finalCodProducao = null;
        }
      }

      const { data, error } = await supabase
        .from("producao_realizada")
        .update({
          produto_id: newProdutoId,
          peso_bruto: isNaN(pb) ? null : pb,
          tara: isNaN(t) ? null : t,
          peso_liquido: calculatedPesoLiquido,
          data_producao: newProductionDate,
          data_entrada: editRowData.data_entrada || null,
          destino: editRowData.destino || null,
          validade: calculatedValidade,
          codigo: finalCodProducao
        })
        .eq("id", prod.id)
        .select(`
          id, codigo, data_producao, peso_bruto, tara, peso_liquido, 
          data_entrada, destino, validade, produto_id, created_at, user_id, 
          cadastro_produtos(nome, codigo, categoria), profiles(name)
        `)
        .single();
      
      if (error) throw error;

      setProducoes(prev => prev.map(p => p.id === prod.id ? data : p));
      setEditingRowId(null);
    } catch (err: any) {
      console.error("Erro ao salvar edição:", err);
      alert("Erro ao salvar: " + (err.message || JSON.stringify(err)));
    } finally {
      setSavingRow(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este registro de produção? O histórico será perdido.")) return;
    try {
      if (isAdmin) {
        const { error } = await supabase
          .from("producao_realizada")
          .delete()
          .eq("id", id);
        if (error) throw error;
        setProducoes(producoes.filter(p => p.id !== id));
      } else {
        const { error } = await supabase
          .from("producao_realizada")
          .update({ status_revisao: 'pending_delete' })
          .eq("id", id);
        if (error) throw error;
        
        if (filterStatus !== 'deleted') {
          setProducoes(producoes.filter(p => p.id !== id));
        } else {
          setProducoes(producoes.map(c => c.id === id ? { ...c, status_revisao: 'pending_delete' } : c));
        }
      }
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao excluir o registro.");
    }
  };

  const handleUpdateReviewStatus = async (id: string, newStatus: string) => {
    try {
      const updateData: any = { status_revisao: newStatus };
      if (newStatus === 'none' || newStatus === 'pending_user') {
        updateData.revisao_observacao = null;
      }

      const { error } = await supabase
        .from("producao_realizada")
        .update(updateData)
        .eq("id", id);
      
      if (error) throw error;
      setProducoes(producoes.map(m => m.id === id ? { ...m, ...updateData } : m));
    } catch (err) {
      console.error("Erro ao alterar status de revisão:", err);
      alert("Erro ao alterar o status de revisão.");
    }
  };

  const toggleLabelSelection = (id: string, selected: boolean) => {
    setSelectedLabelIds(current => selected
      ? Array.from(new Set([...current, id]))
      : current.filter(selectedId => selectedId !== id));
  };

  const toggleDeleteSelection = (id: string, selected: boolean) => {
    if (bulkDeleting) return;
    setSelectedDeleteIds(current => selected ? Array.from(new Set([...current, id])) : current.filter(value => value !== id));
  };

  const handleBulkDelete = async () => {
    const ids = producoes.filter(row => selectedDeleteIds.includes(row.id) && (isAdmin || row.status_revisao !== "pending_delete")).map(row => row.id);
    if (!ids.length || bulkDeleting) return;
    if (!window.confirm(isAdmin
      ? `Excluir definitivamente ${ids.length} registros de produção selecionados?`
      : `Solicitar a exclusão de ${ids.length} registros de produção selecionados?`)) return;
    setBulkDeleting(true);
    try {
      const query = supabase.from("producao_realizada");
      const { data, error } = await (isAdmin ? query.delete() : query.update({ status_revisao: "pending_delete" })).in("id", ids).select("id");
      if (error) throw error;
      const affectedIds = new Set((data || []).map(row => row.id));
      if (affectedIds.size !== ids.length) throw new Error("Nem todos os registros puderam ser alterados. Confira os registros restantes.");
      setProducoes(current => current.filter(row => !affectedIds.has(row.id)));
      setSelectedLabelIds(current => current.filter(id => !affectedIds.has(id)));
      setTotalCount(current => Math.max(0, current - affectedIds.size));
      setSelectedDeleteIds([]);
      setDeleteSelectionMode(false);
    } catch (error: any) {
      console.error("Erro na exclusão em massa:", error);
      alert(`Não foi possível concluir a exclusão em massa: ${error.message || "erro inesperado"}`);
      await fetchData(false, 0);
      setSelectedDeleteIds([]);
    } finally { setBulkDeleting(false); }
  };

  const handlePrintSelectedLabels = async () => {
    const selectedProductions = producoes.filter(production => selectedLabelIds.includes(production.id));
    if (!selectedProductions.length) return;
    try {
      await generateGelatoLabelsPdf(selectedProductions.map(production => ({
        code: production.codigo ?? null,
        flavor: production.cadastro_produtos?.nome || "Sabor",
        date: production.data_producao || "",
        peso: production.peso_bruto == null ? "" : Number(production.peso_bruto).toFixed(3),
        tara: production.tara == null ? "" : Number(production.tara).toFixed(3)
      })));
      setSelectedLabelIds([]);
      setLabelSelectionMode(false);
    } catch (error: any) {
      console.error("Erro ao gerar etiquetas selecionadas:", error);
      alert(`Não foi possível gerar as etiquetas: ${error.message || "erro inesperado"}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Produção Realizada</title>
        <style>{`
          @keyframes pulse-red {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
          .producao-table .freq-table tbody tr.production-data-row > td { border-bottom: 1px solid #cbd5e1 !important; transition: background-color .15s ease; }
          .producao-table .freq-table tbody tr.production-data-row:hover > td { background-color: #f1f6fb !important; }
          .producao-table .freq-table tbody tr.production-data-row[aria-selected="true"]:hover > td { background-color: #e5efff !important; }
          .producao-table .freq-table tbody tr.production-data-row[data-delete-selected="true"] > td { background-color: #fee2e2 !important; }
          .producao-table .freq-table tbody tr.production-data-row[data-delete-selected="true"]:hover > td { background-color: #fecaca !important; }
          .producao-table .freq-table th { padding: 6px !important; font-size: 1.1rem !important; line-height: 1.2 !important; }
          .producao-table .freq-table td { padding: 5px 6px !important; font-size: 1.15rem !important; line-height: 1.25 !important; height: auto !important; }
          .production-new-modal { position: fixed; left: 50%; top: 50%; right: auto; bottom: auto; transform: translate(-50%, -50%); margin: 0; box-sizing: border-box; width: 1124px; max-width: calc(100vw - 32px); max-height: calc(100vh - 32px); overflow: visible; border: 1px solid #e2e8f0; border-radius: 14px; padding: 28px 30px; box-shadow: 0 20px 50px rgba(15,23,42,.25); }
          .production-new-modal::backdrop { background: rgba(15,23,42,.45); }
          .production-new-fields { display: grid !important; grid-template-columns: minmax(280px, 2fr) minmax(180px, 1.2fr) repeat(2, minmax(120px, .8fr)) 187px; gap: 14px !important; align-items: end; }
           .production-new-fields > div { min-width: 0; }
           .production-new-fields-food-service { grid-template-columns: minmax(280px, 2fr) minmax(180px, 1.2fr) minmax(150px, 1fr) minmax(150px, 1fr) !important; }
           .production-new-fields-food-service .production-field-product { grid-column: 1; grid-row: 1; }
           .production-new-fields-food-service .production-field-date { grid-column: 2; grid-row: 1; }
           .production-new-fields-food-service .production-field-client { grid-column: 3; grid-row: 1; }
           .production-new-fields-food-service .production-field-packaging-list { grid-column: 1 / 4; grid-row: 2; }
           .production-packaging-row { display: grid; grid-template-columns: minmax(180px, 1fr) minmax(130px, .7fr) 36px; gap: 12px; align-items: end; margin-bottom: 10px; }
           .production-new-fields-food-service .production-field-save { grid-column: 4; grid-row: 2; align-self: end; }
          .production-new-fields input { box-sizing: border-box; height: 58px !important; }
          .production-new-fields .production-save-button { height: 58px !important; }
           @media (max-width: 850px) { .production-new-fields { grid-template-columns: repeat(2, minmax(0, 1fr)); } .production-new-fields > div:first-child { grid-column: 1 / -1; } .production-new-fields-food-service > div { grid-column: auto; grid-row: auto; } }
           @media (max-width: 520px) { .production-new-fields { grid-template-columns: minmax(0, 1fr); } .production-new-fields > div:first-child { grid-column: auto; } }
        `}</style>
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

          {showCategoryModal && <div role="dialog" aria-modal="true" aria-labelledby="production-category-title" style={{ position: "fixed", inset: 0, zIndex: 10001, background: "rgba(15,23,42,.45)", display: "grid", placeItems: "center", padding: 16 }}>
            <div style={{ background: "white", borderRadius: 14, padding: 28, width: "min(480px, 100%)", boxShadow: "0 20px 50px rgba(15,23,42,.25)" }}>
              <h3 id="production-category-title" style={{ margin: "0 0 18px", color: "#334155" }}>O que você vai lançar na produção?</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {productionCategories.map(category => <button key={category} type="button" onClick={() => { setNewRowCategory(category); setShowCategoryModal(false); setShowNewModal(true); }} style={{ padding: "14px 18px", border: "1px solid #cbd5e1", borderRadius: 8, background: category === "Gelato" ? "#f8fafc" : "white", color: "#334155", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", textAlign: "left" }}>{category}</button>)}
              </div>
              <button type="button" onClick={() => setShowCategoryModal(false)} style={{ marginTop: 16, background: "none", border: 0, color: "#64748b", cursor: "pointer" }}>Cancelar</button>
            </div>
          </div>}
          {showNewModal && <dialog ref={newModalRef} className="production-new-modal" aria-labelledby="production-new-modal-title" onClick={(event) => {
            // Cliques na área de backdrop têm o próprio dialog como target; opções/selects nunca fecham o modal.
            if (event.target === newModalRef.current && !savingRow) setShowNewModal(false);
          }} onCancel={(event) => { event.preventDefault(); if (!savingRow) setShowNewModal(false); }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 id="production-new-modal-title" style={{ margin: 0, color: "#334155", fontSize: "1.8rem", display: "flex", alignItems: "center", gap: "8px" }}><Icons.BsPlusCircleFill style={{ color: "var(--primary-color)" }} /> Registrar Produção</h3>
            <button type="button" aria-label="Fechar" disabled={savingRow} onClick={() => setShowNewModal(false)} style={{ background: "none", border: "none", color: "#64748b", fontSize: "2rem", cursor: "pointer" }}><Icons.BsX /></button>
          </div>
          <div style={{
            backgroundColor: "#fff",
            padding: "0",
          }}>
            <div className={`production-new-fields${newRowCategory === "Food Service" ? " production-new-fields-food-service" : ""}`} style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "flex-end"
            }}>
              <div className={newRowCategory === "Food Service" ? "production-field-product" : undefined} style={{ flex: "2 1 250px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Produto *</label>
                <Select
                   ref={selectRef}
                   autoFocus
                   menuPlacement="bottom"
                   classNamePrefix="production-select"
                   maxMenuHeight={productMenuMaxHeight}
                   onMenuOpen={() => {
                     const control = selectRef.current?.controlRef as HTMLElement | undefined;
                     const controlBottom = control?.getBoundingClientRect().bottom ?? 0;
                     const viewportHeight = window.visualViewport?.height || window.innerHeight;
                     setProductMenuMaxHeight(Math.max(120, Math.min(350, viewportHeight - controlBottom - 16)));
                   }}
                    options={formCategoryProducts.filter(p => p.ativo !== false).map(p => ({ value: p.id, label: getFormProductLabel(p) }))}
                    value={newRow.produto_id ? { value: newRow.produto_id, label: (() => { const selected = formCategoryProducts.find(p => p.id === newRow.produto_id); return selected ? getFormProductLabel(selected) : ""; })() } : null}
                  onChange={(selectedOption) => setNewRow({ ...newRow, produto_id: selectedOption ? selectedOption.value : "" })}
                  placeholder="Buscar Produto..."
                  isClearable
                  noOptionsMessage={() => "Nenhum produto encontrado"}
                   styles={{
                      control: (base) => ({ ...base, borderColor: '#cbd5e1', minHeight: '58px', height: '58px', borderRadius: '4px', fontSize: '1.2rem', textAlign: 'center' }),
                      input: (base) => ({ ...base, textAlign: 'center' }),
                      placeholder: (base) => ({ ...base, width: '100%', textAlign: 'center' }),
                      singleValue: (base) => ({ ...base, width: '100%', textAlign: 'center' }),
                     menu: (base) => ({ ...base, width: '380px', maxWidth: 'calc(100vw - 32px)', textAlign: 'left', fontSize: '15px', zIndex: 10000 }),
                     option: (base) => ({ ...base, fontSize: '15px', lineHeight: 1.5, padding: '10px 12px', whiteSpace: 'normal', overflowWrap: 'anywhere' }),
                     menuPortal: (base) => ({ ...base, zIndex: 10000 })
                   }}
                />
              </div>
              <div className={newRowCategory === "Food Service" ? "production-field-date" : undefined} style={{ flex: "1 1 150px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Data Produção *</label>
                <input
                  type="date"
                  value={newRow.data_producao}
                  onChange={(e) => setNewRow({ ...newRow, data_producao: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "58px", fontSize: "1.2rem" }}
                />
              </div>
              {newRowCategory === "Gelato" && <><div style={{ flex: "1 1 100px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Peso Bruto (kg)</label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="Bruto"
                  value={newRow.peso_bruto}
                  onChange={(e) => setNewRow({ ...newRow, peso_bruto: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "58px", fontSize: "1.2rem" }}
                />
              </div>
              <div style={{ flex: "1 1 100px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Tara (kg)</label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="Tara"
                  value={newRow.tara}
                  onChange={(e) => setNewRow({ ...newRow, tara: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "58px", fontSize: "1.2rem" }}
                />
              </div>
              </>}
              {newRowCategory === "Doces" && <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Quantidade *</label>
                <input type="number" min="1" step="1" value={newQuantity} onChange={event => setNewQuantity(event.target.value)} placeholder="Quantidade" style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "58px", fontSize: "1.2rem" }} />
              </div>}
              {newRowCategory === "Food Service" && <div className="production-field-client" style={{ flex: "1 1 180px" }}>
                <label style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Cliente *</label>
                <select value={newClient} onChange={event => setNewClient(event.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", height: "58px", fontSize: "1.1rem" }}>
                  <option value="">Selecionar cliente...</option>
                  {clientesFoodService.map(client => <option key={client.id} value={client.nome}>{client.nome}</option>)}
                </select>
              </div>}
              {newRowCategory === "Food Service" && <div className="production-field-packaging-list">
                {packagingRows.map((row, index) => <div className="production-packaging-row" key={index}>
                  <div>
                    <label htmlFor={`food-service-packaging-${index}`} style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Embalagem</label>
                    <CreatableSelect
                      inputId={`food-service-packaging-${index}`}
                      classNamePrefix="production-select"
                      options={["1 Litro", "2,2 Litros", "3,6 Litros"].map(packaging => ({ value: packaging, label: packaging }))}
                      value={row.embalagem ? { value: row.embalagem, label: row.embalagem } : null}
                      onChange={option => setPackagingRows(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, embalagem: option?.value || "" } : item))}
                      placeholder="Escolher ou digitar..."
                      formatCreateLabel={value => `Usar "${value}"`}
                      isClearable
                      noOptionsMessage={() => "Digite para informar outra embalagem"}
                      styles={{
                        control: base => ({ ...base, borderColor: "#cbd5e1", minHeight: 58, height: 58, borderRadius: 4, fontSize: "1.1rem" }),
                        valueContainer: base => ({ ...base, padding: "0 8px" }),
                        menu: base => ({ ...base, zIndex: 10000, fontSize: "1.1rem" }),
                        option: base => ({ ...base, padding: "10px 12px" }),
                        menuPortal: base => ({ ...base, zIndex: 10000 })
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor={`food-service-packaging-quantity-${index}`} style={{ display: "block", fontSize: "1.1rem", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Quantidade</label>
                    <input id={`food-service-packaging-quantity-${index}`} type="number" min="1" step="1" value={row.quantidade} onChange={event => setPackagingRows(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, quantidade: event.target.value } : item))} placeholder="Quantidade" style={{ width: "100%", boxSizing: "border-box", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", height: "58px", fontSize: "1.2rem" }} />
                  </div>
                  {packagingRows.length > 1 ? <button type="button" aria-label="Remover embalagem" onClick={() => setPackagingRows(current => current.filter((_, itemIndex) => itemIndex !== index))} style={{ height: 38, border: "1px solid #fecaca", borderRadius: 5, background: "#fff1f2", color: "#b91c1c", cursor: "pointer" }}><Icons.BsTrash /></button> : <span />}
                </div>)}
                <button type="button" onClick={() => setPackagingRows(current => [...current, { embalagem: "", quantidade: "1" }])} style={{ padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: 5, color: "var(--primary-color)", background: "#fff", cursor: "pointer", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}><Icons.BsPlusCircleFill /> Adicionar outra embalagem</button>
              </div>}

              <div className={newRowCategory === "Food Service" ? "production-field-save" : undefined} style={{ flex: "0 0 150px", position: "relative" }}>
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
                    height: "58px",
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
                  className="production-save-button"
                >
                  {savingRow ? <><Icons.BsArrowClockwise className="spin" /> Salvando...</> : <><Icons.BsCheckCircleFill /> Salvar</>}
                </button>
              </div>
            </div>
          </div>
          </dialog>}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #e2e8f0", overflowX: "auto" }}>
            <div role="tablist" aria-label="Categoria da produção" style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {productionCategories.map(category => <button key={category} type="button" role="tab" aria-selected={activeCategory === category} onClick={() => { setActiveCategory(category); setFilterProdutoId(null); }} style={{ padding: "9px 18px", border: "1px solid", borderColor: activeCategory === category ? "var(--primary-color)" : "#cbd5e1", borderRadius: 6, background: activeCategory === category ? "var(--primary-color)" : "white", color: activeCategory === category ? "white" : "#475569", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{category}</button>)}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, flexShrink: 0, whiteSpace: "nowrap" }}>
            <button type="button" className="financial-add-button" style={{ margin: 0 }} onClick={() => { setEditingRowId(null); setNewRowCategory("Gelato"); setShowCategoryModal(true); }}><Icons.BsPlusCircleFill /> Adicionar</button>
            {!labelSelectionMode ? <button type="button" disabled={bulkDeleting} onClick={() => { setDeleteSelectionMode(false); setSelectedDeleteIds([]); setSelectedLabelIds([]); setEditingRowId(null); setLabelSelectionMode(true); }} style={{ padding: "6px 12px", backgroundColor: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "5px" }}><Icons.BsPrinterFill /> Imprimir Etiquetas</button> : <>
              <button type="button" onClick={() => { setLabelSelectionMode(false); setSelectedLabelIds([]); }} style={{ padding: "6px 12px", backgroundColor: "#fff", color: "#475569", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem" }}>Cancelar seleção</button>
              {selectedLabelIds.length > 0 && <button type="button" onClick={() => void handlePrintSelectedLabels()} style={{ padding: "6px 12px", backgroundColor: "#80501f", color: "#fff", border: "1px solid #80501f", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "5px" }}><Icons.BsPrinterFill /> Imprimir etiquetas selecionadas ({selectedLabelIds.length})</button>}
            </>}
            {!deleteSelectionMode ? <button type="button" onClick={() => { setLabelSelectionMode(false); setSelectedLabelIds([]); setEditingRowId(null); setSelectedDeleteIds([]); setDeleteSelectionMode(true); }} style={{ padding: "6px 12px", background: "#fff1f2", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: 4, cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: 5 }}><Icons.BsTrash /> Deletar em Massa</button> : <>
              <button type="button" disabled={bulkDeleting} onClick={() => { setDeleteSelectionMode(false); setSelectedDeleteIds([]); }} style={{ padding: "6px 12px", background: "white", color: "#475569", border: "1px solid #cbd5e1", borderRadius: 4, cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem" }}>Cancelar exclusão</button>
              <button type="button" disabled={bulkDeleting || selectedDeleteIds.length === 0} onClick={() => void handleBulkDelete()} style={{ padding: "6px 12px", background: "#b91c1c", color: "white", border: "1px solid #b91c1c", borderRadius: 4, cursor: bulkDeleting ? "wait" : "pointer", opacity: selectedDeleteIds.length ? 1 : .5, fontWeight: "bold", fontSize: "0.85rem" }}>{bulkDeleting ? "Excluindo..." : `Confirmar exclusão (${selectedDeleteIds.length})`}</button>
            </>}
            <button onClick={() => setProductionDateSort(current => current === "desc" ? "asc" : "desc")} style={{ padding: "6px 12px", backgroundColor: "#fff", color: "#475569", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "5px" }}><Icons.BsSortDownAlt /> Data da produção: {productionDateSort === "desc" ? "decrescente" : "crescente"}</button>
            <button onClick={() => { setFilterProdutoId(null); setFilterData(""); setFilterStatus('all'); }} style={{ padding: "6px 12px", backgroundColor: "#cbd5e1", color: "#334155", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "4px" }}><Icons.BsXCircleFill /> Limpar</button>
            <button onClick={() => fetchData(false, 0)} style={{ padding: "6px 12px", backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "4px" }}><Icons.BsArrowClockwise /> Atualizar</button>
            {isAdmin && <button
              type="button"
              onClick={() => {
                const newStatus = filterStatus === 'deleted' ? 'all' : 'deleted';
                setFilterStatus(newStatus);
                if (newStatus === 'deleted') {
                  setFilterProdutoId(null);
                  setFilterData("");
                }
              }}
              style={{ padding: "6px 12px", backgroundColor: filterStatus === 'deleted' ? "#fca5a5" : (pendingDeleteCount > 0 ? "#fee2e2" : "#fff"), color: filterStatus === 'deleted' ? "#7f1d1d" : (pendingDeleteCount > 0 ? "#b91c1c" : "#64748b"), border: `1px solid ${filterStatus === 'deleted' ? "#f87171" : (pendingDeleteCount > 0 ? "#fca5a5" : "#e2e8f0")}`, borderRadius: "4px", cursor: "pointer", fontWeight: filterStatus === 'deleted' ? "bold" : "normal", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", whiteSpace: "nowrap", animation: pendingDeleteCount > 0 && filterStatus !== 'deleted' ? "pulse-red 2s infinite" : "none" }}
              title={filterStatus === 'deleted' ? "Ver Todas as Produções" : "Ver Itens Aguardando Exclusão"}
            ><Icons.BsTrashFill /> Deletados {pendingDeleteCount > 0 ? `(${pendingDeleteCount})` : ""}</button>}
            </div>
          </div>
          <div className="freq-table-wrapper producao-table" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
              <table className="freq-table" style={{ minWidth: isDessertsTab ? (selectionMode ? "1080px" : "1040px") : (selectionMode ? "1640px" : "1600px") }}>
              <thead>
                <tr>
                  {selectionMode && <th title="Selecionar linha" style={{ width: 38, minWidth: 38, padding: "4px 2px", textAlign: "center" }}>✓</th>}
                  <th style={{ width: "150px", textAlign: "center" }}>Cód de Produção</th>
                  <th style={{ width: "100px", textAlign: "center" }}>Cód Produto</th>
                  <th style={{ width: "240px", minWidth: "240px" }}>Produto</th>
                  {activeCategory === "Food Service" && <>
                    <th style={{ textAlign: "center", width: "130px" }}>Embalagem</th>
                    <th style={{ textAlign: "center", width: "180px" }}>Cliente</th>
                  </>}
                  <th style={{ textAlign: "center", width: "190px" }}>Origem</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Data Produção</th>
                  {isDessertsTab ? <th style={{ textAlign: "center", width: "100px" }}>Quantidade</th> : <>
                    <th style={{ textAlign: "center", width: "100px" }}>Peso Bruto (kg)</th>
                    <th style={{ textAlign: "center", width: "100px" }}>Tara (kg)</th>
                    <th style={{ textAlign: "center", width: "120px" }}>Peso Líquido (kg)</th>
                  </>}
                  {showEntryAndDestination && <>
                    <th style={{ textAlign: "center", width: "120px" }}>Data Entrada</th>
                    <th style={{ textAlign: "center", width: "150px" }}>Destino</th>
                  </>}
                  <th style={{ textAlign: "center", width: "120px" }}>Validade</th>
                  <th style={{ textAlign: "center", width: "150px" }}>Usuário</th>
                  <th style={{ textAlign: "center", width: "220px", minWidth: "220px", whiteSpace: "nowrap" }}>Ações</th>
                </tr>
                {/* Linha de Filtros */}
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  {selectionMode && <th style={{ padding: "8px" }}></th>}
                  <th style={{ padding: "8px" }}></th>
                  <th style={{ padding: "8px" }}></th>
                  <th style={{ padding: "8px", minWidth: "240px" }}>
                    <Select
                      menuPortalTarget={document.body}
                      maxMenuHeight={350}
                       options={categoryProducts.map(p => ({ value: p.id, label: p.nome }))}
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
                          minWidth: '210px',
                          fontSize: '1.1rem'
                        }),
                        menu: (base) => ({ ...base, minWidth: '240px' }),
                        option: (base) => ({ ...base, whiteSpace: 'nowrap' }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                          minWidth: '240px',
                          fontSize: '1.1rem'
                        })
                      }}
                    />
                  </th>
                  {activeCategory === "Food Service" && <th style={{ padding: "8px" }}></th>}
                  {activeCategory === "Food Service" && <th style={{ padding: "8px" }}></th>}
                  <th style={{ padding: "8px" }}></th>
                  <th style={{ padding: "8px" }}>
                    <input
                      type="date"
                      value={filterData}
                      onChange={(e) => setFilterData(e.target.value)}
                      style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1.1rem" }}
                    />
                  </th>
                  {isDessertsTab && <th style={{ padding: "8px" }}></th>}
                  <th colSpan={isDessertsTab ? 3 : activeCategory === "Food Service" ? 6 : 8} style={{ padding: "8px" }} />
                </tr>
              </thead>
              <tbody>
                {loading && producoes.length === 0 ? (
                  <tr>
                    <td colSpan={tableColumnCount} style={{ textAlign: "center", padding: "40px" }}>
                      <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
                    </td>
                  </tr>
                ) : producoes.filter(prod => (prod.categoria_producao || prod.cadastro_produtos?.categoria || "Gelato").toLowerCase() === activeCategory.toLowerCase()).length === 0 ? (
                  <tr>
                    <td colSpan={tableColumnCount} style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      Nenhum registro de produção encontrado.
                    </td>
                  </tr>
                ) : (
                  producoes.filter(prod => (prod.categoria_producao || prod.cadastro_produtos?.categoria || "Gelato").toLowerCase() === activeCategory.toLowerCase()).map((prod) => {
                    const isNew = newlyAddedId === prod.id;
                    const isDeleting = false;
                    const isLabelSelected = selectedLabelIds.includes(prod.id);
                    const isDeleteSelected = deleteSelectionMode && selectedDeleteIds.includes(prod.id);
                    const canSelectDelete = isAdmin || prod.status_revisao !== "pending_delete";
                    
                    return (
                      <tr
                        className="production-data-row"
                        aria-selected={selectionMode ? (deleteSelectionMode ? isDeleteSelected : isLabelSelected) : undefined}
                        data-delete-selected={isDeleteSelected}
                        key={prod.id} 
                        onClick={selectionMode ? event => {
                          if ((event.target as HTMLElement).closest("button, input, select, a, [role='combobox']")) return;
                          if (deleteSelectionMode) {
                            if (canSelectDelete) toggleDeleteSelection(prod.id, !isDeleteSelected);
                          } else toggleLabelSelection(prod.id, !isLabelSelected);
                        } : undefined}
                        style={{ 
                          backgroundColor: isDeleteSelected ? "#fee2e2" : isLabelSelected ? "#dbeafe" : isNew ? '#dcfce7' : (prod.status_revisao === 'pending_delete' ? '#fecaca' : 'inherit'),
                          opacity: (isDeleting || prod.status_revisao === 'pending_delete') ? 0.6 : 1,
                          transition: "background-color .15s ease, opacity .5s ease",
                          cursor: selectionMode ? "pointer" : undefined
                        }}
                      >
                        {labelSelectionMode && <td style={{ width: 38, minWidth: 38, padding: "4px 2px", textAlign: "center" }}><input type="checkbox" aria-label={`Selecionar etiqueta de ${prod.cadastro_produtos?.nome || "produto"}`} checked={isLabelSelected} onClick={event => event.stopPropagation()} onChange={event => toggleLabelSelection(prod.id, event.target.checked)} /></td>}
                        {deleteSelectionMode && <td style={{ width: 38, minWidth: 38, textAlign: "center" }}><input type="checkbox" style={{ accentColor: "#b91c1c" }} disabled={bulkDeleting || !canSelectDelete} aria-label={`Selecionar produção ${prod.codigo || prod.cadastro_produtos?.nome || "produto"} para exclusão`} checked={isDeleteSelected} onClick={event => event.stopPropagation()} onChange={event => toggleDeleteSelection(prod.id, event.target.checked)} /></td>}
                        <td style={{ textAlign: "center", fontWeight: "bold" }}>
                          {prod.codigo || "-"}
                          {prod.status_revisao === 'pending_delete' && (
                            <span style={{ display: "block", fontSize: "0.75rem", backgroundColor: "#ef4444", color: "white", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase", marginTop: "4px", width: "fit-content", margin: "4px auto 0 auto" }}>Deletado</span>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>{prod.cadastro_produtos?.codigo || "-"}</td>
                        <td style={{ fontWeight: "500" }}>
                          {editingRowId === prod.id ? (
                            <Select
                              menuPortalTarget={document.body}
                              options={produtos.map(p => ({ value: p.id, label: p.nome }))}
                              value={editRowData.produto_id ? { value: editRowData.produto_id, label: produtos.find(p => p.id === editRowData.produto_id)?.nome } : null}
                              onChange={(selectedOption) => setEditRowData({ ...editRowData, produto_id: selectedOption ? selectedOption.value : "" })}
                              placeholder="Selecione..."
                              styles={{
                                control: (base) => ({ ...base, minHeight: '30px', fontSize: '0.9rem' }),
                                menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: '0.9rem' })
                              }}
                            />
                          ) : (
                            prod.cadastro_produtos?.nome || "-"
                          )}
                        </td>
                        {activeCategory === "Food Service" && <>
                          <td style={{ textAlign: "center" }}>{prod.embalagem || "-"}</td>
                          <td style={{ textAlign: "center" }}>{prod.cliente || "-"}</td>
                        </>}
                        <td style={{ textAlign: "center" }}>
                          {prod.importado_automaticamente ? <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <span style={{ display: "inline-block", padding: "4px 9px", borderRadius: 10, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", fontSize: ".85rem", fontWeight: 700, whiteSpace: "nowrap" }}>Importado - OP {prod.data_ordem_producao ? new Date(prod.data_ordem_producao + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : "--/--"}</span>
                            {!prod.data_producao && <span title="Prazo para preencher a data de produção antes da exclusão automática" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#b45309", fontSize: ".76rem", fontWeight: 700, whiteSpace: "nowrap" }}><Icons.BsHourglassSplit /> {getImportCountdown(prod.created_at)}</span>}
                          </div> : <span style={{ color: "#64748b" }}>Manual</span>}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {editingRowId === prod.id ? (
                            <input 
                              type="date"
                              value={editRowData.data_producao || ""}
                              onChange={e => setEditRowData({ ...editRowData, data_producao: e.target.value })}
                              style={{ width: "100%", padding: "4px", fontSize: "0.9rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                            />
                          ) : prod.data_producao ? (
                            new Date(prod.data_producao + "T12:00:00").toLocaleDateString('pt-BR')
                          ) : (
                            <input
                              type="date"
                              aria-label={`Data de produção de ${prod.cadastro_produtos?.nome || "produto"}`}
                              style={{ width: "100%", padding: "6px", fontSize: "1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                              onChange={event => scheduleProductionDateSave(prod.id, event.target.value)}
                            />
                          )}
                        </td>
                        {isDessertsTab ? <td style={{ textAlign: "center", fontWeight: 600 }}>{prod.quantidade ?? "-"}</td> : <><td style={{ textAlign: "center" }}>
                          {editingRowId === prod.id ? (
                            <input 
                              type="number" step="0.001"
                              value={editRowData.peso_bruto || ""}
                              onChange={e => setEditRowData({ ...editRowData, peso_bruto: e.target.value })}
                              style={{ width: "80px", padding: "4px", fontSize: "0.9rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                            />
                          ) : (
                            prod.peso_bruto == null ? <input
                              aria-label={`Peso bruto de ${prod.cadastro_produtos?.nome || "produto"}`}
                              type="number"
                              min="0"
                              step="0.001"
                              placeholder="0,000"
                              onBlur={event => void handleQuickWeightUpdate(prod.id, "peso_bruto", event.target.value)}
                              style={{ boxSizing: "border-box", width: "100%", minWidth: 84, padding: "6px", fontSize: "1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                            /> : <span style={{ color: prod.peso_bruto < 0 ? "#ef4444" : "inherit" }}>{Number(prod.peso_bruto).toFixed(3)}</span>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {editingRowId === prod.id ? (
                            <input 
                              type="number" step="0.001"
                              value={editRowData.tara || ""}
                              onChange={e => setEditRowData({ ...editRowData, tara: e.target.value })}
                              style={{ width: "80px", padding: "4px", fontSize: "0.9rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                            />
                          ) : (
                            prod.tara == null ? <input
                              aria-label={`Tara de ${prod.cadastro_produtos?.nome || "produto"}`}
                              type="number"
                              min="0"
                              step="0.001"
                              placeholder="0,000"
                              onBlur={event => void handleQuickWeightUpdate(prod.id, "tara", event.target.value)}
                              style={{ boxSizing: "border-box", width: "100%", minWidth: 84, padding: "6px", fontSize: "1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                            /> : <span style={{ color: prod.tara < 0 ? "#ef4444" : "inherit" }}>{Number(prod.tara).toFixed(3)}</span>
                          )}
                        </td>
                        <td style={{ textAlign: "center", fontWeight: "bold", color: prod.peso_liquido < 0 ? "#ef4444" : "inherit" }}>{prod.peso_liquido != null ? Number(prod.peso_liquido).toFixed(3) : "-"}</td>
                        </>}
                        {showEntryAndDestination && <><td style={{ textAlign: "center" }}>
                          {editingRowId === prod.id ? (
                            <input 
                              type="date"
                              value={editRowData.data_entrada || ""}
                              onChange={e => setEditRowData({ ...editRowData, data_entrada: e.target.value })}
                              style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                            />
                          ) : prod.data_entrada ? (
                            new Date(prod.data_entrada + "T12:00:00").toLocaleDateString('pt-BR')
                          ) : (
                            <input 
                              type="date"
                              style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                              onBlur={(e) => {
                                if (e.target.value) {
                                  handleQuickUpdate(prod.id, "data_entrada", e.target.value);
                                }
                              }}
                            />
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {editingRowId === prod.id ? (
                            <select 
                              value={editRowData.destino || ""}
                              style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                              onChange={(e) => setEditRowData({ ...editRowData, destino: e.target.value })}
                            >
                              <option value="">Selecionar...</option>
                              <option value="Loja Ahu">Loja Ahu</option>
                              <option value="Loja Alto XV">Loja Alto XV</option>
                              <option value="Venda">Venda</option>
                              <option value="Rebatido">Rebatido</option>
                              <option value="Descartado">Descartado</option>
                              <option value="Outro">Outro</option>
                            </select>
                          ) : prod.destino ? (
                            prod.destino
                          ) : (
                            <select 
                              defaultValue=""
                              style={{ width: "100%", padding: "6px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleQuickUpdate(prod.id, "destino", e.target.value);
                                }
                              }}
                            >
                              <option value="">Selecionar...</option>
                              <option value="Loja Ahu">Loja Ahu</option>
                              <option value="Loja Alto XV">Loja Alto XV</option>
                              <option value="Venda">Venda</option>
                              <option value="Rebatido">Rebatido</option>
                              <option value="Descartado">Descartado</option>
                              <option value="Outro">Outro</option>
                            </select>
                          )}
                        </td></>}
                        <td style={{ textAlign: "center" }}>
                          {prod.validade ? new Date(prod.validade + "T12:00:00").toLocaleDateString('pt-BR') : "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <div 
                            title={prod.created_at ? `Registrado em: ${new Date(prod.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' às')}` : "Data de registro não disponível"}
                            style={{ 
                              color: "#334155", 
                              fontWeight: 600, 
                              display: "inline-flex", 
                              alignItems: "center", 
                              justifyContent: "center", 
                              gap: "6px", 
                              cursor: "help",
                              backgroundColor: "#f8fafc",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid #e2e8f0"
                            }}
                          >
                            <Icons.BsPersonFill style={{ color: "#94a3b8", fontSize: "1.1rem" }} />
                            {prod.profiles?.name || "-"}
                          </div>
                        </td>
                        <td style={{ textAlign: "center", padding: "4px", minWidth: "220px", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "nowrap" }}>
                          <button type="button" onClick={event => { event.stopPropagation(); void openProductionHistory(prod); }} title="Ver histórico desta produção" aria-label={`Ver histórico de ${prod.cadastro_produtos?.nome || "produção"} ${prod.codigo || prod.id}`} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "1.2rem", flexShrink: 0 }}><Icons.BsInfoCircle /></button>
                          {editingRowId === prod.id ? (
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "nowrap" }}>
                              <button onClick={() => saveEdit(prod)} title="Salvar" disabled={savingRow} style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", fontSize: "1.2rem" }}>
                                {savingRow ? <Icons.BsArrowClockwise className="spin" /> : <Icons.BsCheckLg />}
                              </button>
                              <button onClick={() => setEditingRowId(null)} title="Cancelar" disabled={savingRow} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.2rem" }}>
                                <Icons.BsXLg />
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "nowrap" }}>
                              {prod.status_revisao === 'pending_delete' && (
                                isAdmin ? (
                                  <div style={{ display: "flex", gap: "4px" }}>
                                    <button
                                      onClick={() => handleDelete(prod.id)}
                                      title="Aprovar Exclusão"
                                      style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#166534", backgroundColor: "#dcfce7", border: "1px solid #166534", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", margin: 0 }}
                                    >
                                      <Icons.BsCheckAll /> Excluir
                                    </button>
                                    <button
                                      onClick={() => handleUpdateReviewStatus(prod.id, 'none')}
                                      title="Restaurar Registro"
                                      style={{ padding: "4px 8px", fontSize: "0.85rem", color: "#9a3412", backgroundColor: "#fed7aa", border: "1px solid #9a3412", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", margin: 0 }}
                                    >
                                      <Icons.BsXCircle /> Restaurar
                                    </button>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: "0.85rem", color: "#991b1b", backgroundColor: "#fecaca", border: "1px solid #991b1b", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Icons.BsTrash /> Aguardando
                                  </span>
                                )
                              )}
                              {prod.status_revisao !== 'pending_delete' && (
                                <button onClick={() => { setEditingRowId(prod.id); setEditRowData({ produto_id: prod.produto_id, peso_bruto: prod.peso_bruto, tara: prod.tara, data_producao: prod.data_producao, data_entrada: prod.data_entrada, destino: prod.destino }); }} title="Editar Registro" style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "1.1rem" }}>
                                  <Icons.BsPencil />
                                </button>
                              )}
                              {prod.status_revisao !== 'pending_delete' && (isAdmin || (!prod.status_revisao || prod.status_revisao === 'none')) && (
                                <button onClick={() => handleDelete(prod.id)} className="delete-record-btn" title="Excluir Registro" style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                                  <Icons.BsTrash />
                                </button>
                              )}
                            </div>
                          )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
                
                {hasMore && producoes.length > 0 && (
                  <tr>
                      <td colSpan={tableColumnCount} style={{ textAlign: "center", padding: "16px" }}>
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
                  <td colSpan={tableColumnCount} style={{ textAlign: "right", padding: "12px 16px", color: "#64748b" }}>
                    Total de registros encontrados: {totalCount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {historyProduction && <div role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeProductionHistory(); }} style={{ position: "fixed", inset: 0, zIndex: 1600, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(15,23,42,.55)" }}>
        <section role="dialog" aria-modal="true" aria-labelledby="production-history-title" style={{ boxSizing: "border-box", width: "min(720px, 100%)", maxHeight: "88vh", overflowY: "auto", padding: 26, borderRadius: 12, background: "#fff", boxShadow: "0 20px 60px rgba(15,23,42,.25)", fontSize: "15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
            <div><h2 id="production-history-title" style={{ margin: "0 0 6px", fontSize: "24px", color: "#334155" }}>Histórico da produção</h2><span style={{ color: "#64748b" }}>{historyProduction.cadastro_produtos?.nome || "Produto"} · {historyProduction.codigo || `Registro #${historyProduction.id}`}</span></div>
            <button type="button" aria-label="Fechar histórico" onClick={closeProductionHistory} style={{ border: 0, background: "transparent", color: "#64748b", fontSize: "26px", cursor: "pointer" }}><Icons.BsX /></button>
          </div>
          {historyLoading ? <p role="status" style={{ color: "#64748b" }}>Carregando histórico...</p> : historyError ? <p role="alert" style={{ color: "#b91c1c" }}>{historyError}</p> : historyEvents.length ? <ol style={{ listStyle: "none", margin: 0, padding: "0 0 0 18px", borderLeft: "2px solid #e2e8f0" }}>
            {historyEvents.map(entry => <li key={entry.id} style={{ position: "relative", marginBottom: 20, padding: "2px 0 0 20px" }}>
              <span aria-hidden="true" style={{ position: "absolute", left: -25, top: 5, width: 12, height: 12, borderRadius: "50%", background: entry.acao === "criado" ? "#16a34a" : entry.acao === "excluido" ? "#dc2626" : "#80501f", border: "2px solid #fff" }} />
              <div style={{ padding: 14, border: "1px solid #e2e8f0", borderRadius: 8, background: "#f8fafc" }}>
                <strong style={{ display: "block", color: "#334155", fontSize: "16px" }}>{entry.acao === "criado" ? "Registro criado" : entry.acao === "excluido" ? "Registro excluído" : "Registro editado"}</strong>
                <span style={{ display: "block", marginTop: 4, color: "#64748b", fontSize: "14px" }}>{entry.responsavel_nome || "Não identificado"} · {new Date(entry.ocorrido_em).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span>
                {entry.acao === "editado" && <ul style={{ margin: "12px 0 0", paddingLeft: 20, color: "#475569", lineHeight: 1.6 }}>
                  {Object.entries(entry.alteracoes || {}).map(([field, change]: [string, any]) => <li key={field}><strong>{historyFieldLabels[field] || field.replace(/_/g, " ")}:</strong> {formatHistoryValue(field, change?.antes)} → {formatHistoryValue(field, change?.depois)}</li>)}
                </ul>}
              </div>
            </li>)}
          </ol> : <p style={{ color: "#64748b" }}>Nenhum evento registrado para esta produção.</p>}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}><button type="button" onClick={closeProductionHistory} style={{ padding: "10px 18px", border: 0, borderRadius: 6, background: "#80501f", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>Fechar</button></div>
        </section>
      </div>}
    </>
  );
}

export default ProducaoRealizada;
