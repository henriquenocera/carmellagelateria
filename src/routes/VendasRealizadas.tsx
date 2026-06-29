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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConciliacao = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startOfMonth = `${selectedMonth}-01`;
      const [year, month] = selectedMonth.split("-").map(Number);
      const lastDay = new Date(year, month, 0).getDate();
      const endOfMonth = `${selectedMonth}-${String(lastDay).padStart(2, '0')}`;

      const { data, error: dbError } = await supabase
        .from("conciliacao_vendas")
        .select("*")
        .eq("store", selectedStore)
        .gte("date", startOfMonth)
        .lte("date", endOfMonth);

      if (dbError) throw dbError;
      setDbData(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar conciliações:", err);
      setError("Falha ao carregar dados do banco de dados.");
    } finally {
      setLoading(false);
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
    textAlign: "center"
  };

  const cellStyle: React.CSSProperties = {
    padding: "10px",
    border: "1px solid #e2e8f0",
    textAlign: "center",
    fontSize: "1.3rem"
  };

  // Generate days and merge with fetched data
  const days = getDaysInMonth(selectedMonth);
  days.reverse(); // Latest first

  const rows = days.map((day) => {
    const matched = dbData.find((item) => item.date === day.dateStr);
    if (matched) {
      return {
        diaSemana: day.diaSemana,
        data: day.formattedDate,
        status: matched.status || "Aberto",
        caixaAbertura: matched.caixa_abertura || 0,
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
        status: "Aberto",
        caixaAbertura: 0,
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
                  <th rowSpan={2} style={{ ...headerStyle, textAlign: "left", paddingLeft: "16px", position: "sticky", left: 0, backgroundColor: "#f8fafc", zIndex: 10 }}>Dia da Semana</th>
                  <th rowSpan={2} style={{ ...headerStyle, position: "sticky", left: "150px", backgroundColor: "#f8fafc", zIndex: 10 }}>Data</th>
                  <th rowSpan={2} style={headerStyle}>Status</th>
                  
                  <th colSpan={6} style={{ ...headerStyle, textAlign: "center", backgroundColor: "#fffbeb", color: "#b45309", borderBottom: "2px solid #fcd34d" }}>
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
                  <th style={subHeaderStyle}>Abertura</th>
                  <th style={subHeaderStyle}>Vendas</th>
                  <th style={subHeaderStyle}>Ajustes</th>
                  <th style={subHeaderStyle}>Calculado</th>
                  <th style={subHeaderStyle}>Informado</th>
                  <th style={subHeaderStyle}>Real</th>
                  
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
                  const isAberto = row.status === "Aberto";
                  
                  // Discrepancy checks (only when status is Fechado)
                  const hasCaixaDiscrepancy = row.status === "Fechado" && (row.caixaCalculado !== row.caixaInformado || row.caixaCalculado !== row.caixaReal);
                  const hasPixDiscrepancy = row.status === "Fechado" && row.pixCalculado !== row.pixRealizado;
                  const hasCartaoDiscrepancy = row.status === "Fechado" && row.cartaoCalculado !== row.cartaoRealizado;
                  const hasIfoodDiscrepancy = row.status === "Fechado" && row.ifoodCalculado !== row.ifoodRealizado;

                  return (
                    <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc", transition: "0.15s" }}>
                      {/* Fixed Left Columns */}
                      <td style={{ ...cellStyle, textAlign: "left", paddingLeft: "16px", fontWeight: "600", color: "#475569", position: "sticky", left: 0, backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc", borderRight: "1px solid #cbd5e1" }}>
                        {row.diaSemana}
                      </td>
                      <td style={{ ...cellStyle, color: "#334155", position: "sticky", left: "150px", backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc", borderRight: "1px solid #cbd5e1" }}>
                        {row.data}
                      </td>
                      
                      {/* Status badge */}
                      <td style={cellStyle}>
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

                      {/* Caixa Dinheiro Cells */}
                      <td style={cellStyle}>{formatCurrency(row.caixaAbertura)}</td>
                      <td style={cellStyle}>{formatCurrency(row.caixaVendas)}</td>
                      <td style={{ ...cellStyle, color: row.caixaAjustes < 0 ? "#ef4444" : row.caixaAjustes > 0 ? "#10b981" : "#64748b" }}>
                        {formatCurrency(row.caixaAjustes)}
                      </td>
                      <td style={cellStyle}>{formatCurrency(row.caixaCalculado)}</td>
                      <td style={{
                        ...cellStyle,
                        backgroundColor: hasCaixaDiscrepancy ? "#fee2e2" : "transparent",
                        color: hasCaixaDiscrepancy ? "#b91c1c" : "#334155",
                        fontWeight: hasCaixaDiscrepancy ? "bold" : "normal"
                      }}>
                        {formatCurrency(row.caixaInformado)}
                      </td>
                      <td style={{
                        ...cellStyle,
                        backgroundColor: hasCaixaDiscrepancy ? "#fee2e2" : "transparent",
                        color: hasCaixaDiscrepancy ? "#b91c1c" : "#334155",
                        fontWeight: hasCaixaDiscrepancy ? "bold" : "normal"
                      }}>
                        {formatCurrency(row.caixaReal)}
                      </td>

                      {/* Vendas Pix Cells */}
                      <td style={cellStyle}>{formatCurrency(row.pixCalculado)}</td>
                      <td style={{
                        ...cellStyle,
                        backgroundColor: hasPixDiscrepancy ? "#fee2e2" : "transparent",
                        color: hasPixDiscrepancy ? "#b91c1c" : "#334155",
                        fontWeight: hasPixDiscrepancy ? "bold" : "normal"
                      }}>
                        {formatCurrency(row.pixRealizado)}
                      </td>

                      {/* Vendas Cartão Cells */}
                      <td style={cellStyle}>{formatCurrency(row.cartaoCalculado)}</td>
                      <td style={{
                        ...cellStyle,
                        backgroundColor: hasCartaoDiscrepancy ? "#fee2e2" : "transparent",
                        color: hasCartaoDiscrepancy ? "#b91c1c" : "#334155",
                        fontWeight: hasCartaoDiscrepancy ? "bold" : "normal"
                      }}>
                        {formatCurrency(row.cartaoRealizado)}
                      </td>

                      {/* Vendas iFood Cells */}
                      <td style={cellStyle}>{formatCurrency(row.ifoodCalculado)}</td>
                      <td style={{
                        ...cellStyle,
                        backgroundColor: hasIfoodDiscrepancy ? "#fee2e2" : "transparent",
                        color: hasIfoodDiscrepancy ? "#b91c1c" : "#334155",
                        fontWeight: hasIfoodDiscrepancy ? "bold" : "normal"
                      }}>
                        {formatCurrency(row.ifoodRealizado)}
                      </td>
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
