import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import {
  buildHeaders,
  fetchAllEmployeesStatuses,
  fetchStatuses,
  hasAnyAuth,
} from "./pontomais-api.mjs";

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

function employeeRowsFromPayload(payload) {
  const employees = Array.isArray(payload?.employees) ? payload.employees : [];
  return employees
    .map((emp) => ({
      id: emp.id ?? "",
      nome: emp.name ?? "",
      status: emp.work_status?.name ?? "",
      status_id: emp.work_status?.id ?? "",
      equipe: emp.team?.name ?? "",
      equipe_id: emp.team?.id ?? "",
      registro_data: emp.work_status_time_card?.date ?? "",
      registro_hora: emp.work_status_time_card?.time ?? "",
      email: emp.email ?? "",
      login: emp.login ?? "",
    }))
    .sort((a, b) => String(a.nome).localeCompare(String(b.nome), "pt-BR", { sensitivity: "base" }));
}

function csvEscape(v) {
  const s = String(v ?? "");
  if (s.includes('"') || s.includes(",") || s.includes("\n")) {
    return `"${s.replaceAll('"', '""')}"`;
  }
  return s;
}

function toCsv(rows) {
  const headers = [
    "id",
    "nome",
    "status",
    "status_id",
    "equipe",
    "equipe_id",
    "registro_data",
    "registro_hora",
    "email",
    "login",
  ];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }
  return lines.join("\n");
}

async function ensureInitialCache() {
  if (cache.entry) return;
  await pullStatuses();
}

const server = http.createServer(async (req, res) => {
  const url = req.url?.split("?")[0] || "/";

  if (req.method === "GET" && url === "/healthz") {
    const isBootstrapping = Boolean(pullPromise);
    const healthy = Boolean(cache.entry) || isBootstrapping;
    sendJson(res, healthy ? 200 : 503, {
      ok: healthy,
      state: cache.entry ? "ready" : isBootstrapping ? "bootstrapping" : "waiting_first_pull",
      service: "carmella-pontomais",
      refreshedAt: cache.entry ? new Date(cache.entry.fetchedAt).toISOString() : null,
      refreshIntervalMs: REFRESH_MS,
      lastPullError: cache.lastPullError,
    });
    return;
  }

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

  if (req.method === "GET" && url === "/api/employees-status") {
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

      const full = await fetchAllEmployeesStatuses();
      const rows = employeeRowsFromPayload({ employees: full.employees });
      sendJson(res, 200, {
        rows,
        total: rows.length,
        pagesFetched: full.pagesFetched,
        fetchedAt: new Date().toISOString(),
      });
    } catch (e) {
      sendJson(res, 500, {
        error: "export_error",
        message: String(e.message || e),
        status: e.status,
        statusText: e.statusText,
      });
    }
    return;
  }

  if (req.method === "GET" && url === "/api/employees-status.csv") {
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

      const full = await fetchAllEmployeesStatuses();
      const rows = employeeRowsFromPayload({ employees: full.employees });
      const csv = toCsv(rows);

      res.writeHead(200, {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "no-store",
        "Content-Disposition": 'attachment; filename="employees-status.csv"',
      });
      res.end(csv);
    } catch (e) {
      sendJson(res, 500, {
        error: "export_error",
        message: String(e.message || e),
        status: e.status,
        statusText: e.statusText,
      });
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
