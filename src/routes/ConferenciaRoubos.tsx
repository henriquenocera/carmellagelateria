import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import { useAuth } from "../AuthProvider";
import supabase from "../services/supabase-client";

interface MapeamentoVenda {
  nomeVendas: string;
  qntd: string;
}

interface MapeamentoVales {
  nomeVales: string;
  qntd: string;
}

interface MapeamentoEntrada {
  nomeEntrada: string;
  qntd: string;
}

interface ConferenciaItem {
  id: string;
  nome: string;
  mapeamentos?: MapeamentoVenda[];
  mapeamentosVales?: MapeamentoVales[];
  mapeamentosEntradas?: MapeamentoEntrada[];
  // dados da conferência (6 colunas)
  ultimoInforme?: string;
  vendas?: string;
  vales?: string;
  entradas?: string;
  previsto?: string;
  qntdReal?: string;
}

const ConferenciaRoubos: React.FC = () => {
  const { isAdmin } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tabela Itens cadastrados (Supabase)
  const [itens, setItens] = useState<ConferenciaItem[]>([]);
  const [loadingItens, setLoadingItens] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingItem, setSavingItem] = useState(false);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [lojaConferencia, setLojaConferencia] = useState("Alto da XV");
  const [showInformarModal, setShowInformarModal] = useState(false);
  const [dataInforme, setDataInforme] = useState(() => new Date().toISOString().split("T")[0]);
  const [qntdsInforme, setQntdsInforme] = useState<Record<string, string>>({});
  const [savingInforme, setSavingInforme] = useState(false);
  const [informes, setInformes] = useState<any[]>([]);
  const [formData, setFormData] = useState<{ nome: string; mapeamentos: MapeamentoVenda[]; mapeamentosVales: MapeamentoVales[]; mapeamentosEntradas: MapeamentoEntrada[] }>({
    nome: "",
    mapeamentos: [{ nomeVendas: "", qntd: "" }],
    mapeamentosVales: [{ nomeVales: "", qntd: "" }],
    mapeamentosEntradas: [{ nomeEntrada: "", qntd: "" }],
  });

  const detectDelimiter = (line: string): string => {
    const semis = (line.match(/;/g) || []).length;
    const commas = (line.match(/,/g) || []).length;
    const tabs = (line.match(/\t/g) || []).length;
    if (tabs > semis && tabs > commas) return "\t";
    if (semis >= commas) return ";";
    return ",";
  };

  const splitLine = (line: string, delimiter: string): string[] => {
    // split simples respeitando aspas duplas
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result.map((c) => c.replace(/^"|"$/g, "").trim());
  };

  const parseCSV = (content: string) => {
    const lines = content.split(/\r?\n/).filter((l) => l.trim() !== "");
    if (lines.length < 2) throw new Error("Arquivo CSV vazio ou sem dados.");
    const delimiter = detectDelimiter(lines[0]);
    const parsedHeaders = splitLine(lines[0], delimiter);
    const parsedRows: string[][] = [];
    for (let i = 1; i < lines.length; i++) {
      parsedRows.push(splitLine(lines[i], delimiter));
    }
    return { parsedHeaders, parsedRows };
  };

  const handleFileSelection = (selected: File | undefined | null) => {
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(".csv")) {
      alert("Por favor, selecione apenas arquivos .CSV");
      return;
    }
    setFile(selected);
    setHeaders([]);
    setRows([]);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(e.target.files?.[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files?.[0]);
  };

  const processFile = () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { parsedHeaders, parsedRows } = parseCSV(content);
        setHeaders(parsedHeaders);
        setRows(parsedRows);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erro ao ler o arquivo.");
        setHeaders([]);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Erro ao ler o arquivo.");
      setLoading(false);
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleClear = () => {
    setFile(null);
    setHeaders([]);
    setRows([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fetchItens = async () => {
    try {
      setLoadingItens(true);
      const { data, error } = await supabase.from("conferencia_roubos_itens").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      let mapped: ConferenciaItem[] = (data || []).map((row: any) => ({
        id: row.id,
        nome: row.nome,
        mapeamentos: row.mapeamentos || [],
        mapeamentosVales: row.mapeamentos_vales || [],
        mapeamentosEntradas: row.mapeamentos_entradas || [],
        ultimoInforme: row.ultimo_informe || "",
        vendas: row.vendas || "",
        vales: row.vales || "",
        entradas: row.entradas || "",
        previsto: row.previsto || "",
        qntdReal: row.qntd_real || "",
      }));
      // Migração única do localStorage antigo para o banco
      if (mapped.length === 0) {
        const stored = localStorage.getItem("conferencia_roubos_tabela");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              for (const it of parsed) {
                const payload: any = {
                  id: it.id || Date.now().toString() + Math.random().toString(36).slice(2, 6),
                  nome: it.nome || "",
                  mapeamentos: it.mapeamentos || [],
                  mapeamentos_vales: it.mapeamentosVales || [],
                  mapeamentos_entradas: it.mapeamentosEntradas || [],
                  ultimo_informe: it.ultimoInforme || "",
                  vendas: it.vendas || "",
                  vales: it.vales || "",
                  entradas: it.entradas || "",
                  previsto: it.previsto || "",
                  qntd_real: it.qntdReal || "",
                };
                await supabase.from("conferencia_roubos_itens").insert([payload]);
              }
              localStorage.removeItem("conferencia_roubos_tabela");
              const { data: data2 } = await supabase.from("conferencia_roubos_itens").select("*").order("created_at", { ascending: false });
              mapped = (data2 || []).map((row: any) => ({
                id: row.id,
                nome: row.nome,
                mapeamentos: row.mapeamentos || [],
                mapeamentosVales: row.mapeamentos_vales || [],
                mapeamentosEntradas: row.mapeamentos_entradas || [],
                ultimoInforme: row.ultimo_informe || "",
                vendas: row.vendas || "",
                vales: row.vales || "",
                entradas: row.entradas || "",
                previsto: row.previsto || "",
                qntdReal: row.qntd_real || "",
              }));
            }
          } catch {}
        }
      }
      setItens(mapped);
    } catch (err) {
      console.error("Erro ao buscar itens da conferência:", err);
    } finally {
      setLoadingItens(false);
    }
  };

  const fetchInformes = async () => {
    try {
      const { data, error } = await supabase.from("conferencia_roubos_informes").select("*").order("data", { ascending: false });
      if (error) throw error;
      setInformes(data || []);
    } catch (err) {
      console.error("Erro ao buscar informes:", err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchItens();
      fetchInformes();
    } else setLoadingItens(false);
  }, [isAdmin]);

  const handleOpenModal = () => {
    setFormData({ nome: "", mapeamentos: [{ nomeVendas: "", qntd: "" }], mapeamentosVales: [{ nomeVales: "", qntd: "" }], mapeamentosEntradas: [{ nomeEntrada: "", qntd: "" }] });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditItem = (item: ConferenciaItem) => {
    setFormData({
      nome: (item as any).nome || "",
      mapeamentos: item.mapeamentos && item.mapeamentos.length > 0 ? item.mapeamentos : [{ nomeVendas: "", qntd: "" }],
      mapeamentosVales: item.mapeamentosVales && item.mapeamentosVales.length > 0 ? item.mapeamentosVales : [{ nomeVales: "", qntd: "" }],
      mapeamentosEntradas: (item as any).mapeamentosEntradas && (item as any).mapeamentosEntradas.length > 0 ? (item as any).mapeamentosEntradas : [{ nomeEntrada: "", qntd: "" }],
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleAddMapeamento = () => {
    setFormData((prev) => ({ ...prev, mapeamentos: [...prev.mapeamentos, { nomeVendas: "", qntd: "" }] }));
  };

  const handleRemoveMapeamento = (idx: number) => {
    setFormData((prev) => ({ ...prev, mapeamentos: prev.mapeamentos.filter((_, i) => i !== idx) }));
  };

  const handleChangeMapeamento = (idx: number, field: keyof MapeamentoVenda, value: string) => {
    setFormData((prev) => {
      const copy = [...prev.mapeamentos];
      copy[idx] = { ...copy[idx], [field]: value };
      return { ...prev, mapeamentos: copy };
    });
  };

  const handleAddMapeamentoVales = () => {
    setFormData((prev) => ({ ...prev, mapeamentosVales: [...prev.mapeamentosVales, { nomeVales: "", qntd: "" }] }));
  };

  const handleRemoveMapeamentoVales = (idx: number) => {
    setFormData((prev) => ({ ...prev, mapeamentosVales: prev.mapeamentosVales.filter((_, i) => i !== idx) }));
  };

  const handleChangeMapeamentoVales = (idx: number, field: keyof MapeamentoVales, value: string) => {
    setFormData((prev) => {
      const copy = [...prev.mapeamentosVales];
      copy[idx] = { ...copy[idx], [field]: value };
      return { ...prev, mapeamentosVales: copy };
    });
  };

  const handleAddMapeamentoEntradas = () => {
    setFormData((prev) => ({ ...prev, mapeamentosEntradas: [...prev.mapeamentosEntradas, { nomeEntrada: "", qntd: "" }] }));
  };

  const handleRemoveMapeamentoEntradas = (idx: number) => {
    setFormData((prev) => ({ ...prev, mapeamentosEntradas: prev.mapeamentosEntradas.filter((_, i) => i !== idx) }));
  };

  const handleChangeMapeamentoEntradas = (idx: number, field: keyof MapeamentoEntrada, value: string) => {
    setFormData((prev) => {
      const copy = [...prev.mapeamentosEntradas];
      copy[idx] = { ...copy[idx], [field]: value };
      return { ...prev, mapeamentosEntradas: copy };
    });
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) {
      alert("Informe o Nome do item.");
      return;
    }
    const mapeamentosFiltrados = formData.mapeamentos.filter((m) => m.nomeVendas.trim() !== "" && m.qntd.trim() !== "");
    const mapeamentosValesFiltrados = formData.mapeamentosVales.filter((m) => m.nomeVales.trim() !== "" && m.qntd.trim() !== "");
    const mapeamentosEntradasFiltrados = formData.mapeamentosEntradas.filter((m) => m.nomeEntrada.trim() !== "" && m.qntd.trim() !== "");
    try {
      setSavingItem(true);
      if (editingId) {
        const { error } = await supabase
          .from("conferencia_roubos_itens")
          .update({
            nome: formData.nome.trim(),
            mapeamentos: mapeamentosFiltrados,
            mapeamentos_vales: mapeamentosValesFiltrados,
            mapeamentos_entradas: mapeamentosEntradasFiltrados,
          })
          .eq("id", editingId);
        if (error) throw error;
        setItens((prev) => prev.map((it) => (it.id === editingId ? { ...it, nome: formData.nome.trim(), mapeamentos: mapeamentosFiltrados, mapeamentosVales: mapeamentosValesFiltrados, mapeamentosEntradas: mapeamentosEntradasFiltrados } : it)));
      } else {
        const newId = Date.now().toString();
        const payloadDb = {
          id: newId,
          nome: formData.nome.trim(),
          mapeamentos: mapeamentosFiltrados,
          mapeamentos_vales: mapeamentosValesFiltrados,
          mapeamentos_entradas: mapeamentosEntradasFiltrados,
          ultimo_informe: "",
          vendas: "",
          vales: "",
          entradas: "",
          previsto: "",
          qntd_real: "",
        };
        const { error } = await supabase.from("conferencia_roubos_itens").insert([payloadDb]);
        if (error) throw error;
        const newItem: ConferenciaItem = { id: newId, nome: formData.nome.trim(), mapeamentos: mapeamentosFiltrados, mapeamentosVales: mapeamentosValesFiltrados, mapeamentosEntradas: mapeamentosEntradasFiltrados, ultimoInforme: "", vendas: "", vales: "", entradas: "", previsto: "", qntdReal: "" };
        setItens((prev) => [newItem, ...prev]);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ nome: "", mapeamentos: [{ nomeVendas: "", qntd: "" }], mapeamentosVales: [{ nomeVales: "", qntd: "" }], mapeamentosEntradas: [{ nomeEntrada: "", qntd: "" }] });
    } catch (err: any) {
      console.error("Erro ao salvar item:", err);
      alert("Erro ao salvar no banco: " + (err.message || "verifique se rodou o SQL"));
    } finally {
      setSavingItem(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Excluir este item?")) return;
    try {
      const { error } = await supabase.from("conferencia_roubos_itens").delete().eq("id", id);
      if (error) throw error;
      setItens((prev) => prev.filter((it) => it.id !== id));
    } catch (err: any) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir: " + (err.message || ""));
    }
  };

  const handleUpdateConferencia = async (id: string, field: "ultimoInforme" | "vendas" | "vales" | "entradas" | "previsto" | "qntdReal", value: string) => {
    // otimista local
    setItens((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
    const columnMap: Record<string, string> = {
      ultimoInforme: "ultimo_informe",
      vendas: "vendas",
      vales: "vales",
      entradas: "entradas",
      previsto: "previsto",
      qntdReal: "qntd_real",
    };
    try {
      const { error } = await supabase.from("conferencia_roubos_itens").update({ [columnMap[field]]: value }).eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao atualizar conferência:", err);
    }
  };

  const handleOpenInformarModal = () => {
    setDataInforme(new Date().toISOString().split("T")[0]);
    setQntdsInforme({});
    setShowInformarModal(true);
  };

  const handleSaveInforme = async () => {
    if (!dataInforme) {
      alert("Informe a data.");
      return;
    }
    const preenchidos = itens.filter((it) => (qntdsInforme[it.id] || "").trim() !== "");
    if (preenchidos.length === 0) {
      alert("Informe a qntd atual de ao menos um item.");
      return;
    }
    try {
      setSavingInforme(true);
      const payload = preenchidos.map((it) => ({
        item_id: it.id,
        data: dataInforme,
        loja: lojaConferencia,
        qntd: qntdsInforme[it.id].trim(),
      }));
      const { error } = await supabase.from("conferencia_roubos_informes").insert(payload);
      if (error) throw error;
      // atualiza Último Informe dos itens informados (mantido para compatibilidade)
      await supabase
        .from("conferencia_roubos_itens")
        .update({ ultimo_informe: dataInforme })
        .in("id", preenchidos.map((it) => it.id));
      setItens((prev) => prev.map((it) => (qntdsInforme[it.id]?.trim() ? { ...it, ultimoInforme: dataInforme } : it)));
      await fetchInformes();
      setShowInformarModal(false);
      setQntdsInforme({});
    } catch (err: any) {
      console.error("Erro ao salvar informe:", err);
      alert("Erro ao salvar no banco: " + (err.message || "verifique se rodou o SQL conferencia_roubos_informes"));
    } finally {
      setSavingInforme(false);
    }
  };

  const getQntdUltimoInforme = (itemId: string) => {
    let filtered = informes.filter((inf: any) => inf.item_id === itemId);
    if (lojaConferencia) filtered = filtered.filter((inf: any) => inf.loja === lojaConferencia);
    if (dataInicial) filtered = filtered.filter((inf: any) => inf.data >= dataInicial);
    if (dataFinal) filtered = filtered.filter((inf: any) => inf.data <= dataFinal);
    if (filtered.length === 0) return "";
    filtered.sort((a: any, b: any) => {
      if (a.data !== b.data) return b.data.localeCompare(a.data);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return filtered[0].qntd;
  };

  if (!isAdmin) {
    return (
      <div className="frequencia-container" style={{ padding: "40px 40px 40px 115px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <Icons.BsShieldLock style={{ fontSize: "3.5rem", color: "#ef4444", marginBottom: "16px" }} />
          <h2 style={{ color: "#334155", margin: "0 0 8px 0" }}>Acesso Restrito</h2>
          <p style={{ color: "#64748b", fontSize: "1.2rem", margin: 0 }}>Esta página é exclusiva para administradores (Operações — Conferência Roubos).</p>
        </div>
      </div>
    );
  }

  const previewRows = rows.slice(0, 50);

  return (
    <>
      <Helmet>
        <title>Conferência Roubos - Operações</title>
      </Helmet>

      <div className="frequencia-container" style={{ padding: "40px 40px 40px 115px", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "2.6rem", color: "#7c2d12", margin: "0 0 8px 0", fontWeight: 700, display: "flex", alignItems: "center", gap: "12px" }}>
              <Icons.BsShieldExclamation style={{ color: "#dc2626" }} /> Conferência Roubos
            </h1>
            <p style={{ color: "#64748b", fontSize: "1.3rem", margin: 0 }}>
              Importe o relatório CSV das vendas realizadas para iniciar a conferência.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={handleOpenInformarModal}
              style={{ padding: "10px 18px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "1.3rem", boxShadow: "0 2px 6px rgba(37,99,235,0.25)" }}
            >
              <Icons.BsClipboardCheck /> Informar
            </button>
            <button
              onClick={handleOpenModal}
              style={{ padding: "10px 18px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "1.3rem", boxShadow: "0 2px 6px rgba(22,163,74,0.25)" }}
            >
              <Icons.BsPlusLg /> Cadastrar Novo Item
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fef2f2", border: "1px solid #fecaca", padding: "8px 14px", borderRadius: "10px", color: "#991b1b", fontWeight: 700, fontSize: "1.15rem" }}>
              <Icons.BsShieldLock /> Admin
            </div>
          </div>
        </div>

        {/* Campo de import CSV */}
        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 6px 0", fontSize: "1.5rem", color: "#334155", display: "flex", alignItems: "center", gap: "8px" }}>
            <Icons.BsFileEarmarkSpreadsheet /> Importar relatório CSV — Vendas Realizadas
          </h3>
          <p style={{ color: "#64748b", fontSize: "1.25rem", margin: "0 0 18px 0" }}>
            Selecione o arquivo <strong>.CSV</strong> do relatório de vendas realizadas. O conteúdo será lido e exibido abaixo para conferência.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "560px", margin: "0 auto" }}>
            <div
              style={{
                border: `2px dashed ${isDragging ? "#3b82f6" : "#cbd5e1"}`,
                borderRadius: "10px",
                padding: "32px 20px",
                textAlign: "center",
                backgroundColor: isDragging ? "#eff6ff" : "#f8fafc",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Icons.BsCloudUpload style={{ fontSize: "3rem", color: isDragging ? "#3b82f6" : "#94a3b8", marginBottom: "10px" }} />
              <div style={{ fontSize: "1.4rem", color: "#475569", fontWeight: "bold", wordBreak: "break-all" }}>
                {file ? file.name : "Clique para selecionar ou arraste o arquivo .CSV aqui"}
              </div>
              <div style={{ fontSize: "1.15rem", color: "#94a3b8", marginTop: "6px" }}>
                {file ? `${(file.size / 1024).toFixed(1)} KB` : "Apenas arquivos .csv"}
              </div>
              <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={processFile}
                disabled={!file || loading}
                style={{
                  flex: 1,
                  padding: "12px",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  background: !file || loading ? "#cbd5e1" : "#16a34a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: !file || loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? <Icons.BsHourglassSplit /> : <Icons.BsPlayCircle />}
                {loading ? "Lendo arquivo..." : "Importar CSV"}
              </button>
              {(file || rows.length > 0) && (
                <button
                  onClick={handleClear}
                  disabled={loading}
                  style={{
                    padding: "12px 18px",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Icons.BsTrash /> Limpar
                </button>
              )}
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: "10px 14px", borderRadius: "8px", fontSize: "1.25rem" }}>
                <Icons.BsExclamationTriangleFill style={{ marginRight: "6px" }} />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Preview do CSV importado */}
        {headers.length > 0 && (
          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "1.4rem", color: "#334155", display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsTable /> Dados importados
              </h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "5px 12px", borderRadius: "20px", fontSize: "1.15rem", fontWeight: 700, color: "#334155" }}>
                  {rows.length} linhas
                </span>
                <span style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "5px 12px", borderRadius: "20px", fontSize: "1.15rem", fontWeight: 700, color: "#334155" }}>
                  {headers.length} colunas
                </span>
              </div>
            </div>

            <div style={{ overflowX: "auto", maxHeight: "60vh", overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
              <table className="freq-table" style={{ minWidth: "800px" }}>
                <thead>
                  <tr>
                    {headers.map((h, idx) => (
                      <th key={idx} style={{ textAlign: "left", whiteSpace: "nowrap" }}>{h || `Coluna ${idx + 1}`}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {headers.map((_, cIdx) => (
                        <td key={cIdx} style={{ padding: "8px 10px", whiteSpace: "nowrap", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }} title={row[cIdx] ?? ""}>
                          {row[cIdx] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > previewRows.length && (
              <p style={{ color: "#94a3b8", fontSize: "1.15rem", margin: "10px 0 0 0" }}>
                Exibindo as primeiras {previewRows.length} linhas de {rows.length}.
              </p>
            )}
          </div>
        )}

        {/* Tabela Itens cadastrados */}
        <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
            <h3 style={{ margin: 0, fontSize: "1.4rem", color: "#334155", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.BsCollection /> Itens cadastrados
            </h3>
            <span style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "5px 12px", borderRadius: "20px", fontSize: "1.15rem", fontWeight: 700, color: "#334155" }}>
              {itens.length} {itens.length === 1 ? "linha" : "linhas"}
            </span>
          </div>

          <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
            <table className="freq-table" style={{ minWidth: "900px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", minWidth: "160px" }}>Nome</th>
                  <th style={{ textAlign: "left", minWidth: "220px" }}>Nome no Vendas</th>
                  <th style={{ textAlign: "left", minWidth: "220px" }}>Nome no Vales</th>
                  <th style={{ textAlign: "left", minWidth: "220px" }}>Entradas de Estoque</th>
                  <th style={{ width: "90px", textAlign: "center" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loadingItens ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "28px", color: "#64748b" }}><Icons.BsArrowClockwise className="spin" /> Carregando...</td>
                  </tr>
                ) : itens.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "28px", color: "#94a3b8" }}>
                      Nenhum item cadastrado. Clique em "Cadastrar Novo Item" no topo da página.
                    </td>
                  </tr>
                ) : (
                  itens.map((item) => (
                    <tr key={item.id}>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1e293b" }}>{(item as any).nome || "-"}</td>
                      <td style={{ padding: "10px 12px" }}>
                        {item.mapeamentos && item.mapeamentos.length > 0 ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {item.mapeamentos.map((m, i) => (
                              <span key={i} title={`${m.nomeVendas} → ${m.qntd}`} style={{ background: "#fefce8", border: "1px solid #fde68a", padding: "2px 6px", borderRadius: "10px", fontSize: "0.95rem", color: "#92400e", fontWeight: 600 }}>
                                {m.nomeVendas} → {m.qntd}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        {item.mapeamentosVales && item.mapeamentosVales.length > 0 ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {item.mapeamentosVales.map((m, i) => (
                              <span key={i} title={`${m.nomeVales} → ${m.qntd}`} style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "2px 6px", borderRadius: "10px", fontSize: "0.95rem", color: "#065f46", fontWeight: 600 }}>
                                {m.nomeVales} → {m.qntd}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        {(item as any).mapeamentosEntradas && (item as any).mapeamentosEntradas.length > 0 ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {(item as any).mapeamentosEntradas.map((m: any, i: number) => (
                              <span key={i} title={`${m.nomeEntrada} → ${m.qntd}`} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "2px 6px", borderRadius: "10px", fontSize: "0.95rem", color: "#1e40af", fontWeight: 600 }}>
                                {m.nomeEntrada} → {m.qntd}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>-</span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          <button onClick={() => handleEditItem(item)} title="Editar" style={{ padding: "6px 8px", background: "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", color: "#475569" }}>
                            <Icons.BsPencil />
                          </button>
                          <button onClick={() => handleDeleteItem(item.id)} title="Excluir" style={{ padding: "6px 8px", background: "#fff", border: "1px solid #fecaca", borderRadius: "6px", cursor: "pointer", color: "#dc2626" }}>
                            <Icons.BsTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabela Conferência - 6 colunas puxando itens cadastrados */}
        <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", marginTop: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
            <h3 style={{ margin: 0, fontSize: "1.4rem", color: "#334155", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.BsClipboardCheck /> Conferência
            </h3>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <label style={{ fontSize: "1.15rem", fontWeight: 700, color: "#475569" }}>Loja:</label>
                <select value={lojaConferencia} onChange={(e) => setLojaConferencia(e.target.value)} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1.2rem", fontWeight: 600, background: "#fff", minWidth: "140px" }}>
                  <option value="Ahu">Ahu</option>
                  <option value="Alto da XV">Alto da XV</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <label style={{ fontSize: "1.15rem", fontWeight: 700, color: "#475569" }}>Data inicial:</label>
                <input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1.2rem" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <label style={{ fontSize: "1.15rem", fontWeight: 700, color: "#475569" }}>Data final:</label>
                <input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1.2rem" }} />
              </div>
            </div>
          </div>
          <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
            <table className="freq-table" style={{ minWidth: "950px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", minWidth: "160px" }}>Nome</th>
                  <th style={{ textAlign: "center", minWidth: "130px" }}>Último Informe</th>
                  <th style={{ textAlign: "center", minWidth: "110px" }}>Vendas</th>
                  <th style={{ textAlign: "center", minWidth: "110px" }}>Vales</th>
                  <th style={{ textAlign: "center", minWidth: "110px" }}>Entradas</th>
                  <th style={{ textAlign: "center", minWidth: "110px" }}>Previsto</th>
                  <th style={{ textAlign: "center", minWidth: "110px" }}>Qntd Real</th>
                </tr>
              </thead>
              <tbody>
                {loadingItens ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "28px", color: "#64748b" }}><Icons.BsArrowClockwise className="spin" /> Carregando itens do banco...</td>
                  </tr>
                ) : itens.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "28px", color: "#94a3b8" }}>Nenhum item cadastrado.</td>
                  </tr>
                ) : (
                  itens.map((item) => (
                    <tr key={item.id}>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1e293b" }}>{item.nome || "-"}</td>
                      <td style={{ textAlign: "center", fontWeight: 600 }}>
                        {(() => {
                          const qntd = getQntdUltimoInforme(item.id);
                          return qntd ? <span>{qntd}</span> : <span style={{ color: "#94a3b8" }}>-</span>;
                        })()}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="text"
                          value={item.vendas || ""}
                          onChange={(e) => handleUpdateConferencia(item.id, "vendas", e.target.value)}
                          placeholder="-"
                          style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px 8px", textAlign: "center" }}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="text"
                          value={item.vales || ""}
                          onChange={(e) => handleUpdateConferencia(item.id, "vales", e.target.value)}
                          placeholder="-"
                          style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px 8px", textAlign: "center" }}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="text"
                          value={item.entradas || ""}
                          onChange={(e) => handleUpdateConferencia(item.id, "entradas", e.target.value)}
                          placeholder="-"
                          style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px 8px", textAlign: "center" }}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="text"
                          value={item.previsto || ""}
                          onChange={(e) => handleUpdateConferencia(item.id, "previsto", e.target.value)}
                          placeholder="-"
                          style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px 8px", textAlign: "center" }}
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="text"
                          value={item.qntdReal || ""}
                          onChange={(e) => handleUpdateConferencia(item.id, "qntdReal", e.target.value)}
                          placeholder="-"
                          style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px 8px", textAlign: "center" }}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem", margin: "10px 0 0 0" }}>Valores editáveis diretamente na tabela e salvos automaticamente no banco.</p>
        </div>

        {/* Modal cadastro/edição */}
        {showModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "16px" }} onClick={() => setShowModal(false)}>
            <div style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "640px", maxHeight: "90vh", overflowY: "auto", padding: "22px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem", color: "#1e293b", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsPlusCircle /> {editingId ? "Editar Item" : "Cadastrar Novo Item"}
                </h3>
                <button onClick={() => setShowModal(false)} style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                  <Icons.BsXLg />
                </button>
              </div>

              <form onSubmit={handleSaveItem} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>Nome *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Nutella 40gr - identifique o item na tabela"
                    style={{ width: "100%", height: "38px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontWeight: 600 }}
                    required
                  />
                  <small style={{ color: "#64748b", fontSize: "1.05rem" }}>Este nome aparece na primeira coluna da tabela para identificar o item.</small>
                </div>

                {/* Primeiro: mapeamento Nome no Vendas + Qntd (pode adicionar vários) */}
                <div style={{ gridColumn: "1 / -1", background: "#fdfaf7", border: "1px solid #f0e6dd", borderRadius: "10px", padding: "14px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "1.2rem", fontWeight: 800, color: "#7c2d12", marginBottom: "6px" }}>
                    <Icons.BsTag /> Mapeamento — Nome no Vendas e Qntd
                  </label>
                  <p style={{ fontSize: "1.1rem", color: "#78716c", margin: "0 0 10px 0", lineHeight: 1.4 }}>
                    Cadastre um ou mais nomes como aparecem no relatório de vendas e a quantidade que consome. Ex: <strong>"Waffle com nutella e morango" → 40gr</strong> e <strong>"Nutella" → 40gr</strong> para controlar nutella.
                  </p>
                  {formData.mapeamentos.map((m, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-end" }}>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: "block", fontSize: "1.05rem", fontWeight: 600, color: "#57534e", marginBottom: "4px" }}>Nome no Vendas</label>
                        <input
                          type="text"
                          value={m.nomeVendas}
                          onChange={(e) => handleChangeMapeamento(idx, "nomeVendas", e.target.value)}
                          placeholder="Ex: Waffle com nutella e morango"
                          style={{ width: "100%", height: "36px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                        />
                      </div>
                      <div style={{ flex: "0 0 120px" }}>
                        <label style={{ display: "block", fontSize: "1.05rem", fontWeight: 600, color: "#57534e", marginBottom: "4px" }}>Qntd</label>
                        <input
                          type="text"
                          value={m.qntd}
                          onChange={(e) => handleChangeMapeamento(idx, "qntd", e.target.value)}
                          placeholder="Ex: 40gr"
                          style={{ width: "100%", height: "36px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                        />
                      </div>
                      {formData.mapeamentos.length > 1 && (
                        <button type="button" onClick={() => handleRemoveMapeamento(idx)} title="Remover" style={{ height: "36px", padding: "0 10px", background: "#fff", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icons.BsTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={handleAddMapeamento} style={{ marginTop: "4px", padding: "7px 12px", background: "#fff", border: "1px dashed #cbd5e1", borderRadius: "8px", color: "#475569", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "1.15rem" }}>
                    <Icons.BsPlusLg /> Adicionar outro nome
                  </button>
                </div>

                <div style={{ gridColumn: "1 / -1", background: "#f0fdfa", border: "1px solid #a7f3d0", borderRadius: "10px", padding: "14px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "1.2rem", fontWeight: 800, color: "#065f46", marginBottom: "6px" }}>
                    <Icons.BsTicket /> Mapeamento — Nome no Vales e Qntd
                  </label>
                  <p style={{ fontSize: "1.1rem", color: "#57534e", margin: "0 0 10px 0", lineHeight: 1.4 }}>
                    Cadastre os nomes como aparecem nos vales e a quantidade correspondente. Pode adicionar vários.
                  </p>
                  {formData.mapeamentosVales.map((m, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-end" }}>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: "block", fontSize: "1.05rem", fontWeight: 600, color: "#57534e", marginBottom: "4px" }}>Nome no Vales</label>
                        <input
                          type="text"
                          value={m.nomeVales}
                          onChange={(e) => handleChangeMapeamentoVales(idx, "nomeVales", e.target.value)}
                          placeholder="Ex: Vale Nutella"
                          style={{ width: "100%", height: "36px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                        />
                      </div>
                      <div style={{ flex: "0 0 120px" }}>
                        <label style={{ display: "block", fontSize: "1.05rem", fontWeight: 600, color: "#57534e", marginBottom: "4px" }}>Qntd</label>
                        <input
                          type="text"
                          value={m.qntd}
                          onChange={(e) => handleChangeMapeamentoVales(idx, "qntd", e.target.value)}
                          placeholder="Ex: 40gr"
                          style={{ width: "100%", height: "36px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                        />
                      </div>
                      {formData.mapeamentosVales.length > 1 && (
                        <button type="button" onClick={() => handleRemoveMapeamentoVales(idx)} title="Remover" style={{ height: "36px", padding: "0 10px", background: "#fff", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icons.BsTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={handleAddMapeamentoVales} style={{ marginTop: "4px", padding: "7px 12px", background: "#fff", border: "1px dashed #a7f3d0", borderRadius: "8px", color: "#065f46", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "1.15rem" }}>
                    <Icons.BsPlusLg /> Adicionar outro nome no vales
                  </button>
                </div>

                <div style={{ gridColumn: "1 / -1", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "14px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "1.2rem", fontWeight: 800, color: "#1e40af", marginBottom: "6px" }}>
                    <Icons.BsBoxSeam /> Mapeamento — Entradas de Estoque e Qntd
                  </label>
                  <p style={{ fontSize: "1.1rem", color: "#57534e", margin: "0 0 10px 0", lineHeight: 1.4 }}>
                    Cadastre os nomes como aparecem nas entradas de estoque e a quantidade correspondente. Pode adicionar vários.
                  </p>
                  {formData.mapeamentosEntradas.map((m, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-end" }}>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: "block", fontSize: "1.05rem", fontWeight: 600, color: "#57534e", marginBottom: "4px" }}>Nome no Entradas</label>
                        <input
                          type="text"
                          value={m.nomeEntrada}
                          onChange={(e) => handleChangeMapeamentoEntradas(idx, "nomeEntrada", e.target.value)}
                          placeholder="Ex: Nutella pote 350g"
                          style={{ width: "100%", height: "36px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                        />
                      </div>
                      <div style={{ flex: "0 0 120px" }}>
                        <label style={{ display: "block", fontSize: "1.05rem", fontWeight: 600, color: "#57534e", marginBottom: "4px" }}>Qntd</label>
                        <input
                          type="text"
                          value={m.qntd}
                          onChange={(e) => handleChangeMapeamentoEntradas(idx, "qntd", e.target.value)}
                          placeholder="Ex: 350gr"
                          style={{ width: "100%", height: "36px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                        />
                      </div>
                      {formData.mapeamentosEntradas.length > 1 && (
                        <button type="button" onClick={() => handleRemoveMapeamentoEntradas(idx)} title="Remover" style={{ height: "36px", padding: "0 10px", background: "#fff", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icons.BsTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={handleAddMapeamentoEntradas} style={{ marginTop: "4px", padding: "7px 12px", background: "#fff", border: "1px dashed #bfdbfe", borderRadius: "8px", color: "#1e40af", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "1.15rem" }}>
                    <Icons.BsPlusLg /> Adicionar outro nome em entradas
                  </button>
                </div>

                <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: "10px 16px", background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={savingItem} style={{ padding: "10px 18px", background: savingItem ? "#94a3b8" : "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: savingItem ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                    {savingItem ? <Icons.BsArrowClockwise className="spin" /> : <Icons.BsCheckLg />} {editingId ? "Salvar" : "Cadastrar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Informar qntd atual */}
        {showInformarModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "16px" }} onClick={() => setShowInformarModal(false)}>
            <div style={{ background: "#fff", borderRadius: "12px", width: "100%", maxWidth: "640px", maxHeight: "90vh", overflowY: "auto", padding: "22px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem", color: "#1e293b", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsClipboardCheck /> Informar qntd atual
                </h3>
                <button onClick={() => setShowInformarModal(false)} style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                  <Icons.BsXLg />
                </button>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
                <div style={{ flex: "1 1 160px" }}>
                  <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Data *</label>
                  <input type="date" value={dataInforme} onChange={(e) => setDataInforme(e.target.value)} style={{ width: "100%", height: "38px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} required />
                </div>
                <div style={{ flex: "1 1 160px" }}>
                  <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Loja</label>
                  <select value={lojaConferencia} onChange={(e) => setLojaConferencia(e.target.value)} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1.2rem", fontWeight: 600, background: "#fff", minWidth: "140px" }}>
                  <option value="Ahu">Ahu</option>
                  <option value="Alto da XV">Alto da XV</option>
                </select>
                </div>
              </div>

              {itens.length === 0 ? (
                <p style={{ color: "#94a3b8", fontSize: "1.2rem", textAlign: "center", padding: "20px 0" }}>Nenhum item cadastrado.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
                  {itens.map((item) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ flex: 1, fontWeight: 700, color: "#1e293b", fontSize: "1.2rem" }}>{item.nome}</span>
                      <input
                        type="text"
                        value={qntdsInforme[item.id] || ""}
                        onChange={(e) => setQntdsInforme((prev) => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder="Qntd atual"
                        style={{ width: "140px", height: "36px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", textAlign: "center" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button type="button" onClick={() => setShowInformarModal(false)} style={{ padding: "10px 16px", background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
                  Cancelar
                </button>
                <button type="button" onClick={handleSaveInforme} disabled={savingInforme || itens.length === 0} style={{ padding: "10px 18px", background: savingInforme ? "#94a3b8" : "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: savingInforme ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  {savingInforme ? <Icons.BsArrowClockwise className="spin" /> : <Icons.BsCheckLg />} Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ConferenciaRoubos;
