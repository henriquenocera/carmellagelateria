import React, { useEffect, useState } from "react";
import "../css/Home.css";
import supabase from "../supabase-client";
import moment from "moment";
import { Helmet } from "react-helmet";

function Informacoes() {
  return (
    <>
      <Helmet>
        <title>Informações</title>
      </Helmet>
      <div className="home">
        <h1>Informações</h1>
      </div>
    </>
  );
}

export default Informacoes;
