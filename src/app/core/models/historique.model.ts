export enum TypeActionHistorique {
  PROPOSITION_SOUMISE = 'proposition_soumise',
  PROPOSITION_ACCEPTEE = 'proposition_acceptee',
  PROPOSITION_REFUSEE = 'proposition_refusee',
  MISSION_CREEE = 'mission_creee',
  MISSION_TERMINEE = 'mission_terminee',
  MISSION_ANNULEE = 'mission_annulee',
  FACTURE_CREEE = 'facture_creee',
  FACTURE_SOUMISE = 'facture_soumise',
  FACTURE_VALIDEE = 'facture_validee',
  FACTURE_PAYEE = 'facture_payee',
  PROFIL_MODIFIE = 'profil_modifie',
  DOCUMENT_AJOUTE = 'document_ajoute',
  EVALUATION_RECUE = 'evaluation_recue'
}

export interface HistoriqueEntry {
  id: string;
  userId: string;
  type: TypeActionHistorique;
  description: string;
  metadata?: {
    propositionId?: string;
    missionId?: string;
    factureId?: string;
    [key: string]: any;
  };
  createdAt: Date;
}