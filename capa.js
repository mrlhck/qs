import { renderTable } from './utils.js';
import { createChart } from './charts.js';

export function initCapaPage(data, charts) {
    populateCapaForm(data);
    updateCapaTable(data);
    document.getElementById('toggle-capa-form')?.addEventListener('click', toggleCapaForm);
    document.getElementById('save-capa')?.addEventListener('click', () => saveCapa(data, charts));

    // CAPA escalation check every 24 hours
    setInterval(() => escalateOverdueCapas(data, charts), 86400000);
}

function populateCapaForm(data) {
    const responsibleSelect = document.getElementById('capa-responsible');
    if (!responsibleSelect) return;
    responsibleSelect.innerHTML = data.team.map(member => `<option value="${member.name}">${member.name}</option>`).join('');
}

function toggleCapaForm() {
    document.getElementById('capa-form')?.classList.toggle('hidden');
}

function saveCapa(data, charts) {
    let idValue = parseInt(document.getElementById('capa-id').value);
    if (isNaN(idValue)) {
        idValue = data.correctiveActions.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    }

    const title = document.getElementById('capa-title').value;
    const description = document.getElementById('capa-description').value;
    const status = document.getElementById('capa-status').value;
    const priority = document.getElementById('capa-priority').value;
    const responsible = document.getElementById('capa-responsible').value;
    const dueDate = document.getElementById('capa-due').value;

    if (!title || !description || !status || !priority || !responsible || !dueDate) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus');
        return;
    }

    data.correctiveActions.push({
        id: idValue,
        title,
        description,
        status,
        priority,
        responsible,
        due_date: dueDate,
        created_at: new Date().toISOString()
    });

    updateCapaTable(data);
    updateCapaCharts(data, charts);
    alert('CAPA gespeichert!');
}

function updateCapaTable(data) {
    if (!document.getElementById('capa-table')) return;
    
    renderTable('capa-table', ['Priorität', 'Titel', 'Verantwortlich', 'Fällig am', 'Status'], data.correctiveActions, capa => `
        <tr>
            <td><span class="priority-badge ${
                capa.priority === 'high' ? 'bg-red-100 text-red-800' :
                capa.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                'bg-green-100 text-green-800'
            }">
                ${capa.priority === 'high' ? 'Hoch' : capa.priority === 'medium' ? 'Mittel' : 'Niedrig'}
            </span></td>
            <td>${capa.title}</td>
            <td>${capa.responsible}</td>
            <td>${new Date(capa.due_date).toLocaleDateString('de-DE')}</td>
            <td><span class="status-badge ${
                capa.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                capa.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
            }">
                ${capa.status === 'open' ? 'Offen' : capa.status === 'in_progress' ? 'In Bearbeitung' : 'Geschlossen'}
            </span></td>
        </tr>
    `);
}

function updateCapaCharts(data, charts) {
    const statusCtx = document.getElementById('capa-status-chart')?.getContext('2d');
    if (statusCtx) {
        if (charts['capa-status-chart']) charts['capa-status-chart'].destroy();
        const statusCounts = {
            open: data.correctiveActions.filter(c => c.status === 'open').length,
            in_progress: data.correctiveActions.filter(c => c.status === 'in_progress').length,
            closed: data.correctiveActions.filter(c => c.status === 'closed').length
        };
        charts['capa-status-chart'] = createChart(statusCtx, 'pie', {
            labels: ['Offen', 'In Bearbeitung', 'Geschlossen'],
            data: [statusCounts.open, statusCounts.in_progress, statusCounts.closed],
            backgroundColor: ['#f9ab00', '#1a73e8', '#34a853'],
            legendPosition: 'right'
        });
    }

    const riskCtx = document.getElementById('capa-risk-chart')?.getContext('2d');
    if (riskCtx) {
        if (charts['capa-risk-chart']) charts['capa-risk-chart'].destroy();
        const risks = data.correctiveActions.map(c => ({
            title: c.title,
            risk: calculateCapaRisk(c)
        }));
        charts['capa-risk-chart'] = createChart(riskCtx, 'bar', {
            labels: risks.map(r => r.title),
            data: risks.map(r => r.risk),
            backgroundColor: '#ea4335',
            label: 'Risikobewertung',
            yAxis: { min: 0, title: 'Risikoscore' }
        });
    }
}

function calculateCapaRisk(capa) {
    let riskScore = 0;
    if (capa.priority === 'high') riskScore += 3;
    else if (capa.priority === 'medium') riskScore += 2;
    else riskScore += 1;

    const dueDate = new Date(capa.due_date);
    const now = new Date();
    if (dueDate < now) {
        const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
        riskScore += Math.min(daysOverdue, 7);
    }
    return riskScore;
}

function escalateOverdueCapas(data, charts) {
    const now = new Date();
    data.correctiveActions.forEach(capa => {
        if (capa.status !== 'closed' && new Date(capa.due_date) < now) {
            capa.priority = 'high';
        }
    });
    updateCapaTable(data);
    updateCapaCharts(data, charts);
}