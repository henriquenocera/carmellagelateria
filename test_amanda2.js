require('dotenv').config({ path: '.ENV' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

async function run() {
  const { data: valesData, error } = await supabase
    .from("Vales")
    .select("Nome, valor")
    .limit(100000);

  const amandaRows = valesData.filter(v => v.Nome === "Amanda");
  console.log(`There are ${amandaRows.length} rows for Amanda in the bulk fetch.`);
  let total = 0;
  amandaRows.forEach(v => total += Number(v.valor) || 0);
  console.log(`Total for Amanda in bulk fetch: ${total}`);

  // Look for any other names that contain 'Amanda'
  const otherAmandas = valesData.filter(v => v.Nome && v.Nome.includes("Amanda") && v.Nome !== "Amanda");
  console.log(`Other Amandas:`, otherAmandas);
}

run();
