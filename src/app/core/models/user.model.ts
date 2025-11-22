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

  // Statistiques
  nombreMissions?: number;
  nombreHeures?: number;
  noteGlobale?: number; // Moyenne des évaluations
  tarifHoraire?: number;

  createdAt: Date;
  updatedAt: Date;
}
