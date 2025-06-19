import { renderTable } from './utils.js';
import { createChart } from './charts.js';

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

export function initTeamPage(data, charts) {
    renderTeamSummary(data);
    updateTeamTable(data);
    renderTeamCalendar(data);
    renderSkillMatrix(data, charts);
    renderTeamTrainings(data);
    
    // Event Listener hinzufügen
    document.getElementById('add-member-btn')?.addEventListener('click', () => showAddMemberForm());
    document.getElementById('send-message')?.addEventListener('click', sendTeamMessage);
    document.getElementById('team-search')?.addEventListener('input', () => filterTeamTable(data));
    document.getElementById('team-filter')?.addEventListener('change', () => filterTeamTable(data));
}

function renderTeamSummary(data) {
    const teamSizeEl = document.getElementById('team-size');
    const activeProjectsEl = document.getElementById('active-projects');
    const avgSkillEl = document.getElementById('avg-skill');
    const satisfactionEl = document.getElementById('satisfaction');
    
    if (!teamSizeEl || !activeProjectsEl || !avgSkillEl || !satisfactionEl) return;

    const teamManager = data.teamManager || new TeamManager(data.team || []);
    const totalMembers = teamManager.members.length;
    const activeMembers = teamManager.getActiveMembers().length;
    const avgTraining = teamManager.getAverageTrainingProgress();

    teamSizeEl.textContent = totalMembers;
    activeProjectsEl.textContent = data.projects ? data.projects.length : 0;
    avgSkillEl.textContent = `${avgTraining}%`;
    satisfactionEl.textContent = `${Math.floor(Math.random() * 20) + 80}%`; // Zufälliger Wert zwischen 80-100%
}

function updateTeamTable(data) {
    const teamManager = data.teamManager || new TeamManager(data.team || []);
    renderTable('team-table', 
        ['Name', 'Rolle', 'Status', 'Schulungsfortschritt', 'Aktionen'], 
        teamManager.members, 
        member => `
            <tr>
                <td class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        ${member.name.charAt(0)}
                    </div>
                    ${member.name}
                </td>
                <td>${member.responsibility}</td>
                <td><span class="status-badge ${member.status === 'Aktiv' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                    ${member.status}
                </span></td>
                <td>
                    <div class="flex items-center">
                        <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${member.training_progress}%"></div>
                        </div>
                        <span>${member.training_progress}%</span>
                    </div>
                </td>
                <td>
                    <button class="text-blue-600 hover:underline mr-2" onclick="editMember('${member.name}')">Bearbeiten</button>
                    <button class="text-red-600 hover:underline" onclick="deleteMember('${member.name}')">Löschen</button>
                </td>
            </tr>
        `
    );
}

function renderTeamCalendar(data) {
    const calendarEl = document.getElementById('team-calendar');
    if (!calendarEl) return;
    
    // Einfacher Kalender mit Team-Terminen
    const today = new Date();
    const events = [
        { title: 'Sprint-Planung', date: new Date(today), participants: ['Anna', 'Max'] },
        { title: 'Code Review', date: new Date(today.setDate(today.getDate() + 2)), participants: ['Ben', 'Lisa'] },
        { title: 'Retrospektive', date: new Date(today.setDate(today.getDate() + 5)), participants: ['Anna', 'Ben', 'Max'] }
    ];
    
    calendarEl.innerHTML = `
        <div class="mb-4">
            <h4 class="font-medium text-gray-700 mb-2">${new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
            <div class="space-y-2">
                ${events.map(event => `
                    <div class="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <div class="font-medium">${event.title}</div>
                        <div class="text-sm text-gray-600">${event.date.toLocaleDateString('de-DE')} - ${event.participants.join(', ')}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <button class="action-btn-small w-full">Neuer Termin</button>
    `;
}

function renderSkillMatrix(data, charts) {
    const ctx = document.getElementById('skill-matrix-chart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts['skill-matrix-chart']) {
        charts['skill-matrix-chart'].destroy();
    }
    
    const skills = ['Frontend', 'Backend', 'Testing', 'DevOps', 'UX/UI'];
    const teamMembers = data.team || [];
    
    const datasets = teamMembers.map(member => ({
        label: member.name,
        data: skills.map(() => Math.floor(Math.random() * 80) + 20), // Zufällige Werte zwischen 20-100
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
        borderWidth: 1
    }));
    
    charts['skill-matrix-chart'] = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: skills,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function renderTeamTrainings(data) {
    const container = document.getElementById('team-trainings');
    if (!container) return;
    
    const trainings = data.trainings || [];
    
    if (trainings.length === 0) {
        container.innerHTML = '<p class="text-gray-500 py-4">Keine Schulungen geplant</p>';
        return;
    }
    
    container.innerHTML = trainings.map(training => `
        <div class="flex items-start p-3 bg-white rounded-lg border-l-4 ${training.completed ? 'border-green-500' : 'border-blue-500'} shadow-sm">
            <div class="flex-1">
                <h4 class="font-medium">${training.topic}</h4>
                <p class="text-sm text-gray-600">${training.member} • ${new Date(training.start).toLocaleDateString('de-DE')} - ${new Date(training.end).toLocaleDateString('de-DE')}</p>
                <div class="mt-2 flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div class="bg-blue-600 h-2 rounded-full" style="width: ${training.completed ? 100 : 50}%"></div>
                    </div>
                    <span class="text-xs">${training.completed ? 'Abgeschlossen' : 'In Bearbeitung'}</span>
                </div>
            </div>
            ${training.certification ? 
                '<span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Zertifizierung</span>' : 
                ''}
        </div>
    `).join('');
}

function showAddMemberForm() {
    const formHtml = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 class="text-lg font-medium mb-4">Neues Teammitglied</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="new-member-name" class="form-input mt-1 w-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Rolle</label>
                        <select id="new-member-role" class="form-input mt-1 w-full">
                            <option value="Entwickler">Entwickler</option>
                            <option value="Tester">Tester</option>
                            <option value="DevOps">DevOps</option>
                            <option value="UX Designer">UX Designer</option>
                            <option value="Produktmanager">Produktmanager</option>
                        </select>
                    </div>
                    <div class="flex justify-end space-x-2 pt-4">
                        <button type="button" id="cancel-add-member" class="secondary-btn">Abbrechen</button>
                        <button type="button" id="confirm-add-member" class="action-btn">Hinzufügen</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHtml);
    
    // Event-Listener für Abbrechen-Button
    document.getElementById('cancel-add-member').addEventListener('click', () => {
        document.querySelector('.fixed.inset-0').remove();
    });
    
    // Event-Listener für Hinzufügen-Button
    document.getElementById('confirm-add-member').addEventListener('click', () => {
        const name = document.getElementById('new-member-name').value;
        const role = document.getElementById('new-member-role').value;
        
        if (!name) {
            alert('Bitte geben Sie einen Namen ein');
            return;
        }
        
        const newMember = {
            name,
            responsibility: role,
            status: 'Aktiv',
            training_progress: 0
        };
        
        window.qualityData.teamManager.addMember(newMember);
        window.qualityData.team.push(newMember);
        
        updateTeamTable(window.qualityData);
        renderTeamSummary(window.qualityData);
        document.querySelector('.fixed.inset-0').remove();
        alert(`${name} wurde zum Team hinzugefügt!`);
    });
}

function sendTeamMessage() {
    const message = document.getElementById('team-message').value;
    if (!message) {
        alert('Bitte geben Sie eine Nachricht ein');
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500 mb-2';
    messageDiv.innerHTML = `
        <div class="font-medium">Neue Nachricht</div>
        <div class="text-sm">${message}</div>
        <div class="text-xs text-gray-500 mt-1">${new Date().toLocaleString('de-DE')}</div>
    `;
    
    document.getElementById('team-message').value = '';
    document.getElementById('team-message').parentNode.insertBefore(messageDiv, document.getElementById('team-message'));
    alert('Nachricht an das Team gesendet!');
}

function filterTeamTable(data) {
    const searchTerm = document.getElementById('team-search').value.toLowerCase();
    const filterValue = document.getElementById('team-filter').value;
    
    let filteredMembers = [...data.team];
    
    if (searchTerm) {
        filteredMembers = filteredMembers.filter(member => 
            member.name.toLowerCase().includes(searchTerm) || 
            member.responsibility.toLowerCase().includes(searchTerm)
        );  // Added missing closing parenthesis here
    }
    
    if (filterValue === 'active') {
        filteredMembers = filteredMembers.filter(member => member.status === 'Aktiv');
    } else if (filterValue === 'inactive') {
        filteredMembers = filteredMembers.filter(member => member.status !== 'Aktiv');
    }
    
    renderTable('team-table', 
        ['Name', 'Rolle', 'Status', 'Schulungsfortschritt', 'Aktionen'], 
        filteredMembers, 
        member => `
            <tr>
                <td class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        ${member.name.charAt(0)}
                    </div>
                    ${member.name}
                </td>
                <td>${member.responsibility}</td>
                <td><span class="status-badge ${member.status === 'Aktiv' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                    ${member.status}
                </span></td>
                <td>
                    <div class="flex items-center">
                        <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${member.training_progress}%"></div>
                        </div>
                        <span>${member.training_progress}%</span>
                    </div>
                </td>
                <td>
                    <button class="text-blue-600 hover:underline mr-2" onclick="editMember('${member.name}')">Bearbeiten</button>
                    <button class="text-red-600 hover:underline" onclick="deleteMember('${member.name}')">Löschen</button>
                </td>
            </tr>
        `
    );
}

// Globale Funktionen für die Tabellenaktionen
window.editMember = function(name) {
    const member = window.qualityData.teamManager.getMember(name);
    if (member) {
        const formHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop">
                <div class="bg-white rounded-lg p-6 w-full max-w-md">
                    <h3 class="text-lg font-medium mb-4">Mitglied bearbeiten</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" id="edit-member-name" value="${member.name}" class="form-input mt-1 w-full">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Rolle</label>
                            <select id="edit-member-role" class="form-input mt-1 w-full">
                                <option value="Entwickler" ${member.responsibility === 'Entwickler' ? 'selected' : ''}>Entwickler</option>
                                <option value="Tester" ${member.responsibility === 'Tester' ? 'selected' : ''}>Tester</option>
                                <option value="DevOps" ${member.responsibility === 'DevOps' ? 'selected' : ''}>DevOps</option>
                                <option value="UX Designer" ${member.responsibility === 'UX Designer' ? 'selected' : ''}>UX Designer</option>
                                <option value="Produktmanager" ${member.responsibility === 'Produktmanager' ? 'selected' : ''}>Produktmanager</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Status</label>
                            <select id="edit-member-status" class="form-input mt-1 w-full">
                                <option value="Aktiv" ${member.status === 'Aktiv' ? 'selected' : ''}>Aktiv</option>
                                <option value="Inaktiv" ${member.status !== 'Aktiv' ? 'selected' : ''}>Inaktiv</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Schulungsfortschritt</label>
                            <input type="range" id="edit-member-progress" min="0" max="100" value="${member.training_progress}" class="w-full mt-2">
                            <div class="text-center">${member.training_progress}%</div>
                        </div>
                        <div class="flex justify-end space-x-2 pt-4">
                            <button type="button" onclick="document.querySelector('.modal-backdrop').remove()" class="secondary-btn">Abbrechen</button>
                            <button type="button" onclick="saveMemberChanges('${member.name}')" class="action-btn">Speichern</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHtml);
        
        // Progress bar update
        document.getElementById('edit-member-progress').addEventListener('input', function() {
            this.nextElementSibling.textContent = `${this.value}%`;
        });
    }
};

window.deleteMember = function(name) {
    if (confirm(`Sind Sie sicher, dass Sie ${name} aus dem Team entfernen möchten?`)) {
        window.qualityData.teamManager.removeMember(name);
        window.qualityData.team = window.qualityData.team.filter(m => m.name !== name);
        updateTeamTable(window.qualityData);
        renderTeamSummary(window.qualityData);
        alert(`${name} wurde aus dem Team entfernt!`);
    }
};

window.addNewMember = function() {
    const name = document.getElementById('new-member-name').value;
    const role = document.getElementById('new-member-role').value;
    
    if (!name) {
        alert('Bitte geben Sie einen Namen ein');
        return;
    }
    
    const newMember = {
        name,
        responsibility: role,
        status: 'Aktiv',
        training_progress: 0
    };
    
    window.qualityData.teamManager.addMember(newMember);
    window.qualityData.team.push(newMember);
    
    updateTeamTable(window.qualityData);
    renderTeamSummary(window.qualityData);
    document.querySelector('.modal-backdrop').remove();
    alert(`${name} wurde zum Team hinzugefügt!`);
};

window.saveMemberChanges = function(oldName) {
    const name = document.getElementById('edit-member-name').value;
    const role = document.getElementById('edit-member-role').value;
    const status = document.getElementById('edit-member-status').value;
    const progress = document.getElementById('edit-member-progress').value;
    
    if (!name) {
        alert('Bitte geben Sie einen Namen ein');
        return;
    }
    
    const updatedData = {
        name,
        responsibility: role,
        status,
        training_progress: parseInt(progress)
    };
    
    window.qualityData.teamManager.updateMember(oldName, updatedData);
    
    // Update im Hauptteam-Array
    const index = window.qualityData.team.findIndex(m => m.name === oldName);
    if (index !== -1) {
        window.qualityData.team[index] = updatedData;
    }
    
    updateTeamTable(window.qualityData);
    renderTeamSummary(window.qualityData);
    document.querySelector('.modal-backdrop').remove();
    alert('Änderungen gespeichert!');
};