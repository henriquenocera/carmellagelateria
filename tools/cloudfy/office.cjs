const path = require("node:path");
const fs = require("node:fs/promises");
const { chromium } = require("playwright");

const OFFICE_URL = "https://escritorio.carmellagelateria.com.br";
const IMPORT_PATH = "/importe-vendas-cloudfy";

async function importOnPage(page, filePath, log = console.log) {
  let dialogError = "";
  let importConfirmed = false;
  let importSucceeded = false;
  const onDialog = async dialog => {
    const message = dialog.message();
    if (dialog.type() === "confirm" && /^Deseja lançar as \d+ transações selecionadas/.test(message)) {
      importConfirmed = true;
      await dialog.accept();
    } else if (dialog.type() === "alert") {
      if (/Lançamentos importados com sucesso/i.test(message)) importSucceeded = true;
      else dialogError = message;
      await dialog.accept();
    } else {
      dialogError = `O escritório exibiu uma confirmação inesperada: ${message}`;
      await dialog.dismiss();
    }
  };
  page.on("dialog", onDialog);
  const checkError = () => { if (dialogError) throw new Error(dialogError); };
  try {
    await page.locator('input[type="file"][accept=".csv"]').setInputFiles(filePath);
    log("CSV enviado. Analisando os lançamentos no escritório...");
    await page.getByRole("button", { name: "Importar e Analisar", exact: true }).click();
    const table = page.locator("table.frequencia-table");
    // Aguarda o resultado da análise ou um erro apresentado em alert.
    const analysisDeadline = Date.now() + 90000;
    while (!await table.isVisible()) {
      checkError();
      if (Date.now() > analysisDeadline) throw new Error("O escritório não concluiu a análise do CSV em 90 segundos.");
      await page.waitForTimeout(250);
    }
    checkError();
    const rows = table.locator("tbody tr");
    const statuses = await rows.locator("td:nth-child(6)").allTextContents();
    if (!statuses.length || statuses.some(status => !["Não Encontrado", "Já Conciliado", "Importado"].includes(status.trim()))) {
      throw new Error("O escritório retornou um resultado de análise inesperado.");
    }
    const pending = statuses.filter(status => status.trim() === "Não Encontrado").length;
    if (!pending) {
      log("Todos os lançamentos já estão conciliados. Nenhuma alteração necessária.");
      return { imported: 0, reconciled: statuses.length };
    }
    await table.locator('thead input[type="checkbox"]').check();
    const launch = page.getByRole("button", { name: `Lançar Selecionados (${pending})`, exact: true });
    await launch.click();
    const importDeadline = Date.now() + 90000;
    while (!importSucceeded || (await rows.locator("td:nth-child(6)").allTextContents()).some(status => status.trim() === "Não Encontrado")) {
      checkError();
      if (Date.now() > importDeadline) throw new Error("O escritório não confirmou a importação em 90 segundos. Confira os lançamentos antes de tentar novamente.");
      await page.waitForTimeout(250);
    }
    checkError();
    if (!importConfirmed) throw new Error("A confirmação da importação não foi identificada.");
    const remaining = await rows.locator("td:nth-child(6)").allTextContents();
    if (remaining.some(status => status.trim() === "Não Encontrado")) throw new Error("O escritório ainda possui lançamentos pendentes após a importação.");
    return { imported: pending, reconciled: statuses.length - pending };
  } finally {
    page.off("dialog", onDialog);
  }
}

async function uploadToOffice(filePath, config = process.env, log = console.log) {
  if (!config.ESCRITORIO_EMAIL || !config.ESCRITORIO_PASSWORD) {
    throw new Error("Configure ESCRITORIO_EMAIL e ESCRITORIO_PASSWORD em tools/cloudfy/.env.local.");
  }
  const runtime = path.join(__dirname, ".runtime");
  await fs.mkdir(runtime, { recursive: true });
  const context = await chromium.launchPersistentContext(path.join(runtime, "office-browser"), {
    headless: false, locale: "pt-BR", timezoneId: "America/Sao_Paulo"
  });
  context.setDefaultTimeout(30000);
  const page = context.pages()[0] || await context.newPage();
  let stage = "login no escritório";
  const timeout = setTimeout(() => context.close().catch(() => {}), 5 * 60 * 1000);
  try {
    await page.goto(`${OFFICE_URL}${IMPORT_PATH}`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelector('input[type="email"]') || document.querySelector('input[type="file"][accept=".csv"]'));
    if (await page.locator('input[type="email"]').isVisible()) {
      await page.getByLabel("Email", { exact: true }).fill(config.ESCRITORIO_EMAIL);
      await page.getByLabel("Senha", { exact: true }).fill(config.ESCRITORIO_PASSWORD);
      await page.getByRole("button", { name: "Entrar", exact: true }).click();
      await page.waitForFunction(() => !location.pathname.startsWith("/login") || document.querySelector(".login-error"));
      const error = page.locator(".login-error");
      if (await error.isVisible()) throw new Error(await error.textContent());
      await page.goto(`${OFFICE_URL}${IMPORT_PATH}`, { waitUntil: "domcontentloaded" });
    }
    stage = "upload e importação no escritório";
    await page.getByRole("heading", { name: "Importe Vendas Cloudfy", exact: true }).waitFor();
    return await importOnPage(page, filePath, log);
  } catch (error) {
    throw new Error(`Falha na etapa de ${stage}: ${error.message}`);
  } finally {
    clearTimeout(timeout);
    await context.close();
  }
}

module.exports = { uploadToOffice, importOnPage };
