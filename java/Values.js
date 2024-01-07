const sheetId = '1IV_roEtzjbfVRh9YaLfW0fBZmNZjdZ_KRYiPHwMXCj4';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'Values';
const query = encodeURIComponent('Select A, B, C, D, E, F, G, H, I, J, K') // Changed from 'Select *'
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
            const colz = ["Symbol", "Risk", "Price", "Multiple", "1", "2", "3", "4", "5"]; // Specific column names
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
