const path = require("node:path");
const fs = require("node:fs/promises");
const { chromium } = require("playwright");

const LOGIN_URL = "https://app.cloudfy.net.br/login/";
const runtime = path.join(__dirname, ".runtime");
const brDate = iso => iso.split("-").reverse().join("/");

async function findVisible(page, buildLocator, timeout = 15000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    for (const frame of page.frames()) {
      const locator = buildLocator(frame);
      for (let index = 0; index < await locator.count(); index++) {
        const candidate = locator.nth(index);
        if (await candidate.isVisible().catch(() => false)) return candidate;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error("Elemento não encontrado no portal. Confira o relatório e configure os seletores em tools/cloudfy/.env.local.");
}

async function exportSales(period, config = process.env) {
  await fs.mkdir(runtime, { recursive: true });
  // Perfil exclusivo da automação: mantém login e dispositivo confiável entre execuções.
  const context = await chromium.launchPersistentContext(path.join(runtime, "browser"), {
    headless: false, acceptDownloads: true, locale: "pt-BR", timezoneId: "America/Sao_Paulo"
  });
  context.setDefaultTimeout(20000);
  const page = context.pages()[0] || await context.newPage();
  let stage = "login";
  const deadline = setTimeout(() => context.close().catch(() => {}), 5 * 60 * 1000);
  try {
    await page.goto(LOGIN_URL, { waitUntil: "domcontentloaded" });
    const login = page.locator("#loginControllerLoginId");
    // O portal pode redirecionar uma sessão já autenticada.
    await Promise.race([
      login.waitFor({ state: "visible" }),
      page.waitForURL(url => !url.pathname.startsWith("/login"))
    ]);
    if (page.url().includes("/login")) {
      if (config.CLOUDFY_USERNAME && config.CLOUDFY_PASSWORD) {
        await login.fill(config.CLOUDFY_USERNAME);
        await page.locator("#inputPassword").fill(config.CLOUDFY_PASSWORD);
        await page.getByRole("button", { name: "Entrar", exact: true }).click();
      }
      // Também permite login manual e 2FA na janela local, sem enviar senhas ao site.
      await page.waitForURL(url => !url.pathname.startsWith("/login"), { timeout: 120000 });
    }

    stage = "seleção da empresa e filial";
    // Após o login o Cloudfy abre um modal com a empresa e filial padrão.
    const selectBranch = await findVisible(page, frame => frame.getByText("Selecionar", { exact: true }), 10000).catch(() => null);
    if (selectBranch) await selectBranch.click();

    stage = "navegação até Relatório de vendas";
    if (config.CLOUDFY_REPORT_URL) {
      const url = new URL(config.CLOUDFY_REPORT_URL);
      if (url.origin !== "https://app.cloudfy.net.br") throw new Error("A URL do relatório deve pertencer ao portal Cloudfy.");
      await page.goto(url.href, { waitUntil: "domcontentloaded" });
    } else {
      const reports = await findVisible(page, frame => frame.getByText("Relatórios gerais", { exact: true }));
      const group = reports.locator("xpath=ancestor::li[1]");
      const sales = group.getByText("Vendas", { exact: true });
      if (!await sales.isVisible()) await reports.click();
      const report = group.getByText("Relatório de vendas", { exact: true });
      if (!await report.isVisible()) await sales.click();
      await report.click();
    }

    stage = "preenchimento das datas";
    for (const [selector, label, iso] of [
      [config.CLOUDFY_START_SELECTOR || '[skn-field="RS.ENT_DT_INI"] input', /Data inicial/i, period.start],
      [config.CLOUDFY_END_SELECTOR || '[skn-field="RS.ENT_DT_FIM"] input', /Data final/i, period.end]
    ]) {
      const input = await findVisible(page, frame => selector ? frame.locator(selector) : frame.getByLabel(label));
      await input.fill(await input.getAttribute("type") === "date" ? iso : brDate(iso));
      await input.press("Tab");
      const actual = await input.inputValue();
      if (actual !== iso && actual !== brDate(iso)) throw new Error(`O portal não aceitou a data ${brDate(iso)}.`);
    }

    stage = "seleção do tipo de relatório";
    const reportType = config.CLOUDFY_REPORT_TYPE || "Por data";
    const typeInput = await findVisible(page, frame => config.CLOUDFY_TYPE_SELECTOR
      ? frame.locator(config.CLOUDFY_TYPE_SELECTOR) : frame.locator('[skn-field="RS.ENT_IT_TPREL"] .selectize-input'));
    if (await typeInput.evaluate(element => element.tagName) === "SELECT") {
      await typeInput.selectOption({ label: reportType });
    } else if ((await typeInput.textContent()).trim() !== reportType) {
      await typeInput.click();
      await (await findVisible(page, frame => frame.getByText(reportType, { exact: true }))).click();
    }

    const consolidate = await findVisible(page, frame => frame.locator('[skn-field="RS.ENT_IT_CONSOL"]'), 3000).catch(() => null);
    if (consolidate && await consolidate.locator('input[type="checkbox"]').isChecked()) {
      await consolidate.locator("span.switchery").click();
      if (await consolidate.locator('input[type="checkbox"]').isChecked()) throw new Error("Não foi possível desativar a consolidação de filiais.");
    }

    stage = "exportação CSV";
    const csv = await findVisible(page, frame => config.CLOUDFY_CSV_SELECTOR
      ? frame.locator(config.CLOUDFY_CSV_SELECTOR)
      : frame.locator('a[ng-click="VM.GenerateReport(3)"]'));
    const downloadPromise = page.waitForEvent("download", { timeout: 90000 });
    // O observador precisa estar ativo antes do clique.
    const [download] = await Promise.all([downloadPromise, csv.click()]);
    const failure = await download.failure();
    if (failure) throw new Error(`Falha no download: ${failure}`);
    const downloadPath = await download.path();
    const content = await fs.readFile(downloadPath);
    if (!content.length || /<(?:!doctype|html)\b/i.test(content.subarray(0, 200).toString())) {
      throw new Error("O portal retornou um arquivo vazio ou HTML em vez do CSV.");
    }
    return content;
  } catch (error) {
    throw new Error(`Falha na etapa de ${stage}: ${error.message}`);
  } finally {
    clearTimeout(deadline);
    await context.close();
  }
}

module.exports = { exportSales };
