const fs = require('fs');
const csvPath = 'c:\\Users\\henoc\\Documents\\dev\\carmellagelateria\\CSV\\compras.csv';
const content = fs.readFileSync(csvPath, 'utf-8');

const lines = content.split(/\r?\n/);
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

let dataRows = parsedLines.slice(1);

const seenRows = new Set();
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
        
        if (descricao === 'Banana' && dataStr.includes('07/05/2026')) {
            console.log('RAW ROW:', row);
            console.log('COLS:', cols);
            let qntd = cols[3].trim().replace(/^"|"$/g, '').trim();
            qntd = qntd.replace(',', '.');
            const num = parseFloat(qntd);
            console.log('NUM:', num);
        }
    }
});
