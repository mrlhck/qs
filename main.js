import { renderTable } from './utils.js';
import { initHomePage } from './home.js';
import { initTeamPage } from './team.js';
import { initTestPlanPage } from './testplan.js';
import { initAutomationPage } from './automation.js';
import { initLegacyPage } from './legacy.js';
import { initReportingPage } from './reporting.js';
import { initKpisPage } from './kpis.js';
import { initCapaPage } from './capa.js';
import { initCiCdPage } from './cicd.js';
import { initAuditsPage } from './audits.js';
import { initRootCausePage } from './rootcause.js';
import { initEnvironmentsPage } from './environments.js';

export class TeamManager {
  constructor(members = []) {
    this.members = members;
  }

  addMember(member) {
    this.members.push(member);
  }

  removeMember(name) {
    this.members = this.members.filter(member => member.name !== name);
  }

  updateMember(name, updatedData) {
    const index = this.members.findIndex(member => member.name === name);
    if (index !== -1) {
      this.members[index] = { ...this.members[index], ...updatedData };
    }
  }

  getMember(name) {
    return this.members.find(member => member.name === name);
  }

  getActiveMembers() {
    return this.members.filter(member => member.status === 'Aktiv');
  }

  getAverageTrainingProgress() {
    if (this.members.length === 0) return 0;
    const total = this.members.reduce((sum, member) => sum + member.training_progress, 0);
    return Math.round(total / this.members.length);
  }
}

export function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

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
  rootCauseAnalysis: [],
  team: []
};

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
  const loadedData = await loadData();
  if (!loadedData) return;
  
  // TeamManager initialisieren
  if (loadedData.team && Array.isArray(loadedData.team)) {
    loadedData.team.forEach(member => {
      qualityData.teamManager.addMember(member);
    });
    qualityData.team = [...loadedData.team];
  }
  
  // Restliche Daten mergen
  const { team, ...restData } = loadedData;
  deepMerge(qualityData, restData);
  
  // Navigation initialisieren
  initNavigation();
  
  // Homepage initialisieren
  initHomePage(qualityData, chartInstances);
  pageInitialized.home = true;
  
  // Event-Listener für Navigation hinzufügen
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

  // Homepage als Startseite anzeigen
  showPage('home');
}

function initPage(page, data, charts) {
  const pageHandlers = {
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
    'team': initTeamPage
  };
  
  const handler = pageHandlers[page];
  if (handler) {
    handler(data, charts);
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