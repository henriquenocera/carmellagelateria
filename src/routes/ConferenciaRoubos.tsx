import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import { useAuth } from "../AuthProvider";

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
  ultimoInforme: string;
  vendas: string;
  vales: string;
  entradas: string;
  previsto: string;
  qntdReal: string;
  mapeamentos?: MapeamentoVenda[];
  mapeamentosVales?: MapeamentoVales[];
  mapeamentosEntradas?: MapeamentoEntrada[];
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

  // Tabela 6 colunas + mapeamentos por venda/vales/entradas
  const [itens, setItens] = useState<ConferenciaItem[]>(() => {
    const stored = localStorage.getItem("conferencia_roubos_tabela");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // migração: garantir mapeamentos e nome
        return parsed.map((it: any) => ({ nome: it.nome || it.ultimoInforme || "", mapeamentos: it.mapeamentos || [], mapeamentosVales: it.mapeamentosVales || [], mapeamentosEntradas: it.mapeamentosEntradas || [], ...it }));
      } catch { return []; }
    }
    return [];
  });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ nome: string; ultimoInforme: string; vendas: string; vales: string; entradas: string; previsto: string; qntdReal: string; mapeamentos: MapeamentoVenda[]; mapeamentosVales: MapeamentoVales[]; mapeamentosEntradas: MapeamentoEntrada[] }>({
    nome: "",
    ultimoInforme: "",
    vendas: "",
    vales: "",
    entradas: "",
    previsto: "",
    qntdReal: "",
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

  // Persistência tabela 6 colunas
  React.useEffect(() => {
    localStorage.setItem("conferencia_roubos_tabela", JSON.stringify(itens));
  }, [itens]);

  const handleOpenModal = () => {
    setFormData({ nome: "", ultimoInforme: "", vendas: "", vales: "", entradas: "", previsto: "", qntdReal: "", mapeamentos: [{ nomeVendas: "", qntd: "" }], mapeamentosVales: [{ nomeVales: "", qntd: "" }], mapeamentosEntradas: [{ nomeEntrada: "", qntd: "" }] });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditItem = (item: ConferenciaItem) => {
    setFormData({
      nome: (item as any).nome || "",
      ultimoInforme: item.ultimoInforme,
      vendas: item.vendas,
      vales: item.vales,
      entradas: item.entradas,
      previsto: item.previsto,
      qntdReal: item.qntdReal,
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

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    // filtra mapeamentos vazios
    const mapeamentosFiltrados = formData.mapeamentos.filter((m) => m.nomeVendas.trim() !== "" && m.qntd.trim() !== "");
    const mapeamentosValesFiltrados = formData.mapeamentosVales.filter((m) => m.nomeVales.trim() !== "" && m.qntd.trim() !== "");
    const mapeamentosEntradasFiltrados = formData.mapeamentosEntradas.filter((m) => m.nomeEntrada.trim() !== "" && m.qntd.trim() !== "");
    const payload = { ...formData, mapeamentos: mapeamentosFiltrados, mapeamentosVales: mapeamentosValesFiltrados, mapeamentosEntradas: mapeamentosEntradasFiltrados };
    if (editingId) {
      setItens((prev) => prev.map((it) => (it.id === editingId ? { ...it, ...payload } : it)));
    } else {
      const newItem: ConferenciaItem = { id: Date.now().toString(), ...payload };
      setItens((prev) => [newItem, ...prev]);
    }
    setShowModal(false);
    setEditingId(null);
    setFormData({ nome: "", ultimoInforme: "", vendas: "", vales: "", entradas: "", previsto: "", qntdReal: "", mapeamentos: [{ nomeVendas: "", qntd: "" }], mapeamentosVales: [{ nomeVales: "", qntd: "" }], mapeamentosEntradas: [{ nomeEntrada: "", qntd: "" }] });
  };

  const handleDeleteItem = (id: string) => {
    if (!window.confirm("Excluir este item?")) return;
    setItens((prev) => prev.filter((it) => it.id !== id));
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

        {/* Tabela 6 colunas */}
        <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
            <h3 style={{ margin: 0, fontSize: "1.4rem", color: "#334155", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icons.BsClipboardData /> Conferência — 6 colunas
            </h3>
            <span style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "5px 12px", borderRadius: "20px", fontSize: "1.15rem", fontWeight: 700, color: "#334155" }}>
              {itens.length} {itens.length === 1 ? "linha" : "linhas"}
            </span>
          </div>

          <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
            <table className="freq-table" style={{ minWidth: "1050px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", minWidth: "160px" }}>Nome</th>
                  <th style={{ textAlign: "left", minWidth: "160px" }}>Último Informe</th>
                  <th style={{ textAlign: "center", minWidth: "110px" }}>Vendas</th>
                  <th style={{ textAlign: "center", minWidth: "110px" }}>Vales</th>
                  <th style={{ textAlign: "center", minWidth: "110px" }}>Entradas</th>
                  <th style={{ textAlign: "center", minWidth: "110px" }}>Previsto</th>
                  <th style={{ textAlign: "center", minWidth: "110px" }}>Qntd Real</th>
                  <th style={{ width: "90px", textAlign: "center" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {itens.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "28px", color: "#94a3b8" }}>
                      Nenhum item cadastrado. Clique em "Cadastrar Novo Item" no topo da página.
                    </td>
                  </tr>
                ) : (
                  itens.map((item) => (
                    <tr key={item.id}>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1e293b" }}>{(item as any).nome || "-"}</td>
                      <td style={{ padding: "10px 12px" }}>{item.ultimoInforme || "-"}</td>
                      <td style={{ textAlign: "center" }}>
                        <div>{item.vendas || "-"}</div>
                        {item.mapeamentos && item.mapeamentos.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px", justifyContent: "center" }}>
                            {item.mapeamentos.map((m, i) => (
                              <span key={i} title={`${m.nomeVendas} → ${m.qntd}`} style={{ background: "#fefce8", border: "1px solid #fde68a", padding: "2px 6px", borderRadius: "10px", fontSize: "0.95rem", color: "#92400e", fontWeight: 600 }}>
                                {m.nomeVendas} → {m.qntd}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div>{item.vales || "-"}</div>
                        {item.mapeamentosVales && item.mapeamentosVales.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px", justifyContent: "center" }}>
                            {item.mapeamentosVales.map((m, i) => (
                              <span key={i} title={`${m.nomeVales} → ${m.qntd}`} style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "2px 6px", borderRadius: "10px", fontSize: "1.0rem", color: "#065f46", fontWeight: 600 }}>
                                {m.nomeVales} → {m.qntd}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div>{item.entradas || "-"}</div>
                        {(item as any).mapeamentosEntradas && (item as any).mapeamentosEntradas.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px", justifyContent: "center" }}>
                            {(item as any).mapeamentosEntradas.map((m: any, i: number) => (
                              <span key={i} title={`${m.nomeEntrada} → ${m.qntd}`} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "2px 6px", borderRadius: "10px", fontSize: "0.95rem", color: "#1e40af", fontWeight: 600 }}>
                                {m.nomeEntrada} → {m.qntd}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>{item.previsto || "-"}</td>
                      <td style={{ textAlign: "center" }}>{item.qntdReal || "-"}</td>
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

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Último Informe</label>
                  <input type="text" value={formData.ultimoInforme} onChange={(e) => setFormData({ ...formData, ultimoInforme: e.target.value })} placeholder="Ex: 11/09/2026 ou texto" style={{ width: "100%", height: "38px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Vendas</label>
                  <input type="text" value={formData.vendas} onChange={(e) => setFormData({ ...formData, vendas: e.target.value })} placeholder="Ex: R$ 1.200,00" style={{ width: "100%", height: "38px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Vales</label>
                  <input type="text" value={formData.vales} onChange={(e) => setFormData({ ...formData, vales: e.target.value })} placeholder="Ex: 3" style={{ width: "100%", height: "38px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Entradas</label>
                  <input type="text" value={formData.entradas} onChange={(e) => setFormData({ ...formData, entradas: e.target.value })} placeholder="Ex: 2" style={{ width: "100%", height: "38px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Previsto</label>
                  <input type="text" value={formData.previsto} onChange={(e) => setFormData({ ...formData, previsto: e.target.value })} placeholder="Ex: 100" style={{ width: "100%", height: "38px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Qntd Real</label>
                  <input type="text" value={formData.qntdReal} onChange={(e) => setFormData({ ...formData, qntdReal: e.target.value })} placeholder="Ex: 98" style={{ width: "100%", height: "38px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                </div>
                <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: "10px 16px", background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
                    Cancelar
                  </button>
                  <button type="submit" style={{ padding: "10px 18px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Icons.BsCheckLg /> {editingId ? "Salvar" : "Cadastrar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ConferenciaRoubos;
