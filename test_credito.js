require('dotenv').config({ path: '.ENV' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

async function run() {
  const { data, error } = await supabase
    .from("produtos_vale")
    .select("*");

  const creditos = data.filter(p => p.nome.includes("Crédito"));
  console.log("Creditos:", creditos);
}

run();
