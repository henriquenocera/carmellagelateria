import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";
import "../css/Frequencia.css";

const STORES = [
  { id: "mh", name: "Estoque MH" },
  { id: "ahu", name: "Loja Ahú" },
  { id: "altoxv", name: "Loja Alto XV" },
  { id: "fabrica", name: "Fábrica" },
];

function Inventario() {
  const { user, isAdmin } = useAuth();
  
  const getToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [activeTab, setActiveTab] = useState(STORES[0].id);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  
  const [insumos, setInsumos] = useState<any[]>([]);
  const [inventoryMap, setInventoryMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDate, setNewDate] = useState(getToday());

  // Executado ao trocar a aba (unidade)
  useEffect(() => {
    async function loadTab() {
      setLoading(true);
      await fetchInsumos();
      await fetchDates();
      // O fetchInventoryForDate será chamado pelo useEffect de selectedDate logo em seguida se houver datas.
    }
    loadTab();
  }, [activeTab]);

  // Executado ao trocar a data selecionada
  useEffect(() => {
    setEditMode(false);
    if (selectedDate) {
      fetchInventoryForDate();
    } else {
      setInventoryMap({});
      setLoading(false);
    }
  }, [selectedDate]);

  async function fetchInsumos() {
    try {
      const { data: insumosData, error: insumosError } = await supabase
        .from("cadastro_insumos")
        .select("id, nome, config_estoque, ordem")
        .eq("ativo", true)
        .order("ordem", { ascending: true })
        .order("nome", { ascending: true });

      if (insumosError) throw insumosError;
      
      const visible = (insumosData || []).filter(ins => ins.config_estoque?.[activeTab]?.ativo === true);
      setInsumos(visible);
    } catch (err) {
      console.error("Erro ao buscar insumos:", err);
    }
  }

  async function fetchDates() {
    try {
      const unitName = STORES.find(s => s.id === activeTab)?.name;
      const { data, error } = await supabase
        .from("inventario_insumos")
        .select("data_inventario")
        .eq("unidade", unitName);

      if (error) throw error;

      // Extract unique dates and sort descending
      const uniqueDates = Array.from(new Set((data || []).map(d => d.data_inventario))).sort((a, b) => b.localeCompare(a));
      setAvailableDates(uniqueDates);
      
      if (uniqueDates.length > 0) {
        setSelectedDate(uniqueDates[0]); // Seleciona o mais recente por padrão
      } else {
        setSelectedDate("");
        setLoading(false);
      }
    } catch (err) {
      console.error("Erro ao buscar datas do inventário:", err);
      setLoading(false);
    }
  }

  async function fetchInventoryForDate() {
    try {
      setLoading(true);
      const unitName = STORES.find(s => s.id === activeTab)?.name;
      
      const { data: invData, error: invError } = await supabase
        .from("inventario_insumos")
        .select("insumo_id, quantidade")
        .eq("data_inventario", selectedDate)
        .eq("unidade", unitName);

      if (invError) throw invError;

      const currentInv: Record<string, string> = {};
      (invData || []).forEach(inv => {
        currentInv[inv.insumo_id] = inv.quantidade.toString();
      });
      setInventoryMap(currentInv);
      setIsAlreadySaved((invData || []).length > 0);
    } catch (err) {
      console.error("Erro ao carregar dados da data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleLocalChange = (insumoId: string, value: string) => {
    setInventoryMap(prev => ({ ...prev, [insumoId]: value }));
  };

  const handleSaveAll = async () => {
    try {
      if (!selectedDate) {
        alert("Nenhuma data selecionada para o inventário!");
        return;
      }

      setIsSavingAll(true);
      const unitName = STORES.find(s => s.id === activeTab)?.name;
      
      const toUpsert: any[] = [];
      const toDelete: string[] = [];

      insumos.forEach(insumo => {
        const value = inventoryMap[insumo.id];
        if (value === "" || value === undefined) {
          toDelete.push(insumo.id);
        } else {
          const floatValue = parseFloat(value);
          if (!isNaN(floatValue)) {
            toUpsert.push({
              insumo_id: insumo.id,
              data_inventario: selectedDate,
              unidade: unitName,
              quantidade: floatValue
            });
          }
        }
      });

      if (toUpsert.length > 0) {
        const { error } = await supabase
          .from("inventario_insumos")
          .upsert(toUpsert, { onConflict: 'insumo_id,unidade,data_inventario' });
        if (error) throw error;
      }

      if (toDelete.length > 0) {
        const { error } = await supabase
          .from("inventario_insumos")
          .delete()
          .eq("data_inventario", selectedDate)
          .eq("unidade", unitName)
          .in("insumo_id", toDelete);
        
        if (error && error.code !== 'PGRST116') {
          console.error("Erro ao deletar vazios:", error);
        }
      }

      setIsAlreadySaved(true);
      setEditMode(false);
      alert("Inventário salvo com sucesso!");
    } catch (err: any) {
      console.error("Erro ao salvar inventário:", err);
      alert("Erro ao salvar inventário: " + (err.message || JSON.stringify(err)));
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleCreateNew = () => {
    if (!newDate) {
      alert("Selecione uma data para o inventário.");
      return;
    }
    
    // Adiciona a nova data na lista se não existir, já garantindo a ordenação
    if (!availableDates.includes(newDate)) {
      setAvailableDates(prev => {
        const updated = [...prev, newDate];
        return updated.sort((a, b) => b.localeCompare(a));
      });
    }
    
    // Altera a data selecionada e limpa o modal
    setSelectedDate(newDate);
    setIsAlreadySaved(false);
    setEditMode(false);
    setIsModalOpen(false);
  };

  const handleDeleteInventory = async () => {
    if (!window.confirm(`Tem certeza que deseja DELETAR o inventário do dia ${formatDateBR(selectedDate)}? Essa ação não pode ser desfeita.`)) {
      return;
    }
    try {
      setLoading(true);
      const unitName = STORES.find(s => s.id === activeTab)?.name;
      const { error } = await supabase
        .from("inventario_insumos")
        .delete()
        .eq("data_inventario", selectedDate)
        .eq("unidade", unitName);

      if (error) throw error;
      
      alert("Inventário deletado com sucesso!");
      
      const remaining = availableDates.filter(d => d !== selectedDate);
      setAvailableDates(remaining);
      
      if (remaining.length > 0) {
        setSelectedDate(remaining[0]);
      } else {
        setSelectedDate("");
      }
      
    } catch (err: any) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar inventário.");
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = isAlreadySaved && !editMode;

  const renderEditableInput = (insumo: any) => {
    const value = inventoryMap[insumo.id] ?? "";

    if (isReadOnly) {
      return (
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1rem", color: "var(--text-color)" }}>
          {value !== "" ? value : "-"}
        </div>
      );
    }

    return (
      <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <input
          type="number"
          step="0.001"
          value={value}
          onChange={(e) => handleLocalChange(insumo.id, e.target.value)}
          style={{
            border: "1px solid #cbd5e1",
            background: "#fff",
            width: "120px",
            textAlign: "center",
            outline: "none",
            color: "inherit",
            padding: "8px",
            borderRadius: "6px",
            transition: "all 0.3s ease",
            boxSizing: "border-box",
            fontSize: "1.05rem"
          }}
          placeholder="Qtd"
        />
      </div>
    );
  };

  // Formata a data para exibir no select (DD/MM/YYYY)
  const formatDateBR = (isoStr: string) => {
    if (!isoStr) return "";
    const [y, m, d] = isoStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <>
      <Helmet>
        <title>Inventário</title>
      </Helmet>

      {/* MODAL DE NOVO INVENTÁRIO */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "40px", borderRadius: "12px",
            width: "500px", maxWidth: "90%", boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}>
            <h2 style={{ marginTop: 0, marginBottom: "12px", fontSize: "2rem", color: "var(--secondary-color)" }}>Novo Inventário</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "1.2rem", lineHeight: "1.5" }}>
              Para qual data você está realizando esta contagem na unidade <strong>{STORES.find(s => s.id === activeTab)?.name}</strong>?
            </p>
            
            <input 
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              style={{
                width: "100%", padding: "16px", borderRadius: "8px", border: "1px solid #cbd5e1",
                fontSize: "1.3rem", marginBottom: "32px", boxSizing: "border-box"
              }}
            />

            <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: "12px 24px", backgroundColor: "#f1f5f9", color: "#475569",
                  border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer",
                  fontSize: "1.1rem"
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateNew}
                style={{
                  padding: "12px 24px", backgroundColor: "var(--primary-color)", color: "#fff",
                  border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer",
                  fontSize: "1.1rem"
                }}
              >
                Criar Inventário
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Inventário de Insumos</h1>
            <p>Realize a contagem "cega" do estoque. Os valores salvos aqui servirão como marco inicial para os cálculos dinâmicos de estoque.</p>
          </div>
        </div>

        <div style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "24px" 
          }}>
            {/* Tab Navigation */}
            <div style={{ 
              display: "flex", 
              gap: "12px", 
              overflowX: "auto"
            }}>
              {STORES.map((store) => (
                <button
                  key={store.id}
                  onClick={() => setActiveTab(store.id)}
                  style={{
                    padding: "10px 24px",
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: activeTab === store.id ? "#a17550" : "#f1f5f9",
                    color: activeTab === store.id ? "#fff" : "#64748b",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap"
                  }}
                >
                  {store.name}
                </button>
              ))}
            </div>

            {/* Date Filters & Create Action */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "#fff",
                padding: "8px 16px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #cbd5e1"
              }}>
                <label style={{ fontWeight: 600, color: "var(--text-muted)" }}>
                  Inventário:
                </label>
                <select 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={availableDates.length === 0}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    outline: "none",
                    fontWeight: 500,
                    color: "var(--primary-color)",
                    backgroundColor: availableDates.length === 0 ? "#f8fafc" : "#fff",
                    minWidth: "140px"
                  }}
                >
                  {availableDates.length === 0 && <option value="">Nenhum</option>}
                  {availableDates.map(date => (
                    <option key={date} value={date}>{formatDateBR(date)}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setNewDate(getToday());
                  setIsModalOpen(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  backgroundColor: "#fff",
                  color: "var(--primary-color)",
                  border: "2px solid var(--primary-color)",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}
              >
                <Icons.BsPlusLg style={{ strokeWidth: "1" }} />
                Novo Inventário
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : insumos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
              <Icons.BsBoxSeam style={{ fontSize: "3rem", color: "#cbd5e1", marginBottom: "16px" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", margin: 0 }}>
                Nenhum insumo ativo para esta unidade.
              </p>
            </div>
          ) : selectedDate === "" ? (
            <div style={{ textAlign: "center", padding: "60px 40px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "2px dashed #cbd5e1" }}>
              <Icons.BsJournalText style={{ fontSize: "3.5rem", color: "#94a3b8", marginBottom: "16px" }} />
              <h2 style={{ margin: "0 0 8px 0", color: "#475569" }}>Nenhum Inventário Localizado</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto" }}>
                Essa unidade ainda não possui nenhuma contagem registrada no sistema. Clique no botão <b>"+ Novo Inventário"</b> acima para iniciar a primeira contagem.
              </p>
            </div>
          ) : (
            <>
              {isAlreadySaved && isAdmin && !editMode && (
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginBottom: "16px" }}>
                  <button
                    onClick={() => setEditMode(true)}
                    style={{ padding: "8px 16px", backgroundColor: "#f59e0b", color: "#fff", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                  >
                    <Icons.BsPencil /> Editar Inventário
                  </button>
                  <button
                    onClick={handleDeleteInventory}
                    style={{ padding: "8px 16px", backgroundColor: "#ef4444", color: "#fff", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                  >
                    <Icons.BsTrash /> Deletar Inventário
                  </button>
                </div>
              )}
              
              {editMode && (
                <div style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #fde68a" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icons.BsExclamationTriangleFill /> 
                    <span><strong>Modo de Edição Ativo:</strong> Você está alterando um inventário fechado do passado.</span>
                  </span>
                  <button onClick={() => setEditMode(false)} style={{ background: "none", border: "none", color: "#92400e", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }}>Cancelar Edição</button>
                </div>
              )}

              <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                <table className="freq-table" style={{ minWidth: "600px", maxWidth: "800px", margin: "0 auto" }}>
                  <thead>
                    <tr>
                      <th>Insumo</th>
                      <th style={{ textAlign: "center", width: "200px" }}>Quantidade Contada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insumos.map((insumo) => (
                      <tr key={insumo.id} style={{ transition: "background 0.2s" }}>
                        <td style={{ fontWeight: 500 }}>{insumo.nome}</td>
                        <td style={{ textAlign: "center", padding: "12px 8px" }}>
                          {renderEditableInput(insumo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {!isReadOnly && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "32px", paddingBottom: "32px" }}>
                  <button
                    onClick={handleSaveAll}
                    disabled={isSavingAll}
                    style={{
                      padding: "16px 40px",
                      backgroundColor: "var(--primary-color)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      cursor: isSavingAll ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      transition: "all 0.2s"
                    }}
                  >
                    {isSavingAll ? <Icons.BsArrowClockwise className="spin" style={{ fontSize: "1.4rem" }} /> : <Icons.BsCheckLg style={{ fontSize: "1.4rem" }} />}
                    {isSavingAll ? "Salvando Inventário..." : "Confirmar e Salvar Inventário"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Inventario;
