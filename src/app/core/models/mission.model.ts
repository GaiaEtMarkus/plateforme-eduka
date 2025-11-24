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
  PROBLEME_ECOLE = 'probleme_ecole',
  PROBLEME_ELEVE = 'probleme_eleve',
  ANNULATION = 'annulation',
  AUTRE = 'autre'
}

export enum TypeIncident {
  RETARD = 'retard',
  ABSENCE = 'absence',
  PROBLEME_ECOLE = 'probleme_ecole',
  PROBLEME_ELEVE = 'probleme_eleve',
  AUTRE = 'autre'
}

export interface Incident {
  id: string;
  type: TypeIncident;
  description: string;
  createdAt: Date;
  createdBy: string; // userId du formateur
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

export interface SessionMission {
  numero: number;
  dateDebut: string; // Format: YYYY-MM-DD
  heureDebut: string; // Format: HH:mm
  heureFin: string; // Format: HH:mm
  duree: number; // Durée en heures
  effectuee?: boolean; // La session a-t-elle été effectuée?
  presenceConfirmee?: boolean;
}

export interface Mission {
  id: string;
  cours: Cours;
  ecole: Ecole;
  classe: Classe;

  // Dates et horaires - legacy (à supprimer progressivement)
  dateDebut?: Date;
  dateFin?: Date;
  heureDebut?: string; // '09:00'
  heureFin?: string; // '12:00'

  // Sessions multiples (nouvelle structure)
  sessions?: SessionMission[];
  volumeHoraire?: number; // Volume horaire total du module

  // Formateur assigné
  formateurId: string;
  formateurNom?: string;

  // Statut et détails
  statut: StatutMission;
  fichiersNotes: FichierNote[];

  // Suivi admin
  statutSuivi?: StatutSuiviMission;
  alertes?: Alerte[];

  // Suivi formateur - Démarrage mission
  missionDemarree?: boolean;
  dateDemarrage?: Date;
  incidents?: Incident[];

  // QR Code pour évaluation
  qrCodeUrl?: string;
  evaluationUrl?: string;

  // Notes
  notes?: string;
  remarques?: string;

  createdAt: Date;
  updatedAt: Date;
}
