import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropositionService } from '../../../core/services/proposition.service';
import { DataService } from '../../../core/services/data.service';
import { Proposition, Ecole, Classe, Cours, User } from '../../../core/models';

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proposals.html',
  styleUrl: './proposals.css',
})
export class Proposals implements OnInit {
  private propositionService = inject(PropositionService);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  propositions = signal<Proposition[]>([]);
  ecoles = signal<Ecole[]>([]);
  classes = signal<Classe[]>([]);
  cours = signal<Cours[]>([]);
  formateurs = signal<User[]>([]);

  selectedProposal = signal<Proposition | null>(null);

  // Filtre
  filterStatus = signal<string>('all');

  // Propositions filtrées
  filteredPropositions = computed(() => {
    const filter = this.filterStatus();
    const propositions = this.propositions();

    if (filter === 'all') {
      return propositions;
    }

    return propositions.filter(p => p.statut === filter);
  });

  // Statistiques
  stats = computed(() => {
    const propositions = this.propositions();
    return {
      total: propositions.length,
      enAttente: propositions.filter(p => p.statut === 'en_attente').length,
      acceptees: propositions.filter(p => p.statut === 'acceptee').length,
      refusees: propositions.filter(p => p.statut === 'refusee').length,
      expirees: propositions.filter(p => {
        const expiration = new Date(p.dateExpiration);
        return expiration < new Date() && p.statut === 'en_attente';
      }).length
    };
  });

  // Propositions récentes
  recentProposals = computed(() => {
    return this.propositions()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  });

  // Propositions urgentes (expiration proche)
  urgentProposals = computed(() => {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));

    return this.propositions()
      .filter(p => {
        const expiration = new Date(p.dateExpiration);
        return p.statut === 'en_attente' && expiration <= threeDaysFromNow && expiration >= now;
      })
      .sort((a, b) => new Date(a.dateExpiration).getTime() - new Date(b.dateExpiration).getTime());
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Charger les propositions
    this.propositionService.propositions$.subscribe({
      next: (propositions: Proposition[]) => {
        this.propositions.set(propositions);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur propositions', err)
    });

    // Charger les écoles
    this.dataService.loadJsonData<Ecole[]>('ecoles').subscribe({
      next: (ecoles: Ecole[]) => {
        this.ecoles.set(ecoles);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur ecoles', err)
    });

    // Charger les classes
    this.dataService.loadJsonData<Classe[]>('classes').subscribe({
      next: (classes: Classe[]) => {
        this.classes.set(classes);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur classes', err)
    });

    // Charger les cours
    this.dataService.loadJsonData<Cours[]>('cours').subscribe({
      next: (cours: Cours[]) => {
        this.cours.set(cours);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur cours', err)
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

  setFilter(status: string) {
    this.filterStatus.set(status);
  }

  viewProposalDetails(proposal: Proposition) {
    this.selectedProposal.set(proposal);
  }

  closeProposalDetails() {
    this.selectedProposal.set(null);
  }

  getFormateurName(formateurId: string): string {
    const formateur = this.formateurs().find(f => f.id === formateurId);
    return formateur ? `${formateur.prenom} ${formateur.nom}` : formateurId;
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'acceptee': return 'bg-green-100 text-green-800';
      case 'refusee': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getCandidatureStatutColor(statut: string): string {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'acceptee': return 'bg-green-100 text-green-800';
      case 'refusee': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isExpired(dateExpiration: Date): boolean {
    return dateExpiration < new Date();
  }

  getDaysUntilExpiration(dateExpiration: Date): number {
    const now = new Date();
    const diff = dateExpiration.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
