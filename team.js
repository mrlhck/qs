// team.js
export class TeamManager {
  constructor(members = []) {
    this.members = members;
  }

  addMember(member) {
    this.members.push(member);
  }

  removeMember(name) {
    this.members = this.members.filter(m => m.name !== name);
  }

  updateMember(name, updatedData) {
    const index = this.members.findIndex(m => m.name === name);
    if (index !== -1) {
      this.members[index] = { ...this.members[index], ...updatedData };
    }
  }

  getMember(name) {
    return this.members.find(m => m.name === name);
  }

  getActiveMembers() {
    return this.members.filter(m => m.status === 'Aktiv');
  }

  getAverageTrainingProgress() {
    if (this.members.length === 0) return 0;
    const total = this.members.reduce((sum, member) => sum + member.training_progress, 0);
    return Math.round(total / this.members.length);
  }
}