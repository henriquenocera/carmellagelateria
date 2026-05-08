import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import ChecklistAberturaForm from "../components/ChecklistAberturaForm";
import "../css/Checklist.css";
import supabase from "../supabase-client";

const telegramBotId = "6170143874:AAGyo6gioXlufhGGzPTGNe9YE6TrCuoKEWU";
const telegramChatId = "-1001602173856";
const unidadeText = "Ahu";
const unidade = "ahu";

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
  } else {
    console.log("tudo ok", data);
  }
}

// Function Submit Form
function altoxvOpenSubmit(user) {
  var object = { value: "complete", timestamp: new Date().getTime() };
  localStorage.setItem("altoxvOpen", JSON.stringify(object));
}

function ChecklistAbertura() {
  const handleSubmit = (event, user, moneyCounterMessage = "", moneyCounterData = null) => {
    event.preventDefault();

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setTimeComplete("Enviando...");

    console.log("enviou");
    // supabase
    sendSupabase(user, moneyCounterData);
    altoxvOpenSubmit(user);

    // Send Telegram message with money counter data
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
      });
  };

  const [timeComplete, setTimeComplete] = useState("");
  let openC = JSON.parse(localStorage.getItem("altoxvOpen"));

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

            <h2>Unidade {unidadeText} - Rua Colombo, 183</h2>
          </div>
          <div className="unitLogo">
            <img src="/logo.svg" alt="" />
          </div>
        </div>
        {openC && openC.value === "complete" ? (
          <span className="timeComplete">{timeComplete}</span>
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
