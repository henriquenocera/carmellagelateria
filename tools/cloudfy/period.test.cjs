const test = require("node:test");
const assert = require("node:assert/strict");
const { salesPeriod } = require("./period.cjs");

test("cinco dias inclusivos, terminando ontem em São Paulo", () => {
  assert.deepEqual(salesPeriod(new Date("2026-11-24T12:00:00Z")), { start: "2026-11-19", end: "2026-11-23" });
});

test("usa o dia brasileiro mesmo antes das três da manhã UTC", () => {
  assert.deepEqual(salesPeriod(new Date("2026-11-24T02:59:00Z")), { start: "2026-11-18", end: "2026-11-22" });
});

test("atravessa ano e fevereiro bissexto", () => {
  assert.deepEqual(salesPeriod(new Date("2027-01-02T12:00:00Z")), { start: "2026-12-28", end: "2027-01-01" });
  assert.deepEqual(salesPeriod(new Date("2028-03-02T12:00:00Z")), { start: "2028-02-26", end: "2028-03-01" });
});
