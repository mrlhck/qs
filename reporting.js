import { renderTable } from './utils.js';
import { createChart } from './charts.js';

export function initReportingPage(data, charts) {
    updateReportingMetrics(data, charts);
    document.getElementById('generate-full-report')?.addEventListener('click', () => generateFullReport(data));
    document.getElementById('generate-summary-report')?.addEventListener('click', () => generateSummaryReport(data));
}

function updateReportingMetrics(data, charts) {
    const passRateEl = document.getElementById('pass-rate');
    const passedTestsEl = document.getElementById('passed-tests');
    const failedTestsEl = document.getElementById('failed-tests');
    
    if (!passRateEl || !passedTestsEl || !failedTestsEl) {
        console.warn('One or more metric elements (pass-rate, passed-tests, failed-tests) not found');
        return;
    }

    const weekly = data.tests.filter(t => new Date(t.timestamp) >= new Date(Date.now() - 7 * 86400000));
    const totalTests = weekly.length;
    const passedTests = weekly.filter(t => t.status === 'passed').length;
    const passRate = totalTests ? (passedTests / totalTests * 100) : 0;

    passRateEl.textContent = `${passRate.toFixed(1)}%`;
    passedTestsEl.textContent = passedTests;
    failedTestsEl.textContent = totalTests - passedTests;

    const distributionCtx = document.getElementById('test-distribution-chart')?.getContext('2d');
    if (distributionCtx) {
        if (charts['test-distribution-chart']) charts['test-distribution-chart'].destroy();
        const languages = [...new Set(data.tests.map(t => t.language))];
        const testCounts = languages.map(lang => data.tests.filter(t => t.language === lang).length);
        charts['test-distribution-chart'] = createChart(distributionCtx, 'doughnut', {
            labels: languages,
            data: testCounts,
            backgroundColor: ['#1a73e8', '#34a853', '#f9ab00', '#ea4335', '#9aa0a6'],
            legendPosition: 'right'
        });
    } else {
        console.warn('Test distribution chart canvas not found');
    }

    // Zusätzliches Diagramm für Test-Erfolgsrate
    const successCtx = document.getElementById('test-success-chart')?.getContext('2d');
    if (successCtx) {
        if (charts['test-success-chart']) charts['test-success-chart'].destroy();
        charts['test-success-chart'] = createChart(successCtx, 'bar', {
            labels: ['Bestanden', 'Fehlgeschlagen'],
            data: [passedTests, totalTests - passedTests],
            backgroundColor: ['#34a853', '#ea4335'],
            label: 'Test Ergebnisse',
            yAxis: { min: 0, tickFormat: value => `${value}` }
        });
    } else {
        console.warn('Test success chart canvas not found');
    }

    updateCapaTable(data);
}

function updateCapaTable(data) {
    if (!document.getElementById('capa-table')) {
        console.warn('CAPA table not found');
        return;
    }
    
    renderTable('capa-table', ['Priorität', 'Titel', 'Verantwortlich', 'Fällig am', 'Status'], data.correctiveActions.slice(0, 5), capa => `
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

function generateFullReport(data) {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        alert('PDF-Bibliothek nicht geladen!');
        return;
    }

    const doc = new jsPDF();
    const primaryColor = [26, 115, 232];
    
    // Google-ähnlicher Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 220, 30, 'F');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('Qualitätsbericht', 105, 18, { align: 'center' });
    
    // Untertitel
    doc.setFontSize(12);
    doc.text(`Generiert am: ${new Date().toLocaleDateString('de-DE')}`, 15, 40);
    
    // Teststatistik-Sektion
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text('Teststatistik', 15, 55);
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, 57, 60, 57);
    
    // Testkennzahlen
    const weekly = data.tests.filter(t => new Date(t.timestamp) >= new Date(Date.now() - 7 * 86400000));
    const totalTests = weekly.length;
    const passedTests = weekly.filter(t => t.status === 'passed').length;
    const passRate = totalTests ? (passedTests / totalTests * 100) : 0;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Gesamte Tests: ${totalTests}`, 15, 65);
    doc.text(`Bestanden: ${passedTests}`, 15, 70);
    doc.text(`Fehlgeschlagen: ${totalTests - passedTests}`, 15, 75);
    doc.text(`Erfolgsrate: ${passRate.toFixed(1)}%`, 15, 80);
    
    // CAPA-Maßnahmen
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text('Top CAPA-Maßnahmen', 15, 95);
    doc.line(15, 97, 70, 97);
    
    let yPos = 105;
    data.correctiveActions.slice(0, 5).forEach((capa, i) => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${i+1}. ${capa.title}`, 15, yPos);
        doc.text(`Verantwortlich: ${capa.responsible}`, 20, yPos + 5);
        doc.text(`Fällig: ${new Date(capa.due_date).toLocaleDateString('de-DE')}`, 20, yPos + 10);
        doc.text(`Status: ${capa.status === 'open' ? 'Offen' : capa.status === 'in_progress' ? 'In Bearbeitung' : 'Geschlossen'}`, 20, yPos + 15);
        yPos += 25;
    });
    
    // Diagramme einfügen
    const charts = ['test-distribution-chart', 'test-success-chart'];
    
    charts.forEach((chartId, index) => {
        const canvas = document.getElementById(chartId);
        if (canvas) {
            doc.addPage();
            doc.setFontSize(16);
            doc.setTextColor(...primaryColor);
            doc.text(chartId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Diagramm', 105, 15, { align: 'center' });
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 15, 25, 180, 120);
        } else {
            console.warn(`Chart with ID '${chartId}' not found`);
        }
    });
    
    // Fußzeile
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Generiert mit QualitätsCockpit', 15, doc.internal.pageSize.height - 10);
    
    doc.save('qualitaetsbericht_vollstaendig.pdf');
}

function generateSummaryReport(data) {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        alert('PDF-Bibliothek nicht geladen!');
        return;
    }

    const doc = new jsPDF();
    doc.setFillColor(26, 115, 232);
    doc.rect(0, 0, 220, 20, 'F');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('Qualitätszusammenfassung', 10, 15);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Datum: ${new Date().toLocaleDateString('de-DE')}`, 160, 15);

    doc.setFontSize(16);
    doc.text('Kernkennzahlen', 10, 30);
    doc.setDrawColor(26, 115, 232);
    doc.setLineWidth(0.5);
    doc.line(10, 32, 80, 32);

    const weekly = data.tests.filter(t => new Date(t.timestamp) >= new Date(Date.now() - 7 * 86400000));
    const totalTests = weekly.length;
    const passedTests = weekly.filter(t => t.status === 'passed').length;
    const passRate = totalTests ? (passedTests / totalTests * 100) : 0;

    doc.setFontSize(12);
    doc.text(`Wöchentliche Erfolgsrate: ${passRate.toFixed(1)}%`, 10, 40);
    doc.text(`Offene CAPAs: ${data.correctiveActions.filter(c => c.status !== 'closed').length}`, 10, 50);

    const canvas = document.getElementById('test-success-chart');
    if (canvas) {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, 60, 180, 120);
    } else {
        console.warn('Test success chart canvas not found for summary report');
    }

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Generiert mit QualitätsCockpit', 10, doc.internal.pageSize.height - 10);
    doc.save('qualitaetszusammenfassung.pdf');
}