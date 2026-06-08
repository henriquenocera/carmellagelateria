require('dotenv').config({ path: '.ENV' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

async function run() {
  const { data, error } = await supabase.from('profiles').select('*');
  console.log("Error:", error);
  console.log("Data length:", data ? data.length : 0);
  if(data && data.length > 0) {
     console.log("First row keys:", Object.keys(data[0]));
     console.log("First row data:", data[0]);
  }
}

run();
