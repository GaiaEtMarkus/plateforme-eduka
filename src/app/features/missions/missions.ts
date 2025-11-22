import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionService } from '../../core/services/mission.service';
import { AuthService } from '../../core/services/auth.service';
import { Mission, StatutMission } from '../../core/models';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './missions.html',
  styleUrl: './missions.css',
})
export class Missions implements OnInit {
  private missionService = inject(MissionService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  // Expose enum pour le template
  readonly StatutMission = StatutMission;

  missions = signal<Mission[]>([]);
  selectedMission = this.missionService.selectedMission;
  selectedFilter = signal<'all' | StatutMission>('all');

  filteredMissions = computed(() => {
    const filter = this.selectedFilter();
    const missions = this.missions();

    if (filter === 'all') {
      return missions;
    }

    return missions.filter(m => m.statut === filter);
  });

  ngOnInit() {
    this.loadMissions();
  }

  loadMissions() {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.missionService.getMissionsByFormateur(userId).subscribe({
        next: (missions: Mission[]) => {
          this.missions.set(missions);
          this.cdr.markForCheck();
        },
        error: (err: any) => console.error('Erreur chargement missions', err)
      });
    }
  }

  setFilter(filter: 'all' | StatutMission) {
    this.selectedFilter.set(filter);
  }

  selectMission(mission: Mission) {
    this.missionService.selectMission(mission);
  }

  closeSidebar() {
    this.missionService.selectMission(null);
  }

  getStatutColor(statut: StatutMission): string {
    switch (statut) {
      case StatutMission.PLANIFIEE:
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case StatutMission.EN_COURS:
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case StatutMission.TERMINEE:
        return 'bg-green-100 text-green-800 border-green-300';
      case StatutMission.ANNULEE:
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  getStatutLabel(statut: StatutMission): string {
    switch (statut) {
      case StatutMission.PLANIFIEE:
        return 'Planifiée';
      case StatutMission.EN_COURS:
        return 'En cours';
      case StatutMission.TERMINEE:
        return 'Terminée';
      case StatutMission.ANNULEE:
        return 'Annulée';
      default:
        return statut;
    }
  }

  getFilterCount(filter: 'all' | StatutMission): number {
    if (filter === 'all') {
      return this.missions().length;
    }
    return this.missions().filter(m => m.statut === filter).length;
  }

  demarrerMission(missionId: string) {
    // Implémenter le démarrage de mission
    console.log('Démarrer mission', missionId);
  }

  terminerMission(missionId: string) {
    // Implémenter la fin de mission
    console.log('Terminer mission', missionId);
  }

  genererFacture(missionId: string) {
    // Rediriger vers la page factures
    console.log('Générer facture pour mission', missionId);
  }

  isPast(mission: Mission): boolean {
    return new Date(mission.dateFin) < new Date();
  }

  isToday(mission: Mission): boolean {
    const today = new Date();
    const missionDate = new Date(mission.dateDebut);
    return missionDate.getDate() === today.getDate() &&
           missionDate.getMonth() === today.getMonth() &&
           missionDate.getFullYear() === today.getFullYear();
  }

  getSchoolLogo(ecole: any): string {
    if (ecole?.logo) {
      // Si le logo commence déjà par /, on l'utilise tel quel (en enlevant le /)
      // Sinon on ajoute le préfixe assets/logos/
      return ecole.logo.startsWith('/') ? ecole.logo.substring(1) : `assets/logos/${ecole.logo}`;
    }
    // Return random logo from available ones
    const logos = ['eni.png', 'epitech.png', 'esgi.png', 'estiam.png', 'isitech.png', 'ynov.png', 'supdevinci.jpeg'];
    const randomLogo = logos[Math.floor(Math.random() * logos.length)];
    return `assets/logos/${randomLogo}`;
  }
}
