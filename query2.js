const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://zfkvpqqqekxaxnhevwno.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpma3ZwcXFxZWt4YXhuaGV2d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYyMzYsImV4cCI6MjA1NDg1MjIzNn0.Rw7bFAtUNMIPYL3cwEEGg_3amQe5aTHeG0Csj1m3v3U";

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('inventario_insumos').select('id, unidade, created_at').limit(5);
  console.log("Error:", error);
  console.log("Data:", data);
}

check();
