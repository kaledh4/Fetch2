const sheetId = '1IV_roEtzjbfVRh9YaLfW0fBZmNZjdZ_KRYiPHwMXCj4';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'DASHBOARD';
const query = encodeURIComponent('Select B, C, D, E') // Changed from 'Select *'
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
            const colz = ["Symbol", "Risk", "Price", "Multiple"]; // Specific column names
            const tr = document.createElement('tr');
            //Create table headers
            colz.forEach((column) => {
                const th = document.createElement('th');
                th.innerText = column;
                tr.appendChild(th);
            })
            output.appendChild(tr);
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
let minRisk = Infinity, maxRisk = -Infinity;
let minMultiple = Infinity, maxMultiple = -Infinity;

function getColor(value, type) {
    let saturation;
    if (type === 'risk') {
        value = (value - minRisk) / (maxRisk - minRisk);
        saturation = 100 - value * 100;
    } else if (type === 'multiples') {
        value = (value - minMultiple) / (maxMultiple - minMultiple);
        saturation = value * 100;
    }
    return `hsl(100, ${saturation}%, 20%)`;
}

function processRows(json) {
    // Calculate min and max for risk and multiples
    json.forEach((row, rowIndex) => {
        if (rowIndex < 6) {
            const keys = Object.keys(row);
            keys.forEach((key, columnIndex) => {
                let value = parseFloat(row[key]);
                if (columnIndex === 1) { // Risk
                    minRisk = Math.min(minRisk, value);
                    maxRisk = Math.max(maxRisk, value);
                } else if (columnIndex === 3) { // Multiples
                    minMultiple = Math.min(minMultiple, value);
                    maxMultiple = Math.max(maxMultiple, value);
                }
            });
        }
    });

    // Process rows
    json.forEach((row, rowIndex) => {
        if (rowIndex < 6) {
            const tr = document.createElement('tr');
            const keys = Object.keys(row);
            keys.forEach((key, columnIndex) => {
                const td = document.createElement('td');
                let value = row[key];
                if (columnIndex === 1) {
                    value = parseFloat(value).toFixed(3);
                    td.style.backgroundColor = getColor(value, 'risk');
                    td.textContent = value;
                } else if (columnIndex === 2) {
                    if (value < 1) {
                        value = value.toFixed(2);
                    } else {
                        value = value.toFixed(0);
                    }
                    td.textContent = value;
                } else if (columnIndex === 3) {
                    let formattedValue = value.toFixed(0) + 'x';
                    td.style.backgroundColor = getColor(value, 'multiples');
                    td.textContent = formattedValue;
                } else {
                    td.textContent = value;
                }
                tr.appendChild(td);
            })
            output.appendChild(tr);
        }
    })
}
