import { Cours } from './cours.model';
import { Ecole, Classe } from './ecole.model';

export enum StatutMission {
  PLANIFIEE = 'planifiee',
  EN_COURS = 'en_cours',
  TERMINEE = 'terminee',
  ANNULEE = 'annulee'
}

export enum StatutSuiviMission {
  OK = 'ok',
  INTERVENANT_TROUVE = 'intervenant_trouve',
  EN_ATTENTE_INTERVENANT = 'en_attente_intervenant',
  PROBLEME_INTERVENANT = 'probleme_intervenant',
  RETARD = 'retard',
  ABSENCE_INTERVENANT = 'absence_intervenant',
  ANNULATION_DEMANDEE = 'annulation_demandee',
  AUTRE = 'autre'
}

export enum TypeAlerte {
  ABSENCE = 'absence',
  RETARD = 'retard',
  PROBLEME_TECHNIQUE = 'probleme_technique',
  ANNULATION = 'annulation',
  AUTRE = 'autre'
}

export interface Alerte {
  id: string;
  type: TypeAlerte;
  titre: string;
  description: string;
  createdAt: Date;
  createdBy: string; // userId
  resolue: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface FichierNote {
  id: string;
  nom: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string; // userId
}

export interface Mission {
  id: string;
  cours: Cours;
  ecole: Ecole;
  classe: Classe;

  // Dates et horaires
  dateDebut: Date;
  dateFin: Date;
  heureDebut: string; // '09:00'
  heureFin: string; // '12:00'

  // Formateur assigné
  formateurId: string;
  formateurNom?: string;

  // Statut et détails
  statut: StatutMission;
  fichiersNotes: FichierNote[];

  // Suivi admin
  statutSuivi?: StatutSuiviMission;
  alertes?: Alerte[];

  // QR Code pour évaluation
  qrCodeUrl?: string;
  evaluationUrl?: string;

  // Notes
  notes?: string;
  remarques?: string;

  createdAt: Date;
  updatedAt: Date;
}
