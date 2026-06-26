import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import "../css/Frequencia.css";

function ImporteExtrato() {
  const [file, setFile] = useState<File | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseOFX = (data: string) => {
    const txs: any[] = [];
    const stmttrnRegex = /<STMTTRN>([\s\S]*?)(?=<\/?STMTTRN>|<\/BANKTRANLIST>)/g;
    let match;
    while ((match = stmttrnRegex.exec(data)) !== null) {
      const block = match[1];
      const trntype = block.match(/<TRNTYPE>([^<]+)/)?.[1]?.trim() || "";
      const dtposted = block.match(/<DTPOSTED>([^<]+)/)?.[1]?.trim() || "";
      const trnamt = block.match(/<TRNAMT>([^<]+)/)?.[1]?.trim() || "";
      const fitid = block.match(/<FITID>([^<]+)/)?.[1]?.trim() || "";
      const memo = block.match(/<MEMO>([^<]+)/)?.[1]?.trim() || "";

      let date = "";
      if (dtposted) {
        date = `${dtposted.substring(0, 4)}-${dtposted.substring(4, 6)}-${dtposted.substring(6, 8)}`;
      }

      if (dtposted || trnamt || memo) {
        txs.push({
          id: fitid || Math.random().toString(),
          type: trntype,
          date,
          amount: parseFloat(trnamt || "0"),
          memo,
          dbId: null,
          status: "Analisando..."
        });
      }
    }
    return txs;
  };

  const handleFileSelection = (selected: File) => {
    if (selected.name.toLowerCase().endsWith(".ofx")) {
      setFile(selected);
      setTransactions([]); // reset on new file
    } else {
      alert("Por favor, selecione apenas arquivos .OFX");
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
        const parsed = parseOFX(content);
        
        parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (parsed.length === 0) {
          setTransactions([]);
          alert("Nenhuma transação encontrada no arquivo OFX.");
          setLoading(false);
          return;
        }

        // Determine min and max dates
        const dates = parsed.map(t => new Date(t.date + "T00:00:00").getTime());
        const minTime = Math.min(...dates);
        const maxTime = Math.max(...dates);

        // Margin of 3 days
        const boundsMin = new Date(minTime - 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-CA");
        const boundsMax = new Date(maxTime + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-CA");

        // Fetch DB Lancamentos
        const { data: dbData, error } = await supabase
          .from("lancamentos_financeiros")
          .select("id, data, valor, conciliado")
          .gte("data", boundsMin)
          .lte("data", boundsMax);

        if (error) {
          throw error;
        }

        const availableDb = dbData ? [...dbData] : [];

        // Match algorithm
        parsed.forEach(ofx => {
          const ofxDate = new Date(ofx.date + "T00:00:00").getTime();
          const ofxAmount = Math.abs(ofx.amount);

          let matchIdx = availableDb.findIndex(db => {
            const dbAmount = Math.abs(parseFloat(db.valor || "0"));
            if (Math.abs(dbAmount - ofxAmount) > 0.01) return false;
            
            const dbDate = new Date(db.data + "T00:00:00").getTime();
            const diffDays = Math.abs(ofxDate - dbDate) / (1000 * 60 * 60 * 24);
            return diffDays <= 3 && !db.conciliado;
          });

          if (matchIdx !== -1) {
            ofx.dbId = availableDb[matchIdx].id;
            ofx.status = "Encontrado";
            availableDb.splice(matchIdx, 1); // consumed
          } else {
            // Check if already reconciled
            const alreadyIdx = availableDb.findIndex(db => {
              const dbAmount = Math.abs(parseFloat(db.valor || "0"));
              if (Math.abs(dbAmount - ofxAmount) > 0.01) return false;
              
              const dbDate = new Date(db.data + "T00:00:00").getTime();
              const diffDays = Math.abs(ofxDate - dbDate) / (1000 * 60 * 60 * 24);
              return diffDays <= 3 && db.conciliado;
            });
            if (alreadyIdx !== -1) {
              ofx.status = "Já Conciliado";
              availableDb.splice(alreadyIdx, 1);
            } else {
              ofx.status = "Não Encontrado";
            }
          }
        });

        setTransactions(parsed);
      } catch (err: any) {
        console.error("Erro ao analisar arquivo OFX:", err);
        alert("Ocorreu um erro ao tentar ler/sincronizar este arquivo. Detalhes: " + (err.message || "Erro desconhecido."));
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleSyncToDb = async () => {
    const toSync = transactions.filter(t => t.status === "Encontrado" && t.dbId);
    if (toSync.length === 0) {
      alert("Nenhum lançamento pendente de sincronização (Status 'Encontrado').");
      return;
    }

    setSyncing(true);
    try {
      // Update one by one or in batch
      for (const t of toSync) {
        const { error } = await supabase
          .from("lancamentos_financeiros")
          .update({ conciliado: true })
          .eq("id", t.dbId);

        if (error) {
          if (error.message?.includes("column \"conciliado\" of relation")) {
            throw new Error("A coluna 'conciliado' (booleana) não existe na tabela 'lancamentos_financeiros'. Por favor, crie esta coluna no banco de dados.");
          }
          throw error;
        }
      }

      // Update local state to show them as synchronized
      setTransactions(prev => prev.map(t => {
        if (t.status === "Encontrado" && t.dbId) {
          return { ...t, status: "Sincronizado" };
        }
        return t;
      }));
      
      alert(`Sincronização concluída! ${toSync.length} lançamentos foram marcados como conciliados no banco.`);
    } catch (err: any) {
      console.error("Erro ao sincronizar:", err);
      alert("Erro ao sincronizar: " + (err.message || "Verifique a conexão e tente novamente."));
    } finally {
      setSyncing(false);
    }
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return dateStr.split("-").reverse().join("/");
  };

  const foundCount = transactions.filter(t => t.status === "Encontrado").length;
  const synchronizedCount = transactions.filter(t => t.status === "Sincronizado").length;

  return (
    <>
      <Helmet>
        <title>Importe de Extrato - Carmella</title>
      </Helmet>

      <div className="container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "12px", color: "#334155", marginBottom: "24px", fontSize: "2.4rem" }}>
          <Icons.BsFileEarmarkArrowUp /> Importe de Extrato
        </h1>

        <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", marginBottom: "32px" }}>
          <p style={{ color: "#64748b", fontSize: "1.4rem", marginBottom: "20px", textAlign: "center" }}>
            Selecione o arquivo de extrato bancário (formato <strong>.OFX</strong>) para visualizar os lançamentos.
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
                {file ? file.name : "Clique para selecionar ou arraste um arquivo .OFX"}
              </div>
              <input 
                type="file" 
                accept=".ofx" 
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
              <h2 style={{ fontSize: "1.8rem", color: "#334155", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsListCheck /> Transações OFX ({transactions.length})
              </h2>

              {(foundCount > 0 || synchronizedCount > 0) && (
                <button 
                  onClick={handleSyncToDb}
                  disabled={foundCount === 0 || syncing}
                  style={{
                    backgroundColor: (foundCount === 0 || syncing) ? "#94a3b8" : "#3b82f6",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "bold",
                    cursor: (foundCount === 0 || syncing) ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "1.4rem"
                  }}
                >
                  {syncing ? <Icons.BsArrowRepeat className="spin" /> : <Icons.BsCloudCheck />}
                  {syncing ? "Sincronizando..." : `Sincronizar no Banco (${foundCount})`}
                </button>
              )}
            </div>

            <div className="table-responsive" style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <table className="frequencia-table">
                <thead>
                  <tr>
                    <th style={{ width: "120px" }}>Data</th>
                    <th>Descrição (MEMO)</th>
                    <th style={{ width: "150px" }}>Status</th>
                    <th style={{ width: "150px", textAlign: "right" }}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, idx) => {
                    let statusColor = "#64748b";
                    if (t.status === "Encontrado") statusColor = "#d97706";
                    if (t.status === "Sincronizado" || t.status === "Já Conciliado") statusColor = "#10b981";
                    if (t.status === "Não Encontrado") statusColor = "#ef4444";

                    return (
                      <tr key={idx}>
                        <td>{formatDate(t.date)}</td>
                        <td>{t.memo || "Sem descrição"}</td>
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
                          textAlign: "right", 
                          fontWeight: "bold",
                          color: t.amount >= 0 ? "#10b981" : "#ef4444" 
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

export default ImporteExtrato;
