import { renderTable } from './utils.js';
import { createChart } from './charts.js';

export function initAuditsPage(data, charts) {
    populateAuditForm(data);
    populateFindingForm(data);
    updateAuditsTable(data);

    const scheduleBtn = document.getElementById('schedule-audit');
    const addFindingBtn = document.getElementById('add-finding');

    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', () => scheduleAudit(data));
    } else {
        console.warn('Schedule audit button not found');
    }

    if (addFindingBtn) {
        addFindingBtn.addEventListener('click', () => addFinding(data));
    } else {
        console.warn('Add finding button not found');
    }
}

function populateAuditForm(data) {
    const responsibleSelect = document.getElementById('audit-responsible');
    if (!responsibleSelect) {
        console.warn('Audit responsible select not found');
        return;
    }
    responsibleSelect.innerHTML = data.team.map(member => `<option value="${member.name}">${member.name}</option>`).join('');
}

function populateFindingForm(data) {
    const auditSelect = document.getElementById('audit-for-finding');
    if (!auditSelect) {
        console.warn('Audit for finding select not found');
        return;
    }
    auditSelect.innerHTML = data.audits.map(audit => `<option value="${audit.id}">${audit.title}</option>`).join('');
}

function scheduleAudit(data) {
    const title = document.getElementById('audit-title')?.value;
    const type = document.getElementById('audit-type')?.value;
    const date = document.getElementById('audit-date')?.value;
    const responsible = document.getElementById('audit-responsible')?.value;
    const scope = document.getElementById('audit-scope')?.value;

    if (!title || !type || !date || !responsible || !scope) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus');
        return;
    }

    data.audits.push({
        id: data.audits.length + 1,
        title,
        type,
        date,
        responsible,
        scope,
        findings: [],
        status: 'planned'
    });

    alert(`Audit '${title}' geplant!`);
    populateFindingForm(data);
    updateAuditsTable(data);

    document.getElementById('audit-title').value = '';
    document.getElementById('audit-date').value = '';
    document.getElementById('audit-scope').value = '';
}

function addFinding(data) {
    const auditId = parseInt(document.getElementById('audit-for-finding')?.value);
    const description = document.getElementById('finding-description')?.value;
    const severity = document.getElementById('finding-severity')?.value;

    if (!auditId || !description || !severity) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus');
        return;
    }

    const audit = data.audits.find(a => a.id === auditId);
    if (audit) {
        audit.findings.push({
            description,
            severity,
            created_at: new Date().toISOString()
        });
        alert('Befund hinzugefügt!');
        updateAuditsTable(data);
        document.getElementById('finding-description').value = '';
    } else {
        console.warn(`Audit with ID ${auditId} not found`);
    }
}

function updateAuditsTable(data) {
    if (!document.getElementById('audits-table')) {
        console.warn('Audits table not found');
        return;
    }

    renderTable('audits-table', ['ID', 'Titel', 'Typ', 'Datum', 'Verantwortlich', 'Status', 'Befunde'], data.audits, audit => `
        <tr>
            <td class="px-4 py-2">${audit.id}</td>
            <td class="px-4 py-2">${audit.title}</td>
            <td class="px-4 py-2">${audit.type}</td>
            <td class="px-4 py-2">${new Date(audit.date).toLocaleDateString('de-DE')}</td>
            <td class="px-4 py-2">${audit.responsible}</td>
            <td class="px-4 py-2"><span class="status-badge ${
                audit.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                audit.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            } px-2 py-1 rounded-full text-xs">${audit.status}</span></td>
            <td class="px-4 py-2">${audit.findings.length}</td>
        </tr>
    `);
}