require('dotenv').config({ path: '.ENV' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

async function run() {
  const { data, error } = await supabase
    .from("produtos_vale")
    .select("*");

  console.log("Count:", data ? data.length : 0);
  console.log("Some items:", data && data.slice(0, 10));
}

run();
