import { renderTable } from './utils.js';
import { createChart } from './charts.js';

export function initHomePage(data, charts) {
    populateTeamTable(data);
    populateTrainingForm(data);
    renderTestTable(data);
    updateTrainingChart(data, charts);

    const toggleBtn = document.getElementById('toggle-training-form');
    const assignBtn = document.getElementById('assign-training');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTrainingForm);
    } else {
        console.warn('Toggle training form button not found');
    }

    if (assignBtn) {
        assignBtn.addEventListener('click', () => assignTraining(data, charts));
    } else {
        console.warn('Assign training button not found');
    }
}

function populateTeamTable(data) {
    if (!document.getElementById('team-table')) {
        console.warn('Team table not found');
        return;
    }
    
    renderTable('team-table', ['Name', 'Verantwortlichkeit', 'Status', 'Fortschritt'], data.team, member => `
        <tr>
            <td class="px-4 py-2 font-medium">${member.name}</td>
            <td class="px-4 py-2">${member.responsibility}</td>
            <td class="px-4 py-2">
                <span class="status-badge ${member.status === 'Aktiv' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} px-2 py-1 rounded-full text-xs">
                    ${member.status}
                </span>
            </td>
            <td class="px-4 py-2">
                <div class="flex items-center">
                    <div class="progress-bar w-full mr-2 bg-gray-200 rounded-full h-2.5">
                        <div class="progress-bar-fill ${member.training_progress > 70 ? 'bg-green-500' : member.training_progress > 40 ? 'bg-yellow-500' : 'bg-red-500'} h-2.5 rounded-full" style="width: ${member.training_progress}%"></div>
                    </div>
                    <span>${member.training_progress}%</span>
                </div>
            </td>
        </tr>
    `);
}

function populateTrainingForm(data) {
    const select = document.getElementById('training-member');
    if (!select) {
        console.warn('Training member select element not found');
        return;
    }
    select.innerHTML = data.team.map(member => `<option value="${member.name}">${member.name}</option>`).join('');
}

function toggleTrainingForm() {
    const form = document.getElementById('training-form');
    if (!form) {
        console.warn('Training form not found');
        return;
    }
    form.classList.toggle('hidden');
}

function assignTraining(data, charts) {
    const member = document.getElementById('training-member')?.value;
    const topic = document.getElementById('training-topic')?.value;
    const start = document.getElementById('training-start')?.value;
    const end = document.getElementById('training-end')?.value;
    const certification = document.getElementById('certification')?.checked;

    if (!member || !topic || !start || !end) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus');
        return;
    }

    data.trainings.push({ member, topic, start, end, certification, completed: false });
    const teamMember = data.team.find(m => m.name === member);
    if (teamMember) {
        teamMember.training_progress = Math.min(teamMember.training_progress + 25, 100);
    }

    alert(`Schulung '${topic}' für ${member} geplant!`);
    populateTeamTable(data);
    updateTrainingChart(data, charts);
}

function renderTestTable(data) {
    if (!document.getElementById('test-table')) {
        console.warn('Test table not found');
        return;
    }
    
    const passed = data.tests.filter(t => t.status === 'passed').length;
    const failed = data.tests.filter(t => t.status === 'failed').length;
    const passRate = passed + failed > 0 ? Math.round((passed / (passed + failed)) * 100) : 0;
    
    renderTable('test-table', ['Sprache', 'Testname', 'Status', 'Zeitpunkt'], data.tests, test => `
        <tr>
            <td class="px-4 py-2"><span class="lang-badge bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">${test.language}</span></td>
            <td class="px-4 py-2">${test.test_name}</td>
            <td class="px-4 py-2">
                <span class="status-badge ${test.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-1 rounded-full text-xs">
                    ${test.status === 'passed' ? 'Bestanden' : 'Fehlgeschlagen'}
                </span>
            </td>
            <td class="px-4 py-2">${new Date(test.timestamp).toLocaleString('de-DE')}</td>
        </tr>
    `);
    
    const testSummary = document.getElementById('test-summary');
    if (testSummary) {
        testSummary.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <span>Gesamterfolgsrate:</span>
                <span class="font-bold ${passRate > 90 ? 'text-green-600' : passRate > 75 ? 'text-yellow-600' : 'text-red-600'}">
                    ${passRate}%
                </span>
            </div>
            <div class="flex">
                <div class="flex-1 text-center p-2 bg-green-100 border-r border-white">
                    <div class="text-lg font-bold">${passed}</div>
                    <div class="text-sm">Bestanden</div>
                </div>
                <div class="flex-1 text-center p-2 bg-red-100">
                    <div class="text-lg font-bold">${failed}</div>
                    <div class="text-sm">Fehlgeschlagen</div>
                </div>
            </div>
        `;
    } else {
        console.warn('Test summary element not found');
    }
}

function updateTrainingChart(data, charts) {
    const ctx = document.getElementById('training-chart')?.getContext('2d');
    if (!ctx) {
        console.warn('Training chart canvas not found');
        return;
    }

    if (charts['training-chart']) {
        charts['training-chart'].destroy();
    }

    charts['training-chart'] = createChart(ctx, 'bar', {
        labels: data.team.map(t => t.name),
        data: data.team.map(t => t.training_progress),
        backgroundColor: '#1a73e8',
        label: 'Schulungsfortschritt (%)',
        yAxis: { min: 0, max: 100, tickFormat: value => `${value}%` }
    });
}