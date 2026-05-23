const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://zfkvpqqqekxaxnhevwno.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpma3ZwcXFxZWt4YXhuaGV2d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYyMzYsImV4cCI6MjA1NDg1MjIzNn0.Rw7bFAtUNMIPYL3cwEEGg_3amQe5aTHeG0Csj1m3v3U";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

exports.handler = async function () {
  try {
    const [data_ahu, data_altoxv] = await Promise.all([
      supabase
        .from("cardsahu")
        .select("title")
        .eq("status", "vitrine-atual")
        .then((r) => r.data || []),
      supabase
        .from("cardsaltoxv")
        .select("title")
        .eq("status", "vitrine-atual")
        .then((r) => r.data || []),
    ]);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ data_ahu, data_altoxv }),
    };
  } catch (err) {
    console.error("Erro ao buscar sabores:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Erro ao buscar sabores" }),
    };
  }
};
