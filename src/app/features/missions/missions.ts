import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionService } from '../../core/services/mission.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Mission, StatutMission, TypeIncident, Incident, TypeNotification } from '../../core/models';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './missions.html',
  styleUrl: './missions.css',
})
export class Missions implements OnInit {
  private missionService = inject(MissionService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  // Expose enums pour le template
  readonly StatutMission = StatutMission;
  readonly TypeIncident = TypeIncident;

  missions = signal<Mission[]>([]);
  selectedMission = this.missionService.selectedMission;
  selectedFilter = signal<'all' | StatutMission>('all');

  // Modal démarrage mission avec incident
  showStartModal = signal<boolean>(false);
  missionToStart = signal<Mission | null>(null);
  showIncidentForm = signal<boolean>(false);

  newIncident = signal<{
    type: TypeIncident;
    description: string;
  }>({
    type: TypeIncident.AUTRE,
    description: ''
  });

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

  openStartModal(mission: Mission) {
    this.missionToStart.set(mission);
    this.showStartModal.set(true);
    this.showIncidentForm.set(false);
    this.newIncident.set({
      type: TypeIncident.AUTRE,
      description: ''
    });
  }

  closeStartModal() {
    this.showStartModal.set(false);
    this.missionToStart.set(null);
    this.showIncidentForm.set(false);
  }

  toggleIncidentForm() {
    this.showIncidentForm.set(!this.showIncidentForm());
  }

  demarrerMission() {
    const mission = this.missionToStart();
    if (!mission) return;

    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    // Créer un incident si le formulaire est rempli
    let incident: Incident | undefined;
    if (this.showIncidentForm() && this.newIncident().description) {
      incident = {
        id: `incident-${Date.now()}`,
        type: this.newIncident().type,
        description: this.newIncident().description,
        createdAt: new Date(),
        createdBy: userId
      };
    }

    // Mettre à jour la mission
    const updatedMissions = this.missions().map(m => {
      if (m.id === mission.id) {
        return {
          ...m,
          missionDemarree: true,
          dateDemarrage: new Date(),
          incidents: incident ? [...(m.incidents || []), incident] : m.incidents
        };
      }
      return m;
    });

    this.missions.set(updatedMissions);
    this.closeStartModal();

    // Créer une notification pour l'admin si incident
    if (incident) {
      this.notificationService.createNotification({
        userId: 'admin-1', // TODO: Récupérer les IDs des admins
        type: TypeNotification.INCIDENT_SIGNALE,
        titre: `Incident signalé - ${mission.cours.nom}`,
        message: `${this.getIncidentLabel(incident.type)}: ${incident.description}`,
        lu: false,
        metadata: {
          missionId: mission.id
        }
      }).subscribe();
    }

    // TODO: Persister dans le backend
    console.log('Mission démarrée:', mission.id, incident);
  }

  terminerMission(missionId: string) {
    // Implémenter la fin de mission
    console.log('Terminer mission', missionId);
  }

  genererFacture(missionId: string) {
    // Rediriger vers la page factures
    console.log('Générer facture pour mission', missionId);
  }

  updateIncidentType(value: string) {
    const current = this.newIncident();
    this.newIncident.set({
      type: value as TypeIncident,
      description: current.description
    });
  }

  updateIncidentDescription(value: string) {
    const current = this.newIncident();
    this.newIncident.set({
      type: current.type,
      description: value
    });
  }

  getIncidentLabel(type: TypeIncident): string {
    switch (type) {
      case TypeIncident.RETARD:
        return 'Retard';
      case TypeIncident.ABSENCE:
        return 'Absence';
      case TypeIncident.PROBLEME_ECOLE:
        return 'Problème école';
      case TypeIncident.PROBLEME_ELEVE:
        return 'Problème élève';
      default:
        return 'Autre';
    }
  }

  canStartMission(mission: Mission): boolean {
    // Peut démarrer si la mission est planifiée et que c'est aujourd'hui
    return mission.statut === StatutMission.PLANIFIEE && this.isToday(mission) && !mission.missionDemarree;
  }

  isPast(mission: Mission): boolean {
    if (!mission.dateFin) return false;
    return mission.dateFin < new Date();
  }

  isToday(mission: Mission): boolean {
    if (!mission.dateDebut) return false;
    const today = new Date();
    return mission.dateDebut.getDate() === today.getDate() &&
           mission.dateDebut.getMonth() === today.getMonth() &&
           mission.dateDebut.getFullYear() === today.getFullYear();
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
