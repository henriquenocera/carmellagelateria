import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import "../css/Estoque.css";

import { PerdasList } from "../Perdas.ts";

const telegramBotId = "6365911641:AAHZVRdhJ-g_zFCKbqmtls9afnV0eGppU9g";
const telegramChatId = "-972583737";

const unidadeText = "Batel";
const unidade = "batel";

function Perdas() {
  const [isFormSending, setIsFormSending] = useState(false);
  const [item, setItem] = useState("");

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  async function sendValeMessage(openDateFormat) {
    const checkOpenComplete = `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Perdas%0D%0ALoja ${unidadeText} %0D%0A ${openDateFormat} %0D%0A ${item}`;
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

  async function sendGoogleSheetData(e) {
    console.log("enviou");
    setIsFormSending(true);
    let openDateFormat = new Date();
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
    sendValeMessage(openDateFormat);
    e.preventDefault();

    const action = e.target.action;
    const form = document.getElementById("EstoqueForm");
    const data = new FormData(form);
    await fetch(action, {
      method: "POST",
      body: data,
    }).then(() => {
      console.log("sucesso");
      setIsFormSending(false);
      window.alert("Lançamento Realizado com Sucesso!");
      // window.location.replace(`https://${unidade}.carmellagelateria.com.br/`);
    });
  }

  function handleSelect(e) {
    setItem(e.value);
  }

  return (
    <>
      <div className="EstoqueContainer">
        <img className="logo" src="/logo.svg" alt="" />
        <h1>Perdas e Quebras de Estoque</h1>
        <form
          onSubmit={sendGoogleSheetData}
          method="POST"
          action="https://script.google.com/macros/s/AKfycbxLeMhaqopAvrrldrP-gPZHGh21jyfMigL-9F-nWXxks3Sty5BS5qKgDVA7yKDKLYIE/exec"
          id="EstoqueForm"
          className="valeGelatoForm"
        >
          <input
            name="Unidade"
            className="userInput none"
            type="text"
            value={unidadeText}
          />

          {isFormSending ? (
            <h3>Enviando...</h3>
          ) : (
            <>
              <div className="selectContainer">
                <span className="selectTitle">Selecione</span>

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  isDisabled={isDisabled}
                  isLoading={isLoading}
                  isClearable={isClearable}
                  isRtl={isRtl}
                  isSearchable={isSearchable}
                  name="Item"
                  options={PerdasList}
                  onChange={(e) => handleSelect(e)}
                />
              </div>

              <button className="sendForm" type="submit">
                Enviar
              </button>
            </>
          )}
        </form>
      </div>
    </>
  );
}

export default Perdas;
