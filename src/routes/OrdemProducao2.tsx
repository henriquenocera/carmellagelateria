import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import { Navigate } from "react-router-dom";
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
  profiles?: { name?: string | null } | null;
};
type DraftLine = { key: string; ids?: string[]; produto_id: string; quantidade: string };

function OrdemProducao2() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [orderDate, setOrderDate] = useState("");
  const [orderStatus, setOrderStatus] = useState<"Aberto" | "Fechado">("Aberto");
  const [responsibleName, setResponsibleName] = useState("");
  const [orderUserId, setOrderUserId] = useState<string | null>(null);
  const [draftLines, setDraftLines] = useState<DraftLine[]>([]);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantityInput, setQuantityInput] = useState("1");
  const [factoryStock, setFactoryStock] = useState<Record<string, number>>({});
  const [insumosCadastro, setInsumosCadastro] = useState<Record<string, any>>({});
  const [showInsumosModal, setShowInsumosModal] = useState(false);

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
          .select("id, data_ordem, produto_id, quantidade, user_id, data_producao, peso_bruto, tara, status, profiles(name)")
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

  const formatDate = (date: string) => {
    if (!date) return "—";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const openNewOrderModal = () => {
    setEditingDate(null);
    setOrderDate(getToday());
    setOrderStatus("Aberto");
    setOrderUserId(user?.id || null);
    setResponsibleName(user?.user_metadata?.name || user?.email || responsibleName);
    setDraftLines([]);
    setSelectedProductId("");
    setQuantityInput("1");
    setShowNewOrderModal(true);
  };

  const openEditOrderModal = (order: { date: string; lines: OrderLine[] }) => {
    setEditingDate(order.date);
    setOrderDate(order.date);
    setOrderStatus(order.lines[0]?.status === "Fechado" ? "Fechado" : "Aberto");
    setOrderUserId(order.lines[0]?.user_id || null);
    const names = Array.from(new Set(order.lines.map(line => line.profiles?.name).filter((name): name is string => Boolean(name))));
    setResponsibleName(names.length > 1 ? "Vários usuários" : names[0] || "—");
    const groupedLines = new Map<string, DraftLine>();
    order.lines.forEach(line => {
      const existing = groupedLines.get(line.produto_id);
      if (existing) {
        existing.ids = [...(existing.ids || []), line.id];
        existing.quantidade = String(Number(existing.quantidade) + Number(line.quantidade || 0));
      } else {
        groupedLines.set(line.produto_id, {
          key: line.produto_id,
          ids: [line.id],
          produto_id: line.produto_id,
          quantidade: String(line.quantidade)
        });
      }
    });
    setDraftLines(Array.from(groupedLines.values()));
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
          ? { ...line, quantidade: String(Number(line.quantidade) + quantity) }
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
    setDraftLines(lines => lines.length > 1 ? lines.filter(line => line.key !== key) : lines);
  };

  const handleCreateOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!orderDate) {
      alert("Informe a data da ordem.");
      return;
    }
    const validLines = draftLines.filter(line => line.produto_id && Number.isInteger(Number(line.quantidade)) && Number(line.quantidade) > 0);
    if (validLines.length === 0) {
      alert("Adicione ao menos um sabor à lista com uma quantidade válida.");
      return;
    }

    setSaving(true);
    try {
      const timestamp = new Date().toISOString();
      const newLines = validLines.filter(line => !line.ids?.length).map(line => ({
        id: crypto.randomUUID(),
        data_ordem: orderDate,
        produto_id: line.produto_id,
        quantidade: Number(line.quantidade),
        user_id: editingDate ? orderUserId : user?.id,
        status: orderStatus,
        updated_at: timestamp,
        data_producao: null,
        peso_bruto: null,
        tara: null,
        codigo: null
      }));

      if (editingDate) {
        const retainedIds = new Set(validLines.flatMap(line => line.ids || []));
        const removedLines = orderLines.filter(line => line.data_ordem === editingDate && !retainedIds.has(line.id));
        const updates = await Promise.all(validLines.filter(line => line.ids?.length).map(line =>
          supabase.from("ordem_producao").update({
            data_ordem: orderDate,
            produto_id: line.produto_id,
            quantidade: Number(line.quantidade),
            status: orderStatus,
            updated_at: timestamp
          }).eq("id", line.ids![0])
        ));
        const updateError = updates.find(result => result.error)?.error;
        if (updateError) throw updateError;

        const duplicateIds = validLines.flatMap(line => (line.ids || []).slice(1));
        const deleteIds = [...removedLines.map(line => line.id), ...duplicateIds];
        if (deleteIds.length) {
          const { error } = await supabase.from("ordem_producao").delete().in("id", deleteIds);
          if (error) throw error;
        }
      }

      if (newLines.length) {
        const { error } = await supabase.from("ordem_producao").insert(newLines);
        if (error) throw error;
      }

      setShowNewOrderModal(false);
      setEditingDate(null);
      await loadPageData();
    } catch (error: any) {
      console.error("Erro ao criar ordem de produção:", error);
      alert(`Não foi possível salvar a ordem de produção: ${error.message || "erro inesperado"}`);
    } finally {
      setSaving(false);
    }
  };

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

  const normalizeIngredientName = (name: any) => String(name || "").trim().toUpperCase();

  const requiredIngredients = useMemo(() => {
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

    draftLines.forEach(line => {
      const product = products.find(candidate => candidate.id === line.produto_id);
      if (product?.ficha_tecnica) addIngredientsFromRecipe(product.ficha_tecnica, Number(line.quantidade) || 0);
    });
    return Object.values(aggregation).sort((a, b) => a.name.localeCompare(b.name));
  }, [draftLines, products]);

  const getIngredientStock = (ingredient: typeof requiredIngredients[number]) => {
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

  if (authLoading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <>
      <Helmet>
        <title>Ordem de Produção 2</title>
        <style>{`
          .op2-modal-backdrop { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(15, 23, 42, .52); }
          .op2-modal { box-sizing: border-box; width: min(900px, 100%); max-height: calc(100vh - 40px); overflow: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; background: #fff; box-shadow: 0 24px 70px rgba(15,23,42,.25); }
          .op2-add-grid { display: grid; grid-template-columns: minmax(0, 1fr) 160px auto; gap: 12px; align-items: end; }
          .op2-draft-table th { padding: 6px 10px !important; font-size: 1rem !important; }
          .op2-draft-table td { padding: 5px 10px !important; font-size: 1rem !important; }
          @media (max-width: 600px) { .op2-modal-backdrop { padding: 10px; } .op2-modal { padding: 18px; } .op2-add-grid { grid-template-columns: minmax(0, 1fr) 100px; gap: 8px; } .op2-add-grid button { grid-column: 1 / -1; justify-content: center; } }
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
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
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
                  <th style={{ width: "150px", textAlign: "center", background: "#f1e7da", color: "#80501f", textTransform: "uppercase" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: "32px" }}><Icons.BsArrowClockwise className="spin" style={{ color: "var(--primary-color)", fontSize: "2rem" }} /></td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: "36px", color: "#94a3b8", fontSize: "1.25rem" }}>Nenhuma ordem de produção cadastrada.</td></tr>
                ) : orders.map(order => {
                  const totalQuantity = order.lines.reduce((total, line) => total + Number(line.quantidade || 0), 0);
                  const status = order.lines[0]?.status === "Fechado" ? "Fechado" : "Aberto";
                  const responsibleNames = Array.from(new Set(order.lines.map(line => line.profiles?.name).filter((name): name is string => Boolean(name))));
                  const responsible = responsibleNames.length === 0 ? "—" : responsibleNames.length === 1 ? responsibleNames[0] : "Vários usuários";
                  const statusStyle = status === "Fechado"
                    ? { color: "#475569", background: "#f1f5f9", border: "#cbd5e1" }
                    : { color: "#365b7d", background: "#eff6fb", border: "#cbd8e6" };

                  return <tr key={order.date} role="button" tabIndex={0} title="Clique para editar esta ordem" onClick={() => openEditOrderModal(order)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openEditOrderModal(order); } }} style={{ cursor: "pointer" }}>
                    <td style={{ textAlign: "center" }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}><strong>{formatDate(order.date)}</strong><span style={{ display: "inline-block", padding: "2px 8px", border: "1px solid #e7d8c6", borderRadius: "10px", background: "#f8f2eb", color: "#80501f", fontSize: ".85rem", fontWeight: 600 }}>{orderNumberByDate[order.date]}ª ordem do mês</span></div></td>
                    <td style={{ textAlign: "center", fontWeight: 700 }}>{totalQuantity}</td>
                    <td style={{ textAlign: "center" }}><span style={{ display: "inline-flex", minWidth: "92px", alignItems: "center", justifyContent: "center", gap: "7px", padding: "5px 12px", border: "1px solid #cbd8e6", borderRadius: "16px", background: "#eef3f8", color: "#526982", fontWeight: 600 }}><Icons.BsPerson style={{ fontSize: "1rem" }} />{responsible}</span></td>
                    <td style={{ textAlign: "center" }}><select aria-label={`Status da ordem de ${formatDate(order.date)}`} value={status} onClick={event => event.stopPropagation()} onChange={event => handleStatusChange(order.date, event.target.value as "Aberto" | "Fechado")} style={{ padding: "6px 12px", border: `1px solid ${statusStyle.border}`, borderRadius: "16px", color: statusStyle.color, background: statusStyle.background, fontWeight: 700, cursor: "pointer" }}><option value="Aberto">Aberto</option><option value="Fechado">Fechado</option></select></td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <button type="button" title="Editar ordem" aria-label={`Editar ordem de ${formatDate(order.date)}`} onClick={() => openEditOrderModal(order)} style={{ width: "34px", height: "34px", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid #bfdbfe", borderRadius: "6px", background: "#eff6ff", color: "#2563eb", cursor: "pointer" }}><Icons.BsPencil /></button>
                        <button type="button" title="Excluir ordem" aria-label={`Excluir ordem de ${formatDate(order.date)}`} onClick={event => { event.stopPropagation(); handleDeleteOrder(order.date); }} style={{ width: "34px", height: "34px", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid #fecaca", borderRadius: "6px", background: "#fef2f2", color: "#dc2626", cursor: "pointer" }}><Icons.BsTrash /></button>
                      </div>
                    </td>
                  </tr>;
                })}
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
              <div style={{ display: "flex", alignItems: "flex-end", flexWrap: "wrap", gap: "12px", marginBottom: "22px" }}>
                <div style={{ width: "200px" }}>
                  <label htmlFor="op2-order-date" style={{ display: "block", marginBottom: "6px", color: "#64748b", fontWeight: 700 }}>Data da ordem</label>
                  <input id="op2-order-date" type="date" value={orderDate} onChange={event => setOrderDate(event.target.value)} required style={{ boxSizing: "border-box", width: "100%", height: "42px", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "1rem" }} />
                </div>
                <div style={{ minWidth: "160px" }}>
                  <span style={{ display: "block", marginBottom: "6px", color: "#64748b", fontWeight: 700 }}>Usuário responsável</span>
                  <span style={{ boxSizing: "border-box", height: "42px", display: "inline-flex", alignItems: "center", gap: "7px", padding: "0 12px", border: "1px solid #cbd8e6", borderRadius: "18px", background: "#eef3f8", color: "#526982", fontWeight: 600 }}><Icons.BsPerson />{responsibleName || "—"}</span>
                </div>
                <div style={{ width: "140px" }}>
                  <label htmlFor="op2-order-status" style={{ display: "block", marginBottom: "6px", color: "#64748b", fontWeight: 700 }}>Status</label>
                  <select id="op2-order-status" value={orderStatus} onChange={event => setOrderStatus(event.target.value as "Aberto" | "Fechado")} style={{ boxSizing: "border-box", width: "100%", height: "42px", padding: "7px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "#fff", fontSize: "1rem" }}>
                    <option value="Aberto">Aberto</option>
                    <option value="Fechado">Fechado</option>
                  </select>
                </div>
                <button type="button" onClick={() => setShowInsumosModal(true)} style={{ height: "42px", marginLeft: "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "7px", padding: "0 13px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "#fff", color: "var(--primary-color)", fontWeight: 700, cursor: "pointer" }}><Icons.BsCalculator /> Calcular Insumos</button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                <h3 style={{ margin: 0, color: "#334155", fontSize: "1.25rem" }}>Sabores e quantidades</h3>
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
              <button type="button" aria-label="Fechar cálculo de insumos" onClick={() => setShowInsumosModal(false)} style={{ border: 0, background: "transparent", color: "#64748b", fontSize: "1.7rem", cursor: "pointer" }}><Icons.BsX /></button>
            </div>
            <div className="freq-table-wrapper" style={{ maxHeight: "65vh", overflow: "auto", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
              <table className="freq-table op2-draft-table" style={{ minWidth: "700px" }}>
                <thead><tr>
                  <th style={{ textAlign: "left" }}>Insumo</th>
                  <th style={{ textAlign: "center" }}>Estoque Atual (Fábrica)</th>
                  <th style={{ textAlign: "center" }}>Quantidade Necessária</th>
                  <th style={{ textAlign: "right" }}>Saldo Final</th>
                </tr></thead>
                <tbody>
                  {requiredIngredients.length === 0 ? (
                    <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>Não há insumos calculados para os sabores desta ordem.</td></tr>
                  ) : requiredIngredients.map(ingredient => {
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
    </>
  );
}

export default OrdemProducao2;
