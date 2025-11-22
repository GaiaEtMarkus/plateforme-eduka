export enum StatutFacture {
  BROUILLON = 'brouillon',
  SOUMISE = 'soumise',
  VALIDEE = 'validee',
  PAYEE = 'payee',
  REFUSEE = 'refusee'
}

export interface LigneFacture {
  id: string;
  description: string;
  missionId?: string;
  quantite: number; // Nombre d'heures
  tauxHoraire: number;
  montant: number; // quantite * tauxHoraire
}

export interface Facture {
  id: string;
  numero: string; // 'FAC-2025-001'
  formateurId: string;
  formateurNom: string;

  // Lignes de facture
  lignes: LigneFacture[];

  // Montants
  sousTotal: number;
  taxe: number; // TVA
  total: number;

  // Dates
  dateEmission: Date;
  dateEcheance: Date;
  datePaiement?: Date;

  // Statut
  statut: StatutFacture;

  // Fichiers
  pdfUrl?: string;

  // Notes
  notes?: string;
  remarquesAdmin?: string;

  createdAt: Date;
  updatedAt: Date;
}
