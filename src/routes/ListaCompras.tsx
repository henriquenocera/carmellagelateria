import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import Select from "react-select";
import { useAuth } from "../AuthProvider";
import supabase from "../services/supabase-client";

type ShoppingItem = {
  id: number;
  lista_id: number;
  insumo_id: string;
  quantidade: number;
  comprado: boolean;
  origem?: "Estoque" | "Produção" | "Manual" | string;
  cadastro_insumos?: { nome?: string; tipo?: string; unidade_conversao?: string } | null;
};
type ShoppingList = { id: number; nome: string; created_at: string; user_id?: string | null; criado_por?: string | null; status: "Aberta" | "Fechada"; profiles?: { name?: string | null } | null; itens: ShoppingItem[] };
type PurchaseStats = {
  lastDate: string;
  lastCost: number | null;
  lastSupplier: string | null;
  sum: number;
  count: number;
  min: number | null;
  max: number | null;
};

function ListaCompras() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [insumos, setInsumos] = useState<any[]>([]);
  const [listas, setListas] = useState<ShoppingList[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [selectedInsumo, setSelectedInsumo] = useState<Record<number, any>>({});
  const [quantidades, setQuantidades] = useState<Record<number, string>>({});
  const [showOpenListWarning, setShowOpenListWarning] = useState(false);
  const [purchaseStats, setPurchaseStats] = useState<Record<string, PurchaseStats>>({});
  const [editingQuantity, setEditingQuantity] = useState<{ id: number; value: string } | null>(null);

  useEffect(() => { void fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [{ data: materialData, error: materialError }, { data: listData, error: listError }, stats] = await Promise.all([
        supabase.from("cadastro_insumos").select("id, nome, tipo, unidade_conversao").eq("ativo", true).order("nome", { ascending: true }),
        supabase.from("lista_compras_manual").select("id, nome, created_at, user_id, criado_por, status, profiles(name), lista_compras_manual_itens(id, lista_id, insumo_id, quantidade, comprado, origem, cadastro_insumos(nome, tipo, unidade_conversao))").order("created_at", { ascending: false }),
        fetchPurchaseStats()
      ]);
      if (materialError) throw materialError;
      if (listError) throw listError;
      setInsumos(materialData || []);
      setPurchaseStats(stats);
      setListas((listData || []).map((list: any) => ({ ...list, itens: list.lista_compras_manual_itens || [] })));
    } catch (error) {
      console.error("Erro ao buscar listas de compras:", error);
      alert("Erro ao buscar listas de compras. Verifique se a migração do banco de dados foi aplicada.");
    } finally { setLoading(false); }
  }

  async function fetchPurchaseStats() {
    const toDateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const today = new Date();
    const start = new Date(today.getFullYear() - 1, today.getMonth(), 1);
    const lastDay = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    start.setDate(Math.min(today.getDate(), lastDay));
    const startDate = toDateKey(start);
    const stats: Record<string, PurchaseStats> = {};
    const pageSize = 1000;
    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await supabase.from("entradas_mercadoria")
        .select("insumo_id, data_compra, valor_unitario, fornecedor")
        .lte("data_compra", toDateKey(today))
        .order("data_compra", { ascending: false })
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(offset, offset + pageSize - 1);
      if (error) throw error;
      for (const purchase of data || []) {
        const cost = purchase.valor_unitario == null ? null : Number(purchase.valor_unitario);
        const validCost = cost !== null && Number.isFinite(cost) ? cost : null;
        const entry = stats[purchase.insumo_id] ?? (stats[purchase.insumo_id] = {
          lastDate: purchase.data_compra, lastCost: validCost, lastSupplier: purchase.fornecedor,
          sum: 0, count: 0, min: null, max: null
        });
        if (purchase.data_compra >= startDate && validCost !== null) {
          entry.sum += validCost;
          entry.count += 1;
          entry.min = entry.min === null ? validCost : Math.min(entry.min, validCost);
          entry.max = entry.max === null ? validCost : Math.max(entry.max, validCost);
        }
      }
      if (!data || data.length < pageSize) break;
    }
    return stats;
  }

  async function handleCreateList() {
    if (listas.some(list => list.status === "Aberta")) {
      setShowOpenListWarning(true);
      return;
    }
    const nome = "Lista de Compras";
    try {
      const { data, error } = await supabase.from("lista_compras_manual").insert({ nome, user_id: user?.id || null }).select("id, nome, created_at, user_id, status, profiles(name)").single();
      if (error) throw error;
      setListas(current => [ { ...data, itens: [] }, ...current ]);
      setExpanded(current => [data.id, ...current]);
    } catch (error) { console.error("Erro ao criar lista:", error); alert("Não foi possível criar a lista."); }
  }

  async function handleAddItem(listId: number) {
    const selection = selectedInsumo[listId];
    const quantidade = Number(quantidades[listId]);
    if (!selection || !Number.isFinite(quantidade) || quantidade <= 0) {
      alert("Selecione um insumo e informe uma quantidade maior que zero.");
      return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase.from("lista_compras_manual_itens")
        .insert({ lista_id: listId, insumo_id: selection.value, quantidade, origem: "Manual" })
        .select("id, lista_id, insumo_id, quantidade, comprado, origem, cadastro_insumos(nome, tipo, unidade_conversao)").single();
      if (error) throw error;
      setListas(current => current.map(list => list.id === listId ? { ...list, itens: [...list.itens, data] } : list));
      setSelectedInsumo(current => ({ ...current, [listId]: null }));
      setQuantidades(current => ({ ...current, [listId]: "" }));
    } catch (error) { console.error("Erro ao adicionar material:", error); alert("Não foi possível adicionar o material."); }
    finally { setSaving(false); }
  }

  async function handleToggle(item: ShoppingItem) {
    const comprado = !item.comprado;
    setListas(current => current.map(list => ({ ...list, itens: list.itens.map(row => row.id === item.id ? { ...row, comprado } : row) })));
    const { error } = await supabase.from("lista_compras_manual_itens").update({ comprado }).eq("id", item.id);
    if (error) {
      setListas(current => current.map(list => ({ ...list, itens: list.itens.map(row => row.id === item.id ? { ...row, comprado: item.comprado } : row) })));
      alert("Não foi possível atualizar o status do material.");
    }
  }

  async function handleDeleteItem(item: ShoppingItem) {
    if (!window.confirm("Remover este material da lista?")) return;
    const { error } = await supabase.from("lista_compras_manual_itens").delete().eq("id", item.id);
    if (error) { alert("Não foi possível remover o material."); return; }
    setListas(current => current.map(list => list.id === item.lista_id ? { ...list, itens: list.itens.filter(row => row.id !== item.id) } : list));
  }

  function handleEditQuantity(item: ShoppingItem) {
    setEditingQuantity({ id: item.id, value: String(item.quantidade) });
  }

  async function handleSaveQuantity(item: ShoppingItem) {
    if (!editingQuantity || editingQuantity.id !== item.id || saving) return;
    const value = editingQuantity.value;
    const quantidade = Number(value.trim().replace(",", "."));
    if (!value.trim() || !Number.isFinite(quantidade) || quantidade <= 0) {
      alert("Informe uma quantidade maior que zero.");
      return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase.from("lista_compras_manual_itens")
        .update({ quantidade }).eq("id", item.id).select("id, quantidade").single();
      if (error) throw error;
      setListas(current => current.map(list => list.id === item.lista_id
        ? { ...list, itens: list.itens.map(row => row.id === item.id ? { ...row, quantidade: data.quantidade } : row) }
        : list));
      setEditingQuantity(null);
    } catch (error) {
      console.error("Erro ao editar quantidade:", error);
      alert("Não foi possível atualizar a quantidade do material.");
    } finally { setSaving(false); }
  }

  async function handleDeleteList(list: ShoppingList) {
    if (!window.confirm(`Excluir a lista “${list.nome}” e todos os materiais?`)) return;
    const { error } = await supabase.from("lista_compras_manual").delete().eq("id", list.id);
    if (error) { alert("Não foi possível excluir a lista."); return; }
    setListas(current => current.filter(row => row.id !== list.id));
  }

  async function handleStatusChange(list: ShoppingList, status: "Aberta" | "Fechada") {
    setListas(current => current.map(row => row.id === list.id ? { ...row, status } : row));
    const { error } = await supabase.from("lista_compras_manual").update({ status }).eq("id", list.id);
    if (error) {
      setListas(current => current.map(row => row.id === list.id ? { ...row, status: list.status } : row));
      alert("Não foi possível atualizar o status da lista.");
    }
  }

  const formatDate = (date: string) => date ? new Date(date).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";
  const formatPurchaseDate = (date?: string) => date ? date.split("-").reverse().join("/") : "—";
  const formatTimeSincePurchase = (date?: string) => {
    if (!date) return "";
    const [year, month, day] = date.split("-").map(Number);
    const today = new Date();
    const days = Math.floor((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(year, month - 1, day)) / 86400000);
    if (days <= 0) return "hoje";
    let months = (today.getFullYear() - year) * 12 + today.getMonth() - (month - 1);
    if (today.getDate() < day) months -= 1;
    if (months >= 12) {
      const years = Math.floor(months / 12);
      return `${years} ${years === 1 ? "ano" : "anos"}`;
    }
    if (months >= 1) return `${months} ${months === 1 ? "mês" : "meses"}`;
    if (days >= 7) {
      const weeks = Math.floor(days / 7);
      return `${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
    }
    return `${days} ${days === 1 ? "dia" : "dias"}`;
  };
  const formatCurrency = (value?: number | null) => value == null ? "—" : value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const options = insumos.map(item => ({ value: item.id, label: item.nome }));

  return <>
    <Helmet>
      <title>Lista de Compras</title>
      <style>{`
        .shopping-lists-page .freq-table th { padding: 6px !important; font-size: 1.1rem !important; line-height: 1.2 !important; }
        .shopping-lists-page .freq-table td { padding: 5px 6px !important; font-size: 1.15rem !important; line-height: 1.25 !important; height: auto !important; }
        .shopping-lists-page .freq-table tbody tr > td { border-bottom: 1px solid #cbd5e1 !important; transition: background-color .15s ease; }
        .shopping-lists-page .freq-table tbody tr:not(.shopping-list-details):hover > td { background-color: #f1f6fb !important; }
        .shopping-lists-page .freq-table tbody tr.shopping-list-details > td { padding: 18px !important; }
        .shopping-item-actions { display: flex; gap: 8px; justify-content: center; align-items: center; flex-wrap: nowrap; }
        .shopping-item-actions button { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; margin: 0; padding: 4px; background: none; border: none; cursor: pointer; font-size: 1.1rem; }
        .shopping-item-actions button:disabled { cursor: wait; opacity: .5; }
        .shopping-lists-page .shopping-items-table th,
        .shopping-lists-page .shopping-items-table td { white-space: normal !important; overflow-wrap: anywhere; text-align: left !important; }
        .shopping-lists-page .shopping-items-table .shopping-item-actions { justify-content: flex-start; }
        .shopping-quantity-edit { display: inline-flex; align-items: center; gap: 6px; padding: 3px 6px; margin: -3px -6px; border: none; border-radius: 4px; background: transparent; color: inherit; font: inherit; font-weight: 700; cursor: pointer; }
        .shopping-quantity-edit svg { opacity: 0; color: #3b82f6; }
        .shopping-quantity-edit:hover, .shopping-quantity-edit:focus-visible { background: #e5efff; color: #2563eb; }
        .shopping-quantity-edit:hover svg, .shopping-quantity-edit:focus-visible svg { opacity: 1; }
        .shopping-quantity-edit:disabled { cursor: wait; opacity: .5; }
      `}</style>
    </Helmet>
    <div className="frequencia-container shopping-lists-page">
      <div className="frequencia-header"><div className="frequencia-title-group"><h1>Lista de Compras</h1><p>Crie listas e escolha os materiais que deseja comprar.</p></div></div>
      <div style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <button type="button" onClick={handleCreateList} className="financial-add-button" style={{ margin: 0, height: 42, padding: "0 16px", fontSize: "1.2rem" }}><Icons.BsPlusCircleFill /> Nova lista de compras</button>
        </div>
        <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <table className="freq-table" style={{ minWidth: 1000 }}>
            <thead><tr>{["Lista de compras", "Criada em", "Criado por", "Materiais", "Progresso", "Status", "Ações"].map(label => <th key={label} style={{ textAlign: "center", background: "#f1e7da", color: "#80501f", textTransform: "uppercase" }}>{label}</th>)}</tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} style={{ textAlign: "center", padding: 32 }}><Icons.BsArrowClockwise className="spin" /></td></tr> : listas.length === 0 ? <tr><td colSpan={7} style={{ textAlign: "center", padding: 36, color: "#94a3b8", fontSize: "1.2rem" }}>Nenhuma lista cadastrada. Crie uma nova lista para começar.</td></tr> : listas.map(list => {
                const isExpanded = expanded.includes(list.id);
                const purchased = list.itens.filter(item => item.comprado).length;
                return <React.Fragment key={list.id}>
                  <tr onClick={() => setExpanded(current => isExpanded ? current.filter(id => id !== list.id) : [...current, list.id])} style={{ cursor: "pointer", opacity: list.status === "Fechada" ? .58 : 1, backgroundColor: list.status === "Fechada" ? "#f7f8fa" : undefined, transition: "opacity .15s" }}>
                    <td style={{ fontWeight: 700 }}><Icons.BsChevronRight style={{ marginRight: 10, transform: isExpanded ? "rotate(90deg)" : undefined, transition: "transform .15s" }} />Lista de Compras</td>
                    <td style={{ textAlign: "center" }}>{formatDate(list.created_at)}</td>
                    <td style={{ textAlign: "center" }}><span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "5px 12px", border: "1px solid #cbd8e6", borderRadius: 16, background: "#eef3f8", color: "#526982", fontWeight: 600 }}><Icons.BsPerson />{list.criado_por || list.profiles?.name || "—"}</span></td>
                    <td style={{ textAlign: "center", fontWeight: 700 }}>{list.itens.length}</td>
                    <td style={{ textAlign: "center" }}>{list.itens.length ? `${purchased}/${list.itens.length} comprados` : "Sem materiais"}</td>
                    <td style={{ textAlign: "center" }}><select aria-label={`Status da lista ${list.nome}`} value={list.status || "Aberta"} onClick={event => event.stopPropagation()} onChange={event => void handleStatusChange(list, event.target.value as "Aberta" | "Fechada")} style={{ padding: "6px 12px", border: `1px solid ${list.status === "Fechada" ? "#cbd5e1" : "#cbd8e6"}`, borderRadius: 16, color: list.status === "Fechada" ? "#475569" : "#365b7d", background: list.status === "Fechada" ? "#f1f5f9" : "#eff6fb", fontWeight: 700, cursor: "pointer" }}><option value="Aberta">Aberta</option><option value="Fechada">Fechada</option></select></td>
                    <td style={{ textAlign: "center" }}><button type="button" className="delete-record-btn" title="Excluir lista" onClick={event => { event.stopPropagation(); void handleDeleteList(list); }}><Icons.BsTrash /></button></td>
                  </tr>
                  {isExpanded && <tr className="shopping-list-details"><td colSpan={7} style={{ padding: 18, background: "#f8fafc", opacity: list.status === "Fechada" ? .68 : 1 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap", marginBottom: 14 }}>
                      <div style={{ flex: "1 1 260px", minWidth: 0 }}><label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>Insumo</label><Select options={options} value={selectedInsumo[list.id] || null} onChange={value => setSelectedInsumo(current => ({ ...current, [list.id]: value }))} placeholder="Selecione o material..." isSearchable maxMenuHeight={360} menuPosition="fixed" menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), menu: base => ({ ...base, zIndex: 9999 }), control: base => ({ ...base, minHeight: 44, fontSize: "1.1rem" }), input: base => ({ ...base, fontSize: "1.1rem" }), singleValue: base => ({ ...base, fontSize: "1.1rem" }), placeholder: base => ({ ...base, fontSize: "1.1rem" }), option: base => ({ ...base, fontSize: "1.05rem", padding: "10px 12px" }) }} /></div>
                      <div style={{ width: 140 }}><label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>Quantidade</label><input type="number" min="0" step="any" value={quantidades[list.id] || ""} onChange={event => setQuantidades(current => ({ ...current, [list.id]: event.target.value }))} style={{ width: "100%", padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: 5, boxSizing: "border-box" }} /></div>
                      <button type="button" disabled={saving} onClick={() => void handleAddItem(list.id)} style={{ height: 38, display: "inline-flex", alignItems: "center", gap: 7, padding: "0 16px", border: 0, borderRadius: 6, background: "#16a34a", color: "white", fontWeight: 700, cursor: "pointer" }}><Icons.BsPlusCircle /> Adicionar material</button>
                    </div>
                    {list.itens.length === 0 ? <div style={{ padding: 18, textAlign: "center", color: "#64748b" }}>Esta lista ainda não possui materiais.</div> : <div style={{ overflowX: "auto" }}>
                      <table className="freq-table shopping-items-table" style={{ minWidth: 1840, width: "100%", tableLayout: "fixed", background: "white" }}>
                        <colgroup>
                          <col style={{ width: 60 }} />
                          <col style={{ width: 240 }} />
                          <col style={{ width: 100 }} />
                          <col style={{ width: 100 }} />
                          <col style={{ width: 120 }} />
                          {Array.from({ length: 6 }, (_, index) => <col key={index} style={{ width: 190 }} />)}
                          <col style={{ width: 80 }} />
                        </colgroup>
                        <thead><tr>
                          <th style={{ width: 50, textAlign: "center" }}>Status</th>
                          <th style={{ minWidth: 240 }}>Material</th>
                          <th style={{ textAlign: "center" }}>Qntd a comprar</th>
                          <th style={{ textAlign: "center" }}>Unidade</th>
                          <th style={{ textAlign: "center" }}>Origem</th>
                          <th style={{ textAlign: "center" }}>Data da última compra</th>
                          <th style={{ textAlign: "center" }}>Último custo unitário</th>
                          <th style={{ textAlign: "center" }}>Último fornecedor</th>
                          <th style={{ textAlign: "center" }}>Média de valor 12 meses</th>
                          <th style={{ textAlign: "center" }}>Histórico menor valor 12 meses</th>
                          <th style={{ textAlign: "center" }}>Histórico maior valor 12 meses</th>
                          <th style={{ textAlign: "center" }}>Ações</th>
                        </tr></thead>
                        <tbody>{list.itens.map(item => {
                          const stats = purchaseStats[item.insumo_id];
                          return <tr key={item.id} style={{ opacity: item.comprado ? .55 : 1 }}>
                            <td style={{ textAlign: "center" }}><input type="checkbox" checked={item.comprado} onChange={() => void handleToggle(item)} /></td>
                            <td style={{ fontWeight: 600, textDecoration: item.comprado ? "line-through" : undefined }}>{item.cadastro_insumos?.nome || "Insumo excluído"}</td>
                            <td style={{ textAlign: "center", fontWeight: 700 }}>
                              {editingQuantity?.id === item.id ? (
                                <form onSubmit={event => { event.preventDefault(); void handleSaveQuantity(item); }} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                  <input
                                    autoFocus
                                    type="number"
                                    min="0"
                                    step="any"
                                    required
                                    aria-label={`Quantidade de ${item.cadastro_insumos?.nome || "material"}`}
                                    value={editingQuantity.value}
                                    disabled={saving}
                                    onFocus={event => event.target.select()}
                                    onChange={event => setEditingQuantity({ id: item.id, value: event.target.value })}
                                    onKeyDown={event => { if (event.key === "Escape" && !saving) setEditingQuantity(null); }}
                                    style={{ width: 40, flex: 1, minWidth: 0, padding: "4px", border: "1px solid #93c5fd", borderRadius: 4, font: "inherit" }}
                                  />
                                  <button type="submit" disabled={saving} title="Salvar quantidade" aria-label="Salvar quantidade" style={{ display: "inline-flex", padding: 2, border: 0, background: "none", color: "#16a34a", cursor: "pointer" }}><Icons.BsCheckLg /></button>
                                  <button type="button" disabled={saving} title="Cancelar edição" aria-label="Cancelar edição" onClick={() => setEditingQuantity(null)} style={{ display: "inline-flex", padding: 2, border: 0, background: "none", color: "#ef4444", cursor: "pointer" }}><Icons.BsXLg /></button>
                                </form>
                              ) : (
                              <button type="button" className="shopping-quantity-edit" disabled={saving} title="Clique para editar a quantidade" aria-label={`Editar quantidade de ${item.cadastro_insumos?.nome || "material"}: ${item.quantidade}`} onClick={() => void handleEditQuantity(item)}>
                                {item.quantidade}<Icons.BsPencil aria-hidden="true" />
                              </button>
                              )}
                            </td>
                            <td style={{ textAlign: "center" }}>{item.cadastro_insumos?.unidade_conversao || "—"}</td>
                            <td style={{ textAlign: "center" }}>{item.origem || "Manual"}</td>
                            <td style={{ textAlign: "center" }}>{formatPurchaseDate(stats?.lastDate)}{stats?.lastDate && <span style={{ marginLeft: 6, color: "#64748b" }}>({formatTimeSincePurchase(stats.lastDate)})</span>}</td>
                            <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>{formatCurrency(stats?.lastCost)}</td>
                            <td style={{ textAlign: "center" }}>{stats?.lastSupplier || "—"}</td>
                            <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>{formatCurrency(stats?.count ? stats.sum / stats.count : null)}</td>
                            <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>{formatCurrency(stats?.min)}</td>
                            <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>{formatCurrency(stats?.max)}</td>
                            <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      <div className="shopping-item-actions">
                        <button type="button" disabled={saving} title="Editar quantidade a comprar" aria-label={`Editar quantidade de ${item.cadastro_insumos?.nome || "material"}`} onClick={() => void handleEditQuantity(item)} style={{ color: "#3b82f6" }}><Icons.BsPencil /></button>
                        <button type="button" className="delete-record-btn" title="Remover material" aria-label={`Remover ${item.cadastro_insumos?.nome || "material"}`} onClick={() => void handleDeleteItem(item)} style={{ color: "#ef4444" }}><Icons.BsTrash /></button>
                      </div></td></tr>;
                        })}</tbody></table></div>}
                  </td></tr>}
                </React.Fragment>;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    {showOpenListWarning && <div role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setShowOpenListWarning(false); }} style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(15, 23, 42, .52)" }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="open-list-warning-title" aria-describedby="open-list-warning-message" style={{ width: "min(480px, 100%)", padding: 26, border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff", boxShadow: "0 20px 60px rgba(15,23,42,.25)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <span style={{ width: 48, height: 48, flex: "0 0 48px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#fff7ed", color: "#c2410c", fontSize: 25 }}><Icons.BsExclamationTriangle /></span>
          <div><h2 id="open-list-warning-title" style={{ margin: "2px 0 10px", color: "#334155", fontSize: "1.65rem" }}>Lista aberta</h2><p id="open-list-warning-message" style={{ margin: 0, color: "#475569", lineHeight: 1.55, fontSize: "1.15rem" }}>Já existe uma lista de compras aberta, feche ela antes de criar outra</p></div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}><button type="button" autoFocus onClick={() => setShowOpenListWarning(false)} style={{ minWidth: 100, padding: "10px 20px", border: 0, borderRadius: 6, background: "#80501f", color: "white", fontWeight: 700, fontSize: "1.05rem", cursor: "pointer" }}>Entendi</button></div>
      </section>
    </div>}
  </>;
}

export default ListaCompras;
