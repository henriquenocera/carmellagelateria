const supabase = require('./src/supabase-client.js').default || require('./src/supabase-client.js');

async function run() {
  const { data, error } = await supabase
    .from('Vales')
    .select('*')
    .eq('Nome', 'Amanda');

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Found ${data.length} records for Amanda.`);
  let total = 0;
  let debits = 0;
  let credits = 0;

  for (const row of data) {
    const val = Number(row.valor) || 0;
    console.log(`Item: ${row.Item}, valor: ${row.valor}`);
    total += val;
    if (row.Item === 'Crédito (Acréscimo)') {
        credits += val;
    } else {
        debits += val;
    }
  }

  console.log(`Total: ${total}`);
  console.log(`Credits: ${credits}`);
  console.log(`Debits: ${debits}`);
}

run();
