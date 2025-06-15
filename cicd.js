import { renderTable } from './utils.js';

export function initCiCdPage(data) {
    document.getElementById('test-ci-connection')?.addEventListener('click', () => testCIConnection(data));
}

function testCIConnection(data) {
    const statusDiv = document.getElementById('ci-status');
    if (!statusDiv) return;

    statusDiv.textContent = "Verbindung wird hergestellt...";
    statusDiv.classList.remove('hidden');

    setTimeout(() => {
        statusDiv.innerHTML = `
            <div class="flex items-center text-green-600">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Erfolgreich verbunden mit Jenkins!
            </div>
            <p class="mt-2">Letzter Build: #42 - Erfolg (Dauer: 12min)</p>
        `;

        renderTable('ci-builds', ['Build #', 'Status', 'Datum', 'Dauer', 'Tests'], generateBuildData(), build => `
            <tr>
                <td>${build.number}</td>
                <td><span class="text-${build.status === 'Erfolg' ? 'green' : 'red'}-600">${build.status}</span></td>
                <td>${build.date}</td>
                <td>${build.duration}</td>
                <td>${build.tests}</td>
            </tr>
        `);
    }, 1500);
}

function generateBuildData() {
    const builds = [];
    for (let i = 42; i > 37; i--) {
        builds.push({
            number: `#${i}`,
            status: i % 3 ? 'Erfolg' : 'Fehler',
            date: new Date(Date.now() - (42 - i) * 3600000).toLocaleString('de-DE'),
            duration: `${Math.floor(Math.random() * 10) + 5} min`,
            tests: `${Math.floor(Math.random() * 20) + 80} Tests`
        });
    }
    return builds;
}