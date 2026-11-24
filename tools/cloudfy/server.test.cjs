const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { createServer } = require("./server.cjs");

async function fixture(t, runExport) {
  const server = createServer({ token: "test-token", origins: ["https://escritorio.carmellagelateria.com.br"], runExport });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}/export`;
  const request = (headers = {}) => fetch(url, {
    method: "POST", headers: { Authorization: "Bearer test-token", Origin: "https://escritorio.carmellagelateria.com.br", ...headers }
  });
  return { request, url };
}

test("rejeita origem, host e token não autorizados antes de abrir navegador", async t => {
  let called = false;
  const { request, url } = await fixture(t, async () => { called = true; return Buffer.from("csv"); });
  assert.equal((await request({ Origin: "https://other.example" })).status, 403);
  const hostStatus = await new Promise((resolve, reject) => {
    const req = http.request(url, { method: "POST", headers: { Host: "other.example", Authorization: "Bearer test-token" } }, res => {
      res.resume();
      resolve(res.statusCode);
    });
    req.on("error", reject);
    req.end();
  });
  assert.equal(hostStatus, 403);
  assert.equal((await request({ Authorization: "Bearer wrong" })).status, 401);
  assert.equal(called, false);
});

test("permite preflight de acesso à rede local e entrega CSV com período", async t => {
  const { request, url } = await fixture(t, async period => {
    assert.ok(period.start < period.end);
    return Buffer.from("Filial\tData\nAHU\t23/11/2026");
  });
  const preflight = await fetch(url, { method: "OPTIONS", headers: { Origin: "https://escritorio.carmellagelateria.com.br" } });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("Access-Control-Allow-Private-Network"), "true");
  const response = await request();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Type"), "text/csv");
  assert.match(response.headers.get("X-Cloudfy-Start"), /^\d{4}-\d{2}-\d{2}$/);
  assert.match(await response.text(), /Filial/);
});

test("impede duas exportações concorrentes e libera após falha", async t => {
  let release;
  let started;
  const ready = new Promise(resolve => { started = resolve; });
  const { request } = await fixture(t, () => {
    started();
    return new Promise((resolve, reject) => { release = reject; });
  });
  const first = request();
  await ready;
  assert.equal((await request()).status, 409);
  release(new Error("Falha no portal"));
  const failed = await first;
  assert.equal(failed.status, 500);
  assert.equal((await failed.json()).error, "Falha no portal");
  const next = request();
  await new Promise(resolve => setTimeout(resolve, 30));
  release(new Error("Segunda tentativa"));
  assert.equal((await next).status, 500);
});
