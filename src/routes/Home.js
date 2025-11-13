import React, { useEffect, useState } from "react";
import "../css/Home.css";
import { Helmet } from "react-helmet";

function Home() {
  return (
    <>
      <Helmet>
        <title>Início</title>
      </Helmet>
      <div className="home">
        <img className="logo" src="/logo.svg" alt="" />
        <div className="container"></div>
      </div>
    </>
  );
}

export default Home;
