import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import "../css/Lojas.css";
import supabase from "../services/supabase-client";

interface ChecklistEntry {
  id: number;
  created_at: string;
  checklist: string;
  person: string;
  store: string;
  massas: number | null;
  brownies: number | null;
  panos: number | null;
  money_data?: any;
}

const storeMap: { [key: string]: string } = {
  all: "Todas as Lojas",
  ahu: "Ahú",
  altoxv: "Alto da XV",
};

function Lojas() {
  const [data, setData] = useState<ChecklistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    fetchChecklists();
  }, []);

  async function fetchChecklists() {
    try {
      setLoading(true);
      setError(null);
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      const { data: checklistData, error: dbError } = await supabase
        .from("Checklist")
        .select("*")
        .gte("created_at", tenDaysAgo.toISOString())
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;
      const filtered = (checklistData || []).filter((item) => item.store !== "escritorio");
      setData(filtered);
    } catch (err: any) {
      console.error("Erro ao buscar checklists:", err);
      setError("Falha ao carregar dados do banco de dados.");
    } finally {
      setLoading(false);
    }
  }

  // Filtered entries
  const filteredData = data.filter((entry) => {
    const matchStore = selectedStore === "all" || entry.store === selectedStore;
    const matchType =
      selectedType === "all" ||
      (selectedType === "abertura" && entry.checklist?.toLowerCase().includes("abertura")) ||
      (selectedType === "fechamento" && entry.checklist?.toLowerCase().includes("fechamento"));
    return matchStore && matchType;
  });

  // Calculate stats / latest inventory
  const getLatestInventory = (storeKey: string) => {
    // find the latest checklist of fechamento for the store that has non-null inventory values
    const latestFechamento = data.find(
      (entry) =>
        entry.store === storeKey &&
        entry.checklist?.toLowerCase().includes("fechamento") &&
        (entry.massas !== null || entry.brownies !== null || entry.panos !== null)
    );
    return {
      massas: latestFechamento?.massas ?? "-",
      brownies: latestFechamento?.brownies ?? "-",
      panos: latestFechamento?.panos ?? "-",
      person: latestFechamento?.person ?? "-",
      updatedAt: latestFechamento?.created_at
        ? new Date(latestFechamento.created_at).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
        : null,
    };
  };

  const renderInventoryValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "-";
    const strVal = String(value);
    if (strVal.includes("[")) {
      const parts = strVal.split(/(?=\[)/); // splits before [
      const mainQty = parts[0].trim();
      const detailsPart = parts[1] ? parts[1].trim() : "";

      let batches: string[] = [];
      if (detailsPart) {
        const cleanDetails = detailsPart.replace(/^\[|\]$/g, "").trim();
        batches = cleanDetails ? cleanDetails.split(", ") : [];
      }

      return (
        <div className="inventory-val-formatted">
          <span className="qty-main">{mainQty}</span>
          {batches.length >= 2 ? (
            batches.map((batch, idx) => (
              <div key={idx} className="qty-sub">
                {batch}
              </div>
            ))
          ) : (
            detailsPart && <div className="qty-sub">{detailsPart}</div>
          )}
        </div>
      );
    }
    return value;
  };

  const renderMoneyValue = (moneyData: any) => {
    if (!moneyData) return "-";
    if (typeof moneyData === "object") {
      if (moneyData.total !== undefined && moneyData.total !== null) {
        const total = Number(moneyData.total);
        return `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    }
    try {
      const parsed = typeof moneyData === "string" ? JSON.parse(moneyData) : moneyData;
      if (parsed && parsed.total !== undefined && parsed.total !== null) {
        const total = Number(parsed.total);
        return `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    } catch (e) { }
    return String(moneyData);
  };

  const getMoneyTooltip = (moneyData: any) => {
    if (!moneyData) return "";
    try {
      const parsed = typeof moneyData === "string" ? JSON.parse(moneyData) : moneyData;
      if (parsed && parsed.denominacoes) {
        const den = parsed.denominacoes;
        const lines = [];
        if (den.hundred) lines.push(`R$ 100,00: ${den.hundred}`);
        if (den.fifty) lines.push(`R$ 50,00: ${den.fifty}`);
        if (den.twenty) lines.push(`R$ 20,00: ${den.twenty}`);
        if (den.ten) lines.push(`R$ 10,00: ${den.ten}`);
        if (den.five) lines.push(`R$ 5,00: ${den.five}`);
        if (den.two) lines.push(`R$ 2,00: ${den.two}`);
        if (den.oneReal) lines.push(`R$ 1,00: ${den.oneReal}`);
        if (den.fiftyCents) lines.push(`R$ 0,50: ${den.fiftyCents}`);
        if (den.twentyFiveCents) lines.push(`R$ 0,25: ${den.twentyFiveCents}`);
        if (den.tenCents) lines.push(`R$ 0,10: ${den.tenCents}`);
        if (den.fiveCents) lines.push(`R$ 0,05: ${den.fiveCents}`);
        if (den.oneCent) lines.push(`R$ 0,01: ${den.oneCent}`);
        return "Detalhamento:\n" + lines.join("\n");
      }
    } catch (e) { }
    return "";
  };

  const storeKeys = ["altoxv", "ahu"];

  return (
    <>
      <Helmet>
        <title>Dashboard - Lojas</title>
      </Helmet>

      <div className="lojas-dashboard-container">
        <div className="lojas-header">
          <div className="lojas-title-group">
            <h1>Painel de Checklists e Estoques</h1>
            <p>Monitore o status de abertura, fechamento e quantidades físicas por unidade.</p>
          </div>
          <button onClick={fetchChecklists} className="refresh-btn" title="Atualizar Dados">
            <Icons.BsArrowClockwise className={loading ? "spin" : ""} />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Inventory Summary Cards */}
        <div className="stats-grid">
          {storeKeys.map((storeKey) => {
            const inv = getLatestInventory(storeKey);
            return (
              <div key={storeKey} className="stat-card">
                <div className="stat-store-name">
                  <Icons.BsShop className="store-icon" />
                  <h3>{storeMap[storeKey]}</h3>
                </div>
                <div className="stat-content">
                  <div className="stat-item">
                    <span className="stat-label">Massas</span>
                    <span className="stat-value">{renderInventoryValue(inv.massas)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Brownies</span>
                    <span className="stat-value">{renderInventoryValue(inv.brownies)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Panos</span>
                    <span className="stat-value">{renderInventoryValue(inv.panos)}</span>
                  </div>
                </div>
                {inv.updatedAt && (
                  <div className="stat-footer">
                    <div className="stat-footer-item" title="Responsável pelo último fechamento">
                      <Icons.BsPerson />
                      <span>{inv.person}</span>
                    </div>
                    <div className="stat-footer-item" title="Data do último inventário">
                      <Icons.BsClock />
                      <span>{inv.updatedAt}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="filters-container">
          <div className="filter-group">
            <label>Filtrar Loja:</label>
            <div className="tabs">
              <button
                className={`tab-btn ${selectedStore === "all" ? "active" : ""}`}
                onClick={() => setSelectedStore("all")}
              >
                Todas
              </button>
              {storeKeys.map((key) => (
                <button
                  key={key}
                  className={`tab-btn ${selectedStore === key ? "active" : ""}`}
                  onClick={() => setSelectedStore(key)}
                >
                  {storeMap[key]}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Tipo de Checklist:</label>
            <div className="tabs">
              <button
                className={`tab-btn ${selectedType === "all" ? "active" : ""}`}
                onClick={() => setSelectedType("all")}
              >
                Todos
              </button>
              <button
                className={`tab-btn ${selectedType === "abertura" ? "active" : ""}`}
                onClick={() => setSelectedType("abertura")}
              >
                Abertura
              </button>
              <button
                className={`tab-btn ${selectedType === "fechamento" ? "active" : ""}`}
                onClick={() => setSelectedType("fechamento")}
              >
                Fechamento
              </button>
            </div>
          </div>
        </div>

        {/* Table/Data Area */}
        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">
              <Icons.BsArrowClockwise className="spin loading-icon" />
              <p>Carregando dados dos checklists...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <Icons.BsExclamationTriangle className="error-icon" />
              <p>{error}</p>
              <button onClick={fetchChecklists} className="retry-btn">Tentar Novamente</button>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="empty-state">
              <Icons.BsFolderSymlink className="empty-icon" />
              <p>Nenhum checklist encontrado para os filtros selecionados.</p>
            </div>
          ) : (
            <table className="checklist-table">
              <thead>
                <tr>
                  <th>Data e Hora</th>
                  <th>Loja</th>
                  <th>Tipo</th>
                  <th>Responsável</th>
                  <th>Dinheiro</th>
                  <th className="qty-col">Massas</th>
                  <th className="qty-col">Brownies</th>
                  <th className="qty-col">Panos</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => {
                  const isAbertura = row.checklist?.toLowerCase().includes("abertura");
                  const dateObj = new Date(row.created_at);
                  const formattedDate = dateObj.toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  const tooltip = getMoneyTooltip(row.money_data);

                  return (
                    <tr key={row.id} className="checklist-row">
                      <td data-label="Data e Hora" className="date-cell">{formattedDate}</td>
                      <td data-label="Loja">
                        <span className={`store-badge ${row.store}`}>
                          {storeMap[row.store] || row.store}
                        </span>
                      </td>
                      <td data-label="Tipo">
                        <span className={`type-badge ${isAbertura ? "abertura" : "fechamento"}`}>
                          {isAbertura ? "Abertura" : "Fechamento"}
                        </span>
                      </td>
                      <td data-label="Responsável" className="person-cell">{row.person || "-"}</td>
                      <td data-label="Dinheiro" className="money-cell">
                        {row.money_data ? (
                          <span
                            title={tooltip}
                            className="money-value-badge"
                            style={{ cursor: tooltip ? "help" : "default" }}
                          >
                            {renderMoneyValue(row.money_data)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td data-label="Massas" className="qty-col value-cell">{renderInventoryValue(row.massas)}</td>
                      <td data-label="Brownies" className="qty-col value-cell">{renderInventoryValue(row.brownies)}</td>
                      <td data-label="Panos" className="qty-col value-cell">{renderInventoryValue(row.panos)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Lojas;
