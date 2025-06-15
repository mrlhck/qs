import { renderTable } from './utils.js';
import { createChart } from './charts.js';

export function initEnvironmentsPage(data, charts) {
    updateEnvironmentsTable(data);
    updateEnvironmentChart(data, charts);
    document.getElementById('refresh-environments')?.addEventListener('click', () => refreshEnvironments(data, charts));
    document.getElementById('reserve-environment')?.addEventListener('click', () => reserveEnvironment(data));
}

function updateEnvironmentsTable(data) {
    if (!document.getElementById('environments-table')) return;
    
    renderTable('environments-table', ['Name', 'Status', 'Version', 'Benutzer', 'Letztes Update'], data.environments, env => `
        <tr>
            <td>${env.name}</td>
            <td><span class="status-badge ${
                env.status === 'verfügbar' ? 'bg-green-100 text-green-800' :
                env.status === 'in Benutzung' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
            }">${env.status}</span></td>
            <td>${env.version}</td>
            <td>${env.user || '-'}</td>
            <td>${new Date(env.last_updated).toLocaleDateString('de-DE')}</td>
        </tr>
    `);
}

function updateEnvironmentChart(data, charts) {
    const ctx = document.getElementById('environment-chart')?.getContext('2d');
    if (!ctx) return;

    if (charts['environment-chart']) charts['environment-chart'].destroy();
    
    const statusCounts = {
        verfügbar: data.environments.filter(e => e.status === 'verfügbar').length,
        inBenutzung: data.environments.filter(e => e.status === 'in Benutzung').length,
        wartung: data.environments.filter(e => e.status === 'Wartung').length
    };

    charts['environment-chart'] = createChart(ctx, 'doughnut', {
        labels: ['Verfügbar', 'In Benutzung', 'Wartung'],
        data: [statusCounts.verfügbar, statusCounts.inBenutzung, statusCounts.wartung],
        backgroundColor: ['#34a853', '#1a73e8', '#f9ab00'],
        legendPosition: 'right',
        tooltipFormat: (value, total) => `${value} (${Math.round((value / total) * 100)}%)`
    });
}

function refreshEnvironments(data, charts) {
    // Simuliere das Aktualisieren der Umgebungsdaten
    data.environments.forEach(env => {
        env.last_updated = new Date().toISOString();
        if (Math.random() > 0.7) {
            env.status = env.status === 'verfügbar' ? 'in Benutzung' : 
                         env.status === 'in Benutzung' ? 'verfügbar' : 'Wartung';
        }
    });
    
    updateEnvironmentsTable(data);
    updateEnvironmentChart(data, charts);
    alert('Umgebungsdaten aktualisiert!');
}

function reserveEnvironment(data) {
    const envName = document.getElementById('environment-name').value;
    const userName = document.getElementById('environment-user').value;
    const duration = document.getElementById('environment-duration').value;

    if (!envName || !userName || !duration) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus');
        return;
    }

    const environment = data.environments.find(e => e.name === envName);
    if (environment) {
        environment.status = 'in Benutzung';
        environment.user = userName;
        environment.reserved_until = new Date(Date.now() + duration * 3600000).toISOString();
        
        updateEnvironmentsTable(data);
        alert(`Umgebung ${envName} für ${userName} reserviert!`);
    } else {
        alert('Umgebung nicht gefunden!');
    }
}