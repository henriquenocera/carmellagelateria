const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envPath = '.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env.REACT_APP_SUPABASE_URL;
const supabaseKey = env.REACT_APP_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const res = await supabase
    .from('profiles')
    .select('*');
  
  console.log('Result error:', res.error);
  console.log('Result data length:', res.data ? res.data.length : null);
  if (res.data) {
    res.data.forEach(p => {
      console.log(`- ID: ${p.id}, Name: ${p.name}, Folgas Fixas: ${p.folgas_fixas}, Data Registro: ${p.data_registro}`);
    });
  }
}

run();
