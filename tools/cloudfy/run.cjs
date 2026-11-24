const path = require("node:path");
const fs = require("node:fs/promises");
const { randomBytes } = require("node:crypto");
const { spawnSync } = require("node:child_process");
const { chromium } = require("playwright");
const { createServer } = require("./server.cjs");
const { exportSales } = require("./automation.cjs");
const { validateCsv } = require("./csv.cjs");
const { uploadToOffice } = require("./office.cjs");

async function run(config = process.env) {
  if (!config.ESCRITORIO_EMAIL || !config.ESCRITORIO_PASSWORD) {
    throw new Error("Configure as credenciais do escritório em tools/cloudfy/.env.local.");
  }
  const runtime = path.join(__dirname, ".runtime");
  await fs.mkdir(runtime, { recursive: true });
  const lockPath = path.join(runtime, "run.lock");
  let lock;
  try {
    lock = await fs.open(lockPath, "wx");
  } catch (error) {
    if (error.code === "EEXIST") throw new Error("Já existe uma execução em andamento. Se o computador foi desligado durante a execução anterior, apague tools/cloudfy/.runtime/run.lock e tente novamente.");
    throw error;
  }
  let server;
  try {
    try {
      await fs.access(chromium.executablePath());
    } catch {
      console.log("Instalando o navegador da automação (primeira execução)...");
      const cli = path.join(path.dirname(require.resolve("playwright/package.json")), "cli.js");
      const result = spawnSync(process.execPath, [cli, "install", "chromium"], { stdio: "inherit" });
      if (result.status !== 0) throw new Error("Não foi possível instalar o navegador. Execute npm run cloudfy:install.");
    }
    const token = randomBytes(24).toString("hex");
    server = createServer({ token, origins: [], runExport: period => exportSales(period, config) });
    server.requestTimeout = 360000;
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      // Porta automática: independente de outro servidor cloudfy:start já aberto.
      server.listen(0, "127.0.0.1", resolve);
    });
    console.log("[1/3] Servidor local iniciado. Acessando o Cloudfy e exportando os últimos cinco dias até ontem...");
    const response = await fetch(`http://127.0.0.1:${server.address().port}/export`, {
      method: "POST", headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(360000)
    });
    if (!response.ok) throw new Error((await response.json()).error);
    const period = { start: response.headers.get("X-Cloudfy-Start"), end: response.headers.get("X-Cloudfy-End") };
    const content = Buffer.from(await response.arrayBuffer());
    const checked = validateCsv(content, period);
    const directory = path.join(runtime, "downloads");
    await fs.mkdir(directory, { recursive: true });
    const filePath = path.join(directory, `cloudfy-${period.start}-${period.end}.csv`);
    await fs.writeFile(filePath, content);
    console.log(`[2/3] CSV validado: ${period.start} a ${period.end}, ${checked.rows} linha(s). Arquivo: ${filePath}`);
    console.log("[3/3] Acessando o escritório e enviando o CSV para importação...");
    const result = await uploadToOffice(filePath, config);
    console.log(`Concluído: ${result.imported} lançamento(s) importado(s), ${result.reconciled} já conciliado(s).`);
    return result;
  } finally {
    if (server?.listening) await new Promise(resolve => server.close(resolve));
    await lock.close();
    await fs.unlink(lockPath);
  }
}

if (require.main === module) {
  require("dotenv").config({ path: path.join(__dirname, ".env.local") });
  run().catch(error => { console.error(`ERRO: ${error.message}`); process.exitCode = 1; });
}

module.exports = { run };
