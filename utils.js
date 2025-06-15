export function renderTable(tableId, headers, rows, rowMapper) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    table.innerHTML = `
        <thead>
            <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            ${rows.map(rowMapper).join('')}
        </tbody>
    `;
}