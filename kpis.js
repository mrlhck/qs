import { createChart } from './charts.js';

// Globale Funktion für Chart-Update verfügbar machen
window.updateKpiCharts = function(data, charts) {
    console.log('Updating KPI charts with data:', data.kpis, data.legacyModules);
    
    // Build-Erfolgsrate
    const buildCtx = document.getElementById('kpi-build-chart')?.getContext('2d');
    if (buildCtx) {
        if (charts['kpi-build-chart']) {
            charts['kpi-build-chart'].destroy();
        }
        
        // Daten für die letzten 7 Tage
        const recentData = data.kpis.slice(0, 7).reverse();
        const labels = recentData.map(k => new Date(k.timestamp).toLocaleDateString('de-DE', { 
            day: '2-digit', 
            month: '2-digit' 
        }));
        
        charts['kpi-build-chart'] = createChart(buildCtx, 'line', {
            labels: labels,
            data: recentData.map(k => k.build_success),
            backgroundColor: 'rgba(52, 168, 83, 0.1)',
            borderColor: '#34a853',
            borderWidth: 2,
            label: 'Build-Erfolgsrate (%)',
            yAxis: { 
                min: 70, 
                max: 100, 
                tickFormat: value => `${value}%`,
                title: 'Erfolgsrate'
            },
            fill: true,
            tension: 0.3
        });
    }

    // Testabdeckung nach Modul
    const coverageCtx = document.getElementById('kpi-coverage-chart')?.getContext('2d');
    if (coverageCtx) {
        if (charts['kpi-coverage-chart']) {
            charts['kpi-coverage-chart'].destroy();
        }
        
        if (!data.legacyModules || data.legacyModules.length === 0) {
            console.warn('No legacy modules available for coverage chart');
            return;
        }
        
        charts['kpi-coverage-chart'] = createChart(coverageCtx, 'bar', {
            labels: data.legacyModules.map(m => m.name),
            data: data.legacyModules.map(m => m.coverage),
            backgroundColor: '#1a73e8',
            label: 'Testabdeckung (%)',
            yAxis: { 
                min: 0, 
                max: 100, 
                tickFormat: value => `${value}%`,
                title: 'Abdeckung'
            }
        });
    }

    // Fehlerdichte
    const defectCtx = document.getElementById('kpi-defect-density-chart')?.getContext('2d');
    if (defectCtx) {
        if (charts['kpi-defect-density-chart']) {
            charts['kpi-defect-density-chart'].destroy();
        }
        
        // Monatliche Daten
        const monthlyData = [
            { month: 'Jan', value: 0.35 },
            { month: 'Feb', value: 0.28 },
            { month: 'Mär', value: 0.22 },
            { month: 'Apr', value: 0.18 },
            { month: 'Mai', value: 0.15 },
            { month: 'Jun', value: 0.12 }
        ];
        
        charts['kpi-defect-density-chart'] = createChart(defectCtx, 'line', {
            labels: monthlyData.map(d => d.month),
            data: monthlyData.map(d => d.value),
            backgroundColor: 'rgba(234, 67, 53, 0.1)',
            borderColor: '#ea4335',
            borderWidth: 2,
            label: 'Fehler/1000 Zeilen',
            yAxis: { 
                min: 0, 
                max: 0.5, 
                tickFormat: value => value.toFixed(2),
                title: 'Fehlerdichte'
            }
        });
    }

    // Wartungsmetriken
    const maintCtx = document.getElementById('kpi-maintainability-chart')?.getContext('2d');
    if (maintCtx) {
        if (charts['kpi-maintainability-chart']) {
            charts['kpi-maintainability-chart'].destroy();
        }
        
        if (!data.legacyModules || data.legacyModules.length === 0) {
            console.warn('No legacy modules available for maintainability chart');
            return;
        }
        
        const metrics = data.legacyModules.map(m => ({
            name: m.name,
            complexity: m.complexity,
            coverage: m.coverage,
            maintainability: m.maintainability
        }));
        
        // Umwandlung für Radar-Diagramm
        const datasets = [
            {
                label: 'Komplexität (1-10)',
                data: metrics.map(m => m.complexity),
                backgroundColor: 'rgba(26, 115, 232, 0.2)',
                borderColor: '#1a73e8'
            },
            {
                label: 'Testabdeckung (%)',
                data: metrics.map(m => m.coverage),
                backgroundColor: 'rgba(52, 168, 83, 0.2)',
                borderColor: '#34a853'
            },
            {
                label: 'Wartbarkeit (%)',
                data: metrics.map(m => m.maintainability),
                backgroundColor: 'rgba(249, 171, 0, 0.2)',
                borderColor: '#f9ab00'
            }
        ];
        
        charts['kpi-maintainability-chart'] = new Chart(maintCtx, {
            type: 'radar',
            data: {
                labels: metrics.map(m => m.name),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}`;
                            }
                        }
                    }
                }
            }
        });
    }
};

export function initKpisPage(data, charts) {
    // Historische KPI-Daten generieren, falls nicht vorhanden
    if (!data.kpis || data.kpis.length === 0) {
        console.log('Generating KPIs data');
        data.kpis = generateKpisData();
    }
    
    // Verzögerte Chart-Initialisierung
    setTimeout(() => {
        updateKpiCharts(data, charts);
    }, 300);
}

function generateKpisData() {
    const kpis = [];
    const now = new Date();
    
    for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        
        kpis.push({
            build_success: 80 + Math.floor(Math.random() * 15), // 80-95%
            test_coverage: 65 + Math.floor(Math.random() * 30), // 65-95%
            defect_density: (Math.random() * 0.5).toFixed(2), // 0.0-0.5
            maintainability: 60 + Math.floor(Math.random() * 35), // 60-95%
            timestamp: date.toISOString()
        });
    }
    
    return kpis;
}