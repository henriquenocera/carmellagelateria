import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import ConfirmModal from "../components/ConfirmModal";
import "../css/Frequencia.css";

interface Profile {
  id: string;
  name: string;
  email: string;
  ativo?: boolean | null;
  data_registro?: string | null;
  folgas_fixas?: string | null;
  passagens_urbs?: number | null;
  passagens_metrocard?: number | null;
  controlar_frequencia?: boolean | null;
}

interface HistoricoRecord {
  id: number;
  employee_id: string;
  mes_referencia: number;
  ano_referencia: number;
  valor_vt?: number | null;
  valor_vr?: number | null;
  data_pagamento?: string | null;
  dias_previstos?: number | null;
  dias_desconto?: number | null;
  created_at: string;
  profile?: Profile;
}

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
  { value: 12, label: "Dezembro" },
];

function HistoricoVT_VR() {
  const { isAdmin } = useAuth();

  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [historico, setHistorico] = useState<HistoricoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form & Inline State
  const [submitting, setSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: () => { } });
  const [editId, setEditId] = useState<number | null>(null);

  const currentMonth = today.getMonth() + 1;
  const nextFormMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextFormYear = currentMonth === 12 ? today.getFullYear() + 1 : today.getFullYear();

  // Form State (Provisionamento)
  const [formEntries, setFormEntries] = useState<{ id: number, employee_id: string, dias_previstos: string, dias_desconto: string }[]>([
    { id: Date.now(), employee_id: "", dias_previstos: "", dias_desconto: "" }
  ]);
  const [formMonth, setFormMonth] = useState(nextFormMonth);
  const [formYear, setFormYear] = useState(nextFormYear);
  const [formDiasPrevistos, setFormDiasPrevistos] = useState("");
  const [formDiasDesconto, setFormDiasDesconto] = useState("");

  // Inline Editing State (Baixa)
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [inlineDataPgto, setInlineDataPgto] = useState("");
  const [inlineVt, setInlineVt] = useState("");
  const [inlineVr, setInlineVr] = useState("");
  const [inlineDias, setInlineDias] = useState("");
  const [inlineDesconto, setInlineDesconto] = useState("");

  const yearsList = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i);

  useEffect(() => {
    if (isAdmin) {
      fetchProfiles();
      fetchHistorico();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, month, year]);

  async function fetchProfiles() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, ativo, data_registro, folgas_fixas, passagens_urbs, passagens_metrocard, controlar_frequencia")
        .order("name", { ascending: true });
      if (error) throw error;
      setProfiles(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar perfis", err);
    }
  }

  const [calculatedDiscounts, setCalculatedDiscounts] = useState<{ [key: string]: { previstos: number, realizados: number, desconto: number, prevMonthLabel: string, currentMonthLabel: string } }>({});
  const [discountModalData, setDiscountModalData] = useState<{ previstos: number, realizados: number, desconto: number, prevMonthLabel: string, currentMonthLabel: string } | null>(null);

  async function fetchHistorico() {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("historico_pagamentos_vt_vr")
        .select(`
          *,
          profile:profiles(id, name, email, ativo, data_registro, folgas_fixas, passagens_urbs, passagens_metrocard)
        `)
        .eq("mes_referencia", month)
        .eq("ano_referencia", year)
      if (error) {
        console.error("Erro ao buscar histórico:", error);
        if (error.code === '42P01') {
          setError("Tabela não encontrada. Por favor, rode o script SQL para criá-la.");
        } else {
          setError("Falha ao carregar o histórico.");
        }
        setHistorico([]);
        return;
      }

      setHistorico(data || []);

      // Calculate automatic discounts from previous month
      if (data && data.length > 0) {
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        
        const startOfPrevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, "0")}-01`;
        const endOfPrevMonth = new Date(prevYear, prevMonth, 0);
        const endOfPrevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(endOfPrevMonth.getDate()).padStart(2, "0")}`;

        const [prevFreqRes, prevHistRes] = await Promise.all([
          supabase
            .from("frequencia")
            .select("employee_id, date, status")
            .gte("date", startOfPrevMonthStr)
            .lte("date", endOfPrevMonthStr),
          supabase
            .from("historico_pagamentos_vt_vr")
            .select("employee_id, dias_previstos")
            .eq("mes_referencia", prevMonth)
            .eq("ano_referencia", prevYear)
        ]);

        const prevFreqData = prevFreqRes.data || [];
        const prevHistData = prevHistRes.data || [];

        const prevHistMap: { [key: string]: number } = {};
        prevHistData.forEach((row: any) => {
          prevHistMap[row.employee_id] = row.dias_previstos || 0;
        });

        const prevAttMap: { [key: string]: string } = {};
        prevFreqData.forEach((row: any) => {
          prevAttMap[`${row.employee_id}_${row.date}`] = row.status;
        });

        const prevDatesList = [];
        for (let d = 1; d <= endOfPrevMonth.getDate(); d++) {
          prevDatesList.push(new Date(prevYear, prevMonth - 1, d));
        }

        const isWorkedStatus = (status: string) => [
          "Trabalhado",
          "Declaração de Horas",
          "Saída Antecipada",
          "Atraso",
          "Registro Formal",
          "Rescisão de Contrato",
          "Período de Teste",
          "Outro"
        ].includes(status);

        const newDiscounts: { [key: string]: { previstos: number, realizados: number, desconto: number, prevMonthLabel: string, currentMonthLabel: string } } = {};

        const currentMonthLabel = monthsList.find(m => m.value === month)?.label || "";
        const prevMonthLabel = monthsList.find(m => m.value === prevMonth)?.label || "";

        data.forEach(h => {
          if (!h.profile) return;
          const profile = h.profile;
          let countPrev = 0;
          const fixedOffDays = profile.folgas_fixas ? profile.folgas_fixas.split(",") : [];
          const regDate = profile.data_registro;

          prevDatesList.forEach((dateObj) => {
            const y = dateObj.getFullYear();
            const m = String(dateObj.getMonth() + 1).padStart(2, "0");
            const d = String(dateObj.getDate()).padStart(2, "0");
            const dateStr = `${y}-${m}-${d}`;

            if (regDate && dateStr < regDate) return;

            const cellKey = `${profile.id}_${dateStr}`;
            const weekdayVal = String(dateObj.getDay());
            const isFixedOff = fixedOffDays.includes(weekdayVal);
            const defaultStatus = isFixedOff ? "Folga Fixa Semanal" : "Trabalhado";

            const status = prevAttMap[cellKey] || defaultStatus;
            if (isWorkedStatus(status)) countPrev++;
          });

          const diasPrevistosMesAnterior = prevHistMap[profile.id] || 0;
          let desconto = 0;
          if (diasPrevistosMesAnterior > 0) {
            desconto = diasPrevistosMesAnterior - countPrev;
            if (desconto < 0) desconto = 0;
          }
          if (desconto > 0) {
            newDiscounts[profile.id] = {
              previstos: diasPrevistosMesAnterior,
              realizados: countPrev,
              desconto: desconto,
              prevMonthLabel,
              currentMonthLabel
            };
          }
        });

        setCalculatedDiscounts(newDiscounts);
      } else {
        setCalculatedDiscounts({});
      }

    } catch (err: any) {
      console.error("Erro ao carregar histórico", err);
      setError("Erro ao carregar os dados de pagamento.");
    } finally {
      setLoading(false);
    }
  }

  const handleMonthNavigation = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (month === 1) {
        setMonth(12);
        setYear((prev) => prev - 1);
      } else {
        setMonth((prev) => prev - 1);
      }
    } else {
      if (month === 12) {
        setMonth(1);
        setYear((prev) => prev + 1);
      } else {
        setMonth((prev) => prev + 1);
      }
    }
  };

  const getExpectedValues = (profile: Profile | undefined, recordDiasPrevistos: number | null | undefined, recordDiasDesconto: number | null | undefined) => {
    if (!profile) return { vtEsperado: 0, vtUrbs: 0, vtMetro: 0, vrEsperado: 0, workdays: 0 };

    const previstos = recordDiasPrevistos || 0;
    const desconto = recordDiasDesconto || 0;
    const workdays = Math.max(0, previstos - desconto);

    const urbs = profile.passagens_urbs || 0;
    const metro = profile.passagens_metrocard || 0;

    const vtUrbs = workdays * (urbs * 6.00);
    const vtMetro = workdays * (metro * 5.50);
    const vtEsperado = vtUrbs + vtMetro;
    const vrEsperado = workdays * 17.00;

    return { vtEsperado, vtUrbs, vtMetro, vrEsperado, workdays };
  };

  const clearForm = () => {
    setEditId(null);
    setFormEntries([{ id: Date.now(), employee_id: "", dias_previstos: "", dias_desconto: "" }]);
    setFormMonth(nextFormMonth);
    setFormYear(nextFormYear);
  };

  const handleAddEntry = () => {
    setFormEntries([...formEntries, { id: Date.now(), employee_id: "", dias_previstos: "", dias_desconto: "" }]);
  };

  const handleRemoveEntry = (id: number) => {
    if (formEntries.length > 1) {
      setFormEntries(formEntries.filter(e => e.id !== id));
    }
  };

  const handleEntryChange = (id: number, field: string, value: string) => {
    setFormEntries(formEntries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handlePrevisaoAutomatica = async () => {
    try {
      setLoading(true);

      // 1. Filtrar ativos e que controlam frequência
      const activeProfiles = profiles.filter(p => p.ativo !== false && p.controlar_frequencia !== false);

      if (activeProfiles.length === 0) {
        alert("Nenhum funcionário ativo encontrado.");
        setLoading(false);
        return;
      }

      // 2. Buscar dados da frequência do mês atual (para previsão)
      const startOfMonthStr = `${formYear}-${String(formMonth).padStart(2, "0")}-01`;
      const endOfMonth = new Date(formYear, formMonth, 0);
      const endOfMonthStr = `${formYear}-${String(formMonth).padStart(2, "0")}-${String(endOfMonth.getDate()).padStart(2, "0")}`;

      const { data: freqData, error: freqError } = await supabase
        .from("frequencia")
        .select("employee_id, date, status")
        .gte("date", startOfMonthStr)
        .lte("date", endOfMonthStr);

      if (freqError) throw freqError;

      // 2.5 Buscar dados do mês anterior (para calcular o desconto)
      const prevMonth = formMonth === 1 ? 12 : formMonth - 1;
      const prevYear = formMonth === 1 ? formYear - 1 : formYear;
      const startOfPrevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, "0")}-01`;
      const endOfPrevMonth = new Date(prevYear, prevMonth, 0);
      const endOfPrevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(endOfPrevMonth.getDate()).padStart(2, "0")}`;

      const { data: prevFreqData, error: prevFreqError } = await supabase
        .from("frequencia")
        .select("employee_id, date, status")
        .gte("date", startOfPrevMonthStr)
        .lte("date", endOfPrevMonthStr);

      if (prevFreqError) throw prevFreqError;

      const { data: prevHistData, error: prevHistError } = await supabase
        .from("historico_pagamentos_vt_vr")
        .select("employee_id, dias_previstos")
        .eq("mes_referencia", prevMonth)
        .eq("ano_referencia", prevYear);

      if (prevHistError) throw prevHistError;

      const prevHistMap: { [key: string]: number } = {};
      if (prevHistData) {
        prevHistData.forEach((row: any) => {
          prevHistMap[row.employee_id] = row.dias_previstos || 0;
        });
      }

      const attMap: { [key: string]: string } = {};
      if (freqData) {
        freqData.forEach((row: any) => {
          attMap[`${row.employee_id}_${row.date}`] = row.status;
        });
      }

      const prevAttMap: { [key: string]: string } = {};
      if (prevFreqData) {
        prevFreqData.forEach((row: any) => {
          prevAttMap[`${row.employee_id}_${row.date}`] = row.status;
        });
      }

      // 3. Montar as listas de datas
      const datesList = [];
      for (let d = 1; d <= endOfMonth.getDate(); d++) {
        datesList.push(new Date(formYear, formMonth - 1, d));
      }

      const prevDatesList = [];
      for (let d = 1; d <= endOfPrevMonth.getDate(); d++) {
        prevDatesList.push(new Date(prevYear, prevMonth - 1, d));
      }

      // 4. Calcular previsão para cada funcionário
      const newEntries = activeProfiles.map(profile => {
        let countAtual = 0;
        let countPrev = 0;
        const fixedOffDays = profile.folgas_fixas ? profile.folgas_fixas.split(",") : [];
        const regDate = profile.data_registro;

        const isWorkedStatus = (status: string) => [
          "Trabalhado",
          "Declaração de Horas",
          "Saída Antecipada",
          "Atraso",
          "Registro Formal",
          "Rescisão de Contrato",
          "Período de Teste",
          "Outro"
        ].includes(status);

        // Calcula para o mês atual (Previsão)
        datesList.forEach((dateObj) => {
          const y = dateObj.getFullYear();
          const m = String(dateObj.getMonth() + 1).padStart(2, "0");
          const d = String(dateObj.getDate()).padStart(2, "0");
          const dateStr = `${y}-${m}-${d}`;

          if (regDate && dateStr < regDate) return;

          const cellKey = `${profile.id}_${dateStr}`;
          const weekdayVal = String(dateObj.getDay());
          const isFixedOff = fixedOffDays.includes(weekdayVal);
          const defaultStatus = isFixedOff ? "Folga Fixa Semanal" : "Trabalhado";

          const status = attMap[cellKey] || defaultStatus;
          if (isWorkedStatus(status)) countAtual++;
        });

        // Calcula para o mês anterior (Trabalhados)
        prevDatesList.forEach((dateObj) => {
          const y = dateObj.getFullYear();
          const m = String(dateObj.getMonth() + 1).padStart(2, "0");
          const d = String(dateObj.getDate()).padStart(2, "0");
          const dateStr = `${y}-${m}-${d}`;

          if (regDate && dateStr < regDate) return;

          const cellKey = `${profile.id}_${dateStr}`;
          const weekdayVal = String(dateObj.getDay());
          const isFixedOff = fixedOffDays.includes(weekdayVal);
          const defaultStatus = isFixedOff ? "Folga Fixa Semanal" : "Trabalhado";

          const status = prevAttMap[cellKey] || defaultStatus;
          if (isWorkedStatus(status)) countPrev++;
        });

        const diasPrevistosMesAnterior = prevHistMap[profile.id] || 0;

        // O desconto é a diferença (se positiva) entre o que foi previsto e o que ele realmente trabalhou
        let desconto = 0;
        if (diasPrevistosMesAnterior > 0) {
          desconto = diasPrevistosMesAnterior - countPrev;
          if (desconto < 0) desconto = 0;
        }

        return {
          id: Date.now() + Math.random(),
          employee_id: profile.id,
          dias_previstos: countAtual.toString(),
          dias_desconto: desconto > 0 ? desconto.toString() : ""
        };
      });

      setFormEntries(newEntries);
    } catch (err: any) {
      console.error("Erro ao calcular previsão automática:", err);
      alert("Erro ao calcular previsão automática.");
    } finally {
      setLoading(false);
    }
  };

  const startInlineEdit = (record: HistoricoRecord) => {
    setEditingRowId(record.id);
    setInlineDataPgto(record.data_pagamento || "");
    setInlineVt(record.valor_vt ? record.valor_vt.toString() : "");
    setInlineVr(record.valor_vr ? record.valor_vr.toString() : "");
    setInlineDias(record.dias_previstos ? record.dias_previstos.toString() : "");
    setInlineDesconto(record.dias_desconto ? record.dias_desconto.toString() : "");
  };

  const cancelInlineEdit = () => {
    setEditingRowId(null);
  };

  const saveInlineEdit = async (id: number) => {
    try {
      const vt = inlineVt ? parseFloat(inlineVt.replace(',', '.')) : null;
      const vr = inlineVr ? parseFloat(inlineVr.replace(',', '.')) : null;
      const dias = inlineDias ? parseInt(inlineDias, 10) : null;
      const desc = inlineDesconto ? parseInt(inlineDesconto, 10) : null;
      const dp = inlineDataPgto || null;

      const { error } = await supabase
        .from("historico_pagamentos_vt_vr")
        .update({
          valor_vt: vt,
          valor_vr: vr,
          dias_previstos: dias,
          dias_desconto: desc,
          data_pagamento: dp
        })
        .eq("id", id);

      if (error) throw error;
      setEditingRowId(null);
      fetchHistorico();
    } catch (err: any) {
      console.error(err);
      alert("Erro ao atualizar pagamento.");
    }
  };

  const editRowRef = React.useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingRowId && editRowRef.current && !editRowRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        // Ignore clicks on cancel/delete buttons or modal
        if (target.closest('.cancel-btn') || target.closest('.confirm-modal') || target.closest('svg')) return;
        saveInlineEdit(editingRowId);
      }
    };

    if (editingRowId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingRowId, inlineVt, inlineVr, inlineDias, inlineDesconto, inlineDataPgto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasEmptyRequired = formEntries.some(entry => !entry.employee_id || !entry.dias_previstos);
    if (hasEmptyRequired || !formMonth || !formYear) {
      alert("Preencha Funcionário e Dias Previstos para todos os itens.");
      return;
    }

    setSubmitting(true);
    try {
      const payloads = formEntries.map(entry => {
        const dias = parseInt(entry.dias_previstos, 10);
        const desc = parseInt(entry.dias_desconto, 10) || null;

        return {
          employee_id: entry.employee_id,
          mes_referencia: formMonth,
          ano_referencia: formYear,
          dias_previstos: dias,
          dias_desconto: desc,
          valor_vt: null,
          valor_vr: null,
          data_pagamento: null
        };
      });

      if (editId) {
        // Edit mode
        const { error: updateError } = await supabase
          .from("historico_pagamentos_vt_vr")
          .update(payloads[0])
          .eq("id", editId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("historico_pagamentos_vt_vr")
          .upsert(payloads, { onConflict: 'employee_id, mes_referencia, ano_referencia' });
        if (insertError) throw insertError;
      }

      clearForm();

      // Se a data do formulário for diferente do filtro atual, muda o filtro para visualizar o lançamento
      if (month !== formMonth || year !== formYear) {
        setMonth(formMonth);
        setYear(formYear);
      } else {
        fetchHistorico();
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erro ao salvar lançamento.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      isOpen: true,
      message: "Tem certeza que deseja excluir este registro?",
      onConfirm: async () => {
        setConfirmModal({ isOpen: false, message: '', onConfirm: () => { } });
        try {
          setLoading(true);
          const { error } = await supabase
            .from("historico_pagamentos_vt_vr")
            .delete()
            .eq("id", id);
          if (error) throw error;
          fetchHistorico();
        } catch (err: any) {
          console.error(err);
          alert("Erro ao excluir o registro.");
          setLoading(false);
        }
      }
    });
  };

  if (!isAdmin) {
    return (
      <div className="frequencia-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Icons.BsShieldLock size={50} color="#dc2626" style={{ marginBottom: 20 }} />
          <h2>Acesso Negado</h2>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)' }}>Você não tem permissão para acessar o Histórico de Vales.</p>
        </div>
      </div>
    );
  }

  const filteredHistorico = selectedEmployee === "all"
    ? [...historico]
    : historico.filter(h => h.employee_id === selectedEmployee);

  filteredHistorico.sort((a, b) => {
    const nameA = a.profile?.name?.toLowerCase() || "";
    const nameB = b.profile?.name?.toLowerCase() || "";
    return nameA.localeCompare(nameB);
  });

  let totalEsperado = 0;
  let totalRealizado = 0;
  let totalUrbs = 0;
  let totalMetrocard = 0;
  let totalVr = 0;

  filteredHistorico.forEach(h => {
    const { vtEsperado, vtUrbs, vtMetro, vrEsperado } = getExpectedValues(h.profile, h.dias_previstos, h.dias_desconto);
    totalEsperado += vtEsperado + vrEsperado;
    totalRealizado += (Number(h.valor_vt) || 0) + (Number(h.valor_vr) || 0);
    totalUrbs += vtUrbs;
    totalMetrocard += vtMetro;
    totalVr += vrEsperado;
  });

  return (
    <>
      <Helmet>
        <title>Histórico VT/VR</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header">
          <div className="frequencia-title-group">
            <h1>Histórico de Pagamentos de VT e VR</h1>
            <p>Acompanhe os valores de Vale Transporte e Vale Refeição pagos aos funcionários mês a mês.</p>
          </div>

        </div>

        {/* Formulário Inline */}
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: "1.6rem", color: "var(--secondary-color)", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <Icons.BsPlusCircleFill style={{ color: "var(--primary-color)" }} />
            {editId ? "Editar Lançamento" : "Registrar Lançamento"}
          </h3>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {formEntries.map((entry, index) => (
              <div key={entry.id} style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
                {index === 0 ? (
                  <>
                    <div style={{ flex: "0 0 110px" }}>
                      <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)", marginBottom: "4px", display: "block" }}>Mês *</label>
                      <select required className="frequencia-select" value={formMonth} onChange={(e) => setFormMonth(Number(e.target.value))} style={{ width: "100%", height: "36px", fontSize: "1.1rem", padding: "0 8px" }} disabled={!!editId}>
                        {monthsList.map(m => (<option key={m.value} value={m.value}>{m.label}</option>))}
                      </select>
                    </div>
                    <div style={{ flex: "0 0 90px" }}>
                      <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)", marginBottom: "4px", display: "block" }}>Ano *</label>
                      <select required className="frequencia-select" value={formYear} onChange={(e) => setFormYear(Number(e.target.value))} style={{ width: "100%", height: "36px", fontSize: "1.1rem", padding: "0 8px" }} disabled={!!editId}>
                        {yearsList.map(y => (<option key={y} value={y}>{y}</option>))}
                      </select>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: "0 0 212px" }} /> // 110 + 90 + 12 gap
                )}

                <div style={{ flex: "1", minWidth: "150px" }}>
                  {index === 0 && <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)", marginBottom: "4px", display: "block" }}>Funcionário *</label>}
                  <select required className="frequencia-select" value={entry.employee_id} onChange={(e) => handleEntryChange(entry.id, 'employee_id', e.target.value)} style={{ width: "100%", height: "36px", fontSize: "1.1rem", padding: "0 8px" }} disabled={!!editId}>
                    <option value="" disabled>Selecionar...</option>
                    {profiles.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                  </select>
                </div>

                <div style={{ flex: "0 0 110px" }}>
                  {index === 0 && <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)", marginBottom: "4px", display: "block" }}>Dias Previstos *</label>}
                  <input type="number" required min="0" max="31" className="frequencia-select" placeholder="Ex: 22" value={entry.dias_previstos} onChange={(e) => handleEntryChange(entry.id, 'dias_previstos', e.target.value)} style={{ width: "100%", height: "36px", fontSize: "1.1rem", padding: "0 8px" }} />
                </div>

                <div style={{ flex: "0 0 110px" }}>
                  {index === 0 && <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)", marginBottom: "4px", display: "block" }}>Dias Desconto</label>}
                  <input type="number" min="0" max="31" className="frequencia-select" placeholder="Ex: 2" value={entry.dias_desconto} onChange={(e) => handleEntryChange(entry.id, 'dias_desconto', e.target.value)} style={{ width: "100%", height: "36px", fontSize: "1.1rem", padding: "0 8px" }} />
                </div>

                {formEntries.length > 1 && !editId && (
                  <button type="button" onClick={() => handleRemoveEntry(entry.id)} className="cancel-btn" style={{ height: "36px", padding: "0 12px", margin: 0, display: "flex", alignItems: "center" }} title="Remover">
                    <Icons.BsTrash style={{ fontSize: "1.2rem" }} />
                  </button>
                )}
              </div>
            ))}

            <div style={{ display: "flex", gap: "12px", alignItems: "center", paddingTop: "12px", flexWrap: "wrap" }}>
              {!editId && (
                <>
                  <button type="button" onClick={handleAddEntry} style={{ backgroundColor: "transparent", border: "1px dashed var(--primary-color)", color: "var(--primary-color)", padding: "8px 16px", borderRadius: "8px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icons.BsPlusLg /> Adicionar Outro Funcionário
                  </button>
                  <button type="button" onClick={handlePrevisaoAutomatica} disabled={loading} style={{ backgroundColor: "#e0e7ff", border: "none", color: "#4f46e5", padding: "8px 16px", borderRadius: "8px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }}>
                    <Icons.BsLightningChargeFill /> Previsão Automática
                  </button>
                </>
              )}

              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginLeft: "auto" }}>
                {editId && (
                  <button type="button" onClick={clearForm} className="cancel-btn" style={{ height: "42px", padding: "0 16px", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icons.BsX style={{ fontSize: "1.4rem" }} /> Cancelar
                  </button>
                )}
                <button type="submit" disabled={submitting || loading} className="primary-btn" style={{ height: "42px", padding: "0 24px", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsCheckCircleFill style={{ fontSize: "1.2rem" }} /> {submitting ? "Salvando..." : editId ? "Atualizar" : "Salvar Todos"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="frequencia-controls" style={{ flexWrap: "wrap", gap: "16px", marginBottom: "20px", padding: 0 }}>
          <div className="control-group">
            <button className="nav-btn" onClick={() => handleMonthNavigation("prev")} title="Mês Anterior">
              <Icons.BsChevronLeft />
            </button>

            <select
              className="frequencia-select"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {monthsList.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              className="frequencia-select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {yearsList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button className="nav-btn" onClick={() => handleMonthNavigation("next")} title="Próximo Mês">
              <Icons.BsChevronRight />
            </button>
          </div>

          <div className="control-group" style={{ marginLeft: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.BsPerson style={{ color: "var(--text-muted)", fontSize: "1.4rem" }} />
              <select
                className="frequencia-select"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                style={{ width: "220px" }}
              >
                <option value="all">Todos Funcionários</option>
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "3rem", color: "var(--primary-color)" }} />
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#fef2f2", borderRadius: "12px", border: "1px solid #fecaca" }}>
              <Icons.BsExclamationTriangle style={{ fontSize: "3rem", color: "#ef4444", marginBottom: "16px" }} />
              <p style={{ color: "#b91c1c", fontSize: "1.5rem", fontWeight: 600 }}>{error}</p>
              <p style={{ color: "#dc2626", fontSize: "1.3rem", marginTop: "8px" }}>Por favor, crie a tabela no Supabase primeiro.</p>
            </div>
          ) : filteredHistorico.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#fff", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
              <Icons.BsWallet2 style={{ fontSize: "4rem", color: "#94a3b8", marginBottom: "16px" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "1.5rem", fontWeight: 500 }}>Nenhum pagamento registrado para o período selecionado.</p>
              <p style={{ color: "#64748b", fontSize: "1.3rem", marginTop: "8px" }}>
                Você pode registrar lançamentos pelo formulário acima ou exportando da tela de Cálculo de Vales.
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: "20px", alignItems: "center", justifyContent: "flex-end", marginBottom: "16px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", backgroundColor: "#f1f5f9", padding: "10px 20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "1rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Total URBS</span>
                  <span style={{ fontSize: "1.5rem", color: "#475569", fontWeight: 700 }}>
                    R$ {totalUrbs.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", backgroundColor: "#f1f5f9", padding: "10px 20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "1rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Total Metrocard</span>
                  <span style={{ fontSize: "1.5rem", color: "#475569", fontWeight: 700 }}>
                    R$ {totalMetrocard.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", backgroundColor: "#f1f5f9", padding: "10px 20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "1rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Total VR</span>
                  <span style={{ fontSize: "1.5rem", color: "#475569", fontWeight: 700 }}>
                    R$ {totalVr.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ width: "2px", height: "40px", backgroundColor: "#cbd5e1", margin: "0 4px" }} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", backgroundColor: "#f8fafc", padding: "10px 20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "1.1rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Total Esperado</span>
                  <span style={{ fontSize: "1.8rem", color: "#64748b", fontWeight: 700 }}>
                    R$ {totalEsperado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", backgroundColor: "#f0fdf4", padding: "10px 20px", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                  <span style={{ fontSize: "1.1rem", color: "#166534", fontWeight: 600, textTransform: "uppercase" }}>Total Realizado</span>
                  <span style={{ fontSize: "1.8rem", color: "#15803d", fontWeight: 800 }}>
                    R$ {totalRealizado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
                <table className="freq-table" style={{ minWidth: "900px" }}>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{ textAlign: "left", verticalAlign: "middle" }}>Funcionário</th>
                      <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle", borderRight: "2px solid #e2e8f0" }}>
                        Mês / Ano
                        <span title="Mês de pgto e mês que será utilizado o crédito" style={{ marginLeft: "6px", color: "var(--primary-color)", cursor: "help" }}>
                          <Icons.BsInfoCircleFill size={12} />
                        </span>
                      </th>
                      <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle", borderRight: "2px solid #e2e8f0" }}>Data Pgto</th>
                      <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle", borderRight: "2px solid #e2e8f0" }}>
                        Dias<br/>Previstos<br/>
                        <span style={{ fontSize: "1rem", fontWeight: "normal", color: "#64748b" }}>({monthsList.find(m => m.value === month)?.label})</span>
                      </th>
                      <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle", borderRight: "2px solid #e2e8f0" }}>Dias<br />Desconto</th>
                      <th colSpan={2} style={{ textAlign: "center", borderRight: "2px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>VALOR VT</th>
                      <th colSpan={2} style={{ textAlign: "center", borderRight: "2px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>VALOR VR</th>
                      <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle" }}>Total Pago</th>
                      <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle", width: "100px" }}>Ações</th>
                    </tr>
                    <tr>
                      <th style={{ textAlign: "center", fontWeight: "normal", width: "130px" }}>
                        Esperado
                        <span title="Cálculo baseado nos dias úteis do mês SEGUINTE" style={{ marginLeft: "6px", color: "var(--primary-color)", cursor: "help" }}>
                          <Icons.BsInfoCircleFill size={12} />
                        </span>
                      </th>
                      <th style={{ textAlign: "center", borderRight: "2px solid #e2e8f0", width: "130px" }}>Pago</th>
                      <th style={{ textAlign: "center", fontWeight: "normal", width: "130px" }}>
                        Esperado
                        <span title="Cálculo baseado nos dias úteis do mês SEGUINTE" style={{ marginLeft: "6px", color: "var(--primary-color)", cursor: "help" }}>
                          <Icons.BsInfoCircleFill size={12} />
                        </span>
                      </th>
                      <th style={{ textAlign: "center", borderRight: "2px solid #e2e8f0", width: "130px" }}>Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistorico.map((h) => {
                      const vt = Number(h.valor_vt) || 0;
                      const vr = Number(h.valor_vr) || 0;
                      const total = vt + vr;
                      const monthLabel = monthsList.find(m => m.value === h.mes_referencia)?.label;

                      const { vtEsperado, vtUrbs, vtMetro, vrEsperado, workdays } = getExpectedValues(h.profile, h.dias_previstos, h.dias_desconto);

                      return (
                        <tr key={h.id} ref={editingRowId === h.id ? editRowRef : null}>
                          <td style={{ fontWeight: 600, color: "var(--secondary-color)" }}>
                            {h.profile?.name || "Funcionário Excluído"}
                          </td>
                          <td style={{ textAlign: "center", borderRight: "2px solid #e2e8f0", verticalAlign: "middle", padding: "12px 8px" }}>
                            <div style={{ fontWeight: 700, color: "var(--secondary-color)", fontSize: "1.3rem" }}>{monthLabel} / {h.ano_referencia}</div>
                          </td>
                          <td style={{ textAlign: "center", borderRight: "2px solid #e2e8f0", verticalAlign: "middle" }}>
                            {editingRowId === h.id ? (
                              <input
                                type="date"
                                value={inlineDataPgto}
                                onChange={(e) => setInlineDataPgto(e.target.value)}
                                style={{ width: "120px", height: "32px", padding: "4px 8px", fontSize: "1.1rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontFamily: "inherit", color: "var(--secondary-color)", outline: "none" }}
                              />
                            ) : h.data_pagamento ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: "8px", fontSize: "1.2rem", fontWeight: 600 }}>
                                <Icons.BsCalendarCheck style={{ fontSize: "1.1rem" }} />
                                {new Date(h.data_pagamento + 'T00:00:00').toLocaleDateString('pt-BR')}
                              </span>
                            ) : (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#94a3b8", fontSize: "1.2rem", fontWeight: 500 }}>
                                <Icons.BsClockHistory /> Pendente
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: "center", borderRight: "2px solid #e2e8f0", verticalAlign: "middle" }}>
                            {editingRowId === h.id ? (
                              <input
                                type="number"
                                min="0"
                                value={inlineDias}
                                onChange={(e) => setInlineDias(e.target.value)}
                                style={{ width: "60px", height: "32px", padding: "4px", fontSize: "1.2rem", border: "1px solid #cbd5e1", borderRadius: "6px", textAlign: "center", fontFamily: "inherit", color: "var(--secondary-color)", outline: "none" }}
                              />
                            ) : (
                              <span style={{ fontWeight: 600, color: "#475569" }}>{h.dias_previstos || 0}</span>
                            )}
                          </td>
                          <td style={{ textAlign: "center", borderRight: "2px solid #e2e8f0", verticalAlign: "middle" }}>
                            {h.profile && calculatedDiscounts[h.profile.id] && (
                              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                                <span style={{ display: "inline-block", backgroundColor: "#fffbeb", color: "#d97706", padding: "2px 8px", borderRadius: "12px", fontSize: "1rem", fontWeight: 600 }}>
                                  Calc: - {calculatedDiscounts[h.profile.id].desconto}
                                </span>
                                <Icons.BsQuestionCircle
                                  style={{ cursor: "pointer", color: "#d97706", fontSize: "1.1rem" }}
                                  onClick={() => setDiscountModalData(calculatedDiscounts[h.profile.id!])}
                                  title="Ver detalhes do cálculo"
                                />
                              </div>
                            )}
                            {editingRowId === h.id ? (
                              <input
                                type="number"
                                min="0"
                                value={inlineDesconto}
                                onChange={(e) => setInlineDesconto(e.target.value)}
                                style={{ width: "60px", height: "32px", padding: "4px", fontSize: "1.2rem", border: "1px solid #cbd5e1", borderRadius: "6px", textAlign: "center", fontFamily: "inherit", color: "var(--secondary-color)", outline: "none" }}
                              />
                            ) : (
                              <span style={{ fontWeight: 600, color: h.dias_desconto ? "#ef4444" : "#94a3b8" }}>
                                {h.dias_desconto ? `- ${h.dias_desconto}` : "-"}
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: "center", backgroundColor: "#f8fafc", verticalAlign: "middle" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#64748b" }}>
                              <Icons.BsGraphUpArrow style={{ fontSize: "1rem", opacity: 0.6 }} title="Previsão Total" />
                              <span style={{ fontWeight: 500, fontSize: "1.35rem" }}>R$ {vtEsperado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            {(vtUrbs > 0 || vtMetro > 0) && (
                              <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px", fontSize: "1.05rem", color: "#64748b", fontWeight: 500 }}>
                                {vtUrbs > 0 && <span>URBS: R$ {vtUrbs.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>}
                                {vtMetro > 0 && <span>METRO: R$ {vtMetro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>}
                              </div>
                            )}
                            <div style={{ marginTop: "6px" }}>
                              {editingRowId === h.id ? (
                                <span style={{ fontSize: "1.05rem", color: "#94a3b8", fontStyle: "italic", fontWeight: 500 }}>editando...</span>
                              ) : (
                                <span style={{ display: "inline-block", backgroundColor: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: 600 }}>
                                  {workdays} dias líquidos
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ textAlign: "center", color: "#334155", fontWeight: 800, borderRight: "2px solid #e2e8f0", fontSize: "1.45rem", verticalAlign: "middle" }}>
                            {editingRowId === h.id ? (
                              <input
                                type="number"
                                step="0.01"
                                value={inlineVt}
                                onChange={(e) => setInlineVt(e.target.value)}
                                placeholder="0,00"
                                style={{ width: "85px", height: "32px", padding: "4px 8px", fontSize: "1.2rem", border: "1px solid #cbd5e1", borderRadius: "6px", textAlign: "right", fontFamily: "inherit", color: "var(--secondary-color)", outline: "none" }}
                              />
                            ) : (
                              `R$ ${vt.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            )}
                          </td>
                          <td style={{ textAlign: "center", backgroundColor: "#f8fafc", verticalAlign: "middle" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#64748b" }}>
                              <Icons.BsGraphUpArrow style={{ fontSize: "1rem", opacity: 0.6 }} title="Previsão" />
                              <span style={{ fontWeight: 500, fontSize: "1.35rem" }}>R$ {vrEsperado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div style={{ marginTop: "4px" }}>
                              {editingRowId === h.id ? (
                                <span style={{ fontSize: "1.05rem", color: "#94a3b8", fontStyle: "italic", fontWeight: 500 }}>editando...</span>
                              ) : (
                                <span style={{ display: "inline-block", backgroundColor: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: "12px", fontSize: "1.1rem", fontWeight: 600 }}>
                                  {workdays} dias líquidos
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ textAlign: "center", color: "#334155", fontWeight: 800, borderRight: "2px solid #e2e8f0", fontSize: "1.45rem", verticalAlign: "middle" }}>
                            {editingRowId === h.id ? (
                              <input
                                type="number"
                                step="0.01"
                                value={inlineVr}
                                onChange={(e) => setInlineVr(e.target.value)}
                                placeholder="0,00"
                                style={{ width: "85px", height: "32px", padding: "4px 8px", fontSize: "1.2rem", border: "1px solid #cbd5e1", borderRadius: "6px", textAlign: "right", fontFamily: "inherit", color: "var(--secondary-color)", outline: "none" }}
                              />
                            ) : (
                              `R$ ${vr.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            )}
                          </td>
                          <td style={{ textAlign: "center", color: "#10b981", fontWeight: "900", fontSize: "1.5rem", verticalAlign: "middle" }}>
                            R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center", verticalAlign: "middle", height: "100%", padding: "12px 8px" }}>
                            {editingRowId === h.id ? (
                              <>
                                <button
                                  onClick={() => saveInlineEdit(h.id)}
                                  className="primary-btn"
                                  title="Salvar"
                                  style={{ margin: 0, padding: "6px 10px", fontSize: "1rem" }}
                                >
                                  <Icons.BsCheckCircleFill />
                                </button>
                                <button
                                  onClick={cancelInlineEdit}
                                  className="cancel-btn"
                                  title="Cancelar"
                                  style={{ margin: 0, padding: "6px 10px", fontSize: "1rem" }}
                                >
                                  <Icons.BsX />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startInlineEdit(h)}
                                  className="delete-record-btn"
                                  title="Baixar / Editar Pagamento"
                                  style={{ margin: 0, color: "#3b82f6" }}
                                >
                                  <Icons.BsPencil />
                                </button>
                                <button
                                  onClick={() => handleDelete(h.id)}
                                  className="delete-record-btn"
                                  title="Excluir Lançamento"
                                  style={{ margin: 0 }}
                                >
                                  <Icons.BsTrash />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de Detalhes de Desconto */}
      {discountModalData && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", width: "450px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h3 style={{ marginTop: 0, marginBottom: "16px", color: "var(--secondary-color)" }}>Detalhes do Desconto Automático</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "#475569", fontSize: "1.1rem" }}>
              <div>Dias de trabalho previsto no mês de {discountModalData.prevMonthLabel}: <strong>{discountModalData.previstos}</strong></div>
              <div>Dias de trabalho realizado no mês de {discountModalData.prevMonthLabel}: <strong>{discountModalData.realizados}</strong></div>
              <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "4px 0" }} />
              <div style={{ color: "#d97706", fontWeight: 600 }}>Dias de Desconto a realizar no mês de {discountModalData.currentMonthLabel}: <strong>{discountModalData.desconto}</strong></div>
            </div>
            <div style={{ marginTop: "24px", textAlign: "right" }}>
              <button 
                onClick={() => setDiscountModalData(null)}
                style={{ backgroundColor: "var(--primary-color)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => { } })}
        confirmText="Excluir"
      />
    </>
  );
}

export default HistoricoVT_VR;
