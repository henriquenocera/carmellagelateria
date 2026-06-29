import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import "../css/Frequencia.css";

function ImporteExtrato() {
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

  const selectableTxs = transactions.filter(t => 
    t.status === "Não Encontrado" || 
    t.status === "Encontrado" || 
    t.status === "Encontrado (Agrupado)"
  );
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

    const selectedTxs = transactions.filter(t => selectedTxIds.has(t.id));
    const txsToInsert = selectedTxs.filter(t => t.status === "Não Encontrado");
    const txsToReconcile = selectedTxs.filter(t => t.status === "Encontrado" || t.status === "Encontrado (Agrupado)");

    if (selectedTxs.length === 0) {
      alert("Nenhuma transação selecionada para importação ou conciliação.");
      return;
    }

    let confirmationMsg = "";
    if (txsToInsert.length > 0 && txsToReconcile.length > 0) {
      confirmationMsg = `Deseja lançar ${txsToInsert.length} novas transações e conciliar ${txsToReconcile.length} transações existentes na conta "${selectedConta}"?`;
    } else if (txsToInsert.length > 0) {
      confirmationMsg = `Deseja lançar as ${txsToInsert.length} novas transações na conta "${selectedConta}"?`;
    } else {
      confirmationMsg = `Deseja conciliar as ${txsToReconcile.length} transações existentes na conta "${selectedConta}"?`;
    }

    if (!window.confirm(confirmationMsg)) {
      return;
    }

    setSyncing(true);
    try {
      // 1. Lança as novas transações
      if (txsToInsert.length > 0) {
        const payloads = txsToInsert.map(t => ({
          data: t.date,
          descricao: t.memo || "Lançamento via Importação OFX",
          valor: t.amount,
          conta: selectedConta,
          categoria: null,
          fornecedor: null,
          user_id: user?.id,
          status_revisao: null,
          conciliado: true
        }));

        const { error } = await supabase
          .from("lancamentos_financeiros")
          .insert(payloads);

        if (error) throw error;
      }

      // 2. Concilia os lançamentos existentes no banco de dados
      if (txsToReconcile.length > 0) {
        const dbIdsToUpdate = txsToReconcile.map(t => t.dbId).filter(Boolean);

        const { error } = await supabase
          .from("lancamentos_financeiros")
          .update({ conciliado: true, conta: selectedConta })
          .in("id", dbIdsToUpdate);

        if (error) throw error;
      }

      // Atualiza o estado visual das transações na interface local
      setTransactions(prev => prev.map(t => {
        if (selectedTxIds.has(t.id)) {
          if (t.status === "Não Encontrado") {
            return { ...t, status: "Importado" };
          }
          if (t.status === "Encontrado" || t.status === "Encontrado (Agrupado)") {
            return { ...t, status: t.status.includes("Agrupado") ? "Já Conciliado (Agrupado)" : "Já Conciliado" };
          }
        }
        return t;
      }));

      setSelectedTxIds(new Set());

      let successMsg = "";
      if (txsToInsert.length > 0 && txsToReconcile.length > 0) {
        successMsg = `${txsToInsert.length} novos lançamentos importados e ${txsToReconcile.length} lançamentos existentes conciliados!`;
      } else if (txsToInsert.length > 0) {
        successMsg = `${txsToInsert.length} lançamentos importados com sucesso!`;
      } else {
        successMsg = `${txsToReconcile.length} lançamentos existentes conciliados com sucesso!`;
      }
      alert(successMsg);
    } catch (err: any) {
      console.error("Erro ao importar/conciliar lançamentos:", err);
      alert("Erro ao importar/conciliar lançamentos: " + (err.message || "Erro desconhecido."));
    } finally {
      setSyncing(false);
    }
  };

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
      setSelectedTxIds(new Set()); // reset selection
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

        // Match algorithm - Passo 1: Busca individual por transação
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

        // Match algorithm - Passo 2: Busca por soma agregada para a mesma data
        // Agrupa as transações "Não Encontrado" por data
        const unmatchedByDate: { [dateStr: string]: any[] } = {};
        parsed.forEach(ofx => {
          if (ofx.status === "Não Encontrado") {
            if (!unmatchedByDate[ofx.date]) {
              unmatchedByDate[ofx.date] = [];
            }
            unmatchedByDate[ofx.date].push(ofx);
          }
        });

        // Para cada data com múltiplas transações não encontradas, tenta achar um lançamento com a soma correspondente
        Object.keys(unmatchedByDate).forEach(dateStr => {
          const groupTxs = unmatchedByDate[dateStr];
          if (groupTxs.length > 1) {
            const groupSum = groupTxs.reduce((sum, tx) => sum + tx.amount, 0);

            // Procura lançamentos não conciliados cujo valor seja igual à soma (com sinal e tolerância)
            let matchIdx = availableDb.findIndex(db => {
              if (db.conciliado) return false;
              const dbAmount = parseFloat(db.valor || "0");
              if (Math.abs(dbAmount - groupSum) > 0.01) return false;
              
              const dbDate = new Date(db.data + "T00:00:00").getTime();
              const ofxDate = new Date(dateStr + "T00:00:00").getTime();
              const diffDays = Math.abs(ofxDate - dbDate) / (1000 * 60 * 60 * 24);
              return diffDays <= 3;
            });

            if (matchIdx !== -1) {
              const matchedDb = availableDb[matchIdx];
              groupTxs.forEach(ofx => {
                ofx.dbId = matchedDb.id;
                ofx.status = "Encontrado (Agrupado)";
              });
              availableDb.splice(matchIdx, 1); // consome da lista de disponíveis
            } else {
              // Procura entre os lançamentos já conciliados
              let alreadyIdx = availableDb.findIndex(db => {
                if (!db.conciliado) return false;
                const dbAmount = parseFloat(db.valor || "0");
                if (Math.abs(dbAmount - groupSum) > 0.01) return false;
                
                const dbDate = new Date(db.data + "T00:00:00").getTime();
                const ofxDate = new Date(dateStr + "T00:00:00").getTime();
                const diffDays = Math.abs(ofxDate - dbDate) / (1000 * 60 * 60 * 24);
                return diffDays <= 3;
              });

              if (alreadyIdx !== -1) {
                groupTxs.forEach(ofx => {
                  ofx.status = "Já Conciliado (Agrupado)";
                });
                availableDb.splice(alreadyIdx, 1);
              }
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
        <title>Importe de Extrato - Carmella</title>
      </Helmet>

      <div className="frequencia-container" style={{ padding: "20px 24px", paddingLeft: "95px", maxWidth: "1200px", margin: "0 auto" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
              <h2 style={{ fontSize: "1.8rem", color: "#334155", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsListCheck /> Transações OFX ({transactions.length})
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
                    <th style={{ textAlign: "left", paddingLeft: "12px" }}>Descrição (MEMO)</th>
                    <th style={{ width: "150px" }}>Status</th>
                    <th style={{ width: "150px", textAlign: "center" }}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, idx) => {
                    let statusColor = "#64748b";
                    if (t.status && t.status.includes("Encontrado")) statusColor = "#d97706";
                    if (t.status && (t.status.includes("Já Conciliado") || t.status.includes("Importado") || t.status === "Sincronizado")) statusColor = "#10b981";
                    if (t.status === "Não Encontrado") statusColor = "#ef4444";

                    return (
                      <tr key={idx}>
                        <td style={{ textAlign: "center" }}>
                          <input 
                            type="checkbox" 
                            checked={selectedTxIds.has(t.id)} 
                            onChange={() => toggleSelectTx(t.id)} 
                            disabled={t.status !== "Não Encontrado" && t.status !== "Encontrado" && t.status !== "Encontrado (Agrupado)"} 
                            style={{ 
                              cursor: (t.status === "Não Encontrado" || t.status === "Encontrado" || t.status === "Encontrado (Agrupado)") 
                                ? "pointer" 
                                : "not-allowed" 
                            }}
                          />
                        </td>
                        <td>{formatDate(t.date)}</td>
                        <td style={{ textAlign: "left", paddingLeft: "12px" }}>{t.memo || "Sem descrição"}</td>
                        <td>
                          <span 
                            style={{ 
                              backgroundColor: statusColor + "1a", // light background
                              color: statusColor, 
                              padding: "4px 8px", 
                              borderRadius: "12px",
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                              display: "inline-block"
                            }}
                            title={t.status.includes("Agrupado") ? "Este valor foi encontrado agrupado com outros do mesmo dia em um único lançamento no sistema." : undefined}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td style={{ 
                          textAlign: "center", 
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
