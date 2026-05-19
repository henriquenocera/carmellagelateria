import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import "../css/Status.css";
import supabase from "../supabase-client";

interface ChecklistEntry {
  id: number;
  created_at: string;
  checklist: string;
  person: string;
  store: string;
  massas: string | null;
  brownies: string | null;
  panos: string | null;
  money_data?: any;
}

interface StoreStatus {
  isOpen: boolean;
  isClosed: boolean;
  statusText: string;
  statusColor: string;
  abertura: {
    time: string | null;
    person: string | null;
    money: number | null;
  } | null;
  fechamento: {
    time: string | null;
    person: string | null;
    massas: string | null;
    brownies: string | null;
    panos: string | null;
  } | null;
}

function Status() {
  const [data, setData] = useState<ChecklistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // iFood Status State
  const [ifoodStatus, setIfoodStatus] = useState<"loading" | "open" | "closed" | "error">("loading");
  const [ifoodCheckedTime, setIfoodCheckedTime] = useState<string | null>(null);

  useEffect(() => {
    refreshAllStatus();
  }, []);

  async function refreshAllStatus() {
    await Promise.all([
      fetchTodayChecklists(),
      fetchIfoodStatus()
    ]);
  }

  async function fetchTodayChecklists() {
    try {
      setLoading(true);
      setError(null);

      const { data: checklistData, error: dbError } = await supabase
        .from("Checklist")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);

      if (dbError) throw dbError;
      setData(checklistData || []);
    } catch (err: any) {
      console.error("Erro ao buscar checklists:", err);
      setError("Falha ao carregar dados do banco de dados.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchIfoodStatus() {
    setIfoodStatus("loading");
    try {
      const url = "https://www.ifood.com.br/delivery/curitiba-pr/carmella-gelateria---alto-xv-alto-da-rua-xv/02625ea1-bc47-4f29-9d84-ab9e275206e6";
      const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(url);

      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Erro na resposta do CORS proxy");

      const html = await response.text();
      const isClosed = html.toLowerCase().includes("loja fechada") || html.toLowerCase().includes("fechada");

      setIfoodStatus(isClosed ? "closed" : "open");
      setIfoodCheckedTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      console.error("Erro ao verificar status do iFood:", err);
      setIfoodStatus("error");
    }
  }

  // Helper to resolve daily status for Ahú and Alto da XV
  const getStoreStatus = (storeKey: string): StoreStatus => {
    const today = new Date().toLocaleDateString("pt-BR");

    const storeTodayChecklists = data.filter((entry) => {
      const entryDate = new Date(entry.created_at).toLocaleDateString("pt-BR");
      return entry.store === storeKey && entryDate === today;
    });

    const aberturas = storeTodayChecklists.filter(e => e.checklist?.toLowerCase().includes("abertura"));
    const fechamentos = storeTodayChecklists.filter(e => e.checklist?.toLowerCase().includes("fechamento"));

    const latestAbertura = aberturas[0] || null;
    const latestFechamento = fechamentos[0] || null;

    let statusText = "Não Iniciado";
    let statusColor = "status-inactive";
    let isOpen = false;
    let isClosed = false;

    if (latestAbertura && !latestFechamento) {
      statusText = "Loja Aberta";
      statusColor = "status-open";
      isOpen = true;
    } else if (latestFechamento) {
      statusText = "Fechado";
      statusColor = "status-closed";
      isClosed = true;
    }

    const formatTime = (isoString: string) => {
      return new Date(isoString).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      });
    };

    const getMoneyTotal = (moneyData: any): number | null => {
      if (!moneyData) return null;
      if (typeof moneyData === "object" && moneyData.total !== undefined) return Number(moneyData.total);
      try {
        const parsed = typeof moneyData === "string" ? JSON.parse(moneyData) : moneyData;
        if (parsed && parsed.total !== undefined) return Number(parsed.total);
      } catch (e) { }
      return null;
    };

    return {
      isOpen,
      isClosed,
      statusText,
      statusColor,
      abertura: latestAbertura ? {
        time: formatTime(latestAbertura.created_at),
        person: latestAbertura.person,
        money: getMoneyTotal(latestAbertura.money_data)
      } : null,
      fechamento: latestFechamento ? {
        time: formatTime(latestFechamento.created_at),
        person: latestFechamento.person,
        massas: latestFechamento.massas,
        brownies: latestFechamento.brownies,
        panos: latestFechamento.panos
      } : null
    };
  };

  const storeMap = {
    altoxv: "Alto da XV",
    ahu: "Ahú"
  };

  const storeKeys = ["altoxv", "ahu"];

  return (
    <>
      <Helmet>
        <title>Status das Lojas</title>
      </Helmet>

      <div className="status-dashboard-container">
        <div className="status-header">
          <div className="status-title-group">
            <h1>Status em Tempo Real</h1>
            <p>Monitore a operação das unidades e o status de funcionamento do iFood.</p>
          </div>
          <button onClick={refreshAllStatus} className="refresh-btn" title="Atualizar Status">
            <Icons.BsArrowClockwise className={loading || ifoodStatus === "loading" ? "spin" : ""} />
            <span>Atualizar</span>
          </button>
        </div>

        <div className="status-grid">
          {/* Supabase Stores */}
          {storeKeys.map((storeKey) => {
            const status = getStoreStatus(storeKey);
            const storeName = storeMap[storeKey as keyof typeof storeMap];

            return (
              <div key={storeKey} className="status-card">
                <div className="status-card-header">
                  <div className="store-title">
                    <Icons.BsShop className="store-icon" />
                    <h2>{storeName}</h2>
                  </div>
                  <span className={`status-pill ${status.statusColor}`}>
                    <Icons.BsCircleFill className="live-dot" />
                    {status.statusText}
                  </span>
                </div>

                <div className="timeline-steps">
                  {/* Step 1: Abertura */}
                  <div className={`step-item ${status.abertura ? "completed" : "pending"}`}>
                    <div className="step-marker">
                      {status.abertura ? <Icons.BsCheckCircleFill /> : <span className="step-num">1</span>}
                    </div>
                    <div className="step-info">
                      <h4>Checklist de Abertura</h4>
                      {status.abertura ? (
                        <div className="step-details">
                          <p>
                            <Icons.BsClock /> <span>{status.abertura.time}</span>
                          </p>
                          <p>
                            <Icons.BsPerson /> <span>{status.abertura.person}</span>
                          </p>
                          {status.abertura.money !== null && (
                            <p className="step-money">
                              <Icons.BsCashCoin />{" "}
                              <span>
                                R$ {status.abertura.money.toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </span>
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="step-placeholder">Aguardando abertura da loja...</p>
                      )}
                    </div>
                  </div>

                  {/* Step 2: Fechamento */}
                  <div className={`step-item ${status.fechamento ? "completed" : "pending"}`}>
                    <div className="step-marker">
                      {status.fechamento ? <Icons.BsCheckCircleFill /> : <span className="step-num">2</span>}
                    </div>
                    <div className="step-info">
                      <h4>Checklist de Fechamento</h4>
                      {status.fechamento ? (
                        <div className="step-details">
                          <p>
                            <Icons.BsClock /> <span>{status.fechamento.time}</span>
                          </p>
                          <p>
                            <Icons.BsPerson /> <span>{status.fechamento.person}</span>
                          </p>
                          <div className="fechamento-estoque">
                            <span className="estoque-tag">Massas: {status.fechamento.massas || "-"}</span>
                            <span className="estoque-tag">Brownies: {status.fechamento.brownies || "-"}</span>
                            <span className="estoque-tag">Panos: {status.fechamento.panos || "-"}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="step-placeholder">Aguardando encerramento...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* iFood Batel Store Card */}
          <div className="status-card ifood-card">
            <div className="status-card-header">
              <div className="store-title">
                <Icons.BsShop className="store-icon ifood-icon" />
                <h2>Pasta Design (Batel)</h2>
              </div>
              <span className={`status-pill ${ifoodStatus === "open" ? "status-open" :
                ifoodStatus === "closed" ? "status-closed" :
                  ifoodStatus === "loading" ? "status-inactive" : "status-error-pill"
                }`}>
                {ifoodStatus === "loading" && <Icons.BsArrowClockwise className="spin" />}
                {ifoodStatus === "open" && <Icons.BsCircleFill className="live-dot" />}
                {ifoodStatus === "closed" && <Icons.BsCircleFill className="live-dot" />}
                {ifoodStatus === "open" && "Aberta no iFood"}
                {ifoodStatus === "closed" && "Fechada no iFood"}
                {ifoodStatus === "loading" && "Verificando..."}
                {ifoodStatus === "error" && "Erro de Conexão"}
              </span>
            </div>

            <div className="ifood-details">
              <p className="ifood-description">
                Verificação automática do status de funcionamento da unidade Batel no iFood.
              </p>

              <div className="ifood-meta-info">
                <p>
                  <Icons.BsClock />
                  <span>
                    {ifoodCheckedTime ? `Última verificação: ${ifoodCheckedTime}` : "Ainda não verificado"}
                  </span>
                </p>
                <p>
                  <Icons.BsCalendar />
                  <span>Hoje, {new Date().toLocaleDateString("pt-BR")}</span>
                </p>
              </div>

              <a
                href="https://www.ifood.com.br/delivery/curitiba-pr/carmella-gelateria---alto-xv-alto-da-rua-xv/02625ea1-bc47-4f29-9d84-ab9e275206e6"
                target="_blank"
                rel="noopener noreferrer"
                className="ifood-link-btn"
              >
                <Icons.BsEscape /> Ver no iFood
              </a>
            </div>
          </div>
        </div>

        {/* History / Recent Activity */}
        <div className="recent-activity-section">
          <h2>Atividades Recentes</h2>
          {loading ? (
            <div className="activity-loading">Carregando histórico...</div>
          ) : data.length === 0 ? (
            <div className="activity-empty">Nenhum checklist registrado recentemente.</div>
          ) : (
            <div className="activity-list">
              {data.slice(0, 5).map((entry) => {
                const isAbertura = entry.checklist?.toLowerCase().includes("abertura");
                const dateObj = new Date(entry.created_at);
                const formattedDate = dateObj.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit"
                });
                const formattedTime = dateObj.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div key={entry.id} className="activity-item">
                    <div className={`activity-icon-wrapper ${isAbertura ? "abertura" : "fechamento"}`}>
                      {isAbertura ? <Icons.BsArrowBarRight /> : <Icons.BsCheck />}
                    </div>
                    <div className="activity-details">
                      <div className="activity-main-text">
                        <strong>{entry.person || "Funcionário"}</strong> enviou o{" "}
                        <span className="activity-type-name">
                          {isAbertura ? "Checklist de Abertura" : "Checklist de Fechamento"}
                        </span>{" "}
                        na loja <strong>{storeMap[entry.store as keyof typeof storeMap] || entry.store}</strong>.
                      </div>
                      <div className="activity-meta">
                        <span><Icons.BsCalendar /> {formattedDate}</span>
                        <span><Icons.BsClock /> {formattedTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Status;
