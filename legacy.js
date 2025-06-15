import { createChart } from './charts.js';

export function initLegacyPage(data, charts) {
    initLegacyAnalysis(data);
    document.getElementById('legacy-module-select')?.addEventListener('change', () => updateLegacyModuleDetails(data));
    document.getElementById('analyze-legacy')?.addEventListener('click', () => analyzeLegacy(data, charts));
}

function initLegacyAnalysis(data) {
    const moduleSelect = document.getElementById('legacy-module-select');
    if (!moduleSelect) return;
    moduleSelect.innerHTML = data.legacyModules.map(module => `<option value="${module.name}">${module.name} (${module.language})</option>`).join('');
    updateLegacyModuleDetails(data);
}

function updateLegacyModuleDetails(data) {
    const moduleSelect = document.getElementById('legacy-module-select');
    if (!moduleSelect) return;
    const module = data.legacyModules.find(m => m.name === moduleSelect.value);
    if (!module) return;

    document.getElementById('complexity-value').textContent = `${module.complexity}/10`;
    document.getElementById('complexity-bar').className = `progress-bar-fill complexity-${module.complexity * 10}`;
    document.getElementById('coverage-value').textContent = `${module.coverage}%`;
    document.getElementById('coverage-bar').className = `progress-bar-fill coverage-${module.coverage}`;
    document.getElementById('debt-value').textContent = `${module.debt} Tage`;
    document.getElementById('debt-bar').className = `progress-bar-fill coverage-${Math.min(module.debt / 2, 100)}`;
    document.getElementById('maintainability-value').textContent = module.maintainability > 70 ? 'Hoch' : module.maintainability > 40 ? 'Mittel' : 'Niedrig';
    document.getElementById('maintainability-bar').className = `progress-bar-fill coverage-${module.maintainability}`;
}

function analyzeLegacy(data, charts) {
    const resultDiv = document.getElementById('legacy-analysis-result');
    if (!resultDiv) return;

    resultDiv.innerHTML = `<div class="flex justify-center py-8"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>`;

    setTimeout(() => {
        resultDiv.innerHTML = `
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 class="font-bold text-blue-700 mb-2">1. Refactoring-Prioritäten</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Isoliere Business-Logik von Legacy-Code</li>
                    <li>Ersetze GOTO-Anweisungen durch strukturierte Kontrollflüsse</li>
                    <li>Führe automatische Boundary-Tests ein</li>
                    <li>Dokumentiere Schnittstellen für zukünftige Refactorings</li>
                </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h4 class="font-bold text-green-700 mb-2">2. Teststrategie</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Erstelle golden master Tests für Kernfunktionalitäten</li>
                    <li>Implementiere charakterisierende Tests für kritische Pfade</li>
                    <li>Führe Mutationstests für Sicherheitskritische Module ein</li>
                    <li>Automatisiere Regressionstests für Schlüsselfunktionen</li>
                </ul>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <h4 class="font-bold text-yellow-700 mb-2">3. Migrationsplan</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Schrittweise Migration zu Microservices-Architektur</li>
                    <li>Containerisierung mit Docker für Testumgebungen</li>
                    <li>API-Wrapper für schrittweisen Ersatz</li>
                    <li>Priorisierung nach Geschäftswert und Risiko</li>
                </ul>
            </div>
        `;
        updateLegacyCharts(data, charts);
    }, 1500);
}

function updateLegacyCharts(data, charts) {
    const coverageCtx = document.getElementById('coverage-chart')?.getContext('2d');
    if (coverageCtx) {
        if (charts['coverage-chart']) charts['coverage-chart'].destroy();
        charts['coverage-chart'] = createChart(coverageCtx, 'bar', {
            labels: data.legacyModules.map(m => m.name),
            data: data.legacyModules.map(m => m.coverage),
            backgroundColor: '#1a73e8',
            label: 'Testabdeckung (%)',
            yAxis: { min: 0, max: 100, tickFormat: value => `${value}%` }
        });
    }
}