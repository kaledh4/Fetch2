const sheetId = '1IV_roEtzjbfVRh9YaLfW0fBZmNZjdZ_KRYiPHwMXCj4';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'Economy';
const query = encodeURIComponent('Select A, B, C, D') // Changed from 'Select B, C, D, E'
const url = `${base}&sheet=${sheetName}&tq=${query}`
const data = []
document.addEventListener('DOMContentLoaded', init)
const output = document.querySelector('.output')

function init() {
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            //Remove additional text and extract only JSON:
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            console.log(rep)
            const colz = ["Unemployment Rate", "Headline Inflation", "Fed's Interest Rate", "Dollar Index"]; // Specific column names
            //extract row data:
            jsonData.table.rows.forEach((rowData) => {
                const row = {};
                colz.forEach((ele, ind) => {
                    row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].v : '';
                })
                data.push(row);
            })
            processRows(data);
        })
}

function processRows(data) {
    data.forEach((row) => {
        const tr = document.createElement('tr');
        for (const key in row) {
            const th = document.createElement('th');
            th.innerText = key;
            tr.appendChild(th);
            const td = document.createElement('td');
            td.innerText = row[key];
            tr.appendChild(td);
        }
        output.appendChild(tr);
    });
}

