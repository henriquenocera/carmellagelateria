import React from "react";
import * as Icons from "react-icons/bs";

function ChecklistFechamento() {
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

        <form action="" className="firstCheckForm">
          <input type="text" name="name" />

          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default ChecklistFechamento;
