import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionService } from '../../../core/services/mission.service';
import { DataService } from '../../../core/services/data.service';
import { Mission, StatutMission, StatutSuiviMission, TypeAlerte, Alerte, User } from '../../../core/models';

@Component({
  selector: 'app-missions-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './missions-admin.html',
  styleUrl: './missions-admin.css',
})
export class MissionsAdmin implements OnInit {
  private missionService = inject(MissionService);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  // Expose enums
  readonly StatutMission = StatutMission;
  readonly StatutSuiviMission = StatutSuiviMission;
  readonly TypeAlerte = TypeAlerte;

  missions = signal<Mission[]>([]);
  formateurs = signal<User[]>([]);
  searchTerm = signal<string>('');
  selectedStatut = signal<'all' | StatutMission>('all');
  selectedSuivi = signal<'all' | StatutSuiviMission>('all');

  selectedMission = signal<Mission | null>(null);
  showAlerteModal = signal<boolean>(false);

  // Formulaire alerte
  newAlerte = signal<{
    type: TypeAlerte;
    titre: string;
    description: string;
  }>({
    type: TypeAlerte.AUTRE,
    titre: '',
    description: ''
  });

  // Missions filtrées
  filteredMissions = computed(() => {
    let missions = this.missions();
    const search = this.searchTerm().toLowerCase();
    const statut = this.selectedStatut();
    const suivi = this.selectedSuivi();

    // Filtre par recherche
    if (search) {
      missions = missions.filter(m =>
        m.cours?.nom.toLowerCase().includes(search) ||
        m.ecole?.nom.toLowerCase().includes(search) ||
        m.formateurNom?.toLowerCase().includes(search)
      );
    }

    // Filtre par statut mission
    if (statut !== 'all') {
      missions = missions.filter(m => m.statut === statut);
    }

    // Filtre par statut suivi
    if (suivi !== 'all') {
      missions = missions.filter(m => m.statutSuivi === suivi);
    }

    // Trier par date (plus récentes en premier)
    return missions.sort((a, b) =>
      new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime()
    );
  });

  // Statistiques
  stats = computed(() => {
    const missions = this.missions();
    const alertesNonResolues = missions.reduce((sum, m) =>
      sum + (m.alertes?.filter(a => !a.resolue).length || 0), 0
    );

    return {
      total: missions.length,
      enCours: missions.filter(m => m.statut === StatutMission.EN_COURS).length,
      planifiees: missions.filter(m => m.statut === StatutMission.PLANIFIEE).length,
      terminees: missions.filter(m => m.statut === StatutMission.TERMINEE).length,
      alertes: alertesNonResolues,
      problemes: missions.filter(m =>
        m.statutSuivi === StatutSuiviMission.PROBLEME_INTERVENANT ||
        m.statutSuivi === StatutSuiviMission.ABSENCE_INTERVENANT ||
        m.statutSuivi === StatutSuiviMission.RETARD
      ).length
    };
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Charger les missions
    this.missionService.missions$.subscribe({
      next: (missions: Mission[]) => {
        this.missions.set(missions);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur missions', err)
    });

    // Charger les formateurs
    this.dataService.loadJsonData<User[]>('users').subscribe({
      next: (users: User[]) => {
        const formateurs = users.filter(u => u.role === 'formateur');
        this.formateurs.set(formateurs);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur users', err)
    });
  }

  setSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  setStatutFilter(statut: 'all' | StatutMission) {
    this.selectedStatut.set(statut);
  }

  setSuiviFilter(suivi: 'all' | StatutSuiviMission) {
    this.selectedSuivi.set(suivi);
  }

  updateStatutSuivi(mission: Mission, newStatut: StatutSuiviMission) {
    // Mettre à jour le statut de suivi
    const updatedMissions = this.missions().map(m =>
      m.id === mission.id ? { ...m, statutSuivi: newStatut } : m
    );
    this.missions.set(updatedMissions);

    // TODO: Persister dans le backend
    console.log('Mise à jour statut suivi:', mission.id, newStatut);
  }

  selectMission(mission: Mission) {
    this.selectedMission.set(mission);
  }

  closeMissionDetails() {
    this.selectedMission.set(null);
  }

  openAlerteModal(mission: Mission) {
    this.selectedMission.set(mission);
    this.showAlerteModal.set(true);
    this.newAlerte.set({
      type: TypeAlerte.AUTRE,
      titre: '',
      description: ''
    });
  }

  closeAlerteModal() {
    this.showAlerteModal.set(false);
    this.newAlerte.set({
      type: TypeAlerte.AUTRE,
      titre: '',
      description: ''
    });
  }

  createAlerte() {
    const mission = this.selectedMission();
    const alerteData = this.newAlerte();

    if (!mission || !alerteData.titre || !alerteData.description) {
      return;
    }

    const newAlerte: Alerte = {
      id: `alerte-${Date.now()}`,
      type: alerteData.type,
      titre: alerteData.titre,
      description: alerteData.description,
      createdAt: new Date(),
      createdBy: 'admin-1', // TODO: Récupérer l'ID de l'admin connecté
      resolue: false
    };

    // Ajouter l'alerte à la mission
    const updatedMissions = this.missions().map(m => {
      if (m.id === mission.id) {
        return {
          ...m,
          alertes: [...(m.alertes || []), newAlerte]
        };
      }
      return m;
    });

    this.missions.set(updatedMissions);
    this.closeAlerteModal();

    // TODO: Persister dans le backend
    console.log('Alerte créée:', newAlerte);
  }

  resolveAlerte(mission: Mission, alerteId: string) {
    const updatedMissions = this.missions().map(m => {
      if (m.id === mission.id) {
        return {
          ...m,
          alertes: m.alertes?.map(a =>
            a.id === alerteId
              ? { ...a, resolue: true, resolvedAt: new Date(), resolvedBy: 'admin-1' }
              : a
          )
        };
      }
      return m;
    });

    this.missions.set(updatedMissions);

    // TODO: Persister dans le backend
    console.log('Alerte résolue:', alerteId);
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

  getSuiviColor(suivi: StatutSuiviMission | undefined): string {
    if (!suivi) return 'bg-gray-100 text-gray-600';

    switch (suivi) {
      case StatutSuiviMission.OK:
      case StatutSuiviMission.INTERVENANT_TROUVE:
        return 'bg-green-100 text-green-800';
      case StatutSuiviMission.EN_ATTENTE_INTERVENANT:
        return 'bg-yellow-100 text-yellow-800';
      case StatutSuiviMission.PROBLEME_INTERVENANT:
      case StatutSuiviMission.ABSENCE_INTERVENANT:
      case StatutSuiviMission.RETARD:
      case StatutSuiviMission.ANNULATION_DEMANDEE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getSuiviLabel(suivi: StatutSuiviMission | undefined): string {
    if (!suivi) return 'Non défini';

    switch (suivi) {
      case StatutSuiviMission.OK:
        return 'OK';
      case StatutSuiviMission.INTERVENANT_TROUVE:
        return 'Intervenant trouvé';
      case StatutSuiviMission.EN_ATTENTE_INTERVENANT:
        return 'En attente intervenant';
      case StatutSuiviMission.PROBLEME_INTERVENANT:
        return 'Problème intervenant';
      case StatutSuiviMission.RETARD:
        return 'Retard';
      case StatutSuiviMission.ABSENCE_INTERVENANT:
        return 'Absence intervenant';
      case StatutSuiviMission.ANNULATION_DEMANDEE:
        return 'Annulation demandée';
      case StatutSuiviMission.AUTRE:
        return 'Autre';
      default:
        return suivi;
    }
  }

  getAlerteColor(type: TypeAlerte): string {
    switch (type) {
      case TypeAlerte.ABSENCE:
      case TypeAlerte.ANNULATION:
        return 'bg-red-100 text-red-800';
      case TypeAlerte.RETARD:
        return 'bg-orange-100 text-orange-800';
      case TypeAlerte.PROBLEME_TECHNIQUE:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getAlerteIcon(type: TypeAlerte): string {
    switch (type) {
      case TypeAlerte.ABSENCE:
        return 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636';
      case TypeAlerte.RETARD:
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case TypeAlerte.ANNULATION:
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
    }
  }

  hasActiveAlertes(mission: Mission): boolean {
    return (mission.alertes?.filter(a => !a.resolue).length || 0) > 0;
  }

  getActiveAlertesCount(mission: Mission): number {
    return mission.alertes?.filter(a => !a.resolue).length || 0;
  }
}
