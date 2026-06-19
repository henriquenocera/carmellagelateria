import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";

import Select from "react-select";
import "../css/Valegelato.css";
import { Options } from "../Options.ts";
import { useAuth } from '../components/AuthProvider.tsx';
import supabase from '../supabase-client';
import { STORE_CONFIG } from '../config/store.js';

const telegramBotId = "5902485837:AAFN9PL6ES3Otgwvzg6qqhvqCgw5WvL7DsY";
const telegramChatId = "-946708416";

const unidadeText = STORE_CONFIG.textName;
const unidade = STORE_CONFIG.key;

function Vales() {
  const [user, setUser] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const idInputRef = useRef<HTMLInputElement>(null);
  const [selectedItems, setSelectedItems] = useState([{ id: Date.now(), name: "", valor: 0 }]);
  const [produtosList, setProdutosList] = useState<any[]>([]);
  const [isFormSending, setIsFormSending] = useState(false);
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [futureBalance, setFutureBalance] = useState<number | null>(null);
  const [futureVales, setFutureVales] = useState<any[]>([]);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [consultView, setConsultView] = useState(false);
  const [consultingVales, setConsultingVales] = useState<any[]>([]);

  const [showNegativeBalanceModal, setShowNegativeBalanceModal] = useState(false);
  const [modalTimer, setModalTimer] = useState(5);

  const today = new Date();
  const [filterMonth, setFilterMonth] = useState<number>(today.getMonth() + 1);
  const [filterYear, setFilterYear] = useState<number>(today.getFullYear());
  const [showAllConsult, setShowAllConsult] = useState<boolean>(false);

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

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
  const yearsList = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i);

  const handleMonthNavigation = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (filterMonth === 1) {
        setFilterMonth(12);
        setFilterYear((prev) => prev - 1);
      } else {
        setFilterMonth((prev) => prev - 1);
      }
    } else {
      if (filterMonth === 12) {
        setFilterMonth(1);
        setFilterYear((prev) => prev + 1);
      } else {
        setFilterMonth((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showNegativeBalanceModal && modalTimer > 0) {
      interval = setInterval(() => {
        setModalTimer((prev) => prev - 1);
      }, 1000);
    } else if (modalTimer === 0) {
      setShowNegativeBalanceModal(false);
    }
    return () => clearInterval(interval);
  }, [showNegativeBalanceModal, modalTimer]);

  useEffect(() => {
    async function fetchProdutos() {
      const { data, error } = await supabase.from('produtos_vale').select('*');
      if (!error && data) {
        setProdutosList(data);
      }
    }
    fetchProdutos();
  }, []);

  const selectOptions: any[] = [];
  const currentDay = today.getDay();

  const isComboDiscountApplicable = (itemName: string, dayOfWeek: number) => {
    if (dayOfWeek === 1 && itemName.includes("COMBO SEGUNDA")) return true;
    if (dayOfWeek === 2 && itemName.includes("COMBO TERÇA")) return true;
    if (dayOfWeek === 3 && itemName.includes("COMBO QUARTA")) return true;
    if (dayOfWeek === 4 && itemName.includes("COMBO QUINTA")) return true;
    if (dayOfWeek === 5 && itemName.includes("COMBO SEXTA")) return true;
    return false;
  };

  // Primeiro, adiciona todos os itens seguindo a ordem do Options.ts
  Options.forEach((opt: any) => {
    const dbItem = produtosList.find(p => p.nome === opt.value);
    let valorFinal = dbItem ? dbItem.valor : 0;

    if (isComboDiscountApplicable(opt.value, currentDay)) {
      valorFinal -= 2;
    }

    selectOptions.push({
      value: opt.value,
      label: opt.label,
      valorReal: valorFinal
    });
  });

  // Em seguida, adiciona no final da lista qualquer item do banco que não estava no Options.ts
  produtosList.forEach((p: any) => {
    if (!Options.find((opt: any) => opt.value === p.nome)) {
      let valorFinal = p.valor;

      if (isComboDiscountApplicable(p.nome, currentDay)) {
        valorFinal -= 2;
      }

      selectOptions.push({
        value: p.nome,
        label: p.nome,
        valorReal: valorFinal
      });
    }
  });

  async function sendValeMessage(openDateFormat: string, itemsStr: string) {
    const checkOpenComplete = `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Vale - Loja ${unidadeText} %0D%0A ${openDateFormat} %0D%0A ${user} %0D%0A ${itemsStr}`;
    try {
      const response = await fetch(checkOpenComplete, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      console.log(JSON.stringify(data));
    } catch (error) {
      console.error(error);
      window.alert("Erro no Envio, por gentileza tente novamente");
    }
  }

  async function sendMakeWebhook(userName: string, userEmail: string, items: any[]) {
    // React só lê variáveis que começam com REACT_APP_
    // Como a chave atual é MAKE_WEBHOOK_URL, vou deixar a URL como fallback caso o .env não seja atualizado
    const webhookUrl = process.env.REACT_APP_MAKE_WEBHOOK_URL || "https://hook.us2.make.com/ggooa8voo7o86bpbkj6sn1vkiep4y2ai";
    const total = items.reduce((acc, curr) => acc + Math.abs(curr.valor), 0);
    const itemsStr = items.map(i => i.name).join(" + ");

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          evento: "novo_vale",
          nome: userName,
          email: userEmail,
          unidade: unidadeText,
          itens: itemsStr,
          total: total,
          data: new Date().toISOString()
        }),
      });
      console.log("Webhook do Make enviado com sucesso!");
    } catch (e) {
      console.error("Erro no envio do webhook para o Make", e);
    }
  }

  function handleSelect(e: any, index: number) {
    const newItems = [...selectedItems];
    if (e) {
      newItems[index] = { ...newItems[index], name: e.value, valor: e.valorReal };
    } else {
      newItems[index] = { ...newItems[index], name: "", valor: 0 };
    }
    setSelectedItems(newItems);
  }

  function addMoreItem() {
    setSelectedItems([...selectedItems, { id: Date.now(), name: "", valor: 0 }]);
  }

  function removeItem(index: number) {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
  }

  async function handleClick(e: any) {
    e.preventDefault();
    let idInput = idInputRef.current?.value;

    if (!idInput) return;

    setIsCheckingId(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("name, data_registro, email")
      .eq("short_id", idInput)
      .single();

    if (error || !data) {
      setIsCheckingId(false);
      window.alert("ID não encontrado. Verifique e tente novamente.");
      setUser("");
      setUserEmail("");
      setCurrentBalance(null);
    } else {
      setUser(data.name);
      setUserEmail(data.email);

      let query = supabase.from("Vales").select("valor, created_at, Item").eq("Nome", data.name);
      if (data.data_registro) {
        query = query.gte("created_at", data.data_registro);
      }
      const { data: valesData, error: valesError } = await query;

      setIsCheckingId(false);

      if (!valesError && valesData) {
        const now = new Date();
        let currTotal = 0;
        let futureTot = 0;
        let futureItems: any[] = [];
        valesData.forEach(curr => {
          const val = Number(curr.valor) || 0;
          const vDate = new Date(curr.created_at);
          if (vDate > now) {
            futureTot += val;
            futureItems.push(curr);
          } else {
            currTotal += val;
          }
        });
        setCurrentBalance(currTotal);
        setFutureBalance(futureTot);
        setFutureVales(futureItems);
        if (currTotal < 0) {
          setModalTimer(5);
          setShowNegativeBalanceModal(true);
        }
      } else {
        setCurrentBalance(0);
        setFutureBalance(0);
        setFutureVales([]);
      }
    }
  }

  async function handleConsultClick(e: any) {
    e.preventDefault();
    if (idInputRef.current && !idInputRef.current.validity.valid) {
      idInputRef.current.reportValidity();
      return;
    }
    let idInput = idInputRef.current?.value;

    if (!idInput) return;

    setIsCheckingId(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("name, data_registro, email")
      .eq("short_id", idInput)
      .single();

    if (error || !data) {
      setIsCheckingId(false);
      window.alert("ID não encontrado. Verifique e tente novamente.");
      setUser("");
      setUserEmail("");
      setConsultingVales([]);
      setConsultView(false);
      setCurrentBalance(null);
    } else {
      setUser(data.name);
      setUserEmail(data.email);

      let query = supabase.from("Vales").select("*").eq("Nome", data.name).order('created_at', { ascending: false });
      if (data.data_registro) {
        query = query.gte("created_at", data.data_registro);
      }
      const { data: valesData, error: valesError } = await query;

      setIsCheckingId(false);

      if (!valesError && valesData) {
        setConsultingVales(valesData);
        const now = new Date();
        let currTotal = 0;
        let futureTot = 0;
        valesData.forEach(curr => {
          const val = Number(curr.valor) || 0;
          const vDate = new Date(curr.created_at);
          if (vDate > now) {
            futureTot += val;
          } else {
            currTotal += val;
          }
        });
        setCurrentBalance(currTotal);
        setFutureBalance(futureTot);
      } else {
        setConsultingVales([]);
        setCurrentBalance(0);
        setFutureBalance(0);
      }
      setConsultView(true);
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault(); // evita o recarregamento da página

    sendGoogleSheetData(e);
    sendSupabaseData(e)
  };



  async function sendSupabaseData(e: any) {
    console.log("supabase");

    const validItems = selectedItems.filter((i) => i.name !== "");
    if (validItems.length === 0) return;

    const newdatas = validItems.map((i) => ({
      Nome: user,
      Unidade: unidadeText,
      Item: i.name,
      valor: -Math.abs(i.valor)
    }));

    const { data, error } = await supabase
      .from("Vales")
      .insert(newdatas);

    if (error) {
      console.log(`Opa, erro${error}`);
    } else {
      console.log("Supabase enviado com sucesso", data);
    }
  }

  async function sendGoogleSheetData(e: any) {
    console.log("enviou");
    setIsFormSending(true);
    let openDateFormat = new Date();
    const dateStr =
      openDateFormat.getDate() +
      "/" +
      (openDateFormat.getMonth() + 1) +
      "/" +
      openDateFormat.getFullYear() +
      " -- " +
      openDateFormat.getHours() +
      ":" +
      openDateFormat.getMinutes() +
      ":" +
      openDateFormat.getSeconds();

    const validItems = selectedItems.filter((i) => i.name !== "");
    const itemsStr = validItems.map(i => i.name).join(" + ");

    sendValeMessage(dateStr, itemsStr);
    sendMakeWebhook(user, userEmail, validItems);
    
    e.preventDefault();

    const action = (e.target as HTMLFormElement).action;

    try {
      for (const item of validItems) {
        const data = new FormData();
        data.append("Nome", user);
        data.append("Unidade", unidadeText);
        data.append("Item", item.name);

        await fetch(action, {
          method: "POST",
          body: data,
        });
      }

      console.log("Google Sheets enviado com sucesso");
      setIsFormSending(false);
      setSubmitStatus("success");
    } catch (err) {
      console.error(err);
      setIsFormSending(false);
      setSubmitStatus("error");
    }
  }

  function resetForm() {
    setUser("");
    setUserEmail("");
    setSelectedItems([{ id: Date.now(), name: "", valor: 0 }]);
    setSubmitStatus("idle");
    setCurrentBalance(null);
    setFutureBalance(null);
    setFutureVales([]);
    setConsultView(false);
    setConsultingVales([]);
    if (idInputRef.current) {
      idInputRef.current.value = "";
    }
  }
  // Estilo customizado para o Select ficar bem Premium!
  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      padding: '6px',
      borderRadius: '8px',
      borderColor: state.isFocused ? '#a17550' : '#e2e8f0',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(161, 117, 80, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#a17550'
      },
      backgroundColor: '#f8fafc',
      fontSize: '1.6rem',
      cursor: 'pointer'
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#a17550' : state.isFocused ? '#f9f2e4' : 'transparent',
      color: state.isSelected ? 'white' : '#334155',
      cursor: 'pointer',
      padding: '12px 16px',
      fontSize: '1.5rem',
      '&:active': {
        backgroundColor: '#a17550',
      }
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#94a3b8'
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      marginTop: '8px'
    })
  };

  const filteredConsultingVales = consultingVales.filter((vale) => {
    if (showAllConsult) return true;
    const d = new Date(vale.created_at);
    return d.getUTCMonth() + 1 === filterMonth && d.getUTCFullYear() === filterYear;
  });

  return (
    <>
      <Helmet>
        <title>Lançamento de Vales</title>
      </Helmet>

      {showNegativeBalanceModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "16px",
            textAlign: "center",
            maxWidth: "400px",
            width: "90%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            animation: "slideDown 0.3s ease-out"
          }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h2 style={{ color: "#ef4444", fontSize: "2.8rem", fontWeight: 700, margin: "0 0 15px" }}>Atenção!</h2>
            <p style={{ color: "#334155", fontSize: "1.8rem", margin: "0 0 25px", fontWeight: 500 }}>Seu saldo está negativo.</p>
            <div style={{
              backgroundColor: "#f1f5f9",
              padding: "16px 24px",
              borderRadius: "8px",
              display: "inline-block",
              color: "#64748b",
              fontSize: "1.6rem",
              fontWeight: 600
            }}>
              Aguarde {modalTimer} segundo{modalTimer !== 1 ? 's' : ''}...
            </div>
          </div>
        </div>
      )}

      <div className="valegelatoContainer">
        <div className="vales-card" style={{ maxWidth: consultView ? '800px' : '480px' }}>
          <img className="logo" src="/logo.svg" alt="Carmella Logo" />
          <h1 className="vales-title">Vales</h1>

          {isFormSending ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <h2 style={{ color: "#a17550", fontSize: "1.8rem" }}>Registrando vale...</h2>
            </div>
          ) : submitStatus === "success" ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 style={{ color: '#16a34a', fontSize: '2.4rem', fontWeight: 700, margin: 0 }}>Sucesso!</h2>
              <p style={{ color: '#475569', fontSize: '1.6rem', margin: '0 0 20px 0' }}>O vale foi registrado corretamente.</p>
              <button onClick={resetForm} className="sendForm" style={{ marginTop: 0 }}>
                Lançar outro vale
              </button>
            </div>
          ) : submitStatus === "error" ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
              <h2 style={{ color: '#ef4444', fontSize: '2.4rem', fontWeight: 700, margin: 0 }}>Ops!</h2>
              <p style={{ color: '#475569', fontSize: '1.6rem', margin: '0 0 20px 0' }}>Houve um erro ao registrar o vale. Tente novamente.</p>
              <button onClick={resetForm} className="sendForm" style={{ marginTop: 0, backgroundColor: '#ef4444' }}>
                Tentar novamente
              </button>
            </div>
          ) : consultView ? (
            <div className="consult-view" style={{ padding: "20px", width: "100%" }}>
              <h2 style={{ color: "#a17550", marginBottom: "20px", textAlign: "center", fontSize: "2rem" }}>Histórico de Vales - {user}</h2>

              {currentBalance !== null && (
                <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", marginBottom: "24px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#334155", fontWeight: 800, fontSize: "1.8rem" }}>Saldo Atual:</span>
                    <span style={{ color: currentBalance < 0 ? "#ef4444" : currentBalance > 0 ? "#16a34a" : "#64748b", fontWeight: 800, fontSize: "2.2rem" }}>
                      {currentBalance > 0 ? '+' : currentBalance < 0 ? '-' : ''} R$ {Math.abs(currentBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {futureBalance !== null && futureBalance !== 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #cbd5e1", paddingTop: "12px" }}>
                      <span style={{ color: "#b45309", fontWeight: 700, fontSize: "1.5rem" }}>Saldo Futuro Previsto:</span>
                      <span style={{ color: (currentBalance + futureBalance) < 0 ? "#ef4444" : (currentBalance + futureBalance) > 0 ? "#16a34a" : "#64748b", fontWeight: 700, fontSize: "1.8rem" }}>
                        {(currentBalance + futureBalance) > 0 ? '+' : (currentBalance + futureBalance) < 0 ? '-' : ''} R$ {Math.abs(currentBalance + futureBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
                <button type="button" onClick={() => { setShowAllConsult(false); handleMonthNavigation("prev"); }} style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "1.4rem" }}>&lt;</button>
                <select value={filterMonth} onChange={(e) => { setShowAllConsult(false); setFilterMonth(Number(e.target.value)); }} style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "1.4rem" }} disabled={showAllConsult}>
                  {monthsList.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                <select value={filterYear} onChange={(e) => { setShowAllConsult(false); setFilterYear(Number(e.target.value)); }} style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "1.4rem" }} disabled={showAllConsult}>
                  {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <button type="button" onClick={() => { setShowAllConsult(false); handleMonthNavigation("next"); }} style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#fff", cursor: "pointer", fontSize: "1.4rem" }}>&gt;</button>

                <button type="button" onClick={() => setShowAllConsult(!showAllConsult)} style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", background: showAllConsult ? "#a17550" : "#fff", color: showAllConsult ? "#fff" : "inherit", cursor: "pointer", marginLeft: "10px", fontSize: "1.4rem", fontWeight: showAllConsult ? "bold" : "normal" }}>
                  {showAllConsult ? "Vendo Todos os Períodos" : "Ver Todos"}
                </button>
              </div>

              {filteredConsultingVales.length === 0 ? (
                <p style={{ textAlign: "center", fontSize: "1.4rem", color: "#64748b" }}>Nenhum vale encontrado para o período selecionado.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="vales-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                        <th style={{ padding: "12px", textAlign: "left", color: "#475569", fontWeight: "bold" }}>Data</th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#475569", fontWeight: "bold" }}>Produto</th>
                        <th style={{ padding: "12px", textAlign: "right", color: "#475569", fontWeight: "bold" }}>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredConsultingVales.map((vale, index) => {
                        const isFuture = new Date(vale.created_at) > new Date();
                        return (
                          <tr key={index} style={{ borderBottom: "1px solid #e2e8f0" }}>
                            <td style={{ padding: "12px", color: "#334155" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <span>{new Date(vale.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                                {isFuture && (
                                  <span style={{ fontSize: "1.1rem", color: "#d97706", fontWeight: "bold", backgroundColor: "#fef3c7", padding: "2px 6px", borderRadius: "4px", width: "fit-content" }}>
                                    Lançamento futuro previsto
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: "12px", color: "#334155", fontWeight: 500 }}>{vale.Item}</td>
                            <td style={{ padding: "12px", textAlign: "right", color: Number(vale.valor) >= 0 ? "#16a34a" : "#ef4444", fontWeight: "bold" }}>
                              R$ {Math.abs(Number(vale.valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <div style={{ marginTop: "24px", display: "flex", justifyContent: "center" }}>
                <button onClick={resetForm} className="sendForm" style={{ backgroundColor: "#94a3b8", width: "auto", padding: "12px 32px" }}>
                  Voltar
                </button>
              </div>
            </div>
          ) : user === "" ? (
            <form className="idForm" onSubmit={handleClick}>
              <div className="input-group">
                <label htmlFor="idInput">ID Único do Funcionário</label>
                <input
                  id="idInput"
                  className="idInput"
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  min="0"
                  max="9999"
                  autoFocus
                  required
                  ref={idInputRef}
                  placeholder="••••"
                />
              </div>
              <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
                <button className="idSubmit" type="submit" disabled={isCheckingId}>
                  {isCheckingId ? "Verificando..." : "Lançar Vale"}
                </button>
                <button
                  type="button"
                  className="idSubmit"
                  style={{ background: "linear-gradient(135deg, #334155 0%, #0f172a 100%)", color: "#fff", border: "none" }}
                  onClick={handleConsultClick}
                  disabled={isCheckingId}
                >
                  Consultar Meus Vales
                </button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleSubmit}
              method="POST"
              action="https://script.google.com/macros/s/AKfycbwo5DREVbk_S-YQrregCSnCeFsJr4mYVKOce0d9nq9obXFg-5hQv-iqx-5j7-3Mm7r5Tw/exec"
              id="valeGelatoForm"
              className="valeGelatoForm"
            >
              <div className="input-group">
                <label>Colaborador</label>
                <input
                  name="Nome"
                  className="userInput"
                  type="text"
                  value={user}
                  readOnly
                />
              </div>

              <div className="input-group" style={{ display: 'none' }}>
                <input
                  name="Unidade"
                  className="userInput"
                  type="text"
                  value={unidadeText}
                  readOnly
                />
              </div>

              {currentBalance !== null && (
                <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: (futureVales.length > 0 || selectedItems.reduce((acc, curr) => acc + Math.abs(curr.valor), 0) > 0) ? "16px" : "0" }}>
                    <span style={{ color: "#334155", fontWeight: 800, fontSize: "1.8rem" }}>Saldo Atual:</span>
                    <span style={{ color: currentBalance < 0 ? "#ef4444" : "#16a34a", fontWeight: 800, fontSize: "2.2rem" }}>
                      R$ {currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {futureVales.length > 0 && (
                    <div style={{ backgroundColor: "#fffbeb", padding: "12px", borderRadius: "8px", marginBottom: selectedItems.reduce((acc, curr) => acc + Math.abs(curr.valor), 0) > 0 ? "16px" : "0", border: "1px solid #fde68a" }}>
                      <span style={{ color: "#d97706", fontWeight: 700, fontSize: "1.4rem", display: "block", marginBottom: "8px" }}>Lançamentos futuros:</span>
                      {futureVales.map((fv, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "1.3rem", color: "#64748b", marginBottom: "6px", paddingLeft: "8px", borderLeft: "2px solid #fbbf24" }}>
                          <span>{new Date(fv.created_at).toLocaleDateString('pt-BR')} - {fv.Item}</span>
                          <span style={{ color: Number(fv.valor) < 0 ? "#ef4444" : "#16a34a", fontWeight: 600 }}>R$ {Math.abs(Number(fv.valor)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "8px", borderTop: "1px dashed #fcd34d" }}>
                        <span style={{ color: "#b45309", fontWeight: 700, fontSize: "1.4rem" }}>Saldo Futuro Previsto:</span>
                        <span style={{ color: (currentBalance + futureBalance) < 0 ? "#ef4444" : "#16a34a", fontWeight: 800, fontSize: "1.6rem" }}>
                          R$ {(currentBalance + futureBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedItems.reduce((acc, curr) => acc + Math.abs(curr.valor), 0) > 0 && (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "#64748b", fontWeight: 600, fontSize: "1.4rem" }}>Este Lançamento:</span>
                        <span style={{ color: "#ef4444", fontWeight: 700, fontSize: "1.5rem" }}>
                          - R$ {selectedItems.reduce((acc, curr) => acc + Math.abs(curr.valor), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #cbd5e1", paddingTop: "8px" }}>
                        <span style={{ color: "#334155", fontWeight: 700, fontSize: "1.4rem" }}>Novo Saldo {futureVales.length > 0 ? 'Atual ' : ''}(Após Lançamento):</span>
                        <span style={{ color: (currentBalance - selectedItems.reduce((acc, curr) => acc + Math.abs(curr.valor), 0)) < 0 ? "#ef4444" : "#16a34a", fontWeight: 800, fontSize: "1.6rem" }}>
                          R$ {(currentBalance - selectedItems.reduce((acc, curr) => acc + Math.abs(curr.valor), 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {selectedItems.map((selected, index) => (
                <div key={selected.id} className="selectContainer" style={{ marginBottom: "15px" }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: "1.4rem", fontWeight: 600, color: "#64748b", marginLeft: "4px" }}>
                      Produto {index + 1}
                    </label>
                    {selectedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '1.2rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Remover
                      </button>
                    )}
                  </div>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isDisabled={isDisabled}
                    isLoading={isLoading}
                    isClearable={isClearable}
                    isRtl={isRtl}
                    autoFocus={index === selectedItems.length - 1}
                    isSearchable={true}
                    name={`Item-${index}`}
                    options={selectOptions}
                    onChange={(e) => handleSelect(e, index)}
                    styles={customSelectStyles}
                    placeholder="Buscar produto..."
                    noOptionsMessage={() => "Nenhum produto encontrado"}
                    required
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addMoreItem}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: '2px dashed #e2e8f0',
                  backgroundColor: '#f8fafc',
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '10px'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
              >
                + Adicionar mais produtos
              </button>

              <button className="sendForm" type="submit">
                Registrar Vale
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Vales;
