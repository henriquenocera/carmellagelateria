import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import "../css/Estoque.css";

import { Insumos } from "../Insumos.ts";

const unidadeText = "Ahu";
const unidade = "ahu";

function Estoque() {
  const [isFormSending, setIsFormSending] = useState(false);
  const [item, setItem] = useState("");

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

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
    // sendValeMessage(openDateFormat);
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
      window.alert("Sucesso!");
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
        <h1>Saídas de Estoque</h1>
        <form
          onSubmit={sendGoogleSheetData}
          method="POST"
          action="https://script.google.com/macros/s/AKfycbyU0w9O3gAAHl4arnQj6Koq6Zh3_mnZx6qSzCwHVTn5xzfAZbsa7xCoI6W4RqTrdBod/exec"
          id="EstoqueForm"
          className="valeGelatoForm"
        >
          <input
            name="Unidade"
            className="userInput none"
            type="text"
            value={unidadeText}
          />

          <div className="selectContainer">
            <span className="selectTitle">Selecione o Produto</span>
            <h2>
              <a
                target="_blank"
                href="https://docs.google.com/spreadsheets/d/1OdPZkH1hQdsz3ht7mSjnmRzRK89nm59iGlGOU8o5BmM/edit?usp=sharing"
              >
                Lista de Insumos da Loja
              </a>
            </h2>

            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={isDisabled}
              isLoading={isLoading}
              isClearable={isClearable}
              isRtl={isRtl}
              isSearchable={isSearchable}
              name="Item"
              options={Insumos}
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
      </div>
    </>
  );
}

export default Estoque;
