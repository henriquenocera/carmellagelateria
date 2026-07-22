import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Navigate } from "react-router-dom";
import "../css/Frequencia.css";

function OrdemProducao() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const getTodayStr = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [isOldInvModalOpen, setIsOldInvModalOpen] = useState(false);
  const [ordemCounts, setOrdemCounts] = useState<Record<string, number>>({});
  const [ordemProducedCounts, setOrdemProducedCounts] = useState<Record<string, number>>({});
  const [ordemUsers, setOrdemUsers] = useState<Record<string, string>>({});
  const [ordemTimes, setOrdemTimes] = useState<Record<string, string>>({});
  
  const [produtos, setProdutos] = useState<any[]>([]);
  const [ordemItems, setOrdemItems] = useState<any[]>([]);
  const [estoqueFabrica, setEstoqueFabrica] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);
  const [recentlySavedId, setRecentlySavedId] = useState<string | null>(null);
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const [editMode, setEditMode] = useState(false);
  
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newOrderDate, setNewOrderDate] = useState("");

  const [selectedProdutoId, setSelectedProdutoId] = useState("");
  const [quantidadeInput, setQuantidadeInput] = useState("");
  
  const [toasts, setToasts] = useState<{id: number, title: string, desc: string}[]>([]);

  const showToast = (title: string, desc: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, desc }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await fetchProdutos();
      await fetchDates();
      await fetchEstoqueFabrica();
    }
    loadData();
  }, []);

  useEffect(() => {
    setEditMode(false);
    if (selectedDate) {
      fetchOrdemForDate();
    } else {
      setOrdemItems([]);
      setLoading(false);
    }
  }, [selectedDate]);

  async function fetchProdutos() {
    try {
      const { data, error } = await supabase
        .from("cadastro_produtos")
        .select(`
          id, nome, categoria, unidade_venda, codigo, is_sabor,
          ficha_tecnica!ficha_tecnica_produto_id_fkey (
            quantidade,
            insumo_id,
            produto_base_id,
            cadastro_insumos (
              nome,
              nome_simples_unitario,
              unidade_conversao,
              unidade_consumo,
              quantidade_conversao
            )
          )
        `)
        .eq("ativo", true)
        .order("nome", { ascending: true });

      if (error) throw error;
      setProdutos(data || []);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  }

  async function fetchEstoqueFabrica() {
    try {
      const today = getTodayStr();
      const unitName = "Fábrica";

      const { data: invData } = await supabase
        .from("inventario_insumos")
        .select("insumo_id, data_inventario, quantidade")
        .eq("unidade", unitName)
        .lte("data_inventario", today);

      const latestInv: Record<string, { data: string, quantidade: number }> = {};
      (invData || []).forEach((inv: any) => {
        if (!latestInv[inv.insumo_id] || inv.data_inventario > latestInv[inv.insumo_id].data) {
          latestInv[inv.insumo_id] = { data: inv.data_inventario, quantidade: Number(inv.quantidade) };
        }
      });

      const { data: movData } = await supabase
        .from("movimentacoes_estoque")
        .select("insumo_id, data_movimentacao, quantidade, origem, destino")
        .or(`origem.eq.${unitName},destino.eq.${unitName}`)
        .lte("data_movimentacao", today);

      const calculatedStock: Record<string, number> = {};

      Object.keys(latestInv).forEach(insumoId => {
        calculatedStock[insumoId] = latestInv[insumoId].quantidade;
      });

      (movData || []).forEach((mov: any) => {
        const inv = latestInv[mov.insumo_id];
        if (inv && mov.data_movimentacao < inv.data) return;

        if (calculatedStock[mov.insumo_id] === undefined) {
          calculatedStock[mov.insumo_id] = 0;
        }
        
        if (mov.destino === unitName) {
          calculatedStock[mov.insumo_id] += Number(mov.quantidade);
        }
        if (mov.origem === unitName) {
          calculatedStock[mov.insumo_id] -= Number(mov.quantidade);
        }
      });

      setEstoqueFabrica(calculatedStock);
    } catch (err) {
      console.error("Erro ao buscar estoque da fábrica:", err);
    }
  }

  async function fetchDates() {
    try {
      const { data, error } = await supabase
        .from("ordem_producao")
        .select(`
          data_ordem,
          data_producao,
          peso_bruto,
          tara,
          updated_at,
          profiles (name)
        `);

      if (error) {
        console.warn("Tabela ordem_producao não encontrada ou erro. Mockando dados vazios.");
        setAvailableDates([]);
        setLoading(false);
        return;
      }
      
      const counts: Record<string, number> = {};
      const producedCounts: Record<string, number> = {};
      const users: Record<string, string> = {};
      const times: Record<string, string> = {};
      
      (data || []).forEach((d: any) => {
        counts[d.data_ordem] = (counts[d.data_ordem] || 0) + 1;
        if (d.data_producao && d.peso_bruto !== null && d.tara !== null) {
          producedCounts[d.data_ordem] = (producedCounts[d.data_ordem] || 0) + 1;
        }
        if (d.profiles?.name) {
          users[d.data_ordem] = d.profiles.name;
        }
        if (d.updated_at) {
          if (!times[d.data_ordem] || new Date(d.updated_at) > new Date(times[d.data_ordem])) {
            times[d.data_ordem] = d.updated_at;
          }
        }
      });
      setOrdemCounts(counts);
      setOrdemProducedCounts(producedCounts);
      setOrdemUsers(users);
      setOrdemTimes(times);

      const uniqueDates = Object.keys(counts).sort((a, b) => a.localeCompare(b));
      setAvailableDates(uniqueDates);
      
      setSelectedDate(""); 
      setViewMode('list');
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar datas de ordem de produção:", err);
      setLoading(false);
    }
  }

  async function fetchOrdemForDate() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("ordem_producao")
        .select("id, produto_id, quantidade, data_producao, peso_bruto, tara, codigo")
        .eq("data_ordem", selectedDate);

      if (error) {
        console.warn("Erro ao buscar ordem ou tabela inexistente.");
        setOrdemItems([]);
        setIsAlreadySaved(false);
        setLoading(false);
        return;
      }

      const items = (data || []).map((item: any) => ({
        db_id: item.id,
        id: item.id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        data_producao: item.data_producao || "",
        peso_bruto: item.peso_bruto !== null && item.peso_bruto !== undefined ? item.peso_bruto.toString() : "",
        tara: item.tara !== null && item.tara !== undefined ? item.tara.toString() : "",
        codigo: item.codigo || "",
        saved_as_complete: !!(item.data_producao && item.peso_bruto !== null && item.tara !== null)
      }));
      setOrdemItems(items);
      setIsAlreadySaved((data || []).length > 0);
    } catch (err) {
      console.error("Erro ao carregar dados da data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddProduto = () => {
    if (!selectedProdutoId || !quantidadeInput) return;
    const qtd = parseInt(quantidadeInput, 10);
    if (isNaN(qtd) || qtd <= 0) return;

    setOrdemItems(prev => {
      const newItems = [...prev];
      for (let i = 0; i < qtd; i++) {
        newItems.push({
          id: crypto.randomUUID(),
          produto_id: selectedProdutoId,
          quantidade: 1,
          data_producao: "",
          peso_bruto: "",
          tara: "",
          codigo: "",
          saved_as_complete: false
        });
      }
      return newItems;
    });
    setSelectedProdutoId("");
    setQuantidadeInput("");
  };

  const handleRowChange = (id: string, field: string, value: string, renderCode?: string) => {
    setOrdemItems(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, [field]: value } : item);
      
      if (isAlreadySaved && !editMode) {
        const itemToUpdate = updated.find(i => i.id === id);
        if (itemToUpdate && itemToUpdate.db_id) {
          const timerKey = `${id}-${field}`;
          if (debounceTimers.current[timerKey]) clearTimeout(debounceTimers.current[timerKey]);
          
          const currentCode = renderCode || getGeneratedCodes()[id];

          debounceTimers.current[timerKey] = setTimeout(() => {
            handleQuickUpdate(itemToUpdate, field, value, currentCode);
          }, 2500);
        }
      }
      return updated;
    });
  };

  const handleQuickUpdate = async (item: any, field: string, value: string, code: string) => {
    try {
      const updatedItem = { ...item, [field]: value };
      const pb = updatedItem.peso_bruto !== "" ? parseFloat(updatedItem.peso_bruto) : null;
      const t = updatedItem.tara !== "" ? parseFloat(updatedItem.tara) : null;
      
      const prod = produtos.find(p => p.id === item.produto_id);
      const addDays = (date: Date, days: number) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      };
      
      const val = updatedItem.data_producao && prod?.validade_dias 
        ? addDays(new Date(updatedItem.data_producao + "T12:00:00"), prod.validade_dias).toISOString().split('T')[0] 
        : null;

      const { error } = await supabase
        .from("ordem_producao")
        .update({ 
            [field]: value === "" ? null : (field === 'peso_bruto' || field === 'tara' ? parseFloat(value) : value),
            codigo: code
        })
        .eq("id", item.db_id);
      
      if (error) throw error;

      if (updatedItem.data_producao && pb !== null && t !== null) {
        const pl = parseFloat((pb - t).toFixed(2));
        
        const { data: existingProd } = await supabase
          .from("producao_realizada")
          .select("id")
          .eq("codigo", code)
          .limit(1);

        if (existingProd && existingProd.length > 0) {
           await supabase.from("producao_realizada").update({
             data_producao: updatedItem.data_producao,
             peso_bruto: pb,
             tara: t,
             peso_liquido: pl,
             validade: val,
             user_id: user?.id
           }).eq("id", existingProd[0].id);
           setOrdemItems(prev => prev.map(i => i.id === item.id ? { ...i, saved_as_complete: true, codigo: code } : i));
           showToast("Atualizado na Produção", "Alteração refletida em Produções Realizadas.");
        } else {
           await supabase.from("producao_realizada").insert([{
             produto_id: item.produto_id,
             codigo: code,
             data_producao: updatedItem.data_producao,
             peso_bruto: pb,
             tara: t,
             peso_liquido: pl,
             validade: val,
             user_id: user?.id
           }]);
           setOrdemItems(prev => prev.map(i => i.id === item.id ? { ...i, saved_as_complete: true, codigo: code } : i));
           showToast("Lançado com Sucesso!", "Cópia gerada em Produções Realizadas.");
        }
      } else {
        setOrdemItems(prev => prev.map(i => i.id === item.id ? { ...i, saved_as_complete: false } : i));
      }
    } catch (err) {
      console.error("Erro no quick update:", err);
      showToast("Erro ao Salvar", "Ocorreu um problema ao comunicar com o banco de dados.");
    }
  };

  const handleRemoveProduto = (id: string) => {
    setOrdemItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveAll = async () => {
    try {
      if (!selectedDate) {
        alert("Nenhuma data selecionada!");
        return;
      }

      setIsSavingAll(true);
      const toUpsert: any[] = [];
      const codes = getGeneratedCodes();
      
      ordemItems.forEach(item => {
        const floatValue = parseFloat(item.quantidade);
        if (!isNaN(floatValue)) {
          const rowData: any = {
            id: item.db_id || item.id,
            produto_id: item.produto_id,
            data_ordem: selectedDate,
            quantidade: floatValue,
            user_id: user?.id,
            updated_at: new Date().toISOString(),
            data_producao: item.data_producao || null,
            peso_bruto: item.peso_bruto !== "" && item.peso_bruto != null ? parseFloat(item.peso_bruto) : null,
            tara: item.tara !== "" && item.tara != null ? parseFloat(item.tara) : null,
            codigo: item.codigo || codes[item.id] || null
          };
          toUpsert.push(rowData);
        }
      });

      const checkError = await supabase.from("ordem_producao").select("id").limit(1);
      if (checkError.error && checkError.error.code === '42P01') {
          alert("Simulação de salvamento bem-sucedida! (A tabela 'ordem_producao' não existe no banco).");
          setIsAlreadySaved(true);
          setEditMode(false);
          setViewMode('list');
          setIsSavingAll(false);
          return;
      }

      const existingIds = toUpsert.filter(i => i.id).map(i => i.id);
      let deleteQuery = supabase.from("ordem_producao").delete().eq("data_ordem", selectedDate);
      if (existingIds.length > 0) {
        deleteQuery = deleteQuery.not("id", "in", `(${existingIds.join(',')})`);
      }
      
      const { error: deleteError } = await deleteQuery;
      if (deleteError && deleteError.code !== 'PGRST116' && deleteError.code !== '42P01') {
         console.error("Erro ao deletar antigas:", deleteError);
      }

      if (toUpsert.length > 0) {
        const { error } = await supabase.from("ordem_producao").upsert(toUpsert);
        if (error) throw error;
      }

      setIsAlreadySaved(true);
      setEditMode(false);
      setOrdemItems(prev => prev.map(item => ({ ...item, db_id: item.db_id || item.id })));
      showToast("Ordem de Produção Salva!", "Todos os itens foram atualizados no banco de dados.");
      await fetchDates();
      setViewMode('list');
    } catch (err: any) {
      console.error("Erro ao salvar ordem inteira:", err);
      alert("Erro ao salvar ordem de produção no banco: " + (err.message));
      setEditMode(true);
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleCreateNew = () => {
    setNewOrderDate(getTodayStr());
    setIsNewOrderModalOpen(true);
  };

  const confirmNewOrder = () => {
    if (!newOrderDate) return;
    
    setIsNewOrderModalOpen(false);
    setSelectedDate(newOrderDate);
    setViewMode('detail');
    
    if (availableDates.includes(newOrderDate)) {
      setEditMode(true);
    } else {
      setOrdemItems([]);
      setEditMode(true);
      setIsAlreadySaved(false);
    }
  };

  const handleDeleteOrdem = async () => {
    if (!window.confirm(`Tem certeza que deseja DELETAR a ordem do dia ${formatDateBR(selectedDate)}?`)) {
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase
        .from("ordem_producao")
        .delete()
        .eq("data_ordem", selectedDate);

      if (error && error.code !== '42P01') throw error;
      
      alert("Ordem de Produção deletada (ou simulada como deletada) com sucesso!");
      
      const remaining = availableDates.filter(d => d !== selectedDate);
      setAvailableDates(remaining);
      
      setSelectedDate("");
      setViewMode('list');
      
    } catch (err: any) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar ordem.");
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = isAlreadySaved && !editMode;



  const formatDateBR = (isoStr: string) => {
    if (!isoStr) return "";
    const [y, m, d] = isoStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const getWeekOfMonthString = (isoStr: string) => {
    if (!isoStr) return "";
    const [y, m, d] = isoStr.split("-").map(Number);
    const weekNumber = Math.ceil(d / 7);
    
    const date = new Date(isoStr + "T00:00:00");
    const monthName = date.toLocaleDateString('pt-BR', { month: 'long' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    
    return `${weekNumber}ª Semana de ${capitalizedMonth}`;
  };

  const formatDateTimeBR = (isoStr: string) => {
    if (!isoStr) return "";
    const date = new Date(isoStr);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  const getGeneratedCodes = () => {
    const productCodes: Record<string, string> = {};
    const baseCodeTotals: Record<string, number> = {};
    const itemBaseCodes: Record<string, string> = {};

    // 1. Calculate base codes for ALL items
    ordemItems.forEach(item => {
      const prod = produtos.find(p => p.id === item.produto_id);
      const prodCodigo = prod?.codigo || "ND";
      
      let ddMMyy = "";
      const dateToUse = selectedDate;
      if (dateToUse) {
        const parts = dateToUse.split('-');
        if (parts.length === 3) {
          ddMMyy = `${parts[2]}${parts[1]}${parts[0].substring(2)}`;
        }
      }
      
      const baseCode = `${prodCodigo}${ddMMyy}`;
      itemBaseCodes[item.id] = baseCode;
      baseCodeTotals[baseCode] = (baseCodeTotals[baseCode] || 0) + 1;
    });

    // 2. Find max suffixes from items that ALREADY have a valid DB codigo
    const maxSuffixes: Record<string, number> = {};
    ordemItems.forEach(item => {
      if (item.codigo) {
        const baseCode = itemBaseCodes[item.id];
        if (item.codigo.startsWith(baseCode)) {
          const dashIndex = item.codigo.lastIndexOf('-');
          if (dashIndex > 0) {
            const suffix = parseInt(item.codigo.substring(dashIndex + 1), 10);
            if (!isNaN(suffix)) {
              maxSuffixes[baseCode] = Math.max(maxSuffixes[baseCode] || 0, suffix);
            }
          }
        }
      }
    });

    // 3. Assign codes
    ordemItems.forEach(item => {
      const baseCode = itemBaseCodes[item.id];

      // Use DB code if it exists and still matches the date prefix
      if (item.codigo && item.codigo.startsWith(baseCode)) {
        productCodes[item.id] = item.codigo;
        return;
      }

      // Generate a new code
      if (baseCodeTotals[baseCode] > 1 || (maxSuffixes[baseCode] && maxSuffixes[baseCode] > 0)) {
        const nextSuffix = (maxSuffixes[baseCode] || 0) + 1;
        maxSuffixes[baseCode] = nextSuffix;
        productCodes[item.id] = `${baseCode}-${nextSuffix}`;
      } else {
        productCodes[item.id] = baseCode;
      }
    });
    
    return productCodes;
  };

  const calculateRequiredInsumos = () => {
    const aggregation: Record<string, { id: string; nome: string; unidade: string; quantidade: number; quantidade_conversao?: number }> = {};

    const addInsumosFromFicha = (ficha: any[], multiplier: number) => {
      if (!ficha) return;
      ficha.forEach(item => {
        if (item.insumo_id && item.cadastro_insumos) {
          const key = item.insumo_id;
          const qty = parseFloat(item.quantidade) * multiplier;
          if (!aggregation[key]) {
            aggregation[key] = {
              id: item.insumo_id,
              nome: item.cadastro_insumos.nome_simples_unitario || item.cadastro_insumos.nome || "Desconhecido",
              unidade: item.cadastro_insumos.unidade_consumo || item.cadastro_insumos.unidade_conversao || "un",
              quantidade: 0,
              quantidade_conversao: item.cadastro_insumos.quantidade_conversao
            };
          }
          aggregation[key].quantidade += qty;
        } else if (item.produto_base_id) {
          const baseProd = produtos.find(p => p.id === item.produto_base_id);
          if (baseProd && baseProd.ficha_tecnica) {
            addInsumosFromFicha(baseProd.ficha_tecnica, multiplier * parseFloat(item.quantidade));
          }
        }
      });
    };

    ordemItems.forEach(ordemItem => {
      const prod = produtos.find(p => p.id === ordemItem.produto_id);
      if (prod && prod.ficha_tecnica) {
        const multiplier = parseFloat(ordemItem.quantidade) || 0;
        if (multiplier > 0) {
          addInsumosFromFicha(prod.ficha_tecnica, multiplier);
        }
      }
    });

    return Object.values(aggregation).sort((a, b) => a.nome.localeCompare(b.nome));
  };

  const handleExportEmptyPDF = () => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Lista de Ordem de Produção`, 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Impresso em: ${formatDateTimeBR(new Date().toISOString())}`, 14, 27);

    const tableData: any[] = [];
    const generatedCodes = getGeneratedCodes();
    
    ordemItems.forEach((item) => {
      const prod = produtos.find(p => p.id === item.produto_id);
      tableData.push([
        generatedCodes[item.id] || "-",
        prod?.codigo || "-",
        prod ? prod.nome : "-",
        item.data_producao ? formatDateBR(item.data_producao) : "-",
        item.peso_bruto || "-",
        item.tara || "-"
      ]);
    });

    (doc as any).autoTable({
      startY: 20,
      head: [["Cód Produção", "Cód Produto", "Sabor", "Data Produção", "Peso Bruto", "Tara"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { cellPadding: 1, fontSize: 8 }, 
    });

    doc.save(`Ordem_Producao_Branco.pdf`);
  };

  if (authLoading) return null;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Ordem de Produção</title>
      </Helmet>

      {isOldInvModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", width: "450px", maxWidth: "90%", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ margin: 0, color: "var(--primary-color)", display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsCollectionFill /> Ordens Antigas
              </h2>
              <button onClick={() => setIsOldInvModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#94a3b8" }}>&times;</button>
            </div>
            
            <p style={{ color: "var(--text-muted)", marginBottom: "16px", fontSize: "0.95rem" }}>
              Selecione uma data anterior para visualizar a ordem de produção.
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
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Icons.BsCalendar2Check style={{ color: "var(--primary-color)", fontSize: "1.2rem" }} />
                    <span style={{ fontWeight: "bold", color: "#334155", fontSize: "1.1rem" }}>{formatDateBR(date)}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#16a34a", fontSize: "1rem", fontWeight: "bold" }}>
                      {ordemProducedCounts[date] || 0} / {ordemCounts[date] || 0}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase" }}>
                      Produzidos
                    </div>
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
            <h1>Ordem de Produção</h1>
            <p>Cadastre e gerencie as ordens de produção dos produtos finais.</p>
          </div>
        </div>

        <div style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          
          <div style={{ 
            display: "flex", 
            justifyContent: (viewMode === 'detail' && !isAlreadySaved) ? "space-between" : "flex-end", 
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "24px" 
          }}>

            {viewMode === 'detail' && !isAlreadySaved && (
              <h2 style={{ margin: 0, color: "var(--primary-color)", fontSize: "2.2rem", fontWeight: "bold" }}>
                Nova Ordem de Produção
              </h2>
            )}

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
                  <label style={{ fontWeight: 600, color: "var(--text-muted)" }}>Data:</label>
                  {!isAlreadySaved ? (
                    <input 
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{
                        padding: "6px 12px", border: "1px solid #e2e8f0", borderRadius: "6px",
                        outline: "none", fontWeight: 500, color: "var(--primary-color)", backgroundColor: "#fff"
                      }}
                    />
                  ) : (
                    <select 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      disabled={availableDates.length === 0 || editMode}
                      style={{
                        padding: "6px 12px", border: "1px solid #e2e8f0", borderRadius: "6px",
                        outline: "none", fontWeight: 500, color: "var(--primary-color)", minWidth: "140px", backgroundColor: editMode ? "#f1f5f9" : "#fff"
                      }}
                    >
                      {availableDates.length === 0 && <option value={selectedDate}>{formatDateBR(selectedDate)}</option>}
                      {availableDates.map(date => <option key={date} value={date}>{formatDateBR(date)}</option>)}
                    </select>
                  )}
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
                Imprimir em Branco
              </button>

              <button
                onClick={handleCreateNew}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px",
                  backgroundColor: "#fff", color: "var(--primary-color)", border: "2px solid var(--primary-color)",
                  borderRadius: "8px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}
              >
                <Icons.BsPlus style={{ strokeWidth: "1", fontSize: "1.2rem" }} />
                Nova Ordem de Produção
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : produtos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
              <Icons.BsBoxSeam style={{ fontSize: "3rem", color: "#cbd5e1", marginBottom: "16px" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", margin: 0 }}>
                Nenhum produto cadastrado para criar ordens.
              </p>
            </div>
          ) : viewMode === 'list' ? (
            <div>
              {availableDates.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 40px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "2px dashed #cbd5e1" }}>
                  <Icons.BsJournalText style={{ fontSize: "3.5rem", color: "#94a3b8", marginBottom: "16px" }} />
                  <h2 style={{ margin: "0 0 8px 0", color: "#475569" }}>Nenhuma Ordem Localizada</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto" }}>
                    Não há ordens de produção registradas no sistema. Clique no botão <b>"+ Nova Ordem"</b> acima para iniciar.
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
                    >
                      <div style={{ backgroundColor: "#f1f5f9", color: "#475569", padding: "16px", borderRadius: "50%", marginBottom: "8px" }}>
                        <Icons.BsCollectionFill style={{ fontSize: "2.5rem" }} />
                      </div>
                      <h3 style={{ margin: 0, fontSize: "1.4rem", color: "var(--secondary-color)", textAlign: "center" }}>Ordens Antigas</h3>
                      <p style={{ color: "var(--text-muted)", margin: 0, textAlign: "center" }}>
                        Ver +{availableDates.length - 2} registros
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
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ backgroundColor: "#dbeafe", color: "#1d4ed8", padding: "12px", borderRadius: "12px", display: "flex" }}>
                          <Icons.BsGearWideConnected style={{ fontSize: "1.8rem" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: 0, fontSize: "1.3rem", color: "var(--secondary-color)" }}>{getWeekOfMonthString(date)}</h3>
                          <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#334155", marginTop: "4px" }}>{formatDateBR(date)}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ backgroundColor: "#f0fdf4", padding: "6px 12px", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                            <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#16a34a", textAlign: "center" }}>
                              {ordemProducedCounts[date] || 0} / {ordemCounts[date] || 0}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#15803d", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "2px", fontWeight: "bold" }}>
                              Produzidos
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ borderTop: "1px solid #e2e8f0", margin: "8px 0" }}></div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "1.15rem" }}>
                            <Icons.BsBoxSeam style={{ color: "var(--primary-color)" }} /> 
                            <span><strong style={{ color: "#334155", fontSize: "1.2rem" }}>{ordemCounts[date] || 0}</strong> produtos</span>
                          </div>
                          {ordemUsers[date] && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "1.15rem" }}>
                              <Icons.BsPerson style={{ color: "var(--primary-color)" }} /> 
                              <span>Feito por <strong style={{ color: "#334155" }}>{ordemUsers[date]}</strong></span>
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
                    onClick={handleCreateNew}
                    style={{ 
                      backgroundColor: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: "12px", 
                      padding: "24px", cursor: "pointer", transition: "all 0.2s", 
                      display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", justifyContent: "center",
                      minHeight: "180px"
                    }}
                  >
                    <Icons.BsPlusCircle style={{ fontSize: "3rem", color: "#94a3b8" }} />
                    <h3 style={{ margin: 0, fontSize: "1.4rem", color: "#64748b" }}>Iniciar Nova Ordem</h3>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginBottom: "16px" }}>
                {isAlreadySaved && isAdmin && !editMode && (
                  <>
                    <button
                      onClick={() => setEditMode(true)}
                      style={{ padding: "8px 16px", backgroundColor: "#f59e0b", color: "#fff", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                    >
                      <Icons.BsPencil /> Editar Ordem
                    </button>
                    <button
                      onClick={handleDeleteOrdem}
                      style={{ padding: "8px 16px", backgroundColor: "#ef4444", color: "#fff", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                    >
                      <Icons.BsTrash /> Deletar Ordem
                    </button>
                  </>
                )}
              </div>
              
              {editMode && (
                <div style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #fde68a" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icons.BsExclamationTriangleFill /> 
                    <span><strong>Modo de Edição Ativo:</strong> Você está alterando uma ordem do passado.</span>
                  </span>
                  <button onClick={() => setEditMode(false)} style={{ background: "none", border: "none", color: "#92400e", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }}>Cancelar Edição</button>
                </div>
              )}

              {(!isReadOnly) && (
                <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", marginBottom: "24px", border: "1px solid #cbd5e1", display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 300px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#475569", fontSize: "1.1rem" }}>Selecionar Sabor</label>
                    <select 
                      value={selectedProdutoId} 
                      onChange={(e) => setSelectedProdutoId(e.target.value)}
                      style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1.2rem" }}
                    >
                      <option value="">-- Escolha um sabor --</option>
                      {produtos.filter(p => p.is_sabor).map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: "0 1 150px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#475569", fontSize: "1.1rem" }}>Quantidade</label>
                    <input 
                      type="number" 
                      step="1"
                      min="1"
                      className="no-spinner"
                      value={quantidadeInput} 
                      onChange={(e) => setQuantidadeInput(e.target.value)}
                      style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1.2rem" }}
                      placeholder="Ex: 3"
                    />
                  </div>
                  <button 
                    onClick={handleAddProduto}
                    disabled={!selectedProdutoId || !quantidadeInput}
                    style={{ padding: "12px 24px", backgroundColor: "var(--primary-color)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: (!selectedProdutoId || !quantidadeInput) ? "not-allowed" : "pointer", opacity: (!selectedProdutoId || !quantidadeInput) ? 0.6 : 1, display: "flex", alignItems: "center", gap: "8px", height: "50px", fontSize: "1.2rem" }}
                  >
                    <Icons.BsPlus style={{ fontSize: "1.4rem" }} /> Adicionar
                  </button>
                </div>
              )}

              <div className="freq-table-wrapper" style={{ overflowX: "auto", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                <table className="freq-table" style={{ minWidth: "1100px", margin: "0 auto" }}>
                  <thead>
                    <tr style={{ fontSize: "1.25rem" }}>
                      <th style={{ textAlign: "center", width: "15%", padding: "10px" }}>Cód Produção</th>
                      <th style={{ textAlign: "center", width: "10%", padding: "10px" }}>Cód Produto</th>
                      <th style={{ width: "20%", padding: "10px" }}>Sabor</th>
                      <th style={{ textAlign: "center", width: "20%", padding: "10px" }}>Data Produção</th>
                      <th style={{ textAlign: "center", width: "10%", padding: "10px" }}>Peso Bruto</th>
                      <th style={{ textAlign: "center", width: "10%", padding: "10px" }}>Tara</th>
                      {!isReadOnly && <th style={{ textAlign: "center", width: "15%", padding: "10px" }}>Ações</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {ordemItems.length === 0 ? (
                      <tr>
                        <td colSpan={isReadOnly ? 6 : 7} style={{ textAlign: "center", padding: "30px", color: "#94a3b8", fontSize: "1.3rem" }}>
                          Nenhum sabor inserido nesta ordem.
                        </td>
                      </tr>
                    ) : (
                      (() => {
                        const isComplete = (item: any) => item.saved_as_complete;
                        const itemsFaltando = ordemItems.filter(item => !isComplete(item));
                        const itemsProduzidos = ordemItems.filter(item => isComplete(item));
                        
                        const renderRow = (item: any) => {
                          const prod = produtos.find(p => p.id === item.produto_id);
                          const code = getGeneratedCodes()[item.id] || "-";
                          return (
                            <tr key={item.id} style={{ transition: "background 0.2s", fontSize: "1.35rem" }}>
                              <td style={{ textAlign: "center", fontWeight: "bold", padding: "6px" }}>{code}</td>
                              <td style={{ textAlign: "center", padding: "6px" }}>{prod?.codigo || "-"}</td>
                              <td style={{ fontWeight: 500, padding: "6px" }}>{prod ? prod.nome : "-"}</td>
                              <td style={{ textAlign: "center", padding: "6px" }}>
                                  <input 
                                    type="date"
                                    value={item.data_producao || ""}
                                    onChange={(e) => handleRowChange(item.id, 'data_producao', e.target.value, code)}
                                    disabled={!item.db_id}
                                    className={isReadOnly && item.data_producao ? "invisible-input" : ""}
                                    style={{ 
                                      width: "90%", padding: "4px", borderRadius: "6px", border: "1px solid #cbd5e1", 
                                      backgroundColor: (!item.db_id || (isReadOnly && !item.data_producao)) ? "#f1f5f9" : "#fff", 
                                      color: !item.db_id ? "#94a3b8" : "inherit", 
                                      cursor: !item.db_id ? "not-allowed" : "auto",
                                      fontWeight: "inherit", fontSize: "1.35rem" 
                                    }}
                                  />
                              </td>
                              <td style={{ textAlign: "center", padding: "6px" }}>
                                  <input 
                                    type="number" step="0.001"
                                    value={item.peso_bruto || ""}
                                    onChange={(e) => handleRowChange(item.id, 'peso_bruto', e.target.value, code)}
                                    disabled={!item.db_id}
                                    className={`no-spinner ${isReadOnly && item.peso_bruto ? "invisible-input" : ""}`}
                                    style={{ 
                                      width: "100px", padding: "4px", borderRadius: "6px", border: "1px solid #cbd5e1", 
                                      backgroundColor: (!item.db_id || (isReadOnly && !item.peso_bruto)) ? "#f1f5f9" : "#fff", 
                                      color: !item.db_id ? "#94a3b8" : "inherit", 
                                      cursor: !item.db_id ? "not-allowed" : "auto",
                                      fontWeight: "inherit", fontSize: "1.35rem" 
                                    }}
                                  />
                              </td>
                              <td style={{ textAlign: "center", padding: "6px" }}>
                                  <input 
                                    type="number" step="0.001"
                                    value={item.tara || ""}
                                    onChange={(e) => handleRowChange(item.id, 'tara', e.target.value, code)}
                                    disabled={!item.db_id}
                                    className={`no-spinner ${isReadOnly && item.tara ? "invisible-input" : ""}`}
                                    style={{ 
                                      width: "100px", padding: "4px", borderRadius: "6px", border: "1px solid #cbd5e1", 
                                      backgroundColor: (!item.db_id || (isReadOnly && !item.tara)) ? "#f1f5f9" : "#fff", 
                                      color: !item.db_id ? "#94a3b8" : "inherit", 
                                      cursor: !item.db_id ? "not-allowed" : "auto",
                                      fontWeight: "inherit", fontSize: "1.35rem" 
                                    }}
                                  />
                              </td>
                              {!isReadOnly && (
                                <td style={{ textAlign: "center", padding: "6px" }}>
                                  <button onClick={() => handleRemoveProduto(item.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.1rem" }} title="Remover Sabor">
                                    <Icons.BsTrash />
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        };

                        return (
                          <>
                            {itemsFaltando.length > 0 && (
                              <>
                                <tr style={{ backgroundColor: "#f8fafc" }}>
                                  <td colSpan={isReadOnly ? 6 : 7} style={{ padding: "12px 24px", fontWeight: "bold", color: "#64748b", fontSize: "1.2rem", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
                                    ⏳ Falta Produzir ({itemsFaltando.length})
                                  </td>
                                </tr>
                                {itemsFaltando.map(renderRow)}
                              </>
                            )}
                            {itemsProduzidos.length > 0 && (
                              <>
                                <tr style={{ backgroundColor: "#f0fdf4" }}>
                                  <td colSpan={isReadOnly ? 6 : 7} style={{ padding: "12px 24px", fontWeight: "bold", color: "#16a34a", fontSize: "1.2rem", textAlign: "left", borderBottom: "2px solid #bbf7d0", borderTop: itemsFaltando.length > 0 ? "2px solid #e2e8f0" : "none" }}>
                                    ✅ Já Produzidos ({itemsProduzidos.length})
                                  </td>
                                </tr>
                                {itemsProduzidos.map(renderRow)}
                              </>
                            )}
                          </>
                        );
                      })()
                    )}
                  </tbody>
                </table>
              </div>

              {(() => {
                const insumos = calculateRequiredInsumos();
                if (insumos.length === 0) return null;
                return (
                  <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '24px', marginTop: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '1.4rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icons.BsBoxSeam style={{ color: "var(--primary-color)" }} /> Lista de Separação (Insumos Necessários)
                    </h3>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: '#475569', fontSize: '1.2rem' }}>Insumo</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', color: '#475569', fontSize: '1.2rem' }}>Estoque Atual (Fábrica)</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', color: '#475569', fontSize: '1.2rem' }}>Quantidade Necessária</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 'bold', color: '#475569', fontSize: '1.2rem' }}>Saldo Final</th>
                          </tr>
                        </thead>
                        <tbody>
                          {insumos.map((ins, idx) => {
                            const rawStock = estoqueFabrica[ins.id] || 0;
                            const mult = ins.quantidade_conversao && Number(ins.quantidade_conversao) > 0 ? Number(ins.quantidade_conversao) : 1;
                            const stock = rawStock * mult;
                            const saldo = stock - ins.quantidade;
                            return (
                            <tr key={idx} style={{ borderBottom: idx === insumos.length - 1 ? 'none' : '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                              <td style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 500, fontSize: '1.25rem' }}>{ins.nome}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'center', color: '#64748b', fontWeight: 'bold', fontSize: '1.25rem' }}>
                                {stock.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 4 })} <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>{ins.unidade}</span>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'center', color: '#16a34a', fontWeight: 'bold', fontSize: '1.35rem' }}>
                                {ins.quantidade.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 4 })} <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>{ins.unidade}</span>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right', color: saldo < 0 ? '#dc2626' : '#334155', fontWeight: 'bold', fontSize: '1.35rem' }}>
                                {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 4 })} <span style={{ fontSize: '0.9em', fontWeight: 'normal' }}>{ins.unidade}</span>
                              </td>
                            </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
              
              {(!isAlreadySaved || editMode) && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                  <button
                    onClick={handleSaveAll}
                    disabled={isSavingAll}
                    style={{
                      padding: "14px 32px",
                      backgroundColor: "var(--primary-color)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      cursor: isSavingAll ? "not-allowed" : "pointer",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => { if(!isSavingAll) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)"; } }}
                    onMouseOut={(e) => { if(!isSavingAll) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)"; } }}
                  >
                    {isSavingAll ? (
                      <>
                        <Icons.BsArrowClockwise className="spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Icons.BsCheck style={{ strokeWidth: "1", fontSize: "1.4rem" }} />
                        Salvar Ordem de Produção
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    
      {/* Toast Notification Stack */}
      <div style={{
        position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)",
        zIndex: 9999, display: "flex", flexDirection: "column-reverse", gap: "12px", alignItems: "center"
      }}>
        <style>
          {`
            @keyframes slideUpToast {
              from { transform: translateY(100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}
        </style>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            backgroundColor: "#334155", color: "#fff", padding: "18px 26px", borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: "16px",
            animation: "slideUpToast 0.3s ease-out forwards", minWidth: "320px"
          }}>
            <div style={{ backgroundColor: "#10b981", borderRadius: "50%", padding: "8px", display: "flex" }}>
              <Icons.BsCheck style={{ fontSize: "1.8rem", color: "#fff" }} />
            </div>
            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "1.25rem" }}>{toast.title}</h4>
              <p style={{ margin: 0, color: "#cbd5e1", fontSize: "1.1rem" }}>{toast.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Nova Ordem */}
      {isNewOrderModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "30px", borderRadius: "12px",
            width: "100%", maxWidth: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}>
            <h2 style={{ margin: "0 0 20px 0", color: "var(--secondary-color)", fontSize: "1.6rem" }}>
              Iniciar Nova Ordem
            </h2>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#475569" }}>
                Para qual data deseja criar a ordem?
              </label>
              <input 
                type="date"
                value={newOrderDate}
                onChange={(e) => setNewOrderDate(e.target.value)}
                style={{ width: "100%", padding: "16px", borderRadius: "8px", border: "2px solid #cbd5e1", fontSize: "1.8rem", fontWeight: "bold", color: "var(--primary-color)", textAlign: "center" }}
              />
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setIsNewOrderModalOpen(false)}
                style={{ padding: "10px 20px", backgroundColor: "#f1f5f9", color: "#475569", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmNewOrder}
                style={{ padding: "10px 20px", backgroundColor: "var(--primary-color)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrdemProducao;
