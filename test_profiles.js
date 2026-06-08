require('dotenv').config({ path: '.ENV' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

async function run() {
  const { data: valesData, error } = await supabase
    .from("Vales")
    .select("Nome, valor")
    .limit(100000);

  const valesCount = {};
  valesData.forEach(v => {
    if (!valesCount[v.Nome]) valesCount[v.Nome] = 0;
    valesCount[v.Nome] += Number(v.valor) || 0;
  });

  const { data: profiles } = await supabase.from('profiles').select('name');
  
  profiles.forEach(p => {
    const firstName = p.name ? p.name.split(" ")[0] : "";
    const total = valesCount[p.name] !== undefined 
        ? valesCount[p.name] 
        : valesCount[firstName] !== undefined 
            ? valesCount[firstName] 
            : 0;
    console.log(`Profile: ${p.name} | First: ${firstName} | Total: ${total}`);
  });
}

run();
