require('dotenv').config({ path: '.ENV' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: profiles } = await supabase.from('profiles').select('name');
  console.log("Profiles:", profiles.map(p => p.name));

  const { data: vales } = await supabase.from('Vales').select('Nome');
  const uniqueVales = [...new Set(vales.map(v => v.Nome))];
  console.log("Vales Names:", uniqueVales);
}
run();
