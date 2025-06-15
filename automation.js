import { renderTable } from './utils.js';
import { createChart } from './charts.js';

export function initAutomationPage(data, charts) {
    document.getElementById('add-automated-test')?.addEventListener('click', () => addAutomatedTest(data, charts));
    document.getElementById('run-automated-tests')?.addEventListener('click', () => runAutomatedTests(data, charts));
}

function addAutomatedTest(data, charts) {
    const language = document.getElementById('auto-language').value;
    const testName = document.getElementById('auto-testname').value;
    const status = document.getElementById('auto-status').value;

    if (!language || !testName || !status) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus');
        return;
    }

    data.tests.push({
        language,
        test_name: testName,
        status,
        timestamp: new Date().toISOString()
    });

    updateTestResults(data, charts);
    alert('Test hinzugefügt!');
}

function runAutomatedTests(data, charts) {
    const resultDiv = document.getElementById('automation-result');
    if (!resultDiv) return;

    resultDiv.classList.remove('hidden');
    const duration = Math.floor(Math.random() * 10) + 5;
    const successRate = Math.floor(Math.random() * 30) + 70;

    document.getElementById('test-duration').textContent = duration;
    document.getElementById('test-success-rate').textContent = `${successRate}%`;

    const languages = ['Java', 'C', 'COBOL'];
    for (let i = 0; i < 10; i++) {
        data.tests.push({
            language: languages[Math.floor(Math.random() * languages.length)],
            test_name: `AutoTest_${Math.floor(Math.random() * 1000)}`,
            status: Math.random() > 0.2 ? 'passed' : 'failed',
            timestamp: new Date().toISOString()
        });
    }

    updateTestResults(data, charts);
}

function updateTestResults(data, charts) {
    renderTable('test-table', ['Sprache', 'Testname', 'Status', 'Zeitpunkt'], data.tests, test => `
        <tr>
            <td><span class="lang-badge bg-blue-100 text-blue-800">${test.language}</span></td>
            <td>${test.test_name}</td>
            <td><span class="status-badge ${test.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                ${test.status === 'passed' ? 'Bestanden' : 'Fehlgeschlagen'}
            </span></td>
            <td>${new Date(test.timestamp).toLocaleString('de-DE')}</td>
        </tr>
    `);

    updateTestCharts(data, charts);
}

function updateTestCharts(data, charts) {
    const langCtx = document.getElementById('test-lang-chart')?.getContext('2d');
    if (langCtx) {
        if (charts['test-lang-chart']) charts['test-lang-chart'].destroy();
        const languages = [...new Set(data.tests.map(t => t.language))];
        const testCounts = languages.map(lang => data.tests.filter(t => t.language === lang).length);
        charts['test-lang-chart'] = createChart(langCtx, 'doughnut', {
            labels: languages,
            data: testCounts,
            backgroundColor: ['#1a73e8', '#34a853', '#f9ab00', '#ea4335', '#9aa0a6'],
            legendPosition: 'right'
        });
    }

    const successCtx = document.getElementById('test-success-chart')?.getContext('2d');
    if (successCtx) {
        if (charts['test-success-chart']) charts['test-success-chart'].destroy();
        const passed = data.tests.filter(t => t.status === 'passed').length;
        const failed = data.tests.filter(t => t.status === 'failed').length;
        charts['test-success-chart'] = createChart(successCtx, 'doughnut', {
            labels: ['Bestanden', 'Fehlgeschlagen'],
            data: [passed, failed],
            backgroundColor: ['#34a853', '#ea4335'],
            legendPosition: 'right',
            tooltipFormat: (value, total) => `${value} (${Math.round((value / total) * 100)}%)`
        });
    }
}