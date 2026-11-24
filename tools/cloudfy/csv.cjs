function validateCsv(content, period) {
  let text = new TextDecoder("utf-8").decode(content);
  if (text.includes("\uFFFD")) text = new TextDecoder("windows-1252").decode(content);
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
  const header = lines[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (!header.includes("filial") || !header.includes("data") ||
      (!header.includes("vendas a vista") && !header.includes("forma de pagamento"))) {
    throw new Error("O CSV não possui as colunas esperadas do relatório de vendas Cloudfy.");
  }
  const dates = new Set();
  let rows = 0;
  for (const line of lines.slice(1)) {
    const columns = line.split("\t").map(value => value.replace(/^"|"$/g, "").trim());
    if (!/ALTO|AH[UÚ]/i.test(columns[0])) continue;
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(columns[1] || "")) throw new Error("O CSV contém uma data inválida.");
    const iso = columns[1].split("/").reverse().join("-");
    if (Number.isNaN(Date.parse(iso)) || new Date(iso).toISOString().slice(0, 10) !== iso) throw new Error("O CSV contém uma data inválida.");
    if (iso < period.start || iso > period.end) throw new Error(`O CSV contém datas fora do período ${period.start} a ${period.end}.`);
    dates.add(iso);
    rows++;
  }
  if (!rows) throw new Error("O CSV não contém vendas das lojas no período solicitado.");
  return { rows, dates: [...dates].sort() };
}

module.exports = { validateCsv };
