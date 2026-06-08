require('dotenv').config({ path: '.ENV' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

async function run() {
  const { data: valesData, error } = await supabase
    .from("Vales")
    .select("Nome, valor, Item")
    .limit(100000);

  if (error) {
    console.error("Error:", error);
    return;
  }

  const valesCount = {};
  valesData.forEach(v => {
    if (!valesCount[v.Nome]) valesCount[v.Nome] = 0;
    valesCount[v.Nome] += Number(v.valor) || 0;
  });

  console.log("Vales Count purely by Number(v.valor):");
  console.log(valesCount);

  // Let's also print what we would get if we enforced sign
  const valesCountSign = {};
  valesData.forEach(v => {
    if (!valesCountSign[v.Nome]) valesCountSign[v.Nome] = 0;
    const absVal = Math.abs(Number(v.valor)) || 0;
    valesCountSign[v.Nome] += v.Item === 'Crédito (Acréscimo)' ? absVal : -absVal;
  });
  
  console.log("\nVales Count by Item sign:");
  console.log(valesCountSign);
}

run();
