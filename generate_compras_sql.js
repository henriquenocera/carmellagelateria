const fs = require('fs');

const csvPath = 'c:\\Users\\henoc\\Documents\\dev\\carmellagelateria\\CSV\\compras.csv';
const sqlPath = 'c:\\Users\\henoc\\Documents\\dev\\carmellagelateria\\SQL\\importar_compras2.sql';

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

// Em compras.csv as vezes não tem cabeçalho, vamos verificar a primeira linha
let dataRows = parsedLines;
if (parsedLines[0] && parsedLines[0].toLowerCase().includes('insumo')) {
    dataRows = parsedLines.slice(1);
}

let sqlOut = `BEGIN;\n\n`;
sqlOut += `DELETE FROM public.entradas_mercadoria;\n\n`;
sqlOut += `INSERT INTO public.entradas_mercadoria (insumo_id, data_compra, fornecedor, quantidade_comprada, valor_unitario)\nVALUES\n`;

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
        let descricao = cols[0].trim().replace(/^"|"$/g, '').trim();
        let dataStr = cols[1].trim().replace(/^"|"$/g, '').trim();
        let fornecedor = cols[2].trim().replace(/^"|"$/g, '').trim();
        let qntd = cols[3].trim().replace(/^"|"$/g, '').trim();
        let valorUnitario = cols[4].trim().replace(/^"|"$/g, '').trim();

        if (!descricao || !dataStr || descricao === '') return;
        
        const parts = dataStr.split('/');
        let sqlDate = dataStr;
        if (parts.length === 3) {
            sqlDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        
        // Tratar quantidade (ex: 0,475 -> 0.475)
        qntd = qntd.replace(',', '.');
        const num = parseFloat(qntd);
        if (isNaN(num)) return;
        
        // Tratar valor unitário (ex: "R$ 14,80" -> 14.80)
        valorUnitario = valorUnitario.replace(/[R$ ]/g, '').replace(',', '.');
        let val = parseFloat(valorUnitario);
        if (isNaN(val)) val = 0;

        const rowKey = `${descricao}|${sqlDate}|${fornecedor}|${num}|${val}`;
        if (seenRows.has(rowKey)) {
            return; 
        }
        seenRows.add(rowKey);
        
        descricao = descricao.replace(/'/g, "''");
        fornecedor = fornecedor.replace(/'/g, "''");
        
        valuesList.push(`  ((SELECT id FROM public.cadastro_insumos WHERE nome = '${descricao}' LIMIT 1), '${sqlDate}', '${fornecedor}', ${num}, ${val})`);
    }
});

sqlOut += valuesList.join(',\n');
sqlOut += `;\n\nCOMMIT;\n`;

fs.writeFileSync(sqlPath, sqlOut, 'utf-8');
console.log('SQL gerado em ' + sqlPath + ' (Bloco Unico)');
