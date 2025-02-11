import React, { useEffect, useState } from "react";
import "../css/Home.css";
import supabase from "../supabase-client";
import moment from "moment";

function Home() {
  let openC = JSON.parse(localStorage.getItem("altoxvOpen"));
  let closeC = JSON.parse(localStorage.getItem("altoxvClose"));
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    FetchChecklist();
  }, []);

  const FetchChecklist = async () => {
    const { data, error } = await supabase
      .from("Checklist")
      .select("*")
      .limit(6)
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setChecklist(data);
      console.log("tudo ok", data);
    }
  };

  return (
    <>
      {/*  <div className="home">
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
      </div> */}
      <div className="home">
        <h1>Checklist</h1>
        <div className="container">
          <div className="table">
            <div className="table-header">
              <div className="header__item">
                <a id="name" className="filter__link">
                  Data
                </a>
              </div>
              <div className="header__item">
                <a className="filter__link filter__link--number">Checklist</a>
              </div>
              <div className="header__item">
                <a className="filter__link filter__link--number">Responsável</a>
              </div>
            </div>
            <div className="table-content">
              {checklist.map((list) => (
                <div className="table-row">
                  <>
                    <div className="table-data">
                      {moment(list.created_at).format("DD/MM/YYYY [às] HH:mm")}
                    </div>
                    <div className="table-data">{list.checklist}</div>
                    <div className="table-data">{list.person}</div>
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

export default Home;
