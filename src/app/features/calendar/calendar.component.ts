import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionService } from '../../core/services/mission.service';
import { AuthService } from '../../core/services/auth.service';
import { Mission } from '../../core/models';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  private missionService = inject(MissionService);
  private authService = inject(AuthService);

  missions = signal<Mission[]>([]);
  currentDate = signal(new Date());
  selectedMission = this.missionService.selectedMission;

  // Calendrier
  currentMonth = computed(() => {
    const date = this.currentDate();
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  });

  calendarDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Array<{ date: number | null; missions: Mission[] }> = [];

    // Jours vides du début
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: null, missions: [] });
    }

    // Jours du mois avec missions
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const dayMissions = this.missions().filter(m => {
        if (!m.dateDebut) return false;
        return m.dateDebut.getDate() === day &&
               m.dateDebut.getMonth() === month &&
               m.dateDebut.getFullYear() === year;
      });
      days.push({ date: day, missions: dayMissions });
    }

    return days;
  });

  ngOnInit() {
    this.loadMissions();
  }

  loadMissions() {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.missionService.getMissionsByFormateur(userId).subscribe({
        next: (missions) => this.missions.set(missions),
        error: (err) => console.error('Erreur chargement missions', err)
      });
    }
  }

  previousMonth() {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth() {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  selectMission(mission: Mission) {
    this.missionService.selectMission(mission);
  }

  closeSidebar() {
    this.missionService.selectMission(null);
  }

  getStatusColor(statut: string): string {
    switch (statut) {
      case 'planifiee': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'en_cours': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'terminee': return 'bg-green-100 text-green-800 border-green-300';
      case 'annulee': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  getStatusLabel(statut: string): string {
    switch (statut) {
      case 'planifiee': return 'Planifiée';
      case 'en_cours': return 'En cours';
      case 'terminee': return 'Terminée';
      case 'annulee': return 'Annulée';
      default: return statut;
    }
  }
}
