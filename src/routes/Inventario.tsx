import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [isOldInvModalOpen, setIsOldInvModalOpen] = useState(false);
  const [inventoryCounts, setInventoryCounts] = useState<Record<string, number>>({});
  const [inventoryUsers, setInventoryUsers] = useState<Record<string, string>>({});
  const [inventoryTimes, setInventoryTimes] = useState<Record<string, string>>({});
  
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
        .select("id, nome, config_estoque, ordem, tipo, unidade_conversao")
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
        .select(`
          data_inventario,
          updated_at,
          profiles (name)
        `)
        .eq("unidade", unitName);

      if (error) throw error;
      
      const counts: Record<string, number> = {};
      const users: Record<string, string> = {};
      const times: Record<string, string> = {};
      
      (data || []).forEach((d: any) => {
        counts[d.data_inventario] = (counts[d.data_inventario] || 0) + 1;
        if (d.profiles?.name) {
          users[d.data_inventario] = d.profiles.name;
        }
        if (d.updated_at) {
          if (!times[d.data_inventario] || new Date(d.updated_at) > new Date(times[d.data_inventario])) {
            times[d.data_inventario] = d.updated_at;
          }
        }
      });
      setInventoryCounts(counts);
      setInventoryUsers(users);
      setInventoryTimes(times);

      // Extract unique dates and sort ascending (oldest to newest)
      const uniqueDates = Object.keys(counts).sort((a, b) => a.localeCompare(b));
      setAvailableDates(uniqueDates);
      
      setSelectedDate(""); // Sempre começa na lista
      setViewMode('list');
      setLoading(false);
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
              quantidade: floatValue,
              user_id: user?.id,
              updated_at: new Date().toISOString()
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
      await fetchDates(); // Refresh the list counts and users
      setViewMode('list');
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
        return updated.sort((a, b) => a.localeCompare(b));
      });
    }
    
    // Altera a data selecionada e limpa o modal
    setSelectedDate(newDate);
    setViewMode('detail');
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
      
      setSelectedDate("");
      setViewMode('list');
      
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
          className="no-spinner"
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

  const formatDateTimeBR = (isoStr: string) => {
    if (!isoStr) return "";
    const date = new Date(isoStr);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const unitName = STORES.find(s => s.id === activeTab)?.name || "Unidade";
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Inventário - ${unitName}`, 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Data da Contagem: ${formatDateBR(selectedDate)}`, 14, 27);
    
    let currentY = 33;
    if (inventoryUsers[selectedDate]) {
      doc.text(`Responsável: ${inventoryUsers[selectedDate]}`, 14, currentY);
      currentY += 6;
    }
    if (inventoryTimes[selectedDate]) {
      doc.text(`Salvo em: ${formatDateTimeBR(inventoryTimes[selectedDate])}`, 14, currentY);
      currentY += 6;
    }

    const tableData: any[] = [];
    
    insumos.forEach((insumo) => {
      const savedValue = inventoryMap[insumo.id];
      if (savedValue !== undefined && savedValue !== "") {
        tableData.push([
          insumo.nome,
          insumo.tipo || "-",
          insumo.unidade_conversao || "-",
          savedValue
        ]);
      }
    });

    autoTable(doc, {
      startY: currentY + 4,
      head: [["Insumo", "Tipo", "Embalagem", "Qtd. Contada"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [217, 119, 6] },
      styles: { cellPadding: 1, fontSize: 8 }, // Menor padding e fonte
    });

    doc.save(`Inventario_${unitName}_${formatDateBR(selectedDate).replace(/\//g, "-")}.pdf`);
  };

  const handleExportEmptyPDF = () => {
    const doc = new jsPDF();
    const unitName = STORES.find(s => s.id === activeTab)?.name || "Unidade";
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Lista de Contagem - ${unitName}`, 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Impresso em: ${formatDateTimeBR(new Date().toISOString())}`, 14, 27);

    const tableData: any[] = [];
    
    insumos.forEach((insumo) => {
      tableData.push([
        insumo.nome,
        insumo.tipo || "-",
        insumo.unidade_conversao || "-",
        "" // Empty cell for manual writing
      ]);
    });

    autoTable(doc, {
      startY: 33,
      head: [["Insumo", "Tipo", "Embalagem", "Quantidade"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [217, 119, 6] },
      styles: { cellPadding: 1, fontSize: 8 }, // Menor padding e fonte para caber mais itens
    });

    doc.save(`Lista_Contagem_${unitName}.pdf`);
  };

  return (
    <>
      <Helmet>
        <title>Inventário</title>
      </Helmet>

      {/* Modal Nova Data */}
      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", width: "400px", maxWidth: "90%", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <h2 style={{ margin: "0 0 16px 0", color: "var(--primary-color)" }}>Novo Inventário</h2>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#475569" }}>Data da Contagem</label>
              <input 
                type="date" 
                value={newDate} 
                onChange={(e) => setNewDate(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1rem" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ padding: "10px 16px", backgroundColor: "#f1f5f9", color: "#475569", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateNew}
                style={{ padding: "10px 16px", backgroundColor: "var(--primary-color)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
              >
                Iniciar Contagem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Inventários Antigos */}
      {isOldInvModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", width: "450px", maxWidth: "90%", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ margin: 0, color: "var(--primary-color)", display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsCollectionFill /> Inventários Antigos
              </h2>
              <button onClick={() => setIsOldInvModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#94a3b8" }}>&times;</button>
            </div>
            
            <p style={{ color: "var(--text-muted)", marginBottom: "16px", fontSize: "0.95rem" }}>
              Selecione uma data anterior para visualizar a contagem de estoque.
            </p>

            <div style={{ overflowY: "auto", flex: 1, paddingRight: "4px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {(availableDates.length > 3 ? availableDates.slice(0, availableDates.length - 2) : []).map(date => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setViewMode('detail');
                    setIsOldInvModalOpen(false);
                  }}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "16px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0",
                    borderRadius: "8px", cursor: "pointer", transition: "all 0.2s",
                    textAlign: "left"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#f1f5f9"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Icons.BsCalendar2Check style={{ color: "var(--primary-color)", fontSize: "1.2rem" }} />
                    <span style={{ fontWeight: "bold", color: "#334155", fontSize: "1.1rem" }}>{formatDateBR(date)}</span>
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    {inventoryCounts[date] || 0} itens
                  </div>
                </button>
              ))}
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
              {viewMode === 'detail' && (
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px",
                    backgroundColor: "#f1f5f9", color: "#475569", border: "none",
                    borderRadius: "8px", fontWeight: "bold", cursor: "pointer"
                  }}
                >
                  <Icons.BsArrowLeft /> Voltar
                </button>
              )}

              {viewMode === 'detail' && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#fff",
                  padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1"
                }}>
                  <label style={{ fontWeight: 600, color: "var(--text-muted)" }}>Inventário:</label>
                  <select 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    disabled={availableDates.length === 0}
                    style={{
                      padding: "6px 12px", border: "1px solid #e2e8f0", borderRadius: "6px",
                      outline: "none", fontWeight: 500, color: "var(--primary-color)", minWidth: "140px", backgroundColor: "#fff"
                    }}
                  >
                    {availableDates.length === 0 && <option value="">Nenhum</option>}
                    {availableDates.map(date => <option key={date} value={date}>{formatDateBR(date)}</option>)}
                  </select>
                </div>
              )}

              <button
                onClick={handleExportEmptyPDF}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px",
                  backgroundColor: "#fff", color: "#3b82f6", border: "2px solid #3b82f6",
                  borderRadius: "8px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}
              >
                <Icons.BsPrinter style={{ strokeWidth: "1" }} />
                Imprimir para Contagem
              </button>

              <button
                onClick={() => { setNewDate(getToday()); setIsModalOpen(true); }}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px",
                  backgroundColor: "#fff", color: "var(--primary-color)", border: "2px solid var(--primary-color)",
                  borderRadius: "8px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
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
          ) : viewMode === 'list' ? (
            <div>
              {availableDates.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 40px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "2px dashed #cbd5e1" }}>
                  <Icons.BsJournalText style={{ fontSize: "3.5rem", color: "#94a3b8", marginBottom: "16px" }} />
                  <h2 style={{ margin: "0 0 8px 0", color: "#475569" }}>Nenhum Inventário Localizado</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto" }}>
                    Essa unidade ainda não possui nenhuma contagem registrada no sistema. Clique no botão <b>"+ Novo Inventário"</b> acima para iniciar a primeira contagem.
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                  {availableDates.length > 3 && (
                    <div 
                      onClick={() => setIsOldInvModalOpen(true)}
                      style={{ 
                        backgroundColor: "#fff", border: "1px solid #cbd5e1", borderRadius: "12px", 
                        padding: "24px", cursor: "pointer", transition: "all 0.2s", 
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", justifyContent: "center"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)"; }}
                    >
                      <div style={{ backgroundColor: "#f1f5f9", color: "#475569", padding: "16px", borderRadius: "50%", marginBottom: "8px" }}>
                        <Icons.BsCollectionFill style={{ fontSize: "2.5rem" }} />
                      </div>
                      <h3 style={{ margin: 0, fontSize: "1.4rem", color: "var(--secondary-color)", textAlign: "center" }}>Inventários Antigos</h3>
                      <p style={{ color: "var(--text-muted)", margin: 0, textAlign: "center" }}>
                        Ver +{availableDates.length - 2} registros anteriores
                      </p>
                    </div>
                  )}

                  {(availableDates.length > 3 ? availableDates.slice(-2) : availableDates).map(date => (
                    <div 
                      key={date}
                      onClick={() => { setSelectedDate(date); setViewMode('detail'); }}
                      style={{ 
                        backgroundColor: "#fff", border: "1px solid #cbd5e1", borderRadius: "12px", 
                        padding: "24px", cursor: "pointer", transition: "all 0.2s", 
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "12px"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ backgroundColor: "#fef3c7", color: "#b45309", padding: "12px", borderRadius: "12px", display: "flex" }}>
                          <Icons.BsCalendar2CheckFill style={{ fontSize: "1.8rem" }} />
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: "1.3rem", color: "var(--secondary-color)" }}>Data do Inventário</h3>
                          <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#334155" }}>{formatDateBR(date)}</div>
                        </div>
                      </div>
                      <div style={{ borderTop: "1px solid #e2e8f0", margin: "8px 0" }}></div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "1.15rem" }}>
                            <Icons.BsBoxSeam style={{ color: "var(--primary-color)" }} /> 
                            <span><strong style={{ color: "#334155", fontSize: "1.2rem" }}>{inventoryCounts[date] || 0}</strong> insumos salvos</span>
                          </div>
                          {inventoryUsers[date] && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "1.15rem" }}>
                              <Icons.BsPerson style={{ color: "var(--primary-color)" }} /> 
                              <span>Feito por <strong style={{ color: "#334155" }}>{inventoryUsers[date]}</strong></span>
                            </div>
                          )}
                          {inventoryTimes[date] && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "1.15rem" }}>
                              <Icons.BsClock style={{ color: "var(--primary-color)" }} /> 
                              <span>Em <strong style={{ color: "#334155" }}>{formatDateTimeBR(inventoryTimes[date])}</strong></span>
                            </div>
                          )}
                        </div>
                        <div style={{ color: "var(--primary-color)", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                          Visualizar <Icons.BsArrowRight />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div 
                    onClick={() => { setNewDate(getToday()); setIsModalOpen(true); }}
                    style={{ 
                      backgroundColor: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: "12px", 
                      padding: "24px", cursor: "pointer", transition: "all 0.2s", 
                      display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", justifyContent: "center",
                      minHeight: "180px"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#f1f5f9"; e.currentTarget.style.borderColor = "var(--primary-color)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                  >
                    <Icons.BsPlusCircle style={{ fontSize: "3rem", color: "#94a3b8" }} />
                    <h3 style={{ margin: 0, fontSize: "1.4rem", color: "#64748b" }}>Iniciar Novo Inventário</h3>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {isAlreadySaved && isAdmin && !editMode && (
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginBottom: "16px" }}>
                  <button
                    onClick={handleExportPDF}
                    style={{ padding: "8px 16px", backgroundColor: "#3b82f6", color: "#fff", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                  >
                    <Icons.BsPrinter /> Imprimir PDF
                  </button>
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
                <table className="freq-table" style={{ minWidth: "700px", maxWidth: "900px", margin: "0 auto" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "40%" }}>Insumo</th>
                      <th style={{ textAlign: "center", width: "15%" }}>Tipo</th>
                      <th style={{ textAlign: "center", width: "20%" }}>Embalagem</th>
                      <th style={{ textAlign: "center", width: "25%" }}>Quantidade Contada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insumos.map((insumo) => (
                      <tr key={insumo.id} style={{ transition: "background 0.2s" }}>
                        <td style={{ fontWeight: 500 }}>{insumo.nome}</td>
                        <td style={{ textAlign: "center", color: "#64748b" }}>{insumo.tipo || "-"}</td>
                        <td style={{ textAlign: "center", color: "#64748b" }}>{insumo.unidade_conversao || "-"}</td>
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
