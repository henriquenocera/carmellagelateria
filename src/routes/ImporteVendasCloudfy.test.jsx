import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TextDecoder } from "util";
import ImporteVendasCloudfy from "./ImporteVendasCloudfy";
import supabase from "../services/supabase-client";

jest.mock("../services/supabase-client", () => ({ __esModule: true, default: { from: jest.fn() } }));

let records;
let upsert;
const originalDecoder = global.TextDecoder;

beforeAll(() => {
  global.TextDecoder = TextDecoder;
  Object.defineProperty(File.prototype, "arrayBuffer", {
    configurable: true,
    value() {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(this);
      });
    }
  });
});

afterAll(() => {
  global.TextDecoder = originalDecoder;
  delete File.prototype.arrayBuffer;
});

beforeEach(() => {
  jest.spyOn(window, "confirm").mockReturnValue(true);
  jest.spyOn(window, "alert").mockImplementation(() => {});
  records = [{ id: 12, created_at: "2026-11-20", store: "ahu", date: "2026-11-23", qntd_total_vendas: 1, caixa_vendas: 42, status: "Fechado" }];
  upsert = jest.fn(async payloads => { records = payloads; return { error: null }; });
  supabase.from.mockImplementation(() => ({
    select: () => ({
      gte: () => ({ lte: async () => ({ data: records, error: null }) }),
      in: () => ({ in: async () => ({ data: records, error: null }) })
    }),
    upsert
  }));
});

afterEach(() => jest.restoreAllMocks());

function exportedCsv() {
  // Formato real: o cabeçalho junta Filial e Data, mas as linhas têm duas colunas.
  const csv = 'FilialData\tCód.\tProduto\tGrupos de produto\tPreço\tVendas à vista\tQtde. à vista\n"AHU"\t"23/11/2026"\t"1"\t"Gelato"\t"GELATO"\t"16"\t"3"\t"8"\n"AHU"\t"23/11/2026"\t"2"\t"Pote"\t"GELATO"\t"40"\t"4"\t"9"';
  return new File([csv], "cloudfy.csv", { type: "text/csv" });
}

test("upload e análise continuam disponíveis sem botão ou token de servidor local", async () => {
  render(<ImporteVendasCloudfy />);
  expect(screen.queryByRole("button", { name: /Buscar e importar últimos 5 dias/ })).toBeNull();
  expect(screen.queryByLabelText("Token do servidor local")).toBeNull();
  fireEvent.change(screen.getByLabelText("Arquivo CSV Cloudfy"), { target: { files: [exportedCsv()] } });
  fireEvent.click(screen.getByRole("button", { name: "Importar e Analisar" }));
  await screen.findByText("Não Encontrado");
  fireEvent.click(screen.getAllByRole("checkbox")[0]);
  fireEvent.click(screen.getByRole("button", { name: "Lançar Selecionados (1)" }));
  await screen.findByText("Importado");
  expect(records[0]).toEqual(expect.objectContaining({
    store: "ahu", date: "2026-11-23", qntd_total_vendas: 7,
    qntd_total_vendas_importado: true, caixa_vendas: 42, status: "Fechado"
  }));
  expect(records[0].id).toBeUndefined();
  expect(records[0].created_at).toBeUndefined();
  fireEvent.click(screen.getByRole("button", { name: "Importar e Analisar" }));
  await screen.findByText("Já Conciliado");
  expect(upsert).toHaveBeenCalledTimes(1);
});

test("erro de análise não grava dados", async () => {
  render(<ImporteVendasCloudfy />);
  const empty = new File(["FilialData\tProduto\n"], "vazio.csv", { type: "text/csv" });
  fireEvent.change(screen.getByLabelText("Arquivo CSV Cloudfy"), { target: { files: [empty] } });
  fireEvent.click(screen.getByRole("button", { name: "Importar e Analisar" }));
  await waitFor(() => expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Nenhuma transação elegível")));
  expect(upsert).not.toHaveBeenCalled();
});
