export interface Ecole {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  telephone: string;
  email: string;
  responsable: string;
  logo?: string;
  siteWeb?: string;

  // Statistiques
  nombreMissionsEnCours?: number;
  nombreMissionsTotal?: number;
  chiffreAffaires?: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface Classe {
  id: string;
  nom: string;
  niveau: string; // 'CP', 'CE1', '6ème', 'Terminale', etc.
  nombreEleves: number;
  ecoleId: string;
}
