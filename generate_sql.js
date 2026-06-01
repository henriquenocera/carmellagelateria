const fs = require('fs');

const csvPath = 'c:\\Users\\henoc\\Documents\\dev\\carmellagelateria\\CSV\\estoque.csv';
const sqlPath = 'c:\\Users\\henoc\\Documents\\dev\\carmellagelateria\\SQL\\importar_movimentacoes_estoque.sql';

const content = fs.readFileSync(csvPath, 'utf-8');

const lines = content.split(/\r?\n/);
let inQuotes = false;
let currentLine = '';
const parsedLines = [];

for (let i = 0; i < lines.length; i++) {
    currentLine += lines[i];
    const quotesMatch = currentLine.match(/"/g);
    const quotesCount = quotesMatch ? quotesMatch.length : 0;
    if (quotesCount % 2 === 0) {
        if (currentLine.trim() !== '') {
            parsedLines.push(currentLine);
        }
        currentLine = '';
    } else {
        currentLine += '\n'; 
    }
}

const dataRows = parsedLines.slice(1);

let sqlOut = `BEGIN;\n\n`;
sqlOut += `INSERT INTO public.movimentacoes_estoque (insumo_id, data_movimentacao, quantidade, origem, destino)\nVALUES\n`;

const seenRows = new Set();
const valuesList = [];

dataRows.forEach((row, index) => {
    const cols = [];
    let cur = '';
    let insideQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const c = row[i];
        if (c === '"' && (i === 0 || row[i-1] !== '\\')) {
            insideQuotes = !insideQuotes;
        } else if (c === ',' && !insideQuotes) {
            cols.push(cur);
            cur = '';
        } else {
            cur += c;
        }
    }
    cols.push(cur);

    if (cols.length >= 5) {
        let descricao = cols[0].trim();
        let dataStr = cols[1].trim();
        let qntd = cols[2].trim();
        let origem = cols[3].trim();
        let destino = cols[4].trim();

        if (!descricao || !dataStr || !qntd || descricao === '') return;
        
        const parts = dataStr.split('/');
        let sqlDate = dataStr;
        if (parts.length === 3) {
            sqlDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        
        const num = parseInt(qntd, 10);
        if (isNaN(num)) return;
        
        origem = origem.replace(/^"|"$/g, '').trim();
        destino = destino.replace(/^"|"$/g, '').trim();

        const rowKey = `${descricao}|${sqlDate}|${num}|${origem}|${destino}`;
        if (seenRows.has(rowKey)) {
            return; 
        }
        seenRows.add(rowKey);
        
        descricao = descricao.replace(/'/g, "''");
        origem = origem.replace(/'/g, "''");
        destino = destino.replace(/'/g, "''");
        
        valuesList.push(`  ((SELECT id FROM public.cadastro_insumos WHERE nome = '${descricao}' LIMIT 1), '${sqlDate}', ${num}, '${origem}', '${destino}')`);
    }
});

sqlOut += valuesList.join(',\n');
sqlOut += `;\n\nCOMMIT;\n`;

fs.writeFileSync(sqlPath, sqlOut, 'utf-8');
console.log('SQL gerado em ' + sqlPath + ' (Bloco Unico)');
