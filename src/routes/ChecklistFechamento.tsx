import React, { useEffect, useState } from "react";
import * as Icons from "react-icons/bs";
import ChecklistFechamentoForm from "../components/ChecklistFechamentoForm";
import "../css/Checklist.css";

const telegramBotId = "6170143874:AAGyo6gioXlufhGGzPTGNe9YE6TrCuoKEWU";
const telegramChatId = "-1001602173856";
const unidadeText = "Ahu";
const unidade = "ahu";

async function sendOpenMessage(
  openDateFormat,
  freezer,
  geladeira,
  morango,
  banana,
  amora,
  maca,
  brownie,
  panos,
  user
) {
  const checkOpenComplete = `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Checklist de Fechamento - Loja ${unidadeText} %0D%0A ${openDateFormat}

  %0D%0A Responsável: ${user}
  %0D%0A Qntd Massas no Freezer: ${freezer};
  %0D%0A Qntd Massas na Geladeira: ${geladeira};
  %0D%0A Potes Fechados Gel de Amora: ${amora};
  %0D%0A Potes Fechados Torta de Maça: ${maca}
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
function altoxvCloseSubmit(
  freezer,
  geladeira,
  morango,
  banana,
  amora,
  maca,
  brownie,
  panos,
  user
) {
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
  sendOpenMessage(
    openDateFormat,
    freezer,
    geladeira,
    morango,
    banana,
    amora,
    maca,
    brownie,
    panos,
    user
  );
}

function ChecklistFechamento() {
  const onSubmit = (
    event,
    freezer,
    geladeira,
    morango,
    banana,
    amora,
    maca,
    brownie,
    panos,
    user
  ) => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setTimeComplete("Enviando...");

    console.log("enviou");
    event.preventDefault();
    altoxvCloseSubmit(
      freezer,
      geladeira,
      morango,
      banana,
      amora,
      maca,
      brownie,
      panos,
      user
    );
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
    <div className="checklistContainer">
      <div className="unitContainer">
        <div className="unitInfo">
          <h1>Checklist de Fechamento</h1>

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
  );
}

export default ChecklistFechamento;
