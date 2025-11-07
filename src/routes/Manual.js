import React, { useEffect, useState } from "react";
import "../css/Home.css";
import supabase from "../supabase-client";
import moment from "moment";
import { Helmet } from "react-helmet";
import { FaTimesCircle } from "react-icons/fa";

function Manual() {
  return (
    <>
      <Helmet>
        <title>Manual</title>
      </Helmet>
      <div className="home">
        <div className="container">
          <h1>Manual</h1>
        </div>
      </div>
    </>
  );
}

export default Manual;
