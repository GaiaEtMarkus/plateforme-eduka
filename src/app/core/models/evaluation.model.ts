export interface QuestionEvaluation {
  id: string;
  question: string;
  type: 'note' | 'texte' | 'choix_multiple';
  options?: string[]; // Pour choix_multiple
  obligatoire: boolean;
}

export interface ReponseEvaluation {
  questionId: string;
  reponse: string | number;
}

export interface Evaluation {
  id: string;
  missionId: string;
  formateurId: string;
  classeId: string;

  // Questions et réponses
  questions: QuestionEvaluation[];
  reponses: ReponseEvaluation[];

  // Note globale (moyenne des notes)
  noteGlobale: number; // Sur 5 ou 10

  // Commentaires libres des étudiants
  commentaires: string[];

  // Métadonnées
  nombreRepondants: number;
  dateDebut: Date;
  dateFin?: Date;

  createdAt: Date;
}

export const QUESTIONS_EVALUATION_DEFAULT: QuestionEvaluation[] = [
  {
    id: '1',
    question: 'Comment évaluez-vous la clarté des explications du formateur ?',
    type: 'note',
    obligatoire: true
  },
  {
    id: '2',
    question: 'Le formateur était-il disponible pour répondre à vos questions ?',
    type: 'note',
    obligatoire: true
  },
  {
    id: '3',
    question: 'Le cours était-il intéressant et engageant ?',
    type: 'note',
    obligatoire: true
  },
  {
    id: '4',
    question: 'Recommanderiez-vous ce formateur ?',
    type: 'note',
    obligatoire: true
  },
  {
    id: '5',
    question: 'Commentaires ou suggestions d\'amélioration',
    type: 'texte',
    obligatoire: false
  }
];