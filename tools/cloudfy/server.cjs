const http = require("node:http");
const { randomBytes, timingSafeEqual } = require("node:crypto");
const path = require("node:path");
const { salesPeriod } = require("./period.cjs");

function createServer({ token, origins, runExport }) {
  let busy = false;
  return http.createServer(async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    const origin = req.headers.origin;
    const allowedHost = /^(localhost|127\.0\.0\.1):\d+$/.test(req.headers.host || "");
    if (!allowedHost || (origin && !origins.includes(origin))) {
      res.writeHead(403).end();
      return;
    }
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
      res.setHeader("Access-Control-Expose-Headers", "X-Cloudfy-Start, X-Cloudfy-End");
      res.setHeader("Access-Control-Allow-Private-Network", "true");
    }
    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }
    const supplied = Buffer.from(req.headers.authorization || "");
    const expected = Buffer.from(`Bearer ${token}`);
    const json = (status, message) => {
      res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: message }));
    };
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      json(401, "Token local inválido. Copie o token exibido no terminal do servidor.");
      return;
    }
    if (req.url !== "/export" || req.method !== "POST") {
      json(404, "Rota não encontrada.");
      return;
    }
    if (busy) {
      json(409, "Já existe uma exportação em andamento neste computador.");
      return;
    }
    busy = true;
    const period = salesPeriod();
    try {
      const content = await runExport(period);
      res.writeHead(200, {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="cloudfy-${period.start}-${period.end}.csv"`,
        "X-Cloudfy-Start": period.start,
        "X-Cloudfy-End": period.end
      });
      res.end(content);
    } catch (error) {
      json(500, error.message);
    } finally {
      busy = false;
    }
  });
}

if (require.main === module) {
  require("dotenv").config({ path: path.join(__dirname, ".env.local") });
  const { exportSales } = require("./automation.cjs");
  const token = process.env.CLOUDFY_LOCAL_TOKEN || randomBytes(24).toString("hex");
  const origins = (process.env.CLOUDFY_ALLOWED_ORIGINS || "http://localhost:3000,https://escritorio.carmellagelateria.com.br")
    .split(",").map(value => value.trim()).filter(Boolean);
  const port = Number(process.env.CLOUDFY_PORT || 4318);
  const server = createServer({ token, origins, runExport: exportSales });
  server.requestTimeout = 360000;
  server.listen(port, "127.0.0.1", () => {
    console.log(`Cloudfy local: http://127.0.0.1:${port}`);
    console.log(`Token local (cole na tela de importação): ${token}`);
    console.log("Mantenha este terminal aberto. Na primeira execução, conclua o login na janela do navegador.");
  });
  server.on("error", error => { console.error(error.message); process.exitCode = 1; });
}

module.exports = { createServer };
