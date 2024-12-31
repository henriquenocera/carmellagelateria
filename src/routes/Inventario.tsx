import React, { useEffect, useState } from "react";
import * as Icons from "react-icons/bs";
import "../css/Inventario.css";

const telegramBotId = "6170143874:AAGyo6gioXlufhGGzPTGNe9YE6TrCuoKEWU";
const telegramChatId = "-1001602173856";
const unidadeText = "Alto da XV";
const unidade = "altoxv";

async function sendMessage(openDateFormat) {
  const checkOpenComplete = `https://api.telegram.org/bot${telegramBotId}/sendMessage?chat_id=${telegramChatId}&text=Inventário - Loja ${unidadeText} %0D%0A ${openDateFormat}`;

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
    window.alert(
      "Erro na confirmação do Checklist, por gentileza tente novamente"
    );
  } finally {
    console.log("sucesso");
    window.alert("Inventário Concluído com Sucesso!");
    window.location.replace(`https://${unidade}.carmellagelateria.com.br/`);
  }
}

function handleSubmit(event) {
  console.log("enviou");
  event.preventDefault();
  var object = { value: "complete", timestamp: new Date().getTime() };
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
  sendMessage(openDateFormat);
}

function Inventario() {
  return (
    <>
      <div className="InvContainer">
        <img className="logo" src="/logo.svg" alt="" />
        <h1>Inventário</h1>
        <h2>Para realizar o inventário da loja clique no link abaixo</h2>
        <a
          className="link"
          href="https://docs.google.com/spreadsheets/d/1rCEtqbEBDnUJgjlAtehhS7rCLigHMx1HsaCD3yRKK5U/edit?gid=0#gid=0"
          target="_blank"
          rel="noreferrer"
        >
          Link da Planilha
        </a>

        <div className="container">
          <p className="title">Instruções para realizar o inventário</p>
          <div className="container">
            <p className="text">1º - Acesse a planilha pelo link acima</p>
            <p className="text">
              2º - Realize a contagem apenas dos itens fecahdos em estoque
            </p>
            <p className="text">
              3º - Preencha a planilha com as quantidades atualizadas
            </p>
            <p className="text">4º - Confirme a realização do Inventário</p>
            <form action="" method="POST" onSubmit={handleSubmit}>
              <button className="sendForm" type="submit">
                Inventário Concluído
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Inventario;
