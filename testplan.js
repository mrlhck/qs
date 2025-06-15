import { renderTable } from './utils.js';

export function initTestPlanPage(data) {
    populateTestPlanForm(data);
    updateTestPlansTable(data);
    document.getElementById('save-testplan')?.addEventListener('click', () => saveTestPlan(data));
}

function populateTestPlanForm(data) {
    const responsibleSelect = document.getElementById('test-responsible');
    if (!responsibleSelect) return;
    responsibleSelect.innerHTML = data.team.map(member => `<option value="${member.name}">${member.name}</option>`).join('');
}

function saveTestPlan(data) {
    const testType = document.getElementById('test-type').value;
    const frequency = document.getElementById('test-frequency').value;
    const responsible = document.getElementById('test-responsible').value;
    const scope = document.getElementById('test-scope').value;

    if (!testType || !frequency || !responsible) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus');
        return;
    }

    data.testplans.push({
        id: data.testplans.length + 1,
        type: testType,
        frequency: frequency,
        responsible: responsible,
        scope: scope,
        created_at: new Date().toISOString()
    });

    document.getElementById('testplan-success').classList.remove('hidden');
    setTimeout(() => document.getElementById('testplan-success').classList.add('hidden'), 3000);

    document.getElementById('test-type').value = '';
    document.getElementById('test-frequency').value = '';
    document.getElementById('test-responsible').value = '';
    document.getElementById('test-scope').value = '';

    updateTestPlansTable(data);
}

function updateTestPlansTable(data) {
    if (!document.getElementById('testplans-table')) return;
    
    renderTable('testplans-table', ['ID', 'Typ', 'Frequenz', 'Verantwortlich', 'Erstellt am', 'Aktionen'], data.testplans, plan => `
        <tr>
            <td>${plan.id}</td>
            <td>${plan.type}</td>
            <td>${plan.frequency}</td>
            <td>${plan.responsible}</td>
            <td>${new Date(plan.created_at).toLocaleDateString('de-DE')}</td>
            <td class="flex space-x-2">
                <button class="text-blue-600 hover:underline" onclick="viewTestPlan(${plan.id})">Ansehen</button>
                <button class="text-red-600 hover:underline" onclick="deleteTestPlan(${plan.id})">Löschen</button>
            </td>
        </tr>
    `);
}

// Globale Funktionen für Button-Aktionen
window.viewTestPlan = function(id) {
    const plan = data.testplans.find(p => p.id === id);
    if (plan) {
        document.getElementById('test-type').value = plan.type;
        document.getElementById('test-frequency').value = plan.frequency;
        document.getElementById('test-responsible').value = plan.responsible;
        document.getElementById('test-scope').value = plan.scope;
        alert(`Testplan ${id} geladen!`);
    }
};

window.deleteTestPlan = function(id) {
    data.testplans = data.testplans.filter(p => p.id !== id);
    updateTestPlansTable(data);
    alert(`Testplan ${id} wurde gelöscht!`);
};