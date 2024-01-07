const sheetId = '1IV_roEtzjbfVRh9YaLfW0fBZmNZjdZ_KRYiPHwMXCj4';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'Values';
const query = encodeURIComponent('SELECT A, B, C, D, E, F, G, H, J, K');
const url = `${base}&sheet=${sheetName}&tq=${query}`;
const data = [];
const output = document.querySelector('.output');

document.addEventListener('DOMContentLoaded', init);

function init() {
    fetch(url)
       .then(rep => {
    // Remove additional text and extract only JSON:
    const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
    console.log(jsonData); // Log the entire jsonData object to the console

    const colz = ["Symbol", "Risk", "Price", "Multiple", "1", "2", "3", "4", "5"]; // Specific column names
    createTableHeaders(colz);

    // Extract row data and process rows
    jsonData.table.rows.forEach((rowData) => {
        const row = {};
        rowData.c.forEach((cell, ind) => {
            row[colz[ind]] = (cell != null) ? cell.v : '';
        });
        data.push(row);
    });

    processRows(data);
})
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function createTableHeaders(columns) {
    const tr = document.createElement('tr');
    // Create table headers
    columns.forEach((column) => {
        const th = document.createElement('th');
        th.innerText = column;
        tr.appendChild(th);
    });
    output.appendChild(tr);
}

function processRows(rowsData) {
    rowsData.forEach((rowData) => {
        const tr = document.createElement('tr');
        Object.values(rowData).forEach((value) => {
            const td = document.createElement('td');
            td.innerText = value;
            tr.appendChild(td);
        });
        output.appendChild(tr);
    });
}


