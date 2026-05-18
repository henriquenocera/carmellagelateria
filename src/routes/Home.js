import React, { useEffect, useState } from "react";
import "../css/Home.css";
import supabase from "../supabase-client";
import moment from "moment";
import "moment/locale/pt-br";
import { Helmet } from "react-helmet";
import { FaTimesCircle } from "react-icons/fa";

function Home() {
  const [vales, setVales] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [lastThreeDays, setLastThreeDays] = useState([]);

  useEffect(() => {
    FetchVales();
    FetchChecklists();
  }, []);

  const FetchChecklists = async () => {
    console.log("Fetching checklists");
    const fiveDaysAgo = moment().subtract(5, 'days').startOf('day').toISOString();

    const { data, error } = await supabase
      .from("Checklist")
      .select("*")
      .eq("store", "ahu")
      .gte("created_at", fiveDaysAgo)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setChecklists(data);
    }
  };

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
  const renderWaffles = (massas) => {
    if (!massas) return "-";
    const match = massas.match(/^(\d+)\s*\[(.*)\]$/);
    if (match) {
      const total = match[1];
      const detailsStr = match[2];
      const batches = detailsStr.split(',').map(b => b.trim());
      return (
        <div style={{ textAlign: "center", lineHeight: "1.4" }}>
          <strong>Total: {total}</strong>
          {batches.map((batch, idx) => (
            <div key={idx} style={{ fontSize: "1.3rem", color: "#666", marginTop: "2px" }}>
              {batch}
            </div>
          ))}
        </div>
      );
    }
    return <div style={{ textAlign: "center" }}>{massas}</div>;
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

        <div className="container">
          <h2>Últimos Checklists</h2>
          {checklists.length === 0 ? (
            <p>Nenhum checklist encontrado nos últimos dias.</p>
          ) : (
            <table className="vales-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Responsável</th>
                  <th className="text-center">Waffles</th>
                  <th className="text-center">Brownies</th>
                  <th className="text-center">Panos</th>
                  <th className="text-center">Dinheiro</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let lastDate = null;
                  return checklists.map((item) => {
                    const currentDate = moment(item.created_at).format("DD/MM/YYYY");
                    const showDivider = currentDate !== lastDate;
                    lastDate = currentDate;

                    return (
                      <React.Fragment key={item.id}>
                        {showDivider && (
                          <tr className="vales-divider">
                            <td colSpan={7}>
                              {(() => {
                                const dayName = moment(item.created_at).locale('pt-br').format("dddd");
                                const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
                                return currentDate === moment().format("DD/MM/YYYY")
                                  ? `Hoje - ${capitalizedDay}`
                                  : `${currentDate} - ${capitalizedDay}`;
                              })()}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td>{moment(item.created_at).format("HH:mm")}</td>
                          <td>{item.checklist}</td>
                          <td>{item.person}</td>
                          <td className="text-center">{renderWaffles(item.massas)}</td>
                          <td className="text-center">{item.brownies ?? "-"}</td>
                          <td className="text-center">{item.panos ?? "-"}</td>
                          <td className="text-center">
                            {item.money_data?.total
                              ? `R$ ${item.money_data.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                              : "-"}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  });
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
