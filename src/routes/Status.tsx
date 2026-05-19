import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import "../css/Status.css";

interface IfoodStore {
  name: string;
  url: string;
  status: "loading" | "open" | "closed" | "error";
  checkedTime: string | null;
}

function Status() {
  const [stores, setStores] = useState<IfoodStore[]>([
    {
      name: "Alto da XV",
      url: "https://www.ifood.com.br/delivery/curitiba-pr/carmella-gelateria---alto-xv-alto-da-rua-xv/02625ea1-bc47-4f29-9d84-ab9e275206e6",
      status: "loading",
      checkedTime: null
    },
    {
      name: "Ahú",
      url: "https://www.ifood.com.br/delivery/curitiba-pr/carmella-gelateria---ahu-ahu/b8f4806a-7fd6-4df5-a739-65fc17356556",
      status: "loading",
      checkedTime: null
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkAllStores();
  }, []);

  async function checkStore(store: IfoodStore): Promise<IfoodStore> {
    try {
      const timestamp = new Date().getTime();
      const urlWithCacheBuster = `${store.url}?t=${timestamp}`;
      const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(urlWithCacheBuster);
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("CORS Proxy error");
      const html = await response.text();
      const isClosed = html.toLowerCase().includes("loja fechada") || html.toLowerCase().includes("fechada");
      return {
        ...store,
        status: isClosed ? "closed" : "open",
        checkedTime: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      };
    } catch (err) {
      console.error(`Erro ao verificar ${store.name}:`, err);
      return {
        ...store,
        status: "error",
        checkedTime: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      };
    }
  }

  async function checkAllStores() {
    setIsRefreshing(true);
    // Set all to loading first
    setStores(prev => prev.map(s => ({ ...s, status: "loading" })));

    const updated = await Promise.all(
      stores.map(async (store) => {
        return await checkStore(store);
      })
    );
    setStores(updated);
    setIsRefreshing(false);
  }

  return (
    <>
      <Helmet>
        <title>Status iFood</title>
      </Helmet>

      <div className="status-dashboard-container">
        <div className="status-header">
          <div className="status-title-group">
            <h1>Status no iFood</h1>
            <p>Verifique em tempo real se as lojas estão abertas ou fechadas na plataforma de delivery.</p>
          </div>
          <button onClick={checkAllStores} className="refresh-btn" disabled={isRefreshing} title="Atualizar Status">
            <Icons.BsArrowClockwise className={isRefreshing ? "spin" : ""} />
            <span>Atualizar</span>
          </button>
        </div>

        <div className="status-grid">
          {stores.map((store) => (
            <div key={store.name} className="status-card ifood-card">
              <div className="status-card-header">
                <div className="store-title">
                  <Icons.BsShop className="store-icon ifood-icon" />
                  <h2>{store.name}</h2>
                </div>
                <span className={`status-pill ${store.status === "open" ? "status-open" :
                  store.status === "closed" ? "status-closed" :
                    store.status === "loading" ? "status-inactive" : "status-error-pill"
                  }`}>
                  {store.status === "loading" && <Icons.BsArrowClockwise className="spin" />}
                  {store.status === "open" && <Icons.BsCircleFill className="live-dot" />}
                  {store.status === "closed" && <Icons.BsCircleFill className="live-dot" />}
                  {store.status === "open" && "Aberta no iFood"}
                  {store.status === "closed" && "Fechada no iFood"}
                  {store.status === "loading" && "Verificando..."}
                  {store.status === "error" && "Erro de Conexão"}
                </span>
              </div>

              <div className="ifood-details">
                <p className="ifood-description">
                  Verificação automática do status de funcionamento da loja {store.name} no iFood.
                </p>

                <div className="ifood-meta-info">
                  <p>
                    <Icons.BsClock />
                    <span>
                      {store.checkedTime ? `Última verificação: ${store.checkedTime}` : "Ainda não verificado"}
                    </span>
                  </p>
                  <p>
                    <Icons.BsCalendar />
                    <span>Hoje, {new Date().toLocaleDateString("pt-BR")}</span>
                  </p>
                </div>

                <a
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ifood-link-btn"
                >
                  <Icons.BsEscape /> Ver no iFood
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Status;
