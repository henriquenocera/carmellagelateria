import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../supabase-client";
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

function CalculoVales() {
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const [profiles, setProfiles] = useState<Profile[]>([]);
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
        fetchProfiles();
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error("Erro ao verificar acesso:", err);
      setIsAuthorized(false);
    }
  }

  async function fetchProfiles() {
    try {
      setLoading(true);
      setError(null);
      const { data, error: dbError } = await supabase
        .from("profiles")
        .select("id, short_id, name, email, is_admin, controlar_frequencia, folgas_fixas, ativo, data_registro, passagens_urbs, passagens_metrocard")
        .order("name", { ascending: true });

      if (dbError) throw dbError;

      // Filter active profiles that have frequency control enabled
      const filtered = (data || []).filter(
        (p) => p.controlar_frequencia !== false && p.ativo !== false
      );
      setProfiles(filtered);
    } catch (err: any) {
      console.error("Erro ao buscar perfis:", err);
      setError("Falha ao carregar a lista de pessoas.");
    } finally {
      setLoading(false);
    }
  }

  // Pre-calculate working days based on month, year, registration date and weekly off-days
  const calculateDefaultWorkdays = (profile: Profile, targetMonth: number, targetYear: number) => {
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

      const dayOfWeek = String(dateObj.getDay());
      if (!fixedOffDays.includes(dayOfWeek)) {
        workdays++;
      }
    }
    return workdays;
  };

  // Populate adjustedDays whenever target period or profiles change
  useEffect(() => {
    const initialAdjustments: { [key: string]: number } = {};
    profiles.forEach((p) => {
      initialAdjustments[p.id] = calculateDefaultWorkdays(p, month, year);
    });
    setAdjustedDays(initialAdjustments);
  }, [profiles, month, year]);

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
    doc.text(`Referência: ${monthLabel} de ${year}`, 14, 27);
    doc.text(`Data de Geração: ${new Date().toLocaleDateString("pt-BR")}`, 14, 33);

    const tableRows = profiles.map((p) => {
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
      `${totals.urbsCount} (R$ ${totals.urbsCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
      `${totals.metrocardCount} (R$ ${totals.metrocardCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
      `${totals.vrCount} (R$ ${totals.vrCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`,
      `R$ ${totals.totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["Funcionário", "Dias Previstos", "URBS (R$ 6,00)", "Metrocard (R$ 5,50)", "VR (R$ 17,00)", "Valor Total"]],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [120, 78, 33], textColor: [255, 255, 255] },
      styles: { fontSize: 8.5 },
      columnStyles: {
        0: { fontStyle: "bold" },
        1: { halign: "center" },
        2: { halign: "left" },
        3: { halign: "left" },
        4: { halign: "left" },
        5: { halign: "right", fontStyle: "bold" }
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
                  <th style={{ textAlign: "center", width: "110px" }}>Dias Previstos</th>
                  <th style={{ width: "130px" }}>URBS (Qtd)</th>
                  <th style={{ width: "130px" }}>Metrocard (Qtd)</th>
                  <th style={{ width: "130px" }}>VR (Qtd)</th>
                  <th style={{ textAlign: "right", width: "130px" }}>Total Geral</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => {
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
                        {urbsQty} <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "normal" }}>(x{p.passagens_urbs || 0}/dia)</span>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", fontWeight: "normal" }}>
                          R$ {urbsCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="numeric">
                        {metroQty} <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "normal" }}>(x{p.passagens_metrocard || 0}/dia)</span>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", fontWeight: "normal" }}>
                          R$ {metroCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="numeric">
                        {vrQty} <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "normal" }}>(x1/dia)</span>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", fontWeight: "normal" }}>
                          R$ {vrCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="numeric" style={{ textAlign: "right", color: "var(--primary-color)" }}>
                        R$ {totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
