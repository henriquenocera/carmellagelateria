import "dotenv/config";

export const DEFAULT_URL =
  "https://api.pontomais.com.br/api/settings/statuses?count=true&count_teams=true&include_uninitiated=true&page=1&per_page=5&hrn=1";

export function pick(...keys) {
  for (const k of keys) {
    const v = process.env[k]?.trim();
    if (v) return v;
  }
  return "";
}

export function buildHeaders() {
  const h = {
    accept: "application/json",
    "user-agent":
      pick("PONTOMAIS_USER_AGENT") ||
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  };

  const accessToken = pick("PONTOMAIS_ACCESS_TOKEN", "ACCESS_TOKEN");
  const client = pick("PONTOMAIS_CLIENT", "CLIENT");
  const uid = pick("PONTOMAIS_UID", "UID");
  const expiry = pick("PONTOMAIS_EXPIRY", "EXPIRY");
  const tokenType = pick("PONTOMAIS_TOKEN_TYPE", "TOKEN_TYPE") || "Bearer";

  if (accessToken) h["access-token"] = accessToken;
  if (client) h.client = client;
  if (uid) h.uid = uid;
  if (expiry) h.expiry = expiry;
  if (accessToken || client || uid) h["token-type"] = tokenType;

  const cookie = pick("PONTOMAIS_COOKIE", "COOKIE");
  if (cookie) h.cookie = cookie;

  const authorization = pick("PONTOMAIS_AUTHORIZATION", "AUTHORIZATION");
  if (authorization) h.authorization = authorization;

  const referer = pick("PONTOMAIS_REFERER", "REFERER");
  if (referer) h.referer = referer;

  const origin = pick("PONTOMAIS_ORIGIN", "ORIGIN");
  if (origin) h.origin = origin;

  const csrf = pick(
    "PONTOMAIS_X_CSRF_TOKEN",
    "X_CSRF_TOKEN",
    "PONTOMAIS_CSRF_TOKEN",
    "CSRF_TOKEN"
  );
  if (csrf) h["x-csrf-token"] = csrf;

  const requestedWith = pick("PONTOMAIS_X_REQUESTED_WITH", "X_REQUESTED_WITH");
  if (requestedWith) h["x-requested-with"] = requestedWith;

  const deviceId = pick("PONTOMAIS_DEVICE_ID", "DEVICE_ID");
  if (deviceId) h["x-device-id"] = deviceId;

  const extra = pick("PONTOMAIS_EXTRA_HEADERS_JSON");
  if (extra) {
    try {
      Object.assign(h, JSON.parse(extra));
    } catch {
      throw new Error("PONTOMAIS_EXTRA_HEADERS_JSON não é um JSON válido.");
    }
  }

  return h;
}

export function hasAnyAuth(headers) {
  return Boolean(
    headers.cookie ||
      headers.authorization ||
      (headers["access-token"] && headers.client && headers.uid)
  );
}

export function getTargetUrl() {
  return pick("PONTOMAIS_URL", "URL") || DEFAULT_URL;
}

function buildPagedUrl(page, perPage) {
  const base = new URL(getTargetUrl());
  base.searchParams.set("page", String(page));
  base.searchParams.set("per_page", String(perPage));
  return base.toString();
}

/**
 * @returns {Promise<{ ok: boolean, status: number, statusText: string, body: object | null, rawText: string }>}
 */
export async function fetchStatuses() {
  const url = getTargetUrl();
  const headers = buildHeaders();

  if (!hasAnyAuth(headers)) {
    const err = new Error("MISSING_AUTH");
    err.code = "MISSING_AUTH";
    throw err;
  }

  const response = await fetch(url, { method: "GET", headers });
  const rawText = await response.text();
  let body = null;
  try {
    body = JSON.parse(rawText);
  } catch {
    /* mantém body null */
  }

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    body,
    rawText,
  };
}

/**
 * Busca uma página da API de statuses.
 * @returns {Promise<{ ok: boolean, status: number, statusText: string, body: object | null, rawText: string }>}
 */
export async function fetchStatusesPage(page, perPage) {
  const url = buildPagedUrl(page, perPage);
  const headers = buildHeaders();

  if (!hasAnyAuth(headers)) {
    const err = new Error("MISSING_AUTH");
    err.code = "MISSING_AUTH";
    throw err;
  }

  const response = await fetch(url, { method: "GET", headers });
  const rawText = await response.text();
  let body = null;
  try {
    body = JSON.parse(rawText);
  } catch {
    /* mantém body null */
  }

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    body,
    rawText,
  };
}

/**
 * Busca todos os funcionários percorrendo paginação.
 * @returns {Promise<{ employees: object[], pagesFetched: number, meta: object }>}
 */
export async function fetchAllEmployeesStatuses() {
  const perPage = Number(pick("PONTOMAIS_EXPORT_PER_PAGE")) || 100;
  const maxPages = Number(pick("PONTOMAIS_EXPORT_MAX_PAGES")) || 100;

  let page = 1;
  let pagesFetched = 0;
  const employees = [];
  let lastMeta = {};

  while (page <= maxPages) {
    const result = await fetchStatusesPage(page, perPage);

    if (!result.ok) {
      const err = new Error(`UPSTREAM_HTTP_${result.status}`);
      err.code = "UPSTREAM_HTTP_ERROR";
      err.status = result.status;
      err.statusText = result.statusText;
      err.body = result.body;
      throw err;
    }

    if (!result.body) {
      const err = new Error("UPSTREAM_INVALID_JSON");
      err.code = "UPSTREAM_INVALID_JSON";
      err.rawText = result.rawText;
      throw err;
    }

    const chunk = Array.isArray(result.body.employees) ? result.body.employees : [];
    employees.push(...chunk);
    pagesFetched += 1;
    lastMeta = result.body.meta || {};

    const total = Number(lastMeta.count);
    if (Number.isFinite(total) && employees.length >= total) break;
    if (chunk.length < perPage) break;
    page += 1;
  }

  return {
    employees,
    pagesFetched,
    meta: lastMeta,
  };
}
