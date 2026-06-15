const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zfkvpqqqekxaxnhevwno.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpma3ZwcXFxZWt4YXhuaGV2d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYyMzYsImV4cCI6MjA1NDg1MjIzNn0.Rw7bFAtUNMIPYL3cwEEGg_3amQe5aTHeG0Csj1m3v3U';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('tabela_afetada', 'lancamentos_financeiros')
    .limit(1);
  console.log('Error:', error);
  if (data && data[0]) {
    console.log('Audit Log Row:', data[0]);
    console.log('Keys in dados_novos:', Object.keys(data[0].dados_novos || {}));
    console.log('Keys in dados_antigos:', Object.keys(data[0].dados_antigos || {}));
  } else {
    console.log('No audit logs for lancamentos_financeiros');
  }
}
check();
