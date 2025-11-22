import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropositionService } from '../../core/services/proposition.service';
import { AuthService } from '../../core/services/auth.service';
import { Proposition, StatutProposition } from '../../core/models';

@Component({
  selector: 'app-propositions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './propositions.html',
  styleUrl: './propositions.css',
})
export class Propositions implements OnInit {
  private propositionService = inject(PropositionService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  // Expose enum pour le template
  readonly StatutProposition = StatutProposition;

  propositions = signal<Proposition[]>([]);
  selectedProposition = signal<Proposition | null>(null);
  selectedFilter = signal<'all' | StatutProposition>('all');

  filteredPropositions = computed(() => {
    const filter = this.selectedFilter();
    const props = this.propositions();

    if (filter === 'all') {
      return props;
    }

    return props.filter(p => p.statut === filter);
  });

  ngOnInit() {
    this.loadPropositions();
  }

  loadPropositions() {
    this.propositionService.propositions$.subscribe({
      next: (propositions: Proposition[]) => {
        const publiques = propositions.filter(p => p.type === 'publique');
        this.propositions.set(publiques);
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erreur chargement propositions', err)
    });
  }

  setFilter(filter: 'all' | StatutProposition) {
    this.selectedFilter.set(filter);
  }

  selectProposition(proposition: Proposition) {
    this.selectedProposition.set(proposition);
  }

  closeSidebar() {
    this.selectedProposition.set(null);
  }

  postuler(propositionId: string) {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.propositionService.postuler(propositionId, userId).subscribe({
        next: () => {
          alert('Candidature envoyée avec succès !');
          this.loadPropositions();
          this.closeSidebar();
        },
        error: (err) => console.error('Erreur candidature', err)
      });
    }
  }

  getStatutColor(statut: StatutProposition): string {
    switch (statut) {
      case StatutProposition.EN_ATTENTE:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case StatutProposition.ACCEPTEE:
        return 'bg-green-100 text-green-800 border-green-300';
      case StatutProposition.REFUSEE:
        return 'bg-red-100 text-red-800 border-red-300';
      case StatutProposition.EXPIREE:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  getStatutLabel(statut: StatutProposition): string {
    switch (statut) {
      case StatutProposition.EN_ATTENTE:
        return 'En attente';
      case StatutProposition.ACCEPTEE:
        return 'Acceptée';
      case StatutProposition.REFUSEE:
        return 'Refusée';
      case StatutProposition.EXPIREE:
        return 'Expirée';
      default:
        return statut;
    }
  }

  isExpired(proposition: Proposition): boolean {
    return new Date(proposition.dateExpiration) < new Date();
  }

  hasApplied(proposition: Proposition): boolean {
    const userId = this.authService.currentUser()?.id;
    return proposition.candidatures?.some(c => c.formateurId === userId) || false;
  }

  getFilterCount(filter: 'all' | StatutProposition): number {
    if (filter === 'all') {
      return this.propositions().length;
    }
    return this.propositions().filter(p => p.statut === filter).length;
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
