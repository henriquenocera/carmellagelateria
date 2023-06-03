import React, { useEffect, useState } from "react";
import * as Icons from "react-icons/bs";

const telegramBotId = "5635956016:AAFzevSjVPEhTVsOEfLpbUsT0jni93pG6-c";
const telegramChatId = "a-1001602173856";

async function sendOpenMessage(openDateFormat) {
  const checkOpenComplete = `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Checklist de Abertura - Loja Alto XV %0D%0A ${openDateFormat}`;
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
    window.location.reload();
  } catch (error) {
    console.error(error);
    window.alert(
      "Erro na confirmação do Checklist, por gentileza tente novamente"
    );
  }
}
function getLocalStorage() {
  let today = new Date();
  let open = JSON.parse(localStorage.getItem("altoxvOpen"));
  if (open) {
    open.timestamp = open.timestamp;
    console.log(open.timestamp);
  } else {
    open = "Ainda nao completo";
  }
  let openDateFormat = new Date(open.timestamp);
  openDateFormat =
    "Checklist Completo em: " +
    openDateFormat.getDate() +
    "/" +
    openDateFormat.getMonth() +
    "/" +
    openDateFormat.getFullYear() +
    " -- " +
    openDateFormat.getHours() +
    ":" +
    openDateFormat.getMinutes() +
    ":" +
    openDateFormat.getSeconds();
  console.log(openDateFormat);

  let dayToday = today.getDate();
  let lastDayComplete = new Date(open.timestamp).getDate();

  /*   if (dayToday == lastDayComplete) {
    console.log("Stop Form"); */
  // Checklist already complete today
  // Block Form
  /*     form.addEventListener("submit", (e) => {
      e.preventDefault();
    }); */

  /*     let inputs = form.querySelectorAll(".inp-cbx");
    inputs.forEach((input) => {
      input.checked = true;
      input.disabled = true;
    }); */

  /*     let button = form.querySelector(".submit");
    button.disabled = true;
  } else {
    let e = document.querySelector("#timestamp");
    e.innerHTML = "";
  } */
}
getLocalStorage();
function altoxvOpenSubmit() {
  const currentDate = new Date();
  console.log(currentDate);

  var object = { value: "complete", timestamp: new Date().getTime() };
  localStorage.setItem("altoxvOpen", JSON.stringify(object));

  let openDateFormat = new Date(object.timestamp);
  openDateFormat =
    openDateFormat.getDate() +
    "/" +
    openDateFormat.getMonth() +
    "/" +
    openDateFormat.getFullYear() +
    " -- " +
    openDateFormat.getHours() +
    ":" +
    openDateFormat.getMinutes() +
    ":" +
    openDateFormat.getSeconds();
  sendOpenMessage(openDateFormat);
}

const onSubmit = (e) => {
  console.log("enviou");
  e.preventDefault();
  altoxvOpenSubmit();
};

function ChecklistFechamento() {
  const [timeComplete, setTimeComplete] = useState(false);
  let openC = JSON.parse(localStorage.getItem("altoxvOpen"));

  useEffect(() => {
    let openC = JSON.parse(localStorage.getItem("altoxvOpen"));
    if (openC) {
      openC.timestamp = openC.timestamp;
      console.log(openC.timestamp);
    } else {
      openC = "Ainda nao completo";
    }
    let openDateFormat = new Date(openC.timestamp);
    openDateFormat =
      "Checklist Completo em: " +
      openDateFormat.getDate() +
      "/" +
      openDateFormat.getMonth() +
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
          <h2>Unidade Alto da XV - Rua Sete de Abril, 934</h2>
        </div>
        <div className="unitLogo">
          <img src="/logo.svg" alt="" />
        </div>
      </div>
      {openC && openC.value == "complete" ? (
        <span className="timeComplete">{timeComplete}</span>
      ) : (
        <>
          <div className="warningContainer">
            <p className="warningText">
              <span className="warningIcon">
                <Icons.BsExclamationDiamondFill />
              </span>
              Avental | Máscara | Faixa de Cabelo / Boné
            </p>
            <p className="warningText">Bater Ponto</p>
          </div>
          <div className="firstCheck">
            <p className="firstCheckTitle">1ª Prioridade ( Fator Tempo )</p>

            <form onSubmit={onSubmit} action="" className="firstCheckForm">
              <input type="text" name="name" />

              <button type="submit">Enviar</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default ChecklistFechamento;
