const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zfkvpqqqekxaxnhevwno.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpma3ZwcXFxZWt4YXhuaGV2d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYyMzYsImV4cCI6MjA1NDg1MjIzNn0.Rw7bFAtUNMIPYL3cwEEGg_3amQe5aTHeG0Csj1m3v3U';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('Vouchers')
    .select('*')
    .limit(1);
  console.log('Error:', error);
  if (data && data.length > 0) {
    console.log('Row keys:', Object.keys(data[0]));
  } else {
    console.log('Table exists but is empty or does not exist. Data:', data);
    // Let's try to trigger an error to see column info if it fails
    const { error: insertError } = await supabase.from('Vouchers').insert({ fake_column_to_fail: 1 });
    console.log('Insert error to get columns:', insertError);
  }
}
check();
