const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://zfkvpqqqekxaxnhevwno.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpma3ZwcXFxZWt4YXhuaGV2d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYyMzYsImV4cCI6MjA1NDg1MjIzNn0.Rw7bFAtUNMIPYL3cwEEGg_3amQe5aTHeG0Csj1m3v3U";

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const queryUnidade = "Loja Ahú";
  const queryCreatedAt = "2026-06-01T01:52:42.724145+00:00";
  
  const getUnidadeConfig = (unidadeName) => {
    switch(unidadeName) {
      case 'Loja Ahú': return { key: 'ahu', dbName: 'Loja Ahú' };
      case 'Loja Alto XV': return { key: 'altoxv', dbName: 'Loja Alto XV' };
      case 'Fábrica': return { key: 'fabrica', dbName: 'Fábrica' };
      case 'Estoque MH': return { key: 'mh', dbName: 'Estoque MH' };
      default: return { key: 'ahu', dbName: 'Loja Ahú' };
    }
  };

  const { dbName } = getUnidadeConfig(queryUnidade);

  // 1. Buscar os registros deste inventário
  const { data: registros, error: regError } = await supabase
    .from('inventario_insumos')
    .select('*')
    .eq('unidade', dbName)
    .eq('created_at', queryCreatedAt);

  if (regError) throw regError;
  if (!registros || registros.length === 0) {
    console.log('Nenhum registro encontrado para este inventário.');
    return;
  }

  // Configurar dados gerais usando o primeiro registro
  const firstRow = registros[0];
  
  let dataInventario = '';
  // Ajustar dataInventario
  if (firstRow.data_inventario) {
    // Se for um timestamp, cortamos para data, senão usamos direto
    dataInventario = firstRow.data_inventario.split('T')[0];
  } else {
    dataInventario = firstRow.created_at.split('T')[0];
  }

  console.log("Data Inventario:", dataInventario);

  // 2. Buscar o cadastro de insumos para cruzar as informações (nome, tipo, etc)
  const { data: insumosData, error: insError } = await supabase
    .from('cadastro_insumos')
    .select('*');

  if (insError) throw insError;

  // 3. Mesclar os dados e ordenar
  const mergedData = registros.map(reg => {
    const insumo = (insumosData || []).find(i => i.id === reg.insumo_id) || {};
    return {
      id: reg.insumo_id,
      nome: insumo.nome || 'Insumo Desconhecido',
      tipo: insumo.tipo || '-',
      unidade_conversao: insumo.unidade_conversao || '-',
      ordem: insumo.ordem || 9999,
      quantidade_salva: reg.quantidade
    };
  });

  // Ordenar respeitando a coluna 'ordem' do banco
  mergedData.sort((a, b) => a.ordem - b.ordem);

  console.log("Merged data length:", mergedData.length);
  console.log("First item:", mergedData[0]);
}

test().catch(e => console.error(e));
