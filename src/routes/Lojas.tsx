import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import "../css/Lojas.css";
import supabase from "../supabase-client";

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
      const { data: checklistData, error: dbError } = await supabase
        .from("Checklist")
        .select("*")
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
      updatedAt: latestFechamento?.created_at
        ? new Date(latestFechamento.created_at).toLocaleDateString("pt-BR")
        : null,
    };
  };

  const renderInventoryValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "-";
    const strVal = String(value);
    if (strVal.includes("[")) {
      const parts = strVal.split(/(?=\[)/); // splits before [
      return (
        <div className="inventory-val-formatted">
          <span className="qty-main">{parts[0].trim()}</span>
          {parts.slice(1).map((part, idx) => (
            <div key={idx} className="qty-sub">{part.trim()}</div>
          ))}
        </div>
      );
    }
    return value;
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
                    Último inventário: {inv.updatedAt}
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

                  return (
                    <tr key={row.id} className="checklist-row">
                      <td className="date-cell">{formattedDate}</td>
                      <td>
                        <span className={`store-badge ${row.store}`}>
                          {storeMap[row.store] || row.store}
                        </span>
                      </td>
                      <td>
                        <span className={`type-badge ${isAbertura ? "abertura" : "fechamento"}`}>
                          {isAbertura ? "Abertura" : "Fechamento"}
                        </span>
                      </td>
                      <td className="person-cell">{row.person || "-"}</td>
                      <td className="qty-col value-cell">{renderInventoryValue(row.massas)}</td>
                      <td className="qty-col value-cell">{renderInventoryValue(row.brownies)}</td>
                      <td className="qty-col value-cell">{renderInventoryValue(row.panos)}</td>
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
