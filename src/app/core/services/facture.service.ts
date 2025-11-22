import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Facture, StatutFacture, LigneFacture } from '../models';
import { DataService } from './data.service';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private facturesSubject = new BehaviorSubject<Facture[]>([]);

  factures$ = this.facturesSubject.asObservable();

  constructor(private dataService: DataService) {
    this.loadFactures();
  }

  /**
   * Charge toutes les factures
   */
  private loadFactures(): void {
    this.dataService.loadJsonData<any[]>('factures').subscribe({
      next: (factures) => {
        const enrichedFactures = factures.map(f => ({
          ...f,
          dateEmission: new Date(f.dateEmission),
          dateEcheance: new Date(f.dateEcheance),
          datePaiement: f.datePaiement ? new Date(f.datePaiement) : undefined,
          createdAt: new Date(f.createdAt),
          updatedAt: new Date(f.updatedAt)
        }));
        this.facturesSubject.next(enrichedFactures as Facture[]);
      }
    });
  }

  /**
   * Récupère les factures d'un formateur
   */
  getFacturesByFormateur(formateurId: string): Observable<Facture[]> {
    return this.factures$.pipe(
      map(factures => factures
        .filter(f => f.formateurId === formateurId)
        .sort((a, b) => b.dateEmission.getTime() - a.dateEmission.getTime())
      )
    );
  }

  /**
   * Récupère les factures par statut
   */
  getFacturesByStatut(statut: StatutFacture): Observable<Facture[]> {
    return this.factures$.pipe(
      map(factures => factures.filter(f => f.statut === statut))
    );
  }

  /**
   * Récupère une facture par ID
   */
  getFactureById(id: string): Observable<Facture | undefined> {
    return this.factures$.pipe(
      map(factures => factures.find(f => f.id === id))
    );
  }

  /**
   * Créer une nouvelle facture
   */
  creerFacture(facture: Partial<Facture>): Observable<Facture> {
    return new Observable(observer => {
      setTimeout(() => {
        const factures = this.facturesSubject.value;
        const numero = `FAC-${new Date().getFullYear()}-${String(factures.length + 1).padStart(3, '0')}`;

        const newFacture: Facture = {
          id: `facture-${Date.now()}`,
          numero,
          statut: StatutFacture.BROUILLON,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...facture
        } as Facture;

        this.facturesSubject.next([...factures, newFacture]);

        observer.next(newFacture);
        observer.complete();
      }, 500);
    });
  }

  /**
   * Soumettre une facture
   */
  soumettreFacture(factureId: string): Observable<any> {
    return this.updateStatutFacture(factureId, StatutFacture.SOUMISE);
  }

  /**
   * Valider une facture (Admin)
   */
  validerFacture(factureId: string): Observable<any> {
    return this.updateStatutFacture(factureId, StatutFacture.VALIDEE);
  }

  /**
   * Marquer une facture comme payée (Admin)
   */
  payerFacture(factureId: string): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        const factures = this.facturesSubject.value;
        const facture = factures.find(f => f.id === factureId);

        if (facture) {
          facture.statut = StatutFacture.PAYEE;
          facture.datePaiement = new Date();
          facture.updatedAt = new Date();
          this.facturesSubject.next([...factures]);
        }

        observer.next({ success: true });
        observer.complete();
      }, 500);
    });
  }

  /**
   * Refuser une facture (Admin)
   */
  refuserFacture(factureId: string, remarques: string): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        const factures = this.facturesSubject.value;
        const facture = factures.find(f => f.id === factureId);

        if (facture) {
          facture.statut = StatutFacture.REFUSEE;
          facture.remarquesAdmin = remarques;
          facture.updatedAt = new Date();
          this.facturesSubject.next([...factures]);
        }

        observer.next({ success: true });
        observer.complete();
      }, 500);
    });
  }

  /**
   * Met à jour le statut d'une facture
   */
  private updateStatutFacture(factureId: string, statut: StatutFacture): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        const factures = this.facturesSubject.value;
        const facture = factures.find(f => f.id === factureId);

        if (facture) {
          facture.statut = statut;
          facture.updatedAt = new Date();
          this.facturesSubject.next([...factures]);
        }

        observer.next({ success: true });
        observer.complete();
      }, 500);
    });
  }

  /**
   * Générer un PDF de facture
   */
  genererPDF(facture: Facture): void {
    const doc = new jsPDF();

    // En-tête
    doc.setFontSize(20);
    doc.text('FACTURE', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`N° ${facture.numero}`, 105, 30, { align: 'center' });

    // Informations Eduka
    doc.setFontSize(10);
    doc.text('Eduka Formation', 20, 50);
    doc.text('25 Rue de l\'Innovation', 20, 55);
    doc.text('75001 Paris', 20, 60);

    // Informations formateur
    doc.text(`${facture.formateurNom}`, 120, 50);

    // Dates
    doc.text(`Date d'émission : ${facture.dateEmission.toLocaleDateString('fr-FR')}`, 20, 80);
    doc.text(`Date d'échéance : ${facture.dateEcheance.toLocaleDateString('fr-FR')}`, 20, 85);

    // Tableau des lignes
    let y = 110;
    doc.text('Description', 20, y);
    doc.text('Qté', 110, y);
    doc.text('Taux', 135, y);
    doc.text('Montant', 165, y);

    y += 7;
    doc.line(20, y, 190, y);
    y += 7;

    facture.lignes.forEach(ligne => {
      doc.text(ligne.description, 20, y);
      doc.text(ligne.quantite.toString(), 110, y);
      doc.text(`${ligne.tauxHoraire}€`, 135, y);
      doc.text(`${ligne.montant}€`, 165, y);
      y += 7;
    });

    y += 10;
    doc.line(20, y, 190, y);
    y += 7;

    // Totaux
    doc.text('Sous-total', 120, y);
    doc.text(`${facture.sousTotal}€`, 165, y);
    y += 7;

    doc.text(`TVA (20%)`, 120, y);
    doc.text(`${facture.taxe}€`, 165, y);
    y += 7;

    doc.setFontSize(12);
    doc.text('TOTAL', 120, y);
    doc.text(`${facture.total}€`, 165, y);

    // Télécharger
    doc.save(`${facture.numero}.pdf`);
  }

  /**
   * Calculer les totaux d'une facture
   */
  calculerTotaux(lignes: LigneFacture[]): { sousTotal: number; taxe: number; total: number } {
    const sousTotal = lignes.reduce((acc, ligne) => acc + ligne.montant, 0);
    const taxe = sousTotal * 0.2; // TVA 20%
    const total = sousTotal + taxe;

    return { sousTotal, taxe, total };
  }
}
