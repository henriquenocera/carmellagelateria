import React, { useEffect, useState } from "react";
import "../css/Home.css";
import supabase from "../supabase-client";
import moment from "moment";
import { Helmet } from "react-helmet";

function ChecklistConferencia() {
  return (
    <>
      <Helmet>
        <title>Checklist de Conferência</title>
      </Helmet>
      <div className="home">
        <h1>Checklist de Conferência</h1>
        <p>Em construção</p>
      </div>
    </>
  );
}

export default ChecklistConferencia;
