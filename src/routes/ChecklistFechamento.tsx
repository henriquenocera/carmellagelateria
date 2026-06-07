import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";

import * as Icons from "react-icons/bs";
import ChecklistFechamentoForm from "../components/ChecklistFechamentoForm";
import "../css/Checklist.css";
import supabase from "../supabase-client";
import { STORE_CONFIG } from '../config/store.js';

const telegramBotId = "6170143874:AAGyo6gioXlufhGGzPTGNe9YE6TrCuoKEWU";
const telegramChatId = "-1001602173856";
const unidadeText = STORE_CONFIG.textName;
const unidade = STORE_CONFIG.key;
const unitAddress = STORE_CONFIG.address;

async function sendOpenMessage(
  openDateFormat,
  geladeira,
  brownie,
  panos,
  user
) {
  const checkOpenComplete = `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Checklist de Fechamento - Loja ${unidadeText} %0D%0A ${openDateFormat}

  %0D%0A  %0D%0A Responsável: ${user}  %0D%0A
  %0D%0A Qntd Massas na Geladeira: ${geladeira};
  %0D%0A Qntd de Brownies na Geladeira: ${brownie}
  %0D%0A Qntd de Panos Limpos: ${panos}`;
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
    window.location.replace(`https://${unidade}.carmellagelateria.com.br/`);
  } catch (error) {
    console.error(error);
    window.alert(
      "Erro na confirmação do Checklist, por gentileza tente novamente"
    );
  }
}
function getLocalStorage() {
  let openC = JSON.parse(localStorage.getItem("altoxvClose"));
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
      localStorage.setItem("altoxvClose", 0);
    }
  }
}
getLocalStorage();

async function sendSupabase(user, massas, brownies, panos) {
  console.log("supabase");
  const newdata = {
    checklist: "Checklist de Fechamento",
    person: user,
    store: unidade,
    massas: massas,
    brownies: brownies,
    panos: panos
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

function altoxvCloseSubmit(geladeira, brownie, panos, user) {
  var object = { value: "complete", timestamp: new Date().getTime() };
  localStorage.setItem("altoxvClose", JSON.stringify(object));

  let openDateFormat = new Date(object.timestamp);
  openDateFormat =
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
  // sendOpenMessage(openDateFormat, geladeira, brownie, panos, user);
}

function ChecklistFechamento() {
  const onSubmit = async (event, geladeira, brownie, panos, user) => {
    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setSubmissionStatus("submitting");
    setTimeComplete("Enviando...");

    console.log("enviou");
    
    const success = await sendSupabase(user, geladeira, brownie, panos);
    
    if (success) {
      altoxvCloseSubmit(geladeira, brownie, panos, user);
      setSubmissionStatus("success");
      setTimeComplete("✅ Sucesso! Checklist salvo no banco de dados.");
    } else {
      setSubmissionStatus("error");
      setTimeComplete("❌ Falha ao salvar no banco de dados. Verifique a internet e tente novamente.");
    }
  };

  const [timeComplete, setTimeComplete] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("idle");
  let openC = JSON.parse(localStorage.getItem("altoxvClose"));

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
        <title>Checklist de Fechamento</title>
      </Helmet>

      <div className="checklistContainer">
        <div className="unitContainer">
          <div className="unitInfo">
            <h1>Checklist de Fechamento</h1>

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
            <div className="checklistFormContainer">
              <ChecklistFechamentoForm handleSubmit={onSubmit} />
            </div>
            <div className="warningContainer">
              <p className="warningText">Bater Ponto</p>

              <p className="warningText">
                <span className="warningIcon">
                  <Icons.BsExclamationDiamondFill />
                </span>
                Ligar Alarme e Trancar a Porta
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ChecklistFechamento;
