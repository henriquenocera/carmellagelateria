// Ponte entre o escritório e a Pluggy (Open Finance) para buscar extratos bancários.
//
// Secrets das Edge Functions do Supabase (nunca no frontend):
//   PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET
//
// Corpo da requisição (POST, usuário logado):
//   { "acao": "connect_token", "itemId"?: "..." }   -> token de 30 min para o widget Pluggy Connect
//   { "acao": "contas", "itemId": "..." }           -> contas bancárias de uma conexão
//   { "acao": "extrato", "accountId": "...", "dataInicio": "AAAA-MM-DD", "dataFim": "AAAA-MM-DD" }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const API = "https://api.pluggy.ai";
const MAX_DIAS = 365;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

class ErroPluggy extends Error {
  constructor(public codigo: string, message: string, public status = 502) {
    super(message);
  }
}

// A chave da Pluggy vale 2 horas; reaproveita enquanto a instância da função estiver viva.
let apiKeyCache: { chave: string; expiraEm: number } | null = null;
async function getApiKey() {
  if (apiKeyCache && Date.now() < apiKeyCache.expiraEm) return apiKeyCache.chave;
  const clientId = Deno.env.get("PLUGGY_CLIENT_ID");
  const clientSecret = Deno.env.get("PLUGGY_CLIENT_SECRET");
  if (!clientId || !clientSecret) {
    throw new ErroPluggy("config", "PLUGGY_CLIENT_ID e PLUGGY_CLIENT_SECRET não estão configurados nos Secrets.", 500);
  }
  const resp = await fetch(`${API}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, clientSecret }),
  });
  if (!resp.ok) {
    const texto = await resp.text();
    throw new ErroPluggy("auth_pluggy", `A Pluggy recusou as credenciais (HTTP ${resp.status}): ${texto.slice(0, 300)}`);
  }
  const { apiKey } = await resp.json();
  apiKeyCache = { chave: apiKey, expiraEm: Date.now() + 110 * 60 * 1000 };
  return apiKey as string;
}

async function pluggy(caminho: string, init: RequestInit = {}) {
  const apiKey = await getApiKey();
  const resp = await fetch(`${API}${caminho}`, {
    ...init,
    headers: { "Content-Type": "application/json", "X-API-KEY": apiKey, ...(init.headers || {}) },
  });
  if (resp.status === 401) apiKeyCache = null;
  if (!resp.ok) {
    const texto = await resp.text();
    throw new ErroPluggy("pluggy", `Erro da Pluggy em ${caminho.split("?")[0]} (HTTP ${resp.status}): ${texto.slice(0, 300)}`);
  }
  return resp.json();
}

const DATA_RE = /^\d{4}-\d{2}-\d{2}$/;

async function buscarExtrato(accountId: string, dataInicio: string, dataFim: string) {
  // deno-lint-ignore no-explicit-any
  const transacoes: any[] = [];
  let query = `?${new URLSearchParams({ accountId, dateFrom: dataInicio, dateTo: dataFim })}`;
  for (let i = 0; i < 200 && query; i++) {
    const dados = await pluggy(`/v2/transactions${query}`);
    transacoes.push(...(dados.results || []));
    query = dados.next || "";
  }

  return transacoes
    .filter((t) => t.status !== "PENDING")
    .map((t) => {
      const valor = Math.abs(Number(t.amount) || 0);
      const debito = String(t.type || "").toUpperCase() === "DEBIT";
      return {
        id: String(t.id),
        date: String(t.date || "").slice(0, 10),
        amount: debito ? -valor : valor,
        memo: (t.descriptionRaw || t.description || "").trim(),
        type: t.operationType || t.type || "",
      };
    });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ erro: "metodo", mensagem: "Use POST." }, 405);

  // Só usuários logados no escritório (e ativos).
  const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
  });
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return json({ erro: "auth", mensagem: "Faça login novamente." }, 401);
  const { data: perfil } = await supabase.from("profiles").select("ativo").eq("id", userData.user.id).single();
  if (perfil && perfil.ativo === false) return json({ erro: "auth", mensagem: "Usuário inativo." }, 403);

  try {
    const body = await req.json().catch(() => ({}));

    if (body.acao === "connect_token") {
      const dados = await pluggy("/connect_token", {
        method: "POST",
        body: JSON.stringify(body.itemId ? { itemId: String(body.itemId) } : {}),
      });
      return json({ ok: true, accessToken: dados.accessToken });
    }

    if (body.acao === "contas") {
      if (!body.itemId) return json({ erro: "parametros", mensagem: "Informe itemId." }, 400);
      const dados = await pluggy(`/accounts?${new URLSearchParams({ itemId: String(body.itemId), type: "BANK" })}`);
      // deno-lint-ignore no-explicit-any
      const contas = (dados.results || []).map((c: any) => ({
        id: c.id,
        nome: c.name || c.marketingName || "",
        numero: c.number || "",
        subtipo: c.subtype || "",
      }));
      return json({ ok: true, contas });
    }

    if (body.acao === "extrato") {
      const { accountId, dataInicio, dataFim } = body;
      if (!accountId) return json({ erro: "parametros", mensagem: "Informe accountId." }, 400);
      if (!DATA_RE.test(dataInicio || "") || !DATA_RE.test(dataFim || "")) {
        return json({ erro: "parametros", mensagem: "Informe dataInicio e dataFim no formato AAAA-MM-DD." }, 400);
      }
      const dias = (Date.parse(dataFim) - Date.parse(dataInicio)) / 86_400_000;
      if (dias < 0) return json({ erro: "parametros", mensagem: "A data final é anterior à inicial." }, 400);
      if (dias > MAX_DIAS) return json({ erro: "parametros", mensagem: `O período máximo é de ${MAX_DIAS} dias.` }, 400);
      const transacoes = await buscarExtrato(String(accountId), dataInicio, dataFim);
      return json({ ok: true, transacoes });
    }

    return json({ erro: "parametros", mensagem: "Ação desconhecida." }, 400);
  } catch (err) {
    if (err instanceof ErroPluggy) {
      console.error(`[pluggy-extrato] ${err.codigo}: ${err.message}`);
      return json({ erro: err.codigo, mensagem: err.message }, err.status);
    }
    console.error("[pluggy-extrato] erro inesperado", err);
    return json({ erro: "interno", mensagem: "Erro inesperado ao consultar a Pluggy." }, 500);
  }
});
