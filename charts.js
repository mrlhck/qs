export function createChart(ctx, type, config) {
    const scales = {};
    if (config.yAxis) {
        scales.y = {
            beginAtZero: true,
            min: config.yAxis.min || 0,
            max: config.yAxis.max,
            ticks: {
                callback: config.yAxis.tickFormat || (value => value)
            },
            title: {
                display: !!config.yAxis.title,
                text: config.yAxis.title || ''
            }
        };
    }
    if (config.xAxis) {
        scales.x = {
            title: {
                display: !!config.xAxis.title,
                text: config.xAxis.title || ''
            }
        };
    }

    return new Chart(ctx, {
        type: type,
        data: {
            labels: config.labels,
            datasets: [{
                label: config.label || '',
                data: config.data,
                backgroundColor: config.backgroundColor,
                borderColor: config.borderColor || config.backgroundColor,
                borderWidth: config.borderWidth || 1,
                fill: config.fill || false,
                tension: config.tension || 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: !!config.legendPosition,
                    position: config.legendPosition || 'top'
                },
                tooltip: {
                    callbacks: {
                        label: context => {
                            if (config.tooltipFormat) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                return config.tooltipFormat(context.raw, total);
                            }
                            return `${context.dataset.label}: ${context.raw}${config.unit || ''}`;
                        }
                    }
                }
            },
            scales: Object.keys(scales).length ? scales : undefined
        }
    });
}