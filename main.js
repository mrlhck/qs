// main.js
import { showPage } from './navigation.js';
import { initHomePage } from './home.js';
import { initTestPlanPage } from './testplan.js';
import { initAutomationPage } from './automation.js';
import { initLegacyPage } from './legacy.js';
import { initCapaPage } from './capa.js';
import { initCiCdPage } from './cicd.js';
import { initReportingPage } from './reporting.js';
import { initKpisPage } from './kpis.js';
import { initAuditsPage } from './audits.js';
import { initRootCausePage } from './rootcause.js';
import { initEnvironmentsPage } from './environments.js';
import { initKnowledgePage } from './knowledge.js';
import { TeamManager } from './team.js';

// Globale Datenstruktur
const qualityData = {
  tests: [],
  correctiveActions: [],
  teamManager: new TeamManager(),
  kpis: [],
  trainings: [],
  testplans: [],
  legacyModules: [],
  audits: [],
  environments: [],
  knowledgeBase: [],
  rootCauseAnalysis: []
};

// Daten global verfügbar machen
window.qualityData = qualityData;

const chartInstances = {};
const pageInitialized = {};

async function loadData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to load data:', error);
    alert('Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.');
    return null;
  }
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      Object.assign(source[key], deepMerge(target[key] || {}, source[key]));
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

async function initApp() {
  // Daten laden
  const loadedData = await loadData();
  if (!loadedData) return;
  
  // Team-Daten in Manager laden
  if (loadedData.team && Array.isArray(loadedData.team)) {
    loadedData.team.forEach(member => {
      qualityData.teamManager.addMember(member);
    });
  }
  
  // Restliche Daten in die globale Struktur mergen
  const { team, ...restData } = loadedData;
  deepMerge(qualityData, restData);
  
  // Navigation initialisieren
  initNavigation();
  
  // Home-Seite initialisieren
  initHomePage(qualityData, chartInstances);
  pageInitialized.home = true;
  
  // Event-Listener für Navigation
  document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
      const page = button.getAttribute('data-page');
      if (page) {
        showPage(page);
        if (!pageInitialized[page]) {
          setTimeout(() => {
            initPage(page, qualityData, chartInstances);
            pageInitialized[page] = true;
          }, 50);
        }
      }
    });
  });

  // Artikel-Modal Event
  document.getElementById('close-article')?.addEventListener('click', () => {
    document.getElementById('article-view-modal').classList.add('hidden');
  });

  // Startseite anzeigen
  showPage('home');
}

function initPage(page, data, charts) {
  const initMap = {
    'home': initHomePage,
    'testplan': initTestPlanPage,
    'automation': initAutomationPage,
    'legacy': initLegacyPage,
    'reporting': initReportingPage,
    'kpis': initKpisPage,
    'capa': initCapaPage,
    'cicd': initCiCdPage,
    'audits': initAuditsPage,
    'rootcause': initRootCausePage,
    'environments': initEnvironmentsPage,
    'knowledge': initKnowledgePage
  };
  
  const initFn = initMap[page];
  if (initFn) {
    initFn(data, charts);
  } else {
    console.warn(`No initialization function for page: ${page}`);
  }
}

function initNavigation() {
  document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const page = button.getAttribute('data-page');
      if (page) {
        showPage(page);
        document.querySelector('nav').scrollTo({
          left: button.offsetLeft - 20,
          behavior: 'smooth'
        });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initApp);