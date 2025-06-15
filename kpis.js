import { createChart } from './charts.js';

export function initKpisPage(data, charts) {
    updateKpiChart(data, charts);
}

function updateKpiChart(data, charts) {
    const ctx = document.getElementById('kpi-chart')?.getContext('2d');
    if (!ctx) return;

    if (charts['kpi-chart']) charts['kpi-chart'].destroy();

    if (data.kpis.length === 0) {
        for (let i = 0; i < 10; i++) {
            data.kpis.push({
                name: "Build-Erfolgsrate",
                value: 80 + Math.random() * 15,
                unit: "%",
                timestamp: new Date(Date.now() - i * 86400000).toISOString()
            });
        }
    }

    charts['kpi-chart'] = createChart(ctx, 'line', {
        labels: data.kpis.map(k => new Date(k.timestamp).toLocaleDateString('de-DE')),
        data: data.kpis.map(k => k.value),
        backgroundColor: 'rgba(26, 115, 232, 0.1)',
        borderColor: '#1a73e8',
        label: 'Build-Erfolgsrate (%)',
        yAxis: { min: 70, max: 100, tickFormat: value => `${value}%` },
        fill: true,
        tension: 0.3
    });
}