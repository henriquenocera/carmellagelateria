require('dotenv').config({ path: '.ENV' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

async function run() {
  const { data: valesData, error } = await supabase
    .from("Vales")
    .select("Nome, valor, Item, created_at")
    .eq("Nome", "Amanda")
    .limit(100000);

  if (error) {
    console.error("Error:", error);
    return;
  }

  let total = 0;
  let totalSign = 0;
  valesData.forEach(v => {
    total += Number(v.valor) || 0;
    const absVal = Math.abs(Number(v.valor)) || 0;
    totalSign += v.Item === 'Crédito (Acréscimo)' ? absVal : -absVal;
  });

  console.log(`Total rows: ${valesData.length}`);
  console.log(`Total purely: ${total}`);
  console.log(`Total by sign: ${totalSign}`);
  
  // Print some recent rows
  valesData.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  console.log(valesData.slice(0, 20));
}

run();
