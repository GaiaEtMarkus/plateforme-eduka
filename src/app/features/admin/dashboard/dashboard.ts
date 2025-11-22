import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionService } from '../../../core/services/mission.service';
import { PropositionService } from '../../../core/services/proposition.service';
import { FactureService } from '../../../core/services/facture.service';
import { DataService } from '../../../core/services/data.service';
import { Mission, Proposition, Facture, User } from '../../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private missionService = inject(MissionService);
  private propositionService = inject(PropositionService);
  private factureService = inject(FactureService);
  private dataService = inject(DataService);

  missions = signal<Mission[]>([]);
  propositions = signal<Proposition[]>([]);
  factures = signal<Facture[]>([]);
  formateurs = signal<User[]>([]);

  // Statistiques calculées
  stats = computed(() => {
    const missions = this.missions();
    const propositions = this.propositions();
    const factures = this.factures();
    const formateurs = this.formateurs();

    return {
      totalMissions: missions.length,
      missionsEnCours: missions.filter(m => m.statut === 'en_cours').length,
      missionsTerminees: missions.filter(m => m.statut === 'terminee').length,

      totalPropositions: propositions.length,
      propositionsEnAttente: propositions.filter(p => p.statut === 'en_attente').length,

      totalFormateurs: formateurs.length,
      formateursActifs: formateurs.filter(f => f.nombreMissions && f.nombreMissions > 0).length,

      totalFactures: factures.length,
      montantTotal: factures.reduce((sum, f) => sum + f.total, 0),
      facturesPayees: factures.filter(f => f.statut === 'payee').length
    };
  });

  // Missions récentes
  recentMissions = computed(() => {
    return this.missions()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  });

  // Propositions récentes
  recentPropositions = computed(() => {
    return this.propositions()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Charger toutes les missions
    this.missionService.missions$.subscribe({
      next: (missions: Mission[]) => this.missions.set(missions),
      error: (err: any) => console.error('Erreur missions', err)
    });

    // Charger toutes les propositions
    this.propositionService.propositions$.subscribe({
      next: (propositions: Proposition[]) => this.propositions.set(propositions),
      error: (err: any) => console.error('Erreur propositions', err)
    });

    // Charger toutes les factures
    this.factureService.factures$.subscribe({
      next: (factures: Facture[]) => this.factures.set(factures),
      error: (err: any) => console.error('Erreur factures', err)
    });

    // Charger les formateurs
    this.dataService.loadJsonData<User[]>('users').subscribe({
      next: (users: User[]) => {
        const formateurs = users.filter(u => u.role === 'formateur');
        this.formateurs.set(formateurs);
      },
      error: (err: any) => console.error('Erreur users', err)
    });
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'terminee': return 'bg-green-100 text-green-800';
      case 'planifiee': return 'bg-orange-100 text-orange-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
