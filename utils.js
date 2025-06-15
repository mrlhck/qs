export function renderTable(tableId, headers, rows, rowMapper) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    // Fehlerbehandlung für leere Daten
    if (!rows || rows.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="${headers.length}" class="text-center py-4">Keine Daten verfügbar</td>
            </tr>
        `;
        return;
    }
    
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