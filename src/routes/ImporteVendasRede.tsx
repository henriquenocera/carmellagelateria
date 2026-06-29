import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import "../css/Frequencia.css";

const groupTransactions = (individualTxs: any[]) => {
  const groups: { [key: string]: any } = {};

  individualTxs.forEach(tx => {
    const key = `${tx.date}_${tx.category}`;
    if (!groups[key]) {
      groups[key] = {
        id: key,
        date: tx.date,
        category: tx.category,
        amount: 0,
        taxAmount: 0,
        netAmount: 0,
        modalidades: new Set(),
        bandeiras: new Set(),
        memo: tx.category === "Vendas Loja - Pix" ? "Vendas Rede - Pix" : "Vendas Rede - Cartão",
        status: "Analisando..."
      };
    }

    groups[key].amount += tx.amount;
    groups[key].taxAmount += tx.taxAmount;
    groups[key].netAmount += tx.netAmount;
    if (tx.modalidade) groups[key].modalidades.add(tx.modalidade);
    if (tx.bandeira) groups[key].bandeiras.add(tx.bandeira);
  });

  return Object.values(groups).map(g => {
    const mods = Array.from(g.modalidades).map(m => String(m).trim()).filter(Boolean).join("/");
    const bands = Array.from(g.bandeiras).map(b => String(b).trim()).filter(Boolean).join("/");
    const details = [mods, bands].filter(Boolean).join(" - ");
    g.memo = `${g.memo}${details ? ` (${details})` : ""}`;
    return g;
  });
};

function ImporteVendasRede() {
  const { user } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contas, setContas] = useState<any[]>([]);
  const [selectedConta, setSelectedConta] = useState<string>("");
  const [selectedTxIds, setSelectedTxIds] = useState<Set<string>>(new Set());

  // Fetch Contas on mount
  useEffect(() => {
    async function fetchContas() {
      try {
        const { data: contasData, error: contasError } = await supabase
          .from("contas")
          .select("id, banco, agencia, conta_corrente, descricao")
          .eq("ativo", true)
          .order("banco", { ascending: true });

        if (contasError) throw contasError;

        const contasFormatadas = (contasData || [])
          .map(c => {
            const label = [c.banco, c.agencia, c.conta_corrente].filter(Boolean).join(" - ");
            const displayLabel = [c.descricao, c.banco, c.conta_corrente].filter(Boolean).join(" - ");
            return { ...c, label, displayLabel };
          })
          .filter(c => {
            const isCaixa = 
              (c.banco && c.banco.toLowerCase().includes("caixa dinheiro")) ||
              (c.descricao && c.descricao.toLowerCase().includes("caixa dinheiro")) ||
              (c.label && c.label.toLowerCase().includes("caixa dinheiro"));
            return !isCaixa;
          });

        setContas(contasFormatadas);
      } catch (error) {
        console.error("Erro ao buscar contas bancárias:", error);
      }
    }
    fetchContas();
  }, []);

  const toggleSelectTx = (id: string) => {
    setSelectedTxIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectableTxs = transactions.filter(t => t.status === "Não Encontrado");
  const allSelected = selectableTxs.length > 0 && selectableTxs.every(t => selectedTxIds.has(t.id));

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedTxIds(prev => {
        const next = new Set(prev);
        selectableTxs.forEach(t => next.delete(t.id));
        return next;
      });
    } else {
      setSelectedTxIds(prev => {
        const next = new Set(prev);
        selectableTxs.forEach(t => next.add(t.id));
        return next;
      });
    }
  };

  const handleImportSelected = async () => {
    if (!selectedConta) {
      alert("Por favor, selecione a conta bancária no topo da tabela.");
      return;
    }

    const selectedTxs = transactions.filter(t => selectedTxIds.has(t.id) && t.status === "Não Encontrado");
    if (selectedTxs.length === 0) {
      alert("Nenhuma transação 'Não Encontrado' selecionada para importação.");
      return;
    }

    if (!window.confirm(`Deseja lançar as ${selectedTxs.length} transações selecionadas na conta "${selectedConta}"?`)) {
      return;
    }

    setSyncing(true);
    try {
      const payloads = selectedTxs.map(t => ({
        data: t.date,
        descricao: t.memo,
        valor: t.amount,
        conta: selectedConta,
        categoria: t.category,
        fornecedor: null,
        user_id: user?.id,
        status_revisao: null,
        conciliado: true
      }));

      const { error } = await supabase
        .from("lancamentos_financeiros")
        .insert(payloads);

      if (error) throw error;

      setTransactions(prev => prev.map(t => {
        if (selectedTxIds.has(t.id) && t.status === "Não Encontrado") {
          return { ...t, status: "Importado" };
        }
        return t;
      }));

      setSelectedTxIds(new Set());
      alert(`${payloads.length} lançamentos importados com sucesso!`);
    } catch (err: any) {
      console.error("Erro ao importar lançamentos:", err);
      alert("Erro ao importar lançamentos: " + (err.message || "Erro desconhecido."));
    } finally {
      setSyncing(false);
    }
  };

  const parseCSV = (content: string) => {
    const lines = content.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].toLowerCase().split(';').map(h => h.trim());
    const colData = headers.indexOf("data da venda");
    const colStatus = headers.indexOf("status da venda");
    const colValorOriginal = headers.indexOf("valor da venda original");
    const colModalidade = headers.indexOf("modalidade");
    const colBandeira = headers.indexOf("bandeira");
    const colNsu = headers.indexOf("nsu/cv");
    const colTaxas = headers.findIndex(h => h.includes("valor total das taxas") || h.includes("total das taxas"));

    const parsed: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(';');
      const dateRaw = cols[colData !== -1 ? colData : 0]?.trim();
      if (!dateRaw) continue;

      const parts = dateRaw.split('/');
      if (parts.length !== 3) continue;
      const date = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;

      const statusVenda = cols[colStatus !== -1 ? colStatus : 2]?.trim() || "";
      const valorRaw = cols[colValorOriginal !== -1 ? colValorOriginal : 3]?.trim() || "0";
      const amount = parseFloat(valorRaw.replace(/\./g, "").replace(",", ".")) || 0;

      const taxasRaw = colTaxas !== -1 ? (cols[colTaxas]?.trim() || "0") : "0";
      const taxAmount = parseFloat(taxasRaw.replace(/\./g, "").replace(",", ".")) || 0;
      const netAmount = Math.max(0, amount - taxAmount);

      const modalidade = cols[colModalidade !== -1 ? colModalidade : 5]?.trim() || "";
      const bandeira = cols[colBandeira !== -1 ? colBandeira : 9]?.trim() || "";
      const nsu = cols[colNsu !== -1 ? colNsu : 17]?.trim() || "";

      // Ignora transações negadas
      if (statusVenda.toLowerCase() === "negada" || amount <= 0) {
        continue;
      }

      const category = modalidade.toLowerCase() === "pix" ? "Vendas Loja - Pix" : "Vendas Loja - Cartão";
      const memo = `Venda Rede - ${modalidade} ${bandeira}`.trim() + (nsu ? ` - NSU ${nsu}` : "");

      parsed.push({
        id: nsu || `${date}-${amount}-${i}`,
        date,
        amount,
        taxAmount,
        netAmount,
        modalidade,
        bandeira,
        nsu,
        memo,
        category,
        status: "Analisando..."
      });
    }

    return parsed;
  };

  const handleFileSelection = (selected: File) => {
    if (selected.name.toLowerCase().endsWith(".csv")) {
      setFile(selected);
      setTransactions([]); // reset on new file
      setSelectedTxIds(new Set()); // reset selection
    } else {
      alert("Por favor, selecione apenas arquivos .CSV");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const processFile = () => {
    if (!file) return;
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = parseCSV(content);
        const grouped = groupTransactions(parsed);

        grouped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (grouped.length === 0) {
          setTransactions([]);
          alert("Nenhuma transação elegível encontrada no arquivo CSV.");
          setLoading(false);
          return;
        }

        // Determine min and max dates
        const dates = grouped.map(t => new Date(t.date + "T00:00:00").getTime());
        const minTime = Math.min(...dates);
        const maxTime = Math.max(...dates);

        // Margin of 3 days
        const boundsMin = new Date(minTime - 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-CA");
        const boundsMax = new Date(maxTime + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-CA");

        // Fetch DB Lancamentos
        const { data: dbData, error } = await supabase
          .from("lancamentos_financeiros")
          .select("id, data, valor, descricao, conciliado, categoria")
          .gte("data", boundsMin)
          .lte("data", boundsMax);

        if (error) throw error;

        const availableDb = dbData ? [...dbData] : [];

        // Match algorithm for grouped transactions
        grouped.forEach(group => {
          const groupDate = new Date(group.date + "T00:00:00").getTime();
          const groupAmount = group.amount;

          // Match only by value (matching either gross or net amount) and date (margin of 3 days)
          const matchIdx = availableDb.findIndex(db => {
            const dbAmount = Math.abs(parseFloat(db.valor || "0"));
            const grossAmount = Math.abs(group.amount);
            const netAmount = Math.abs(group.netAmount);

            // Verify if amount matches either gross or net (allow a 0.05 margin for rounding)
            const matchGross = Math.abs(dbAmount - grossAmount) <= 0.05;
            const matchNet = Math.abs(dbAmount - netAmount) <= 0.05;
            if (!matchGross && !matchNet) return false;

            // Verify date difference is within 3 days
            const dbDate = new Date(db.data + "T00:00:00").getTime();
            const diffDays = Math.abs(groupDate - dbDate) / (1000 * 60 * 60 * 24);
            return diffDays <= 3;
          });

          if (matchIdx !== -1) {
            const matchRecord = availableDb[matchIdx];
            group.status = matchRecord.conciliado ? "Já Conciliado" : "Encontrado";
            availableDb.splice(matchIdx, 1); // consume match
          } else {
            group.status = "Não Encontrado";
          }
        });

        setTransactions(grouped);
      } catch (err: any) {
        console.error("Erro ao analisar arquivo CSV:", err);
        alert("Ocorreu um erro ao tentar ler/sincronizar este arquivo. Detalhes: " + (err.message || "Erro desconhecido."));
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return dateStr.split("-").reverse().join("/");
  };

  return (
    <>
      <Helmet>
        <title>Importe Vendas Rede - Carmella</title>
      </Helmet>

      <div className="frequencia-container" style={{ padding: "20px 24px", paddingLeft: "95px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "12px", color: "#334155", marginBottom: "24px", fontSize: "2.4rem" }}>
          <Icons.BsFileEarmarkSpreadsheet /> Importe Vendas Rede
        </h1>

        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", marginBottom: "32px" }}>
          <p style={{ color: "#64748b", fontSize: "1.4rem", marginBottom: "20px", textAlign: "center" }}>
            Selecione o arquivo CSV de vendas da Rede (delimitador <strong>ponto e vírgula</strong>) para visualizar e conciliar os lançamentos.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "500px", margin: "0 auto" }}>
            <div 
              style={{ 
                border: `2px dashed ${isDragging ? "#3b82f6" : "#cbd5e1"}`, 
                borderRadius: "8px", 
                padding: "32px", 
                textAlign: "center",
                backgroundColor: isDragging ? "#eff6ff" : "#f8fafc",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Icons.BsCloudUpload style={{ fontSize: "3rem", color: isDragging ? "#3b82f6" : "#94a3b8", marginBottom: "12px" }} />
              <div style={{ fontSize: "1.4rem", color: "#475569", fontWeight: "bold" }}>
                {file ? file.name : "Clique para selecionar ou arraste um arquivo .CSV"}
              </div>
              <input 
                type="file" 
                accept=".csv" 
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            <button 
              className="primary-btn"
              onClick={processFile}
              disabled={!file || loading}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "1.4rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                opacity: (!file || loading) ? 0.6 : 1,
                cursor: (!file || loading) ? "not-allowed" : "pointer"
              }}
            >
              {loading ? <Icons.BsHourglassSplit /> : <Icons.BsPlayCircle />}
              {loading ? "Lendo arquivo e cruzando dados..." : "Importar e Analisar"}
            </button>
          </div>
        </div>

        {transactions.length > 0 && (
          <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
              <h2 style={{ fontSize: "1.8rem", color: "#334155", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsListCheck /> Transações CSV ({transactions.length})
              </h2>

              {/* Seletor de Conta Bancária */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#475569" }}>Conta Bancária:</label>
                <select
                  value={selectedConta}
                  onChange={(e) => setSelectedConta(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "1.4rem",
                    color: "#334155",
                    height: "40px",
                    minWidth: "250px"
                  }}
                >
                  <option value="">Selecione uma conta bancária...</option>
                  {contas.map(c => (
                    <option key={c.id} value={c.label}>
                      {c.displayLabel || c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {selectedTxIds.size > 0 && (
                  <button 
                    onClick={handleImportSelected}
                    disabled={syncing}
                    style={{
                      backgroundColor: "#10b981",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: "none",
                      fontWeight: "bold",
                      cursor: syncing ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "1.4rem"
                    }}
                  >
                    {syncing ? <Icons.BsArrowRepeat className="spin" /> : <Icons.BsPlusCircle />}
                    {`Lançar Selecionados (${selectedTxIds.size})`}
                  </button>
                )}
              </div>
            </div>

            <div className="table-responsive" style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <table className="frequencia-table">
                <thead>
                  <tr>
                    <th style={{ width: "50px", textAlign: "center" }}>
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll} 
                        checked={allSelected} 
                        style={{ cursor: "pointer" }}
                      />
                    </th>
                    <th style={{ width: "120px" }}>Data</th>
                    <th style={{ textAlign: "left", paddingLeft: "12px" }}>Descrição do Lançamento</th>
                    <th style={{ width: "120px" }}>Modalidade</th>
                    <th style={{ width: "130px" }}>Status</th>
                    <th style={{ width: "120px", textAlign: "center" }}>Valor Bruto</th>
                    <th style={{ width: "110px", textAlign: "center" }}>Taxa</th>
                    <th style={{ width: "120px", textAlign: "center" }}>Valor Líquido</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, idx) => {
                    let statusColor = "#64748b";
                    if (t.status === "Encontrado") statusColor = "#d97706";
                    if (t.status === "Sincronizado" || t.status === "Já Conciliado" || t.status === "Importado") statusColor = "#10b981";
                    if (t.status === "Não Encontrado") statusColor = "#ef4444";

                    return (
                      <tr key={idx}>
                        <td style={{ textAlign: "center" }}>
                          <input 
                            type="checkbox" 
                            checked={selectedTxIds.has(t.id)} 
                            onChange={() => toggleSelectTx(t.id)} 
                            disabled={t.status !== "Não Encontrado"} 
                            style={{ cursor: t.status === "Não Encontrado" ? "pointer" : "not-allowed" }}
                          />
                        </td>
                        <td>{formatDate(t.date)}</td>
                        <td style={{ textAlign: "left", paddingLeft: "12px" }}>{t.memo}</td>
                        <td>{t.category === "Vendas Loja - Pix" ? "Pix" : "Cartão"}</td>
                        <td>
                          <span style={{ 
                            backgroundColor: statusColor + "1a", // light background
                            color: statusColor, 
                            padding: "4px 8px", 
                            borderRadius: "12px",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            display: "inline-block"
                          }}>
                            {t.status}
                          </span>
                        </td>
                        <td style={{ 
                          textAlign: "center", 
                          fontWeight: "bold",
                          color: "#334155" 
                        }}>
                          {formatCurrency(t.amount)}
                        </td>
                        <td style={{ 
                          textAlign: "center", 
                          color: t.taxAmount > 0 ? "#ef4444" : "#64748b",
                          fontWeight: t.taxAmount > 0 ? "bold" : "normal"
                        }}>
                          {t.taxAmount > 0 ? `-${formatCurrency(t.taxAmount)}` : formatCurrency(0)}
                        </td>
                        <td style={{ 
                          textAlign: "center", 
                          fontWeight: "bold",
                          color: "#10b981" 
                        }}>
                          {formatCurrency(t.netAmount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ImporteVendasRede;
