import React, { useEffect } from "react";
import "../css/Home.css";

function Home() {
  let openC = JSON.parse(localStorage.getItem("altoxvOpen"));
  let closeC = JSON.parse(localStorage.getItem("altoxvClose"));

  return (
    <div className="home">
      <h1>Checklist</h1>

      <div className="mainChecklistContainer">
        <div
          className={
            openC && openC.value === "complete"
              ? "mainChecklistAbertura checked"
              : "mainChecklistAbertura"
          }
        >
          Checklist Abertura
        </div>
        <div
          className={
            closeC && closeC.value === "complete"
              ? "mainChecklistFechamento checked"
              : "mainChecklistFechamento"
          }
        >
          Checklist Fechamento
        </div>
      </div>
    </div>
  );
}

export default Home;
