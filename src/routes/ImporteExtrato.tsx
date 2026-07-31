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
  const [selectedBankMode, setSelectedBankMode] = useState<"Inter" | "Itau" | null>(null);
  const [accountWarning, setAccountWarning] = useState<boolean>(false);

  useEffect(() => {
    if (file && selectedConta) {
      processFile();
    }
  }, [file, selectedConta]);

  useEffect(() => {
    if (selectedBankMode) {
      const filtered = contas.filter(c => {
        const searchString = `${c.banco} ${c.descricao} ${c.label}`.toLowerCase();
        if (selectedBankMode === "Inter") return searchString.includes("inter");
        if (selectedBankMode === "Itau") return searchString.includes("itau") || searchString.includes("itaú");
        return false;
      });
      if (filtered.length === 1) {
        setSelectedConta(filtered[0].label);
      } else {
        setSelectedConta("");
      }
    }
  }, [selectedBankMode, contas]);

  const filteredContas = contas.filter(c => {
    if (!selectedBankMode) return false;
    const searchString = `${c.banco} ${c.descricao} ${c.label}`.toLowerCase();
    if (selectedBankMode === "Inter") return searchString.includes("inter");
    if (selectedBankMode === "Itau") return searchString.includes("itau") || searchString.includes("itaú");
    return false;
  });

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
      setAccountWarning(true);
      alert("Por favor, selecione a conta bancária no campo destacado no topo da tabela.");
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
        const payloads = txsToInsert.map(t => {
          let cat = null;
          let memoUpper = (t.memo || "").toUpperCase();
          if (memoUpper.includes("RECEBIMENTO REDE")) {
            cat = "Vendas Loja - Cartão";
          } else if (memoUpper.includes("PIX QRS")) {
            cat = "Vendas Loja - PIX";
          }

          return {
            data: t.date,
            descricao: t.memo || "Lançamento via Importação OFX",
            valor: t.amount,
            conta: selectedConta,
            categoria: cat,
            fornecedor: null,
            user_id: user?.id,
            status_revisao: null,
            conciliado: true
          };
        });

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

  const handleReconcileSingleItem = async (tx: any) => {
    if (!selectedConta) {
      alert("Por favor, selecione a conta bancária no topo.");
      return;
    }
    if (!tx.dbId || !tx.matchedDbRecord) return;

    const matched = tx.matchedDbRecord;

    try {
      if (matched.sourceTable === "contas_pagar_receber") {
        // Lançamento vem do Contas a Pagar -> Insere em lancamentos_financeiros e REMOVE do contas_pagar_receber
        const orig = matched.originalData || {};
        
        const payload = {
          data: tx.date,
          descricao: orig.descricao || tx.memo || "Lançamento via Importação OFX",
          fornecedor: orig.fornecedor_cliente || null,
          valor: tx.amount,
          categoria: orig.categoria || null,
          conta: selectedConta,
          user_id: user?.id,
          status_revisao: orig.status_revisao || null,
          conciliado: true
        };

        const { data: insertedData, error: insertErr } = await supabase
          .from("lancamentos_financeiros")
          .insert([payload])
          .select();

        if (insertErr) throw insertErr;

        // Deleta o registro da tabela contas_pagar_receber para remover de Contas a Pagar
        const { error: deleteErr } = await supabase
          .from("contas_pagar_receber")
          .delete()
          .eq("id", orig.id);

        if (deleteErr) {
          console.warn("Aviso ao remover do contas_pagar_receber:", deleteErr);
        }

        const newDbId = insertedData && insertedData.length > 0 ? insertedData[0].id : tx.dbId;

        setTransactions(prev => prev.map(item => {
          if (item.id === tx.id) {
            return { 
              ...item, 
              dbId: newDbId,
              status: "Já Conciliado",
              matchedDbRecord: {
                id: newDbId,
                data: tx.date,
                valor: tx.amount,
                descricao: orig.descricao || tx.memo,
                conciliado: true,
                sourceTable: "lancamentos_financeiros",
                sourceLabel: "Lançamento Financeiro"
              }
            };
          }
          return item;
        }));
      } else {
        // Lançamento vem do Lançamentos Financeiros -> atualiza conciliado = true e conta = selectedConta
        const { error } = await supabase
          .from("lancamentos_financeiros")
          .update({ conciliado: true, conta: selectedConta })
          .eq("id", tx.dbId);

        if (error) throw error;

        setTransactions(prev => prev.map(item => {
          if (item.id === tx.id) {
            return { 
              ...item, 
              status: item.status.includes("Agrupado") ? "Já Conciliado (Agrupado)" : "Já Conciliado" 
            };
          }
          return item;
        }));
      }

      setSelectedTxIds(prev => {
        const next = new Set(prev);
        next.delete(tx.id);
        return next;
      });
    } catch (err: any) {
      console.error("Erro ao conciliar:", err);
      alert("Erro ao conciliar: " + (err.message || "Erro desconhecido"));
    }
  };

  const handleCreateSingleItem = async (tx: any) => {
    if (!selectedConta) {
      alert("Por favor, selecione a conta bancária no topo.");
      return;
    }

    let cat = null;
    const memoUpper = (tx.memo || "").toUpperCase();
    if (memoUpper.includes("RECEBIMENTO REDE")) {
      cat = "Vendas Loja - Cartão";
    } else if (memoUpper.includes("PIX QRS")) {
      cat = "Vendas Loja - PIX";
    }

    const payload = {
      data: tx.date,
      descricao: tx.memo || "Lançamento via Importação OFX",
      valor: tx.amount,
      conta: selectedConta,
      categoria: cat,
      fornecedor: null,
      user_id: user?.id,
      status_revisao: null,
      conciliado: true,
    };

    try {
      const { data, error } = await supabase
        .from("lancamentos_financeiros")
        .insert([payload])
        .select();

      if (error) throw error;

      const createdRecord = data && data.length > 0 ? data[0] : null;

      setTransactions(prev => prev.map(item => {
        if (item.id === tx.id) {
          return {
            ...item,
            dbId: createdRecord?.id || null,
            status: "Importado",
            matchedDbRecord: createdRecord || {
              data: tx.date,
              valor: tx.amount,
              descricao: tx.memo || "Lançamento via Importação OFX",
              conciliado: true
            }
          };
        }
        return item;
      }));

      setSelectedTxIds(prev => {
        const next = new Set(prev);
        next.delete(tx.id);
        return next;
      });
    } catch (err: any) {
      console.error("Erro ao criar lançamento:", err);
      alert("Erro ao criar lançamento: " + (err.message || "Erro desconhecido"));
    }
  };

  const handleRejectMatch = (txId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        return {
          ...t,
          status: "Não Encontrado",
          dbId: null,
          matchedDbRecord: null,
          rejectedMatch: true
        };
      }
      return t;
    }));
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

      if (memo.toLowerCase().includes("saldo total dispon") || memo.trim().toUpperCase() === "SALDO ANTERIOR") {
        continue;
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
    if (!selectedConta) {
      setAccountWarning(true);
    } else {
      setAccountWarning(false);
    }
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

        // 1. Fetch DB Lancamentos estritamente filtrados pela conta bancária selecionada
        let queryLf = supabase
          .from("lancamentos_financeiros")
          .select("id, data, valor, descricao, conciliado, conta, categoria, fornecedor")
          .gte("data", boundsMin)
          .lte("data", boundsMax);
          
        if (selectedConta) {
          queryLf = queryLf.eq("conta", selectedConta);
        }

        // 2. Fetch Contas a Pagar / Receber (contas_pagar_receber) para incluir na pesquisa de conciliação
        let queryCpr = supabase
          .from("contas_pagar_receber")
          .select("id, data, valor, descricao, fornecedor_cliente, categoria, is_recorrente, status_revisao")
          .gte("data", boundsMin)
          .lte("data", boundsMax);

        const [{ data: dbLfData, error: errorLf }, { data: dbCprData, error: errorCpr }] = await Promise.all([
          queryLf,
          queryCpr
        ]);

        if (errorLf) throw errorLf;
        if (errorCpr) throw errorCpr;

        // Formata os lançamentos financeiros da conta selecionada
        const formattedLf = (dbLfData || []).map((db: any) => ({
          ...db,
          sourceTable: "lancamentos_financeiros",
          sourceLabel: "Lançamento Financeiro",
          originalData: db
        }));

        // Formata as contas a pagar / receber
        const formattedCpr = (dbCprData || []).map((db: any) => ({
          id: db.id,
          data: db.data,
          valor: db.valor,
          descricao: [db.descricao, db.fornecedor_cliente].filter(Boolean).join(" - "),
          conciliado: false,
          sourceTable: "contas_pagar_receber",
          sourceLabel: "Contas a Pagar",
          originalData: db
        }));

        const availableDb = [...formattedLf, ...formattedCpr];

        // Inicializa todos como "Não Encontrado"
        parsed.forEach(ofx => {
          ofx.status = "Não Encontrado";
          ofx.matchedDbRecord = null;
        });

        const matchIndividual = (maxDiffDays: number) => {
          parsed.forEach(ofx => {
            if (ofx.status !== "Não Encontrado") return;
            const ofxDate = new Date(ofx.date + "T00:00:00").getTime();
            const ofxAmount = Math.abs(ofx.amount);

            let matchIdx = availableDb.findIndex(db => {
              const dbAmount = Math.abs(parseFloat(db.valor || "0"));
              if (Math.abs(dbAmount - ofxAmount) > 0.01) return false;
              
              const dbDate = new Date(db.data + "T00:00:00").getTime();
              const diffDays = Math.abs(ofxDate - dbDate) / (1000 * 60 * 60 * 24);
              return diffDays <= maxDiffDays && !db.conciliado;
            });

            if (matchIdx !== -1) {
              const matched = availableDb[matchIdx];
              ofx.dbId = matched.id;
              ofx.status = "Encontrado";
              ofx.matchedDbRecord = matched;
              availableDb.splice(matchIdx, 1);
            } else {
              // Verifica nos já conciliados apenas para marcar o status visual
              const alreadyIdx = availableDb.findIndex(db => {
                const dbAmount = Math.abs(parseFloat(db.valor || "0"));
                if (Math.abs(dbAmount - ofxAmount) > 0.01) return false;
                
                const dbDate = new Date(db.data + "T00:00:00").getTime();
                const diffDays = Math.abs(ofxDate - dbDate) / (1000 * 60 * 60 * 24);
                return diffDays <= maxDiffDays && db.conciliado;
              });
              if (alreadyIdx !== -1) {
                const matched = availableDb[alreadyIdx];
                ofx.dbId = matched.id;
                ofx.status = "Já Conciliado";
                ofx.matchedDbRecord = matched;
                availableDb.splice(alreadyIdx, 1);
              }
            }
          });
        };

        const matchGrouped = (maxDiffDays: number) => {
          const groupsToTest: any[][] = [];
          const unmatchedPositivesByDate: { [dateStr: string]: any[] } = {};
          const unmatchedNegativesByDate: { [dateStr: string]: any[] } = {};
          
          parsed.forEach(ofx => {
            if (ofx.status === "Não Encontrado") {
              if (ofx.amount >= 0) {
                if (!unmatchedPositivesByDate[ofx.date]) unmatchedPositivesByDate[ofx.date] = [];
                unmatchedPositivesByDate[ofx.date].push(ofx);
              } else {
                if (!unmatchedNegativesByDate[ofx.date]) unmatchedNegativesByDate[ofx.date] = [];
                unmatchedNegativesByDate[ofx.date].push(ofx);
              }
            }
          });

          Object.values(unmatchedPositivesByDate).forEach(g => { if (g.length > 1) groupsToTest.push(g); });
          Object.values(unmatchedNegativesByDate).forEach(g => { if (g.length > 1) groupsToTest.push(g); });

          groupsToTest.forEach(groupTxs => {
            const groupSum = groupTxs.reduce((sum, tx) => sum + tx.amount, 0);
            const dateStr = groupTxs[0].date;
            
            let matchIdx = availableDb.findIndex(db => {
              if (db.conciliado) return false;
              const dbAmount = parseFloat(db.valor || "0");
              if (Math.abs(dbAmount - groupSum) > 0.01) return false;
              
              const dbDate = new Date(db.data + "T00:00:00").getTime();
              const ofxDate = new Date(dateStr + "T00:00:00").getTime();
              const diffDays = Math.abs(ofxDate - dbDate) / (1000 * 60 * 60 * 24);
              return diffDays <= maxDiffDays;
            });

            if (matchIdx !== -1) {
              const matchedDb = availableDb[matchIdx];
              groupTxs.forEach(ofx => {
                ofx.dbId = matchedDb.id;
                ofx.status = "Encontrado (Agrupado)";
                ofx.matchedDbRecord = matchedDb;
              });
              availableDb.splice(matchIdx, 1);
            } else {
              let alreadyIdx = availableDb.findIndex(db => {
                if (!db.conciliado) return false;
                const dbAmount = parseFloat(db.valor || "0");
                if (Math.abs(dbAmount - groupSum) > 0.01) return false;
                
                const dbDate = new Date(db.data + "T00:00:00").getTime();
                const ofxDate = new Date(dateStr + "T00:00:00").getTime();
                const diffDays = Math.abs(ofxDate - dbDate) / (1000 * 60 * 60 * 24);
                return diffDays <= maxDiffDays;
              });

              if (alreadyIdx !== -1) {
                const matchedDb = availableDb[alreadyIdx];
                groupTxs.forEach(ofx => {
                  ofx.dbId = matchedDb.id;
                  ofx.status = "Já Conciliado (Agrupado)";
                  ofx.matchedDbRecord = matchedDb;
                });
                availableDb.splice(alreadyIdx, 1);
              }
            }
          });
        };

        // Executa os 4 passos em ordem de prioridade
        matchIndividual(0);
        matchGrouped(0);
        matchIndividual(3);
        matchGrouped(3);

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

      <div className="frequencia-container" style={{ padding: "20px 32px", paddingLeft: "100px", width: "100%", maxWidth: "100%" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "12px", color: "#334155", marginBottom: "24px", fontSize: "2.4rem" }}>
          <Icons.BsFileEarmarkArrowUp /> Importe de Extrato
        </h1>

        <input 
          type="file" 
          accept=".ofx" 
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {!selectedBankMode ? (
          <div style={{ background: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", marginBottom: "32px", textAlign: "center" }}>
            <h2 style={{ fontSize: "2rem", color: "#334155", marginBottom: "12px" }}>De qual banco você deseja importar o extrato?</h2>
            <p style={{ fontSize: "1.4rem", color: "#64748b", marginBottom: "40px" }}>Escolha o banco para iniciarmos o processo de leitura do arquivo OFX.</p>
            
            <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
              {/* Card Inter */}
              <div 
                onClick={() => {
                  setSelectedBankMode("Inter");
                  fileInputRef.current?.click();
                }}
                style={{
                  width: "240px",
                  height: "160px",
                  borderRadius: "16px",
                  backgroundColor: "#FF7A00",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 15px -3px rgba(255, 122, 0, 0.4)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(255, 122, 0, 0.5)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(255, 122, 0, 0.4)"; }}
              >
                <img src="/Logo-Inter.png" alt="Banco Inter" style={{ width: "120px", filter: "brightness(0) invert(1)" }} onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.parentElement!.innerHTML = '<span style="color: white; font-size: 2.5rem; font-weight: 800; font-family: Inter, sans-serif;">inter</span>' }} />
              </div>

              <div 
                onClick={() => {
                  setSelectedBankMode("Itau");
                  fileInputRef.current?.click();
                }}
                style={{
                  width: "240px",
                  height: "160px",
                  borderRadius: "16px",
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 15px -3px rgba(0, 39, 118, 0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  borderBottom: "8px solid #002776"
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 39, 118, 0.2)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 39, 118, 0.1)"; }}
              >
                <img src="/logo_itau.png" alt="Itaú" style={{ width: "160px", objectFit: "contain" }} onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.parentElement!.innerHTML = '<span style="color: #002776; font-size: 2.5rem; font-weight: 800; font-family: Arial, sans-serif; background: #FFCC00; padding: 4px 12px; border-radius: 4px;">Itaú</span>' }} />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button 
                  onClick={() => {
                    setSelectedBankMode(null);
                    setFile(null);
                    setTransactions([]);
                    setSelectedTxIds(new Set());
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                  }}
                >
                  <Icons.BsArrowLeft /> Voltar
                </button>
                <span style={{ fontSize: "1.4rem", fontWeight: "bold", color: selectedBankMode === "Inter" ? "#FF7A00" : "#EC7000", backgroundColor: selectedBankMode === "Inter" ? "#fff7ed" : "#ffedd5", padding: "4px 12px", borderRadius: "20px" }}>
                  Banco {selectedBankMode === "Itau" ? "Itaú" : "Inter"}
                </span>
              </div>
            </div>

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
        )}

        {/* Prompt amigável para selecionar a conta bancária */}
        {transactions.length > 0 && !selectedConta && (
          <div style={{ background: "#fff", padding: "40px 24px", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", marginBottom: "32px" }}>
            <div 
              style={{ 
                backgroundColor: "#f8fafc", 
                border: "1px solid #e2e8f0", 
                borderRadius: "16px", 
                padding: "32px 24px", 
                maxWidth: "580px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "16px"
              }}
            >
              <div 
                style={{ 
                  width: "64px", 
                  height: "64px", 
                  borderRadius: "50%", 
                  backgroundColor: "#eff6ff", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "#3b82f6"
                }}
              >
                <Icons.BsBuildingCheck style={{ fontSize: "2.8rem" }} />
              </div>

              <div>
                <h3 style={{ fontSize: "2rem", color: "#1e293b", margin: "0 0 8px 0", fontWeight: "bold" }}>
                  Quase lá! Selecione a Conta Bancária
                </h3>
                <p style={{ fontSize: "1.4rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                  Seu extrato foi lido com sucesso (<strong>{transactions.length} transações encontradas</strong>).<br />
                  Para visualizar a tabela de lançamentos, escolha a conta bancária desejada:
                </p>
              </div>

              <div style={{ marginTop: "8px", width: "100%", maxWidth: "380px" }}>
                <select
                  value={selectedConta}
                  onChange={(e) => {
                    setSelectedConta(e.target.value);
                    if (e.target.value) setAccountWarning(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "2px solid #3b82f6",
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                    fontSize: "1.5rem",
                    color: "#1e293b",
                    height: "48px",
                    fontWeight: "600",
                    cursor: "pointer",
                    outline: "none"
                  }}
                >
                  <option value="">Selecione uma conta bancária...</option>
                  {filteredContas.map(c => (
                    <option key={c.id} value={c.label}>
                      {c.displayLabel || c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tabela de Comparação de 2 Colunas - Exibida somente quando a Conta Bancária estiver selecionada */}
        {transactions.length > 0 && selectedConta && (
          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
              <h2 style={{ fontSize: "1.8rem", color: "#334155", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <Icons.BsListCheck /> Comparativo de Extrato OFX ({transactions.length} Lançamentos)
              </h2>

              {/* Seletor de Conta Bancária */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#475569" }}>
                  Conta Bancária:
                </label>
                <select
                  value={selectedConta}
                  onChange={(e) => {
                    setSelectedConta(e.target.value);
                    if (e.target.value) setAccountWarning(false);
                  }}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#fff",
                    fontSize: "1.4rem",
                    color: "#334155",
                    height: "42px",
                    minWidth: "260px",
                    cursor: "pointer"
                  }}
                >
                  <option value="">Selecione uma conta bancária...</option>
                  {filteredContas.map(c => (
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
                      fontSize: "1.4rem",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)"
                    }}
                  >
                    {syncing ? <Icons.BsArrowRepeat className="spin" /> : <Icons.BsPlusCircle />}
                    {`Processar Selecionados (${selectedTxIds.size})`}
                  </button>
                )}
              </div>
            </div>

            <div className="table-responsive" style={{ maxHeight: "68vh", overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
              <table className="frequencia-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  {/* Super Header com 2 Colunas Grandes */}
                  <tr>
                    <th 
                      colSpan={4} 
                      style={{ 
                        backgroundColor: "#eff6ff", 
                        color: "#1e40af", 
                        padding: "12px 16px", 
                        fontSize: "1.4rem", 
                        fontWeight: "bold",
                        borderRight: "3px solid #cbd5e1",
                        textAlign: "left"
                      }}
                    >
                      🏦 1. Lançamentos no Extrato Bancário (OFX)
                    </th>
                    <th 
                      colSpan={3} 
                      style={{ 
                        backgroundColor: "#f0fdf4", 
                        color: "#166534", 
                        padding: "12px 16px", 
                        fontSize: "1.4rem", 
                        fontWeight: "bold",
                        textAlign: "left"
                      }}
                    >
                      💻 2. Lançamentos no Sistema (Carmella) & Ações
                    </th>
                  </tr>

                  {/* Sub Header com Nomes das Colunas */}
                  <tr style={{ backgroundColor: "#f8fafc", color: "#475569", fontSize: "1.2rem", textTransform: "uppercase" }}>
                    <th style={{ width: "40px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll} 
                        checked={allSelected} 
                        style={{ cursor: "pointer" }}
                      />
                    </th>
                    <th style={{ width: "110px", borderBottom: "2px solid #e2e8f0" }}>Data Extrato</th>
                    <th style={{ textAlign: "left", paddingLeft: "12px", borderBottom: "2px solid #e2e8f0" }}>Descrição (MEMO)</th>
                    <th style={{ width: "140px", textAlign: "right", borderRight: "3px solid #cbd5e1", paddingRight: "16px", borderBottom: "2px solid #e2e8f0" }}>Valor Extrato</th>

                    <th style={{ width: "130px", borderBottom: "2px solid #e2e8f0", paddingLeft: "12px" }}>Data Sistema</th>
                    <th style={{ textAlign: "left", paddingLeft: "12px", borderBottom: "2px solid #e2e8f0" }}>Descrição no Sistema</th>
                    <th style={{ width: "240px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>Ação Recomendada</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((t, idx) => {
                    const isMatched = t.status === "Encontrado" || t.status === "Encontrado (Agrupado)";
                    const isAlreadyDone = t.status === "Já Conciliado" || t.status === "Já Conciliado (Agrupado)" || t.status === "Importado";
                    const isNotFound = t.status === "Não Encontrado";
                    const dbRec = t.matchedDbRecord;

                    return (
                      <tr 
                        key={idx}
                        style={{
                          backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                          transition: "background-color 0.15s ease"
                        }}
                      >
                        {/* --- ESQUERDA: EXTRATO OFX --- */}
                        <td style={{ textAlign: "center" }}>
                          <input 
                            type="checkbox" 
                            checked={selectedTxIds.has(t.id)} 
                            onChange={() => toggleSelectTx(t.id)} 
                            disabled={isAlreadyDone}
                            style={{ cursor: isAlreadyDone ? "not-allowed" : "pointer" }}
                          />
                        </td>
                        <td style={{ fontWeight: "bold", color: "#334155" }}>
                          {formatDate(t.date)}
                        </td>
                        <td style={{ textAlign: "left", paddingLeft: "12px", color: "#1e293b", fontWeight: 500 }}>
                          {t.memo || "Sem descrição"}
                        </td>
                        <td 
                          style={{ 
                            textAlign: "right", 
                            fontWeight: "bold", 
                            fontSize: "1.4rem",
                            color: t.amount >= 0 ? "#059669" : "#dc2626",
                            borderRight: "3px solid #cbd5e1",
                            paddingRight: "16px"
                          }}
                        >
                          {formatCurrency(t.amount)}
                        </td>

                        {/* --- DIREITA: SISTEMA CARMELLA & AÇÕES --- */}
                        <td style={{ paddingLeft: "12px", fontSize: "1.3rem", color: "#475569" }}>
                          {dbRec ? (
                            <div>
                              <span style={{ fontWeight: "bold", color: "#1e293b" }}>{formatDate(dbRec.data)}</span>
                              {t.date !== dbRec.data && (
                                <span style={{ display: "block", fontSize: "1.1rem", color: "#d97706", fontWeight: "bold" }}>
                                  ⚠️ Tolerância até 3 dias
                                </span>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: "#cbd5e1" }}>-</span>
                          )}
                        </td>

                        <td style={{ textAlign: "left", paddingLeft: "12px" }}>
                          {dbRec ? (
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                <span style={{ fontWeight: "500", color: "#334155" }}>{dbRec.descricao || "Lançamento Financeiro"}</span>
                                {dbRec.sourceTable === "contas_pagar_receber" && (
                                  <span 
                                    style={{ 
                                      backgroundColor: "#fef3c7", 
                                      color: "#92400e", 
                                      padding: "2px 6px", 
                                      borderRadius: "4px", 
                                      fontSize: "1.0rem", 
                                      fontWeight: "bold" 
                                    }}
                                  >
                                    Contas a Pagar
                                  </span>
                                )}
                              </div>
                              <span style={{ display: "block", fontSize: "1.2rem", fontWeight: "bold", color: parseFloat(dbRec.valor) >= 0 ? "#059669" : "#dc2626" }}>
                                {formatCurrency(parseFloat(dbRec.valor || "0"))}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: "1.3rem" }}>
                              Nenhum lançamento idêntico no sistema
                            </span>
                          )}
                        </td>

                        <td style={{ textAlign: "center", padding: "8px 12px" }}>
                          {isMatched && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
                              <button
                                onClick={() => handleReconcileSingleItem(t)}
                                style={{
                                  backgroundColor: "#10b981",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "6px",
                                  padding: "8px 14px",
                                  fontSize: "1.3rem",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)",
                                  width: "100%",
                                  justifyContent: "center"
                                }}
                                title="Conciliar com este lançamento existente no sistema"
                              >
                                <Icons.BsCheck2Circle /> Conciliar Lançamento
                              </button>

                              <button
                                onClick={() => handleRejectMatch(t.id)}
                                style={{
                                  backgroundColor: "transparent",
                                  color: "#ef4444",
                                  border: "1px solid #fca5a5",
                                  borderRadius: "6px",
                                  padding: "4px 10px",
                                  fontSize: "1.15rem",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px"
                                }}
                                title="Marcar que esta sugestão está incorreta para realizar o lançamento correto"
                              >
                                <Icons.BsXCircle /> Não é este lançamento
                              </button>
                            </div>
                          )}

                          {isNotFound && (
                            <button
                              onClick={() => handleCreateSingleItem(t)}
                              style={{
                                backgroundColor: "#3b82f6",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "8px 14px",
                                fontSize: "1.3rem",
                                fontWeight: "bold",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)"
                              }}
                              title="Nenhum lançamento equivalente no sistema. Criar agora?"
                            >
                              <Icons.BsPlusLg /> Criar no Sistema
                            </button>
                          )}

                          {isAlreadyDone && (
                            <span 
                              style={{ 
                                backgroundColor: "#d1fae5", 
                                color: "#065f46", 
                                padding: "6px 12px", 
                                borderRadius: "20px", 
                                fontWeight: "bold", 
                                fontSize: "1.2rem",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              <Icons.BsCheckLg /> {t.status}
                            </span>
                          )}
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
