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

const qualityData = {
    tests: [],
    correctiveActions: [],
    team: [],
    kpis: [],
    trainings: [],
    testplans: [],
    legacyModules: [],
    audits: [],
    environments: [],
    knowledgeBase: [],
    rootCauseAnalysis: []
};

const chartInstances = {};
const pageInitialized = {};

async function initApp() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        Object.assign(qualityData, await response.json());

        initNavigation();
        
        // Initialize only home page first
        initHomePage(qualityData, chartInstances);
        pageInitialized.home = true;
        
        // Initialize other pages when navigated to
        document.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', () => {
                const page = button.getAttribute('data-page');
                if (page) {
                    showPage(page);
                    if (!pageInitialized[page]) {
                        initPage(page, qualityData, chartInstances);
                        pageInitialized[page] = true;
                    }
                }
            });
        });

        // Modal schließen Event hinzufügen
        const closeArticleBtn = document.getElementById('close-article');
        if (closeArticleBtn) {
            closeArticleBtn.addEventListener('click', () => {
                document.getElementById('article-view-modal').classList.add('hidden');
            });
        } else {
            console.warn('Close article button not found');
        }

        showPage('home');
    } catch (error) {
        console.error('Failed to load data:', error);
        alert('Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.');
    }
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
                // Navigation auf kleine Position scrollen
                document.querySelector('nav').scrollTo({
                    left: button.offsetLeft - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initApp);