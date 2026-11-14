import React from "react";
import { Helmet } from "react-helmet";
import HomeDailySales from "../components/HomeDailySales";
import "../css/HomeSales.css";

function Home() {
  return (
    <>
      <Helmet>
        <title>Metas - Loja Ahú</title>
      </Helmet>
      <main className="home-sales-page">
        <img className="home-sales-logo" src="/logo.svg" alt="Carmella Gelateria" />
        <HomeDailySales />
      </main>
    </>
  );
}

export default Home;
