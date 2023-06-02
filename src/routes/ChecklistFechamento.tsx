import React from "react";
import * as Icons from "react-icons/bs";

const telegramBotId = "5635956016:AAFzevSjVPEhTVsOEfLpbUsT0jni93pG6-c";
const telegramChatId = "-1001602173856";

const onSubmit = (e) => {
  console.log("enviou");
  e.preventDefault();

  fetch(
    `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Checklist de Fechamento - Loja Alto XV %0D%0A`
  );
};

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

        <form onSubmit={onSubmit} action="" className="firstCheckForm">
          <input type="text" name="name" />

          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default ChecklistFechamento;
