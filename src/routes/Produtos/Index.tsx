import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import "../../css/Produtos.css";

const telegramBotId = "5902485837:AAFN9PL6ES3Otgwvzg6qqhvqCgw5WvL7DsY";
const telegramChatId = "-946708416";

const unidadeText = "Ahu";
const unidade = "ahu";

function Produtos() {
  return (
    <>
    <div className="container">
    <h1>Produtos</h1>

    <h2 className="subtitle">Carmella Gelateria</h2>
    <div className="produtosContainer">
      <ol>
        <li className="produtoTitle">Pequeno ( 1 sabor )</li>
        <li>Médio ( até 2 sabores )</li>
        <li>Grande ( até 3 sabores )</li>
        
      </ol>
    </div>
    </div>
    </>
  )

}

export default Produtos;
