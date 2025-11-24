export enum TypeNotification {
  NOUVELLE_PROPOSITION = 'nouvelle_proposition',
  PROPOSITION_ACCEPTEE = 'proposition_acceptee',
  PROPOSITION_REFUSEE = 'proposition_refusee',
  MISSION_CONFIRMEE = 'mission_confirmee',
  MISSION_ANNULEE = 'mission_annulee',
  MISSION_RAPPEL = 'mission_rappel',
  MISSION_DEMARREE = 'mission_demarree',
  INCIDENT_SIGNALE = 'incident_signale',
  FACTURE_VALIDEE = 'facture_validee',
  FACTURE_PAYEE = 'facture_payee',
  FACTURE_REFUSEE = 'facture_refusee',
  MESSAGE_ADMIN = 'message_admin',
  EVALUATION_RECUE = 'evaluation_recue'
}

export interface Notification {
  id: string;
  userId: string;
  type: TypeNotification;
  titre: string;
  message: string;
  lien?: string; // URL vers la ressource concernée
  lu: boolean;
  createdAt: Date;

  // Données additionnelles
  metadata?: {
    propositionId?: string;
    missionId?: string;
    factureId?: string;
    [key: string]: any;
  };
}