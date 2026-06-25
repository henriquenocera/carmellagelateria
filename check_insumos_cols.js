const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zfkvpqqqekxaxnhevwno.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpma3ZwcXFxZWt4YXhuaGV2d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYyMzYsImV4cCI6MjA1NDg1MjIzNn0.Rw7bFAtUNMIPYL3cwEEGg_3amQe5aTHeG0Csj1m3v3U';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  // Let's insert a dummy row with just the name
  const dummyName = 'DUMMY_ROW_TEST_COLUMNS_' + Date.now();
  console.log('Inserting dummy row to inspect columns...');
  
  const { data, error } = await supabase
    .from('cadastro_insumos')
    .insert([{ nome: dummyName, ativo: false }])
    .select();
    
  if (error) {
    console.error('Error inserting dummy row:', error);
  } else if (data && data.length > 0) {
    const row = data[0];
    console.log('Successfully inserted! Columns found in database:');
    console.log(Object.keys(row));
    console.log('Full row data:', row);
    
    // Now let's delete it
    console.log('Deleting dummy row...');
    const { error: deleteError } = await supabase
      .from('cadastro_insumos')
      .delete()
      .eq('id', row.id);
      
    if (deleteError) {
      console.error('Error deleting dummy row:', deleteError);
    } else {
      console.log('Deleted successfully.');
    }
  } else {
    console.log('No data returned.');
  }
}
check();
