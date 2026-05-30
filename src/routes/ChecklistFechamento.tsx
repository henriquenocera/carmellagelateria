import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";

import * as Icons from "react-icons/bs";
import ChecklistFechamentoForm from "../components/ChecklistFechamentoForm";
import "../css/Checklist.css";
import supabase from "../supabase-client";

const telegramBotId = "6170143874:AAGyo6gioXlufhGGzPTGNe9YE6TrCuoKEWU";
const telegramChatId = "-1001602173856";
const unidadeText = "Escritório";
const unidade = "escritorio";

async function sendOpenMessage(
  openDateFormat,
  geladeira,
  brownie,
  panos,
  user
) {
  const checkOpenComplete = `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Checklist - Escritório ${unidadeText} %0D%0A ${openDateFormat}

  `;
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

async function sendSupabase(user) {
  console.log("supabase");
  const newdata = {
    checklist: "Checklist de Fechamento",
    person: user,
    store: unidade,
  };
  const { data, error } = await supabase
    .from("Checklist")
    .insert([newdata])
    .single();

  if (error) {
    console.log(error);
  } else {
    console.log("tudo ok", data);
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
  const onSubmit = (event, geladeira, brownie, panos, user) => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setTimeComplete("Enviando...");

    console.log("enviou");
    // supabase
    sendSupabase(user);
    event.preventDefault();
    altoxvCloseSubmit(geladeira, brownie, panos, user);
    
    // Limpar o progresso salvo
    localStorage.removeItem("checklistEscritorio_checkedItems");
    localStorage.removeItem("checklistEscritorio_currentStep");
  };

  const [timeComplete, setTimeComplete] = useState("");
  let openC = JSON.parse(localStorage.getItem("altoxvClose"));

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
        <title>Checklist Escritório</title>
      </Helmet>

      <div className="checklistContainer">
        <div className="unitContainer">
          <div className="unitInfo">
            <h1>Checklist Escritório</h1>

            <h2>Unidade {unidadeText} - Rua Sete de Abril, 934</h2>
          </div>
          <div className="unitLogo">
            <img src="/logo.svg" alt="" />
          </div>
        </div>
        {openC && openC.value === "complete" ? (
          <span className="timeComplete">{timeComplete}</span>
        ) : (
          <>
            <div className="checklistFormContainer">
              <ChecklistFechamentoForm handleSubmit={onSubmit} />
            </div>

          </>
        )}
      </div>
    </>
  );
}

export default ChecklistFechamento;
