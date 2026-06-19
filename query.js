const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://zfkvpqqqekxaxnhevwno.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpma3ZwcXFxZWt4YXhuaGV2d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYyMzYsImV4cCI6MjA1NDg1MjIzNn0.Rw7bFAtUNMIPYL3cwEEGg_3amQe5aTHeG0Csj1m3v3U";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  const { data, error } = await supabase
    .from('inventario_insumos')
    .select('*')
    .limit(1);

  if (error) {
    console.log("Error querying inventario_insumos:", JSON.stringify(error, null, 2));
  } else {
    console.log("Columns:", Object.keys(data[0] || {}));
    if (data.length > 0) console.log("Sample Data:", data[0]);
  }
}

testQuery();
