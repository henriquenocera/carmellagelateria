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

function ListaComprasManual() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [insumos, setInsumos] = useState<any[]>([]);
  const [listas, setListas] = useState<ShoppingList[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [selectedInsumo, setSelectedInsumo] = useState<Record<number, any>>({});
  const [quantidades, setQuantidades] = useState<Record<number, string>>({});
  const [showOpenListWarning, setShowOpenListWarning] = useState(false);

  useEffect(() => { void fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [{ data: materialData, error: materialError }, { data: listData, error: listError }] = await Promise.all([
        supabase.from("cadastro_insumos").select("id, nome, tipo, unidade_conversao").eq("ativo", true).order("nome", { ascending: true }),
        supabase.from("lista_compras_manual").select("id, nome, created_at, user_id, criado_por, status, profiles(name), lista_compras_manual_itens(id, lista_id, insumo_id, quantidade, comprado, origem, cadastro_insumos(nome, tipo, unidade_conversao))").order("created_at", { ascending: false })
      ]);
      if (materialError) throw materialError;
      if (listError) throw listError;
      setInsumos(materialData || []);
      setListas((listData || []).map((list: any) => ({ ...list, itens: list.lista_compras_manual_itens || [] })));
    } catch (error) {
      console.error("Erro ao buscar listas de compras:", error);
      alert("Erro ao buscar listas de compras. Verifique se a migração do banco de dados foi aplicada.");
    } finally { setLoading(false); }
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
  const options = insumos.map(item => ({ value: item.id, label: item.nome }));

  return <>
    <Helmet><title>Lista de Compras (Manual)</title></Helmet>
    <div className="frequencia-container">
      <div className="frequencia-header"><div className="frequencia-title-group"><h1>Lista de Compras (Manual)</h1><p>Crie listas e escolha os materiais que deseja comprar.</p></div></div>
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
                  {isExpanded && <tr><td colSpan={7} style={{ padding: 18, background: "#f8fafc", opacity: list.status === "Fechada" ? .68 : 1 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap", marginBottom: 14 }}>
                      <div style={{ flex: "1 1 260px", minWidth: 0 }}><label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>Insumo</label><Select options={options} value={selectedInsumo[list.id] || null} onChange={value => setSelectedInsumo(current => ({ ...current, [list.id]: value }))} placeholder="Selecione o material..." isSearchable maxMenuHeight={360} menuPosition="fixed" menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }), menu: base => ({ ...base, zIndex: 9999 }), control: base => ({ ...base, minHeight: 44, fontSize: "1.1rem" }), input: base => ({ ...base, fontSize: "1.1rem" }), singleValue: base => ({ ...base, fontSize: "1.1rem" }), placeholder: base => ({ ...base, fontSize: "1.1rem" }), option: base => ({ ...base, fontSize: "1.05rem", padding: "10px 12px" }) }} /></div>
                      <div style={{ width: 140 }}><label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>Quantidade</label><input type="number" min="0" step="any" value={quantidades[list.id] || ""} onChange={event => setQuantidades(current => ({ ...current, [list.id]: event.target.value }))} style={{ width: "100%", padding: "9px 12px", border: "1px solid #cbd5e1", borderRadius: 5, boxSizing: "border-box" }} /></div>
                      <button type="button" disabled={saving} onClick={() => void handleAddItem(list.id)} style={{ height: 38, display: "inline-flex", alignItems: "center", gap: 7, padding: "0 16px", border: 0, borderRadius: 6, background: "#16a34a", color: "white", fontWeight: 700, cursor: "pointer" }}><Icons.BsPlusCircle /> Adicionar material</button>
                    </div>
                    {list.itens.length === 0 ? <div style={{ padding: 18, textAlign: "center", color: "#64748b" }}>Esta lista ainda não possui materiais.</div> : <div style={{ overflowX: "auto" }}><table className="freq-table" style={{ minWidth: 760, background: "white" }}><thead><tr><th style={{ width: 50, textAlign: "center" }}>Status</th><th>Material</th><th>Tipo</th><th style={{ textAlign: "center" }}>Unidade</th><th style={{ textAlign: "center" }}>Quantidade a comprar</th><th style={{ textAlign: "center" }}>Origem</th><th style={{ textAlign: "center" }}>Ações</th></tr></thead><tbody>{list.itens.map(item => <tr key={item.id} style={{ opacity: item.comprado ? .55 : 1 }}><td style={{ textAlign: "center" }}><input type="checkbox" checked={item.comprado} onChange={() => void handleToggle(item)} /></td><td style={{ fontWeight: 600, textDecoration: item.comprado ? "line-through" : undefined }}>{item.cadastro_insumos?.nome || "Insumo excluído"}</td><td>{item.cadastro_insumos?.tipo || "—"}</td><td style={{ textAlign: "center" }}>{item.cadastro_insumos?.unidade_conversao || "—"}</td><td style={{ textAlign: "center", fontWeight: 700 }}>{item.quantidade}</td><td style={{ textAlign: "center" }}>{item.origem || "Manual"}</td><td style={{ textAlign: "center" }}><button type="button" className="delete-record-btn" title="Remover material" onClick={() => void handleDeleteItem(item)}><Icons.BsTrash /></button></td></tr>)}</tbody></table></div>}
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

export default ListaComprasManual;
