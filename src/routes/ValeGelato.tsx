import React, { useEffect, useRef, useState } from "react";
import "../css/Valegelato.css";

function ValeGelato() {
  const [user, setUser] = useState("");
  const idInputRef = useRef(null);
  const [pequeno, setPequeno] = useState(false);
  const [medio, setMedio] = useState(false);
  const [copinho, setCopinho] = useState(false);
  const [casquinha, setCasquinha] = useState(false);
  const [isFormSending, setIsFormSending] = useState(false);

  function handleClick(e) {
    e.preventDefault();
    setPequeno(false);
    setMedio(false);
    setCopinho(false);
    setCasquinha(false);
    let idInput = idInputRef.current.value;

    if (idInput == 1) {
      setUser("Henrique");
    } else if (idInput == 2) {
      setUser("Marina");
    } else {
      setUser("");
    }
  }

  function handlePequeno(e) {
    console.log(e.target);
    setPequeno(true);
    setMedio(false);
  }
  function handleMedio(e) {
    console.log(e.target);
    setPequeno(false);
    setMedio(true);
  }
  function handleCopinho(e) {
    console.log(e.target);
    setCopinho(true);
    setCasquinha(false);
  }
  function handleCasquinha(e) {
    console.log(e.target);
    setCasquinha(true);
    setCopinho(false);
  }
  function sendGoogleSheetData(e) {
    if (
      (pequeno == false && medio == false) ||
      (copinho == false && casquinha == false)
    ) {
      console.log("ERRO, TUDO FALSO");
      e.preventDefault();
    } else {
      console.log("enviou");
      setIsFormSending(true);
      e.preventDefault();

      const action = e.target.action;
      const form = document.getElementById("valeGelatoForm");
      const data = new FormData(form);
      fetch(action, {
        method: "POST",
        body: data,
      }).then(() => {
        setIsFormSending("Sucesso!");
        window.location.replace("https://altoxv.carmellagelateria.com.br/");
      });
    }
  }
  return (
    <>
      <div className="valegelatoContainer">
        <div className="top">
          <img className="logo" src="/logo.svg" alt="" />
          <h1>Vale Gelato</h1>
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
            action="https://script.google.com/macros/s/AKfycbxDrWqp2krWjcqXa0e6kXiKQI5jMqgDj2BZ9lJYsQxKnp_OtRld1YhA6s4A0rA0FbE42A/exec"
            id="valeGelatoForm"
            className="valeGelatoForm"
          >
            <label class="label" htmlFor="">
              Nome
            </label>
            <input name="Nome" className="userInput" type="text" value={user} />

            <input
              name="Unidade"
              className="userInput"
              type="text"
              value="Alto da XV"
            />
            <div className="flex">
              <div className="selectContainer">
                <input
                  name="Pequeno"
                  value={pequeno}
                  onClick={handlePequeno}
                  readonly
                  className={pequeno ? "selectItem active" : "selectItem"}
                ></input>
                <label className="SelectLabel" htmlFor="Pequeno">
                  Pequeno
                </label>
              </div>

              <div className="selectContainer">
                <input
                  name="Médio"
                  value={medio}
                  readonly
                  onClick={handleMedio}
                  className={medio ? "selectItem active" : "selectItem"}
                ></input>
                <label className="SelectLabel selectLabelMedio" htmlFor="Médio">
                  Médio
                </label>
              </div>
            </div>
            <div className="flex">
              <div className="selectContainer">
                <input
                  name="Copinho"
                  value={copinho}
                  readonly
                  onClick={handleCopinho}
                  className={copinho ? "selectItem active" : "selectItem"}
                ></input>
                <label className="SelectLabel " htmlFor="Copinho">
                  Copinho
                </label>
              </div>

              <div className="selectContainer">
                <input
                  name="Casquinha"
                  value={casquinha}
                  readonly
                  onClick={handleCasquinha}
                  className={casquinha ? "selectItem active" : "selectItem"}
                ></input>
                <label
                  className="SelectLabel selectLabelCasquinha"
                  htmlFor="Casquinha"
                >
                  Casquinha
                </label>
              </div>
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

export default ValeGelato;
