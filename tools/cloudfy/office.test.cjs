const test = require("node:test");
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const { importOnPage } = require("./office.cjs");

async function fixture(t, status, fail = false) {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());
  const page = await browser.newPage();
  await page.setContent(`
    <input type="file" accept=".csv">
    <button id="analyze">Importar e Analisar</button>
    <button id="launch" hidden>Lançar Selecionados (1)</button>
    <div id="result"></div>
    <script>
      document.querySelector('#analyze').onclick = () => {
        if (${fail}) { alert('Erro ao analisar arquivo: falha na consulta'); return; }
        document.querySelector('#result').innerHTML = '<table class="frequencia-table"><thead><tr><th><input type="checkbox"></th></tr></thead><tbody><tr><td></td><td>Ahú</td><td>23/11/2026</td><td>Quantidade</td><td>Quantidade</td><td>${status}</td></tr></tbody></table>';
        document.querySelector('thead input').onchange = () => document.querySelector('#launch').hidden = false;
      };
      document.querySelector('#launch').onclick = () => {
        if (confirm('Deseja lançar as 1 transações selecionadas nas suas respectivas lojas?')) {
          // Simula a atualização React depois de a caixa de sucesso ser fechada.
          alert('Lançamentos importados com sucesso!');
          setTimeout(() => document.querySelector('tbody td:nth-child(6)').textContent = 'Importado', 30);
        }
      };
    </script>
  `);
  return page;
}

const file = { name: "cloudfy.csv", mimeType: "text/csv", buffer: Buffer.from("FilialData\tVendas à vista") };

test("envia arquivo e confirma o lançamento até a atualização da tabela", async t => {
  const page = await fixture(t, "Não Encontrado");
  assert.deepEqual(await importOnPage(page, file, () => {}), { imported: 1, reconciled: 0 });
  assert.equal(await page.locator('input[type="file"]').evaluate(el => el.files[0].name), "cloudfy.csv");
});

test("não lança novamente os registros já conciliados", async t => {
  const page = await fixture(t, "Já Conciliado");
  assert.deepEqual(await importOnPage(page, file, () => {}), { imported: 0, reconciled: 1 });
  assert.equal(await page.locator("#launch").isVisible(), false);
});

test("propaga alerta de erro da análise", async t => {
  const page = await fixture(t, "Não Encontrado", true);
  await assert.rejects(importOnPage(page, file, () => {}), /falha na consulta/);
});
