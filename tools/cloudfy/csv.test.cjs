const test = require("node:test");
const assert = require("node:assert/strict");
const { validateCsv } = require("./csv.cjs");
const period = { start: "2026-11-19", end: "2026-11-23" };
const header = "FilialData\tCód.\tProduto\tVendas à vista\n";
const csv = date => Buffer.from(`${header}"AHU"\t"${date}"\t"1"\t"Gelato"\t"3"\n`);

test("valida datas inclusivas antes do upload", () => {
  assert.equal(validateCsv(csv("19/11/2026"), period).rows, 1);
  assert.deepEqual(validateCsv(csv("23/11/2026"), period).dates, ["2026-11-23"]);
  assert.throws(() => validateCsv(csv("18/11/2026"), period), /fora do período/);
  assert.throws(() => validateCsv(csv("24/11/2026"), period), /fora do período/);
});

test("rejeita HTML, arquivo vazio, relatório sem dados e datas inválidas", () => {
  for (const content of ["<html>Login</html>", "", header]) {
    assert.throws(() => validateCsv(Buffer.from(content), period));
  }
  assert.throws(() => validateCsv(csv("31/11/2026"), period), /data inválida/);
});
