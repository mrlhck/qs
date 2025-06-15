import { renderTable } from './utils.js';
import { createChart } from './charts.js';

// Globale Funktion für Chart-Update verfügbar machen
window.updateCapaCharts = function(data, charts) {
    console.log('Updating CAPA charts with data:', data.correctiveActions);
    
    // Status Chart
    const statusCtx = document.getElementById('capa-status-chart')?.getContext('2d');
    if (statusCtx) {
        if (charts['capa-status-chart']) {
            charts['capa-status-chart'].destroy();
        }
        
        const statusCounts = {
            open: data.correctiveActions.filter(c => c.status === 'open').length,
            in_progress: data.correctiveActions.filter(c => c.status === 'in_progress').length,
            closed: data.correctiveActions.filter(c => c.status === 'closed').length
        };
        
        console.log('CAPA status counts:', statusCounts);
        
        charts['capa-status-chart'] = createChart(statusCtx, 'doughnut', {
            labels: ['Offen', 'In Bearbeitung', 'Geschlossen'],
            data: [statusCounts.open, statusCounts.in_progress, statusCounts.closed],
            backgroundColor: ['#f9ab00', '#1a73e8', '#34a853'],
            legendPosition: 'right'
        });
    }

    // Risk Chart
    const riskCtx = document.getElementById('capa-risk-chart')?.getContext('2d');
    if (riskCtx) {
        if (charts['capa-risk-chart']) {
            charts['capa-risk-chart'].destroy();
        }
        
        // Titel kürzen, damit sie im Diagramm lesbar sind
        const risks = data.correctiveActions.map(c => ({
            title: c.title.length > 15 ? c.title.substring(0, 12) + '...' : c.title,
            risk: calculateCapaRisk(c)
        }));
        
        console.log('CAPA risks:', risks);
        
        charts['capa-risk-chart'] = createChart(riskCtx, 'bar', {
            labels: risks.map(r => r.title),
            data: risks.map(r => r.risk),
            backgroundColor: '#ea4335',
            label: 'Risikobewertung',
            yAxis: { min: 0, max: 10, title: 'Risikoscore' }
        });
    }
};

function calculateCapaRisk(capa) {
    let riskScore = 0;
    
    // Prioritätsgewichtung
    if (capa.priority === 'high') riskScore += 3;
    else if (capa.priority === 'medium') riskScore += 2;
    else riskScore += 1;

    // Fälligkeitsgewichtung
    const dueDate = new Date(capa.due_date);
    const now = new Date();
    if (dueDate < now) {
        const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
        riskScore += Math.min(daysOverdue, 5); // Maximal 5 Punkte für Überfälligkeit
    }
    
    return riskScore;
}

export function initCapaPage(data, charts) {
    // Sicherstellen, dass CAPA-Daten vorhanden sind
    if (!data.correctiveActions) {
        data.correctiveActions = [];
        console.warn('Initialized empty correctiveActions array');
    }
    
    populateCapaForm(data);
    updateCapaTable(data);
    
    // Event-Listener setzen
    document.getElementById('toggle-capa-form')?.addEventListener('click', toggleCapaForm);
    document.getElementById('save-capa')?.addEventListener('click', () => saveCapa(data, charts));
    
    // Verzögerte Chart-Initialisierung
    setTimeout(() => {
        updateCapaCharts(data, charts);
    }, 300);
}

function populateCapaForm(data) {
    const responsibleSelect = document.getElementById('capa-responsible');
    if (!responsibleSelect) {
        console.error('capa-responsible element not found');
        return;
    }
    
    // Teamdaten sicherstellen
    if (!data.team || data.team.length === 0) {
        console.warn('No team data available for CAPA form');
        return;
    }
    
    responsibleSelect.innerHTML = data.team.map(member => 
        `<option value="${member.name}">${member.name}</option>`
    ).join('');
}

function toggleCapaForm() {
    const form = document.getElementById('capa-form');
    if (!form) {
        console.error('capa-form element not found');
        return;
    }
    form.classList.toggle('hidden');
}

function saveCapa(data, charts) {
    let idValue = parseInt(document.getElementById('capa-id').value) || 0;
    const isNew = isNaN(idValue) || idValue === 0;

    const title = document.getElementById('capa-title')?.value;
    const description = document.getElementById('capa-description')?.value;
    const status = document.getElementById('capa-status')?.value;
    const priority = document.getElementById('capa-priority')?.value;
    const responsible = document.getElementById('capa-responsible')?.value;
    const dueDate = document.getElementById('capa-due')?.value;

    if (!title || !description || !status || !priority || !responsible || !dueDate) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus');
        return;
    }

    if (isNew) {
        // Neue CAPA hinzufügen
        idValue = data.correctiveActions.length > 0 
            ? Math.max(...data.correctiveActions.map(c => c.id)) + 1 
            : 1;
            
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
    } else {
        // Bestehende CAPA aktualisieren
        const index = data.correctiveActions.findIndex(c => c.id === idValue);
        if (index !== -1) {
            data.correctiveActions[index] = {
                ...data.correctiveActions[index],
                title,
                description,
                status,
                priority,
                responsible,
                due_date: dueDate
            };
        } else {
            console.warn(`CAPA with ID ${idValue} not found`);
            return;
        }
    }

    updateCapaTable(data);
    updateCapaCharts(data, charts);
    alert('CAPA gespeichert!');
}

function updateCapaTable(data) {
    const table = document.getElementById('capa-table');
    if (!table) {
        console.error('capa-table element not found');
        return;
    }
    
    if (!data.correctiveActions || data.correctiveActions.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">Keine CAPA-Maßnahmen vorhanden</td>
            </tr>
        `;
        return;
    }
    
    renderTable('capa-table', 
        ['Priorität', 'Titel', 'Verantwortlich', 'Fällig am', 'Status'], 
        data.correctiveActions, 
        capa => `
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
        `
    );
}