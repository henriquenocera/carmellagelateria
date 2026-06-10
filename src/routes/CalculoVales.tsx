import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../css/CalculoVales.css";

interface Profile {
  id: string;
  short_id: string | null;
  name: string;
  email: string;
  is_admin: boolean | null;
  controlar_frequencia?: boolean | null;
  folgas_fixas?: string | null;
  ativo?: boolean | null;
  data_registro?: string | null;
  passagens_urbs?: number | null;
  passagens_metrocard?: number | null;
}

const WEEKDAYS = [
  { value: "1", label: "Seg" },
  { value: "2", label: "Ter" },
  { value: "3", label: "Qua" },
  { value: "4", label: "Qui" },
  { value: "5", label: "Sex" },
  { value: "6", label: "Sáb" },
  { value: "0", label: "Dom" }
];

const getPrevMonthAndYear = (currMonth: number, currYear: number) => {
  let m = currMonth - 1;
  let y = currYear;
  if (m < 1) {
    m = 12;
    y -= 1;
  }
  return { month: m, year: y };
};

function CalculoVales() {
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [prevMonthAttendance, setPrevMonthAttendance] = useState<{ [employeeId: string]: number }>({});
  const [currMonthAttendance, setCurrMonthAttendance] = useState<{ [key: string]: string }>({});
  const [adjustedDays, setAdjustedDays] = useState<{ [profileId: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default to the next calendar month
  const getNextMonthAndYear = () => {
    const today = new Date();
    let m = today.getMonth() + 2; // getMonth() is 0-11, so +1 is current month, +2 is next month
    let y = today.getFullYear();
    if (m > 12) {
      m = 1;
      y += 1;
    }
    return { month: m, year: y };
  };

  const nextPeriod = getNextMonthAndYear();
  const [month, setMonth] = useState<number>(nextPeriod.month);
  const [year, setYear] = useState<number>(nextPeriod.year);

  const today = new Date();
  const yearsList = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i);
  const monthsList = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" }
  ];

  useEffect(() => {
    checkAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function checkAccess() {
    if (!user) return;
    try {
      const { data, error: dbError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      if (dbError) throw dbError;

      if (data && data.is_admin) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error("Erro ao verificar acesso:", err);
      setIsAuthorized(false);
    }
  }

  // Pre-calculate working days based on month, year, registration date and weekly off-days
  const calculateDefaultWorkdays = (
    profile: Profile,
    targetMonth: number,
    targetYear: number,
    attendanceMap: { [key: string]: string } = currMonthAttendance
  ) => {
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    const fixedOffDays = profile.folgas_fixas ? profile.folgas_fixas.split(",") : [];
    const regDateStr = profile.data_registro;

    let workdays = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(targetYear, targetMonth - 1, d);
      
      const yStr = dateObj.getFullYear();
      const mStr = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dStr = String(dateObj.getDate()).padStart(2, "0");
      const currentDateStr = `${yStr}-${mStr}-${dStr}`;

      // If date is before registration/hire date, skip
      if (regDateStr && currentDateStr < regDateStr) {
        continue;
      }

      const cellKey = `${profile.id}_${currentDateStr}`;
      const weekdayVal = String(dateObj.getDay());
      const isFixedOff = fixedOffDays.includes(weekdayVal);
      const defaultStatus = isFixedOff ? "Folga Fixa Semanal" : "Trabalhado";

      const status = attendanceMap[cellKey] || defaultStatus;
      const isWorkedStatus = [
        "Trabalhado",
        "Declaração de Horas",
        "Saída Antecipada",
        "Atraso",
        "Registro Formal",
        "Rescisão de Contrato",
        "Outro"
      ].includes(status);

      if (isWorkedStatus) {
        workdays++;
      }
    }
    return workdays;
  };

  const fetchValesData = async (targetMonth: number, targetYear: number) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch profiles
      const { data: profilesData, error: dbError } = await supabase
        .from("profiles")
        .select("id, short_id, name, email, is_admin, controlar_frequencia, folgas_fixas, ativo, data_registro, passagens_urbs, passagens_metrocard")
        .order("name", { ascending: true });

      if (dbError) throw dbError;

      // Filter active profiles that have frequency control enabled
      const filtered = (profilesData || []).filter(
        (p) => p.controlar_frequencia !== false && p.ativo !== false
      );
      setProfiles(filtered);

      // 2. Fetch previous month's attendance
      const prevPeriod = getPrevMonthAndYear(targetMonth, targetYear);
      const daysInPrevMonth = new Date(prevPeriod.year, prevPeriod.month, 0).getDate();
      const startOfPrevStr = `${prevPeriod.year}-${String(prevPeriod.month).padStart(2, "0")}-01`;
      const endOfPrevStr = `${prevPeriod.year}-${String(prevPeriod.month).padStart(2, "0")}-${String(daysInPrevMonth).padStart(2, "0")}`;

      const { data: attData, error: attError } = await supabase
        .from("frequencia")
        .select("employee_id, status")
        .gte("date", startOfPrevStr)
        .lte("date", endOfPrevStr)
        .in("status", ["Falta Não Justificada", "Atestado", "Folga Compensatória"]);

      if (attError) throw attError;

      const counts: { [employeeId: string]: number } = {};
      (attData || []).forEach((row) => {
        counts[row.employee_id] = (counts[row.employee_id] || 0) + 1;
      });

      setPrevMonthAttendance(counts);

      // 3. Fetch target month's attendance (to align base days with Frequencia table)
      const daysInTargetMonth = new Date(targetYear, targetMonth, 0).getDate();
      const startOfTargetStr = `${targetYear}-${String(targetMonth).padStart(2, "0")}-01`;
      const endOfTargetStr = `${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(daysInTargetMonth).padStart(2, "0")}`;

      const { data: targetAttData, error: targetAttError } = await supabase
        .from("frequencia")
        .select("employee_id, date, status")
        .gte("date", startOfTargetStr)
        .lte("date", endOfTargetStr);

      if (targetAttError) throw targetAttError;

      const targetAttMap: { [key: string]: string } = {};
      (targetAttData || []).forEach((row) => {
        const key = `${row.employee_id}_${row.date}`;
        targetAttMap[key] = row.status;
      });

      setCurrMonthAttendance(targetAttMap);

      // 4. Populate adjustedDays
      const initialAdjustments: { [key: string]: number } = {};
      filtered.forEach((p) => {
        const defaultDays = calculateDefaultWorkdays(p, targetMonth, targetYear, targetAttMap);
        const discount = counts[p.id] || 0;
        initialAdjustments[p.id] = Math.max(0, defaultDays - discount);
      });
      setAdjustedDays(initialAdjustments);

    } catch (err: any) {
      console.error("Erro ao buscar perfis e faltas:", err);
      setError("Falha ao carregar dados do cálculo de vales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchValesData(month, year);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized, month, year]);

  const handleDayChange = (profileId: string, val: string) => {
    const intVal = parseInt(val);
    setAdjustedDays((prev) => ({
      ...prev,
      [profileId]: isNaN(intVal) || intVal < 0 ? 0 : intVal
    }));
  };

  // Calculations for summary card
  const getTotals = () => {
    let totalUrbsCount = 0;
    let totalMetrocardCount = 0;
    let totalVrCount = 0;
    let totalFinancialCost = 0;

    profiles.forEach((p) => {
      const days = adjustedDays[p.id] ?? 0;
      const urbsQty = days * (p.passagens_urbs ?? 0);
      const metroQty = days * (p.passagens_metrocard ?? 0);
      const vrQty = days;

      totalUrbsCount += urbsQty;
      totalMetrocardCount += metroQty;
      totalVrCount += vrQty;
      totalFinancialCost += (urbsQty * 6.00) + (metroQty * 5.50) + (vrQty * 17.00);
    });

    return {
      urbsCount: totalUrbsCount,
      urbsCost: totalUrbsCount * 6.00,
      metrocardCount: totalMetrocardCount,
      metrocardCost: totalMetrocardCount * 5.50,
      vrCount: totalVrCount,
      vrCost: totalVrCount * 17.00,
      totalCost: totalFinancialCost
    };
  };

  const totals = getTotals();

  const prevPeriodInfo = getPrevMonthAndYear(month, year);
  const prevMonthLabel = monthsList.find((m) => m.value === prevPeriodInfo.month)?.label || "";

  const getFixedOffDaysLabel = (folgasStr: string | null | undefined) => {
    if (!folgasStr) return "Nenhuma";
    const days = folgasStr.split(",");
    const labels = days
      .map((d) => WEEKDAYS.find((w) => w.value === d)?.label || "")
      .filter(Boolean);
    return labels.length > 0 ? labels.join(", ") : "Nenhuma";
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Relatório de Previsão de Vales (VT & VR)", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const monthLabel = monthsList.find((m) => m.value === month)?.label;
    const prevPeriod = getPrevMonthAndYear(month, year);
    const prevMonthLabel = monthsList.find((m) => m.value === prevPeriod.month)?.label;
    doc.text(`Referência: ${monthLabel} de ${year}`, 14, 27);
    doc.text(`Data de Geração: ${new Date().toLocaleDateString("pt-BR")}`, 14, 33);

    const tableRows = profiles.map((p) => {
      const baseDays = calculateDefaultWorkdays(p, month, year);
      const discount = prevMonthAttendance[p.id] || 0;
      const days = adjustedDays[p.id] ?? 0;
      const urbsQty = days * (p.passagens_urbs ?? 0);
      const urbsCost = urbsQty * 6.0;
      const metroQty = days * (p.passagens_metrocard ?? 0);
      const metroCost = metroQty * 5.5;
      const vrQty = days;
      const vrCost = vrQty * 17.0;
      const totalCost = urbsCost + metroCost + vrCost;

      return [
        p.name,
        baseDays.toString(),
        discount.toString(),
        days.toString(),
        `${urbsQty} (R$ ${urbsCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
        `${metroQty} (R$ ${metroCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
        `${vrQty} (R$ ${vrCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
        `R$ ${totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      ];
    });

    tableRows.push([
      "TOTAL CONSOLIDADO",
      "",
      "",
      "",
      `${totals.urbsCount} (R$ ${totals.urbsCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
      `${totals.metrocardCount} (R$ ${totals.metrocardCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
      `${totals.vrCount} (R$ ${totals.vrCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
      `R$ ${totals.totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["Funcionário", "Dias Base", `Descontos (${prevMonthLabel})`, "Dias Previstos", "URBS (R$ 6,00)", "Metrocard (R$ 5,50)", "VR (R$ 17,00)", "Valor Total"]],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [120, 78, 33], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { fontStyle: "bold" },
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "left" },
        5: { halign: "left" },
        6: { halign: "left" },
        7: { halign: "right", fontStyle: "bold" }
      },
      didParseCell: function (data: any) {
        if (data.row.index === tableRows.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [245, 237, 228];
        }
      }
    });

    doc.save(`Previsao_Vales_${monthLabel}_${year}.pdf`);
  };

  const handleExportCSV = () => {
    const headers = [
      "Funcionário",
      "Dias Base",
      "Descontos",
      "Dias Previstos",
      "Qtd URBS",
      "Valor URBS (R$)",
      "Qtd Metrocard",
      "Valor Metrocard (R$)",
      "Qtd VR",
      "Valor VR (R$)",
      "Total Geral (R$)"
    ];
    const monthLabel = monthsList.find((m) => m.value === month)?.label;

    const rows = profiles.map((p) => {
      const baseDays = calculateDefaultWorkdays(p, month, year);
      const discount = prevMonthAttendance[p.id] || 0;
      const days = adjustedDays[p.id] ?? 0;
      const urbsQty = days * (p.passagens_urbs ?? 0);
      const urbsCost = urbsQty * 6.0;
      const metroQty = days * (p.passagens_metrocard ?? 0);
      const metroCost = metroQty * 5.5;
      const vrQty = days;
      const vrCost = vrQty * 17.0;
      const totalCost = urbsCost + metroCost + vrCost;

      return [
        p.name,
        baseDays.toString(),
        discount.toString(),
        days.toString(),
        urbsQty.toString(),
        urbsCost.toFixed(2),
        metroQty.toString(),
        metroCost.toFixed(2),
        vrQty.toString(),
        vrCost.toFixed(2),
        totalCost.toFixed(2)
      ];
    });

    const csvContent = [
      headers.join(";"),
      ...rows.map((r) => r.map((val) => `"${val.replace(/"/g, '""')}"`).join(";"))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Previsao_Vales_${monthLabel}_${year}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isAuthorized === null) {
    return (
      <div className="vales-container" style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
        <Icons.BsArrowClockwise className="vales-spin" style={{ fontSize: "2rem" }} />
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="vales-container">
        <div className="vales-error-state">
          <Icons.BsShieldLock style={{ fontSize: "3rem", color: "#ef4444", marginBottom: "16px" }} />
          <h2 style={{ color: "var(--secondary-color)", marginBottom: "8px" }}>Acesso Negado</h2>
          <p>Somente administradores podem acessar a página de Cálculo de Vales.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cálculo de Vales</title>
      </Helmet>

      <div className="vales-container">
        <div className="vales-header">
          <div className="vales-title-group">
            <h1>Previsão e Cálculo de Vales</h1>
            <p>Selecione o mês para prever dias trabalhados e calcular o depósito de passagens.</p>
          </div>
        </div>

        <div className="vales-controls">
          <div className="vales-month-selector">
            <select className="vales-select" value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
              {monthsList.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select className="vales-select" value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
              {yearsList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="vales-export-group">
            <button className="vales-btn vales-btn-secondary" onClick={handleExportCSV}>
              <Icons.BsFileEarmarkSpreadsheet />
              Exportar CSV
            </button>
            <button className="vales-btn vales-btn-primary" onClick={handleExportPDF}>
              <Icons.BsFileEarmarkPdf />
              Exportar PDF
            </button>
          </div>
        </div>

        {/* Resumo Consolidado */}
        <div className="vales-summary-grid">
          <div className="vales-summary-card">
            <div className="vales-card-icon-wrapper urbs">
              <Icons.BsBusFront />
            </div>
            <div className="vales-card-info">
              <span className="vales-card-label">Passagens URBS</span>
              <span className="vales-card-value">
                R$ {totals.urbsCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                Quantidade: {totals.urbsCount} u.
              </span>
            </div>
          </div>

          <div className="vales-summary-card">
            <div className="vales-card-icon-wrapper metrocard">
              <Icons.BsTag />
            </div>
            <div className="vales-card-info">
              <span className="vales-card-label">Metrocard</span>
              <span className="vales-card-value">
                R$ {totals.metrocardCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                Quantidade: {totals.metrocardCount} u.
              </span>
            </div>
          </div>

          <div className="vales-summary-card">
            <div className="vales-card-icon-wrapper vr">
              <Icons.BsCupHot />
            </div>
            <div className="vales-card-info">
              <span className="vales-card-label">Vale Refeição (VR)</span>
              <span className="vales-card-value">
                R$ {totals.vrCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                Quantidade: {totals.vrCount} d.
              </span>
            </div>
          </div>

          <div className="vales-summary-card">
            <div className="vales-card-icon-wrapper money">
              <Icons.BsCashStack />
            </div>
            <div className="vales-card-info">
              <span className="vales-card-label">Investimento Total</span>
              <span className="vales-card-value">
                R$ {totals.totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                {profiles.length} colaboradores
              </span>
            </div>
          </div>
        </div>

        {/* Tabela de Previsão */}
        <div className="calculo-vales-table-wrapper">
          {loading ? (
            <div className="vales-loading-state">
              <Icons.BsArrowClockwise className="vales-spin" style={{ fontSize: "2rem" }} />
              <p style={{ marginTop: "12px" }}>Carregando dados dos perfis...</p>
            </div>
          ) : error ? (
            <div className="vales-error-state">
              <Icons.BsExclamationTriangle style={{ fontSize: "2rem", color: "#ef4444" }} />
              <p style={{ marginTop: "12px" }}>{error}</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="vales-empty-state">
              <Icons.BsPeople style={{ fontSize: "2rem" }} />
              <p style={{ marginTop: "12px" }}>Nenhum colaborador elegível para VT/VR cadastrado.</p>
            </div>
          ) : (
            <table className="calculo-vales-table">
              <thead>
                <tr>
                  <th>Funcionário</th>
                  <th style={{ textAlign: "center", width: "100px" }}>Dias Base</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Descontos ({prevMonthLabel})</th>
                  <th style={{ textAlign: "center", width: "120px" }}>Dias Previstos</th>
                  <th style={{ width: "130px" }}>URBS (Qtd)</th>
                  <th style={{ width: "130px" }}>Metrocard (Qtd)</th>
                  <th style={{ width: "130px" }}>VR (Qtd)</th>
                  <th style={{ textAlign: "right", width: "130px" }}>Total Geral</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => {
                  const baseDays = calculateDefaultWorkdays(p, month, year);
                  const discount = prevMonthAttendance[p.id] || 0;
                  const days = adjustedDays[p.id] ?? 0;
                  const urbsQty = days * (p.passagens_urbs ?? 0);
                  const urbsCost = urbsQty * 6.00;
                  const metroQty = days * (p.passagens_metrocard ?? 0);
                  const metroCost = metroQty * 5.50;
                  const vrQty = days;
                  const vrCost = vrQty * 17.00;
                  const totalCost = urbsCost + metroCost + vrCost;

                  return (
                    <tr key={p.id}>
                      <td className="vales-td-name">
                        {p.name}
                        <div className="vales-td-subinfo">
                          Folgas: {getFixedOffDaysLabel(p.folgas_fixas)}
                          {p.data_registro && ` | Adm: ${formatDisplayDate(p.data_registro)}`}
                        </div>
                      </td>
                      <td style={{ textAlign: "center", fontWeight: "bold" }}>
                        {baseDays}
                      </td>
                      <td style={{ textAlign: "center", color: discount > 0 ? "#ef4444" : "inherit", fontWeight: discount > 0 ? "bold" : "normal" }}>
                        {discount}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="number"
                          min={0}
                          max={31}
                          className="vales-days-input"
                          value={adjustedDays[p.id] !== undefined ? adjustedDays[p.id] : ""}
                          onChange={(e) => handleDayChange(p.id, e.target.value)}
                        />
                      </td>
                      <td className="numeric">
                        {p.passagens_urbs && p.passagens_urbs > 0 ? (
                          <div className="vales-cell-container">
                            <div className="vales-cell-main">
                              <span className="vales-cell-qty">{urbsQty}</span>
                              <span className="vales-cell-badge urbs">x{p.passagens_urbs}/dia</span>
                            </div>
                            <div className="vales-cell-sub">
                              R$ {urbsCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        ) : (
                          <span className="vales-empty-cell">—</span>
                        )}
                      </td>
                      <td className="numeric">
                        {p.passagens_metrocard && p.passagens_metrocard > 0 ? (
                          <div className="vales-cell-container">
                            <div className="vales-cell-main">
                              <span className="vales-cell-qty">{metroQty}</span>
                              <span className="vales-cell-badge metrocard">x{p.passagens_metrocard}/dia</span>
                            </div>
                            <div className="vales-cell-sub">
                              R$ {metroCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        ) : (
                          <span className="vales-empty-cell">—</span>
                        )}
                      </td>
                      <td className="numeric">
                        {vrQty > 0 ? (
                          <div className="vales-cell-container">
                            <div className="vales-cell-main">
                              <span className="vales-cell-qty">{vrQty}</span>
                              <span className="vales-cell-badge vr">x1/dia</span>
                            </div>
                            <div className="vales-cell-sub">
                              R$ {vrCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        ) : (
                          <span className="vales-empty-cell">—</span>
                        )}
                      </td>
                      <td className="numeric" style={{ textAlign: "right", color: "var(--primary-color)", fontSize: "15px", fontWeight: "bold" }}>
                        {totalCost > 0 ? (
                          `R$ ${totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        ) : (
                          "—"
                        )}
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

export default CalculoVales;
