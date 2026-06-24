const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zfkvpqqqekxaxnhevwno.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpma3ZwcXFxZWt4YXhuaGV2d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYyMzYsImV4cCI6MjA1NDg1MjIzNn0.Rw7bFAtUNMIPYL3cwEEGg_3amQe5aTHeG0Csj1m3v3U';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error, count } = await supabase
    .from('Vales')
    .select('*', { count: 'exact' });
  
  console.log('Error:', error);
  console.log('Count:', count);
  console.log('Data type:', typeof data);
  console.log('Is Array:', Array.isArray(data));
  if (data) {
    console.log('Data length:', data.length);
    if (data.length > 0) {
      console.log('First row:', data[0]);
    }
  }
}
check();
