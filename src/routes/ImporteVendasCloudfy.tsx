import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import "../css/Frequencia.css";

const groupTransactions = (individualTxs: any[]) => {
  const groups: { [key: string]: any } = {};

  individualTxs.forEach(tx => {
    const key = `${tx.store}_${tx.date}_${tx.category}`;
    if (!groups[key]) {
      groups[key] = {
        id: key,
        store: tx.store,
        date: tx.date,
        category: tx.category,
        amount: 0,
        taxAmount: 0,
        netAmount: 0,
        modalidades: new Set(),
        memo: `Vendas Cloudfy - ${tx.category}`,
        status: "Analisando..."
      };
    }

    groups[key].amount += tx.amount;
    groups[key].netAmount += tx.amount;
    if (tx.modalidade) groups[key].modalidades.add(tx.modalidade);
  });

  return Object.values(groups).map(g => {
    const mods = Array.from(g.modalidades).map(m => String(m).trim()).filter(Boolean).join("/");
    g.memo = `${g.memo}${mods ? ` (${mods})` : ""}`;
    return g;
  });
};

function ImporteVendasCloudfy() {
  const { user } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedTxIds, setSelectedTxIds] = useState<Set<string>>(new Set());

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
    const selectedTxs = transactions.filter(t => selectedTxIds.has(t.id) && t.status === "Não Encontrado");
    if (selectedTxs.length === 0) {
      alert("Nenhuma transação 'Não Encontrado' selecionada para importação.");
      return;
    }

    if (!window.confirm(`Deseja lançar as ${selectedTxs.length} transações selecionadas nas suas respectivas lojas?`)) {
      return;
    }

    setSyncing(true);
    try {
      const updatesByDate: Record<string, any> = {};
      selectedTxs.forEach(t => {
        const key = `${t.store}_${t.date}`;
        if (!updatesByDate[key]) {
          updatesByDate[key] = { date: t.date, store: t.store };
        }
        if (t.category === "Pix") {
          updatesByDate[key].pix_calculado = t.amount;
          updatesByDate[key].pix_cloudfy_importado = true;
        } else if (t.category === "Cartão") {
          updatesByDate[key].cartao_calculado = t.amount;
          updatesByDate[key].cartao_cloudfy_importado = true;
        } else if (t.category === "Dinheiro") {
          updatesByDate[key].caixa_vendas = t.amount;
          updatesByDate[key].caixa_cloudfy_importado = true;
        } else if (t.category === "iFood") {
          updatesByDate[key].ifood_realizado = t.amount;
          updatesByDate[key].ifood_cloudfy_importado = true;
        }
      });

      const updatesList = Object.values(updatesByDate);
      const dates = Array.from(new Set(updatesList.map(u => u.date)));
      const stores = Array.from(new Set(updatesList.map(u => u.store)));

      const { data: existingData, error: fetchErr } = await supabase
        .from("conciliacao_vendas")
        .select("*")
        .in("store", stores)
        .in("date", dates);

      if (fetchErr) throw fetchErr;

      const payloads = updatesList.map(update => {
        const existing = (existingData || []).find(e => e.date === update.date && e.store === update.store);
        const base = existing ? { ...existing } : { 
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
        };
        delete base.id;
        delete base.created_at;

        return {
           ...base,
           ...update
        };
      });

      const { error } = await supabase
        .from("conciliacao_vendas")
        .upsert(payloads, { onConflict: "store,date" });

      if (error) throw error;

      setTransactions(prev => prev.map(t => {
        if (selectedTxIds.has(t.id) && t.status === "Não Encontrado") {
          return { ...t, status: "Importado" };
        }
        return t;
      }));

      setSelectedTxIds(new Set());
      alert(`Lançamentos importados com sucesso!`);
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

    const parsed: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split('\t').map(c => c.replace(/^"|"$/g, '').trim());
      if (cols.length < 4) continue;

      const filialRaw = cols[0]?.toUpperCase() || "";
      const store = filialRaw.includes("ALTO") ? "altoxv" : "ahu";

      const dateRaw = cols[1];
      if (!dateRaw) continue;

      const parts = dateRaw.split('/');
      if (parts.length !== 3) continue;
      const date = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;

      const formaPagamento = cols[2].toUpperCase();
      const valorRaw = cols[3] || "0";
      const amount = parseFloat(valorRaw.replace(/\./g, "").replace(",", ".")) || 0;

      if (amount <= 0) continue;

      let category = "Outros";
      if (formaPagamento.includes("PIX")) {
        category = "Pix";
      } else if (formaPagamento.includes("CARTAO") || formaPagamento.includes("TEF")) {
        category = "Cartão";
      } else if (formaPagamento.includes("DINHEIRO")) {
        category = "Dinheiro";
      } else if (formaPagamento.includes("IFOOD") || formaPagamento.includes("RAPPI")) {
        category = "iFood";
      }

      if (category === "Outros") continue;

      parsed.push({
        id: `${store}-${date}-${formaPagamento}-${i}`,
        store,
        date,
        amount,
        taxAmount: 0,
        netAmount: amount,
        modalidade: formaPagamento,
        memo: `Cloudfy - ${formaPagamento}`,
        category,
        status: "Analisando..."
      });
    }

    return parsed;
  };

  const handleFileSelection = (selected: File) => {
    if (selected.name.toLowerCase().endsWith(".csv")) {
      setFile(selected);
      setTransactions([]); 
      setSelectedTxIds(new Set()); 
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

        const dates = grouped.map(t => new Date(t.date + "T00:00:00").getTime());
        const minTime = Math.min(...dates);
        const maxTime = Math.max(...dates);

        const boundsMin = new Date(minTime).toLocaleDateString("en-CA");
        const boundsMax = new Date(maxTime).toLocaleDateString("en-CA");

        const { data: dbData, error } = await supabase
          .from("conciliacao_vendas")
          .select("*")
          .gte("date", boundsMin)
          .lte("date", boundsMax);

        if (error) throw error;

        const availableDb = dbData || [];

        grouped.forEach(group => {
          const matched = availableDb.find(d => d.date === group.date && d.store === group.store);
          
          if (matched) {
            let dbValue = 0;
            if (group.category === "Pix") dbValue = matched.pix_calculado || 0;
            else if (group.category === "Cartão") dbValue = matched.cartao_calculado || 0;
            else if (group.category === "Dinheiro") dbValue = matched.caixa_vendas || 0;
            else if (group.category === "iFood") dbValue = matched.ifood_calculado || 0;
            
            if (Math.abs(dbValue - group.amount) <= 0.05) {
               group.status = "Já Conciliado";
            } else {
               group.status = "Não Encontrado";
            }
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
        <title>Importe Vendas Cloudfy - Carmella</title>
      </Helmet>

      <div className="frequencia-container" style={{ padding: "20px 24px", paddingLeft: "95px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "12px", color: "#334155", marginBottom: "24px", fontSize: "2.4rem" }}>
          <Icons.BsFileEarmarkSpreadsheet /> Importe Vendas Cloudfy
        </h1>

        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", marginBottom: "32px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ color: "#64748b", fontSize: "1.4rem", margin: 0, flex: 1, minWidth: "300px" }}>
              Selecione o arquivo CSV de vendas da Cloudfy para visualizar e conciliar os lançamentos.
            </p>
            <button 
              onClick={() => setShowTutorial(!showTutorial)}
              style={{ backgroundColor: "#f8fafc", color: "#3b82f6", border: "1px solid #bfdbfe", padding: "8px 12px", borderRadius: "8px", fontWeight: "bold", fontSize: "1.2rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}
            >
              <Icons.BsInfoCircle /> {showTutorial ? "Ocultar Tutorial" : "Como exportar esse relatório?"}
            </button>
          </div>

          {showTutorial && (
            <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", padding: "20px", borderRadius: "8px", marginBottom: "24px" }}>
              <h3 style={{ margin: "0 0 16px 0", color: "#1e40af", fontSize: "1.5rem" }}>Passo a Passo para Exportar o Relatório na Cloudfy:</h3>
              <ol style={{ paddingLeft: "20px", color: "#334155", fontSize: "1.3rem", lineHeight: "1.6", marginBottom: "16px" }}>
                <li>No menu lateral esquerdo, acesse <strong>Relatórios gerais</strong> &gt; <strong>Vendas</strong> &gt; <strong>Relatório de vendas</strong>.</li>
                <li>Na tela do relatório, selecione as <strong>Datas inicial e final</strong>.</li>
                <li>No campo "Tipo de relatório" (1), escolha a opção <strong>Forma de pagamento - por dia</strong>.</li>
                <li>Deixe a opção "Consolidar filiais?" marcada como <strong>Não</strong>.</li>
                <li>No final da página (2), clique no botão azul <strong>CSV</strong> para baixar o arquivo correto.</li>
              </ol>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px", alignItems: "flex-start" }}>
                <div style={{ flex: "1 1 250px", textAlign: "center" }}>
                  <img src="/cloudfy_tutorial_1.png" alt="Passo 1" style={{ maxWidth: "100%", maxHeight: "400px", border: "1px solid #cbd5e1", borderRadius: "6px", objectFit: "contain" }} />
                </div>
                <div style={{ flex: "2 1 400px", textAlign: "center" }}>
                  <img src="/cloudfy_tutorial_2.png" alt="Passo 2" style={{ maxWidth: "100%", maxHeight: "400px", border: "1px solid #cbd5e1", borderRadius: "6px", objectFit: "contain" }} />
                </div>
              </div>
            </div>
          )}

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
                    <th style={{ width: "100px" }}>Loja</th>
                    <th style={{ width: "120px" }}>Data</th>
                    <th style={{ textAlign: "left", paddingLeft: "12px" }}>Descrição do Lançamento</th>
                    <th style={{ width: "120px" }}>Modalidade</th>
                    <th style={{ width: "130px" }}>Status</th>
                    <th style={{ width: "120px", textAlign: "center" }}>Valor Bruto</th>
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
                        <td>{t.store === "altoxv" ? "Alto da XV" : "Ahú"}</td>
                        <td>{formatDate(t.date)}</td>
                        <td style={{ textAlign: "left", paddingLeft: "12px" }}>{t.memo}</td>
                        <td>{t.category}</td>
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

export default ImporteVendasCloudfy;
