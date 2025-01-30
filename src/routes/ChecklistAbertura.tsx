import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import ChecklistAberturaForm from "../components/ChecklistAberturaForm";
import "../css/Checklist.css";

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

// Function Send Telegram Message
async function sendOpenMessage(openDateFormat, user) {
  const checkOpenComplete = `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Checklist de Abertura - Loja ${unidadeText} %0D%0A ${openDateFormat} %0D%0A Loja Aberta e Tudo Funcionando %0D%0A ${user}`;

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

// Function Submit Form
function altoxvOpenSubmit(user) {
  var object = { value: "complete", timestamp: new Date().getTime() };
  localStorage.setItem("altoxvOpen", JSON.stringify(object));

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
  sendOpenMessage(openDateFormat, user);
}

function ChecklistAbertura() {
  const onSubmit = (event, user) => {
    event.preventDefault();

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setTimeComplete("Enviando...");

    console.log("enviou");
    altoxvOpenSubmit(user);
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
              <ChecklistAberturaForm handleSubmit={onSubmit} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ChecklistAbertura;
