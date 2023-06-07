import React, { useEffect, useRef, useState } from "react";
import "../css/Valegelato.css";

function ValeGelato() {
  const [user, setUser] = useState("");
  const idInputRef = useRef(null);

  function handleClick() {
    let idInput = idInputRef.current.value;

    if (idInput == 1) {
      setUser("Henrique");
    } else if (idInput == 2) {
      setUser("Marina");
    } else {
      setUser("");
    }
  }
  return (
    <>
      <div className="valegelatoContainer">
        <img className="logo" src="/logo.svg" alt="" />
        <h1>Vale Gelato</h1>

        <form className="idForm" action="#">
          <label className="idLabel" htmlFor="id">
            ID Único
          </label>
          <input
            className="idInput"
            type="number"
            pattern="[0-9]*"
            inputMode="numeric"
            min="0"
            max="9999"
            autoFocus
            required
            ref={idInputRef}
          />
          <button onClick={handleClick} className="idSubmit" type="submit">
            Enviar
          </button>
        </form>

        {user == "" ? (
          <></>
        ) : (
          <form action="#" className="valeGelato">
            <input className="userInput" type="text" value={user} />
          </form>
        )}
      </div>
    </>
  );
}

export default ValeGelato;
