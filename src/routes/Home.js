import React, { useEffect, useState } from "react";
import "../css/Home.css";
import supabase from "../supabase-client";
import moment from "moment";
import { Helmet } from "react-helmet";
import { FaTimesCircle } from "react-icons/fa";

function Home() {
  const [vales, setVales] = useState([]);
  const [lastThreeDays, setLastThreeDays] = useState([]);

  useEffect(() => {
    FetchVales();
  }, []);

  const FetchVales = async () => {
    console.log("Fetching vales");
    // Get checklists from the last 5 days
    const fiveDaysAgo = moment().subtract(5, 'days').startOf('day').toISOString();
    
    const { data, error } = await supabase
      .from("Vales")
      .select("*")
      .eq("Unidade", "Ahu")
      .gte("created_at", fiveDaysAgo)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setVales(data);
      console.log(vales)
      
      // Generate array of last 5 days
      const days = [];
      for (let i = 0; i < 5; i++) {
        days.push(moment().subtract(i, 'days').startOf('day').toISOString());
      }
      setLastThreeDays(days);
    }
  };
  return (
    <>
      <Helmet>
        <title>Início</title>
      </Helmet>
      <div className="home">
        <img className="logo" src="/logo.svg" alt="" />
        <div className="container">
          <h2>Últimos Vales</h2>
          {vales.length === 0 ? (
            <p>Nenhum vale encontrado nos últimos dias.</p>
          ) : (
            <table className="vales-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Nome</th>
                  <th>Item</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const today = moment();
                  const todaysVales = vales.filter((vale) =>
                    moment(vale.created_at).isSame(today, "day")
                  );
                  const otherVales = vales.filter(
                    (vale) => !moment(vale.created_at).isSame(today, "day")
                  );

                  const limit = 100;
                  const todaysLimited = todaysVales.slice(0, limit);
                  const othersLimited = otherVales.slice(
                    0,
                    Math.max(0, limit - todaysLimited.length)
                  );

                  return (
                    <>
                      {todaysLimited.length > 0 && (
                        <>
                          <tr className="vales-divider">
                            <td colSpan={3}>
                              Hoje - {today.format("DD/MM/YYYY")}
                            </td>
                          </tr>
                          {todaysLimited.map((vale) => (
                            <tr key={vale.id}>
                              <td>
                                {moment(vale.created_at).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                                {moment().diff(moment(vale.created_at), "minutes") < 60 && (
                                  <span className="new-tag">novo</span>
                                )}
                              </td>
                              <td>{vale.Nome ?? "-"}</td>
                              <td>{vale.Item ?? "-"}</td>
                            </tr>
                          ))}
                        </>
                      )}

                      {othersLimited.length > 0 && (
                        <>
                          <tr className="vales-divider secondary">
                            <td colSpan={3}>Dias anteriores</td>
                          </tr>
                          {othersLimited.map((vale) => (
                            <tr key={vale.id}>
                              <td>
                                {moment(vale.created_at).format(
                                  "DD/MM/YYYY HH:mm"
                                )}
                                {moment().diff(moment(vale.created_at), "minutes") < 60 && (
                                  <span className="new-tag">novo</span>
                                )}
                              </td>
                              <td>{vale.Nome ?? "-"}</td>
                              <td>{vale.Item ?? "-"}</td>
                            </tr>
                          ))}
                        </>
                      )}
                    </>
                  );
                })()}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
