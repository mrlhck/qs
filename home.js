import { renderTable } from './utils.js';

export function initHomePage(data, charts) {
  // Render Manifest first with animations
  renderManifestSection(data);
  
  // Then render the rest of the dashboard
  renderDashboardSummary(data);
  renderTestTrendChart(data, charts);
  renderQualityRadarChart(data, charts);
  renderCriticalCapas(data);
  renderBuildSuccessChart(data, charts);
  
  initAccordion();
  
  const toggleAllBtn = document.getElementById('toggle-all-accordions');
  if (toggleAllBtn) {
    toggleAllBtn.addEventListener('click', toggleAllAccordions);
  }
}

function renderManifestSection(data) {
  const homeSection = document.getElementById('home');
  if (!homeSection) return;

  const manifestHTML = `
    <div class="manifest-hero">
      <div class="manifest-container">
        <div class="manifest-header">
          <h1 class="manifest-title">Qualitätssicherung</h1>
          
          <!-- Hervorgehobener Hinweis-Bereich -->
          <div class="manifest-notice bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6 animate__fadeIn">
            <p class="manifest-subtitle font-medium">
              Im Rahmen meiner Auseinandersetzung mit moderner Qualitätssicherung habe ich eine App entwickelt, 
              in der verschiedene Tools, Strategien und Ansätze aus dem Qualitätsmanagement übersichtlich 
              dargestellt sind. Diese Inhalte verstehen sich nicht als starre Vorgaben, sondern vielmehr 
              als mögliche Werkzeuge und Methoden, die flexibel und bedarfsorientiert zur Sicherung und 
              Verbesserung der Qualität im Unternehmen eingesetzt werden können.
            </p>
            <p class="manifest-subtitle mt-3">
              Ergänzend dazu habe ich eine Roadmap zur Einführung und Weiterentwicklung der Qualitätssicherung 
              im Unternehmen erstellt. Diese beschreibt in klaren Schritten, wie ich auf Basis des aktuellen 
              Status quo – inklusive bestehender Herausforderungen wie Legacy-Code, veralteten Datenbanken 
              und unvollständiger Dokumentation – eine nachhaltige, effektive und moderne Qualitätsstruktur 
              aufbauen würde.
            </p>
            <button 
              id="scroll-to-roadmap" 
              class="action-btn mt-4 flex items-center"
            >
              Weiter zur Roadmap
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </button>
          </div>
          
        </div>
        
        <!-- Hinweis zur Roadmap-Interaktion -->
        <div class="manifest-notice bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-6 animate__fadeIn">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            <p class="text-yellow-700 font-medium">Tipp: Klicken Sie auf die Punkte der Roadmap, um detaillierte Informationen zu erhalten.</p>
          </div>
        </div>
        
        <div class="manifest-grid" id="roadmap-section">
          <div class="manifest-card">
            <div class="manifest-card-header">
              <div class="manifest-number">1</div>
              <h3>Stabilisierung und Modernisierung des Qualitätsmanagementsystems</h3>
            </div>
            <ul class="manifest-points">
              <li>Systematische Analyse der bestehenden Prozesse und Identifikation von Schwachstellen</li>
              <li>Einführung klar definierter, dokumentierter und messbarer Qualitätsstandards</li>
              <li>Priorisierung von "Quick Wins" zur sofortigen Wirkung (z. B. Prüf-Checklisten, bessere Release-Gates)</li>
              <li>Aufbau eines kontinuierlichen Verbesserungsprozesses (KVP) auf Basis von ISO-konformen Methoden</li>
            </ul>
          </div>
          
          <div class="manifest-card">
            <div class="manifest-card-header">
              <div class="manifest-number">2</div>
              <h3>Umgang mit Legacy-Code und veralteten Datenbanken</h3>
            </div>
            <ul class="manifest-points">
              <li>Risikobasierte Bewertung der Legacy-Systeme mit Fokus auf Wartbarkeit, Stabilität und Sicherheitsrisiken</li>
              <li>Aufbau von Regressionstests rund um kritische Altsysteme, um Veränderungen risikoarm zu gestalten</li>
              <li>Einführung eines "Refactoring-Guides" zur strukturierten Verbesserung von Altcode</li>
              <li>Zusammenarbeit mit der Technik zur schrittweisen Modernisierung veralteter Datenbankstrukturen (Normalisierung, optimierte Indizierung, sauberes DB-Schema-Design)</li>
            </ul>
          </div>
          
          <div class="manifest-card">
            <div class="manifest-card-header">
              <div class="manifest-number">3</div>
              <h3>Verbesserung der Dokumentationslage</h3>
            </div>
            <ul class="manifest-points">
              <li>Einführung eines einheitlichen, leicht pflegbaren Dokumentationsstandards (z. B. Confluence, Markdown, automatisierte Dokumentation via Code)</li>
              <li>Aufbau eines zentralen Doku-Hubs mit klaren Verantwortlichkeiten</li>
              <li>Schulungen und einfache Templates, damit alle Teams ihre technische Dokumentation aktiv mitgestalten</li>
            </ul>
          </div>
          
          <div class="manifest-card">
            <div class="manifest-card-header">
              <div class="manifest-number">4</div>
              <h3>Qualitätsanalyse und kontinuierliche Verbesserung</h3>
            </div>
            <ul class="manifest-points">
              <li>Aufbau eines Quality Dashboards für Echtzeit-Transparenz über Testabdeckung, Fehlerraten und Prozesskennzahlen</li>
              <li>Einführung datenbasierter Methoden zur Fehlerursachenanalyse (Pareto, 5-Why, RCA)</li>
              <li>Ableitung und Umsetzung von konkreten Verbesserungsmaßnahmen – eng verzahnt mit Produktmanagement und Technik</li>
            </ul>
          </div>
          
          <div class="manifest-card">
            <div class="manifest-card-header">
              <div class="manifest-number">5</div>
              <h3>Aufbau automatisierter Testumgebungen</h3>
            </div>
            <ul class="manifest-points">
              <li>Einführung von CI/CD-Pipelines mit integrierter automatischer Testausführung</li>
              <li>Auswahl und Einführung geeigneter Test-Frameworks für UI, Backend und Datenbanktests</li>
              <li>Enge Zusammenarbeit mit DevOps und Entwicklung zur Schaffung testfreundlicher Architekturen</li>
              <li>Reduktion manueller Tests auf ein notwendiges Minimum, bei gleichzeitig gesteigerter Testtiefe und -frequenz</li>
            </ul>
          </div>
          
          <div class="manifest-card">
            <div class="manifest-card-header">
              <div class="manifest-number">6</div>
              <h3>Schulung und Befähigung des Teams</h3>
            </div>
            <ul class="manifest-points">
              <li>Regelmäßige interne Workshops und Knowledge-Sharing-Runden</li>
              <li>Entwicklung eines "Quality Ambassador"-Programms: je ein Vertreter pro Fachbereich als Multiplikator</li>
              <li>Förderung einer offenen Fehlerkultur – Qualität wird zur gemeinsamen Verantwortung</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <div class="dashboard-content">
      <!-- Existing dashboard content will be inserted here -->
    </div>
  `;

  // Save existing content
  const existingContent = homeSection.innerHTML;
  
  // Set new structure
  homeSection.innerHTML = manifestHTML;
  
  // Insert existing content into dashboard-content div
  const dashboardContent = homeSection.querySelector('.dashboard-content');
  if (dashboardContent) {
    dashboardContent.innerHTML = existingContent;
  }

  // Manually trigger animations after a short delay
  setTimeout(() => {
    const cards = document.querySelectorAll('.manifest-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate__fadeInUp');
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => showRoadmapDetails(index));
    });
  }, 100);
  
  // Add event listener for the scroll button
  const scrollButton = document.getElementById('scroll-to-roadmap');
  if (scrollButton) {
    scrollButton.addEventListener('click', () => {
      const roadmapSection = document.getElementById('roadmap-section');
      if (roadmapSection) {
        roadmapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

function showRoadmapDetails(index) {
  const roadmapDetails = [
    {
      title: "Stabilisierung und Modernisierung des Qualitätsmanagementsystems",
      details: `
        <h4 class="font-bold mb-2">Konkrete Umsetzungsstrategie:</h4>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Prozessanalyse:</strong> Durchführung von Workshops mit allen Abteilungen zur Identifikation von Schwachstellen</li>
          <li><strong>Standardisierung:</strong> Entwicklung eines QM-Handbuchs mit klar definierten Prozessen und Verantwortlichkeiten</li>
          <li><strong>Quick Wins:</strong> Implementierung von Prüf-Checklisten innerhalb von 4 Wochen</li>
          <li><strong>KVP-Einführung:</strong> Monatliche Review-Meetings mit messbaren Zielen und Aktionsplänen</li>
          <li><strong>Tools:</strong> Einführung von Jira für Issue-Tracking und Confluence für Dokumentation</li>
        </ul>
        <h4 class="font-bold mt-4 mb-2">Zeitplan:</h4>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Phase 1 (1-4 Wochen):</strong> Prozessanalyse und Identifikation von Quick Wins</li>
          <li><strong>Phase 2 (5-8 Wochen):</strong> Entwicklung von Standards und Dokumentation</li>
          <li><strong>Phase 3 (ab Woche 9):</strong> Implementierung des KVP-Prozesses</li>
        </ul>
      `
    },
    {
      title: "Umgang mit Legacy-Code und veralteten Datenbanken",
      details: `
        <h4 class="font-bold mb-2">Konkrete Umsetzungsstrategie:</h4>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Risikoanalyse:</strong> Bewertung aller Legacy-Systeme nach Geschäftskritikalität und technischem Zustand</li>
          <li><strong>Teststrategie:</strong> Entwicklung von charakterisierenden Tests für Kernfunktionalitäten</li>
          <li><strong>Refactoring:</strong> Schrittweise Modernisierung mit Strangler-Pattern und Microservices</li>
          <li><strong>Datenbankmigration:</strong> Phasenweise Migration zu modernen Datenbanktechnologien</li>
          <li><strong>Monitoring:</strong> Einrichtung von Code-Quality-Metriken und technischen Schulden-Trackern</li>
        </ul>
        <h4 class="font-bold mt-4 mb-2">Zeitplan:</h4>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Quartal 1:</strong> Risikoanalyse und Priorisierung</li>
          <li><strong>Quartal 2:</strong> Entwicklung von Sicherheitstests für kritische Systeme</li>
          <li><strong>Quartal 3-4:</strong> Pilot-Migration eines ausgewählten Legacy-Moduls</li>
        </ul>
      `
    },
    {
      title: "Verbesserung der Dokumentationslage",
      details: `
        <h4 class="font-bold mb-2">Konkrete Umsetzungsstrategie:</h4>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Standardisierung:</strong> Einführung von Markdown-basierten Dokumentationsvorlagen</li>
          <li><strong>Zentralisierung:</strong> Aufbau eines Dokumentations-Hubs mit Confluence</li>
          <li><strong>Automatisierung:</strong> Integration von Swagger für API-Dokumentation und Doxygen für Code</li>
          <li><strong>Schulungen:</strong> Quartalsweise Workshops zur Dokumentationserstellung</li>
          <li><strong>Governance:</strong> Ernennung von Dokumentationsverantwortlichen pro Team</li>
        </ul>
        <h4 class="font-bold mt-4 mb-2">Zeitplan:</h4>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Monat 1:</strong> Entwicklung von Standards und Vorlagen</li>
          <li><strong>Monat 2:</strong> Einrichtung des Dokumentations-Hubs</li>
          <li><strong>Monat 3:</strong> Erste Schulungen und Rollout in Pilot-Teams</li>
          <li><strong>Monat 4-6:</strong> Unternehmensweite Einführung</li>
        </ul>
      `
    },
    {
      title: "Qualitätsanalyse und kontinuierliche Verbesserung",
      details: `
        <h4 class="font-bold mb-2">Konkrete Umsetzungsstrategie:</h4>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Dashboard:</strong> Implementierung eines Echtzeit-Qualitätsdashboards mit Grafana</li>
          <li><strong>Metriken:</strong> Definition von KPIs für Code Coverage, Fehlerraten und Zykluszeiten</li>
          <li><strong>Root-Cause-Analyse:</strong> Einführung von 5-Why und Fishbone-Diagrammen für kritische Fehler</li>
          <li><strong>Feedback-Loops:</strong> Wöchentliche Retrospektiven mit Maßnahmenableitung</li>
          <li><strong>Integration:</strong> Verknüpfung von Qualitätsmetriken mit Release-Entscheidungen</li>
        </ul>
        <h4 class="font-bold mt-4 mb-2">Zeitplan:</h4>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Woche 1-4:</strong> Definition der KPIs und Metriken</li>
          <li><strong>Woche 5-8:</strong> Entwicklung des Dashboards</li>
          <li><strong>Woche 9-12:</strong> Einführung der Analyse-Methoden</li>
          <li><strong>Ab Woche 13:</strong> Kontinuierliche Optimierung</li>
        </ul>
      `
    },
    {
      title: "Aufbau automatisierter Testumgebungen",
      details: `
        <h4 class="font-bold mb-2">Konkrete Umsetzungsstrategie:</h4>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>CI/CD-Pipelines:</strong> Einrichtung von Jenkins/GitLab CI für automatisierte Builds und Tests</li>
          <li><strong>Test-Frameworks:</strong> Auswahl von Cypress für UI-Tests und Jest für Unit-Tests</li>
          <li><strong>Testdatenmanagement:</strong> Implementierung von Datenmaskierung und Generierungstools</li>
          <li><strong>Parallelisierung:</strong> Containerisierung mit Docker für parallele Testausführung</li>
          <li><strong>Reporting:</strong> Automatisierte Testberichte in Slack und E-Mail</li>
        </ul>
        <h4 class="font-bold mt-4 mb-2">Zeitplan:</h4>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Quartal 1:</strong> Einrichtung der CI/CD-Pipelines</li>
          <li><strong>Quartal 2:</strong> Implementierung der Test-Frameworks</li>
          <li><strong>Quartal 3:</strong> Automatisierung der Testdatenverwaltung</li>
          <li><strong>Quartal 4:</strong> Vollständige Parallelisierung und Optimierung</li>
        </ul>
      `
    },
    {
      title: "Schulung und Befähigung des Teams",
      details: `
        <h4 class="font-bold mb-2">Konkrete Umsetzungsstrategie:</h4>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Bedarfserhebung:</strong> Durchführung von Skills-Assessments pro Team</li>
          <li><strong>Schulungsplan:</strong> Entwicklung eines individuellen Weiterbildungsplans pro Mitarbeiter</li>
          <li><strong>Ambassador-Programm:</strong> Ernennung von Qualitätsbotschaftern pro Abteilung</li>
          <li><strong>Community:</strong> Einrichtung von monatlichen "Quality Guild" Treffen</li>
          <li><strong>Fehlerkultur:</strong> Implementierung von blameless Post-Mortems</li>
        </ul>
        <h4 class="font-bold mt-4 mb-2">Zeitplan:</h4>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Monat 1-2:</strong> Skills-Assessment und Bedarfsanalyse</li>
          <li><strong>Monat 3-4:</strong> Entwicklung individueller Schulungspläne</li>
          <li><strong>Monat 5:</strong> Start des Ambassador-Programms</li>
          <li><strong>Monat 6:</strong> Erste Quality Guild Sitzung</li>
        </ul>
      `
    }
  ];

  const detail = roadmapDetails[index];
  const overlayHTML = `
    <div class="roadmap-overlay fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-800">${detail.title}</h3>
          <button class="text-gray-500 hover:text-gray-700 text-3xl" onclick="closeRoadmapDetail()">&times;</button>
        </div>
        <div class="p-6 prose max-w-none">
          ${detail.details}
        </div>
        <div class="sticky bottom-0 bg-white p-4 border-t text-right">
          <button class="action-btn" onclick="closeRoadmapDetail()">Schließen</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', overlayHTML);
  
  // Globale Funktion zum Schließen des Overlays
  window.closeRoadmapDetail = function() {
    const overlay = document.querySelector('.roadmap-overlay');
    if (overlay) overlay.remove();
  };
}

function renderDashboardSummary(data) {
  const summaryContainer = document.getElementById('dashboard-summary');
  if (!summaryContainer) return;
  
  const tests = data.tests || [];
  const passedTests = tests.filter(test => test.status === 'passed').length;
  const testPassRate = tests.length ? Math.round((passedTests / tests.length) * 100) : 0;

  summaryContainer.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card kpi-card">
        <div class="kpi-value text-blue-600">${testPassRate}%</div>
        <div class="kpi-label">Test-Erfolgsrate</div>
        <div class="kpi-progress">
          <div class="progress-bar-modern" style="width: ${testPassRate}%"></div>
        </div>
      </div>
      
      <div class="card kpi-card">
        <div class="kpi-value text-green-600">${data.correctiveActions?.length || 0}</div>
        <div class="kpi-label">Aktive CAPAs</div>
        <div class="kpi-icon">📋</div>
      </div>
      
      <div class="card kpi-card">
        <div class="kpi-value text-purple-600">${data.environments?.filter(e => e.status === 'verfügbar').length || 0}/${data.environments?.length || 0}</div>
        <div class="kpi-label">Verfügbare Umgebungen</div>
        <div class="kpi-icon">⚙️</div>
      </div>
      
      <div class="card kpi-card">
        <div class="kpi-value text-orange-600">${data.team?.length || 0}</div>
        <div class="kpi-label">Teammitglieder</div>
        <div class="kpi-icon">👥</div>
      </div>
    </div>
  `;
}

function renderTestTrendChart(data, charts) {
  const ctx = document.getElementById('test-trend-chart')?.getContext('2d');
  if (!ctx) return;
  
  if (charts['test-trend-chart']) charts['test-trend-chart'].destroy();
  
  // Generate 30 days of test data
  const dates = [];
  const passRates = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit'}));
    
    // Simulate pass rates between 80-100% with upward trend
    passRates.push(80 + Math.floor(Math.random() * 20));
  }
  
  charts['test-trend-chart'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Erfolgsrate',
        data: passRates,
        backgroundColor: 'rgba(52, 168, 83, 0.1)',
        borderColor: '#34a853',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Erfolgsrate: ${context.parsed.y}%`;
            }
          }
        }
      },
      scales: {
        y: {
          min: 70,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          },
          title: {
            display: true,
            text: 'Erfolgsrate'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function renderQualityRadarChart(data, charts) {
  const ctx = document.getElementById('quality-radar-chart')?.getContext('2d');
  if (!ctx) return;
  
  if (charts['quality-radar-chart']) charts['quality-radar-chart'].destroy();
  
  charts['quality-radar-chart'] = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Testabdeckung', 'Automatisierung', 'Codequalität', 'Performance', 'Sicherheit', 'Wartbarkeit'],
      datasets: [{
        label: 'Aktuell',
        data: [82, 68, 75, 79, 88, 65],
        backgroundColor: 'rgba(26, 115, 232, 0.2)',
        borderColor: '#1a73e8',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            callback: function(value) {
              return value + '%';
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw}%`;
            }
          }
        }
      }
    }
  });
}

function renderCriticalCapas(data) {
  const container = document.getElementById('critical-capas');
  const countBadge = document.getElementById('critical-capa-count');
  if (!container || !countBadge) return;
  
  const criticalCapas = data.correctiveActions?.filter(c => 
    c.priority === 'high' && c.status !== 'closed'
  ).slice(0, 3) || [];
  
  countBadge.textContent = `${criticalCapas.length} kritisch`;
  
  if (criticalCapas.length === 0) {
    container.innerHTML = '<div class="text-center py-6 text-gray-500">Keine kritischen CAPAs</div>';
    return;
  }
  
  container.innerHTML = criticalCapas.map((capa, index) => `
    <div class="flex items-start p-4 bg-white rounded-xl shadow-sm border-l-4 border-red-500 mb-3">
      <div class="flex-1">
        <h4 class="font-medium text-gray-800">${capa.title}</h4>
        <p class="text-sm text-gray-600 mt-1">Fällig: ${new Date(capa.due_date).toLocaleDateString('de-DE')}</p>
        <p class="text-xs text-gray-500 mt-2">Verantwortlich: ${capa.responsible}</p>
      </div>
      <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Hoch</span>
    </div>
  `).join('');
}

function renderBuildSuccessChart(data, charts) {
  const ctx = document.getElementById('build-success-chart')?.getContext('2d');
  if (!ctx) return;
  
  if (charts['build-success-chart']) charts['build-success-chart'].destroy();
  
  // Generate build success data
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'];
  const successRates = [92, 95, 89, 97, 98, 99];
  
  charts['build-success-chart'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'Erfolgsrate',
        data: successRates,
        backgroundColor: '#34a853',
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Erfolgsrate: ${context.parsed.y}%`;
            }
          }
        }
      },
      scales: {
        y: {
          min: 80,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          },
          title: {
            display: true,
            text: 'Erfolgsrate'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Monat'
          }
        }
      }
    }
  });
}

function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other accordions
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          const otherIcon = otherItem.querySelector('.accordion-icon');
          
          if (otherContent) {
            otherContent.style.maxHeight = '0';
            otherContent.style.opacity = '0';
            otherContent.style.padding = '0 24px';
          }
          
          if (otherIcon) {
            otherIcon.classList.remove('rotate-180');
          }
        }
      });
      
      // Toggle current accordion
      if (isActive) {
        item.classList.remove('active');
        const content = item.querySelector('.accordion-content');
        const icon = item.querySelector('.accordion-icon');
        
        if (content) {
          content.style.maxHeight = '0';
          content.style.opacity = '0';
          content.style.padding = '0 24px';
        }
        
        if (icon) {
          icon.classList.remove('rotate-180');
        }
      } else {
        item.classList.add('active');
        const content = item.querySelector('.accordion-content');
        const icon = item.querySelector('.accordion-icon');
        
        if (content) {
          content.style.maxHeight = content.scrollHeight + 'px';
          content.style.opacity = '1';
          content.style.padding = '24px';
        }
        
        if (icon) {
          icon.classList.add('rotate-180');
        }
      }
    });
  });
}

function toggleAllAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  const firstItem = accordionItems[0];
  
  if (!firstItem) return;
  
  // Check if any accordion is open
  const isAnyOpen = firstItem.classList.contains('active');
  
  if (isAnyOpen) {
    // Close all
    accordionItems.forEach(item => {
      item.classList.remove('active');
      const content = item.querySelector('.accordion-content');
      const icon = item.querySelector('.accordion-icon');
      
      if (content) {
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        content.style.padding = '0 24px';
      }
      
      if (icon) {
        icon.classList.remove('rotate-180');
      }
    });
  } else {
    // Open all
    accordionItems.forEach(item => {
      item.classList.add('active');
      const content = item.querySelector('.accordion-content');
      const icon = item.querySelector('.accordion-icon');
      
      if (content) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        content.style.padding = '24px';
      }
      
      if (icon) {
        icon.classList.add('rotate-180');
      }
    });
  }
}