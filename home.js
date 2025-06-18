// home.js
import { renderTable } from './utils.js';
import { createChart } from './charts.js';

export function initHomePage(data, charts) {
  // Dashboard-Kennzahlen rendern
  renderDashboardSummary(data);
  
  // Charts und Tabellen initialisieren
  updateTrainingChart(data, charts);
  updateTestChart(data, charts);
  
  // Event-Listener für das Formular
  document.getElementById('toggle-training-form')?.addEventListener('click', toggleTrainingForm);
  document.getElementById('assign-training')?.addEventListener('click', () => assignTraining(data, charts));
  
  // Formular mit Teammitgliedern befüllen
  populateTrainingForm(data);
}

function renderDashboardSummary(data) {
  const teamManager = data.teamManager;
  const tests = data.tests || [];
  
  // Berechnungen
  const totalMembers = teamManager.members.length;
  const activeMembers = teamManager.getActiveMembers().length;
  const avgTraining = teamManager.getAverageTrainingProgress();
  const passedTests = tests.filter(t => t.status === 'passed').length;
  const testPassRate = tests.length ? Math.round((passedTests / tests.length) * 100) : 0;
  
  // HTML für Dashboard-Kennzahlen
  const summaryContainer = document.getElementById('dashboard-summary');
  if (summaryContainer) {
    summaryContainer.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="card text-center p-4">
          <div class="text-3xl font-bold">${totalMembers}</div>
          <div class="text-gray-600">Teammitglieder</div>
        </div>
        
        <div class="card text-center p-4">
          <div class="text-3xl font-bold">${activeMembers}</div>
          <div class="text-gray-600">Aktive Mitglieder</div>
        </div>
        
        <div class="card text-center p-4">
          <div class="text-3xl font-bold">${avgTraining}%</div>
          <div class="text-gray-600">Ø Schulungsfortschritt</div>
        </div>
        
        <div class="card text-center p-4">
          <div class="text-3xl font-bold ${testPassRate > 90 ? 'text-green-600' : testPassRate > 75 ? 'text-yellow-600' : 'text-red-600'}">
            ${testPassRate}%
          </div>
          <div class="text-gray-600">Test-Erfolgsrate</div>
        </div>
      </div>
    `;
  }
}

function updateTrainingChart(data, charts) {
  const ctx = document.getElementById('training-chart')?.getContext('2d');
  if (!ctx) return;

  if (charts['training-chart']) {
    charts['training-chart'].destroy();
  }

  const teamManager = data.teamManager;
  charts['training-chart'] = createChart(ctx, 'bar', {
    labels: teamManager.members.map(t => t.name),
    data: teamManager.members.map(t => t.training_progress),
    backgroundColor: '#1a73e8',
    label: 'Schulungsfortschritt (%)',
    yAxis: { min: 0, max: 100, tickFormat: value => `${value}%` }
  });
}

function updateTestChart(data, charts) {
  const ctx = document.getElementById('test-success-chart')?.getContext('2d');
  if (!ctx) return;

  if (charts['test-success-chart']) {
    charts['test-success-chart'].destroy();
  }

  const passed = data.tests.filter(t => t.status === 'passed').length;
  const failed = data.tests.filter(t => t.status === 'failed').length;
  
  charts['test-success-chart'] = createChart(ctx, 'doughnut', {
    labels: ['Bestanden', 'Fehlgeschlagen'],
    data: [passed, failed],
    backgroundColor: ['#34a853', '#ea4335'],
    legendPosition: 'right'
  });
}

function populateTrainingForm(data) {
  const select = document.getElementById('training-member');
  if (!select) return;
  
  select.innerHTML = data.teamManager.members.map(member => 
    `<option value="${member.name}">${member.name}</option>`
  ).join('');
}

function toggleTrainingForm() {
  const form = document.getElementById('training-form');
  if (!form) return;
  form.classList.toggle('hidden');
}

function assignTraining(data, charts) {
  const memberName = document.getElementById('training-member')?.value;
  const topic = document.getElementById('training-topic')?.value;
  const start = document.getElementById('training-start')?.value;
  const end = document.getElementById('training-end')?.value;
  const certification = document.getElementById('certification')?.checked;

  if (!memberName || !topic || !start || !end) {
    alert('Bitte füllen Sie alle erforderlichen Felder aus');
    return;
  }

  const teamManager = data.teamManager;
  if (!data.trainings) {
    data.trainings = [];
  }
  
  data.trainings.push({ 
    member: memberName, 
    topic, 
    start, 
    end, 
    certification, 
    completed: false,
    status: "Geplant"
  });
  
  const member = teamManager.getMember(memberName);
  if (member) {
    member.training_progress = Math.min(member.training_progress + 25, 100);
    teamManager.updateMember(memberName, { training_progress: member.training_progress });
  }

  alert(`Schulung '${topic}' für ${memberName} geplant!`);
  renderDashboardSummary(data);
  updateTrainingChart(data, charts);
}