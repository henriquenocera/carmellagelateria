require('dotenv').config();
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Função simples para parsear CSV com aspas
function parseCSVRow(row) {
    const result = [];
    let curVal = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (inQuotes) {
            if (char === '"') {
                if (i + 1 < row.length && row[i + 1] === '"') {
                    curVal += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                curVal += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                result.push(curVal);
                curVal = '';
            } else {
                curVal += char;
            }
        }
    }
    result.push(curVal);
    return result;
}

async function importData() {
    console.log("Iniciando leitura do arquivo CSV...");
    
    try {
        const fileContent = fs.readFileSync('./CSV/insumos.csv', 'utf8');
        const lines = fileContent.split('\n').filter(l => l.trim() !== '');
        
        const headerLine = lines.shift();
        const headers = parseCSVRow(headerLine).map(h => h.trim().replace('\r', ''));
        
        let ordem = 1;
        const insumosParaInserir = [];

        for (const line of lines) {
            const values = parseCSVRow(line).map(v => v.trim().replace('\r', ''));
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index];
            });

            // Parsing e tratamento
            const nome = row.nome;
            if (!nome) continue; // Ignora linhas vazias

            const nomeSimples = row.nome_simples_unitario || '';
            const tipo = row.tipo || '';
            const fornecedor = row.fornecedor_padrao || '';
            
            // Tratamento numérico para quantidades
            let qtdConversao = row.quantidade_conversao ? parseFloat(row.quantidade_conversao.replace(',', '.')) : null;
            const unidadeConversao = row.unidade_conversao || '';
            
            let custoConsiderado = row.custo_considerado ? parseFloat(row.custo_considerado.replace(',', '.')) : null;
            
            // Calculando custo unitário
            let custoUnitario = null;
            if (custoConsiderado && qtdConversao && qtdConversao > 0) {
                custoUnitario = parseFloat((custoConsiderado / qtdConversao).toFixed(2));
            }

            const ativo = row.ativo ? row.ativo.toUpperCase() === 'TRUE' : true;

            insumosParaInserir.push({
                nome: nome,
                nome_simples_unitario: nomeSimples,
                tipo: tipo,
                fornecedor_padrao: fornecedor,
                quantidade_conversao: qtdConversao,
                unidade_conversao: unidadeConversao,
                custo_considerado: custoConsiderado,
                custo_considerado_unitario: custoUnitario,
                ativo: ativo,
                ordem: ordem
            });
            ordem++;
        }

        console.log(`Lidas ${insumosParaInserir.length} linhas válidas. Iniciando importação para o Supabase...`);

        // Deletar insumos antigos? Perguntarei ao usuário ou farei apenas insert
        // Para evitar duplicados podemos inserir aos poucos.

        let sqlFile = '-- Script de inserção para cadastro_insumos\n\n';
        sqlFile += 'INSERT INTO public.cadastro_insumos (nome, nome_simples_unitario, tipo, fornecedor_padrao, quantidade_conversao, unidade_conversao, custo_considerado, custo_considerado_unitario, ativo, ordem)\nVALUES\n';
        
        const values = insumosParaInserir.map((insumo, index) => {
            const escapeSql = (str) => {
                if (str === null || str === undefined) return 'NULL';
                return "'" + String(str).replace(/'/g, "''") + "'";
            };
            
            const n = escapeSql(insumo.nome);
            const ns = escapeSql(insumo.nome_simples_unitario);
            const tp = escapeSql(insumo.tipo);
            const fp = escapeSql(insumo.fornecedor_padrao);
            const qc = insumo.quantidade_conversao !== null ? insumo.quantidade_conversao : 'NULL';
            const uc = escapeSql(insumo.unidade_conversao);
            const cc = insumo.custo_considerado !== null ? insumo.custo_considerado : 'NULL';
            const ccu = insumo.custo_considerado_unitario !== null ? insumo.custo_considerado_unitario : 'NULL';
            const at = insumo.ativo ? 'TRUE' : 'FALSE';
            const ord = insumo.ordem;

            return `(${n}, ${ns}, ${tp}, ${fp}, ${qc}, ${uc}, ${cc}, ${ccu}, ${at}, ${ord})`;
        });

        sqlFile += values.join(',\n') + ';\n';

        fs.writeFileSync('./importar_insumos.sql', sqlFile);
        
        console.log("-----------------------------------------");
        console.log("SCRIPT SQL GERADO COM SUCESSO!");
        console.log(`Abra o arquivo 'importar_insumos.sql' e rode no SQL Editor do Supabase.`);
        console.log("-----------------------------------------");

    } catch (error) {
        console.error("Erro fatal durante a importação:", error);
    }
}

importData();
