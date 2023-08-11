import React, { useEffect, useRef, useState } from "react";
import "../css/Perdas.css";

const telegramBotId = "5635956016:AAFzevSjVPEhTVsOEfLpbUsT0jni93pG6-c";
const telegramChatId = "-1001602173856";

function Perdas() {
  return (
    <>
      <div className="container">
        <h1>Perdas</h1>
      </div>

      <div className="container">
        <form action="">
          <label htmlFor="item">Nome:</label>
          <select id="item" name="item">
            <option value="Pote Pequeno">Pote Pequeno</option>
            <option value="Pote Grande">Pote Grande</option>
            <option value="Casquinha">Casquinha</option>
            <option value="Cascao">Cascão</option>
            <option value="Massa">Massa de Waffle</option>
          </select>
          <label htmlFor="quantidade">Quantidade:</label>
          <input
            type="number"
            name="quantidade"
            id="quantidade"
            min="0"
            max="99"
          />
          <label htmlFor="motivo">Motivo:</label>
          <input type="text" name="motivo" id="motivo" />

          <button type="submit">Enviar</button>
        </form>
      </div>
    </>
  );
}

export default Perdas;
