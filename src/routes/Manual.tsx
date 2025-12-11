import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import "../css/Manual.css";



const unidadeText = "Alto da XV";
const unidade = "altoxv";

function Manual() {
  

  return (
    <>
    <div className="container">
    <h2>Manual da Loja</h2>
    <h3 className="title">Produtos</h3>
    <h3 className="categoria">Gelato</h3>
    <div className="containerProdutos">
      <h4 className="produto">Pequeno</h4>
    </div>

    </div>
    </>
  )
}

export default Manual;
