import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import ChecklistAberturaForm from "../components/ChecklistAberturaForm";
import { useAuth } from '../components/AuthProvider.tsx';
import supabase from '../supabase-client';
import { STORE_CONFIG } from '../config/store.js';
import "../css/Checklist.css";

const telegramBotId = "6170143874:AAGyo6gioXlufhGGzPTGNe9YE6TrCuoKEWU";
const telegramChatId = "-1001602173856";
const unidadeText = STORE_CONFIG.textName;
const unidade = STORE_CONFIG.key;
const unitAddress = STORE_CONFIG.address;

// Function Get Local Storage
function getLocalStorage() {
  let openC = JSON.parse(localStorage.getItem("altoxvOpen"));
  let today = new Date();
  let dayToday = today.getDate();
  console.log(`dayToday = ${dayToday}`);

  if (openC) {
    let lastDayComplete = new Date(openC.timestamp).getDate();
    console.log(`lastDayComplete = ${lastDayComplete}`);

    if (dayToday == lastDayComplete) {
      console.log("Stop Form");
      // Checklist already complete today
      // Block Form
    } else {
      console.log("Continue Form");
      localStorage.setItem("altoxvOpen", 0);
    }
  }
}
getLocalStorage();

async function sendSupabase(user, money_data) {
  console.log("supabase");
  const newdata = {
    checklist: "Checklist de Abertura",
    person: user,
    store: unidade,
    money_data: money_data,

  };
  const { data, error } = await supabase
    .from("Checklist")
    .insert([newdata])
    .single();

  if (error) {
    console.log(error);
    return false;
  } else {
    console.log("tudo ok", data);
    return true;
  }
}

// Function Submit Form
function altoxvOpenSubmit(user) {
  var object = { value: "complete", timestamp: new Date().getTime() };
  localStorage.setItem("altoxvOpen", JSON.stringify(object));
}

function ChecklistAbertura() {
  const handleSubmit = async (event, user, moneyCounterMessage = "", moneyCounterData = null) => {
    event.preventDefault();

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setSubmissionStatus("submitting");
    setTimeComplete("Enviando...");

    console.log("enviou");
    
    const success = await sendSupabase(user, moneyCounterData);
    
    if (success) {
      altoxvOpenSubmit(user);
      setSubmissionStatus("success");
      setTimeComplete("✅ Sucesso! Checklist salvo no banco de dados.");
    } else {
      setSubmissionStatus("error");
      setTimeComplete("❌ Falha ao salvar no banco de dados. Verifique a internet e tente novamente.");
    }

    /*     // Send Telegram message with money counter data
        const openDateFormat = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        const checkOpenComplete = `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Checklist de Abertura - Loja ${unidadeText} %0D%0A ${openDateFormat} %0D%0A %0D%0A Responsável: ${user}${moneyCounterMessage}`;
    
        fetch(checkOpenComplete)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            window.location.replace(`https://${unidade}.carmellagelateria.com.br/`);
          })
          .catch(error => {
            console.error('Error:', error);
            window.alert("Erro na confirmação do Checklist, por gentileza tente novamente");
          }); */
  };

  const [timeComplete, setTimeComplete] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("idle");
  let openC = JSON.parse(localStorage.getItem("altoxvOpen"));

  if (submissionStatus !== "idle") {
    openC = { value: "complete" };
  }

  useEffect(() => {
    if (openC) {
      console.log(`openC timestamp = ${openC.timestamp}`);
    } else {
      openC = "Ainda nao completo";
    }
    let openDateFormat = new Date(openC.timestamp);
    openDateFormat =
      "Checklist Completo em: " +
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
    console.log(openDateFormat);
    setTimeComplete(openDateFormat);
  }, []);

  return (
    <>
      <Helmet>
        <title>Checklist de Abertura</title>
      </Helmet>
      <div className="checklistContainer">
        <div className="unitContainer">
          <div className="unitInfo">
            <h1>Checklist de Abertura</h1>

            <h2>Unidade {unidadeText} - {unitAddress}</h2>
          </div>
          <div className="unitLogo">
            <img src="/logo.svg" alt="" />
          </div>
        </div>
        {openC && openC.value === "complete" ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '40px' }}>
            <span className="timeComplete" style={{ 
              color: submissionStatus === 'error' ? '#ef4444' : submissionStatus === 'success' ? '#22c55e' : '#666',
              fontSize: '24px', fontWeight: 'bold', textAlign: 'center'
            }}>
              {timeComplete}
            </span>
            {submissionStatus === 'error' && (
              <button 
                onClick={() => setSubmissionStatus('idle')}
                style={{ padding: '12px 24px', backgroundColor: '#a37a57', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
              >
                Voltar e Tentar Novamente
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="warningContainer">
              <p className="warningText">Bater Ponto</p>

              <p className="warningText">
                <span className="warningIcon">
                  <Icons.BsExclamationDiamondFill />
                </span>
                Avental | Máscara | Faixa de Cabelo / Boné
              </p>
            </div>
            <div className="checklistFormContainer">
              <ChecklistAberturaForm handleSubmit={handleSubmit} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ChecklistAbertura;
