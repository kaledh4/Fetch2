const sheetId = '1rMecmF5SjQScr3Glq28WoNVphKH8fIyFtjoyzy2YIyw';
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
            const colz = ["Symbol", "Risk", "Price", "Percentage"]; // Specific column names
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
let minRisk = 0.001;
let maxRisk = 0.999;
let minMultiple = 3;
let maxMultiple = 5;

function getColor(value, type) {
    let hue;
    if (type === 'risk') {
        value = (value - minRisk) / (maxRisk - minRisk);
        hue = 120 - value * 120;
    } else if (type === 'multiples') {
        value = (value - minMultiple) / (maxMultiple - minMultiple);
        hue = value * 120;
    }
    return `hsl(${hue}, 100%, 35%)`;
}


function getColor(value, type) {
    let hue;
    if (type === 'risk') {
        value = (value - minRisk) / (maxRisk - minRisk);
        // Interpolate between red (0) and green (120)
        hue = 120 - value * 120;
    } else if (type === 'multiples') {
        value = (value - minMultiple) / (maxMultiple - minMultiple);
        // Interpolate between red (0) and green (120)
        hue = value * 600;
    }
    return `hsl(${hue}, 90%, 20%)`; // Saturation is 100, lightness is 35%
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
                    if (value < 400) {
                        value = value.toFixed(2);
                    } else {
                        value = value.toFixed(0);
                    }
                    td.textContent = value;
                } else if (columnIndex === 3) {
                    value = parseFloat(value);
                    let formattedValue = (value * 100).toFixed(0) + '%'; // Convert to percentage
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
