import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import { buildHeaders, fetchStatuses, hasAnyAuth } from "./pontomais-api.mjs";

/** Evita exibir no browser campos como senha (a API às vezes os devolve). */
function redactForBrowser(value, keys = new Set(["password"])) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((v) => redactForBrowser(v, keys));
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = keys.has(k) ? "***" : redactForBrowser(v, keys);
  }
  return out;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const publicDir = path.join(__dirname, "public");

/** Intervalo padrão: 2 minutos (sobrescreva com PONTOMAIS_REFRESH_MS no .env, em ms). */
const REFRESH_MS = Number(process.env.PONTOMAIS_REFRESH_MS) || 2 * 60 * 1000;

/** @type {{ entry: { upstreamOk: boolean, upstreamStatus: number, upstreamStatusText: string, data: object, fetchedAt: number } | null, lastPullError: object | null }} */
const cache = {
  entry: null,
  lastPullError: null,
};

/** Uma única requisição à API por vez; chamadas simultâneas aguardam a mesma Promise. */
let pullPromise = null;

async function pullStatuses() {
  if (pullPromise) return pullPromise;

  pullPromise = (async () => {
    const logPrefix = () => new Date().toISOString();
    try {
      const headers = buildHeaders();
      if (!hasAnyAuth(headers)) {
        cache.lastPullError = {
          code: "missing_auth",
          message:
            "Configure PONTOMAIS_* no .env na pasta do projeto e reinicie o servidor.",
        };
        console.warn(`[${logPrefix()}] [pontomais] pull ignorado: sem credenciais no .env`);
        return;
      }

      console.log(`[${logPrefix()}] [pontomais] buscando dados na API…`);

      let result;
      try {
        result = await fetchStatuses();
      } catch (e) {
        if (e.code === "MISSING_AUTH") {
          cache.lastPullError = { code: "missing_auth", message: e.message };
          console.error(`[${logPrefix()}] [pontomais] erro no fetch:`, e.message);
          return;
        }
        cache.lastPullError = { code: "fetch_error", message: String(e.message || e) };
        console.error(`[${logPrefix()}] [pontomais] erro no fetch:`, e.message || e);
        return;
      }

      if (!result.body) {
        cache.lastPullError = {
          code: "invalid_upstream_body",
          upstreamStatus: result.status,
          preview: result.rawText.slice(0, 500),
        };
        console.warn(
          `[${logPrefix()}] [pontomais] resposta sem JSON — HTTP ${result.status} ${result.statusText}`
        );
        return;
      }

      cache.entry = {
        upstreamOk: result.ok,
        upstreamStatus: result.status,
        upstreamStatusText: result.statusText,
        data: redactForBrowser(result.body),
        fetchedAt: Date.now(),
      };
      cache.lastPullError = null;

      const n = Array.isArray(result.body.employees) ? result.body.employees.length : "—";
      if (result.ok) {
        console.log(
          `[${logPrefix()}] [pontomais] fetch concluído — HTTP ${result.status} · ${n} funcionário(s) no payload`
        );
      } else {
        console.warn(
          `[${logPrefix()}] [pontomais] fetch concluído — HTTP ${result.status} ${result.statusText} (resposta gravada no cache)`
        );
      }
    } finally {
      pullPromise = null;
    }
  })();

  return pullPromise;
}

function sendJson(res, status, obj) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(obj));
}

async function ensureInitialCache() {
  if (cache.entry) return;
  await pullStatuses();
}

const server = http.createServer(async (req, res) => {
  const url = req.url?.split("?")[0] || "/";

  if (req.method === "GET" && (url === "/" || url === "/index.html")) {
    const file = path.join(publicDir, "index.html");
    try {
      const html = fs.readFileSync(file, "utf8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    } catch {
      res.writeHead(500);
      res.end("public/index.html não encontrado.");
    }
    return;
  }

  if (req.method === "GET" && url === "/api/statuses") {
    try {
      const headers = buildHeaders();
      if (!hasAnyAuth(headers)) {
        sendJson(res, 401, {
          error: "missing_auth",
          message:
            "Configure PONTOMAIS_* no .env na pasta do projeto e reinicie o servidor.",
        });
        return;
      }

      await ensureInitialCache();

      if (!cache.entry) {
        sendJson(res, 503, {
          error: "cache_empty",
          message: "Ainda não foi possível obter dados da API.",
          lastPullError: cache.lastPullError,
        });
        return;
      }

      const { fetchedAt, ...rest } = cache.entry;
      sendJson(res, rest.upstreamOk ? 200 : rest.upstreamStatus, {
        ...rest,
        meta: {
          refreshedAt: new Date(fetchedAt).toISOString(),
          refreshIntervalMs: REFRESH_MS,
          lastPullError: cache.lastPullError,
        },
      });
    } catch (e) {
      sendJson(res, 500, { error: "server_error", message: String(e.message || e) });
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Não encontrado");
});

server.listen(PORT, () => {
  const min = REFRESH_MS / 60000;
  console.log(`Abra no navegador: http://localhost:${PORT}`);
  console.log(`Cache da API: atualização automática a cada ${min} min.`);

  void pullStatuses();
  setInterval(() => {
    void pullStatuses();
  }, REFRESH_MS);
});
