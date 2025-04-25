import React, { useEffect, useState } from "react";
import "../css/Home.css";
import supabase from "../supabase-client";
import moment from "moment";
import { Helmet } from "react-helmet";
import { FaTimesCircle } from "react-icons/fa";

function Home() {
  const [checklist, setChecklist] = useState([]);
  const [lastThreeDays, setLastThreeDays] = useState([]);

  useEffect(() => {
    FetchChecklist();
  }, []);

  const FetchChecklist = async () => {
    // Get checklists from the last 5 days
    const fiveDaysAgo = moment().subtract(5, 'days').startOf('day').toISOString();
    
    const { data, error } = await supabase
      .from("Checklist")
      .select("*")
      .eq("store", "altoxv")
      .gte("created_at", fiveDaysAgo)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setChecklist(data);
      
      // Generate array of last 5 days
      const days = [];
      for (let i = 0; i < 5; i++) {
        days.push(moment().subtract(i, 'days').startOf('day').toISOString());
      }
      setLastThreeDays(days);
    }
  };

  const getChecklistForDay = (day) => {
    return checklist.filter(item => 
      moment(item.created_at).startOf('day').isSame(moment(day).startOf('day'))
    );
  };

  return (
    <>
      <Helmet>
        <title>Início</title>
      </Helmet>
      <div className="home">
        <h1>Últimos 5 Dias de Checklists</h1>
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
              {lastThreeDays.map((day) => {
                const dayChecklists = getChecklistForDay(day);
                const hasOpening = dayChecklists.some(c => c.checklist === "Checklist de Abertura");
                const hasClosing = dayChecklists.some(c => c.checklist === "Checklist de Fechamento");
                
                return (
                  <React.Fragment key={day}>
                    {/* Opening Checklist */}
                    <div className="table-row">
                      <div className="table-data">
                        {hasOpening ? moment(dayChecklists.find(c => c.checklist === "Checklist de Abertura")?.created_at).format("DD/MM/YYYY [às] HH:mm") : moment(day).format("DD/MM/YYYY")}
                      </div>
                      <div className={`table-data abertura ${!hasOpening ? 'missing' : ''}`}>
                        {hasOpening ? "Checklist de Abertura" : (
                          <span className="missing-checklist" title="Checklist de Abertura não realizado">
                            <FaTimesCircle />
                          </span>
                        )}
                      </div>
                      <div className="table-data">
                        {hasOpening ? dayChecklists.find(c => c.checklist === "Checklist de Abertura")?.person : "-"}
                      </div>
                    </div>
                    
                    {/* Closing Checklist */}
                    <div className="table-row">
                      <div className="table-data">
                        {hasClosing ? moment(dayChecklists.find(c => c.checklist === "Checklist de Fechamento")?.created_at).format("DD/MM/YYYY [às] HH:mm") : moment(day).format("DD/MM/YYYY")}
                      </div>
                      <div className={`table-data fechamento ${!hasClosing ? 'missing' : ''}`}>
                        {hasClosing ? "Checklist de Fechamento" : (
                          <span className="missing-checklist" title="Checklist de Fechamento não realizado">
                            <FaTimesCircle />
                          </span>
                        )}
                      </div>
                      <div className="table-data">
                        {hasClosing ? dayChecklists.find(c => c.checklist === "Checklist de Fechamento")?.person : "-"}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
