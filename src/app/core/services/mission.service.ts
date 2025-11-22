import { Injectable, signal } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mission, Cours, Ecole } from '../models';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private missionsSubject = new BehaviorSubject<Mission[]>([]);
  private coursListSubject = new BehaviorSubject<Cours[]>([]);
  private ecolesListSubject = new BehaviorSubject<Ecole[]>([]);

  // Observables publiques
  missions$ = this.missionsSubject.asObservable();
  coursList$ = this.coursListSubject.asObservable();
  ecolesList$ = this.ecolesListSubject.asObservable();

  // Signal pour la mission sélectionnée (pour le détail dans la sidebar)
  selectedMission = signal<Mission | null>(null);

  constructor(private dataService: DataService) {
    this.loadMissions();
    this.loadCours();
    this.loadEcoles();
  }

  /**
   * Charge toutes les missions
   */
  private loadMissions(): void {
    this.dataService.loadJsonData<any[]>('missions').subscribe({
      next: (missions) => {
        // Enrichir les missions avec les données des cours et écoles
        this.enrichMissions(missions);
      },
      error: (err) => console.error('Erreur chargement missions', err)
    });
  }

  /**
   * Charge tous les cours
   */
  private loadCours(): void {
    this.dataService.loadJsonData<Cours[]>('cours').subscribe({
      next: (cours) => this.coursListSubject.next(cours),
      error: (err) => console.error('Erreur chargement cours', err)
    });
  }

  /**
   * Charge toutes les écoles
   */
  private loadEcoles(): void {
    this.dataService.loadJsonData<Ecole[]>('ecoles').subscribe({
      next: (ecoles) => this.ecolesListSubject.next(ecoles),
      error: (err) => console.error('Erreur chargement écoles', err)
    });
  }

  /**
   * Enrichit les missions avec les données complètes
   */
  private enrichMissions(missions: any[]): void {
    combineLatest([
      this.coursList$,
      this.ecolesList$,
      this.dataService.loadJsonData<any[]>('classes'),
      this.dataService.loadJsonData<any[]>('users')
    ]).subscribe({
      next: ([cours, ecoles, classes, users]) => {
        if (!cours.length || !ecoles.length || !classes.length || !users.length) {
          return;
        }

        const enrichedMissions = missions
          .map(m => ({
            ...m,
            cours: cours.find(c => c.id === m.coursId),
            ecole: ecoles.find(e => e.id === m.ecoleId),
            classe: classes.find(c => c.id === m.classeId),
            formateurNom: users.find((u: any) => u.id === m.formateurId)?.prenom + ' ' +
                          users.find((u: any) => u.id === m.formateurId)?.nom,
            dateDebut: new Date(m.dateDebut),
            dateFin: new Date(m.dateFin),
            createdAt: new Date(m.createdAt),
            updatedAt: new Date(m.updatedAt)
          }))
          .filter(m => m.cours && m.ecole && m.classe);

        this.missionsSubject.next(enrichedMissions as Mission[]);
      }
    });
  }

  /**
   * Récupère les missions d'un formateur
   */
  getMissionsByFormateur(formateurId: string): Observable<Mission[]> {
    return this.missions$.pipe(
      map(missions => missions.filter(m => m.formateurId === formateurId))
    );
  }

  /**
   * Récupère une mission par son ID
   */
  getMissionById(id: string): Observable<Mission | undefined> {
    return this.missions$.pipe(
      map(missions => missions.find(m => m.id === id))
    );
  }

  /**
   * Sélectionne une mission (pour affichage détail)
   */
  selectMission(mission: Mission | null): void {
    this.selectedMission.set(mission);
  }

  /**
   * Récupère les missions pour le calendrier (format pour la lib de calendrier)
   */
  getCalendarEvents(formateurId?: string): Observable<any[]> {
    const missions$ = formateurId
      ? this.getMissionsByFormateur(formateurId)
      : this.missions$;

    return missions$.pipe(
      map(missions => missions.map(m => ({
        id: m.id,
        title: m.cours?.nom || 'Cours',
        start: m.dateDebut,
        end: m.dateFin,
        backgroundColor: this.getColorByStatus(m.statut),
        extendedProps: {
          mission: m
        }
      })))
    );
  }

  /**
   * Couleur selon le statut
   */
  private getColorByStatus(statut: string): string {
    switch (statut) {
      case 'planifiee': return '#FF9966'; // Orange Eduka
      case 'en_cours': return '#3b82f6'; // Bleu
      case 'terminee': return '#10b981'; // Vert
      case 'annulee': return '#ef4444'; // Rouge
      default: return '#6b7280'; // Gris
    }
  }

  /**
   * Upload un fichier de notes
   */
  uploadFichierNotes(missionId: string, file: File): Observable<any> {
    // Simulation d'upload
    return new Observable(observer => {
      setTimeout(() => {
        const missions = this.missionsSubject.value;
        const mission = missions.find(m => m.id === missionId);

        if (mission) {
          mission.fichiersNotes.push({
            id: `file-${Date.now()}`,
            nom: file.name,
            url: `/uploads/${file.name}`,
            uploadedAt: new Date(),
            uploadedBy: 'current-user-id'
          });
          this.missionsSubject.next([...missions]);
        }

        observer.next({ success: true });
        observer.complete();
      }, 1000);
    });
  }
}
