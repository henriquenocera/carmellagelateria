const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://zfkvpqqqekxaxnhevwno.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpma3ZwcXFxZWt4YXhuaGV2d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYyMzYsImV4cCI6MjA1NDg1MjIzNn0.Rw7bFAtUNMIPYL3cwEEGg_3amQe5aTHeG0Csj1m3v3U";

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const queryCreatedAt = '2026-06-01T01:52:42.724145+00:00';
  const dbName = 'Loja Ahú';

  const { data: registros, error: regError } = await supabase
    .from('inventario_insumos')
    .select('*')
    .eq('unidade', dbName)
    .eq('created_at', queryCreatedAt);

  console.log("Registros:", registros ? registros.length : 0);
  console.log("Error:", regError);
}

test();
