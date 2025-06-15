import { renderTable } from './utils.js';

export function initTestPlanPage(data) {
    // Daten für Testpläne sicherstellen
    if (!data.testplans) {
        data.testplans = [];
    }
    
    populateTestPlanForm(data);
    updateTestPlansTable(data);
    document.getElementById('save-testplan')?.addEventListener('click', () => saveTestPlan(data));
}

function populateTestPlanForm(data) {
    const responsibleSelect = document.getElementById('test-responsible');
    if (!responsibleSelect) return;
    
    // Teamdaten sicherstellen
    if (!data.team || data.team.length === 0) {
        console.warn('No team data available');
        return;
    }
    
    responsibleSelect.innerHTML = data.team.map(member => 
        `<option value="${member.name}">${member.name}</option>`
    ).join('');
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

    // Testpläne Array sicherstellen
    if (!data.testplans) {
        data.testplans = [];
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

    // Formular zurücksetzen
    document.getElementById('test-type').value = '';
    document.getElementById('test-frequency').value = '';
    document.getElementById('test-responsible').value = '';
    document.getElementById('test-scope').value = '';

    updateTestPlansTable(data);
}

function updateTestPlansTable(data) {
    if (!document.getElementById('testplans-table')) return;
    
    // Sicherstellen, dass Testpläne vorhanden sind
    if (!data.testplans || data.testplans.length === 0) {
        console.warn('No test plans available');
        return;
    }
    
    renderTable('testplans-table', 
        ['ID', 'Typ', 'Frequenz', 'Verantwortlich', 'Erstellt am', 'Aktionen'], 
        data.testplans, 
        plan => `
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
        `
    );
}

// Globale Funktionen für Button-Aktionen
window.viewTestPlan = function(id) {
    const plan = window.qualityData.testplans.find(p => p.id === id);
    if (plan) {
        document.getElementById('test-type').value = plan.type;
        document.getElementById('test-frequency').value = plan.frequency;
        document.getElementById('test-responsible').value = plan.responsible;
        document.getElementById('test-scope').value = plan.scope;
        alert(`Testplan ${id} geladen!`);
    }
};

window.deleteTestPlan = function(id) {
    window.qualityData.testplans = window.qualityData.testplans.filter(p => p.id !== id);
    const testplansTable = document.getElementById('testplans-table');
    if (testplansTable) {
        updateTestPlansTable(window.qualityData);
    }
    alert(`Testplan ${id} wurde gelöscht!`);
};