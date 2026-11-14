import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomeDailySales from "./HomeDailySales";
import supabase from "../supabase-client";

jest.mock("../supabase-client", () => ({
  __esModule: true,
  default: { from: jest.fn() },
}));

function mockSales(data) {
  const query = {};
  ["select", "eq", "gte", "lt"].forEach(method => {
    query[method] = jest.fn().mockReturnValue(query);
  });
  query.order = jest.fn().mockResolvedValue({ data, error: null });
  supabase.from.mockReturnValue(query);
  return query;
}

test("consulta somente Ahú em novembro e calcula o ticket mensal ponderado", async () => {
  const query = mockSales([
    { date: "2026-11-02", qntd_total_vendas: 2, caixa_vendas: 20, pix_realizado: 20 },
    { date: "2026-11-01", qntd_total_vendas: 8, cartao_realizado: 200, ifood_realizado: 40 },
  ]);
  render(<HomeDailySales />);

  expect(await screen.findByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  expect(query.eq).toHaveBeenCalledWith("store", "ahu");
  expect(query.gte).toHaveBeenCalledWith("date", "2026-11-01");
  expect(query.lt).toHaveBeenCalledWith("date", "2026-12-01");
  expect(screen.getByText(/24,81/)).toBeInTheDocument();
  expect(screen.getByText(/28,00/)).toBeInTheDocument();
  expect(screen.getByText(/Meta atingida!/)).toBeInTheDocument();
});

test("exibe progresso abaixo da meta", async () => {
  mockSales([{ date: "2026-11-01", qntd_total_vendas: 10, caixa_vendas: 200 }]);
  render(<HomeDailySales />);

  const progress = await screen.findByRole("progressbar");
  expect(Number(progress.getAttribute("aria-valuenow"))).toBeCloseTo(2000 / 24.81);
  expect(screen.getByText(/Faltam.*4,81/)).toBeInTheDocument();
});

test("trata ausência de vendas", async () => {
  mockSales([]);
  render(<HomeDailySales />);

  expect(await screen.findByText(/Nenhuma venda registrada/)).toBeInTheDocument();
  expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
});
