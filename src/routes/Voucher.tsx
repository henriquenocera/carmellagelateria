import React, { useEffect, useState } from "react";
import "../css/Home.css";
import supabase from "../supabase-client";
import { Helmet } from "react-helmet";
import moment from "moment";

function Voucher() {
  const store = "Ahu";
  const dateNow = new Date();
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    FetchVouchers();
  }, []);

  const FetchVouchers = async () => {
    const { data, error } = await supabase
      .from("Vouchers")
      .select("*")
      .is("active", true)
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setVouchers(data);
      console.log("DB Fetch Ok", data);
    }
  };

  const updateVouchers = async (id) => {
    const { data, error } = await supabase
      .from("Vouchers")
      .update({
        active: false,
        store_consumed: store,
        date_consumed: dateNow,
      })
      .eq("id", id);
    FetchVouchers();
  };

  return (
    <>
      <Helmet>
        <title>Voucher</title>
      </Helmet>

      <div className="home">
        <h1>Vouchers Ativos</h1>
        <div className="container">
          <div className="table">
            <div className="table-header">
              <div className="header__item">
                <a id="name" className="filter__link">
                  Criado em:
                </a>
              </div>
              <div className="header__item">
                <a className="filter__link filter__link--number">
                  Nome do Voucher
                </a>
              </div>
              <div className="header__item">
                <a className="filter__link filter__link--number">
                  Utilizar Voucher
                </a>
              </div>
            </div>
            <div className="table-content">
              {vouchers.map((list) => (
                <div className="table-row" key={list.id}>
                  <>
                    <div className="table-data">
                      {moment(list.created_at).format("DD/MM/YYYY [às] HH:mm")}
                    </div>
                    <div className={`table-data`}>{list.voucher_id}</div>
                    <button
                      onClick={() => {
                        updateVouchers(list.id);
                      }}
                      className="table-data-button"
                    >
                      Utilizar
                    </button>
                  </>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Voucher;
