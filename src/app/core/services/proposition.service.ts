import { Injectable, signal } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Proposition, StatutProposition, Candidature } from '../models';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class PropositionService {
  private propositionsSubject = new BehaviorSubject<Proposition[]>([]);

  propositions$ = this.propositionsSubject.asObservable();
  selectedProposition = signal<Proposition | null>(null);

  constructor(private dataService: DataService) {
    this.loadPropositions();
  }

  /**
   * Charge toutes les propositions
   */
  private loadPropositions(): void {
    combineLatest([
      this.dataService.loadJsonData<any[]>('propositions'),
      this.dataService.loadJsonData<any[]>('cours'),
      this.dataService.loadJsonData<any[]>('ecoles'),
      this.dataService.loadJsonData<any[]>('classes')
    ]).subscribe({
      next: ([propositions, cours, ecoles, classes]) => {
        if (!cours.length || !ecoles.length || !classes.length) {
          return;
        }

        const enrichedPropositions = propositions
          .map(p => ({
            ...p,
            cours: cours.find((c: any) => c.id === p.coursId),
            ecole: ecoles.find((e: any) => e.id === p.ecoleId),
            classe: classes.find((c: any) => c.id === p.classeId),
            dateDebut: new Date(p.dateDebut),
            dateFin: new Date(p.dateFin),
            dateExpiration: new Date(p.dateExpiration),
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
            candidatures: p.candidatures || []
          }))
          .filter(p => p.cours && p.ecole && p.classe);

        this.propositionsSubject.next(enrichedPropositions as Proposition[]);
      }
    });
  }

  /**
   * Filtre les propositions par statut
   */
  getPropositionsByStatut(statut: StatutProposition): Observable<Proposition[]> {
    return this.propositions$.pipe(
      map(props => props.filter(p => p.statut === statut))
    );
  }

  /**
   * Récupère les propositions pour un formateur
   */
  getPropositionsForFormateur(formateurId: string): Observable<Proposition[]> {
    return this.propositions$.pipe(
      map(props => props.filter(p =>
        p.type === 'publique' || p.formateurCibleId === formateurId
      ))
    );
  }

  /**
   * Récupère les propositions avec candidatures pour un formateur
   */
  getPropositionsWithCandidature(formateurId: string): Observable<Proposition[]> {
    return this.propositions$.pipe(
      map(props => props.filter(p =>
        p.candidatures?.some(c => c.formateurId === formateurId)
      ))
    );
  }

  /**
   * Postuler à une proposition
   */
  postuler(propositionId: string, formateurId: string, message?: string): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        const propositions = this.propositionsSubject.value;
        const proposition = propositions.find(p => p.id === propositionId);

        if (proposition) {
          if (!proposition.candidatures) {
            proposition.candidatures = [];
          }

          const candidature: Candidature = {
            id: `cand-${Date.now()}`,
            propositionId,
            formateurId,
            formateurNom: 'Formateur', // À enrichir
            message,
            statut: 'en_attente',
            createdAt: new Date()
          };

          proposition.candidatures.push(candidature);
          this.propositionsSubject.next([...propositions]);
        }

        observer.next({ success: true });
        observer.complete();
      }, 500);
    });
  }

  /**
   * Accepter une proposition directe
   */
  accepterProposition(propositionId: string): Observable<any> {
    return this.updateStatutProposition(propositionId, StatutProposition.ACCEPTEE);
  }

  /**
   * Refuser une proposition
   */
  refuserProposition(propositionId: string): Observable<any> {
    return this.updateStatutProposition(propositionId, StatutProposition.REFUSEE);
  }

  /**
   * Met à jour le statut d'une proposition
   */
  private updateStatutProposition(propositionId: string, statut: StatutProposition): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        const propositions = this.propositionsSubject.value;
        const proposition = propositions.find(p => p.id === propositionId);

        if (proposition) {
          proposition.statut = statut;
          proposition.updatedAt = new Date();
          this.propositionsSubject.next([...propositions]);
        }

        observer.next({ success: true });
        observer.complete();
      }, 500);
    });
  }

  /**
   * Sélectionne une proposition
   */
  selectProposition(proposition: Proposition | null): void {
    this.selectedProposition.set(proposition);
  }

  /**
   * Créer une nouvelle proposition (Admin)
   */
  creerProposition(proposition: Partial<Proposition>): Observable<Proposition> {
    return new Observable(observer => {
      setTimeout(() => {
        const newProposition: Proposition = {
          id: `prop-${Date.now()}`,
          statut: StatutProposition.EN_ATTENTE,
          candidatures: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          ...proposition
        } as Proposition;

        const propositions = this.propositionsSubject.value;
        this.propositionsSubject.next([...propositions, newProposition]);

        observer.next(newProposition);
        observer.complete();
      }, 500);
    });
  }
}
