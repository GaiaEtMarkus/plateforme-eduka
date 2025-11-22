export interface Cours {
  id: string;
  nom: string;
  description: string;
  niveau: string; // 'primaire', 'collège', 'lycée', 'supérieur'
  matiere: string; // 'Mathématiques', 'Français', etc.
  syllabus?: string; // URL ou texte du syllabus
  dureeHeures: number;
  competencesRequises: string[];
}
