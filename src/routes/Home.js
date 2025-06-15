import React, { useEffect, useState } from "react";
import "../css/Home.css";
import supabase from "../supabase-client";
import moment from "moment";
import { Helmet } from "react-helmet";
import { FaTimesCircle } from "react-icons/fa";

function Home() {
  return (
    <>
      <Helmet>
        <title>Início</title>
      </Helmet>
      <div className="home">
        <img className="logo" src="/logo.svg" alt="" />
        <div className="container">
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/vales")}
          >
            Vales
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
