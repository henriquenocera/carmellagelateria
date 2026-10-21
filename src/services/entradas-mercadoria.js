import supabase from "./supabase-client";

const PAGE_SIZE = 1000;

export async function fetchTodasEntradasMercadoria(select) {
  const entradas = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("entradas_mercadoria")
      .select(select)
      .order("data_compra", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;

    const page = data || [];
    entradas.push(...page);

    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return entradas;
}
