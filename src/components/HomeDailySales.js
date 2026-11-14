import React, { useEffect, useState } from "react";
import { BsBarChart } from "react-icons/bs";
import supabase from "../supabase-client";
import { STORE_CONFIG } from "../config/store";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const MONTHLY_TARGET = 24.81;

function HomeDailySales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchSales() {
      setLoading(true);
      setError("");
      try {
        const { data, error: fetchError } = await supabase
          .from("conciliacao_vendas")
          .select("date,qntd_total_vendas,caixa_vendas,pix_realizado,cartao_realizado,ifood_realizado")
          .eq("store", STORE_CONFIG.key)
          .gte("date", "2026-11-01")
          .lt("date", "2026-12-01")
          .order("date", { ascending: false });

        if (fetchError) throw fetchError;
        if (!cancelled) {
          setSales((data || []).map(row => {
            const total = Number(row.caixa_vendas || 0) + Number(row.pix_realizado || 0)
              + Number(row.cartao_realizado || 0) + Number(row.ifood_realizado || 0);
            const quantity = row.qntd_total_vendas == null ? null : Number(row.qntd_total_vendas);
            return { date: row.date, quantity, total, average: quantity > 0 ? total / quantity : null };
          }).filter(row => row.quantity != null || row.total > 0));
        }
      } catch (err) {
        console.error("Erro ao carregar vendas diárias:", err);
        if (!cancelled) setError("Não foi possível carregar as vendas. Tente recarregar a página.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSales();
    return () => { cancelled = true; };
  }, []);

  const monthlyTotals = sales.filter(row => row.quantity > 0).reduce((totals, row) => ({
    amount: totals.amount + row.total,
    quantity: totals.quantity + row.quantity,
  }), { amount: 0, quantity: 0 });
  const monthlyAverage = monthlyTotals.quantity > 0 ? monthlyTotals.amount / monthlyTotals.quantity : null;
  const targetProgress = monthlyAverage == null ? null : (monthlyAverage / MONTHLY_TARGET) * 100;
  const targetReached = monthlyAverage != null && monthlyAverage >= MONTHLY_TARGET;
  const progressLabel = targetProgress == null ? "Sem quantidade de vendas para calcular a progressão"
    : `${targetProgress.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% da meta atingida`;

  return (
    <section className="home-sales-card" aria-labelledby="home-sales-title">
      <div className="home-sales-header">
        <div>
          <h2 id="home-sales-title"><BsBarChart aria-hidden="true" /> Vendas por dia — {STORE_CONFIG.textName}</h2>
          <p>Quantidade de vendas e ticket médio diário — Novembro de 2026.</p>
        </div>
      </div>

      {loading ? <p className="home-sales-message" role="status">Carregando vendas...</p>
        : error ? <p className="home-sales-message home-sales-error" role="alert">{error}</p>
        : sales.length === 0 ? <p className="home-sales-message">Nenhuma venda registrada para esta loja em novembro de 2026.</p>
        : <div className="home-sales-table-wrapper">
          <table className="home-sales-table">
            <thead><tr>
              <th scope="col">Data</th>
              <th scope="col">Qntd Total de Vendas</th>
              <th scope="col">Ticket Médio</th>
            </tr>
              <tr className="home-sales-monthly-row home-sales-target-row">
                <th scope="row">Meta</th>
                <td>-</td>
                <td>{currency.format(MONTHLY_TARGET)}</td>
              </tr>
              <tr className={`home-sales-monthly-row ${targetReached ? "home-sales-target-reached" : "home-sales-target-pending"}`}>
                <th scope="row">Média mensal</th>
                <td>-</td>
                <td>{monthlyAverage == null ? "-" : currency.format(monthlyAverage)}</td>
              </tr>
              <tr className={`home-sales-progress-row ${targetReached ? "is-reached" : "is-pending"}`}>
                <td colSpan={3}>
                  <div className="home-sales-progress-label">
                    {monthlyAverage != null && <span>{targetReached
                      ? `Meta atingida! ${currency.format(monthlyAverage - MONTHLY_TARGET)} acima da meta.`
                      : `Faltam ${currency.format(MONTHLY_TARGET - monthlyAverage)} no ticket médio para atingir a meta.`}</span>}
                  </div>
                  <div className="home-sales-progress-track" role="progressbar" aria-label="Progresso do ticket médio mensal"
                    aria-valuemin={0} aria-valuemax={100}
                    aria-valuenow={targetProgress == null ? undefined : Math.min(100, Math.max(0, targetProgress))}
                    aria-valuetext={progressLabel}>
                    <div className="home-sales-progress-fill" style={{ width: `${Math.min(100, Math.max(0, targetProgress ?? 0))}%` }} />
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>{sales.map(row => <tr key={row.date}>
              <td>{row.date.split("-").reverse().join("/")}</td>
              <td>{row.quantity == null ? "-" : row.quantity.toLocaleString("pt-BR")}</td>
              <td>{row.average == null ? "-" : currency.format(row.average)}</td>
            </tr>)}</tbody>
          </table>
        </div>}
    </section>
  );
}

export default HomeDailySales;
