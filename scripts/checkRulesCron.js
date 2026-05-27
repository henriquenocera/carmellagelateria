require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Dynamically load the business rules to keep a single source of truth
const regrasPath = path.join(__dirname, '../src/utils/regrasDeNegocio.js');
const regrasCode = fs.readFileSync(regrasPath, 'utf8');
// Remove the ES module export and replace with CJS
const cleanCode = regrasCode.replace('export const avaliarRegrasDeNegocio', 'const avaliarRegrasDeNegocio') 
                + '\nmodule.exports = { avaliarRegrasDeNegocio };';
const Module = require('module');
const m = new Module();
m._compile(cleanCode, regrasPath);
const { avaliarRegrasDeNegocio } = m.exports;

// Connect to Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const webhookUrl = process.env.MAKE_WEBHOOK_URL;

if (!supabaseUrl || !supabaseKey || !webhookUrl) {
  console.error("Missing environment variables. Please check your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runCron() {
  console.log("Iniciando rotina de checagem do Dashboard...");

  try {
    // 1. Fetch Estoque and Checklists Data
    const [
      { data: ahuEstoqueData },
      { data: altoxvEstoqueData },
      { data: ahuChecklistData },
      { data: altoxvChecklistData }
    ] = await Promise.all([
      supabase.from('cardsahu').select('*').limit(1).single(),
      supabase.from('cardsaltoxv').select('*').limit(1).single(),
      supabase.from('checklists').select('*').eq('loja', 'Ahú').order('created_at', { ascending: false }).limit(1).single(),
      supabase.from('checklists').select('*').eq('loja', 'Alto da XV').order('created_at', { ascending: false }).limit(1).single(),
    ]);

    const dados = {
      estoque: {
        ahu: ahuEstoqueData,
        altoxv: altoxvEstoqueData
      },
      checklists: {
        ahu: ahuChecklistData,
        altoxv: altoxvChecklistData
      }
    };

    // 2. Evaluate Business Rules
    const notificacoes = avaliarRegrasDeNegocio(dados);

    // 3. Filter for Erro and Aviso (ignore Info)
    const alertasCriticos = notificacoes.filter(n => n.tipo === 'erro' || n.tipo === 'aviso');

    let textoMensagem = `*🚀 Resumo Diário Carmella Gelateria*\n_Data: ${new Date().toLocaleDateString('pt-BR')}_\n\n`;

    if (alertasCriticos.length === 0) {
      console.log("Nenhuma notificação crítica hoje. Enviando mensagem de 'Tudo OK' para teste.");
      textoMensagem += `✅ Tudo certo com as operações! Nenhuma notificação crítica no momento.\n\n`;
    } else {
      textoMensagem += `⚠️ *Atenção! Identificamos as seguintes pendências:* \n\n`;
      alertasCriticos.forEach((alerta) => {
        const emoji = alerta.tipo === 'erro' ? '🚨' : '⚠️';
        textoMensagem += `${emoji} *${alerta.titulo}*\n${alerta.mensagem ? alerta.mensagem : ''}\n\n`;
      });
    }

    textoMensagem += `Acesse o Dashboard para mais informações.`;

    console.log("Enviando webhook para o Make.com...");
    console.log("Payload:", textoMensagem);

    // 5. Send POST to Make.com Webhook
    await axios.post(webhookUrl, {
      message: textoMensagem,
      raw_alerts: alertasCriticos
    });

    console.log("✅ Webhook enviado com sucesso!");

  } catch (err) {
    console.error("❌ Erro ao rodar a rotina cron:", err.message);
  }
}

runCron();
