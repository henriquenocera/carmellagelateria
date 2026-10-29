import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import { Navigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from "../AuthProvider";
import supabase from "../services/supabase-client";
import "../css/Frequencia.css";

type Product = {
  id: string;
  nome: string;
  codigo?: string | null;
  is_sabor?: boolean;
  ficha_tecnica?: any[];
};
type OrderLine = {
  id: string;
  data_ordem: string;
  produto_id: string;
  quantidade: number;
  user_id?: string | null;
  data_producao?: string | null;
  peso_bruto?: number | null;
  tara?: number | null;
  status?: "Aberto" | "Fechado" | null;
  dia_semana?: number | null;
  ordem_dia?: number | null;
  profiles?: { name?: string | null } | null;
};
type DraftLine = {
  key: string;
  ids?: string[];
  unitIds?: Array<string | undefined>;
  unitDays?: Array<number | null>;
  unitOrders?: Array<number | null>;
  produto_id: string;
  quantidade: string;
};
type FlavorUnit = { key: string; line: DraftLine; index: number };
type FlavorCard = { key: string; line: DraftLine; unitKeys: string[]; position: number };
type RequiredIngredient = { key: string; name: string; unit: string; quantity: number; components: Record<string, number> };
const WEEK_DAYS = [
  { id: 1, label: "Segunda-feira" },
  { id: 2, label: "Terça-feira" },
  { id: 3, label: "Quarta-feira" },
  { id: 4, label: "Quinta-feira" },
  { id: 5, label: "Sexta-feira" },
  { id: 6, label: "Sábado" },
  { id: 7, label: "Domingo" }
];

function OrdemProducao2() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [orderDate, setOrderDate] = useState("");
  const [orderStatus, setOrderStatus] = useState<"Aberto" | "Fechado">("Aberto");
  const [responsibleName, setResponsibleName] = useState("");
  const [orderUserId, setOrderUserId] = useState<string | null>(null);
  const [draftLines, setDraftLines] = useState<DraftLine[]>([]);
  const [weekPlan, setWeekPlan] = useState<Record<number, string[]>>({ 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] });
  const [showWeekPlanModal, setShowWeekPlanModal] = useState(false);
  const [showWeekendDays, setShowWeekendDays] = useState(false);
  const [showFlavorPickerForDay, setShowFlavorPickerForDay] = useState<number | null>(null);
  const [dayFlavorSearch, setDayFlavorSearch] = useState("");
  const [draggingFlavorKey, setDraggingFlavorKey] = useState<string | null>(null);
  const skipNextAutoSave = useRef(false);
  const autoSaveHandlerRef = useRef<((event?: React.FormEvent, closeAfterSave?: boolean) => Promise<void>) | null>(null);
  const savingRef = useRef(false);
  savingRef.current = saving;
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editingOriginalIds, setEditingOriginalIds] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantityInput, setQuantityInput] = useState("1");
  const [factoryStock, setFactoryStock] = useState<Record<string, number>>({});
  const [insumosCadastro, setInsumosCadastro] = useState<Record<string, any>>({});
  const [showInsumosModal, setShowInsumosModal] = useState(false);
  const [showOnlyNegativeIngredients, setShowOnlyNegativeIngredients] = useState(false);
  const [visibleOrdersCount, setVisibleOrdersCount] = useState(10);

  const getToday = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const loadPageData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        { data: productData, error: productError },
        { data: orderData, error: orderError },
        { data: inventoryData },
        { data: movementData },
        { data: ingredientData }
      ] = await Promise.all([
        supabase
          .from("cadastro_produtos")
          .select(`id, nome, codigo, is_sabor, ficha_tecnica!ficha_tecnica_produto_id_fkey(quantidade, insumo_id, produto_base_id, cadastro_insumos(nome, nome_simples_unitario, unidade_conversao, unidade_consumo, quantidade_conversao))`)
          .eq("ativo", true)
          .order("nome", { ascending: true }),
        supabase
          .from("ordem_producao")
          .select("id, data_ordem, produto_id, quantidade, user_id, data_producao, peso_bruto, tara, status, dia_semana, ordem_dia, profiles(name)")
          .order("data_ordem", { ascending: false }),
        supabase.from("inventario_insumos").select("insumo_id, data_inventario, quantidade").eq("unidade", "Fábrica").lte("data_inventario", getToday()).order("data_inventario", { ascending: false }).limit(5000),
        supabase.from("movimentacoes_estoque").select("insumo_id, data_movimentacao, quantidade, origem, destino").or("origem.eq.Fábrica,destino.eq.Fábrica").lte("data_movimentacao", getToday()),
        supabase.from("cadastro_insumos").select("id, nome, nome_simples_unitario, quantidade_conversao, unidade_consumo, unidade_conversao").eq("ativo", true)
      ]);

      if (productError) throw productError;
      if (orderError) throw orderError;
      setProducts(productData || []);
      setOrderLines(orderData || []);

      const latestInventory: Record<string, { date: string; quantity: number }> = {};
      (inventoryData || []).forEach((inventory: any) => {
        if (!latestInventory[inventory.insumo_id] || inventory.data_inventario > latestInventory[inventory.insumo_id].date) {
          latestInventory[inventory.insumo_id] = { date: inventory.data_inventario, quantity: Number(inventory.quantidade) || 0 };
        }
      });
      const stock: Record<string, number> = {};
      Object.entries(latestInventory).forEach(([id, inventory]) => { stock[id] = inventory.quantity; });
      (movementData || []).forEach((movement: any) => {
        const inventory = latestInventory[movement.insumo_id];
        if (inventory && movement.data_movimentacao < inventory.date) return;
        if (stock[movement.insumo_id] === undefined) stock[movement.insumo_id] = 0;
        if (movement.destino === "Fábrica") stock[movement.insumo_id] += Number(movement.quantidade) || 0;
        if (movement.origem === "Fábrica") stock[movement.insumo_id] -= Number(movement.quantidade) || 0;
      });
      setFactoryStock(stock);
      const ingredients: Record<string, any> = {};
      (ingredientData || []).forEach((ingredient: any) => { ingredients[String(ingredient.id)] = ingredient; });
      setInsumosCadastro(ingredients);
    } catch (error) {
      console.error("Erro ao carregar ordens de produção:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("profiles").select("name").eq("id", user.id).maybeSingle().then(({ data }) => {
      setResponsibleName(data?.name || user.user_metadata?.name || user.email || "");
    });
  }, [user?.id, user?.email, user?.user_metadata?.name]);

  const orders = useMemo(() => {
    const grouped: Record<string, OrderLine[]> = {};
    orderLines.forEach(line => {
      if (!grouped[line.data_ordem]) grouped[line.data_ordem] = [];
      grouped[line.data_ordem].push(line);
    });
    return Object.entries(grouped)
      .map(([date, lines]) => ({ date, lines }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [orderLines]);
  const visibleOrders = orders.slice(0, visibleOrdersCount);

  const orderNumberByDate = useMemo(() => {
    const datesByMonth: Record<string, string[]> = {};
    orders.forEach(order => {
      const month = order.date.slice(0, 7);
      if (!datesByMonth[month]) datesByMonth[month] = [];
      datesByMonth[month].push(order.date);
    });
    const numbers: Record<string, number> = {};
    Object.values(datesByMonth).forEach(dates => {
      dates.sort((a, b) => a.localeCompare(b)).forEach((date, index) => {
        numbers[date] = index + 1;
      });
    });
    return numbers;
  }, [orders]);

  const getUnitKey = (lineKey: string, index: number) => `${lineKey}::${index}`;
  const getUnitEntries = (lines: DraftLine[] = draftLines) => lines.flatMap(line =>
    Array.from({ length: Math.max(0, Math.floor(Number(line.quantidade) || 0)) }, (_, index) => ({
      key: getUnitKey(line.key, index),
      line,
      index
    }))
  );

  const formatDate = (date: string) => {
    if (!date) return "—";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const openNewOrderModal = () => {
    const existingTodayOrder = orders.find(order => order.date === getToday());
    if (existingTodayOrder) {
      openEditOrderModal(existingTodayOrder);
      return;
    }
    skipNextAutoSave.current = true;
    setEditingDate(null);
    setEditingOriginalIds([]);
    setOrderDate(getToday());
    setOrderStatus("Aberto");
    setOrderUserId(user?.id || null);
    setResponsibleName(user?.user_metadata?.name || user?.email || responsibleName);
    setAutoSaveStatus("");
    setDraftLines([]);
    setWeekPlan({ 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] });
    setSelectedProductId("");
    setQuantityInput("1");
    setShowNewOrderModal(true);
  };

  const openEditOrderModal = (order: { date: string; lines: OrderLine[] }) => {
    skipNextAutoSave.current = true;
    setEditingDate(order.date);
    setEditingOriginalIds(order.lines.map(line => line.id));
    setOrderDate(order.date);
    setOrderStatus(order.lines[0]?.status === "Fechado" ? "Fechado" : "Aberto");
    setAutoSaveStatus("");
    setOrderUserId(order.lines[0]?.user_id || null);
    const names = Array.from(new Set(order.lines.map(line => line.profiles?.name).filter((name): name is string => Boolean(name))));
    setResponsibleName(names.length > 1 ? "Vários usuários" : names[0] || "—");
    const groupedLines = new Map<string, DraftLine>();
    [...order.lines].sort((a, b) => (a.dia_semana || 8) - (b.dia_semana || 8) || (a.ordem_dia || 0) - (b.ordem_dia || 0)).forEach(line => {
      const lineQuantity = Math.max(0, Math.floor(Number(line.quantidade) || 0));
      const existing = groupedLines.get(line.produto_id);
      if (existing) {
        existing.ids = [...(existing.ids || []), line.id];
        existing.quantidade = String(Number(existing.quantidade) + lineQuantity);
        existing.unitIds = [...(existing.unitIds || []), line.id, ...Array(Math.max(0, lineQuantity - 1)).fill(undefined)];
        existing.unitDays = [...(existing.unitDays || []), ...Array(lineQuantity).fill(line.dia_semana || null)];
        existing.unitOrders = [...(existing.unitOrders || []), ...Array.from({ length: lineQuantity }, (_, index) => line.dia_semana ? (line.ordem_dia || 1) + index : null)];
      } else {
        groupedLines.set(line.produto_id, {
          key: line.produto_id,
          ids: [line.id],
          unitIds: [line.id, ...Array(Math.max(0, lineQuantity - 1)).fill(undefined)],
          unitDays: Array(lineQuantity).fill(line.dia_semana || null),
          unitOrders: Array.from({ length: lineQuantity }, (_, index) => line.dia_semana ? (line.ordem_dia || 1) + index : null),
          produto_id: line.produto_id,
          quantidade: String(lineQuantity)
        });
      }
    });
    const loadedLines = Array.from(groupedLines.values());
    setDraftLines(loadedLines);
    const plan: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    const savedAssignments = loadedLines.flatMap(line => Array.from({ length: Number(line.quantidade) || 0 }, (_, index) => ({
      key: getUnitKey(line.key, index),
      day: line.unitDays?.[index],
      order: line.unitOrders?.[index] || 0
    }))).filter(unit => unit.day && plan[unit.day]);
    savedAssignments.sort((a, b) => (a.day || 8) - (b.day || 8) || a.order - b.order).forEach(unit => plan[unit.day as number].push(unit.key));
    setWeekPlan(plan);
    setSelectedProductId("");
    setQuantityInput("1");
    setShowNewOrderModal(true);
  };

  const closeNewOrderModal = () => {
    if (saving) return;
    setShowNewOrderModal(false);
  };

  const updateDraftLine = (key: string, field: "produto_id" | "quantidade", value: string) => {
    setDraftLines(lines => lines.map(line => line.key === key ? { ...line, [field]: value } : line));
  };

  const addDraftLine = () => {
    const quantity = Number(quantityInput);
    if (!selectedProductId || !Number.isInteger(quantity) || quantity <= 0) {
      alert("Selecione um sabor e informe uma quantidade inteira maior que zero.");
      return;
    }
    setDraftLines(lines => {
      const existing = lines.find(line => line.produto_id === selectedProductId);
      if (existing) {
        return lines.map(line => line.key === existing.key
          ? {
              ...line,
              quantidade: String(Number(line.quantidade) + quantity),
              unitIds: line.unitIds ? [...line.unitIds, ...Array(quantity).fill(undefined)] : undefined,
              unitDays: line.unitDays ? [...line.unitDays, ...Array(quantity).fill(null)] : undefined,
              unitOrders: line.unitOrders ? [...line.unitOrders, ...Array(quantity).fill(null)] : undefined
            }
          : line);
      }
      return [...lines, {
        key: crypto.randomUUID(),
        produto_id: selectedProductId,
        quantidade: String(quantity)
      }];
    });
    setSelectedProductId("");
    setQuantityInput("1");
  };

  const removeDraftLine = (key: string) => {
    const line = draftLines.find(item => item.key === key);
    const unitKeys = line ? Array.from({ length: Number(line.quantidade) || 0 }, (_, index) => getUnitKey(key, index)) : [];
    setDraftLines(lines => lines.filter(line => line.key !== key));
    setWeekPlan(plan => Object.fromEntries(Object.entries(plan).map(([day, keys]) => [day, keys.filter(candidate => !unitKeys.includes(candidate))])) as Record<number, string[]>);
  };

  const moveFlavorToDay = (flavorKey: string, day: number | null, beforeKey?: string) => {
    setWeekPlan(current => {
      const next: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
      Object.entries(current).forEach(([dayId, keys]) => { next[Number(dayId)] = keys.filter(key => key !== flavorKey); });
      if (day !== null) {
        const target = next[day] || [];
        const targetIndex = beforeKey ? target.indexOf(beforeKey) : -1;
        if (targetIndex >= 0) target.splice(targetIndex, 0, flavorKey);
        else target.push(flavorKey);
        next[day] = target;
      }
      return next;
    });
  };

  const handleFlavorDrop = (event: React.DragEvent, day: number | null, beforeKey?: string) => {
    event.preventDefault();
    const flavorKey = event.dataTransfer.getData("text/plain");
    if (flavorKey) moveFlavorToDay(flavorKey, day, beforeKey);
    setDraggingFlavorKey(null);
  };

  const addFlavorToDay = (day: number, productId: string) => {
    const line = draftLines.find(item => item.produto_id === productId);
    const assigned = new Set(Object.values(weekPlan).flat());
    if (line) {
      const quantity = Math.max(0, Math.floor(Number(line.quantidade) || 0));
      const availableUnitKey = Array.from({ length: quantity }, (_, index) => getUnitKey(line.key, index)).find(key => !assigned.has(key));
      if (availableUnitKey) moveFlavorToDay(availableUnitKey, day);
    }
    setShowFlavorPickerForDay(null);
    setDayFlavorSearch("");
  };

  const handleCreateOrder = async (event?: React.FormEvent, closeAfterSave = true) => {
    event?.preventDefault();
    if (!orderDate) {
      if (closeAfterSave) alert("Informe a data da ordem.");
      return;
    }
    const validLines = draftLines.filter(line => line.produto_id && Number.isInteger(Number(line.quantidade)) && Number(line.quantidade) > 0);
    if (validLines.length === 0) {
      if (editingDate) {
        setSaving(true);
        try {
          if (editingOriginalIds.length) {
            const { error } = await supabase.from("ordem_producao").delete().in("id", editingOriginalIds);
            if (error) throw error;
          }
          const deletedIds = new Set(editingOriginalIds);
          setOrderLines(lines => lines.filter(line => !deletedIds.has(line.id)));
          setEditingDate(null);
          setEditingOriginalIds([]);
          if (closeAfterSave) {
            setShowNewOrderModal(false);
            setShowWeekPlanModal(false);
          }
        } catch (error: any) {
          console.error("Erro ao remover todos os sabores da ordem:", error);
          if (closeAfterSave) alert(`Não foi possível salvar a ordem: ${error.message || "erro inesperado"}`);
        } finally {
          setSaving(false);
        }
      } else if (closeAfterSave) {
        alert("Adicione ao menos um sabor à lista com uma quantidade válida.");
      }
      return;
    }

    setSaving(true);
    setAutoSaveStatus(closeAfterSave ? "Salvando..." : "Salvando automaticamente...");
    try {
      const timestamp = new Date().toISOString();
      const preparedLines = validLines.map(line => {
        const quantity = Math.max(0, Math.floor(Number(line.quantidade) || 0));
        const unitIds = Array.from({ length: quantity }, (_, index) => line.unitIds?.[index] || line.ids?.[index] || crypto.randomUUID());
        return { ...line, unitIds, ids: unitIds };
      });
      setDraftLines(lines => lines.map(line => preparedLines.find(prepared => prepared.key === line.key) || line));

      const unitKeys = getUnitEntries(preparedLines);
      const validUnitKeys = new Set(unitKeys.map(unit => unit.key));
      const scheduleForUnit = (key: string) => {
        const day = Object.keys(weekPlan).map(Number).find(dayId => weekPlan[dayId]?.includes(key));
        const orderedKeys = day ? weekPlan[day].filter(scheduledKey => validUnitKeys.has(scheduledKey)) : [];
        return { dia_semana: day || null, ordem_dia: day ? orderedKeys.indexOf(key) + 1 : null };
      };
      const existingIds = new Set(orderLines.map(line => line.id));
      const unitRows = unitKeys.map(unit => ({
        ...unit,
        id: unit.line.unitIds?.[unit.index],
        schedule: scheduleForUnit(unit.key)
      }));
      const newLines = unitRows.filter(unit => unit.id && !existingIds.has(unit.id)).map(unit => ({
        id: unit.id as string,
        data_ordem: orderDate,
        produto_id: unit.line.produto_id,
        quantidade: 1,
        user_id: editingDate ? orderUserId : user?.id,
        status: orderStatus,
        ...unit.schedule,
        updated_at: timestamp,
        data_producao: null,
        peso_bruto: null,
        tara: null,
        codigo: null
      }));

      const removedLines = editingDate
        ? orderLines.filter(line => editingOriginalIds.includes(line.id) && !unitRows.some(unit => unit.id === line.id))
        : [];
      if (editingDate) {
        const updates = await Promise.all(unitRows.filter(unit => unit.id && existingIds.has(unit.id)).map(unit =>
          supabase.from("ordem_producao").update({
            data_ordem: orderDate,
            produto_id: unit.line.produto_id,
            quantidade: 1,
            status: orderStatus,
            ...unit.schedule,
            updated_at: timestamp
          }).eq("id", unit.id as string)
        ));
        const updateError = updates.find(result => result.error)?.error;
        if (updateError) throw updateError;

        if (removedLines.length) {
          const { error } = await supabase.from("ordem_producao").delete().in("id", removedLines.map(line => line.id));
          if (error) throw error;
        }
      }

      if (newLines.length) {
        const { error } = await supabase.from("ordem_producao").insert(newLines);
        if (error) throw error;
      }

      const savedRows = unitRows.map(unit => {
        const existing = orderLines.find(line => line.id === unit.id);
        return {
          ...existing,
          id: unit.id as string,
          data_ordem: orderDate,
          produto_id: unit.line.produto_id,
          quantidade: 1,
          user_id: existing?.user_id || (editingDate ? orderUserId : user?.id),
          status: orderStatus,
          dia_semana: unit.schedule.dia_semana,
          ordem_dia: unit.schedule.ordem_dia,
          updated_at: timestamp,
          profiles: existing?.profiles || { name: responsibleName },
          data_producao: existing?.data_producao || null,
          peso_bruto: existing?.peso_bruto ?? null,
          tara: existing?.tara ?? null
        } as OrderLine;
      });
      const savedIds = new Set(savedRows.map(line => line.id));
      const removedIds = new Set(removedLines.map(line => line.id));
      setOrderLines(lines => [...lines.filter(line => !savedIds.has(line.id) && !removedIds.has(line.id)), ...savedRows]);
      setEditingDate(orderDate);
      setEditingOriginalIds(savedRows.map(line => line.id));
      setOrderUserId(current => current || user?.id || null);
      setAutoSaveStatus(closeAfterSave ? "Salvo" : "Salvo automaticamente");
      if (closeAfterSave) {
        setShowNewOrderModal(false);
        setShowWeekPlanModal(false);
      }
    } catch (error: any) {
      console.error("Erro ao criar ordem de produção:", error);
      setAutoSaveStatus("Falha ao salvar");
      if (closeAfterSave) alert(`Não foi possível salvar a ordem de produção: ${error.message || "erro inesperado"}`);
    } finally {
      setSaving(false);
    }
  };

  autoSaveHandlerRef.current = handleCreateOrder;

  useEffect(() => {
    if (!showNewOrderModal) return;
    if (skipNextAutoSave.current) {
      skipNextAutoSave.current = false;
      return;
    }
    if (!orderDate || !draftLines.length || savingRef.current) return;
    setAutoSaveStatus("Alterações pendentes...");
    const timer = window.setTimeout(() => {
      void autoSaveHandlerRef.current?.(undefined, false);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [showNewOrderModal, orderDate, orderStatus, draftLines, weekPlan]);

  const handleStatusChange = async (date: string, status: "Aberto" | "Fechado") => {
    try {
      const { error } = await supabase.from("ordem_producao").update({ status, updated_at: new Date().toISOString() }).eq("data_ordem", date);
      if (error) throw error;
      setOrderLines(lines => lines.map(line => line.data_ordem === date ? { ...line, status } : line));
    } catch (error: any) {
      console.error("Erro ao atualizar status da ordem:", error);
      alert(`Não foi possível atualizar o status: ${error.message || "erro inesperado"}`);
    }
  };

  const handleDeleteOrder = async (date: string) => {
    if (!window.confirm(`Excluir a ordem de produção de ${formatDate(date)}?`)) return;
    try {
      const { error } = await supabase.from("ordem_producao").delete().eq("data_ordem", date);
      if (error) throw error;
      await loadPageData();
    } catch (error: any) {
      console.error("Erro ao excluir ordem de produção:", error);
      alert(`Não foi possível excluir a ordem: ${error.message || "erro inesperado"}`);
    }
  };

  const exportIngredientsPdf = (ingredients: RequiredIngredient[], date: string, negativeOnly = false) => {
    const ingredientsToExport = negativeOnly
      ? ingredients.filter(ingredient => getIngredientStock(ingredient) - ingredient.quantity < 0)
      : ingredients;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(negativeOnly ? "Insumos com Saldo Negativo" : "Lista de Separação — Insumos Necessários", 14, 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Ordem de ${formatDate(date)} · Impresso em ${new Date().toLocaleString("pt-BR")}`, 14, 25);

    autoTable(doc, {
      startY: 31,
      head: [["Insumo", "Estoque Atual (Fábrica)", "Quantidade Necessária", "Saldo Final"]],
      body: ingredientsToExport.length === 0
        ? [[negativeOnly ? "Nenhum insumo com saldo negativo" : "Nenhum insumo calculado", "", "", ""]]
        : ingredientsToExport.map(ingredient => {
        const stock = getIngredientStock(ingredient);
        const balance = stock - ingredient.quantity;
        return [
          ingredient.name,
          `${formatQuantity(stock)} ${ingredient.unit}`,
          `${formatQuantity(ingredient.quantity)} ${ingredient.unit}`,
          `${formatQuantity(balance)} ${ingredient.unit}`
        ];
      }),
      theme: "grid",
      headStyles: { fillColor: [241, 231, 218], textColor: [128, 80, 31], fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 9, cellPadding: 2.5, textColor: [51, 65, 85] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 }
    });

    const fileSuffix = negativeOnly ? "insumos-negativos" : "insumos-ordem";
    doc.save(`${fileSuffix}-${date || "producao"}.pdf`);
  };

  const handleExportIngredientsPdf = () => exportIngredientsPdf(requiredIngredients, orderDate, showOnlyNegativeIngredients);

  const handleExportNegativeIngredientsForOrder = (order: { date: string; lines: OrderLine[] }) => {
    const ingredients = calculateRequiredIngredients(order.lines);
    exportIngredientsPdf(ingredients, order.date, true);
  };

  const handleExportOrderPdf = (order: { date: string; lines: OrderLine[] }) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const responsibleNames = Array.from(new Set(order.lines.map(line => line.profiles?.name).filter((name): name is string => Boolean(name))));
    const responsible = responsibleNames.length === 0 ? "—" : responsibleNames.length === 1 ? responsibleNames[0] : "Vários usuários";
    const status = order.lines[0]?.status === "Fechado" ? "Fechado" : "Aberto";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.text("Ordem de Produção", 14, 17);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Data: ${formatDate(order.date)}  ·  ${orderNumberByDate[order.date]}ª ordem do mês  ·  Responsável: ${responsible}  ·  Status: ${status}`, 14, 24);

    const cardsByDay: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    const unallocatedCards: string[] = [];
    [...order.lines].sort((a, b) => (a.dia_semana || 8) - (b.dia_semana || 8) || (a.ordem_dia || 0) - (b.ordem_dia || 0)).forEach(line => {
      const flavor = products.find(product => product.id === line.produto_id)?.nome || "Sabor não encontrado";
      const count = Math.max(0, Math.floor(Number(line.quantidade) || 0));
      for (let unit = 0; unit < count; unit++) {
        if (line.dia_semana && cardsByDay[line.dia_semana]) cardsByDay[line.dia_semana].push(flavor);
        else unallocatedCards.push(flavor);
      }
    });
    const largestDay = Math.max(0, ...Object.values(cardsByDay).map(cards => cards.length));
    const dayNumbers = [1, 2, 3, 4, 5, 6, 7];
    autoTable(doc, {
      startY: 30,
      head: [WEEK_DAYS.map(day => day.label.replace("-feira", ""))],
      body: Array.from({ length: largestDay }, (_, cardIndex) => dayNumbers.map(day => {
        const flavor = cardsByDay[day][cardIndex];
        return flavor ? `${cardIndex + 1}º ${flavor}` : "";
      })),
      theme: "grid",
      headStyles: { fillColor: [241, 231, 218], textColor: [128, 80, 31], fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 7.5, cellPadding: 3, minCellHeight: 13, textColor: [51, 65, 85], lineColor: [218, 226, 235], lineWidth: .25, valign: "middle" },
      didParseCell: data => {
        if (data.section === "body") {
          const emptyCell = !String(data.cell.raw || "").trim();
          data.cell.styles.fillColor = emptyCell ? [255, 255, 255] : [248, 250, 252];
          if (emptyCell) data.cell.styles.lineColor = [255, 255, 255];
        }
      },
      margin: { left: 10, right: 10 },
      tableWidth: "auto"
    });

    if (unallocatedCards.length) {
      const nextY = ((doc as any).lastAutoTable?.finalY || 30) + 9;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Sabores sem dia definido", 10, nextY);
      autoTable(doc, {
        startY: nextY + 3,
        head: [["A alocar"]],
        body: unallocatedCards.map((flavor, index) => [`${index + 1}º ${flavor}`]),
        theme: "grid",
        headStyles: { fillColor: [241, 231, 218], textColor: [128, 80, 31], fontStyle: "bold" },
        styles: { font: "helvetica", fontSize: 9, cellPadding: 3, textColor: [51, 65, 85] },
        margin: { left: 10, right: 10 }
      });
    }
    doc.save(`ordem-producao-${order.date}.pdf`);
  };

  const normalizeIngredientName = (name: any) => String(name || "").trim().toUpperCase();

  const calculateRequiredIngredients = useCallback((lines: Array<{ produto_id: string; quantidade: string | number }>): RequiredIngredient[] => {
    const aggregation: Record<string, { key: string; name: string; unit: string; quantity: number; components: Record<string, number> }> = {};
    const addIngredientsFromRecipe = (recipe: any[] | null | undefined, multiplier: number, depth = 0) => {
      if (!recipe || depth > 10) return;
      recipe.forEach(item => {
        if (item.insumo_id && item.cadastro_insumos) {
          const ingredient = item.cadastro_insumos;
          const rawName = ingredient.nome_simples_unitario || ingredient.nome || "Desconhecido";
          const key = normalizeIngredientName(rawName);
          const quantity = (Number(item.quantidade) || 0) * multiplier;
          const conversion = Number(ingredient.quantidade_conversao) > 0 ? Number(ingredient.quantidade_conversao) : 1;
          if (!aggregation[key]) {
            aggregation[key] = {
              key,
              name: String(rawName).trim(),
              unit: ingredient.unidade_consumo || ingredient.unidade_conversao || "un",
              quantity: 0,
              components: {}
            };
          }
          aggregation[key].quantity += quantity;
          aggregation[key].components[String(item.insumo_id)] = conversion;
        } else if (item.produto_base_id) {
          const baseProduct = products.find(product => product.id === item.produto_base_id);
          if (baseProduct?.ficha_tecnica) {
            addIngredientsFromRecipe(baseProduct.ficha_tecnica, multiplier * (Number(item.quantidade) || 0), depth + 1);
          }
        }
      });
    };

    lines.forEach(line => {
      const product = products.find(candidate => candidate.id === line.produto_id);
      if (product?.ficha_tecnica) addIngredientsFromRecipe(product.ficha_tecnica, Number(line.quantidade) || 0);
    });
    return Object.values(aggregation).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const requiredIngredients = useMemo(() => {
    return calculateRequiredIngredients(draftLines);
  }, [draftLines, calculateRequiredIngredients]);

  const getIngredientStock = (ingredient: RequiredIngredient) => {
    let total = 0;
    let found = false;
    Object.entries(insumosCadastro).forEach(([id, info]) => {
      const groupName = normalizeIngredientName(info.nome_simples_unitario || info.nome);
      if (groupName === ingredient.key) {
        const conversion = Number(info.quantidade_conversao) > 0 ? Number(info.quantidade_conversao) : 1;
        total += (factoryStock[id] || 0) * conversion;
        found = true;
      }
    });
    if (!found) {
      Object.entries(ingredient.components).forEach(([id, conversion]) => {
        total += (factoryStock[id] || 0) * (Number(conversion) > 0 ? Number(conversion) : 1);
      });
    }
    return total;
  };

  const formatQuantity = (quantity: number) => quantity.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 4 });
  const groupFlavorUnits = (units: FlavorUnit[]): FlavorCard[] => {
    const grouped = new Map<string, FlavorCard>();
    units.forEach(unit => {
      const existing = grouped.get(unit.line.produto_id);
      if (existing) {
        existing.unitKeys.push(unit.key);
      } else {
        grouped.set(unit.line.produto_id, {
          key: unit.key,
          line: unit.line,
          unitKeys: [unit.key],
          position: grouped.size + 1
        });
      }
    });
    return Array.from(grouped.values());
  };

  const renderDraggableFlavor = (card: FlavorCard) => (
    <div
      key={card.line.produto_id}
      className="op2-week-flavor"
      draggable
      onDragStart={event => {
        // Cada arraste desloca só uma unidade do grupo.
        event.dataTransfer.setData("text/plain", card.unitKeys[0]);
        event.dataTransfer.effectAllowed = "move";
        setDraggingFlavorKey(card.unitKeys[0]);
      }}
      onDragEnd={() => setDraggingFlavorKey(null)}
      onDragOver={event => event.preventDefault()}
      onDrop={event => { event.stopPropagation(); handleFlavorDrop(event, Number(event.currentTarget.dataset.day) || null, card.unitKeys[0]); }}
      data-day={Object.keys(weekPlan).map(Number).find(day => weekPlan[day]?.includes(card.unitKeys[0])) || ""}
      title={products.find(product => product.id === card.line.produto_id)?.nome || "Sabor não encontrado"}
      style={{ opacity: draggingFlavorKey === card.unitKeys[0] ? .45 : 1 }}
    >
      <span className="op2-card-position">{card.position}º</span>
      <span className="op2-card-name">{products.find(product => product.id === card.line.produto_id)?.nome || "Sabor não encontrado"}</span>
      {card.unitKeys.length > 1 && <span className="op2-card-count">×{card.unitKeys.length}</span>}
    </div>
  );
  const renderDraggableUnit = (unit: FlavorUnit, position: number) => (
    <div
      key={unit.key}
      className="op2-week-flavor op2-scheduled-flavor"
      draggable
      onDragStart={event => {
        event.dataTransfer.setData("text/plain", unit.key);
        event.dataTransfer.effectAllowed = "move";
        setDraggingFlavorKey(unit.key);
      }}
      onDragEnd={() => setDraggingFlavorKey(null)}
      onDragOver={event => event.preventDefault()}
      onDrop={event => { event.stopPropagation(); handleFlavorDrop(event, Number(event.currentTarget.dataset.day) || null, unit.key); }}
      data-day={Object.keys(weekPlan).map(Number).find(day => weekPlan[day]?.includes(unit.key)) || ""}
      title={products.find(product => product.id === unit.line.produto_id)?.nome || "Sabor não encontrado"}
      style={{ opacity: draggingFlavorKey === unit.key ? .45 : 1 }}
    >
      <span className="op2-card-position">{position}º</span>
      <span className="op2-card-name">{products.find(product => product.id === unit.line.produto_id)?.nome || "Sabor não encontrado"}</span>
      <button type="button" className="op2-flavor-remove" title="Voltar sabor para A alocar" aria-label="Remover sabor deste dia e devolver para A alocar" draggable={false} onDragStart={event => event.preventDefault()} onClick={event => { event.stopPropagation(); moveFlavorToDay(unit.key, null); }}><Icons.BsTrash /></button>
    </div>
  );
  const visibleIngredients = showOnlyNegativeIngredients
    ? requiredIngredients.filter(ingredient => getIngredientStock(ingredient) - ingredient.quantity < 0)
    : requiredIngredients;
  const allUnits = getUnitEntries();
  const validUnitKeys = new Set(allUnits.map(unit => unit.key));
  const assignedFlavorKeys = new Set(Object.values(weekPlan).flat().filter(key => validUnitKeys.has(key)));
  const unassignedFlavors = allUnits
    .filter(unit => !assignedFlavorKeys.has(unit.key))
    .sort((a, b) => (products.find(product => product.id === a.line.produto_id)?.nome || "").localeCompare(products.find(product => product.id === b.line.produto_id)?.nome || ""));
  const unassignedFlavorCards = groupFlavorUnits(unassignedFlavors);
  const availableFlavors = unassignedFlavorCards;
  const visibleWeekDays = WEEK_DAYS.filter(day => showWeekendDays || day.id <= 5);

  if (authLoading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <>
      <Helmet>
        <title>Ordem de Produção 2</title>
        <style>{`
          .op2-modal-backdrop { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(15, 23, 42, .52); }
          .op2-modal { box-sizing: border-box; width: min(900px, 100%); max-height: calc(100vh - 40px); overflow: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; background: #fff; box-shadow: 0 24px 70px rgba(15,23,42,.25); }
          .op2-meta-top-row { display: flex; align-items: end; justify-content: space-between; gap: 14px; margin-bottom: 14px; }
          .op2-meta-date-field { width: 250px; max-width: 100%; }
          .op2-meta-bottom-row { display: grid; grid-template-columns: minmax(200px, 300px) minmax(150px, 190px); justify-content: start; gap: 14px; margin-bottom: 22px; }
          .op2-meta-label { display: block; margin-bottom: 7px; color: #64748b; font-size: 1.05rem; font-weight: 700; }
          .op2-meta-control { box-sizing: border-box; width: 100%; height: 48px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; color: #334155; font-size: 1.05rem; }
          .op2-meta-date, .op2-meta-status { padding: 0 12px; }
          .op2-meta-responsible { display: flex; align-items: center; gap: 9px; padding: 0 14px; border-color: #cbd8e6; background: #f1f6fb; color: #405b78; font-weight: 600; }
          .op2-meta-responsible svg { color: #647f9a; font-size: 1.15rem; }
          .op2-calculate-button { height: 48px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 0 15px; border: 1px solid #d6c4af; border-radius: 8px; background: #fbf7f2; color: #80501f; font-weight: 700; font-size: 1rem; cursor: pointer; white-space: nowrap; transition: background .15s, border-color .15s, transform .15s; }
          .op2-calculate-button:hover { background: #f4eadf; border-color: #c7aa8a; transform: translateY(-1px); }
          .op2-add-grid { display: grid; grid-template-columns: minmax(0, 1fr) 160px auto; gap: 12px; align-items: end; }
          .op2-draft-table th { padding: 6px 10px !important; font-size: 1rem !important; }
          .op2-draft-table td { padding: 5px 10px !important; font-size: 1rem !important; }
          .op2-ingredients-table th { padding: 9px 12px !important; font-size: 1.05rem !important; }
          .op2-ingredients-table td { padding: 8px 12px !important; font-size: 1.05rem !important; }
          .op2-week-board { display: grid; gap: 10px; min-width: 900px; align-items: stretch; }
          .op2-week-column { display: flex; flex-direction: column; min-height: 230px; padding: 10px; border: 1px solid #dbe3ec; border-radius: 8px; background: #f8fafc; }
          .op2-week-flavor { display: flex; align-items: center; gap: 6px; min-width: 0; margin-top: 8px; padding: 8px; border: 1px solid #d4dce6; border-radius: 6px; background: #fff; color: #334155; cursor: grab; user-select: none; white-space: nowrap; overflow: hidden; }
          .op2-week-flavor:active { cursor: grabbing; }
          .op2-scheduled-flavor { position: relative; padding-right: 28px; }
          .op2-flavor-remove { position: absolute; top: 50%; right: 5px; transform: translateY(-50%); width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; padding: 0; border: 0; border-radius: 4px; background: #fff1f2; color: #dc2626; cursor: pointer; opacity: 0; transition: opacity .12s; }
          .op2-scheduled-flavor:hover .op2-flavor-remove, .op2-flavor-remove:focus-visible { opacity: 1; }
          .op2-card-position { flex: 0 0 auto; color: #80501f; font-size: .75rem; font-weight: 700; }
          .op2-card-name { flex: 1 1 auto; min-width: 0; overflow: hidden; color: #334155; font-size: .8rem; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
          .op2-card-count { flex: 0 0 auto; padding: 2px 6px; border-radius: 10px; background: #eef3f8; color: #526982; font-size: .75rem; font-weight: 700; }
          .op2-week-pool { box-sizing: border-box; min-height: 230px; max-height: 430px; overflow-y: auto; padding: 10px; border: 1px dashed #cbd5e1; border-radius: 8px; background: #f8fafc; }
          .op2-add-flavor-card { width: 100%; min-height: 38px; display: flex; align-items: center; justify-content: center; gap: 6px; margin: 0 0 8px; padding: 7px 6px; border: 1px dashed #aab7c6; border-radius: 6px; background: transparent; color: #64748b; font-size: .78rem; cursor: pointer; }
          .op2-add-flavor-card:hover { border-color: #80501f; background: #fffaf4; color: #80501f; }
          .op2-day-flavor-menu { position: relative; z-index: 20; display: grid; gap: 5px; width: 250px; max-width: calc(100vw - 48px); max-height: 180px; overflow-y: auto; margin-top: 6px; padding: 6px; border: 1px solid #dbe3ec; border-radius: 6px; background: #fff; box-shadow: 0 8px 20px rgba(15,23,42,.12); }
          .op2-week-column-picker-open { position: relative; z-index: 10; }
          .op2-day-flavor-search { box-sizing: border-box; width: 100%; height: 36px; margin-bottom: 2px; padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 4px; outline-color: #8ba8c5; font-size: .95rem; }
          .op2-day-flavor-option { padding: 9px 10px; border: 0; border-radius: 4px; background: #f8fafc; color: #334155; text-align: left; font-size: 1.05rem; cursor: pointer; }
          .op2-day-flavor-option:hover { background: #eaf1f8; }
          @media (max-width: 600px) { .op2-modal-backdrop { padding: 10px; } .op2-modal { padding: 18px; } .op2-meta-top-row { align-items: stretch; flex-direction: column; } .op2-meta-date-field { width: 100%; } .op2-calculate-button { width: 100%; } .op2-meta-bottom-row { grid-template-columns: minmax(0, 1fr); gap: 10px; } .op2-add-grid { grid-template-columns: minmax(0, 1fr) 100px; gap: 8px; } .op2-add-grid button { grid-column: 1 / -1; justify-content: center; } }
        `}</style>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Ordem de Produção 2</h1>
            <p>Planeje os sabores e as quantidades que deseja produzir.</p>
          </div>
        </div>

        <div style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
            <button type="button" onClick={openNewOrderModal} className="financial-add-button" style={{ margin: 0, height: "42px", padding: "0 16px", fontSize: "1.3rem" }}>
              <Icons.BsPlusCircleFill /> Nova ordem de produção
            </button>
          </div>

          <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <table className="freq-table" style={{ minWidth: "900px" }}>
              <thead>
                <tr>
                  <th style={{ width: "180px", textAlign: "center", background: "#f1e7da", color: "#80501f", textTransform: "uppercase" }}>Data da Ordem</th>
                  <th style={{ width: "180px", textAlign: "center", background: "#f1e7da", color: "#80501f", textTransform: "uppercase" }}>Qntd Planejada</th>
                  <th style={{ width: "240px", textAlign: "center", background: "#f1e7da", color: "#80501f", textTransform: "uppercase" }}>Usuário Responsável</th>
                  <th style={{ width: "180px", textAlign: "center", background: "#f1e7da", color: "#80501f", textTransform: "uppercase" }}>Status</th>
                  <th style={{ width: "210px", textAlign: "center", background: "#f1e7da", color: "#80501f", textTransform: "uppercase" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: "32px" }}><Icons.BsArrowClockwise className="spin" style={{ color: "var(--primary-color)", fontSize: "2rem" }} /></td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: "36px", color: "#94a3b8", fontSize: "1.25rem" }}>Nenhuma ordem de produção cadastrada.</td></tr>
                ) : visibleOrders.map(order => {
                  const totalQuantity = order.lines.reduce((total, line) => total + Number(line.quantidade || 0), 0);
                  const status = order.lines[0]?.status === "Fechado" ? "Fechado" : "Aberto";
                  const responsibleNames = Array.from(new Set(order.lines.map(line => line.profiles?.name).filter((name): name is string => Boolean(name))));
                  const responsible = responsibleNames.length === 0 ? "—" : responsibleNames.length === 1 ? responsibleNames[0] : "Vários usuários";
                  const statusStyle = status === "Fechado"
                    ? { color: "#475569", background: "#f1f5f9", border: "#cbd5e1" }
                    : { color: "#365b7d", background: "#eff6fb", border: "#cbd8e6" };

                  return <tr key={order.date} role="button" tabIndex={0} title="Clique para editar esta ordem" onClick={() => openEditOrderModal(order)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openEditOrderModal(order); } }} style={{ cursor: "pointer", backgroundColor: status === "Fechado" ? "#f7f8fa" : undefined, opacity: status === "Fechado" ? .72 : 1, transition: "opacity .15s, background-color .15s" }}>
                    <td style={{ textAlign: "center" }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}><strong>{formatDate(order.date)}</strong><span style={{ display: "inline-block", padding: "2px 8px", border: "1px solid #e7d8c6", borderRadius: "10px", background: "#f8f2eb", color: "#80501f", fontSize: ".85rem", fontWeight: 600 }}>{orderNumberByDate[order.date]}ª ordem do mês</span></div></td>
                    <td style={{ textAlign: "center", fontWeight: 700 }}>{totalQuantity}</td>
                    <td style={{ textAlign: "center" }}><span style={{ display: "inline-flex", minWidth: "92px", alignItems: "center", justifyContent: "center", gap: "7px", padding: "5px 12px", border: "1px solid #cbd8e6", borderRadius: "16px", background: "#eef3f8", color: "#526982", fontWeight: 600 }}><Icons.BsPerson style={{ fontSize: "1rem" }} />{responsible}</span></td>
                    <td style={{ textAlign: "center" }}><select aria-label={`Status da ordem de ${formatDate(order.date)}`} value={status} onClick={event => event.stopPropagation()} onChange={event => handleStatusChange(order.date, event.target.value as "Aberto" | "Fechado")} style={{ padding: "6px 12px", border: `1px solid ${statusStyle.border}`, borderRadius: "16px", color: statusStyle.color, background: statusStyle.background, fontWeight: 700, cursor: "pointer" }}><option value="Aberto">Aberto</option><option value="Fechado">Fechado</option></select></td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <button type="button" title="Editar ordem" aria-label={`Editar ordem de ${formatDate(order.date)}`} onClick={() => openEditOrderModal(order)} style={{ width: "34px", height: "34px", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid #bfdbfe", borderRadius: "6px", background: "#eff6ff", color: "#2563eb", cursor: "pointer" }}><Icons.BsPencil /></button>
                        <button type="button" title="Excluir ordem" aria-label={`Excluir ordem de ${formatDate(order.date)}`} onClick={event => { event.stopPropagation(); handleDeleteOrder(order.date); }} style={{ width: "34px", height: "34px", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid #fecaca", borderRadius: "6px", background: "#fef2f2", color: "#dc2626", cursor: "pointer" }}><Icons.BsTrash /></button>
                        <button type="button" title="Baixar PDF da ordem (A4 horizontal)" aria-label={`Baixar PDF da ordem de ${formatDate(order.date)}`} onClick={event => { event.stopPropagation(); handleExportOrderPdf(order); }} style={{ width: "34px", height: "34px", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid #ddd6fe", borderRadius: "6px", background: "#f5f3ff", color: "#6d28d9", cursor: "pointer" }}><Icons.BsFileEarmarkPdf /></button>
                        <button type="button" title="Baixar PDF dos insumos com saldo negativo" aria-label={`Baixar PDF dos insumos negativos da ordem de ${formatDate(order.date)}`} onClick={event => { event.stopPropagation(); handleExportNegativeIngredientsForOrder(order); }} style={{ width: "34px", height: "34px", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid #bbf7d0", borderRadius: "6px", background: "#f0fdf4", color: "#15803d", cursor: "pointer" }}><Icons.BsDownload /></button>
                      </div>
                    </td>
                  </tr>;
                })}
                {!loading && orders.length > visibleOrdersCount && (
                  <tr>
                    <td colSpan={5} style={{ padding: "14px", textAlign: "center", background: "#fff" }}>
                      <button type="button" onClick={() => setVisibleOrdersCount(count => count + 10)} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "#fff", color: "var(--primary-color)", fontWeight: 700, cursor: "pointer" }}>
                        <Icons.BsChevronDown /> Carregar mais ordens
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showNewOrderModal && (
        <div className="op2-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeNewOrderModal(); }}>
          <section className="op2-modal" role="dialog" aria-modal="true" aria-labelledby="op2-modal-title">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "20px" }}>
              <h2 id="op2-modal-title" style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px", color: "#334155", fontSize: "1.8rem" }}>
                {editingDate ? <Icons.BsPencil style={{ color: "var(--primary-color)" }} /> : <Icons.BsPlusCircleFill style={{ color: "var(--primary-color)" }} />} {editingDate ? "Editar ordem de produção" : "Nova ordem de produção"}
              </h2>
              <button type="button" aria-label="Fechar modal" onClick={closeNewOrderModal} disabled={saving} style={{ border: 0, background: "transparent", color: "#64748b", fontSize: "1.8rem", cursor: "pointer" }}><Icons.BsX /></button>
            </div>

            <form onSubmit={handleCreateOrder}>
              <div className="op2-meta-top-row">
                <div className="op2-meta-date-field">
                  <label className="op2-meta-label" htmlFor="op2-order-date">Data da ordem</label>
                  <input className="op2-meta-control op2-meta-date" id="op2-order-date" type="date" value={orderDate} onChange={event => setOrderDate(event.target.value)} required />
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button className="op2-calculate-button" type="button" onClick={() => setShowInsumosModal(true)}><Icons.BsCalculator /> Calcular Insumos</button>
                  <button className="op2-calculate-button" type="button" onClick={() => setShowWeekPlanModal(true)}><Icons.BsCalendarWeek /> Informar ordem</button>
                </div>
              </div>
              <div className="op2-meta-bottom-row">
                <div>
                  <span className="op2-meta-label">Usuário responsável</span>
                  <span className="op2-meta-control op2-meta-responsible"><Icons.BsPerson />{responsibleName || "—"}</span>
                </div>
                <div>
                  <label className="op2-meta-label" htmlFor="op2-order-status">Status</label>
                  <select className="op2-meta-control op2-meta-status" id="op2-order-status" value={orderStatus} onChange={event => setOrderStatus(event.target.value as "Aberto" | "Fechado")}>
                    <option value="Aberto">Aberto</option>
                    <option value="Fechado">Fechado</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                <h3 style={{ margin: 0, color: "#334155", fontSize: "1.25rem" }}>Sabores e quantidades</h3>
                {autoSaveStatus && <span role="status" style={{ color: autoSaveStatus.startsWith("Falha") ? "#dc2626" : "#64748b", fontSize: ".9rem" }}>{autoSaveStatus}</span>}
              </div>

              <div className="op2-add-grid" style={{ marginBottom: "14px" }}>
                <div>
                  <label htmlFor="op2-add-flavor" style={{ display: "block", marginBottom: "5px", color: "#64748b", fontWeight: 700 }}>Sabor</label>
                  <select id="op2-add-flavor" value={selectedProductId} onChange={event => setSelectedProductId(event.target.value)} style={{ boxSizing: "border-box", width: "100%", height: "42px", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "#fff", fontSize: "1rem" }}>
                    <option value="">Selecione um sabor...</option>
                    {products.filter(product => product.is_sabor).map(product => <option key={product.id} value={product.id}>{product.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="op2-add-quantity" style={{ display: "block", marginBottom: "5px", color: "#64748b", fontWeight: 700 }}>Quantidade</label>
                  <input id="op2-add-quantity" type="number" min="1" step="1" value={quantityInput} onChange={event => setQuantityInput(event.target.value)} style={{ boxSizing: "border-box", width: "100%", height: "42px", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", textAlign: "center", fontSize: "1rem" }} />
                </div>
                <button type="button" onClick={addDraftLine} disabled={!selectedProductId} style={{ height: "42px", display: "inline-flex", alignItems: "center", gap: "6px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "#fff", color: "var(--primary-color)", padding: "0 12px", fontWeight: 700, cursor: selectedProductId ? "pointer" : "not-allowed", opacity: selectedProductId ? 1 : .6, whiteSpace: "nowrap" }}><Icons.BsPlus /> Adicionar sabor</button>
              </div>

              <div className="freq-table-wrapper" style={{ maxHeight: "min(34vh, 300px)", overflow: "auto", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                <table className="freq-table op2-draft-table" style={{ minWidth: "500px" }}>
                  <thead><tr>
                    <th style={{ textAlign: "left" }}>Sabor</th>
                    <th style={{ width: "130px", textAlign: "center" }}>Quantidade</th>
                    <th style={{ width: "60px", textAlign: "center" }}>Ação</th>
                  </tr></thead>
                  <tbody>
                    {draftLines.length === 0 ? (
                      <tr><td colSpan={3} style={{ padding: "18px", textAlign: "center", color: "#94a3b8" }}>Selecione um sabor e adicione-o à lista.</td></tr>
                    ) : draftLines.map(line => (
                      <tr key={line.key}>
                        <td>{products.find(product => product.id === line.produto_id)?.nome || "Sabor não encontrado"}</td>
                        <td style={{ textAlign: "center" }}><input aria-label={`Quantidade de ${products.find(product => product.id === line.produto_id)?.nome || "sabor"}`} type="number" min="1" step="1" value={line.quantidade} onChange={event => updateDraftLine(line.key, "quantidade", event.target.value)} style={{ boxSizing: "border-box", width: "76px", height: "30px", padding: "3px 6px", border: "1px solid #cbd5e1", borderRadius: "4px", textAlign: "center" }} /></td>
                        <td style={{ textAlign: "center" }}><button type="button" aria-label="Remover sabor" title="Remover sabor" onClick={() => removeDraftLine(line.key)} style={{ width: "30px", height: "30px", border: "1px solid #fecaca", borderRadius: "5px", background: "#fff", color: "#dc2626", cursor: "pointer" }}><Icons.BsTrash /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                <button type="button" onClick={closeNewOrderModal} disabled={saving} style={{ padding: "10px 16px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "#fff", color: "#475569", fontWeight: 700, cursor: "pointer" }}>Cancelar</button>
                <button type="submit" disabled={saving || products.length === 0 || draftLines.length === 0} style={{ minWidth: "150px", padding: "10px 16px", border: 0, borderRadius: "6px", background: "var(--primary-color)", color: "#fff", fontWeight: 700, cursor: saving || products.length === 0 || draftLines.length === 0 ? "not-allowed" : "pointer", opacity: saving || products.length === 0 || draftLines.length === 0 ? .7 : 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  {saving ? <><Icons.BsArrowClockwise className="spin" /> Salvando...</> : <><Icons.BsCheckCircleFill /> {editingDate ? "Salvar alterações" : "Salvar ordem"}</>}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {showInsumosModal && (
        <div className="op2-modal-backdrop" style={{ zIndex: 1100 }} onMouseDown={event => { if (event.target === event.currentTarget) setShowInsumosModal(false); }}>
          <section className="op2-modal" role="dialog" aria-modal="true" aria-labelledby="op2-ingredients-title" style={{ width: "min(1000px, 100%)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "16px" }}>
              <h2 id="op2-ingredients-title" style={{ margin: 0, display: "flex", alignItems: "center", gap: "9px", color: "#1e293b", fontSize: "1.45rem" }}><Icons.BsBoxSeam style={{ color: "var(--primary-color)" }} /> Lista de Separação (Insumos Necessários)</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button type="button" onClick={() => setShowOnlyNegativeIngredients(value => !value)} style={{ height: "36px", display: "inline-flex", alignItems: "center", gap: "7px", padding: "0 12px", border: `1px solid ${showOnlyNegativeIngredients ? "#fca5a5" : "#cbd5e1"}`, borderRadius: "6px", background: showOnlyNegativeIngredients ? "#fef2f2" : "#fff", color: showOnlyNegativeIngredients ? "#b91c1c" : "#475569", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}><Icons.BsFunnel /> {showOnlyNegativeIngredients ? "Mostrar Todos" : "Filtrar Negativos"}</button>
                <button type="button" onClick={handleExportIngredientsPdf} style={{ height: "36px", display: "inline-flex", alignItems: "center", gap: "7px", padding: "0 12px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "#fff", color: "#475569", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}><Icons.BsFileEarmarkPdf /> Exportar PDF</button>
                <button type="button" aria-label="Fechar cálculo de insumos" onClick={() => setShowInsumosModal(false)} style={{ border: 0, background: "transparent", color: "#64748b", fontSize: "1.7rem", cursor: "pointer" }}><Icons.BsX /></button>
              </div>
            </div>
            <div className="freq-table-wrapper" style={{ maxHeight: "65vh", overflow: "auto", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
              <table className="freq-table op2-draft-table op2-ingredients-table" style={{ minWidth: "700px" }}>
                <thead><tr>
                  <th style={{ textAlign: "left" }}>Insumo</th>
                  <th style={{ textAlign: "center" }}>Estoque Atual (Fábrica)</th>
                  <th style={{ textAlign: "center" }}>Quantidade Necessária</th>
                  <th style={{ textAlign: "right" }}>Saldo Final</th>
                </tr></thead>
                <tbody>
                  {visibleIngredients.length === 0 ? (
                    <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>{showOnlyNegativeIngredients ? "Nenhum insumo com saldo final negativo." : "Não há insumos calculados para os sabores desta ordem."}</td></tr>
                  ) : visibleIngredients.map(ingredient => {
                    const stock = getIngredientStock(ingredient);
                    const balance = stock - ingredient.quantity;
                    return <tr key={ingredient.key}>
                      <td style={{ fontWeight: 500 }}>{ingredient.name}</td>
                      <td style={{ textAlign: "center", color: "#64748b", fontWeight: 700 }}>{formatQuantity(stock)} <span style={{ fontWeight: 400 }}>{ingredient.unit}</span></td>
                      <td style={{ textAlign: "center", color: "#16a34a", fontWeight: 700 }}>{formatQuantity(ingredient.quantity)} <span style={{ fontWeight: 400 }}>{ingredient.unit}</span></td>
                      <td style={{ textAlign: "right", color: balance < 0 ? "#dc2626" : "#334155", fontWeight: 700 }}>{formatQuantity(balance)} <span style={{ fontWeight: 400 }}>{ingredient.unit}</span></td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {showWeekPlanModal && (
        <div className="op2-modal-backdrop" style={{ zIndex: 1200 }} onMouseDown={event => { if (event.target === event.currentTarget) setShowWeekPlanModal(false); }}>
          <section className="op2-modal" role="dialog" aria-modal="true" aria-labelledby="op2-week-plan-title" style={{ width: "min(1480px, calc(100vw - 32px))" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "6px" }}>
              <h2 id="op2-week-plan-title" style={{ margin: 0, display: "flex", alignItems: "center", gap: "9px", color: "#334155", fontSize: "1.5rem" }}><Icons.BsCalendarWeek style={{ color: "var(--primary-color)" }} /> Informar ordem semanal</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button type="button" onClick={() => { setWeekPlan({ 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] }); setShowFlavorPickerForDay(null); setDayFlavorSearch(""); }} disabled={assignedFlavorKeys.size === 0} style={{ padding: "8px 12px", border: "1px solid #fecaca", borderRadius: "6px", background: "#fff7f7", color: "#b91c1c", fontWeight: 700, fontSize: ".9rem", cursor: assignedFlavorKeys.size === 0 ? "not-allowed" : "pointer", opacity: assignedFlavorKeys.size === 0 ? .55 : 1, whiteSpace: "nowrap" }}><Icons.BsTrash /> Apagar todos</button>
                <button type="button" onClick={() => setShowWeekendDays(enabled => !enabled)} style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", background: showWeekendDays ? "#f1f5f9" : "#fff", color: "#475569", fontWeight: 700, fontSize: ".9rem", cursor: "pointer", whiteSpace: "nowrap" }}>{showWeekendDays ? "Ocultar sáb e dom" : "Habilitar sáb e dom"}</button>
                <button type="button" aria-label="Fechar organização semanal" onClick={() => setShowWeekPlanModal(false)} style={{ border: 0, background: "transparent", color: "#64748b", fontSize: "1.7rem", cursor: "pointer" }}><Icons.BsX /></button>
              </div>
            </div>
            <p style={{ margin: "0 0 16px", color: "#64748b" }}>Arraste cada sabor para o dia desejado. Arraste os cartões dentro do dia para ajustar a sequência. Salve a ordem para registrar a distribuição.</p>

            <div style={{ overflowX: "auto", paddingBottom: "6px" }}>
              <div className="op2-week-board" style={{ gridTemplateColumns: showWeekendDays ? "minmax(150px, 1.05fr) repeat(7, minmax(135px, 1fr))" : "minmax(150px, 1.05fr) repeat(5, minmax(150px, 1fr))", minWidth: showWeekendDays ? "1190px" : "900px" }}>
                <section className="op2-week-pool" onDragOver={event => event.preventDefault()} onDrop={event => handleFlavorDrop(event, null)}>
                  <h3 style={{ margin: "0 0 8px", paddingBottom: "8px", borderBottom: "1px solid #dbe3ec", color: "#475569", fontSize: ".95rem" }}>A alocar ({unassignedFlavors.length})</h3>
                  {unassignedFlavorCards.length ? unassignedFlavorCards.map(renderDraggableFlavor) : <div style={{ padding: "12px 4px", color: "#94a3b8", fontSize: ".9rem", textAlign: "center" }}>Todos alocados</div>}
                </section>
                {visibleWeekDays.map(day => (
                  <section key={day.id} className={`op2-week-column${showFlavorPickerForDay === day.id ? " op2-week-column-picker-open" : ""}`} onDragOver={event => event.preventDefault()} onDrop={event => handleFlavorDrop(event, day.id)}>
                    {(() => {
                      const dayUnits = (weekPlan[day.id] || []).map(key => allUnits.find(unit => unit.key === key)).filter((unit): unit is FlavorUnit => Boolean(unit));
                      return <>
                        <h3 style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px", margin: "0 0 8px", paddingBottom: "8px", borderBottom: "1px solid #dbe3ec", color: "#475569", fontSize: ".9rem" }}>
                          <span>{day.label}</span><span style={{ padding: "2px 6px", borderRadius: "10px", background: "#e9eef4", color: "#526982", fontSize: ".75rem", whiteSpace: "nowrap" }}>{dayUnits.length} un.</span>
                        </h3>
                        <button type="button" className="op2-add-flavor-card" onClick={() => { setShowFlavorPickerForDay(showFlavorPickerForDay === day.id ? null : day.id); setDayFlavorSearch(""); }}><Icons.BsPlus /> Incluir novo sabor</button>
                        {showFlavorPickerForDay === day.id && (
                          <div className="op2-day-flavor-menu">
                            <input
                              className="op2-day-flavor-search"
                              autoFocus
                              aria-label={`Pesquisar sabor para ${day.label}`}
                              placeholder="Pesquisar sabor..."
                              value={dayFlavorSearch}
                              onFocus={event => event.currentTarget.select()}
                              onChange={event => setDayFlavorSearch(event.target.value)}
                              onKeyDown={event => {
                                if (event.key === "Escape") {
                                  event.preventDefault();
                                  setShowFlavorPickerForDay(null);
                                  setDayFlavorSearch("");
                                  return;
                                }
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  const firstMatch = availableFlavors.find(card => (products.find(product => product.id === card.line.produto_id)?.nome || "").toLowerCase().includes(dayFlavorSearch.trim().toLowerCase()));
                                  if (firstMatch) addFlavorToDay(day.id, firstMatch.line.produto_id);
                                }
                              }}
                            />
                            {availableFlavors
                              .filter(card => (products.find(product => product.id === card.line.produto_id)?.nome || "").toLowerCase().includes(dayFlavorSearch.trim().toLowerCase()))
                              .map(card => {
                                const name = products.find(product => product.id === card.line.produto_id)?.nome || "Sabor";
                                return <button key={card.line.key} type="button" className="op2-day-flavor-option" onClick={() => addFlavorToDay(day.id, card.line.produto_id)}>{name}<span style={{ display: "block", color: "#7b8ba0", fontSize: ".9rem", marginTop: "3px" }}>{card.unitKeys.length} un. ainda sem dia</span></button>;
                              })}
                            {availableFlavors.length === 0 && <span style={{ padding: "7px", color: "#94a3b8", fontSize: ".9rem" }}>Todos os sabores já foram alocados.</span>}
                          </div>
                        )}
                        {dayUnits.map((unit, index) => renderDraggableUnit(unit, index + 1))}
                        {dayUnits.length === 0 && <div style={{ padding: "12px 4px", color: "#94a3b8", fontSize: ".85rem", textAlign: "center" }}>Solte os sabores aqui</div>}
                      </>;
                    })()}
                  </section>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #e2e8f0" }}>
              <button type="button" onClick={() => { void handleCreateOrder(undefined, true); }} disabled={saving || draftLines.length === 0} style={{ padding: "10px 24px", border: 0, borderRadius: "6px", background: "var(--primary-color)", color: "#fff", fontWeight: 700, cursor: saving || draftLines.length === 0 ? "not-allowed" : "pointer", opacity: saving || draftLines.length === 0 ? .65 : 1 }}>{saving ? "Salvando..." : "Salvar"}</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default OrdemProducao2;
