export enum UserRole {
  FORMATEUR = 'formateur',
  ADMIN = 'admin'
}

export interface Competence {
  id: string;
  nom: string;
  niveau: 'debutant' | 'intermediaire' | 'expert';
}

export interface Document {
  id: string;
  nom: string;
  type: 'cv' | 'diplome' | 'kbis' | 'autre';
  url: string;
  uploadedAt: Date;
}

export interface Disponibilite {
  jour: string; // 'lundi', 'mardi', etc.
  heureDebut: string; // '08:00'
  heureFin: string; // '18:00'
}

export enum TypeAlerteIntervenant {
  ABSENCE_RECURRENTE = 'absence_recurrente',
  RETARD_FREQUENT = 'retard_frequent',
  EVALUATION_NEGATIVE = 'evaluation_negative',
  PROBLEME_COMPORTEMENT = 'probleme_comportement',
  DISPONIBILITE = 'disponibilite',
  DOCUMENT_MANQUANT = 'document_manquant',
  AUTRE = 'autre'
}

export interface AlerteIntervenant {
  id: string;
  type: TypeAlerteIntervenant;
  titre: string;
  description: string;
  createdAt: Date;
  createdBy: string; // userId de l'admin
  resolue: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: UserRole;
  avatar?: string;

  // Spécifique formateur
  competences?: Competence[];
  documents?: Document[];
  disponibilites?: Disponibilite[];
  adresse?: string;
  ville?: string;
  codePostal?: string;

  // Alertes intervenant
  alertes?: AlerteIntervenant[];

  // Statistiques
  nombreMissions?: number;
  nombreHeures?: number;
  noteGlobale?: number; // Moyenne des évaluations
  tarifHoraire?: number;

  createdAt: Date;
  updatedAt: Date;
}
