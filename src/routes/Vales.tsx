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
  const idInputRef = useRef<HTMLInputElement>(null);
  const [selectedItems, setSelectedItems] = useState([{ id: Date.now(), name: "", valor: 0 }]);
  const [produtosList, setProdutosList] = useState<any[]>([]);
  const [isFormSending, setIsFormSending] = useState(false);
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

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
  
  // Primeiro, adiciona todos os itens seguindo a ordem do Options.ts
  Options.forEach((opt: any) => {
    const dbItem = produtosList.find(p => p.nome === opt.value);
    selectOptions.push({
      value: opt.value,
      label: opt.label,
      valorReal: dbItem ? dbItem.valor : 0
    });
  });

  // Em seguida, adiciona no final da lista qualquer item do banco que não estava no Options.ts
  produtosList.forEach((p: any) => {
    if (!Options.find((opt: any) => opt.value === p.nome)) {
      selectOptions.push({
        value: p.nome,
        label: p.nome,
        valorReal: p.valor
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
      .select("name, data_registro")
      .eq("short_id", idInput)
      .single();

    if (error || !data) {
      setIsCheckingId(false);
      window.alert("ID não encontrado. Verifique e tente novamente.");
      setUser("");
      setCurrentBalance(null);
    } else {
      setUser(data.name);

      let query = supabase.from("Vales").select("valor").eq("Nome", data.name);
      if (data.data_registro) {
        query = query.gte("created_at", data.data_registro);
      }
      const { data: valesData, error: valesError } = await query;
      
      setIsCheckingId(false);

      if (!valesError && valesData) {
        const total = valesData.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
        setCurrentBalance(total);
      } else {
        setCurrentBalance(0);
      }
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
    setSelectedItems([{ id: Date.now(), name: "", valor: 0 }]);
    setSubmitStatus("idle");
    setCurrentBalance(null);
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

  return (
    <>
      <Helmet>
        <title>Lançamento de Vales</title>
      </Helmet>

      <div className="valegelatoContainer">
        <div className="vales-card">
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
              <button className="idSubmit" type="submit" disabled={isCheckingId}>
                {isCheckingId ? "Verificando..." : "Verificar ID"}
              </button>
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
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: selectedItems.reduce((acc, curr) => acc + Math.abs(curr.valor), 0) > 0 ? "8px" : "0" }}>
                    <span style={{ color: "#64748b", fontWeight: 600, fontSize: "1.4rem" }}>Saldo Atual:</span>
                    <span style={{ color: currentBalance < 0 ? "#ef4444" : "#16a34a", fontWeight: 700, fontSize: "1.5rem" }}>
                      R$ {currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {selectedItems.reduce((acc, curr) => acc + Math.abs(curr.valor), 0) > 0 && (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "#64748b", fontWeight: 600, fontSize: "1.4rem" }}>Este Lançamento:</span>
                        <span style={{ color: "#ef4444", fontWeight: 700, fontSize: "1.5rem" }}>
                          - R$ {selectedItems.reduce((acc, curr) => acc + Math.abs(curr.valor), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #cbd5e1", paddingTop: "8px" }}>
                        <span style={{ color: "#334155", fontWeight: 700, fontSize: "1.4rem" }}>Saldo Futuro:</span>
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
