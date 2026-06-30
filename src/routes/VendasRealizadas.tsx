import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import "../css/Frequencia.css"; // Reuse existing grid/table design styles

interface DbConciliacaoRow {
  id: number;
  created_at: string;
  date: string;
  store: string;
  status: string;
  caixa_abertura: number;
  caixa_vendas: number;
  caixa_ajustes: number;
  caixa_calculado: number;
  caixa_informado: number;
  caixa_real: number;
  pix_calculado: number;
  pix_realizado: number;
  cartao_calculado: number;
  cartao_realizado: number;
  ifood_calculado: number;
  ifood_realizado: number;
}

// Function to generate all days in a month YYYY-MM
function getDaysInMonth(yearMonth: string) {
  if (!yearMonth) return [];
  const [yearStr, monthStr] = yearMonth.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed
  
  const date = new Date(year, month, 1);
  const days: { dateStr: string; formattedDate: string; diaSemana: string }[] = [];
  
  const weekdayNames = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
  ];
  
  while (date.getMonth() === month) {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const formattedDate = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
    const diaSemana = weekdayNames[date.getDay()];
    
    days.push({
      dateStr,
      formattedDate,
      diaSemana
    });
    
    date.setDate(date.getDate() + 1);
  }
  
  return days;
}

function VendasRealizadas() {
  const [selectedStore, setSelectedStore] = useState<string>("ahu");
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [dbData, setDbData] = useState<DbConciliacaoRow[]>([]);
  const [checklistData, setChecklistData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<{ dateStr: string; field: string } | null>(null);

  const handleMonthNavigation = (direction: "prev" | "next") => {
    if (!selectedMonth) return;
    const [year, month] = selectedMonth.split("-").map(Number);
    let newYear = year;
    let newMonth = month;
    
    if (direction === "prev") {
      if (month === 1) {
        newMonth = 12;
        newYear = year - 1;
      } else {
        newMonth = month - 1;
      }
    } else {
      if (month === 12) {
        newMonth = 1;
        newYear = year + 1;
      } else {
        newMonth = month + 1;
      }
    }
    
    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, "0")}`);
  };

  const handleGoToToday = () => {
    const now = new Date();
    setSelectedMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
  };

  const todayStr = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  })();

  const handleCellClick = (dateStr: string, field: string) => {
    setEditingCell({ dateStr, field });
  };

  async function handleSaveField(dateStr: string, fieldName: string, value: number) {
    // 1. Optimistically update local state instantly
    setDbData(prevData => {
      const existingIdx = prevData.findIndex(item => item.date === dateStr);
      const matched = existingIdx >= 0 ? prevData[existingIdx] : null;

      const currentAbertura = fieldName === "caixa_abertura" ? value : (matched?.caixa_abertura || 0);
      const currentVendas = fieldName === "caixa_vendas" ? value : (matched?.caixa_vendas || 0);
      const currentAjustes = fieldName === "caixa_ajustes" ? value : (matched?.caixa_ajustes || 0);
      const newCalculado = currentAbertura + currentVendas + currentAjustes;

      const updatedRow: any = {
        ...(matched || {
          date: dateStr,
          store: selectedStore,
          status: "Aberto",
          caixa_abertura: 0,
          caixa_vendas: 0,
          caixa_ajustes: 0,
          caixa_informado: 0,
          caixa_real: 0,
          pix_calculado: 0,
          pix_realizado: 0,
          cartao_calculado: 0,
          cartao_realizado: 0,
          ifood_calculado: 0,
          ifood_realizado: 0
        }),
        [fieldName]: value,
        caixa_calculado: newCalculado
      };

      if (existingIdx >= 0) {
        const newData = [...prevData];
        newData[existingIdx] = updatedRow;
        return newData;
      } else {
        return [...prevData, updatedRow];
      }
    });

    const matched = dbData.find(item => item.date === dateStr);
    const payload: any = {
      date: dateStr,
      store: selectedStore,
      [fieldName]: value
    };

    const currentAbertura = fieldName === "caixa_abertura" ? value : (matched?.caixa_abertura || 0);
    const currentVendas = fieldName === "caixa_vendas" ? value : (matched?.caixa_vendas || 0);
    const currentAjustes = fieldName === "caixa_ajustes" ? value : (matched?.caixa_ajustes || 0);
    payload.caixa_calculado = currentAbertura + currentVendas + currentAjustes;

    if (matched) {
      payload.status = matched.status || "Aberto";
    }

    try {
      const { error } = await supabase
        .from("conciliacao_vendas")
        .upsert(payload, { onConflict: "store,date" });

      if (error) throw error;
      fetchConciliacao(true); // Sync in background
    } catch (err) {
      console.error("Erro ao salvar conciliação:", err);
      alert("Erro ao salvar dados no banco.");
      fetchConciliacao(); // Rollback to DB state
    }
  }

  async function handleStatusChange(dateStr: string, newStatus: string) {
    // 1. Optimistically update local state instantly
    setDbData(prevData => {
      const existingIdx = prevData.findIndex(item => item.date === dateStr);
      const matched = existingIdx >= 0 ? prevData[existingIdx] : null;

      const updatedRow: any = {
        ...(matched || {
          date: dateStr,
          store: selectedStore,
          status: "Aberto",
          caixa_abertura: 0,
          caixa_vendas: 0,
          caixa_ajustes: 0,
          caixa_calculado: 0,
          caixa_informado: 0,
          caixa_real: 0,
          pix_calculado: 0,
          pix_realizado: 0,
          cartao_calculado: 0,
          cartao_realizado: 0,
          ifood_calculado: 0,
          ifood_realizado: 0
        }),
        status: newStatus
      };

      if (existingIdx >= 0) {
        const newData = [...prevData];
        newData[existingIdx] = updatedRow;
        return newData;
      } else {
        return [...prevData, updatedRow];
      }
    });

    try {
      const { error } = await supabase
        .from("conciliacao_vendas")
        .upsert({
          date: dateStr,
          store: selectedStore,
          status: newStatus
        }, { onConflict: "store,date" });

      if (error) throw error;
      fetchConciliacao(true); // Sync in background
    } catch (err) {
      console.error("Erro ao salvar status:", err);
      alert("Erro ao alterar status.");
      fetchConciliacao(); // Rollback on failure
    }
  }

  const getLocalDateOnlyString = (timestamptzStr: string) => {
    if (!timestamptzStr) return "";
    const date = new Date(timestamptzStr);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const getChecklistTotal = (moneyData: any): number => {
    if (!moneyData) return 0;
    if (typeof moneyData === "object") {
      if (moneyData.total !== undefined && moneyData.total !== null) {
        return Number(moneyData.total);
      }
    }
    try {
      const parsed = typeof moneyData === "string" ? JSON.parse(moneyData) : moneyData;
      if (parsed && parsed.total !== undefined && parsed.total !== null) {
        return Number(parsed.total);
      }
    } catch (e) {}
    const num = Number(moneyData);
    return isNaN(num) ? 0 : num;
  };

  const fetchConciliacao = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) {
        setLoading(true);
      }
      setError(null);
      
      const startOfMonth = `${selectedMonth}-01`;
      const [year, month] = selectedMonth.split("-").map(Number);
      const lastDay = new Date(year, month, 0).getDate();
      const endOfMonth = `${selectedMonth}-${String(lastDay).padStart(2, '0')}`;

      // Fetch conciliacao_vendas
      const { data: vendasData, error: dbError } = await supabase
        .from("conciliacao_vendas")
        .select("*")
        .eq("store", selectedStore)
        .gte("date", startOfMonth)
        .lte("date", endOfMonth);

      if (dbError) throw dbError;

      // Fetch checklists
      const startTimestamptz = `${startOfMonth}T00:00:00.000Z`;
      const endTimestamptz = `${endOfMonth}T23:59:59.999Z`;
      const { data: chData, error: chError } = await supabase
        .from("Checklist")
        .select("*")
        .eq("store", selectedStore)
        .gte("created_at", startTimestamptz)
        .lte("created_at", endTimestamptz);

      if (chError) throw chError;

      setDbData(vendasData || []);
      setChecklistData(chData || []);
    } catch (err: any) {
      console.error("Erro ao carregar conciliações:", err);
      if (!isBackground) {
        setError("Falha ao carregar dados do banco de dados.");
      }
    } finally {
      if (!isBackground) {
        setLoading(false);
      }
    }
  }, [selectedStore, selectedMonth]);

  useEffect(() => {
    fetchConciliacao();
  }, [fetchConciliacao]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };

  const renderStatusCell = (
    row: any,
    cellBg: string,
    todayBorder: React.CSSProperties
  ) => {
    const isEditing = editingCell && editingCell.dateStr === row.dateStr && editingCell.field === "status";
    const isAberto = row.status === "Aberto";

    const statusCellStyle = {
      ...cellStyle,
      width: "110px",
      minWidth: "110px",
      maxWidth: "110px"
    };

    if (isEditing) {
      return (
        <td style={{ ...statusCellStyle, backgroundColor: cellBg, ...todayBorder, padding: "4px 8px" }}>
          <select
            value={row.status}
            onChange={(e) => {
              handleStatusChange(row.dateStr, e.target.value);
              setEditingCell(null);
            }}
            onBlur={() => setEditingCell(null)}
            autoFocus
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "4px 2px",
              margin: "0",
              fontSize: "1.3rem",
              border: "1px solid var(--primary-color)",
              borderRadius: "4px",
              textAlign: "center",
              cursor: "pointer",
              outline: "none"
            }}
          >
            <option value="Aberto">Aberto</option>
            <option value="Fechado">Fechado</option>
          </select>
        </td>
      );
    }

    return (
      <td
        onClick={() => handleCellClick(row.dateStr, "status")}
        style={{
          ...statusCellStyle,
          backgroundColor: cellBg,
          ...todayBorder,
          cursor: "pointer",
          transition: "background-color 0.2s"
        }}
        title="Clique para alterar o status"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f1f5f9";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = cellBg;
        }}
      >
        <span style={{
          padding: "4px 10px",
          borderRadius: "12px",
          fontSize: "1.1rem",
          fontWeight: "bold",
          backgroundColor: isAberto ? "#eff6ff" : "#f1f5f9",
          color: isAberto ? "#2563eb" : "#475569",
          border: `1px solid ${isAberto ? "#bfdbfe" : "#cbd5e1"}`
        }}>
          {row.status}
        </span>
      </td>
    );
  };

  const renderEditableCell = (
    row: any,
    fieldName: string,
    value: number,
    cellBg: string,
    cellColor: string,
    todayBorder: React.CSSProperties,
    hasDiscrepancy?: boolean
  ) => {
    const isEditing = editingCell && editingCell.dateStr === row.dateStr && editingCell.field === fieldName;

    const actualBg = hasDiscrepancy ? "#fee2e2" : cellBg;
    const actualColor = hasDiscrepancy ? "#b91c1c" : cellColor;
    const fontWeight = hasDiscrepancy ? "bold" : "normal";

    const currentCellStyle = {
      ...cellStyle,
      width: "125px",
      minWidth: "125px",
      maxWidth: "125px"
    };

    if (isEditing) {
      return (
        <td style={{ ...currentCellStyle, backgroundColor: actualBg, ...todayBorder, padding: "4px 8px" }}>
          <input
            type="text"
            defaultValue={value === 0 ? "" : value.toString().replace(".", ",")}
            placeholder="0,00"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const rawVal = e.currentTarget.value.replace(",", ".");
                const parsedVal = parseFloat(rawVal);
                handleSaveField(row.dateStr, fieldName, isNaN(parsedVal) ? 0 : parsedVal);
                setEditingCell(null);
              } else if (e.key === "Escape") {
                setEditingCell(null);
              }
            }}
            onBlur={(e) => {
              const rawVal = e.currentTarget.value.replace(",", ".");
              const parsedVal = parseFloat(rawVal);
              handleSaveField(row.dateStr, fieldName, isNaN(parsedVal) ? 0 : parsedVal);
              setEditingCell(null);
            }}
            autoFocus
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "4px 2px",
              margin: "0",
              fontSize: "1.3rem",
              border: "1px solid var(--primary-color)",
              borderRadius: "4px",
              textAlign: "center",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
        </td>
      );
    }

    return (
      <td
        onClick={() => handleCellClick(row.dateStr, fieldName)}
        style={{
          ...currentCellStyle,
          backgroundColor: actualBg,
          color: actualColor,
          fontWeight,
          ...todayBorder,
          cursor: "pointer",
          transition: "background-color 0.2s"
        }}
        title="Clique para editar"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f1f5f9";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = actualBg;
        }}
      >
        {formatCurrency(value)}
      </td>
    );
  };

  const renderMatchIcon = (checkVal: number, cloudVal: number, dateStr: string) => {
    const isFuture = dateStr > todayStr;
    if (isFuture) return null;

    const isMatch = checkVal === cloudVal;
    if (isMatch) {
      return (
        <Icons.BsCheckCircleFill 
          style={{ color: "#10b981", fontSize: "1.4rem", display: "inline-block", verticalAlign: "middle" }} 
          title="Valores de abertura coincidem" 
        />
      );
    } else {
      return (
        <Icons.BsExclamationTriangleFill 
          style={{ color: "#d97706", fontSize: "1.4rem", display: "inline-block", verticalAlign: "middle" }} 
          title={`Divergência: Checklist (${formatCurrency(checkVal)}) vs Cloudfy (${formatCurrency(cloudVal)})`}
        />
      );
    }
  };

  const renderClosingMatchIcon = (calcVal: number, infVal: number, dateStr: string) => {
    const isFuture = dateStr > todayStr;
    if (isFuture) return null;

    const isMatch = calcVal === infVal;
    if (isMatch) {
      return (
        <Icons.BsCheckCircleFill 
          style={{ color: "#10b981", fontSize: "1.4rem", display: "inline-block", verticalAlign: "middle" }} 
          title="Valores de fechamento coincidem" 
        />
      );
    } else {
      return (
        <Icons.BsExclamationTriangleFill 
          style={{ color: "#d97706", fontSize: "1.4rem", display: "inline-block", verticalAlign: "middle" }} 
          title={`Divergência: Calculado (${formatCurrency(calcVal)}) vs Informado (${formatCurrency(infVal)})`}
        />
      );
    }
  };

  // Header styles
  const headerStyle: React.CSSProperties = {
    padding: "12px 10px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    border: "1px solid #cbd5e1",
    verticalAlign: "middle"
  };

  const subHeaderStyle: React.CSSProperties = {
    padding: "8px 10px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    border: "1px solid #cbd5e1",
    textAlign: "center",
    width: "125px",
    minWidth: "125px",
    maxWidth: "125px",
    boxSizing: "border-box"
  };

  const cellStyle: React.CSSProperties = {
    padding: "10px",
    border: "1px solid #e2e8f0",
    textAlign: "center",
    fontSize: "1.3rem",
    boxSizing: "border-box"
  };

  const numericCellStyle: React.CSSProperties = {
    ...cellStyle,
    width: "125px",
    minWidth: "125px",
    maxWidth: "125px"
  };

  const iconHeaderStyle: React.CSSProperties = {
    padding: "8px 4px",
    border: "1px solid #cbd5e1",
    textAlign: "center",
    width: "45px",
    minWidth: "45px",
    maxWidth: "45px",
    boxSizing: "border-box"
  };

  const iconCellStyle: React.CSSProperties = {
    padding: "10px 4px",
    border: "1px solid #e2e8f0",
    textAlign: "center",
    fontSize: "1.3rem",
    width: "45px",
    minWidth: "45px",
    maxWidth: "45px",
    boxSizing: "border-box"
  };

  // Generate days and merge with fetched data
  const days = getDaysInMonth(selectedMonth);
  days.reverse(); // Latest first

  // Build a map of opening checklist values indexed by dateStr (YYYY-MM-DD)
  const openingChecklistsMap: { [dateStr: string]: number } = {};
  checklistData.forEach(item => {
    if (item.checklist?.toLowerCase().includes("abertura")) {
      const dateStr = getLocalDateOnlyString(item.created_at);
      const total = getChecklistTotal(item.money_data);
      openingChecklistsMap[dateStr] = total;
    }
  });

  const rows = days.map((day) => {
    const matched = dbData.find((item) => item.date === day.dateStr);
    const chAbertura = openingChecklistsMap[day.dateStr] || 0;

    if (matched) {
      return {
        diaSemana: day.diaSemana,
        data: day.formattedDate,
        dateStr: day.dateStr,
        status: matched.status || "Aberto",
        caixaAberturaChecklist: chAbertura,
        caixaAberturaCloudfy: matched.caixa_abertura || 0,
        caixaVendas: matched.caixa_vendas || 0,
        caixaAjustes: matched.caixa_ajustes || 0,
        caixaCalculado: matched.caixa_calculado || 0,
        caixaInformado: matched.caixa_informado || 0,
        caixaReal: matched.caixa_real || 0,
        pixCalculado: matched.pix_calculado || 0,
        pixRealizado: matched.pix_realizado || 0,
        cartaoCalculado: matched.cartao_calculado || 0,
        cartaoRealizado: matched.cartao_realizado || 0,
        ifoodCalculado: matched.ifood_calculado || 0,
        ifoodRealizado: matched.ifood_realizado || 0,
        isDbRecord: true
      };
    } else {
      return {
        diaSemana: day.diaSemana,
        data: day.formattedDate,
        dateStr: day.dateStr,
        status: "Aberto",
        caixaAberturaChecklist: chAbertura,
        caixaAberturaCloudfy: 0,
        caixaVendas: 0,
        caixaAjustes: 0,
        caixaCalculado: 0,
        caixaInformado: 0,
        caixaReal: 0,
        pixCalculado: 0,
        pixRealizado: 0,
        cartaoCalculado: 0,
        cartaoRealizado: 0,
        ifoodCalculado: 0,
        ifoodRealizado: 0,
        isDbRecord: false
      };
    }
  });

  return (
    <>
      <Helmet>
        <title>Conciliação de Vendas - Carmella</title>
      </Helmet>

      <div className="frequencia-container" style={{ padding: "24px 24px 24px 95px", maxWidth: "100%" }}>
        {/* Header Title */}
        <div className="frequencia-header" style={{ marginBottom: "24px" }}>
          <div className="frequencia-title-group">
            <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Icons.BsShopWindow style={{ color: "var(--primary-color)" }} />
              Conciliação de Vendas das Lojas
            </h1>
            <p>Compare as vendas calculadas pelo sistema de PDV com os valores informados pelas lojas e os lançamentos reais.</p>
          </div>
        </div>

        {/* Filters Panel */}
        <div style={{
          backgroundColor: "#fff",
          padding: "16px 24px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          alignItems: "center"
        }}>
          {/* Store Tabs */}
          <div>
            <label style={{ display: "block", fontSize: "1.3rem", fontWeight: "bold", color: "#475569", marginBottom: "6px" }}>Loja</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setSelectedStore("ahu")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: selectedStore === "ahu" ? "none" : "1px solid #cbd5e1",
                  backgroundColor: selectedStore === "ahu" ? "var(--primary-color)" : "#fff",
                  color: selectedStore === "ahu" ? "#fff" : "#475569",
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Ahú
              </button>
              <button
                onClick={() => setSelectedStore("altoxv")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: selectedStore === "altoxv" ? "none" : "1px solid #cbd5e1",
                  backgroundColor: selectedStore === "altoxv" ? "var(--primary-color)" : "#fff",
                  color: selectedStore === "altoxv" ? "#fff" : "#475569",
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Alto da XV
              </button>
            </div>
          </div>

          {/* Month Selector */}
          <div>
            <label style={{ display: "block", fontSize: "1.3rem", fontWeight: "bold", color: "#475569", marginBottom: "6px" }}>Período</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                className="nav-btn"
                onClick={() => handleMonthNavigation("prev")}
                title="Mês Anterior"
                style={{ padding: "8px 12px" }}
              >
                <Icons.BsChevronLeft />
              </button>
              
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "1.3rem",
                  color: "#334155",
                  fontFamily: "inherit",
                  cursor: "pointer"
                }}
              />
              
              <button
                className="nav-btn"
                onClick={() => handleMonthNavigation("next")}
                title="Próximo Mês"
                style={{ padding: "8px 12px" }}
              >
                <Icons.BsChevronRight />
              </button>

              <button
                className="nav-btn"
                onClick={handleGoToToday}
                title="Ir para o dia de hoje"
                style={{ fontWeight: "bold", padding: "8px 12px" }}
              >
                Hoje
              </button>
            </div>
          </div>

          {/* Reload Button */}
          <button
            onClick={fetchConciliacao}
            style={{
              marginLeft: "auto",
              padding: "10px 18px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "var(--primary-color)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.3rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "opacity 0.2s"
            }}
            disabled={loading}
          >
            <Icons.BsArrowClockwise className={loading ? "spin" : ""} />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Scrollable Spreadsheet Table Container */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px rgba(0,0,0,0.04)",
          overflowX: "auto",
          maxHeight: "70vh"
        }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", fontSize: "1.4rem", color: "#64748b" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", marginBottom: "8px" }} />
              <p>Carregando dados da conciliação...</p>
            </div>
          ) : error ? (
            <div style={{ padding: "40px", textAlign: "center", fontSize: "1.4rem", color: "#ef4444" }}>
              <Icons.BsExclamationTriangle style={{ fontSize: "2.4rem", marginBottom: "8px" }} />
              <p>{error}</p>
              <button onClick={fetchConciliacao} style={{ marginTop: "12px", padding: "8px 16px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Tentar Novamente
              </button>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: "1600px" }}>
              <thead>
                {/* Group Headers */}
                <tr style={{ backgroundColor: "#f8fafc", color: "#334155" }}>
                  <th rowSpan={2} style={{ ...headerStyle, textAlign: "left", paddingLeft: "16px", position: "sticky", left: 0, backgroundColor: "#f8fafc", zIndex: 10, width: "140px", minWidth: "140px", maxWidth: "140px", boxSizing: "border-box" }}>Dia da Semana</th>
                  <th rowSpan={2} style={{ ...headerStyle, position: "sticky", left: "140px", backgroundColor: "#f8fafc", zIndex: 10, width: "120px", minWidth: "120px", maxWidth: "120px", boxSizing: "border-box" }}>Data</th>
                  <th rowSpan={2} style={{ ...headerStyle, width: "110px", minWidth: "110px", maxWidth: "110px", boxSizing: "border-box" }}>Status</th>
                  
                  <th colSpan={8} style={{ ...headerStyle, textAlign: "center", backgroundColor: "#fffbeb", color: "#b45309", borderBottom: "2px solid #fcd34d" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <Icons.BsCashCoin /> Caixa Dinheiro
                    </span>
                  </th>
                  <th colSpan={2} style={{ ...headerStyle, textAlign: "center", backgroundColor: "#eff6ff", color: "#1e40af", borderBottom: "2px solid #bfdbfe" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <Icons.BsQrCode /> Vendas Pix
                    </span>
                  </th>
                  <th colSpan={2} style={{ ...headerStyle, textAlign: "center", backgroundColor: "#f0fdf4", color: "#166534", borderBottom: "2px solid #bbf7d0" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <Icons.BsCreditCard2Back /> Vendas Cartão
                    </span>
                  </th>
                  <th colSpan={2} style={{ ...headerStyle, textAlign: "center", backgroundColor: "#faf5ff", color: "#6b21a8", borderBottom: "2px solid #e9d5ff" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <Icons.BsBicycle /> Vendas iFood
                    </span>
                  </th>
                </tr>

                {/* Sub Columns */}
                <tr style={{ backgroundColor: "#f8fafc", color: "#64748b" }}>
                  {/* Caixa Dinheiro subheaders */}
                  <th style={{ ...subHeaderStyle, borderLeft: "3px solid #cbd5e1" }}>Abertura<br />Checklist</th>
                  <th style={subHeaderStyle}>Abertura<br />Cloudfy</th>
                  <th style={{ ...iconHeaderStyle, borderRight: "3px solid #cbd5e1" }}></th>
                  <th style={subHeaderStyle}>Vendas</th>
                  <th style={subHeaderStyle}>Ajustes</th>
                  <th style={{ ...subHeaderStyle, borderLeft: "3px solid #cbd5e1" }}>Calculado<br />Cloudfy</th>
                  <th style={subHeaderStyle}>Informado<br />Cloudfy</th>
                  <th style={{ ...iconHeaderStyle, borderRight: "3px solid #cbd5e1" }}></th>
                  
                  {/* Pix subheaders */}
                  <th style={subHeaderStyle}>Calculadas</th>
                  <th style={subHeaderStyle}>Realizadas</th>

                  {/* Cartão subheaders */}
                  <th style={subHeaderStyle}>Calculadas</th>
                  <th style={subHeaderStyle}>Realizadas</th>

                  {/* iFood subheaders */}
                  <th style={subHeaderStyle}>Calculadas</th>
                  <th style={subHeaderStyle}>Realizadas</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const isToday = row.dateStr === todayStr;
                  const cellBg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
                  const cellColor = "inherit";
                  
                  // Discrepancy checks (only when status is Fechado)
                  const hasCaixaDiscrepancy = row.status === "Fechado" && (row.caixaCalculado !== row.caixaInformado || row.caixaCalculado !== row.caixaReal);
                  const hasPixDiscrepancy = row.status === "Fechado" && row.pixCalculado !== row.pixRealizado;
                  const hasCartaoDiscrepancy = row.status === "Fechado" && row.cartaoCalculado !== row.cartaoRealizado;
                  const hasIfoodDiscrepancy = row.status === "Fechado" && row.ifoodCalculado !== row.ifoodRealizado;

                  // Today borders
                  const todayBorder = isToday ? { borderTop: "2px solid #eab308", borderBottom: "2px solid #eab308" } : {};

                  return (
                    <tr key={idx} style={{ transition: "0.15s" }}>
                      {/* Fixed Left Columns */}
                      <td style={{ 
                        ...cellStyle, 
                        textAlign: "left", 
                        paddingLeft: "16px", 
                        fontWeight: "600", 
                        color: "#475569", 
                        position: "sticky", 
                        left: 0, 
                        backgroundColor: cellBg, 
                        borderRight: "1px solid #cbd5e1",
                        width: "140px",
                        minWidth: "140px",
                        maxWidth: "140px",
                        ...todayBorder
                      }}>
                        {row.diaSemana}
                      </td>
                      <td style={{ 
                        ...cellStyle, 
                        color: "#334155", 
                        position: "sticky", 
                        left: "140px", 
                        backgroundColor: cellBg, 
                        borderRight: "1px solid #cbd5e1",
                        width: "120px",
                        minWidth: "120px",
                        maxWidth: "120px",
                        ...todayBorder
                      }}>
                        {row.data}
                      </td>
                      
                      {/* Status badge */}
                      {renderStatusCell(row, cellBg, todayBorder)}

                      {/* Caixa Dinheiro Cells */}
                      <td style={{ ...numericCellStyle, backgroundColor: cellBg, color: cellColor, ...todayBorder, borderLeft: "3px solid #cbd5e1" }}>{formatCurrency(row.caixaAberturaChecklist)}</td>
                      {renderEditableCell(row, "caixa_abertura", row.caixaAberturaCloudfy, cellBg, cellColor, todayBorder)}
                      <td style={{ ...iconCellStyle, backgroundColor: cellBg, ...todayBorder, borderRight: "3px solid #cbd5e1" }}>
                        {renderMatchIcon(row.caixaAberturaChecklist, row.caixaAberturaCloudfy, row.dateStr)}
                      </td>
                      {renderEditableCell(row, "caixa_vendas", row.caixaVendas, cellBg, cellColor, todayBorder)}
                      {renderEditableCell(row, "caixa_ajustes", row.caixaAjustes, cellBg, cellColor, todayBorder)}
                      <td style={{ ...numericCellStyle, backgroundColor: cellBg, color: cellColor, ...todayBorder, borderLeft: "3px solid #cbd5e1" }}>{formatCurrency(row.caixaCalculado)}</td>
                      {renderEditableCell(row, "caixa_informado", row.caixaInformado, cellBg, cellColor, todayBorder, hasCaixaDiscrepancy)}
                      <td style={{ ...iconCellStyle, backgroundColor: cellBg, ...todayBorder, borderRight: "3px solid #cbd5e1" }}>
                        {renderClosingMatchIcon(row.caixaCalculado, row.caixaInformado, row.dateStr)}
                      </td>

                      {/* Vendas Pix Cells */}
                      {renderEditableCell(row, "pix_calculado", row.pixCalculado, cellBg, cellColor, todayBorder)}
                      {renderEditableCell(row, "pix_realizado", row.pixRealizado, cellBg, cellColor, todayBorder, hasPixDiscrepancy)}

                      {/* Vendas Cartão Cells */}
                      {renderEditableCell(row, "cartao_calculado", row.cartaoCalculado, cellBg, cellColor, todayBorder)}
                      {renderEditableCell(row, "cartao_realizado", row.cartaoRealizado, cellBg, cellColor, todayBorder, hasCartaoDiscrepancy)}

                      {/* Vendas iFood Cells */}
                      {renderEditableCell(row, "ifood_calculado", row.ifoodCalculado, cellBg, cellColor, todayBorder)}
                      {renderEditableCell(row, "ifood_realizado", row.ifoodRealizado, cellBg, cellColor, todayBorder, hasIfoodDiscrepancy)}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default VendasRealizadas;
