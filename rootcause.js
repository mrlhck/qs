import { renderTable } from './utils.js';
import { createChart } from './charts.js';

export function initRootCausePage(data, charts) {
    renderRootCauseTable(data);
    document.getElementById('add-rca')?.addEventListener('click', () => addRootCauseAnalysis(data, charts));
    document.getElementById('rca-type')?.addEventListener('change', () => toggleRcaTools());
}

function addRootCauseAnalysis(data, charts) {
    const problem = document.getElementById('rca-problem').value;
    const date = document.getElementById('rca-date').value;
    const responsible = document.getElementById('rca-responsible').value;
    const type = document.getElementById('rca-type').value;

    if (!problem || !date || !responsible) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus');
        return;
    }

    const newRca = {
        id: data.rootCauseAnalysis.length + 1,
        problem,
        date,
        responsible,
        type,
        status: 'in Bearbeitung',
        created_at: new Date().toISOString(),
        factors: [],
        solution: ''
    };

    data.rootCauseAnalysis.push(newRca);
    renderRootCauseTable(data);
    alert('Root-Cause-Analyse gestartet!');
}

function renderRootCauseTable(data) {
    renderTable('rca-table', ['ID', 'Problem', 'Methode', 'Verantwortlich', 'Status'], data.rootCauseAnalysis, rca => `
        <tr>
            <td>${rca.id}</td>
            <td>${rca.problem}</td>
            <td>${rca.type}</td>
            <td>${rca.responsible}</td>
            <td><span class="status-badge ${
                rca.status === 'in Bearbeitung' ? 'bg-yellow-100 text-yellow-800' : 
                rca.status === 'abgeschlossen' ? 'bg-green-100 text-green-800' : 
                'bg-blue-100 text-blue-800'
            }">${rca.status}</span></td>
        </tr>
    `);
}

function toggleRcaTools() {
    const type = document.getElementById('rca-type').value;
    document.getElementById('ishikawa-tool').classList.toggle('hidden', type !== 'Ishikawa');
    document.getElementById('5why-tool').classList.toggle('hidden', type !== '5-Why');
}