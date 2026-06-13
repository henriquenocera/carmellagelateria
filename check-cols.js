const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zfkvpqqqekxaxnhevwno.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpma3ZwcXFxZWt4YXhuaGV2d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYyMzYsImV4cCI6MjA1NDg1MjIzNn0.Rw7bFAtUNMIPYL3cwEEGg_3amQe5aTHeG0Csj1m3v3U';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  const { data, error } = await supabase.from('notificacao_lojas').update({ dias_semana: [1, 2, 3] }).eq('id', '568381f6-b3e1-47c9-a9ac-2c67258f37c0');
  console.log('Error:', error);
}
testUpdate();
