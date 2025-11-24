import { Cours } from './cours.model';
import { Ecole, Classe } from './ecole.model';

export enum StatutProposition {
  EN_ATTENTE = 'en_attente',
  ACCEPTEE = 'acceptee',
  REFUSEE = 'refusee',
  EXPIREE = 'expiree'
}

export enum TypeProposition {
  PUBLIQUE = 'publique', // Visible par tous les formateurs
  DIRECTE = 'directe' // Envoyée directement à un formateur spécifique
}

export interface SessionProposition {
  numero: number;
  dateDebut: string; // Format: YYYY-MM-DD
  heureDebut: string; // Format: HH:mm
  heureFin: string; // Format: HH:mm
  duree: number; // Durée en heures
}

export interface Proposition {
  id: string;
  cours: Cours;
  ecole: Ecole;
  classe: Classe;

  // Dates et horaires - legacy (à supprimer progressivement)
  dateDebut?: Date;
  dateFin?: Date;
  heureDebut?: string;
  heureFin?: string;

  // Sessions multiples (nouvelle structure)
  sessions?: SessionProposition[];
  volumeHoraire?: number; // Volume horaire total du module

  // Type et statut
  type: TypeProposition;
  statut: StatutProposition;

  // Si proposition directe
  formateurCibleId?: string;

  // Candidatures (pour propositions publiques)
  candidatures?: Candidature[];

  // Description et détails
  description: string;
  remuneration: number;
  dateExpiration: Date;

  // École associée (obligatoire)
  ecoleId: string;

  // Commentaire admin (visible pour tous)
  commentaireAdmin?: string;

  // Métadonnées
  createdBy: string; // Admin userId
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidature {
  id: string;
  propositionId: string;
  formateurId: string;
  formateurNom: string;
  message?: string;
  statut: 'en_attente' | 'acceptee' | 'refusee';
  createdAt: Date;
}