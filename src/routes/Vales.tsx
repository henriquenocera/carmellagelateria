import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import "../css/Valegelato.css";
import { Options } from "../Options.ts";

const telegramBotId = "5902485837:AAFN9PL6ES3Otgwvzg6qqhvqCgw5WvL7DsY";
const telegramChatId = "-946708416";

const unidadeText = "Alto da XV";
const unidade = "altoxv";

function Vales() {
  const [user, setUser] = useState("");
  const idInputRef = useRef(null);
  const [item, setItem] = useState("");
  const [isFormSending, setIsFormSending] = useState(false);

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  async function sendValeMessage(openDateFormat) {
    const checkOpenComplete = `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Vale - Loja ${unidadeText} %0D%0A ${openDateFormat} %0D%0A ${user} %0D%0A ${item}`;
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

  function handleSelect(e) {
    setItem(e.value);
  }
  function handleClick(e) {
    e.preventDefault();
    let idInput = idInputRef.current.value;

    if (idInput == 270312) {
      setUser("Henrique");
    } else if (idInput == 1727) {
      setUser("Marina");
    } else if (idInput == 2839) {
      setUser("Grasielli");
    } else if (idInput == 2467) {
      setUser("Sthefani");
    } else {
      setUser("");
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
    const form = document.getElementById("valeGelatoForm");
    const data = new FormData(form);
    await fetch(action, {
      method: "POST",
      body: data,
    }).then(() => {
      setIsFormSending("Sucesso!");
      window.location.replace(`https://${unidade}.carmellagelateria.com.br/`);
    });
  }
  return (
    <>
      <div className="valegelatoContainer">
        <div className="top">
          <img className="logo" src="/logo.svg" alt="" />
          <h1>Vales</h1>
          <form className="idForm" action="#">
            <label className="idLabel" htmlFor="id">
              ID Único
            </label>
            <input
              className="idInput"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              min="0"
              max="9999"
              autoFocus
              required
              ref={idInputRef}
            />
            <button onClick={handleClick} className="idSubmit" type="submit">
              Verificar ID
            </button>
          </form>
        </div>

        {user == "" ? (
          <></>
        ) : (
          <form
            onSubmit={sendGoogleSheetData}
            method="POST"
            action="https://script.google.com/macros/s/AKfycbwo5DREVbk_S-YQrregCSnCeFsJr4mYVKOce0d9nq9obXFg-5hQv-iqx-5j7-3Mm7r5Tw/exec"
            id="valeGelatoForm"
            className="valeGelatoForm"
          >
            <label className="label" htmlFor="">
              Nome
            </label>
            <input name="Nome" className="userInput" type="text" value={user} />

            <input
              name="Unidade"
              className="userInput"
              type="text"
              value={unidadeText}
            />

            <div className="selectContainer">
              <span className="selectTitle">Selecione o Produto</span>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isDisabled={isDisabled}
                isLoading={isLoading}
                isClearable={isClearable}
                isRtl={isRtl}
                isSearchable={isSearchable}
                name="Item"
                options={Options}
                onChange={(e) => handleSelect(e)}
              />
            </div>

            {isFormSending ? (
              <h3>Enviando...</h3>
            ) : (
              <button className="sendForm" type="submit">
                Enviar
              </button>
            )}
          </form>
        )}
      </div>
    </>
  );
}

export default Vales;
