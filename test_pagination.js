require('dotenv').config({ path: '.ENV' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

async function fetchAllVales() {
  let allData = [];
  let from = 0;
  const step = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from("Vales")
      .select("Nome, valor, Item")
      .range(from, from + step - 1);

    if (error) throw error;
    if (data && data.length > 0) {
      allData = [...allData, ...data];
      from += step;
      if (data.length < step) hasMore = false;
    } else {
      hasMore = false;
    }
  }
  return allData;
}

async function run() {
  const valesData = await fetchAllVales();
  console.log(`Fetched ${valesData.length} total rows.`);

  const valesCount = {};
  valesData.forEach(v => {
    if (!valesCount[v.Nome]) valesCount[v.Nome] = 0;
    valesCount[v.Nome] += Number(v.valor) || 0;
  });

  console.log("Vales Count purely by Number(v.valor):");
  console.log(valesCount);
}

run();
